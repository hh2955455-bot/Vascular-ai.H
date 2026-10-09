import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Flame
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { userProfile, setTutorInitialPrompt, setActiveTab, languageMode } = useApp();
  const isAr = languageMode === 'ar';

  const weeklyStudyHours = [
    { day: 'Mon', hours: 4.2 },
    { day: 'Tue', hours: 6.5 },
    { day: 'Wed', hours: 5.8 },
    { day: 'Thu', hours: 7.2 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 8.5 },
    { day: 'Sun', hours: 6.3 },
  ];

  const specialtyBreakdown = [
    { name: 'Arterial Occlusive Disease', accuracy: 88, count: 32, strong: true },
    { name: 'Abdominal Aortic Aneurysms', accuracy: 82, count: 22, strong: true },
    { name: 'Carotid Stenosis & Stroke', accuracy: 85, count: 18, strong: true },
    { name: 'Venous & Lymphatic Disorders', accuracy: 55, count: 12, strong: false },
    { name: 'Vascular Trauma & Shunts', accuracy: 62, count: 14, strong: false },
    { name: 'Hemodialysis Access', accuracy: 68, count: 10, strong: false },
  ];

  const recommendations = [
    {
      title: 'Venous Stasis Ulcers & Deep Vein Thrombosis',
      category: 'Venous Disease',
      reason: 'Low quiz accuracy (55%). Review CEAP classification and post-thrombotic syndrome.',
      actionPrompt: 'Let us do an intensive review of Venous Disease: CEAP clinical staging, deep vein thrombosis anticoagulation, and venous stasis ulcers.'
    },
    {
      title: 'Extremity Vascular Trauma & Shunting',
      category: 'Trauma',
      reason: 'Quiz accuracy 62%. High yield for board exams.',
      actionPrompt: 'Review Extremity Vascular Trauma: hard signs, temporary intravascular shunts, saphenous vein harvest, and fasciotomy.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>{isAr ? 'لوحة تحليلات الأداء ودقة الإجابات' : 'Study Analytics & Performance Intelligence'}</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          {isAr ? 'تحليلات الدراسة والتوصيات' : 'Study Analytics Dashboard'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? 'تتبع ساعات الدراسة، أداء الأسئلة عبر فروع الجراحة، وتلقى خطط مراجعة موجهة للمناطق الأقل دقة.'
            : 'Track study hours, specialty retention, and launch personalized AI reviews targeted to your weak areas.'}
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Study Time</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{userProfile.totalStudyHours}h</p>
          <span className="text-[11px] text-teal-400 font-medium">+8.5h this week</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>MCQ Board Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{userProfile.mcqAccuracy}%</p>
          <span className="text-[11px] text-slate-400 font-medium">{userProfile.mcqsCompleted} questions answered</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{userProfile.streakDays} Days</p>
          <span className="text-[11px] text-slate-400 font-medium">Daily habit active</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Mastered Cards</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">{userProfile.flashcardsMastered}</p>
          <span className="text-[11px] text-slate-400 font-medium">SRS retention stable</span>
        </div>
      </div>

      {/* Main Grid: Weekly Chart & Specialty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Hours (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Weekly Study Time (Hours / Day)</span>
            </h3>
            <span className="text-xs font-mono text-teal-400">Total: 42.5h</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2">
            {weeklyStudyHours.map((d, i) => {
              const max = 10;
              const heightPct = (d.hours / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-mono text-slate-400">{d.hours}h</span>
                  <div className="w-full max-w-[36px] bg-slate-800 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-xl transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialty Performance Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Vascular Domain Mastery</span>
          </h3>

          <div className="space-y-3.5">
            {specialtyBreakdown.map((s, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{s.name}</span>
                  <span className={`font-mono font-bold ${s.strong ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {s.accuracy}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.strong ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Study Recommendations (PRD Section 31) */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-purple-800/40 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Targeted AI Study Recommendations (Based on Diagnostic Weak Areas)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                  Priority Review
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                  {rec.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {rec.reason}
                </p>
              </div>

              <button
                onClick={() => {
                  setTutorInitialPrompt(rec.actionPrompt);
                  setActiveTab('tutor');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-purple-950"
              >
                <span>Start Recommended Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
