import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MCQQuestion } from '../types';
import { generateDynamicMcqExam } from '../services/aiService';
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
  Globe,
  Layers,
  Filter,
  Check,
  RefreshCw,
  Shuffle
} from 'lucide-react';

export const McqExamView: React.FC = () => {
  const {
    mcqs,
    setMcqs,
    references,
    updateUserProfile,
    languageMode,
    showNotification
  } = useApp();

  const isAr = languageMode === 'ar';

  const [mode, setMode] = useState<'practice' | 'exam'>('exam');
  const [sourceFilter, setSourceFilter] = useState<'mixed' | 'books' | 'external_board'>('mixed');
  const [questionCountTarget, setQuestionCountTarget] = useState<number>(5);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  // 5-Minute Timer (as requested by user)
  const EXAM_DURATION_SECONDS = 300; // 5 minutes
  const [timerSeconds, setTimerSeconds] = useState(EXAM_DURATION_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStartedTimer, setHasStartedTimer] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Timer countdown in Exam Mode
  useEffect(() => {
    let interval: any = null;
    if (mode === 'exam' && !isExamSubmitted && isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && !isExamSubmitted && mode === 'exam') {
      setIsTimeUp(true);
      handleSubmitExam(true);
    }
    return () => clearInterval(interval);
  }, [mode, isExamSubmitted, isTimerRunning, timerSeconds]);

  const currentQuestion: MCQQuestion | undefined = mcqs[currentIndex] || mcqs[0];

  // Function to generate completely new questions on-demand or upon source change
  const handleGenerateFreshExam = async (overrideSource?: 'mixed' | 'books' | 'external_board', count?: number) => {
    setIsGeneratingExam(true);
    const targetSource = overrideSource || sourceFilter;
    const targetCount = count || questionCountTarget;

    try {
      const freshQuestions = await generateDynamicMcqExam({
        source: targetSource,
        count: targetCount,
        references,
        languageMode,
      });

      if (freshQuestions.length > 0) {
        setMcqs(freshQuestions);
        handleResetExam();
        showNotification(
          isAr
            ? `تم توليد امتحان جديد بـ ${freshQuestions.length} أسئلة مختلفة (${targetSource === 'books' ? 'من مراجع التطبيق' : targetSource === 'external_board' ? 'من خارج الكتب - بورد دولي' : 'مختلط'})`
            : `New exam generated with ${freshQuestions.length} fresh questions (${targetSource === 'books' ? 'Uploaded Books' : targetSource === 'external_board' ? 'External Board' : 'Mixed'})!`
        );
      }
    } catch (err) {
      console.warn('Failed to generate fresh exam:', err);
      showNotification(isAr ? 'تعذر توليد أسئلة جديدة. يرجى المحاولة ثانية.' : 'Failed to generate new questions.');
    } finally {
      setIsGeneratingExam(false);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    if (isExamSubmitted && mode === 'exam') return;

    // Start 5-minute timer automatically upon answering the first question
    if (mode === 'exam' && !hasStartedTimer && !isExamSubmitted) {
      setHasStartedTimer(true);
      setIsTimerRunning(true);
      setIsTimeUp(false);
    }

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

  const handleSubmitExam = (timedOut = false) => {
    setIsExamSubmitted(true);
    setIsTimerRunning(false);
    if (timedOut) {
      setIsTimeUp(true);
    }

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

    if (timedOut) {
      showNotification(isAr ? '⏰ انتهى وقت الامتحان المحدد (5 دقائق)! END' : '⏰ Time is up! Exam ended (END)');
    } else {
      showNotification(isAr ? `اكتمل الامتحان! النتيجة: ${correctCount}/${mcqs.length} (${accuracy}%)` : `Exam Completed! Score: ${correctCount}/${mcqs.length} (${accuracy}%)`);
    }
  };

  const handleResetExam = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setIsExamSubmitted(false);
    setCurrentIndex(0);
    setTimerSeconds(EXAM_DURATION_SECONDS);
    setIsTimerRunning(false);
    setHasStartedTimer(false);
    setIsTimeUp(false);
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

  const totalCount = mcqs.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const remainingCount = Math.max(0, totalCount - answeredCount);
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  // Circular gauge math (radius 24, circumference 2 * pi * r ~ 150.8)
  const circleRadius = 24;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleStrokeDashoffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>{isAr ? 'بنك أسئلة جراحة الأوعية الدموية المتجدد وامتحانات البورد' : 'Dynamic Vascular Board & FRCS Examination Engine'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isAr ? 'الأسئلة السريرية ونظام الامتحانات' : 'MCQs & Exam Mode'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'تتغير الأسئلة وتتجدد في كل امتحان: تشمل مراجع التطبيق وإرشادات ESVS وبوردات جراحة الأوعية العالمية من خارجها.'
              : 'Dynamic question engine: generates fresh questions each session from uploaded books & guidelines + external International Boards (FEBVS, ABS, FRCS).'}
          </p>
        </div>

        {/* Action Controls & Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Practice vs Timed Exam Mode Selector */}
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
              {isAr ? 'نمط التدريب' : 'Practice Mode'}
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
              {isAr ? 'نمط الامتحان (5 دقائق)' : 'Timed Exam (5m)'}
            </button>
          </div>

          {/* Generate New Exam / Shuffle Questions Button */}
          <button
            onClick={() => handleGenerateFreshExam()}
            disabled={isGeneratingExam}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-teal-950/40 cursor-pointer disabled:opacity-60"
            title={isAr ? 'توليد امتحان جديد بأسئلة مختلفة كلياً' : 'Generate new exam with completely different questions'}
          >
            <Shuffle className={`w-3.5 h-3.5 ${isGeneratingExam ? 'animate-spin' : ''}`} />
            <span>
              {isGeneratingExam
                ? (isAr ? 'جاري توليد أسئلة جديدة...' : 'Generating...')
                : (isAr ? '🔄 تغيير وتوليد أسئلة جديدة' : '🔄 New Questions')}
            </span>
          </button>
        </div>
      </div>

      {/* Source Selector & Question Pool Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Source Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>{isAr ? 'مصدر الأسئلة:' : 'Question Source:'}</span>
          </span>

          <button
            onClick={() => {
              setSourceFilter('mixed');
              handleGenerateFreshExam('mixed');
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
              sourceFilter === 'mixed'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>🌟</span>
            <span>{isAr ? 'مختلط (كتب + بورد خارجي)' : 'Mixed (Books + Global)'}</span>
          </button>

          <button
            onClick={() => {
              setSourceFilter('books');
              handleGenerateFreshExam('books');
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
              sourceFilter === 'books'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-300" />
            <span>{isAr ? 'من كتب ومراجع التطبيق' : 'Uploaded Books & ESVS'}</span>
          </button>

          <button
            onClick={() => {
              setSourceFilter('external_board');
              handleGenerateFreshExam('external_board');
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
              sourceFilter === 'external_board'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-purple-300" />
            <span>{isAr ? 'من خارج الكتب (بورد دولي FEBVS/ABS)' : 'External Global Boards'}</span>
          </button>
        </div>

        {/* Count Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">{isAr ? 'عدد الأسئلة:' : 'Count:'}</span>
          {[5, 10, 15].map(cnt => (
            <button
              key={cnt}
              onClick={() => {
                setQuestionCountTarget(cnt);
                handleGenerateFreshExam(sourceFilter, cnt);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                questionCountTarget === cnt
                  ? 'bg-slate-750 text-teal-300 font-bold border border-teal-500/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-750'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Header Status Bar: Timer, Circular Progress Indicator, and Submit */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: 5-minute timer & circular progress gauge */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 5-Minute Timer (starts on 1st answer, shows END when done) */}
          {mode === 'exam' && (
            <div
              className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-1.5 rounded-xl border transition-all ${
                isTimeUp
                  ? 'bg-rose-500/25 border-rose-500 text-rose-400 ring-2 ring-rose-500/40 shadow-lg shadow-rose-950 animate-pulse'
                  : timerSeconds < 60 && hasStartedTimer
                  ? 'bg-red-500/15 border-red-500/40 text-red-400 animate-pulse'
                  : hasStartedTimer
                  ? 'bg-slate-800 border-teal-500/50 text-teal-300'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300'
              }`}
              title={
                isTimeUp
                  ? (isAr ? 'انتهى وقت الامتحان (5 دقائق)' : 'Time is up! Exam ended')
                  : hasStartedTimer
                  ? (isAr ? 'المؤقت يعد تنازلياً' : 'Timer running')
                  : (isAr ? 'يبدأ المؤقت 5 دقائق تلقائياً مع إجابة أول سؤال' : '5-minute timer starts automatically with 1st answer')
              }
            >
              <Timer className={`w-4 h-4 ${isTimeUp ? 'text-rose-400 animate-bounce' : hasStartedTimer ? 'text-teal-400' : 'text-slate-400'}`} />
              {isTimeUp ? (
                <span className="font-black text-rose-400 tracking-widest text-sm sm:text-base">END</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>{formatTimer(timerSeconds)}</span>
                  {!hasStartedTimer && !isExamSubmitted && (
                    <span className="text-[10px] font-sans font-normal text-slate-400 border-l border-slate-700 pl-1.5 hidden sm:inline">
                      {isAr ? 'يبدأ مع أول إجابة' : 'Starts on 1st answer'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VISUAL CIRCULAR PROGRESS INDICATOR (Remaining questions gauge) */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-750">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r={circleRadius}
                  className="stroke-slate-750"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r={circleRadius}
                  className="stroke-teal-400 transition-all duration-300 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={circleStrokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[10px] font-bold font-mono text-white">
                {progressPercent}%
              </span>
            </div>

            <div className="space-y-0.2">
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span>{isAr ? `مُجاب: ${answeredCount} / ${totalCount}` : `Answered: ${answeredCount} / ${totalCount}`}</span>
              </div>
              <div className="text-[10px] font-semibold text-teal-400">
                {isAr ? `المتبقي: ${remainingCount} أسئلة` : `${remainingCount} questions remaining`}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Submit or Retake */}
        <div className="flex items-center gap-2">
          {mode === 'exam' && !isExamSubmitted ? (
            <button
              onClick={() => handleSubmitExam(false)}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-purple-950"
            >
              {isAr ? 'تسليم الامتحان' : 'Submit Exam'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetExam}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة الإجابة' : 'Reset Answers'}</span>
              </button>

              <button
                onClick={() => handleGenerateFreshExam()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-teal-950"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{isAr ? 'امتحان جديد بأسئلة جديدة' : 'New Exam'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

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
                  {isAr ? 'نتيجة امتحان البورد السريري' : 'Exam Performance Summary'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? `أجبت بشكل صحيح على ${mcqs.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} من أصل ${mcqs.length} سؤال.`
                    : `You answered ${mcqs.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} out of ${mcqs.length} questions correctly.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-3xl font-black font-mono text-purple-400">
                  {mcqs.length > 0
                    ? Math.round((mcqs.filter(q => selectedAnswers[q.id] === q.correctAnswer).length / mcqs.length) * 100)
                    : 0}%
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Board Accuracy
                </span>
              </div>

              <button
                onClick={() => handleGenerateFreshExam()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                {isAr ? 'بدء امتحان جديد بأسئلة أخرى' : 'Take Another Exam'}
              </button>
            </div>
          </div>

          {/* Weak Topics Analysis */}
          {calculateWeakAreas().length > 0 && (
            <div className="pt-3 border-t border-purple-500/30">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                {isAr ? 'المجالات التي تحتاج مراجعة إضافية:' : 'Recommended High-Yield Revision Areas:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {calculateWeakAreas().map(([cat, count]) => (
                  <span
                    key={cat}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>{cat}: {count} wrong</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Layout: Question Card (8 cols) + Question Navigator & Progress (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Question Card */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            {/* Header: Question Number, Domain, and Flag */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg">
                  Question {currentIndex + 1} of {mcqs.length}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                  {currentQuestion?.category}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {currentQuestion?.sourceOrigin === 'books'
                    ? (isAr ? 'من مراجع التطبيق' : 'Book Reference')
                    : currentQuestion?.sourceOrigin === 'external_board'
                    ? (isAr ? 'بورد عالمي خارجي' : 'Global Board')
                    : 'Board Standard'}
                </span>
              </div>

              <button
                onClick={() => currentQuestion && handleToggleFlag(currentQuestion.id)}
                className={`p-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  currentQuestion && flaggedQuestions[currentQuestion.id]
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Flag question for review"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {currentQuestion && flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}
                </span>
              </button>
            </div>

            {/* Question Vignette */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-teal-300">
                {currentQuestion?.topic}
              </h3>
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                {isAr && currentQuestion?.questionAr ? currentQuestion.questionAr : currentQuestion?.questionEn}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion?.options.map(opt => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                const isCorrect = opt.id === currentQuestion.correctAnswer;
                const showInstantFeedback = mode === 'practice' && isSelected;
                const showSubmittedFeedback = isExamSubmitted;

                let optStyle = 'bg-slate-850 border-slate-750 text-slate-200 hover:border-slate-600';

                if (showSubmittedFeedback || showInstantFeedback) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100 font-bold';
                  } else if (isSelected) {
                    optStyle = 'bg-red-950/40 border-red-500/80 text-red-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-teal-950/50 border-teal-500 text-teal-100 font-bold shadow-md';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isExamSubmitted && mode === 'exam'}
                    className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${optStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm flex-1 leading-relaxed">
                      {isAr && opt.textAr ? opt.textAr : opt.textEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Rationale & Surgical Pearl */}
            {((mode === 'practice' && Boolean(selectedAnswers[currentQuestion?.id || ''])) || isExamSubmitted) && currentQuestion && (
              <div className="mt-6 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    {isAr ? 'التفسير السريري المعتمد للبورد:' : 'Clinical Rationale & Evidence:'}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    Correct Option: ({currentQuestion.correctAnswer})
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {currentQuestion.explanationEn}
                </p>

                {currentQuestion.explanationAr && (
                  <p className="text-xs text-slate-400 pt-2 border-t border-slate-850" dir="rtl">
                    {currentQuestion.explanationAr}
                  </p>
                )}

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
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  currentIndex === 0
                    ? 'bg-slate-850 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 cursor-pointer'
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
                    ? 'bg-slate-850 text-slate-600 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-500 text-white cursor-pointer shadow-md'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette & Circular Progress Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Question Navigator ({mcqs.length} Total)
              </h4>
              <span className="text-xs font-mono font-bold text-teal-400">
                {answeredCount}/{totalCount}
              </span>
            </div>

            {/* Circular Progress Gauge in Sidebar */}
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 flex items-center gap-3.5">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    className="stroke-slate-700"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    className="stroke-teal-400 transition-all duration-300 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={(2 * Math.PI * 18) - (progressPercent / 100) * (2 * Math.PI * 18)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold font-mono text-white">
                  {progressPercent}%
                </span>
              </div>
              <div className="text-xs space-y-0.5">
                <span className="text-white font-bold block">
                  {isAr ? 'نسبة إنجاز الامتحان' : 'Session Progress'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {isAr ? `${answeredCount} مجاب • ${remainingCount} متبقي` : `${answeredCount} answered • ${remainingCount} left`}
                </span>
              </div>
            </div>

            {/* Number Grid */}
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
                    key={q.id || idx}
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

            {/* Quick Action Button to Shuffle / Change questions */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => handleGenerateFreshExam()}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-teal-400 hover:text-teal-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{isAr ? 'تغيير الأسئلة بامتحان جديد' : 'Shuffle & New Questions'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
