import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, LanguageMode } from '../types';
import {
  Settings,
  User,
  Shield,
  Database,
  Languages,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Server,
  Mail,
  Smartphone,
  BellRing,
  ExternalLink,
  Copy
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    languageMode,
    setLanguageMode,
    setIsMedicalDisclaimerOpen,
    setIsContactDeveloperOpen,
    setIsPhonePermissionsOpen,
    references,
    notes,
    flashcards,
    showNotification
  } = useApp();

  const isAr = languageMode === 'ar';

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [studyLevel, setStudyLevel] = useState<UserRole>(userProfile.studyLevel);
  const [specialty, setSpecialty] = useState(userProfile.specialty);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      studyLevel,
      specialty
    });
    showNotification('User profile settings saved successfully.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
          <Settings className="w-4 h-4" />
          <span>{isAr ? 'إعدادات النظام والملف الشخصي' : 'System Configuration & Doctor Profile'}</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          {isAr ? 'الإعدادات والملف الشخصي' : 'Settings & Preferences'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? 'تخصيص ملف الطبيب، مستوى التدريب الجراحي، اللغة الافتراضية، ومراقبة حالة الذكاء الاصطناعي.'
            : 'Configure your surgical training tier, default language mode, and review AI model status.'}
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Doctor Profile Information</h3>
            <p className="text-xs text-slate-400">Used for contextualizing AI explanations and exam recommendations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Specialty / Title:</label>
            <input
              type="text"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Surgical Training Level:</label>
            <select
              value={studyLevel}
              onChange={e => setStudyLevel(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value="student">Medical Student (Clinical Years)</option>
              <option value="resident">Surgical Resident (Vascular / General)</option>
              <option value="fellow">Vascular Surgery Fellow / Trainee</option>
              <option value="consultant">Consultant / Vascular Attending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-teal-950"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Language Preferences Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Bilingual Engine Settings</h3>
            <p className="text-xs text-slate-400">English medical terms are retained in Arabic mode to prevent clinical ambiguity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'en', label: 'English Only', desc: 'Standard international vascular curriculum' },
            { id: 'bilingual', label: 'Bilingual (AR + EN Terms)', desc: 'Arabic explanation with English medical terminology' },
            { id: 'ar', label: 'Arabic Mode (العربية)', desc: 'Full Arabic interface and RTL alignment' }
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setLanguageMode(lang.id as LanguageMode)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                languageMode === lang.id
                  ? 'bg-teal-950/40 border-teal-500 text-white'
                  : 'bg-slate-850 border-slate-750 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-bold block">{lang.label}</span>
              <p className="text-[11px] text-slate-400 leading-snug">{lang.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Phone Permissions and Reading Topic Notifications */}
      <div className="rounded-3xl bg-slate-900 border border-teal-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'أذونات الهاتف وإشعارات مواضيع القراءة' : 'Phone Permissions & Study Notifications'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'طلب السماح في الهاتف لإرسال إشعارات مواضيع القراءة الجديدة وحفظ المراجع دون اتصال.'
                  : 'Manage phone permissions for daily surgical reading topics and offline access.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPhonePermissionsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{isAr ? 'إدارة الأذونات' : 'Manage Permissions'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-850 border border-slate-750">
          <div>
            <p className="text-xs sm:text-sm font-bold text-white">
              {isAr ? 'تنبيهات مواضيع القراءة الدورية على هاتفك' : 'Curated Study Topic Notifications'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? 'إرسال موضوع جراحي عالي الأهمية (AAA, Carotid, ALI, DVT) لمراجعته اليومية.'
                : 'Delivers high-yield vascular review topics to your device.'}
            </p>
          </div>
          <button
            onClick={() => setIsPhonePermissionsOpen(true)}
            className="shrink-0 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            {isAr ? 'تفعيل وإرسال إشعار تجريبي' : 'Enable & Test'}
          </button>
        </div>
      </div>

      {/* Contact Developer Card (User Request: تواصل مع المبرمج hh2955455@gmail.com) */}
      <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'التواصل مع المبرمج ومطور التطبيق' : 'Contact Developer'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'قناة مباشرة للمقترحات، إضافة مراجع جديدة، والرد على الاستفسارات.'
                  : 'Direct line for feature suggestions, book indexing requests, and technical inquiries.'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
            hh2955455@gmail.com
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-850 border border-slate-750">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'البريد الإلكتروني المباشر:' : 'Direct Email Address:'}</span>
              <span className="font-mono text-teal-400 select-all font-semibold">hh2955455@gmail.com</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? 'اضغط على زر التواصل لفتح نافذة المراسلة الفورية أو إرسال بريد مباشر.'
                : 'Click below to compose a direct message or open in your email client.'}
            </p>
          </div>

          <button
            onClick={() => setIsContactDeveloperOpen(true)}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-indigo-950"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isAr ? 'فتح نافذة التواصل مع المبرمج' : 'Open Contact Dialog'}</span>
          </button>
        </div>
      </div>

      {/* System Status and RAG Vector Store Stats */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">System Architecture & Knowledge Base Status</h3>
            <p className="text-xs text-slate-400">Local isolation: User medical references remain isolated per user session.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-500 block">AI Model:</span>
            <span className="font-bold text-white">gemini-3.8-flash</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-500 block">Active References:</span>
            <span className="font-bold text-teal-400">{references.length} Documents</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-500 block">Study Notes:</span>
            <span className="font-bold text-emerald-400">{notes.length} Notes</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-500 block">Active Flashcards:</span>
            <span className="font-bold text-purple-400">{flashcards.length} Cards</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => setIsMedicalDisclaimerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>View Medical Disclaimer & Clinical Safety Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
