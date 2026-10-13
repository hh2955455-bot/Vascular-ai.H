import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Stethoscope,
  Mail,
  User,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  LogOut,
  ShieldCheck,
  GraduationCap,
  AlertCircle,
  RotateCw,
  Smartphone,
  Tablet
} from 'lucide-react';
import { detectMobilePlatform } from '../services/firebase';

const COMMON_SPECIALTIES = [
  'جراحة الأوعية الدموية (Vascular Surgery)',
  'جراحة الأوعية التداخلية والقسطرة (Endovascular Surgery)',
  'مقيم جراحة أوعية دموية (Vascular Surgery Resident)',
  'زمالة جراحة الأوعية الدموية (Vascular Fellow)',
  'استشاري جراحة الأوعية (Consultant Vascular Surgeon)',
  'طب وباطنة الأوعية الدموية (Vascular Medicine)',
  'جراحة عامة (General Surgery)',
  'طالب طب بشري (Medical Student)',
  'أخرى (Other)'
];

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  canDismiss?: boolean;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  canDismiss = true
}) => {
  const {
    userProfile,
    updateUserProfile,
    languageMode,
    showNotification,
    firebaseUser,
    signInWithGoogle,
    signOutUser,
    isRegistered,
    setIsRegistered
  } = useApp();

  const isAr = languageMode === 'ar';

  const [name, setName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [specialty, setSpecialty] = useState(userProfile.specialty || 'جراحة الأوعية الدموية (Vascular Surgery)');
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [studyLevel, setStudyLevel] = useState<'student' | 'resident' | 'fellow' | 'consultant'>(userProfile.studyLevel || 'resident');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const platform = detectMobilePlatform();

  // Keep state in sync when userProfile or firebaseUser changes
  useEffect(() => {
    if (firebaseUser) {
      if (!name && firebaseUser.displayName) setName(firebaseUser.displayName);
      if (!email && firebaseUser.email) setEmail(firebaseUser.email);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (isOpen) {
      setName(userProfile.name || (firebaseUser?.displayName ?? ''));
      setEmail(userProfile.email || (firebaseUser?.email ?? ''));
      if (userProfile.specialty) {
        if (COMMON_SPECIALTIES.includes(userProfile.specialty)) {
          setSpecialty(userProfile.specialty);
        } else {
          setSpecialty('أخرى (Other)');
          setCustomSpecialty(userProfile.specialty);
        }
      }
      if (userProfile.studyLevel) {
        setStudyLevel(userProfile.studyLevel);
      }
    }
  }, [isOpen, userProfile, firebaseUser]);

  if (!isOpen) return null;

  const handleGoogleQuickFill = async () => {
    try {
      setErrorMsg('');
      setIsGoogleSigningIn(true);
      await signInWithGoogle();
      // Google populates firebaseUser in context, handled by useEffect
    } catch (err: any) {
      const errString = `${err?.code || ''} ${err?.message || ''} ${String(err || '')}`;
      if (
        errString.includes('popup-closed-by-user') ||
        errString.includes('cancelled-popup-request') ||
        errString.includes('user-cancelled')
      ) {
        console.info('[Firebase Auth] Quick fill cancelled by user.');
        return;
      }
      console.error('Google quick sign-in error:', err);
      let msg = err?.message || (isAr ? 'تعذر تسجيل الدخول بـ Google.' : 'Failed to sign in with Google.');
      if (err?.code === 'auth/popup-blocked') {
        msg = isAr
          ? 'المتصفح حظر النافذة المنبثقة. انقر مرة أخرى للمتابعة أو أكمل التسجيل المباشر أدناه.'
          : 'Popup was blocked by mobile browser. Tap again or register directly below.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        msg = isAr
          ? 'نطاق التطبيق يحتاج تصريح في Firebase Console.'
          : 'Domain needs authorization in Firebase Console.';
      }
      setErrorMsg(msg);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const finalSpecialty = specialty === 'أخرى (Other)' ? customSpecialty.trim() : specialty;

    if (!trimmedName) {
      setErrorMsg(isAr ? 'يرجى إدخال اسم الطبيب / المستخدم' : 'Please enter your name');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg(isAr ? 'يرجى إدخال بريد جيميل أو إيميل صحيح' : 'Please enter a valid Gmail / Email address');
      return;
    }

    if (!finalSpecialty) {
      setErrorMsg(isAr ? 'يرجى تحديد أو كتابة التخصص' : 'Please select or enter your specialty');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedData = {
        name: trimmedName,
        email: trimmedEmail,
        specialty: finalSpecialty,
        studyLevel
      };

      updateUserProfile(updatedData);
      setIsRegistered(true);

      // Persist to localStorage so this registration is once per user!
      try {
        localStorage.setItem('vascular_user_registered', 'true');
        const fullProfile = { ...userProfile, ...updatedData };
        localStorage.setItem('vascular_user_profile', JSON.stringify(fullProfile));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }

      showNotification(
        isAr
          ? `🎉 تم تسجيل حسابك بنجاح! مرحباً بك دكتور ${trimmedName}`
          : `🎉 Registration completed! Welcome Dr. ${trimmedName}`
      );

      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl shadow-teal-950/40 flex flex-col overflow-hidden text-slate-100 max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border-b border-teal-500/20 relative">
          {canDismiss && isRegistered && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 font-bold shadow-lg shadow-teal-950/50 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {isRegistered
                    ? isAr ? 'ملف الطبيب والحساب المسجل' : 'Doctor Profile & Account'
                    : isAr ? 'تسجيل حساب الطبيب (مرة واحدة)' : 'Doctor Registration (One-Time)'}
                </h3>
                {isRegistered && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    {isAr ? 'مسجل' : 'Registered'}
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-300/80 mt-1">
                {isAr
                  ? 'سجّل بالاسم والجيميل والتخصص للوصول إلى مكتبة إرشادات ESVS والمساعد الذكي'
                  : 'Register your name, Gmail, and specialty to access ESVS guidelines and AI workspace'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Google Quick Registration / Gmail Sign-In Banner */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {firebaseUser
                      ? isAr ? `متصل بحساب Google: ${firebaseUser.email}` : `Connected via Google: ${firebaseUser.email}`
                      : isAr ? 'تسجيل الدخول السريع عبر Google' : 'One-Tap Google Sign-In'}
                  </p>
                  {platform.isMobile && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-300 px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30">
                      {platform.isTablet ? <Tablet className="w-2.5 h-2.5 text-teal-400" /> : <Smartphone className="w-2.5 h-2.5 text-teal-400" />}
                      {platform.isTablet ? (isAr ? 'تابلت' : 'Tablet') : (isAr ? 'هاتف' : 'Phone')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {firebaseUser
                    ? isAr ? 'تم استيراد حسابك والبيانات بنجاح' : 'Account verified & synced'
                    : isAr ? 'متوافق مع جميع الهواتف الذكية والأجهزة اللوحية والحواسيب' : 'Works seamlessly on all smartphones, tablets, and desktops'}
                </p>
              </div>
            </div>

            {firebaseUser ? (
              <button
                type="button"
                onClick={signOutUser}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-rose-300 transition cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isAr ? 'تبديل الحساب' : 'Switch'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleQuickFill}
                disabled={isGoogleSigningIn}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 disabled:opacity-60 text-xs font-bold text-white transition shadow-md cursor-pointer shrink-0"
              >
                {isGoogleSigningIn ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isAr ? 'جاري الاتصال بـ Google...' : 'Connecting to Google...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                    <span>{isAr ? 'تسجيل عبر Google' : 'Sign in with Google'}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* In-App Browser / WebView Advisory */}
          {platform.isWebView && !firebaseUser && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">
                  {isAr ? 'تنبيه للأجهزة المحمولة (متصفح مدمج داخل تطبيق):' : 'Mobile In-App Browser Detected:'}
                </p>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  {isAr
                    ? 'إذا كنت تفتح الرابط من داخل تطبيق (مثل واتساب أو فيسبوك)، قد تقيّد سياسة Google تسجيل الدخول. يمكنك فتح الرابط في Safari أو Chrome، أو تسجيل بياناتك مباشرة أدناه.'
                    : 'If opened inside social apps (WhatsApp, Instagram, etc.), Google OAuth may restrict embedded WebViews. Open in Safari/Chrome or register directly using the form below.'}
                </p>
              </div>
            </div>
          )}

          {/* Form Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-700/80 w-full"></div>
            <span className="bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              {isAr ? 'أو أكمل بيانات الحساب مباشرة' : 'Or Complete Doctor Profile Directly'}
            </span>
            <div className="border-t border-slate-700/80 w-full"></div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                <span className="text-teal-400 font-bold ml-1">*</span>
                {isAr ? 'اسم الطبيب الكامل' : "Doctor's Full Name"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-teal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: د. أحمد محمد / Dr. Tariq Al-Mansoor' : 'e.g. Dr. Tariq Al-Mansoor'}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            {/* 2. Gmail / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                <span className="text-teal-400 font-bold ml-1">*</span>
                {isAr ? 'الجيميل / البريد الإلكتروني' : 'Gmail / Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-teal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={isAr ? 'مثال: doctor.name@gmail.com' : 'e.g. doctor.name@gmail.com'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            {/* 3. Medical Specialty */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                <span className="text-teal-400 font-bold ml-1">*</span>
                {isAr ? 'التخصص الطبي الدقيق' : 'Medical Specialization'}
              </label>
              <div className="relative mb-2">
                <Award className="w-4 h-4 text-teal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-hidden focus:border-teal-500 transition"
                >
                  {COMMON_SPECIALTIES.map(spec => (
                    <option key={spec} value={spec} className="bg-slate-800 text-white">
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {specialty === 'أخرى (Other)' && (
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'اكتب تخصصك هنا...' : 'Enter your specialization...'}
                  value={customSpecialty}
                  onChange={e => setCustomSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-teal-500/50 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              )}

              {/* Quick specialty selection chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {COMMON_SPECIALTIES.slice(0, 4).map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSpecialty(chip);
                      setCustomSpecialty('');
                    }}
                    className={`text-[10px] px-2 py-1 rounded-lg border transition cursor-pointer ${
                      specialty === chip
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {chip.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Training Level / Study Level */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {isAr ? 'المستوى السريري / المهني' : 'Clinical / Career Level'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'resident', labelAr: 'مقيم (Resident)', labelEn: 'Resident' },
                  { id: 'fellow', labelAr: 'زميل (Fellow)', labelEn: 'Fellow' },
                  { id: 'consultant', labelAr: 'استشاري (Consultant)', labelEn: 'Consultant' },
                  { id: 'student', labelAr: 'طالب طب (Student)', labelEn: 'Student' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStudyLevel(item.id as any)}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                      studyLevel === item.id
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 mx-auto mb-1 text-teal-400" />
                    <span className="text-[11px] block">{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{isAr ? 'يتم الحفظ لمرة واحدة فقط' : 'Saved once per user'}</span>
              </div>

              <div className="flex items-center gap-2">
                {canDismiss && isRegistered && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-950/50 transition cursor-pointer disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                      : isRegistered
                      ? (isAr ? 'حفظ التعديلات' : 'Update Profile')
                      : (isAr ? 'تسجيل وحفظ البيانات' : 'Register & Continue')}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
