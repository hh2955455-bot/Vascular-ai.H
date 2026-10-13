import { Workbox } from 'workbox-window';
import { ClinicalCase, ReferenceDocument, Flashcard } from '../types';
import { CLINICAL_CASES } from '../data/clinicalCasesData';
import { INITIAL_REFERENCES } from '../data/referencesData';
import { INITIAL_FLASHCARDS } from '../data/flashcardData';

// Cache keys matching Workbox service worker rules
export const WORKBOX_CACHE_NAMES = {
  CLINICAL_CASES: 'vascular-ai-clinical-cases-v1',
  STUDY_MATERIALS: 'vascular-ai-study-materials-v1',
  MEDICAL_EVIDENCE: 'vascular-ai-medical-evidence-v1',
  APP_SHELL: 'vascular-ai-app-shell-v1',
};

const LOCAL_STORAGE_BACKUP_KEYS = {
  CASES: 'vascular_offline_cached_cases_v1',
  STUDY: 'vascular_offline_cached_study_v1',
  STATS: 'vascular_offline_cache_stats_v1',
};

export interface OfflineCacheStats {
  isServiceWorkerActive: boolean;
  isOnline: boolean;
  cachedCasesCount: number;
  cachedGuidelinesCount: number;
  cachedFlashcardsCount: number;
  lastSyncedAt: string | null;
  workboxAvailable: boolean;
}

let wbInstance: Workbox | null = null;
const offlineStatusListeners = new Set<(isOnline: boolean) => void>();

/**
 * Initializes and registers the Workbox service worker.
 */
export async function registerWorkboxServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.info('[Workbox] Service Workers are not supported in this browser environment.');
    return false;
  }

  try {
    // Attempt registration via workbox-window
    wbInstance = new Workbox('/sw.js');

    wbInstance.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('[Workbox] New service worker version installed; ready to update.');
      } else {
        console.log('[Workbox] Service worker installed for offline clinical study.');
      }
    });

    wbInstance.addEventListener('activated', () => {
      console.log('[Workbox] Service worker activated. Offline study mode available.');
      // Immediately prefetch and cache study materials and cases
      prefetchAndCacheStudyData().catch((err) => {
        console.warn('[Workbox] Initial offline study caching warning:', err);
      });
    });

    wbInstance.addEventListener('controlling', () => {
      console.log('[Workbox] Service worker is controlling the page.');
    });

    await wbInstance.register();
    return true;
  } catch (err) {
    console.warn('[Workbox] workbox-window register failed, trying native registration:', err);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('[Workbox] Native service worker registered successfully:', registration.scope);
      prefetchAndCacheStudyData().catch(() => {});
      return true;
    } catch (nativeErr) {
      console.warn('[Workbox] Native service worker registration warning:', nativeErr);
      return false;
    }
  }
}

/**
 * Proactively pre-fetches and caches all clinical cases and study materials
 * into Workbox CacheStorage and localStorage backup.
 */
export async function prefetchAndCacheStudyData(): Promise<OfflineCacheStats> {
  let casesCount = CLINICAL_CASES.length;
  let guidelinesCount = INITIAL_REFERENCES.length;
  let flashcardsCount = INITIAL_FLASHCARDS.length;

  try {
    // 1. Fetch & warm up Clinical Cases
    const casesRes = await fetch('/api/clinical-cases', { cache: 'no-cache' }).catch(() => null);
    if (casesRes && casesRes.ok) {
      const data = await casesRes.clone().json();
      if (data && Array.isArray(data.cases)) {
        casesCount = data.cases.length;
        try {
          localStorage.setItem(LOCAL_STORAGE_BACKUP_KEYS.CASES, JSON.stringify(data.cases));
        } catch {}
      }

      // Store in CacheStorage if available
      if ('caches' in window) {
        try {
          const cache = await caches.open(WORKBOX_CACHE_NAMES.CLINICAL_CASES);
          await cache.put('/api/clinical-cases', casesRes);
        } catch {}
      }
    } else {
      // Prime localStorage from bundled fallback
      try {
        localStorage.setItem(LOCAL_STORAGE_BACKUP_KEYS.CASES, JSON.stringify(CLINICAL_CASES));
      } catch {}
    }

    // 2. Fetch & warm up Study Materials
    const studyRes = await fetch('/api/study-materials', { cache: 'no-cache' }).catch(() => null);
    if (studyRes && studyRes.ok) {
      const data = await studyRes.clone().json();
      if (data) {
        guidelinesCount = data.references?.length || guidelinesCount;
        flashcardsCount = data.flashcards?.length || flashcardsCount;
        try {
          localStorage.setItem(LOCAL_STORAGE_BACKUP_KEYS.STUDY, JSON.stringify(data));
        } catch {}
      }

      if ('caches' in window) {
        try {
          const cache = await caches.open(WORKBOX_CACHE_NAMES.STUDY_MATERIALS);
          await cache.put('/api/study-materials', studyRes);
        } catch {}
      }
    } else {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_BACKUP_KEYS.STUDY,
          JSON.stringify({
            references: INITIAL_REFERENCES,
            flashcards: INITIAL_FLASHCARDS,
          })
        );
      } catch {}
    }
  } catch (err) {
    console.info('[Workbox] Network warmup deferred to cache fallbacks:', err);
  }

  const stats: OfflineCacheStats = {
    isServiceWorkerActive: Boolean(navigator.serviceWorker?.controller),
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    cachedCasesCount: casesCount,
    cachedGuidelinesCount: guidelinesCount,
    cachedFlashcardsCount: flashcardsCount,
    lastSyncedAt: new Date().toISOString(),
    workboxAvailable: Boolean(wbInstance || 'serviceWorker' in navigator),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEYS.STATS, JSON.stringify(stats));
  } catch {}

  return stats;
}

/**
 * Retrieves clinical cases with resilient fallback:
 * 1. Network fetch
 * 2. CacheStorage (Workbox cache)
 * 3. localStorage backup
 * 4. Bundled clinical cases
 */
export async function getResilientClinicalCases(): Promise<ClinicalCase[]> {
  try {
    // 1. Try network or Workbox interceptor
    const res = await fetch('/api/clinical-cases');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.cases) && json.cases.length > 0) {
        try {
          localStorage.setItem(LOCAL_STORAGE_BACKUP_KEYS.CASES, JSON.stringify(json.cases));
        } catch {}
        return json.cases;
      }
    }
  } catch {
    console.info('[Workbox] Fetching clinical cases from offline cache.');
  }

  // 2. Check CacheStorage
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const match = await caches.match('/api/clinical-cases');
      if (match) {
        const json = await match.json();
        if (json && Array.isArray(json.cases) && json.cases.length > 0) {
          return json.cases;
        }
      }
    } catch {}
  }

  // 3. Check localStorage backup
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEYS.CASES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // 4. Default bundled data
  return CLINICAL_CASES;
}

/**
 * Retrieves study materials (guidelines & flashcards) with offline fallback.
 */
export async function getResilientStudyMaterials(): Promise<{
  references: ReferenceDocument[];
  flashcards: Flashcard[];
}> {
  try {
    const res = await fetch('/api/study-materials');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.references) && Array.isArray(json.flashcards)) {
        try {
          localStorage.setItem(LOCAL_STORAGE_BACKUP_KEYS.STUDY, JSON.stringify(json));
        } catch {}
        return {
          references: json.references,
          flashcards: json.flashcards,
        };
      }
    }
  } catch {
    console.info('[Workbox] Fetching study materials from offline cache.');
  }

  // Check CacheStorage
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const match = await caches.match('/api/study-materials');
      if (match) {
        const json = await match.json();
        if (json && Array.isArray(json.references) && Array.isArray(json.flashcards)) {
          return {
            references: json.references,
            flashcards: json.flashcards,
          };
        }
      }
    } catch {}
  }

  // Check localStorage backup
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEYS.STUDY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.references) && Array.isArray(parsed.flashcards)) {
        return parsed;
      }
    }
  } catch {}

  return {
    references: INITIAL_REFERENCES,
    flashcards: INITIAL_FLASHCARDS,
  };
}

/**
 * Retrieves cached stats for UI indicators.
 */
export function getStoredOfflineCacheStats(): OfflineCacheStats {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEYS.STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        isOnline,
        isServiceWorkerActive: Boolean(navigator.serviceWorker?.controller),
      };
    }
  } catch {}

  return {
    isServiceWorkerActive: Boolean(navigator.serviceWorker?.controller),
    isOnline,
    cachedCasesCount: CLINICAL_CASES.length,
    cachedGuidelinesCount: INITIAL_REFERENCES.length,
    cachedFlashcardsCount: INITIAL_FLASHCARDS.length,
    lastSyncedAt: null,
    workboxAvailable: Boolean('serviceWorker' in navigator),
  };
}

/**
 * Subscribe to online/offline network changes.
 */
export function subscribeOfflineStatus(callback: (isOnline: boolean) => void): () => void {
  offlineStatusListeners.add(callback);
  return () => {
    offlineStatusListeners.delete(callback);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Network] App is back online. Syncing fresh study materials.');
    prefetchAndCacheStudyData().catch(() => {});
    offlineStatusListeners.forEach((fn) => fn(true));
  });

  window.addEventListener('offline', () => {
    console.warn('[Network] App is offline. Workbox serving cached clinical cases and study materials.');
    offlineStatusListeners.forEach((fn) => fn(false));
  });
}
