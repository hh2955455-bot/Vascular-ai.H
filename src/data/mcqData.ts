import { MCQQuestion } from '../types';

export const VASCULAR_MCQS: MCQQuestion[] = [
  {
    id: 'mcq-ali-01',
    topic: 'Acute Limb Ischemia Classification',
    category: 'Arterial',
    difficulty: 'Resident',
    questionEn: 'A 64-year-old male presents with 5 hours of severe left calf pain and coldness. On examination, the patient has loss of sensation over the left great toe and forefoot, but normal motor function (can actively dorsiflex and plantarflex the ankle). Femoral pulse is palpable, popliteal pulse is absent. Arterial Doppler signals at the dorsalis pedis are inaudible, but venous Doppler signals are easily audible. According to the Rutherford classification, how should this limb be categorized and what is the optimal management?',
    questionAr: 'رجل يبلغ 64 عاماً يعاني من ألم وبرودة شديدة في الساق اليسرى منذ 5 ساعات. بالفحص: فقدان الإحساس في إصبع القدم الكبير ومشط القدم، مع حركة سليمة (بسط وثني الكاحل طبيعي). نبض الفخذي محسوس والمأبضي غائب. إشارات الدوبلر الشرياني غير مسموعة في ظهر القدم، لكن الإشارات الوريدية مسموعة بوضوح. وفق تصنيف رذرفورد، كيف تصنف الحالة وما التدبير الأمثل؟',
    options: [
      { id: 'A', textEn: 'Category I (Viable); Elective duplex scan in 48 hours', textAr: 'الفئة I (قابلة للحياة)؛ إجراء دوبلر اختياري خلال 48 ساعة' },
      { id: 'B', textEn: 'Category IIa (Marginally threatened); Immediate heparinization and urgent revascularization within hours', textAr: 'الفئة IIa (مهددة هامشياً)؛ هيبارين فوري وإعادة تروية عاجلة خلال ساعات' },
      { id: 'C', textEn: 'Category IIb (Immediately threatened); Emergency surgical embolectomy without delay', textAr: 'الفئة IIb (مهددة فوراً)؛ استئصال صمة جراحي طارئ فوراً' },
      { id: 'D', textEn: 'Category III (Irreversible); Urgent primary above-knee amputation', textAr: 'الفئة III (غير قابلة للاسترداد)؛ بتر فوري فوق الركبة' },
      { id: 'E', textEn: 'Category I (Viable); Aspirin and outpatient vascular referral', textAr: 'الفئة I (قابلة للحياة)؛ أسبرين وتحويل للعيادة' }
    ],
    correctAnswer: 'B',
    explanationEn: 'Rutherford Category IIa (Marginally threatened) is defined by minimal sensory loss (limited to toes/forefoot), NO muscle weakness, inaudible arterial Doppler signals, and audible venous Doppler signals. Category IIb differs critically because mild-to-moderate motor weakness is present. In Category IIa, the limb is salvageable with prompt revascularization within hours, accompanied by immediate therapeutic IV heparinization.',
    explanationAr: 'الفئة IIa من تصنيف رذرفورد (مهددة هامشياً) تتميز بفقدان حسي طفيف (مقتصر على أصابع أو مشط القدم)، دون أي ضعف حركي، مع غياب دوبلر الشرايين وبقاء دوبلر الأوردة مسموعاً. تختلف الفئة IIb بوجود ضعف حركي (Motor deficit). تتطلب الفئة IIa إعطاء هيبارين وريدي فوري وإعادة التروية العاجلة خلال ساعات.',
    surgicalPearls: 'The presence of motor weakness (even subtle toe weakness) upgrades the limb to Rutherford IIb and indicates profound muscle ischemia that tolerates only minutes to very few hours before irreversible necrosis occurs.',
    referenceCitation: "Rutherford's Vascular Surgery 10th Ed., Chapter 52, Page 1245; ESVS 2024 ALI Guidelines, Recommendation 4.1"
  },
  {
    id: 'mcq-aaa-02',
    topic: 'Abdominal Aortic Aneurysm Repair Thresholds',
    category: 'Aorta',
    difficulty: 'Resident',
    questionEn: 'Which of the following is the standard recommended diameter threshold for elective repair of an asymptomatic infrarenal abdominal aortic aneurysm in an average-risk male patient according to the SVS and ESVS clinical practice guidelines?',
    questionAr: 'أي مما يلي يمثل معيار القطر القياسي الموصى به للترميم الاختياري لتمدد الشريان الأورطي البطني غير المصحوب بأعراض لدى مريض ذكر متوسط الخطورة وفق إرشادات SVS و ESVS؟',
    options: [
      { id: 'A', textEn: '4.5 cm', textAr: '4.5 سم' },
      { id: 'B', textEn: '5.0 cm', textAr: '5.0 سم' },
      { id: 'C', textEn: '5.5 cm', textAr: '5.5 سم' },
      { id: 'D', textEn: '6.0 cm', textAr: '6.0 سم' },
      { id: 'E', textEn: '6.5 cm', textAr: '6.5 سم' }
    ],
    correctAnswer: 'C',
    explanationEn: 'The SVS and ESVS clinical guidelines recommend elective intervention for asymptomatic infrarenal abdominal aortic aneurysms at >= 5.5 cm in men and >= 5.0 cm in women. Clinical randomized trials (UK Small Aneurysm Trial and ADAM trial) demonstrated no survival advantage to repairing aneurysms < 5.5 cm compared with surveillance.',
    explanationAr: 'توصي إرشادات SVS و ESVS بالتدخل الاختياري لتمدد الأورطي البطني غير العرضي عند قطر 5.5 سم فأكثر للرجال و 5.0 سم فأكثر للنساء. أثبتت الدراسات الكبرى مثل UKSAT و ADAM عدم وجود أي فائدة لبقاء المرضى عند التدخل المبكر لأقل من 5.5 سم مقارنة بالمراقبة الدورية.',
    surgicalPearls: 'In women, the threshold is 5.0 cm because rupture risk is up to 4 times higher at equivalent aortic diameters compared with men.',
    referenceCitation: "SVS / ESVS Practice Guidelines on Abdominal Aortic Aneurysms (2023), Page 42; Rutherford's 10th Ed., Ch. 78, Page 1815"
  },
  {
    id: 'mcq-carotid-03',
    topic: 'Carotid Endarterectomy Timing and Indications',
    category: 'Carotid',
    difficulty: 'Board Level',
    questionEn: 'A 71-year-old male with hypertension suffers a transient ischemic attack (TIA) manifesting as transient right arm weakness and expressive aphasia lasting 20 minutes, fully resolving. Duplex ultrasound and confirmatory CTA demonstrate an 85% ulcerated stenosis of the left internal carotid artery (NASCET criteria). According to international guidelines, what is the optimal surgical timing for Carotid Endarterectomy (CEA)?',
    questionAr: 'رجل يبلغ 71 عاماً أصيب بنوبة نقص تروية عابرة (TIA) تجلت بضعف مؤقت في الذراع الأيمن وصعوبة التعبير استمرت 20 دقيقة وزالت تماماً. أظهر التصوير تضيقاً بنسبة 85% مع قرحة في الشريان السباتي الداخلي الأيسر (معايير NASCET). ما هو التوقيت الجراحي الأمثل لاستئصال باطنة السباتي (CEA) وفق الإرشادات العالمية؟',
    options: [
      { id: 'A', textEn: 'Delay for at least 6 to 8 weeks to allow cerebral edema stabilization', textAr: 'تأجيل الجراحة لمدة 6 إلى 8 أسابيع لاستقرار الوذمة الدماغية' },
      { id: 'B', textEn: 'Perform CEA urgently within 14 days of symptom onset (ideally within 48-72 hours if neurologically stable)', textAr: 'إجراء الجراحة خلال 14 يوماً من ظهور الأعراض (ويفضل خلال 48-72 ساعة عند استقرار الحالة)' },
      { id: 'C', textEn: 'Perform immediate bilateral carotid endarterectomy under systemic thrombolysis', textAr: 'إجراء جراحة فورية للطرفين تحت إذابة الخثرة الجهازية' },
      { id: 'D', textEn: 'Medical therapy with aspirin alone; surgery is contraindicated above age 70', textAr: 'العلاج الدوائي بالأسبرين فقط؛ الجراحة مضاد استطباب فوق سن 70' },
      { id: 'E', textEn: 'Wait until the stenosis progresses to 100% total occlusion', textAr: 'الانتظار حتى يصل التضيق إلى انسداد كامل 100%' }
    ],
    correctAnswer: 'B',
    explanationEn: 'For patients with symptomatic 70-99% carotid stenosis, the risk of recurrent disabling or fatal stroke is highest in the first few days to weeks (up to 20% in the first 14 days). European (ESVS) and American (SVS) guidelines strongly recommend CEA within 14 days of symptom onset, and ideally within 48 to 72 hours for neurologically stable patients after TIA or non-disabling stroke.',
    explanationAr: 'في مرضى تضيق الشريان السباتي العرضي 70-99%، يكون خطر تكرار السكتة الدماغية المميتة أو المعيقة في أعلى مستوياته خلال الأسبوعين الأولين (يصل إلى 20%). توصي الإرشادات العالمية بقوة بإجراء CEA خلال 14 يوماً من بدء الأعراض، ومثالياً خلال 48-72 ساعة للمرضى المستقرين عصبياً.',
    surgicalPearls: 'Once the internal carotid artery becomes 100% chronically occluded, the window for CEA is lost because the distal internal carotid artery collapses, thromboses to the ophthalmic artery, and revascularization carries catastrophic hyperperfusion/hemorrhagic stroke risk.',
    referenceCitation: "ESVS 2023 Guidelines on Carotid Disease, Recommendation 3.2; Rutherford's 10th Ed., Chapter 96, Page 2195"
  },
  {
    id: 'mcq-fasciotomy-04',
    topic: 'Compartment Syndrome and Fasciotomy Anatomy',
    category: 'Trauma',
    difficulty: 'Resident',
    questionEn: 'During a standard two-incision, four-compartment lower leg fasciotomy, the lateral skin incision is placed midway between the fibular head and lateral malleolus. Which nerve is most susceptible to direct iatrogenic injury if the incision or fascial dissection is carried too far anteriorly or distally?',
    questionAr: 'أثناء إجراء بضع اللفافة للأربع حجرات بالساق عبر شقين جراحيين، يوضع الشق الوحشي في منتصف المسافة بين رأس الشظية والكعب الوحشي. أي عصب هو الأكثر عرضة للإصابة الجراحية المباشرة إذا امتد الشق للأمام أو للأسفل بشكل مفرط؟',
    options: [
      { id: 'A', textEn: 'Tibial nerve', textAr: 'العصب الظنبوبي (Tibial nerve)' },
      { id: 'B', textEn: 'Superficial peroneal (fibular) nerve', textAr: 'العصب الشظوي السطحي (Superficial peroneal nerve)' },
      { id: 'C', textEn: 'Saphenous nerve', textAr: 'العصب الصافن (Saphenous nerve)' },
      { id: 'D', textEn: 'Sural nerve', textAr: 'العصب الربلي (Sural nerve)' },
      { id: 'E', textEn: 'Femoral nerve', textAr: 'العصب الفخذي (Femoral nerve)' }
    ],
    correctAnswer: 'B',
    explanationEn: 'The superficial peroneal (fibular) nerve pierces the deep fascia of the lateral compartment in the distal third of the leg (approximately 10-12 cm above the lateral malleolus) to supply sensation to the dorsum of the foot. During the lateral incision (which releases both the anterior and lateral compartments across the intermuscular septum), placing the incision too far anteriorly or failing to identify this nerve risks transsecting it, resulting in sensory loss over the foot dorsum.',
    explanationAr: 'يخترق العصب الشظوي السطحي اللفافة العميقة للحجرة الوحشية في الثلث السفلي من الساق (حوالي 10-12 سم فوق الكعب الوحشي) ليغذي ظهر القدم حسياً. أثناء الشق الوحشي، يؤدي وضع الشق أمامياً بشكل مفرط أو عدم تمييز العصب إلى قطعه وفقدان إحساس ظهر القدم.',
    surgicalPearls: 'To safely decompress both anterior and lateral compartments via one lateral incision: identify the intermuscular septum dividing them, make a longitudinal transverse fascial entry 1 cm anterior to release the anterior compartment, and 1 cm posterior to release the lateral compartment.',
    referenceCitation: "Rutherford's Vascular Surgery 10th Ed., Chapter 112, Page 2485; ESVS 2024 ALI Guidelines, Section 7"
  },
  {
    id: 'mcq-wifi-05',
    topic: 'WIfI Classification for Diabetic Foot',
    category: 'Arterial',
    difficulty: 'Board Level',
    questionEn: 'A 59-year-old diabetic male presents with an ischemic heel ulcer exposing the calcaneus bone, measuring 3 cm in diameter with localized purulence and erythema extending 3.5 cm from the ulcer margin without fever or systemic signs. Non-invasive vascular assessment reveals an ankle-brachial index (ABI) of 1.45 due to non-compressible vessels, but toe pressure (TP) is 22 mmHg. What is the correct SVS WIfI staging for this patient?',
    questionAr: 'مريض سكري يبلغ 59 عاماً يعاني من قرحة إقفارية في العقب تكشف عظم العقب بقطر 3 سم مع صديد واحمرار يمتد 3.5 سم دون حمى أو علامات جهازية. أظهر التقييم الوعائي ABI بمقدار 1.45 بسبب تكلس الشرايين، ولكن ضغط إصبع القدم (Toe Pressure) هو 22 مم زئبق. ما هو تصنيف WIfI الصحيح؟',
    options: [
      { id: 'A', textEn: 'Wound 1, Ischemia 0, foot Infection 1', textAr: 'Wound 1, Ischemia 0, foot Infection 1' },
      { id: 'B', textEn: 'Wound 2, Ischemia 1, foot Infection 2', textAr: 'Wound 2, Ischemia 1, foot Infection 2' },
      { id: 'C', textEn: 'Wound 3, Ischemia 3, foot Infection 2', textAr: 'Wound 3, Ischemia 3, foot Infection 2' },
      { id: 'D', textEn: 'Wound 0, Ischemia 2, foot Infection 3', textAr: 'Wound 0, Ischemia 2, foot Infection 3' },
      { id: 'E', textEn: 'Wound 2, Ischemia 3, foot Infection 1', textAr: 'Wound 2, Ischemia 3, foot Infection 1' }
    ],
    correctAnswer: 'C',
    explanationEn: 'Wound Grade 3: Deep ulcer involving the heel/hindfoot with exposed bone or deep structure. Ischemia Grade 3: Because medial calcinosis makes the ABI artifactually elevated (>1.40), toe pressure is used; TP < 30 mmHg corresponds to Grade 3 severe ischemia. foot Infection Grade 2: Local erythema > 2 cm or involving deep tissues (bone/calcaneus), but lacking systemic SIRS criteria (fever, leukocytosis, tachycardia). Overall: W3, I3, fI2 represents Clinical Stage 4 (very high 1-year amputation risk, mandatory emergent revascularization and drainage).',
    explanationAr: 'الجرح (Wound 3): قرحة عميقة تشمل العقب وتكشف العظم. التروية (Ischemia 3): نظراً لتكلس الشرايين وارتفاع ABI الكاذب (>1.40)، نعتمد ضغط إصبع القدم (TP < 30 مم زئبق) وهي الدرجة 3 (نقص تروية شديد). العدوى (foot Infection 2): احمرار موضعي > 2 سم مع إصابة العظم دون علامات جهازية SIRS. المحصلة W3, I3, fI2 تمثل المرحلة السريرية 4.',
    surgicalPearls: 'Never rely on ABI in patients with longstanding diabetes or end-stage renal disease. Always obtain Toe Pressure (TP) or TcPO2 to grade ischemia accurately.',
    referenceCitation: "Global Vascular Guidelines on CLTI (2023), Chapter 3, Page 32; Rutherford's 10th Ed., Ch. 64"
  }
];
