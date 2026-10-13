import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MCQQuestion, Flashcard } from '../types';
import { generateTopicQuestionsAndCards } from '../services/aiService';
import {
  Sparkles,
  HelpCircle,
  Layers,
  X,
  CheckCircle2,
  XCircle,
  Timer,
  ArrowRight,
  BookOpen,
  Award,
  RotateCw,
  Check
} from 'lucide-react';

interface GenerateTopicMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  contentExcerpt?: string;
}

export const GenerateTopicMaterialModal: React.FC<GenerateTopicMaterialModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  contentExcerpt,
}) => {
  const {
    references,
    languageMode,
    addMultipleMcqs,
    addMultipleFlashcards,
    setMcqs,
    setActiveTab,
    showNotification
  } = useApp();

  const isAr = languageMode === 'ar';
  const [activeTab, setActiveModalTab] = useState<'mcqs' | 'flashcards'>('mcqs');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMcqs, setGeneratedMcqs] = useState<MCQQuestion[]>([]);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && topicTitle) {
      handleGenerate();
    }
  }, [isOpen, topicTitle]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setSelectedAnswers({});
    setFlippedCards({});

    try {
      const result = await generateTopicQuestionsAndCards({
        topic: topicTitle,
        contentExcerpt,
        references,
        languageMode,
      });

      setGeneratedMcqs(result.mcqs);
      setGeneratedFlashcards(result.flashcards);

      // Automatically persist/add into active AppContext collections
      addMultipleMcqs(result.mcqs);
      addMultipleFlashcards(result.flashcards);

      showNotification(
        isAr
          ? `تم إنشاء ${result.mcqs.length} أسئلة و ${result.flashcards.length} بطاقات لهذا الجزء بنجاح!`
          : `Created ${result.mcqs.length} MCQs & ${result.flashcards.length} Flashcards for this part!`
      );
    } catch (err) {
      console.warn('Failed to generate topic material:', err);
      showNotification(isAr ? 'حدث خطأ أثناء التوليد. جرب ثانية.' : 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTimedExamWithThese = () => {
    if (generatedMcqs.length > 0) {
      setMcqs(generatedMcqs);
      setActiveTab('mcq');
      onClose();
    }
  };

  const handleGoToFlashcards = () => {
    setActiveTab('flashcards');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 text-teal-400 border border-teal-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {isAr ? 'أسئلة وفلاش كاردس للجزء المدروس' : 'Targeted Questions & Flashcards'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
                {topicTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700 disabled:opacity-50"
              title={isAr ? 'إعادة التوليد بأسئلة وبطاقات جديدة' : 'Regenerate fresh set'}
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 py-2.5 bg-slate-850/60 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveModalTab('mcqs')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'mcqs'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأسئلة السريرية' : 'MCQs Practice'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-800 font-mono">
                {generatedMcqs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveModalTab('flashcards')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'بطاقات الاستذكار' : 'Flashcards'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-800 font-mono">
                {generatedFlashcards.length}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {isAr ? 'مستخرجة من مراجع التطبيق والبورد العالمي' : 'From uploaded books & Global Boards'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30 animate-pulse">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">
                  {isAr ? 'جاري استخراج وصنع الأسئلة والبطاقات لهذا الجزء...' : 'Generating Targeted MCQs & Flashcards...'}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isAr
                    ? 'يقوم النظام بتحليل الجزء المدروس واستخراج سيناريوهات البورد ولآلئ المراجع الطبية المعتمدة.'
                    : 'Analyzing the studied topic, extracting high-yield board scenarios, and formulating clinical pearls.'}
                </p>
              </div>
            </div>
          ) : activeTab === 'mcqs' ? (
            <div className="space-y-4">
              {generatedMcqs.map((q, idx) => {
                const selectedOpt = selectedAnswers[q.id];
                const isAnswered = Boolean(selectedOpt);
                const isCorrect = selectedOpt === q.correctAnswer;

                return (
                  <div
                    key={q.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-750 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-teal-400 font-mono">
                        Q{idx + 1}. {q.topic}
                      </span>
                      {isAnswered && (
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Incorrect</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                      {isAr && q.questionAr ? q.questionAr : q.questionEn}
                    </p>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map(opt => {
                        const isThisSelected = selectedOpt === opt.id;
                        const isThisCorrect = opt.id === q.correctAnswer;

                        let optClass = 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700';
                        if (isAnswered) {
                          if (isThisCorrect) {
                            optClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                          } else if (isThisSelected) {
                            optClass = 'bg-rose-950/60 border-rose-500 text-rose-200';
                          } else {
                            optClass = 'bg-slate-800/40 border-slate-800 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              if (!isAnswered) {
                                setSelectedAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                              }
                            }}
                            className={`w-full text-left p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer ${optClass}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {opt.id}
                            </span>
                            <span className="flex-1">
                              {isAr && opt.textAr ? opt.textAr : opt.textEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Rationales & Surgical Pearls */}
                    {isAnswered && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-750 text-xs space-y-1.5 animate-in fade-in duration-200">
                        <div className="font-bold text-teal-300">
                          {isAr ? `الإجابة الصحيحة: (${q.correctAnswer})` : `Correct Answer: (${q.correctAnswer})`}
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {isAr && q.explanationAr ? q.explanationAr : q.explanationEn}
                        </p>
                        {q.surgicalPearls && (
                          <div className="pt-1.5 text-amber-300 font-semibold flex items-start gap-1">
                            <span className="shrink-0">💎</span>
                            <span>{q.surgicalPearls}</span>
                          </div>
                        )}
                        {q.referenceCitation && (
                          <div className="pt-1 text-[11px] text-slate-400 font-mono flex items-center gap-1 border-t border-slate-850">
                            <BookOpen className="w-3 h-3 text-teal-400" />
                            <span>{q.referenceCitation}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {generatedFlashcards.map((card, idx) => {
                const cardKey = card.id || String(idx);
                const isFlipped = Boolean(flippedCards[cardKey]);

                return (
                  <div
                    key={cardKey}
                    onClick={() => setFlippedCards(p => ({ ...p, [cardKey]: !p[cardKey] }))}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-750 hover:border-teal-500/40 transition cursor-pointer select-none space-y-3 flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="font-bold text-purple-400 font-mono">
                          {card.topic}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                          {isFlipped ? (isAr ? 'الإجابة 💡' : 'Answer') : (isAr ? 'السؤال ❓' : 'Question')}
                        </span>
                      </div>

                      {isFlipped ? (
                        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {isAr && card.backAr ? card.backAr : card.backEn}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white font-semibold leading-relaxed">
                          {isAr && card.frontAr ? card.frontAr : card.frontEn}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                      <span className="italic truncate max-w-[180px]">
                        {card.referenceCitation}
                      </span>
                      <span className="text-teal-400 font-medium">
                        {isAr ? 'اضغط للقلب 🔄' : 'Click to flip 🔄'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Actions */}
        <div className="p-4 bg-slate-850 border-t border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            {isAr
              ? 'تمت إضافة هذه المجموعة تلقائياً إلى بنك الأسئلة والفلاش كاردس بحسابك.'
              : 'These questions & cards have been added to your active study bank.'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartTimedExamWithThese}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-950"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{isAr ? 'بدء امتحان موقوت بها' : 'Launch Timed Exam'}</span>
            </button>

            <button
              onClick={handleGoToFlashcards}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-xs transition cursor-pointer border border-slate-700 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>{isAr ? 'فتح بالفلاش كارد' : 'Flashcards Deck'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition cursor-pointer"
            >
              {isAr ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
