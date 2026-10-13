import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { languageMode } = useApp();
  const isAr = languageMode === 'ar';
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA standalone app, hide the install button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 transition text-xs font-semibold cursor-pointer shadow-xs"
        title={isAr ? 'تثبيت التطبيق على جهازك للوصول السريع بدون إنترنت' : 'Install Vascular AI app for instant offline study'}
      >
        <Download className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span className="hidden sm:inline">
          {isAr ? 'تثبيت التطبيق' : 'Install App'}
        </span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition text-xs font-semibold cursor-pointer"
          title={isAr ? 'تثبيت على أجهزة آبل (iOS)' : 'Install on Apple iOS'}
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="hidden sm:inline">
            {isAr ? 'تثبيت PWA' : 'Install App'}
          </span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {isAr ? 'تثبيت على آيفون / آيباد' : 'Install on iPhone & iPad'}
                    </h3>
                    <p className="text-[11px] text-slate-400">Vascular AI Study Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 border border-slate-750">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <span className="font-semibold text-white block">
                      {isAr ? 'انقر على زر المشاركة' : 'Tap Share Button'}
                    </span>
                    <span className="text-slate-400">
                      {isAr
                        ? 'في متصفح Safari، اضغط على أيقونة المشاركة في أسفل الشاشة.'
                        : 'In Safari, tap the Share icon at the bottom of the screen.'}
                    </span>
                    <Share className="w-4 h-4 text-teal-400 inline ml-1 align-sub" />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 border border-slate-750">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <span className="font-semibold text-white block">
                      {isAr ? 'إضافة إلى الصفحة الرئيسية' : 'Add to Home Screen'}
                    </span>
                    <span className="text-slate-400">
                      {isAr
                        ? 'مرر للأسفل واختر "إضافة إلى الصفحة الرئيسية".'
                        : 'Scroll down and select "Add to Home Screen".'}
                    </span>
                    <PlusSquare className="w-4 h-4 text-teal-400 inline ml-1 align-sub" />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 border border-slate-750">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <span className="font-semibold text-white block">
                      {isAr ? 'المراجعة بدون اتصال' : 'Full Offline Access'}
                    </span>
                    <span className="text-slate-400">
                      {isAr
                        ? 'افتح التطبيق من شاشتك الرئيسية وراجع الحالات والملخصات حتى عند انقطاع الإنترنت.'
                        : 'Launch from your home screen for full offline study and cached case reviews.'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-450 text-slate-950 font-bold text-xs transition"
              >
                {isAr ? 'فهمت، حسناً' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
