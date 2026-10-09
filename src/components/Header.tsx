import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ShieldAlert,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Languages,
  Command,
  Stethoscope,
  BookOpen
} from 'lucide-react';

interface TimeGreeting {
  ar: string;
  en: string;
  icon: 'sunrise' | 'sun' | 'sunset' | 'moon';
  accentColor: string;
  badgeBg: string;
}

const getTimeGreeting = (hour: number): TimeGreeting => {
  if (hour >= 5 && hour < 12) {
    return {
      ar: 'صباح الخير',
      en: 'Good morning',
      icon: 'sunrise',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      ar: 'طاب يومك',
      en: 'Good afternoon',
      icon: 'sun',
      accentColor: 'text-amber-300',
      badgeBg: 'bg-amber-400/10 border-amber-400/30'
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      ar: 'مساء الخير',
      en: 'Good evening',
      icon: 'sunset',
      accentColor: 'text-orange-400',
      badgeBg: 'bg-orange-500/10 border-orange-500/30'
    };
  } else {
    return {
      ar: 'طابت ليلتك',
      en: 'Good night',
      icon: 'moon',
      accentColor: 'text-indigo-300',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/30'
    };
  }
};

export const Header: React.FC = () => {
  const {
    userProfile,
    languageMode,
    setLanguageMode,
    darkMode,
    setDarkMode,
    setIsCommandPaletteOpen,
    setIsMedicalDisclaimerOpen,
    setIsBooksCatalogOpen,
    references,
    notification
  } = useApp();

  const isAr = languageMode === 'ar';

  // Dynamic Time-of-Day Greeting (changes morning / afternoon / evening / night)
  const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const timeGreeting = getTimeGreeting(currentHour);
  const doctorLastName = userProfile.name.split(' ')[1] || userProfile.name.split(' ')[0] || '';

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-900/95 px-2 sm:px-4 md:px-6 backdrop-blur-md gap-1.5 sm:gap-3 flex-nowrap select-none overflow-x-clip">
      {/* Left side: Dynamic Compact Time Greeting and Global Search */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
        {/* Dynamic Compact Greeting Chip: changes icon & phrase with time of day, never wraps or stacks */}
        <div
          className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl border text-[11px] sm:text-xs select-none shadow-xs max-w-[105px] xs:max-w-[140px] sm:max-w-[185px] md:max-w-[220px] truncate transition-colors ${timeGreeting.badgeBg}`}
          title={isAr ? `${timeGreeting.ar} دكتور ${doctorLastName}` : `${timeGreeting.en}, Dr. ${doctorLastName}`}
        >
          {timeGreeting.icon === 'sunrise' && (
            <Sunrise className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          )}
          {timeGreeting.icon === 'sun' && (
            <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          )}
          {timeGreeting.icon === 'sunset' && (
            <Sunset className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          )}
          {timeGreeting.icon === 'moon' && (
            <Moon className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
          )}
          <span className="truncate font-semibold text-slate-200">
            {isAr
              ? `${timeGreeting.ar} ${doctorLastName ? `د. ${doctorLastName}` : ''}`
              : `${timeGreeting.en}${doctorLastName ? `, Dr. ${doctorLastName}` : ''}`}
          </span>
        </div>

        {/* Global Search: Desktop/Tablet full input bar */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md min-w-0">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-teal-500/50 text-slate-400 hover:text-slate-200 transition text-xs shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <Search className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate text-xs">
                {isAr
                  ? 'ابحث في مراجع الأوعية (رذرفورد، ESVS)...'
                  : 'Search vascular knowledge...'}
              </span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono text-[10px] shrink-0 border border-slate-600">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Global Search: Mobile icon button (compact & clean) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-teal-500/50 text-slate-300 hover:text-white transition text-xs shadow-xs cursor-pointer shrink-0"
          title={isAr ? 'البحث السريع في المراجع (Cmd+K)' : 'Quick Search (Cmd+K)'}
          aria-label={isAr ? 'بحث سريع' : 'Quick Search'}
        >
          <Search className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="hidden xs:inline text-[11px] text-slate-400 ml-1">
            {isAr ? 'بحث' : 'Search'}
          </span>
        </button>
      </div>

      {/* Right side: Perfectly aligned, non-overlapping action items */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 flex-nowrap">
        {/* Books & Guidelines Catalog Button */}
        <button
          onClick={() => setIsBooksCatalogOpen(true)}
          className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/35 text-teal-300 hover:bg-teal-500/25 hover:border-teal-500/70 transition text-xs font-bold cursor-pointer shadow-xs group shrink-0"
          title={isAr ? "اضغط هنا لتصفح الكتب والمراجع المرفوعة بالتطبيق" : "Click to view uploaded & indexed textbooks"}
          aria-label={isAr ? "الكتب المرفوعة" : "Uploaded Books"}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0 group-hover:scale-110 transition" />
          <span className="hidden xl:inline text-xs">
            {isAr ? 'الكتب' : 'Books'}
          </span>
          <span className="px-1.5 py-0.2 rounded-md bg-teal-500/30 text-[10px] font-mono font-black text-teal-200 border border-teal-400/30 shrink-0">
            {references.length}
          </span>
        </button>

        {/* Desktop Language switcher (3-segment pill) */}
        <div className="hidden md:flex items-center rounded-xl bg-slate-800/90 border border-slate-700/80 p-0.5 text-xs shrink-0">
          <button
            onClick={() => setLanguageMode('en')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
              languageMode === 'en'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="English Only"
          >
            EN
          </button>
          <button
            onClick={() => setLanguageMode('bilingual')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
              languageMode === 'bilingual'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Bilingual: Arabic + English Medical Terminology"
          >
            EN+عربي
          </button>
          <button
            onClick={() => setLanguageMode('ar')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
              languageMode === 'ar'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Arabic Mode"
          >
            عربي
          </button>
        </div>

        {/* Mobile Language switcher: 1 compact cycle button (doesn't crowd mobile bar) */}
        <button
          onClick={() => {
            if (languageMode === 'en') setLanguageMode('bilingual');
            else if (languageMode === 'bilingual') setLanguageMode('ar');
            else setLanguageMode('en');
          }}
          className="md:hidden flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-teal-300 hover:text-white transition text-[11px] font-bold shadow-xs shrink-0 cursor-pointer"
          title={isAr ? "اضغط لتبديل اللغة (إنجليزي / ثنائي / عربي)" : "Tap to toggle language (EN / Bilingual / AR)"}
        >
          <Languages className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="font-semibold">
            {languageMode === 'ar' ? 'عربي' : languageMode === 'bilingual' ? 'ثنائي' : 'EN'}
          </span>
        </button>

        {/* Safety Disclaimer Button (visible on tablet and up so mobile stays uncluttered) */}
        <button
          onClick={() => setIsMedicalDisclaimerOpen(true)}
          className="hidden sm:flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition text-xs font-medium cursor-pointer shrink-0"
          title="Clinical Safety & Disclaimer"
          aria-label="Clinical Disclaimer"
        >
          <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="hidden 2xl:inline">{isAr ? 'إخلاء المسؤولية' : 'Disclaimer'}</span>
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition cursor-pointer shrink-0"
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />}
        </button>

        {/* Profile Avatar Badge */}
        <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-slate-800 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-teal-900/40 shrink-0">
            <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="hidden 2xl:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">
              {userProfile.name}
            </p>
            <p className="text-[10px] text-teal-400 font-medium leading-none">
              {userProfile.specialty}
            </p>
          </div>
        </div>
      </div>

      {/* Floating notification toast if active */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/95 border border-teal-500/60 shadow-2xl text-slate-100 text-xs sm:text-sm animate-in slide-in-from-bottom duration-200">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>{notification}</span>
        </div>
      )}
    </header>
  );
};
