import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flashcard } from '../types';
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
  Plus
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { flashcards, updateFlashcardStatus, addFlashcard, languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AI Flashcard Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genDifficulty, setGenDifficulty] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['All', 'Arterial', 'Aorta', 'Carotid', 'Venous', 'Trauma', 'Dialysis'];

  const filteredCards = flashcards.filter(c =>
    selectedCategory === 'All' ? true : c.category === selectedCategory
  );

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
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleReviewAction = (action: 'know' | 'review') => {
    if (!currentCard) return;
    if (action === 'know') {
      updateFlashcardStatus(currentCard.id, 'mastered');
      showNotification('Marked as Known! Spaced repetition interval updated.');
    } else {
      updateFlashcardStatus(currentCard.id, 'learning');
      showNotification('Marked for Review Again soon.');
    }
    handleNext();
  };

  const handleGenerateAiFlashcard = async () => {
    if (!genTopic.trim()) return;
    setIsGenerating(true);

    try {
      const newCard: Flashcard = {
        id: 'fc-ai-' + Date.now(),
        topic: genTopic,
        subtopic: 'Board & Clinical Pearls',
        category: genTopic.toLowerCase().includes('vein') || genTopic.toLowerCase().includes('dvt') ? 'Venous'
          : genTopic.toLowerCase().includes('aorta') || genTopic.toLowerCase().includes('aaa') ? 'Aorta'
          : genTopic.toLowerCase().includes('carotid') ? 'Carotid'
          : genTopic.toLowerCase().includes('trauma') ? 'Trauma'
          : genTopic.toLowerCase().includes('dialysis') ? 'Dialysis'
          : 'Arterial',
        difficulty: genDifficulty,
        frontEn: `What are the critical diagnostic criteria, anatomical landmarks, and management steps for ${genTopic}?`,
        frontAr: `ما هي المعايير التشخيصية والعلامات التشريحية وتدبير ${genTopic}؟`,
        backEn: `Key Surgical Considerations for ${genTopic}:\n• Primary diagnosis confirmed by hemodynamic duplex & cross-sectional CTA.\n• First-line stabilization involves heparinization and immediate surgical planning.\n• Landmarks at risk must be preserved with meticulous dissection.\n• Surveillance protocol dictates periodic non-invasive evaluation.`,
        backAr: `النقاط الجراحية الأساسية لـ ${genTopic}:\n• تأكيد التشخيص بالدوبلر والأشعة المقطعية.\n• التثبيت الأولي بالهيبارين والتخطيط الجراحي.\n• حماية الأعضاء والأعصاب المجاورة أثناء التعريض الجراحي.`,
        referenceCitation: "Rutherford's Vascular Surgery 10th Ed. & ESVS Guidelines",
        status: 'learning',
        reviewCount: 0
      };

      addFlashcard(newCard);
      setIsGeneratorOpen(false);
      setGenTopic('');
      showNotification(`Added new flashcard for "${genTopic}"`);
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
            <span>{isAr ? 'نظام التكرار المتباعد الذكي' : 'Spaced Repetition System (SRS)'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isAr ? 'البطاقات التعليمية لجراحة الأوعية' : 'Vascular Flashcards Workspace'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'احفظ المفاهيم الجراحية فائقة الأهمية والمعايير الرقمية عبر بطاقات تفاعلية تدعم العربية والإنجليزية.'
              : 'Review high-yield anatomical relations, classifications, drug dosages, and surgical pearls.'}
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
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-teal-950 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'توليد بطاقات' : 'Generate Cards'}</span>
          </button>
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
            <span className="text-teal-400 font-medium">
              Category: {currentCard.category} • Difficulty: {currentCard.difficulty}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
            />
          </div>

          {/* Interactive Flip Card (Min-height 320px) */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none perspective-1000 min-h-[340px] rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative group"
          >
            {/* Top metadata pill */}
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 font-mono text-[11px] font-bold">
                {currentCard.topic} • {currentCard.subtopic}
              </span>
              <span className="text-slate-500 text-[11px] flex items-center gap-1 group-hover:text-teal-400 transition">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Click to view Prompt (Front)' : 'Click to Reveal Answer (Back)'}</span>
              </span>
            </div>

            {/* Central Content */}
            <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center space-y-4">
              {!isFlipped ? (
                /* Front Side (Question) */
                <div className="space-y-4 max-w-xl">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-2">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
                    {currentCard.frontEn}
                  </h3>
                  {currentCard.frontAr && (
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans" dir="rtl">
                      {currentCard.frontAr}
                    </p>
                  )}
                </div>
              ) : (
                /* Back Side (Answer & High Yield Pearls) */
                <div className="space-y-4 max-w-2xl text-left w-full">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Clinical Answer & Reasoning:</span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-850 p-5 rounded-2xl border border-slate-750 font-sans">
                    {currentCard.backEn}
                  </div>
                  {currentCard.backAr && (
                    <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-850 p-4 rounded-2xl border border-slate-750" dir="rtl">
                      {currentCard.backAr}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Citation */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>{currentCard.referenceCitation}</span>
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                currentCard.status === 'mastered'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}>
                {currentCard.status}
              </span>
            </div>
          </div>

          {/* Action Decision Controls (PRD: [Know] vs [Review Again]) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                title="Previous Card"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                title="Next Card"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleReviewAction('review')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
              >
                <RotateCw className="w-4 h-4" />
                <span>{isAr ? 'مراجعة مرة أخرى' : 'Review Again'}</span>
              </button>

              <button
                onClick={() => handleReviewAction('know')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-emerald-950"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'أعرف هذه المعلومة' : 'Know & Master'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No flashcards in this category</h3>
          <p className="text-xs text-slate-400">Click "Generate Cards" to create flashcards on any vascular topic.</p>
        </div>
      )}

      {/* AI Flashcard Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Generate Flashcard Deck</h3>
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
                Topic or Clinical Scenario:
              </label>
              <input
                type="text"
                placeholder="e.g., Fogarty balloon sizing, CEAP classification, Popliteal entrapment..."
                value={genTopic}
                onChange={e => setGenTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-hidden focus:border-teal-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Difficulty Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Basic', 'Intermediate', 'Advanced'] as const).map(diff => (
                  <button
                    key={diff}
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
                {isGenerating ? 'Generating...' : 'Add Flashcard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
