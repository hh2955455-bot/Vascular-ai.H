export type LanguageMode = 'en' | 'ar' | 'bilingual';

export type ExplanationLevel =
  | 'Simple'
  | 'Standard'
  | 'Detailed'
  | 'Resident Level'
  | 'Consultant Level'
  | 'Exam Level'
  | 'Surgical Level';

export type UserRole = 'student' | 'resident' | 'fellow' | 'consultant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  specialty: string;
  studyLevel: UserRole;
  preferredLanguage: LanguageMode;
  streakDays: number;
  totalStudyHours: number;
  mcqsCompleted: number;
  mcqAccuracy: number;
  flashcardsMastered: number;
}

export interface DocumentChunk {
  chunk_id: string;
  document_id: string;
  document_title: string;
  chapter: string;
  section: string;
  page_number: number;
  content: string;
  contentAr?: string;
  tags: string[];
}

export interface DocumentChapter {
  chapterNumber: number;
  title: string;
  titleAr?: string;
  pageStart: number;
  pageEnd: number;
  keyTopics: string[];
}

export interface ReferenceDocument {
  id: string;
  title: string;
  shortTitle: string;
  edition?: string;
  authors: string;
  year: number;
  type: 'textbook' | 'guideline' | 'review' | 'notes';
  coverColor: string;
  status: 'indexed' | 'processing' | 'ready';
  totalPages: number;
  chaptersCount: number;
  chunksCount: number;
  chapters: DocumentChapter[];
  chunks: DocumentChunk[];
  isUserUploaded?: boolean;
}

export interface StudyNote {
  id: string;
  title: string;
  titleAr?: string;
  category: 'Arterial' | 'Venous' | 'Aorta' | 'Carotid' | 'Trauma' | 'Dialysis' | 'General';
  tags: string[];
  summary: string;
  keyPoints: string[];
  detailedContent: string;
  surgicalPearls?: string[];
  examPoints?: string[];
  references: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  topic: string;
  subtopic: string;
  category: 'Arterial' | 'Venous' | 'Aorta' | 'Carotid' | 'Trauma' | 'Dialysis' | 'General';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  frontEn: string;
  frontAr?: string;
  backEn: string;
  backAr?: string;
  referenceCitation: string;
  status: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewed?: string;
}

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  textEn: string;
  textAr?: string;
}

export interface MCQQuestion {
  id: string;
  topic: string;
  category: 'Arterial' | 'Venous' | 'Aorta' | 'Carotid' | 'Trauma' | 'Dialysis' | 'General';
  difficulty: 'Medical Student' | 'Resident' | 'Board Level';
  questionEn: string;
  questionAr?: string;
  options: MCQOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanationEn: string;
  explanationAr?: string;
  surgicalPearls?: string;
  referenceCitation: string;
}

export interface ClinicalCaseStep {
  id: string;
  stageTitle: string;
  descriptionEn: string;
  descriptionAr?: string;
  patientData?: {
    vitals?: Record<string, string>;
    labs?: Record<string, string>;
    imaging?: string;
  };
  options: {
    id: string;
    textEn: string;
    isOptimal: boolean;
    feedbackEn: string;
    feedbackAr?: string;
  }[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  titleAr?: string;
  patientProfile: string;
  difficulty: 'Resident' | 'Fellow' | 'Consultant';
  category: 'Arterial' | 'Aorta' | 'Carotid' | 'Trauma' | 'Venous';
  initialVitals: Record<string, string>;
  chiefComplaint: string;
  historySummary: string;
  steps: ClinicalCaseStep[];
  learningPearls: string[];
  references: string[];
}

export interface VascularAnatomyModule {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'Aorta' | 'Iliac' | 'Femoral' | 'Popliteal' | 'Tibial' | 'Carotid' | 'Upper Limb' | 'Venous' | 'Dialysis Access';
  course: string;
  branches: { name: string; description: string; clinicalSignificance: string }[];
  relations: string[];
  landmarks: string[];
  surgicalExposure: {
    incision: string;
    plane: string;
    structuresAtRisk: string[];
    pearls: string[];
  };
  commonPathology: string[];
  examHighlights: string[];
  references: string[];
  diagramType: 'aorta' | 'femoral' | 'popliteal' | 'carotid' | 'tibial' | 'venous' | 'fistula';
}

export interface SearchResultItem {
  id: string;
  type: 'reference' | 'note' | 'flashcard' | 'mcq' | 'anatomy';
  title: string;
  sourceName: string;
  chapterOrCategory: string;
  page?: number;
  excerptEn: string;
  excerptAr?: string;
  relevanceScore: number;
  contentToPass?: string;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  textEn: string;
  textAr?: string;
  level?: ExplanationLevel;
  citations?: { source: string; chapter: string; page: number }[];
  isSimplified?: boolean;
  algorithmData?: string[];
  hasMedicalDiagram?: boolean;
  followUpQuestions?: string[];
  isStreaming?: boolean;
  reactions?: Record<string, number>;
}
