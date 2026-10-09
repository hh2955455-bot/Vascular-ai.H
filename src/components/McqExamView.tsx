import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MCQQuestion } from '../types';
import {
  HelpCircle,
  Timer,
  Flag,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  Award,
  ChevronRight,
  Plus,
  Play
} from 'lucide-react';

export const McqExamView: React.FC = () => {
  const { mcqs, addMcq, updateUserProfile, languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [mode, setMode] = useState<'practice' | 'exam'>('exam');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer countdown in Exam Mode
  useEffect(() => {
    let interval: any = null;
    if (mode === 'exam' && !isExamSubmitted && isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && !isExamSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [mode, isExamSubmitted, isTimerRunning, timerSeconds]);

  const currentQuestion: MCQQuestion | undefined = mcqs[currentIndex] || mcqs[0];

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    if (isExamSubmitted && mode === 'exam') return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleToggleFlag = (id: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    setIsTimerRunning(false);

    // Calculate score
    let correctCount = 0;
    mcqs.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const accuracy = mcqs.length > 0 ? Math.round((correctCount / mcqs.length) * 100) : 0;
    updateUserProfile({
      mcqsCompleted: mcqs.length,
      mcqAccuracy: accuracy
    });

    showNotification(`Exam Completed! Score: ${correctCount}/${mcqs.length} (${accuracy}%)`);
  };

  const handleResetExam = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setIsExamSubmitted(false);
    setCurrentIndex(0);
    setTimerSeconds(600);
    setIsTimerRunning(true);
  };

  // Weak area analysis calculation
  const calculateWeakAreas = () => {
    const wrongByCategory: Record<string, number> = {};
    mcqs.forEach(q => {
      if (selectedAnswers[q.id] !== q.correctAnswer) {
        wrongByCategory[q.category] = (wrongByCategory[q.category] || 0) + 1;
      }
    });
    return Object.entries(wrongByCategory).sort((a, b) => b[1] - a[1]);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scoreCount = mcqs.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>{isAr ? 'بنك أسئلة جراحة الأوعية الدموية وامتحانات البورد' : 'Vascular Board & FRCS Examination Engine'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isAr ? 'الأسئلة السريرية ونظام الامتحانات' : 'MCQs & Exam Mode'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'تدرب على أسئلة محاكاة للبورد مع توقيت واقعي، تفسيرات سريرية شاملة، واستشهادات موثقة.'
              : 'Board-style clinical scenarios with timed exam simulation, detailed rationales, and weak-topic analysis.'}
          </p>
        </div>

        {/* Mode Selector pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setMode('practice');
                setIsExamSubmitted(false);
                setIsTimerRunning(false);
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                mode === 'practice'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Practice Mode (Immediate Rationales)
            </button>
            <button
              onClick={() => {
                setMode('exam');
                handleResetExam();
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                mode === 'exam'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Timed Exam Mode
            </button>
          </div>
        </div>
      </div>

      {/* Exam Header Status Bar: Timer, Flags, Submit */}
      {mode === 'exam' && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-1.5 rounded-xl border ${
              timerSeconds < 120
                ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-teal-400'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>

            <span className="text-xs text-slate-400">
              Answered: <strong className="text-white">{Object.keys(selectedAnswers).length}</strong> / {mcqs.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isExamSubmitted ? (
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-purple-950"
              >
                Submit Exam
              </button>
            ) : (
              <button
                onClick={handleResetExam}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Exam</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Score and Weak Topic Analysis Banner (if submitted) */}
      {isExamSubmitted && mode === 'exam' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Exam Result: {scoreCount} / {mcqs.length} ({Math.round((scoreCount / mcqs.length) * 100)}%)
                </h3>
                <p className="text-xs text-slate-300">
                  Detailed question rationales and reference citations are now unlocked below.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xl font-mono font-extrabold ${
                scoreCount >= mcqs.length * 0.7 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {scoreCount >= mcqs.length * 0.7 ? 'PASS (Board Ready)' : 'NEEDS TARGETED REVIEW'}
              </span>
            </div>
          </div>

          {/* Weak Topics Analysis (PRD Section 27) */}
          <div className="pt-3 border-t border-purple-800/40 space-y-2">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Diagnostic Weak-Topic Breakdown:
            </h4>
            <div className="flex flex-wrap gap-2">
              {calculateWeakAreas().map(([cat, count]) => (
                <div
                  key={cat}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>{cat}: {count} incorrect answer{count > 1 ? 's' : ''}</span>
                </div>
              ))}
              {calculateWeakAreas().length === 0 && (
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Flawless performance across all tested vascular domains!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main MCQ Layout: Question Display and Navigation Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Card (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            {/* Header: Question Number, Category, Flag button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg">
                  Question {currentIndex + 1} of {mcqs.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentQuestion.category} • {currentQuestion.difficulty}
                </span>
              </div>

              <button
                onClick={() => handleToggleFlag(currentQuestion.id)}
                className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs ${
                  flaggedQuestions[currentQuestion.id]
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Mark for Review"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}
                </span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQuestion.questionEn}
              </h3>
              {currentQuestion.questionAr && (
                <p className="text-sm text-slate-300 leading-relaxed font-sans pt-1" dir="rtl">
                  {currentQuestion.questionAr}
                </p>
              )}
            </div>

            {/* Options (A - E) */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map(opt => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                const isCorrect = currentQuestion.correctAnswer === opt.id;
                const showExplanation = mode === 'practice' ? isSelected : isExamSubmitted;

                let optStyle = 'bg-slate-850 border-slate-750 text-slate-200 hover:border-slate-600';
                if (showExplanation) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'bg-red-950/40 border-red-500/80 text-red-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-teal-950/50 border-teal-500 text-teal-100 font-bold shadow-md';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${optStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {opt.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm leading-relaxed">{opt.textEn}</p>
                      {opt.textAr && (
                        <p className="text-xs text-slate-400 mt-1" dir="rtl">{opt.textAr}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Explanation Section (shown in Practice Mode or after Exam Submission) */}
            {(mode === 'practice' && selectedAnswers[currentQuestion.id]) || (mode === 'exam' && isExamSubmitted) ? (
              <div className="mt-6 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer: Option {currentQuestion.correctAnswer}
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Correct Answer: Option {currentQuestion.correctAnswer}
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 font-sans">
                  <p>{currentQuestion.explanationEn}</p>
                  {currentQuestion.explanationAr && (
                    <p className="text-xs text-slate-400 pt-2 border-t border-slate-850" dir="rtl">
                      {currentQuestion.explanationAr}
                    </p>
                  )}
                </div>

                {currentQuestion.surgicalPearls && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                    <strong className="text-amber-400 block mb-0.5">Surgical Pearl:</strong>
                    {currentQuestion.surgicalPearls}
                  </div>
                )}

                <div className="pt-2 flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  <span>{currentQuestion.referenceCitation}</span>
                </div>
              </div>
            ) : null}

            {/* Question Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  currentIndex === 0
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentIndex(prev => Math.min(mcqs.length - 1, prev + 1))}
                disabled={currentIndex === mcqs.length - 1}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  currentIndex === mcqs.length - 1
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-500 text-white cursor-pointer shadow-md'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Question Navigator ({mcqs.length} Total)
            </h4>

            {/* Number grid */}
            <div className="grid grid-cols-5 gap-2">
              {mcqs.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isFlagged = Boolean(flaggedQuestions[q.id]);

                let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
                if (isCurrent) {
                  btnClass = 'bg-teal-600 text-white font-extrabold ring-2 ring-teal-400';
                } else if (isAnswered) {
                  btnClass = 'bg-slate-750 text-emerald-400 font-bold border-emerald-500/40';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl border text-xs font-mono transition relative cursor-pointer ${btnClass}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-teal-600 inline-block" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-750 border border-emerald-500/40 inline-block" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span>Marked for Review (Flagged)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
