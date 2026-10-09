import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  BellRing,
  Mic,
  Database,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2,
  X,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import {
  checkAllPermissions,
  requestAllPhonePermissions,
  sendReadingTopicNotification,
  CURATED_READING_TOPICS,
  PermissionDetails,
  ReadingTopic
} from '../services/phonePermissionsService';

interface PhonePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhonePermissionsModal: React.FC<PhonePermissionsModalProps> = ({ isOpen, onClose }) => {
  const { languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [permDetails, setPermDetails] = useState<PermissionDetails>({
    notifications: 'default',
    microphone: 'prompt',
    storagePersist: false,
    vibrationSupported: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastDeliveredTopic, setLastDeliveredTopic] = useState<ReadingTopic | null>(null);
  const [periodicInterval, setPeriodicInterval] = useState<boolean>(() => {
    try {
      return localStorage.getItem('phone_periodic_topics_active') === 'true';
    } catch {
      return true;
    }
  });

  const refreshPermissions = async () => {
    const details = await checkAllPermissions();
    setPermDetails(details);
  };

  useEffect(() => {
    if (isOpen) {
      refreshPermissions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGrantAll = async () => {
    setIsLoading(true);
    try {
      const results = await requestAllPhonePermissions();
      await refreshPermissions();

      if (results.notificationGranted) {
        showNotification(
          isAr
            ? 'تم منح إذن الإشعارات بنجاح! تم إرسال إشعار ترحيبي بموضوع قراءة جديد.'
            : 'Notifications granted! Welcome reading topic notification sent.'
        );
      } else {
        showNotification(
          isAr
            ? 'يرجى الضغط على "سماح" (Allow) في نافذة المتصفح/الهاتف لتفعيل الإشعارات.'
            : 'Please tap "Allow" in your browser/device prompt to enable notifications.'
        );
      }
    } catch (e) {
      console.error(e);
      showNotification(isAr ? 'حدث خطأ أثناء طلب الأذونات' : 'Error requesting permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestTopic = (topic?: ReadingTopic) => {
    const chosen = topic || CURATED_READING_TOPICS[Math.floor(Math.random() * CURATED_READING_TOPICS.length)];
    const success = sendReadingTopicNotification(undefined, undefined, chosen);
    setLastDeliveredTopic(chosen);

    if (success) {
      showNotification(
        isAr
          ? `تم إرسال إشعار الهاتف: ${chosen.titleAr}`
          : `Notification dispatched: ${chosen.titleEn}`
      );
    } else {
      showNotification(
        isAr
          ? `ملاحظة: إذا لم يظهر إشعار الهاتف، تأكد من الضغط على "السماح بجميع الأذونات" بالأعلى.`
          : `Note: Click "Grant All Permissions" above to see native system notifications.`
      );
    }
  };

  const togglePeriodic = () => {
    const nextVal = !periodicInterval;
    setPeriodicInterval(nextVal);
    try {
      localStorage.setItem('phone_periodic_topics_active', nextVal ? 'true' : 'false');
    } catch {
      // Ignore
    }
    showNotification(
      nextVal
        ? (isAr ? 'تم تفعيل جدولة إشعارات مواضيع القراءة التلقائية!' : 'Automated reading topic alerts scheduled!')
        : (isAr ? 'تم إيقاف الجدولة التلقائية' : 'Automated schedule paused')
    );
  };

  const isGranted = permDetails.notifications === 'granted';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-perm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-teal-500/40 p-5 sm:p-7 shadow-2xl shadow-teal-950/80 text-slate-100 space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pr-8">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/40 text-teal-300 shadow-md">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 id="phone-perm-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isAr ? 'أذونات الهاتف وإشعارات مواضيع القراءة' : 'Phone Permissions & Study Notifications'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                isGranted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isGranted
                  ? (isAr ? 'مفعّل بالكامل' : 'Permissions Active')
                  : (isAr ? 'مطلوب السماح' : 'Action Required')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {isAr
                ? 'السماح للتطبيق بإرسال إشعارات فورية على هاتفك بأحدث مواضيع قراءة الأوعية الدموية، وحفظ الكتب والمراجع دون اتصال، والمساعد الصوتي.'
                : 'Allow phone permissions to receive daily surgical reading topics, offline textbook storage, and AI audio discussions.'}
            </p>
          </div>
        </div>

        {/* Big Action Button to Grant All Permissions */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-850 to-slate-900 border border-teal-500/40 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-bold text-white">
                {isAr ? 'تفعيل جميع أذونات الهاتف بنقرة واحدة' : 'One-Tap Grant All Phone Permissions'}
              </span>
            </div>
            {isGranted && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                {isAr ? 'الإشعارات مفعلة' : 'Active'}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? 'بالضغط على الزر أدناه، سيطلب الهاتف الإذن لإرسال الإشعارات وتفعيل التخزين الدائم للكتب. اختر "سماح" (Allow) عندما تظهر لك النافذة.'
              : 'Tap below to request notifications and persistent storage. When prompted by your phone or browser, select "Allow".'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={handleGrantAll}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-extrabold text-sm transition cursor-pointer shadow-xl shadow-teal-950 disabled:opacity-50"
            >
              <BellRing className="w-5 h-5 animate-bounce" />
              <span>
                {isLoading
                  ? (isAr ? 'جاري طلب الأذونات...' : 'Requesting permissions...')
                  : (isAr ? '📱 السماح بجميع الأذونات في الهاتف الآن' : '📱 Allow All Phone Permissions Now')}
              </span>
            </button>

            <button
              onClick={() => handleSendTestTopic()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 hover:text-white border border-teal-500/30 text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'إرسال إشعار تجريبي لموضوع قراءة' : 'Test Reading Notification'}</span>
            </button>
          </div>
        </div>

        {/* Individual Permissions Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Permission 1: Notifications */}
          <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                <Bell className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                permDetails.notifications === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : permDetails.notifications === 'denied'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {permDetails.notifications === 'granted'
                  ? (isAr ? 'مسموح' : 'Granted')
                  : permDetails.notifications === 'denied'
                  ? (isAr ? 'محظور' : 'Denied')
                  : (isAr ? 'بانتظار الإذن' : 'Pending')}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">
              {isAr ? 'إشعارات مواضيع القراءة' : 'Reading Notifications'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr
                ? 'تنبيهات بمواضيع جراحية جديدة وحالات سريرية وإرشادات ESVS/SVS.'
                : 'Alerts for surgical updates, cases, and ESVS guidelines.'}
            </p>
          </div>

          {/* Permission 2: Audio / Microphone */}
          <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                <Mic className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                permDetails.microphone === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {permDetails.microphone === 'granted'
                  ? (isAr ? 'مسموح' : 'Granted')
                  : (isAr ? 'متاح عند الطلب' : 'On-Demand')}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">
              {isAr ? 'المساعد الصوتي ومناقشة الحالات' : 'AI Voice Tutor'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr
                ? 'للتدريب الشفوي على امتحانات البورد ومناقشة العمليات صوتياً.'
                : 'For oral board exam prep & voice case discussion.'}
            </p>
          </div>

          {/* Permission 3: Storage */}
          <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Database className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                permDetails.storagePersist
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {isAr ? 'مخزن محلياً' : 'Persistent'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">
              {isAr ? 'حفظ الكتب دون اتصال' : 'Offline Books Storage'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr
                ? 'حفظ كتب وملاحظات الأوعية الدموية في الهاتف دون استهلاك باقة الإنترنت.'
                : 'Keeps textbooks and notes cached permanently offline.'}
            </p>
          </div>
        </div>

        {/* Periodic Schedule Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-850 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {isAr ? 'إرسال إشعارات مواضيع قراءة دورية على الهاتف' : 'Auto-send periodic reading topics to phone'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'يرسل تنبيه بموضوع جراحي عالي الأهمية لمراجعته أثناء أوقات الفراغ.'
                  : 'Delivers high-yield vascular review topics to your phone notification center.'}
              </p>
            </div>
          </div>
          <button
            onClick={togglePeriodic}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              periodicInterval ? 'bg-teal-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                periodicInterval ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Curated Reading Topics Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'نماذج مواضيع القراءة المجهزة للإرسال إلى هاتفك:' : 'Topics Scheduled for Phone Delivery:'}</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              {CURATED_READING_TOPICS.length} {isAr ? 'موضوعاً' : 'topics'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {CURATED_READING_TOPICS.map(topic => (
              <div
                key={topic.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition space-y-1.5 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                    {topic.category}
                  </span>
                  <button
                    onClick={() => handleSendTestTopic(topic)}
                    className="opacity-80 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-teal-400 hover:text-teal-200 font-semibold cursor-pointer"
                  >
                    <span>{isAr ? 'إرسال الآن' : 'Send'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <h5 className="text-xs font-bold text-white group-hover:text-teal-300 transition line-clamp-1">
                  {isAr ? topic.titleAr : topic.titleEn}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                  {isAr ? topic.summaryAr : topic.summaryEn}
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  📖 {topic.guidelineSource}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip for blocked permissions */}
        {permDetails.notifications === 'denied' && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1 leading-snug">
              <p className="font-bold">
                {isAr ? 'تم حظر الإشعارات في إعدادات المتصفح:' : 'Notifications blocked in browser settings:'}
              </p>
              <p className="text-[11px] text-amber-200">
                {isAr
                  ? 'لتفعيلها على الهاتف: اضغط على علامة القفل 🔒 بجانب رابط الموقع في أعلى شريط العنوان، ثم اختر "أذونات الموقع" (Site settings) واجعل الإشعارات (Notifications) "سماح" (Allow).'
                  : 'To enable: tap the lock 🔒 icon in the URL bar, select "Site settings", and switch Notifications to "Allow".'}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{isAr ? 'بياناتك محفوظة محلياً ولا نشارك أي معلومات' : 'Private & localized study notifications'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition"
          >
            {isAr ? 'تم، إغلاق' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
