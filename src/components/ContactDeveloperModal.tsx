import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  X,
  Code2,
  HeartHandshake
} from 'lucide-react';

interface ContactDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEVELOPER_EMAIL = 'hh2955455@gmail.com';

export const ContactDeveloperModal: React.FC<ContactDeveloperModalProps> = ({ isOpen, onClose }) => {
  const { languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState<'suggestion' | 'book' | 'bug' | 'general'>('suggestion');

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_EMAIL);
    setCopied(true);
    showNotification(isAr ? 'تم نسخ البريد الإلكتروني للمبرمج بنجاح!' : 'Developer email copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendMail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalSubject = subject.trim() || (isAr ? 'استفسار واقتراح حول تطبيق دراسة جراحة الأوعية الدموية' : 'Inquiry about Vascular AI Study Assistant');
    const finalBody = `${message.trim()}\n\n---\nSent from Vascular Surgery AI Study Assistant\nDoctor Profile: Dr. Tariq Al-Mansoor`;
    const mailtoUrl = `mailto:${DEVELOPER_EMAIL}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
    window.location.href = mailtoUrl;
    showNotification(isAr ? 'جاري فتح تطبيق البريد لإرسال رسالتك للمبرمج...' : 'Opening your email client to send message...');
  };

  const handleOpenGmail = () => {
    const finalSubject = subject.trim() || (isAr ? 'تواصل مع مبرمج تطبيق جراحة الأوعية الدموية' : 'Contact Developer - Vascular AI App');
    const finalBody = message.trim();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${DEVELOPER_EMAIL}&su=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const applyPresetSubject = (preset: 'suggestion' | 'book' | 'bug' | 'general') => {
    setInquiryType(preset);
    if (preset === 'suggestion') {
      setSubject(isAr ? 'اقتراح ميزة جديدة لتطوير التطبيق' : 'Feature Suggestion for Vascular App');
    } else if (preset === 'book') {
      setSubject(isAr ? 'طلب إضافة كتاب أو مرجع جراحي جديد' : 'Request to add medical textbook/guideline');
    } else if (preset === 'bug') {
      setSubject(isAr ? 'إبلاغ عن استفسار أو مشكلة تقنية' : 'Bug Report / Technical Inquiry');
    } else {
      setSubject(isAr ? 'رسالة تواصل مع المبرمج' : 'General Inquiry to Developer');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-dev-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-teal-500/30 p-5 sm:p-7 shadow-2xl shadow-teal-950/60 text-slate-100 space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Developer Badge */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/40 text-teal-300 shadow-md">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="contact-dev-title" className="text-lg sm:text-xl font-black text-white tracking-tight">
                {isAr ? 'التواصل مع المبرمج' : 'Contact Developer'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                {isAr ? 'المطور المباشر' : 'Lead Developer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {isAr
                ? 'يسعدنا استقبال آرائك، مقترحاتك، أو طلب إضافة مراجع وكتب جديدة لتطوير التطبيق.'
                : 'Direct channel for feedback, new textbook suggestions, feature requests, or collaboration.'}
            </p>
          </div>
        </div>

        {/* Developer Email Box with 1-Click Copy */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
            {isAr ? 'البريد الإلكتروني المباشر للمبرمج' : 'Official Developer Email'}
          </span>
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="font-mono text-sm sm:text-base font-bold text-white select-all truncate">
                {DEVELOPER_EMAIL}
              </span>
            </div>
            <button
              onClick={handleCopyEmail}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40'
              }`}
              title={isAr ? 'نسخ الإيميل للحافظة' : 'Copy email to clipboard'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ الإيميل' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick launch buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleSendMail()}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-teal-950"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'إرسال بريد إلكتروني مباشر' : 'Send Email Directly'}</span>
            </button>
            <button
              onClick={handleOpenGmail}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-bold transition cursor-pointer border border-slate-600"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
              <span>{isAr ? 'فتح في بريد Gmail' : 'Open in Gmail Web'}</span>
            </button>
          </div>
        </div>

        {/* Quick Message Form */}
        <form onSubmit={handleSendMail} className="space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>{isAr ? 'إرسال رسالة سريعة للمبرمج:' : 'Send a quick message / suggestion:'}</span>
            </label>
          </div>

          {/* Preset subject buttons */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => applyPresetSubject('suggestion')}
              className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                inquiryType === 'suggestion'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-bold'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              💡 {isAr ? 'اقتراح ميزة' : 'Suggestion'}
            </button>
            <button
              type="button"
              onClick={() => applyPresetSubject('book')}
              className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                inquiryType === 'book'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-bold'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              📚 {isAr ? 'طلب كتاب/مرجع' : 'Request Book'}
            </button>
            <button
              type="button"
              onClick={() => applyPresetSubject('bug')}
              className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                inquiryType === 'bug'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-bold'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              🛠️ {isAr ? 'استفسار تقني' : 'Technical Issue'}
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder={isAr ? 'موضوع الرسالة (اختياري)...' : 'Subject (optional)...'}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <textarea
              rows={3}
              placeholder={
                isAr
                  ? 'اكتب رسالتك أو اقتراحك أو الكتب التي تريد إضافتها هنا وسيتم إرسالها إلى المبرمج مباشرة...'
                  : 'Write your message, feedback or book request here...'
              }
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-teal-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{isAr ? 'يتم الرد والتفاعل في أقرب وقت' : 'Fast response guaranteed'}</span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-teal-950"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
            </button>
          </div>
        </form>

        {/* Footer info note */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-2.5 text-[11px] text-slate-400">
          <HeartHandshake className="w-4 h-4 text-pink-400 shrink-0" />
          <span>
            {isAr
              ? 'شكراً لاستخدامك تطبيق دراسة جراحة الأوعية الدموية. نحن هنا لدعمك في مسيرتك العلمية والسريرية!'
              : 'Thank you for using the Vascular Surgery Study Assistant. Built with dedication for surgical education!'}
          </span>
        </div>
      </div>
    </div>
  );
};
