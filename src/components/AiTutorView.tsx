import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { askVascularTutor } from '../services/aiService';
import { ExplanationLevel, TutorMessage } from '../types';
import { MedicalVisualMediaViewer } from './MedicalVisualMediaViewer';
import { GenerateTopicMaterialModal } from './GenerateTopicMaterialModal';
import {
  Send,
  Sparkles,
  BookOpen,
  FilePlus,
  HelpCircle,
  Layers,
  Check,
  RotateCcw,
  Zap,
  ShieldCheck,
  SlidersHorizontal,
  GitBranch,
  Copy,
  Calculator,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  BookmarkCheck,
  Activity,
  HeartPulse,
  AlertTriangle,
  X,
  Stethoscope,
  Scissors,
  Volume2,
  VolumeX,
  Smile,
  ThumbsUp,
  Heart,
  Flame,
  MessageSquare,
  Globe,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { formatAndCleanClinicalText } from '../utils/clinicalTextFormatter';

export const AiTutorView: React.FC = () => {
  const {
    explanationLevel,
    setExplanationLevel,
    languageMode,
    tutorInitialPrompt,
    setTutorInitialPrompt,
    references,
    addNote,
    addFlashcard,
    setActiveTab,
    showNotification
  } = useApp();

  const isAr = languageMode === 'ar';
  const isBilingual = languageMode === 'bilingual';

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedBookContext, setSelectedBookContext] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [fastMode, setFastMode] = useState(true); // Default to fast mode for instant response
  const [allowWebSearch, setAllowWebSearch] = useState(false); // Only searches when requested! Default OFF
  const [maximizedMessage, setMaximizedMessage] = useState<TutorMessage | null>(null);
  const [activeTool, setActiveTool] = useState<'heparin' | 'rutherford' | 'wifi' | 'evar' | null>(null);

  // Topic Material Generator Modal State
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [selectedTopicForModal, setSelectedTopicForModal] = useState('');
  const [topicModalExcerpt, setTopicModalExcerpt] = useState('');

  // Interactive Topic MCQs and Flashcards states
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [flashcardIndices, setFlashcardIndices] = useState<Record<string, number>>({});
  const [flippedFlashcards, setFlippedFlashcards] = useState<Record<string, boolean>>({});
  const [savedFlashcards, setSavedFlashcards] = useState<Record<string, boolean>>({});

  // Heparin calculator state
  const [patientWeightKg, setPatientWeightKg] = useState<number>(75);

  // Rutherford interactive state
  const [ruthSensory, setRuthSensory] = useState<'none' | 'toes' | 'beyond' | 'anesthesia'>('toes');
  const [ruthMotor, setRuthMotor] = useState<'none' | 'mild' | 'paralysis'>('none');
  const [ruthArterial, setRuthArterial] = useState<boolean>(false);
  const [ruthVenous, setRuthVenous] = useState<boolean>(true);

  // WIfI calculator state
  const [wifiWound, setWifiWound] = useState<number>(1);
  const [wifiIschemia, setWifiIschemia] = useState<number>(2);
  const [wifiInfection, setWifiInfection] = useState<number>(1);

  // EVAR checker state
  const [evarNeckLength, setEvarNeckLength] = useState<number>(18);
  const [evarNeckAngle, setEvarNeckAngle] = useState<number>(30);
  const [evarDiameter, setEvarDiameter] = useState<number>(24);

  // Speech & Emoji states
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<'medical' | 'expressions' | 'praise'>('medical');

  // Quick Emoji palette
  const quickEmojis = ['🫀', '🩺', '🩸', '⚡', '💡', '🎯', '⚠️', '📌', '✅', '💊', '🧠', '🔪', '👏', '❤️', '👍'];

  // Categorized Emojis
  const emojiCategories = [
    {
      id: 'medical' as const,
      label: isAr ? 'أوعية وتشريح 🫀' : 'Vascular & Medical 🫀',
      emojis: ['🫀', '🩺', '🩸', '🔪', '🧠', '💊', '🩹', '🏥', '🔬', '📋', '🦴', '🩻', '💉', '🧬', '🦵', '🦶']
    },
    {
      id: 'expressions' as const,
      label: isAr ? 'إشارات سريرية 💡' : 'Clinical Cues 💡',
      emojis: ['💡', '⚡', '🎯', '⚠️', '📌', '✅', '💎', '🔍', '📊', '📈', '🚨', '⏱️', '🛡️', '❓']
    },
    {
      id: 'praise' as const,
      label: isAr ? 'تفاعل وتشجيع 👏' : 'Reactions & Praise 👏',
      emojis: ['👏', '❤️', '👍', '🔥', '🌟', '✨', '💯', '🎓', '🚀', '🤝', '🙌', '🤔', '😊', '🎉']
    }
  ];

  // Expressive speech synthesis
  const handleSpeak = (msgId: string, textToSpeak: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      showNotification(isAr ? 'المتصفح لا يدعم النطق الصوتي المباشر.' : 'Speech synthesis not supported in this browser.');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown and prepare expressive phrasing
    const cleanText = textToSpeak
      .replace(/#+\s+/g, '')
      .replace(/\*\*/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/[-*]\s+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const hasArabic = /[\u0600-\u06FF]/.test(cleanText);
    utterance.lang = hasArabic ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleInsertEmoji = (emoji: string) => {
    setInputPrompt(prev => prev + emoji);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id === msgId) {
          const currentReactions = { ...(m.reactions || {}) };
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          return { ...m, reactions: currentReactions };
        }
        return m;
      })
    );
  };

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      textEn: `# Vascular Surgery AI Clinical Assistant

Welcome, Doctor. I am your specialized vascular surgery co-pilot, grounded strictly in the European Society for Vascular Surgery (ESVS) Guidelines and your uploaded medical reference books.

⚡ Strict Document Grounding: All answers are retrieved exclusively from the official ESVS guidelines and your uploaded books. Ask AI is the only area capable of fetching live web evidence, strictly when requested. If information is not in the uploaded documents, I will inform you directly ("عذراً، الإجابة غير موجودة في الكتب المرفوعة.").
Use the Clinical Tools bar above for instant bedside calculations and staging based on guidelines.`,
      textAr: `# المساعد السريري الذكي لجراحة الأوعية الدموية

أهلاً بك يا دكتور. أنا مساعدك السريري التخصصي، معتمد حصرياً ومطلقاً على إرشادات الجمعية الأوروبية لجراحة الأوعية الدموية (ESVS) والكتب والملفات التي تقوم برفعها بنفسك.

⚡ اعتماد مطلق على الوثائق المرفوعة: الإجابات مستخرجة حصرياً من إرشادات ESVS وملفاتك المرفوعة، ولا يتم جلب أي معلومات خارج نطاقها إلا عبر قسم Ask AI وفقط عند طلبك البحث في الإنترنت. وفي حال عدم توفر المعلومة في الكتب المرفوعة، ستتلقى حصراً عبارة: "عذراً، الإجابة غير موجودة في الكتب المرفوعة."`,
      level: 'Resident Level',
      citations: [
        {
          source: 'European Society for Vascular Surgery (ESVS) 2024 Guidelines',
          chapter: 'Clinical Practice Guidelines',
          page: 1
        }
      ],
      followUpQuestions: [
        'What are the mandatory indications for four-compartment fasciotomy in ESVS guidelines?',
        'How does ESVS 2024 define the anticoagulation protocol for Acute Limb Ischemia?',
        'What are the surgical threshold criteria for AAA in ESVS guidelines?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initial prompt from other views
  useEffect(() => {
    if (tutorInitialPrompt) {
      handleSend(tutorInitialPrompt);
      setTutorInitialPrompt(null);
    }
  }, [tutorInitialPrompt]);

  const handleSend = async (customPrompt?: string, isSimplify = false) => {
    const textToSend = customPrompt || inputPrompt.trim();
    if (!textToSend || isLoading) return;

    if (!customPrompt) {
      setInputPrompt('');
    }

    const userMsg: TutorMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      textEn: textToSend,
      textAr: textToSend,
    };

    const tempAssistantId = 'ast-temp-' + Date.now();
    const tempAssistantMsg: TutorMessage = {
      id: tempAssistantId,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      textEn: '',
      textAr: '',
      level: isSimplify ? 'Simple' : explanationLevel,
      citations: [],
      isStreaming: true
    };

    setMessages(prev => [...prev, userMsg, tempAssistantMsg]);
    setIsLoading(true);

    // Detect if user prompt explicitly requests external web search
    const explicitWebKeywords = ['ابحث في النت', 'ابحث على النت', 'ابحث في الانترنت', 'ابحث على الإنترنت', 'ابحث بالانترنت', 'search the web', 'search online', 'online evidence', 'مصادر خارجية', 'من النت'];
    const isUserExplicitWeb = explicitWebKeywords.some(kw => textToSend.toLowerCase().includes(kw));
    const shouldSearchWeb = allowWebSearch || isUserExplicitWeb;

    try {
      const response = await askVascularTutor({
        prompt: textToSend,
        level: isSimplify ? 'Simple' : explanationLevel,
        languageMode,
        contextDocumentId: selectedBookContext === 'all' ? undefined : selectedBookContext,
        isSimplifyRequest: isSimplify,
        fastMode,
        availableDocuments: references,
        isAskAiModule: true,
        allowExternalWebSearch: shouldSearchWeb,
        onChunk: (streamedText) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === tempAssistantId
                ? { ...m, textEn: formatAndCleanClinicalText(streamedText), textAr: formatAndCleanClinicalText(streamedText) }
                : m
            )
          );
        }
      });

      // Update final message
      setMessages(prev =>
        prev.map(m =>
          m.id === tempAssistantId
            ? {
                ...m,
                textEn: formatAndCleanClinicalText(response.textEn),
                textAr: formatAndCleanClinicalText(response.textAr),
                citations: response.citations,
                diagrams: response.diagrams,
                videos: response.videos,
                isWebGrounded: response.isWebGrounded,
                externalWebSources: response.externalWebSources,
                isStreaming: false,
                followUpQuestions: response.followUpQuestions,
                topicMcqs: response.topicMcqs,
                topicFlashcards: response.topicFlashcards,
                hasMedicalDiagram: textToSend.toLowerCase().includes('diagram') || textToSend.toLowerCase().includes('anatomy') || (response.diagrams && response.diagrams.length > 0)
              }
            : m
        )
      );
    } catch (err) {
      showNotification('Failed to generate tutor response. Please check network.');
      setMessages(prev => prev.filter(m => m.id !== tempAssistantId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainSimply = (originalText: string) => {
    handleSend(`Explain this simply for rapid review: ${originalText.slice(0, 300)}...`, true);
  };

  const handleSaveAsNote = (msg: TutorMessage) => {
    const titleMatch = msg.textEn.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Vascular Study Note';

    addNote({
      id: 'note-' + Date.now(),
      title,
      titleAr: msg.textAr?.match(/^#\s+(.+)$/m)?.[1]?.trim() || title,
      category: title.toLowerCase().includes('aorta') || title.toLowerCase().includes('aaa') ? 'Aorta'
        : title.toLowerCase().includes('carotid') ? 'Carotid'
        : title.toLowerCase().includes('venous') ? 'Venous'
        : title.toLowerCase().includes('trauma') ? 'Trauma'
        : title.toLowerCase().includes('dialysis') ? 'Dialysis'
        : 'Arterial',
      tags: ['AI Tutor', 'High Yield', explanationLevel, fastMode ? 'Rapid Consult' : 'Academic'],
      summary: msg.textEn.slice(0, 180).replace(/[#*`]/g, '') + '...',
      keyPoints: [
        'Reference-grounded note saved from Vascular AI Assistant.',
        'Verified against international vascular surgery guidelines.'
      ],
      detailedContent: msg.textEn,
      references: (msg.citations || []).map(c => `${c.source} (Ch: ${c.chapter}, p. ${c.page})`),
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleConvertToFlashcard = (msg: TutorMessage) => {
    const titleMatch = msg.textEn.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Vascular Concept';

    addFlashcard({
      id: 'fc-' + Date.now(),
      topic: title,
      subtopic: 'Clinical Core Points',
      category: 'Arterial',
      difficulty: 'Intermediate',
      frontEn: `Key principles, classification, and management of ${title}?`,
      frontAr: `ما هي المبادئ الأساسية وتصنيف وتدبير ${title}؟`,
      backEn: msg.textEn.slice(0, 350).replace(/[#*`]/g, '') + '...',
      backAr: msg.textAr ? msg.textAr.slice(0, 350).replace(/[#*`]/g, '') + '...' : undefined,
      referenceCitation: msg.citations?.[0]?.source || "Rutherford's Vascular Surgery 10th Ed.",
      status: 'learning',
      reviewCount: 0
    });
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('Response copied to clipboard!');
  };

  // Rutherford interactive calculation
  const getRutherfordOutcome = () => {
    if (ruthMotor === 'paralysis' || ruthSensory === 'anesthesia') {
      return {
        stage: 'Class III (Irreversible)',
        urgency: 'Profound anesthesia & rigor. Primary amputation indicated to prevent fatal myoglobinuric hyperkalemia.',
        color: 'text-red-400 bg-red-950/40 border-red-800'
      };
    }
    if (ruthMotor === 'mild' || ruthSensory === 'beyond') {
      return {
        stage: 'Class IIb (Immediately Threatened)',
        urgency: 'Emergency surgical revascularization without delay! Do not delay for formal CTA imaging.',
        color: 'text-amber-400 bg-amber-950/40 border-amber-800'
      };
    }
    if (ruthSensory === 'toes' && ruthMotor === 'none') {
      return {
        stage: 'Class IIa (Marginally Threatened)',
        urgency: 'Urgent revascularization within hours. Heparinize immediately.',
        color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800'
      };
    }
    return {
      stage: 'Class I (Viable)',
      urgency: 'Limb is not immediately threatened. Complete formal CTA imaging and urgent elective revascularization.',
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800'
    };
  };

  // Heparin calculation
  const heparinBolus = patientWeightKg * 80;
  const heparinRate = patientWeightKg * 18;

  const explanationLevels: ExplanationLevel[] = [
    'Simple',
    'Standard',
    'Detailed',
    'Resident Level',
    'Consultant Level',
    'Exam Level',
    'Surgical Level'
  ];

  const quickTopicPills = [
    { label: '⚡ ALI 6 Ps & Triage', prompt: 'Explain Acute Limb Ischemia, the 6 Ps, and emergency bedside triage.' },
    { label: '💉 Heparin Protocol', prompt: 'What is the exact IV Heparin dosing and aPTT titration protocol in acute arterial occlusion?' },
    { label: '🩸 Ruptured AAA Protocol', prompt: 'Explain Permissive Hypotension and EVAR-first approach in ruptured AAA.' },
    { label: '🧠 Carotid Endarterectomy', prompt: 'What are the indications and cranial nerve hazards for Carotid Endarterectomy (CEA)?' },
    { label: '🦶 WIfI Staging (Diabetic Foot)', prompt: 'Explain the SVS WIfI classification system for limb salvage.' },
    { label: '✂️ 4-Compartment Fasciotomy', prompt: 'What are the landmarks, incision planes, and structures at risk during 4-compartment lower leg fasciotomy?' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full p-2 sm:p-4 md:p-6 space-y-2.5 sm:space-y-3">
      {/* Top Controls: Speed Mode, Explanation Tier, Clinical Tool Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        {/* Speed Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFastMode(!fastMode);
              showNotification(fastMode ? 'Switched to Deep Academic Review mode' : '⚡ Rapid Bedside Consult Mode Activated (< 1 sec)');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
              fastMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
            title="Toggle between Rapid Clinical Consult (< 1 sec) and Deep Academic Review"
          >
            <Zap className={`w-3.5 h-3.5 ${fastMode ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{fastMode ? '⚡ Fast Consult (< 1s)' : '📚 Deep Academic'}</span>
          </button>

          {/* Ask AI Exclusive Web Search Toggle - Strictly on request only */}
          <button
            onClick={() => {
              setAllowWebSearch(!allowWebSearch);
              showNotification(
                !allowWebSearch
                  ? (isAr ? 'تم تفعيل البحث في الإنترنت بطلبك (ميزة حصرية لـ Ask AI)' : 'External Web Search Activated per Request (Ask AI Exclusive)')
                  : (isAr ? 'تم إيقاف البحث الخارجي - الالتزام المطلق بالكتب المرفوعة' : 'Restricted Exclusively to Uploaded Books')
              );
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              allowWebSearch
                ? 'bg-sky-500/25 text-sky-200 border-sky-400/60 shadow-xs ring-1 ring-sky-400/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isAr ? 'Ask AI لا يبحث في الإنترنت إلا عند طلبه صراحة - اضغط للتفعيل عند الحاجة' : 'Ask AI only searches external web sources when explicitly requested'}
          >
            <Globe className={`w-3.5 h-3.5 ${allowWebSearch ? 'text-sky-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {allowWebSearch
                ? (isAr ? '🌐 بحث الإنترنت (مفعّل بطلبك)' : '🌐 Web Evidence (Active)')
                : (isAr ? '🌐 بحث الإنترنت (عند الطلب فقط)' : '🌐 Web Evidence (On Request)')}
            </span>
            <span className="sm:hidden">
              {allowWebSearch ? (isAr ? '🌐 مفعّل' : '🌐 Active') : (isAr ? '🌐 بالطلب' : '🌐 Off')}
            </span>
          </button>

          {/* Clinical Assistant Tools Dropdown (Scrollable on small mobile screens) */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-xs overflow-x-auto max-w-full scrollbar-none shrink-0">
            <button
              onClick={() => setActiveTool(activeTool === 'heparin' ? null : 'heparin')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeTool === 'heparin' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Heparin Calc</span>
            </button>
            <button
              onClick={() => setActiveTool(activeTool === 'rutherford' ? null : 'rutherford')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeTool === 'rutherford' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Rutherford ALI</span>
            </button>
            <button
              onClick={() => setActiveTool(activeTool === 'wifi' ? null : 'wifi')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeTool === 'wifi' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>WIfI Risk</span>
            </button>
            <button
              onClick={() => setActiveTool(activeTool === 'evar' ? null : 'evar')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeTool === 'evar' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>EVAR Check</span>
            </button>
          </div>
        </div>

        {/* Level and Reference selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <select
              value={explanationLevel}
              onChange={e => setExplanationLevel(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              {explanationLevels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>

            <select
              value={selectedBookContext}
              onChange={e => setSelectedBookContext(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-teal-500 cursor-pointer hidden sm:block"
            >
              <option value="all">{isAr ? 'جميع المراجع (RAG)' : 'All References'}</option>
              {references.map(ref => (
                <option key={ref.id} value={ref.id}>{ref.shortTitle}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Embedded Clinical Helper Widget Drawer (PRD Helpful Surgical Tool) */}
      {activeTool && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-teal-500/40 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              {activeTool === 'heparin' && 'Weight-Based IV Heparin Emergency Protocol'}
              {activeTool === 'rutherford' && 'Rutherford Acute Limb Ischemia Bedside Stratifier'}
              {activeTool === 'wifi' && 'SVS WIfI Classification (Wound, Ischemia, foot Infection)'}
              {activeTool === 'evar' && 'EVAR Hostile Neck Anatomical Suitability Checker'}
            </span>
            <button
              onClick={() => setActiveTool(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Heparin Tool */}
          {activeTool === 'heparin' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1">
                <label className="text-slate-400 block font-semibold">Patient Body Weight (kg):</label>
                <input
                  type="number"
                  value={patientWeightKg}
                  onChange={e => setPatientWeightKg(Number(e.target.value) || 70)}
                  className="w-full bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-white font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800 space-y-1">
                <span className="text-teal-400 font-bold block">IV Bolus (80 U/kg):</span>
                <p className="text-lg font-mono font-extrabold text-white">
                  {heparinBolus.toLocaleString()} Units IV
                </p>
                <span className="text-[10px] text-slate-400">Give immediately prior to cross-clamping or upon ALI presentation</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 space-y-1">
                <span className="text-emerald-400 font-bold block">Initial Infusion (18 U/kg/hr):</span>
                <p className="text-lg font-mono font-extrabold text-white">
                  {heparinRate.toLocaleString()} Units / Hour
                </p>
                <span className="text-[10px] text-slate-400">Target aPTT ratio 2.0 - 2.5 (anti-Xa 0.3 - 0.7)</span>
              </div>
            </div>
          )}

          {/* 2. Rutherford Tool */}
          {activeTool === 'rutherford' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-slate-400 block font-semibold mb-1">Sensory Deficit:</span>
                  <select
                    value={ruthSensory}
                    onChange={e => setRuthSensory(e.target.value as any)}
                    className="w-full bg-slate-900 p-1.5 rounded-lg text-white border border-slate-700"
                  >
                    <option value="none">None (Intact)</option>
                    <option value="toes">Minimal (Toes only)</option>
                    <option value="beyond">Extending beyond toes</option>
                    <option value="anesthesia">Profound Anesthesia</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-slate-400 block font-semibold mb-1">Muscle Motor Function:</span>
                  <select
                    value={ruthMotor}
                    onChange={e => setRuthMotor(e.target.value as any)}
                    className="w-full bg-slate-900 p-1.5 rounded-lg text-white border border-slate-700"
                  >
                    <option value="none">Intact (No weakness)</option>
                    <option value="mild">Mild/Moderate (Foot drop / paresis)</option>
                    <option value="paralysis">Paralysis / Rigor (Woody)</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-slate-400 block font-semibold mb-1">Arterial Doppler:</span>
                  <select
                    value={ruthArterial ? 'yes' : 'no'}
                    onChange={e => setRuthArterial(e.target.value === 'yes')}
                    className="w-full bg-slate-900 p-1.5 rounded-lg text-white border border-slate-700"
                  >
                    <option value="no">Inaudible (Silent)</option>
                    <option value="yes">Audible</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-slate-400 block font-semibold mb-1">Venous Doppler:</span>
                  <select
                    value={ruthVenous ? 'yes' : 'no'}
                    onChange={e => setRuthVenous(e.target.value === 'yes')}
                    className="w-full bg-slate-900 p-1.5 rounded-lg text-white border border-slate-700"
                  >
                    <option value="yes">Audible</option>
                    <option value="no">Inaudible (Silent)</option>
                  </select>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${getRutherfordOutcome().color}`}>
                <div>
                  <strong className="block text-sm font-bold">{getRutherfordOutcome().stage}</strong>
                  <span className="text-[11px]">{getRutherfordOutcome().urgency}</span>
                </div>
                <button
                  onClick={() => {
                    handleSend(`My patient is categorized as Rutherford ${getRutherfordOutcome().stage} with ${ruthSensory} sensory loss and ${ruthMotor} motor weakness. Detail the immediate surgical protocol and fasciotomy criteria.`);
                    setActiveTool(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  Consult AI on this Stage
                </button>
              </div>
            </div>
          )}

          {/* 3. WIfI Tool */}
          {activeTool === 'wifi' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-slate-400 block font-semibold mb-1">Wound (W):</span>
                  <select
                    value={wifiWound}
                    onChange={e => setWifiWound(Number(e.target.value))}
                    className="w-full bg-slate-900 p-1.5 rounded-lg text-white border border-slate-700"
                  >
                    <option value={0}>0: Rest pain only, no ulcer</option>
                    <option value={1}>1: Small shallow ulcer, no gangrene</option>
                    <option value={2}>2: Deep ulcer, exposed tendon / toe gangrene</option>
                    <option value={3}>3: Deep heel ulcer / extensive gangrene</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-slate-400 block font-semibold mb-1">Ischemia (I):</span>
                  <select
                    value={wifiIschemia}
                    onChange={e => setWifiIschemia(Number(e.target.value))}
                    className="w-full bg-slate-900 p-1.5 rounded-lg text-white border border-slate-700"
                  >
                    <option value={0}>0: ABI &ge; 0.80, TP &ge; 60 mmHg</option>
                    <option value={1}>1: ABI 0.60-0.79, TP 40-59 mmHg</option>
                    <option value={2}>2: ABI 0.40-0.59, TP 30-39 mmHg</option>
                    <option value={3}>3: ABI &lt; 0.40, TP &lt; 30 mmHg (Severe)</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-750">
                  <span className="text-slate-400 block font-semibold mb-1">foot Infection (fI):</span>
                  <select
                    value={wifiInfection}
                    onChange={e => setWifiInfection(Number(e.target.value))}
                    className="w-full bg-slate-900 p-1.5 rounded-lg text-white border border-slate-700"
                  >
                    <option value={0}>0: Uninfected</option>
                    <option value={1}>1: Mild (cellulitis &lt; 2 cm)</option>
                    <option value={2}>2: Moderate (&gt; 2 cm / deep abscess / bone)</option>
                    <option value={3}>3: Severe SIRS systemic sepsis</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800 flex items-center justify-between text-purple-200">
                <div>
                  <strong className="block font-bold">WIfI Grade: W{wifiWound} I{wifiIschemia} fI{wifiInfection}</strong>
                  <span className="text-[11px] text-slate-300">
                    {wifiIschemia >= 2 || wifiWound >= 2
                      ? 'Clinical Stage 4 (Very High 1-Year Amputation Risk - Urgent Revascularization)'
                      : 'Clinical Stage 1-2 (Low-Moderate Risk)'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleSend(`Patient graded WIfI Stage W${wifiWound} I${wifiIschemia} fI${wifiInfection}. Provide guideline-directed limb salvage and revascularization plan.`);
                    setActiveTool(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition cursor-pointer"
                >
                  Consult AI on WIfI Stage
                </button>
              </div>
            </div>
          )}

          {/* 4. EVAR Checker */}
          {activeTool === 'evar' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1">
                <label className="text-slate-400 font-semibold block">Infrarenal Neck Length (mm):</label>
                <input
                  type="number"
                  value={evarNeckLength}
                  onChange={e => setEvarNeckLength(Number(e.target.value))}
                  className="w-full bg-slate-900 p-1.5 rounded-lg border border-slate-700 text-white font-mono font-bold"
                />
                <span className={evarNeckLength >= 15 ? 'text-emerald-400 text-[10px]' : 'text-red-400 text-[10px]'}>
                  {evarNeckLength >= 15 ? '✓ Standard IFU (>= 15mm)' : '⚠️ Short Neck (< 15mm)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1">
                <label className="text-slate-400 font-semibold block">Neck Angulation (Degrees):</label>
                <input
                  type="number"
                  value={evarNeckAngle}
                  onChange={e => setEvarNeckAngle(Number(e.target.value))}
                  className="w-full bg-slate-900 p-1.5 rounded-lg border border-slate-700 text-white font-mono font-bold"
                />
                <span className={evarNeckAngle <= 60 ? 'text-emerald-400 text-[10px]' : 'text-red-400 text-[10px]'}>
                  {evarNeckAngle <= 60 ? '✓ Favorable (<= 60°)' : '⚠️ Severe Angulation (> 60°)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1 flex flex-col justify-between">
                <div>
                  <label className="text-slate-400 font-semibold block">Neck Diameter (mm):</label>
                  <input
                    type="number"
                    value={evarDiameter}
                    onChange={e => setEvarDiameter(Number(e.target.value))}
                    className="w-full bg-slate-900 p-1.5 rounded-lg border border-slate-700 text-white font-mono font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    handleSend(`Assess EVAR anatomical suitability: Neck length ${evarNeckLength}mm, angulation ${evarNeckAngle} degrees, diameter ${evarDiameter}mm. Is this hostile neck, and what devices or open conversion are indicated?`);
                    setActiveTool(null);
                  }}
                  className="w-full py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition cursor-pointer text-[11px]"
                >
                  Analyze EVAR Neck
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Topic Pills for Instant 1-Click Surgical Briefings */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {quickTopicPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill.prompt)}
            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-[11px] font-semibold text-slate-300 hover:text-white whitespace-nowrap transition cursor-pointer shadow-xs"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Chat Messages List with Real-Time Streaming */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center justify-between w-full max-w-4xl px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isUser ? (isAr ? 'أنت' : 'Doctor') : (isAr ? 'المعلم السريري' : 'Vascular AI Consultant')}
                  </span>
                  {msg.level && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700">
                      {msg.level}
                    </span>
                  )}
                  {fastMode && !isUser && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ⚡ Fast
                    </span>
                  )}
                  {msg.isStreaming && (
                    <span className="text-[10px] text-teal-400 animate-pulse font-mono">
                      Generating...
                    </span>
                  )}
                </div>

                {/* Small icon at the top of the answer page to enlarge/maximize */}
                {!isUser && !msg.isStreaming && (
                  <button
                    onClick={() => setMaximizedMessage(msg)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-850 hover:bg-slate-800 text-teal-400 hover:text-teal-300 border border-slate-750 hover:border-teal-500/50 transition cursor-pointer text-[11px] font-semibold shadow-xs"
                    title={isAr ? 'تكبير صفحة الإجابة (عرض ملء الشاشة)' : 'Enlarge / Maximize Answer View'}
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isAr ? 'تكبير الإجابة 🔍' : 'Maximize'}</span>
                  </button>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`w-full max-w-4xl p-4 sm:p-6 rounded-3xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-700 text-white rounded-br-xs shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow-lg'
                }`}
              >
                {/* Content display */}
                <div className="prose prose-invert prose-sm max-w-none space-y-3 font-sans">
                  {(isAr || isBilingual) && msg.textAr && msg.textAr !== msg.textEn ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 text-slate-200" dir="rtl">
                        <div className="text-xs font-semibold text-teal-400 mb-2">
                          الخلاصة السريرية والمصطلحات المعتمدة
                        </div>
                        <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {formatAndCleanClinicalText(msg.textAr)}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                          English Reference Formulation:
                        </p>
                        <div className="whitespace-pre-wrap font-sans">
                          {formatAndCleanClinicalText(msg.textEn)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-sans">
                      {formatAndCleanClinicalText(msg.textEn)}
                    </div>
                  )}
                </div>

                {/* Web Grounding Badge (Ask AI Exclusive) */}
                {!isUser && msg.isWebGrounded && (
                  <div className="mt-3 p-3 rounded-2xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-sky-400">
                      <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{isAr ? 'مصادر خارجية موثقة عبر الإنترنت (ميزة حصرية لـ Ask AI):' : 'Authoritative External Web Evidence (Ask AI Exclusive):'}</span>
                    </div>
                    {msg.externalWebSources && msg.externalWebSources.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.externalWebSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-900/50 hover:bg-sky-900 border border-sky-700/60 text-[11px] text-sky-300 hover:text-white transition"
                          >
                            <span>{source.title}</span>
                            <ExternalLink className="w-3 h-3 text-sky-400" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Medical Visual Media Viewer: Diagrams & Verified Surgical Videos */}
                {!isUser && !msg.isStreaming && (
                  <MedicalVisualMediaViewer
                    diagrams={msg.diagrams}
                    videos={msg.videos}
                    isAr={isAr}
                  />
                )}

                {/* Interactive Consultant Topic-Specific Practice MCQs */}
                {!isUser && !msg.isStreaming && msg.topicMcqs && msg.topicMcqs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {isAr ? '📝 أسئلة تدريبية سريرية خاصة بهذا الجزء (Consultant Practice MCQs)' : '📝 Consultant Practice MCQs on this Topic'}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {isAr ? 'أسئلة سريرية لاختبار فهمك الدقيق لهذا الموضوع مع الشرح واللؤلؤة الجراحية' : 'Test your high-yield mastery of this specific vascular topic with instant rationale.'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        {msg.topicMcqs.length} {isAr ? 'أسئلة' : 'Questions'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {msg.topicMcqs.map((mcq, qIdx) => {
                        const mcqKey = `${msg.id}-mcq-${qIdx}`;
                        const selectedOpt = mcqAnswers[mcqKey];
                        const isAnswered = Boolean(selectedOpt);
                        const isCorrect = selectedOpt === mcq.correctAnswer;

                        return (
                          <div key={qIdx} className="p-3.5 sm:p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-teal-400 font-mono">
                                Q{qIdx + 1}. {mcq.topic}
                              </span>
                              {isAnswered && (
                                <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                                  isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                }`}>
                                  {isCorrect ? (isAr ? '✓ إجابة صحيحة' : '✓ Correct') : (isAr ? '✗ إجابة غير صحيحة' : '✗ Incorrect')}
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                              {isAr && mcq.questionAr ? mcq.questionAr : mcq.questionEn}
                            </p>

                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {mcq.options.map(opt => {
                                const isThisSelected = selectedOpt === opt.id;
                                const isThisCorrect = opt.id === mcq.correctAnswer;

                                let optStyle = 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200';
                                if (isAnswered) {
                                  if (isThisCorrect) {
                                    optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
                                  } else if (isThisSelected) {
                                    optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                                  } else {
                                    optStyle = 'bg-slate-800/40 border-slate-750 text-slate-400 opacity-60';
                                  }
                                }

                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      if (!isAnswered) {
                                        setMcqAnswers(prev => ({ ...prev, [mcqKey]: opt.id }));
                                      }
                                    }}
                                    className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer ${optStyle}`}
                                  >
                                    <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                      {opt.id}
                                    </span>
                                    <span className="flex-1 leading-snug">
                                      {isAr && opt.textAr ? opt.textAr : opt.textEn}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Answer Explanation & Pearl Reveal */}
                            {isAnswered && (
                              <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5 animate-in fade-in duration-200">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                                  <span>
                                    {isAr ? `الإجابة الصحيحة: (${mcq.correctAnswer})` : `Correct Answer: Option (${mcq.correctAnswer})`}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {isAr && mcq.explanationAr ? mcq.explanationAr : mcq.explanationEn}
                                </p>
                                {mcq.pearl && (
                                  <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-start gap-1.5 text-[11px] text-amber-300">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <span><strong>Surgical Pearl:</strong> {mcq.pearl}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Drill down / Request more questions on this specific part */}
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSend(isAr ? 'أنشئ 3 أسئلة سريرية بورد إضافية حول هذا الجزء المطلوب بالتحديد مع شرح الإجابة واللؤلؤة الجراحية' : 'Generate 3 more board-level clinical practice MCQs specifically on this part with explanations and surgical pearls')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 text-xs font-semibold border border-teal-500/30 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isAr ? '🎯 طلب أسئلة بورد إضافية لهذا الجزء' : 'Generate More MCQs on this Part'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Interactive Consultant Topic-Specific Flashcards */}
                {!isUser && !msg.isStreaming && msg.topicFlashcards && msg.topicFlashcards.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {isAr ? '🗂️ بطاقات الاستذكار السريع لهذا الجزء (Targeted Flashcards)' : '🗂️ Targeted Clinical Flashcards on this Topic'}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {isAr ? 'بطاقات مخصصة لمراجعة أهم المعايير واللآلئ التشريحية وحفظها مباشرة' : 'High-yield memory flashcards for rapid active recall. Save directly to your study deck.'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {msg.topicFlashcards.length} {isAr ? 'بطاقات' : 'Cards'}
                      </span>
                    </div>

                    {/* Flashcard Carousel / Flipper */}
                    {(() => {
                      const currentFcIdx = flashcardIndices[msg.id] || 0;
                      const currentCard = msg.topicFlashcards[currentFcIdx] || msg.topicFlashcards[0];
                      const flipKey = `${msg.id}-fc-${currentFcIdx}`;
                      const isFlipped = Boolean(flippedFlashcards[flipKey]);
                      const isSaved = Boolean(savedFlashcards[currentCard.id || flipKey]);

                      return (
                        <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-3">
                          {/* Top metadata & navigation */}
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-semibold text-emerald-400">
                              {currentCard.topic} • {currentCard.difficulty || 'High-Yield'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px]">
                                {currentFcIdx + 1} / {msg.topicFlashcards.length}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newIdx = Math.max(0, currentFcIdx - 1);
                                    setFlashcardIndices(prev => ({ ...prev, [msg.id]: newIdx }));
                                  }}
                                  disabled={currentFcIdx === 0}
                                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newIdx = Math.min(msg.topicFlashcards!.length - 1, currentFcIdx + 1);
                                    setFlashcardIndices(prev => ({ ...prev, [msg.id]: newIdx }));
                                  }}
                                  disabled={currentFcIdx === msg.topicFlashcards.length - 1}
                                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Flashcard Body (Click to Flip) */}
                          <div
                            onClick={() => setFlippedFlashcards(prev => ({ ...prev, [flipKey]: !isFlipped }))}
                            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-700/80 hover:border-emerald-500/60 min-h-[140px] flex flex-col justify-center text-center cursor-pointer transition shadow-lg select-none"
                          >
                            <span className="text-[10px] uppercase font-bold tracking-wider mb-2 block text-slate-400">
                              {isFlipped ? (isAr ? 'الإجابة واللؤلؤة السريرية (Back)' : 'Consultant Answer & Pearl (Back)') : (isAr ? 'السؤال السريري (Front - انقر للقلب)' : 'Clinical Prompt (Front - Click to Flip)')}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-100 font-medium whitespace-pre-line leading-relaxed">
                              {isFlipped
                                ? ((isAr && currentCard.backAr) ? currentCard.backAr : currentCard.backEn)
                                : ((isAr && currentCard.frontAr) ? currentCard.frontAr : currentCard.frontEn)}
                            </p>
                          </div>

                          {/* Flashcard Action Buttons */}
                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => setFlippedFlashcards(prev => ({ ...prev, [flipKey]: !isFlipped }))}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs text-slate-300 font-semibold transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                              <span>{isFlipped ? (isAr ? 'الوجه الأمامي' : 'Show Front') : (isAr ? 'اقلب البطاقة 🔄' : 'Flip Card 🔄')}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                addFlashcard({
                                  id: 'fc-topic-' + Date.now(),
                                  topic: currentCard.topic,
                                  subtopic: 'Consultant Clinical Pearl',
                                  category: 'Arterial',
                                  difficulty: currentCard.difficulty || 'Intermediate',
                                  frontEn: currentCard.frontEn,
                                  frontAr: currentCard.frontAr,
                                  backEn: currentCard.backEn,
                                  backAr: currentCard.backAr,
                                  referenceCitation: 'Vascular AI Consultant Clinical Ingestion',
                                  status: 'new',
                                  reviewCount: 0
                                });
                                setSavedFlashcards(prev => ({ ...prev, [currentCard.id || flipKey]: true }));
                                showNotification(isAr ? 'تم حفظ البطاقة بنجاح في بنك الفلاش كارد!' : 'Flashcard saved to study deck!');
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                                isSaved
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-950'
                              }`}
                            >
                              <BookmarkCheck className="w-3.5 h-3.5" />
                              <span>{isSaved ? (isAr ? 'تم الحفظ في بطاقاتي ✓' : 'Saved to Deck ✓') : (isAr ? 'حفظ في بنك الفلاش كارد' : 'Save to Flashcards')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Drill down / Request more flashcards on this specific part */}
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSend(isAr ? 'أنشئ 3 بطاقات استذكار سريع (Flashcards) إضافية عالية الأهمية حول هذا الجزء المطلوب بالتحديد' : 'Generate 3 more high-yield clinical flashcards specifically on this part')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isAr ? '🗂️ طلب بطاقات استذكار إضافية لهذا الجزء' : 'Generate More Flashcards on this Part'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Citations Footer */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <p className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المراجع المعتمدة (Verifiable Citations):' : 'Verifiable Citations:'}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.citations.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-white block">{c.source}</span>
                            <span className="text-[11px] text-slate-400">
                              Ch: {c.chapter} • Page {c.page}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                            p.{c.page}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Smart Follow-up Questions (PRD Helpfulness) */}
                {!isUser && msg.followUpQuestions && msg.followUpQuestions.length > 0 && !msg.isStreaming && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Drill Down / Clinical Next Steps:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUpQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 hover:text-white transition cursor-pointer text-left flex items-center gap-1.5"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful Actions Bar & Voice Narration */}
                {!isUser && !msg.isStreaming && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
                    {/* Voice Read Aloud with Expressive Speech */}
                    <button
                      onClick={() => handleSpeak(msg.id, (isAr || isBilingual) && msg.textAr ? msg.textAr : msg.textEn)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                        speakingMessageId === msg.id
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                          : 'bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-750 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-slate-700'
                      }`}
                      title={speakingMessageId === msg.id ? (isAr ? 'إيقاف النطق' : 'Stop Narration') : (isAr ? 'نطق الكلام بصوت معبر 🔊' : 'Expressive Read Aloud 🔊')}
                    >
                      {speakingMessageId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      )}
                      <span>
                        {speakingMessageId === msg.id
                          ? (isAr ? 'إيقاف الصوت ⏹️' : 'Stop')
                          : (isAr ? 'نطق تعبيري 🔊' : 'Listen 🔊')}
                      </span>
                    </button>

                    {/* Make MCQs and Flashcards specifically for this studied part */}
                    <button
                      onClick={() => {
                        const firstLine = (msg.textEn || msg.textAr || '').split('\n')[0].replace(/[#*`]/g, '').trim();
                        const topicToUse = firstLine.length > 5 ? firstLine.slice(0, 60) : 'Vascular Clinical Section';
                        setSelectedTopicForModal(topicToUse);
                        setTopicModalExcerpt(msg.textEn.slice(0, 300));
                        setIsTopicModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/25 to-purple-500/25 hover:from-teal-500/35 hover:to-purple-500/35 text-teal-300 hover:text-white border border-teal-500/50 text-xs font-bold transition shadow-xs cursor-pointer"
                      title={isAr ? 'صنع أسئلة وفلاش كاردس لهذا الجزء المدروس' : 'Generate MCQs & Flashcards for this studied topic'}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      <span>{isAr ? '🎯 صنع أسئلة وفلاش كاردس لهذا الجزء' : '🎯 Generate MCQs & Flashcards'}</span>
                    </button>

                    <button
                      onClick={() => handleExplainSimply(msg.textEn)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isAr ? 'اشرح ببساطة' : 'Explain Simply'}</span>
                    </button>

                    <button
                      onClick={() => handleSaveAsNote(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </button>

                    <button
                      onClick={() => handleConvertToFlashcard(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Flashcard</span>
                    </button>

                    <button
                      onClick={() => {
                        handleSend(`Generate 3 difficult board exam MCQs based on: ${msg.textEn.slice(0, 200)}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Quiz Me (MCQs)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('anatomy');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>View Anatomy</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(msg.textEn)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                      title="Copy response"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Message Emoji Reactions Tray */}
                {!isUser && !msg.isStreaming && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">
                      {isAr ? 'تفاعل:' : 'React:'}
                    </span>
                    {['❤️', '👍', '💡', '🩺', '🧠', '👏', '🔥'].map(emoji => {
                      const count = msg.reactions?.[emoji] || 0;
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className={`px-2 py-0.5 rounded-full text-xs transition cursor-pointer border flex items-center gap-1 ${
                            count > 0
                              ? 'bg-teal-50 dark:bg-teal-500/20 border-teal-300 dark:border-teal-500/50 text-teal-700 dark:text-teal-200 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300'
                          }`}
                          title={`React with ${emoji}`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && (
                            <span className="font-mono text-[10px] font-bold">{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Enlarge Answer Icon & Controls */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => {
              const lastAi = [...messages].reverse().find(m => m.sender === 'assistant');
              if (lastAi) {
                setMaximizedMessage(lastAi);
              } else {
                showNotification(isAr ? 'لا توجد إجابة بعد لتكبيرها' : 'No answer available yet to enlarge');
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-teal-50 dark:hover:bg-slate-750 text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-xs font-semibold shadow-xs"
            title={isAr ? 'أيقونة تكبير الجزء الخاص بالإجابة (عرض ملء الشاشة)' : 'Enlarge / Maximize Answer Section'}
          >
            <Maximize2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span className="text-[11px]">{isAr ? 'تكبير الإجابة 🔍' : 'Enlarge Answer'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-amber-400 dark:text-slate-400 dark:hover:text-amber-400 transition cursor-pointer"
            title={isAr ? 'إدراج إيموجي' : 'Insert Emoji'}
          >
            <Smile className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Extended Categorized Emoji Drawer */}
        {isEmojiPickerOpen && (
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-teal-500/40 shadow-xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Category tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1">
                {emojiCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveEmojiCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeEmojiCategory === cat.id
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Emoji Grid */}
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {emojiCategories
                .find(c => c.id === activeEmojiCategory)
                ?.emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 flex items-center justify-center text-base hover:scale-125 transition-transform cursor-pointer border border-slate-200 dark:border-slate-750"
                  >
                    {emoji}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-2xl shadow-xl p-1.5 focus-within:border-teal-500/80 transition"
        >
          <textarea
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isAr
                ? 'اطرح سؤالاً في جراحة الأوعية (مثال: 🫀 احسب جرعة الهيبارين، صنف رذرفورد ⚡، أو متلازمة الحجرات ⚠️)...'
                : 'Ask a vascular surgical question (e.g., 🫀 Heparin bolus dosing, Rutherford IIb protocol ⚡, CEA criteria)...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden resize-none max-h-32 min-h-[44px]"
            rows={1}
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className={`p-3 rounded-xl font-bold transition flex items-center justify-center shrink-0 cursor-pointer ${
              inputPrompt.trim() && !isLoading
                ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Maximized Answer Page View / Modal (Mobile & Tablet Optimized) */}
      {maximizedMessage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-3xl lg:max-w-4xl max-h-[82vh] bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 my-auto animate-in zoom-in-95 duration-200">
            {/* Top Bar of Maximized Page */}
            <div className="p-3.5 sm:p-4 bg-slate-850 border-b border-slate-750 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                    <span>{isAr ? 'صفحة الإجابة السريرية المكبرة' : 'Maximized Clinical Answer View'}</span>
                    {maximizedMessage.level && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {maximizedMessage.level}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {isAr ? 'عرض تفصيلي مريح ومتجاوب للهاتف والتابلت' : 'Full clinical breakdown optimized for tablet & mobile'}
                  </p>
                </div>
              </div>

              {/* Action icons & Minimize button */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Expressive Read Aloud */}
                <button
                  onClick={() => handleSpeak(maximizedMessage.id, (isAr || isBilingual) && maximizedMessage.textAr ? maximizedMessage.textAr : maximizedMessage.textEn)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    speakingMessageId === maximizedMessage.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                  }`}
                  title={isAr ? 'نطق صوتي' : 'Read Aloud'}
                >
                  {speakingMessageId === maximizedMessage.id ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
                  <span className="hidden sm:inline">{speakingMessageId === maximizedMessage.id ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استماع' : 'Listen')}</span>
                </button>

                {/* Copy */}
                <button
                  onClick={() => {
                    const textToCopy = (isAr || isBilingual) && maximizedMessage.textAr ? maximizedMessage.textAr : maximizedMessage.textEn;
                    navigator.clipboard.writeText(textToCopy);
                    showNotification(isAr ? 'تم نسخ الشرح الطبي كاملاً' : 'Full clinical explanation copied');
                  }}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title={isAr ? 'نسخ النص' : 'Copy Text'}
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">{isAr ? 'نسخ' : 'Copy'}</span>
                </button>

                {/* Minimize icon button */}
                <button
                  onClick={() => setMaximizedMessage(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition cursor-pointer"
                  title={isAr ? 'تصغير الصفحة والعودة للمحادثة' : 'Minimize / Exit Fullscreen'}
                >
                  <Minimize2 className="w-4 h-4 text-teal-400" />
                  <span className="hidden xs:inline">{isAr ? 'تصغير الصفحة' : 'Minimize'}</span>
                </button>
              </div>
            </div>

            {/* Maximized Content Area - Scrollable, highly responsive */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
              {/* Render clean text */}
              <div className="prose prose-invert max-w-none space-y-4">
                {(isAr || isBilingual) && maximizedMessage.textAr ? (
                  <div className="space-y-5" dir="rtl">
                    <div className="p-4 sm:p-6 rounded-2xl bg-slate-850 border border-slate-750 text-slate-100 text-sm sm:text-base leading-relaxed">
                      <div className="whitespace-pre-wrap font-sans">
                        {formatAndCleanClinicalText(maximizedMessage.textAr)}
                      </div>
                    </div>

                    {maximizedMessage.textEn && maximizedMessage.textEn !== maximizedMessage.textAr && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/60 border border-slate-800 text-slate-300 text-xs sm:text-sm" dir="ltr">
                        <p className="font-bold text-teal-400 mb-2 uppercase tracking-wider">English Formulation:</p>
                        <div className="whitespace-pre-wrap font-sans">
                          {formatAndCleanClinicalText(maximizedMessage.textEn)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 rounded-2xl bg-slate-850 border border-slate-750 text-slate-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                    {formatAndCleanClinicalText(maximizedMessage.textEn)}
                  </div>
                )}
              </div>

              {/* Visual Media Viewer */}
              <MedicalVisualMediaViewer
                diagrams={maximizedMessage.diagrams}
                videos={maximizedMessage.videos}
                isAr={isAr}
              />

              {/* Maximized Topic Practice MCQs */}
              {maximizedMessage.topicMcqs && maximizedMessage.topicMcqs.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/90 border border-slate-750 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? '📝 أسئلة تدريبية بورد خاصة بهذا الجزء (Consultant Board MCQs)' : '📝 Consultant Board MCQs on this Topic'}
                      </h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      {maximizedMessage.topicMcqs.length} {isAr ? 'أسئلة' : 'Questions'}
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {maximizedMessage.topicMcqs.map((mcq, qIdx) => {
                      const mcqKey = `${maximizedMessage.id}-max-mcq-${qIdx}`;
                      const selectedOpt = mcqAnswers[mcqKey];
                      const isAnswered = Boolean(selectedOpt);
                      const isCorrect = selectedOpt === mcq.correctAnswer;

                      return (
                        <div key={qIdx} className="p-4 rounded-xl bg-slate-900 border border-slate-750 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-teal-400 font-mono">
                              Q{qIdx + 1}. {mcq.topic}
                            </span>
                            {isAnswered && (
                              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                                isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}>
                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                            {isAr && mcq.questionAr ? mcq.questionAr : mcq.questionEn}
                          </p>

                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {mcq.options.map(opt => {
                              const isThisSelected = selectedOpt === opt.id;
                              const isThisCorrect = opt.id === mcq.correctAnswer;
                              let optStyle = 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200';
                              if (isAnswered) {
                                if (isThisCorrect) optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                                else if (isThisSelected) optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                                else optStyle = 'bg-slate-800/40 border-slate-750 text-slate-400 opacity-60';
                              }

                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    if (!isAnswered) setMcqAnswers(prev => ({ ...prev, [mcqKey]: opt.id }));
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer ${optStyle}`}
                                >
                                  <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                    {opt.id}
                                  </span>
                                  <span className="flex-1">
                                    {isAr && opt.textAr ? opt.textAr : opt.textEn}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {isAnswered && (
                            <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-750 text-xs space-y-1">
                              <span className="font-bold text-teal-300">
                                {isAr ? `الإجابة الصحيحة: (${mcq.correctAnswer})` : `Correct Answer: (${mcq.correctAnswer})`}
                              </span>
                              <p className="text-slate-300">
                                {isAr && mcq.explanationAr ? mcq.explanationAr : mcq.explanationEn}
                              </p>
                              {mcq.pearl && (
                                <p className="text-amber-300 pt-1 font-semibold">
                                  💎 Surgical Pearl: {mcq.pearl}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Maximized Topic Flashcards */}
              {maximizedMessage.topicFlashcards && maximizedMessage.topicFlashcards.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/90 border border-slate-750 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? '🗂️ بطاقات الاستذكار السريع لهذا الجزء (Targeted Flashcards)' : '🗂️ Targeted Flashcards on this Topic'}
                      </h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {maximizedMessage.topicFlashcards.length} {isAr ? 'بطاقات' : 'Cards'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {maximizedMessage.topicFlashcards.map((card, cIdx) => (
                      <div key={cIdx} className="p-4 rounded-xl bg-slate-900 border border-slate-750 space-y-2">
                        <span className="text-[11px] font-bold text-emerald-400 font-mono">
                          {card.topic} • {card.difficulty || 'High-Yield'}
                        </span>
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 font-semibold">
                          {isAr && card.frontAr ? card.frontAr : card.frontEn}
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-200">
                          {isAr && card.backAr ? card.backAr : card.backEn}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations */}
              {maximizedMessage.citations && maximizedMessage.citations.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'المراجع الطبية المعتمدة (Citations):' : 'Verifiable Citations:'}</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {maximizedMessage.citations.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                        <span className="font-bold text-white block truncate">{c.source}</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Ch: {c.chapter} • Page {c.page}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow up questions */}
              {maximizedMessage.followUpQuestions && maximizedMessage.followUpQuestions.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'محاور وأسئلة سريرية متابعة:' : 'Clinical Follow-up & Drill Downs:'}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {maximizedMessage.followUpQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMaximizedMessage(null);
                          handleSend(q);
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-2"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Maximized Bottom Footer */}
            <div className="p-3 sm:p-4 bg-slate-850 border-t border-slate-750 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>{isAr ? 'اضغط تصغير أو الزر للعودة للمحادثة' : 'Click minimize to return to chat'}</span>
              <button
                onClick={() => setMaximizedMessage(null)}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition cursor-pointer"
              >
                {isAr ? 'إغلاق والتصغير' : 'Done & Minimize'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Studied Topic MCQs & Flashcards Modal */}
      <GenerateTopicMaterialModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        topicTitle={selectedTopicForModal}
        contentExcerpt={topicModalExcerpt}
      />
    </div>
  );
};
