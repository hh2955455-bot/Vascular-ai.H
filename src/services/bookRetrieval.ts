import { ReferenceDocument, DocumentChunk } from '../types';
import { normalizeSearchText } from './bookSearchService';

/**
 * Whole-book retrieval for the AI tutor.
 *
 * Every chunk of every selected book is scored (BM25 + phrase matching), so the answer can come
 * from ANY page of the book, not just the first few matches. Arabic questions are supported by
 * adding English search terms (see expandQueryTerms) because most medical books are English.
 */

const STOP_WORDS = new Set([
  // English
  'what', 'is', 'the', 'are', 'was', 'were', 'how', 'to', 'for', 'a', 'an', 'in', 'on', 'at', 'by',
  'with', 'from', 'about', 'can', 'you', 'tell', 'me', 'explain', 'give', 'does', 'do', 'did',
  'which', 'when', 'where', 'why', 'who', 'should', 'would', 'could', 'please', 'of', 'and', 'or',
  'as', 'if', 'into', 'than', 'this', 'that', 'it', 'its', 'be', 'been', 'being', 'has', 'have',
  'had', 'chapter', 'chapters', 'section', 'summarize', 'summary', 'not', 'no', 'there', 'their', 'these', 'those', 'also', 'such', 'any', 'all', 'more',
  // Arabic (already normalized form: no tashkeel, alef/yaa/taa-marbuta unified)
  'ما', 'ماذا', 'هو', 'هي', 'هل', 'كيف', 'في', 'من', 'عن', 'علي', 'الي', 'مع', 'هذا', 'هذه',
  'فصل', 'الفصل', 'لخص', 'ملخص', 'ذلك', 'تلك', 'كان', 'يكون', 'اشرح', 'وضح', 'اذكر', 'بين', 'اعطني', 'لو', 'او', 'ان', 'انه',
  'التي', 'الذي', 'الذين', 'عند', 'كل', 'بعض', 'ثم', 'قبل', 'بعد', 'لماذا', 'متي', 'اين', 'ايه',
  'اي', 'دي', 'ده', 'الكتاب', 'كتاب', 'قولي', 'عايز', 'عاوز', 'ممكن', 'لي',
]);

const ARABIC_RE = /[؀-ۿ]/;

export function containsArabic(text: string): boolean {
  return ARABIC_RE.test(text);
}

function stem(word: string): string {
  if (ARABIC_RE.test(word)) {
    let w = word;
    for (const prefix of ['وال', 'بال', 'كال', 'فال', 'لل', 'ال']) {
      if (w.startsWith(prefix) && w.length - prefix.length >= 3) {
        w = w.slice(prefix.length);
        break;
      }
    }
    return w;
  }
  let w = word;
  if (w.length > 5 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith('es')) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  return w;
}

export function tokenizeForRetrieval(text: string): string[] {
  const norm = normalizeSearchText(text);
  if (!norm) return [];
  return norm
    .split(' ')
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
    .map(stem);
}

interface IndexedChunk {
  tf: Map<string, number>;
  len: number;
}

interface BookIndex {
  chunks: IndexedChunk[];
  df: Map<string, number>;
  avgLen: number;
}

const indexCache = new Map<string, BookIndex>();
const INDEX_CACHE_MAX = 6;

function buildIndex(doc: ReferenceDocument): BookIndex {
  const key = `${doc.id}:${doc.chunks.length}`;
  const cached = indexCache.get(key);
  if (cached) return cached;

  const df = new Map<string, number>();
  const chunks: IndexedChunk[] = [];
  let totalLen = 0;

  for (const c of doc.chunks) {
    const tokens = tokenizeForRetrieval(`${c.chapter || ''} ${c.section || ''} ${c.content || ''} ${c.contentAr || ''}`);
    const terms: string[] = [...tokens];
    // Adjacent word pairs make multi-word medical phrases ("limb ischemia") count more
    for (let i = 0; i < tokens.length - 1; i++) terms.push(`${tokens[i]}_${tokens[i + 1]}`);

    const tf = new Map<string, number>();
    for (const t of terms) tf.set(t, (tf.get(t) || 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1);
    chunks.push({ tf, len: tokens.length });
    totalLen += tokens.length;
  }

  const index: BookIndex = { chunks, df, avgLen: totalLen / Math.max(1, chunks.length) };
  if (indexCache.size >= INDEX_CACHE_MAX) {
    const oldest = indexCache.keys().next().value;
    if (oldest !== undefined) indexCache.delete(oldest);
  }
  indexCache.set(key, index);
  return index;
}

export interface RetrievalOptions {
  /** Extra search terms (e.g. English translation of an Arabic question). Weighted lower. */
  expandedTerms?: string[];
  maxChunks?: number;
  /** Hard cap on total characters sent to the model. */
  maxChars?: number;
}

export interface RetrievalResult {
  chunks: DocumentChunk[];
  /** Short table of contents of the books that were searched, for "which chapters..." questions. */
  outline: string;
  totalChunksSearched: number;
  topScore: number;
}

const K1 = 1.5;
const B = 0.75;

function chapterNumberFromQuery(query: string): number | null {
  const m = query.match(/(?:chapter|ch\.?|section|part|فصل|الفصل|الباب|باب)\s*0*(\d{1,3})\b/i);
  return m ? parseInt(m[1], 10) : null;
}

function wantsOverview(query: string): boolean {
  return /(summar|overview|outline|whole book|entire book|table of contents|ملخص|لخص|تلخيص|خلاصة|نظرة عامة|محتويات|فهرس|الكتاب كامل|الكتاب كله)/i.test(query);
}

export function retrieveBookContext(
  query: string,
  docs: ReferenceDocument[],
  options: RetrievalOptions = {}
): RetrievalResult {
  const { expandedTerms = [], maxChunks = 16, maxChars = 90000 } = options;

  const qTokens = tokenizeForRetrieval(query);
  const qBigrams: string[] = [];
  for (let i = 0; i < qTokens.length - 1; i++) qBigrams.push(`${qTokens[i]}_${qTokens[i + 1]}`);
  const extraTokens = expandedTerms.flatMap(t => tokenizeForRetrieval(t));
  const extraBigrams: string[] = [];
  for (const phrase of expandedTerms) {
    const toks = tokenizeForRetrieval(phrase);
    for (let i = 0; i < toks.length - 1; i++) extraBigrams.push(`${toks[i]}_${toks[i + 1]}`);
  }

  const weighted = new Map<string, number>();
  const addTerm = (t: string, w: number) => weighted.set(t, Math.max(weighted.get(t) || 0, w));
  qTokens.forEach(t => addTerm(t, 1));
  qBigrams.forEach(t => addTerm(t, 1.6));
  extraTokens.forEach(t => addTerm(t, 0.7));
  extraBigrams.forEach(t => addTerm(t, 1.1));

  interface Scored { docIdx: number; chunkIdx: number; score: number }
  const scored: Scored[] = [];
  let totalChunksSearched = 0;

  docs.forEach((doc, docIdx) => {
    if (!doc.chunks || doc.chunks.length === 0) return;
    const index = buildIndex(doc);
    const N = index.chunks.length;
    totalChunksSearched += N;

    index.chunks.forEach((ic, chunkIdx) => {
      let score = 0;
      for (const [term, w] of weighted) {
        const f = ic.tf.get(term);
        if (!f) continue;
        const n = index.df.get(term) || 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        score += w * idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (ic.len / Math.max(1, index.avgLen)))));
      }
      if (score > 0) scored.push({ docIdx, chunkIdx, score });
    });
  });

  scored.sort((a, b) => b.score - a.score);
  const topScore = scored[0]?.score || 0;
  // Keep only passages that are reasonably close to the best one
  const picked = scored.filter(s => s.score >= topScore * 0.25).slice(0, maxChunks);

  const selected = new Map<string, Scored>();
  const keyOf = (d: number, c: number) => `${d}:${c}`;
  picked.forEach(p => selected.set(keyOf(p.docIdx, p.chunkIdx), p));

  // Neighbouring passages of the 3 best hits: answers often continue on the next page
  picked.slice(0, 3).forEach(p => {
    const doc = docs[p.docIdx];
    for (const n of [p.chunkIdx - 1, p.chunkIdx + 1]) {
      if (n >= 0 && n < doc.chunks.length && !selected.has(keyOf(p.docIdx, n))) {
        selected.set(keyOf(p.docIdx, n), { docIdx: p.docIdx, chunkIdx: n, score: p.score * 0.3 });
      }
    }
  });

  // "Chapter 5" / "summarize the book" style questions: pull passages by structure
  const chapterNum = chapterNumberFromQuery(query);
  const overview = wantsOverview(query);
  if (chapterNum !== null || overview) {
    docs.forEach((doc, docIdx) => {
      if (!doc.chunks || doc.chunks.length === 0) return;
      if (chapterNum !== null) {
        const re = new RegExp(`(?:chapter|section|part|فصل|الفصل|الباب)\\s*0*${chapterNum}\\b`, 'i');
        const idxs = doc.chunks.map((c, i) => (re.test(c.chapter || '') ? i : -1)).filter(i => i >= 0);
        const step = Math.max(1, Math.ceil(idxs.length / 8));
        for (let i = 0; i < idxs.length; i += step) {
          selected.set(keyOf(docIdx, idxs[i]), { docIdx, chunkIdx: idxs[i], score: 1 });
        }
      }
      if (overview) {
        const seen = new Set<string>();
        doc.chunks.forEach((c, i) => {
          const ch = c.chapter || '';
          if (!seen.has(ch) && seen.size < 30) {
            seen.add(ch);
            selected.set(keyOf(docIdx, i), { docIdx, chunkIdx: i, score: 1 });
          }
        });
      }
    });
  }

  // Order as in the books (so the model reads them in sequence), then respect the size cap
  const ordered = [...selected.values()].sort((a, b) => a.docIdx - b.docIdx || a.chunkIdx - b.chunkIdx);
  const strongestFirst = [...ordered].sort((a, b) => b.score - a.score);
  const keep = new Set<string>();
  let chars = 0;
  for (const s of strongestFirst) {
    const len = (docs[s.docIdx].chunks[s.chunkIdx].content || '').length;
    if (chars + len > maxChars && keep.size > 0) continue;
    keep.add(keyOf(s.docIdx, s.chunkIdx));
    chars += len;
  }
  const chunks = ordered
    .filter(s => keep.has(keyOf(s.docIdx, s.chunkIdx)))
    .map(s => docs[s.docIdx].chunks[s.chunkIdx]);

  // Table of contents for the books that contributed passages
  const usedDocIdx = new Set(ordered.filter(s => keep.has(keyOf(s.docIdx, s.chunkIdx))).map(s => s.docIdx));
  let outline = '';
  usedDocIdx.forEach(docIdx => {
    const doc = docs[docIdx];
    if (!doc.chapters || doc.chapters.length === 0) return;
    const lines = doc.chapters
      .slice(0, 120)
      .map(c => `- ${c.title} (pp. ${c.pageStart}-${c.pageEnd})`);
    outline += `\nBook: ${doc.title} (${doc.totalPages} pages)\n${lines.join('\n')}\n`;
  });
  if (outline.length > 5000) outline = outline.slice(0, 5000) + '\n...';

  return { chunks, outline, totalChunksSearched, topScore };
}

/**
 * Asks the AI for English search terms that would appear in a book passage answering the
 * question. This is what lets an Arabic question find an English textbook page.
 * Returns [] on any failure (retrieval still works with the original words).
 */
export async function expandQueryTerms(query: string): Promise<string[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        jsonMode: true,
        prompt:
          'A student asks a question about a medical textbook. Return JSON {"terms": [...]} with up to 12 short ENGLISH ' +
          'search keywords or phrases (translate Arabic; include synonyms and standard abbreviations) that would appear in ' +
          'the textbook passage answering it. No explanations.\nQuestion: ' + query.slice(0, 600),
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const parsed = JSON.parse(String(data.text || '{}'));
    return Array.isArray(parsed.terms)
      ? parsed.terms.filter((t: unknown): t is string => typeof t === 'string').slice(0, 12)
      : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
