import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Brain,
  Upload,
  FileText,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Activity,
  Library,
  BellRing,
  Smartphone
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    userProfile,
    setActiveTab,
    setTutorInitialPrompt,
    languageMode,
    notes,
    references,
    setIsBooksCatalogOpen,
    setIsPhonePermissionsOpen
  } = useApp();

  const isAr = languageMode === 'ar';

  const continueStudyingCards = [
    {
      id: 'topic-ali',
      titleEn: 'Acute Limb Ischemia (ALI)',
      titleAr: 'إقفار الأطراف الحاد (ALI)',
      chapter: "Rutherford Ch. 52 & ESVS 2024",
      progress: 65,
      color: 'from-amber-500 to-red-600',
      actionPrompt: 'Let us review Acute Limb Ischemia: evaluation, Rutherford classification IIa vs IIb, and surgical embolectomy vs fasciotomy.'
    },
    {
      id: 'topic-aaa',
      titleEn: 'Abdominal Aortic Aneurysm (AAA)',
      titleAr: 'تمدد الشريان الأورطي البطني (AAA)',
      chapter: 'SVS & ESVS Guidelines 2023',
      progress: 40,
      color: 'from-blue-600 to-indigo-700',
      actionPrompt: 'Review Abdominal Aortic Aneurysms: repair diameter thresholds (5.5cm/5.0cm), EVAR anatomical criteria, and permissive hypotension in rupture.'
    },
    {
      id: 'topic-carotid',
      titleEn: 'Carotid Endarterectomy & Stenting',
      titleAr: 'استئصال باطنة السباتي ودعاماته',
      chapter: 'NASCET & ESVS 2023 Guidelines',
      progress: 80,
      color: 'from-teal-500 to-emerald-700',
      actionPrompt: 'Review Carotid Endarterectomy: timing after TIA (<14 days), NASCET criteria, and cranial nerves at risk (XII, X, VII).'
    }
  ];

  const recommendations = [
    {
      id: 'rec-venous',
      titleEn: 'Deep Venous Disease & Post-Thrombotic Syndrome',
      titleAr: 'أمراض الأوردة العميقة ومتلازمة ما بعد الخثار',
      reasonEn: 'Identified as a weak topic in your recent vascular board quiz.',
      reasonAr: 'تم تحديده كنقطة ضعف في اختبار الأوعية الدموية الأخير.',
      tag: 'Weak Area',
      actionPrompt: 'Explain Deep Venous Thrombosis (DVT), phlegmasia cerulea dolens, venous thrombectomy, and CEAP classification.'
    },
    {
      id: 'rec-trauma',
      titleEn: 'Extremity Vascular Trauma & Hard Signs',
      titleAr: 'إصابات أوعية الأطراف والعلامات الأكيدة',
      reasonEn: 'High-yield exam topic in FRCS / Vascular Board.',
      reasonAr: 'موضوع عالي الأهمية في امتحانات البورد والزمالة.',
      tag: 'High Yield',
      actionPrompt: 'Explain Hard Signs of vascular trauma, temporary intravascular shunting, and indications for fasciotomy.'
    },
    {
      id: 'rec-dialysis',
      titleEn: 'Hemodialysis Access & Steal Syndrome (DASS)',
      titleAr: 'وصلات الغسيل الكلوي ومتلازمة السرقة الشريانية',
      reasonEn: 'Crucial for surgical resident operative rotations.',
      reasonAr: 'أساسي لتدريب مقيمي جراحة الأوعية في العمليات.',
      tag: 'Surgical Skills',
      actionPrompt: 'Explain surgical creation of Cimino-Brescia fistula, the Rule of 6s, and management of Dialysis-Associated Steal Syndrome.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Hero stats */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'بيئة دراسة جراحة الأوعية الدموية الرقمية' : 'Vascular Surgery Digital Study Workspace'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isAr ? 'لوحة دراسة ومراجعة جراحة الأوعية الدموية' : 'Vascular Surgery Academic Study Center'}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              {isAr
                ? 'مساحتك التفاعلية لقراءة المراجع، استرجاع المعلومات بذكاء اصطناعي، وممارسة الحالات السريرية والأسئلة.'
                : 'Transform uploaded textbooks and clinical guidelines into structured study notes, flashcards, interactive cases, and board questions.'}
            </p>
          </div>

          {/* Quick study metrics counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsBooksCatalogOpen(true)}
              className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-500/60 transition cursor-pointer text-center group"
              title={isAr ? 'عرض وتصفح قائمة الكتب والمراجع المرفوعة' : 'View all uploaded & indexed medical references'}
            >
              <div className="flex items-center justify-center gap-1.5 text-teal-400 mb-1 group-hover:scale-110 transition">
                <Library className="w-4 h-4" />
                <span className="text-lg font-extrabold text-white">{references.length}</span>
              </div>
              <p className="text-[11px] text-teal-300 font-bold">{isAr ? 'كتب ومراجع' : 'Active Books'}</p>
            </button>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-lg font-bold text-white">{userProfile.streakDays}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{isAr ? 'أيام متتالية' : 'Day Streak'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-bold text-white">{userProfile.totalStudyHours}h</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{isAr ? 'ساعات دراسة' : 'Study Time'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-lg font-bold text-white">{userProfile.mcqAccuracy}%</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{isAr ? 'دقة الأسئلة' : 'MCQ Accuracy'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (PRD Section 6) */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
          {isAr ? 'الإجراءات السريعة' : 'Quick Actions'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setIsBooksCatalogOpen(true)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-teal-500/10 border border-teal-500/40 hover:border-teal-500 hover:bg-teal-500/20 transition group cursor-pointer shadow-md"
          >
            <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300 group-hover:scale-110 transition mb-2">
              <Library className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal-200">{isAr ? 'الكتب المرفوعة' : 'Uploaded Books'}</span>
            <span className="text-[10px] text-teal-400 font-mono font-semibold">{references.length} {isAr ? 'مراجع متاحة' : 'Indexed'}</span>
          </button>

          <button
            onClick={() => {
              setTutorInitialPrompt('Explain Acute Limb Ischemia, the 6 Ps, Rutherford classification, and emergency surgical protocol.');
              setActiveTab('tutor');
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 transition group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/20 transition mb-2">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">{isAr ? 'اسأل الذكاء الاصطناعي' : 'Ask AI'}</span>
            <span className="text-[10px] text-slate-400">{isAr ? 'معلم جراحة الأوعية' : 'Vascular Tutor'}</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 transition group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">{isAr ? 'رفع مرجع طبي' : 'Upload Reference'}</span>
            <span className="text-[10px] text-slate-400">{isAr ? 'فهرسة الكتب و PDF' : 'PDF, Guidelines'}</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 transition group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">{isAr ? 'إنشاء ملاحظة' : 'Create Note'}</span>
            <span className="text-[10px] text-slate-400">{isAr ? 'ملخص عالي القيمة' : 'High-Yield Note'}</span>
          </button>

          <button
            onClick={() => setActiveTab('mcq')}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 transition group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition mb-2">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">{isAr ? 'توليد أسئلة MCQs' : 'Generate MCQs'}</span>
            <span className="text-[10px] text-slate-400">{isAr ? 'امتحانات البورد' : 'Board Exam Mode'}</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 transition group cursor-pointer"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">{isAr ? 'بطاقات تعليمية' : 'Flashcards'}</span>
            <span className="text-[10px] text-slate-400">{isAr ? 'التكرار المتباعد' : 'SRS Spaced Review'}</span>
          </button>
        </div>
      </div>

      {/* Highlights: Phone Permissions for Reading Topics Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 shrink-0">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                {isAr ? 'أذونات الهاتف وإشعارات مواضيع القراءة' : 'Phone Permissions & Reading Alerts'}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                {isAr ? 'تنبيهات فورية' : 'Live Alerts'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              {isAr
                ? 'فعّل إشعارات الهاتف لتصلك يومياً موضوعات جراحية جديدة وحالات سريرية للمراجعة وفق إرشادات ESVS و Rutherford.'
                : 'Enable phone notifications to receive daily vascular surgical topics, guideline updates, and review questions.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPhonePermissionsOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-teal-950"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{isAr ? 'السماح بالأذونات وتجربة إشعار' : 'Grant & Test Alerts'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Continue Studying & Recommended Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Studying (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'متابعة الدراسة' : 'Continue Studying'}</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">3 active topics</span>
          </div>

          <div className="space-y-3">
            {continueStudyingCards.map(card => (
              <div
                key={card.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-teal-400">{card.chapter}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {isAr ? card.titleAr : card.titleEn}
                  </h4>
                  <div className="w-full max-w-md bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-500`}
                      style={{ width: `${card.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isAr ? `مستوى التقدم: ${card.progress}%` : `Progress: ${card.progress}%`}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTutorInitialPrompt(card.actionPrompt);
                    setActiveTab('tutor');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white text-teal-400 font-semibold text-xs transition cursor-pointer shrink-0"
                >
                  <span>{isAr ? 'متابعة' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Recent Notes Preview */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'الملاحظات الحديثة' : 'Recent Study Notes'}</span>
              </h3>
              <button
                onClick={() => setActiveTab('notes')}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
              >
                {isAr ? 'عرض الكل' : 'View all'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {notes.slice(0, 2).map(n => (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notes')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[10px] text-emerald-400">
                      {n.category}
                    </span>
                    <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                    {isAr && n.titleAr ? n.titleAr : n.title}
                  </h5>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {n.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations Column (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>{isAr ? 'توصيات الذكاء الاصطناعي' : 'AI Study Recommendations'}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {recommendations.map(rec => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-purple-500/40 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    rec.tag === 'Weak Area'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : rec.tag === 'High Yield'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  }`}>
                    {rec.tag}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                    {isAr ? rec.titleAr : rec.titleEn}
                  </h4>
                  <p className="text-xs text-slate-400 leading-snug">
                    {isAr ? rec.reasonAr : rec.reasonEn}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTutorInitialPrompt(rec.actionPrompt);
                    setActiveTab('tutor');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  <span>{isAr ? 'بدء المراجعة المقترحة' : 'Start Recommended Review'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Launch Clinical Case Simulation */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-800/40 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
              <Activity className="w-4 h-4" />
              <span>{isAr ? 'محاكاة الحالات السريرية' : 'Clinical Case Simulator'}</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {isAr ? 'حالة طوارئ: إقفار حاد بالطرف السفلي' : 'Emergency Simulation: Acute Limb Ischemia'}
            </h4>
            <p className="text-xs text-slate-300">
              {isAr ? 'قيم المريضة سريرياً، حدد مرحلة رذرفورد، واتخذ القرار الجراحي في غرفة العمليات.' : 'Step through bedside history, 6 Ps Doppler exam, and Fogarty embolectomy vs fasciotomy decisions.'}
            </p>
            <button
              onClick={() => setActiveTab('cases')}
              className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-teal-950"
            >
              {isAr ? 'بدء المحاكاة الآن' : 'Launch Case Simulator'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
