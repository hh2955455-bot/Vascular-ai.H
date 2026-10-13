import { MCQQuestion, Flashcard } from '../types';

export const COMPREHENSIVE_MCQ_BANK: MCQQuestion[] = [
  // --- FROM UPLOADED BOOKS & ESVS GUIDELINES (sourceOrigin: 'books') ---
  {
    id: 'bk-mcq-01',
    topic: 'ESVS 2024 ALI Guidelines - Heparin Protocol',
    category: 'Arterial',
    difficulty: 'Resident',
    sourceOrigin: 'books',
    questionEn: 'According to the European Society for Vascular Surgery (ESVS) 2024 Clinical Practice Guidelines on Acute Limb Ischaemia, what is the mandatory immediate medical intervention upon clinical suspicion of ALI before any imaging?',
    questionAr: 'وفق إرشادات الجمعية الأوروبية لجراحة الأوعية الدموية (ESVS 2024) بشأن إقفار الأطراف الحاد، ما هو التدخل الطبي الإسعافي الإلزامي الفوري عند الاشتباه السريري وقبل أي تصوير شعاعي؟',
    options: [
      { id: 'A', textEn: 'Immediate therapeutic IV unfractionated heparin bolus (5,000 IU or 70-80 IU/kg) unless strictly contraindicated', textAr: 'إعطاء جرعة بلعة وريدية علاجية فورية من الهيبارين غير المجزأ (5,000 وحدة أو 70-80 و/كغ) ما لم يكن هناك مضاد استطباب مطلق' },
      { id: 'B', textEn: 'Oral low-dose aspirin 75 mg only', textAr: 'إعطاء أسبرين فموي بجرعة منخفضة 75 ملغ فقط' },
      { id: 'C', textEn: 'Immediate urgent leg elevation and ice pack application', textAr: 'رفع الطرف فوراً وتطبيق كمادات ثلج' },
      { id: 'D', textEn: 'Wait until multi-detector CTA is completed before any anticoagulation', textAr: 'الانتظار حتى انتهاء التصوير المقطعي قبل إعطاء أي مضاد تخثر' },
      { id: 'E', textEn: 'Immediate oral warfarin with a target INR of 2.5', textAr: 'البدء الفوري بالوارفارين الفموي للوصول لـ INR 2.5' }
    ],
    correctAnswer: 'A',
    explanationEn: 'The ESVS 2024 ALI Guidelines award a Class I, Level B recommendation for immediate therapeutic systemic heparinization upon clinical suspicion of ALI to prevent propagation of the thrombus into distal microcirculation and preserve collateral beds.',
    explanationAr: 'توصي إرشادات ESVS 2024 (توصية من الفئة I، مستوى B) بالبدء الفوري بالهيبارين الوريدي الجهازي بمجرد الاشتباه السريري لمنع امتداد الخثرة إلى الأوعية الدقيقة البعيدة وحماية التروية الجانبية.',
    surgicalPearls: 'Delaying heparin administration to perform CT angiography or transport the patient significantly increases the rate of microvascular thrombosis and limb loss.',
    referenceCitation: 'ESVS 2024 Clinical Practice Guidelines on Acute Limb Ischaemia, Recommendation 4.1; Eur J Vasc Endovasc Surg 2024'
  },
  {
    id: 'bk-mcq-02',
    topic: 'ESVS 2023 Carotid Guidelines - Asymptomatic Stenosis Criteria',
    category: 'Carotid',
    difficulty: 'Board Level',
    sourceOrigin: 'books',
    questionEn: 'According to ESVS 2023 Guidelines on the Management of Atherosclerotic Carotid Artery Disease, which feature identifies an asymptomatic 60-99% carotid stenosis patient as having a "high stroke risk" who may benefit from elective CEA/CAS plus best medical therapy?',
    questionAr: 'وفق إرشادات ESVS 2023 لتصلب الشرايين السباتية، أي من الخصائص التالية تحدد مريض تضيق السباتي غير العرضي (60-99%) بأنه عالي الخطورة لحدوث السكتة، مما يرجح استفادته من الجراحة (CEA/CAS) بجانب العلاج الدوائي؟',
    options: [
      { id: 'A', textEn: 'Silent embolic infarction on cerebral MRI/CT or microemboli signals (MES) on transcranial Doppler', textAr: 'وجود احتشاء صامت على رنين/أشعة المخ أو إشارات صمات دقيقة (MES) على دوبلر عبر الجمجمة' },
      { id: 'B', textEn: 'Total smooth concentric calcification with zero lipid core', textAr: 'تكلس أملس دائري كامل دون أي نواة دهنية' },
      { id: 'C', textEn: 'Age greater than 85 years with end-stage dementia', textAr: 'عمر المريض أكثر من 85 عاماً مع خرف متقدم' },
      { id: 'D', textEn: 'Normal systolic velocity without contralateral disease', textAr: 'سرعة تدفق انقباضية طبيعية دون أي مرض بالجانب المقابل' },
      { id: 'E', textEn: 'History of isolated unilateral tension headache', textAr: 'وجود صداع توتري أحادي الجانب فقط' }
    ],
    correctAnswer: 'A',
    explanationEn: 'ESVS guidelines specify high-risk imaging features in asymptomatic patients that support revascularization: silent brain infarcts on CT/MRI, spontaneous MES on TCD, plaque progression >20%, large plaque lipid core (GSM <30), or plaque ulceration.',
    explanationAr: 'حددت إرشادات ESVS معايير التصوير عالية الخطورة لتضيق السباتي غير العرضي التي تدعم إجراء الجراحة: وجود احتشاء دماغي صامت، رصد إشارات صمات دقيقة (MES) على الدوبلر عبر الجمجمة، لويحات ذات نواة دهنية كبيرة مفرطة الصدى (GSM < 30)، أو تقرح اللويحة.',
    surgicalPearls: 'Average annual stroke rate on modern Best Medical Therapy (BMT) alone for asymptomatic stenosis is <1%; therefore, intervention is restricted strictly to patients with verified high-risk clinical or imaging features.',
    referenceCitation: 'ESVS 2023 Clinical Practice Guidelines on Carotid Disease, Section 3.2.1; Rutherford 10th Ed., Chapter 96'
  },
  {
    id: 'bk-mcq-03',
    topic: 'ESVS AAA 2024 Guidelines - Surveillance Intervals',
    category: 'Aorta',
    difficulty: 'Resident',
    sourceOrigin: 'books',
    questionEn: 'In an asymptomatic patient found to have an infrarenal abdominal aortic aneurysm measuring 4.4 cm on duplex ultrasound, what is the surveillance interval recommended by European (ESVS) and International guidelines?',
    questionAr: 'لمريض غير عرضي لديه تمدد شريان أورطي بطني تحت كلوي بقياس 4.4 سم على الدوبلر، ما هو الفاصل الزمني الموصى به للمراقبة الدورية وفق إرشادات ESVS والمراجع الدولية؟',
    options: [
      { id: 'A', textEn: 'Annual surveillance duplex ultrasound (every 12 months)', textAr: 'فحص دوبلر دوري سنوي (كل 12 شهراً)' },
      { id: 'B', textEn: 'Duplex ultrasound every 3 years', textAr: 'فحص دوبلر كل 3 سنوات' },
      { id: 'C', textEn: 'Monthly contrast-enhanced CTA', textAr: 'تصوير مقطعي شهري بالصبغة' },
      { id: 'D', textEn: 'Immediate open surgical repair within 1 week', textAr: 'ترميم جراحي مفتوح فوري خلال أسبوع' },
      { id: 'E', textEn: 'Discharge with no further imaging required', textAr: 'إخراج المريض دون الحاجة لأي متابعة' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Standard surveillance guidelines for AAA: 3.0-3.9 cm: every 3 years; 4.0-4.9 cm: annually (every 1 year); 5.0-5.4 cm: every 6 months (men); >= 5.5 cm: elective repair.',
    explanationAr: 'جداول المراقبة المعتمدة لتمدد الأورطي: 3.0 إلى 3.9 سم: كل 3 سنوات؛ 4.0 إلى 4.9 سم: سنوياً (كل سنة)؛ 5.0 إلى 5.4 سم: كل 6 أشهر للرجال؛ 5.5 سم فأكثر: تدخل وترميم جراحي.',
    surgicalPearls: 'If an aneurysm expands by >1.0 cm in 12 months or >0.5 cm in 6 months, elective repair is recommended regardless of diameter.',
    referenceCitation: 'ESVS 2024 Clinical Practice Guidelines on Abdominal Aortic Aneurysms, Section 4.2; Rutherford 10th Ed.'
  },
  {
    id: 'bk-mcq-04',
    topic: 'Rutherford Chapter 112 - Two-Incision Four-Compartment Fasciotomy',
    category: 'Trauma',
    difficulty: 'Resident',
    sourceOrigin: 'books',
    questionEn: 'When performing the medial incision for lower leg four-compartment fasciotomy, which anatomical structure must be identified and carefully retracted to safely decompress the deep posterior compartment?',
    questionAr: 'عند إجراء الشق الإنسي لبضع لفافة الساق بالحجرات الأربع، ما التركيب التشريحي الذي يجب كشفه وإبعاده بحذر لتحرير الحجرة الخلفية العميقة بأمان؟',
    options: [
      { id: 'A', textEn: 'Soleus muscle bridge taking origin from the posterior tibial border, while preserving the Great Saphenous Vein & Saphenous Nerve anteriorly', textAr: 'جسر العضلة النعلية (Soleus) المنشأ من حافة الظنبوب، مع حماية الوريد الصافن الكبير والعصب الصافن أمامياً' },
      { id: 'B', textEn: 'Anterior tibial artery within the extensor digitorum longus', textAr: 'الشريان الظنبوبي الأمامي داخل العضلة الباسطة للأصابع' },
      { id: 'C', textEn: 'Sciatic nerve trunk at the popliteal fossa', textAr: 'جذع العصب الوركي في الحفرة المأبضية' },
      { id: 'D', textEn: 'Lateral collateral ligament of the knee joint', textAr: 'الرباط الجانبي الوحشي لمفصل الركبة' },
      { id: 'E', textEn: 'Patellar tendon insertion at the tibial tubercle', textAr: 'مرتكز وتر الداغصة عند الأحدوبة الظنبوبية' }
    ],
    correctAnswer: 'A',
    explanationEn: 'The medial incision decompress the superficial and deep posterior compartments. The Great Saphenous Vein and saphenous nerve are retracted anteriorly. The superficial posterior compartment (gastrocnemius/soleus) is incised. To open the deep posterior compartment, the soleus origin is detached/retracted from the posterior border of the tibia.',
    explanationAr: 'يحرر الشق الإنسي الحجرتين الخلفيتين: السطحية والعميقة. يتم إبعاد الصافن الكبير والعصب الصافن للأمام، ويفتح قيد الحجرة السطحية، ثم يُفصل منشأ العضلة النعلية من الحافة الخلفية للظنبوب لكشف وتحرير الحجرة الخلفية العميقة الحاوية للشريان والعصب الظنبوبي.',
    surgicalPearls: 'Failure to decompress the deep posterior compartment is the most frequent technical error in lower extremity fasciotomy, resulting in posterior tibial nerve ischemia and permanent claw-toe deformity.',
    referenceCitation: "Rutherford's Vascular Surgery 10th Ed., Chapter 112, Page 2490"
  },
  {
    id: 'bk-mcq-05',
    topic: 'ESVS 2021 Chronic Venous Disease - CEAP Classification',
    category: 'Venous',
    difficulty: 'Resident',
    sourceOrigin: 'books',
    questionEn: 'A 54-year-old female presents with persistent lower extremity swelling, painful hyperpigmentation around the medial malleolus, and induration with woody fibrosis of the calf skin (lipodermatosclerosis), but NO active or healed ulceration. What is her CEAP clinical classification?',
    questionAr: 'سيدة تبلغ 54 عاماً تعاني من تورم مزمن بالساق، تصبغ جلدي مؤلم حول الكعب الإنسي، وتليف وتصلب في جلد الساق (Lipodermatosclerosis)، دون وجود أي قرحة نشطة أو ملتئمة. ما هو تصنيف CEAP السريري لحالتها؟',
    options: [
      { id: 'A', textEn: 'C4b (Lipodermatosclerosis / atrophie blanche)', textAr: 'C4b (تصلب شحمي جلدي / ضمور أبيض)' },
      { id: 'B', textEn: 'C2 (Simple varicose veins)', textAr: 'C2 (دوالي وريدية بسيطة)' },
      { id: 'C', textEn: 'C3 (Edema without skin changes)', textAr: 'C3 (وذمة دون تغيرات جلدية)' },
      { id: 'D', textEn: 'C6 (Active open venous ulceration)', textAr: 'C6 (قرحة وريدية نشطة ومفتوحة)' },
      { id: 'E', textEn: 'C5 (Healed venous ulceration)', textAr: 'C5 (قرحة وريدية ملتئمة سابقاً)' }
    ],
    correctAnswer: 'A',
    explanationEn: 'CEAP clinical classes: C0: No visible signs; C1: Telangiectasias; C2: Varicose veins; C3: Edema; C4a: Pigmentation or eczema; C4b: Lipodermatosclerosis or atrophie blanche; C5: Healed ulcer; C6: Active open ulcer.',
    explanationAr: 'تصنيف CEAP السريري: C0: لا علامات؛ C1: شعيرات عنكبوتية؛ C2: دوالي بارزة؛ C3: وذمة؛ C4a: تصبغ أو إكزيما؛ C4b: تصلب شحمي جلدي أو ضمور أبيض؛ C5: قرحة ملتئمة؛ C6: قرحة مفتوحة نشطة.',
    surgicalPearls: 'Lipodermatosclerosis (C4b) carries a 30-fold increased risk of skin breakdown into an active venous ulcer (C6) if underlying superficial axial reflux is not ablated.',
    referenceCitation: 'ESVS 2022 Guidelines on Chronic Venous Disease; Rutherford 10th Ed., Chapter 148'
  },

  // --- FROM EXTERNAL INTERNATIONAL BOARD EXAMS (sourceOrigin: 'external_board') ---
  {
    id: 'ext-mcq-01',
    topic: 'European Board FEBVS - Popliteal Artery Entrapment Syndrome',
    category: 'Arterial',
    difficulty: 'Board Level',
    sourceOrigin: 'external_board',
    questionEn: 'A 24-year-old male military recruit presents with calf claudication after running 200 meters. Distal pulses are normal at rest, but dorsalis pedis and posterior tibial pulses completely disappear during active plantar flexion and passive dorsiflexion of the foot. Axial MRI demonstrates the popliteal artery passing lateral to an aberrant medial head of the gastrocnemius muscle. Which classification and definitive operation are indicated?',
    questionAr: 'شاب عسكري يبلغ 24 عاماً يعاني من عرج مؤلم في الساق بعد الجري 200 متر. النبضات المحيطية طبيعية أثناء الراحة، لكنها تختفي تماماً عند بسط القدم الفاعل (Plantar flexion) أو ثنيها المنفعل. أظهر الرنين المغناطيسي مرور الشريان المأبضي وحشياً لرأس شاذ للعضلة التوأمية الساقية الإنسية (Gastrocnemius). ما هو التصنيف والعمل الجراحي الجذري؟',
    options: [
      { id: 'A', textEn: 'Type II Popliteal Entrapment; Surgical release/myotomy of the aberrant gastrocnemius muscle head via posterior S-shaped approach', textAr: 'انحباس مأبضي النوع II؛ تحرير جراحي وقطع الرأس العضلي الشاذ للعضلة التوأمية عبر مدخل خلفي بشكل حرف S' },
      { id: 'B', textEn: 'Popliteal Adventitial Cystic Disease; Percutaneous transluminal balloon angioplasty only', textAr: 'مرض الكيسات البرانية المأبضية؛ توسيع بالبالون عبر الجلد فقط' },
      { id: 'C', textEn: 'Primary atherosclerosis; Stenting of the popliteal artery across the knee joint', textAr: 'تصلب شرايين أولي؛ تركيب دعامة بالشريان المأبضي عبر مفصل الركبة' },
      { id: 'D', textEn: 'Exertional compartment syndrome; Four-compartment fasciotomy alone without muscle release', textAr: 'متلازمة الحجرات الإجهادية؛ بضع لفافة فقط دون تحرير العضلة' },
      { id: 'E', textEn: 'Functional entrapment; Long-term oral high-dose beta-blockers without surgical exploration', textAr: 'انحباس وظيفي؛ علاج بمحصرات بيتا دون جراحة' }
    ],
    correctAnswer: 'A',
    explanationEn: 'In Type II PAES, the medial head of the gastrocnemius originates laterally on the femoral condyle, and the popliteal artery passes lateral to it with compression. Surgical release of the compressing muscle tendon via a posterior S-shaped incision is curative and prevents post-stenotic aneurysm and arterial occlusion.',
    explanationAr: 'في النوع الثاني من متلازمة انحباس الشريان المأبضي (PAES Type II)، ينشأ الرأس الإنسي للتوأمية في موقع شاذ وحشياً، فيمر الشريان مضغوطاً. العلاج الجراحي بتحرير أو استئصال الوتر العضلي الضاغط عبر الشق الخلفي هو العلاج الجذري لمنع تنكس جدار الشريان وتخثره.',
    surgicalPearls: 'Never place an endovascular stent across the popliteal artery in young patients with PAES; mechanical stent fracture and catastrophic thrombosis will occur.',
    referenceCitation: 'European Board of Vascular Surgery (FEBVS) Examination Case Repository; Rutherford Chapter 108'
  },
  {
    id: 'ext-mcq-02',
    topic: 'American Board of Surgery (ABS) - EVAR Hostile Neck Criteria',
    category: 'Aorta',
    difficulty: 'Board Level',
    sourceOrigin: 'external_board',
    questionEn: 'A 76-year-old male is being evaluated for EVAR for a 6.2 cm infrarenal AAA. Pre-operative CTA centerline analysis reveals an infrarenal aortic neck length of 8 mm, an infrarenal neck angle (beta angle) of 75 degrees, and 60% circumferential calcification. According to standard Instructions For Use (IFU) and Board consensus, what is the best strategy?',
    questionAr: 'رجل يبلغ 76 عاماً يتم تقييمه لقسطرة EVAR لتمدد أبهر بطني 6.2 سم. أظهرت الأشعة المقطعية طول عنق الأبهر 8 مم، وزاوية انحناء العنق 75 درجة، وتكلس دائري 60%. وفق تعليمات الاستخدام المعتمدة (IFU) وتوافق البورد، ما هي الإستراتيجية الفضلى؟',
    options: [
      { id: 'A', textEn: 'Hostile neck anatomy outside standard IFU; Fenestrated EVAR (FEVAR) or Open Surgical Repair with suprarenal clamping', textAr: 'عنق عدائي (Hostile Neck) خارج معايير IFU؛ إجراء قسطرة بنوافذ (FEVAR) أو ترميم جراحي مفتوح بملقط فوق كلوي' },
      { id: 'B', textEn: 'Deploy a standard off-the-shelf infrarenal bifurcated stent graft without seal monitoring', textAr: 'تركيب دعامة ثنائية التفرع قياسية عادية دون مراقبة منطقة الختم' },
      { id: 'C', textEn: 'No intervention indicated until aortic diameter reaches 8.0 cm', textAr: 'لا داعي لأي تدخل حتى يصل القطر إلى 8 سم' },
      { id: 'D', textEn: 'Perform iliac branch endoprosthesis alone without aortic fixation', textAr: 'تركيب دعامة حرقفية متفرعة فقط دون تثبيت أورطي' },
      { id: 'E', textEn: 'Blind aortic neck dilation with a 32 mm balloon under local anesthesia', textAr: 'توسيع أعمى لعنق الأبهر ببالون 32 مم تحت تخدير موضعي' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Hostile neck criteria include: length < 10-15 mm, angulation > 60 degrees, conical neck, and severe calcification/thrombus > 50%. Deploying standard IFU devices in hostile necks carries high rates of immediate or delayed Type IA endoleak and migration. FEVAR (fenestrated EVAR) or open surgical repair are preferred.',
    explanationAr: 'معايير العنق العدائي (Hostile Neck): طول أقل من 10-15 مم، زاوية انحناء > 60 درجة، عنق مخروطي، أو تكلس/خثار > 50%. استخدام دعامات قياسية يؤدي لتسريب داخلي خطير من النوع IA (Type IA Endoleak) وهجرة الدعامة. لذا يفضل FEVAR بنوافذ للشرايين الكلوية أو الجراحة المفتوحة.',
    surgicalPearls: 'Type IA endoleaks represent direct, untreated aortic systemic pressure transmitted into the aneurysm sac and must NEVER be left untreated.',
    referenceCitation: 'ABS Vascular Surgery Qualifying Examination; J Vasc Surg Guidelines on EVAR'
  },
  {
    id: 'ext-mcq-03',
    topic: 'Royal College FRCS (Vascular) - Thoracic Outlet Syndrome & First Rib',
    category: 'Trauma',
    difficulty: 'Board Level',
    sourceOrigin: 'external_board',
    questionEn: 'A 29-year-old female competitive swimmer presents with sudden, massive swelling, cyanosis, and heaviness of her dominant right arm after training. Duplex ultrasound and venography confirm acute thrombosis of the right subclavian-axillary vein (Paget-Schroetter syndrome). Following successful catheter-directed thrombolysis, what is the definitive intervention to prevent recurrent thrombosis and disability?',
    questionAr: 'سباحة تبلغ 29 عاماً تعاني من تورم هائل مفاجئ وزرقة وثقل بالذراع الأيمن بعد التدريب. أكد الدوبلر وقسطرة الأوردة خثاراً حاداً في الوريد تحت الترقوة والإبطي (متلازمة باجيت-شروتر). بعد إذابة الخثرة بنجاح بالقسطرة، ما هو التدخل الجذري لمنع تكرار الخثار؟',
    options: [
      { id: 'A', textEn: 'First rib resection and scalenectomy (transaxillary or paraclavicular) during the same hospital admission, followed by completion venography/venoplasty', textAr: 'استئصال الضلع الأول وقطع العضلة الأخمعية (عبر الإبط أو فوق الترقوة) خلال نفس التنويم مع تصوير وريدي ورأب الوريد' },
      { id: 'B', textEn: 'Immediate metallic venous stent placement across the costoclavicular space without rib resection', textAr: 'تركيب دعامة وريدية معدنية فورية في الحيز الضلعي الترقوي دون استئصال الضلع الأول' },
      { id: 'C', textEn: 'Lifelong total bed rest with continuous arm traction', textAr: 'راحة تامة في الفراش مدى الحياة مع شد الذراع' },
      { id: 'D', textEn: 'Immediate surgical transection of the brachial plexus roots', textAr: 'قطع جذور الضفيرة العضدية جراحياً فوراً' },
      { id: 'E', textEn: 'Oral NSAIDs for 5 days then resume competitive swimming immediately', textAr: 'مسكنات لمدة 5 أيام واستئناف السباحة فوراً' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Venous TOS (Paget-Schroetter syndrome) is caused by extrinsic compression of the subclavian vein in the costoclavicular space by the first rib and anterior scalene muscle. Thrombolysis restores patency, but without first rib resection, the recurrence rate exceeds 30-40%. Stenting without rib resection results in catastrophic stent crushing/fracture.',
    explanationAr: 'تحدث متلازمة باجيت-شروتر بسبب انضغاط الوريد تحت الترقوة بين الضلع الأول والترقوة والعضلة الأخمعية. إذابة الخثرة تعيد الجريان، لكن استئصال الضلع الأول خلال نفس التنويم ضروري لإزالة الانضغاط الميكانيكي. تركيب دعامة دون إزالة الضلع يؤدي لكسر الدعامة وانسدادها التام.',
    surgicalPearls: 'Never place a stent across the thoracic outlet before bony decompression; the repetitive mechanical shear of the clavicle against the first rib crushes metal stents completely.',
    referenceCitation: 'FRCS (Vascular) Examination Board; Rutherford Chapter 110'
  },
  {
    id: 'ext-mcq-04',
    topic: 'FEBVS Board - Ruptured AAA Resuscitation Protocol',
    category: 'Aorta',
    difficulty: 'Board Level',
    sourceOrigin: 'external_board',
    questionEn: 'A 68-year-old male with a known 6.5 cm AAA collapses in the emergency department with severe back pain and hypotension (BP 75/45 mmHg, HR 105 bpm). He is awake, coherent, and responding to commands. According to contemporary vascular resuscitation guidelines for ruptured AAA, what is the target systolic blood pressure and fluid strategy prior to aortic proximal control?',
    questionAr: 'رجل يبلغ 68 عاماً لديه تمدد أورطي معروف 6.5 سم سقط في الطوارئ بألم شديد بالظهر وهبوط ضغط (75/45 مم زئبق، نبض 105). المريض واعٍ ومتجاوب. وفق البروتوكولات العالمية لإنعاش تمزق الأورطي البطني، ما هو الضغط الانقباضي المستهدف وإستراتيجية السوائل قبل السيطرة على الأبهر؟',
    options: [
      { id: 'A', textEn: 'Permissive hypotension (Target SBP 70-90 mmHg, maintaining cerebral consciousness) with minimal crystalloids, transferring directly to the OR', textAr: 'هبوط الضغط المسموح به (Permissive Hypotension) باستهداف انقباضي 70-90 مم زئبق مع وعي المريض وبأقل كمية سوائل، ونقله فوراً للعمليات' },
      { id: 'B', textEn: 'Aggressive rapid infusion of 4 liters of normal saline to drive SBP above 140 mmHg', textAr: 'إعطاء 4 لترات محلول ملحي سريعاً لرفع الضغط فوق 140 مم زئبق' },
      { id: 'C', textEn: 'High-dose phenylephrine infusion to achieve hypertension before transferring', textAr: 'إعطاء رافع ضغط بجرعة عالية لإحداث ارتفاع ضغط قبل النقل' },
      { id: 'D', textEn: 'Wait 3 hours in the emergency department for abdominal MRI', textAr: 'الانتظار 3 ساعات بالطوارئ لعمل رنين مغناطيسي' },
      { id: 'E', textEn: 'Perform diagnostic peritoneal lavage at the bedside before surgical consult', textAr: 'إجراء غسيل صفاق تشخيصي قبل استدعاء الجراح' }
    ],
    correctAnswer: 'A',
    explanationEn: 'Permissive hypotension (target SBP 70-90 mmHg, as long as patient is conscious) avoids dislodging the retroperitoneal tamponading clot and prevents hemodilution, hypothermia, and lethal trauma triad of coagulopathy. The patient must be transferred immediately to the operating theatre.',
    explanationAr: 'إستراتيجية هبوط الضغط المسموح به (Permissive Hypotension) تهدف لإبقاء الضغط الانقباضي بين 70-90 مم زئبق ما دام المريض واعياً. رفع الضغط العنيف يؤدي لتفتيت الخثرة المحصورة بالصفاق وتجدد النزيف الصاعق مع تمييع عوامل التخثر.',
    surgicalPearls: 'Aggressive crystalloid fluid resuscitation in ruptured AAA directly correlates with intraoperative coagulopathy and increased mortality.',
    referenceCitation: 'European Board of Vascular Surgery (FEBVS); SVS / ESVS Ruptured AAA Guidelines'
  },
  {
    id: 'ext-mcq-05',
    topic: 'American Board ABS - Dialysis Access Steal Syndrome (DASS)',
    category: 'Dialysis',
    difficulty: 'Board Level',
    sourceOrigin: 'external_board',
    questionEn: 'A 56-year-old diabetic female with a high-flow brachiocephalic AV fistula (flow rate 1,800 mL/min) complains of severe coldness, ischemic rest pain, and fingertip ulceration of the ipsilateral hand. Finger PPG waveforms are flat, but immediately normalize when the fistula is manually occluded. What is the standard operative procedure of choice to resolve the steal while maintaining functional dialysis access?',
    questionAr: 'سيدة سكرية تبلغ 56 عاماً لديها ناسور شرياني وريدي عالي التدفق (1,800 مل/دقيقة) في العضد، تعاني من برودة شديدة وألم إقفاري بالراحة وقرح بأطراف أصابع اليد. تخطيط PPG للأصابع مسطح لكنه يعود طبيعياً فور ضغط الناسور يدوياً. ما العملية الجراحية القياسية المثلى لحل متلازمة السرقة مع الحفاظ على الناسور للغسيل؟',
    options: [
      { id: 'A', textEn: 'Distal Revascularization and Interval Ligation (DRIL procedure)', textAr: 'عملية DRIL (إعادة التروية البعيدة مع ربط الشريان الفاصل)' },
      { id: 'B', textEn: 'Permanent ligation and abandonment of the AV fistula without revascularization', textAr: 'ربط الناسور نهائياً وإلغاؤه دون أي إعادة تروية' },
      { id: 'C', textEn: 'Aspirin and oral calcium channel blockers with no surgical action', textAr: 'أسبرين ومحصرات قنوات الكالسيوم دون أي تدخل' },
      { id: 'D', textEn: 'Placement of a large balloon-expandable bare metal stent in the brachial artery', textAr: 'تركيب دعامة معدنية عارية كبيرة في الشريان العضدي' },
      { id: 'E', textEn: 'Carpal tunnel endoscopic retinaculum release only', textAr: 'تحرير نفق الرسغ بالمنظار فقط' }
    ],
    correctAnswer: 'A',
    explanationEn: 'The DRIL procedure creates a bypass from proximal brachial artery to distal brachial artery (using saphenous vein) and ligates the brachial artery just distal to the fistula takeoff. This stops retrograde steal into the fistula while providing pulsatile high-pressure antegrade flow to the hand, and preserves fistula flow.',
    explanationAr: 'عملية DRIL تتضمن إنشاء مجازة وريدية (بواسطة الصافن) من الشريان العضدي القريب إلى الشريان العضدي البعيد، مع ربط الشريان العضدي مباشرة بعد مخرج الناسور. يمنع هذا السرقة الرجعية للدم ويؤمن تروية نبضية كافية لليد مع استمرار عمل الناسور للغسيل.',
    surgicalPearls: 'The DRIL procedure is the gold standard for high-flow steal with non-stenotic inflow, with hand salvage rates exceeding 90%.',
    referenceCitation: 'ABS Vascular Examination; Rutherford Chapter 128'
  }
];

export const COMPREHENSIVE_FLASHCARDS_BANK: Flashcard[] = [
  // --- FROM UPLOADED BOOKS & GUIDELINES ---
  {
    id: 'fc-bk-01',
    topic: 'ESVS 2024 ALI Guidelines',
    subtopic: 'Heparin Bolus & Infusion',
    category: 'Arterial',
    difficulty: 'Basic',
    sourceOrigin: 'books',
    frontEn: 'What is the ESVS 2024 recommended initial heparinization dose for Acute Limb Ischemia?',
    frontAr: 'ما هي جرعة الهيبارين الأولية الموصى بها في إرشادات ESVS 2024 لإقفار الأطراف الحاد؟',
    backEn: '• IV Bolus: 5,000 IU or 70-80 IU/kg IV unfractionated heparin immediately upon suspicion.\n• Maintenance: Continuous IV infusion (15-18 IU/kg/h) adjusted to target aPTT of 1.5 - 2.5 times control (or anti-Xa 0.3 - 0.7 IU/mL).',
    backAr: '• بلعة وريدية: 5,000 وحدة أو 70-80 و/كغ هيبارين غير مجزأ فور الاشتباه.\n• التسريب المستمر: 15-18 و/كغ/ساعة لضبط aPTT بين 1.5 إلى 2.5 ضعف الطبيعي.',
    referenceCitation: 'ESVS 2024 Acute Limb Ischaemia Guidelines, Rec. 4.1',
    status: 'learning',
    reviewCount: 0
  },
  {
    id: 'fc-bk-02',
    topic: 'ESVS 2024 AAA Guidelines',
    subtopic: 'EVAR Anatomical Neck Criteria',
    category: 'Aorta',
    difficulty: 'Intermediate',
    sourceOrigin: 'books',
    frontEn: 'What are the classic IFU criteria for standard infrarenal EVAR aortic neck?',
    frontAr: 'ما هي معايير عنق الأبهر القياسية (IFU) المناسبة لقسطرة EVAR التقليدية؟',
    backEn: '1. Neck Length: >= 10 - 15 mm of non-aneurysmal aorta below lowest renal artery.\n2. Neck Diameter: <= 28 - 32 mm.\n3. Neck Angulation (Beta angle): <= 60 degrees.\n4. Circumferential Thrombus/Calcification: < 50% of the circumference.\n5. Neck Shape: Cylindrical (not conical/reverse tapered).',
    backAr: '1. طول العنق: >= 10 إلى 15 مم من أبهر سليم تحت أوطى شريان كلوي.\n2. قطر العنق: <= 28 إلى 32 مم.\n3. زاوية الانحناء: <= 60 درجة.\n4. التكلس/الخثار: أقل من 50% من محيط العنق.\n5. الشكل: أسطواني (غير مخروطي).',
    referenceCitation: 'ESVS 2024 AAA Guidelines & SVS EVAR Criteria',
    status: 'new',
    reviewCount: 0
  },
  {
    id: 'fc-bk-03',
    topic: 'Rutherford Chapter 112',
    subtopic: 'Anatomy of 4 Lower Leg Compartments',
    category: 'Trauma',
    difficulty: 'Advanced',
    sourceOrigin: 'books',
    frontEn: 'Name the four anatomical leg compartments and the primary nerve/artery within each:',
    frontAr: 'اذكر حجرات الساق الأربع مع العصب والشريان الرئيسي داخل كل حجرة:',
    backEn: '1. Anterior: Deep peroneal nerve, Anterior tibial artery.\n2. Lateral: Superficial peroneal nerve (pierces fascia in distal 1/3).\n3. Superficial Posterior: Sural nerve.\n4. Deep Posterior: Tibial nerve, Posterior tibial artery, Peroneal (fibular) artery.',
    backAr: '1. الحجرة الأمامية: العصب الشظوي العميق، الشريان الظنبوبي الأمامي.\n2. الحجرة الوحشية: العصب الشظوي السطحي.\n3. الحجرة الخلفية السطحية: العصب الربلي.\n4. الحجرة الخلفية العميقة: العصب الظنبوبي، الشريان الظنبوبي الخلفي، الشريان الشظوي.',
    referenceCitation: "Rutherford's Vascular Surgery 10th Ed., Ch. 112",
    status: 'learning',
    reviewCount: 0
  },
  // --- FROM EXTERNAL INTERNATIONAL BOARDS ---
  {
    id: 'fc-ext-01',
    topic: 'FEBVS Board Question Focus',
    subtopic: 'Fontaine vs Rutherford Classification for PAD',
    category: 'Arterial',
    difficulty: 'Intermediate',
    sourceOrigin: 'external',
    frontEn: 'How does Fontaine Stage correspond to Rutherford Category in Chronic Limb Ischemia?',
    frontAr: 'كيف يقابل تصنيف فونتين (Fontaine) تصنيف رذرفورد (Rutherford) في إقفار الأطراف المزمن؟',
    backEn: '• Fontaine I: Asymptomatic = Rutherford 0\n• Fontaine IIa: Mild claudication (>200m) = Rutherford 1\n• Fontaine IIb: Moderate-severe claudication (<200m) = Rutherford 2-3\n• Fontaine III: Ischemic rest pain = Rutherford 4\n• Fontaine IV: Tissue loss (ulcer/gangrene) = Rutherford 5 (minor loss) & 6 (major loss).',
    backAr: '• فونتين I: لا أعراض = رذرفورد 0\n• فونتين IIa: عرج خفيف (>200م) = رذرفورد 1\n• فونتين IIb: عرج متوسط-شديد (<200م) = رذرفورد 2-3\n• فونتين III: ألم راحة إقفاري = رذرفورد 4\n• فونتين IV: تنخر أنسجة وقروح = رذرفورد 5 و 6.',
    referenceCitation: 'European Board of Vascular Surgery (FEBVS) Curriculum',
    status: 'new',
    reviewCount: 0
  },
  {
    id: 'fc-ext-02',
    topic: 'American Board of Surgery (ABS)',
    subtopic: 'Endoleak Classifications I - V',
    category: 'Aorta',
    difficulty: 'Advanced',
    sourceOrigin: 'external',
    frontEn: 'Detail the 5 types of endoleaks following EVAR and their urgent management indications:',
    frontAr: 'فصّل الأنواع الخمسة للتسريب الداخلي (Endoleaks) بعد EVAR ودواعي العلاج العاجل:',
    backEn: '• Type I: Attachment site leak (IA proximal, IB distal, IC iliac occluder) -> HIGH PRESSURE. Urgent repair required!\n• Type II: Branch retrograde flow (lumbar or IMA) -> Monitor unless sac grows >5 mm.\n• Type III: Modular disconnect or fabric tear -> HIGH PRESSURE. Urgent repair required!\n• Type IV: Graft wall porosity (self-resolves within 48h).\n• Type V: Endotension (sac growth without visible contrast leak).',
    backAr: '• النوع I: تسريب في منطقة التثبيت (IA علوي، IB سفلي) -> ضغط أورطي كامل، يستوجب تدخلاً فورياً!\n• النوع II: تدفق رجعي من شرايين قطنية أو مساريقي سفلي -> مراقبة ما لم يتسع الكيس >5 مم.\n• النوع III: انفصال مكونات الدعامة أو تمزق القماش -> يستوجب تدخلاً فورياً!\n• النوع IV: نفاذية نسيج الدعامة (يزول تلقائياً).\n• النوع V: ضغط داخلي Endotension دون تسريب صبغة مرئي.',
    referenceCitation: 'ABS Vascular Board Exam; J Vasc Surg Guidelines',
    status: 'learning',
    reviewCount: 0
  },
  {
    id: 'fc-ext-03',
    topic: 'FRCS Vascular Board',
    subtopic: 'Shamblin Classification of Carotid Body Tumors',
    category: 'Carotid',
    difficulty: 'Advanced',
    sourceOrigin: 'external',
    frontEn: 'What is the Shamblin classification for Carotid Body Tumors (Paragangliomas)?',
    frontAr: 'ما هو تصنيف شامبلن (Shamblin) لأورام الجسم السباتي (Carotid Body Tumors)؟',
    backEn: '• Group I: Small, localized tumor minimally attached to carotid vessels; easily dissected in the subadventitial plane.\n• Group II: Moderately sized tumor partially encasing carotid vessels; requires careful dissection.\n• Group III: Large tumor completely encasing (360 degrees) the carotid bifurcation and internal carotid artery; high risk of cranial nerve injury and frequently requires carotid shunt/resection with graft interposition.',
    backAr: '• الفئة I: ورم صغير ملتصق جزئياً بالأوعية ويسهل استئصاله في مستوى تحت البرانية.\n• الفئة II: ورم متوسط يحيط بالأوعية جزئياً.\n• الفئة III: ورم كبير يحيط بتفرع السباتي 360 درجة بالكامل؛ خطورة عالية على الأعصاب القحفية وغالباً يحتاج تحويلة جراحية وترميم شرياني برقعة.',
    referenceCitation: 'Royal College FRCS Vascular Surgery Pearls; Shamblin et al.',
    status: 'new',
    reviewCount: 0
  }
];
