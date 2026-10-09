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
  OperationType
} from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
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
  selectedDocForReader: ReferenceDocument | null;
  setSelectedDocForReader: (doc: ReferenceDocument | null) => void;
  notes: StudyNote[];
  addNote: (note: StudyNote) => void;
  updateNote: (id: string, updated: Partial<StudyNote>) => void;
  deleteNote: (id: string) => void;
  flashcards: Flashcard[];
  updateFlashcardStatus: (id: string, status: 'learning' | 'mastered') => void;
  addFlashcard: (card: Flashcard) => void;
  mcqs: MCQQuestion[];
  addMcq: (mcq: MCQQuestion) => void;
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
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PROFILE: UserProfile = {
  id: 'usr-dr-01',
  name: 'Dr. Tariq Al-Mansoor',
  email: 'tariq.almansoor@vascular.med',
  specialty: 'Vascular Surgery Resident',
  studyLevel: 'resident',
  preferredLanguage: 'bilingual',
  streakDays: 14,
  totalStudyHours: 42.5,
  mcqsCompleted: 86,
  mcqAccuracy: 78.4,
  flashcardsMastered: 38
};

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
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [references, setReferences] = useState<ReferenceDocument[]>(INITIAL_REFERENCES);
  const [selectedDocForReader, setSelectedDocForReader] = useState<ReferenceDocument | null>(null);
  const [notes, setNotes] = useState<StudyNote[]>(INITIAL_NOTES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [mcqs, setMcqs] = useState<MCQQuestion[]>(VASCULAR_MCQS);
  const [clinicalCases] = useState<ClinicalCase[]>(CLINICAL_CASES);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMedicalDisclaimerOpen, setIsMedicalDisclaimerOpen] = useState(false);
  const [isBooksCatalogOpen, setIsBooksCatalogOpen] = useState(false);
  const [isContactDeveloperOpen, setIsContactDeveloperOpen] = useState(false);
  const [isPhonePermissionsOpen, setIsPhonePermissionsOpen] = useState(false);
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

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotification('Signed in with Google successfully.');
    } catch (error: any) {
      console.error('Google Sign In failed:', error);
      showNotification(error?.message || 'Google sign-in was cancelled or failed.');
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

  // Sync RTL direction if Arabic-only
  useEffect(() => {
    if (languageMode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
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
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(err => {
          console.warn('Failed to sync profile update:', err);
        });
      }
      return updated;
    });
  };

  const addReference = (docItem: ReferenceDocument) => {
    setReferences(prev => [docItem, ...prev]);
    showNotification(`"${docItem.title}" processed and indexed successfully.`);
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

  const addMcq = (mcq: MCQQuestion) => {
    setMcqs(prev => [mcq, ...prev]);
    showNotification('New vascular MCQ generated.');
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
        selectedDocForReader,
        setSelectedDocForReader,
        notes,
        addNote,
        updateNote,
        deleteNote,
        flashcards,
        updateFlashcardStatus,
        addFlashcard,
        mcqs,
        addMcq,
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
