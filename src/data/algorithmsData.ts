export interface ClinicalAlgorithmNode {
  id: string;
  title: string;
  titleAr?: string;
  type: 'start' | 'decision' | 'action' | 'emergency';
  detail: string;
  next?: string[];
}

export interface ClinicalAlgorithm {
  id: string;
  title: string;
  titleAr: string;
  category: 'Arterial' | 'Aorta' | 'Carotid' | 'Venous' | 'Diabetic Foot';
  description: string;
  citation: string;
  nodes: ClinicalAlgorithmNode[];
}

export const CLINICAL_ALGORITHMS: ClinicalAlgorithm[] = [
  {
    id: 'ali-management-tree',
    title: 'Acute Limb Ischemia Decision Pathway',
    titleAr: 'مخطط اتخاذ القرار في إقفار الأطراف الحاد',
    category: 'Arterial',
    description: 'Evidence-based protocol for triage, anticoagulation, Doppler interrogation, and revascularization selection.',
    citation: 'ESVS 2024 ALI Guidelines & Rutherford 10th Ed.',
    nodes: [
      {
        id: 'node-1',
        title: 'Suspected ALI Presentation',
        titleAr: 'الاشتباه السريري بإقفار حاد',
        type: 'start',
        detail: 'Presence of 6 Ps (<14 days duration). Check bilateral pulses and bedside handheld Doppler.',
        next: ['node-2']
      },
      {
        id: 'node-2',
        title: 'Immediate Heparinization',
        titleAr: 'بدء الهيبارين الوريدي فوراً',
        type: 'emergency',
        detail: 'Unfractionated Heparin 5,000 IU or 80 U/kg IV bolus followed by 18 U/kg/hr infusion. Do NOT delay for imaging.',
        next: ['node-3']
      },
      {
        id: 'node-3',
        title: 'Rutherford Staging Assessment',
        titleAr: 'تقييم مرحلة رذرفورد',
        type: 'decision',
        detail: 'Evaluate motor function, sensory loss, arterial and venous Doppler signals.',
        next: ['node-class-I', 'node-class-IIa', 'node-class-IIb', 'node-class-III']
      },
      {
        id: 'node-class-I',
        title: 'Category I: Viable',
        titleAr: 'الفئة I: طرف قابل للحياة',
        type: 'action',
        detail: 'No sensory/motor deficit. Audible arterial & venous Doppler. Urgent CTA imaging -> Elective/Urgent revascularization or CDT.'
      },
      {
        id: 'node-class-IIa',
        title: 'Category IIa: Marginally Threatened',
        titleAr: 'الفئة IIa: مهدد بشكل هامشي',
        type: 'action',
        detail: 'Sensory loss toes only, motor intact. Arterial inaudible, venous audible. Expedited revascularization within 6-12 hours.'
      },
      {
        id: 'node-class-IIb',
        title: 'Category IIb: Immediately Threatened',
        titleAr: 'الفئة IIb: مهدد فوراً (عجز حركي)',
        type: 'emergency',
        detail: 'Motor weakness present (foot drop, toe paresis). Straight to Operating Room for surgical embolectomy/bypass. Avoid delay for CTA.'
      },
      {
        id: 'node-class-III',
        title: 'Category III: Irreversible',
        titleAr: 'الفئة III: تلف غير قابل للاسترداد',
        type: 'action',
        detail: 'Profound anesthesia, woody muscle rigor, silent Doppler. Primary amputation. Revascularization risks fatal myoglobinuric renal failure.'
      }
    ]
  },
  {
    id: 'aaa-repair-tree',
    title: 'Abdominal Aortic Aneurysm Management Protocol',
    titleAr: 'بروتوكول تدبير تمدد الشريان الأورطي البطني',
    category: 'Aorta',
    description: 'Screening, surveillance intervals, elective repair thresholds, and ruptured AAA triage.',
    citation: 'SVS & ESVS AAA Guidelines 2023',
    nodes: [
      {
        id: 'aaa-1',
        title: 'Ultrasound Screening / Incidental Finding',
        titleAr: 'مسح الألتراساوند أو الكشف العرضي',
        type: 'start',
        detail: 'Measure maximum outer-to-outer orthogonal diameter.',
        next: ['aaa-2']
      },
      {
        id: 'aaa-2',
        title: 'Evaluate Diameter & Symptoms',
        titleAr: 'تقييم القطر والأعراض',
        type: 'decision',
        detail: 'Is diameter >= 5.5 cm in men, >= 5.0 cm in women, rapid expansion (>1cm/yr), or symptomatic?',
        next: ['aaa-surveil', 'aaa-elect', 'aaa-rupture']
      },
      {
        id: 'aaa-surveil',
        title: 'Small Aneurysm Surveillance',
        titleAr: 'مراقبة التمدد الصغير',
        type: 'action',
        detail: '3.0 - 3.9 cm: Ultrasound every 3 years. 4.0 - 4.9 cm: Ultrasound annually. 5.0 - 5.4 cm: Ultrasound every 6 months.'
      },
      {
        id: 'aaa-elect',
        title: 'Elective Intervention Pathway',
        titleAr: 'مسار التدخل الاختياري',
        type: 'action',
        detail: 'CTA Aorta with runoff. Assess EVAR anatomy (neck length >=15mm, angulation <=60°, no severe thrombus). EVAR vs Open Surgical Repair.'
      },
      {
        id: 'aaa-rupture',
        title: 'Suspected Rupture / Hemodynamic Instability',
        titleAr: 'الاشتباه بالتمزق مع هبوط الضغط',
        type: 'emergency',
        detail: 'Enforce Permissive Hypotension (SBP 70-90 mmHg). Avoid crystalloids. Transfer to Hybrid OR for EVAR-first or Open Laparotomy.'
      }
    ]
  }
];
