import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VASCULAR_ANATOMY_MODULES } from '../data/anatomyData';
import { VascularAnatomyModule } from '../types';
import {
  HeartPulse,
  Sparkles,
  Layers,
  Scissors,
  AlertTriangle,
  BookOpen,
  Info,
  Maximize2,
  ZoomIn,
  ShieldAlert,
  Search,
  Check
} from 'lucide-react';

export const AnatomyView: React.FC = () => {
  const { languageMode, setTutorInitialPrompt, setActiveTab, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [selectedModule, setSelectedModule] = useState<VascularAnatomyModule>(VASCULAR_ANATOMY_MODULES[0]);
  const [activeTab, setActiveTabLocal] = useState<'course' | 'branches' | 'relations' | 'exposure' | 'pathology' | 'pearls'>('course');
  const [isIllustrationGenOpen, setIsIllustrationGenOpen] = useState(false);
  const [illustrationPrompt, setIllustrationPrompt] = useState('Show the course of the SFA through the adductor canal');
  const [generatedDiagramTitle, setGeneratedDiagramTitle] = useState<string | null>(null);

  const handleGenerateIllustration = () => {
    if (!illustrationPrompt.trim()) return;
    setGeneratedDiagramTitle(illustrationPrompt);
    setIsIllustrationGenOpen(false);
    showNotification(`Educational illustration updated: "${illustrationPrompt}"`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>{isAr ? 'مستكشف التشريح الجراحي للأوعية الدموية' : 'Interactive Surgical Vascular Anatomy'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isAr ? 'مستكشف التشريح والرسوم التوضيحية' : 'Anatomy Explorer & AI Illustrations'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'دراسة المسارات الشريانية والوريدية، الفروع الجانبية، العلاقات الخطرة، وخطوات التعريض الجراحي.'
              : 'Explore arterial and venous courses, surgical exposures, landmarks at risk, and generate educational schematics.'}
          </p>
        </div>

        <button
          onClick={() => setIsIllustrationGenOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-teal-950 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'توليد رسم توضيحي طبي' : 'Generate Medical Illustration'}</span>
        </button>
      </div>

      {/* Anatomy Module Picker Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {VASCULAR_ANATOMY_MODULES.map(mod => (
          <button
            key={mod.id}
            onClick={() => setSelectedModule(mod)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedModule.id === mod.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {isAr && mod.nameAr ? mod.nameAr : mod.nameEn}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive SVG Diagram on Left, Anatomy Syllabus on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Anatomical Visualizer & Interactive SVG (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-teal-400">
                Educational Schematic: {selectedModule.diagramType.toUpperCase()}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5" /> Interactive
              </span>
            </div>

            {/* Responsive SVG Diagram */}
            <div className="w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
              <svg viewBox="0 0 300 320" className="w-full h-full text-slate-200">
                <defs>
                  <linearGradient id="arteryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </linearGradient>
                  <linearGradient id="veinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>

                {selectedModule.diagramType === 'femoral' && (
                  <g>
                    {/* Inguinal Ligament */}
                    <line x1="30" y1="40" x2="270" y2="40" stroke="#64748b" strokeWidth="4" strokeDasharray="4 4" />
                    <text x="35" y="32" fill="#94a3b8" fontSize="10" fontWeight="bold">Inguinal Ligament</text>

                    {/* CFA Main Trunk */}
                    <path d="M 150 40 L 150 110" stroke="url(#arteryGrad)" strokeWidth="12" strokeLinecap="round" />
                    <text x="165" y="75" fill="#f87171" fontSize="11" fontWeight="bold">CFA (Common Femoral)</text>

                    {/* SFA Trunk descending through adductor canal */}
                    <path d="M 150 110 C 145 150 140 210 150 280" stroke="url(#arteryGrad)" strokeWidth="9" strokeLinecap="round" />
                    <text x="162" y="190" fill="#f87171" fontSize="11">SFA (Adductor Canal)</text>

                    {/* Profunda Femoris Branch branching laterally */}
                    <path d="M 150 110 C 130 140 90 190 70 240" stroke="url(#arteryGrad)" strokeWidth="7" strokeLinecap="round" />
                    <text x="25" y="170" fill="#fca5a5" fontSize="10">Profunda Femoris</text>

                    {/* Circumflex branches */}
                    <path d="M 130 135 L 80 120" stroke="url(#arteryGrad)" strokeWidth="4" />
                    <text x="40" y="112" fill="#fca5a5" fontSize="9">Lateral Circumflex</text>

                    {/* Femoral Nerve marker */}
                    <circle cx="205" cy="65" r="7" fill="#eab308" />
                    <text x="218" y="70" fill="#fde047" fontSize="10">Femoral Nerve (Lateral)</text>

                    {/* Femoral Vein marker */}
                    <path d="M 125 40 L 125 105" stroke="url(#veinGrad)" strokeWidth="11" strokeLinecap="round" />
                    <text x="50" y="75" fill="#60a5fa" fontSize="10">Femoral Vein (Medial)</text>
                  </g>
                )}

                {selectedModule.diagramType === 'carotid' && (
                  <g>
                    {/* Common Carotid */}
                    <path d="M 150 280 L 150 160" stroke="url(#arteryGrad)" strokeWidth="14" strokeLinecap="round" />
                    <text x="165" y="240" fill="#f87171" fontSize="11" fontWeight="bold">CCA (C3-C4)</text>

                    {/* Carotid Bulb */}
                    <ellipse cx="150" cy="155" rx="10" ry="14" fill="#ef4444" />
                    <text x="170" y="160" fill="#fca5a5" fontSize="10">Carotid Bulb / Sinus</text>

                    {/* ICA (Posterolateral, NO branches) */}
                    <path d="M 145 150 C 135 120 125 70 125 30" stroke="url(#arteryGrad)" strokeWidth="8" strokeLinecap="round" />
                    <text x="40" y="80" fill="#ef4444" fontSize="11" fontWeight="bold">ICA (Zero Branches)</text>

                    {/* ECA (Anteromedial, with branches) */}
                    <path d="M 155 150 C 170 120 190 70 200 30" stroke="url(#arteryGrad)" strokeWidth="8" strokeLinecap="round" />
                    <text x="210" y="80" fill="#f87171" fontSize="11" fontWeight="bold">ECA</text>

                    {/* Superior Thyroid branch */}
                    <path d="M 162 135 L 210 150" stroke="url(#arteryGrad)" strokeWidth="4" />
                    <text x="215" y="155" fill="#fca5a5" fontSize="9">Sup. Thyroid Artery</text>

                    {/* Hypoglossal Nerve CN XII crossing */}
                    <path d="M 80 120 C 130 130 170 130 220 115" stroke="#eab308" strokeWidth="4" strokeDasharray="3 3" />
                    <text x="80" y="110" fill="#fde047" fontSize="10" fontWeight="bold">Hypoglossal Nerve (CN XII)</text>
                  </g>
                )}

                {selectedModule.diagramType === 'aorta' && (
                  <g>
                    {/* Aorta Trunk */}
                    <path d="M 150 30 L 150 200" stroke="url(#arteryGrad)" strokeWidth="18" strokeLinecap="round" />
                    <text x="175" y="60" fill="#f87171" fontSize="12" fontWeight="bold">Abdominal Aorta</text>

                    {/* Renal Arteries */}
                    <path d="M 150 90 L 80 95" stroke="url(#arteryGrad)" strokeWidth="7" />
                    <path d="M 150 90 L 220 95" stroke="url(#arteryGrad)" strokeWidth="7" />
                    <text x="35" y="95" fill="#fca5a5" fontSize="10">R. Renal</text>
                    <text x="225" y="95" fill="#fca5a5" fontSize="10">L. Renal</text>

                    {/* Left Renal Vein Crossing */}
                    <path d="M 60 82 L 230 82" stroke="url(#veinGrad)" strokeWidth="9" strokeLinecap="round" opacity="0.8" />
                    <text x="70" y="75" fill="#60a5fa" fontSize="9" fontWeight="bold">Left Renal Vein (Ant. to Aorta)</text>

                    {/* Bifurcation at L4 */}
                    <path d="M 150 200 L 105 270" stroke="url(#arteryGrad)" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 150 200 L 195 270" stroke="url(#arteryGrad)" strokeWidth="10" strokeLinecap="round" />
                    <text x="45" y="270" fill="#f87171" fontSize="10">R. Common Iliac</text>
                    <text x="185" y="270" fill="#f87171" fontSize="10">L. Common Iliac</text>
                  </g>
                )}

                {(selectedModule.diagramType === 'popliteal' ||
                  selectedModule.diagramType === 'venous' ||
                  selectedModule.diagramType === 'fistula') && (
                  <g>
                    <path d="M 150 30 L 150 260" stroke="url(#arteryGrad)" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 150 140 L 90 220" stroke="url(#arteryGrad)" strokeWidth="6" />
                    <path d="M 150 180 L 210 240" stroke="url(#arteryGrad)" strokeWidth="6" />
                    <text x="165" y="80" fill="#f87171" fontSize="11" fontWeight="bold">{selectedModule.nameEn.split(' ')[0]} Trunk</text>
                    <text x="40" y="235" fill="#fca5a5" fontSize="10">Collateral Branch A</text>
                    <text x="185" y="255" fill="#fca5a5" fontSize="10">Collateral Branch B</text>
                  </g>
                )}
              </svg>

              {/* Verified educational badge (PRD Section 22) */}
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 text-center backdrop-blur-xs">
                AI-generated educational illustration. Verify anatomy with the cited medical reference.
              </div>
            </div>

            {/* AI Custom schematic status if active */}
            {generatedDiagramTitle && (
              <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-800 text-xs text-teal-300">
                <strong>Custom Illustration Active:</strong> "{generatedDiagramTitle}"
              </div>
            )}
          </div>
        </div>

        {/* Right: Comprehensive Syllabus Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                Surgical Anatomy Syllabus
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {isAr && selectedModule.nameAr ? selectedModule.nameAr : selectedModule.nameEn}
              </h3>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
              {[
                { id: 'course', label: 'Course' },
                { id: 'branches', label: 'Branches' },
                { id: 'relations', label: 'Relations' },
                { id: 'exposure', label: 'Surgical Exposure' },
                { id: 'pathology', label: 'Pathology' },
                { id: 'pearls', label: 'Exam Pearls' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabLocal(tab.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Course */}
            {activeTab === 'course' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <p>{selectedModule.course}</p>
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    Surface Landmarks & Palpation:
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                    {selectedModule.landmarks.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Branches */}
            {activeTab === 'branches' && (
              <div className="space-y-3">
                {selectedModule.branches.map((b, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-1 text-xs sm:text-sm">
                    <span className="font-bold text-white block text-sm">{b.name}</span>
                    <p className="text-slate-300">{b.description}</p>
                    <p className="text-teal-400 pt-1 font-medium">
                      <strong>Clinical Relevance:</strong> {b.clinicalSignificance}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Relations */}
            {activeTab === 'relations' && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    Anatomical Relations & Fascial Compartments:
                  </span>
                  <ul className="space-y-2">
                    {selectedModule.relations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 4: Surgical Exposure (PRD Section 23) */}
            {activeTab === 'exposure' && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-1">
                  <strong className="text-teal-400 block text-xs uppercase tracking-wider">Incision & Approach:</strong>
                  <p className="text-slate-300">{selectedModule.surgicalExposure.incision}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-1">
                  <strong className="text-teal-400 block text-xs uppercase tracking-wider">Surgical Plane & Dissection:</strong>
                  <p className="text-slate-300">{selectedModule.surgicalExposure.plane}</p>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-red-200 space-y-1">
                  <strong className="text-red-400 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Structures at High Risk:
                  </strong>
                  <ul className="space-y-1">
                    {selectedModule.surgicalExposure.structuresAtRisk.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 5: Pathology */}
            {activeTab === 'pathology' && (
              <div className="space-y-2 text-xs sm:text-sm">
                {selectedModule.commonPathology.map((p, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 text-slate-300">
                    {p}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 6: Exam Pearls */}
            {activeTab === 'pearls' && (
              <div className="space-y-3 text-xs sm:text-sm">
                {selectedModule.examHighlights.map((ex, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/40 text-teal-200">
                    • {ex}
                  </div>
                ))}
              </div>
            )}

            {/* References footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{selectedModule.references.join(' • ')}</span>
              <button
                onClick={() => {
                  setTutorInitialPrompt(`Explain in detail the surgical anatomy and exposure of the ${selectedModule.nameEn}`);
                  setActiveTab('tutor');
                }}
                className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
              >
                <span>Ask AI Tutor</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Illustration Generator Modal (PRD Section 22) */}
      {isIllustrationGenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Generate Educational Illustration</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Request educational schematic diagrams with clear landmarks and simplified surgical planes.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Illustration Prompt:
              </label>
              <input
                type="text"
                value={illustrationPrompt}
                onChange={e => setIllustrationPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsIllustrationGenOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateIllustration}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-teal-950"
              >
                Generate Illustration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
