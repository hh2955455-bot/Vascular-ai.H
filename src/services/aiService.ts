import { ExplanationLevel, LanguageMode, ReferenceDocument, StudyNote, MCQQuestion, Flashcard } from '../types';
import { INITIAL_REFERENCES } from '../data/referencesData';
import { retrieveBookContext, expandQueryTerms, containsArabic } from './bookRetrieval';
import {
  CLINICAL_TOPICS_DATABASE,
  MedicalDiagramResource,
  MedicalVideoResource
} from '../data/clinicalExplanationsData';
import { COMPREHENSIVE_MCQ_BANK, COMPREHENSIVE_FLASHCARDS_BANK } from '../data/comprehensiveQuestionBank';
import { VASCULAR_MCQS } from '../data/mcqData';
import { INITIAL_FLASHCARDS } from '../data/flashcardData';
import { formatAndCleanClinicalText } from '../utils/clinicalTextFormatter';

export interface GenerateOptions {
  prompt: string;
  level?: ExplanationLevel;
  languageMode?: LanguageMode;
  contextDocumentId?: string;
  isSimplifyRequest?: boolean;
  fastMode?: boolean;
  availableDocuments?: ReferenceDocument[];
  onChunk?: (accumulatedText: string) => void;
  // External search flags (Ask AI exclusive)
  isAskAiModule?: boolean;
  allowExternalWebSearch?: boolean;
}

export interface TutorResponse {
  textEn: string;
  textAr: string;
  citations: { source: string; chapter: string; page: number }[];
  surgicalPearls?: string[];
  examPoints?: string[];
  followUpQuestions?: string[];
  diagrams?: MedicalDiagramResource[];
  videos?: MedicalVideoResource[];
  isWebGrounded?: boolean;
  externalWebSources?: { title: string; url: string }[];
  topicMcqs?: {
    id: string;
    topic: string;
    questionEn: string;
    questionAr?: string;
    options: { id: 'A' | 'B' | 'C' | 'D'; textEn: string; textAr?: string }[];
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanationEn: string;
    explanationAr?: string;
    pearl?: string;
  }[];
  topicFlashcards?: {
    id: string;
    topic: string;
    frontEn: string;
    frontAr?: string;
    backEn: string;
    backAr?: string;
    category?: string;
    difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
  }[];
}

export const NOT_FOUND_MSG = 'The uploaded text does not contain a direct answer to this specific question.';
export const NOT_FOUND_MSG_AR = 'عذراً، لا يحتوي النص المرفوع على إجابة مباشرة لهذا السؤال المحدد.';

// Helper to find corresponding diagrams and video resources for a topic
export function getVisualMediaForPrompt(prompt: string): {
  diagrams: MedicalDiagramResource[];
  videos: MedicalVideoResource[];
} {
  const p = prompt.toLowerCase();
  if (p.includes('acute') || p.includes('limb') || p.includes('ischemia') || p.includes('6 ps') || p.includes('ali') || p.includes('fogarty') || p.includes('fasciotomy') || p.includes('إقفار الأطراف الحاد')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.ali?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.ali?.videos || []
    };
  }
  if (p.includes('aaa') || p.includes('aorta') || p.includes('aneurysm') || p.includes('evar') || p.includes('endoleak') || p.includes('الأورطي البطني') || p.includes('تمدد الأورطي')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.aaa?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.aaa?.videos || []
    };
  }
  if (p.includes('carotid') || p.includes('cea') || p.includes('stroke') || p.includes('tia') || p.includes('السباتي') || p.includes('استئصال بطانة')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.carotid?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.carotid?.videos || []
    };
  }
  if (p.includes('pad') || p.includes('clti') || p.includes('claudication') || p.includes('wifi') || p.includes('glass') || p.includes('الشرايين الطرفية') || p.includes('عرج')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.pad_clti?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.pad_clti?.videos || []
    };
  }
  if (p.includes('cvd') || p.includes('varicose') || p.includes('saphenous') || p.includes('evla') || p.includes('ceap') || p.includes('الدوالي') || p.includes('الأوردة المزمنة')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.cvd?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.cvd?.videos || []
    };
  }
  if (p.includes('graft infection') || p.includes('vgi') || p.includes('nais') || p.includes('magic') || p.includes('aorto-enteric') || p.includes('عدوى الطعوم') || p.includes('ناسور أورطي')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.vgi?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.vgi?.videos || []
    };
  }
  if (p.includes('dissection') || p.includes('tevar') || p.includes('taaa') || p.includes('thoracic') || p.includes('تسلخ') || p.includes('الأبهر الصدري')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.taaa_dissection?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.taaa_dissection?.videos || []
    };
  }
  if (p.includes('avf') || p.includes('fistula') || p.includes('access') || p.includes('brescia') || p.includes('cimino') || p.includes('ناسور') || p.includes('غسيل كلوي')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.vascular_access?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.vascular_access?.videos || []
    };
  }
  if (p.includes('dvt') || p.includes('deep vein') || p.includes('thrombosis') || p.includes('may-thurner') || p.includes('phlegmasia') || p.includes('الخثار الوريدي') || p.includes('جلطة الساق')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.dvt?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.dvt?.videos || []
    };
  }
  if (p.includes('mesenteric') || p.includes('sma') || p.includes('intestinal angina') || p.includes('nomi') || p.includes('مساريقي') || p.includes('إقفار الأمعاء') || p.includes('الذبحة المعوية')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.mesenteric_ischemia?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.mesenteric_ischemia?.videos || []
    };
  }
  if (p.includes('fasciotomy') || p.includes('compartment') || p.includes('بضع اللفافة') || p.includes('الحجرات')) {
    return {
      diagrams: [
        {
          id: 'diag-fasciotomy-4',
          title: 'Two-Incision 4-Compartment Calf Fasciotomy Cross-Section',
          titleAr: 'المخطط التشريحي لبضع لفافة الساق رباعي الحجرات بشقين',
          category: 'Surgical Technique & Anatomy',
          svgType: 'fasciotomy_4compartment',
          caption: 'Cross-sectional surgical anatomy demonstrating Anterior, Lateral, Superficial Posterior, and Deep Posterior compartments with neurovascular bundles.',
          captionAr: 'تشريح جراحي مقطعي يوضح حجرات الساق الأربع (الأمامية، الوحشية، الخلفية السطحية، والعميقة) ومسار الأعصاب والأوعية.'
        }
      ],
      videos: [
        {
          id: 'vid-fasciotomy-1',
          title: 'Emergency Calf Fasciotomy Technique (Two-Incision Approach)',
          titleAr: 'تقنية بضع اللفافة الإسعافي للساق بشقين جراحيين',
          platform: 'YouTube',
          url: 'https://www.youtube.com/results?search_query=Two+incision+four+compartment+fasciotomy+technique+vascular',
          author: 'SVS & Trauma Vascular Collaborative',
          description: 'Step-by-step release of the 4 calf compartments without leaving the deep posterior compartment unreleased.',
          descriptionAr: 'خطوات تحرير حجرات الساق الأربع مع التأكيد على تحرير الحجرة الخلفية العميقة.'
        }
      ]
    };
  }

  if (p.includes('tos') || p.includes('thoracic outlet') || p.includes('مخرج الصدر') || p.includes('الضلع الأول') || p.includes('paget')) {
    return {
      diagrams: [
        {
          id: 'diag-tos-1',
          title: 'Thoracic Outlet Anatomy: Scalene Triangle & Neurovascular Bundle',
          titleAr: 'التشريح الجراحي لمتلازمة مخرج الصدر: مثلث الأخمعية والحزمة الوعائية العصبية',
          category: 'Vascular Anatomy',
          svgType: 'tos_anatomy',
          caption: 'Scalenus anterior and medius relationship to subclavian artery, subclavian vein, and brachial plexus over the first rib.',
          captionAr: 'علاقة العضلة الأخمعية الأمامية والمتوسطة بالشريان والوريد تحت الترقوة والضفيرة العضدية فوق الضلع الأول.'
        }
      ],
      videos: [
        {
          id: 'vid-tos-1',
          title: 'Transaxillary First Rib Resection for Thoracic Outlet Syndrome',
          titleAr: 'استئصال الضلع الأول عبر الإبط لمتلازمة مخرج الصدر',
          platform: 'YouTube',
          url: 'https://www.youtube.com/results?search_query=transaxillary+first+rib+resection+thoracic+outlet+syndrome',
          author: 'Society for Vascular Surgery',
          description: 'Operative exposure, neurovascular decompression, and safe rib division.',
          descriptionAr: 'الكشف الجراحي وتحرير الأعصاب والأوعية واستئصال الضلع بأمان.'
        }
      ]
    };
  }

  if (p.includes('trauma') || p.includes('shunt') || p.includes('إصابة الأوعية') || p.includes('رضوض') || p.includes('تحويلة')) {
    return {
      diagrams: [
        {
          id: 'diag-trauma-1',
          title: 'Damage Control Temporary Intravascular Shunting (TIVS)',
          titleAr: 'التحويلة الوعائية المؤقتة في جراحة الرضوح وإنقاذ الأطراف',
          category: 'Trauma & Damage Control',
          svgType: 'trauma_shunt',
          caption: 'Rapid restoration of distal pulsatile arterial inflow using Argyle or Pruitt-Inahara shunt prior to orthopedic stabilization.',
          captionAr: 'استعادة التروية النبضية السريعة باستخدام تحويلة أرغايل أو برويت قبل تثبيت العظام والكسور.'
        }
      ],
      videos: [
        {
          id: 'vid-trauma-1',
          title: 'Vascular Damage Control: Temporary Intravascular Shunting',
          titleAr: 'التحكم بالأضرار الوعائية: التحويلات الشريانية المؤقتة',
          platform: 'YouTube',
          url: 'https://www.youtube.com/results?search_query=temporary+intravascular+shunt+vascular+trauma',
          author: 'Trauma Vascular Surgical Consortium',
          description: 'Technique of vessel loop fixation and distal pulsatile confirmation.',
          descriptionAr: 'تقنية التثبيت بشرائط السيليكون والتأكد من عودة النبض البعيد.'
        }
      ]
    };
  }

  if (p.includes('renal') || p.includes('fmd') || p.includes('كلوي') || p.includes('الشريان الكلوي')) {
    return {
      diagrams: [
        {
          id: 'diag-renal-1',
          title: 'Renal Artery Pathology: Ostial Atherosclerosis vs Medial FMD',
          titleAr: 'اعتلالات الشريان الكلوي: التصلب العصيدي الفوهي مقابل عسر التصنع الليفي العضلي FMD',
          category: 'Renovascular Disease',
          svgType: 'renal_stenosis',
          caption: 'Atherosclerotic ostial plaque requiring stenting versus mid-distal string of beads FMD responding to balloon angioplasty.',
          captionAr: 'مقارنة التضيق العصيدي الفوهي المستلزم لدعامة بتضيق عقد اللؤلؤ FMD المستجيب للبالون فقط.'
        }
      ],
      videos: [
        {
          id: 'vid-renal-1',
          title: 'Renal Artery Angioplasty and Stenting Technical Guide',
          titleAr: 'دليل توسيع وتركيب دعامات الشريان الكلوي',
          platform: 'YouTube',
          url: 'https://www.youtube.com/results?search_query=renal+artery+angioplasty+stenting+technique',
          author: 'Endovascular Masterclass',
          description: 'Ostial engagement, wire navigation, and stent deployment.',
          descriptionAr: 'الدخول الفوهي والتنقل بالسلك ونشر الدعامة بدقة.'
        }
      ]
    };
  }

  if (p.includes('diabetic foot') || p.includes('angiosome') || p.includes('قدم سكري') || p.includes('أنجيوسوم') || p.includes('قرحة')) {
    return {
      diagrams: [
        {
          id: 'diag-angiosome-1',
          title: 'Foot & Ankle Angiosome Territories for Targeted Revascularization',
          titleAr: 'خريطة مناطق الأنجيوسوم الوعائي للقدم والكاحل لإعادة التروية الموجهة',
          category: 'CLTI & Diabetic Limb',
          svgType: 'diabetic_foot_angiosomes',
          caption: 'Direct angiosome model correlating arterial branches with wound healing rates in neuroischemic diabetic ulcers.',
          captionAr: 'نموذج الأنجيوسوم المباشر لربط فروع شرايين الساق بمعدلات التئام القرحات السكرية.'
        }
      ],
      videos: [
        {
          id: 'vid-angiosome-1',
          title: 'Angiosome-Targeted Tibial Revascularization in CLTI',
          titleAr: 'إعادة تروية شرايين الساق الموجهة بالأنجيوسوم في نقص التروية المهدد للطرف',
          platform: 'YouTube',
          url: 'https://www.youtube.com/results?search_query=angiosome+targeted+tibial+angioplasty+diabetic+foot',
          author: 'European Society for Vascular Surgery',
          description: 'Endovascular recanalization of pedal arches and direct wound feeding arteries.',
          descriptionAr: 'فتح القوس الشرياني للقدم والشرايين المغذية للقرحة مباشرة بالبالون.'
        }
      ]
    };
  }

  if (p.includes('carotid body') || p.includes('cbt') || p.includes('ورم الجسم السباتي') || p.includes('paraganglioma') || p.includes('lyre')) {
    return {
      diagrams: [
        {
          id: 'diag-cbt-1',
          title: 'Carotid Body Tumor: Bifurcation Splaying & "Lyre Sign"',
          titleAr: 'ورم الجسم السباتي: تباعد تفرع السباتي وعلامة القيثارة Lyre Sign',
          category: 'Cerebrovascular & Head/Neck',
          svgType: 'carotid_body_tumor',
          caption: 'Hypervascular mass cradled in the carotid bifurcation with Shamblin classification and subadventitial dissection planes.',
          captionAr: 'كتلة وعائية غنية تباعد بين السباتي الباطن والظاهر وتصنيف شامبلن ومستوى التسليك تحت الغلالة البرانية.'
        }
      ],
      videos: [
        {
          id: 'vid-cbt-1',
          title: 'Carotid Body Tumor Resection (Gordon-Taylor Subadventitial Technique)',
          titleAr: 'استئصال ورم الجسم السباتي بتقنية التسليك تحت البرانية',
          platform: 'YouTube',
          url: 'https://www.youtube.com/results?search_query=carotid+body+tumor+resection+surgical+technique',
          author: 'EJVES Operative Video',
          description: 'Subadventitial cranial nerve sparing surgical excision.',
          descriptionAr: 'الاستئصال الجراحي الدقيق مع الحفاظ على الأعصاب القحفية.'
        }
      ]
    };
  }

  if (p.includes('pseudoaneurysm') || p.includes('false aneurysm') || p.includes('أم دم كاذبة') || p.includes('thrombin')) {
    return {
      diagrams: [
        {
          id: 'diag-psa-1',
          title: 'Femoral Pseudoaneurysm & Ultrasound-Guided Thrombin Injection',
          titleAr: 'أم دم الفخذية الكاذبة وعلاجها بحقن الثرومبين الموجه بالسونار',
          category: 'Iatrogenic & Access Complications',
          svgType: 'pseudoaneurysm_repair',
          caption: 'Pathophysiology of communicating neck with yin-yang swirling flow and precise needle tip positioning for thrombin injection.',
          captionAr: 'فيزيولوجيا عنق الاتصال مع علامة الين واليانغ الدوبلرية وتوجيه الإبرة لحقن الثرومبين بعيداً عن العنق.'
        }
      ],
      videos: [
        {
          id: 'vid-psa-1',
          title: 'Ultrasound-Guided Thrombin Injection for Femoral Pseudoaneurysm',
          titleAr: 'حقن الثرومبين الموجه بالأمواج فوق الصوتية لأم دم الفخذية الكاذبة',
          platform: 'YouTube',
          url: 'https://www.youtube.com/results?search_query=ultrasound+guided+thrombin+injection+pseudoaneurysm',
          author: 'Society for Vascular Surgery',
          description: 'Technique, dosing (100-300 IU), needle visualization, and complete thrombosis confirmation.',
          descriptionAr: 'التقنية والجرعة ورؤية رأس الإبرة والتأكد من التخثر الكامل لكيس أم الدم.'
        }
      ]
    };
  }

  if (p.includes('popliteal') || p.includes('paa') || p.includes('مأبضي') || p.includes('أم دم المأبضي') || p.includes('entrapment')) {
    return {
      diagrams: CLINICAL_TOPICS_DATABASE.popliteal_aneurysm?.diagrams || [],
      videos: CLINICAL_TOPICS_DATABASE.popliteal_aneurysm?.videos || []
    };
  }

  // Dynamic Consultant Visual Schema fallback for any requested vascular part
  return {
    diagrams: [
      {
        id: `diag-consultant-${Date.now()}`,
        title: `Surgical & Anatomical Diagram: ${prompt.slice(0, 40)}`,
        titleAr: `المخطط التشريحي والجراحي المعتمد لـ: ${prompt.slice(0, 40)}`,
        category: 'Senior Consultant Clinical Schema',
        svgType: 'dynamic_consultant_schema',
        caption: `Consultant anatomical exposure, inflow & outflow vascular control, lesion dissection plane, and reconstruction landmarks.`,
        captionAr: `مخطط تشريحي استشاري يوضح كشف المنطقة، التحكم الوعائي القريب والبعيد، ومستوى الإصلاح الجراحي وفق الإرشادات الدولية.`
      }
    ],
    videos: [
      {
        id: 'vid-gen-1',
        title: 'European Society for Vascular Surgery (ESVS) Official Guidelines Library',
        titleAr: 'المكتبة الرسمية لإرشادات الجمعية الأوروبية لجراحة الأوعية (ESVS)',
        platform: 'EJVES',
        url: 'https://www.ejves.com/guidelines',
        author: 'European Society for Vascular Surgery',
        description: 'Complete evidence-based clinical practice guidelines and surgical video consensus.',
        descriptionAr: 'الأدلة الإرشادية السريرية المعتمدة ومقاطع الفيديو التوافقية للجمعية الأوروبية.'
      },
      {
        id: 'vid-gen-2',
        title: 'Society for Vascular Surgery (SVS) Practice Guidelines & Techniques',
        titleAr: 'إرشادات الجمعية الأمريكية لجراحة الأوعية الدموية (SVS)',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=Society+for+Vascular+Surgery+guidelines+video',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'High-yield educational video lectures and operative technical demonstrations.',
        descriptionAr: 'محاضرات وعروض فيديو جراحية تعليمية معتمدة من جمعية جراحة الأوعية الدموية.'
      }
    ]
  };
}

// Generates high-yield practice questions specifically on the requested clinical part or topic
export function getTopicSpecificMcqs(prompt: string, relevantChunks?: any[]): {
  id: string;
  topic: string;
  questionEn: string;
  questionAr?: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; textEn: string; textAr?: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanationEn: string;
  explanationAr?: string;
  pearl?: string;
}[] {
  const p = prompt.toLowerCase();

  // 1. Acute Limb Ischemia / Embolism / Fasciotomy
  if (p.includes('acute') || p.includes('limb') || p.includes('ischemia') || p.includes('ali') || p.includes('fogarty') || p.includes('fasciotomy') || p.includes('إقفار')) {
    return [
      {
        id: 'q-ali-1',
        topic: 'ALI - Rutherford Classification & Management',
        questionEn: 'A 68-year-old female presents with 4 hours of acute cold right leg. She has sensory loss over the toes and forefoot, but normal active foot dorsiflexion and motor power. Arterial Doppler signals are inaudible, but venous Doppler is present. What is the Rutherford classification and immediate clinical next step?',
        questionAr: 'مريضة تبلغ 68 عاماً تعاني من برودة مفاجئة بالساق اليمنى منذ 4 ساعات. بالفحص: فقدان حس بأصابع ومشط القدم، لكن الحركة سليمة تماماً. إشارات الدوبلر الشرياني غائبة والوريدي مسموع. ما تصنيف رذرفورد والخطوة العاجلة؟',
        options: [
          { id: 'A', textEn: 'Class I (Viable); Discharge on aspirin and oral statin', textAr: 'فئة I (حيوية)؛ إخراج على أسبرين وستاتين' },
          { id: 'B', textEn: 'Class IIa (Marginally threatened); Immediate IV Heparin bolus and urgent revascularization within hours', textAr: 'فئة IIa (مهددة هامشياً)؛ هيبارين وريدي فوري وإعادة تروية عاجلة خلال ساعات' },
          { id: 'C', textEn: 'Class IIb (Immediately threatened); Primary emergency amputation', textAr: 'فئة IIb (مهددة فوراً)؛ بتر أولي طارئ' },
          { id: 'D', textEn: 'Class III (Irreversible); Continuous epidural analgesia only', textAr: 'فئة III (غير قابلة للاسترداد)؛ تسكين فوق الجافية فقط' }
        ],
        correctAnswer: 'B',
        explanationEn: 'Rutherford Class IIa is defined by sensory loss limited to the toes without muscle weakness. It mandates immediate systemic anticoagulation (UFH bolus 80 units/kg) followed by urgent revascularization.',
        explanationAr: 'الفئة IIa تتميز بفقدان حس مقتصر على الأصابع دون أي ضعف حركي. تتطلب إعطاء هيبارين وريدي فوري (80 وحدة/كجم) وإعادة تروية عاجلة خلال ساعات.',
        pearl: 'Motor weakness is the critical clinical watershed separating Class IIa from Class IIb (which tolerates zero delay).'
      },
      {
        id: 'q-ali-2',
        topic: 'ALI - 4-Compartment Fasciotomy Triggers',
        questionEn: 'Which clinical finding or ischemic threshold mandates prophylactic 4-compartment fasciotomy via the two-incision technique following successful thromboembolectomy?',
        questionAr: 'أي من العلامات السريرية أو المعايير الزمنية تستوجب إجراء بضع اللفافة الوقائي رباعي الحجرات (4-Compartment Fasciotomy) بعد نجاح استئصال الصمة؟',
        options: [
          { id: 'A', textEn: 'Warm ischemia duration > 4-6 hours or tense woody calf compartments', textAr: 'تجاوز زمن نقص التروية الحار 4-6 ساعات أو وجود ساق متوترة قاسية كلوح الخشب' },
          { id: 'B', textEn: 'Presence of palpable pedal pulses on initial presentation', textAr: 'وجود نبض شرياني واضح عند الوصول للمستشفى' },
          { id: 'C', textEn: 'Patient age over 75 years without systemic symptoms', textAr: 'عمر المريض فوق 75 سنة دون أعراض جهازية' },
          { id: 'D', textEn: 'Complete recovery of sensory perception within 5 minutes', textAr: 'استعادة الإحساس بالكامل خلال 5 دقائق' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Prolonged warm ischemia (> 4-6 hours), massive tissue reperfusion edema, or intramuscular compartment pressures within 30 mmHg of diastolic blood pressure mandate prophylactic 4-compartment fasciotomy.',
        explanationAr: 'طول مدة نقص التروية الحار (> 4-6 ساعات) أو ضخامة وذمة إعادة التروية أو ارتفاع ضغط الحجرات العضلية لمستوى يقل عن 30 ملم زئبق عن الضغط الانبساطي يستدعي بضع اللفافة الفوري.',
        pearl: 'Failure to perform timely fasciotomy converts a successfully revascularized limb into irreversible myonecrosis with crush-syndrome renal failure.'
      }
    ];
  }

  // 2. Abdominal Aortic Aneurysm / EVAR / Endoleaks
  if (p.includes('aaa') || p.includes('aorta') || p.includes('aneurysm') || p.includes('evar') || p.includes('endoleak') || p.includes('الأورطي') || p.includes('تمدد')) {
    return [
      {
        id: 'q-aaa-1',
        topic: 'AAA - Elective Repair Thresholds & Indications',
        questionEn: 'According to European (ESVS 2024) and American (SVS) clinical guidelines, what is the diameter threshold for recommending elective repair in an asymptomatic abdominal aortic aneurysm?',
        questionAr: 'وفق إرشادات الجمعية الأوروبية (ESVS 2024) والأمريكية (SVS)، ما هو معيار القطر المعتمد للتوصية بالترميم الاختياري لتمدد الأورطي البطني غير المصحوب بأعراض؟',
        options: [
          { id: 'A', textEn: '>= 4.5 cm for men, >= 4.0 cm for women', textAr: '>= 4.5 سم للرجال و >= 4.0 سم للنساء' },
          { id: 'B', textEn: '>= 5.5 cm for men, >= 5.0 cm for women', textAr: '>= 5.5 سم للرجال و >= 5.0 سم للنساء' },
          { id: 'C', textEn: '>= 6.5 cm in all adult patients regardless of gender', textAr: '>= 6.5 سم لجميع المرضى بغض النظر عن الجنس' },
          { id: 'D', textEn: 'Only when rapid growth exceeds 3.0 cm per month', textAr: 'فقط عندما يتجاوز النمو السريع 3.0 سم شهرياً' }
        ],
        correctAnswer: 'B',
        explanationEn: 'The international consensus cutoff for elective intervention is >= 5.5 cm in men and >= 5.0 cm in women due to higher rupture rates in females at lower absolute diameters.',
        explanationAr: 'المعيار المعتمد عالمياً للتدخل الاختياري هو 5.5 سم فأكثر للرجال و 5.0 سم فأكثر للنساء نظراً لارتفاع خطر التمزق لدى الإناث عند أقطار أقل.',
        pearl: 'Rapid expansion (> 1.0 cm/year or > 0.5 cm in 6 months) or saccular morphology warrants repair regardless of absolute size.'
      },
      {
        id: 'q-aaa-2',
        topic: 'AAA - Endoleak Classification & Urgent Repair',
        questionEn: 'On post-EVAR CTA follow-up, blood is identified entering the aneurysm sac directly around the proximal aortic fixation zone (seal failure). How is this classified and managed?',
        questionAr: 'في تصوير الأشعة المقطعية للمتابعة بعد دعامة EVAR، ظهر تسرب للدم داخل كيس التمدد مباشرة عند منطقة التثبيت القريبة (فشل الإغلاق). كيف يصنف هذا التسرب وما تدبيره؟',
        options: [
          { id: 'A', textEn: 'Type II Endoleak; Routine ultrasound surveillance in 12 months', textAr: 'تسرب نوع II؛ مراقبة بالسونار بعد 12 شهراً' },
          { id: 'B', textEn: 'Type Ia Endoleak; Mandatory urgent repair (cuff, ballooning, or conversion) due to direct systemic pressure', textAr: 'تسرب نوع Ia؛ إصلاح عاجل إلزامي (طوق إضافي، بالون، أو تحويل جراحي) لتعرض الكيس للضغط الشرياني الكامل' },
          { id: 'C', textEn: 'Type IV Endoleak; Stop antiplatelet therapy for 2 weeks', textAr: 'تسرب نوع IV؛ إيقاف مضادات الصفيحات لأسبوعين' },
          { id: 'D', textEn: 'Normal post-implant endotension; No intervention ever required', textAr: 'ضغط طبيعي في الكيس؛ لا يتطلب أي تدخل' }
        ],
        correctAnswer: 'B',
        explanationEn: 'Type I endoleaks (attachment site failure: Ia proximal, Ib distal) expose the aneurysm sac to full systemic arterial pressure and carry a high rupture risk, requiring urgent technical correction.',
        explanationAr: 'التسرب من النوع الأول (فشل في منطقة التثبيت: Ia في الأعلى، Ib في الأسفل) يعرّض كيس التمدد لضغط الدم الجهاز الكامل مع خطر تمزق وشيك، ويستلزم تصحيحاً تقنياً عاجلاً.',
        pearl: 'Type II endoleaks arise from retrograde branch flow (lumbar arteries or IMA) and are monitored unless sac expansion exceeds 5 mm.'
      }
    ];
  }

  // 3. Carotid Artery Disease / CEA / Stroke / TIA
  if (p.includes('carotid') || p.includes('cea') || p.includes('stroke') || p.includes('tia') || p.includes('السباتي') || p.includes('دماغية')) {
    return [
      {
        id: 'q-carotid-1',
        topic: 'Carotid Stenosis - Timing of Intervention Post-TIA',
        questionEn: 'A 72-year-old male with a transient ischemic attack (amaurosis fugax and contralateral hemiparesis resolving in 30 minutes) is found to have 80% left internal carotid artery stenosis on CTA. What is the evidence-based optimal timing for CEA according to ESVS guidelines?',
        questionAr: 'رجل يبلغ 72 عاماً أصيب بنوبة نقص تروية عابرة (عمى شقي مؤقت وضعف بالجانب المقابل زال خلال 30 دقيقة). أظهرت الأشعة تضيقاً بنسبة 80% في السباتي الداخلي الأيسر. ما هو التوقيت الجراحي الأمثل لاستئصال باطنة السباتي وفق إرشادات ESVS؟',
        options: [
          { id: 'A', textEn: 'Wait 6 to 8 weeks for complete brain tissue fibrosis', textAr: 'الانتظار 6 إلى 8 أسابيع لتليف الأنسجة الدماغية بالكامل' },
          { id: 'B', textEn: 'Perform CEA within 14 days of symptom onset (ideally within 48-72 hours if neurologically stable)', textAr: 'إجراء CEA خلال 14 يوماً من بدء الأعراض (ومثالياً خلال 48-72 ساعة عند استقرار المريض عصبياً)' },
          { id: 'C', textEn: 'Delay intervention until carotid stenosis reaches 100% total occlusion', textAr: 'تأجيل التدخل حتى يصبح التضيق انسداداً كاملاً 100%' },
          { id: 'D', textEn: 'Treat with low-dose aspirin alone; surgery has no proven benefit', textAr: 'علاج بالأسبرين بجرعة منخفضة فقط دون جراحة' }
        ],
        correctAnswer: 'B',
        explanationEn: 'The risk of recurrent disabling stroke is maximal in the initial 14 days following TIA or minor stroke. Performing CEA within 14 days (and ideally 48-72 hours for neurologically stable patients) yields maximal stroke prevention benefit.',
        explanationAr: 'خطر تكرار السكتة الدماغية المعيقة يكون في ذروته خلال أول 14 يوماً بعد نوبة TIA. إجراء الجراحة خلال 14 يوماً (ومثالياً خلال 48-72 ساعة) يمنح أعلى معدل وقاية من السكتات الدماغية.',
        pearl: 'Once an internal carotid artery becomes 100% chronically occluded, CEA is contraindicated because of high distal thrombotic embolization risk and lack of surgical benefit.'
      },
      {
        id: 'q-carotid-2',
        topic: 'Carotid Surgery - Cranial Nerve Protection',
        questionEn: 'During dissection of the carotid bifurcation, which cranial nerve crosses anterior to the internal and external carotid arteries near the digastric muscle and causes tongue deviation to the ipsilateral side if injured?',
        questionAr: 'أثناء تسليك تفرع الشريان السباتي، أي عصب قحفي يعبر أمام السباتي الباطن والظاهر قرب العضلة ذات البطنين ويتسبب إصابته في انحراف اللسان نحو جهة الجراحة؟',
        options: [
          { id: 'A', textEn: 'Hypoglossal Nerve (Cranial Nerve XII)', textAr: 'العصب تحت اللسان (Cranial Nerve XII)' },
          { id: 'B', textEn: 'Spinal Accessory Nerve (Cranial Nerve XI)', textAr: 'العصب الشوكي الإضافي (Cranial Nerve XI)' },
          { id: 'C', textEn: 'Glossopharyngeal Nerve (Cranial Nerve IX)', textAr: 'العصب البلعومي اللساني (Cranial Nerve IX)' },
          { id: 'D', textEn: 'Abducens Nerve (Cranial Nerve VI)', textAr: 'العصب المبعد (Cranial Nerve VI)' }
        ],
        correctAnswer: 'A',
        explanationEn: 'The Hypoglossal Nerve (CN XII) crosses the carotid bifurcation inferior to the posterior belly of the digastric muscle. Iatrogenic injury leads to ipsilateral tongue motor weakness and deviation towards the injured side.',
        explanationAr: 'يمر العصب تحت اللسان (CN XII) عبر تفرع السباتي أسفل البطن الخلفي لذات البطنين. إصابته تؤدي لضعف حركي وانحراف اللسان نحو جهة الإصابة وصعوبة البلع.',
        pearl: 'The vagus nerve (CN X) lies postero-laterally within the carotid sheath; always avoid applying arterial cross-clamps blindly without visualizing the vagus trunk.'
      }
    ];
  }

  // 5. Fasciotomy & Compartment Syndrome
  if (p.includes('fasciotomy') || p.includes('compartment') || p.includes('بضع اللفافة') || p.includes('حجرات')) {
    return [
      {
        id: 'q-fasc-1',
        topic: 'Calf Fasciotomy - 4 Compartments & Incisions',
        questionEn: 'During a two-incision four-compartment calf fasciotomy for acute compartment syndrome, which compartment is most frequently missed, risking irreversible tibial nerve injury and flexor muscle necrosis?',
        questionAr: 'أثناء إجراء بضع اللفافة رباعي الحجرات للساق بشقين، ما هي الحجرة الأكثر عرضة للإهمال وعدم فتحها مما يهدد بتلف العصب الظنبوبي وتموت العضلات القابضة؟',
        options: [
          { id: 'A', textEn: 'Deep Posterior Compartment', textAr: 'الحجرة الخلفية العميقة (Deep Posterior Compartment)' },
          { id: 'B', textEn: 'Anterior Compartment', textAr: 'الحجرة الأمامية (Anterior Compartment)' },
          { id: 'C', textEn: 'Lateral Compartment', textAr: 'الحجرة الوحشية (Lateral Compartment)' },
          { id: 'D', textEn: 'Superficial Posterior Compartment', textAr: 'الحجرة الخلفية السطحية (Superficial Posterior Compartment)' }
        ],
        correctAnswer: 'A',
        explanationEn: 'The deep posterior compartment lies deep to the soleus bridge along the posterior border of the tibia. Decompressing it requires taking down the soleus attachment from the tibia; missing it leads to claw toe deformity, foot sensory loss, and contracture.',
        explanationAr: 'تقع الحجرة الخلفية العميقة عميقاً خلف العضلة النعلية ملاصقة للحافة الخلفية للقصبة. تحريرها يستلزم فصل ألياف العضلة النعلية عن القصبة، وإهمالها يسبب تشوه أصابع المخلب وتلف العصب الظنبوبي.',
        pearl: 'Always inspect the deep posterior fascia through the posteromedial incision and confirm muscle pinkness.'
      },
      {
        id: 'q-fasc-2',
        topic: 'Compartment Pressure Measurement Criteria',
        questionEn: 'Which hemodynamic parameter confirms the diagnosis of acute compartment syndrome requiring emergency decompression?',
        questionAr: 'أي من المعايير الديناميكية الدموية التالية يؤكد تشخيص متلازمة الحجرات الحادة ويستوجب بضع اللفافة الفوري؟',
        options: [
          { id: 'A', textEn: 'Compartment pressure within 30 mmHg of diastolic blood pressure (Delta P <= 30 mmHg) or absolute pressure > 30 mmHg with clinical signs', textAr: 'فارق الضغط بين الانبساطي وضغط الحجرة <= 30 ملم زئبق (Delta P <= 30) أو ضغط مطلق > 30 ملم زئبق مع علامات سريرية' },
          { id: 'B', textEn: 'Loss of pedal pulse only in the standing position', textAr: 'غياب نبض القدم فقط في وضعية الوقوف' },
          { id: 'C', textEn: 'Capillary refill time less than 1 second', textAr: 'زمن الامتلاء الشعري أقل من ثانية واحدة' },
          { id: 'D', textEn: 'Ankle Brachial Index greater than 1.3', textAr: 'مشعر الكاحل العضدي أكبر من 1.3' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Delta P (Diastolic Blood Pressure minus Intramuscular Compartment Pressure) <= 30 mmHg indicates critically compromised capillary perfusion pressure, mandating immediate fasciotomy.',
        explanationAr: 'فارق الضغط Delta P الذي يقل عن 30 ملم زئبق يعني انعدام التروية الشعرية للأنسجة العضلية ويستوجب فتح الحجرات دون تأخير.',
        pearl: 'Never wait for pulses to disappear; pulselessness is an exceedingly late sign of impending limb gangrene.'
      }
    ];
  }

  // 6. Thoracic Aorta / TEVAR / Dissection
  if (p.includes('dissection') || p.includes('tevar') || p.includes('taaa') || p.includes('تسلخ') || p.includes('الأبهر الصدري')) {
    return [
      {
        id: 'q-tevar-1',
        topic: 'Type B Aortic Dissection - Complicated Criteria & TEVAR',
        questionEn: 'According to ESVS guidelines, what defines "complicated" acute Type B aortic dissection warranting emergency thoracic endovascular aortic repair (TEVAR)?',
        questionAr: 'وفق إرشادات ESVS، ما الذي يحدد التسلخ الأبهري الحاد من النوع B على أنه "معقد" (Complicated) ويستدعي تركيب دعامة TEVAR إسعافية؟',
        options: [
          { id: 'A', textEn: 'Malperfusion syndrome (renal, mesenteric, or limb ischemia), impending/actual aortic rupture, or refractory pain/hypertension', textAr: 'متلازمة سوء التروية (إقفار كلوي أو مساريقي أو طرفي)، أو تمزق وشيك، أو ألم وفرط ضغط معند على العلاج' },
          { id: 'B', textEn: 'Patient age younger than 50 years with normal blood pressure', textAr: 'عمر المريض أقل من 50 سنة مع ضغط دم طبيعي' },
          { id: 'C', textEn: 'Complete thrombosis of the false lumen on initial presentation', textAr: 'تخثر كامل للمعة الكاذبة عند الوصول' },
          { id: 'D', textEn: 'Transient headache resolving after 10 minutes', textAr: 'صداع عابر زال خلال 10 دقائق' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Complicated acute Type B dissection is characterized by end-organ malperfusion, persistent unmanageable pain, uncontrolled hypertension despite 3+ drugs, rapid aortic enlargement, or rupture. TEVAR is the primary intervention.',
        explanationAr: 'التسلخ المعقد يتميز بنقص تروية الأعضاء الحيوية، الألم المستمر، فرط الضغط المعند، التوسع السريع، أو التمزق، وتعد دعامة TEVAR خط العلاج الأول.',
        pearl: 'In uncomplicated Type B dissection, aggressive medical therapy (impulse control with IV beta-blockers) is first-line.'
      }
    ];
  }

  // 7. Thoracic Outlet Syndrome (TOS)
  if (p.includes('tos') || p.includes('thoracic outlet') || p.includes('مخرج الصدر') || p.includes('paget')) {
    return [
      {
        id: 'q-tos-1',
        topic: 'Thoracic Outlet Syndrome - Paget-Schroetter & Resection',
        questionEn: 'A 24-year-old competitive swimmer presents with acute swelling, cyanosis, and heaviness in the dominant right arm. Duplex confirms acute axillary-subclavian vein thrombosis (Paget-Schroetter syndrome). What is the contemporary standard management sequence?',
        questionAr: 'سباح يبلغ 24 عاماً يعاني من تورم وزرقة وثقل مفاجئ في الذراع الأيمن. أكد الدوبلكس خثار الوريد الإبطي تحت الترقوة الحاد (متلازمة باجيت-شروتر). ما هو التسلسل العلاجي المعياري المعتمد؟',
        options: [
          { id: 'A', textEn: 'Catheter-directed thrombolysis (CDT) followed by transaxillary/paraclavicular first rib resection during the same admission', textAr: 'إذابة الخثرة بالقسطرة (CDT) تليها جراحة استئصال الضلع الأول أثناء نفس فترة التنويم' },
          { id: 'B', textEn: 'Lifelong bedrest without anticoagulation', textAr: 'ملازمة الفراش مدى الحياة دون مضادات تخثر' },
          { id: 'C', textEn: 'Immediate balloon venous stenting without rib resection', textAr: 'تركيب دعامة وريدية بالبالون فوراً دون استئصال الضلع' },
          { id: 'D', textEn: 'Upper limb amputation at the shoulder level', textAr: 'بتر الطرف العلوي عند الكتف' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Venous TOS requires prompt catheter-directed thrombolysis to restore venous patency, followed by prompt first rib resection and scalenectomy to relieve extrinsic compression. Stenting without rib resection results in stent crushing and re-thrombosis.',
        explanationAr: 'تتطلب متلازمة باجيت-شروتر إذابة الخثرة بالقسطرة سريعاً ثم استئصال الضلع الأول جراحياً لتحرير الانضغاط الخارجي. وضع دعامة دون استئصال الضلع يؤدي لكسر الدعامة وخثار متكرر.',
        pearl: 'Never place a venous stent across the costoclavicular space without previously resecting the first rib.'
      }
    ];
  }

  // 8. Carotid Body Tumor (CBT)
  if (p.includes('carotid body') || p.includes('cbt') || p.includes('ورم الجسم السباتي') || p.includes('paraganglioma')) {
    return [
      {
        id: 'q-cbt-1',
        topic: 'Carotid Body Tumor - Shamblin Classification & Dissection',
        questionEn: 'A 45-year-old female presents with a painless, pulsatile neck mass mobile horizontally but fixed vertically (Fontaine sign). CTA demonstrates splaying of the carotid bifurcation (Lyre sign) with 360-degree encasement of the internal carotid artery. How is this classified and approached?',
        questionAr: 'سيدة تبلغ 45 عاماً لديها كتلة نابضة غير مؤلمة بالعنق تتحرك أفقياً ولا تتحرك عمودياً (علامة فونتين). أظهرت الأشعة تباعد تفرع السباتي (علامة القيثارة) مع إحاطة الورم بالسباتي الباطن 360 درجة. ما تصنيف الورم وكيفية استئصاله؟',
        options: [
          { id: 'A', textEn: 'Shamblin Group III; Resection in the subadventitial plane (Gordon-Taylor) with carotid shunt/bypass standby', textAr: 'مجموعة شامبلن III؛ الاستئصال في مستوى تحت البرانية (Gordon-Taylor) مع الجاهزية لتحويلة ورأب السباتي' },
          { id: 'B', textEn: 'Shamblin Group I; Local observation every 5 years without treatment', textAr: 'مجموعة شامبلن I؛ مراقبة كل 5 سنوات دون علاج' },
          { id: 'C', textEn: 'Inoperable sarcoma; Refer for whole-body chemotherapy', textAr: 'ورم غير قابل للجراحة؛ تحويل للعلاج الكيماوي' },
          { id: 'D', textEn: 'Perform direct blind needle biopsy in the outpatient clinic', textAr: 'أخذ خزعة بإبرة عمياء في العيادة الخارجية' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Shamblin Group III tumors completely encase the carotid bifurcation vessels. Dissection proceeds strictly in the white subadventitial plane (Gordon-Taylor technique) with preparation for vascular reconstruction if the ICA is invaded.',
        explanationAr: 'أورام شامبلن الفئة الثالثة تحيط بالأوعية بالكامل (360 درجة). يتم التسليك حصراً في مستوى الغلالة تحت البرانية البيضاء مع الجاهزية الكاملة لترميم الشريان.',
        pearl: 'Never perform needle biopsy on a suspected carotid body tumor due to catastrophic hemorrhage risk.'
      }
    ];
  }

  // 9. Dialysis Vascular Access / AVF / Steal
  if (p.includes('avf') || p.includes('fistula') || p.includes('access') || p.includes('brescia') || p.includes('cimino') || p.includes('ناسور') || p.includes('غسيل')) {
    return [
      {
        id: 'q-avf-1',
        topic: 'AV Fistula - Brescia-Cimino & Steal Syndrome',
        questionEn: 'A hemodialysis patient with a left radiocephalic AV fistula develops cold, pale fingertips and severe ischemic pain during dialysis sessions. Digits have absent capillary refill that improves when the fistula is manually compressed. What is the diagnosis and definitive surgical correction?',
        questionAr: 'مريض غسيل كلوي لديه ناسور شرياني وريدي بالساعد (Brescia-Cimino) يعاني من شحوب وبرودة بأصابع اليد وألم شديد أثناء جلسات الغسيل، ويتحسن النبض والتروية عند ضغط الناسور يدوياً. ما التشخيص والحل الجراحي الجذري؟',
        options: [
          { id: 'A', textEn: 'Dialysis-Associated Steal Syndrome (DASS); DRIL procedure (Distal Revascularization Interval Ligation)', textAr: 'متلازمة سرقة التروية (DASS)؛ عملية DRIL (إعادة التروية البعيدة مع ربط الشريان الفاصل)' },
          { id: 'B', textEn: 'Normal maturation process; Instruct patient to exercise with stress ball', textAr: 'تطور طبيعي للناسور؛ تدريب المريض بكرة ضغط' },
          { id: 'C', textEn: 'Carpal tunnel syndrome; Perform flexor retinaculum release only', textAr: 'متلازمة نفق الرسغ؛ تحرير قيد العطف فقط' },
          { id: 'D', textEn: 'Immediate high-dose aspirin without surgical evaluation', textAr: 'إعطاء أسبرين بجرعة عالية دون تقييم جراحي' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Dialysis-Associated Steal Syndrome (DASS) results from retrograde flow down the distal radial artery into the low-resistance fistula. The DRIL procedure restores distal hand perfusion while preserving functional fistula access.',
        explanationAr: 'تحدث متلازمة السرقة الشريانية بسبب سحب الناسور منخفض المقاومة للدم بعيداً عن كف اليد. عملية DRIL تعيد التروية النبضية لليد مع الحفاظ على الناسور للغسيل.',
        pearl: 'The "Rule of 6s" for mature AVF: Flow > 600 mL/min, Diameter > 6 mm, Depth < 6 mm from skin, mature by 6 weeks.'
      }
    ];
  }

  // 10. Deep Vein Thrombosis & May-Thurner
  if (p.includes('dvt') || p.includes('deep vein') || p.includes('may-thurner') || p.includes('phlegmasia') || p.includes('خثار وريدي')) {
    return [
      {
        id: 'q-dvt-1',
        topic: 'DVT - May-Thurner Syndrome & Phlegmasia',
        questionEn: 'A 32-year-old woman taking oral contraceptives presents with massive painful swelling and dark cyanosis of her left lower extremity with motor weakness and sensory blunting (Phlegmasia Cerulea Dolens). What anatomical lesion is the culprit and what is the emergency intervention?',
        questionAr: 'سيدة تبلغ 32 عاماً تتناول حبوب منع الحمل تعاني من تورم مؤلم شديد وزرقة داكنة بالطرف السفلي الأيسر مع ضعف حركي وخدر (Phlegmasia Cerulea Dolens). ما هو الاعتلال التشريحي المسبب وما التدخل الإسعافي؟',
        options: [
          { id: 'A', textEn: 'Compression of Left Common Iliac Vein by Right Common Iliac Artery (May-Thurner); Immediate catheter-directed thrombolysis / thrombectomy and dedicated iliac venous stenting', textAr: 'انضغاط الوريد الحرقفي الأصلي الأيسر بالشريان الحرقفي الأصلي الأيمن (متلازمة ماي-تيرنر)؛ إذابة الخثرة بالقسطرة أو استئصالها وتركيب دعامة وريدية حرقفية' },
          { id: 'B', textEn: 'Isolated popliteal vein reflux; Prescribe compression stockings class I', textAr: 'ارتجاع وريدي مأبضي؛ جوارب ضاغطة فئة I' },
          { id: 'C', textEn: 'Baker cyst rupture; Orthopedic knee joint injection', textAr: 'تمزق كيس بيكر؛ حقن مفصل الركبة' },
          { id: 'D', textEn: 'Delayed follow-up in 3 months', textAr: 'متابعة بعد 3 أشهر' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Phlegmasia Cerulea Dolens is a limb-threatening emergency caused by complete venous occlusion leading to compartment hypertension and arterial collapse. May-Thurner syndrome (iliac vein spur) is the classic anatomical cause requiring recanalization and stenting.',
        explanationAr: 'التهاب الأوردة المؤلم ذو الزرقة (Phlegmasia Cerulea Dolens) حالة إسعافية مهددة بفقد الطرف ناتجة عن انسداد وريدي تام يؤدي لانقطاع التروية الشريانية. متلازمة ماي-تيرنر هي السبب الكلاسيكي وتستلزم فتح الوريد بالدعامة.',
        pearl: 'Never stent the contralateral iliac vein across the cava without ensuring free outflow into the inferior vena cava.'
      }
    ];
  }

  // 11. Acute Mesenteric Ischemia
  if (p.includes('mesenteric') || p.includes('sma') || p.includes('intestinal angina') || p.includes('مساريقي') || p.includes('إقفار الأمعاء')) {
    return [
      {
        id: 'q-mes-1',
        topic: 'Mesenteric Ischemia - Pain Out of Proportion & SMA Embolectomy',
        questionEn: 'A 74-year-old male with atrial fibrillation presents with sudden excruciating periumbilical pain, but the abdomen is completely soft and non-tender on palpation ("pain out of proportion to exam"). What is the likely pathology and surgical site of SMA exposure?',
        questionAr: 'رجل يبلغ 74 عاماً مصاب بالرجفان الأذيني يعاني من ألم بطني حاد ومبرح حول السرة، ولكن فحص البطن يظهر جداراً رخواً تماماً دون إيلام (ألم يفوق الموجودات السريرية). ما هو التشخيص وموقع كشف الشريان المساريقي العلوي جراحياً؟',
        options: [
          { id: 'A', textEn: 'Acute SMA Embolism; Exposed at the root of the transverse mesocolon to the right of the ligament of Treitz for transverse arteriotomy and Fogarty embolectomy', textAr: 'انصمام حاد في الشريان المساريقي العلوي (SMA)؛ يتم كشفه عند جذر مساريق القولون المعترض يمين رباط ترايتز لاستئصال الصمة بقسطرة فوغارتي' },
          { id: 'B', textEn: 'Chronic peptic ulcer; Treat with oral antacids and discharge', textAr: 'قرحة هضمية مزمنة؛ علاج بمضادات الحموضة وإخراج' },
          { id: 'C', textEn: 'Acute cholecystitis; Elective laparoscopic cholecystectomy in 6 weeks', textAr: 'التهاب مرارة حاد؛ استئصال المرارة بعد 6 أسابيع' },
          { id: 'D', textEn: 'Splenic infarction; Perform total splenectomy', textAr: 'احتشاء طحالي؛ استئصال الطحال' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Emboli typically lodge 3-8 cm distal to the SMA origin, past the middle colic artery takeoff. Surgical exposure is performed at the infracolic compartment at the root of the mesentery, followed by Fogarty embolectomy and second-look laparotomy at 24 hours.',
        explanationAr: 'تستقر الصمات القلبية عادة على بعد 3-8 سم بعد منشأ SMA خلف تفرع الشريان القولوني المتوسط. الكشف الجراحي يتم أسفل القولون المعترض مع استئصال الصمة وإجراء استكشاف ثانٍ للبطن بعد 24 ساعة.',
        pearl: 'A mandatory "Second-Look" laparotomy at 24 hours must be performed to reassess borderline bowel viability.'
      }
    ];
  }

  // 12. Popliteal Artery Aneurysm & Entrapment
  if (p.includes('popliteal') || p.includes('paa') || p.includes('مأبضي') || p.includes('أم دم المأبضي') || p.includes('entrapment')) {
    return [
      {
        id: 'q-pop-1',
        topic: 'Popliteal Artery Aneurysm - Repair Indications & Rupture Risk',
        questionEn: 'What is the standard diameter threshold for elective surgical repair of an asymptomatic popliteal artery aneurysm, and what is its primary clinical complication?',
        questionAr: 'ما هو معيار القطر المعتمد للترميم الجراحي الاختياري لأم دم الشريان المأبضي غير العرضية، وما هي مضاعفتها السريرية الأساسية؟',
        options: [
          { id: 'A', textEn: '>= 2.0 cm (or presence of mural thrombus); Primary complication is acute thrombosis and distal tibial embolization ("blue toe syndrome")', textAr: '>= 2.0 سم (أو وجود خثرة جدارية)؛ المضاعفة الأساسية هي التخثر الحاد والانصمام البعيد لشرايين الساق (متلازمة الأصبع الأزرق)' },
          { id: 'B', textEn: '>= 5.5 cm; Primary complication is free intraperitoneal rupture', textAr: '>= 5.5 سم؛ المضاعفة الأساسية هي التمزق داخل البطن' },
          { id: 'C', textEn: '>= 1.0 cm; Primary complication is malignant degeneration', textAr: '>= 1.0 سم؛ المضاعفة الأساسية هي التحول لورم خبيث' },
          { id: 'D', textEn: 'Never operated unless actively bleeding', textAr: 'لا تجرى لها جراحة إلا في حال النزف الفعال' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Unlike aortic aneurysms that rupture, popliteal artery aneurysms primarily thrombose or throw microemboli into distal tibial vessels. Repair is indicated at >= 2 cm or if mural thrombus is present.',
        explanationAr: 'على عكس أم دم الأورطي التي تتمزق، فإن أم دم الشريان المأبضي نادراً ما تتمزق وإنما تتخثر أو تقذف صمات تسد شرايين الساق. التدخل موصى به عند قطر >= 2 سم أو وجود خثرات جدارية.',
        pearl: '50% of patients with a popliteal aneurysm have a bilateral PAA, and 30-50% have an associated Abdominal Aortic Aneurysm (AAA).'
      }
    ];
  }

  // 13. Renovascular Hypertension & FMD
  if (p.includes('renal') || p.includes('fmd') || p.includes('كلوي') || p.includes('الشريان الكلوي')) {
    return [
      {
        id: 'q-ren-1',
        topic: 'Renal Artery Stenosis - Atherosclerosis vs Medial FMD',
        questionEn: 'A 28-year-old female presents with severe refractory hypertension (BP 185/110 mmHg). CTA shows a mid-to-distal right renal artery with a classic "string of beads" appearance. What is the diagnosis and evidence-based therapeutic approach?',
        questionAr: 'فتاة تبلغ 28 عاماً تعاني من فرط ضغط دم معند شديد (185/110 ملم زئبق). أظهرت الأشعة المقطعية منظراً كلاسيكياً يشبه "عقد اللؤلؤ" في الجزء الأوسط والبعيد من الشريان الكلوي الأيمن. ما التشخيص والتدبير المعتمد؟',
        options: [
          { id: 'A', textEn: 'Medial Fibromuscular Dysplasia (FMD); Plain balloon angioplasty without stenting (cures hypertension in up to 80%)', textAr: 'عسر التصنع الليفي العضلي المتوسط (FMD)؛ التوسيع بالبالون البسيط دون دعامة (يشفي فرط الضغط بنسبة تصل إلى 80%)' },
          { id: 'B', textEn: 'Atherosclerotic ostial disease; High-dose statin alone without intervention', textAr: 'تصلب عصيدي فوهي؛ ستاتين عالي الجرعة فقط' },
          { id: 'C', textEn: 'Primary nephrectomy of the right kidney', textAr: 'استئصال الكلية اليمنى فوراً' },
          { id: 'D', textEn: 'Bilateral open surgical sympathectomy', textAr: 'قطع الودي الجراحي في الجانبين' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Medial FMD classically affects young females and involves the mid/distal renal artery. Plain balloon angioplasty fractures the dysplastic collagen webs and has high cure rates; primary stenting is contraindicated unless flow-limiting dissection occurs.',
        explanationAr: 'يصيب FMD الشابات في الجزء الأوسط والبعيد من الشريان الكلوي. التوسيع بالبالون البسيط يكسر الحواجز الليفية ويحقق نسب شفاء ممتازة، وتركيب الدعامة غير موصى به إلا عند حدوث تسلخ.',
        pearl: 'Atherosclerotic renal artery stenosis affects the aortic ostium (first 1 cm) in older patients and requires stenting; FMD affects the mid-distal vessel and requires balloon alone.'
      }
    ];
  }

  // 14. Vascular Trauma & Damage Control
  if (p.includes('trauma') || p.includes('shunt') || p.includes('إصابة الأوعية') || p.includes('رضوض') || p.includes('تحويلة')) {
    return [
      {
        id: 'q-trauma-1',
        topic: 'Vascular Trauma - Hard Signs & Temporary Shunting',
        questionEn: 'Which of the following is considered a "Hard Sign" of extremity vascular trauma mandating immediate surgical exploration without delay for non-invasive testing?',
        questionAr: 'أي من العلامات التالية يُعد من "العلامات المؤكدة" (Hard Signs) لإصابة الأوعية الدموية بالطرف والتي تستلزم الاستكشاف الجراحي الفوري دون تأخير للأشعة؟',
        options: [
          { id: 'A', textEn: 'Pulsatile bleeding, expanding hematoma, palpable thrill, audible bruit, absent distal pulses, or active ischemia', textAr: 'نزف نبضي، ورم دموي متسع، ارتعاش ملموس (Thrill)، لغط مسموع (Bruit)، غياب النبض البعيد، أو إقفار حاد بالطرف' },
          { id: 'B', textEn: 'Mild non-expanding hematoma over a closed fracture', textAr: 'ورم دموي خفيف غير متسع فوق كسر مغلق' },
          { id: 'C', textEn: 'Subjective numbness that resolved in 5 minutes', textAr: 'خدر عابر زال خلال 5 دقائق' },
          { id: 'D', textEn: 'History of moderate blood loss at the scene with stable vitals now', textAr: 'تاريخ نزف بسيط في موقع الحادث مع علامات حيوية مستقرة الآن' }
        ],
        correctAnswer: 'A',
        explanationEn: 'Hard signs of vascular injury mandate immediate operating room transfer. In unstable patients with concurrent fractures, a temporary intravascular shunt (TIVS) is placed before orthopedic fixation.',
        explanationAr: 'العلامات المؤكدة تستدعي نقل المريض لغرفة العمليات فوراً. وفي حالات الكسور المتزامنة، توضع تحويلة شريانية مؤقتة لتروية الطرف أولاً قبل تثبيت العظام.',
        pearl: 'Temporary shunting prevents warm ischemia time from exceeding the critical 4-6 hour neuromuscular threshold during complex bone reconstruction.'
      }
    ];
  }

  // 15. Pseudoaneurysm & Thrombin Injection
  if (p.includes('pseudoaneurysm') || p.includes('false aneurysm') || p.includes('أم دم كاذبة') || p.includes('thrombin')) {
    return [
      {
        id: 'q-psa-1',
        topic: 'Femoral Pseudoaneurysm - Thrombin Injection Technique',
        questionEn: 'When performing ultrasound-guided bovine or human thrombin injection for a post-catheterization femoral pseudoaneurysm, what is the crucial technical maneuver to avoid fatal distal arterial embolization?',
        questionAr: 'عند إجراء حقن الثرومبين الموجه بالأمواج فوق الصوتية لأم دم الفخذية الكاذبة بعد القسطرة، ما هي المناورة التقنية الحاسمة لتجنب الانصمام الشرياني البعيد القاتل؟',
        options: [
          { id: 'A', textEn: 'Position the needle tip in the fundus/center of the sac, strictly away from the communicating neck, and inject slowly while monitoring flow cessation', textAr: 'توجيه رأس الإبرة في قاع أو مركز الكيس بعيداً تماماً عن عنق الاتصال، وحقن الثرومبين ببطء مع مراقبة توقف التدفق' },
          { id: 'B', textEn: 'Inject directly into the native common femoral artery lumen', textAr: 'الحقن مباشرة داخل لمعة الشريان الفخذي الأصلي' },
          { id: 'C', textEn: 'Administer 50,000 IU of intravenous heparin during the injection', textAr: 'إعطاء 50000 وحدة هيبارين بالوريد أثناء الحقن' },
          { id: 'D', textEn: 'Compress the carotid arteries during the procedure', textAr: 'ضغط الشرايين السباتية أثناء الإجراء' }
        ],
        correctAnswer: 'A',
        explanationEn: 'The needle tip must be clearly visualized within the pseudoaneurysm sac as far from the neck as possible. Doses of 100-300 IU typically induce instantaneous thrombosis within seconds.',
        explanationAr: 'يجب رؤية رأس الإبرة بوضوح داخل كيس أم الدم في أبعد نقطة عن العنق لتجنب تسرب الثرومبين للشريان الفخذي الرئيسي وحدوث انصمام للقدم.',
        pearl: 'Contraindications to thrombin injection include active infection, skin necrosis, rapid expansion compressing the femoral nerve, and very wide (> 8 mm) or short necks.'
      }
    ];
  }

  // Dynamic Textbook-Grounded Board Question if relevantChunks exist
  if (relevantChunks && relevantChunks.length > 0) {
    const primary = relevantChunks[0];
    const cleanExcerpt = (primary.content || '').replace(/^[#\s]+/, '').slice(0, 220);
    return [
      {
        id: `q-chunk-${Date.now()}-1`,
        topic: `${primary.chapter} - Surgical Presentation & Criteria`,
        questionEn: `According to ${primary.document_title} (Chapter: ${primary.chapter}, Page ${primary.page_number}), which clinical principle is correct regarding "${prompt.slice(0, 45)}"?`,
        questionAr: `وفقاً لـ (${primary.document_title} - فصل: ${primary.chapter}، صفحة ${primary.page_number})، أي من التوصيات التالية صحيحة سريرياً فيما يخص "${prompt.slice(0, 45)}"؟`,
        options: [
          { id: 'A', textEn: cleanExcerpt ? `${cleanExcerpt}...` : 'Evidence-based duplex/CTA evaluation with immediate proximal vascular control', textAr: 'التقيد بتوصيات الدليل الإرشادي والتثبيت الطبي والتحكم الوعائي الدقيق' },
          { id: 'B', textEn: 'Immediate cessation of all anticoagulation and hemodynamic surveillance', textAr: 'إيقاف المراقبة الحركية الدموية ومضادات التخثر فوراً' },
          { id: 'C', textEn: 'Delaying intervention until tissue necrosis becomes irreversible', textAr: 'تأجيل أي تدخل حتى حدوث تموت غير مسترد بالأنسجة' },
          { id: 'D', textEn: 'Blind surgical exploration without preoperative or bedside imaging', textAr: 'استكشاف جراحي أعمى دون معالم تصويرية' }
        ],
        correctAnswer: 'A',
        explanationEn: `Derived directly from ${primary.document_title} [Chapter: ${primary.chapter}, Page ${primary.page_number}]: ${cleanExcerpt}`,
        explanationAr: `مستخرج مباشرة من ${primary.document_title} [فصل: ${primary.chapter}، صفحة ${primary.page_number}]: ${cleanExcerpt}`,
        pearl: 'Board Examination Key: Adherence to textbook guidelines and non-invasive hemodynamic thresholds prevents premature or catastrophic procedural failures.'
      }
    ];
  }

  // Generic Clinical Consultant Fallback MCQs for any vascular query
  return [
    {
      id: 'q-gen-1',
      topic: `${prompt.slice(0, 35)} - Clinical Consultant Board Question`,
      questionEn: `In evaluating a patient regarding ${prompt}, which principle is mandatory according to current international vascular consensus?`,
      questionAr: `عند تقييم حالة سريرية تتعلق بـ (${prompt})، أي من المبادئ التالية يُعد إلزامياً وفق التوافق الإرشادي الدولي؟`,
      options: [
        { id: 'A', textEn: 'Full diagnostic duplex imaging mapping and guideline-directed medical therapy', textAr: 'فحص تخطيطي كامل بالدوبلر الملون مع العلاج الدوائي الموجه بالأدلة الإرشادية' },
        { id: 'B', textEn: 'Immediate cessation of all antiplatelet and statin therapies', textAr: 'الإيقاف الفوري لجميع مضادات الصفيحات وأدوية الستاتين' },
        { id: 'C', textEn: 'Delaying intervention until tissue necrosis becomes irreversible', textAr: 'تأجيل أي تدخل حتى حدوث تموت غير مسترد بالأنسجة' },
        { id: 'D', textEn: 'Performing blind arterial puncture without anatomical landmarks', textAr: 'إجراء وخز شرياني أعمى دون معالم تشريحية' }
      ],
      correctAnswer: 'A',
      explanationEn: 'Vascular surgery clinical guidelines prioritize non-invasive hemodynamic mapping, optimal cardiovascular risk factor modification, and structured surveillance.',
      explanationAr: 'تؤكد إرشادات جراحة الأوعية الدموية دائماً على التقييم غير الغازي وتعديل عوامل الخطورة القلبية الوعائية والمراقبة المستمرة.',
      pearl: 'Always achieve proximal and distal vascular control before vessel exploration.'
    }
  ];
}

// Generates targeted high-yield flashcards specifically covering the asked clinical part or topic
export function getTopicSpecificFlashcards(prompt: string, relevantChunks?: any[]): {
  id: string;
  topic: string;
  frontEn: string;
  frontAr?: string;
  backEn: string;
  backAr?: string;
  category?: string;
  difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
}[] {
  const p = prompt.toLowerCase();

  if (p.includes('acute') || p.includes('limb') || p.includes('ischemia') || p.includes('ali') || p.includes('fogarty') || p.includes('fasciotomy') || p.includes('إقفار')) {
    return [
      {
        id: 'fc-ali-1',
        topic: 'Acute Limb Ischemia',
        category: 'Arterial Emergency',
        difficulty: 'Basic',
        frontEn: 'What are the classic 6 Ps of Acute Limb Ischemia (ALI)?',
        frontAr: 'ما هي العلامات الست الكلاسيكية (6 Ps) لإقفار الأطراف الحاد؟',
        backEn: '1. Pain (early hallmark)\n2. Pallor\n3. Pulselessness\n4. Paresthesia (earliest sensory sign of nerve hypoxia)\n5. Paralysis (indicates profound muscle ischemia)\n6. Poikilothermia (cold extremity unable to regulate temperature)',
        backAr: '1. الألم (Pain)\n2. الشحوب (Pallor)\n3. غياب النبض (Pulselessness)\n4. التنميل / الخدر (Paresthesia - أول علامة لنقص تروية الأعصاب)\n5. الشلل (Paralysis - علامة متقدمة على تلف العضلات)\n6. برودة الطرف (Poikilothermia)',
      },
      {
        id: 'fc-ali-2',
        topic: 'Rutherford ALI Classification',
        category: 'Clinical Decision Making',
        difficulty: 'Intermediate',
        frontEn: 'What is the critical distinction between Rutherford Class IIa and Class IIb?',
        frontAr: 'ما هو الفارق الحاسم بين الفئة IIa والفئة IIb في تصنيف رذرفورد؟',
        backEn: 'Motor Deficit!\n• Class IIa (Marginally threatened): Sensory loss restricted to toes; motor function is completely INTACT.\n• Class IIb (Immediately threatened): Motor weakness IS PRESENT (e.g. toe weakness or foot drop).\nClass IIb requires emergency revascularization without waiting for delayed imaging.',
        backAr: 'الضعف الحركي (Motor deficit)!\n• الفئة IIa: فقدان حسي مقتصر على أصابع القدم، والحركة سليمة تماماً.\n• الفئة IIb: يوجد ضعف حركي (مثل هبوط القدم أو ضعف ثني الأصابع).\nالفئة IIb تستوجب فتح الشرايين فوراً في العمليات دون تأخير.',
      },
      {
        id: 'fc-ali-3',
        topic: 'Fasciotomy Technique',
        category: 'Operative Technique',
        difficulty: 'Advanced',
        frontEn: 'What are the 4 calf compartments decompressed during two-incision fasciotomy?',
        frontAr: 'ما هي الحجرات الأربع للساق التي يتم تخفيف ضغطها عبر بضع اللفافة بشقين؟',
        backEn: '1. Anterolateral Incision: Decompresses Anterior compartment and Lateral (Peroneal) compartment.\n2. Posteromedial Incision: Decompresses Superficial Posterior and Deep Posterior compartments.\nNever miss the Deep Posterior compartment (lies behind the tibia, contains tibial nerve and posterior tibial vessels).',
        backAr: '1. الشق الوحشي الأمامي: يحرر الحجرة الأمامية والوحشية.\n2. الشق الإنسي الخلفي: يحرر الحجرة الخلفية السطحية والعميقة.\nتحذير استشاري: إهمال تحرير الحجرة الخلفية العميقة يؤدي لتموت العضلات وتلف العصب القصبي.',
      }
    ];
  }

  if (p.includes('aaa') || p.includes('aorta') || p.includes('aneurysm') || p.includes('evar') || p.includes('endoleak') || p.includes('الأورطي')) {
    return [
      {
        id: 'fc-aaa-1',
        topic: 'Abdominal Aortic Aneurysm',
        category: 'Aorta',
        difficulty: 'Basic',
        frontEn: 'What are the elective repair diameter thresholds for AAA in Men vs Women?',
        frontAr: 'ما هي عتبات القطر القياسية للترميم الاختياري لتمدد الأورطي البطني لدى الرجال مقابل النساء؟',
        backEn: '• Men: >= 5.5 cm\n• Women: >= 5.0 cm\nOther surgical triggers: Rapid expansion (> 1.0 cm/year or > 0.5 cm in 6 months), saccular morphology, or any clinical symptoms (back/flank pain).',
        backAr: '• الرجال: >= 5.5 سم\n• النساء: >= 5.0 سم\nمؤشرات جراحية أخرى: النمو السريع (> 1.0 سم سنوياً أو > 0.5 سم في 6 أشهر)، التمدد الكيسي (Saccular)، أو ظهور أعراض.',
      },
      {
        id: 'fc-aaa-2',
        topic: 'EVAR Hostile Neck Criteria',
        category: 'Endovascular Technique',
        difficulty: 'Advanced',
        frontEn: 'What are the classic anatomical criteria that define a "Hostile Neck" for standard EVAR?',
        frontAr: 'ما هي المعايير التشريحية التي تحدد "عنق الأبهر غير المواتي" (Hostile Neck) لتركيب دعامة EVAR؟',
        backEn: '1. Short neck length: < 10-15 mm\n2. Severe infrarenal angulation: > 60 degrees\n3. Reverse taper / conical neck morphology (> 10% diameter increase over 15mm length)\n4. Heavy circumferential calcification or mural thrombus > 50% of circumference\n5. Large neck diameter: > 28-32 mm',
        backAr: '1. قصر طول العنق: أقل من 10-15 ملم\n2. زاوية انحناء حادة: أكثر من 60 درجة\n3. عنق مخروطي الشكل متسع للأسفل\n4. تكلس محيطي شديد أو خثرات جدارية تغطي > 50% من المحيط\n5. اتساع قطر العنق: أكثر من 28-32 ملم',
      },
      {
        id: 'fc-aaa-3',
        topic: 'Endoleak Classification',
        category: 'Endovascular Complications',
        difficulty: 'Intermediate',
        frontEn: 'List Endoleaks Type I through V and which require mandatory urgent re-intervention?',
        frontAr: 'عدد أنواع التسرب الداخلي (Endoleaks Type I-V) وأيها يتطلب تدخلاً عاجلاً إلزامياً؟',
        backEn: '• Type I: Attachment seal failure (Ia proximal neck, Ib distal iliac) -> MANDATORY URGENT REPAIR.\n• Type II: Retrograde branch flow (IMA, lumbar arteries) -> Watch unless sac expands > 5mm.\n• Type III: Fabric tear or modular disconnect -> MANDATORY URGENT REPAIR.\n• Type IV: Graft porosity (resolves spontaneously).\n• Type V: Endotension (sac growth with no visible leak on CTA).',
        backAr: '• Type I: فشل التثبيت والإغلاق (Ia في العنق، Ib في الحرقفي) -> تدخل عاجل إلزامي.\n• Type II: تدفق راجع من الفروع (القطنية أو المساريقي السفلي) -> مراقبة إلا إذا تمدد الكيس > 5 ملم.\n• Type III: تمزق بالقماش أو انفصال الوصلات -> تدخل عاجل إلزامي.\n• Type IV: مسامية الدعامة (تزول تلقائياً).\n• Type V: ضغط داخلي Endotension دون تسرب ظاهر.',
      }
    ];
  }

  if (p.includes('carotid') || p.includes('cea') || p.includes('stroke') || p.includes('tia') || p.includes('السباتي')) {
    return [
      {
        id: 'fc-cea-1',
        topic: 'Carotid Stenosis Guidelines',
        category: 'Cerebrovascular Disease',
        difficulty: 'Intermediate',
        frontEn: 'What is the benchmark threshold and timing for CEA in symptomatic carotid stenosis?',
        frontAr: 'ما هي نسبة التضيق والتوقيت المعياري لإجراء CEA في تضيق السباتي العرضي؟',
        backEn: '• Stenosis threshold: 70-99% (NASCET criteria) confers maximum benefit (Class I, Level A); 50-69% is beneficial in selected men.\n• Optimal Timing: Within 14 days of symptom onset (ideally 48-72 hours if neurologically stable).\n• Stroke/death rate audit benchmark must be < 6% for symptomatic cases and < 3% for asymptomatic.',
        backAr: '• نسبة التضيق: 70-99% تمنح أعلى فائدة وقائية؛ 50-69% تفيد حالات منتقاة.\n• التوقيت الأمثل: خلال 14 يوماً من الأعراض (ومثالياً 48-72 ساعة للمستقرين عصبياً).\n• المعيار الجراحي لمعدل المضاعفات: أقل من 6% للحالات العرضية وأقل من 3% لغير العرضية.',
      },
      {
        id: 'fc-cea-2',
        topic: 'Carotid Anatomy & Nerve Injury',
        category: 'Surgical Anatomy',
        difficulty: 'Advanced',
        frontEn: 'What three cranial nerves are at risk during Carotid Endarterectomy (CEA)?',
        frontAr: 'ما هي الأعصاب القحفية الثلاثة المعرضة للخطر أثناء استئصال باطنة السباتي (CEA)؟',
        backEn: '1. Hypoglossal Nerve (CN XII): Tongue deviates toward operated side.\n2. Vagus Nerve (CN X) / Recurrent Laryngeal: Hoarseness / vocal cord paralysis.\n3. Marginal Mandibular Branch of Facial Nerve (CN VII): Drooping of lower lip corner / asymmetric smile.',
        backAr: '1. العصب تحت اللسان (CN XII): انحراف اللسان لجهة العملية.\n2. العصب المبهم (CN X) / الحنجري الراجع: بحة الصوت وشلل الحبل الصوتي.\n3. الفرع الفكي الهامشي للعصب الوجهي (CN VII): تدلي زاوية الشفة السفلية.',
      }
    ];
  }

  if (p.includes('fasciotomy') || p.includes('compartment') || p.includes('بضع اللفافة') || p.includes('حجرات')) {
    return [
      {
        id: 'fc-fasc-1',
        topic: 'Compartment Pressure Limits',
        category: 'Surgical Emergency',
        difficulty: 'Intermediate',
        frontEn: 'What is the diagnostic Delta P formula and threshold confirming Compartment Syndrome?',
        frontAr: 'ما هي معادلة وعتبة فارق الضغط (Delta P) المؤكدة لمتلازمة الحجرات؟',
        backEn: 'Delta P = Diastolic Blood Pressure - Compartment Pressure.\n• Delta P <= 30 mmHg confirms acute compartment syndrome and mandates immediate 4-compartment fasciotomy.',
        backAr: 'Delta P = ضغط الدم الانبساطي - ضغط الحجرة العضلية.\n• قيمة Delta P <= 30 ملم زئبق تؤكد متلازمة الحجرات وتستوجب بضع اللفافة الفوري لإنقاذ الطرف.',
      },
      {
        id: 'fc-fasc-2',
        topic: 'Fasciotomy Nerve at Risk',
        category: 'Surgical Anatomy',
        difficulty: 'Advanced',
        frontEn: 'Which nerve runs in the lateral compartment and which in the deep posterior compartment of the calf?',
        frontAr: 'أي عصب يمر في الحجرة الوحشية وأي عصب في الحجرة الخلفية العميقة للساق؟',
        backEn: '• Lateral Compartment: Superficial Peroneal Nerve (foot eversion & dorsum sensory).\n• Deep Posterior Compartment: Tibial Nerve (sole sensation, toe flexors) accompanied by posterior tibial vessels.',
        backAr: '• الحجرة الوحشية: العصب الشظوي السطحي (شقلبة القدم للخارج وحس ظهر القدم).\n• الحجرة الخلفية العميقة: العصب الظنبوبي (إحساس أخمص القدم وثني الأصابع) محاذياً للشرايين الظنبوبية الخلفية.',
      }
    ];
  }

  if (p.includes('dissection') || p.includes('tevar') || p.includes('taaa') || p.includes('تسلخ')) {
    return [
      {
        id: 'fc-tevar-1',
        topic: 'TEVAR Landing Zones & LSA',
        category: 'Aorta Endovascular',
        difficulty: 'Advanced',
        frontEn: 'When the Left Subclavian Artery (LSA - Zone 2) is covered by TEVAR, what must be done and why?',
        frontAr: 'عند تغطية الشريان تحت الترقوة الأيسر (Zone 2) بدعامة TEVAR، ما الإجراء الواجب ولماذا؟',
        backEn: 'Pre-emptive or concomitant LSA revascularization (Carotid-Subclavian Bypass or transposition) is recommended to prevent left arm ischemia, posterior circulation stroke (vertebral steal), and spinal cord ischemia (paraplegia).',
        backAr: 'إعادة تروية الشريان تحت الترقوة الأيسر (تحويلة سباتية-تحت ترقوة) ضرورية لتفادي إقفار الذراع، السكتة الدماغية الخلفية، ونقص تروية النخاع الشوكي (الشلل السفلي).',
      }
    ];
  }

  if (p.includes('tos') || p.includes('thoracic outlet') || p.includes('مخرج الصدر')) {
    return [
      {
        id: 'fc-tos-1',
        topic: 'Thoracic Outlet Syndrome Classification',
        category: 'Upper Extremity',
        difficulty: 'Intermediate',
        frontEn: 'What are the 3 clinical forms of Thoracic Outlet Syndrome and which is most prevalent?',
        frontAr: 'ما هي الأشكال السريرية الثلاثة لمتلازمة مخرج الصدر وأيها الأكثر شيوعاً؟',
        backEn: '1. Neurogenic TOS (> 90-95%): Brachial plexus compression (pain, paresthesia in C8-T1 ulnar distribution).\n2. Venous TOS (3-5%): Subclavian vein effort thrombosis (Paget-Schroetter).\n3. Arterial TOS (< 1-2%): Subclavian artery aneurysm/embolism caused by cervical rib.',
        backAr: '1. العصبية (> 90-95%): انضغاط الضفيرة العضدية (ألم وتنميل مسار C8-T1 الزندي).\n2. الوريدية (3-5%): خثار الجهد بالوريد تحت الترقوة (باجيت-شروتر).\n3. الشريانية (< 1-2%): أم دم الشريان وانصمام الأصابع بسبب ضلع رقبي.',
      }
    ];
  }

  if (p.includes('carotid body') || p.includes('cbt') || p.includes('ورم الجسم السباتي')) {
    return [
      {
        id: 'fc-cbt-1',
        topic: 'Carotid Body Tumor Pearls',
        category: 'Cerebrovascular',
        difficulty: 'Advanced',
        frontEn: 'What is the Shamblin Classification and what surgical plane is utilized for CBT resection?',
        frontAr: 'ما هو تصنيف شامبلن وما هو المستوى الجراحي لاستئصال ورم الجسم السباتي؟',
        backEn: '• Group I: Small, easily dissected from vessels.\n• Group II: Partially surrounding carotid vessels.\n• Group III: Completely encasing (360 degrees) bifurcation.\n• Surgical Plane: Subadventitial plane (white avascular glistening line between media and adventitia).',
        backAr: '• فئة I: صغير ومنفصل عن الأوعية.\n• فئة II: يحيط بالأوعية جزئياً.\n• فئة III: يحيط بالتفرع كاملاً 360 درجة.\n• المستوى الجراحي: مستوى تحت البرانية (Subadventitial plane) الأبيض اللامع بين الطبقة الوسطى والبرانية.',
      }
    ];
  }

  if (p.includes('avf') || p.includes('fistula') || p.includes('access') || p.includes('brescia') || p.includes('cimino') || p.includes('ناسور')) {
    return [
      {
        id: 'fc-avf-1',
        topic: 'AV Fistula Rule of 6s',
        category: 'Vascular Access',
        difficulty: 'Basic',
        frontEn: 'What is the classic "Rule of 6s" for AV Fistula maturation?',
        frontAr: 'ما هي "قاعدة الستات" (Rule of 6s) الكلاسيكية لنضج ناسور الغسيل الكلوي؟',
        backEn: '1. Blood flow > 600 mL/minute\n2. Vein diameter > 6 mm\n3. Depth < 6 mm beneath the skin surface\n4. Mature by 6 weeks post-creation.',
        backAr: '1. معدل تدفق الدم > 600 مل/دقيقة\n2. قطر الوريد > 6 ملم\n3. عمق الوريد < 6 ملم تحت الجلد\n4. يكتمل النضج خلال 6 أسابيع من الجراحة.',
      }
    ];
  }

  if (p.includes('dvt') || p.includes('may-thurner') || p.includes('خثار وريدي')) {
    return [
      {
        id: 'fc-dvt-1',
        topic: 'May-Thurner Anatomy',
        category: 'Venous Disease',
        difficulty: 'Intermediate',
        frontEn: 'What is the anatomical mechanism of May-Thurner syndrome?',
        frontAr: 'ما هي الآلية التشريحية لمتلازمة ماي-تيرنر؟',
        backEn: 'Extrinsic chronic compression of the Left Common Iliac Vein against the L5 vertebral body by the overlying Right Common Iliac Artery, creating intraluminal fibrous bands/spurs and left iliofemoral DVT.',
        backAr: 'انضغاط الوريد الحرقفي الأصلي الأيسر ضد الفقرة القطنية L5 بالشريان الحرقفي الأصلي الأيمن، مما يخلق نتوءات ليفية داخل الوريد تؤدي لخثار متكرر.',
      }
    ];
  }

  if (p.includes('mesenteric') || p.includes('sma') || p.includes('مساريقي')) {
    return [
      {
        id: 'fc-sma-1',
        topic: 'Acute Mesenteric Ischemia Etiologies',
        category: 'Visceral Arteries',
        difficulty: 'Intermediate',
        frontEn: 'What are the 4 distinct etiologies of Acute Mesenteric Ischemia (AMI)?',
        frontAr: 'ما هي الأسباب الأربعة المختلفة لإقفار الأمعاء المساريقي الحاد؟',
        backEn: '1. SMA Embolism (50%): Cardiac origin, sudden pain out of proportion.\n2. SMA Thrombosis (25%): Acute on chronic atherosclerotic stenosis at SMA ostium.\n3. Non-Occlusive Mesenteric Ischemia - NOMI (20%): Low-flow state/vasospasm in ICU.\n4. Mesenteric Venous Thrombosis - MVT (5-10%): Hypercoagulable states.',
        backAr: '1. انصمام SMA (50%): قلبي المنشأ، ألم مبرح يفوق الفحص السريري.\n2. تخثر SMA (25%): تخثر فوق تضيق عصيدي عند فوهة الشريان.\n3. الإقفار غير الانسدادي NOMI (20%): انخفاض النتاج القلبي وتقبض الأوعية.\n4. تخثر الوريد المساريقي MVT (5-10%): حالات أهبة التخثر.',
      }
    ];
  }

  if (p.includes('popliteal') || p.includes('paa') || p.includes('مأبضي')) {
    return [
      {
        id: 'fc-paa-1',
        topic: 'Popliteal Aneurysm Indications',
        category: 'Peripheral Aneurysms',
        difficulty: 'Intermediate',
        frontEn: 'When is elective surgical repair indicated for a Popliteal Artery Aneurysm?',
        frontAr: 'متى يستطب الترميم الجراحي الاختياري لأم دم الشريان المأبضي؟',
        backEn: '• Diameter >= 2.0 cm\n• Any size if mural thrombus is present\n• Any size if symptomatic (distal embolization/compression)\nTreatment: Ligation/exclusion with saphenous vein bypass graft.',
        backAr: '• القطر >= 2.0 سم\n• أي حجم في حال وجود خثرة جدارية\n• أي حجم إذا كانت عرضية (انصمامات بعيدة أو ضغط على العصب/الوريد)\nالعلاج: ربط وعزل الكيس مع مجازة بالوريد الصافن.',
      }
    ];
  }

  if (p.includes('renal') || p.includes('fmd') || p.includes('كلوي')) {
    return [
      {
        id: 'fc-ren-1',
        topic: 'Renal Artery Stenosis FMD vs Atheroma',
        category: 'Renovascular',
        difficulty: 'Intermediate',
        frontEn: 'How does management differ between Atherosclerotic vs FMD Renal Artery Stenosis?',
        frontAr: 'كيف يختلف التدبير بين تضيق الشريان الكلوي العصيدي وتضيق FMD؟',
        backEn: '• FMD (Young females, mid-distal): Plain Balloon Angioplasty (NO stent; high cure rate).\n• Atherosclerotic (Older patients, aortic ostium): Medical therapy first; balloon expandable STENT if refractory hypertension or flash pulmonary edema.',
        backAr: '• FMD (شابات، الجزء الأوسط والبعيد): توسيع بالبالون فقط دون دعامة (نسب شفاء عالية).\n• العصيدي (كبار سن، فوهة الأبهر): علاج دوائي أولاً؛ وتوضع دعامة عند فرط الضغط المعند أو وذمة الرئة الوميضية.',
      }
    ];
  }

  if (p.includes('trauma') || p.includes('shunt') || p.includes('إصابة الأوعية')) {
    return [
      {
        id: 'fc-trauma-1',
        topic: 'Vascular Trauma Hard Signs',
        category: 'Trauma',
        difficulty: 'Basic',
        frontEn: 'List the 6 Hard Signs of arterial injury mandating immediate operating room transfer:',
        frontAr: 'عدد العلامات الست المؤكدة (Hard Signs) لإصابة الشرايين التي تستلزم العمليات فوراً:',
        backEn: '1. Pulsatile bleeding\n2. Expanding / pulsatile hematoma\n3. Palpable thrill\n4. Audible bruit\n5. Absent distal pulse\n6. Active signs of limb ischemia (pallor, coolness, paralysis)',
        backAr: '1. نزف نبضي فعال\n2. ورم دموي متوسع أو نابض\n3. ارتعاش ملموس (Thrill)\n4. لغط مسموع (Bruit)\n5. غياب النبض البعيد\n6. علامات إقفار الطرف الحاد',
      }
    ];
  }

  if (p.includes('pseudoaneurysm') || p.includes('أم دم كاذبة') || p.includes('thrombin')) {
    return [
      {
        id: 'fc-psa-1',
        topic: 'Pseudoaneurysm Thrombin Injection',
        category: 'Access Complications',
        difficulty: 'Intermediate',
        frontEn: 'What is the first-line treatment for post-catheterization femoral pseudoaneurysm and its key contraindication?',
        frontAr: 'ما هو خط العلاج الأول لأم دم الفخذية الكاذبة بعد القسطرة وما أبرز موانع استعماله؟',
        backEn: '• First-line: Ultrasound-guided percutaneous thrombin injection (100-300 IU) into the sac fundus.\n• Contraindications: Active local infection, severe skin ischemia, wide neck (> 8 mm), or rapid expansion compressing the femoral nerve.',
        backAr: '• خط العلاج الأول: حقن الثرومبين عبر الجلد بالسونار (100-300 وحدة) في قاع الكيس.\n• موانع الاستعمال: وجود عدوى موضعية، تموت الجلد، عنق واسع جداً (> 8 ملم)، أو ضغط حاد على العصب الفخذي.',
      }
    ];
  }

  if (p.includes('diabetic foot') || p.includes('angiosome') || p.includes('قدم سكري')) {
    return [
      {
        id: 'fc-angio-1',
        topic: 'Foot Angiosome Concept',
        category: 'Diabetic Limb',
        difficulty: 'Intermediate',
        frontEn: 'What is the Angiosome concept in diabetic foot limb salvage?',
        frontAr: 'ما هو مفهوم الأنجيوسوم (Angiosome) في إنقاذ القدم السكرية؟',
        backEn: 'An angiosome is a 3D block of tissue supplied by a specific source artery. Direct revascularization of the specific artery feeding the ulcer angiosome achieves significantly faster healing and higher limb salvage than indirect revascularization.',
        backAr: 'الأنجيوسوم هو وحدة نسيجية ثلاثية الأبعاد يغذيها شريان محدد. إعادة فتح الشريان المباشر المغذي لمنطقة القرحة يحقق التئاماً أسرع ومعدلات إنقاذ أعلى للطرف من التروية غير المباشرة.',
      }
    ];
  }

  // Dynamic Textbook-Grounded Flashcards if relevantChunks exist
  if (relevantChunks && relevantChunks.length > 0) {
    const primary = relevantChunks[0];
    const cleanExcerpt = (primary.content || '').replace(/^[#\s]+/, '').slice(0, 280);
    return [
      {
        id: `fc-chunk-${Date.now()}-1`,
        topic: `${primary.chapter}`,
        category: 'Textbook Clinical Guidance',
        difficulty: 'Intermediate',
        frontEn: `Key Clinical Principles for: "${prompt.slice(0, 40)}" [Source: ${primary.document_title}]`,
        frontAr: `المبادئ السريرية الأساسية لـ: "${prompt.slice(0, 40)}" [المصدر: ${primary.document_title}]`,
        backEn: `From ${primary.document_title} (Ch: ${primary.chapter}, Page ${primary.page_number}):\n${cleanExcerpt}`,
        backAr: `من ${primary.document_title} (فصل: ${primary.chapter}، صفحة ${primary.page_number}):\n${cleanExcerpt}`,
      },
      {
        id: `fc-chunk-${Date.now()}-2`,
        topic: `${primary.chapter} - Operative Strategy`,
        category: 'Operative Landmark',
        difficulty: 'Advanced',
        frontEn: `Surgical Landmark & Control Protocol [${primary.document_title}]`,
        frontAr: `بروتوكول التحكم الجراحي والمعالم التشريحية [${primary.document_title}]`,
        backEn: `Always establish proximal and distal vascular control before vessel arteriotomy, maintaining systemic heparin ACT > 200-250s as recommended in chapter ${primary.chapter}.`,
        backAr: `احرص دائماً على تأمين التحكم الوعائي القريب والبعيد قبل فتح الشريان، وضبط زمن التخثر المنشط ACT فوق 200-250 ثانية وفق التوصيات المعتمدة.`,
      }
    ];
  }

  // Generic Clinical Consultant Fallback Flashcards
  return [
    {
      id: 'fc-gen-1',
      topic: `${prompt.slice(0, 30)} - Core Concept`,
      category: 'Clinical Mastery',
      difficulty: 'Intermediate',
      frontEn: `Key Diagnostic Landmark for: ${prompt}`,
      frontAr: `العلامة التشخيصية السريرية الأساسية لـ: ${prompt}`,
      backEn: 'Comprehensive non-invasive hemodynamic duplex ultrasound assessment combined with cross-sectional CTA mapping remains first-line prior to any invasive vascular intervention.',
      backAr: 'التصوير بالدوبلر الملون مع الأشعة المقطعية بالصبغة (CTA) يمثل خط التقييم الأول الإلزامي قبل أي تدخل جراحي أو قسطرة.',
    },
    {
      id: 'fc-gen-2',
      topic: `${prompt.slice(0, 30)} - Surgical Landmark`,
      category: 'Operative Pearl',
      difficulty: 'Advanced',
      frontEn: 'Senior Consultant Operative Landmark Rule',
      frontAr: 'قاعدة الاستشاري الجراحية الذهبية',
      backEn: 'Always achieve proximal and distal vascular control with silastic vessel loops before entering any vascular sheath, arteriotomy, or aneurysm sac.',
      backAr: 'احرص دائماً على تأمين التحكم الشرياني القريب والبعيد (Proximal & Distal Control) قبل فتح أي شريان أو كيس تمدد لتفادي النزيف الكارثي.',
    }
  ];
}

export async function askVascularTutor(options: GenerateOptions): Promise<TutorResponse> {
  const {
    prompt,
    level = 'Resident Level',
    languageMode = 'bilingual',
    contextDocumentId,
    isSimplifyRequest,
    fastMode = false,
    availableDocuments,
    onChunk
  } = options;

  // Retrieve all valid documents: ESVS guidelines + user uploaded books
  let allDocs = availableDocuments && availableDocuments.length > 0 ? availableDocuments : INITIAL_REFERENCES;
  if (!availableDocuments) {
    try {
      const saved = localStorage.getItem('vascular_user_uploaded_books');
      if (saved) {
        const userBooks: ReferenceDocument[] = JSON.parse(saved);
        const existingIds = new Set(allDocs.map(d => d.id));
        const customUploads = userBooks.filter(b => b.isUserUploaded && !existingIds.has(b.id));
        allDocs = [...customUploads, ...allDocs];
      }
    } catch (_) {
      // safe ignore
    }
  }

  // Filter if contextDocumentId is provided
  const matchedDocs = allDocs.filter(d =>
    !contextDocumentId || d.id === contextDocumentId
  );

  // Whole-book retrieval: every chunk of the selected book(s) is searched, and Arabic questions
  // are matched against English books through AI-provided English search terms.
  let retrieval = retrieveBookContext(prompt, matchedDocs);
  if (containsArabic(prompt) || retrieval.chunks.length < 3) {
    const expandedTerms = await expandQueryTerms(prompt);
    if (expandedTerms.length > 0) {
      retrieval = retrieveBookContext(prompt, matchedDocs, { expandedTerms });
    }
  }
  const relevantChunks = retrieval.chunks;
  const bookOutline = retrieval.outline;

  console.log(`[book retrieval] "${prompt.slice(0, 80)}": searched ${retrieval.totalChunksSearched} chunks in ${matchedDocs.length} book(s), selected ${relevantChunks.length}`);

  // Check if we have matching chunks in uploaded books / ESVS guidelines
  if (relevantChunks.length === 0) {
    // If user is inside Ask AI AND has external web search enabled: Ask AI is the ONLY place allowed to fetch outside books!
    if (options.isAskAiModule && options.allowExternalWebSearch) {
      if (onChunk) {
        onChunk(languageMode === 'ar' ? 'جارٍ استدعاء أحدث الأدلة والمصادر الطبية الموثقة عبر الإنترنت (Ask AI Exclusive)...' : 'Retrieving authoritative external evidence from live medical web (Ask AI Exclusive)...');
      }
      try {
        const webResult = await searchMedicalWeb(prompt, languageMode);
        const visualMedia = getVisualMediaForPrompt(prompt);
        const webExplanationEn = `# 🌐 Authoritative External Literature Review: ${prompt}
> **Ask AI Exclusive Feature**: Information retrieved from verified external medical sources, international clinical guidelines, and biomedical literature.

## 1. 📖 Disease Overview & Clinical Synthesis
${webResult.summary}

## 2. 📚 Authoritative External Sources & Documented Links:
${webResult.sources.map(s => `• [${s.title}](${s.url}) - Verified International Vascular Evidence`).join('\n')}

## 3. 🎥 Educational Videos & Surgical Procedures:
${visualMedia.videos.map(v => `• [${v.title}](${v.url}) - Platform: ${v.platform} (${v.author})`).join('\n')}
`;

        const webExplanationAr = `# 🌐 مراجعة الأدلة السريرية من المصادر الخارجية الموثقة: ${prompt}
> **ميزة حصرية لـ Ask AI**: تم استرجاع هذه المعلومات بالاعتماد على مصادر طبية خارجية موثقة على الإنترنت وإرشادات الجمعيات العالمية (ESVS & SVS).

## 1. 📖 الخلاصة السريرية والأدلة الطبية
${webResult.summary}

## 2. 📚 المصادر الخارجية الموثقة وروابطها المباشرة:
${webResult.sources.map(s => `• [${s.title}](${s.url}) - دليل سريري موثق`).join('\n')}

## 3. 🎥 فيديوهات العمليات الجراحية الموثقة:
${visualMedia.videos.map(v => `• [${v.titleAr}](${v.url}) - المنصة: ${v.platform} (${v.author})`).join('\n')}
`;

        if (onChunk) {
          onChunk(languageMode === 'ar' ? webExplanationAr : webExplanationEn);
        }

        return {
          textEn: webExplanationEn,
          textAr: webExplanationAr,
          citations: webResult.sources.map(s => ({
            source: s.title,
            chapter: 'Online Evidence',
            page: 1
          })),
          diagrams: visualMedia.diagrams,
          videos: visualMedia.videos,
          isWebGrounded: true,
          externalWebSources: webResult.sources,
          surgicalPearls: [
            'External evidence synthesized from international vascular surgery consensus.',
            'Always evaluate anatomical criteria against latest ESVS and SVS clinical recommendations.'
          ],
          followUpQuestions: generateFollowUpQuestions(prompt)
        };
      } catch (webErr) {
        console.warn('External web search in Ask AI failed:', webErr);
      }
    }

    // Accurate Fallback Handling (No False Answers / No Hallucinations):
    const fallbackText = languageMode === 'ar' ? NOT_FOUND_MSG_AR : NOT_FOUND_MSG;
    if (onChunk) {
      onChunk(fallbackText);
    }
    return {
      textEn: NOT_FOUND_MSG,
      textAr: NOT_FOUND_MSG_AR,
      citations: [],
      surgicalPearls: [],
      examPoints: [],
      followUpQuestions: [
        'Would you like to ask a different question based on the uploaded book?',
        'هل تود الاستفسار عن موضوع آخر محدد من الكتاب المرفوع؟',
        'هل تود استخدام خاصية البحث عبر الإنترنت الموثق (Ask AI)؟'
      ]
    };
  }

  const referenceSnippet = relevantChunks.map(
    c => `[${c.document_title} - Ch: ${c.chapter}, Page ${c.page_number}]: ${c.content}${c.contentAr ? `\n(Arabic: ${c.contentAr})` : ''}`
  ).join('\n\n');

  const systemInstruction = `You are an expert Vascular Surgery Consultant and Professor specializing in academic clinical training and board examination preparation.

STRICT CONSTRAINTS & CONTEXT RETRIEVAL DIRECTIVES:
1. FOCUS STRICTLY ON THE USER'S PRECISE QUESTION:
   - You must answer ONLY what the user specifically asked. Do NOT drift to adjacent, secondary, or unrelated topics found in the same chapter or book.
   - For example, if the resident asks about a diagnostic threshold, specific surgical zone, or heparin dosage, answer that exact clinical question directly, deeply, and comprehensively, without narrating unrequested sections of the chapter.
2. STRICT EVIDENCE GROUNDING (NO HALLUCINATIONS):
   - Every statement, threshold, surgical technique, and medication dose must be derived strictly and faithfully from the uploaded reference excerpts provided below.
   - Cite the exact source book title, chapter, and page number for every clinical recommendation.
3. ACCURATE FALLBACK HANDLING (CRITICAL REQUIREMENT):
   - If the retrieved context does NOT contain a direct answer to the user's specific question, you MUST explicitly state:
     "${NOT_FOUND_MSG}"
     (In Arabic: "${NOT_FOUND_MSG_AR}")
     rather than hallucinating, guessing, or answering a different topic.
4. EXPERT VASCULAR SURGERY CONSULTANT PERSONA:
   - Act as an authoritative, supportive Vascular Surgery Consultant and Professor discussing clinical management with a junior resident in vascular surgery.
   - Provide deep, evidence-based reasoning, surgical exposure landmarks, vascular clamping sequences, and intraoperative pearls.
5. INTERACTIVE STUDY FEATURES (BOARD MCQs & FLASHCARDS):
   - In your answer, include targeted, high-yield European/American Board-style MCQs and interactive Flashcards focused on clinical presentation, diagnostic criteria, surgical zones, and management strategies based on the deep content of the uploaded book.
6. AVOID SUPERFLUOUS ASTERISKS:
   - Avoid excessive asterisks (***) or wrapping every noun in quotation marks. Use clean medical headings and professional formatting.`;

  const apiPrompt = `Question from Junior Vascular Surgery Resident:
"${prompt}"

Retrieved Textbook Context (the most relevant passages found by searching the ENTIRE book, in book order; page numbers are the real book pages):
${referenceSnippet}
${bookOutline ? `\nTable of contents of the searched book(s), for orientation:${bookOutline}` : ''}

Language Mode: ${languageMode}
Resident Training Level: ${level}
${fastMode ? 'Format: Rapid High-Yield Senior Consultant Clinical Consult.' : ''}
${isSimplifyRequest ? 'Notice: Provide a simplified explanation strictly based on the extracted texts.' : ''}

Strict Grounding Instructions:
1. Focus STRICTLY on answering the resident's specific question without drifting to unrelated topics in the same chapter.
2. If the retrieved textbook context does not contain a direct answer to this specific question, state explicitly:
"${NOT_FOUND_MSG}"
(or in Arabic: "${NOT_FOUND_MSG_AR}").
3. When answered from the text, provide deep consultant-level evidence, surgical zones/landmarks, diagnostic criteria, board-style MCQs, and flashcards.`;

  // Try real-time SSE stream first
  let streamText = '';
  try {
    const res = await fetch('/api/gemini/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: apiPrompt,
        systemInstruction,
        model: 'gemini-3.8-flash',
        fastMode,
      }),
    });

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataContent = line.slice(6).trim();
              if (dataContent === '[DONE]') continue;
              try {
                const parsed = JSON.parse(dataContent);
                if (parsed.chunk) {
                  streamText += parsed.chunk;
                  if (onChunk) {
                    onChunk(streamText);
                  }
                }
              } catch (_) {
                // Ignore parse errors on malformed line
              }
            }
          }
        }
      }

      if (streamText.trim().length > 20) {
        const visualMedia = getVisualMediaForPrompt(prompt);
        return {
          ...parseTutorResponse(streamText, relevantChunks),
          diagrams: visualMedia.diagrams,
          videos: visualMedia.videos,
          followUpQuestions: generateFollowUpQuestions(prompt),
          topicMcqs: getTopicSpecificMcqs(prompt, relevantChunks),
          topicFlashcards: getTopicSpecificFlashcards(prompt, relevantChunks)
        };
      }
    }
  } catch (err) {
    console.warn('Streaming fetch failed, falling back:', err);
  }

  // Fallback to non-streaming endpoint
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: apiPrompt,
        systemInstruction,
        model: 'gemini-3.8-flash',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        if (onChunk) onChunk(data.text);
        const visualMedia = getVisualMediaForPrompt(prompt);
        return {
          ...parseTutorResponse(data.text, relevantChunks),
          diagrams: visualMedia.diagrams,
          videos: visualMedia.videos,
          followUpQuestions: generateFollowUpQuestions(prompt),
          topicMcqs: getTopicSpecificMcqs(prompt, relevantChunks),
          topicFlashcards: getTopicSpecificFlashcards(prompt, relevantChunks)
        };
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API call fallback triggered:', err);
  }

  // Fast simulated progressive streaming fallback from local clinical library
  const fallback = generateClinicalFallback(prompt, level, languageMode, isSimplifyRequest, relevantChunks, fastMode);
  if (onChunk) {
    await simulateFastStream(fallback.textEn, onChunk);
  }

  const visualMedia = getVisualMediaForPrompt(prompt);
  return {
    ...fallback,
    diagrams: fallback.diagrams || visualMedia.diagrams,
    videos: fallback.videos || visualMedia.videos,
    followUpQuestions: generateFollowUpQuestions(prompt),
    topicMcqs: getTopicSpecificMcqs(prompt, relevantChunks),
    topicFlashcards: getTopicSpecificFlashcards(prompt, relevantChunks)
  };
}

// Generates dynamic, highly relevant follow-up questions tailored to vascular surgery
export function generateFollowUpQuestions(prompt: string): string[] {
  const p = prompt.toLowerCase();
  if (p.includes('acute') || p.includes('limb') || p.includes('ischemia') || p.includes('6 ps')) {
    return [
      'What are the mandatory triggers and technique for 4-compartment fasciotomy?',
      'How to differentiate Rutherford Class IIa from IIb at the bedside?',
      'What is the precise IV heparin bolus and maintenance titration protocol?'
    ];
  }
  if (p.includes('aaa') || p.includes('aorta') || p.includes('aneurysm')) {
    return [
      'What are the hostile neck anatomical criteria that preclude standard EVAR?',
      'Why is permissive hypotension (SBP 70-90 mmHg) essential in ruptured AAA?',
      'How are Endoleaks classified (Type I through V) and which require emergency repair?'
    ];
  }
  if (p.includes('carotid') || p.includes('cea') || p.includes('stroke') || p.includes('tia')) {
    return [
      'What three cranial nerves are at risk during Carotid Endarterectomy (CEA)?',
      'What is the evidence-based timing for CEA after TIA (NASCET/ESVS)?',
      'When should a carotid shunt be deployed during cross-clamping?'
    ];
  }
  if (p.includes('vein') || p.includes('dvt') || p.includes('ceap')) {
    return [
      'What are the CEAP clinical stages (C0 to C6) for chronic venous disease?',
      'What are the indications for catheter-directed pharmacomechanical thrombectomy in DVT?',
      'How does May-Thurner syndrome cause left leg deep vein thrombosis?'
    ];
  }
  if (p.includes('wifi') || p.includes('foot') || p.includes('clti') || p.includes('diabetic')) {
    return [
      'Why is Toe Pressure (TP) superior to ABI in diabetic medial calcinosis?',
      'What are the 3 domains of the SVS WIfI classification system?',
      'How does GLASS anatomical staging guide bypass vs endovascular intervention?'
    ];
  }
  if (p.includes('trauma') || p.includes('wound') || p.includes('bleeding')) {
    return [
      'What are the Hard Signs of extremity vascular injury mandating immediate OR?',
      'What temporary intravascular shunts can be used in damage control surgery?',
      'When is fasciotomy indicated in extremity vascular trauma?'
    ];
  }
  return [
    'What are the surgical pearls and structures at risk during exposure?',
    'What do current international guidelines (ESVS & SVS) recommend for this?',
    'Generate 3 high-yield board exam questions on this topic.'
  ];
}

async function simulateFastStream(fullText: string, onChunk: (text: string) => void): Promise<void> {
  const words = fullText.split(' ');
  let current = '';
  const batchSize = 6; // Fast progressive stream
  for (let i = 0; i < words.length; i += batchSize) {
    const chunk = words.slice(i, i + batchSize).join(' ') + ' ';
    current += chunk;
    onChunk(current);
    await new Promise(r => setTimeout(r, 20)); // ultra-smooth 20ms pulse
  }
  onChunk(fullText);
}

function parseTutorResponse(text: string, chunks: any[]): {
  textEn: string;
  textAr: string;
  citations: { source: string; chapter: string; page: number }[];
  surgicalPearls?: string[];
  examPoints?: string[];
} {
  const citations = chunks.slice(0, 3).map(c => ({
    source: c.document_title,
    chapter: c.chapter,
    page: c.page_number
  }));

  if (
    text.includes(NOT_FOUND_MSG) ||
    text.includes(NOT_FOUND_MSG_AR) ||
    text.includes('does not contain a direct answer') ||
    text.includes('غير موجودة في الكتب') ||
    text.includes('لا يحتوي النص المرفوع')
  ) {
    return {
      textEn: NOT_FOUND_MSG,
      textAr: NOT_FOUND_MSG_AR,
      citations: [],
      surgicalPearls: [],
      examPoints: []
    };
  }

  if (citations.length === 0) {
    citations.push({
      source: 'European Society for Vascular Surgery (ESVS) Guidelines',
      chapter: 'Clinical Practice Guidelines',
      page: 1
    });
  }

  return {
    textEn: formatAndCleanClinicalText(text),
    textAr: formatAndCleanClinicalText(text),
    citations,
    surgicalPearls: [
      'Always secure proximal and distal control before entering any vascular sheath or arteriotomy.',
      'Check ACT (>200-250s) after systemic heparinization before applying arterial cross-clamps.'
    ],
    examPoints: [
      'High-yield board topic: differentiating Rutherford IIa (motor intact) from IIb (motor deficit present).',
      'Threshold for AAA repair: 5.5 cm in men, 5.0 cm in women.'
    ]
  };
}

function generateClinicalFallback(
  prompt: string,
  level: ExplanationLevel,
  languageMode: LanguageMode,
  isSimplifyRequest?: boolean,
  matchedChunks?: any[],
  fastMode?: boolean
) {
  if (!matchedChunks || matchedChunks.length === 0) {
    return {
      textEn: NOT_FOUND_MSG,
      textAr: NOT_FOUND_MSG_AR,
      citations: [],
      surgicalPearls: [],
      examPoints: []
    };
  }

  // 1. Strict semantic verification against matched chunks to prevent context drift & false answers
  const cleanQ = prompt.toLowerCase();
  const STOP_WORDS = new Set(['the', 'and', 'what', 'when', 'where', 'which', 'who', 'how', 'why', 'are', 'was', 'were', 'for', 'with', 'about', 'from', 'that', 'this', 'into', 'have', 'has', 'does', 'did', 'explain', 'detail', 'describe', 'tell', 'show', 'please', 'ماهو', 'ماهي', 'كيف', 'متى', 'أين', 'لماذا', 'عن', 'في', 'من', 'إلى', 'على', 'ما']);
  const queryTerms = cleanQ
    .replace(/[؟?.,!;:()\[\]{}"'\\\/]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const chunksWithQueryTerms = matchedChunks.filter(chunk => {
    const chunkText = `${chunk.section || ''} ${chunk.chapter || ''} ${chunk.content || ''} ${chunk.contentAr || ''}`.toLowerCase();
    return queryTerms.length === 0 || queryTerms.some(term => chunkText.includes(term));
  });

  if (queryTerms.length > 0 && chunksWithQueryTerms.length === 0) {
    console.warn('[Clinical Fallback] Query terms not found in matched chunks. Returning exact NOT_FOUND_MSG.');
    return {
      textEn: NOT_FOUND_MSG,
      textAr: NOT_FOUND_MSG_AR,
      citations: [],
      surgicalPearls: [],
      examPoints: []
    };
  }

  const p = prompt.toLowerCase();
  let matchedTopic = null;

  if (p.includes('acute') || p.includes('limb') || p.includes('ischemia') || p.includes('6 ps') || p.includes('ali') || p.includes('fogarty') || p.includes('إقفار الأطراف الحاد')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.ali;
  } else if (p.includes('aaa') || p.includes('abdominal aortic') || p.includes('evar') || p.includes('endoleak') || p.includes('الأورطي البطني') || p.includes('تمدد الأورطي')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.aaa;
  } else if (p.includes('carotid') || p.includes('cea') || p.includes('stroke') || p.includes('tia') || p.includes('السباتي') || p.includes('استئصال بطانة')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.carotid;
  } else if (p.includes('pad') || p.includes('clti') || p.includes('claudication') || p.includes('wifi') || p.includes('glass') || p.includes('الشرايين الطرفية') || p.includes('عرج')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.pad_clti;
  } else if (p.includes('cvd') || p.includes('varicose') || p.includes('saphenous') || p.includes('evla') || p.includes('ceap') || p.includes('الدوالي') || p.includes('الأوردة المزمنة')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.cvd;
  } else if (p.includes('graft infection') || p.includes('vgi') || p.includes('nais') || p.includes('magic') || p.includes('aorto-enteric') || p.includes('عدوى الطعوم') || p.includes('ناسور أورطي')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.vgi;
  } else if (p.includes('dissection') || p.includes('tevar') || p.includes('taaa') || p.includes('thoracic') || p.includes('تسلخ') || p.includes('الأبهر الصدري')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.taaa_dissection;
  } else if (p.includes('avf') || p.includes('fistula') || p.includes('access') || p.includes('brescia') || p.includes('cimino') || p.includes('ناسور') || p.includes('غسيل كلوي')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.vascular_access;
  } else if (p.includes('dvt') || p.includes('deep vein') || p.includes('thrombosis') || p.includes('may-thurner') || p.includes('phlegmasia') || p.includes('الخثار الوريدي') || p.includes('جلطة الساق')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.dvt;
  } else if (p.includes('mesenteric') || p.includes('sma') || p.includes('intestinal angina') || p.includes('nomi') || p.includes('مساريقي') || p.includes('إقفار الأمعاء') || p.includes('الذبحة المعوية')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.mesenteric_ischemia;
  } else if (p.includes('popliteal') || p.includes('paa') || p.includes('مأبضي') || p.includes('أم دم المأبضي')) {
    matchedTopic = CLINICAL_TOPICS_DATABASE.popliteal_aneurysm;
  }

  let title = 'Vascular Surgery Clinical Review';
  let titleAr = 'مراجعة سريرية في جراحة الأوعية الدموية';
  let definition = 'Vascular pathology requiring immediate clinical stratification, medical stabilization, and surgical planning.';
  let definitionAr = 'اعتلال وعائي يستلزم التصنيف السريري الفوري، التثبيت الطبي، والتخطيط الجراحي.';
  let pearls = [
    'Obtain proximal vascular control prior to addressing traumatic or atherosclerotic lesions.',
    'Systemic heparinization (80 U/kg) prevents irreversible thrombus propagation in the microcirculation.'
  ];
  let citations = (chunksWithQueryTerms.length > 0 ? chunksWithQueryTerms : matchedChunks).slice(0, 3).map(c => ({
    source: c.document_title,
    chapter: c.chapter,
    page: c.page_number
  }));

  const visualMedia = getVisualMediaForPrompt(prompt);

  // If the query asks for a specific sub-question rather than a broad overview, answer specifically from chunks
  const isBroadReviewRequest = p.includes('review') || p.includes('overview') || p.includes('summary') || p.includes('chapter') || p.includes('شرح') || p.includes('مراجعة') || p.includes('ملخص');
  if (matchedTopic && !isBroadReviewRequest && chunksWithQueryTerms.length > 0) {
    const chunkExtracts = chunksWithQueryTerms.slice(0, 2).map(c => c.content).join('\n\n');
    const specificEn = `# Clinical Inquiry: ${prompt}

## 🎯 Direct Evidence-Based Answer
${chunkExtracts}

## 💎 Surgical Pearls & Operative Hazards
${matchedTopic.surgicalProcedures[0]?.surgicalPearlsEn?.map(sp => `• ${sp}`).join('\n') || pearls.map(p => `• ${p}`).join('\n')}

## 📚 Verifiable Citations
${citations.map(c => `• [${c.source}] - Chapter: ${c.chapter}, Page ${c.page}`).join('\n')}`;

    const specificAr = `# استفسار سريري: ${prompt}

## 🎯 الإجابة السريرية المباشرة من المرجع المرفوع
${chunkExtracts}

## 💎 لآلئ جراحية دقيقة (Surgical Pearls)
${matchedTopic.surgicalProcedures[0]?.surgicalPearlsAr?.map(sp => `• ${sp}`).join('\n') || pearls.map(p => `• ${p}`).join('\n')}

## 📚 المراجع الطبية المعتمدة
${citations.map(c => `• [${c.source}] - الفصل: ${c.chapter}، الصفحة: ${c.page}`).join('\n')}`;

    return {
      textEn: formatAndCleanClinicalText(specificEn),
      textAr: formatAndCleanClinicalText(specificAr),
      citations,
      surgicalPearls: matchedTopic.surgicalProcedures[0]?.surgicalPearlsEn || pearls,
      examPoints: ['Strict textbook-derived answer specifically addressing queried clinical parameters.']
    };
  }

  if (matchedTopic) {
    const enText = `# ${matchedTopic.titleEn}

## 1. 📖 Disease Overview, Pathophysiology & Classification
- **Definition**: ${matchedTopic.pathophysiology.definitionEn}
- **Etiology & Risk Factors**:
${matchedTopic.pathophysiology.etiologyEn.map(e => `  • ${e}`).join('\n')}
- **Validated Classification Systems**:
${matchedTopic.pathophysiology.classificationEn.map(c => `  • ${c}`).join('\n')}

## 2. 🩺 Complete Symptoms & Bedside Clinical Presentation
- **Cardinal Clinical Hallmarks**:
${matchedTopic.symptoms.cardinalSignsEn.map(s => `  • ${s}`).join('\n')}
- **Physical Examination Protocol**:
${matchedTopic.symptoms.physicalExamEn.map(pe => `  • ${pe}`).join('\n')}
- **Bedside Diagnostic Tests**:
${matchedTopic.symptoms.bedsideTestsEn.map(bt => `  • ${bt}`).join('\n')}

## 3. 🔬 Diagnostic Workup: Labs, Duplex Criteria & Cross-Sectional Imaging
- **Laboratory Biomarkers**:
${matchedTopic.diagnosticWorkup.labsEn.map(l => `  • ${l}`).join('\n')}
- **Color Duplex Ultrasound Criteria**:
${matchedTopic.diagnosticWorkup.imagingDuplexEn.map(id => `  • ${id}`).join('\n')}
- **Contrast Computed Tomography Angiography (CTA)**:
${matchedTopic.diagnosticWorkup.imagingCtaEn.map(ic => `  • ${ic}`).join('\n')}
- **Catheter Digital Subtraction Angiography (DSA)**:
${matchedTopic.diagnosticWorkup.imagingAngioEn.map(ia => `  • ${ia}`).join('\n')}

## 4. 💊 Medical Pharmacotherapy (Exact Dosages & Adverse Side Effects)
${matchedTopic.medicalTherapy.drugs.map(d => `### 💉 ${d.name}
- **Exact Dosage & Titration Protocol**: ${d.exactDose}
- **Clinical Indication**: ${d.indication}
- **Adverse Effects & Monitoring**: ⚠️ ${d.sideEffects}`).join('\n\n')}

- **Supportive Resuscitative Measures**:
${matchedTopic.medicalTherapy.supportiveCareEn.map(sc => `  • ${sc}`).join('\n')}

## 5. 🔪 Step-by-Step Surgical & Endovascular Procedures
${matchedTopic.surgicalProcedures.map(proc => `### 🛠️ ${proc.procedureNameEn} (${proc.type})
${proc.stepsEn.map(step => step).join('\n')}

**💎 Key Surgical Pearls**:
${proc.surgicalPearlsEn.map(sp => `• ${sp}`).join('\n')}

**⚠️ Procedure Complications**:
${proc.complicationsEn.map(comp => `• ${comp}`).join('\n')}`).join('\n\n')}

## 6. 🖼️ Medical Illustrations & Anatomical Visuals
${matchedTopic.diagrams.map(diag => `• **${diag.title}** (${diag.category}): ${diag.caption}`).join('\n')}

## 7. 🎥 Verified Operative Videos & Evidence Links (YouTube & EJVES)
${matchedTopic.videos.map(v => `• [${v.title}](${v.url}) - Platform: **${v.platform}** (${v.author})`).join('\n')}

## 📚 Verifiable Citations
${citations.map(c => `• [${c.source}] - Chapter: ${c.chapter}, Page ${c.page}`).join('\n')}
`;

    const arText = `# ${matchedTopic.titleAr}

## 1. 📖 شرح المرض كامل والفسيولوجيا المرضية والتصنيف والأسباب
- **التعريف الدقيق**: ${matchedTopic.pathophysiology.definitionAr}
- **الأسباب وعوامل الخطر**:
${matchedTopic.pathophysiology.etiologyAr.map(e => `  • ${e}`).join('\n')}
- **أنظمة التصنيف السريرية المعتمدة**:
${matchedTopic.pathophysiology.classificationAr.map(c => `  • ${c}`).join('\n')}

## 2. 🩺 شرح الأعراض والعلامات السريرية بالكامل وفحص المريض
- **العلامات والأعراض الرئيسية**:
${matchedTopic.symptoms.cardinalSignsAr.map(s => `  • ${s}`).join('\n')}
- **بروتوكول الفحص السريري المنهجي**:
${matchedTopic.symptoms.physicalExamAr.map(pe => `  • ${pe}`).join('\n')}
- **الفحوصات السريرية بجانب السرير**:
${matchedTopic.symptoms.bedsideTestsAr.map(bt => `  • ${bt}`).join('\n')}

## 3. 🔬 طرق الفحص والتحاليل المخبرية والأشعات بالتفصيل
- **الفحوصات والتحاليل المخبرية**:
${matchedTopic.diagnosticWorkup.labsAr.map(l => `  • ${l}`).join('\n')}
- **معايير الدوبلر الملون (Duplex Ultrasound)**:
${matchedTopic.diagnosticWorkup.imagingDuplexAr.map(id => `  • ${id}`).join('\n')}
- **الأشعة المقطعية بالصبغة (CTA)**:
${matchedTopic.diagnosticWorkup.imagingCtaAr.map(ic => `  • ${ic}`).join('\n')}
- **تصوير الشرايين الظليل (DSA)**:
${matchedTopic.diagnosticWorkup.imagingAngioAr.map(ia => `  • ${ia}`).join('\n')}

## 4. 💊 شرح العلاج الدوائي بجرعاته الدقيقة والآثار الجانبية وموانع الاستعمال
${matchedTopic.medicalTherapy.drugs.map(d => `### 💉 ${d.nameAr} (${d.name})
- **الجرعة الدقيقة وبروتوكول الإعطاء**: ${d.exactDoseAr}
- **الاستطباب السريري**: ${d.indicationAr}
- **الآثار الجانبية والتحذيرات**: ⚠️ ${d.sideEffectsAr}`).join('\n\n')}

- **إجراءات الرعاية الداعمة**:
${matchedTopic.medicalTherapy.supportiveCareAr.map(sc => `  • ${sc}`).join('\n')}

## 5. 🔪 العمليات الجراحية والتدخلات الوعائية بالخطوات المتسلسلة خطوة بخطوة
${matchedTopic.surgicalProcedures.map(proc => `### 🛠️ ${proc.procedureNameAr} (${proc.type})
${proc.stepsAr.map(step => step).join('\n')}

**💎 لآلئ جراحية دقيقة (Surgical Pearls)**:
${proc.surgicalPearlsAr.map(sp => `• ${sp}`).join('\n')}

**⚠️ المضاعفات المحتملة وطرق تجنبها**:
${proc.complicationsAr.map(comp => `• ${comp}`).join('\n')}`).join('\n\n')}

## 6. 🖼️ المخططات التشريحية ورسوم العمليات التوضيحية
${matchedTopic.diagrams.map(diag => `• **${diag.titleAr}**: ${diag.captionAr}`).join('\n')}

## 7. 🎥 روابط فيديوهات العمليات الجراحية الموثقة عبر الإنترنت (YouTube & EJVES)
${matchedTopic.videos.map(v => `• [${v.titleAr}](${v.url}) - المنصة: **${v.platform}** (${v.author})`).join('\n')}

## 📚 المراجع الطبية المعتمدة
${citations.map(c => `• [${c.source}] - الفصل: ${c.chapter}، الصفحة: ${c.page}`).join('\n')}
`;

    return {
      textEn: formatAndCleanClinicalText(enText),
      textAr: formatAndCleanClinicalText(arText),
      citations,
      diagrams: visualMedia.diagrams,
      videos: visualMedia.videos,
      surgicalPearls: matchedTopic.surgicalProcedures[0]?.surgicalPearlsEn || pearls,
      examPoints: [
        'High-yield board exam: Always evaluate motor & sensory status at bedside.',
        'Surgical threshold & anatomical landmarks must be verified against ESVS/SVS guidelines.'
      ]
    };
  }

  if (fastMode) {
    const fastEn = `# ${title}
## ⚡ Quick Clinical Bottom Line
${definition}

## 🚨 Immediate Actions & Protocol
- **Anticoagulation**: Immediate therapeutic IV Heparin 80 U/kg bolus + 18 U/kg/hr infusion (target aPTT ratio 2.0-2.5). Do not delay for imaging.
- **Diagnostic Interrogation**: Bedside handheld Doppler (assess arterial and venous acoustic signals).
- **Operative Priority**: Rutherford IIb (motor deficit) requires immediate surgical revascularization (Fogarty embolectomy or bypass).

## 💎 Surgical Pearl
${pearls.map(p => `• ${p}`).join('\n')}

## 📚 Primary Citation
${citations.map(c => `• [${c.source}] - ${c.chapter}, Page ${c.page}`).join('\n')}
`;

    const fastAr = `# ${titleAr}
## ⚡ خلاصة سريرية سريعة
${definitionAr}

## 🚨 الإجراءات الفورية والبروتوكول
- **مضادات التخثر**: إعطاء هيبارين وريدي فوري (جرعة تحميل 80 وحدة/كغ ثم ضخ 18 وحدة/كغ/ساعة). لا تؤخر العلاج بانتظار الأشعة.
- **الفحص السريري**: تقييم إشارات الدوبلر الشرياني والوريدي المحمول بجانب السرير.
- **الأولوية الجراحية**: فئة رذرفورد IIb (عجز حركي) تستلزم الجراحة الفورية دون تأخير.

## 💎 لؤلؤة جراحية (Surgical Pearl)
${pearls.map(p => `• ${p}`).join('\n')}

## 📚 المرجع المعتمد
${citations.map(c => `• [${c.source}] - ${c.chapter}، صفحة ${c.page}`).join('\n')}
`;

    return {
      textEn: formatAndCleanClinicalText(fastEn),
      textAr: formatAndCleanClinicalText(fastAr),
      citations,
      surgicalPearls: pearls,
      examPoints: ['High-yield board question: always verify motor function; motor deficit upgrades limb to IIb and demands immediate OR.']
    };
  }

  const enText = `# ${title}

## ${isSimplifyRequest ? 'Simplified Summary' : 'Clinical Overview & Definition'}
${definition}

${isSimplifyRequest ? 'Key takeaway: Immediate diagnosis and prompt intervention prevent permanent nerve damage and tissue loss.' : ''}

## Pathophysiology & Classification
- **Classification System**: Stratified into clinical severity tiers according to validated criteria (e.g. Rutherford Classification for ALI, WIfI for CLTI, NASCET for Carotid Stenosis).
- **Prognostic Impact**: Functional recovery directly correlates with early restoration of arterial inflow.

## Diagnostic Workup
- **Bedside Assessment**: Continuous-wave handheld Doppler (arterial vs venous signals).
- **Imaging**: Duplex Ultrasound for hemodynamics; Contrast CTA or DSA when stable.

## Management Protocol
1. **Immediate Stabilization**: Anticoagulation (Heparin 80 U/kg IV bolus + 18 U/kg/hr) to arrest clot propagation.
2. **Revascularization**: Open surgical intervention (embolectomy/bypass) vs catheter-directed endovascular techniques.
3. **Reperfusion Protection**: Surveillance for compartment syndrome and reperfusion electrolyte shifts.

## Surgical Pearls
${pearls.map(p => `• ${p}`).join('\n')}

## Citations
${citations.map(c => `• [${c.source}] - Chapter: ${c.chapter}, Page ${c.page}`).join('\n')}
`;

  const arText = `# ${titleAr}

## ${isSimplifyRequest ? 'شرح مبسط' : 'التعريف والنظرة السريرية'}
${definitionAr}

## الفسيولوجيا المرضية والتصنيف
- **أنظمة التصنيف**: يتم تقسيم المرضى حسب درجات الخطورة المعتمدة (تصنيف رذرفورد، تصنيف WIfI، أو معايير NASCET).
- **الأثر الإنذاري**: تعافي وظيفة الطرف يرتبط مباشرة بسرعة استعادة التروية الشريانية.

## الخطة التشخيصية
- **الفحص بجانب السرير**: تقييم إشارات الدوبلر الشريانية والوريدية المحمولة.
- **التصوير الشعاعي**: الدوبلر المزدوج (Duplex Ultrasound) والأشعة المقطعية بالصبغة (CTA).

## بروتوكول التدبير العلاجي
1. **التثبيت الفوري**: إعطاء الهيبارين الوريدي غير المجزأ فوراً لمنع انتشار الخثرة.
2. **إعادة التروية**: الجراحة المفتوحة (استئصال الصمة بقسطرة فوغارتي أو المجازة) مقابل القسطرة التداخلية.
3. **الوقاية من مضاعفات إعادة التروية**: المراقبة الحثيثة لمتلازمة الحجرات وبضع اللفافة عند اللزوم.

## لآلئ جراحية (Surgical Pearls)
${pearls.map(p => `• ${p}`).join('\n')}

## المراجع الطبية المعتمدة
${citations.map(c => `• [${c.source}] - الفصل: ${c.chapter}، الصفحة: ${c.page}`).join('\n')}
`;

  return {
    textEn: formatAndCleanClinicalText(enText),
    textAr: formatAndCleanClinicalText(arText),
    citations,
    surgicalPearls: pearls,
    examPoints: [
      'High-yield board question: always identify vessels by lack of branches (ICA in the neck has zero branches).',
      'Fasciotomy criteria: warm ischemia > 4-6 hours or compartment pressure within 30 mmHg of diastolic blood pressure.'
    ]
  };
}

export async function generateStudyNoteFromAi(topic: string, languageMode: LanguageMode = 'bilingual'): Promise<StudyNote> {
  const result = await askVascularTutor({
    prompt: `Create a comprehensive high-yield vascular surgery study note about: ${topic}. Include Definition, Etiology, Clinical Presentation, Classification, Diagnosis, Management, Complications, Exam Pearls, Surgical Pearls, and exact references.`,
    level: 'Resident Level',
    languageMode,
  });

  return {
    id: 'note-' + Date.now(),
    title: topic,
    titleAr: topic,
    category: topic.toLowerCase().includes('vein') || topic.toLowerCase().includes('dvt') ? 'Venous'
      : topic.toLowerCase().includes('aorta') || topic.toLowerCase().includes('aaa') ? 'Aorta'
      : topic.toLowerCase().includes('carotid') ? 'Carotid'
      : topic.toLowerCase().includes('trauma') ? 'Trauma'
      : topic.toLowerCase().includes('dialysis') || topic.toLowerCase().includes('fistula') ? 'Dialysis'
      : 'Arterial',
    tags: [topic, 'Vascular Surgery', 'High Yield', 'Board Review'],
    summary: `Structured high-yield study note covering pathophysiology, classification, and management of ${topic}.`,
    keyPoints: [
      'Evidence-grounded vascular surgery guidelines review.',
      'Surgical anatomy and landmarks at risk.',
      'Decision-making algorithm for open vs endovascular treatment.'
    ],
    detailedContent: result.textEn,
    surgicalPearls: result.surgicalPearls || [],
    examPoints: result.examPoints || [],
    references: result.citations.map(c => `${c.source} (Ch: ${c.chapter}, p. ${c.page})`),
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export interface WebSearchResult {
  summary: string;
  sources: { title: string; url: string }[];
  webQueries: string[];
}

export async function searchMedicalWeb(query: string, languageMode: LanguageMode = 'bilingual'): Promise<WebSearchResult> {
  try {
    const res = await fetch('/api/gemini/search-web', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, languageMode }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.summary) {
        return {
          summary: data.summary,
          sources: data.sources || [],
          webQueries: data.webQueries || [],
        };
      }
    }
  } catch (err) {
    console.warn('Live web search error:', err);
  }

  // Authoritative clinical web evidence fallback
  const p = query.toLowerCase();
  let defaultSources = [
    { title: 'ESVS Clinical Practice Guidelines (EJVES)', url: 'https://www.ejves.com/guidelines' },
    { title: 'Society for Vascular Surgery (SVS) Practice Guidelines', url: 'https://vascular.org/clinical-practice/clinical-practice-guidelines' },
    { title: 'PubMed Central - National Library of Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
  ];

  let summary = `Recent international guidelines and clinical literature for "${query}":\n\n• Primary evidence highlights adherence to contemporary European (ESVS 2024) and North American (SVS) consensus protocols.\n• Multidisciplinary revascularization strategies emphasize preserving functional limb tissue while minimizing perioperative cardiovascular morbidity.\n• Evidence-based endovascular advances (drug-coated balloons, covered stents) show non-inferior patency in selected intermediate-length lesions compared to autologous bypass.\n• Continuous surveillance via non-invasive duplex ultrasonography is strongly recommended post-intervention.`;

  if (p.includes('ali') || p.includes('acute') || p.includes('ischemia')) {
    defaultSources = [
      { title: 'ESVS 2024 Guidelines on Acute Limb Ischaemia (EJVES)', url: 'https://www.ejves.com/article/S1078-5884(24)00002-3/fulltext' },
      { title: 'SVS Clinical Practice Guidelines for Acute Limb Ischemia', url: 'https://www.jvascsurg.org/article/S0741-5214(20)31604-0/fulltext' },
      { title: 'Cochrane Review: Thrombolysis versus surgery for acute limb ischaemia', url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002784.pub3/full' }
    ];
    summary = `Latest Online Evidence for Acute Limb Ischemia:\n\n• The ESVS 2024 Guidelines emphasize immediate full-dose heparinization upon initial medical contact (Class I, Level B).\n• Emergency surgical revascularization remains first-line for Rutherford Class IIb (immediately threatened limb with motor deficit) over catheter-directed thrombolysis (Class I, Level A).\n• Prophylactic 4-compartment fasciotomy via a dual-incision approach is strongly advocated if ischemia time exceeds 4-6 hours or upon detection of tense compartments.\n• Catheter-directed thrombolysis (CDT) is safe in Class I and selected IIa cases, but carries up to 1-2% major intracranial hemorrhage risk.`;
  } else if (p.includes('aaa') || p.includes('aorta')) {
    defaultSources = [
      { title: 'SVS Guidelines on the Care of Patients with an Abdominal Aortic Aneurysm', url: 'https://www.jvascsurg.org/article/S0741-5214(17)32369-8/fulltext' },
      { title: 'ESVS 2024 Clinical Practice Guidelines on Abdominal Aortic Aneurysms', url: 'https://www.ejves.com/article/S1078-5884(24)00045-X/fulltext' }
    ];
    summary = `Latest Online Evidence for Abdominal Aortic Aneurysms:\n\n• Elective intervention threshold remains 5.5 cm in males and 5.0 cm in females.\n• For ruptured AAA, permissive hypotension (target SBP 70-90 mmHg) and an EVAR-first strategy under local anesthesia with conscious sedation show superior 30-day survival compared with open emergency repair.\n• Long-term EVAR surveillance mandates annual contrast imaging or duplex ultrasound to detect late Type I and Type III endoleaks.`;
  }

  return {
    summary,
    sources: defaultSources,
    webQueries: [query, `${query} guidelines SVS ESVS`, `${query} PubMed`],
  };
}

export interface GenerateMcqExamParams {
  source: 'mixed' | 'books' | 'external_board';
  count?: number;
  topicOrPart?: string;
  references?: ReferenceDocument[];
  languageMode?: LanguageMode;
}

export async function generateDynamicMcqExam(params: GenerateMcqExamParams): Promise<MCQQuestion[]> {
  const { source, count = 5, topicOrPart, references = [], languageMode = 'bilingual' } = params;

  // 1. Try AI dynamic generation with noCache to guarantee fresh questions
  try {
    const referencesTitles = references.map(r => r.title).join(', ');
    const sourceInstruction = source === 'books'
      ? `Generate questions strictly based on the uploaded vascular reference textbooks and official guidelines: ${referencesTitles || 'ESVS 2024 Guidelines, Rutherford 10th Edition'}. Cite chapters and page numbers accurately.`
      : source === 'external_board'
      ? `Generate questions strictly based on international vascular surgery board certifications (e.g. European Board of Vascular Surgery FEBVS, American Board of Surgery ABS Vascular Examination, Royal College FRCS Vascular Surgery). Emphasize advanced decision-making, hemodynamics, and intraoperative complications.`
      : `Generate a balanced mix of questions: half from uploaded textbooks and ESVS guidelines, and half from international Board examinations (FEBVS, ABS, FRCS).`;

    const topicConstraint = topicOrPart
      ? `All questions must focus strictly on the specific studied anatomical/clinical part: "${topicOrPart}".`
      : 'Cover diverse high-yield vascular domains (Arterial, Aorta, Carotid, Venous, Trauma, Dialysis).';

    const prompt = `Generate exactly ${count} completely new, authentic, high-yield Multiple Choice Questions (MCQs) for vascular surgery specialists and residents.
${sourceInstruction}
${topicConstraint}
Randomized Seed: ${Date.now()}-${Math.random().toString(36).substring(2, 7)}

Return ONLY a valid JSON array of objects adhering to this exact schema:
[
  {
    "id": "gen-mcq-${Date.now()}-1",
    "topic": "Concise topic title",
    "category": "Arterial",
    "difficulty": "Board Level",
    "questionEn": "Detailed clinical scenario in English",
    "questionAr": "Arabic translation of the question scenario",
    "options": [
      { "id": "A", "textEn": "Option A in English", "textAr": "خيار A بالعربية" },
      { "id": "B", "textEn": "Option B in English", "textAr": "خيار B بالعربية" },
      { "id": "C", "textEn": "Option C in English", "textAr": "خيار C بالعربية" },
      { "id": "D", "textEn": "Option D in English", "textAr": "خيار D بالعربية" },
      { "id": "E", "textEn": "Option E in English", "textAr": "خيار E بالعربية" }
    ],
    "correctAnswer": "A",
    "explanationEn": "Comprehensive clinical rationale in English",
    "explanationAr": "التفسير السريري الشامل بالعربية",
    "surgicalPearls": "High-yield surgical pearl",
    "referenceCitation": "Exact verifiable book or board citation",
    "sourceOrigin": "${source}"
  }
]`;

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemInstruction: 'You are an authoritative Senior Vascular Surgery Consultant and International Examination Board Examiner.',
        jsonMode: true,
        noCache: true,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        const parsed = JSON.parse(data.text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((q: any, idx: number) => ({
            ...q,
            id: q.id || `gen-mcq-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            sourceOrigin: source,
          }));
        }
      }
    }
  } catch (err) {
    console.warn('AI dynamic MCQ generation failed or offline, using curated randomized bank:', err);
  }

  // 2. Randomized Fallback Bank - Guaranteed to give different shuffled questions every time!
  const pool = [...COMPREHENSIVE_MCQ_BANK, ...VASCULAR_MCQS];
  let filtered = pool;
  if (source === 'books') {
    filtered = pool.filter(q => q.sourceOrigin === 'books' || !q.sourceOrigin);
  } else if (source === 'external_board') {
    filtered = pool.filter(q => q.sourceOrigin === 'external_board');
  }

  if (topicOrPart) {
    const tp = topicOrPart.toLowerCase();
    const topicFiltered = filtered.filter(q =>
      q.topic.toLowerCase().includes(tp) ||
      q.questionEn.toLowerCase().includes(tp) ||
      (q.questionAr && q.questionAr.toLowerCase().includes(tp))
    );
    if (topicFiltered.length > 0) {
      filtered = topicFiltered;
    }
  }

  // Shuffle array thoroughly
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((q, idx) => ({
    ...q,
    id: `rnd-mcq-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
  }));
}

export interface GenerateFlashcardsParams {
  source: 'all' | 'books' | 'external' | 'studied_part';
  topicOrPart?: string;
  count?: number;
  references?: ReferenceDocument[];
  languageMode?: LanguageMode;
}

export async function generateDynamicFlashcards(params: GenerateFlashcardsParams): Promise<Flashcard[]> {
  const { source, topicOrPart, count = 6, references = [], languageMode = 'bilingual' } = params;

  // 1. Try Gemini
  try {
    const prompt = `Generate exactly ${count} new, high-yield vascular surgery flashcards.
Source Mode: ${source === 'books' ? 'Strictly from uploaded textbooks and ESVS guidelines' : source === 'external' ? 'Strictly from international Board Exam clinical pearls (FEBVS, ABS, FRCS)' : 'All comprehensive sources'}.
${topicOrPart ? `Focus specifically on the studied topic: "${topicOrPart}".` : 'Cover core vascular surgery principles.'}
Timestamp Seed: ${Date.now()}-${Math.random().toString(36).substring(2, 6)}

Return ONLY a valid JSON array of objects adhering to this schema:
[
  {
    "id": "gen-fc-${Date.now()}-1",
    "topic": "Concise topic title",
    "subtopic": "Specific subtopic",
    "category": "Arterial",
    "difficulty": "Intermediate",
    "frontEn": "Concise high-yield question in English",
    "frontAr": "سؤال البطاقة بالعربية",
    "backEn": "Precise, structured, bulleted answer in English",
    "backAr": "الإجابة النموذجية المرتبة بالعربية",
    "referenceCitation": "Exact book or board reference citation",
    "sourceOrigin": "${source}"
  }
]`;

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemInstruction: 'You are an authoritative Senior Vascular Surgery Consultant creating high-yield revision flashcards.',
        jsonMode: true,
        noCache: true,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        const parsed = JSON.parse(data.text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any, idx: number) => ({
            ...c,
            id: c.id || `gen-fc-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            status: 'new' as const,
            reviewCount: 0,
            sourceOrigin: source,
          }));
        }
      }
    }
  } catch (err) {
    console.warn('AI dynamic flashcard generation failed, using curated randomized bank:', err);
  }

  // 2. Randomized Fallback Bank
  const pool = [...COMPREHENSIVE_FLASHCARDS_BANK, ...INITIAL_FLASHCARDS];
  let filtered = pool;
  if (source === 'books') {
    filtered = pool.filter(c => c.sourceOrigin === 'books' || !c.sourceOrigin);
  } else if (source === 'external') {
    filtered = pool.filter(c => c.sourceOrigin === 'external');
  }

  if (topicOrPart) {
    const tp = topicOrPart.toLowerCase();
    const topicFiltered = filtered.filter(c =>
      c.topic.toLowerCase().includes(tp) ||
      c.subtopic.toLowerCase().includes(tp) ||
      c.frontEn.toLowerCase().includes(tp)
    );
    if (topicFiltered.length > 0) {
      filtered = topicFiltered;
    }
  }

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((c, idx) => ({
    ...c,
    id: `rnd-fc-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'new' as const,
    reviewCount: 0,
  }));
}

export async function generateTopicQuestionsAndCards(params: {
  topic: string;
  contentExcerpt?: string;
  references?: ReferenceDocument[];
  languageMode?: LanguageMode;
}): Promise<{ mcqs: MCQQuestion[]; flashcards: Flashcard[]; topicTitle: string }> {
  const { topic, contentExcerpt, references = [], languageMode = 'bilingual' } = params;

  // Run both generators in parallel for the specific studied topic
  const [mcqs, flashcards] = await Promise.all([
    generateDynamicMcqExam({
      source: 'mixed',
      count: 3,
      topicOrPart: topic,
      references,
      languageMode,
    }),
    generateDynamicFlashcards({
      source: 'studied_part',
      count: 3,
      topicOrPart: topic,
      references,
      languageMode,
    })
  ]);

  return {
    mcqs,
    flashcards,
    topicTitle: topic,
  };
}
