import { Flashcard } from '../types';

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-01',
    topic: 'Acute Limb Ischemia',
    subtopic: 'Clinical Presentation',
    category: 'Arterial',
    difficulty: 'Basic',
    frontEn: 'What are the classic 6 Ps of Acute Limb Ischemia (ALI)?',
    frontAr: 'ما هي العلامات الست الكلاسيكية (6 Ps) لإقفار الأطراف الحاد؟',
    backEn: '1. Pain (early hallmark)\n2. Pallor\n3. Pulselessness\n4. Paresthesia (earliest sensory sign of nerve hypoxia)\n5. Paralysis (indicates advanced muscle ischemia)\n6. Poikilothermia (cold extremity unable to thermoregulate)',
    backAr: '1. الألم (Pain)\n2. الشحوب (Pallor)\n3. غياب النبض (Pulselessness)\n4. التنميل / الخدر (Paresthesia - أول علامة لنقص تروية الأعصاب)\n5. الشلل (Paralysis - علامة متقدمة على تلف العضلات)\n6. برودة الطرف (Poikilothermia)',
    referenceCitation: "Rutherford's Vascular Surgery 10th Ed., Ch. 52, p. 1242",
    status: 'learning',
    reviewCount: 3
  },
  {
    id: 'fc-02',
    topic: 'Rutherford ALI Classification',
    subtopic: 'Class IIa vs IIb',
    category: 'Arterial',
    difficulty: 'Intermediate',
    frontEn: 'What is the key clinical distinction between Rutherford Class IIa and Class IIb in Acute Limb Ischemia?',
    frontAr: 'ما هو الفارق السريري الحاسم بين الفئة IIa والفئة IIb في تصنيف رذرفورد لإقفار الأطراف الحاد؟',
    backEn: 'Motor weakness!\n• Class IIa (Marginally threatened): Sensory loss limited to toes, motor function is completely INTACT.\n• Class IIb (Immediately threatened): Motor weakness IS PRESENT (e.g. toe weakness, foot drop), with sensory loss extending beyond toes.\nClass IIb mandates immediate emergency revascularization without waiting for delayed imaging.',
    backAr: 'الضعف الحركي (Motor deficit)!\n• الفئة IIa (مهددة هامشياً): فقدان حسي مقتصر على الأصابع، والحركة سليمة تماماً.\n• الفئة IIb (مهددة فوراً): يوجد ضعف حركي (مثل هبوط القدم أو ضعف أصابع القدم)، مع فقدان حسي يتجاوز الأصابع.\nالفئة IIb تستوجب فتح الشرايين فوراً في العمليات دون تأخير للتصوير.',
    referenceCitation: "ESVS 2024 ALI Guidelines & Rutherford's 10th Ed., p. 1245",
    status: 'learning',
    reviewCount: 4
  },
  {
    id: 'fc-03',
    topic: 'Abdominal Aortic Aneurysm',
    subtopic: 'Repair Thresholds',
    category: 'Aorta',
    difficulty: 'Basic',
    frontEn: 'What are the standard diameter thresholds for elective AAA repair in males vs females?',
    frontAr: 'ما هي معايير القطر القياسية للترميم الاختياري لتمدد الأورطي البطني لدى الرجال مقابل النساء؟',
    backEn: '• Males: >= 5.5 cm\n• Females: >= 5.0 cm\nOther triggers regardless of diameter: Rapid expansion (>1.0 cm/year or >0.5 cm in 6 months), saccular morphology, or any symptoms (back/flank pain).',
    backAr: '• الرجال: >= 5.5 سم\n• النساء: >= 5.0 سم\nمؤشرات أخرى بغض النظر عن القطر: التوسع السريع (>1.0 سم في السنة أو >0.5 سم في 6 أشهر)، التمدد الكيسي (Saccular)، أو وجود أعراض.',
    referenceCitation: 'SVS / ESVS Guidelines on AAA (2023)',
    status: 'mastered',
    reviewCount: 6
  },
  {
    id: 'fc-04',
    topic: 'Carotid Endarterectomy',
    subtopic: 'Anatomy at Risk',
    category: 'Carotid',
    difficulty: 'Advanced',
    frontEn: 'Which three cranial nerves are at highest risk during Carotid Endarterectomy (CEA), and what is the clinical deficit for each?',
    frontAr: 'ما هي الأعصاب القحفية الثلاثة الأكثر عرضة للخطر أثناء استئصال باطنة السباتي (CEA)، وما هو العجز السريري لكل منها؟',
    backEn: '1. Hypoglossal Nerve (CN XII): Tongue deviates toward the operated side, speech/swallowing difficulty.\n2. Vagus Nerve (CN X) / Recurrent Laryngeal: Vocal cord paralysis causing hoarseness.\n3. Marginal Mandibular Branch of Facial Nerve (CN VII): Drooping of the ipsilateral lower lip corner (asymmetric smile).',
    backAr: '1. العصب تحت اللسان (CN XII): انحراف اللسان نحو جهة العملية وصعوبة البلع.\n2. العصب المبهم (CN X) / الحنجري الراجع: شلل الحبل الصوتي وبحة الصوت.\n3. الفرع الفكي الهامشي للعصب الوجهي (CN VII): تدلي زاوية الشفة السفلية في نفس الجهة.',
    referenceCitation: "Rutherford's Vascular Surgery 10th Ed., Ch. 96, p. 2198",
    status: 'learning',
    reviewCount: 2
  },
  {
    id: 'fc-05',
    topic: 'Hemodialysis Access',
    subtopic: 'Rule of 6s',
    category: 'Dialysis',
    difficulty: 'Basic',
    frontEn: 'What is the "Rule of 6s" for Arteriovenous Fistula (AVF) maturation at 6 weeks?',
    frontAr: 'ما هي "قاعدة الستات" (Rule of 6s) لنضج ناسورة الغسيل الكلوي عند الأسبوع السادس؟',
    backEn: 'At 6 weeks post-creation:\n1. Flow >= 600 mL/min\n2. Diameter >= 6 mm\n3. Depth <= 6 mm from the skin surface\n4. Straight segment length >= 6 cm for cannulation',
    backAr: 'عند 6 أسابيع من الجراحة:\n1. تدفق الدم >= 600 مل/دقيقة\n2. قطر الوريد >= 6 مم\n3. العمق <= 6 مم تحت سطح الجلد\n4. طول مقطع مستقيم >= 6 سم للوخز',
    referenceCitation: 'KDOQI Clinical Practice Guideline for Vascular Access (2019)',
    status: 'mastered',
    reviewCount: 5
  },
  {
    id: 'fc-06',
    topic: 'Vascular Trauma',
    subtopic: 'Hard Signs of Injury',
    category: 'Trauma',
    difficulty: 'Intermediate',
    frontEn: 'What are the classic "Hard Signs" of extremity vascular trauma mandating immediate surgical exploration?',
    frontAr: 'ما هي "العلامات الأكيدة" (Hard Signs) لإصابات أوعية الأطراف التي تستوجب الاستكشاف الجراحي الفوري؟',
    backEn: '1. Pulsatile external bleeding\n2. Expanding or pulsatile hematoma\n3. Palpable thrill or audible bruit\n4. Absent distal pulses\n5. Signs of acute limb ischemia (pale, cold, paralyzed limb)\nPresence of hard signs mandates immediate operative exploration without wasting time on CT angiography.',
    backAr: '1. نزيف خارجي نابض\n2. ورم دموي متوسع أو نابض\n3. هزة بالجس (Thrill) أو لغط بالسماع (Bruit)\n4. غياب النبض المحيطي\n5. علامات إقفار الطرف الحاد\nوجود هذه العلامات يستوجب الاستكشاف الجراحي الفوري دون إضاعة الوقت في الأشعة المقطعية.',
    referenceCitation: "Rutherford's Vascular Surgery 10th Ed., Ch. 112, p. 2475",
    status: 'new',
    reviewCount: 1
  }
];
