import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClinicalCase, ClinicalCaseStep } from '../types';
import {
  Activity,
  HeartPulse,
  UserCheck,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Sparkles,
  ShieldAlert,
  Clock,
  ChevronRight
} from 'lucide-react';

export const ClinicalCaseView: React.FC = () => {
  const { clinicalCases, languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [activeTabMode, setActiveTabMode] = useState<'simulation' | 'osce'>('simulation');
  const [selectedCase, setSelectedCase] = useState<ClinicalCase>(clinicalCases[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionsByStep, setSelectedOptionsByStep] = useState<Record<string, string>>({});
  const [isCaseCompleted, setIsCaseCompleted] = useState(false);

  // OSCE Mode State
  const [osceStation, setOsceStation] = useState<'clti' | 'carotid' | 'aaa'>('clti');
  const [osceChecklist, setOsceChecklist] = useState<Record<string, boolean>>({});
  const [osceTimer, setOsceTimer] = useState(480); // 8 minutes standard OSCE
  const [isOsceRunning, setIsOsceRunning] = useState(false);
  const [isOsceFinished, setIsOsceFinished] = useState(false);

  const currentStep: ClinicalCaseStep = selectedCase.steps[currentStepIndex] || selectedCase.steps[0];
  const userOptionId = selectedOptionsByStep[currentStep.id];
  const selectedOptionObj = currentStep.options.find(o => o.id === userOptionId);

  const handleSelectCaseOption = (optionId: string) => {
    setSelectedOptionsByStep(prev => ({
      ...prev,
      [currentStep.id]: optionId
    }));
  };

  const handleNextStep = () => {
    if (currentStepIndex < selectedCase.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCaseCompleted(true);
      showNotification('Clinical Simulation Complete! Case review unlocked.');
    }
  };

  const handleResetCase = () => {
    setSelectedOptionsByStep({});
    setCurrentStepIndex(0);
    setIsCaseCompleted(false);
  };

  // OSCE stations checklist
  const osceStationsData = {
    clti: {
      title: 'Station: Clinical Examination of Chronic Limb-Threatening Ischemia (CLTI)',
      timeLimit: 8,
      prompt: 'A 66-year-old diabetic male presents with pain in the left foot at rest and an ulcer over the 1st metatarsal head. Perform a structured vascular lower limb examination and explain your findings to the examiner.',
      rubric: [
        { id: 'item-intro', label: 'Introduced self, washed hands, confirmed patient identity, and explained examination with consent.' },
        { id: 'item-expose', label: 'Adequately exposed both lower limbs from mid-thigh down to toes.' },
        { id: 'item-inspect', label: 'Inspection: Looked for pallor, rubor, hair loss, trophic skin changes, guttering of veins, and toe ulcerations.' },
        { id: 'item-buerger', label: 'Performed Buerger Test: Elevated leg 45° to observe elevation pallor, then hung leg to observe dependent rubor.' },
        { id: 'item-palpate', label: 'Palpated temperature systematically down both legs using dorsum of fingers.' },
        { id: 'item-pulses', label: 'Palpated and graded all pulses: Femoral, Popliteal, Posterior Tibial, and Dorsalis Pedis.' },
        { id: 'item-doppler', label: 'Requested handheld Doppler to assess monophasic vs biphasic vs triphasic signals.' },
        { id: 'item-wifi', label: 'Formulated diagnosis according to SVS WIfI Classification (Wound, Ischemia, foot Infection).' }
      ]
    },
    carotid: {
      title: 'Station: Carotid Artery TIA & Cranial Nerve Assessment',
      timeLimit: 8,
      prompt: 'A 70-year-old female presents following an episode of left eye sudden painless visual loss (Amaurosis Fugax) lasting 10 minutes. Perform a targeted neurological and carotid examination.',
      rubric: [
        { id: 'item-c-intro', label: 'Introduction, consent, and clear explanation of cerebrovascular exam.' },
        { id: 'item-c-auscultate', label: 'Auscultated carotid bifurcation for bruits without applying excessive pressure.' },
        { id: 'item-c-cn12', label: 'Examined Hypoglossal Nerve (CN XII): Asked patient to protrude tongue to check for deviation.' },
        { id: 'item-c-cn7', label: 'Examined Facial Nerve (CN VII): Checked symmetry of smile and lower lip depressor.' },
        { id: 'item-c-fundus', label: 'Fundoscopy: Evaluated retinal vessels for cholesterol emboli (Hollenhorst plaques).' },
        { id: 'item-c-timing', label: 'Counselled regarding urgency of Carotid Endarterectomy (ideal window within 14 days).' }
      ]
    },
    aaa: {
      title: 'Station: Abdominal Examination for Suspected Aortic Aneurysm',
      timeLimit: 8,
      prompt: 'A 72-year-old male smoker attends with non-specific lumbar ache. Perform a structured abdominal vascular examination to assess for aortic aneurysm.',
      rubric: [
        { id: 'item-a-intro', label: 'Professional introduction, comfortable positioning with knees flexed to relax abdominal wall.' },
        { id: 'item-a-palpate', label: 'Bimanual palpation: Placed both hands on epigastrium to determine if mass is expansile (moving hands apart) vs transmitted.' },
        { id: 'item-a-gentle', label: 'Avoided aggressive deep palpation to prevent pain or destabilization.' },
        { id: 'item-a-femoral', label: 'Palpated bilateral femoral pulses for symmetry and synchronous femoral aneurysm.' },
        { id: 'item-a-imaging', label: 'Recommended initial non-invasive duplex ultrasound screening.' }
      ]
    }
  };

  const currentOsce = osceStationsData[osceStation];
  const osceTotalScore = Object.values(osceChecklist).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner and Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
            <Activity className="w-4 h-4" />
            <span>{isAr ? 'بيئة المحاكاة السريرية الجراحية التفاعلية' : 'Interactive Clinical Case Simulation & OSCE Workspace'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {activeTabMode === 'simulation'
              ? isAr ? 'محاكاة الحالات السريرية' : 'Clinical Case Simulator'
              : isAr ? 'محطة امتحان OSCE السريري' : 'OSCE Examination Stations'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'تفاعل خطوة بخطوة مع مريض طوارئ، اتخذ قرارات جراحية حرجة، واحصل على تقييم فوري من الاستشاري.'
              : 'Step through history, bedside physical exams, duplex diagnostics, and emergency operative decisions.'}
          </p>
        </div>

        {/* Toggle between Case Simulation and OSCE */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTabMode('simulation')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTabMode === 'simulation'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Case Simulation
          </button>
          <button
            onClick={() => setActiveTabMode('osce')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTabMode === 'osce'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            OSCE Station Mode
          </button>
        </div>
      </div>

      {activeTabMode === 'simulation' ? (
        /* Clinical Case Simulator Mode (PRD Section 28) */
        <div className="space-y-6">
          {/* Case Picker Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {clinicalCases.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCase(c);
                  handleResetCase();
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCase.id === c.id
                    ? 'bg-slate-800 text-teal-400 border border-teal-500/50 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.category}: {isAr && c.titleAr ? c.titleAr : c.title.slice(0, 40) + '...'}
              </button>
            ))}
          </div>

          {/* Patient Card & Vitals Banner */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30">
                  {selectedCase.difficulty} Level Scenario
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {isAr && selectedCase.titleAr ? selectedCase.titleAr : selectedCase.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCase}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Case</span>
                </button>
              </div>
            </div>

            {/* Profile & Chief complaint */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-1">
                <span className="text-teal-400 font-bold block text-xs uppercase tracking-wider">Patient History:</span>
                <p>{selectedCase.historySummary}</p>
              </div>

              {/* Vitals monitor */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" /> Bedside Emergency Vitals:
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  {Object.entries(selectedCase.initialVitals).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-800/80 pb-0.5">
                      <span className="text-slate-500">{k}:</span>
                      <span className="text-slate-200 font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>
              Stage {currentStepIndex + 1} of {selectedCase.steps.length}: <strong className="text-white">{currentStep.stageTitle}</strong>
            </span>
            <span>{Math.round(((currentStepIndex + 1) / selectedCase.steps.length) * 100)}% Complete</span>
          </div>

          {/* Current Step Interactive Decision Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                Clinical Decision Point:
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentStep.descriptionEn}
              </h4>
              {currentStep.descriptionAr && (
                <p className="text-sm text-slate-300 leading-relaxed font-sans" dir="rtl">
                  {currentStep.descriptionAr}
                </p>
              )}
            </div>

            {/* Bedside physical findings if present */}
            {currentStep.patientData && currentStep.patientData.vitals && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-teal-400 font-bold block uppercase tracking-wider">
                  Objective Physical & Doppler Examination:
                </span>
                <div className="space-y-1 text-slate-300">
                  {Object.entries(currentStep.patientData.vitals).map(([k, v]) => (
                    <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 py-1">
                      <span className="font-semibold text-slate-400">{k}:</span>
                      <span className="text-slate-200 font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decision Options */}
            <div className="space-y-3 pt-2">
              {currentStep.options.map(opt => {
                const isSelected = userOptionId === opt.id;
                let btnClass = 'bg-slate-850 border-slate-750 text-slate-200 hover:border-slate-600';
                if (isSelected) {
                  btnClass = opt.isOptimal
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 font-bold shadow-md'
                    : 'bg-amber-950/40 border-amber-500 text-amber-100 font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectCaseOption(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${btnClass}`}
                  >
                    <div className="p-1 rounded-lg bg-slate-800 shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-xs sm:text-sm leading-relaxed">{opt.textEn}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* AI Dynamic Evaluation & Feedback */}
            {selectedOptionObj && (
              <div className={`p-5 rounded-2xl border animate-in fade-in duration-200 space-y-2 text-xs sm:text-sm ${
                selectedOptionObj.isOptimal
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
              }`}>
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                  {selectedOptionObj.isOptimal ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Optimal Clinical Judgment
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Suboptimal Management Decision
                    </span>
                  )}
                </div>
                <p className="leading-relaxed font-sans">{selectedOptionObj.feedbackEn}</p>
                {selectedOptionObj.feedbackAr && (
                  <p className="pt-2 border-t border-slate-800 text-slate-300" dir="rtl">
                    {selectedOptionObj.feedbackAr}
                  </p>
                )}
              </div>
            )}

            {/* Next Stage Button */}
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={handleNextStep}
                disabled={!userOptionId}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  userOptionId
                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{currentStepIndex === selectedCase.steps.length - 1 ? 'Complete Case' : 'Proceed to Next Stage'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Case Summary Pearls (if completed) */}
          {isCaseCompleted && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-teal-500/50 shadow-2xl space-y-4 animate-in fade-in duration-300">
              <h4 className="text-base font-bold text-teal-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>Simulation Debrief & Surgical Consultant Pearls</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {selectedCase.learningPearls.map((pearl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pearl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* OSCE Station Mode (PRD Section 29) */
        <div className="space-y-6">
          {/* Station selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setOsceStation('clti');
                setOsceChecklist({});
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                osceStation === 'clti'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Station 1: CLTI & Diabetic Foot Exam
            </button>
            <button
              onClick={() => {
                setOsceStation('carotid');
                setOsceChecklist({});
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                osceStation === 'carotid'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Station 2: Carotid TIA & Cranial Nerves
            </button>
            <button
              onClick={() => {
                setOsceStation('aaa');
                setOsceChecklist({});
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                osceStation === 'aaa'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Station 3: Abdominal Aortic Aneurysm
            </button>
          </div>

          {/* OSCE Station Prompt & Examiner Rubric */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30">
                  Standardized OSCE Station ({currentOsce.timeLimit} Minutes)
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {currentOsce.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 font-mono text-xs text-purple-300 font-bold">
                  Score: {osceTotalScore} / {currentOsce.rubric.length}
                </div>
              </div>
            </div>

            {/* Candidate Instructions */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs sm:text-sm text-purple-200">
              <strong className="block text-white mb-1">Candidate Scenario:</strong>
              {currentOsce.prompt}
            </div>

            {/* Examiner Checklist / Rubric */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Examiner Objective Marking Rubric:
              </h4>
              <div className="space-y-2">
                {currentOsce.rubric.map(item => {
                  const isChecked = Boolean(osceChecklist[item.id]);
                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setOsceChecklist(prev => ({
                          ...prev,
                          [item.id]: !prev[item.id]
                        }))
                      }
                      className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100 font-medium'
                          : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{item.label}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
