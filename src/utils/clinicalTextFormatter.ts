/**
 * Clinical Text Formatter & Cleaner
 * Replaces exaggerated asterisks (stars) and excessive quotation marks
 * with contextually appropriate medical emojis and clean typography.
 * Preserves essential quotes (such as official guideline quotes and not-found messages).
 * Repairs corrupted or encoded characters (mojibake, CID font codes, broken ligatures, OCR errors)
 * to always output clean, proper, readable English text (or original language).
 */

export const NOT_FOUND_MSG = 'عذراً، الإجابة غير موجودة في الكتب المرفوعة.';

/**
 * Repairs corrupted, encoded, or OCR-scrambled characters:
 * - Mojibake / encoding errors (e.g. â€™, â€œ, Ã©)
 * - PDF unmapped CID artifacts (cid:...)
 * - Unicode replacement characters and control characters
 * - Unicode typographic ligatures (fi, fl, ffi, etc.)
 * - Broken hyphenated line breaks from scanned books (vascu- \nlar -> vascular)
 * - Common OCR letter/digit misrecognitions in medical English context
 */
export function repairCorruptedCharacters(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Remove non-printable control codes (except \n, \r, \t)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Remove Unicode replacement character \uFFFD
  text = text.replace(/\uFFFD/g, '');

  // 3. Remove unmapped PDF glyph codes like (cid:12), (cid:134)
  text = text.replace(/\(cid:\d+\)/gi, '');

  // 4. Decode common UTF-8 mojibake / double-encoded sequences
  const mojibakeMap: [RegExp, string][] = [
    [/â€™/g, "'"],
    [/â€˜/g, "'"],
    [/â€œ/g, '"'],
    [/â€/g, '"'],
    [/â€“/g, '–'],
    [/â€”/g, '—'],
    [/â€¦/g, '...'],
    [/Ã©/g, 'é'],
    [/Ã¨/g, 'è'],
    [/Ã /g, 'à'],
    [/Ã¢/g, 'â'],
    [/Ã®/g, 'î'],
    [/Ã¯/g, 'ï'],
    [/Ã§/g, 'ç'],
    [/Ã±/g, 'ñ'],
    [/Ã¼/g, 'ü'],
    [/Ã¶/g, 'ö'],
    [/Ã¤/g, 'ä'],
    [/Â°/g, '°'],
    [/Â±/g, '±'],
    [/Âµ/g, 'µ'],
    [/Â·/g, '·'],
    [/Â/g, ''],
  ];

  for (const [pattern, replacement] of mojibakeMap) {
    text = text.replace(pattern, replacement);
  }

  // 5. Expand Unicode typographic ligatures into standard ASCII characters
  const ligatureMap: [RegExp, string][] = [
    [/\uFB00/g, 'ff'],
    [/\uFB01/g, 'fi'],
    [/\uFB02/g, 'fl'],
    [/\uFB03/g, 'ffi'],
    [/\uFB04/g, 'ffl'],
    [/\uFB05/g, 'ft'],
    [/\uFB06/g, 'st'],
    [/\u00A0/g, ' '], // non-breaking space
    [/\u200B|\u200C|\u200D|\uFEFF/g, ''], // zero-width characters
  ];

  for (const [pattern, replacement] of ligatureMap) {
    text = text.replace(pattern, replacement);
  }

  // 6. Fix broken OCR hyphenated line wraps (e.g. "vascu-\nlar" -> "vascular")
  text = text.replace(/([a-zA-Z]{2,})-\s*\n\s*([a-zA-Z]{2,})/g, '$1$2');

  // 7. Contextual OCR correction for common medical English misreadings
  const ocrCorrections: [RegExp, string][] = [
    [/\bc1inical\b/gi, 'clinical'],
    [/\b0perative\b/gi, 'operative'],
    [/\b0xygen\b/gi, 'oxygen'],
    [/\b1schemia\b/gi, 'ischemia'],
    [/\brnajor\b/gi, 'major'],
    [/\bfollovving\b/gi, 'following'],
    [/\bclecrease\b/gi, 'decrease'],
    [/\bincreasecl\b/gi, 'increased'],
    [/\bpat1ent\b/gi, 'patient'],
    [/\bpat1ents\b/gi, 'patients'],
    [/\bvascu1ar\b/gi, 'vascular'],
    [/\bhepar1n\b/gi, 'heparin'],
    [/\bthrombos1s\b/gi, 'thrombosis'],
    [/\bemb0lism\b/gi, 'embolism'],
    [/\baneurysrn\b/gi, 'aneurysm'],
  ];

  for (const [pattern, replacement] of ocrCorrections) {
    text = text.replace(pattern, replacement);
  }

  // 8. Normalize multiple spaces and fix weird punctuation spacing
  text = text.replace(/[ \t]{2,}/g, ' ');
  text = text.replace(/\s+([,.:;?!])/g, '$1');

  return text;
}

/**
 * Replaces exaggerated stars and quotation marks with intuitive clinical emojis
 * and removes excessive quotes around ordinary medical terminology.
 * Cleans all corrupted characters to ensure proper, readable English or Arabic output.
 */
export function formatAndCleanClinicalText(rawText: string): string {
  if (!rawText) return '';

  // If it's the exact strict not-found message, keep it pristine
  if (rawText.trim() === NOT_FOUND_MSG || rawText.trim() === `"${NOT_FOUND_MSG}"`) {
    return NOT_FOUND_MSG;
  }

  // First repair any corrupted or encoded characters
  let text = repairCorruptedCharacters(rawText);

  // 1. Remove repeated empty quotes like "" or """"
  text = text.replace(/""+/g, '');
  text = text.replace(/«\s*»/g, '');

  // 2. Remove horizontal lines made of asterisks (e.g., *** or *****)
  text = text.replace(/^\s*\*{3,}\s*$/gm, '──────────');
  text = text.replace(/\*{4,}/g, '');

  // 3. Transform markdown section headers containing asterisks into clean emoji-prefixed headers
  const headerReplacements: [RegExp, string][] = [
    // Arabic clinical sections
    [/\*\*?(?:1\.\s*)?(?:شرح المرض كامل|المرض|التعريف|الفسيولوجيا المرضية|الفيزيولوجيا المرضية|تعريف المرض)[^:*]*\*\*?:?/gi, '🫀 تعريف المرض والفيزيولوجيا المرضية:'],
    [/\*\*?(?:2\.\s*)?(?:شرح الأعراض والعلامات|الأعراض السريرية|العلامات والأعراض|الأعراض|فحص المريض)[^:*]*\*\*?:?/gi, '🩺 الأعراض السريرية وبروتوكول الفحص السريري:'],
    [/\*\*?(?:3\.\s*)?(?:طرق الفحص والتحاليل|الفحوصات والتحاليل|التحاليل|الأشعات|الفحوصات المخبرية)[^:*]*\*\*?:?/gi, '🔬 الفحوصات المخبرية والتصوير الشعاعي (Duplex & CTA):'],
    [/\*\*?(?:4\.\s*)?(?:شرح العلاج|العلاج الدوائي|الجرعات الدوائية|بروتوكول العلاج|الأدوية)[^:*]*\*\*?:?/gi, '💊 بروتوكول العلاج الدوائي بجرعاته الدقيقة:'],
    [/\*\*?(?:5\.\s*)?(?:العمليات الجراحية|التدخل الجراحي|خطوات العملية|الجراحة والقسطرة)[^:*]*\*\*?:?/gi, '🔪 التدخل الجراحي والخطوات الإجرائية بالتفصيل:'],
    [/\*\*?(?:الآثار الجانبية|التحذيرات وموانع الاستعمال|المحاذير|المضاعفات المحتملة)\*\*?:?/gi, '⚠️ الآثار الجانبية وموانع الاستعمال والمضاعفات:'],
    [/\*\*?(?:لآلئ جراحية|لؤلؤة جراحية|Surgical Pearls?)\*\*?:?/gi, '💎 لآلئ جراحية دقيقة (Surgical Pearls):'],
    [/\*\*?(?:شروحات الفيديو|فيديوهات العمليات|روابط الفيديو|فيديو)\*\*?:?/gi, '🎥 شروحات الفيديو والمصادر الموثقة (YouTube & EJVES):'],
    [/\*\*?(?:المراجع الطبية|المراجع المعتمدة|Citations?)\*\*?:?/gi, '📚 المراجع الطبية المعتمدة:'],
    [/\*\*?(?:الخلاصة السريرية|التوصيات|الخلاصة)\*\*?:?/gi, '📋 الخلاصة والتوصيات السريرية:'],

    // English clinical sections
    [/\*\*?(?:1\.\s*)?(?:Disease Overview|Pathophysiology & Classification|Definition)[^:*]*\*\*?:?/gi, '🫀 Disease Overview & Pathophysiology:'],
    [/\*\*?(?:2\.\s*)?(?:Symptoms & Bedside|Clinical Presentation|Cardinal Signs)[^:*]*\*\*?:?/gi, '🩺 Clinical Presentation & Bedside Physical Exam:'],
    [/\*\*?(?:3\.\s*)?(?:Diagnostic Workup|Labs|Duplex Criteria|Imaging)[^:*]*\*\*?:?/gi, '🔬 Diagnostic Workup (Labs, Duplex & CTA Imaging):'],
    [/\*\*?(?:4\.\s*)?(?:Medical Pharmacotherapy|Exact Dosages|Pharmacology|Drugs)[^:*]*\*\*?:?/gi, '💊 Medical Pharmacotherapy & Exact Dosages:'],
    [/\*\*?(?:5\.\s*)?(?:Surgical & Endovascular|Operative Steps|Surgical Procedures)[^:*]*\*\*?:?/gi, '🔪 Step-by-Step Surgical & Endovascular Procedures:'],
    [/\*\*?(?:Adverse Effects|Contraindications|Complications)[^:*]*\*\*?:?/gi, '⚠️ Adverse Side Effects & Contraindications:'],
    [/\*\*?(?:Key Surgical Pearls|Surgical Pearls?)[^:*]*\*\*?:?/gi, '💎 Key Surgical Pearls & Technical Landmarks:'],
    [/\*\*?(?:Verified Operative Videos|Operative Videos|Videos? Links?)[^:*]*\*\*?:?/gi, '🎥 Verified Operative Videos & Media Links:'],
    [/\*\*?(?:Verifiable Citations|References|Guideline Sources)[^:*]*\*\*?:?/gi, '📚 Verifiable Guideline Citations:']
  ];

  for (const [pattern, replacement] of headerReplacements) {
    text = text.replace(pattern, replacement);
  }

  // 4. Clean exaggerated asterisks on bullet points:
  // replace "* " or "- **term**:" with clean bullets
  text = text.replace(/^\s*\*\s+/gm, '• ');
  text = text.replace(/^\s*-\s*\*\*([^*]+)\*\*:\s*/gm, '🔹 $1: ');

  // 5. Clean remaining inline double-stars around short phrases or single words (replacing exaggerated asterisks)
  // e.g. **Heparin** -> Heparin, **الجرعة:** -> الجرعة:
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');

  // 6. Clean isolated single asterisks wrapping words like *word*
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1');

  // 7. Clean excessive quotation marks around single medical terms (like "Heparin", "Acute Limb Ischemia", "الهيبارين")
  // Only keep quotes when it's a long sentence / direct quote or the exact strict not-found message
  text = text.replace(/"([A-Za-z0-9\u0600-\u06FF\s]{1,30})"/g, (match, inner) => {
    // If it's a known formal quote like our not-found message, keep quotes
    if (inner.includes('عذراً، الإجابة غير موجودة')) {
      return `"${inner}"`;
    }
    // Remove unnecessary decorative quotes around single medical terms
    return inner;
  });

  // Arabic quotation marks « » around isolated terms
  text = text.replace(/«([A-Za-z0-9\u0600-\u06FF\s]{1,30})»/g, (match, inner) => {
    if (inner.includes('عذراً، الإجابة غير موجودة')) {
      return `"${inner}"`;
    }
    return inner;
  });

  return text.trim();
}
