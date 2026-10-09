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
  const [darkMode, setDarkMode] = useState<boolean>(true);
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

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  const updateUserProfile = (partial: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...partial }));
  };

  const addReference = (doc: ReferenceDocument) => {
    setReferences(prev => [doc, ...prev]);
    showNotification(`"${doc.title}" processed and indexed successfully.`);
  };

  const addNote = (note: StudyNote) => {
    setNotes(prev => [note, ...prev]);
    showNotification(`Note "${note.title}" saved.`);
  };

  const updateNote = (id: string, updated: Partial<StudyNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n));
    showNotification('Note updated successfully.');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showNotification('Note removed.');
  };

  const updateFlashcardStatus = (id: string, status: 'learning' | 'mastered') => {
    setFlashcards(prev => prev.map(fc => {
      if (fc.id === id) {
        return {
          ...fc,
          status,
          reviewCount: fc.reviewCount + 1,
          lastReviewed: new Date().toISOString()
        };
      }
      return fc;
    }));
    if (status === 'mastered') {
      setUserProfile(p => ({ ...p, flashcardsMastered: p.flashcardsMastered + 1 }));
    }
  };

  const addFlashcard = (card: Flashcard) => {
    setFlashcards(prev => [card, ...prev]);
    showNotification(`Flashcard added to deck.`);
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
