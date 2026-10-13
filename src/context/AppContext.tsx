import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ExplanationLevel,
  Flashcard,
  LanguageMode,
  MCQQuestion,
  ReferenceDocument,
  StudyNote,
  UserProfile,
  ClinicalCase
} from '../types';
import { INITIAL_REFERENCES } from '../data/referencesData';
import { INITIAL_FLASHCARDS } from '../data/flashcardData';
import { VASCULAR_MCQS } from '../data/mcqData';
import { CLINICAL_CASES } from '../data/clinicalCasesData';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  executeGoogleSignIn,
  resolveRedirectAuthResult,
  detectMobilePlatform
} from '../services/firebase';
import { getResilientClinicalCases } from '../services/serviceWorker';
import {
  onAuthStateChanged,
  getRedirectResult,
  signOut,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { fetchUserBooksFromFirestore } from '../services/bookUploadService';

export type ActiveTab =
  | 'dashboard'
  | 'tutor'
  | 'search'
  | 'library'
  | 'notes'
  | 'flashcards'
  | 'mcq'
  | 'cases'
  | 'anatomy'
  | 'analytics'
  | 'settings';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
  explanationLevel: ExplanationLevel;
  setExplanationLevel: (level: ExplanationLevel) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: UserProfile;
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  references: ReferenceDocument[];
  addReference: (doc: ReferenceDocument) => void;
  deleteReference: (docId: string) => Promise<void>;
  selectedDocForReader: ReferenceDocument | null;
  setSelectedDocForReader: (doc: ReferenceDocument | null) => void;
  notes: StudyNote[];
  addNote: (note: StudyNote) => void;
  updateNote: (id: string, updated: Partial<StudyNote>) => void;
  deleteNote: (id: string) => void;
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  updateFlashcardStatus: (id: string, status: 'learning' | 'mastered') => void;
  addFlashcard: (card: Flashcard) => void;
  addMultipleFlashcards: (cards: Flashcard[]) => void;
  mcqs: MCQQuestion[];
  setMcqs: React.Dispatch<React.SetStateAction<MCQQuestion[]>>;
  addMcq: (mcq: MCQQuestion) => void;
  addMultipleMcqs: (questions: MCQQuestion[]) => void;
  clinicalCases: ClinicalCase[];
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isMedicalDisclaimerOpen: boolean;
  setIsMedicalDisclaimerOpen: (open: boolean) => void;
  isBooksCatalogOpen: boolean;
  setIsBooksCatalogOpen: (open: boolean) => void;
  isContactDeveloperOpen: boolean;
  setIsContactDeveloperOpen: (open: boolean) => void;
  isPhonePermissionsOpen: boolean;
  setIsPhonePermissionsOpen: (open: boolean) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
  tutorInitialPrompt: string | null;
  setTutorInitialPrompt: (prompt: string | null) => void;
  searchInitialQuery: string | null;
  setSearchInitialQuery: (q: string | null) => void;
  // Firebase Auth additions
  firebaseUser: User | null;
  isAuthLoading: boolean;
  signInWithGoogle: (mode?: 'auto' | 'popup' | 'redirect') => Promise<void>;
  signOutUser: () => Promise<void>;
  // Registration state
  isRegistered: boolean;
  setIsRegistered: (reg: boolean) => void;
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: (open: boolean) => void;
  // Black Box Audit Trail Modal State
  isBlackBoxAuditOpen: boolean;
  setIsBlackBoxAuditOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getSavedProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem('vascular_user_profile');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Could not read saved profile:', err);
  }
  return {
    id: 'usr-dr-' + Math.random().toString(36).substring(2, 7),
    name: '',
    email: '',
    specialty: 'جراحة الأوعية الدموية (Vascular Surgery)',
    studyLevel: 'resident',
    preferredLanguage: 'bilingual',
    streakDays: 1,
    totalStudyHours: 0,
    mcqsCompleted: 0,
    mcqAccuracy: 0,
    flashcardsMastered: 0
  };
};

const INITIAL_PROFILE: UserProfile = getSavedProfile();

const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-ali-init',
    title: 'Acute Limb Ischemia: Rutherford Classification & Emergency Protocol',
    titleAr: 'إقفار الأطراف الحاد: تصنيف رذرفورد والبروتوكول الطارئ',
    category: 'Arterial',
    tags: ['ALI', 'Rutherford', 'Heparin', 'Fogarty', 'Fasciotomy'],
    summary: 'Essential triage, distinguishing Class IIa (motor intact) from IIb (motor deficit), immediate heparin bolus, and four-compartment fasciotomy triggers.',
    keyPoints: [
      'Immediate IV Heparin 80 U/kg bolus + 18 U/kg/hr prevents secondary distal thrombus extension.',
      'Rutherford IIb requires immediate surgical OR exploration; do not delay for CTA.',
      'Fasciotomy mandatory if ischemic time >4-6 hours or tense calves present upon reperfusion.'
    ],
    detailedContent: `### Emergency Vascular Protocol for ALI

1. **Physical Bedside Interrogation**:
   - Evaluate the 6 Ps: Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia.
   - Handheld continuous-wave Doppler: assess dorsalis pedis, posterior tibial, popliteal arterial and venous signals.

2. **Rutherford Classification**:
   - **Class I**: Viable, no sensory/motor loss. Arterial Doppler audible.
   - **Class IIa**: Marginally threatened. Sensory loss limited to toes, motor intact. Arterial inaudible, venous audible.
   - **Class IIb**: Immediately threatened. Motor deficit present (foot drop/toe paresis). Emergency surgical revascularization without delay.
   - **Class III**: Irreversible. Severe rigor/rigidity, profound sensory loss, venous Doppler silent. Primary amputation to prevent fatal reperfusion hyperkalemia.`,
    surgicalPearls: [
      'Fogarty catheter sizing: 4F for common and superficial femoral arteries; 3F for popliteal and tibial runoff.',
      'Two-incision four-compartment fasciotomy: lateral incision decompresses anterior & lateral; medial incision decompresses superficial & deep posterior compartments.'
    ],
    examPoints: [
      'Motor weakness is the single most critical prognostic discriminator separating Rutherford IIa from IIb.'
    ],
    references: [
      "Rutherford's Vascular Surgery (10th Ed.), Chapter 52, p. 1245",
      'ESVS 2024 ALI Practice Guidelines, Section 4'
    ],
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'note-aaa-init',
    title: 'Abdominal Aortic Aneurysm (AAA): Repair Criteria & EVAR Anatomy',
    titleAr: 'تمدد الشريان الأورطي البطني: معايير الإصلاح وتشريح EVAR',
    category: 'Aorta',
    tags: ['AAA', 'EVAR', 'Aorta', 'Screening', 'Guidelines'],
    summary: 'Standard intervention thresholds (5.5 cm men / 5.0 cm women), rapid growth criteria, and EVAR neck anatomical rules.',
    keyPoints: [
      'Elective intervention indicated at 5.5 cm in men, 5.0 cm in women.',
      'EVAR anatomical criteria: neck length >= 15 mm, neck angulation <= 60 degrees, neck diameter 18-32 mm.',
      'Permissive hypotension (SBP 70-90 mmHg) is critical in ruptured AAA.'
    ],
    detailedContent: `### AAA Surgical Decision Matrix

- **Surveillance**:
  - 3.0 - 3.9 cm: Every 3 years
  - 4.0 - 4.9 cm: Annually
  - 5.0 - 5.4 cm: Every 6 months
- **Endoleak Types**:
  - Type I: Attachment leak (proximal/distal) - high pressure, repair immediately.
  - Type II: Lumbar/IMA backflow - monitor unless sac expands >5 mm.
  - Type III: Component modular disconnection or fabric defect - repair immediately.`,
    surgicalPearls: [
      'The left renal vein crosses anterior to the aorta and can be divided near the IVC for high proximal neck exposure without renal loss due to gonadal and adrenal collateral drainage.'
    ],
    examPoints: [
      'Rupture risk in women is up to four times higher than in men at comparable aortic diameters.'
    ],
    references: [
      'SVS & ESVS Clinical Practice Guidelines on AAA (2023)',
      "Rutherford's Vascular Surgery 10th Ed., Chapter 78"
    ],
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('bilingual');
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('Resident Level');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vascular_theme');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vascular_user_registered') === 'true';
    } catch {
      return false;
    }
  });
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vascular_user_registered') !== 'true';
    } catch {
      return true;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [references, setReferences] = useState<ReferenceDocument[]>(() => {
    const esvsDocs = INITIAL_REFERENCES;
    try {
      const saved = localStorage.getItem('vascular_user_uploaded_books');
      if (saved) {
        const parsed: ReferenceDocument[] = JSON.parse(saved);
        // Only keep user uploaded books, filter out obsolete non-ESVS default textbooks
        const userBooks = parsed.filter(b => b.isUserUploaded && b.id !== 'rutherford-10th');
        const existingIds = new Set(esvsDocs.map(d => d.id));
        const newUploaded = userBooks.filter(b => !existingIds.has(b.id));
        return [...newUploaded, ...esvsDocs];
      }
    } catch (e) {
      console.warn('Could not load user uploaded books from storage:', e);
    }
    return esvsDocs;
  });
  const [selectedDocForReader, setSelectedDocForReader] = useState<ReferenceDocument | null>(null);
  const [notes, setNotes] = useState<StudyNote[]>(INITIAL_NOTES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [mcqs, setMcqs] = useState<MCQQuestion[]>(VASCULAR_MCQS);
  const [clinicalCases, setClinicalCases] = useState<ClinicalCase[]>(CLINICAL_CASES);

  // Sync clinical cases from Workbox offline cache and server API
  useEffect(() => {
    getResilientClinicalCases().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setClinicalCases(loaded);
      }
    }).catch(() => {});
  }, []);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMedicalDisclaimerOpen, setIsMedicalDisclaimerOpen] = useState(false);
  const [isBooksCatalogOpen, setIsBooksCatalogOpen] = useState(false);
  const [isContactDeveloperOpen, setIsContactDeveloperOpen] = useState(false);
  const [isPhonePermissionsOpen, setIsPhonePermissionsOpen] = useState(false);
  const [isBlackBoxAuditOpen, setIsBlackBoxAuditOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string | null>(null);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Subscribe to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);

      if (user) {
        // Load User Profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setUserProfile(prev => ({ ...prev, ...data }));
          } else {
            // Initialize new user profile
            const newProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || 'Vascular Surgeon',
              email: user.email || '',
              specialty: 'Vascular Surgery Resident',
              studyLevel: 'resident',
              preferredLanguage: 'bilingual',
              streakDays: 1,
              totalStudyHours: 0,
              mcqsCompleted: 0,
              mcqAccuracy: 0,
              flashcardsMastered: 0
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore:', err);
        }

        // Fetch User Books from Firestore
        try {
          const cloudBooks = await fetchUserBooksFromFirestore(user.uid);
          if (cloudBooks.length > 0) {
            setReferences(prev => {
              const existingIds = new Set(prev.map(b => b.id));
              const newBooks = cloudBooks.filter(b => !existingIds.has(b.id));
              return [...newBooks, ...prev];
            });
          }
        } catch (err) {
          console.warn('Error loading cloud books:', err);
        }

        // Fetch User Notes from Firestore
        try {
          const notesSnap = await getDocs(collection(db, 'users', user.uid, 'notes'));
          if (!notesSnap.empty) {
            const cloudNotes: StudyNote[] = notesSnap.docs.map(d => d.data() as StudyNote);
            setNotes(prev => {
              const existingIds = new Set(cloudNotes.map(n => n.id));
              const remaining = prev.filter(n => !existingIds.has(n.id));
              return [...cloudNotes, ...remaining];
            });
          }
        } catch (err) {
          console.warn('Error loading cloud notes:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle return from cross-platform signInWithRedirect (Android, iOS, WebViews, and Desktop)
  useEffect(() => {
    let isMounted = true;

    const processRedirectResult = async () => {
      let wasRedirectPending = false;
      try {
        if (typeof window !== 'undefined') {
          wasRedirectPending =
            sessionStorage.getItem('firebase_auth_redirect_pending') === 'true' ||
            localStorage.getItem('firebase_auth_redirect_pending') === 'true';
        }
      } catch {
        // Storage access may be restricted
      }

      if (wasRedirectPending) {
        setIsAuthLoading(true);
      }

      try {
        const result = await resolveRedirectAuthResult();
        if (!isMounted) return;

        if (result && result.user) {
          const user = result.user;
          setFirebaseUser(user);
          const platform = detectMobilePlatform();
          console.log(`[Firebase Auth] Successfully established user session on ${platform.platformName} for:`, user.email);

          showNotification(
            languageMode === 'ar'
              ? `تم تسجيل الدخول بنجاح عبر حساب Google (${user.displayName || user.email})`
              : `Signed in successfully via Google (${user.displayName || user.email})`
          );
        }
      } catch (err: any) {
        if (!isMounted) return;
        if (err?.code && err.code !== 'auth/null-user') {
          console.warn('[Firebase Auth] Redirect result notice:', err);
          if (err.code === 'auth/unauthorized-domain') {
            showNotification(
              languageMode === 'ar'
                ? 'يرجى إضافة نطاق هذا الرابط في Firebase Console > Authentication > Settings > Authorized Domains.'
                : 'Please add this domain to Firebase Console > Authentication > Settings > Authorized Domains.'
            );
          } else if (err.code !== 'auth/user-cancelled') {
            showNotification(err.message || 'Authentication error.');
          }
        }
      } finally {
        if (isMounted && wasRedirectPending) {
          setIsAuthLoading(false);
        }
      }
    };

    processRedirectResult();

    return () => {
      isMounted = false;
    };
  }, [languageMode]);

  const signInWithGoogle = async (mode: 'auto' | 'popup' | 'redirect' = 'auto') => {
    setIsAuthLoading(true);
    try {
      const user = await executeGoogleSignIn(mode);
      if (user) {
        setFirebaseUser(user);
        showNotification(
          languageMode === 'ar'
            ? 'تم تسجيل الدخول بحساب Google بنجاح.'
            : 'Signed in with Google successfully.'
        );
      }
      // Note: If user is redirected on mobile/webview, execution transfers to Google login page
    } catch (error: any) {
      // Gracefully handle deliberate user cancellations
      const errString = `${error?.code || ''} ${error?.message || ''} ${String(error || '')}`;
      if (
        errString.includes('popup-closed-by-user') ||
        errString.includes('cancelled-popup-request') ||
        errString.includes('user-cancelled')
      ) {
        console.info('[Firebase Auth] Google Sign-In closed/cancelled by user.');
        return;
      }

      console.error('Google Sign In failed:', error);
      let errorMsg = languageMode === 'ar' ? 'تعذر تسجيل الدخول عبر Google.' : 'Failed to sign in with Google.';
      if (error?.code === 'auth/unauthorized-domain') {
        errorMsg = languageMode === 'ar'
          ? 'النطاق غير مصرح به: يرجى إضافة هذا النطاق إلى Authorized Domains في Firebase Console.'
          : 'Unauthorized domain: please add this domain to Authorized Domains in Firebase Console.';
      } else if (error?.code === 'auth/popup-blocked') {
        errorMsg = languageMode === 'ar'
          ? 'المتصفح حظر النافذة المنبثقة. جاري التحويل عبر إعادة التوجيه...'
          : 'Popup was blocked by mobile browser. Switching to redirect sign-in...';
        showNotification(errorMsg);
        await executeGoogleSignIn('redirect');
        return;
      } else if (error?.message?.includes('The requested action is invalid') || error?.code === 'auth/invalid-action-code') {
        errorMsg = languageMode === 'ar'
          ? 'الإجراء غير صالح: تأكد من تفعيل Google Provider وإضافة نطاق الاستضافة إلى Authorized Domains في Firebase.'
          : 'Invalid action: ensure Google Provider is enabled and domain is in Authorized Domains in Firebase.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      showNotification(errorMsg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      showNotification('Signed out.');
    } catch (error: any) {
      console.error('Sign Out failed:', error);
    }
  };

  // Sync dark mode class on document and persist
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('vascular_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('vascular_theme', 'light');
      }
    } catch {
      // ignore in iframe
    }
  }, [darkMode]);

  // Sync RTL direction and language attribute
  useEffect(() => {
    if (languageMode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else if (languageMode === 'en') {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    } else {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    }
  }, [languageMode]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const updateUserProfile = async (partial: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('vascular_user_profile', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save profile to localStorage:', e);
      }
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(err => {
          console.warn('Failed to sync profile update:', err);
        });
      }
      return updated;
    });
  };

  const addReference = (docItem: ReferenceDocument) => {
    setReferences(prev => {
      const updated = [docItem, ...prev.filter(d => d.id !== docItem.id)];
      try {
        const userUploaded = updated.filter(d => d.isUserUploaded);
        localStorage.setItem('vascular_user_uploaded_books', JSON.stringify(userUploaded));
      } catch (e) {
        console.warn('Could not persist uploaded books to localStorage:', e);
      }
      return updated;
    });
    showNotification(`"${docItem.title}" processed and indexed successfully.`);
  };

  const deleteReference = async (docId: string) => {
    const docToDelete = references.find(d => d.id === docId);
    const docTitle = docToDelete?.title || (languageMode === 'ar' ? 'الكتاب المرفوع' : 'Uploaded Book');

    setReferences(prev => {
      const updated = prev.filter(d => d.id !== docId);
      try {
        const userUploaded = updated.filter(d => d.isUserUploaded);
        localStorage.setItem('vascular_user_uploaded_books', JSON.stringify(userUploaded));
      } catch (e) {
        console.warn('Could not persist updated books after deletion:', e);
      }
      return updated;
    });

    if (selectedDocForReader?.id === docId) {
      setSelectedDocForReader(null);
    }

    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'uploaded_books', docId));
      } catch (err) {
        console.warn('Failed to delete book from Firestore:', err);
      }
    }

    showNotification(
      languageMode === 'ar'
        ? `تم مسح "${docTitle}" بنجاح.`
        : `"${docTitle}" removed successfully.`
    );
  };

  const addNote = async (note: StudyNote) => {
    setNotes(prev => [note, ...prev]);
    showNotification(`Note "${note.title}" saved.`);
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'notes', note.id), {
          ...note,
          userId: firebaseUser.uid,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Failed to sync note to Firestore:', err);
      }
    }
  };

  const updateNote = async (id: string, updated: Partial<StudyNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n));
    showNotification('Note updated successfully.');
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'notes', id), {
          ...updated,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to update note in Firestore:', err);
      }
    }
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showNotification('Note removed.');
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'notes', id));
      } catch (err) {
        console.warn('Failed to delete note from Firestore:', err);
      }
    }
  };

  const updateFlashcardStatus = async (id: string, status: 'learning' | 'mastered') => {
    setFlashcards(prev => prev.map(fc => {
      if (fc.id === id) {
        const updated = {
          ...fc,
          status,
          reviewCount: fc.reviewCount + 1,
          lastReviewed: new Date().toISOString()
        };
        if (firebaseUser) {
          setDoc(doc(db, 'users', firebaseUser.uid, 'flashcards', id), {
            ...updated,
            userId: firebaseUser.uid
          }, { merge: true }).catch(console.warn);
        }
        return updated;
      }
      return fc;
    }));
    if (status === 'mastered') {
      setUserProfile(p => ({ ...p, flashcardsMastered: p.flashcardsMastered + 1 }));
    }
  };

  const addFlashcard = async (card: Flashcard) => {
    setFlashcards(prev => [card, ...prev]);
    showNotification(`Flashcard added to deck.`);
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'flashcards', card.id), {
          ...card,
          userId: firebaseUser.uid
        });
      } catch (err) {
        console.warn('Failed to save flashcard to Firestore:', err);
      }
    }
  };

  const addMultipleFlashcards = (cards: Flashcard[]) => {
    setFlashcards(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const fresh = cards.filter(c => !existingIds.has(c.id));
      return [...fresh, ...prev];
    });
    showNotification(`Added ${cards.length} flashcards to your deck.`);
  };

  const addMcq = (mcq: MCQQuestion) => {
    setMcqs(prev => [mcq, ...prev]);
    showNotification('New vascular MCQ generated.');
  };

  const addMultipleMcqs = (questions: MCQQuestion[]) => {
    setMcqs(prev => {
      const existingIds = new Set(prev.map(q => q.id));
      const fresh = questions.filter(q => !existingIds.has(q.id));
      return [...fresh, ...prev];
    });
    showNotification(`Added ${questions.length} board MCQs.`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        languageMode,
        setLanguageMode,
        explanationLevel,
        setExplanationLevel,
        darkMode,
        setDarkMode,
        userProfile,
        updateUserProfile,
        references,
        addReference,
        deleteReference,
        selectedDocForReader,
        setSelectedDocForReader,
        notes,
        addNote,
        updateNote,
        deleteNote,
        flashcards,
        setFlashcards,
        updateFlashcardStatus,
        addFlashcard,
        addMultipleFlashcards,
        mcqs,
        setMcqs,
        addMcq,
        addMultipleMcqs,
        clinicalCases,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isMedicalDisclaimerOpen,
        setIsMedicalDisclaimerOpen,
        isBooksCatalogOpen,
        setIsBooksCatalogOpen,
        isContactDeveloperOpen,
        setIsContactDeveloperOpen,
        isPhonePermissionsOpen,
        setIsPhonePermissionsOpen,
        notification,
        showNotification,
        tutorInitialPrompt,
        setTutorInitialPrompt,
        searchInitialQuery,
        setSearchInitialQuery,
        firebaseUser,
        isAuthLoading,
        signInWithGoogle,
        signOutUser,
        isRegistered,
        setIsRegistered,
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
        isBlackBoxAuditOpen,
        setIsBlackBoxAuditOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
