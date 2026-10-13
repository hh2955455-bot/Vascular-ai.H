import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flashcard } from '../types';
import { generateDynamicFlashcards } from '../services/aiService';
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle,
  HelpCircle,
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Filter,
  Check,
  X,
  Plus,
  Globe,
  Target,
  Shuffle
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const {
    flashcards,
    updateFlashcardStatus,
    addFlashcard,
    addMultipleFlashcards,
    references,
    languageMode,
    showNotification
  } = useApp();

  const isAr = languageMode === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<'all' | 'books' | 'external' | 'studied_part'>('all');
  const [selectedStudiedTopic, setSelectedStudiedTopic] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AI Flashcard Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genSource, setGenSource] = useState<'all' | 'books' | 'external' | 'studied_part'>('books');
  const [genDifficulty, setGenDifficulty] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['All', 'Arterial', 'Aorta', 'Carotid', 'Venous', 'Trauma', 'Dialysis'];

  const studiedTopicsQuickList = [
    { id: 'ali', labelEn: 'Acute Limb Ischemia & Fogarty', labelAr: 'إقفار الأطراف الحاد وقسطرة فوجارتي' },
    { id: 'aaa_evar', labelEn: 'AAA & EVAR Anatomical Criteria', labelAr: 'تمدد الأورطي ومعايير EVAR' },
    { id: 'carotid', labelEn: 'Carotid Stenosis & CEA Anatomy', labelAr: 'تضيق السباتي وتشريح جراحة CEA' },
    { id: 'fasciotomy', labelEn: '4-Compartment Leg Fasciotomy', labelAr: 'بضع اللفافة بالحجرات الأربع' },
    { id: 'tos', labelEn: 'Thoracic Outlet Syndrome & First Rib', labelAr: 'متلازمة مخرج الصدر واستئصال الضلع الأول' },
    { id: 'dvt', labelEn: 'Deep Vein Thrombosis & May-Thurner', labelAr: 'الخثار الوريدي ومتلازمة ماي-تيرنر' },
    { id: 'avf', labelEn: 'Dialysis Access Steal & DRIL', labelAr: 'سرقة التروية بالناسور وعملية DRIL' },
    { id: 'wifi', labelEn: 'Diabetic Foot & WIfI Classification', labelAr: 'القدم السكرية وتصنيف WIfI' },
  ];

  const filteredCards = flashcards.filter(c => {
    const matchCategory = selectedCategory === 'All' ? true : c.category === selectedCategory;
    const matchSource =
      selectedSource === 'all'
        ? true
        : selectedSource === 'books'
        ? c.sourceOrigin === 'books' || !c.sourceOrigin
        : selectedSource === 'external'
        ? c.sourceOrigin === 'external'
        : c.sourceOrigin === 'studied_part';

    const matchTopic =
      !selectedStudiedTopic
        ? true
        : c.topic.toLowerCase().includes(selectedStudiedTopic.toLowerCase()) ||
          c.subtopic.toLowerCase().includes(selectedStudiedTopic.toLowerCase());

    return matchCategory && matchSource && matchTopic;
  });

  const currentCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, filteredCards.length - 1));
    }
  };

  const handleReviewAction = (action: 'know' | 'review') => {
    if (!currentCard) return;
    if (action === 'know') {
      updateFlashcardStatus(currentCard.id, 'mastered');
      showNotification(isAr ? 'تم تحديدها كـ "متقنة"! تم تحديث فترة التكرار.' : 'Marked as Known! Spaced repetition updated.');
    } else {
      updateFlashcardStatus(currentCard.id, 'learning');
      showNotification(isAr ? 'تم تحديدها للمراجعة القريبة.' : 'Marked for Review Again soon.');
    }
    handleNext();
  };

  const handleGenerateDeckForStudiedTopic = async (topicTitle: string, source: 'all' | 'books' | 'external' | 'studied_part' = 'studied_part') => {
    setIsGenerating(true);
    try {
      const newCards = await generateDynamicFlashcards({
        source,
        topicOrPart: topicTitle,
        count: 4,
        references,
        languageMode,
      });

      if (newCards.length > 0) {
        addMultipleFlashcards(newCards);
        setSelectedStudiedTopic(topicTitle);
        setCurrentIndex(0);
        showNotification(
          isAr
            ? `تم توليد وإضافة ${newCards.length} بطاقات استذكار للجزء: "${topicTitle}"`
            : `Generated & added ${newCards.length} flashcards for "${topicTitle}"!`
        );
      }
    } catch (err) {
      console.warn('Failed to generate cards for topic:', err);
      showNotification(isAr ? 'حدث خطأ أثناء التوليد.' : 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAiFlashcard = async () => {
    if (!genTopic.trim()) return;
    setIsGenerating(true);

    try {
      const generated = await generateDynamicFlashcards({
        source: genSource,
        topicOrPart: genTopic.trim(),
        count: 4,
        references,
        languageMode,
      });

      if (generated.length > 0) {
        addMultipleFlashcards(generated);
        setIsGeneratorOpen(false);
        setGenTopic('');
        setCurrentIndex(0);
        showNotification(
          isAr
            ? `تمت إضافة ${generated.length} بطاقة استذكار جديدة بنجاح!`
            : `Added ${generated.length} new flashcards successfully!`
        );
      }
    } catch (e) {
      showNotification('Generation failed. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = flashcards.filter(c => c.status === 'mastered').length;
  const learningCount = flashcards.filter(c => c.status === 'learning').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>{isAr ? 'نظام التكرار المتباعد وفلاش كاردس الأوعية الدموية' : 'Vascular Spaced Repetition Flashcards'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isAr ? 'البطاقات التعليمية لجراحة الأوعية' : 'Vascular Flashcards Workspace'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'توليد ومراجعة البطاقات من كتب ومراجع التطبيق، ومن خارجها (لآلئ البورد)، ومن أي جزء محدد يتم دراسته.'
              : 'Study and generate flashcards from uploaded textbooks & ESVS guidelines, external board pearls, or any specified studied section.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-1 text-emerald-400 px-2 font-bold">
              <span>{masteredCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">Mastered</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-1 text-amber-400 px-2 font-bold">
              <span>{learningCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">Learning</span>
            </div>
          </div>

          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-teal-950 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'توليد بطاقات جديدة' : 'Generate Cards'}</span>
          </button>
        </div>
      </div>

      {/* Source Selection & Studied Topic Chips Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" />
              <span>{isAr ? 'مصدر البطاقات:' : 'Source:'}</span>
            </span>

            <button
              onClick={() => {
                setSelectedSource('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                selectedSource === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'الكل 🌟' : 'All Sources 🌟'}
            </button>

            <button
              onClick={() => {
                setSelectedSource('books');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                selectedSource === 'books'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isAr ? 'من كتب ومراجع التطبيق' : 'Uploaded Books & ESVS'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedSource('external');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                selectedSource === 'external'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'من خارج الكتب (بورد عالمي)' : 'Global Board Pearls'}</span>
            </button>
          </div>

          {selectedStudiedTopic && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-teal-300 font-medium">
                {isAr ? `تصفية بالجزء: "${selectedStudiedTopic}"` : `Filtered by: "${selectedStudiedTopic}"`}
              </span>
              <button
                onClick={() => setSelectedStudiedTopic('')}
                className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Clear topic filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Quick studied topics quick-jump & generator row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-teal-400" />
              <span>{isAr ? 'توليد واستعراض بطاقات لجزء محدد تم دراسته:' : 'Quick Select Studied Topic:'}</span>
            </span>
            {isGenerating && (
              <span className="text-teal-400 animate-pulse text-[11px] font-mono">
                {isAr ? 'جاري توليد بطاقات الجزء...' : 'Generating cards...'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {studiedTopicsQuickList.map(tp => (
              <button
                key={tp.id}
                onClick={() => handleGenerateDeckForStudiedTopic(isAr ? tp.labelAr : tp.labelEn)}
                disabled={isGenerating}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1 ${
                  selectedStudiedTopic === (isAr ? tp.labelAr : tp.labelEn)
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-750'
                }`}
              >
                <span>🎯</span>
                <span>{isAr ? tp.labelAr : tp.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flashcard Presentation Card */}
      {currentCard ? (
        <div className="space-y-6">
          {/* Card index counter & progress bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-mono">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {currentCard.sourceOrigin === 'books'
                  ? (isAr ? 'من مراجع التطبيق' : 'Book Reference')
                  : currentCard.sourceOrigin === 'external'
                  ? (isAr ? 'لؤلؤة بورد عالمي' : 'Global Board')
                  : (isAr ? 'جزء مدروس' : 'Studied Part')}
              </span>
              <span className="text-teal-400 font-medium">
                {currentCard.category} • {currentCard.difficulty}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
            />
          </div>

          {/* Interactive Flip Card (Min-height 340px) */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none perspective-1000 min-h-[340px] rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative group"
          >
            {/* Top metadata pill */}
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
              <span className="font-mono text-teal-400 font-bold uppercase tracking-wider">
                {currentCard.topic} • {currentCard.subtopic}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-teal-300 transition">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isAr ? 'اضغط للقلب' : 'Click to flip'}</span>
              </span>
            </div>

            {/* Central Card Text: Front vs Back */}
            <div className="py-6 text-center sm:text-left flex-1 flex flex-col justify-center">
              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="inline-block text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">
                    {isAr ? 'السؤال السريري' : 'Clinical Question'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    {isAr && currentCard.frontAr ? currentCard.frontAr : currentCard.frontEn}
                  </h3>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <span className="inline-block text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-950/60 border border-teal-800/40 px-3 py-1 rounded-full">
                    {isAr ? 'الإجابة واللؤلؤة الجراحية' : 'Answer & Surgical Pearls'}
                  </span>
                  <div className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans whitespace-pre-wrap text-left" dir="ltr">
                    {isAr && currentCard.backAr ? currentCard.backAr : currentCard.backEn}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Citation */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
              <span className="flex items-center gap-1 truncate max-w-sm">
                <BookOpen className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{currentCard.referenceCitation}</span>
              </span>
              <span className="font-mono text-slate-400">
                Reviews: {currentCard.reviewCount}
              </span>
            </div>
          </div>

          {/* Action Review Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrev}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Spaced repetition review ratings */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleReviewAction('review')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isAr ? 'تحتاج مراجعة ثانية' : 'Review Again'}</span>
              </button>

              <button
                onClick={() => handleReviewAction('know')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isAr ? 'أعرفها تماماً ✓' : 'Know It ✓'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {isAr ? 'لا توجد بطاقات في هذا التصنيف حالياً' : 'No flashcards in this filter'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'اضغط على أحد الأجزاء المدروسة بالأعلى لتوليد بطاقات لها فوراً، أو انقر "توليد بطاقات جديدة".'
                : 'Click any studied topic chip above or use "Generate Cards" to create cards on any topic.'}
            </p>
          </div>
          <button
            onClick={() => handleGenerateDeckForStudiedTopic('Acute Limb Ischemia & Fogarty')}
            className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer"
          >
            {isAr ? 'توليد بطاقات سريعة الآن 🎯' : 'Generate Quick Deck'}
          </button>
        </div>
      )}

      {/* AI Flashcard Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'توليد حزمة فلاش كاردس ذكية' : 'Generate Flashcard Deck'}
                </h3>
              </div>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'المصدر المطلوب للبطاقات:' : 'Source Material:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'books' as const, label: isAr ? 'من الكتب' : 'Books' },
                  { id: 'external' as const, label: isAr ? 'بورد خارجي' : 'Board' },
                  { id: 'studied_part' as const, label: isAr ? 'جزء مدروس' : 'Topic' },
                ].map(src => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setGenSource(src.id)}
                    className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      genSource === src.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'الجزء أو الموضوع السريري المراد توليد بطاقات له:' : 'Studied Part or Clinical Topic:'}
              </label>
              <input
                type="text"
                placeholder={isAr ? 'مثال: بضع اللفافة، أورام السباتي، تمدد الأورطي، DRIL...' : 'e.g., Fogarty balloon sizing, CEAP classification, Popliteal entrapment...'}
                value={genTopic}
                onChange={e => setGenTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-hidden focus:border-teal-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isAr ? 'مستوى الصعوبة:' : 'Difficulty Level:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Basic', 'Intermediate', 'Advanced'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setGenDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      genDifficulty === diff
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiFlashcard}
                disabled={!genTopic.trim() || isGenerating}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  genTopic.trim() && !isGenerating
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (isAr ? 'جاري التوليد...' : 'Generating...') : (isAr ? 'توليد وإضافة البطاقات' : 'Generate Cards')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
