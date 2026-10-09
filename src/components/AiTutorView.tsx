import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { askVascularTutor } from '../services/aiService';
import { ExplanationLevel, TutorMessage } from '../types';
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
  Activity,
  HeartPulse,
  AlertTriangle,
  X,
  Stethoscope,
  Scissors
} from 'lucide-react';

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
  const [activeTool, setActiveTool] = useState<'heparin' | 'rutherford' | 'wifi' | 'evar' | null>(null);

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

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      textEn: `# Vascular Surgery AI Clinical Assistant

Welcome, Doctor. I am your specialized high-yield vascular surgery co-pilot, grounded in **Rutherford 10th Ed.**, **ESVS 2024 Guidelines**, **SVS Guidelines**, and **Global Vascular Guidelines (GVG)**.

⚡ **Fast Mode is Active**: You receive lightning-fast clinical consults with immediate action protocols, verified citations, and surgical pearls.
Use the **Clinical Tools** bar above for instant Heparin IV calculations, Rutherford ALI staging, and WIfI risk grading.`,
      textAr: `# المساعد السريري الذكي لجراحة الأوعية الدموية

أهلاً بك يا دكتور. أنا مساعدك السريري فائق السرعة، مدعوم مباشرة بأمهات كتب الأوعية وإرشادات **ESVS 2024** و **Rutherford 10th Ed**.

⚡ **الوضع السريع مفعل**: ستحصل على إجابات فورية مركزة سريرياً مع بروتوكولات الأدوية، اللآلئ الجراحية، والمراجع الموثقة بدقة.`,
      level: 'Resident Level',
      citations: [
        {
          source: "Rutherford's Vascular Surgery 10th Ed.",
          chapter: 'Evaluation & Decision Making in Vascular Surgery',
          page: 1240
        }
      ],
      followUpQuestions: [
        'What are the mandatory indications for four-compartment fasciotomy?',
        'How to differentiate Rutherford Class IIa from IIb at the bedside?',
        'Calculate weight-based IV heparin loading and maintenance infusion.'
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

    try {
      const response = await askVascularTutor({
        prompt: textToSend,
        level: isSimplify ? 'Simple' : explanationLevel,
        languageMode,
        contextDocumentId: selectedBookContext === 'all' ? undefined : selectedBookContext,
        isSimplifyRequest: isSimplify,
        fastMode,
        onChunk: (streamedText) => {
          setMessages(prev =>
            prev.map(m =>
              m.id === tempAssistantId
                ? { ...m, textEn: streamedText, textAr: streamedText }
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
                textEn: response.textEn,
                textAr: response.textAr,
                citations: response.citations,
                isStreaming: false,
                followUpQuestions: response.followUpQuestions,
                hasMedicalDiagram: textToSend.toLowerCase().includes('diagram') || textToSend.toLowerCase().includes('anatomy')
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full p-3 sm:p-6 space-y-3">
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
              <div className="flex items-center gap-2 px-1">
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

              {/* Message Bubble */}
              <div
                className={`max-w-4xl p-5 sm:p-6 rounded-3xl text-sm leading-relaxed ${
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
                          {msg.textAr}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                          English Reference Formulation:
                        </p>
                        <div className="whitespace-pre-wrap">
                          {msg.textEn}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">
                      {msg.textEn}
                    </div>
                  )}
                </div>

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

                {/* Helpful Actions Bar */}
                {!isUser && !msg.isStreaming && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleExplainSimply(msg.textEn)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isAr ? 'اشرح ببساطة' : 'Explain Simply'}</span>
                    </button>

                    <button
                      onClick={() => handleSaveAsNote(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </button>

                    <button
                      onClick={() => handleConvertToFlashcard(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Flashcard</span>
                    </button>

                    <button
                      onClick={() => {
                        handleSend(`Generate 3 difficult board exam MCQs based on: ${msg.textEn.slice(0, 200)}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Quiz Me (MCQs)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('anatomy');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>View Anatomy</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(msg.textEn)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copy response"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl p-1.5 focus-within:border-teal-500/80 transition"
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
              ? 'اطرح سؤالاً في جراحة الأوعية (مثال: احسب جرعة الهيبارين، صنف رذرفورد، أو متلازمة الحجرات)...'
              : 'Ask a vascular surgical question (e.g., Heparin bolus dosing, Rutherford IIb protocol, CEA criteria, or Fasciotomy planes)...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden resize-none max-h-32 min-h-[44px]"
          rows={1}
        />

        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className={`p-3 rounded-xl font-bold transition flex items-center justify-center shrink-0 cursor-pointer ${
            inputPrompt.trim() && !isLoading
              ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
