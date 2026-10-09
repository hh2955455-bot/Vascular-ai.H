import React, { useState } from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Brain,
  Search,
  BookOpen,
  FileText,
  Layers,
  HelpCircle,
  Activity,
  HeartPulse,
  BarChart3,
  Settings,
  Sparkles,
  Library,
  BookMarked,
  Mail,
  BellRing,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  Smartphone
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    languageMode,
    references,
    userProfile,
    setIsBooksCatalogOpen,
    setIsContactDeveloperOpen,
    setIsPhonePermissionsOpen,
    setIsMedicalDisclaimerOpen
  } = useApp();
  const isAr = languageMode === 'ar';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; labelEn: string; labelAr: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'tutor', labelEn: 'AI Tutor', labelAr: 'المعلم الذكي', icon: Brain, badge: 'AI' },
    { id: 'search', labelEn: 'RAG Search', labelAr: 'البحث المرجعي', icon: Search },
    { id: 'library', labelEn: 'Reference Library', labelAr: 'مكتبة المراجع', icon: BookOpen },
    { id: 'notes', labelEn: 'Medical Notes', labelAr: 'الملاحظات الطبية', icon: FileText },
    { id: 'flashcards', labelEn: 'Flashcards', labelAr: 'البطاقات التعليمية', icon: Layers },
    { id: 'mcq', labelEn: 'MCQ & Exam Mode', labelAr: 'الأسئلة والامتحانات', icon: HelpCircle },
    { id: 'cases', labelEn: 'Clinical Cases & OSCE', labelAr: 'الحالات السريرية و OSCE', icon: Activity },
    { id: 'anatomy', labelEn: 'Anatomy Explorer', labelAr: 'مستكشف التشريح', icon: HeartPulse },
    { id: 'analytics', labelEn: 'Study Analytics', labelAr: 'تحليلات الدراسة', icon: BarChart3 },
    { id: 'settings', labelEn: 'Settings', labelAr: 'الإعدادات', icon: Settings },
  ];

  const handleMobileNav = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop / Tablet Sidebar (Sleek responsive width: md:w-56 lg:w-64) */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 p-3 lg:p-4 justify-between h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] sticky top-14 sm:top-16 select-none overflow-y-auto transition-colors duration-200">
        <div className="space-y-4 lg:space-y-5">
          {/* Brand header */}
          <div className="flex items-center gap-2.5 px-1 lg:px-2">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-950/50 shrink-0">
              <HeartPulse className="w-4 h-4 lg:w-5 lg:h-5 text-slate-950" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                Vascular<span className="text-teal-500 dark:text-teal-400">AI</span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">Surgery Workspace</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-medium transition cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} />
                    <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Uploaded Books & Guidelines Indicator Button */}
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800/60">
          <button
            onClick={() => setIsBooksCatalogOpen(true)}
            className="w-full flex items-center justify-between p-2.5 lg:p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-500/60 text-teal-700 dark:text-teal-300 font-semibold text-xs transition cursor-pointer shadow-sm group"
            title={isAr ? 'عرض وتصفح قائمة الكتب والمراجع المرفوعة بالتطبيق' : 'View all uploaded & indexed medical textbooks'}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 group-hover:scale-110 transition shrink-0">
                <Library className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-bold text-white text-xs leading-tight truncate">
                  {isAr ? 'الكتب والمراجع' : 'Uploaded Books'}
                </p>
                <p className="text-[10px] text-teal-400 font-mono truncate">
                  {isAr ? 'مفهرسة في البحث' : 'Active in Search'}
                </p>
              </div>
            </div>
            <span className="px-1.5 lg:px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-xs font-mono font-black border border-teal-400/40 shrink-0">
              {references.length}
            </span>
          </button>

          {/* Contact Developer Button (hh2955455@gmail.com) */}
          <button
            onClick={() => setIsContactDeveloperOpen(true)}
            className="w-full flex items-center justify-between p-2 lg:p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-500/60 text-indigo-300 font-semibold text-xs transition cursor-pointer shadow-sm group"
            title={isAr ? 'تواصل مع مبرمج التطبيق: hh2955455@gmail.com' : 'Contact Developer: hh2955455@gmail.com'}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-bold text-white text-[11px] leading-tight truncate">
                  {isAr ? 'تواصل مع المبرمج' : 'Contact Dev'}
                </p>
                <p className="text-[10px] text-indigo-400/90 font-mono truncate max-w-[110px] lg:max-w-[130px]">
                  hh2955455@gmail.com
                </p>
              </div>
            </div>
            <span className="text-[10px] text-indigo-400 font-bold shrink-0">
              ✉
            </span>
          </button>

          {/* Phone Permissions Quick Trigger */}
          <button
            onClick={() => setIsPhonePermissionsOpen(true)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] transition cursor-pointer"
            title={isAr ? 'إدارة أذونات وإشعارات الهاتف' : 'Manage Phone Alerts'}
          >
            <span className="flex items-center gap-1.5">
              <BellRing className="w-3 h-3 text-teal-400" />
              <span>{isAr ? 'أذونات وإشعارات الهاتف' : 'Phone Permissions'}</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (High touch-target, flawless spacing) */}
      <nav
        aria-label={isAr ? 'شريط التنقل السفلي للهاتف' : 'Mobile Bottom Navigation'}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-lg flex items-center justify-around py-1 px-1 h-14 transition-colors duration-200"
      >
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[9px] font-medium transition cursor-pointer ${
            activeTab === 'dashboard' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* 2. AI Tutor */}
        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[9px] font-medium transition cursor-pointer ${
            activeTab === 'tutor' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4 mb-0.5" />
          <span>{isAr ? 'المعلم' : 'Tutor'}</span>
        </button>

        {/* 3. Search */}
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[9px] font-medium transition cursor-pointer ${
            activeTab === 'search' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>{isAr ? 'البحث' : 'Search'}</span>
        </button>

        {/* 4. Library */}
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[9px] font-medium transition cursor-pointer ${
            activeTab === 'library' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>{isAr ? 'المكتبة' : 'Library'}</span>
        </button>

        {/* 5. Exam */}
        <button
          onClick={() => setActiveTab('mcq')}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[9px] font-medium transition cursor-pointer ${
            activeTab === 'mcq' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          <span>{isAr ? 'امتحان' : 'Exam'}</span>
        </button>

        {/* 6. All Features Drawer Trigger (More / المزيد) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[9px] font-medium transition cursor-pointer ${
            isMobileMenuOpen ? 'text-teal-300' : 'text-slate-300 hover:text-white'
          }`}
          title={isAr ? 'كل الأدوات والأقسام' : 'All Sections'}
        >
          <div className="relative">
            <Menu className="w-4 h-4 mb-0.5 text-teal-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute -top-0.5 -right-1"></span>
          </div>
          <span>{isAr ? 'المزيد' : 'More'}</span>
        </button>
      </nav>

      {/* Mobile All-Features Drawer (Bottom Sheet Modal) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
        >
          <div
            className="w-full max-h-[85vh] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/80 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <HeartPulse className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isAr ? 'كل أقسام وخصائص التطبيق' : 'All Features & Workspace'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {userProfile.name} • {userProfile.specialty}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: Grid of all navigation links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-2">
                  {isAr ? 'أدوات الدراسة والتدريب السريري' : 'Study & Clinical Tools'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMobileNav(item.id)}
                        className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-left transition cursor-pointer border ${
                          isActive
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500 shadow-md'
                            : 'bg-slate-850 border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-teal-400'}`} />
                        <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Modals & Actions in drawer */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {isAr ? 'أدوات مساعدة وإعدادات' : 'Utilities & Support'}
                </p>
                <div className="space-y-2">
                  {/* Books catalog */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsBooksCatalogOpen(true);
                    }}
                    className="w-full p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-semibold text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Library className="w-4 h-4 text-teal-400" />
                      <span>{isAr ? 'عرض الكتب والمراجع المرفوعة' : 'View Uploaded Books'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-xs font-mono font-bold">
                      {references.length}
                    </span>
                  </button>

                  {/* Contact developer */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsContactDeveloperOpen(true);
                    }}
                    className="w-full p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>{isAr ? 'تواصل مع المبرمج (hh2955455@gmail.com)' : 'Contact Developer'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                  </button>

                  {/* Phone permissions */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsPhonePermissionsOpen(true);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-800/70 border border-slate-750 text-slate-300 font-semibold text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <BellRing className="w-4 h-4 text-teal-400" />
                      <span>{isAr ? 'أذونات الهاتف وإشعارات القراءة' : 'Phone Alerts & Permissions'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  {/* Clinical safety disclaimer */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMedicalDisclaimerOpen(true);
                    }}
                    className="w-full p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'إخلاء المسؤولية السريرية' : 'Clinical Safety Disclaimer'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
