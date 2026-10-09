import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SearchResultItem, ReferenceDocument } from '../types';
import { searchMedicalWeb, WebSearchResult } from '../services/aiService';
import { searchInsideBooks, normalizeSearchText, escapeRegExp, BookSearchResult } from '../services/bookSearchService';
import {
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  HeartPulse,
  Activity,
  Columns,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Globe,
  Library,
  RotateCw,
  Share2,
  ArrowDown,
  ArrowUp,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    references,
    notes,
    flashcards,
    mcqs,
    searchInitialQuery,
    setSearchInitialQuery,
    setTutorInitialPrompt,
    setActiveTab,
    setSelectedDocForReader,
    setIsBooksCatalogOpen,
    addNote,
    languageMode,
    showNotification
  } = useApp();

  const isAr = languageMode === 'ar';

  const [query, setQuery] = useState(searchInitialQuery || 'Acute limb ischemia');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('all');
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonTopic, setComparisonTopic] = useState<'ali' | 'aaa' | 'carotid'>('ali');

  // Search Bar Position: 'bottom' or 'top'
  const [searchPosition, setSearchPosition] = useState<'bottom' | 'top'>('bottom');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const topInputRef = useRef<HTMLInputElement>(null);
  const bottomInputRef = useRef<HTMLInputElement>(null);

  // Live Web Search State
  const [webEvidence, setWebEvidence] = useState<WebSearchResult | null>(null);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [includeWebSearch, setIncludeWebSearch] = useState(true);

  // Trigger web search when query changes (with debounce)
  useEffect(() => {
    if (searchInitialQuery) {
      setQuery(searchInitialQuery);
      setSearchInitialQuery(null);
    }
  }, [searchInitialQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 3 || !includeWebSearch) {
      if (!trimmed || !includeWebSearch) setWebEvidence(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingWeb(true);
      try {
        const result = await searchMedicalWeb(trimmed, languageMode);
        setWebEvidence(result);
      } catch (err) {
        console.warn('Web search error:', err);
      } finally {
        setIsSearchingWeb(false);
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [query, includeWebSearch, languageMode]);

  // Safe Highlight Helper for Search Matches
  const renderHighlighted = (text: string, queryStr: string) => {
    const q = queryStr.trim();
    if (!q || !text) return text;
    try {
      const tokens = q.split(' ').filter(t => t.length > 1).map(escapeRegExp);
      if (tokens.length === 0) return text;
      const regex = new RegExp(`(${tokens.join('|')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-teal-500/35 text-teal-200 px-0.5 rounded font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  // High-performance search inside Books & Guidelines with Arabic normalization and scoring
  const bookSearchResults = useMemo(() => {
    return searchInsideBooks(query, references, selectedBookFilter);
  }, [query, references, selectedBookFilter]);

  // Aggregate searchable items across Books, Notes, Flashcards, MCQs with normalization
  const allSearchItems: SearchResultItem[] = useMemo(() => {
    // 1. Chunks & chapters from Books
    const bookItems: SearchResultItem[] = bookSearchResults.map(hit => ({
      id: hit.id,
      type: 'reference' as const,
      title: hit.sectionTitle,
      sourceName: hit.documentTitle,
      chapterOrCategory: `Chapter ${hit.chapterNumber}: ${hit.chapterTitle}`,
      page: hit.pageNumber,
      excerptEn: hit.contentEn,
      excerptAr: hit.contentAr,
      relevanceScore: hit.relevanceScore,
      contentToPass: hit.contentEn
    }));

    // If query is empty, pre-populate default sample items from all references
    const defaultBookItems = !query.trim()
      ? references.flatMap(doc =>
          doc.chunks.map(chunk => ({
            id: 'ref-' + chunk.chunk_id,
            type: 'reference' as const,
            title: chunk.section,
            sourceName: doc.title,
            chapterOrCategory: `Chapter: ${chunk.chapter}`,
            page: chunk.page_number,
            excerptEn: chunk.content,
            excerptAr: chunk.contentAr,
            relevanceScore: 95,
            contentToPass: chunk.content
          }))
        )
      : [];

    const normQ = normalizeSearchText(query.trim());

    // 2. Medical Notes
    const noteItems = notes
      .filter(n => {
        if (!normQ) return true;
        const norm = normalizeSearchText(`${n.title} ${n.summary} ${n.category} ${n.tags.join(' ')}`);
        return norm.includes(normQ);
      })
      .map(n => ({
        id: 'note-' + n.id,
        type: 'note' as const,
        title: n.title,
        sourceName: 'Personal Study Notes',
        chapterOrCategory: n.category,
        excerptEn: n.summary + ' — ' + n.keyPoints.join(' '),
        relevanceScore: 94,
        contentToPass: n.detailedContent
      }));

    // 3. Flashcards
    const flashcardItems = flashcards
      .filter(fc => {
        if (!normQ) return true;
        const norm = normalizeSearchText(`${fc.topic} ${fc.subtopic} ${fc.frontEn} ${fc.backEn} ${fc.frontAr || ''}`);
        return norm.includes(normQ);
      })
      .map(fc => ({
        id: 'fc-' + fc.id,
        type: 'flashcard' as const,
        title: fc.topic + ' (' + fc.subtopic + ')',
        sourceName: 'Flashcards Deck',
        chapterOrCategory: fc.category,
        excerptEn: fc.frontEn + ' → ' + fc.backEn,
        excerptAr: fc.frontAr ? fc.frontAr + ' → ' + fc.backAr : undefined,
        relevanceScore: 89,
        contentToPass: fc.backEn
      }));

    // 4. MCQs
    const mcqItems = mcqs
      .filter(q => {
        if (!normQ) return true;
        const norm = normalizeSearchText(`${q.topic} ${q.questionEn} ${q.explanationEn} ${q.questionAr || ''}`);
        return norm.includes(normQ);
      })
      .map(q => ({
        id: 'mcq-' + q.id,
        type: 'mcq' as const,
        title: q.topic,
        sourceName: 'Vascular Board Question Bank',
        chapterOrCategory: q.category,
        excerptEn: q.questionEn + ' Explanation: ' + q.explanationEn,
        relevanceScore: 86,
        contentToPass: q.explanationEn
      }));

    const activeBooks = query.trim() ? bookItems : defaultBookItems;
    return [...activeBooks, ...noteItems, ...flashcardItems, ...mcqItems];
  }, [bookSearchResults, query, references, notes, flashcards, mcqs]);

  // Filtering by category tabs
  const searchResults = useMemo(() => {
    return allSearchItems.filter(item => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Web Evidence') return false; // Handled separately
      if (activeFilter === 'Books & Guidelines') return item.type === 'reference';
      if (activeFilter === 'Notes') return item.type === 'note';
      if (activeFilter === 'Flashcards') return item.type === 'flashcard';
      if (activeFilter === 'MCQs') return item.type === 'mcq';
      if (activeFilter === 'Arterial') return item.chapterOrCategory.includes('Arterial') || item.excerptEn.toLowerCase().includes('artery');
      if (activeFilter === 'Aorta') return item.title.includes('Aorta') || item.title.includes('AAA') || item.chapterOrCategory.includes('Aorta');
      if (activeFilter === 'Carotid') return item.title.includes('Carotid') || item.chapterOrCategory.includes('Carotid');
      if (activeFilter === 'Venous') return item.title.includes('Venous') || item.chapterOrCategory.includes('Venous');
      return true;
    });
  }, [allSearchItems, activeFilter]);

  const filterTabs = [
    'All',
    'Web Evidence',
    'Books & Guidelines',
    'Notes',
    'Flashcards',
    'MCQs',
    'Arterial',
    'Aorta',
    'Carotid',
    'Venous'
  ];

  // Reference comparison datasets
  const comparisonData = {
    ali: {
      topic: 'Acute Limb Ischemia (ALI) Management',
      refA: "Rutherford's Vascular Surgery (10th Ed.)",
      refB: 'ESVS 2024 Clinical Practice Guidelines',
      rows: [
        {
          param: 'Definition & Timing',
          rutherford: 'Symptom duration < 14 days causing sudden limb-threatening decrease in perfusion.',
          esvs: 'Acute reduction in limb perfusion with potential loss of viability, symptom onset <= 14 days.',
          consensus: 'Full Agreement on 14-day threshold separating acute from chronic ischemia.'
        },
        {
          param: 'Classification System',
          rutherford: 'Rutherford Class I (viable), IIa (marginally threatened), IIb (immediately threatened with motor loss), III (irreversible with rigor).',
          esvs: 'Retains Rutherford clinical staging (Class I, IIa, IIb, III) with Doppler sensorimotor integration.',
          consensus: 'Identical staging system utilized internationally.'
        },
        {
          param: 'First-Line Anticoagulation',
          rutherford: 'Immediate IV Unfractionated Heparin (80 U/kg bolus, 18 U/kg/hr) without waiting for imaging.',
          esvs: 'Immediate therapeutic UFH (70-100 U/kg or 5000 IU bolus) Class I, Level B recommendation upon initial contact.',
          consensus: 'Universal Class I mandate: immediate heparinization before any imaging.'
        },
        {
          param: 'Revascularization for Class IIb',
          rutherford: 'Emergency open surgical embolectomy (Fogarty) or bypass; avoids delayed thrombolysis.',
          esvs: 'Open surgical revascularization recommended as first-line over Catheter-Directed Thrombolysis (Class I, Level A).',
          consensus: 'Unanimous: CDT is contraindicated in Class IIb because skeletal muscle undergoes irreversible necrosis after 4-6 hours.'
        },
        {
          param: 'Points of Disagreement / Nuance',
          rutherford: 'Higher emphasis on initial surgical balloon thrombectomy under local anesthesia for cardioembolic cases.',
          esvs: 'More liberal recommendation for Percutaneous Mechanical Thrombectomy (PMT) in Class I and selected IIa native thrombosis.',
          consensus: 'Subtle technical preference difference: ESVS guidelines encourage mechanical endovascular devices where hybrid suites exist.'
        }
      ]
    },
    aaa: {
      topic: 'Abdominal Aortic Aneurysm (AAA) Repair Thresholds',
      refA: 'SVS Practice Guidelines (North American)',
      refB: 'ESVS Practice Guidelines (European)',
      rows: [
        {
          param: 'Elective Diameter Threshold in Men',
          rutherford: '5.5 cm maximum outer-to-outer diameter on orthogonal CT/US.',
          esvs: '5.5 cm maximum orthogonal aortic diameter.',
          consensus: 'Complete international consensus for males based on UKSAT & ADAM trials.'
        },
        {
          param: 'Elective Diameter Threshold in Women',
          rutherford: '5.0 cm (lower threshold due to elevated rupture risk in females).',
          esvs: '5.0 cm recommended for female patients.',
          consensus: 'Concordance: both societies lowered women threshold from 5.5 to 5.0 cm.'
        },
        {
          param: 'Ruptured AAA Strategy',
          rutherford: 'Permissive hypotension (SBP 70-90 mmHg) + EVAR-first approach where anatomy permits.',
          esvs: 'EVAR-first strategy recommended with intra-aortic occlusion balloon standby under local anesthesia.',
          consensus: 'Full agreement: permissive hypotension and EVAR-first saves lives.'
        }
      ]
    },
    carotid: {
      topic: 'Symptomatic Carotid Stenosis Revascularization',
      refA: 'NASCET Trial & SVS Guidelines',
      refB: 'ESVS 2023 Carotid Guidelines',
      rows: [
        {
          param: 'Stenosis Threshold for Symptomatic CEA',
          rutherford: '70-99% internal carotid artery stenosis confers high benefit; 50-69% moderate benefit.',
          esvs: '70-99% Class I recommendation; 50-69% Class IIa recommendation for men.',
          consensus: 'Consensus on 70-99% threshold calculated by NASCET lumen reduction.'
        },
        {
          param: 'Timing of CEA after TIA / Minor Stroke',
          rutherford: 'Perform within 14 days of the index neurologic event.',
          esvs: 'CEA recommended as soon as possible, ideally within 48 to 72 hours, and no later than 14 days.',
          consensus: 'Both emphasize urgency, with ESVS emphasizing ultra-early 48-72h repair.'
        }
      ]
    }
  };

  const currentComp = comparisonData[comparisonTopic];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header with Compare Mode Switch & Books Catalog shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
            <Search className="w-4 h-4" />
            <span>{isAr ? 'البحث الشامل في كل الكتب والإنترنت الحي' : 'Universal RAG Search: All Books & Live Medical Web'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isComparing
              ? isAr ? 'أداة مقارنة المراجع والإرشادات الطبية' : 'Reference & Guideline Comparison Matrix'
              : isAr ? 'البحث في كل الكتب والإنترنت' : 'Global Books & Live Web Search'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isComparing
              ? 'Compare authoritative sources side-by-side (Rutherford vs ESVS) to identify points of clinical agreement and controversy.'
              : isAr
              ? `يبحث التطبيق تلقائياً في جميع الكتب المرفوعة (${references.length} كتب ومراجع) ويبحث أيضاً في شبكة الإنترنت والأبحاث الحديثة مباشرة.`
              : `Searches simultaneously across all ${references.length} uploaded books & guidelines AND queries the live medical web for latest evidence.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Books Catalog Trigger */}
          <button
            onClick={() => setIsBooksCatalogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-teal-500/40 hover:bg-slate-850 text-teal-300 font-semibold text-xs transition cursor-pointer shadow-md"
            title={isAr ? "عرض قائمة الكتب المرفوعة بالتطبيق" : "View all books loaded in the app"}
          >
            <Library className="w-4 h-4 text-teal-400" />
            <span>{isAr ? `الكتب المتاحة (${references.length})` : `Loaded Books (${references.length})`}</span>
          </button>

          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition cursor-pointer shadow-lg ${
              isComparing
                ? 'bg-slate-800 text-teal-300 border border-teal-500/40'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/40'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isComparing ? 'Back to Search' : 'Compare References'}</span>
          </button>
        </div>
      </div>

      {!isComparing ? (
        /* Standard Global Search UI */
        <div className={`space-y-6 ${searchPosition === 'bottom' ? 'pb-48' : ''}`}>
          {/* If Position is TOP: Render Top Search Input */}
          {searchPosition === 'top' && (
            <div className="space-y-2 p-4 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1">
                <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isAr ? `البحث في كل الكتب (${references.length}) + الويب` : `Searching all ${references.length} Books + Web`}
                </span>

                <button
                  onClick={() => setSearchPosition('bottom')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 text-xs font-bold transition cursor-pointer"
                  title={isAr ? 'نقل بار البحث للأسفل لسهولة الكتابة وتصفح النتائج' : 'Dock search bar to bottom during typing'}
                >
                  <ArrowDown className="w-3.5 h-3.5 text-teal-400 animate-bounce" />
                  <span>{isAr ? 'انقل شريط البحث للأسفل ⬇️' : 'Dock to Bottom ⬇️'}</span>
                </button>
              </div>

              <div className="relative">
                <Search className="w-5 h-5 text-teal-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  ref={topInputRef}
                  type="text"
                  placeholder={
                    isAr
                      ? 'ابحث في كل الكتب والإنترنت (مثل: Rutherford classification, EVAR, Fasciotomy)...'
                      : 'Search across all books & live medical web (e.g., SFA occlusion, Rutherford classification)...'
                  }
                  value={query}
                  onChange={e => {
                    const val = e.target.value;
                    setQuery(val);
                    setIsTyping(true);
                    setSearchPosition('bottom');
                    setTimeout(() => {
                      bottomInputRef.current?.focus();
                    }, 30);
                  }}
                  onFocus={() => {
                    setIsInputFocused(true);
                    setIsTyping(true);
                    setSearchPosition('bottom');
                    setTimeout(() => {
                      bottomInputRef.current?.focus();
                    }, 30);
                  }}
                  onBlur={() => setIsInputFocused(false)}
                  className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-slate-850 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-750 transition"
                      title="Clear Search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIncludeWebSearch(!includeWebSearch)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      includeWebSearch
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                    title="Toggle Live Web Grounding Search"
                  >
                    <Globe className={`w-3.5 h-3.5 ${includeWebSearch ? 'text-teal-400 animate-spin-slow' : 'text-slate-500'}`} />
                    <span className="hidden sm:inline">{includeWebSearch ? (isAr ? 'الويب مفعل' : '+ Web Active') : '+ Web Off'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If Position is BOTTOM: Render Compact Overview Banner at Top */}
          {searchPosition === 'bottom' && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-teal-500/30 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{isAr ? 'نتائج البحث عن:' : 'Live Search Results for:'}</span>
                      <span className="text-teal-300 font-mono underline decoration-teal-500/50">
                        "{query || (isAr ? 'كل المواضيع' : 'All topics')}"
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isAr
                        ? `شريط البحث متاح ومثبت بالأسفل للكتابة والبحث الفوري أثناء تصفح النتائج`
                        : `Search bar is docked at bottom for convenient typing while reviewing live findings`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSearchPosition('top');
                      setTimeout(() => topInputRef.current?.focus(), 50);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                    title={isAr ? 'إعادة شريط البحث إلى أعلى الصفحة' : 'Pin search bar back to top'}
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isAr ? 'نقل للأعلى ⬆️' : 'Move to Top ⬆️'}</span>
                  </button>
                </div>
              </div>

              {/* Active Book Badges Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider shrink-0">
                  {isAr ? 'الكتب المفهرسة:' : 'Indexed Books:'}
                </span>
                {references.map(doc => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setIsBooksCatalogOpen(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 text-[10px] text-slate-300 hover:text-teal-300 transition shrink-0 cursor-pointer"
                    title={`${doc.title} (${doc.totalPages} pages, ${doc.chaptersCount} chapters)`}
                  >
                    <BookOpen className="w-2.5 h-2.5 text-teal-400" />
                    <span className="truncate max-w-[140px]">{doc.shortTitle}</span>
                  </button>
                ))}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-[10px] text-teal-300 font-semibold shrink-0">
                  <Globe className="w-2.5 h-2.5" />
                  <span>+ PubMed & Web</span>
                </span>
              </div>
            </div>
          )}

          {/* Filter Pills and Targeted Book Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === tab
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {tab === 'Web Evidence' && <Globe className="w-3.5 h-3.5" />}
                  {tab === 'Books & Guidelines' && <BookOpen className="w-3.5 h-3.5" />}
                  <span>
                    {tab === 'All' ? (isAr ? 'الكل' : 'All')
                      : tab === 'Web Evidence' ? (isAr ? '🌐 أبحاث الويب الحي' : '🌐 Live Web Evidence')
                      : tab === 'Books & Guidelines' ? (isAr ? `📚 كل الكتب (${references.length})` : `📚 All Books (${references.length})`)
                      : tab}
                  </span>
                </button>
              ))}
            </div>

            {/* Targeted Book Selector (Search within ALL or a SPECIFIC book) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>{isAr ? 'نطاق البحث في الكتب:' : 'Search Book Scope:'}</span>
              </span>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedBookFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedBookFilter === 'all'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {isAr ? `جميع الكتب والمراجع (${references.length})` : `All Books (${references.length})`}
                </button>

                {references.map(doc => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedBookFilter(doc.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                      selectedBookFilter === doc.id
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">{doc.shortTitle}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 1. Live Web Evidence Section (PRD User Request: "يبحث في النت ايضا") */}
          {(activeFilter === 'All' || activeFilter === 'Web Evidence') && includeWebSearch && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-teal-500/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>{isAr ? 'نتائج الإنترنت الحي والأبحاث الحديثة' : 'Live Medical Web & Recent Online Evidence'}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Google Grounded
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Grounded in real-time medical literature, PubMed, Cochrane, and European/American society updates.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTutorInitialPrompt(`Based on recent online literature and PubMed trials for "${query}", synthesize the clinical guidelines and operative consensus.`);
                    setActiveTab('tutor');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI on Web Findings</span>
                </button>
              </div>

              {isSearchingWeb ? (
                <div className="py-6 text-center space-y-2">
                  <RotateCw className="w-6 h-6 text-teal-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">
                    {isAr ? 'جارٍ استرجاع أحدث الأبحاث والإرشادات من شبكة الإنترنت...' : 'Querying PubMed, EJVES, and Journal of Vascular Surgery online...'}
                  </p>
                </div>
              ) : webEvidence ? (
                <div className="space-y-3.5">
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    {webEvidence.summary}
                  </div>

                  {/* Sources with links */}
                  {webEvidence.sources && webEvidence.sources.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider block">
                        Direct Online Medical Citations & Source Links:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {webEvidence.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition flex items-center justify-between gap-2 group"
                          >
                            <span className="truncate font-medium">{src.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-teal-400 shrink-0 group-hover:scale-110 transition" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Enter a query above to fetch verified live medical evidence and online research citations.
                </p>
              )}
            </div>
          )}

          {/* 2. All Books & Internal References Section */}
          {(activeFilter === 'All' || activeFilter !== 'Web Evidence') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span>
                    {isAr ? `نتائج البحث في كتب التطبيق (${references.length} كتب مفهرسة)` : `Results from All App Textbooks & Guidelines (${references.length} Books)`}
                  </span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {searchResults.length} {isAr ? 'نتائج مطابقة' : 'matches found'}
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-10 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No internal book matches found</h4>
                  <p className="text-xs text-slate-400">
                    Try another surgical keyword or consult the live web results above.
                  </p>
                </div>
              ) : (
                searchResults.map(result => (
                  <div
                    key={result.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          result.type === 'reference'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : result.type === 'note'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : result.type === 'flashcard'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {result.type === 'reference' ? 'Book' : result.type}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {result.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-teal-400 font-semibold">{result.sourceName}</span>
                        {result.page && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            p.{result.page}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Excerpt with matched text highlight */}
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      "{renderHighlighted(result.excerptEn, query)}"
                    </p>
                    {result.excerptAr && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1" dir="rtl">
                        "{renderHighlighted(result.excerptAr, query)}"
                      </p>
                    )}

                    {/* Actions: Open Book, Ask AI, Save Note */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {result.type === 'reference' && (
                        <button
                          onClick={() => {
                            const doc = references.find(r => r.title.includes(result.sourceName) || result.sourceName.includes(r.shortTitle));
                            if (doc) setSelectedDocForReader(doc);
                            setActiveTab('library');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 text-xs font-semibold transition cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isAr ? 'فتح في قارئ الكتاب' : 'Open in Book Reader'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setTutorInitialPrompt(`Based on ${result.sourceName} regarding ${result.title}, provide an in-depth surgical explanation.`);
                          setActiveTab('tutor');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isAr ? 'اسأل المعلم الذكي' : 'Ask AI Tutor'}</span>
                      </button>

                      <button
                        onClick={() => {
                          addNote({
                            id: 'note-from-search-' + Date.now(),
                            title: result.title,
                            category: 'Arterial',
                            tags: ['Search Result', 'Clinical Snippet'],
                            summary: result.excerptEn.slice(0, 150) + '...',
                            keyPoints: ['Saved excerpt from search results.'],
                            detailedContent: result.contentToPass || result.excerptEn,
                            references: [`${result.sourceName} (Page: ${result.page || 'N/A'})`],
                            isFavorite: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          });
                          showNotification('Saved to Medical Notes.');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save as Note</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* Reference Comparison Matrix */
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-fit">
            <button
              onClick={() => setComparisonTopic('ali')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                comparisonTopic === 'ali'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Acute Limb Ischemia (Rutherford vs ESVS)
            </button>
            <button
              onClick={() => setComparisonTopic('aaa')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                comparisonTopic === 'aaa'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AAA Repair Thresholds (SVS vs ESVS)
            </button>
            <button
              onClick={() => setComparisonTopic('carotid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                comparisonTopic === 'carotid'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Carotid Stenosis (NASCET vs ESVS)
            </button>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Columns className="w-4 h-4 text-purple-400" />
                  <span>{currentComp.topic}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Side-by-side analysis highlighting consensus and clinical nuances.
                </p>
              </div>
              <button
                onClick={() => {
                  setTutorInitialPrompt(`Provide an exhaustive comparison between ${currentComp.refA} and ${currentComp.refB} regarding ${currentComp.topic}. Highlight exact guideline disagreements.`);
                  setActiveTab('tutor');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep AI Analysis</span>
              </button>
            </div>

            {/* Mobile Cards View (< sm) */}
            <div className="sm:hidden divide-y divide-slate-800">
              {currentComp.rows.map((row, idx) => (
                <div key={idx} className="p-4 space-y-3 bg-slate-900/60">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">{row.param}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-bold">
                      Domain {idx + 1}
                    </span>
                  </div>

                  {/* Ref A */}
                  <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-800/40 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">
                      {currentComp.refA}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{row.rutherford}</p>
                  </div>

                  {/* Ref B */}
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                      {currentComp.refB}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{row.esvs}</p>
                  </div>

                  {/* Consensus */}
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span>{row.consensus}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop & Tablet Table View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[650px] text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4 w-1/4">Clinical Domain</th>
                    <th className="p-4 w-1/3 text-blue-400 border-x border-slate-800">{currentComp.refA}</th>
                    <th className="p-4 w-1/3 text-emerald-400">{currentComp.refB}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {currentComp.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition">
                      <td className="p-4 font-bold text-white align-top">
                        {row.param}
                        <div className="mt-2 text-[11px] font-normal text-amber-300/90 flex items-start gap-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{row.consensus}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 leading-relaxed border-x border-slate-800 align-top">
                        {row.rutherford}
                      </td>
                      <td className="p-4 text-slate-300 leading-relaxed align-top">
                        {row.esvs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 
        Bottom-Docked Floating Search Bar
        User Request: "خلي بار البحث ينزل لاسفل اثناء البحث والكتابه"
      */}
      {searchPosition === 'bottom' && !isComparing && (
        <aside
          aria-label={isAr ? 'شريط البحث المثبت بالأسفل' : 'Bottom docked search bar'}
          className="fixed bottom-16 md:bottom-5 left-0 right-0 md:left-64 z-40 px-3 sm:px-6 pointer-events-none flex justify-center transition-all duration-300 ease-in-out animate-in slide-in-from-bottom-4"
        >
          <div className="pointer-events-auto w-full max-w-4xl bg-slate-900/95 backdrop-blur-2xl border border-teal-500/50 shadow-2xl ring-1 ring-teal-500/30 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 space-y-2">
            {/* Top Micro-Bar: Status, Counts, Book Indicator & Position Switcher */}
            <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2 overflow-hidden truncate">
                <span className="flex items-center gap-1.5 text-teal-300 font-bold truncate">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                  {isAr
                    ? `بحث متزامن: كل الكتب (${references.length}) + الويب`
                    : `Live Search: All ${references.length} Books + Web`}
                </span>

                <span className="hidden sm:inline text-slate-600">•</span>

                <span className="hidden sm:inline text-slate-300">
                  {searchResults.length} {isAr ? 'نتيجة في الكتب' : 'book matches'}
                </span>

                {isSearchingWeb && (
                  <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    {isAr ? 'فحص الويب...' : 'Web search...'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsBooksCatalogOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30 transition cursor-pointer"
                  title="View Indexed Books"
                >
                  <Library className="w-3 h-3 text-teal-400" />
                  <span>{references.length} {isAr ? 'كتب' : 'books'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearchPosition('top');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => topInputRef.current?.focus(), 50);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[10px] font-semibold border border-slate-700 transition cursor-pointer"
                  title={isAr ? 'نقل شريط البحث للأعلى' : 'Move to Top'}
                >
                  <ArrowUp className="w-3 h-3 text-teal-400" />
                  <span>{isAr ? 'للأعلى ⬆️' : 'Top ⬆️'}</span>
                </button>
              </div>
            </div>

            {/* Main Input Row */}
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 sm:w-5 h-4 sm:h-5 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0" />
                <input
                  ref={bottomInputRef}
                  type="text"
                  placeholder={
                    isAr
                      ? 'اكتب هنا للبحث المباشر في كل الكتب والإنترنت (مثل: Rutherford, EVAR, Fasciotomy)...'
                      : 'Type here to search across all books & live medical web...'
                  }
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setIsTyping(true);
                  }}
                  onFocus={() => {
                    setIsInputFocused(true);
                    setIsTyping(true);
                  }}
                  onBlur={() => setIsInputFocused(false)}
                  className="w-full pl-10 sm:pl-11 pr-24 sm:pr-28 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 shadow-inner"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                      title={isAr ? 'مسح نص البحث' : 'Clear search text'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIncludeWebSearch(!includeWebSearch)}
                    className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      includeWebSearch
                        ? 'bg-teal-500/25 text-teal-300 border border-teal-500/50'
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}
                    title="Toggle Live Web Grounding Search"
                  >
                    <Globe className={`w-3 h-3 ${includeWebSearch ? 'text-teal-400 animate-spin-slow' : 'text-slate-400'}`} />
                    <span className="hidden sm:inline">{includeWebSearch ? (isAr ? 'الويب مفعل' : '+ Web') : '+ Web Off'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Mobile Books trigger */}
              <button
                type="button"
                onClick={() => setIsBooksCatalogOpen(true)}
                className="sm:hidden p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-teal-400 hover:bg-slate-750 transition shrink-0 cursor-pointer"
                title={isAr ? 'قائمة الكتب المرفوعة' : 'All Books'}
              >
                <Library className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter Strip inside bottom dock */}
            <div className="flex items-center gap-1 overflow-x-auto pt-0.5 pb-0.5 scrollbar-none">
              {filterTabs.slice(0, 6).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === tab
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750 border border-slate-700'
                  }`}
                >
                  {tab === 'All' ? (isAr ? 'الكل' : 'All')
                    : tab === 'Web Evidence' ? (isAr ? '🌐 الويب' : '🌐 Web')
                    : tab === 'Books & Guidelines' ? (isAr ? '📚 الكتب' : '📚 Books')
                    : tab}
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
