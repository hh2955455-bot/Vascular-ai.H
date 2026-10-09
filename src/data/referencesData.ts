import { ReferenceDocument } from '../types';

export const INITIAL_REFERENCES: ReferenceDocument[] = [
  {
    id: 'rutherford-10th',
    title: "Rutherford's Vascular Surgery and Endovascular Therapy",
    shortTitle: "Rutherford 10th Ed.",
    edition: '10th Edition',
    authors: 'Anton N. Sidawy, Bruce A. Perler',
    year: 2022,
    type: 'textbook',
    coverColor: 'from-blue-700 to-indigo-900',
    status: 'ready',
    totalPages: 2840,
    chaptersCount: 168,
    chunksCount: 14,
    chapters: [
      {
        chapterNumber: 52,
        title: 'Acute Limb Ischemia: Evaluation, Decision Making, and Medical Management',
        titleAr: 'إقفار الأطراف الحاد: التقييم واتخاذ القرار والعلاج الطبي',
        pageStart: 1240,
        pageEnd: 1258,
        keyTopics: ['6 Ps', 'Rutherford Classification', 'Heparinization', 'Etiology: Embolism vs Thrombosis', 'Compartment Syndrome']
      },
      {
        chapterNumber: 53,
        title: 'Surgical and Endovascular Techniques for Acute Limb Ischemia',
        titleAr: 'التقنيات الجراحية والتداخلية لإقفار الأطراف الحاد',
        pageStart: 1259,
        pageEnd: 1278,
        keyTopics: ['Fogarty Catheter Embolectomy', 'Catheter-Directed Thrombolysis (CDT)', 'Suction Thrombectomy', 'Fasciotomy Technique']
      },
      {
        chapterNumber: 64,
        title: 'Chronic Limb-Threatening Ischemia: Clinical Evaluation and WIfI Classification',
        titleAr: 'نقص تروية الأطراف المزمن المهدد للحياة وتصنيف WIfI',
        pageStart: 1480,
        pageEnd: 1502,
        keyTopics: ['WIfI Classification', 'GLASS Anatomical Staging', 'Conduit Selection', 'Autologous Vein vs Prosthetic']
      },
      {
        chapterNumber: 78,
        title: 'Abdominal Aortic Aneurysms: Natural History, Screening, and Open Surgical Repair',
        titleAr: 'تمدد الشريان الأورطي البطني: التاريخ الطبيعي والترميم الجراحي المفتوح',
        pageStart: 1810,
        pageEnd: 1835,
        keyTopics: ['Diameter Thresholds (5.5cm/5.0cm)', 'Rupture Risk Factors', 'Open Repair Clamping', 'Ischemic Colitis Prevention']
      },
      {
        chapterNumber: 79,
        title: 'Endovascular Aneurysm Repair (EVAR): Devices, Anatomy, and Surveillance',
        titleAr: 'إصلاح تمدد الأورطي داخل الوعاء (EVAR) والمتابعة',
        pageStart: 1836,
        pageEnd: 1860,
        keyTopics: ['Neck Anatomy Criteria (length >15mm, angulation <60°)', 'Endoleak Types I-V', 'Sac Expansion Protocols']
      },
      {
        chapterNumber: 96,
        title: 'Cerebrovascular Disease: Carotid Endarterectomy and Stenting',
        titleAr: 'أمراض الأوعية الدماغية: استئصال باطنة الشريان السباتي والدعامات',
        pageStart: 2190,
        pageEnd: 2215,
        keyTopics: ['NASCET & ECST Criteria', 'Timing after TIA (<14 days)', 'Cranial Nerve Hazards (XII, X, VII)', 'Shunting Criteria']
      },
      {
        chapterNumber: 112,
        title: 'Vascular Trauma: Extremity, Junctional, and Neck Injuries',
        titleAr: 'إصابات الأوعية الدموية في الأطراف والرقبة',
        pageStart: 2470,
        pageEnd: 2495,
        keyTopics: ['Hard Signs vs Soft Signs', 'Temporary Intravascular Shunts', 'Saphenous Vein Interposition', 'Fasciotomy Triggers']
      }
    ],
    chunks: [
      {
        chunk_id: 'ruth-chunk-01',
        document_id: 'rutherford-10th',
        document_title: "Rutherford's Vascular Surgery (10th Ed.)",
        chapter: 'Acute Limb Ischemia: Evaluation and Decision Making',
        section: 'Clinical Presentation and the 6 Ps',
        page_number: 1242,
        content: 'Acute limb ischemia (ALI) represents a sudden decrease in limb perfusion that threatens the viability of the extremity (typically presentation < 14 days). The hallmark clinical features are encapsulated by the 6 Ps: Pain (most common early sign), Pallor, Pulselessness, Paresthesia (the earliest indicator of sensory nerve hypoxia), Paralysis (indicating profound muscle ischemia requiring emergent intervention), and Poikilothermia (inability to regulate temperature, limb is cold). Immediate intravenous unfractionated heparin (80 U/kg bolus followed by 18 U/kg/hr infusion) is mandatory upon presentation to prevent propagation of secondary thrombus.',
        contentAr: 'يمثل إقفار الأطراف الحاد (Acute Limb Ischemia - ALI) انخفاضاً مفاجئاً في تروية الطرف يهدد حيوية العضو (خلال أقل من 14 يوماً). تتمثل العلامات السريرية الكلاسيكية في الـ 6 Ps: الألم (Pain)، الشحوب (Pallor)، غياب النبض (Pulselessness)، التنميل أو الخدر (Paresthesia - أول علامة لنقص تروية الأعصاب الحسية)، الشلل (Paralysis - علامة متقدمة على إقفار العضلات)، وبرودة الطرف (Poikilothermia). يجب بدء الهيبارين الوريدي غير المجزأ فوراً (جرعة تحميل 80 وحدة/كغ تليها 18 وحدة/كغ/ساعة) لمنع انتشار الخثرة.',
        tags: ['ALI', '6 Ps', 'Heparin', 'Diagnosis', 'Emergency']
      },
      {
        chunk_id: 'ruth-chunk-02',
        document_id: 'rutherford-10th',
        document_title: "Rutherford's Vascular Surgery (10th Ed.)",
        chapter: 'Acute Limb Ischemia: Evaluation and Decision Making',
        section: 'Rutherford Classification of Acute Limb Ischemia',
        page_number: 1245,
        content: 'Rutherford Classification stratifies acute limb ischemia into three critical prognostic categories:\n- Category I (Viable): No sensory loss, no muscle weakness, arterial Doppler audible, venous Doppler audible. Treatment: urgent formal imaging and elective/urgent revascularization.\n- Category IIa (Marginally Threatened): Minimal sensory loss limited to toes, no muscle weakness, arterial Doppler often inaudible, venous Doppler audible. Treatment: emergent revascularization within hours.\n- Category IIb (Immediately Threatened): Sensory loss extending beyond toes with rest pain, mild-to-moderate muscle weakness (e.g., foot drop, impaired toe movement), arterial Doppler inaudible, venous Doppler audible. Treatment: immediate surgical revascularization without delay for prolonged imaging.\n- Category III (Irreversible): Profound sensory anesthesia, profound paralysis with rigor/woody rigidity, arterial and venous Doppler inaudible. Treatment: primary amputation to avoid fatal myoglobinuric renal failure and reperfusion syndrome.',
        contentAr: 'تصنيف رذرفورد لإقفار الأطراف الحاد يحدد التدبير السريري بدقة:\n- الفئة الأولى (قابلة للحياة): لا يوجد فقدان حسي أو ضعف عضلي، دوبلر الشرايين والأوردة مسموع.\n- الفئة IIa (مهددة بشكل هامشي): فقدان حسي طفيف في أصابع القدم، لا يوجد ضعف حركي، دوبلر الشريان غير مسموع، دوبلر الوريد مسموع. يتطلب إعادة التروية خلال ساعات.\n- الفئة IIb (مهددة فوراً): خدر حسي يتجاوز الأصابع، ضعف حركي خفيف إلى متوسط، دوبلر الشريان غير مسموع، دوبلر الوريد مسموع. يتطلب تدخلاً جراحياً فورياً دون تأخير للتصوير المعقد.\n- الفئة III (غير قابلة للاسترداد): شلل تام مع تيبس عضلي وفقدان حسي عميق، دوبلر الشرايين والأوردة صامت. العلاج هو البتر الأولي لتجنب الفشل الكلوي المهدد للحياة بفرط الميوغلوبين.',
        tags: ['Rutherford Classification', 'ALI', 'Prognosis', 'Amputation', 'Fasciotomy']
      },
      {
        chunk_id: 'ruth-chunk-03',
        document_id: 'rutherford-10th',
        document_title: "Rutherford's Vascular Surgery (10th Ed.)",
        chapter: 'Abdominal Aortic Aneurysms: Natural History and Repair',
        section: 'Thresholds for Intervention and Rupture Risk',
        page_number: 1815,
        content: 'The threshold for elective repair of asymptomatic infrarenal abdominal aortic aneurysms (AAA) is 5.5 cm in men and 5.0 cm in women (due to higher relative rupture risk in females at equivalent diameters). Other indications include rapid expansion (>0.5 cm in 6 months or >1.0 cm in 12 months), saccular morphology (inherently unstable wall tension), and any symptomatic presentation (back/flank pain or distal embolization). In open repair, clamping should be preceded by systemic heparinization. The left renal vein may be divided near the IVC if additional proximal exposure is required, taking advantage of gonadal, adrenal, and lumbar collateral drainage.',
        contentAr: 'معيار التدخل الجراحي الاختياري لتمدد الأورطي البطني غير المصحوب بأعراض هو قطر 5.5 سم للرجال و 5.0 سم للنساء نظراً لارتفاع خطر التمزق لدى الإناث عند نفس القطر. تشمل مؤشرات التدخل الأخرى: التوسع السريع (>0.5 سم خلال 6 أشهر أو >1.0 سم خلال عام)، التمدد الكيسي (Saccular)، أو ظهور أعراض (ألم في الظهر/الخاصرة). في الجراحة المفتوحة، يمكن قطع الوريد الكلوي الأيسر بالقرب من الوريد الأجوف السفلي لتوسيع مجال الرؤية الجراحية مع الحفاظ على التصريف الرديف عبر الأوردة الكظرية والتناسلية.',
        tags: ['AAA', 'Aneurysm', 'Surgical Threshold', 'Open Repair', 'Rupture']
      },
      {
        chunk_id: 'ruth-chunk-04',
        document_id: 'rutherford-10th',
        document_title: "Rutherford's Vascular Surgery (10th Ed.)",
        chapter: 'Cerebrovascular Disease: Carotid Endarterectomy',
        section: 'Indications and Cranial Nerve Anatomy',
        page_number: 2195,
        content: 'Carotid Endarterectomy (CEA) is indicated for symptomatic patients with 70-99% internal carotid artery (ICA) stenosis according to NASCET criteria, ideally performed within 14 days of symptom onset (TIA or non-disabling stroke). For asymptomatic stenosis, intervention is considered for 60-99% stenosis with life expectancy >5 years and perioperative risk <3%. Key cranial nerves at risk during CEA include: Hypoglossal nerve (CN XII, crossed by sternocleidomastoid branch of occipital artery), Vagus nerve (CN X, runs posterior within carotid sheath, vulnerable during posterior clamping), and the Marginal mandibular branch of the facial nerve (CN VII, injury causes drooping of lower lip, avoided by curving incision behind angle of mandible).',
        contentAr: 'يستطب استئصال باطنة الشريان السباتي (Carotid Endarterectomy - CEA) للمرضى العرضيين المصابين بتضيق الشريان السباتي الداخلي بنسبة 70-99% وفقاً لمعايير NASCET، ويفضل إجراؤها خلال 14 يوماً من ظهور الأعراض. الأعصاب القحفية المعرضة للخطر أثناء الجراحة: العصب تحت اللسان (CN XII)، العصب المبهم (CN X)، والفرع الفكي الهامشي للعصب الوجهي (CN VII) والذي يؤدي تضرره إلى تدلي زاوية الفم.',
        tags: ['Carotid', 'CEA', 'Stroke', 'NASCET', 'Cranial Nerves']
      }
    ]
  },
  {
    id: 'esvs-ali-2024',
    title: 'European Society for Vascular Surgery (ESVS) 2024 Clinical Practice Guidelines on the Management of Acute Limb Ischemia',
    shortTitle: 'ESVS 2024 ALI Guidelines',
    edition: '2024 Guidelines',
    authors: 'ESVS ALI Guidelines Writing Committee (Eur J Vasc Endovasc Surg 2024)',
    year: 2024,
    type: 'guideline',
    coverColor: 'from-emerald-700 to-teal-900',
    status: 'ready',
    totalPages: 96,
    chaptersCount: 9,
    chunksCount: 8,
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
        contentAr: 'توصية 4.1 (ESVS 2024): في جميع المرضى الذين يشتبه في إصابتهم أو تأكدت إصابتهم بإقفار الأطراف الحاد، يوصى بالبدء الفوري بمضادات التخثر العلاجية باستخدام الهيبارين غير المجزأ وريدياً عند أول تواصل طبي (فئة I، مستوى دليل B). تبدأ جرعة تحميل 5000 وحدة أو 70-100 وحدة/كغ متبوعة بضخ مستمر لمعايرة aPTT بين 2.0-2.5 دون انتظار التصوير الشعاعي.',
        tags: ['ESVS', 'ALI', 'Heparin', 'Guidelines', 'Class I']
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
        tags: ['ESVS', 'ALI', 'Embolectomy', 'Thrombolysis', 'Class I']
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
        tags: ['Fasciotomy', 'Compartment Syndrome', 'Reperfusion', 'Surgical Technique']
      }
    ]
  },
  {
    id: 'svs-esvs-aaa-guidelines',
    title: 'SVS / ESVS Clinical Practice Guidelines on Abdominal Aortic Aneurysms',
    shortTitle: 'SVS & ESVS AAA Guidelines',
    edition: 'Consensus Guidelines',
    authors: 'Joint Writing Committee of SVS and ESVS',
    year: 2023,
    type: 'guideline',
    coverColor: 'from-amber-700 to-red-950',
    status: 'ready',
    totalPages: 120,
    chaptersCount: 10,
    chunksCount: 6,
    chapters: [
      {
        chapterNumber: 3,
        title: 'Screening and Surveillance Intervals',
        titleAr: 'برامج المسح وفترات المراقبة الدورية لتمدد الأورطي',
        pageStart: 12,
        pageEnd: 25,
        keyTopics: ['Ultrasound screening in men >65 with smoking history', 'Surveillance intervals by diameter']
      },
      {
        chapterNumber: 5,
        title: 'Thresholds and Anatomical Suitability for EVAR vs Open Repair',
        titleAr: 'معايير التدخل الجراحي والملاءمة التشريحية لـ EVAR مقابل الجراحة المفتوحة',
        pageStart: 40,
        pageEnd: 65,
        keyTopics: ['Neck length >10-15mm', 'Neck angle <60°', 'Severe calcification & thrombus', 'Iliac access vessels']
      },
      {
        chapterNumber: 7,
        title: 'Management of Ruptured AAA: Permissive Hypotension and EVAR-First Strategy',
        titleAr: 'تدبير تمزق الأورطي البطني: هبوط الضغط المسموح به واستراتيجية EVAR أولاً',
        pageStart: 75,
        pageEnd: 98,
        keyTopics: ['Target systolic BP 70-90 mmHg', 'Local anesthesia for EVAR cutdown', 'Aortic occlusion balloon (REBOA)']
      }
    ],
    chunks: [
      {
        chunk_id: 'aaa-chunk-01',
        document_id: 'svs-esvs-aaa-guidelines',
        document_title: 'SVS & ESVS AAA Guidelines',
        chapter: 'Management of Ruptured AAA',
        section: 'Permissive Hypotension and Hypotensive Resuscitation',
        page_number: 78,
        content: 'In hemodynamically unstable or responsive patients with suspected ruptured AAA (rAAA), "permissive hypotension" (targeting systolic blood pressure of 70 to 90 mmHg while maintaining consciousness and mentation) is recommended until surgical or endovascular proximal aortic control is established. Vigorous crystalloid resuscitation elevates blood pressure, dislodges retroperitoneal tamponade clots, exacerbates hemodilution coagulopathy, and drastically worsens mortality. In patients with suitable anatomy, an "EVAR-first" approach is recommended over open repair (Class I, Level B), often utilizing an intra-aortic occlusion balloon (ER-REBOA or Reliant) inserted via femoral cutdown or percutaneous access.',
        contentAr: 'في المرضى الذين يشتبه بتمزق تمدد الشريان الأورطي البطني (rAAA)، يوصى باتباع استراتيجية "هبوط الضغط المسموح به" (Permissive Hypotension) باستهداف ضغط انقباضي بين 70-90 مم زئبق مع الحفاظ على وعي المريض، حتى يتم السيطرة على الأورطي جراحياً. إن الإفراط في إعطاء المحاليل الوريدية يرفع الضغط ويزيل خثرة الدك الارتجاعية ويفاقم النزف واعتلال التخثر.',
        tags: ['rAAA', 'Permissive Hypotension', 'EVAR', 'Resuscitation', 'Emergency']
      },
      {
        chunk_id: 'aaa-chunk-02',
        document_id: 'svs-esvs-aaa-guidelines',
        document_title: 'SVS & ESVS AAA Guidelines',
        chapter: 'Thresholds and Anatomical Suitability for EVAR vs Open Repair',
        section: 'Endoleak Classification and Management',
        page_number: 52,
        content: 'Classification of Endoleaks following EVAR:\n- Type I: Attachment site leak (IA: proximal aortic neck, IB: distal iliac landing zone, IC: occluder plug). High pressure, high rupture risk. Mandates urgent intervention (balloon dilatation, extension cuff, stent, or open conversion).\n- Type II: Retrograde branch vessel flow (lumbar arteries, inferior mesenteric artery IMA). Low pressure. Conservative monitoring unless aneurysm sac expands by >5 mm.\n- Type III: Graft defect or component disconnect (IIIA: modular disconnect, IIIB: fabric tear). High pressure. Requires urgent relining or bridge stent.\n- Type IV: Fabric porosity (typically resolves spontaneously within 24-48 hours after heparin reversal).\n- Type V: Endotension (sac expansion without visible flow on imaging).',
        contentAr: 'تصنيف التسريب الداخلي (Endoleak) بعد دعامات الأورطي (EVAR):\n- النوع الأول (Type I): تسريب في موقع التثبيت (IA علوي في العنق، IB سفلي في الشرايين الحرقفية). ضغط عالٍ وخطر تمزق مرتفع يستوجب التدخل العاجل.\n- النوع الثاني (Type II): تدفق ارتجاعي من الشرايين الفرعية (الشرايين القطنية أو المساريقي السفلي IMA). ضغط منخفض يُراقب ما لم يتوسع الكيس >5 مم.\n- النوع الثالث (Type III): انفصال أجزاء الدعامة أو تمزق نسيج الدعامة. ضغط عالٍ يتطلب تدخلاً عاجلاً.\n- النوع الرابع (Type IV): مسامية نسيج الدعامة (يزول تلقائياً بعد تحييد الهيبارين).\n- النوع الخامس (Type V): زيادة الضغط داخل الكيس دون تسريب مرئي (Endotension).',
        tags: ['EVAR', 'Endoleak', 'Complications', 'Aorta']
      }
    ]
  },
  {
    id: 'gvg-wifi-2023',
    title: 'Global Vascular Guidelines on the Management of Chronic Limb-Threatening Ischemia (GVG / WIfI)',
    shortTitle: 'Global Vascular Guidelines (WIfI / GLASS)',
    edition: 'Global Consensus Edition',
    authors: 'Society for Vascular Surgery (SVS), European Society for Vascular Surgery (ESVS), World Federation of Vascular Societies (WFVS)',
    year: 2023,
    type: 'guideline',
    coverColor: 'from-purple-800 to-slate-900',
    status: 'ready',
    totalPages: 140,
    chaptersCount: 12,
    chunksCount: 6,
    chapters: [
      {
        chapterNumber: 2,
        title: 'Definition and Diagnosis of Chronic Limb-Threatening Ischemia (CLTI)',
        titleAr: 'تعريف وتشخيص نقص التروية المزمن المهدد للأطراف',
        pageStart: 8,
        pageEnd: 24,
        keyTopics: ['Replaces term Critical Limb Ischemia', 'Rest pain >2 weeks', 'Ulceration and Gangrene']
      },
      {
        chapterNumber: 3,
        title: 'The SVS WIfI Classification System (Wound, Ischemia, foot Infection)',
        titleAr: 'نظام تصنيف WIfI (الجرح، نقص التروية، عدوى القدم)',
        pageStart: 25,
        pageEnd: 48,
        keyTopics: ['Wound Grade 0-3', 'Ischemia Grade 0-3 (ABI, AP, TP, TcPO2)', 'foot Infection Grade 0-3 (IDSA/IWGDF)', '1-Year Amputation Risk']
      },
      {
        chapterNumber: 5,
        title: 'GLASS Anatomical Staging and Revascularization Strategy',
        titleAr: 'تصنيف GLASS التشريحي واستراتيجية إعادة التروية',
        pageStart: 60,
        pageEnd: 92,
        keyTopics: ['Femoropopliteal segment grading', 'Infrapopliteal / Tibial segment grading', 'Target Artery Path (TAP)', 'Bypass vs Endovascular algorithm']
      }
    ],
    chunks: [
      {
        chunk_id: 'wifi-chunk-01',
        document_id: 'gvg-wifi-2023',
        document_title: 'Global Vascular Guidelines (WIfI / GLASS)',
        chapter: 'The SVS WIfI Classification System',
        section: 'Components of WIfI Staging',
        page_number: 28,
        content: 'The SVS WIfI classification replaces older classifications (Fontaine, Rutherford CLI) by capturing the multi-factorial nature of tissue loss in modern diabetic and non-diabetic populations. It grades three independent clinical domains from 0 to 3:\n1. Wound (W): Grade 0 = ischemic rest pain without ulcer; Grade 1 = small shallow ulcer on distal leg/foot, no gangrene; Grade 2 = deeper ulcer with exposed tendon/bone or gangrene limited to digits; Grade 3 = extensive deep ulcer involving hindfoot, heel necrosis, or extensive gangrene beyond digits.\n2. Ischemia (I): Evaluated preferentially by Toe Pressure (TP) or transcutaneous oxygen (TcPO2) due to medial calcinosis skewing ABI. Grade 0 = ABI >=0.80, TP >=60 mmHg; Grade 1 = ABI 0.60-0.79, TP 40-59 mmHg; Grade 2 = ABI 0.40-0.59, TP 30-39 mmHg; Grade 3 = ABI <0.40, TP <30 mmHg, TcPO2 <30 mmHg.\n3. foot Infection (fI): Grade 0 = no signs of infection; Grade 1 = local infection (erythema <2 cm); Grade 2 = local infection with erythema >2 cm or deep structure involvement (fascia, bone), systemic signs absent; Grade 3 = systemic inflammatory response syndrome (SIRS).',
        contentAr: 'يحل تصنيف WIfI محل التصنيفات القديمة (Fontaine ورذرفورد) لتقييم نقص تروية الأطراف المزمن المهدد للحياة بدقة، حيث يقيم ثلاثة محاور سريرية من 0 إلى 3:\n1. الجرح (Wound - W): الدرجة 0 (ألم راحة دون قرحة)، 1 (قرحة صغيرة سطحية دون غرغرينا)، 2 (قرحة عميقة كاشفة للأوتار أو العظام، أو غرغرينا محدودة بالأصابع)، 3 (قرحة عميقة واسعة تشمل مؤخرة القدم أو غرغرينا ممتدة).\n2. التروية (Ischemia - I): يفضل قياس ضغط إصبع القدم (Toe Pressure) لتجنب عدم دقة مؤشر الكاحل-العضد (ABI) بسبب تكلس الشرايين السكري. الدرجة 0 (TP >=60 مم زئبق)، 1 (TP 40-59 مم زئبق)، 2 (TP 30-39 مم زئبق)، 3 (TP <30 مم زئبق).\n3. عدوى القدم (foot Infection - fI): الدرجة 0 (لا توجد عدوى)، 1 (احمرار موضعي <2 سم)، 2 (عدوى أعمق تشمل الأوتار/العظام دون أعراض جهازية)، 3 (استجابة التهابية جهازية SIRS).',
        tags: ['WIfI', 'CLTI', 'Diabetic Foot', 'Amputation Risk', 'Staging']
      }
    ]
  }
];
