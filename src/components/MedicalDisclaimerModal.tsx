import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle, Shield, X } from 'lucide-react';

export const MedicalDisclaimerModal: React.FC = () => {
  const { isMedicalDisclaimerOpen, setIsMedicalDisclaimerOpen, languageMode } = useApp();

  if (!isMedicalDisclaimerOpen) return null;

  const isAr = languageMode === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 text-slate-100">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                {isAr ? 'إخلاء المسؤولية الطبية التعليمية' : 'Medical Educational Disclaimer'}
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                {isAr ? 'تنبيه أمان سريري إلزامي' : 'Mandatory Clinical Safety Notice'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMedicalDisclaimerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs sm:text-sm font-medium">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>This application is intended strictly for educational and academic study purposes.</strong> It does not replace independent clinical judgment, institutional hospital protocols, qualified specialist consultation, or real-time regional medical guidelines.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs sm:text-sm text-slate-300" dir="rtl">
            <p className="font-semibold text-slate-200 mb-1">إشعار الأمان الطبي (اللغة العربية):</p>
            هذا التطبيق مخصص لأغراض الدراسة والتعليم الطبي التخصصي فقط. لا يحل هذا النظام الذكي محل القرار السريري المستقل للجراح، أو البروتوكولات المعتمدة بالمستشفيات، أو الاستشارة الطبية التخصصية، أو الإرشادات السريرية الحالية. في الحالات الطارئة، يجب دائماً التحقق من المراجع الرسمية المعتمدة.
          </div>

          <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All AI citations must be verified against primary sources (Rutherford, ESVS, SVS).</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI illustrations are conceptual diagrams and must never be used as diagnostic radiological images.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Drug dosages (e.g. Heparin, Alteplase) require institutional pharmacist & bedside verification.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsMedicalDisclaimerOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            {isAr ? 'أفهم وأوافق على المتابعة' : 'I Understand & Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};
