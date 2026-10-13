import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// GoogleAuthProvider configuration optimized for phones, tablets & desktops
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

/**
 * Comprehensive Mobile Phone, Tablet, and In-App Browser Sandbox Detection.
 * Supports:
 * - Smartphones: iPhone, Android phones (Samsung, Xiaomi, Pixel, Oppo, etc.)
 * - Tablets: iPad, iPadOS (Safari desktop mode), Android Tablets, Galaxy Tab, Surface
 * - WebViews / In-App Browsers: WhatsApp, Instagram, Facebook, TikTok, Telegram, Twitter
 */
export interface MobilePlatformDetails {
  isMobile: boolean;
  isTablet: boolean;
  isPhone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWebView: boolean;
  platformName: string;
}

export function detectMobilePlatform(): MobilePlatformDetails {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isPhone: false,
      isIOS: false,
      isAndroid: false,
      isWebView: false,
      platformName: 'Server',
    };
  }

  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';

  // Detect iOS (iPhone, iPad, iPod, iPadOS MacIntel touch)
  const isIPad =
    /iPad/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isIPhone = /iPhone|iPod/i.test(ua);
  const isIOS = isIPad || isIPhone;

  // Detect Android: Phones vs Tablets
  const isAndroid = /Android/i.test(ua);
  const isAndroidTablet = isAndroid && !/Mobile/i.test(ua);
  const isAndroidPhone = isAndroid && /Mobile/i.test(ua);

  // Other tablets (Windows touch tablets, Silk, PlayBook)
  const isOtherTablet = /Tablet|PlayBook|Silk/i.test(ua);

  const isTablet = isIPad || isAndroidTablet || isOtherTablet;
  const isPhone = isIPhone || isAndroidPhone || (/Mobi/i.test(ua) && !isTablet);
  const isMobile = isPhone || isTablet;

  // Detect Mobile WebViews & In-App Browsers
  const isWebView =
    /wv|WebView/i.test(ua) ||
    (isAndroid && /Version\/[0-9.]+/i.test(ua)) ||
    /FBAN|FBAV|Instagram|Twitter|Snapchat|Line|MicroMessenger|WhatsApp|Telegram/i.test(ua) ||
    Boolean((window.navigator as any).standalone) ||
    (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);

  let platformName = 'Desktop Browser';
  if (isWebView) {
    platformName = isIOS ? 'iOS In-App Browser (WebView)' : isAndroid ? 'Android In-App Browser (WebView)' : 'In-App WebView';
  } else if (isTablet) {
    platformName = isIPad ? 'iPad / iPadOS Tablet' : isAndroidTablet ? 'Android Tablet' : 'Tablet Device';
  } else if (isPhone) {
    platformName = isIOS ? 'iPhone Mobile Safari' : isAndroid ? 'Android Smartphone' : 'Mobile Phone';
  }

  return {
    isMobile,
    isTablet,
    isPhone,
    isIOS,
    isAndroid,
    isWebView,
    platformName,
  };
}

/**
 * Configure resilient Auth session persistence across all devices.
 * Uses non-blocking background initialization to prevent dropping user gesture flags.
 */
let persistenceConfigured = false;
export async function configureAuthPersistence(): Promise<void> {
  if (persistenceConfigured) return;
  try {
    await setPersistence(auth, indexedDBLocalPersistence);
    persistenceConfigured = true;
  } catch {
    try {
      await setPersistence(auth, browserLocalPersistence);
      persistenceConfigured = true;
    } catch {
      try {
        await setPersistence(auth, browserSessionPersistence);
        persistenceConfigured = true;
      } catch (err) {
        console.warn('[Firebase Auth] Persistence configuration notice:', err);
      }
    }
  }
}

// Pre-initialize persistence non-blockingly at module load
configureAuthPersistence().catch(() => {});

function clearRedirectFlags() {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('firebase_auth_redirect_pending');
      sessionStorage.removeItem('firebase_auth_redirect_ts');
      sessionStorage.removeItem('firebase_auth_platform');
      localStorage.removeItem('firebase_auth_redirect_pending');
    }
  } catch {}
}

/**
 * Cross-Platform Google Sign-In Execution for Phones, Tablets, and Desktops.
 * 
 * Strategy:
 * 1. Executes `signInWithPopup` directly in the synchronous click context
 *    to preserve user activation on iOS Safari, iPadOS, Android Chrome, and tablets.
 * 2. If the mobile browser blocks popups (e.g. strict popup blocker), seamlessly
 *    falls back to `signInWithRedirect`.
 * 3. Supports explicit `mode: 'redirect'` or `mode: 'popup'`.
 */
export async function executeGoogleSignIn(mode: 'auto' | 'popup' | 'redirect' = 'auto'): Promise<User | null> {
  // Trigger background persistence without awaiting (maintains user gesture activation)
  configureAuthPersistence().catch(() => {});

  const platform = detectMobilePlatform();

  // Explicit redirect request
  if (mode === 'redirect') {
    return initiateRedirectFlow(platform);
  }

  // Attempt Popup Flow First:
  // On iOS Safari, Android Chrome, iPad, Samsung Internet, and tablets, signInWithPopup
  // avoids the "The requested action is invalid" cookie issue on firebase hosting and completes inline.
  try {
    console.log(`[Firebase Auth] Initiating Google Sign-In on ${platform.platformName}...`);
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    if (result && result.user) {
      console.log(`[Firebase Auth] Google Sign-In successful on ${platform.platformName} for:`, result.user.email);
      return result.user;
    }
    return null;
  } catch (popupError: any) {
    const errString = `${popupError?.code || ''} ${popupError?.message || ''} ${String(popupError || '')}`;
    // If the user closed the popup deliberately, handle gracefully without throwing error
    if (
      errString.includes('popup-closed-by-user') ||
      errString.includes('cancelled-popup-request') ||
      errString.includes('user-cancelled')
    ) {
      console.info(`[Firebase Auth] Sign-in cancelled: Google popup was closed by user on ${platform.platformName}.`);
      return null;
    }

    console.warn(`[Firebase Auth] Popup notice on ${platform.platformName}:`, popupError?.code, popupError?.message);

    // If popup was blocked by mobile browser or cancelled by environment, try redirect as fallback
    const shouldFallbackToRedirect =
      mode === 'auto' &&
      (popupError?.code === 'auth/popup-blocked' ||
       popupError?.code === 'auth/cancelled-popup-request' ||
       popupError?.code === 'auth/operation-not-supported-in-this-environment' ||
       String(popupError?.message || '').toLowerCase().includes('popup blocked'));

    if (shouldFallbackToRedirect) {
      console.log(`[Firebase Auth] Popup blocked on ${platform.platformName}. Falling back to signInWithRedirect...`);
      return initiateRedirectFlow(platform);
    }

    throw popupError;
  }
}

/**
 * Initiates the redirect authentication flow.
 */
async function initiateRedirectFlow(platform: MobilePlatformDetails): Promise<null> {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('firebase_auth_redirect_pending', 'true');
      sessionStorage.setItem('firebase_auth_redirect_ts', Date.now().toString());
      sessionStorage.setItem('firebase_auth_platform', platform.platformName);
      localStorage.setItem('firebase_auth_redirect_pending', 'true');
    }
  } catch {}

  await signInWithRedirect(auth, googleProvider);
  return null;
}

/**
 * Startup handler for processing redirect results on mobile phones, tablets, or desktops.
 * Recovers authenticated user session safely without unhandled error loops.
 */
export async function resolveRedirectAuthResult(): Promise<UserCredential | null> {
  if (typeof window === 'undefined') return null;

  try {
    const result = await getRedirectResult(auth, browserPopupRedirectResolver);
    clearRedirectFlags();

    if (result && result.user) {
      console.log('[Firebase Auth] Redirect authentication successfully resolved user:', result.user.email);
      return result;
    }
    return null;
  } catch (err: any) {
    clearRedirectFlags();

    // Ignore null user
    if (err?.code === 'auth/null-user') {
      return null;
    }

    // Gracefully handle "The requested action is invalid" or invalid action code
    if (
      err?.code === 'auth/invalid-action-code' ||
      String(err?.message || '').includes('The requested action is invalid')
    ) {
      console.warn('[Firebase Auth] Redirect handler notice: Action invalid or expired. Reset state cleanly.');
      return null;
    }

    console.warn('[Firebase Auth] Redirect resolution notice:', err?.code, err?.message);
    throw err;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  READ = 'read',
  LIST = 'list',
  WRITE = 'write',
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string): never {
  const errCode = error?.code || 'unknown';
  const errMsg = error?.message || String(error);
  console.error(`[Firestore Error] Operation: ${operationType} on path: "${path}" failed. Code: ${errCode}. Details: ${errMsg}`);
  throw new Error(`Firestore ${operationType} operation failed on ${path}: [${errCode}] ${errMsg}`);
}
