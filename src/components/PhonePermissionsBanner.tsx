import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Sparkles, X, ChevronRight } from 'lucide-react';
import { requestAllPhonePermissions, checkAllPermissions } from '../services/phonePermissionsService';

interface PhonePermissionsBannerProps {
  onOpenModal: () => void;
}

export const PhonePermissionsBanner: React.FC<PhonePermissionsBannerProps> = ({ onOpenModal }) => {
  const { languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [visible, setVisible] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check if dismissed recently
    try {
      const dismissed = sessionStorage.getItem('phone_perm_banner_dismissed');
      if (dismissed === 'true') return;
    } catch {
      // Ignore
    }

    checkAllPermissions().then(details => {
      if (details.notifications !== 'granted') {
        setVisible(true);
      }
    });
  }, []);

  if (!visible) return null;

  const handleQuickGrant = async () => {
    setIsRequesting(true);
    try {
      const res = await requestAllPhonePermissions();
      if (res.notificationGranted) {
        showNotification(
          isAr
            ? 'تم تفعيل إشعارات الهاتف بنجاح! ستصلك أحدث مواضيع القراءة.'
            : 'Phone notifications granted successfully!'
        );
        setVisible(false);
      } else {
        onOpenModal();
      }
    } catch {
      onOpenModal();
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem('phone_perm_banner_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-b border-teal-500/30 px-3 sm:px-6 py-2 text-xs text-slate-200 flex items-center justify-between gap-3 shadow-md z-20">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="p-1 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
          <Bell className="w-4 h-4 animate-bounce" />
        </span>
        <p className="truncate text-[11px] sm:text-xs">
          <span className="font-bold text-teal-300">
            {isAr ? 'تفعيل أذونات الهاتف:' : 'Enable Phone Permissions:'}
          </span>{' '}
          {isAr
            ? 'احصل على إشعارات فورية بمواضيع القراءة الطبية وتحديثات الجراحة اليومية.'
            : 'Get instant phone alerts for new daily surgical review topics and guideline updates.'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleQuickGrant}
          disabled={isRequesting}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[11px] sm:text-xs transition cursor-pointer shadow-sm disabled:opacity-60"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'سماح لجميع الأذونات' : 'Allow All'}</span>
        </button>

        <button
          onClick={onOpenModal}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer border border-slate-700"
        >
          <span>{isAr ? 'تفاصيل' : 'Details'}</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
          title={isAr ? 'إغلاق التنبيه' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
