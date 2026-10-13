import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  subscribeOfflineStatus,
  getStoredOfflineCacheStats,
  prefetchAndCacheStudyData,
  OfflineCacheStats,
} from '../services/serviceWorker';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const OfflineStatusBar: React.FC = () => {
  const { languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [stats, setStats] = useState<OfflineCacheStats>(getStoredOfflineCacheStats());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeOfflineStatus((online) => {
      setIsOnline(online);
      setStats(getStoredOfflineCacheStats());
      if (!online) {
        setIsDismissed(false); // Pop banner back up when going offline
      }
    });

    // Refresh stats on mount
    setStats(getStoredOfflineCacheStats());

    return () => {
      unsubscribe();
    };
  }, []);

  const handleManualSync = async () => {
    if (!navigator.onLine) {
      showNotification(isAr ? 'لا يوجد اتصال بالإنترنت حالياً للمزامنة' : 'Device is offline; cached material is active.');
      return;
    }
    setIsSyncing(true);
    try {
      const updated = await prefetchAndCacheStudyData();
      setStats(updated);
      showNotification(
        isAr
          ? `تم تحديث التخزين المؤقت بنجاح (${updated.cachedCasesCount} حالات، ${updated.cachedGuidelinesCount} دليلاً)`
          : `Offline cache updated (${updated.cachedCasesCount} cases, ${updated.cachedGuidelinesCount} guidelines cached)`
      );
    } catch {
      showNotification(isAr ? 'فشلت المزامنة المؤقتة' : 'Failed to update offline cache');
    } finally {
      setIsSyncing(false);
    }
  };

  // If online and dismissed, don't show the offline banner
  if (isOnline && isDismissed) {
    return null;
  }

  // If offline, always show banner (unless dismissed for current session, but keep small bar)
  if (!isOnline) {
    return (
      <aside aria-label={isAr ? 'تنبيه وضع عدم الاتصال' : 'Offline mode notice'} className="bg-gradient-to-r from-amber-600/90 via-amber-700/95 to-amber-800 text-white px-3 py-2 text-xs font-medium border-b border-amber-500/40 shadow-sm animate-in fade-in duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-950/40 border border-amber-400/40 flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-amber-100 mr-1.5">
                {isAr ? 'وضع المذاكرة بدون إنترنت مفعّل (Workbox SW):' : 'Offline Study Mode Active (Workbox SW):'}
              </span>
              <span className="text-amber-100/90">
                {isAr
                  ? `الحالات السريرية (${stats.cachedCasesCount}) ومكتبة الأدلة والبطاقات التعليمية محفوظة ومتاحة للمراجعة الفورية بدون إنترنت.`
                  : `Clinical cases (${stats.cachedCasesCount}), guidelines (${stats.cachedGuidelinesCount}), and flashcards are cached in memory for uninterrupted study.`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/50 border border-amber-400/30 text-[11px] font-mono text-amber-200">
              <Database className="w-3 h-3 text-amber-300" />
              {stats.cachedCasesCount} Cases Cached
            </span>
            <button
              onClick={() => setIsDismissed(true)}
              className="px-2 py-0.5 rounded-lg bg-black/20 hover:bg-black/30 text-amber-100 hover:text-white transition text-[11px] cursor-pointer"
            >
              {isAr ? 'إخفاء' : 'Dismiss'}
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // When online, render null unless user wants to see it or first time syncing
  return null;
};
