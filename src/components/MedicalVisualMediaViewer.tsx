import React, { useState } from 'react';
import { MedicalDiagramResource, MedicalVideoResource } from '../data/clinicalExplanationsData';
import {
  Video,
  Play,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  ZoomIn,
  Sparkles,
  Scissors,
  Layers,
  ChevronRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

interface MedicalVisualMediaViewerProps {
  diagrams?: MedicalDiagramResource[];
  videos?: MedicalVideoResource[];
  isAr?: boolean;
}

export const MedicalVisualMediaViewer: React.FC<MedicalVisualMediaViewerProps> = ({
  diagrams = [],
  videos = [],
  isAr = false
}) => {
  const [selectedDiagram, setSelectedDiagram] = useState<MedicalDiagramResource | null>(null);

  if (diagrams.length === 0 && videos.length === 0) {
    return null;
  }

  const renderSvgIllustration = (type: string) => {
    switch (type) {
      case 'ali_fogarty':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Arterial Lumen */}
            <path d="M 40 70 L 560 70" stroke="#f43f5e" strokeWidth="22" strokeLinecap="round" opacity="0.35" />
            <path d="M 40 170 L 560 170" stroke="#f43f5e" strokeWidth="22" strokeLinecap="round" opacity="0.35" />
            <rect x="40" y="80" width="520" height="80" fill="#881337" opacity="0.2" rx="10" />

            {/* Thrombus Mass */}
            <ellipse cx="360" cy="120" rx="65" ry="32" fill="#be123c" stroke="#e11d48" strokeWidth="3" />
            <text x="360" y="125" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
              {isAr ? 'خثرة شريانية مسدّة (Thrombus)' : 'Occlusive Thrombus'}
            </text>

            {/* Fogarty Catheter Shaft */}
            <path d="M 20 120 L 460 120" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" />
            {/* Inflated Fogarty Balloon */}
            <circle cx="470" cy="120" r="30" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" opacity="0.9" />
            <text x="470" y="125" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              Balloon
            </text>

            {/* Direction Arrow */}
            <path d="M 320 40 L 260 40 M 275 32 L 260 40 L 275 48" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
            <text x="290" y="28" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              {isAr ? 'اتجاه سحب القسطرة مع الخثرة' : 'Retrograde Catheter Withdrawal'}
            </text>

            {/* Labels */}
            <text x="70" y="145" fill="#94a3b8" fontSize="11">
              Fogarty 4F Catheter
            </text>
            <text x="500" y="60" fill="#fda4af" fontSize="11">
              Femoral Artery Wall
            </text>
          </svg>
        );

      case 'aaa_evar':
        return (
          <svg viewBox="0 0 600 250" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Renal Arteries */}
            <path d="M 120 45 L 260 45" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
            <path d="M 340 45 L 480 45" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
            <text x="170" y="32" fill="#fca5a5" fontSize="10">Right Renal A.</text>
            <text x="430" y="32" fill="#fca5a5" fontSize="10">Left Renal A.</text>

            {/* Aortic Neck */}
            <rect x="260" y="25" width="80" height="40" fill="#7f1d1d" opacity="0.4" rx="4" />
            <text x="300" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              {isAr ? 'عنق الأبهر تحت الكلوي (Neck ≥ 15mm)' : 'Infrarenal Neck (≥ 15mm)'}
            </text>

            {/* Aneurysm Sac Outline */}
            <path d="M 260 65 Q 160 125 240 185 L 270 215" stroke="#e11d48" strokeWidth="3" fill="#881337" fillOpacity="0.15" />
            <path d="M 340 65 Q 440 125 360 185 L 330 215" stroke="#e11d48" strokeWidth="3" fill="#881337" fillOpacity="0.15" />

            {/* EVAR Stent-Graft Main Body */}
            <rect x="275" y="45" width="50" height="95" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2.5" rx="4" />
            {/* Stent Skeleton Rings */}
            <line x1="275" y1="65" x2="325" y2="75" stroke="#5eead4" strokeWidth="2" />
            <line x1="275" y1="85" x2="325" y2="95" stroke="#5eead4" strokeWidth="2" />
            <line x1="275" y1="105" x2="325" y2="115" stroke="#5eead4" strokeWidth="2" />

            {/* Iliac Limbs */}
            <path d="M 285 140 L 250 220" stroke="#2dd4bf" strokeWidth="14" strokeLinecap="round" />
            <path d="M 315 140 L 350 220" stroke="#2dd4bf" strokeWidth="14" strokeLinecap="round" />

            {/* Thrombus in Sac */}
            <ellipse cx="215" cy="125" rx="30" ry="18" fill="#475569" opacity="0.6" />
            <ellipse cx="385" cy="125" rx="30" ry="18" fill="#475569" opacity="0.6" />
            <text x="300" y="165" fill="#2dd4bf" fontSize="11" fontWeight="bold" textAnchor="middle">
              EVAR Bifurcated Graft
            </text>
            <text x="215" y="128" fill="#e2e8f0" fontSize="9" textAnchor="middle">Sac Thrombus</text>
            <text x="385" y="128" fill="#e2e8f0" fontSize="9" textAnchor="middle">Sac Thrombus</text>
          </svg>
        );

      case 'cea_anatomy':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Common Carotid */}
            <path d="M 120 180 L 260 180" stroke="#ef4444" strokeWidth="24" strokeLinecap="round" />
            <text x="180" y="215" fill="#fca5a5" fontSize="11" fontWeight="bold">CCA (Common Carotid)</text>

            {/* Bifurcation Bulb */}
            <ellipse cx="280" cy="165" rx="30" ry="25" fill="#b91c1c" />

            {/* Internal Carotid Artery (ICA) - Smooth, NO Branches */}
            <path d="M 295 155 Q 360 100 480 85" stroke="#f43f5e" strokeWidth="18" strokeLinecap="round" fill="none" />
            <text x="440" y="65" fill="#fda4af" fontSize="11" fontWeight="bold">
              ICA (No Branches in Neck!)
            </text>

            {/* External Carotid Artery (ECA) - With Superior Thyroid Branch */}
            <path d="M 295 175 Q 380 200 480 195" stroke="#f43f5e" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M 370 195 L 410 230" stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" />
            <text x="440" y="235" fill="#fda4af" fontSize="9">Sup. Thyroid Artery Branch</text>
            <text x="480" y="180" fill="#fca5a5" fontSize="11" fontWeight="bold">ECA</text>

            {/* Patch Angioplasty / Shunt Overlay */}
            <path d="M 270 160 L 370 125" stroke="#0ea5e9" strokeWidth="8" strokeDasharray="3 3" />
            <text x="320" y="115" fill="#38bdf8" fontSize="10" fontWeight="bold">
              CEA Patch Angioplasty Area
            </text>

            {/* Cranial Nerve XII Crossing */}
            <path d="M 330 60 Q 345 130 380 160" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 2" />
            <text x="310" y="50" fill="#fde047" fontSize="10" fontWeight="bold">
              CN XII (Hypoglossal Nerve)
            </text>
          </svg>
        );

      case 'pad_bypass':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Common Femoral & Profunda */}
            <path d="M 60 50 L 160 50" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" />
            <path d="M 160 50 L 220 90" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" />
            <text x="100" y="35" fill="#fca5a5" fontSize="10">Common Femoral</text>
            <text x="230" y="105" fill="#fca5a5" fontSize="9">Profunda Femoris</text>

            {/* Occluded Superficial Femoral Artery */}
            <path d="M 160 50 L 420 50" stroke="#94a3b8" strokeWidth="14" strokeDasharray="4 4" />
            <rect x="250" y="42" width="80" height="16" fill="#be123c" rx="4" />
            <text x="290" y="54" fill="#ffffff" fontSize="9" textAnchor="middle">Occluded SFA</text>

            {/* Saphenous Vein Bypass Graft */}
            <path d="M 160 50 Q 290 170 420 120" stroke="#06b6d4" strokeWidth="10" fill="none" strokeLinecap="round" />
            <circle cx="160" cy="50" r="7" fill="#0284c7" />
            <circle cx="420" cy="120" r="7" fill="#0284c7" />
            <text x="290" y="170" fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">
              {isAr ? 'مجازة الوريد الصافن الذاتي (GSV Bypass)' : 'Reversed Great Saphenous Vein Graft'}
            </text>

            {/* Popliteal Outflow */}
            <path d="M 420 120 L 540 120" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
            <text x="470" y="140" fill="#fca5a5" fontSize="10">Below-Knee Popliteal</text>
          </svg>
        );

      case 'cvd_evla':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Deep Femoral Vein */}
            <path d="M 60 40 L 540 40" stroke="#1d4ed8" strokeWidth="26" strokeLinecap="round" opacity="0.4" />
            <text x="120" y="32" fill="#93c5fd" fontSize="10">Common Femoral Vein (CFV)</text>

            {/* Incompetent Great Saphenous Vein */}
            <path d="M 280 40 L 480 200" stroke="#3b82f6" strokeWidth="18" strokeLinecap="round" />
            <text x="420" y="225" fill="#60a5fa" fontSize="11" fontWeight="bold">
              {isAr ? 'الوريد الصافن الكبير القاصر (GSV)' : 'Incompetent GSV'}
            </text>

            {/* Tumescent Anesthesia Halo */}
            <ellipse cx="370" cy="130" rx="90" ry="45" fill="#0284c7" opacity="0.25" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
            <text x="410" y="105" fill="#38bdf8" fontSize="10">
              {isAr ? 'هالة التخدير الانتفاخي (Tumescent Halo)' : 'Tumescent Fluid Envelope'}
            </text>

            {/* Laser Fiber & Thermal Energy */}
            <path d="M 480 200 L 310 65" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="310" cy="65" r="8" fill="#ef4444" />
            <text x="290" y="85" fill="#f87171" fontSize="10" fontWeight="bold">
              Laser Tip 20mm from SFJ
            </text>
          </svg>
        );

      case 'vgi_nais':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Aortic Stump */}
            <path d="M 220 30 L 380 30" stroke="#b91c1c" strokeWidth="22" strokeLinecap="round" />
            <text x="300" y="24" fill="#fca5a5" fontSize="10" textAnchor="middle">Debrided Aortic Neck</text>

            {/* NAIS Autologous Femoral Vein Bifurcation */}
            <path d="M 300 40 L 300 110" stroke="#0284c7" strokeWidth="18" strokeLinecap="round" />
            <path d="M 300 110 L 230 200" stroke="#0284c7" strokeWidth="14" strokeLinecap="round" />
            <path d="M 300 110 L 370 200" stroke="#0284c7" strokeWidth="14" strokeLinecap="round" />
            <text x="300" y="90" fill="#e0f2fe" fontSize="11" fontWeight="bold" textAnchor="middle">
              NAIS Neo-Aorta
            </text>

            {/* Omental Flap Coverage */}
            <path d="M 200 80 Q 300 160 400 80" stroke="#eab308" strokeWidth="5" fill="#ca8a04" fillOpacity="0.2" />
            <text x="300" y="145" fill="#fef08a" fontSize="10" textAnchor="middle">
              {isAr ? 'تغطية السديلة الثربية (Omental Wrap)' : 'Vascularized Omental Flap Wrap'}
            </text>
          </svg>
        );

      case 'taaa_dissection':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Aortic Arch & Left Subclavian */}
            <path d="M 80 80 Q 200 20 280 80 L 280 220" stroke="#ef4444" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.4" />
            <path d="M 230 40 L 230 15" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
            <text x="240" y="15" fill="#fca5a5" fontSize="9">Left Subclavian A.</text>

            {/* True & False Lumen Dissection Flap */}
            <path d="M 280 90 L 280 220" stroke="#fbbf24" strokeWidth="3" strokeDasharray="4 2" />
            <text x="250" y="150" fill="#fde047" fontSize="10">True Lumen</text>
            <text x="315" y="150" fill="#f87171" fontSize="10">False Lumen</text>

            {/* TEVAR Stent Graft Covering Entry Tear */}
            <rect x="268" y="70" width="24" height="90" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2.5" rx="3" />
            <text x="370" y="110" fill="#2dd4bf" fontSize="11" fontWeight="bold">
              {isAr ? 'دعامة TEVAR المغطاة تغلق تمزق الدخول' : 'TEVAR Stent-Graft Sealing Entry Tear'}
            </text>
          </svg>
        );

      case 'avf_fistula':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Radial Artery */}
            <path d="M 60 160 L 540 160" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
            <text x="100" y="190" fill="#fca5a5" fontSize="11" fontWeight="bold">Radial Artery</text>

            {/* Spatulated Cephalic Vein End-to-Side Anastomosis */}
            <path d="M 480 60 Q 320 80 280 160" stroke="#0ea5e9" strokeWidth="22" fill="none" strokeLinecap="round" />
            <circle cx="280" cy="160" r="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <text x="440" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold">
              {isAr ? 'الوريد الرأسي المؤرتر (Arterialized Cephalic Vein)' : 'Arterialized Cephalic Vein (Thrill)'}
            </text>
            <text x="280" y="130" fill="#fde047" fontSize="10" textAnchor="middle">
              End-to-Side Prolene 7-0
            </text>
          </svg>
        );

      case 'dvt_veins':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Right Common Iliac Artery Crossing */}
            <path d="M 180 60 L 400 180" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" opacity="0.6" />
            <text x="350" y="195" fill="#fca5a5" fontSize="10">Right Iliac Artery</text>

            {/* Left Common Iliac Vein Compressed */}
            <path d="M 180 180 L 400 60" stroke="#1d4ed8" strokeWidth="20" strokeLinecap="round" />
            <ellipse cx="290" cy="120" rx="40" ry="16" fill="#be123c" stroke="#e11d48" strokeWidth="2" />
            <text x="290" y="124" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isAr ? 'انضغاط ماي-تيرنر وخثار وريدي' : 'May-Thurner DVT Spur'}
            </text>

            {/* Dedicated Venous Stent */}
            <rect x="250" y="100" width="80" height="40" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" rx="4" />
            <text x="290" y="90" fill="#38bdf8" fontSize="10" textAnchor="middle">Venous Stent Area</text>
          </svg>
        );

      case 'mesenteric_anatomy':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Abdominal Aorta */}
            <path d="M 120 40 L 120 200" stroke="#ef4444" strokeWidth="26" strokeLinecap="round" />
            <text x="80" y="120" fill="#fca5a5" fontSize="10" textAnchor="middle">Aorta</text>

            {/* Celiac Trunk */}
            <path d="M 120 70 L 260 50" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
            <text x="280" y="55" fill="#fca5a5" fontSize="10">Celiac Axis</text>

            {/* Superior Mesenteric Artery (SMA) with Embolus */}
            <path d="M 120 120 L 480 150" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
            <ellipse cx="260" cy="132" rx="25" ry="12" fill="#be123c" stroke="#e11d48" strokeWidth="2" />
            <text x="260" y="136" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Embolus</text>

            {/* Fogarty Catheter Extraction */}
            <path d="M 480 150 L 220 130" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3" />
            <circle cx="215" cy="130" r="10" fill="#38bdf8" />
            <text x="360" y="180" fill="#38bdf8" fontSize="11" fontWeight="bold">
              {isAr ? 'استخراج صمة SMA بقسطرة فوغارتي 3F' : 'Fogarty 3F SMA Embolectomy'}
            </text>
          </svg>
        );

      case 'popliteal_anatomy':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Normal Proximal Popliteal */}
            <path d="M 80 120 L 200 120" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
            <text x="120" y="100" fill="#fca5a5" fontSize="10">Proximal Artery</text>

            {/* Popliteal Aneurysm Sac with Mural Thrombus */}
            <ellipse cx="300" cy="120" rx="60" ry="40" fill="#991b1b" stroke="#e11d48" strokeWidth="3" />
            <ellipse cx="300" cy="120" rx="35" ry="20" fill="#ef4444" />
            <text x="300" y="124" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isAr ? 'أم دم مأبضية (≥ 20mm)' : 'PAA Sac (≥ 20mm)'}
            </text>

            {/* Ligation Clamps / Excluded Sac */}
            <line x1="210" y1="90" x2="210" y2="150" stroke="#fbbf24" strokeWidth="4" />
            <line x1="390" y1="90" x2="390" y2="150" stroke="#fbbf24" strokeWidth="4" />
            <text x="300" y="185" fill="#fde047" fontSize="10" textAnchor="middle">
              {isAr ? 'عزل وربط الكيس لمنع الصمات' : 'Exclusion Ligation Points'}
            </text>

            {/* Medial Saphenous Bypass */}
            <path d="M 180 120 Q 300 220 420 120" stroke="#06b6d4" strokeWidth="8" fill="none" />
            <text x="300" y="235" fill="#22d3ee" fontSize="10" fontWeight="bold" textAnchor="middle">
              Reversed GSV Bypass Conduit
            </text>

            {/* Distal Runoff */}
            <path d="M 400 120 L 520 120" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
            <text x="470" y="100" fill="#fca5a5" fontSize="10">Tibial Runoff</text>
          </svg>
        );

      case 'fasciotomy_4compartment':
        return (
          <svg viewBox="0 0 600 250" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Calf Cross Section Outline */}
            <ellipse cx="300" cy="125" rx="260" ry="105" fill="#0f172a" stroke="#334155" strokeWidth="3" />

            {/* Tibia & Fibula bones */}
            <polygon points="210,80 245,65 240,110 200,105" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <text x="225" y="90" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">Tibia</text>

            <circle cx="430" cy="115" r="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <text x="430" y="119" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">Fibula</text>

            {/* 1. Anterior Compartment */}
            <path d="M 245 65 Q 340 55 420 100 L 360 110 Z" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
            <text x="320" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold">
              1. Anterior (Deep Peroneal N.)
            </text>

            {/* 2. Lateral Compartment */}
            <path d="M 430 133 Q 480 140 460 180 L 415 150 Z" fill="#ca8a04" fillOpacity="0.25" stroke="#facc15" strokeWidth="2" />
            <text x="470" y="135" fill="#fde047" fontSize="10" fontWeight="bold">
              2. Lateral
            </text>

            {/* 3. Superficial Posterior */}
            <path d="M 180 170 Q 300 220 440 185 L 340 145 Z" fill="#be123c" fillOpacity="0.2" stroke="#fb7185" strokeWidth="2" />
            <text x="300" y="205" fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">
              3. Superficial Posterior (Gastrocnemius/Soleus)
            </text>

            {/* 4. Deep Posterior (CRITICAL) */}
            <path d="M 230 115 Q 310 120 340 145 L 250 160 Z" fill="#059669" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" strokeDasharray="3 2" />
            <text x="280" y="135" fill="#6ee7b7" fontSize="10" fontWeight="bold">
              4. Deep Posterior (Tibial N. & Vessels)
            </text>

            {/* Anterolateral Incision */}
            <line x1="390" y1="25" x2="390" y2="55" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
            <text x="390" y="20" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isAr ? 'الشق الوحشي الأمامي' : 'Anterolateral Incision'}
            </text>

            {/* Posteromedial Incision */}
            <line x1="160" y1="130" x2="160" y2="160" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
            <text x="140" y="125" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isAr ? 'الشق الإنسي الخلفي' : 'Posteromedial Incision'}
            </text>
          </svg>
        );

      case 'tos_anatomy':
        return (
          <svg viewBox="0 0 600 250" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* First Rib Arched Contour */}
            <path d="M 120 200 Q 300 130 500 210" stroke="#cbd5e1" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.4" />
            <text x="310" y="195" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">
              {isAr ? 'الضلع الأول (First Rib Landmark)' : 'First Rib Bone Structure'}
            </text>

            {/* Anterior Scalene Muscle */}
            <polygon points="260,30 290,30 310,160 270,160" fill="#dc2626" fillOpacity="0.6" stroke="#f87171" strokeWidth="2" />
            <text x="240" y="70" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="end">
              Scalenus Anterior M.
            </text>

            {/* Middle Scalene Muscle */}
            <polygon points="380,30 410,30 430,170 395,170" fill="#b91c1c" fillOpacity="0.5" stroke="#ef4444" strokeWidth="2" />
            <text x="440" y="70" fill="#fca5a5" fontSize="10" fontWeight="bold">
              Scalenus Medius M.
            </text>

            {/* Subclavian Artery (Runs Posterior to Ant Scalene) */}
            <path d="M 80 135 L 520 145" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
            <text x="140" y="120" fill="#f87171" fontSize="10" fontWeight="bold">Subclavian Artery</text>

            {/* Brachial Plexus Trunks */}
            <path d="M 330 60 L 480 130" stroke="#facc15" strokeWidth="10" strokeLinecap="round" strokeDasharray="6 3" />
            <text x="440" y="105" fill="#fde047" fontSize="10" fontWeight="bold">Brachial Plexus</text>

            {/* Subclavian Vein (Runs Anterior to Ant Scalene) */}
            <path d="M 80 175 L 260 170 Q 320 175 520 175" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
            <text x="140" y="200" fill="#93c5fd" fontSize="10" fontWeight="bold">Subclavian Vein (Costoclavicular Space)</text>

            {/* Compression Zone marker */}
            <circle cx="340" cy="140" r="24" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 2" />
            <text x="340" y="115" fill="#fb7185" fontSize="9" fontWeight="bold" textAnchor="middle">
              TOS Triangle Compression
            </text>
          </svg>
        );

      case 'trauma_shunt':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Transected Proximal Artery */}
            <path d="M 60 120 L 220 120" stroke="#dc2626" strokeWidth="20" strokeLinecap="round" />
            <text x="120" y="95" fill="#fca5a5" fontSize="11" fontWeight="bold">Proximal Artery</text>

            {/* Vessel Loop Proximal Control */}
            <line x1="180" y1="90" x2="180" y2="150" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
            <text x="180" y="80" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">Vessel Loop</text>

            {/* Temporary Intravascular Shunt (Argyle/Pruitt) */}
            <path d="M 190 120 L 410 120" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" />
            <ellipse cx="205" cy="120" rx="10" ry="12" fill="#38bdf8" />
            <ellipse cx="395" cy="120" rx="10" ry="12" fill="#38bdf8" />
            <text x="300" y="100" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              {isAr ? 'تحويلة شريانية مؤقتة (Temporary Intravascular Shunt)' : 'Pruitt / Argyle Temporary Shunt'}
            </text>

            {/* Vessel Loop Distal Control */}
            <line x1="420" y1="90" x2="420" y2="150" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
            <text x="420" y="80" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">Vessel Loop</text>

            {/* Transected Distal Artery */}
            <path d="M 380 120 L 540 120" stroke="#dc2626" strokeWidth="20" strokeLinecap="round" />
            <text x="480" y="95" fill="#fca5a5" fontSize="11" fontWeight="bold">Distal Runoff</text>

            {/* Blood Flow Arrows */}
            <path d="M 270 140 L 330 140 M 315 133 L 330 140 L 315 147" stroke="#38bdf8" strokeWidth="3" fill="none" />
            <text x="300" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle">
              {isAr ? 'استعادة التروية السريعة قبل تثبيت العظام' : 'Pulsatile Distal Flow Restored'}
            </text>
          </svg>
        );

      case 'renal_stenosis':
        return (
          <svg viewBox="0 0 600 250" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Abdominal Aorta */}
            <path d="M 300 30 L 300 220" stroke="#dc2626" strokeWidth="28" strokeLinecap="round" />
            <text x="300" y="24" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">Aorta</text>

            {/* Right Renal Artery (Ostial Atherosclerosis) */}
            <path d="M 120 100 L 286 100" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
            {/* Ostial Plaque */}
            <ellipse cx="282" cy="100" rx="10" ry="12" fill="#ca8a04" stroke="#eab308" strokeWidth="2" />
            <text x="180" y="85" fill="#fde047" fontSize="10" fontWeight="bold">
              {isAr ? 'تضيق عصيدي فوهي (Ostial Atherosclerosis)' : 'Atherosclerotic Ostial Plaque'}
            </text>
            <text x="90" y="105" fill="#cbd5e1" fontSize="10">Right Kidney</text>

            {/* Left Renal Artery (Fibromuscular Dysplasia - String of Beads) */}
            <path d="M 314 100 L 370 100" stroke="#ef4444" strokeWidth="14" />
            {/* Beaded FMD Segments */}
            <ellipse cx="385" cy="100" rx="9" ry="11" fill="#f43f5e" />
            <line x1="394" y1="100" x2="400" y2="100" stroke="#ef4444" strokeWidth="6" />
            <ellipse cx="409" cy="100" rx="9" ry="11" fill="#f43f5e" />
            <line x1="418" y1="100" x2="424" y2="100" stroke="#ef4444" strokeWidth="6" />
            <ellipse cx="433" cy="100" rx="9" ry="11" fill="#f43f5e" />
            <path d="M 442 100 L 480 100" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
            <text x="440" y="80" fill="#fda4af" fontSize="10" fontWeight="bold">
              {isAr ? 'عقد اللؤلؤ FMD (String of Beads)' : 'FMD: String of Beads (Mid/Distal)'}
            </text>
            <text x="510" y="105" fill="#cbd5e1" fontSize="10">Left Kidney</text>

            {/* Management Pearl */}
            <rect x="150" y="180" width="300" height="40" fill="#0f172a" stroke="#334155" rx="8" />
            <text x="300" y="205" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isAr ? 'FMD: توسيع بالبالون فقط دون دعامة | العصيدي: دعامة فوهية' : 'FMD: Plain Balloon (No Stent) | Atheroma: Ostial Stent'}
            </text>
          </svg>
        );

      case 'diabetic_foot_angiosomes':
        return (
          <svg viewBox="0 0 600 250" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Foot Lateral/Plantar Silhouette */}
            <path d="M 120 70 L 150 140 Q 180 190 270 200 L 460 200 Q 520 190 510 150 Q 480 110 390 110 L 200 90 Z" fill="#1e293b" stroke="#475569" strokeWidth="3" />

            {/* Anterior Tibial / Dorsalis Pedis Angiosome (Dorsum of foot) */}
            <path d="M 200 90 L 390 110 Q 480 110 510 150 L 430 140 Q 300 120 180 100 Z" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" />
            <text x="340" y="85" fill="#38bdf8" fontSize="11" fontWeight="bold">
              1. Anterior Tibial / Dorsalis Pedis (Dorsum)
            </text>

            {/* Medial Plantar Angiosome */}
            <path d="M 330 150 L 470 160 L 460 200 L 320 190 Z" fill="#059669" fillOpacity="0.4" stroke="#34d399" strokeWidth="2" />
            <text x="390" y="180" fill="#6ee7b7" fontSize="10" fontWeight="bold">
              2. Medial Plantar
            </text>

            {/* Lateral Plantar Angiosome */}
            <path d="M 230 160 L 330 160 L 320 190 L 220 185 Z" fill="#ca8a04" fillOpacity="0.4" stroke="#facc15" strokeWidth="2" />
            <text x="270" y="175" fill="#fde047" fontSize="10" fontWeight="bold">
              3. Lateral Plantar
            </text>

            {/* Calcaneal Angiosomes (Heel) */}
            <path d="M 150 140 Q 180 190 220 185 L 180 140 Z" fill="#be123c" fillOpacity="0.4" stroke="#fb7185" strokeWidth="2" />
            <text x="140" y="220" fill="#fda4af" fontSize="10" fontWeight="bold">
              4. Calcaneal (Heel)
            </text>

            {/* Angiosome Rule Banner */}
            <text x="330" y="30" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
              {isAr ? 'مفهوم الأنجيوسوم الوعائي: إعادة فتح الشريان المغذي لمنطقة القرحة مباشرة' : 'Direct Angiosome-Targeted Revascularization Heals Ulcers Faster'}
            </text>
          </svg>
        );

      case 'carotid_body_tumor':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Common Carotid */}
            <path d="M 100 130 L 240 130" stroke="#dc2626" strokeWidth="22" strokeLinecap="round" />
            <text x="150" y="165" fill="#fca5a5" fontSize="11" fontWeight="bold">CCA</text>

            {/* Internal Carotid Artery splayed laterally */}
            <path d="M 250 120 Q 320 50 480 60" stroke="#ef4444" strokeWidth="18" fill="none" strokeLinecap="round" />
            <text x="440" y="45" fill="#fda4af" fontSize="11" fontWeight="bold">ICA (Splayed Laterally)</text>

            {/* External Carotid Artery splayed medially */}
            <path d="M 250 140 Q 320 210 480 200" stroke="#ef4444" strokeWidth="16" fill="none" strokeLinecap="round" />
            <text x="440" y="225" fill="#fda4af" fontSize="11" fontWeight="bold">ECA (Splayed Medially)</text>

            {/* Carotid Body Tumor Mass in the crotch (Lyre Sign) */}
            <ellipse cx="320" cy="130" rx="45" ry="38" fill="#991b1b" stroke="#fbbf24" strokeWidth="3" />
            <text x="320" y="125" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              CBT Mass
            </text>
            <text x="320" y="142" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
              "Lyre Sign"
            </text>

            {/* Subadventitial Dissection Line */}
            <path d="M 265 95 Q 315 88 365 100" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 2" />
            <text x="340" y="80" fill="#38bdf8" fontSize="9" fontWeight="bold">
              {isAr ? 'مستوى التسليك تحت الغلالة البرانية (Subadventitial Plane)' : 'Subadventitial Dissection Plane'}
            </text>
          </svg>
        );

      case 'pseudoaneurysm_repair':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Native Femoral Artery */}
            <path d="M 60 180 L 540 180" stroke="#dc2626" strokeWidth="22" strokeLinecap="round" />
            <text x="120" y="215" fill="#fca5a5" fontSize="11" fontWeight="bold">Common Femoral Artery (CFA)</text>

            {/* Pseudoaneurysm Neck */}
            <rect x="285" y="140" width="30" height="30" fill="#b91c1c" />
            <text x="250" y="155" fill="#fbbf24" fontSize="9" fontWeight="bold">Neck</text>

            {/* Pseudoaneurysm Sac */}
            <circle cx="300" cy="85" r="55" fill="#881337" stroke="#e11d48" strokeWidth="3" />

            {/* Swirling Yin-Yang Flow in Sac */}
            <path d="M 300 30 A 55 55 0 0 1 300 140 A 27.5 27.5 0 0 1 300 85 A 27.5 27.5 0 0 0 300 30" fill="#ef4444" />
            <path d="M 300 30 A 55 55 0 0 0 300 140 A 27.5 27.5 0 0 0 300 85 A 27.5 27.5 0 0 1 300 30" fill="#2563eb" />
            <text x="300" y="90" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              "Yin-Yang" Sign
            </text>

            {/* Ultrasound Needle with Thrombin Injection */}
            <line x1="430" y1="20" x2="330" y2="70" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="330" cy="70" r="5" fill="#38bdf8" />
            <text x="440" y="35" fill="#38bdf8" fontSize="10" fontWeight="bold">
              {isAr ? 'حقن الثرومبين بالسونار (100-300 IU)' : 'US-Guided Thrombin Needle'}
            </text>
          </svg>
        );

      case 'dynamic_consultant_schema':
      default:
        return (
          <svg viewBox="0 0 600 240" className="w-full h-auto max-h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            {/* Main Inflow Vessel */}
            <path d="M 60 120 L 220 120" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />
            <text x="120" y="90" fill="#fca5a5" fontSize="11" fontWeight="bold">Proximal Inflow</text>

            {/* Proximal Vascular Control Zone */}
            <line x1="170" y1="80" x2="170" y2="160" stroke="#fbbf24" strokeWidth="5" />
            <text x="170" y="70" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">Proximal Clamp Zone</text>

            {/* Target Pathology / Surgical Reconstruction Corridor */}
            <rect x="220" y="80" width="160" height="80" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" rx="8" />
            <circle cx="300" cy="120" r="22" fill="#be123c" stroke="#e11d48" strokeWidth="2" />
            <text x="300" y="115" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isAr ? 'منطقة التدخل والترميم' : 'Operative Target'}
            </text>
            <text x="300" y="130" fill="#38bdf8" fontSize="9" textAnchor="middle">
              Reconstruction Area
            </text>

            {/* Distal Vascular Control Zone */}
            <line x1="430" y1="80" x2="430" y2="160" stroke="#fbbf24" strokeWidth="5" />
            <text x="430" y="70" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">Distal Clamp Zone</text>

            {/* Distal Outflow Vessel */}
            <path d="M 380 120 L 540 120" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" />
            <text x="460" y="90" fill="#fca5a5" fontSize="11" fontWeight="bold">Distal Runoff Outflow</text>

            {/* Consultant Principles Footer */}
            <text x="300" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">
              {isAr ? 'استشارة استشاري: تأمين التحكم القريب والبعيد + إعطاء الهيبارين قبل وضع الملاقط' : 'Consultant Rule: Proximal & Distal Control + Heparinization before Cross-Clamping'}
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
      {/* 1. Medical Diagrams Section */}
      {diagrams.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
              <ImageIcon className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'الصور والمخططات التشريحية والجراحية التوضيحية:' : 'Clinical Diagrams & Surgical Illustrations:'}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 font-mono">
              {diagrams.length} {isAr ? 'مخططات' : 'Diagrams'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {diagrams.map(diag => (
              <div
                key={diag.id}
                className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-teal-500/40 transition space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isAr ? diag.titleAr : diag.title}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {diag.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDiagram(diag)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 text-[10px] font-semibold transition cursor-pointer border border-teal-500/30"
                      title={isAr ? 'تكبير المخطط التشريحي' : 'Zoom diagram'}
                    >
                      <ZoomIn className="w-3 h-3" />
                      <span>{isAr ? 'تكبير 🔍' : 'Zoom'}</span>
                    </button>
                  </div>
                </div>

                {/* SVG Render (Clickable to enlarge) */}
                <div
                  onClick={() => setSelectedDiagram(diag)}
                  className="overflow-hidden rounded-xl bg-slate-900/60 p-1 cursor-pointer hover:ring-1 hover:ring-teal-500/50 transition"
                >
                  {renderSvgIllustration(diag.svgType)}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {isAr ? diag.captionAr : diag.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Verified Educational Video Links Section */}
      {videos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <Video className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'روابط فيديوهات العمليات الجراحية الموثقة (YouTube & EJVES):' : 'Verified Surgical Demonstration Videos:'}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-mono">
              {videos.length} {isAr ? 'فيديوهات موثقة' : 'Videos'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {videos.map(vid => (
              <a
                key={vid.id}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 transition flex flex-col justify-between space-y-2 text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                      <Play className="w-2.5 h-2.5 fill-rose-300" />
                      <span>{vid.platform}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 transition" />
                  </div>

                  <h5 className="text-xs font-bold text-slate-200 group-hover:text-white transition line-clamp-2">
                    {isAr ? vid.titleAr : vid.title}
                  </h5>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {isAr ? vid.descriptionAr : vid.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate max-w-[170px]">{vid.author}</span>
                  <span className="text-rose-400 font-semibold group-hover:underline flex items-center gap-0.5">
                    <span>{isAr ? 'مشاهدة الفيديو' : 'Watch Video'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Selected Diagram Full-Size Modal */}
      {selectedDiagram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {isAr ? selectedDiagram.titleAr : selectedDiagram.title}
                  </h3>
                  <span className="text-xs text-teal-400 font-mono">
                    {selectedDiagram.category} • {isAr ? 'مخطط تشريحي جراحي عالي الدقة' : 'High-Precision Surgical Anatomy Diagram'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDiagram(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="rounded-2xl bg-slate-950 p-2 sm:p-4 border border-slate-800 shadow-inner">
                {renderSvgIllustration(selectedDiagram.svgType)}
              </div>

              <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
                <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'الشرح التشريحي والجراحي المعتمد:' : 'Surgical & Anatomical Explanation:'}</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {isAr ? selectedDiagram.captionAr : selectedDiagram.caption}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span>{isAr ? 'تم استخراج وتوثيق المخطط وفق إرشادات ESVS' : 'Verified against ESVS Clinical Guidelines'}</span>
              <button
                type="button"
                onClick={() => setSelectedDiagram(null)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
