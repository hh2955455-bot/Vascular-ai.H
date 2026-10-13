import { ReferenceDocument } from '../types';

export const INITIAL_REFERENCES: ReferenceDocument[] = [
  {
    id: 'esvs-ali-2024',
    title: 'European Society for Vascular Surgery (ESVS) 2024 Clinical Practice Guidelines on the Management of Acute Limb Ischemia',
    shortTitle: 'ESVS 2024 ALI Guidelines',
    edition: '2024 Official Guidelines',
    authors: 'ESVS Acute Limb Ischemia Writing Committee (Eur J Vasc Endovasc Surg 2024)',
    year: 2024,
    type: 'guideline',
    coverColor: 'from-emerald-700 to-teal-900',
    status: 'ready',
    totalPages: 96,
    chaptersCount: 4,
    chunksCount: 4,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Definition, Diagnosis, and Clinical Staging of ALI',
        titleAr: 'التعريف والتشخيص والمراحل السريرية لإقفار الأطراف الحاد',
        pageStart: 5,
        pageEnd: 18,
        keyTopics: ['Definition: <14 days symptom duration', 'Duplex Ultrasound as Primary Bedside Tool', 'CTA vs Digital Subtraction Angiography']
      },
      {
        chapterNumber: 2,
        title: 'Initial Medical Stabilization and Anticoagulation Strategies',
        titleAr: 'التثبيت الطبي الأولي واستراتيجيات مضادات التخثر',
        pageStart: 19,
        pageEnd: 32,
        keyTopics: ['Unfractionated Heparin Titration', 'Weight-adjusted dosing', 'Analgesia and Hydration', 'Avoidance of Vasopressors']
      },
      {
        chapterNumber: 3,
        title: 'Revascularization Modalities: Surgical vs Endovascular',
        titleAr: 'طرق إعادة التروية: الجراحية مقابل التداخلية عبر القسطرة',
        pageStart: 33,
        pageEnd: 60,
        keyTopics: ['Open Surgical Embolectomy', 'Catheter-Directed Thrombolysis (CDT) in Class I & IIa', 'Percutaneous Mechanical Thrombectomy (PMT)', 'Hybrid Interventions']
      },
      {
        chapterNumber: 4,
        title: 'Compartment Syndrome and Four-Compartment Fasciotomy',
        titleAr: 'متلازمة الحجرات وبضع اللفافة للأربع حجرات',
        pageStart: 61,
        pageEnd: 78,
        keyTopics: ['Ischemia duration >6 hours', 'Tissue pressure >30 mmHg', 'Two-incision four-compartment fasciotomy technique']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-ali-01',
        document_id: 'esvs-ali-2024',
        document_title: 'ESVS 2024 ALI Guidelines',
        chapter: 'Initial Medical Stabilization and Anticoagulation Strategies',
        section: 'Anticoagulation in Suspected Acute Limb Ischemia',
        page_number: 22,
        content: 'Recommendation 4.1: In all patients with suspected or confirmed acute limb ischemia, immediate therapeutic anticoagulation with intravenous unfractionated heparin (UFH) is recommended upon initial medical contact (Class I, Level B). Weight-based bolus of 5,000 IU or 70-100 IU/kg followed by continuous infusion titrated to target activated partial thromboplastin time (aPTT) ratio of 2.0-2.5 or anti-Xa levels of 0.3-0.7 IU/mL should be commenced without waiting for imaging. Anticoagulation arrests thrombus propagation and preserves distal microcirculatory runoff.',
        contentAr: 'توصية 4.1 (ESVS 2024): في جميع المرضى الذين يشتبه في إصابتهم أو تأكدت إصابتهم بإقفار الأطراف الحاد، يوصى بالبدء الفوري بمضادات التخثر العلاجية باستخدام الهيبارين غير المجزأ وريدياً عند أول تواصل طبي (فئة I، مستوى دليل B). تبدأ جرعة تحميل 5000 وحدة أو 70-100 وحدة/كغ متبوعة بضخ مستمر لمعايرة aPTT بين 2.0-2.5 دون انتظار التصوير الشعاعي لمنع انتشار الخثرة وحماية التروية الدقيقة.',
        tags: ['ESVS', 'ALI', 'Heparin', 'Guidelines', 'Class I', 'Anticoagulation']
      },
      {
        chunk_id: 'esvs-ali-02',
        document_id: 'esvs-ali-2024',
        document_title: 'ESVS 2024 ALI Guidelines',
        chapter: 'Revascularization Modalities: Surgical vs Endovascular',
        section: 'Selection of Revascularization Modality',
        page_number: 38,
        content: 'Recommendation 5.3: For patients with Rutherford Category IIb (immediately threatened limb with motor deficit), emergency open surgical revascularization (embolectomy or bypass) is recommended as first-line therapy over catheter-directed thrombolysis (Class I, Level A). Catheter-directed thrombolysis requires 12 to 24 hours to achieve significant clot lysis, which exceeds the ischemic tolerance of skeletal muscle (irreversible damage begins after 4 to 6 hours of profound ischemia). In Category I and selected IIa cases with thrombotic etiology in native atherosclerotic vessels, CDT or percutaneous mechanical thrombectomy is a safe alternative (Class IIa, Level B).',
        contentAr: 'توصية 5.3 (ESVS 2024): للمرضى من فئة رذرفورد IIb (الطرف المهدد فوراً مع وجود عجز حركي)، يوصى بإجراء إعادة التروية الجراحية المفتوحة الطارئة كخط أول مفضل على إذابة الخثرة عبر القسطرة (فئة I، مستوى دليل A). تحتاج إذابة الخثرة بالقسطرة من 12 إلى 24 ساعة، وهو ما يتجاوز قدرة العضلات الهيكلية على تحمل الإقفار (حيث يبدأ التلف غير القابل للإصلاح بعد 4 إلى 6 ساعات).',
        tags: ['ESVS', 'ALI', 'Embolectomy', 'Thrombolysis', 'Class I', 'Rutherford IIb']
      },
      {
        chunk_id: 'esvs-ali-03',
        document_id: 'esvs-ali-2024',
        document_title: 'ESVS 2024 ALI Guidelines',
        chapter: 'Compartment Syndrome and Four-Compartment Fasciotomy',
        section: 'Prophylactic and Therapeutic Fasciotomy',
        page_number: 65,
        content: 'Recommendation 7.2: Fasciotomy of all four lower leg compartments (anterior, lateral, superficial posterior, deep posterior) via a dual-incision approach is recommended in patients undergoing revascularization after >4-6 hours of warm ischemia, or in the presence of tense swollen compartments, calf pain on passive stretch, or intracompartmental pressure within 30 mmHg of diastolic blood pressure (Class I, Level B). Lateral incision releases the anterior and lateral compartments (careful to avoid the superficial peroneal nerve), and medial incision releases the superficial and deep posterior compartments (detaching the soleus bridge from the tibia to decompress the deep flexor compartment).',
        contentAr: 'توصية 7.2 (ESVS 2024): يوصى بإجراء بضع اللفافة لجميع حجرات الساق الأربع (الأمامية، الوحشية، الخلفية السطحية، والخلفية العميقة) عبر شقين جراحيين للمرضى الذين أُعيدت لهم التروية بعد أكثر من 4-6 ساعات من الإقفار الحاد الدافئ، أو عند وجود توتر في الحجرات أو ألم مع الشد الخامل لعضلات الساق (فئة I، مستوى دليل B).',
        tags: ['ESVS', 'Fasciotomy', 'Compartment Syndrome', 'Reperfusion', 'Surgical Technique']
      },
      {
        chunk_id: 'esvs-ali-04',
        document_id: 'esvs-ali-2024',
        document_title: 'ESVS 2024 ALI Guidelines',
        chapter: 'Definition, Diagnosis, and Clinical Staging of ALI',
        section: 'Rutherford Clinical Staging Criteria',
        page_number: 14,
        content: 'Rutherford Classification in ESVS 2024 Guidelines:\n- Class I (Viable): No sensory loss, no motor weakness, audible arterial and venous Doppler signals.\n- Class IIa (Marginally Threatened): Minimal sensory loss in digits, no motor weakness, inaudible arterial Doppler, audible venous Doppler.\n- Class IIb (Immediately Threatened): Sensory loss extending proximal to digits with rest pain, motor impairment (foot drop, toe weakness), inaudible arterial Doppler, audible venous Doppler. Emergency intervention mandatory.\n- Class III (Irreversible): Profound sensory loss, profound muscle paralysis with rigor/rigidity, inaudible arterial and venous signals. Primary amputation recommended to prevent fatal reperfusion hyperkalemia and myoglobinuria.',
        contentAr: 'تصنيف رذرفورد وفقاً لإرشادات ESVS 2024:\n- الفئة الأولى (قابلة للحياة): لا يوجد فقدان حسي أو حركي، دوبلر الشرايين والأوردة مسموع.\n- الفئة IIa (مهددة هامشياً): فقدان حسي طفيف بأصابع القدم دون ضعف حركي، دوبلر الشريان غير مسموع ودوبلر الوريد مسموع.\n- الفئة IIb (مهددة فوراً): خدر حسي يتجاوز الأصابع مع ضعف حركي (سقوط القدم أو عجز حركة الأصابع)، دوبلر الشريان غير مسموع ودوبلر الوريد مسموع. التدخل الطارئ إلزامي.\n- الفئة III (غير قابلة للاسترداد): شلل تام مع تيبس خشبي وفقدان حسي عميق، دوبلر الشرايين والأوردة صامت. يوصى بالبتر الأولي لتجنب متلازمة إعادة التروية القاتلة والقصور الكلوي بالميوغلوبين.',
        tags: ['ESVS', 'Rutherford Classification', 'ALI', 'Clinical Staging']
      }
    ]
  },
  {
    id: 'esvs-aaa-2024',
    title: 'European Society for Vascular Surgery (ESVS) 2024 Clinical Practice Guidelines on Abdominal Aortic Aneurysms',
    shortTitle: 'ESVS 2024 AAA Guidelines',
    edition: '2024 Official Guidelines',
    authors: 'ESVS Abdominal Aortic Aneurysm Guidelines Writing Committee (Eur J Vasc Endovasc Surg)',
    year: 2024,
    type: 'guideline',
    coverColor: 'from-amber-700 to-red-950',
    status: 'ready',
    totalPages: 112,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Screening, Surveillance Intervals, and Elective Repair Thresholds',
        titleAr: 'برامج المسح وفترات المراقبة ومعايير التدخل الجراحي الاختياري',
        pageStart: 12,
        pageEnd: 35,
        keyTopics: ['Ultrasound screening in men aged >=65', 'Surveillance intervals by diameter', 'Threshold 5.5 cm men / 5.0 cm women', 'Rapid expansion >10 mm/year']
      },
      {
        chapterNumber: 2,
        title: 'Thresholds and Anatomical Suitability for EVAR vs Open Repair',
        titleAr: 'الملاءمة التشريحية لـ EVAR مقابل الجراحة المفتوحة',
        pageStart: 36,
        pageEnd: 68,
        keyTopics: ['Neck length >=10-15 mm', 'Neck angulation <=60 degrees', 'Severe neck calcification & thrombus', 'Iliac access vessels']
      },
      {
        chapterNumber: 3,
        title: 'Management of Ruptured AAA: Permissive Hypotension and EVAR-First Strategy',
        titleAr: 'تدبير تمزق الأورطي البطني: هبوط الضغط المسموح به واستراتيجية EVAR أولاً',
        pageStart: 69,
        pageEnd: 98,
        keyTopics: ['Target systolic BP 70-90 mmHg', 'Local anesthesia for EVAR cutdown', 'Aortic occlusion balloon (REBOA)', 'Endoleak surveillance']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-aaa-01',
        document_id: 'esvs-aaa-2024',
        document_title: 'ESVS 2024 AAA Guidelines',
        chapter: 'Screening, Surveillance Intervals, and Elective Repair Thresholds',
        section: 'Elective Intervention Thresholds',
        page_number: 28,
        content: 'Recommendation 3.2: Elective repair of asymptomatic abdominal aortic aneurysms (AAA) is recommended when maximum outer-to-outer diameter reaches >=5.5 cm in men and >=5.0 cm in women (Class I, Level A). The lower threshold for women is based on significantly higher rupture risk (up to 4-fold) at comparable diameters. Intervention is also indicated for rapid expansion (>10 mm in 1 year or >5 mm in 6 months) or any symptomatic aneurysm presentation. Routine surveillance: 3.0-3.9 cm every 3 years; 4.0-4.9 cm annually; 5.0-5.4 cm every 3-6 months.',
        contentAr: 'توصية 3.2 (ESVS 2024): يوصى بإجراء الترميم الاختياري لتمدد الأورطي البطني غير المصحوب بأعراض عند بلوغ القطر الخارجي الأقصى >= 5.5 سم للرجال و >= 5.0 سم للنساء (فئة I، مستوى دليل A). يُعزى الحد الأدنى المنخفض للنساء لارتفاع خطر التمزق بأربعة أضعاف عند نفس القطر. كما يستطب التدخل عند التوسع السريع (>10 مم في السنة أو >5 مم في 6 أشهر) أو عند ظهور أي أعراض.',
        tags: ['ESVS', 'AAA', 'Thresholds', 'Screening', 'Rupture Risk']
      },
      {
        chunk_id: 'esvs-aaa-02',
        document_id: 'esvs-aaa-2024',
        document_title: 'ESVS 2024 AAA Guidelines',
        chapter: 'Management of Ruptured AAA: Permissive Hypotension and EVAR-First Strategy',
        section: 'Permissive Hypotension and Hypotensive Resuscitation',
        page_number: 74,
        content: 'Recommendation 6.1: In patients with suspected or proven ruptured AAA (rAAA), "permissive hypotension" (targeting systolic blood pressure of 70 to 90 mmHg while preserving cerebral mentation) is recommended until surgical or endovascular proximal aortic control is achieved (Class I, Level B). Aggressive fluid resuscitation is harmful as it disrupts retroperitoneal tamponade clots and dilutes coagulation factors. In anatomically suitable patients, an "EVAR-first" approach is recommended over open surgery (Class I, Level B), often utilizing an intra-aortic occlusion balloon (REBOA).',
        contentAr: 'توصية 6.1 (ESVS 2024): في المرضى الذين يشتبه بإصابتهم بتمزق الأورطي البطني (rAAA)، يوصى باتباع استراتيجية "هبوط الضغط المسموح به" (Permissive Hypotension) باستهداف ضغط دم انقباضي 70 إلى 90 مم زئبق مع الحفاظ على الوعي حتى السيطرة على الأورطي جراحياً (فئة I، مستوى دليل B). تجنب الإفراط في إعطاء السوائل الوريدية لمنع تفكك خثرة الدك وتفاقم النزف.',
        tags: ['ESVS', 'rAAA', 'Permissive Hypotension', 'REBOA', 'Emergency']
      },
      {
        chunk_id: 'esvs-aaa-03',
        document_id: 'esvs-aaa-2024',
        document_title: 'ESVS 2024 AAA Guidelines',
        chapter: 'Thresholds and Anatomical Suitability for EVAR vs Open Repair',
        section: 'Endoleak Classification and Management',
        page_number: 55,
        content: 'Endoleak Management following EVAR:\n- Type I: Attachment site seal failure (IA: proximal aortic neck, IB: distal iliac landing zone). High pressure directly transmitted to aneurysm sac. Urgent endovascular or open intervention required (cuff extension, balloon dilatation, stent-graft, or open conversion).\n- Type II: Retrograde branch vessel flow (lumbar arteries, IMA). Conservative surveillance unless aneurysm sac expands by >5 mm.\n- Type III: Modular disconnection or graft fabric defect. High pressure; mandates urgent intervention.\n- Type IV: Fabric porosity (self-limiting within 24-48 hours).\n- Type V: Endotension (continued sac expansion without visible flow).',
        contentAr: 'تدبير التسريب الداخلي (Endoleak) بعد دعامات الأورطي (EVAR):\n- النوع الأول (Type I): فشل الإغلاق في موقع التثبيت (IA في العنق، IB في الشريان الحرقفي). ينقل الضغط العالي مباشرة للكيس ويتطلب تدخلاً عاجلاً (وصلة تمديد أو دعامة إضافية).\n- النوع الثاني (Type II): تدفق عكسي من الفروع (الشرايين القطنية أو المساريقي السفلي). يُراقب ما لم يتوسع الكيس بأكثر من 5 مم.\n- النوع الثالث (Type III): انفصال أجزاء الدعامة أو تلف النسيج. يتطلب تدخلاً عاجلاً.\n- النوع الرابع (Type IV): مسامية النسيج المؤقتة.\n- النوع الخامس (Type V): زيادة الضغط داخل الكيس دون تسريب مرئي (Endotension).',
        tags: ['ESVS', 'EVAR', 'Endoleak', 'Aorta', 'Complications']
      }
    ]
  },
  {
    id: 'esvs-carotid-2023',
    title: 'European Society for Vascular Surgery (ESVS) 2023 Clinical Practice Guidelines on the Management of Atherosclerotic Carotid and Vertebral Artery Disease',
    shortTitle: 'ESVS 2023 Carotid Guidelines',
    edition: '2023 Official Guidelines',
    authors: 'ESVS Carotid and Vertebral Artery Disease Writing Committee (Eur J Vasc Endovasc Surg 2023)',
    year: 2023,
    type: 'guideline',
    coverColor: 'from-blue-700 to-indigo-900',
    status: 'ready',
    totalPages: 98,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Symptomatic Carotid Stenosis: NASCET Criteria and Optimal Timing',
        titleAr: 'تضيق السباتي المصحوب بأعراض: معايير NASCET والتوقيت المثالي',
        pageStart: 8,
        pageEnd: 32,
        keyTopics: ['NASCET 70-99% Stenosis', 'NASCET 50-69% Stenosis', 'Early intervention <14 days after TIA/Stroke', 'Dual antiplatelet therapy']
      },
      {
        chapterNumber: 2,
        title: 'Carotid Endarterectomy (CEA) vs Carotid Artery Stenting (CAS)',
        titleAr: 'استئصال باطنة الشريان السباتي مقابل وضع الدعامة',
        pageStart: 33,
        pageEnd: 64,
        keyTopics: ['CEA preferred in patients >=70 years', 'CAS in hostile neck or previous radiation', 'Embolic protection devices', 'TCAR']
      },
      {
        chapterNumber: 3,
        title: 'Surgical Pearls, Cranial Nerve Hazards, and Shunting Criteria',
        titleAr: 'التقنيات الجراحية وحماية الأعصاب القحفية ومعايير التحويلة',
        pageStart: 65,
        pageEnd: 88,
        keyTopics: ['Hypoglossal nerve (CN XII) anatomy', 'Vagus nerve (CN X)', 'Marginal mandibular nerve (CN VII)', 'Patch angioplasty vs Eversion CEA']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-carotid-01',
        document_id: 'esvs-carotid-2023',
        document_title: 'ESVS 2023 Carotid Guidelines',
        chapter: 'Symptomatic Carotid Stenosis: NASCET Criteria and Optimal Timing',
        section: 'Timing of Intervention and Stenosis Thresholds',
        page_number: 18,
        content: 'Recommendation 2.1: In patients with recent (within 6 months) symptomatic 70-99% internal carotid artery stenosis according to NASCET criteria, Carotid Endarterectomy (CEA) is strongly recommended (Class I, Level A). In patients with 50-69% stenosis, CEA is recommended for selected patients (Class IIa, Level A). Recommendation 2.2: It is strongly recommended that revascularization be performed as soon as possible, and ideally within 14 days of symptom onset (TIA or non-disabling stroke) (Class I, Level A). Delay beyond 14 days significantly reduces stroke prevention benefit.',
        contentAr: 'توصية 2.1 (ESVS 2023): في المرضى المصابين بتضيق سباتي عرضي حديث (خلال 6 أشهر) بنسبة 70-99% وفق معايير NASCET، يوصى بشدة بإجراء استئصال باطنة الشريان السباتي CEA (فئة I، مستوى دليل A). وبالنسبة للتضيق 50-69% يوصى بالجراحة لمرضى مختارين (فئة IIa). توصية 2.2: يوصى بشدة بإجراء إعادة التروية بأسرع ما يمكن، ومثالياً خلال 14 يوماً من ظهور الأعراض (فئة I، مستوى دليل A) لأن التأخير يقلل بشكل حاد من فائدة الوقاية من السكتة الدماغية.',
        tags: ['ESVS', 'Carotid', 'CEA', 'NASCET', 'Stroke Prevention']
      },
      {
        chunk_id: 'esvs-carotid-02',
        document_id: 'esvs-carotid-2023',
        document_title: 'ESVS 2023 Carotid Guidelines',
        chapter: 'Carotid Endarterectomy (CEA) vs Carotid Artery Stenting (CAS)',
        section: 'Modality Selection: CEA versus CAS',
        page_number: 45,
        content: 'Recommendation 3.4: In symptomatic patients aged >=70 years undergoing carotid revascularization, CEA is recommended over CAS due to significantly lower procedural stroke and death rates with CEA (Class I, Level A). In patients with high surgical risk (hostile neck, history of cervical neck irradiation, radical neck dissection, tracheostomy, or restenosis after prior CEA), CAS is recommended as an alternative to open surgery (Class IIa, Level B). When CAS is performed, the use of embolic protection devices (distal filter or transcarotid flow reversal TCAR) is recommended.',
        contentAr: 'توصية 3.4 (ESVS 2023): في المرضى العرضيين الذين تبلغ أعمارهم 70 عاماً أو أكثر، يوصى بإجراء CEA بدلاً من الدعامة CAS نظراً لانخفاض معدلات السكتة والوفاة أثناء الجراحة (فئة I، مستوى دليل A). في المرضى ذوي الخطورة الجراحية العالية (عنق معاد أو تشعيع سابق أو وذمة أو إعادة تضيق)، يوصى بالدعامة CAS كبديل (فئة IIa). عند استخدام الدعامة، يجب استخدام أجهزة حماية الصمات.',
        tags: ['ESVS', 'CEA vs CAS', 'Carotid Stenting', 'Age Threshold']
      },
      {
        chunk_id: 'esvs-carotid-03',
        document_id: 'esvs-carotid-2023',
        document_title: 'ESVS 2023 Carotid Guidelines',
        chapter: 'Surgical Pearls, Cranial Nerve Hazards, and Shunting Criteria',
        section: 'Cranial Nerve Anatomy & Patch Angioplasty',
        page_number: 72,
        content: 'Recommendation 4.2: Routine patch angioplasty (autologous vein, Dacron, bovine pericardium, or PTFE) is recommended over primary closure during conventional CEA to reduce the risk of acute carotid occlusion and long-term restenosis (Class I, Level A). Eversion CEA is a safe alternative (Class I, Level A). Cranial Nerve Protection: Hypoglossal nerve (CN XII) is identified in the upper wound crossing the external carotid branches; division of the sternocleidomastoid artery allows mobilization. Vagus nerve (CN X) lies posterior in the carotid sheath. Marginal mandibular branch (CN VII) is safeguarded by placing incision along anterior border of SCM and curving posteriorly toward the mastoid process.',
        contentAr: 'توصية 4.2 (ESVS 2023): يوصى بإجراء الرقعة الوعائية Patch Angioplasty (وريدية أو داكرون أو غشاء التامور البقري) بدلاً من الإغلاق المباشر أثناء CEA لتقليل خطر الانسداد الحاد وإعادة التضيق (فئة I، مستوى دليل A). حماية الأعصاب القحفية: العصب تحت اللسان (CN XII) يمر أعلى الجرح، والعصب المبهم (CN X) يقع خلف الشريان في الغمد السباتي، والفرع الفكي الهامشي (CN VII) يُحمى بجعل الشق خلف زاوية الفك السفلي.',
        tags: ['ESVS', 'Cranial Nerves', 'Patch Angioplasty', 'Surgical Technique']
      }
    ]
  },
  {
    id: 'esvs-cvd-2022',
    title: 'European Society for Vascular Surgery (ESVS) 2022 Clinical Practice Guidelines on the Management of Chronic Venous Disease of the Lower Limbs',
    shortTitle: 'ESVS 2022 Venous Guidelines',
    edition: '2022 Official Guidelines',
    authors: 'ESVS Chronic Venous Disease Guidelines Writing Committee (Eur J Vasc Endovasc Surg 2022)',
    year: 2022,
    type: 'guideline',
    coverColor: 'from-cyan-700 to-blue-950',
    status: 'ready',
    totalPages: 88,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Clinical Assessment, Duplex Ultrasound, and CEAP Classification',
        titleAr: 'التقييم السريري، الدوبلكس، وتصنيف CEAP للأوردة',
        pageStart: 6,
        pageEnd: 28,
        keyTopics: ['CEAP C0 to C6', 'Pathologic reflux duration >0.5s superficial, >1.0s deep', 'Full standing duplex mapping']
      },
      {
        chapterNumber: 2,
        title: 'Endovenous Thermal Ablation vs Sclerotherapy vs Surgery',
        titleAr: 'الكي الحراري داخل الوريد مقابل الحقن الرغوي والجراحة المفتوحة',
        pageStart: 29,
        pageEnd: 58,
        keyTopics: ['Endovenous Laser (EVLA) and Radiofrequency (RFA) as 1st line', 'Ultrasound-Guided Foam Sclerotherapy (UGFS)', 'Tumescent anesthesia']
      },
      {
        chapterNumber: 3,
        title: 'Venous Ulceration, Compression Therapy, and Deep Venous Stenting',
        titleAr: 'القرح الوريدية، العلاج الضاغط، ودعامات الأوردة العميقة',
        pageStart: 59,
        pageEnd: 82,
        keyTopics: ['Early ablation in active ulcer (EVRA trial)', 'Compression >40 mmHg for C6', 'Iliac vein stenting for May-Thurner syndrome']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-cvd-01',
        document_id: 'esvs-cvd-2022',
        document_title: 'ESVS 2022 Venous Guidelines',
        chapter: 'Endovenous Thermal Ablation vs Sclerotherapy vs Surgery',
        section: 'First-Line Modality for Saphenous Incompetence',
        page_number: 35,
        content: 'Recommendation 3.1: For patients with Great Saphenous Vein (GSV) or Small Saphenous Vein (SSV) incompetence requiring treatment, endovenous thermal ablation (Endovenous Laser Ablation EVLA or Radiofrequency Ablation RFA) is recommended as the first-line treatment of choice over open surgical high ligation and stripping (Class I, Level A). Thermal ablation is associated with equivalent long-term occlusion rates, significantly less postoperative pain, faster return to normal activities, and fewer wound complications compared with open stripping.',
        contentAr: 'توصية 3.1 (ESVS 2022): للمرضى المصابين بقصور في الوريد الصافن الكبير (GSV) أو الصغير (SSV) يستوجب العلاج، يوصى بالكي الحراري داخل الوريد (الليزر EVLA أو التردد الحراري RFA) كخيار خط أول مفضل على الجراحة المفتوحة بالربط العالي والتجريد (فئة I، مستوى دليل A) نظراً لتطابق نسب الإغلاق طويلة الأمد وانخفاض الألم والعودة السريعة للعمل.',
        tags: ['ESVS', 'Venous', 'EVLA', 'RFA', 'Varicose Veins', 'Class I']
      },
      {
        chunk_id: 'esvs-cvd-02',
        document_id: 'esvs-cvd-2022',
        document_title: 'ESVS 2022 Venous Guidelines',
        chapter: 'Venous Ulceration, Compression Therapy, and Deep Venous Stenting',
        section: 'Early Endovenous Intervention in Active Venous Ulcers (C6)',
        page_number: 68,
        content: 'Recommendation 5.2: In patients with active venous leg ulceration (CEAP C6) and superficial venous reflux, early endovenous ablation of incompetent superficial veins is recommended within 2 weeks of presentation, in combination with multilayer compression therapy (Class I, Level A). This recommendation is grounded in the landmark EVRA trial, proving that early ablation significantly accelerates ulcer healing (median 56 days vs 82 days) and dramatically reduces recurrence rates without increasing procedural complication risk.',
        contentAr: 'توصية 5.2 (ESVS 2022): في المرضى المصابين بقرحة الساق الوريدية النشطة (CEAP C6) مع ارتجاع في الأوردة السطحية، يوصى بالكي الوريدي المبكر للأوردة السطحية القاصرة خلال أسبوعين من التشخيص بالتزامن مع الضمادات الضاغطة (فئة I، مستوى دليل A)، استناداً إلى تجربة EVRA التي أثبتت تسريع التئام القرحة وتقليل النكس.',
        tags: ['ESVS', 'Venous Ulcer', 'CEAP C6', 'EVRA Trial', 'Compression']
      },
      {
        chunk_id: 'esvs-cvd-03',
        document_id: 'esvs-cvd-2022',
        document_title: 'ESVS 2022 Venous Guidelines',
        chapter: 'Venous Ulceration, Compression Therapy, and Deep Venous Stenting',
        section: 'Deep Venous Obstruction and Iliac Vein Stenting',
        page_number: 76,
        content: 'Recommendation 6.4: In symptomatic patients with non-thrombotic iliac vein lesions (NIVL / May-Thurner syndrome) or post-thrombotic syndrome (PTS) causing severe outflow obstruction (luminal area reduction >=50% on intravascular ultrasound IVUS), endovascular venous stenting with dedicated self-expanding venous stents is recommended (Class IIa, Level B). IVUS is recommended over standard venography for sizing and lesion assessment.',
        contentAr: 'توصية 6.4 (ESVS 2022): في المرضى المصابين بأعراض ناتجة عن انضغاط الوريد الحرقفي (متلازمة ماي-تيرنر May-Thurner) أو متلازمة ما بعد الخثار (PTS) المسببة لانسداد حاد في التصريف (تضيق المساحة >=50% بموجات IVUS الصوتية داخل الوعاء)، يوصى بوضع دعامات وريدية ذاتية التمدد (فئة IIa، مستوى دليل B).',
        tags: ['ESVS', 'May-Thurner', 'Venous Stenting', 'IVUS', 'DVT']
      }
    ]
  },
  {
    id: 'esvs-vgi-2020',
    title: 'European Society for Vascular Surgery (ESVS) 2020 Clinical Practice Guidelines on the Management of Vascular Graft and Endograft Infections (VGI)',
    shortTitle: 'ESVS 2020 Graft Infection Guidelines',
    edition: '2020 Official Guidelines',
    authors: 'ESVS Vascular Graft and Endograft Infection Writing Committee (Eur J Vasc Endovasc Surg 2020)',
    year: 2020,
    type: 'guideline',
    coverColor: 'from-rose-800 to-red-950',
    status: 'ready',
    totalPages: 84,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Diagnostic Criteria and MAGIC Consensus Definition',
        titleAr: 'المعايير التشخيصية وتوافق MAGIC لعدوى الطعوم الوعائية',
        pageStart: 6,
        pageEnd: 26,
        keyTopics: ['MAGIC Major and Minor criteria', '18F-FDG PET-CT imaging', 'Microbiological tissue culture']
      },
      {
        chapterNumber: 2,
        title: 'Surgical Strategies: Total Graft Excision vs In-Situ Preservation',
        titleAr: 'الاستراتيجيات الجراحية: الاستئصال الكامل مقابل الحفاظ على الطعم',
        pageStart: 27,
        pageEnd: 54,
        keyTopics: ['Total graft removal as gold standard', 'Neo-Aortoiliac System (NAIS) with femoral veins', 'Cryopreserved arterial allografts', 'Rifampicin/Silver soaked Dacron']
      },
      {
        chapterNumber: 3,
        title: 'Aorto-Enteric Fistula and Prolonged Antimicrobial Protocols',
        titleAr: 'الناسور الأورطي المعوي وبروتوكولات المضادات الحيوية',
        pageStart: 55,
        pageEnd: 78,
        keyTopics: ['Primary vs Secondary Aorto-Enteric Fistula (AEF)', 'Herald bleed triage', 'Muscle flap coverage (Omentum / Rectus abdominis)']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-vgi-01',
        document_id: 'esvs-vgi-2020',
        document_title: 'ESVS 2020 Graft Infection Guidelines',
        chapter: 'Diagnostic Criteria and MAGIC Consensus Definition',
        section: 'MAGIC Diagnostic Criteria & PET-CT Imaging',
        page_number: 16,
        content: 'Recommendation 2.3: In patients with suspected vascular graft or endograft infection (VGI), the MAGIC (Management of Aortic Graft Infection Collaboration) criteria combining clinical/surgical, radiological, and microbiological criteria are recommended for diagnosis (Class I, Level B). Recommendation 2.7: 18F-FDG PET-CT integrated with contrast-enhanced CT is recommended as the diagnostic imaging modality of choice for suspected aortic graft/endograft infection when CT angiography is inconclusive or to assess the full metabolic extent of infection (Class I, Level B). Focal FDG uptake and high SUVmax are major diagnostic indicators.',
        contentAr: 'توصية 2.3 (ESVS 2020): في المرضى الذين يشتبه بإصابتهم بعدوى الطعوم الوعائية (VGI)، يوصى باعتماد معايير MAGIC التي تجمع بين الدلائل السريرية والشعاعية والميكروبيولوجية (فئة I، مستوى دليل B). توصية 2.7: يوصى بالتصوير المدمج 18F-FDG PET-CT كخيار تصوير مفضل لتشخيص عدوى طعوم الأورطي وتحديد مداها الأيضي (فئة I، مستوى دليل B).',
        tags: ['ESVS', 'VGI', 'Graft Infection', 'MAGIC Criteria', 'PET-CT']
      },
      {
        chunk_id: 'esvs-vgi-02',
        document_id: 'esvs-vgi-2020',
        document_title: 'ESVS 2020 Graft Infection Guidelines',
        chapter: 'Surgical Strategies: Total Graft Excision vs In-Situ Preservation',
        section: 'Total Excision & Autologous Reconstruction (NAIS)',
        page_number: 38,
        content: 'Recommendation 4.1: Complete surgical excision of the infected vascular prosthetic material is recommended as the cornerstone of treatment for intracavitary and extracavitary graft infections whenever feasible (Class I, Level B). In-situ reconstruction using autologous deep femoral/popliteal veins (Neo-Aortoiliac System - NAIS) or cryopreserved arterial allografts is recommended over prosthetic grafts to maximize resistance to recurrent reinfection (Class I, Level B). Rifampicin-soaked or silver-coated Dacron may be considered when autologous biological conduits are unavailable (Class IIb, Level C).',
        contentAr: 'توصية 4.1 (ESVS 2020): يوصى بالاستئصال الجراحي الكامل للطعم الوعائي الصناعي المصاب كحجر أساس للعلاج (فئة I، مستوى دليل B). وتفضل إعادة البناء الموضعي باستخدام الأوردة العميقة الذاتية للمريض (نظام NAIS عبر الأوردة الفخذية) أو الطعوم الشريانية المحفوظة بالتبريد بدلاً من الطعوم الصناعية لمنع تجدد العدوى (فئة I، مستوى دليل B).',
        tags: ['ESVS', 'VGI', 'NAIS', 'Graft Excision', 'Allograft']
      },
      {
        chunk_id: 'esvs-vgi-03',
        document_id: 'esvs-vgi-2020',
        document_title: 'ESVS 2020 Graft Infection Guidelines',
        chapter: 'Aorto-Enteric Fistula and Prolonged Antimicrobial Protocols',
        section: 'Secondary Aorto-Enteric Fistula (AEF) Emergency Protocol',
        page_number: 62,
        content: 'Recommendation 5.2: In patients presenting with gastrointestinal bleeding and a history of previous open or endovascular aortic surgery, Secondary Aorto-Enteric Fistula (AEF) should be presumed until proven otherwise. A minor initial "herald bleed" often precedes exsanguinating catastrophic hemorrhage. Immediate contrast CTA and urgent upper endoscopy are indicated. Coverage of the reconstructed aorta with vascularized tissue flaps (omental pedicle flap or rectus abdominis flap) is recommended to isolate the arterial repair from bowel and promote tissue perfusion.',
        contentAr: 'توصية 5.2 (ESVS 2020): في أي مريض يعاني من نزف هضمي ولديه تاريخ سابق لجراحة أو دعامات الأورطي، يجب افتراض وجود ناسور أورطي معوي ثانوي (AEF) حتى يثبت العكس. غالباً ما يسبق النزف الكارثي نزف أولي منذر (Herald Bleed). يستوجب ذلك إجراء أشعة مقطعية فورية، وتغطية الإصلاح الوعائي بسديلة ثربية (Omental Flap) لفصله تماماً عن الأمعاء.',
        tags: ['ESVS', 'AEF', 'Herald Bleed', 'Emergency', 'Omental Flap']
      }
    ]
  },
  {
    id: 'esvs-pad-clti-2024',
    title: 'European Society for Vascular Surgery (ESVS) 2024 Clinical Practice Guidelines on Peripheral Arterial Disease and Chronic Limb-Threatening Ischemia',
    shortTitle: 'ESVS 2024 PAD / CLTI Guidelines',
    edition: '2024 Official Guidelines',
    authors: 'ESVS PAD and CLTI Writing Committee (Eur J Vasc Endovasc Surg 2024)',
    year: 2024,
    type: 'guideline',
    coverColor: 'from-purple-800 to-slate-900',
    status: 'ready',
    totalPages: 130,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Definition, Hemodynamic Assessment, and WIfI Clinical Staging',
        titleAr: 'التعريف، التقييم الهيموديناميكي، وتصنيف WIfI السريري',
        pageStart: 8,
        pageEnd: 36,
        keyTopics: ['Ankle-Brachial Index (ABI)', 'Toe Pressure (TP) for diabetic medial calcinosis', 'TcPO2', 'WIfI staging']
      },
      {
        chapterNumber: 2,
        title: 'GLASS Anatomical Staging and Revascularization Strategy',
        titleAr: 'تصنيف GLASS التشريحي واستراتيجيات إعادة التروية',
        pageStart: 37,
        pageEnd: 82,
        keyTopics: ['Femoropopliteal and Infrapopliteal GLASS grading', 'Autologous saphenous vein bypass vs Endovascular', 'Target Artery Path (TAP)']
      },
      {
        chapterNumber: 3,
        title: 'Best Medical Therapy and Secondary Cardiovascular Prevention',
        titleAr: 'العلاج الطبي الأمثل والوقاية القلبية الوعائية الثانوية',
        pageStart: 83,
        pageEnd: 115,
        keyTopics: ['Dual antiplatelet / COMPASS protocol (Aspirin + Low-dose Rivaroxaban)', 'High-intensity statins', 'SGLT2 inhibitors and GLP-1 RA']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-pad-01',
        document_id: 'esvs-pad-clti-2024',
        document_title: 'ESVS 2024 PAD / CLTI Guidelines',
        chapter: 'Definition, Hemodynamic Assessment, and WIfI Clinical Staging',
        section: 'Hemodynamic Assessment & Medial Calcinosis',
        page_number: 22,
        content: 'Recommendation 2.4: In all patients with suspected Chronic Limb-Threatening Ischemia (CLTI), objective bedside hemodynamic assessment using Ankle-Brachial Index (ABI) and Toe Pressure (TP) or transcutaneous oxygen pressure (TcPO2) is recommended (Class I, Level B). In diabetic and elderly patients with incompressible calcified tibial vessels (ABI >1.40), Toe Pressure (TP <30 mmHg diagnostic of severe ischemia) is recommended as the primary diagnostic metric, as digital arteries rarely suffer from medial calcinosis.',
        contentAr: 'توصية 2.4 (ESVS 2024): في جميع المرضى الذين يشتبه بإصابتهم بنقص تروية الأطراف المزمن المهدد للحياة (CLTI)، يوصى بالتقييم الهيموديناميكي عبر قياس مؤشر الكاحل-العضد (ABI) وضغط إصبع القدم (Toe Pressure) أو أكسجين الجلد TcPO2 (فئة I، مستوى دليل B). في مرضى السكري وتكلس الشرايين الساقية (ABI >1.40)، يوصى بضغط إصبع القدم كمعيار تشخيصي أساسي.',
        tags: ['ESVS', 'CLTI', 'PAD', 'ABI', 'Toe Pressure', 'Medial Calcinosis']
      },
      {
        chunk_id: 'esvs-pad-02',
        document_id: 'esvs-pad-clti-2024',
        document_title: 'ESVS 2024 PAD / CLTI Guidelines',
        chapter: 'GLASS Anatomical Staging and Revascularization Strategy',
        section: 'Revascularization: Autologous Vein Bypass vs Endovascular',
        page_number: 56,
        content: 'Recommendation 4.2: For CLTI patients with long occlusions of the femoropopliteal or infrapopliteal segment (GLASS Stage III), surgical bypass using single-segment autologous great saphenous vein (GSV) is recommended in patients with acceptable operative risk (Class I, Level A). When autologous vein is unavailable, endovascular-first revascularization or prosthetic bypass with distal vein patch is recommended. In infrapopliteal disease, restoring straight-line pulsatile flow through the Target Artery Path (TAP) to the anatomical angiosome of the ulcer is strongly recommended.',
        contentAr: 'توصية 4.2 (ESVS 2024): لمرضى CLTI المصابين بانسدادات طويلة (تصنيف GLASS المرحلة III)، يوصى بالجراحة الالتفافية (Bypass) باستخدام الوريد الصافن الكبير الذاتي ذي القطعة الواحدة للمرضى ذوي الخطورة الجراحية المقبولة (فئة I، مستوى دليل A). وفي حال عدم توفر الوريد الذاتي، يفضل التدخل القسطري كخط أول.',
        tags: ['ESVS', 'CLTI', 'Bypass', 'GSV', 'Angiosome', 'GLASS']
      },
      {
        chunk_id: 'esvs-pad-03',
        document_id: 'esvs-pad-clti-2024',
        document_title: 'ESVS 2024 PAD / CLTI Guidelines',
        chapter: 'Best Medical Therapy and Secondary Cardiovascular Prevention',
        section: 'COMPASS Protocol: Dual Pathway Antithrombotic Therapy',
        page_number: 95,
        content: 'Recommendation 6.1: In patients with symptomatic peripheral arterial disease at low bleeding risk, dual pathway antithrombotic inhibition with low-dose rivaroxaban (2.5 mg twice daily) plus aspirin (100 mg once daily) is recommended to reduce major adverse cardiovascular events (MACE) and major adverse limb events (MALE) including amputation (Class I, Level A). Recommendation 6.3: High-intensity statin therapy (Atorvastatin 80 mg or Rosuvastatin 40 mg) targeting LDL-C <1.4 mmol/L (<55 mg/dL) is strongly recommended for all vascular disease patients.',
        contentAr: 'توصية 6.1 (ESVS 2024): في مرضى الشرايين الطرفية العرضيين ذوي الخطورة المنخفضة للنزف، يوصى بالجمع بين ريفاروكسابان بجرعة منخفضة (2.5 مجم مرتين يومياً) مع الأسبرين (100 مجم يومياً) للحد من الوفيات القلبية وبتر الأطراف (فئة I، مستوى دليل A). كما يوصى بجرعة قصوى من الستاتين لخفض الكوليسترول الضار LDL < 55 مجم/ديسيلتر.',
        tags: ['ESVS', 'COMPASS Protocol', 'Rivaroxaban', 'Statins', 'Cardiovascular Prevention']
      }
    ]
  },
  {
    id: 'esvs-taaa-2023',
    title: 'European Society for Vascular Surgery (ESVS) 2023 Clinical Practice Guidelines on the Management of Descending Thoracic and Thoracoabdominal Aortic Diseases',
    shortTitle: 'ESVS 2023 Thoracic & TAAA Guidelines',
    edition: '2023 Official Guidelines',
    authors: 'ESVS Thoracoabdominal Aorta Writing Committee (Eur J Vasc Endovasc Surg 2023)',
    year: 2023,
    type: 'guideline',
    coverColor: 'from-amber-800 to-stone-900',
    status: 'ready',
    totalPages: 118,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Uncomplicated vs Complicated Acute Type B Aortic Dissection (TBAD)',
        titleAr: 'تسلخ الأبهر الصدري الحاد من النوع B: غير المعقد مقابل المعقد',
        pageStart: 8,
        pageEnd: 38,
        keyTopics: ['Definition: refractory pain, hypertension, expansion >40mm', 'TEVAR in complicated TBAD (Class I)', 'Medical anti-impulse therapy (beta-blockers)']
      },
      {
        chapterNumber: 2,
        title: 'Thoracic Endovascular Aortic Repair (TEVAR) and Landing Zones',
        titleAr: 'الدعامات المغطاة للأبهر الصدري (TEVAR) ومناطق التثبيت الزونية',
        pageStart: 39,
        pageEnd: 74,
        keyTopics: ['Ishimaru aortic arch zones (Zone 0 to 4)', 'Left subclavian artery (LSA) revascularization', 'Oversizing 5-10% in dissection, 15-20% in aneurysm']
      },
      {
        chapterNumber: 3,
        title: 'Spinal Cord Ischemia Prevention and Cerebrospinal Fluid Drainage',
        titleAr: 'الوقاية من نقص تروية النخاع الشوكي ونزح السائل النخاعي (CSF)',
        pageStart: 75,
        pageEnd: 104,
        keyTopics: ['CSF drain target pressure <10 mmHg', 'MAP maintenance >80-90 mmHg', 'Motor evoked potentials (MEP) monitoring']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-taaa-01',
        document_id: 'esvs-taaa-2023',
        document_title: 'ESVS 2023 Thoracic & TAAA Guidelines',
        chapter: 'Uncomplicated vs Complicated Acute Type B Aortic Dissection (TBAD)',
        section: 'Indications for Emergency TEVAR in Acute Type B Dissection',
        page_number: 24,
        content: 'Recommendation 2.2: In patients with complicated acute Type B aortic dissection (presenting with persistent/refractory pain, uncontrolled hypertension, organ malperfusion, rapid aortic expansion >=40 mm, or rupture), emergency TEVAR is strongly recommended (Class I, Level B). In uncomplicated acute Type B dissection, optimal medical therapy (anti-impulse therapy using IV beta-blockers targeting SBP 100-120 mmHg and HR <60 bpm) is recommended as the foundation of initial treatment (Class I, Level B).',
        contentAr: 'توصية 2.2 (ESVS 2023): في المرضى المصابين بتسلخ الأبهر الصدري الحاد من النوع B المعقد (المترافق مع ألم معند، ارتفاع ضغط غير منضبط، نقص تروية حشوي أو طرفي، توسع سريع >= 40 مم، أو تمزق)، يوصى بشدة بإجراء TEVAR طارئ (فئة I، مستوى دليل B). وفي الحالات غير المعقدة، يُعتمد العلاج الطبي الخافض للنبض والضغط كعلاج أساسي.',
        tags: ['ESVS', 'TEVAR', 'Type B Dissection', 'Thoracic Aorta', 'Anti-impulse']
      },
      {
        chunk_id: 'esvs-taaa-02',
        document_id: 'esvs-taaa-2023',
        document_title: 'ESVS 2023 Thoracic & TAAA Guidelines',
        chapter: 'Thoracic Endovascular Aortic Repair (TEVAR) and Landing Zones',
        section: 'Left Subclavian Artery (LSA) Revascularization in Zone 2 TEVAR',
        page_number: 52,
        content: 'Recommendation 3.5: When the proximal landing zone requires intentional coverage of the left subclavian artery (Zone 2 landing), prophylactic LSA revascularization (via carotid-subclavian bypass or transposition) is recommended in elective patients to reduce the risks of posterior circulation stroke, spinal cord ischemia, and left arm claudication (Class IIa, Level B).',
        contentAr: 'توصية 3.5 (ESVS 2023): عندما تتطلب منطقة التثبيت القريبة تغطية الشريان تحت الترقوة الأيسر (المنطقة 2 Zone 2)، يوصى بإعادة تروية الشريان وقائياً (عبر مجازة سباتية-تحت ترقوية) في الحالات الاختيارية لتقليل مخاطر السكتة الدماغية ونقص تروية النخاع الشوكي (فئة IIa، مستوى دليل B).',
        tags: ['ESVS', 'TEVAR', 'LSA Revascularization', 'Zone 2', 'Carotid Subclavian Bypass']
      },
      {
        chunk_id: 'esvs-taaa-03',
        document_id: 'esvs-taaa-2023',
        document_title: 'ESVS 2023 Thoracic & TAAA Guidelines',
        chapter: 'Spinal Cord Ischemia Prevention and Cerebrospinal Fluid Drainage',
        section: 'Spinal Cord Ischemia Prevention Protocol',
        page_number: 88,
        content: 'Recommendation 5.1: Cerebrospinal fluid (CSF) drainage and maintenance of mean arterial pressure (MAP > 80-90 mmHg) are recommended in patients undergoing extensive thoracoabdominal repair (Crawford Extents I-III) or TEVAR covering >20 cm of thoracic aorta, to prevent and treat spinal cord ischemia and postoperative paraplegia (Class I, Level B). Target CSF drainage pressure is <=10 mmHg.',
        contentAr: 'توصية 5.1 (ESVS 2023): يوصى بنزح السائل النخاعي (CSF) والحفاظ على متوسط الضغط الشرياني (MAP > 80-90 مم زئبق) للمرضى الخاضعين لترميم أورطي صدري بطني واسع (تصنيف كروفورد I-III) أو TEVAR يغطي أكثر من 20 سم من الأبهر الصدري، للوقاية من نقص تروية النخاع الشوكي والشلل السفلي (فئة I، مستوى دليل B).',
        tags: ['ESVS', 'Spinal Cord Ischemia', 'CSF Drain', 'Crawford Classification', 'Paraplegia']
      }
    ]
  },
  {
    id: 'esvs-access-2023',
    title: 'European Society for Vascular Surgery (ESVS) 2023 Clinical Practice Guidelines on Vascular Access for Hemodialysis',
    shortTitle: 'ESVS 2023 Vascular Access Guidelines',
    edition: '2023 Official Guidelines',
    authors: 'ESVS Vascular Access Writing Committee (Eur J Vasc Endovasc Surg 2023)',
    year: 2023,
    type: 'guideline',
    coverColor: 'from-blue-900 to-teal-950',
    status: 'ready',
    totalPages: 92,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Pre-operative Vessel Mapping and Selection Strategy (Fistula First)',
        titleAr: 'تخطيط الأوعية الدموية قبل الجراحة واستراتيجية الناسور أولاً',
        pageStart: 6,
        pageEnd: 28,
        keyTopics: ['Cephalic vein minimum diameter >=2.0 mm (optimal >=2.5 mm)', 'Radial artery minimum diameter >=2.0 mm', 'Radiocephalic Cimino AVF as preferred initial site']
      },
      {
        chapterNumber: 2,
        title: 'Surgical Techniques and Maturation Criteria (Rule of 6s)',
        titleAr: 'التقنيات الجراحية ومعايير نضج الناسور (قاعدة الستات Rule of 6s)',
        pageStart: 29,
        pageEnd: 58,
        keyTopics: ['End-to-side anastomosis with 7-0 polypropylene', 'Rule of 6s: Flow >600 mL/min, Diameter >6 mm, Depth <6 mm at 6 weeks', 'Transposed Brachiobasilic AVF']
      },
      {
        chapterNumber: 3,
        title: 'Access Failure, Dialysis Steal Syndrome, and Central Venous Stenosis',
        titleAr: 'فشل مجرى الغسيل، متلازمة السرقة الدموية، وتضيق الأوردة المركزية',
        pageStart: 59,
        pageEnd: 84,
        keyTopics: ['Dialysis Access-Associated Steal Syndrome (DASS)', 'DRIL (Distal Revascularization Interval Ligation) procedure', 'Central vein stenosis post-catheterization']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-access-01',
        document_id: 'esvs-access-2023',
        document_title: 'ESVS 2023 Vascular Access Guidelines',
        chapter: 'Pre-operative Vessel Mapping and Selection Strategy (Fistula First)',
        section: 'Anatomical Criteria and Vessel Diameters for AVF Creation',
        page_number: 16,
        content: 'Recommendation 2.1: Pre-operative duplex ultrasound vessel mapping of both arms is recommended in all patients planned for hemodialysis access (Class I, Level A). A distal autologous radiocephalic arteriovenous fistula (RC-AVF) is recommended as the first choice when vein and artery diameters meet criteria (minimum internal diameter >=2.0 mm for cephalic vein and radial artery, ideally vein >=2.5 mm under tourniquet). Autologous fistulas demonstrate superior long-term patency and lower infection rates compared to prosthetic grafts.',
        contentAr: 'توصية 2.1 (ESVS 2023): يوصى بإجراء تخطيط الأوعية بالدوبلكس الصوتي لكلا الذراعين قبل الجراحة لجميع مرضى الغسيل الكلوي (فئة I، مستوى دليل A). يُعتبر الناسور الشرياني الوريدي الكعبري الرأسي (RC-AVF) الخيار الأول عند تحقق المعايير (القطر الداخلي الأدنى >= 2.0 مم للوريد والشريان، ومثالياً >= 2.5 مم للوريد مع رباط ضاغط).',
        tags: ['ESVS', 'AV Fistula', 'Vascular Access', 'Duplex Mapping', 'Dialysis']
      },
      {
        chunk_id: 'esvs-access-02',
        document_id: 'esvs-access-2023',
        document_title: 'ESVS 2023 Vascular Access Guidelines',
        chapter: 'Surgical Techniques and Maturation Criteria (Rule of 6s)',
        section: 'Maturation Evaluation: The Clinical Rule of 6s',
        page_number: 42,
        content: 'Recommendation 3.4: Surveillance of AVF maturation at 4 to 6 weeks using duplex ultrasound and clinical exam is recommended. The validated "Rule of 6s" defines adequate physiological maturation: blood flow volume >=600 mL/min, venous diameter >=6 mm, skin-to-vein depth <=6 mm, and cannulation straight segment >=6 cm (Class I, Level B). In non-maturing AVFs, salvage endovascular balloon angioplasty or surgical branch ligation is indicated.',
        contentAr: 'توصية 3.4 (ESVS 2023): يوصى بمراقبة نضج الناسور في الأسبوع 4 إلى 6 سريرياً وبالدوبلكس. تحدد "قاعدة الستات Rule of 6s" نضج الناسور: تدفق دم >= 600 مل/دقيقة، وقطر وريد >= 6 مم، وعمق عن الجلد <= 6 مم، وطول مستقيم مناسب للوخز >= 6 سم (فئة I، مستوى دليل B).',
        tags: ['ESVS', 'Rule of 6s', 'AVF Maturation', 'Duplex', 'Hemodialysis']
      },
      {
        chunk_id: 'esvs-access-03',
        document_id: 'esvs-access-2023',
        document_title: 'ESVS 2023 Vascular Access Guidelines',
        chapter: 'Access Failure, Dialysis Steal Syndrome, and Central Venous Stenosis',
        section: 'Management of Dialysis-Associated Steal Syndrome (DASS)',
        page_number: 70,
        content: 'Recommendation 4.8: In patients presenting with severe stage III-IV dialysis access-associated steal syndrome (ischemic rest pain, motor deficit, or digital ulceration/gangrene), surgical intervention is strongly recommended (Class I, Level B). The DRIL (Distal Revascularization Interval Ligation) procedure is recommended as the definitive gold standard to restore distal limb perfusion while maintaining functioning fistula flow. Minimally invasive banding or PAI (Proximalization of Arterial Inflow) are suitable alternatives.',
        contentAr: 'توصية 4.8 (ESVS 2023): في المرضى المصابين بمتلازمة سرقة تروية اليد الشديدة المرافقة للناسور (ألم الراحة الإقفاري، عجز حركي، أو تموت الأصابع)، يوصى بشدة بالتدخل الجراحي (فئة I، مستوى دليل B). تعد عملية DRIL المعيار الذهبي لاستعادة تروية اليد مع الحفاظ على الناسور شغّالاً.',
        tags: ['ESVS', 'Steal Syndrome', 'DASS', 'DRIL Procedure', 'Complications']
      }
    ]
  },
  {
    id: 'esvs-dvt-2021',
    title: 'European Society for Vascular Surgery (ESVS) 2021 Clinical Practice Guidelines on the Management of Venous Thrombosis',
    shortTitle: 'ESVS 2021 Venous Thrombosis Guidelines',
    edition: '2021 Official Guidelines',
    authors: 'ESVS Venous Thrombosis Writing Committee (Eur J Vasc Endovasc Surg 2021)',
    year: 2021,
    type: 'guideline',
    coverColor: 'from-blue-800 to-indigo-950',
    status: 'ready',
    totalPages: 104,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Diagnostic Algorithm and Anticoagulation Regimens (DOACs vs VKAs)',
        titleAr: 'الخوارزمية التشخيصية وأنظمة مضادات التخثر (DOACs مقابل الوارفارين)',
        pageStart: 8,
        pageEnd: 34,
        keyTopics: ['Compression ultrasonography (CUS) protocol', 'Direct Oral Anticoagulants (DOACs) as first-line', 'Duration: 3 months provoked vs extended unprovoked']
      },
      {
        chapterNumber: 2,
        title: 'Iliofemoral DVT and Catheter-Directed Thrombolysis (CDT)',
        titleAr: 'خثار الأوردة الحرقفية الفخذية وإذابة الخثرة عبر القسطرة (CDT)',
        pageStart: 35,
        pageEnd: 68,
        keyTopics: ['Early thrombus removal in symptomatic iliofemoral DVT <14 days', 'Catheter-directed thrombolysis (CDT) and pharmacomechanical thrombectomy (PMT)', 'Bleeding risk stratification']
      },
      {
        chapterNumber: 3,
        title: 'Post-Thrombotic Syndrome (PTS) and Iliac Vein Stenting',
        titleAr: 'متلازمة ما بعد الخثار (PTS) ودعامات الوريد الحرقفي',
        pageStart: 69,
        pageEnd: 96,
        keyTopics: ['Villalta scale scoring for PTS severity', 'Iliac vein stenting for residual post-thrombotic stenosis', 'Graduated compression stockings (GCS) indications']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-dvt-01',
        document_id: 'esvs-dvt-2021',
        document_title: 'ESVS 2021 Venous Thrombosis Guidelines',
        chapter: 'Diagnostic Algorithm and Anticoagulation Regimens (DOACs vs VKAs)',
        section: 'First-Line Anticoagulation with DOACs',
        page_number: 22,
        content: 'Recommendation 2.3: In patients with confirmed deep vein thrombosis (DVT) without contraindications, Direct Oral Anticoagulants (DOACs: apixaban, rivaroxaban, edoxaban, dabigatran) are recommended as first-line therapy over Vitamin K Antagonists (VKAs) (Class I, Level A). Standard regimens: Apixaban 10 mg twice daily for 7 days then 5 mg twice daily; or Rivaroxaban 15 mg twice daily for 21 days then 20 mg once daily. Therapeutic anticoagulation duration is recommended for a minimum of 3 months in provoked DVT (Class I, Level A).',
        contentAr: 'توصية 2.3 (ESVS 2021): في المرضى المصابين بخثار وريدي عميق مؤكد (DVT)، يوصى بمضادات التخثر الفموية المباشرة (DOACs: أبيكسابان، ريفاروكسابان) كخط علاج أول مفضل على الوارفارين (فئة I، مستوى دليل A). جرعات البدء: أبيكسابان 10 مجم مرتين يومياً لمدة 7 أيام ثم 5 مجم مرتين يومياً؛ أو ريفاروكسابان 15 مجم مرتين يومياً لمدة 21 يوماً ثم 20 مجم يومياً لمدة 3 أشهر على الأقل.',
        tags: ['ESVS', 'DVT', 'DOACs', 'Apixaban', 'Rivaroxaban', 'Anticoagulation']
      },
      {
        chunk_id: 'esvs-dvt-02',
        document_id: 'esvs-dvt-2021',
        document_title: 'ESVS 2021 Venous Thrombosis Guidelines',
        chapter: 'Iliofemoral DVT and Catheter-Directed Thrombolysis (CDT)',
        section: 'Catheter-Directed Thrombolysis in Acute Iliofemoral DVT',
        page_number: 48,
        content: 'Recommendation 3.2: In selected patients with acute first-episode iliofemoral DVT (symptom duration <14 days, low bleeding risk, good functional status, and severe limb swelling), early thrombus removal using Catheter-Directed Thrombolysis (CDT) or pharmacomechanical catheter-directed thrombectomy (PCDT) should be considered to reduce the incidence and severity of post-thrombotic syndrome (Class IIa, Level B). In Phlegmasia Cerulea Dolens (impending venous gangrene), urgent catheter intervention or surgical thrombectomy is mandatory (Class I, Level C).',
        contentAr: 'توصية 3.2 (ESVS 2021): في مرضى الخثار الحرقفي الفخذي الحاد (أعراض < 14 يوماً مع خطورة نزف منخفضة)، يوصى بالنظر في إزالة الخثرة المبكرة باستخدام القسطرة الموجهة لإذابة الخثرة (CDT) أو التفتيت الميكانيكي لتقليل متلازمة ما بعد الخثار (فئة IIa، مستوى دليل B). وفي حالات التهاب الوريد الأزرق المؤلم (Phlegmasia Cerulea Dolens)، يعد التدخل الطارئ إلزامياً.',
        tags: ['ESVS', 'Iliofemoral DVT', 'CDT', 'Thrombectomy', 'Phlegmasia']
      },
      {
        chunk_id: 'esvs-dvt-03',
        document_id: 'esvs-dvt-2021',
        document_title: 'ESVS 2021 Venous Thrombosis Guidelines',
        chapter: 'Post-Thrombotic Syndrome (PTS) and Iliac Vein Stenting',
        section: 'Post-Thrombotic Syndrome and Venous Stenting',
        page_number: 82,
        content: 'Recommendation 4.5: In patients suffering from moderate-to-severe post-thrombotic syndrome (Villalta score >=10 or venous claudication) caused by chronic iliofemoral venous obstruction, endovascular venous recanalization and stenting with dedicated self-expanding venous stents is recommended (Class IIa, Level B). Dedicated large-caliber stents (14-16 mm common iliac, 12-14 mm external iliac) restore venous outflow and provide sustained relief of pain and ulcer healing.',
        contentAr: 'توصية 4.5 (ESVS 2021): في المرضى المصابين بمتلازمة ما بعد الخثار المتوسطة إلى الشديدة (مقياس فيلالتا Villalta >= 10 أو العرج الوريدي) والناتجة عن انسداد مزمن في الأوردة الحرقفية الفخذية، يوصى بفتح الوريد ووضع دعامات وريدية متخصصة ذاتية التمدد (فئة IIa، مستوى دليل B).',
        tags: ['ESVS', 'PTS', 'Villalta Scale', 'Venous Stenting', 'May-Thurner']
      }
    ]
  },
  {
    id: 'esvs-mesenteric-2020',
    title: 'European Society for Vascular Surgery (ESVS) 2020 Clinical Practice Guidelines on the Management of Acute and Chronic Mesenteric Artery Disease',
    shortTitle: 'ESVS 2020 Mesenteric Guidelines',
    edition: '2020 Official Guidelines',
    authors: 'ESVS / ESTES Mesenteric Guidelines Writing Committee (Eur J Vasc Endovasc Surg 2020)',
    year: 2020,
    type: 'guideline',
    coverColor: 'from-amber-900 to-red-950',
    status: 'ready',
    totalPages: 86,
    chaptersCount: 3,
    chunksCount: 3,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Acute Mesenteric Ischemia (AMI): Etiology, Early CTA, and Biomarkers',
        titleAr: 'إقفار الأمعاء الحاد (AMI): الأسباب، الأشعة المقطعية المبكرة، والمؤشرات الحيوية',
        pageStart: 6,
        pageEnd: 28,
        keyTopics: ['Superior mesenteric artery (SMA) embolism vs thrombosis', 'Pain out of proportion to exam', 'Biphasic CTA with thin slices (<1 mm) as gold standard', 'Serum lactate elevation as late indicator']
      },
      {
        chapterNumber: 2,
        title: 'Emergency Revascularization: Open SMA Embolectomy vs Retrograde Stenting (ROMS)',
        titleAr: 'إعادة التروية الطارئة: استئصال الصمة جراحياً مقابل الدعامات الهجينة (ROMS)',
        pageStart: 29,
        pageEnd: 56,
        keyTopics: ['Immediate systemic heparinization', 'Transverse arteriotomy and Fogarty 3F/4F embolectomy', 'Retrograde Open Mesenteric Stenting (ROMS)', 'Assessment of bowel viability']
      },
      {
        chapterNumber: 3,
        title: 'Chronic Mesenteric Ischemia (CMI) and Intestinal Angina',
        titleAr: 'إقفار الأمعاء المزمن (CMI) والذبحة المعوية',
        pageStart: 57,
        pageEnd: 78,
        keyTopics: ['Postprandial pain and food fear with severe weight loss', 'Endovascular-first strategy with balloon-expandable covered stents', 'Median arcuate ligament syndrome (MALS)']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-mes-01',
        document_id: 'esvs-mesenteric-2020',
        document_title: 'ESVS 2020 Mesenteric Guidelines',
        chapter: 'Acute Mesenteric Ischemia (AMI): Etiology, Early CTA, and Biomarkers',
        section: 'Diagnostic Strategy and Urgent CTA in Acute Mesenteric Ischemia',
        page_number: 18,
        content: 'Recommendation 2.1: In patients with suspected acute mesenteric ischemia (characteristically presenting with severe abdominal pain out of proportion to physical exam findings), urgent biphasic contrast-enhanced computed tomography angiography (CTA) covering the chest, abdomen, and pelvis with thin slices (<=1 mm) is recommended without delay (Class I, Level A). Serum lactate is a marker of advanced transmural bowel necrosis and poor prognosis, and normal lactate should never rule out early ischemia.',
        contentAr: 'توصية 2.1 (ESVS 2020): في المرضى الذين يشتبه بإصابتهم بإقفار الأمعاء الحاد (المتميز بألم بطني شديد لا يتناسب مع نتائج الفحص السريري)، يوصى بإجراء أشعة مقطعية وعائية ثنائية الطور (CTA) عاجلة للبطن والحوض دون أي تأخير (فئة I، مستوى دليل A). لا ينفي اعتدال حمض اللاكتيك في الدم وجود الإقفار في مراحله المبكرة.',
        tags: ['ESVS', 'Acute Mesenteric Ischemia', 'AMI', 'CTA', 'Lactate', 'SMA']
      },
      {
        chunk_id: 'esvs-mes-02',
        document_id: 'esvs-mesenteric-2020',
        document_title: 'ESVS 2020 Mesenteric Guidelines',
        chapter: 'Emergency Revascularization: Open SMA Embolectomy vs Retrograde Stenting (ROMS)',
        section: 'Emergency Revascularization and Bowel Resection Protocol',
        page_number: 44,
        content: 'Recommendation 3.2: Immediate systemic anticoagulation with intravenous unfractionated heparin (5,000 IU bolus followed by continuous infusion) is recommended upon suspicion of acute mesenteric ischemia to prevent propagate thrombosis (Class I, Level B). In acute SMA embolism with peritoneal signs, emergency laparotomy combined with surgical SMA embolectomy using a Fogarty 3F catheter is recommended (Class I, Level B). Second-look laparotomy at 24 to 48 hours is strongly recommended to evaluate questionable bowel viability.',
        contentAr: 'توصية 3.2 (ESVS 2020): يوصى بالبدء الفوري بمضادات التخثر الوريدية بهيبارين غير مجزأ عند مجرد الاشتباه بالإقفار المعوي الحاد (فئة I، مستوى دليل B). عند وجود علامات تخريش صفاقي مع انصمام الشريان المساريقي العلوي، يوصى بفتح البطن الإسعافي واستئصال الصمة بقسطرة فوغارتي 3F (فئة I، مستوى دليل B). يوصى بإجراء فتح بطن ثانٍ استكشافي بعد 24-48 ساعة لتقييم حيوية الأمعاء المشكوك فيها.',
        tags: ['ESVS', 'SMA Embolectomy', 'Fogarty', 'Second Look', 'Laparotomy']
      },
      {
        chunk_id: 'esvs-mes-03',
        document_id: 'esvs-mesenteric-2020',
        document_title: 'ESVS 2020 Mesenteric Guidelines',
        chapter: 'Chronic Mesenteric Ischemia (CMI) and Intestinal Angina',
        section: 'Endovascular Revascularization in Chronic Mesenteric Ischemia',
        page_number: 68,
        content: 'Recommendation 4.3: In symptomatic patients with chronic mesenteric ischemia (presenting with postprandial abdominal pain, sitophobia / fear of eating, and unintentional weight loss), an endovascular-first revascularization strategy using balloon-expandable covered stents in the superior mesenteric artery is recommended over open mesenteric bypass (Class I, Level B). Balloon-expandable covered stents provide superior patency and freedom from reintervention compared with bare-metal stents.',
        contentAr: 'توصية 4.3 (ESVS 2020): في المرضى المصابين بإقفار الأمعاء المزمن (ألم بعد الطعام، خوف من الأكل، ونقص وزن ملحوظ)، يوصى بالتدخل القسطري كخط أول بوضع دعامات مغطاة قابلة للتمدد بالبالون في الشريان المساريقي العلوي (فئة I، مستوى دليل B). تفوق الدعامات المغطاة الدعامات المعدنية العادية في استمرارية النفاذية.',
        tags: ['ESVS', 'Chronic Mesenteric Ischemia', 'Intestinal Angina', 'Covered Stent', 'SMA']
      }
    ]
  },
  {
    id: 'esvs-radiation-2023',
    title: 'European Society for Vascular Surgery (ESVS) 2023 Clinical Practice Guidelines on Radiation Safety in Interventional Vascular Procedures',
    shortTitle: 'ESVS 2023 Radiation Safety Guidelines',
    edition: '2023 Official Guidelines',
    authors: 'ESVS Radiation Safety Writing Committee (Eur J Vasc Endovasc Surg 2023)',
    year: 2023,
    type: 'guideline',
    coverColor: 'from-yellow-800 to-amber-950',
    status: 'ready',
    totalPages: 76,
    chaptersCount: 2,
    chunksCount: 2,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Occupational Radiation Protection and ALARA Principles',
        titleAr: 'الحماية المهنية من الإشعاع ومبادئ ALARA',
        pageStart: 6,
        pageEnd: 36,
        keyTopics: ['ALARA: As Low As Reasonably Achievable', 'Lead apron (>=0.35-0.5 mm Pb equivalent)', 'Lead glass eyeglasses for cataract prevention (<20 mSv/year)', 'Ceiling-suspended and table-mounted lead shields']
      },
      {
        chapterNumber: 2,
        title: 'Dose Optimization, Collimation, and Fluoroscopy Management',
        titleAr: 'تقليل الجرعة الإشعاعية، حصر الحزمة (Collimation)، وإدارة الفلوروسكوبي',
        pageStart: 37,
        pageEnd: 68,
        keyTopics: ['Low pulse rate fluoroscopy (<=7.5 pulses/s)', 'Tight collimation to target area', 'Inverse square law: doubling distance quarters radiation exposure', 'Dose Area Product (DAP) monitoring']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-rad-01',
        document_id: 'esvs-radiation-2023',
        document_title: 'ESVS 2023 Radiation Safety Guidelines',
        chapter: 'Occupational Radiation Protection and ALARA Principles',
        section: 'Personal Protection and Eye Lens Dose Limits',
        page_number: 18,
        content: 'Recommendation 2.1: All vascular surgeons and cath lab personnel must wear certified lead shielding (lead apron with minimum 0.35 mm Pb equivalent front/back, and thyroid collar with 0.5 mm Pb equivalent) during all fluoroscopically guided interventions (Class I, Level A). Recommendation 2.4: Protective lead glasses with side shields (minimum 0.5 mm Pb) are recommended to maintain occupational eye lens dose below the annual equivalent dose limit of 20 mSv, preventing radiation-induced posterior subcapsular cataracts.',
        contentAr: 'توصية 2.1 (ESVS 2023): يجب على جميع جراحي الأوعية وطاقم القسطرة ارتداء ملابس واقية من الرصاص معتمدة (مريول رصاص بسماكة لا تقل عن 0.35 مم وطوق الغدة الدرقية بسماكة 0.5 مم) خلال جميع الإجراءات الموجهة بالأشعة (فئة I، مستوى دليل A). توصية 2.4: يوصى بالنظارات الرصاصية المزودة بدروع جانبية لحماية عدسة العين وتفادي إعتام عدسة العين (الماء الأبيض الإشعاعي).',
        tags: ['ESVS', 'Radiation Safety', 'Lead Apron', 'Eye Dose', 'Cataract', 'ALARA']
      },
      {
        chunk_id: 'esvs-rad-02',
        document_id: 'esvs-radiation-2023',
        document_title: 'ESVS 2023 Radiation Safety Guidelines',
        chapter: 'Dose Optimization, Collimation, and Fluoroscopy Management',
        section: 'Dose Reduction Techniques in Endovascular Procedures',
        page_number: 46,
        content: 'Recommendation 3.2: In endovascular procedures, utilization of low-pulse rate fluoroscopy (<=7.5 pulses per second or 3.75 pulses/s when feasible), tight collimation strictly to the region of interest, and maximizing operator distance from the X-ray tube (leveraging the inverse-square law) are strongly recommended (Class I, Level B). Avoid high-magnification modes and use fluoroscopy loop recording instead of digital subtraction cine angiography whenever acceptable image quality can be maintained.',
        contentAr: 'توصية 3.2 (ESVS 2023): في إجراءات القسطرة التداخلية، يوصى بشدة باستخدام الفلوروسكوبي منخفض النبضات (<= 7.5 نبضة/ثانية)، وتضييق حقل الأشعة (Collimation) على منطقة الهدف بدقة، ومضاعفة المسافة عن أنبوب الأشعة وفق قانون التربيع العكسي (فئة I، مستوى دليل B).',
        tags: ['ESVS', 'Radiation Dose', 'Collimation', 'Pulse Rate', 'Fluoroscopy']
      }
    ]
  },
  {
    id: 'esvs-popliteal-2022',
    title: 'European Society for Vascular Surgery (ESVS) Clinical Practice Guidelines on Popliteal and Peripheral Arterial Aneurysms',
    shortTitle: 'ESVS Popliteal & Peripheral Aneurysms Guidelines',
    edition: 'Official ESVS Guidelines',
    authors: 'ESVS Peripheral Aneurysms Writing Committee (Eur J Vasc Endovasc Surg)',
    year: 2022,
    type: 'guideline',
    coverColor: 'from-teal-800 to-slate-950',
    status: 'ready',
    totalPages: 80,
    chaptersCount: 2,
    chunksCount: 2,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Popliteal Artery Aneurysms (PAA): Screening, Thresholds, and Thromboembolic Risk',
        titleAr: 'أم دم الشريان المأبضي: المسح ومعايير التدخل وخطر الانصمام الخثاري',
        pageStart: 6,
        pageEnd: 38,
        keyTopics: ['Diameter threshold >=20 mm for elective intervention', 'High thromboembolic risk with mural thrombus or runoff compromise', 'Bilateral popliteal aneurysms in 50% of patients', 'Coexistent AAA in 40-50%']
      },
      {
        chapterNumber: 2,
        title: 'Surgical Repair: Medial Bypass vs Posterior Approach vs Endovascular Viabahn Stenting',
        titleAr: 'الترميم الجراحي: المجازة الإنسية مقابل المدخل الخلفي مقابل الدعامة المغطاة',
        pageStart: 39,
        pageEnd: 72,
        keyTopics: ['Medial approach with proximal & distal aneurysm ligation and reversed GSV bypass', 'Posterior S-shaped approach with interposition vein graft', 'Endovascular repair with flexible covered stents (Viabahn)']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-paa-01',
        document_id: 'esvs-popliteal-2022',
        document_title: 'ESVS Popliteal & Peripheral Aneurysms Guidelines',
        chapter: 'Popliteal Artery Aneurysms (PAA): Screening, Thresholds, and Thromboembolic Risk',
        section: 'Intervention Thresholds in Popliteal Artery Aneurysms',
        page_number: 18,
        content: 'Recommendation 2.2: Elective surgical repair of asymptomatic popliteal artery aneurysms is recommended when the maximum diameter reaches >=20 mm, or in smaller aneurysms (>=15 mm) associated with significant mural thrombus or compromised distal runoff (Class I, Level B). Popliteal aneurysms rarely rupture but frequently thrombose acutely or shower distal microemboli, causing catastrophic limb loss in up to 30-40% if left untreated. Screening for contralateral popliteal aneurysm and abdominal aortic aneurysm is strongly recommended.',
        contentAr: 'توصية 2.2 (ESVS): يوصى بإجراء الترميم الجراحي الاختياري لأم دم الشريان المأبضي غير المصحوبة بأعراض عند وصول القطر الأقصى >= 20 مم، أو في التوسعات الأصغر (>= 15 مم) التي تحتوي خثرة جدارية كبيرة أو تهدد التروية الطرفية (فئة I، مستوى دليل B). نادراً ما تتمزق أم دم المأبضي لكنها تتخثر فجأة أو ترسل صمات دقيقة تسبب بتر الطرف.',
        tags: ['ESVS', 'Popliteal Aneurysm', 'PAA', 'Threshold 20mm', 'Thrombosis', 'Runoff']
      },
      {
        chunk_id: 'esvs-paa-02',
        document_id: 'esvs-popliteal-2022',
        document_title: 'ESVS Popliteal & Peripheral Aneurysms Guidelines',
        chapter: 'Surgical Repair: Medial Bypass vs Posterior Approach vs Endovascular Viabahn Stenting',
        section: 'Open Surgical Bypass with Great Saphenous Vein',
        page_number: 48,
        content: 'Recommendation 3.1: Open surgical repair with medial approach bypass using autologous great saphenous vein (GSV) and proximal/distal ligation of the aneurysm sac is recommended as the first-line treatment of choice, providing superior long-term primary and secondary patency (Class I, Level A). Endovascular repair with heparin-bonded covered stent-grafts (Viabahn) is a valid alternative in elderly patients with high surgical risk and suitable landing zones (Class IIa, Level B).',
        contentAr: 'توصية 3.1 (ESVS): يوصى بالإصلاح الجراحي المفتوح عبر المدخل الإنسي (Medial approach) مع ربط أم دم القريب والبعيد ومجازة التوائية بالوريد الصافن الذاتي (GSV) كخيار خط أول مفضل لنفاذيته الممتازة طويلة الأمد (فئة I، مستوى دليل A). يُعد وضع دعامة مغطاة (Viabahn) بديلاً مناسباً للمرضى المسنين مرتفعي الخطورة.',
        tags: ['ESVS', 'PAA Repair', 'Saphenous Bypass', 'Viabahn', 'Open vs Endovascular']
      }
    ]
  },
  {
    id: 'esvs-antithrombotic-2023',
    title: 'European Society for Vascular Surgery (ESVS) Clinical Practice Guidelines on Antithrombotic Therapy in Vascular Diseases',
    shortTitle: 'ESVS Antithrombotic Therapy Guidelines',
    edition: 'Official ESVS Guidelines',
    authors: 'ESVS Antithrombotic Therapy Writing Committee (Eur J Vasc Endovasc Surg)',
    year: 2023,
    type: 'guideline',
    coverColor: 'from-rose-900 to-slate-950',
    status: 'ready',
    totalPages: 90,
    chaptersCount: 2,
    chunksCount: 2,
    chapters: [
      {
        chapterNumber: 1,
        title: 'Dual Pathway Inhibition (DPI) and Antiplatelet Monotherapy',
        titleAr: 'التثبيط ثنائي المسار (DPI) والعلاج الأحادي بمضادات الصفائح',
        pageStart: 6,
        pageEnd: 42,
        keyTopics: ['COMPASS regimen: Aspirin 100 mg + Rivaroxaban 2.5 mg BID', 'Clopidogrel 75 mg monotherapy as preferred antiplatelet in PAD', 'Post-stenting dual antiplatelet therapy (DAPT) duration']
      },
      {
        chapterNumber: 2,
        title: 'Perioperative Management and Reversal of Anticoagulants and Antiplatelets',
        titleAr: 'التدبير الجراحي وإبطال مفعول مضادات التخثر ومضادات الصفائح',
        pageStart: 43,
        pageEnd: 82,
        keyTopics: ['Continuation of Aspirin perioperatively in major vascular surgery', 'Preoperative DOAC interruption timing (24-48 hours by renal function)', 'Reversal agents: Idarucizumab for Dabigatran, Andexanet alfa for Factor Xa inhibitors', 'Protamine titration for Heparin']
      }
    ],
    chunks: [
      {
        chunk_id: 'esvs-at-01',
        document_id: 'esvs-antithrombotic-2023',
        document_title: 'ESVS Antithrombotic Therapy Guidelines',
        chapter: 'Dual Pathway Inhibition (DPI) and Antiplatelet Monotherapy',
        section: 'Antithrombotic Regimens in Chronic Vascular Patients',
        page_number: 16,
        content: 'Recommendation 1.2: In symptomatic patients with chronic peripheral or carotid atherosclerotic disease at acceptable bleeding risk, Dual Pathway Inhibition with low-dose rivaroxaban (2.5 mg twice daily) plus aspirin (100 mg once daily) is recommended to prevent cardiovascular death, stroke, myocardial infarction, and major limb amputation (Class I, Level A). When antiplatelet monotherapy is selected, Clopidogrel (75 mg once daily) is recommended over aspirin monotherapy due to superior cardiovascular event reduction.',
        contentAr: 'توصية 1.2 (ESVS): في المرضى المصابين بأمراض الشرايين الطرفية أو السباتية المزمنة وذوي خطورة نزف مقبولة، يوصى بالتثبيط ثنائي المسار (DPI) بجمع ريفاروكسابان منخفض الجرعة (2.5 مجم مرتين يومياً) مع الأسبرين (100 مجم يومياً) للوقاية من الوفاة القلبية وبتر الأطراف (فئة I، مستوى دليل A). وعند اختيار دواء أحادي، يفضل كلوبيدوغريل 75 مجم على الأسبرين.',
        tags: ['ESVS', 'Antithrombotic', 'COMPASS', 'Rivaroxaban', 'Clopidogrel', 'Aspirin']
      },
      {
        chunk_id: 'esvs-at-02',
        document_id: 'esvs-antithrombotic-2023',
        document_title: 'ESVS Antithrombotic Therapy Guidelines',
        chapter: 'Perioperative Management and Reversal of Anticoagulants and Antiplatelets',
        section: 'Perioperative Management and Anticoagulation Reversal',
        page_number: 58,
        content: 'Recommendation 2.4: In patients undergoing elective major vascular surgery, continuation of aspirin monotherapy throughout the perioperative period is recommended (Class I, Level A). For patients on DOACs, discontinuation 24-48 hours prior to high-bleeding-risk vascular procedures is recommended without bridging with heparin (Class I, Level B). In life-threatening emergencies requiring immediate reversal: Protamine sulfate (1 mg per 100 IU heparin) for unfractionated heparin, Idarucizumab (5 g IV) for dabigatran, and Andexanet alfa or 4-factor Prothrombin Complex Concentrate (4F-PCC 25-50 IU/kg) for factor Xa inhibitors.',
        contentAr: 'توصية 2.4 (ESVS): في المرضى الخاضعين لجراحة أوعية كبرى اختيارية، يوصى بمواصلة الأسبرين الأحادي خلال الفترة المحيطة بالجراحة (فئة I، مستوى دليل A). بالنسبة لـ DOACs يتم إيقافها قبل 24-48 ساعة دون حاجة لتجسير بالهيبارين. في حالات الطوارئ النزفية: يُعطى البروتامين لإبطال الهيبارين، ومركب البروثرومبين 4F-PCC أو أنديكسانيت ألفا لمثبطات العامل العاشر.',
        tags: ['ESVS', 'Perioperative', 'DOAC Interruption', 'Protamine', 'PCC', 'Reversal']
      }
    ]
  }
];

