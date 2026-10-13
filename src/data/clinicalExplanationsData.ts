export interface MedicalVideoResource {
  id: string;
  title: string;
  titleAr: string;
  platform: 'YouTube' | 'SVS' | 'Medscape' | 'EJVES';
  url: string;
  duration?: string;
  author: string;
  description: string;
  descriptionAr: string;
}

export interface MedicalDiagramResource {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  svgType:
    | 'ali_fogarty'
    | 'aaa_evar'
    | 'cea_anatomy'
    | 'pad_bypass'
    | 'dvt_veins'
    | 'avf_fistula'
    | 'trauma_shunt'
    | 'taaa_dissection'
    | 'mesenteric_anatomy'
    | 'cvd_evla'
    | 'vgi_nais'
    | 'popliteal_anatomy'
    | 'tos_anatomy'
    | 'fasciotomy_4compartment'
    | 'renal_stenosis'
    | 'diabetic_foot_angiosomes'
    | 'carotid_body_tumor'
    | 'pseudoaneurysm_repair'
    | 'dynamic_consultant_schema';
  caption: string;
  captionAr: string;
  customDetails?: {
    arteryName?: string;
    arteryNameAr?: string;
    lesionType?: string;
    lesionTypeAr?: string;
    keyLandmarks?: string[];
  };
}

export interface ComprehensiveTopicDetails {
  topicKey: string;
  titleEn: string;
  titleAr: string;
  category: string;
  pathophysiology: {
    definitionEn: string;
    definitionAr: string;
    etiologyEn: string[];
    etiologyAr: string[];
    classificationEn: string[];
    classificationAr: string[];
  };
  symptoms: {
    cardinalSignsEn: string[];
    cardinalSignsAr: string[];
    physicalExamEn: string[];
    physicalExamAr: string[];
    bedsideTestsEn: string[];
    bedsideTestsAr: string[];
  };
  diagnosticWorkup: {
    labsEn: string[];
    labsAr: string[];
    imagingDuplexEn: string[];
    imagingDuplexAr: string[];
    imagingCtaEn: string[];
    imagingCtaAr: string[];
    imagingAngioEn: string[];
    imagingAngioAr: string[];
  };
  medicalTherapy: {
    drugs: {
      name: string;
      nameAr: string;
      exactDose: string;
      exactDoseAr: string;
      indication: string;
      indicationAr: string;
      sideEffects: string;
      sideEffectsAr: string;
    }[];
    supportiveCareEn: string[];
    supportiveCareAr: string[];
  };
  surgicalProcedures: {
    procedureNameEn: string;
    procedureNameAr: string;
    type: 'Open Surgery' | 'Endovascular' | 'Hybrid';
    stepsEn: string[];
    stepsAr: string[];
    surgicalPearlsEn: string[];
    surgicalPearlsAr: string[];
    complicationsEn: string[];
    complicationsAr: string[];
  }[];
  diagrams: MedicalDiagramResource[];
  videos: MedicalVideoResource[];
}

export const CLINICAL_TOPICS_DATABASE: Record<string, ComprehensiveTopicDetails> = {
  ali: {
    topicKey: 'ali',
    titleEn: 'Acute Limb Ischemia (ALI) - Comprehensive Clinical Protocol',
    titleAr: 'إقفار الأطراف الحاد (ALI) - الشرح السريري والجراحي الشامل',
    category: 'Arterial Emergency',
    pathophysiology: {
      definitionEn: 'Sudden decrease in limb perfusion within 14 days threatening extremity viability, requiring urgent revascularization to prevent neuromuscular necrosis.',
      definitionAr: 'انخفاض مفاجئ في تروية الطرف خلال مدة أقل من 14 يوماً يهدد حيوية العضو ويستلزم إعادة تروية طارئة لتفادي تموت الأنسجة العصبية والعضلية.',
      etiologyEn: [
        'Cardioembolism (80% of emboli): Atrial fibrillation, mural thrombus post-MI, prosthetic valves.',
        'Acute thrombosis of preexisting atherosclerotic stenosis (most common in older patients).',
        'Graft or stent thrombosis (late failure of bypass grafts or stents).',
        'Popliteal artery aneurysm thrombosis or distal embolization.',
        'Iatrogenic or blunt arterial trauma.'
      ],
      etiologyAr: [
        'الانصمام القلبي المنشأ (80% من الصمات): الرجفان الأذيني، خثرة جدارية بعد احتشاء العضلة القلبية، الصمامات الصناعية.',
        'تخثر حاد فوق تضيق عصيدي مسبق (السبب الأكثر شيوعاً عند كبار السن).',
        'تخثر طعم جراحي أو دعامة سابقة (فشل متأخر للمجازة).',
        'تخثر أم دم الشريان المأبضي أو انصمام صمات منها نحو الأطراف السفلية.',
        'إصابة شريانية علاجية أو رضية كليلة.'
      ],
      classificationEn: [
        'Rutherford Class I (Viable): No sensory loss, no muscle weakness; audible arterial & venous Doppler signals.',
        'Rutherford Class IIa (Marginally Threatened): Mild sensory loss limited to toes, no motor deficit; inaudible arterial Doppler, audible venous Doppler.',
        'Rutherford Class IIb (Immediately Threatened): Sensory loss extending beyond toes with rest pain, mild-to-moderate motor weakness (toe/foot drop); inaudible arterial Doppler, audible venous Doppler. DEMANDS IMMEDIATE SURGERY.',
        'Rutherford Class III (Irreversible): Profound anesthesia, paralysis, calf muscle rigor/marbling; both arterial & venous Doppler signals silent. Demands primary amputation.'
      ],
      classificationAr: [
        'تصنيف رذرفورد الفئة I (حيوية كاملة): لا يوجد فقد حسي، لا يوجد ضعف حركي؛ إشارات الدوبلر الشرياني والوريدي مسموعة.',
        'تصنيف رذرفورد الفئة IIa (مهدد بشكل طفيف): خدر خفيف مقتصر على أصابع القدم، لا يوجد ضعف حركي؛ إشارة الشريان صامتة، والوريد مسموع.',
        'تصنيف رذرفورد الفئة IIb (مهدد فورياً): خدر يتجاوز الأصابع مع ألم في الراحة، ضعف حركي (تدلي القدم/أصابع القدم)؛ الشريان صامت، والوريد مسموع. يستلزم التدخل الجراحي الفوري دون أي تأخير.',
        'تصنيف رذرفورد الفئة III (غير عكوس/تموت): خدر تام، شلل عضلي، تيبس صملي (Rigor) وتبقع جلدي؛ غياب تام لإشارات الدوبلر الشرياني والوريدي. يتطلب البتر الأولي لتجنب التسمم المميت.'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Pain (acute, severe, constant distal extremity pain refractory to analgesics)',
        'Pallor (cadaveric white appearance of the foot/toes, poor capillary refill > 3s)',
        'Pulselessness (absent femoral, popliteal, dorsalis pedis, or posterior tibial pulses)',
        'Paresthesia (early sign of ischemic nerve compromise; light touch and pinprick loss)',
        'Paralysis (late ominous sign of skeletal muscle ischemia; foot drop or inability to move toes)',
        'Poikilothermia (polar coolness of the affected limb compared to contralateral side)'
      ],
      cardinalSignsAr: [
        'الألم (Pain): ألم حاد، شديد، مستمر في نهاية الطرف لا يستجيب للمسكنات العادية',
        'الشحوب (Pallor): مظهر شاحب شمعي للقدم والأصابع، مع امتداد زمن الامتلاء الشعري > 3 ثوانٍ',
        'غياب النبض (Pulselessness): اختفاء النبض الفخذي أو المأبضي أو ظهر القدم أو الظنبوبي الخلفي',
        'التنميل والخدر (Paresthesia): علامة مبكرة تدل على نقص تروية الألياف العصبية الحساسة',
        'الشلل والضعف الحركي (Paralysis): علامة خطيرة تدل على نقص تروية العضلات المخططة وتدلي القدم',
        'برودة الطرف (Poikilothermia): انخفاض ملموس في حرارة الطرف مقارنة بالطرف المقابل السليم'
      ],
      physicalExamEn: [
        'Bilateral pulse examination (femoral, popliteal, dorsalis pedis, posterior tibial).',
        'Sensory mapping of the superficial peroneal, deep peroneal, and tibial nerves.',
        'Motor evaluation: dorsiflexion, plantarflexion, and toe flexion.',
        'Assessment of calf compartment firmness (palpable tenseness indicates elevated compartment pressure).'
      ],
      physicalExamAr: [
        'فحص النبض المقارن في كلا الطرفين (الفخذي، المأبضي، ظهر القدم، الظنبوبي الخلفي).',
        'رسم الخريطة الحسية للأعصاب الشظوية السطحية والعميقة والعصب الظنبوبي.',
        'فحص الحركة: العطف الظهري للقدم، العطف الأخمصي، وحركة أصابع القدم.',
        'جس ثخانة وتوتر حجرات الساق (أي توتر مشدود يشير لارتفاع ضغط الحجرات).'
      ],
      bedsideTestsEn: [
        'Continuous-wave Handheld Doppler (8 MHz): Interrogation of pedal arteries and saphenous/tibial veins.',
        'Compartment pressure measurement (Stryker needle): Delta P < 30 mmHg (diastolic BP minus compartment pressure) indicates compartment syndrome.'
      ],
      bedsideTestsAr: [
        'الدوبلر المحمول المستمر (8 MHz): فحص شرايين القدم وأوردة الساق بجانب السرير.',
        'قياس ضغط الحجرات بإبرة سترايكر: فارق ضغط Delta P < 30 ملم زئبق يعني متلازمة حجرات مؤكدة.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Serum Creatine Kinase (CPK): Baseline marker of rhabdomyolysis and muscle necrosis.',
        'Serum Potassium (K+): Monitoring for fatal hyperkalemia upon reperfusion.',
        'Serum Myoglobin & Urine Dipstick: Detection of myoglobinuria to prevent acute tubular necrosis (ATN).',
        'Renal Function Profile (BUN & Serum Creatinine) for baseline and contrast risk.',
        'Complete Blood Count (CBC) with Platelets and Baseline Coagulation (PT, INR, aPTT).'
      ],
      labsAr: [
        'إنزيم الكرياتين كينيز (CPK): المؤشر المخبري الرئيسي لانحلال الربيدات وتموت العضلات.',
        'بوتاسيوم المصل (K+): رصد فرط بوتاسيوم الدم القاتل عند استعادة التروية.',
        'الميوغلوبين في المصل وشريط البول: كشف بيلة الميوغلوبين لمنع النخر الأنبوبي الكلوي الحاد.',
        'وظائف الكلى (اليوريا والكرياتينين) لتقييم الكلى ومخاطر الصبغة.',
        'تعداد دم كامل مع الصفيحات وزمن التخثر الأساسي (PT, INR, aPTT).'
      ],
      imagingDuplexEn: [
        'Color Duplex Ultrasound: Rapid noninvasive bedside localization of thrombus, flow velocity, and waveform dampening (monophasic flow distally).'
      ],
      imagingDuplexAr: [
        'الدوبلر الملون (Duplex Ultrasound): تحديد موضع الخثرة بسرعة، غياب التدفق أو وجود موجة أحادية الطور ضعيفة.'
      ],
      imagingCtaEn: [
        'Contrast Computed Tomography Angiography (CTA Runoff): 1 mm slice acquisition from diaphragm to toes. INDICATION: Only in Rutherford I or IIa limbs where viability is NOT immediately threatened. NEVER delay OR for CTA in Rutherford IIb.'
      ],
      imagingCtaAr: [
        'الأشعة المقطعية بالصبغة للشرايين (CTA Runoff): مقاطع 1 مم من الحجاب الحاجز للقدمين. الاستطباب: حصرياً في فئات رذرفورد I أو IIa المستقرة. يُحظر تأخير غرفة العمليات لإجراء الأشعة في فئة IIb.'
      ],
      imagingAngioEn: [
        'Digital Subtraction Angiography (DSA) / On-table Angiography: Fluoroscopic roadmap during intervention, confirming distal runoff patency.'
      ],
      imagingAngioAr: [
        'تصوير الأوعية بالطرح الرقمي (DSA) داخل غرفة العمليات: خريطة طريق شعاعية فورية للتأكد من نفاذية الشرايين الجريانية البعيدة.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Unfractionated Heparin (UFH)',
          nameAr: 'الهيبارين غير المجزأ الوريدي (UFH)',
          exactDose: 'IV Bolus: 80 Units/kg (or 5,000 IU stat); Maintenance: 18 Units/kg/hour continuous infusion.',
          exactDoseAr: 'جرعة تحميل وريدية فورية: 80 وحدة دولية/كغ (أو 5000 وحدة)، ثم ضخ وريدي مستمر بمعدل 18 وحدة دولية/كغ/ساعة.',
          indication: 'Immediate anticoagulation upon clinical diagnosis to arrest thrombus propagation and protect microcirculation.',
          indicationAr: 'تثبيط التخثر الفوري فور الاشتباه السريري لمنع استطالة الخثرة وحماية الشعيرات الدموية الدقيقة.',
          sideEffects: 'Major hemorrhage, Heparin-Induced Thrombocytopenia (HIT Type II - antibody mediated), monitor platelets every 48h.',
          sideEffectsAr: 'النزف الشديد، قلة الصفيحات المحدثة بالهيبارين (HIT Type II)، يلزم مراقبة الصفيحات كل 48 ساعة.'
        },
        {
          name: 'Sodium Bicarbonate (8.4%) & IV Fluids',
          nameAr: 'بيكربونات الصوديوم والسوائل الوريدية',
          exactDose: 'Normal Saline infusion at 150-200 mL/hr + 100 mEq NaHCO3 per liter IV fluid to maintain urine pH > 6.5.',
          exactDoseAr: 'محلول ملحي طبيعي بمعدل 150-200 مل/ساعة مع إضافة 100 مكافئ بيكربونات صوديوم للحفاظ على قلوية البول (pH > 6.5).',
          indication: 'Prophylaxis against myoglobinuric acute renal failure and metabolic acidosis post-reperfusion.',
          indicationAr: 'الوقاية من القصور الكلوي الحاد الناتج عن الميوغلوبين والحماض الاستقلابي بعد إعادة التروية.',
          sideEffects: 'Fluid overload, hypernatremia, metabolic alkalosis.',
          sideEffectsAr: 'فرط الحمل السائلي، فرط صوديوم الدم، القلاء الاستقلابي.'
        },
        {
          name: 'Recombinant Tissue Plasminogen Activator (Alteplase / rt-PA)',
          nameAr: 'منشط البلازمينوجين النسيجي (rt-PA / Alteplase)',
          exactDose: 'Catheter-Directed Thrombolysis (CDT): 0.5 to 1.0 mg/hour infused through multi-sidehole catheter + low-dose Heparin (500 U/hr).',
          exactDoseAr: 'إذابة موجهة بالقسطرة (CDT): ضخ 0.5 إلى 1.0 ملغ/ساعة عبر قسطرة متعددة الثقوب مع هيبارين منخفض الجرعة (500 وحدة/ساعة).',
          indication: 'Reserved strictly for Rutherford Class I and selected IIa native thrombosis or thrombosed prosthetic bypass grafts < 14 days.',
          indicationAr: 'مخصص حصرياً لفئات رذرفورد I و IIa في حالات التخثر الشرياني أو تخثر الطعوم الجراحية < 14 يوماً.',
          sideEffects: 'Intracranial hemorrhage (1-2%), puncture site hematoma, severe systemic bleeding. Monitor fibrinogen q4-6h (stop if < 100 mg/dL).',
          sideEffectsAr: 'النزف الدماغي (1-2%)، ورم دموي بموقع الوخز، نزف جهازي. يلزم قياس الفيبرينوجين كل 4-6 ساعات (إيقاف العلاج إذا قل عن 100 ملغ/دل).'
        }
      ],
      supportiveCareEn: [
        'Supplemental Oxygen therapy to maximize oxygen content in borderline tissues.',
        'Keep limb dependent (15 degrees below bed level) to improve gravity-assisted perfusion; DO NOT elevate limb.',
        'Do not apply direct external heat or ice packs to the ischemic limb (causes thermal necrosis).'
      ],
      supportiveCareAr: [
        'إعطاء أكسجين داعم لزيادة تشبع الأنسجة المعرضة للإقفار.',
        'إبقاء الطرف مائلاً للأسفل بمقدار 15 درجة للاستفادة من الجاذبية؛ يُمنع رفع الطرف لأعلى إطلاقاً.',
        'تجنب وضع كمادات ساخنة أو ثلجية مباشرة على الطرف المصاب لتفادي تموت الجلد.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Surgical Balloon Embolectomy (Fogarty Catheter Technique)',
        procedureNameAr: 'استئصال الصمة الشريانية بقسطرة فوغارتي بالبالون',
        type: 'Open Surgery',
        stepsEn: [
          '1. Positioning & Prep: Supine position, prep from umbilicus to bilateral toes to allow proximal control and fasciotomy.',
          '2. Anesthesia: Local anesthesia with monitored anesthesia care (MAC) or general anesthesia.',
          '3. Femoral Cutdown: Longitudinal or oblique groin incision over the femoral pulse/groove. Identify Common Femoral Artery (CFA), Superficial Femoral Artery (SFA), and Profunda Femoris Artery (PFA).',
          '4. Vascular Control: Encircle CFA, SFA, and PFA with vessel loops; administer 5000 U IV Heparin prior to cross-clamping.',
          '5. Arteriotomy: Transverse arteriotomy on CFA just proximal to bifurcation (or longitudinal if patch plasty planned).',
          '6. Catheter Sizing & Passage: Pass 4F Fogarty balloon catheter proximally into external iliac/aorta to test inflow; inflate with sterile saline until mild resistance and withdraw gently.',
          '7. Distal Thrombectomy: Pass 4F Fogarty down SFA, and 3F Fogarty down PFA and into tibial vessels. Gently withdraw while deflating gradually as caliber tapers.',
          '8. Back-bleeding & Flushing: Ensure vigorous pulsatile inflow and active back-bleeding; flush with 50 mL heparinized saline (50 U/mL).',
          '9. Arterial Closure: Close transverse arteriotomy with interrupted or running 5-0 or 6-0 polypropylene (Prolene) sutures.',
          '10. Completion Assessment: Confirm palpable pedal pulses or audible multiphasic Doppler signals, evaluate calf compartment pressures.'
        ],
        stepsAr: [
          '1. الوضعية والتعقيم: استلقاء ظهري، تعقيم من السرة حتى أصابع القدمين لكلا الطرفين لإتاحة التحكم الوعائي وبضع اللفافة.',
          '2. التخدير: تخدير موضعي مراقب (MAC) أو تخدير عام وفق حالة المريض.',
          '3. الشق الفخذي: شق طولي أو مائل في المغبن فوق الشريان الفخذي المشترك (CFA) والشريان الفخذي السطحي (SFA) والفخذي العميق (PFA).',
          '4. التحكم الوعائي: عزل الشرايين الثلاثة بحلقات أوعية (Vessel loops)، وإعطاء 5000 وحدة هيبارين قبل وضع المشابك.',
          '5. بضع الشريان (Arteriotomy): بضع مستعرض في الشريان الفخذي المشترك قبل التفرع مباشرة.',
          '6. تمرير قسطرة فوغارتي وسحبها: إدخال قسطرة فوغارتي قياس 4F للأعلى (المدخل) ونفخ البالون بمحلول ملحي معقم وسحبه بلطف.',
          '7. استئصال الخثرات البعيدة: تمرير قسطرة 4F في الشريان الفخذي السطحي وقسطرة 3F في الفخذي العميق وشرايين الساق مع سحب الخثرات.',
          '8. التحقق من التروية والغسيل: التأكد من تدفق شرياني نابض قوي وتدفق راجع سليم، وغسيل الشريان بمحلول ملحي مع هيبارين (50 وحدة/مل).',
          '9. خياطة الشريان: إغلاق البضع الشرياني بغرز خيط برولين 5-0 أو 6-0 دون تضييق القطر.',
          '10. التقييم النهائي: جس النبض في القدم وفحص الإشارات بالدوبلر وتقييم ضغط حجرات الساق فوراً.'
        ],
        surgicalPearlsEn: [
          'Never overinflate Fogarty balloon: tactile feedback is critical to avoid arterial dissection or rupture.',
          'Fogarty sizing rule: 4F for common/superficial femoral, 3F for popliteal/tibials.',
          'Always retrieve back-bleeding catheter slowly, gradually releasing balloon pressure as vessel narrows distally.'
        ],
        surgicalPearlsAr: [
          'لا تفرط في نفخ بالون فوغارتي إطلاقاً: الإحساس اللمسي ضروري لتجنب تسلخ أو تمزق جدار الشريان.',
          'قاعدة قياسات قسطرة فوغارتي: قياس 4F للفخذي المشترك والسطحي، وقياس 3F للمأبضي وشرايين الساق.',
          'اسحب القسطرة بهدوء مع تقليل نفخ البالون تدريجياً كلما ضاق قطر الشريان باتجاه الطرف.'
        ],
        complicationsEn: [
          'Arterial intimal dissection or rupture by overinflated balloon.',
          'Distal atheroembolization into pedal microcirculation.',
          'Compartment syndrome developing after revascularization.'
        ],
        complicationsAr: [
          'تسلخ بطانة الشريان أو تمزقه بسبب النفخ المفرط للبالون.',
          'انصمام شظايا عصيدية نحو شعيرات القدم البعيدة (Trash foot).',
          'حدوث متلازمة الحجرات الحادة بعد استعادة التدفق الدموي.'
        ]
      },
      {
        procedureNameEn: 'Two-Incision Four-Compartment Calf Fasciotomy',
        procedureNameAr: 'بضع اللفافة رباعي الحجرات للساق بشقين جراحيين',
        type: 'Open Surgery',
        stepsEn: [
          '1. Indication Confirmation: Ischemia time > 4-6 hours, firm woody calf upon reperfusion, or delta pressure < 30 mmHg.',
          '2. Anterolateral Incision: 15-20 cm longitudinal skin incision placed 2 cm anterior to the fibular shaft, halfway between fibula and tibial crest.',
          '3. Anterior & Lateral Compartment Release: Incise anterior intermuscular septum transversely to locate the superficial peroneal nerve; make longitudinal fasciotomies of anterior compartment and lateral (peroneal) compartment protecting the nerve.',
          '4. Posteromedial Incision: 15-20 cm longitudinal skin incision placed 2 cm posterior to the posterior medial border of the tibia.',
          '5. Superficial Posterior Compartment Release: Incise gastrocnemius-soleus fascia longitudinally along entire incision length.',
          '6. Deep Posterior Compartment Release: Detach soleus muscle bridge from posterior tibia, dissect fascia overlying tibialis posterior and flexor digitorum longus, release completely.',
          '7. Hemostasis & Dressing: Achieve meticulous hemostasis; cover open muscle with moist saline dressings or negative pressure wound therapy (VAC). DO NOT attempt primary skin closure.'
        ],
        stepsAr: [
          '1. تأكيد الاستطباب: زمن نقص التروية > 4-6 ساعات، تيبس خشبي في الساق عند استعادة التروية، أو فارق ضغط الحجرة < 30 ملم زئبق.',
          '2. الشق الأمامي الوحشي: شق جلدي طولي 15-20 سم يقع على بعد 2 سم أمام عظم الشظية بين الشظية وحافة الظنبوب.',
          '3. تحرير الحجرة الأمامية والوحشية: فتح الحاجز بين العضلات بحذر لتحديد العصب الشظوي السطحي، ثم شق لفافة الحجرة الأمامية والحجرة الوحشية طولياً مع حماية العصب.',
          '4. الشق الخلفي الإنسي: شق جلدي طولي 15-20 سم يقع على بعد 2 سم خلف الحافة الخلفية الإنسية لعظم الظنبوب.',
          '5. تحرير الحجرة الخلفية السطحية: شق لفافة العضلة التوأمية الساقية والنعلية طولياً على امتداد الشق.',
          '6. تحرير الحجرة الخلفية العميقة: فصل جسر العضلة النعلية عن عظم الظنبوب وتحرير اللفافة المغطية للعضلة الظنبوبية الخلفية بشكل كامل.',
          '7. الإرقاء وتضميد الجرح: إرقاء دقيق؛ تغطية العضلات بشاش رطب معقم أو جهاز الضغط السلبي (VAC). يُمنع إغلاق الجلد أولياً إطلاقاً.'
        ],
        surgicalPearlsEn: [
          'Skin incisions must be generous (at least 15 cm): a small skin incision acts as a tourniquet defeating the purpose.',
          'Always identify and protect the Superficial Peroneal Nerve during lateral compartment opening.',
          'Failure to decompress the Deep Posterior Compartment is the most common pitfall in fasciotomy.'
        ],
        surgicalPearlsAr: [
          'يجب أن يكون شق الجلد كافياً وواسعاً (15 سم على الأقل): الشق الصغير يعمل كرباط ضاغط ويلغي فائدة العملية.',
          'احرص دائماً على كشف وحماية العصب الشظوي السطحي أثناء فتح الحجرة الوحشية.',
          'إغفال تحرير الحجرة الخلفية العميقة هو الخطأ الجراحي الأكثر شيوعاً في عمليات بضع اللفافة.'
        ],
        complicationsEn: [
          'Superficial peroneal nerve injury causing sensory loss over dorsum of foot.',
          'Chronic muscle herniation, cosmetic deformity, and need for delayed split-thickness skin grafting (STSG).'
        ],
        complicationsAr: [
          'إصابة العصب الشظوي السطحي مسبباً فقدان الإحساس في ظهر القدم.',
          'فتق عضلي مزمن، تشوه تجميلي، والحاجة لطعم جلدي رقيق متأخر (STSG).'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-fogarty',
        title: 'Fogarty Arterial Catheter Balloon Embolectomy Mechanism',
        titleAr: 'آلية عمل قسطرة بالون فوغارتي لاستئصال الخثرات الشريانية',
        category: 'Surgical Technique',
        svgType: 'ali_fogarty',
        caption: 'Passage of deflated Fogarty catheter past thromboembolus, controlled saline inflation, and gentle retrograde extraction.',
        captionAr: 'تمرير قسطرة فوغارتي غير المنفوخة عبر الخثرة، ثم نفخ البالون بمحلول معقم وسحب الخثرة بلطف للأعلى.'
      },
      {
        id: 'diag-fasciotomy',
        title: 'Calf 4-Compartment Anatomy & Two-Incision Fasciotomy Zones',
        titleAr: 'تشريح حجرات الساق الأربع ومسارات شقوق بضع اللفافة',
        category: 'Surgical Anatomy',
        svgType: 'trauma_shunt',
        caption: 'Anterolateral incision decompressing Anterior and Lateral compartments; Posteromedial incision decompressing Superficial and Deep posterior compartments.',
        captionAr: 'الشق الأمامي الوحشي يحرر الحجرة الأمامية والوحشية، والشق الخلفي الإنسي يحرر الحجرة السطحية والعميقة.'
      }
    ],
    videos: [
      {
        id: 'vid-ali-1',
        title: 'Fogarty Balloon Catheter Embolectomy: Step-by-Step Surgical Technique',
        titleAr: 'خطوات استئصال الصمة بقسطرة فوغارتي خطوة بخطوة (فيديو جراحي تعليمي)',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=fogarty+catheter+embolectomy+surgical+technique',
        author: 'Society for Vascular Surgery (SVS) Educational Channel',
        description: 'Complete operative demonstration of femoral artery cutdown, Fogarty pass, clot extraction, and arteriotomy closure.',
        descriptionAr: 'عرض عملي كامل للشق الجراحي الفخذي، تمرير قسطرة فوغارتي، استخراج الخثرات، وإغلاق الشريان.'
      },
      {
        id: 'vid-ali-2',
        title: 'Two-Incision Four-Compartment Calf Fasciotomy Operative Guide',
        titleAr: 'دليل جراحة بضع اللفافة رباعي الحجرات للساق بشقين (فيديو تعليمي معتمد)',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=two+incision+four+compartment+calf+fasciotomy+surgical+video',
        author: 'Vascular & Trauma Surgery Channel',
        description: 'Detailed anatomical landmarks, incision zones, nerve preservation, and deep posterior compartment release.',
        descriptionAr: 'المعالم التشريحية الدقيقة، مناطق الشق، حماية الأعصاب، وتحرير الحجرة الخلفية العميقة.'
      },
      {
        id: 'vid-ali-3',
        title: 'ESVS Clinical Practice Guidelines on Acute Limb Ischaemia - Official Overview',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS) لنقص تروية الأطراف الحاد',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(24)00002-3/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Official clinical guidelines, diagnostic algorithms, and evidence level recommendations.',
        descriptionAr: 'الدليل الإرشادي الرسمي وخوارزميات التشخيص وتوصيات مستويات الدليل العلمي.'
      }
    ]
  },
  aaa: {
    topicKey: 'aaa',
    titleEn: 'Abdominal Aortic Aneurysm (AAA) - Full Clinical & Operative Masterclass',
    titleAr: 'تمدد الشريان الأورطي البطني (AAA) - الشرح السريري والجراحي الكامل',
    category: 'Aortic Disease',
    pathophysiology: {
      definitionEn: 'Permanent localized dilation of the abdominal aorta >= 3.0 cm or >= 50% increase over expected normal diameter, predominantly infrarenal.',
      definitionAr: 'توسع دائم وموضعي في الشريان الأبهر البطني يبلغ 3.0 سم أو أكثر، أو زيادة بنسبة 50% عن القطر الطبيعي المتوقع، ويكون غالباً تحت الشرايين الكلوية.',
      etiologyEn: [
        'Degenerative transmural elastin and collagen degradation via matrix metalloproteinases (MMP-2, MMP-9).',
        'Cigarette smoking (strongest modifiable risk factor, odds ratio > 5).',
        'Male sex, advanced age (> 65 years), hypertension, and atherosclerosis.',
        'Genetic predisposition (positive family history confers 20-30% first-degree relative risk).',
        'Connective tissue disorders (Marfan syndrome, Ehlers-Danlos vascular type, Loeys-Dietz).'
      ],
      etiologyAr: [
        'تنكس جداري مع تكسير بروتينات الإيلاستين والكولاجين بفعل إنزيمات الماتريكس ميتالوبروتينيز (MMP-2, MMP-9).',
        'تدخين التبغ (أقوى عامل خطر قابل للتعديل، نسبة الأرجحية > 5 أضعاف).',
        'الجنس الذكري، التقدم في العمر (> 65 سنة)، ارتفاع ضغط الدم، والتصلب العصيدي.',
        'العوامل الوراثية (وجود تاريخ عائلي يرفع خطر الإصابة لدى أقارب الدرجة الأولى إلى 20-30%).',
        'اعتلالات النسيج الضام (متلازمة مارفان، إهلرز-دانلوس، ولويس-ديتز).'
      ],
      classificationEn: [
        'Anatomical Location: Infrarenal (90-95%), Juxtarenal (abutting renal arteries without cuff), Pararenal (involving renal arteries), Suprarenal/Thoracoabdominal.',
        'Morphology: Fusiform (circumferential symmetric dilation, most common) vs Saccular (focal outpouching, higher rupture risk).',
        'Repair Threshold: Elective repair recommended at >= 5.5 cm in men and >= 5.0 cm in women, or rapid growth > 1.0 cm/year.'
      ],
      classificationAr: [
        'الموقع التشريحي: تحت كلوي (Infrarenal بنسبة 90-95%)، ملاصق للكلوي (Juxtarenal)، محيط بالشرايين الكلوية (Pararenal)، وفوق كلوي.',
        'الشكل المورفولوجي: مغزلي (Fusiform متناظر، وهو الأشيع) مقابل كيسي (Saccular بروز بؤري، ذو خطورة تمزق أعلى).',
        'عتبة التدخل الجراحي: يوصى بالإصلاح عند بلوغ القطر ≥ 5.5 سم للرجال و ≥ 5.0 سم للنساء، أو عند تمدد سريع > 1.0 سم سنوياً.'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Intact AAA: Asymptomatic in > 75% of cases; discovered incidentally on abdominal imaging or physical exam.',
        'Symptomatic Intact AAA: Vague dull abdominal, lumbar, or flank pain; transient peripheral microembolization (Trash foot).',
        'Ruptured AAA Classical Triad: Severe acute abdominal/back pain, pulsatile abdominal mass, and profound hemodynamic shock/collapse.'
      ],
      cardinalSignsAr: [
        'التمدد السليم غير المتمزق: غير عرضي في أكثر من 75% من الحالات؛ يكتشف صدفة بالأشعة أو الفحص الروتيني.',
        'التمدد العرضي: ألم مبهم في البطن أو الخاصرة أو أسفل الظهر؛ انصمام شظايا مجهرية نحو أصابع القدمين (Trash foot).',
        'الثالوث الكلاسيكي لتمزق الأبهر: ألم بطني/ظهري حاد وشديد، كتلة بطنية نابضة مجسوسة، وهبوط ضغط وصدمة دورانية حادة.'
      ],
      physicalExamEn: [
        'Gentle bimanual palpation of the epigastrium (pulsatile, expansile mass felt above the umbilicus).',
        'Auscultation for abdominal or femoral bruits.',
        'Femoral and distal pedal pulse examination.'
      ],
      physicalExamAr: [
        'الجس اللطيف بكلتا اليدين لأعلى البطن (كتلة نابضة متمددة محسوسة فوق السرة).',
        'إصغاء البطن والمغبن لتحري وجود نفخات وعائية (Bruits).',
        'فحص نبض الشرايين الفخذية وشرايين القدمين البعيدة.'
      ],
      bedsideTestsEn: [
        'Point-of-Care Ultrasound (POCUS / FAST exam): Immediate bedside visualization of aortic lumen diameter outer-to-outer and free retroperitoneal/peritoneal fluid.'
      ],
      bedsideTestsAr: [
        'الموجات فوق الصوتية المركزة بجانب السرير (POCUS/FAST): كشف فوري لقطر الأبهر من الجدار الخارجي للخارجي ووجود سوائل حرة.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Type and Crossmatch 4-6 units of packed red blood cells + FFP + Platelets (Massive Transfusion Protocol ready).',
        'Complete Blood Count, baseline Hemoglobin and Hematocrit.',
        'Renal function tests (BUN, Serum Creatinine, eGFR) and baseline electrolytes.'
      ],
      labsAr: [
        'تحديد فصيلة الدم والتحضير الفوري لـ 4-6 وحدات كريات دم حمراء مكدسة + بلازما طازجة + صفيحات (بروتوكول نقل الدم المكثف).',
        'تعداد دم كامل مع الهيموغلوبين والهيماتوكريت الأساسي.',
        'وظائف الكلى (الكرياتينين، اليوريا) والشوارد الأساسية.'
      ],
      imagingDuplexEn: [
        'Abdominal Duplex Ultrasound: Gold standard screening tool; sensitivity and specificity > 98% for detecting aortic dilation.'
      ],
      imagingDuplexAr: [
        'الدوبلر الملون للبطن (Abdominal Duplex): أداة المسح المعيارية الأولى بدقة ونوعية تتجاوز 98% لكشف تمدد الأبهر ومتابعته.'
      ],
      imagingCtaEn: [
        'Thin-Slice Contrast CTA (1 mm slice with 3D centerline reconstruction): Essential for EVAR planning. Assesses proximal neck length, diameter, angulation, calcification, thrombus, and iliac access caliber.'
      ],
      imagingCtaAr: [
        'الأشعة المقطعية متعددة المقاطع بالصبغة (CTA رقيقة المقاطع 1 مم مع إعادة بناء ثلاثية الأبعاد): الفحص الحاسم لتخطيط EVAR لتقييم طول عنق الأبهر وقطره وانحنائه وتكلساته وأوعية المدخل الحرقفية.'
      ],
      imagingAngioEn: [
        'On-table angiogram with calibrated marker pigtail catheter during EVAR procedure.'
      ],
      imagingAngioAr: [
        'تصوير الأوعية الظليل داخل العمليات باستخدام قسطرة بيغتيل مرقمة أثناء إجراء EVAR.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Atorvastatin (High-Intensity Statin)',
          nameAr: 'أتورفاستاتين (خافض كوليسترول عالي الكثافة)',
          exactDose: '80 mg orally once daily at bedtime.',
          exactDoseAr: '80 ملغ فموياً مرة واحدة يومياً عند النوم.',
          indication: 'Plaque stabilization, anti-inflammatory effect on aortic wall, reduces cardiovascular mortality.',
          indicationAr: 'تثبيت اللويحات العصيدية، تقليل الالتهاب بجدار الأبهر، وخفض الوفيات القلبية الوعائية.',
          sideEffects: 'Myalgia, rhabdomyolysis, elevated liver transaminases (ALT/AST).',
          sideEffectsAr: 'ألم عضلي، انحلال ربيدات، ارتفاع إنزيمات الكبد.'
        },
        {
          name: 'Antihypertensive: ACE-Inhibitor (Ramipril) / Beta-Blocker',
          nameAr: 'خافضات الضغط: راميبريل / حاصرات بيتا',
          exactDose: 'Ramipril 5 to 10 mg orally daily; Metoprolol succinate 50-100 mg daily (target BP < 130/80 mmHg).',
          exactDoseAr: 'راميبريل 5 إلى 10 ملغ فموياً يومياً؛ أو ميتوبرولول 50-100 ملغ (الهدف: ضغط < 130/80 ملم زئبق).',
          indication: 'Strict hemodynamic blood pressure control to reduce wall shear stress and expansion rate.',
          indicationAr: 'الضبط الصارم لضغط الدم لتقليل إجهاد القص على جدار الأبهر وإبطاء معدل تمدده.',
          sideEffects: 'Hypotension, hyperkalemia, dry cough (ACEi), bradycardia (Beta-blockers).',
          sideEffectsAr: 'هبوط ضغط الدم، فرط بوتاسيوم الدم، سعال جاف (ACEi)، وبطء القلب.'
        },
        {
          name: 'Ruptured AAA Resuscitation: Permissive Hypotension Protocol',
          nameAr: 'بروتوكول خفض الضغط المسموح به في تمزق الأبهر (Permissive Hypotension)',
          exactDose: 'Target Systolic Blood Pressure: 70 to 90 mmHg (Mean Arterial Pressure 50-65 mmHg) until proximal aortic clamp or balloon occlusion.',
          exactDoseAr: 'الضغط الانقباضي المستهدف: 70 إلى 90 ملم زئبق (متوسط الضغط الشرياني 50-65 ملم زئبق) حتى وضع المشبك أو نفخ بالون الإغلاق.',
          indication: 'Prevents dislodgement of fragile retroperitoneal clot; reduces catastrophic exsanguinating intra-abdominal hemorrhage.',
          indicationAr: 'يمنع تفكك الخثرة الهشة في الحيز خلف الصفاق ويحد من النزف البطني الصاعق.',
          sideEffects: 'Prolonged target organ hypoperfusion if cross-clamping is excessively delayed.',
          sideEffectsAr: 'نقص تروية الأعضاء الحيوية إذا طال التأخير قبل السيطرة الجراحية على النزف.'
        }
      ],
      supportiveCareEn: [
        'Complete cessation of all tobacco and nicotine products (mandatory).',
        'Avoid heavy isometric lifting or straining (Valsalva maneuvers).',
        'Structured surveillance: Duplex ultrasound every 12 months for 4.0-4.9 cm; every 6 months for 5.0-5.4 cm.'
      ],
      supportiveCareAr: [
        'الإقلاع التام والنهائي عن جميع منتجات التدخين والنيكوتين (إلزامي).',
        'تجنب حمل الأثقال الشديد والشد العضلي الشديد (مناورة فالسالفا).',
        'برنامج متابعة دوري: سونار كل 12 شهراً لقطر 4.0-4.9 سم؛ وكل 6 أشهر لقطر 5.0-5.4 سم.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Endovascular Aneurysm Repair (EVAR)',
        procedureNameAr: 'الإصلاح الوعائي داخل الشريان الأبهر بالدعامة المغطاة (EVAR)',
        type: 'Endovascular',
        stepsEn: [
          '1. Vascular Access: Bilateral common femoral artery percutaneous puncture (using pre-close Perclose ProGlide sutures) or open surgical cutdowns.',
          '2. Wire Access: Advance soft wire into aorta, exchange over catheter for stiff wire (Lunderquist or Meier wire) positioned in ascending aorta under fluoroscopy.',
          '3. Marking Angiogram: Place calibrated pigtail catheter at renal artery level; perform contrast run in LAO/RAO projection to profile lowest renal artery.',
          '4. Main Body Delivery: Introduce main bifurcated stent-graft delivery system over stiff wire from ipsilateral groin. Align proximal fabric edge exactly below lowest renal artery origin.',
          '5. Main Body Deployment: Deploy main body carefully, maintaining stable cranial positioning against hemodynamic drag.',
          '6. Contralateral Gate Cannulation: From contralateral groin, cannulate the short contralateral gate using steerable catheter and hydrophilic wire.',
          '7. Limb Extensions: Advance and deploy contralateral and ipsilateral iliac limb graft components with appropriate overlap (at least 3 cm).',
          '8. Balloon Molding: Dilate proximal neck seal, overlap modular junctions, and iliac landing zones using semi-compliant molding balloon (Coda balloon).',
          '9. Completion Angiography: Check for patent renal arteries, absence of Endoleaks (Type I, II, III), and patent hypogastric/femoral vessels.',
          '10. Hemostasis: Deploy percutaneous vascular closure devices or close femoral cutdowns, confirm bilateral pedal pulses.'
        ],
        stepsAr: [
          '1. المدخل الوعائي: وخز الشريان الفخذي المشترك في كلا المغبنين عبر الجلد (مع استخدام غرز الإغلاق ProGlide) أو بالشق الجراحي.',
          '2. تمرير الأسلاك التوجيهية: تمرير سلك مرن ثم استبداله بسلك صلب (Lunderquist) في الأبهر الصاعد تحت التوجيه الشعاعي.',
          '3. تصوير تحديد الشرايين الكلوية: وضع قسطرة بيغتيل مرقمة وحقن الصبغة لتحديد منشأ أدنى شريان كلوي بدقة.',
          '4. إدخال وتوجيه الدعامة الرئيسية: إدخال جسم الدعامة المتفرعة (Main Body) ومحاذاة الحافة العلوية أسفل أدنى شريان كلوي مباشرة.',
          '5. فتح الدعامة الرئيسية: فتح وتثبيت الجزء العلوي للدعامة مع الثبات ضد ضغط الدم الجرياني.',
          '6. الدخول عبر البوابة المقابلة: قسطرة البوابة القصيرة المقابلة للدعامة من الشريان الفخذي الآخر باستخدام سلك مرن وقسطرة موجهة.',
          '7. نشر الأطراف الحرقفية: إدخال وفتح أطراف الدعامة الحرقفية في كلا الجانبين مع تداخل مناسب (3 سم على الأقل).',
          '8. توسيع وتطبيع البالون: نفخ بالون التشكيل (Coda Balloon) عند منطقة الإغلاق العلوية ومناطق التداخل لتثبيت الدعامة ومنع التسريب.',
          '9. التصوير النهائي: التأكد من سلامة الشرايين الكلوية، وغياب أي تسريب وعائي (Endoleak)، ونفاذية الشرايين الحشوية والفخذية.',
          '10. إغلاق المداخل: شد غرز الإغلاق عبر الجلد أو خياطة الشق الفخذي، والتأكد من النبض في القدمين.'
        ],
        surgicalPearlsEn: [
          'Hostile neck criteria: Length < 15 mm, diameter > 28 mm, angulation > 60 degrees, or circumferential thrombus > 50%.',
          'Avoid covering the Internal Iliac (Hypogastric) Artery bilaterally to prevent pelvic ischemia, buttock claudication, and ischemic colitis.',
          'Immediate balloon molding is mandatory to prevent Type I attachment endoleaks.'
        ],
        surgicalPearlsAr: [
          'معايير العنق الصعب (Hostile Neck): طول < 15 مم، قطر > 28 مم، زاوية ميلان > 60 درجة، أو خثرة جدارية محيطية > 50%.',
          'تجنب إغلاق الشريان الحرقفي الباطن في الجانبين معاً للوقاية من إقفار الحوض والعرج الإليوي والتهاب القولون الإقفاري.',
          'تطبيع البالون فوراً بعد النشر ضروري لضمان الالتصاق المحكم ومنع التسريب من النوع الأول.'
        ],
        complicationsEn: [
          'Endoleaks: Type I (attachment leak - demands immediate fix), Type II (branch backflow), Type III (modular defect), Type IV (porosity), Type V (endotension).',
          'Iliac artery rupture or dissection during large-bore sheath passage.',
          'Renal artery accidental coverage causing acute kidney injury.'
        ],
        complicationsAr: [
          'التسريبات الوعائية (Endoleaks): النوع الأول (تسريب حافة الالتصاق - يستلزم علاجاً فورياً)، النوع الثاني (تدفق راجع من الفروع)، النوع الثالث (انفصال الأجزاء).',
          'تمزق أو تسلخ الشريان الحرقفي أثناء مرور الغمد الكبير.',
          'تغطية غير مقصودة للشريان الكلوي مسببة قصوراً كلوياً حاداً.'
        ]
      },
      {
        procedureNameEn: 'Open Transperitoneal Abdominal Aortic Aneurysm Repair',
        procedureNameAr: 'الإصلاح الجراحي المفتوح لتمدد الشريان الأبهر البطني عبر الصفاق',
        type: 'Open Surgery',
        stepsEn: [
          '1. Incision: Full midline laparotomy from xiphoid to pubis.',
          '2. Exposure: Evacuate small bowel into sterile bowel bag to the right side; incise posterior parietal peritoneum over aortic bifurcation.',
          '3. Renal Vein Identification: Mobilize duodenum (ligament of Treitz) to the right; identify and carefully preserve Left Renal Vein crossing anterior to the aorta.',
          '4. Neck & Iliac Control: Dissect proximal infrarenal neck; encircle common iliac arteries distally, taking care not to injure iliac veins beneath.',
          '5. Heparinization: Administer 5000 Units IV Heparin; wait 3 minutes for circulation.',
          '6. Clamping: Apply non-crushing vascular clamps to common iliac arteries first, then clamp infrarenal neck.',
          '7. Sac Aneurysmotomy: Open aneurysm sac longitudinally; oversew bleeding lumbar arteries and inferior mesenteric artery (IMA) with 2-0 or 3-0 Prolene figures-of-eight.',
          '8. Graft Anastomosis: Sew woven Dacron tube or bifurcated graft using 3-0 or 4-0 polypropylene running sutures (distal and proximal anastomoses).',
          '9. De-airing & Reperfusion: Flush limbs forward and backward, release clamps sequentially, restoring pelvic and lower limb flow.',
          '10. Closure: Wrap native aneurysm sac over Dacron graft to prevent aortoduodenal fistula; close abdominal wall in layers.'
        ],
        stepsAr: [
          '1. الشق الجراحي: شق بطني ناصف كامل من الرهابة حتى عظم العانة.',
          '2. التعريض: إبعاد الأمعاء الدقيقة في كيس معقم نحو الجانب الأيمن، وشق الصفاق الجداري الخلفي فوق تفرع الأبهر.',
          '3. تحديد الوريد الكلوي الأيسر: تحرير العفج ورباط ترايتز وتحديد الوريد الكلوي الأيسر العابر أمام الأبهر وحمايته بدقة.',
          '4. السيطرة على العنق والشرايين الحرقفية: عزل عنق الأبهر تحت الشرايين الكلوية، وتطويق الشرايين الحرقفية المشتركة مع حماية الأوردة المجاورة.',
          '5. إعطاء الهيبارين: حقن 5000 وحدة هيبارين وريدياً والانتظار 3 دقائق للتأكد من انتشاره في الدوران.',
          '6. وضع المشابك الوعائية: وضع المشابك على الشرايين الحرقفية أولاً ثم وضع مشبك العنق تحت الكلوي.',
          '7. فتح كيس التمدد: شق كيس الأبهر طولياً وتفريغ الخثرات وخياطة الشرايين القطنية والمساريقي السفلي النازفة بغرز برولين 2-0 أو 3-0.',
          '8. خياطة الطعم الصناعي: مفاغرة طعم الدكرون (Dacron) الأنبوبي أو المتفرع بغرز برولين 3-0 أو 4-0 مستمرة متقاربة.',
          '9. تفريغ الهواء واستعادة التروية: غسل الشرايين وتفريغ الهواء، وفتح المشابك بالتدريج نحو الحوض ثم الطرفين السفليين.',
          '10. إغلاق الجرح: لف جدار كيس الأبهر الطبيعي فوق طعم الدكرون لمنع تشكل ناسور أبهري عفجي، ثم إغلاق جدار البطن بطبقاته.'
        ],
        surgicalPearlsEn: [
          'The Left Renal Vein can be divided close to the IVC if necessary for juxtarenal exposure, relying on adrenal and gonadal collateral drainage.',
          'Always wrap the native aneurysm sac securely around the prosthetic graft to prevent direct contact with the duodenum and avoid catastrophic aortoenteric fistula.',
          'Check sigmoidoscopy postoperatively if IMA was ligated and patient develops bloody diarrhea or metabolic acidosis.'
        ],
        surgicalPearlsAr: [
          'يمكن ربط وقطع الوريد الكلوي الأيسر قريباً من الوريد الأجوف السفلي إذا لزم الأمر للتعريض، اعتماداً على روافده الكظرية والتناسلية.',
          'يجب دائماً لف كيس الأبهر الطبيعي بإحكام حول طعم الدكرون لمنع ملامسة العفج وتفادي الناسور الأبهري المعوي القاتل.',
          'راقب التروية الدموية للقولون السيني؛ إذا ظهر إسهال مدمم يجب إجراء تنظير سيني فوري لكشف التهاب القولون الإقفاري.'
        ],
        complicationsEn: [
          'Ischemic colitis from inferior mesenteric artery and hypogastric hypoperfusion (1-3%).',
          'Aortoenteric fistula (late catastrophic complication, presenting with herald bleed).',
          'Acute kidney injury from suprarenal clamping or microembolization.'
        ],
        complicationsAr: [
          'التهاب القولون الإقفاري بسبب نقص تروية الشريان المساريقي السفلي والحرقفي الباطن (1-3%).',
          'الناسور الأبهري المعوي (اختلاط متأخر كارثي، يتظاهر بنزيف هضمي تمهيدي).',
          'قصور كلوي حاد ناتج عن الملاقط فوق الكلوية أو الانصمامات المجهرية.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-evar-deployment',
        title: 'EVAR Stent-Graft Modular Deployment & Hostile Neck Anatomy',
        titleAr: 'مراحل فتح دعامة EVAR في الشريان الأبهر ومواصفات العنق التشريحي',
        category: 'Endovascular Design',
        svgType: 'aaa_evar',
        caption: 'Bifurcated modular stent-graft placed below renal arteries, contralateral limb gate cannulation, and iliac sealing zones.',
        captionAr: 'الدعامة المتفرعة المغطاة مثبتة أسفل الشرايين الكلوية، مع قسطرة الطرف المقابل ومناطق الختم الحرقفية.'
      }
    ],
    videos: [
      {
        id: 'vid-aaa-1',
        title: 'EVAR Procedure Step-by-Step Operative Technique & Device Deployment',
        titleAr: 'خطوات عملية إصلاح الأبهر بالدعامة المغطاة (EVAR) بالفيديو الجراحي',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=EVAR+step+by+step+operative+technique+endovascular+aneurysm+repair',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'Complete high-definition fluoroscopic and operative steps of EVAR deployment, gate cannulation, and completion angiography.',
        descriptionAr: 'خطوات القسطرة التداخلية ونشر الدعامة وقسطرة البوابة والتصوير الوعائي النهائي بالتفصيل.'
      },
      {
        id: 'vid-aaa-2',
        title: 'Open Abdominal Aortic Aneurysm Repair Surgical Masterclass',
        titleAr: 'الجراحة المفتوحة لتمدد الشريان الأورطي البطني (Open AAA Repair)',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=open+abdominal+aortic+aneurysm+repair+surgical+video',
        author: 'European Society for Vascular Surgery (ESVS) Masterclass',
        description: 'Full open transperitoneal surgical repair: neck dissection, renal vein preservation, Dacron anastomosis, and sac closure.',
        descriptionAr: 'عرض جراحي كامل للشق والتعريض، مفاغرة طعم الدكرون، وحماية الوريد الكلوي وإغلاق الكيس.'
      },
      {
        id: 'vid-aaa-3',
        title: 'ESVS Clinical Practice Guidelines on Abdominal Aortic Aneurysms',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS) لتمدد الشريان الأبهر البطني',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(24)00045-X/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Official clinical guidelines on screening, elective thresholds, EVAR vs open, and surveillance.',
        descriptionAr: 'الدليل الإرشادي الرسمي لتقييم عتبات التدخل الجراحي والمفاضلة بين الدعامة والجراحة المفتوحة.'
      }
    ]
  },
  carotid: {
    topicKey: 'carotid',
    titleEn: 'Carotid Artery Stenosis & Carotid Endarterectomy (CEA)',
    titleAr: 'تضيق الشريان السباتي واستئصال باطنة الشريان (CEA) - الشرح الكامل',
    category: 'Cerebrovascular',
    pathophysiology: {
      definitionEn: 'Atheromatous plaque accumulation at the carotid bifurcation and internal carotid artery (ICA) causing thromboembolic stroke or cerebral hypoperfusion.',
      definitionAr: 'تراكم لويحة عصيدية في تفرع الشريان السباتي والشريان السباتي الباطن (ICA) مسببة سكتة دماغية خثرية انصمامية أو نقصاً في التروية الدماغية.',
      etiologyEn: [
        'Atherosclerosis with lipid core, intraplaque hemorrhage, fibrous cap thinning, and ulceration.',
        'Hypertension, hyperlipidemia, cigarette smoking, diabetes mellitus.',
        'Turbulent shear stress at carotid bulb favoring low shear and endothelial dysfunction.'
      ],
      etiologyAr: [
        'التصلب العصيدي مع لب شحمي، نزف داخل اللويحة، ترقق الغطاء الليفي، وتشكل قرحات سطحية.',
        'ارتفاع ضغط الدم، فرط شحميات الدم، تدخين التبغ، وداء السكري.',
        'إجهاد القص المضطرب عند بصلة الشريان السباتي الذي يعزز الخلل البطاني.'
      ],
      classificationEn: [
        'NASCET Stenosis Measurement: Percent stenosis = [1 - (minimal residual lumen diameter / normal distal ICA diameter)] x 100%.',
        'Severe: 70-99% (Maximum benefit from CEA).',
        'Moderate: 50-69% (Moderate benefit in symptomatic men).',
        'Mild: < 50% (Best Medical Therapy indicated).',
        'Near-occlusion / String sign (distal vessel collapse, high stroke risk with medical therapy, selective CEA).'
      ],
      classificationAr: [
        'قياس معايير دراسة NASCET: نسبة التضيق = [1 - (أضيق قطر متبقي للمعة / القطر الطبيعي للسباتي الباطن البعيد)] × 100%.',
        'تضيق شديد: 70-99% (أعلى فائدة مثبتة لاستئصال البطانة CEA).',
        'تضيق متوسط: 50-69% (فائدة متوسطة للمرضى العرضيين من الرجال).',
        'تضيق خفيف: < 50% (العلاج الطبي الدوائي الأمثل BMT).',
        'شبه انسداد / علامة الخيط (String sign انخماص الوعاء البعيد، يتطلب تقييماً خاصاً).'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Amaurosis Fugax (Transient Monocular Blindness): Sudden painless loss of vision like a shade pulled down over one eye (ipsilateral retinal ischemia).',
        'Transient Ischemic Attack (TIA): Focal neurologic deficit lasting < 24 hours (contralateral hemiparesis or hemisensory loss).',
        'Completed Ischemic Stroke: Persistent contralateral weakness, numbness, facial droop, dysphasia/aphasia (dominant hemisphere).',
        'Asymptomatic Bruit: High-pitched systolic bruit auscultated at the angle of the jaw (poor predictor of stenosis degree).'
      ],
      cardinalSignsAr: [
        'العمى العابر أحادي الجانب (Amaurosis Fugax): فقدان مفاجئ غير مؤلم للرؤية كستارة تسدل على عين واحدة (إقفار شبكي في نفس الجانب).',
        'نوبة إقفارية عابرة (TIA): عجز عصبي بؤري يستمر أقل من 24 ساعة (ضعف أو خدر في الجانب المقابل للجسم).',
        'السكتة الدماغية الإقفارية المكتملة: ضعف أو خدر مستمر بالجانب المقابل، تدلي الوجه، وصعوبة الكلام (حبسة كلامية إذا أصيب نصف الكرة المسيطر).',
        'نفخة سباتية غير عرضية: نفخة انقباضية تسمع عند زاوية الفك.'
      ],
      physicalExamEn: [
        'Full cranial nerve examination (specifically CN VII, IX, X, XI, XII).',
        'Bilateral carotid and subclavian auscultation.',
        'Motor strength grading (0-5) in upper and lower extremities.',
        'Sensory mapping and cerebellar examination.'
      ],
      physicalExamAr: [
        'فحص الأعصاب القحفية الكامل (خاصة الأعصاب VII، IX، X، XI، XII).',
        'إصغاء الشرايين السباتية والشرايين تحت الترقوة بالجانبين.',
        'تقييم القوة العضلية من 0 إلى 5 في الأطراف العلوية والسفلية.',
        'فحص الإحساس والوظائف المخيخية وتناسق الحركات.'
      ],
      bedsideTestsEn: [
        'NIHSS (National Institutes of Health Stroke Scale) score evaluation at bedside.'
      ],
      bedsideTestsAr: [
        'مقياس السكتة الدماغية NIHSS لتقييم درجة العجز العصبي بجانب السرير.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Lipid panel: Total cholesterol, LDL-C, HDL-C, Triglycerides (target LDL < 55 mg/dL).',
        'Glycated hemoglobin (HbA1c) and fasting blood glucose.',
        'Coagulation profile (PT, INR, aPTT) and baseline renal panel.'
      ],
      labsAr: [
        'فحص دهون الدم: الكوليسترول الكلي، LDL، HDL، الشحوم الثلاثية (الهدف: LDL < 55 ملغ/دل).',
        'السكر التراكمي (HbA1c) وسكر الدم الصائم.',
        'زمن التخثر الكامل (PT, INR, aPTT) ووظائف الكلى.'
      ],
      imagingDuplexEn: [
        'Carotid Duplex Ultrasound (First-Line): Measure Peak Systolic Velocity (PSV) and End-Diastolic Velocity (EDV). Diagnostic criteria for >= 70% stenosis: PSV >= 230 cm/s, ICA/CCA ratio >= 4.0, EDV >= 100 cm/s.'
      ],
      imagingDuplexAr: [
        'دوبلر الشريان السباتي (الخط التشخيصي الأول): قياس ذروة السرعة الانقباضية (PSV) والانبساطية (EDV). معايير التضيق الشديد ≥ 70%: PSV ≥ 230 سم/ثانية، ونسبة ICA/CCA ≥ 4.0.'
      ],
      imagingCtaEn: [
        'CTA of Neck and Brain (Arch to Vertex): Confirms stenosis percentage using NASCET criteria, evaluates plaque morphology, tandem intracranial lesions, and Circle of Willis collateral anatomy.'
      ],
      imagingCtaAr: [
        'الأشعة المقطعية بالصبغة للرقبة والدماغ (من قوس الأبهر إلى قمة الرأس): تأكيد نسبة التضيق بمعايير NASCET، تقييم قرحة اللويحة، ونفاذية دائرة ويليس الشريانية.'
      ],
      imagingAngioEn: [
        'Brain MRI with Diffusion-Weighted Imaging (DWI): Detects silent acute cerebral microinfarcts.'
      ],
      imagingAngioAr: [
        'الرنين المغناطيسي للدماغ (MRI مع صور الانتشار DWI): كشف الاحتشاءات الدماغية المجهرية الحادة الصامتة.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Dual Antiplatelet Therapy (Aspirin + Clopidogrel)',
          nameAr: 'مضادات الصفيحات المزدوجة (أسبرين + كلوبيدوغريل)',
          exactDose: 'Aspirin 100 mg orally daily + Clopidogrel 75 mg orally daily for 21-30 days post-TIA/minor stroke, then single antiplatelet long term.',
          exactDoseAr: 'أسبرين 100 ملغ فموياً يومياً مع كلوبيدوغريل 75 ملغ يومياً لمدة 21-30 يوماً بعد نوبة TIA، ثم دواء واحد طويل الأمد.',
          indication: 'Prevents recurrent thromboembolic cerebral events and platelet aggregation on ulcerated plaques.',
          indicationAr: 'الوقاية من تكرار السكتات الدماغية وتثبيط تجمع الصفيحات على اللويحات المتقرحة.',
          sideEffects: 'Gastrointestinal bleeding, peptic ulcer, bruising, epistaxis.',
          sideEffectsAr: 'نزف هضمي، قرحة هضمية، كدمات، رعاف.'
        },
        {
          name: 'High-Intensity Statin: Atorvastatin',
          nameAr: 'أتورفاستاتين عالي الكثافة',
          exactDose: '80 mg orally once daily.',
          exactDoseAr: '80 ملغ فموياً مرة واحدة يومياً.',
          indication: 'Stabilizes plaque fibrous cap, reduces microembolization, lowers stroke risk.',
          indicationAr: 'تثبيت الغطاء الليفي للويحة، تقليل الانصمامات المجهرية، وخفض خطر السكتة.',
          sideEffects: 'Myopathy, elevated liver enzymes, potential drug interactions.',
          sideEffectsAr: 'ألم عضلي، ارتفاع إنزيمات الكبد، تفاعلات دوائية.'
        }
      ],
      supportiveCareEn: [
        'Strict blood pressure control (target SBP < 130 mmHg once past acute stroke phase).',
        'Urgent surgical referral: CEA should be performed within 14 days (ideally within 48-72 hours if neurologically stable) according to ESVS guidelines.'
      ],
      supportiveCareAr: [
        'ضبط ضغط الدم الصارم (الهدف: انقباضي < 130 ملم زئبق بعد تجاوز المرحلة الحادة).',
        'التحويل الجراحي العاجل: يوصى بإجراء استئصال البطانة CEA خلال 14 يوماً (والأفضل خلال 48-72 ساعة إذا كان المريض مستقراً).'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Carotid Endarterectomy (CEA) with Patch Angioplasty',
        procedureNameAr: 'استئصال باطنة الشريان السباتي (CEA) مع رقعة توسيعية',
        type: 'Open Surgery',
        stepsEn: [
          '1. Positioning: Supine position, head turned 45 degrees to the contralateral side; slight neck extension.',
          '2. Incision: Longitudinal incision along the anterior border of the sternocleidomastoid (SCM) muscle centered over the carotid bifurcation.',
          '3. Deep Dissection: Retract SCM laterally, open carotid sheath; divide the Common Facial Vein between ligatures.',
          '4. Cranial Nerve Identification & Preservation: Identify Vagus Nerve (CN X) lying posterior between CCA and IJV; preserve Hypoglossal Nerve (CN XII) crossing superiorly; mobilize by dividing SCM branch of occipital artery if needed.',
          '5. Arterial Exposure: Dissect Common Carotid Artery (CCA), External Carotid Artery (ECA) with superior thyroid branch, and Internal Carotid Artery (ICA - note zero branches in the neck).',
          '6. Systemic Heparin: Administer 5000 U IV Heparin, allow 3 minutes circulation.',
          '7. Clamping Sequence: Clamp ICA first (to prevent dislodging emboli), then CCA, then ECA.',
          '8. Longitudinal Arteriotomy & Shunting: Make arteriotomy from CCA extending across bifurcation into normal distal ICA lumen. Insert intraluminal shunt (Javid or Pruitt-Inahara) if EEG or stump pressure < 40-50 mmHg indicates inadequate contralateral Circle of Willis flow.',
          '9. Plaque Endarterectomy: Develop plane in media; cleanly peel atheroma from CCA, ECA, and ICA. Ensure distal endarterectomy transition is feathered smoothly without intimal flap (use 7-0 tacking sutures if flap loose).',
          '10. Patch Angioplasty & De-airing: Sew bovine pericardial or Dacron patch using running 6-0 polypropylene sutures. Sequentially unclamp: ECA first (flush debris into external circulation), then CCA, and finally ICA into cerebral circulation.'
        ],
        stepsAr: [
          '1. الوضعية: استلقاء ظهري، تدوير الرأس 45 درجة للجهة المقابلة مع بسط خفيف للرقبة.',
          '2. الشق الجراحي: شق طولي بمحاذاة الحافة الأمامية للعضلة القصية الترقوية الخشائية (SCM) متمركزاً فوق تفرع السباتي.',
          '3. التسليخ العميق: تبعيد العضلة SCM وحشياً، فتح الغمد السباتي، وربط وقطع الوريد الوجهي المشترك.',
          '4. كشف الأعصاب القحفية وحمايتها: تحديد العصب المبهم (CN X) خلف الشريان، وحماية العصب تحت اللساني (CN XII) العابر بالأعلى وتحريره بربط الفرع القذالي.',
          '5. عزل الشرايين: عزل الشريان السباتي المشترك (CCA)، السباتي الظاهر (ECA)، والسباتي الباطن (ICA مع التأكد من خلوه من أي فروع بالرقبة).',
          '6. إعطاء الهيبارين: حقن 5000 وحدة هيبارين وريدياً قبل وضع المشابك.',
          '7. ترتيب وضع المشابك: مشبك السباتي الباطن (ICA) أولاً لمنع انطلاق الصمات، ثم المشترك، ثم الظاهر.',
          '8. شق الشريان والتحويلة (Shunt): شق طولي من السباتي المشترك نحو السباتي الباطن. وضع تحويلة داخلية (Javid shunt) للحفاظ على تروية الدماغ أثناء الجراحة.',
          '9. تقشير اللويحة (Endarterectomy): تسليخ اللويحة في الطبقة الوسطى للجدار، مع استئصالها بالكامل وتنعيم الحافة البعيدة وتثبيتها بغرز برولين 7-0 إن لزم.',
          '10. الرقعة التوسيعية وتفريغ الهواء: خياطة رقعة من غشاء التامور البقري أو الدكرون بغرز برولين 6-0، وإطلاق التدفق نحو السباتي الظاهر أولاً لغسل أي شوائب، ثم فتح السباتي الباطن للدماغ.'
        ],
        surgicalPearlsEn: [
          'The internal carotid artery (ICA) has NO branches in the neck; the external carotid artery (ECA) gives off the superior thyroid artery as its first branch.',
          'Always unclamp ECA before ICA: this washes any potential air bubbles or microparticulate debris harmlessly into the facial circulation rather than the brain.',
          'Three cranial nerves at risk: Hypoglossal (CN XII - tongue deviation to operated side), Vagus/Recurrent Laryngeal (CN X - hoarseness), Marginal Mandibular branch of CN VII (asymmetric smile).'
        ],
        surgicalPearlsAr: [
          'الشريان السباتي الباطن (ICA) ليس له أي فروع في الرقبة إطلاقاً؛ بينما يعطي السباتي الظاهر الشريان الدرقي العلوي كأول فروع.',
          'افتح مشبك السباتي الظاهر دائماً قبل السباتي الباطن لغسل أي فقاعات هواء أو شوائب مجهرية نحو الوجه بدلاً من الدماغ.',
          'الأعصاب الثلاثة المعرضة للخطر: العصب تحت اللساني (CN XII انحراف اللسان لجهة العملية)، المبهم/الحنجري الراجع (CN X بحة الصوت)، والفرع الفكي الهامشي للعصب الوجهي.'
        ],
        complicationsEn: [
          'Perioperative stroke or TIA (target < 2-3% in modern centers).',
          'Cranial nerve injury (CN XII, X, or VII).',
          'Neck hematoma causing tracheal compression and acute airway loss (emergency bed-side evacuation required).'
        ],
        complicationsAr: [
          'السكتة الدماغية حول الجراحة (المعدل المقبول < 2-3% في المراكز المتقدمة).',
          'إصابة الأعصاب القحفية (العصب تحت اللساني، المبهم، أو الوجهي).',
          'ورم دموي ضاغط في الرقبة يهدد مجرى الهواء بالاختناق (يستلزم فتح الجرح بجانب السرير فوراً لتأمين التنفس).'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-carotid-cea',
        title: 'Carotid Bifurcation Anatomy, Cranial Nerves & CEA Patch Technique',
        titleAr: 'تشريح تفرع الشريان السباتي والأعصاب القحفية ورقعة استئصال البطانة',
        category: 'Surgical Anatomy',
        svgType: 'cea_anatomy',
        caption: 'Bifurcation into ICA (no branches) and ECA; relationship to Hypoglossal nerve (CN XII) and Vagus nerve (CN X); longitudinal arteriotomy and patch angioplasty.',
        captionAr: 'التفرع إلى السباتي الباطن (بدون فروع) والظاهر؛ علاقة العصب تحت اللساني والمبهم؛ وموقع الرقعة التوسيعية.'
      }
    ],
    videos: [
      {
        id: 'vid-cea-1',
        title: 'Carotid Endarterectomy (CEA) Step-by-Step Surgical Operative Video',
        titleAr: 'استئصال بطانة الشريان السباتي (CEA) خطوة بخطوة بالفيديو الجراحي',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=carotid+endarterectomy+step+by+step+surgical+video',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'Complete cervical exposure, cranial nerve dissection, internal shunting, plaque removal, and patch closure.',
        descriptionAr: 'عرض تفصيلي للتعريض الجراحي بالرقبة، حماية الأعصاب، استخدام التحويلة، وإغلاق الرقعة.'
      },
      {
        id: 'vid-cea-2',
        title: 'ESVS 2023 Guidelines on Carotid & Vertebral Artery Disease Overview',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS) لأمراض الشرايين السباتية والفقرية',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(22)00227-6/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Latest European consensus on intervention timing (< 14 days), CEA vs CAS, and best medical therapy.',
        descriptionAr: 'أحدث التوصيات الأوروبية لتوقيت التدخل الجراحي والمفاضلة بين الجراحة والدعامة والعلاج الدوائي.'
      }
    ]
  },
  pad_clti: {
    topicKey: 'pad_clti',
    titleEn: 'Peripheral Arterial Disease (PAD) & Chronic Limb-Threatening Ischemia (CLTI)',
    titleAr: 'أمراض الشرايين الطرفية (PAD) ونقص تروية الأطراف المزمن المهدد للحياة (CLTI)',
    category: 'Chronic Arterial Disease',
    pathophysiology: {
      definitionEn: 'Progressive systemic atherosclerotic narrowing of lower extremity arteries leading to exertional claudication or resting tissue hypoperfusion with ischemic rest pain, gangrene, or non-healing ulcers >2 weeks.',
      definitionAr: 'تضيق عصيدي تدريجي في شرايين الأطراف السفلية يسبب العرج المتقطع عند المشي، أو نقص تروية نسيجية حرج أثناء الراحة يتظاهر بألم راحة إقفاري أو قرح غير ملتئمة أو موات (غرغرينا) لأكثر من أسبوعين.',
      etiologyEn: [
        'Atherosclerosis obliterans (cigarette smoking, diabetes mellitus, hypertension, dyslipidemia).',
        'Diabetic micro- and macroangiopathy with extensive medial arterial calcification (Mönckeberg sclerosis).',
        'Thromboangiitis obliterans (Buerger disease in young heavy tobacco users).',
        'Popliteal entrapment syndrome and adventitial cystic disease in younger non-atherosclerotic patients.'
      ],
      etiologyAr: [
        'التصلب العصيدي الساد (تدخين التبغ، داء السكري، فرط ضغط الدم، واضطراب شحوم الدم).',
        'اعتلال الأوعية السكري الدقيق والكبير مع تكلس جداري متقدم (تصلب مونكيبيرغ).',
        'التهاب الأوعية الخثاري الساد (داء بورغر Buerger عند المدخنين الشباب).',
        'متلازمة انحصار الشريان المأبضي وداء الكيسة الغلالية عند المرضى الشباب.'
      ],
      classificationEn: [
        'Fontaine Classification: Stage I (Asymptomatic), Stage IIa/b (Mild / Severe Claudication >/< 200m), Stage III (Rest pain), Stage IV (Ulceration or Gangrene).',
        'Rutherford Classification: Categories 0 to 6 (Cat 1-3 claudication, Cat 4 rest pain, Cat 5 minor tissue loss, Cat 6 major tissue loss).',
        'WIfI Staging System: Wound (0-3), Ischemia based on ABI/Toe Pressure (0-3), and Foot Infection (0-3) predicting 1-year amputation risk and revascularization benefit.',
        'GLASS Anatomical Staging: Global Anatomic Staging System for femoropopliteal and infrapopliteal disease (Stage I to III).'
      ],
      classificationAr: [
        'تصنيف فونتين (Fontaine): المرحلة I (لا أعراض)، IIa/b (عرج متقطع خفيف/شديد لأكثر أو أقل من 200 متر)، III (ألم الراحة)، IV (قرح أو غرغرينا).',
        'تصنيف رذرفورد (Rutherford): الفئات 0-6 (1-3 عرج، 4 ألم راحة، 5 فقدان نسيجي محدود، 6 فقدان نسيجي واسع).',
        'تصنيف WIfI: تقييم الجرح (Wound 0-3)، درجة الإقفار (Ischemia 0-3)، وعدوى القدم (Foot Infection 0-3) لتقدير خطر البتر وفائدة إعادة التروية.',
        'تصنيف GLASS التشريحي: تقييم الآفات الشريانية الفخذية المأبضية وتحت الركبة لتحديد نجاح القسطرة مقابل الجراحة.'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Intermittent claudication: Cramping calf, thigh, or buttock pain reproduced at fixed walking distance, relieved within 2-5 minutes of standing rest.',
        'Ischemic rest pain: Burning, severe nocturnal pain in toes and forefoot aggravated by limb elevation and relieved by hanging foot off the bed (gravity-dependent perfusion).',
        'Ischemic skin changes: Dependent rubor, pallor on limb elevation (Buerger test positive), shiny atrophic hairless skin, brittle thickened nails.',
        'Punched-out ischemic ulcers: Painful ulcers with pale granulating base and necrotic edges located on distal toes, lateral malleolus, or pressure points.',
        'Dry or wet digital gangrene (mummification of digits).'
      ],
      cardinalSignsAr: [
        'العرج المتقطع: ألم تشنجي في بطة الساق أو الفخذ أو الإلية يظهر عند مسافة مشي محددة ويزول خلال 2-5 دقائق من الوقوف المستريح.',
        'ألم الراحة الإقفاري: ألم حارق شديد ليلاً في أصابع ومشط القدم يزداد برفع الطرف للأعلى ويهدأ بإنزاله خارج السرير لأسفل.',
        'تبدلات تروية الجلد: احمرار الطرف بالتدلي، شحوب شديد عند رفعه (اختبار بورغر Buerger)، جلد لماع عديم الشعر، وأظافر سميكة هشة.',
        'القرح الإقفارية المثقوبة: قرح مؤلمة ذات حواف نخرية وقاع شاحب في رؤوس الأصابع أو الكعب أو الكعب الوحشي.',
        'الغرغرينا الجافة أو الرطبة (تحنط نسيجي بالأصابع).'
      ],
      physicalExamEn: [
        'Palpation of all arterial pulses: Femoral, Popliteal, Posterior Tibial, and Dorsalis Pedis (graded 0 to 2+).',
        'Capillary refill time (>3-5 seconds in severe ischemia).',
        'Buerger elevation pallor angle (<20 degrees indicates critical limb-threatening ischemia).',
        'Monofilament testing for diabetic peripheral sensory neuropathy.'
      ],
      physicalExamAr: [
        'جس كافة النبضات الشريانية: الفخذي، المأبضي، الظنبوبي الخلفي، وظهر القدم (تقييم 0 إلى 2+).',
        'زمن الامتلاء الشعري (أكثر من 3-5 ثوانٍ في الإقفار الحاد).',
        'زاوية شحوب بورغر Buerger (شحوب الطرف عند رفعه أقل من 20 درجة يشير لإقفار مهدد للطرف).',
        'فحص الحساسية بخيوط المونوفيلانت للتحقق من الاعتلال العصبي السكري.'
      ],
      bedsideTestsEn: [
        'Ankle-Brachial Index (ABI): Normal 0.90-1.30; Mild-mod PAD 0.41-0.90; Severe CLTI <=0.40; Incompressible arteries >1.40.',
        'Toe-Brachial Index (TBI) & Toe Pressure (TP): TP <30 mmHg or TBI <0.70 diagnostic of CLTI (resistant to medial calcinosis).',
        'Transcutaneous Oxygen Pressure (TcPO2): <30 mmHg indicates failure of spontaneous ulcer healing.'
      ],
      bedsideTestsAr: [
        'مؤشر ضغط الكاحل إلى العضد (ABI): الطبيعي 0.90-1.30، الخفيف-المتوسط 0.41-0.90، الحرج <= 0.40، وغير القابل للانضغاط > 1.40.',
        'ضغط إصبع القدم (Toe Pressure): أقل من 30 مم زئبق يؤكد الإقفار الحرج (لا يتأثر بتكلس الشرايين السكرية).',
        'أكسجين الجلد عبر الجلد (TcPO2): أقل من 30 مم زئبق يدل على عدم قدرة القرحة على الالتئام التلقائي.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Lipid profile (LDL-C target <1.4 mmol/L or <55 mg/dL).',
        'HbA1c monitoring (target <7.0% for diabetic wound healing).',
        'Renal function panel: Serum Creatinine, eGFR, and electrolytes (baseline before iodinated contrast).',
        'Complete blood count (rule out severe anemia exacerbating tissue hypoxemia).'
      ],
      labsAr: [
        'ملف دهون الدم الكامل (الهدف خفض LDL < 1.4 مليمول/لتر أو < 55 مجم/ديسيلتر).',
        'فحص السكر التراكمي HbA1c (الهدف < 7% لالتئام قرح القدم السكرية).',
        'وظائف الكلى: الكرياتينين، ومعدل الترشيح eGFR قبل حقن صبغات الأشعة المقطعية.',
        'تعداد دم كامل (لاستبعاد فقر الدم الذي يفاقم نقص التروية).'
      ],
      imagingDuplexEn: [
        'Color Duplex Ultrasound mapping: Peak systolic velocity ratio (PSVR > 2.0 indicates >50% stenosis, PSVR > 3.0 indicates >70% stenosis).',
        'Vein mapping of Great Saphenous Vein (GSV) assessing diameter >=3.0 mm and absence of thrombosis for bypass conduit.'
      ],
      imagingDuplexAr: [
        'الدوبلكس الملون للشرايين: نسبة ذروة السرعة الانقباضية (PSVR > 2.0 تعني تضيق >50%، وPSVR > 3.0 تعني تضيق >70%).',
        'تخطيط الوريد الصافن الكبير (GSV) للتحقق من قطره >= 3 مم وغياب الخثار لاستخدامه كطعم جراحي.'
      ],
      imagingCtaEn: [
        'High-resolution multi-detector CTA from abdominal aorta to digital plantar arch (evaluates runoff score and runoff vessel patency).'
      ],
      imagingCtaAr: [
        'أشعة مقطعية وعائية بالصبغة عالية الدقة من الأبهر البطني حتى القوس الأخمصي لتقييم الشرايين الساقية المفتوحة.'
      ],
      imagingAngioEn: [
        'Catheter Digital Subtraction Angiography (DSA): Gold standard for pedal arch evaluation with capability for ad-hoc endovascular intervention.'
      ],
      imagingAngioAr: [
        'القسطرة الظليلة الرقمية (DSA): المعيار الذهبي لتصوير القوس الشرياني الأخمصي وإجراء التوسيع بالبالونات أثناء الفحص.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Aspirin + Low-Dose Rivaroxaban (COMPASS Protocol)',
          nameAr: 'الأسبرين + ريفاروكسابان بجرعة منخفضة (بروتوكول COMPASS)',
          exactDose: 'Aspirin 100 mg PO daily PLUS Rivaroxaban 2.5 mg PO twice daily.',
          exactDoseAr: 'أسبرين 100 مجم فموياً مرة يومياً مع ريفاروكسابان 2.5 مجم فموياً مرتين يومياً.',
          indication: 'First-line cardiovascular and major limb event (MALE) risk reduction in symptomatic PAD (ESVS Class I, Level A).',
          indicationAr: 'خط أول لتقليل الحوادث القلبية الوعائية الكبرى وحماية الطرف من البتر (فئة I، مستوى دليل A).',
          sideEffects: 'Increased risk of minor gastrointestinal and cutaneous bleeding. Regular surveillance required.',
          sideEffectsAr: 'زيادة طفيفة في احتمالية النزف الهضمي والجلدي البسيط.'
        },
        {
          name: 'High-Intensity Statin (Atorvastatin)',
          nameAr: 'ستاتين عالي الشدة (أتورفاستاتين)',
          exactDose: 'Atorvastatin 80 mg PO once daily at bedtime (or Rosuvastatin 40 mg daily).',
          exactDoseAr: 'أتورفاستاتين 80 مجم فموياً مرة يومياً عند النوم (أو روزوفاستاتين 40 مجم).',
          indication: 'Plaque stabilization, reduction in all-cause mortality, and LDL-C reduction <55 mg/dL (ESVS Class I, Level A).',
          indicationAr: 'تثبيت اللويحات العصيدية وخفض الوفيات العامة وخفض الكوليسترول الضار دون 55 مجم/ديسيلتر.',
          sideEffects: 'Myalgia, myopathy, elevated transaminases, rare rhabdomyolysis.',
          sideEffectsAr: 'آلام عضلية، ارتفاع إنزيمات الكبد، ونادراً انحلال الربيدات.'
        },
        {
          name: 'Cilostazol (Phosphodiesterase-3 Inhibitor)',
          nameAr: 'سيلوستازول (مثبط فوسفو داي إستراز 3)',
          exactDose: '100 mg PO twice daily, taken 30 minutes before breakfast and dinner.',
          exactDoseAr: '100 مجم فموياً مرتين يومياً، تؤخذ قبل الإفطار والعشاء بـ 30 دقيقة.',
          indication: 'Improves maximal and pain-free walking distance in disabling intermittent claudication (Fontaine IIb).',
          indicationAr: 'تحسين مسافة المشي بدون ألم في مرضى العرج المتقطع الشديد المعطل للحياة.',
          sideEffects: 'Headache, palpitations, diarrhea. STRICTLY CONTRAINDICATED in patients with heart failure (EF <40%).',
          sideEffectsAr: 'صداع وخفقان وإسهال. مضاد استطباب مطلق في مرضى قصور القلب.'
        }
      ],
      supportiveCareEn: [
        'Supervised exercise therapy (SET): Minimum 30-45 minutes walking 3 times weekly for at least 12 weeks.',
        'Strict smoking cessation (pharmacotherapy with varenicline or bupropion).',
        'Aggressive offloading footwear and podiatric wound debridement.'
      ],
      supportiveCareAr: [
        'برنامج المشي الرياضي الموجه (SET): 30-45 دقيقة 3 مرات أسبوعياً لمدة 12 أسبوعاً.',
        'الإقلاع التام عن التدخين بمساعدة بدائل النيكوتين والفارينيكلين.',
        'أحذية تفريغ الضغط الخاصة والعناية التمريضية بالقرح.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Infrainguinal Bypass Surgery (Femoral-to-Popliteal or Tibial Bypass)',
        procedureNameAr: 'الجراحة الالتفافية تحت الإربية (مجازة فخذية مأبضية أو ظنبوبية بالوريد الصافن)',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Patient in supine position; harvest single-segment Great Saphenous Vein (GSV) using open or bridge technique, checking for adequate calibre (>=3 mm).',
          'Step 2: Hydrostatic dilation of harvested vein using heparinized papaverine saline; reverse vein orientation or excise valves with a valvulotome (in-situ technique).',
          'Step 3: Surgical exposure of common femoral bifurcation (inflow artery) and below-knee popliteal or tibial target artery (outflow).',
          'Step 4: Systemic heparinization (70-100 IU/kg, ACT > 250s); clamp vessels and perform end-to-side proximal anastomosis using 6-0 polypropylene continuous suture.',
          'Step 5: Tunnel graft subsartorially or anatomically; perform delicate distal end-to-side micro-anastomosis using 7-0 polypropylene.',
          'Step 6: De-air and release clamps (distal first, then proximal); intraoperative completion duplex or angiography to verify uninhibited runoff.'
        ],
        stepsAr: [
          'الخطوة 1: استئصال قطعة متصلة من الوريد الصافن الكبير (GSV) بالتقنية المفتوحة أو الجزئية والتأكد من قطره (>= 3 مم).',
          'الخطوة 2: توسيع الوريد بمحلول البابافيرين والهيبارين واستئصال الصمامات الوريدية أو قلب اتجاه الوريد.',
          'الخطوة 3: تعريض تفرع الشريان الفخذي المشترك (المدخل) وشريان الساق المستهدف تحت الركبة (المخرج).',
          'الخطوة 4: إعطاء هيبارين وريدياً وعمل المفاغرة القريبة من الجانب للطرف بخيط برولين 6-0.',
          'الخطوة 5: تمرير الطعم عبر النفق التشريحي وعمل المفاغرة البعيدة الدقيقة بخيط برولين 7-0.',
          'الخطوة 6: طرد الهواء وفك الملاقط وإجراء دوبلكس أو أشعة ظليلة على الطاولة للتأكد من انسياب الدم.'
        ],
        surgicalPearlsEn: [
          'Autologous saphenous vein bypass provides 5-year primary patency superior to prosthetic PTFE grafts (75% vs 45%).',
          'Always restore pulsatile flow directly to the angiosome supplying the ischemic ulcer.',
          'Avoid graft twisting by marking a longitudinal line along the vein with surgical marker prior to tunneling.'
        ],
        surgicalPearlsAr: [
          'المجازة بالوريد الصافن الذاتي تحقق نفاذية لـ 5 سنوات تفوق طعوم التفلون PTFE (75% مقابل 45%).',
          'يجب دائماً إعادة التروية إلى الشريان المغذي للمنطقة التشريحية للقرحة (مفهوم الأنجيوسوم Angiosome).',
          'رسم خط طولي على جدار الوريد بقلم جراحي لتجنب انفتاله أثناء إدخاله في النفق.'
        ],
        complicationsEn: [
          'Early graft thrombosis (intimal flap, technical suture error, or inadequate distal runoff).',
          'Surgical site infection and lymphatic leak / lymphocele in groin.',
          'Reperfusion compartment syndrome requiring calf fasciotomy.'
        ],
        complicationsAr: [
          'تخثر الطعم المبكر (شريحة بطانية، خطأ جراحي، أو ضعف تصريف الشرايين الطرفية).',
          'عدوى الجرح وتسرب لمفاوي في المنطقة الإربية.',
          'متلازمة الحجرات الناتجة عن عودة التروية والتي تستوجب بضع اللفافة.'
        ]
      },
      {
        procedureNameEn: 'Endovascular Recanalization (Subintimal Angioplasty & Drug-Coated Balloon DCB / Stenting)',
        procedureNameAr: 'إعادة فتح الشرايين بالقسطرة التداخلية (رأب الوعاء بالبالون الدوائي DCB والدعامات)',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Retrograde contralateral femoral access (up-and-over) or antegrade ipsilateral common femoral puncture under ultrasound guidance.',
          'Step 2: 6F sheath placement; advance 0.035" or 0.018" hydrophilic guidewire through total occlusion (intraluminal or intentional subintimal crossing).',
          'Step 3: Re-enter true lumen distally; predilation with plain balloon (POBA) sized 1:1 to reference vessel.',
          'Step 4: Treat with Paclitaxel-coated drug-coated balloon (DCB) for prolonged 2-3 minute inflation to inhibit neointimal hyperplasia.',
          'Step 5: Place self-expanding nitinol stent or drug-eluting stent if flow-limiting dissection (>30% residual stenosis) is identified.'
        ],
        stepsAr: [
          'الخطوة 1: وخز الشريان الفخذي الموجه بالموجات الصوتية وإدخال الغمد 6F.',
          'الخطوة 2: تمرير سلك توجيه هيدروفيلي عبر الانسداد داخل اللمعة أو تحت البطانة.',
          'الخطوة 3: العودة للمعة الحقيقية والتوسيع الأولي ببالون عادي.',
          'الخطوة 4: استخدام بالون مطلي بالدواء (باكليتاكسيل DCB) ونفخه لمدة 2-3 دقائق لمنع فرط التنسج البطاني.',
          'الخطوة 5: وضع دعامة نيتينول ذاتية التمدد في حال حدوث تسلخ معيق للتدفق أو تضيق متبقٍ.'
        ],
        surgicalPearlsEn: [
          'Endovascular therapy is preferred in high-risk comorbid patients lacking suitable autologous saphenous vein (ESVS Class I, Level B).',
          'Pedal retrograde access via anterior or posterior tibial artery can salvage failed antegrade crossings.'
        ],
        surgicalPearlsAr: [
          'القسطرة هي الخيار المفضل للمرضى ذوي الخطورة الجراحية العالية الذين يفتقرون لوريد صافن صالح.',
          'يمكن استخدام المدخل القسطري الرجعي من شرايين القدم لإنقاذ الحالات التي فشلت قسطرتها من الأعلى.'
        ],
        complicationsEn: [
          'Distal atheroembolization, vessel perforation, groin hematoma, pseudoaneurysm at puncture site.'
        ],
        complicationsAr: [
          'انصمام خثاري بعيد، انثقاب الوعاء، ورم دموي إربي، أو أم دم كاذبة في موقع الوخز.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-pad-1',
        title: 'Femoral-to-Popliteal Bypass with Autologous Saphenous Vein Conduit',
        titleAr: 'المجازة الالتفافية الفخذية المأبضية بالوريد الصافن الذاتي',
        category: 'Surgical Reconstruction',
        svgType: 'pad_bypass',
        caption: 'Femoral bifurcation inflow, reversed great saphenous vein bypass tunnel, and below-knee popliteal outflow anastomosis.',
        captionAr: 'مدخل التروية من تفرع الشريان الفخذي، نفق الوريد الصافن المقلوب، والمفاغرة البعيدة مع الشريان المأبضي.'
      }
    ],
    videos: [
      {
        id: 'vid-pad-1',
        title: 'Femoral-to-Popliteal Bypass Operative Technique Step-by-Step',
        titleAr: 'تقنية الجراحة الالتفافية الفخذية المأبضية خطوة بخطوة',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=femoral+popliteal+bypass+surgical+technique+step+by+step',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'Comprehensive demonstration of vein harvest, subsartorial tunneling, and micro-vascular anastomosis.',
        descriptionAr: 'استعراض جراحي كامل لحصاد الوريد الصافن، تمرير النفق، وعمل المفاغرات الوعائية الدقيقة.'
      },
      {
        id: 'vid-pad-2',
        title: 'ESVS 2024 Guidelines on PAD and Chronic Limb-Threatening Ischemia',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS 2024) لنقص تروية الأطراف المزمن CLTI',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(23)00908-5/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'European guidelines on WIfI staging, GLASS classification, COMPASS antithrombotic protocol, and revascularization strategies.',
        descriptionAr: 'الدليل الأوروبي الشامل لتصنيف WIfI، تصنيف GLASS، وبروتوكول مضادات التخثر وطرق إعادة التروية.'
      }
    ]
  },
  cvd: {
    topicKey: 'cvd',
    titleEn: 'Chronic Venous Disease (CVD) & Varicose Veins (CEAP Classification)',
    titleAr: 'أمراض الأوردة المزمنة والدوالي وتصنيف CEAP والقرح الوريدية',
    category: 'Venous Disease',
    pathophysiology: {
      definitionEn: 'Abnormalities of venous system function and morphology due to valvular incompetence and/or outflow obstruction, leading to ambulatory venous hypertension in the lower limbs.',
      definitionAr: 'اضطرابات بنيوية ووظيفية في الجهاز الوريدي ناتجة عن قصور الصمامات الوريدية أو انسداد التصريف، مؤدية إلى فرط الضغط الوريدي الحركي المزمن في الأطراف السفلية.',
      etiologyEn: [
        'Primary valvular incompetence: Genetic weakness of venous wall elastic tissue and valve cusps.',
        'Secondary (post-thrombotic syndrome PTS): Valvular destruction and luminal trabeculation after deep vein thrombosis.',
        'Extrinsic iliac vein compression (May-Thurner syndrome / NIVL).',
        'Risk factors: Prolonged standing, female sex, multiparity, obesity, chronic constipation.'
      ],
      etiologyAr: [
        'قصور الصمامات الأولي: ضعف وراثي في مرونة جدار الوريد وأشرعة الصمامات.',
        'القصور الثانوي (متلازمة ما بعد الخثار PTS): تخرب الصمامات بعد جلطة وريدية عميقة سابقة.',
        'الانضغاط الخارجي للوريد الحرقفي (متلازمة ماي-تيرنر May-Thurner).',
        'عوامل الخطورة: الوقوف الطويل، الحمل المتكرر، البدانة، والإمساك المزمن.'
      ],
      classificationEn: [
        'CEAP Classification (Clinical): C0 (No signs), C1 (Telangiectasias/Reticular veins <3mm), C2 (Varicose veins >=3mm), C3 (Edema), C4a (Pigmentation/Eczema), C4b (Lipodermatosclerosis/Atrophie blanche), C5 (Healed venous ulcer), C6 (Active venous ulcer).',
        'Etiologic (Ec/Ep/Es), Anatomic (As/Ad/Ap superficial/deep/perforator), Pathophysiologic (Pr/Po/Pr,o reflux/obstruction).'
      ],
      classificationAr: [
        'تصنيف CEAP السريري: C0 (لا علامات)، C1 (شعيرات عنكبوتية < 3 مم)، C2 (دوالي منتفخة >= 3 مم)، C3 (وذمة وانتفاخ)، C4a (تصبغ جلدي وإكزيما وريدية)، C4b (تصلب الجلد الشحمي Lipodermatosclerosis والضمور الأبيض)، C5 (قرحة وريدية ملتئمة)، C6 (قرحة وريدية نشطة ومفتوحة).',
        'التقسيم السببي والتشريحي والفيزيولوجي (ارتجاع/انسداد/كلاهما).'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Aching, heavy legs, and throbbing pain worsening toward the end of the day or after prolonged standing, relieved by limb elevation or walking.',
        'Tortuous, dilated subcutaneous varicose veins (>3 mm) along great or small saphenous distributions.',
        'Pitting ankle edema sparing the forefoot and toes (differentiates from lymphedema).',
        'Stasis dermatitis: Erythematous pruritic eczematous skin in lower medial calf.',
        'Hyperpigmentation (hemosiderin deposition) and lipodermatosclerosis (inverted champagne bottle leg).',
        'Active venous leg ulcer (C6): Shallow, irregular-bordered, exudative ulcer located at medial gaiter zone.'
      ],
      cardinalSignsAr: [
        'ثقل، ألم نابض، وتعب في الساقين يزداد بنهاية اليوم أو الوقوف الطويل ويهدأ برفع الساقين والمشي.',
        'دوالي متعرجة بارزة تحت الجلد (> 3 مم) على مسار الوريد الصافن الكبير أو الصغير.',
        'وذمة انطباعية حول الكاحل لا تشمل مشط أو أصابع القدم (تفرقها عن الوذمة اللمفية).',
        'التهاب الجلد الركودي (إكزيما وريدية مصحوبة بحكة واحمرار).',
        'تصبغ بني غامق (ترسب الهيموسيديرين) وتصلب الجلد الشحمي (مظهر قنينة الشمبانيا المقلوبة).',
        'قرحة الساق الوريدية النشطة (C6): قرحة ضحلة غير منتظمة الحواف غزيرة الإفرازات حول الكعب الإنسي.'
      ],
      physicalExamEn: [
        'Standing clinical inspection under warm ambient lighting.',
        'Palpation of saphenofemoral junction (SFJ) cough impulse and fascial perforator defects.',
        'Trendelenburg tourniquet test (distinguishes superficial vs deep valvular incompetence).',
        'Inspection of active ulcers for granulation tissue, slough, and surrounding lipodermatosclerosis.'
      ],
      physicalExamAr: [
        'معاينة المريض في وضعية الوقوف تحت إضاءة جيدة.',
        'جس منعكس السعال عند الاتصال الصافني الفخذي (SFJ) وفحص ثقوب الأوردة الثاقبة.',
        'اختبار ترندلنبرغ Trendelenburg للتمييز بين قصور الأوردة السطحية والعميقة.',
        'فحص القرح للتأكد من النسيج الحبيبي ودرجة الإفرازات والالتهاب المحيط.'
      ],
      bedsideTestsEn: [
        'Handheld Doppler assessment of saphenofemoral junction reflux during manual calf compression release.',
        'Ankle-Brachial Index (ABI) to verify arterial safety before applying high-compression bandaging (ABI must be >0.80).'
      ],
      bedsideTestsAr: [
        'فحص الدوبلر اليدوي لارتجاع الاتصال الصافني الفخذي عند ضغط عضلات الساق وإرخائها.',
        'قياس مؤشر ABI للتأكد من سلامة الشرايين قبل تطبيق الضمادات الضاغطة (يجب أن يكون ABI > 0.80).'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Wound swab culture only if active surrounding spreading cellulitis is present (routine superficial swabbing not recommended).',
        'Patch allergy testing for contact sensitization to topical dressings.'
      ],
      labsAr: [
        'مزرعة ميكروبية فقط عند وجود التهاب خلوي حاد منتشر حول القرحة.',
        'فحص الحساسية التلامسية للضمادات الموضعية.'
      ],
      imagingDuplexEn: [
        'Standing Color Duplex Ultrasound (Gold Standard): Evaluates reflux duration (>0.5 seconds in superficial and perforator veins; >1.0 second in femoral/popliteal deep veins; >0.35 seconds in calf veins).',
        'Exact diameter measurement of GSV/SSV trunk and distance from deep fascia.'
      ],
      imagingDuplexAr: [
        'الدوبلكس الملون في وضعية الوقوف (المعيار الذهبي): قياس مدة الارتجاع (> 0.5 ثانية في الأوردة السطحية والثاقبة، و> 1.0 ثانية في الأوردة العميقة الفخذية والمأبضية).',
        'قياس القطر الدقيق للوريد الصافن وعمقه عن اللفافة.'
      ],
      imagingCtaEn: [
        'CTV / MRV reserved for suspected pelvic venous congestion, iliac vein compression, or proximal IVC obstruction.'
      ],
      imagingCtaAr: [
        'أشعة مقطعية أو رنين مغناطيسي للأوردة عند الاشتباه باحتقان الحوض أو انضغاط الوريد الحرقفي.'
      ],
      imagingAngioEn: [
        'Intravascular Ultrasound (IVUS): Essential intraoperative modality for sizing and deploying iliac vein stents in May-Thurner syndrome.'
      ],
      imagingAngioAr: [
        'الموجات الصوتية داخل الوعاء (IVUS): أداة محورية لتحديد مقاسات ونشر الدعامات الوريدية بدقة.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Micronized Purified Flavonoid Fraction (MPFF / Daflon)',
          nameAr: 'مركب الفلافونويد النقي الدقيق (MPFF / دافلون)',
          exactDose: '500 mg PO twice daily (or 1,000 mg PO once daily in morning).',
          exactDoseAr: '500 مجم فموياً مرتين يومياً (أو 1000 مجم مرة يومياً صباحاً).',
          indication: 'Relief of venous symptoms (edema, aching, heaviness, cramps) and acceleration of C6 ulcer healing (ESVS Class IIa, Level A).',
          indicationAr: 'تخفيف أعراض الوذمة والألم والتشنجات وتسريع التئام قرح الساق الوريدية (فئة IIa، مستوى دليل A).',
          sideEffects: 'Mild dyspepsia, nausea, abdominal discomfort.',
          sideEffectsAr: 'عسر هضم خفيف، غثيان، واضطراب معدي بسيط.'
        },
        {
          name: 'Sulodexide (Glycosaminoglycan)',
          nameAr: 'سولوديكسيد (غليكوز أمينوغليكان)',
          exactDose: '250 LRU PO twice daily between meals.',
          exactDoseAr: '250 وحدة فموياً مرتين يومياً بين الوجبات.',
          indication: 'Adjunct for chronic venous ulcer healing and post-thrombotic inflammation control (ESVS Class IIa, Level B).',
          indicationAr: 'علاج مساعد لتسريع التئام القرح الوريدية المزمنة وضبط الالتهاب بعد الخثار.',
          sideEffects: 'Transient gastrointestinal upset, rare skin rash.',
          sideEffectsAr: 'اضطراب معوي عابر، طفح جلدي نادر.'
        }
      ],
      supportiveCareEn: [
        'Graduated compression therapy: Multilayer compression bandaging (35-40 mmHg at ankle) for active ulcers (EVRA trial); Class 2 stockings (20-30 mmHg) for maintenance.',
        'Frequent leg elevation above heart level for 30 minutes 3-4 times daily.',
        'Calf muscle pump physiotherapy and weight loss.'
      ],
      supportiveCareAr: [
        'العلاج بالضغط المتدرج: ضمادات متعددة الطبقات (35-40 مم زئبق عند الكاحل) للقرح النشطة، وجوارب الفئة 2 (20-30 مم زئبق) للوقاية.',
        'رفع الساقين أعلى من مستوى القلب لمدة 30 دقيقة 3-4 مرات يومياً.',
        'تمارين مضخة عضلات الساق وإنقاص الوزن.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Endovenous Thermal Ablation (EVLA / RFA) of Great Saphenous Vein',
        procedureNameAr: 'الكي الحراري داخل الوريد بالليزر (EVLA) أو التردد الحراري (RFA) للوريد الصافن',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Patient in reverse Trendelenburg position; ultrasound-guided percutaneous cannulation of the GSV below the knee using 19G needle and 0.035" guidewire.',
          'Step 2: Advance 6F vascular sheath; position radial laser fiber tip 20 mm distal to the saphenofemoral junction (SFJ) under duplex visualization, preserving epigastric branch.',
          'Step 3: Administer ultrasound-guided tumescent anesthesia (chilled saline + lidocaine 0.1% + epinephrine + sodium bicarbonate) creating a circumferential protective fluid halo >10 mm.',
          'Step 4: Verify occlusion of deep vein and patient eye protection; activate 1470 nm radial laser at 7-10 Watts, pulling fiber back at 1 mm/second (target 60-80 Joules/cm).',
          'Step 5: Post-ablation duplex to confirm complete GSV occlusion and unobstructed common femoral vein flow.'
        ],
        stepsAr: [
          'الخطوة 1: وخز الوريد الصافن تحت الركبة موجه بالسونار وإدخال السلك والغمد 6F.',
          'الخطوة 2: تمرير ألياف الليزر وتثبيت رأسها على بعد 20 مم من الاتصال الصافني الفخذي (SFJ) تحت رؤية الدوبلكس.',
          'الخطوة 3: حقن التخدير الانتفاخي (Tumescent) بمحلول بارد وليدوكائين لتشكيل هالة مائية تحمي الأنسجة والأعصاب.',
          'الخطوة 4: تشغيل الليزر بطول موجي 1470 نانومتر وسحب القسطرة ببطء (بمعدل 1 مم/ثانية لتحقيق 60-80 جول/سم).',
          'الخطوة 5: فحص الدوبلكس الفوري للتأكد من إغلاق الوريد وسلامة التدفق في الوريد الفخذي العميق.'
        ],
        surgicalPearlsEn: [
          'First-line treatment of choice over open high ligation and stripping (ESVS Class I, Level A).',
          'In active C6 ulcers, early thermal ablation within 2 weeks accelerates healing from 82 to 56 days (EVRA landmark trial).'
        ],
        surgicalPearlsAr: [
          'العلاج الأول المفضل عالمياً بدلاً من الجراحة التقليدية بالربط والتجريد (فئة I، مستوى دليل A).',
          'في القرح الوريدية النشطة، الكي المبكر خلال أسبوعين يسرع الشفاء من 82 إلى 56 يوماً (تجربة EVRA الشهيرة).'
        ],
        complicationsEn: [
          'Endovenous heat-induced thrombosis (EHIT Class 1-4), saphenous nerve sensory paresthesia, skin burn, superficial thrombophlebitis.'
        ],
        complicationsAr: [
          'الخثار المحفز بالحرارة (EHIT)، تنميل العصب الصافن الحسي، حرق جلدي سطحي، والتهاب وريدي خثاري سطحي.'
        ]
      },
      {
        procedureNameEn: 'Ultrasound-Guided Foam Sclerotherapy (UGFS)',
        procedureNameAr: 'الحقن الرغوي للأوردة والدوالي الموجه بالموجات الصوتية (UGFS)',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Prepare Tessari foam: 1 part sclerosant (Polidocanol 1-3%) mixed with 4 parts air using double-syringe stopcock.',
          'Step 2: Cannulate target tributary or recurrent varicose trunk under real-time ultrasound guidance.',
          'Step 3: Elevate leg and inject microfoam slowly (maximum 10 mL volume per session to avoid systemic complications).',
          'Step 4: Monitor spasm and gas bubble distribution with duplex, maintaining manual pressure over saphenofemoral junction.'
        ],
        stepsAr: [
          'الخطوة 1: تحضير رغوة تيساري (Tessari): جزء واحد بوليدوكانول مع 4 أجزاء هواء عبر صمام ثلاثي.',
          'الخطوة 2: وخز الوريد المستهدف بدقة تحت التوجيه بالموجات الصوتية.',
          'الخطوة 3: رفع الطرف وحقن الرغوة الدقيقة ببطء (بحد أقصى 10 مل في الجلسة الواحدة لتفادي التأثيرات العامة).',
          'الخطوة 4: متابعة تشنج الوريد وتوزيع الرغوة بالسونار مع الضغط المؤقت على اتصال الوريد الفخذي.'
        ],
        surgicalPearlsEn: [
          'Ideal for tortuous varicose tributaries, recurrent veins, and elderly frail patients unsuitable for thermal ablation.'
        ],
        surgicalPearlsAr: [
          'ممتاز للدوالي المتعرجة الشديدة، الدوالي الناكسة، والمرضى المسنين.'
        ],
        complicationsEn: [
          'Skin hyperpigmentation, visual scotomas or migraines, deep vein thrombosis, tissue necrosis if accidental intra-arterial injection.'
        ],
        complicationsAr: [
          'تصبغ جلدي بني، اضطرابات بصرية وصداع نصفي مؤقت، خثار وريدي عميق، وتموت نسيجي عند الحقن الشرياني الخاطئ.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-cvd-1',
        title: 'Endovenous Thermal Ablation (EVLA) and Tumescent Anesthesia Halo',
        titleAr: 'الكي الحراري داخل الوريد بالليزر وهالة التخدير الانتفاخي المحيطة',
        category: 'Endovenous Intervention',
        svgType: 'cvd_evla',
        caption: 'Great saphenous vein catheterization, radial laser fiber tip at SFJ, and circumferential protective tumescent anesthesia envelope.',
        captionAr: 'قسطرة الوريد الصافن، رأس ليف الليزر الشعاعي عند الاتصال الفخذي، والغلاف المائي للتخدير الانتفاخي.'
      }
    ],
    videos: [
      {
        id: 'vid-cvd-1',
        title: 'Endovenous Laser Ablation (EVLA) Step-by-Step Procedure Guide',
        titleAr: 'دليل إجراء الكي الحراري لليزر الوريدي (EVLA) خطوة بخطوة',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=endovenous+laser+ablation+step+by+step+evla',
        author: 'European Venous Forum',
        description: 'Complete technical breakdown of vein cannulation, tumescent delivery, and radial laser withdrawal.',
        descriptionAr: 'شرح تقني كامل لوخز الوريد وحقن التخدير وسحب ليف الليزر بدقة.'
      },
      {
        id: 'vid-cvd-2',
        title: 'ESVS 2022 Guidelines on Chronic Venous Disease Management',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS 2022) لعلاج أمراض الأوردة المزمنة',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(21)00979-5/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Official European clinical guidelines on CEAP staging, endovenous thermal ablation, compression therapy, and deep stenting.',
        descriptionAr: 'الدليل الأوروبي الرسمي لتصنيف CEAP، الكي بالليزر والتردد، والضمادات الضاغطة.'
      }
    ]
  },
  vgi: {
    topicKey: 'vgi',
    titleEn: 'Vascular Graft and Endograft Infections (VGI) & Aorto-Enteric Fistula',
    titleAr: 'عدوى الطعوم والدعامات الوعائية (VGI) والناسور الأورطي المعوي',
    category: 'Surgical Complications',
    pathophysiology: {
      definitionEn: 'Microbial colonization and biofilm formation on prosthetic vascular conduits or endovascular stent-grafts, leading to anastomotic disruption, pseudoaneurysm formation, sepsis, or erosion into adjacent viscera (aorto-enteric fistula).',
      definitionAr: 'استعمار ميكروبي وتشكل غشاء حيوي (Biofilm) على الطعوم الصناعية أو الدعامات المغطاة، مما يسبب تفزر المفاغرات وأمهات دم كاذبة، أو تسمم دموي، أو تآكل الأعضاء المجاورة (ناسور أورطي معوي).',
      etiologyEn: [
        'Direct intraoperative inoculation: Staphylococcus aureus, Staphylococcus epidermidis (slime-producing biofilm).',
        'Contiguous spread from adjacent infected wounds or gastrointestinal erosion.',
        'Hematogenous seeding from bacteremic episodes (dental, urinary, line sepsis).',
        'Organisms: Staph aureus (30%), Coagulase-negative Staphylococci (30%), Gram-negative bacilli (Pseudomonas, E. coli 20%), polymicrobial and fungi in late erosion.'
      ],
      etiologyAr: [
        'التلوث الجراحي المباشر: المكورات العنقودية الذهبية والبشروية المنتجة للغشاء الحيوي.',
        'الانتشار من جرح إربي متقيح أو تآكل معوي ملاصق.',
        'الانتشار عبر مجرى الدم من بؤرة إنتانية بعيدة (الأسنان، المسالك البولية، القساطر).',
        'الميكروبات: العنقوديات (60%)، العصيات سلبية الغرام كالسودوموناس، والإنتانات الفطرية.'
      ],
      classificationEn: [
        'MAGIC Consensus Classification (Management of Aortic Graft Infection Collaboration): Combines Clinical/Surgical, Radiological, and Laboratory/Microbiological criteria into Suspected vs Confirmed VGI.',
        'Samson Classification for Groin Infections: Group I (Dermis), Group II (Subcutaneous tissue), Group III (Surrounding graft), Group IV (Exposed graft), Group V (Anastomotic disruption/bleeding).'
      ],
      classificationAr: [
        'معايير MAGIC الدولية: تدمج الدلائل السريرية والشعاعية والميكروبيولوجية لتأكيد أو نفي عدوى طعوم الأبهر.',
        'تصنيف سامسون Samson لإنتانات الجروح الإربية: المراحل I-V من الجلد السطحي حتى انكشاف الطعم وتفزر المفاغرة والنزف.'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Fever of unknown origin, recurrent rigors, and leukocytosis in a patient with a prior vascular graft.',
        'Pulsatile groin or abdominal mass (infected pseudoaneurysm) with localized tenderness and warmth.',
        'Chronic discharging cutaneous sinus or exposed synthetic prosthetic material in the surgical wound.',
        'Septic embolization: Petechial rash, Osler-like nodes, and distal micro-abscesses in the extremities.',
        'Secondary Aorto-Enteric Fistula (AEF): "Herald bleed" (self-limiting upper gastrointestinal bleeding or melena) preceding catastrophic exsanguinating hemorrhage.'
      ],
      cardinalSignsAr: [
        'حمى مجهولة السبب وقشعريرة مستمرة لدى مريض أجرى جراحة زراعة طعم وعائي سابق.',
        'كتلة نابضة مؤلمة في المغبن أو البطن (أم دم كاذبة منتنة).',
        'ناسور جلدي نازح مستمر أو انكشاف المادة الصناعية للطعم بالجرح.',
        'صمات إنتانية دقيقة وتناثر خثرات صديدية بأصابع القدم.',
        'الناسور الأورطي المعوي الثانوي (AEF): نزف أولي منذر (Herald Bleed) كقيء دموي خفيف أو تغوط أسود يسبق النزف الصاعق المميت.'
      ],
      physicalExamEn: [
        'Meticulous groin wound exam for erythema, induration, fluctuating collections, and sinus tracts.',
        'Abdominal palpation for tender expansile pulsatile mass.',
        'Bilateral peripheral pulse check and evaluation for distal septic emboli.'
      ],
      physicalExamAr: [
        'فحص دقيق للجروح الجراحية الإربية والبطنية للبحث عن ناسور أو احمرار أو قيح.',
        'جس البطن لتحري وجود كتلة نابضة مؤلمة.',
        'فحص النبضات المحيطية والبحث عن الصمات الإنتانية بأصابع القدم.'
      ],
      bedsideTestsEn: [
        'Blood cultures (minimum 3 sets taken from different venipuncture sites before initiating antibiotics).',
        'Aspiration of fluctuating perigraft fluid collections under ultrasound guidance for Gram stain and prolonged aerobic/anaerobic cultures.'
      ],
      bedsideTestsAr: [
        'مزارع دم متكررة (3 عينات على الأقل من مواقع مختلفة قبل بدء المضادات الحيوية).',
        'سحب السوائل المحيطة بالطعم تحت توجيه السونار للصبغة البكتيرية والمزارع المطولة.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'C-reactive protein (CRP) and Erythrocyte Sedimentation Rate (ESR) - key markers for monitoring treatment response.',
        'Procalcitonin for systemic bacteremia.',
        'Sonication of explanted graft specimens to disrupt biofilm and increase microbiological culture yield.'
      ],
      labsAr: [
        'البروتين الارتكاسي CRP وسرعة الترسيب ESR لمراقبة الاستجابة للعلاج.',
        'البروكالسيتونين Procalcitonin لتأكيد تسمم الدم.',
        'تفتيت الطعم المستأصل بالموجات فوق الصوتية (Sonication) لتحطيم الغشاء الحيوي وعزل الميكروب.'
      ],
      imagingDuplexEn: [
        'Duplex ultrasound: Identifies fluid collections >5 mm around superficial grafts, perigraft gas, and anastomotic pseudoaneurysms.'
      ],
      imagingDuplexAr: [
        'الدوبلكس: كشف التجمعات السائلة حول الطعوم السطحية وفقاعات الغاز وأمهات الدم الكاذبة.'
      ],
      imagingCtaEn: [
        'Contrast-Enhanced Computed Tomography Angiography (CTA): Demonstrates perigraft fluid/soft tissue thickening >3 months post-op, ectopic gas bubbles, loss of tissue planes, and pseudoaneurysm formation.'
      ],
      imagingCtaAr: [
        'أشعة مقطعية وعائية بالصبغة (CTA): كشف الغاز الحر الشاذ حول الطعم وتسمك الأنسجة وتشكل أمهات الدم الكاذبة وتآكل جدار الأمعاء.'
      ],
      imagingAngioEn: [
        '18F-FDG PET-CT integrated with CTA (Gold Standard): Demonstrates focal intense tracer uptake along graft with elevated maximum standardized uptake value (SUVmax > 4.0), differentiating active infection from sterile seroma.'
      ],
      imagingAngioAr: [
        'التصوير المدمج 18F-FDG PET-CT (المعيار الذهبي): كشف النشاط الأيضي والالتهابي الموضعي البؤري للطعم وتمييزه عن التجمعات السائلة المعقمة.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Empirical IV Vancomycin + Piperacillin/Tazobactam (or Meropenem)',
          nameAr: 'فانكومايسين وريدي + بيبيراسيلين/تازوباكتام (أو ميروبينيم)',
          exactDose: 'Vancomycin 15-20 mg/kg IV q8-12h (trough 15-20 mcg/mL) PLUS Piperacillin-Tazobactam 4.5 g IV q6h.',
          exactDoseAr: 'فانكومايسين 15-20 مجم/كجم وريدياً كل 8-12 ساعة مع بيبيراسيلين-تازوباكتام 4.5 جم كل 6 ساعات.',
          indication: 'Immediate broad-spectrum antimicrobial therapy for suspected or confirmed VGI pending cultures (ESVS Class I, Level B).',
          indicationAr: 'علاج تجريبي فوري واسع الطيف لتغطية البكتيريا العنقودية المقاومة والعصيات المعوية.',
          sideEffects: 'Nephrotoxicity, red man syndrome, ototoxicity, cytopenias.',
          sideEffectsAr: 'سمية كلوية، متلازمة الرجل الأحمر، سمية سمعية.'
        },
        {
          name: 'Rifampicin (Biofilm-Active Adjunct for Staphylococcal VGI)',
          nameAr: 'ريفامبيسين (مضاد للغشاء الحيوي للعنقوديات)',
          exactDose: '300-600 mg PO/IV twice daily in combination with primary anti-staphylococcal agent.',
          exactDoseAr: '300-600 مجم فموياً أو وريدياً مرتين يومياً بالمشاركة مع المضاد الأساسي.',
          indication: 'Penetrates staphylococcal biofilms on retained or explanted prosthesis (ESVS Class IIa, Level B). NEVER use as monotherapy.',
          indicationAr: 'اختراق الغشاء الحيوي للعنقوديات فوق المواد الصناعية. يمنع استخدامه منفرداً لتجنب المقاومة.',
          sideEffects: 'Hepatotoxicity, orange discoloration of body fluids, major CYP450 drug interactions.',
          sideEffectsAr: 'سمية كبدية، تلون سوائل الجسم باللون البرتقالي، وتداخلات دوائية واسعة.'
        }
      ],
      supportiveCareEn: [
        'Intensive nutritional support and glycemic control.',
        'Minimum 6 weeks of targeted IV antibiotics followed by 6-12 months of suppressive oral antibiotics (or lifelong in in-situ retained prostheses).',
        'Serial monitoring of CRP and leukocyte counts.'
      ],
      supportiveCareAr: [
        'دعم غذائي مكثف وضبط دقيق لسكر الدم.',
        'العلاج بالمضادات الوريدية لمدة 6 أسابيع على الأقل يليه 6-12 شهراً من المضادات الفموية.',
        'مراقبة دورية لتحاليل CRP والكريات البيضاء.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Total Graft Excision and Neo-Aortoiliac System (NAIS) Reconstruction',
        procedureNameAr: 'الاستئصال الجراحي الكامل للطعم وإعادة البناء الذاتية (نظام NAIS بالأوردة الفخذية)',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Patient in supine position; bilateral harvest of superficial femoral and popliteal veins from groin to mid-calf, checking for prior DVT.',
          'Step 2: Construct bifurcated neo-aorta on back-table by suturing harvested femoral vein segments longitudinally (pant-aloons graft configuration).',
          'Step 3: Transperitoneal or retroperitoneal aortic exposure; secure proximal infrarenal aortic control and distal iliac/femoral control.',
          'Step 4: Complete excision of infected aortic and iliac prosthetic material with extensive debridement of infected retroperitoneal tissue.',
          'Step 5: In-situ reconstruction: anastomose NAIS bifurcated autologous vein graft to native aortic stump using continuous 4-0/5-0 polypropylene suture.',
          'Step 6: Obliterate dead space with a well-vascularized pedicled omental flap (Omentoplasty) wrapped circumferentially around the venous reconstruction.'
        ],
        stepsAr: [
          'الخطوة 1: استئصال الأوردة الفخذية السطحية والمأبضية من الطرفين من المغبن حتى منتصف الساق.',
          'الخطوة 2: خياطة الأوردة المستأصلة على طاولة جانبية لتشكيل مجازة أبهرية حرقفية متفرعة (شكل البنطال NAIS).',
          'الخطوة 3: فتح البطن والسيطرة على الأبهر تحت الكلوي والشرايين الحرقفية والفخذية.',
          'الخطوة 4: الاستئصال الكامل لكافة المواد الصناعية للطعم المصاب وتنضير الأنسجة الإنتانية المحيطة.',
          'الخطوة 5: زراعة طعم NAIS الوريدي الذاتي موضعه بمفاغرات دقيقة بخيط برولين 4-0 و5-0.',
          'الخطوة 6: تغطية الإصلاح الوعائي بالكامل بسديلة ثربية (Omental flap) لمنع تجدد العدوى وفصله عن الأمعاء.'
        ],
        surgicalPearlsEn: [
          'NAIS provides superior resistance to reinfection and 5-year limb salvage (>90%) compared to rifampicin-soaked Dacron or cryopreserved allografts (ESVS Class I, Level B).',
          'Harvesting deep femoral veins rarely causes severe chronic leg edema provided the deep profunda vein remains intact.'
        ],
        surgicalPearlsAr: [
          'نظام NAIS يحقق أعلى مقاومة لتجدد العدوى ونسبة إنقاذ أطراف تفوق 90% مقارنة بالطعوم الصناعية.',
          'استئصال الوريد الفخذي السطحي لا يسبب وذمة شديدة طالما أن الوريد الفخذي العميق سليم.'
        ],
        complicationsEn: [
          'Massive hemorrhage during retroperitoneal dissection, aortic stump blowout, deep venous insufficiency of donor legs.'
        ],
        complicationsAr: [
          'نزف شديد أثناء تحرير الأنسجة المتليفة، تمزق جذمور الأبهر، وقصور وريدي مؤقت بالطرف المأخوذ منه الوريد.'
        ]
      },
      {
        procedureNameEn: 'Extra-Anatomic Bypass (Axillobifemoral Bypass) and Secondary Aortic Stump Closure',
        procedureNameAr: 'المجازة غير التشريحية الإبطية ثنائية الفخذ وإغلاق جذمور الأبهر',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Perform right axillobifemoral bypass in clean operative field using externally supported 8 mm PTFE/Dacron graft.',
          'Step 2: Prep and drape abdomen; enter peritoneal cavity and clamp infrarenal aorta.',
          'Step 3: Remove infected prosthesis entirely; debride infected aortic neck back to healthy viable arterial wall.',
          'Step 4: Close infrarenal aortic stump with two layers of monofilament polypropylene sutures (mattress and continuous running), reinforced with prevertebral fascia coverage.'
        ],
        stepsAr: [
          'الخطوة 1: إجراء مجازة إبطية ثنائية الفخذ في حقل جراحي نظيف كخطوة أولى.',
          'الخطوة 2: فتح البطن وتثبيت ملقط الأبهر تحت الكلوي.',
          'الخطوة 3: الاستئصال الكامل للطعم المصاب وتنضير عنق الأبهر حتى الوصول للأنسجة السليمة.',
          'الخطوة 4: إغلاق جذمور الأبهر بطبقتين من خيوط البرولين ودعمه باللفافة أمام الفقار.'
        ],
        surgicalPearlsEn: [
          'Indicated in hemodynamically unstable patients or hostile infected retroperitoneum where in-situ reconstruction is unsafe.'
        ],
        surgicalPearlsAr: [
          'يستطب في المرضى غير المستقرين أو عند وجود إنتان شديد يمنع زراعة طعم موضعي.'
        ],
        complicationsEn: [
          'Aortic stump rupture (fatal in up to 30%), axillary artery disruption, extra-anatomic graft thrombosis.'
        ],
        complicationsAr: [
          'تمزق جذمور الأبهر المميت، تمزق الشريان الإبطي، وتخثر المجازة الإبطية الفخذية.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-vgi-1',
        title: 'Total Graft Excision & Neo-Aortoiliac System (NAIS) Reconstruction',
        titleAr: 'الاستئصال الكامل للطعم المصاب وإعادة البناء الذاتية بنظام NAIS',
        category: 'Infection Reconstruction',
        svgType: 'vgi_nais',
        caption: 'Aortic graft removal, reconstructed autologous femoral vein bifurcation, and vascularized omental flap envelope.',
        captionAr: 'استئصال الطعم المصاب، مفاغرة الطعم الوريدي الذاتي المتفرع، وتغطيته بالسديلة الثربية الحامية.'
      }
    ],
    videos: [
      {
        id: 'vid-vgi-1',
        title: 'NAIS Procedure for Aortic Graft Infection: Operative Technique',
        titleAr: 'عملية NAIS لعدوى طعوم الأبهر: الخطوات الجراحية الكاملة',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=NAIS+procedure+vascular+graft+infection+surgical+technique',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'Harvesting superficial femoral veins, back-table neo-aorta fabrication, and in-situ infected graft replacement.',
        descriptionAr: 'استعراض جراحي لحصاد الأوردة وتصنيع الأبهر الوريدي والتعويض الموضعي للطعم الملتهب.'
      },
      {
        id: 'vid-vgi-2',
        title: 'ESVS 2020 Guidelines on Vascular Graft and Endograft Infections (VGI)',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS 2020) لعدوى الطعوم والدعامات الوعائية',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(19)31174-8/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Comprehensive consensus guidelines on MAGIC criteria, PET-CT diagnostic algorithms, and antimicrobial protocols.',
        descriptionAr: 'الدليل الأوروبي الشامل لمعايير MAGIC، خوارزميات المسح بـ PET-CT، وبروتوكولات المضادات الحيوية.'
      }
    ]
  },
  taaa_dissection: {
    topicKey: 'taaa_dissection',
    titleEn: 'Thoracic Aortic Diseases, Acute Type B Dissection & TEVAR',
    titleAr: 'أمراض الأبهر الصدري والصدري البطني، تسلخ الأبهر من النوع B ودعامات TEVAR',
    category: 'Aortic Disease',
    pathophysiology: {
      definitionEn: 'Intimal tear in the descending thoracic aorta propagating anterograde or retrograde, creating a true and false lumen (Dissection), or pathologic dilation involving thoracic and abdominal aorta (TAAA).',
      definitionAr: 'تمزق بطاني في الأبهر الصدري النازل ينتشر للأمام أو للخلف صانعاً لمعة حقيقية وأخرى كاذبة (تسلخ الأبهر Dissection)، أو توسع مرضي يشمل الأبهر الصدري والبطني معاً (أم دم الأبهر الصدري البطني TAAA).',
      etiologyEn: [
        'Uncontrolled systemic arterial hypertension (>80% of dissection cases).',
        'Connective tissue disorders: Marfan syndrome (FBN1), Loeys-Dietz (TGFBR), vascular Ehlers-Danlos (COL3A1).',
        'Bicuspid aortic valve, aortic coarctation, prior aortic instrumentation.',
        'Blunt thoracic aortic injury (high-speed motor vehicle deceleration accidents, typically at aortic isthmus).'
      ],
      etiologyAr: [
        'ارتفاع ضغط الدم الشرياني المزمن غير المنضبط (في أكثر من 80% من الحالات).',
        'أمراض النسيج الضام الوراثية: متلازمة مارفان، لويز ديتز، وإهلرز دانلوس الوعائية.',
        'صمام أبهري ثنائي الشرف، وتضيق برزخ الأبهر (Coarctation).',
        'رضوض الصدر الكليلة الناتجة عن حوادث السير السريعة في منطقة برزخ الأبهر.'
      ],
      classificationEn: [
        'Stanford Classification: Type A (Involves ascending aorta - surgical emergency) vs Type B (Originates distal to left subclavian artery).',
        'Complicated vs Uncomplicated Type B Dissection: Complicated = Malperfusion (visceral, renal, limb), refractory pain, refractory hypertension, rupture, rapid expansion >40mm.',
        'Crawford Extent of TAAA: Extent I (Left subclavian to above renals), Extent II (Left subclavian to aortic bifurcation - highest paraplegia risk), Extent III (Lower thoracic to bifurcation), Extent IV (Diaphragm to bifurcation), Extent V (T6 to above renals).',
        'Ishimaru Arch Landing Zones: Zone 0 (Innominate) to Zone 4 (Mid-descending thoracic aorta).'
      ],
      classificationAr: [
        'تصنيف ستانفورد: النوع A (يشمل الأبهر الصاعد - طارئ جراحي فوري) والنوع B (ينشأ بعد تفرع الشريان تحت الترقوة الأيسر).',
        'تسلخ النوع B المعقد وغير المعقد: المعقد يتضمن نقص تروية الأحشاء أو الأطراف أو ألماً معنداً أو ارتفاع ضغط غير منضبط أو تمزقاً أو توسعاً > 40 مم.',
        'تصنيف كروفورد Crawford لأمهات دم الأبهر الصدري البطني: المراحل I-V (المرحلة II تحمل أعلى خطر لشلل الساقين Paraplegia).',
        'مناطق التثبيت الزونية لإيشيمارو (Ishimaru Zones 0-4).'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Sudden, excruciating, tearing or ripping chest pain radiating into the interscapular back and migrating inferiorly.',
        'Severe labile hypertension or paradoxical hypotension (indicates rupture or cardiac tamponade).',
        'Pulse deficits: Asymmetric upper vs lower extremity pulses or discrepancy in bilateral arm blood pressures (>20 mmHg).',
        'Malperfusion syndromes: Anuria/oliguria (renal), severe abdominal pain (mesenteric), acute cold leg (iliac/femoral).',
        'Spinal cord ischemia: Acute onset bilateral lower extremity paraparesis or complete flaccid paraplegia.'
      ],
      cardinalSignsAr: [
        'ألم صدري تمزقي حاد ومفاجئ يمتد بين لوحي الكتف وينتشر نزولاً نحو الظهر والبطن.',
        'ارتفاع شديد ومتقلب في ضغط الدم، أو هبوط مفاجئ (يشير إلى تمزق أو اندحاس قلبي).',
        'اختلاف في النبض الشرياني: غياب النبض بالطرف أو فارق ضغط دم > 20 مم زئبق بين الذراعين.',
        'متلازمات نقص تروية الأعضاء: انقطاع البول (الكلية)، ألم بطني حاد (الأمعاء)، برودة الطرف السفلي.',
        'نقص تروية النخاع الشوكي: ضعف حركي مفاجئ أو شلل رخو تام في الساقين (Paraplegia).'
      ],
      physicalExamEn: [
        'Four-extremity blood pressure and pulse mapping.',
        'Neurological evaluation (cranial nerves, upper and lower extremity motor and sensory levels).',
        'Auscultation for new aortic regurgitation murmur and lung sounds for hemothorax.'
      ],
      physicalExamAr: [
        'قياس ضغط الدم والنبض في الأطراف الأربعة بالكامل.',
        'فحص عصبي دقيق للأطراف السفلية ومستوى الإحساس للتحقق من سلامة النخاع الشوكي.',
        'إصغاء القلب لتحري قصور الأبهر والصدى الصدري لاكتشاف النزف الصدري Hemothorax.'
      ],
      bedsideTestsEn: [
        'Electrocardiogram (ECG): Essential to rule out acute ST-elevation myocardial infarction (STEMI) before initiating anticoagulation or vascular therapy.',
        'Bedside point-of-care ultrasound (POCUS): Assesses pericardial effusion/tamponade, pleural hemothorax, and abdominal aortic flaps.'
      ],
      bedsideTestsAr: [
        'تخطيط القلب الكهربائي (ECG): ضروري لاستبعاد احتشاء العضلة القلبية STEMI قبل البدء بأي تدخل.',
        'السونار السريري السريع (POCUS): نفي الاندحاس التاموري وانصباب الدم بالصدر وفحص الأبهر البطني.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'D-dimer (highly sensitive; negative D-dimer <500 ng/mL effectively rules out acute aortic dissection in low-risk patients).',
        'Cardiac Troponin and CK-MB to evaluate myocardial involvement.',
        'Renal function and arterial blood gas for metabolic acidosis and lactate.'
      ],
      labsAr: [
        'فحص دي-دايمر D-dimer (حساس جداً؛ النتيجة السلبية < 500 تنفي التسلخ لدى المرضى منخفضي الخطورة).',
        'التروبونين القلبي لاستبعاد الاحتشاء المرافق.',
        'وظائف الكلى وغازات الدم الشرياني ومستوى حمض اللاكتيك.'
      ],
      imagingDuplexEn: [
        'Transthoracic Echocardiography (TTE) & Transesophageal Echocardiography (TEE): Highly accurate in hemodynamically unstable patients for proximal entry tears and pericardial effusion.'
      ],
      imagingDuplexAr: [
        'إيكو القلب عبر الصدر والمنظار (TEE): دقة عالية في تقييم تمزق المدخل وانصباب التامور لدى المرضى غير المستقرين.'
      ],
      imagingCtaEn: [
        'ECG-Gated Triple-Rule-Out Contrast CTA of Chest, Abdomen, and Pelvis (Gold Standard): Defines entry tear location, true vs false lumen, branch vessel perfusion (static vs dynamic obstruction), aortic diameter, and landing zone tortuosity.'
      ],
      imagingCtaAr: [
        'أشعة مقطعية وعائية بالصبغة ومزامنة القلب (Gold Standard) للصدر والبطن والحوض: تحدد موقع تمزق الدخول، اللمعة الحقيقية والكاذبة، تروية الفروع الحشوية، وأقطار مناطق التثبيت.'
      ],
      imagingAngioEn: [
        'Intraoperative Digital Subtraction Angiography & Intravascular Ultrasound (IVUS): Verifies wire position in true lumen before deploying endografts.'
      ],
      imagingAngioAr: [
        'الأشعة الظليلة والموجات الصوتية داخل الوعاء (IVUS): التحقق الدقيق من وجود السلك داخل اللمعة الحقيقية قبل فتح الدعامة.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Intravenous Anti-Impulse Beta-Blocker (Labetalol / Esmolol)',
          nameAr: 'حاصرات بيتا الوريدية الخافضة للنبض والضغط (لابيتالول / إسمولول)',
          exactDose: 'Labetalol 20 mg IV bolus followed by continuous infusion 1-2 mg/min (or Esmolol 500 mcg/kg loading then 50-200 mcg/kg/min).',
          exactDoseAr: 'لابيتالول 20 مجم وريدياً متبوع بضخ مستمر 1-2 مجم/دقيقة (أو إسمولول) بهدف نبض < 60 وضغط انقباضي 100-120.',
          indication: 'First-line anti-impulse therapy to reduce dP/dt (shear stress on aortic wall) in all acute dissections (ESVS Class I, Level B).',
          indicationAr: 'العلاج الأساسي لتقليل إجهاد القص على جدار الأبهر (dP/dt) في جميع حالات التسلخ الحاد.',
          sideEffects: 'Bradycardia, heart block, bronchospasm, acute heart failure exacerbation.',
          sideEffectsAr: 'بطء القلب، إحصار قلبي، تشنج قصبي، وتفاقم قصور القلب.'
        },
        {
          name: 'Intravenous Vasodilator (Nicardipine / Sodium Nitroprusside)',
          nameAr: 'الموسعات الوعائية الوريدية (نيكارديبين / نيتروبروسيد الصوديوم)',
          exactDose: 'Nicardipine 5 mg/h IV infusion titrated by 2.5 mg/h every 15 min (max 15 mg/h). Always administer AFTER beta-blocker!',
          exactDoseAr: 'نيكارديبين 5 مجم/ساعة وريدياً يرفع تدريجياً حتى 15 مجم/ساعة. يُعطى دائماً بعد حاصرات بيتا لتجنب تسرع القلب الانعكاسي.',
          indication: 'Adjunct for refractory systolic hypertension to achieve target SBP 100-120 mmHg (ESVS Class I, Level B).',
          indicationAr: 'ضبط ضغط الدم الانقباضي بدقة دون 120 مم زئبق عند عدم كفاية حاصرات بيتا.',
          sideEffects: 'Reflex tachycardia (if given without beta-blockade), headache, flushing, thiocyanate toxicity with prolonged nitroprusside.',
          sideEffectsAr: 'تسرع قلب انعكاسي، صداع، وتوهج جلدي.'
        },
        {
          name: 'Intravenous Analgesia (Morphine / Fentanyl)',
          nameAr: 'المسكنات الأفيونية الوريدية (مورفين / فينتانيل)',
          exactDose: 'Morphine sulfate 2-4 mg IV titrated every 10-15 minutes, or Fentanyl 25-50 mcg IV.',
          exactDoseAr: 'مورفين 2-4 مجم وريدياً كل 10-15 دقيقة، أو فينتانيل 25-50 ميكروغرام.',
          indication: 'Control sympathetic surge, reduce blood pressure spikes, and relieve pain.',
          indicationAr: 'تسكين الألم الشديد والحد من تحفيز الجهاز الودي وارتفاع الضغط المفاجئ.',
          sideEffects: 'Respiratory depression, nausea, sedation, hypotension.',
          sideEffectsAr: 'ثبيط التنفس، غثيان، وهبوط ضغط.'
        }
      ],
      supportiveCareEn: [
        'Admission to Intensive Care Unit (ICU) with continuous arterial line blood pressure monitoring.',
        'Spinal cord perfusion pressure optimization: Mean arterial pressure maintained >80-90 mmHg.',
        'Avoidance of thrombolysis and aggressive anticoagulation.'
      ],
      supportiveCareAr: [
        'العناية المركزة (ICU) مع مراقبة مستمرة للضغط عبر خط شرياني مباشر.',
        'الحفاظ على متوسط الضغط الشرياني MAP > 80-90 مم زئبق لحماية تروية النخاع الشوكي.',
        'تجنب مضادات التخثر ومذيبات الخثرة تماماً منعاً لتفاقم النزف.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Thoracic Endovascular Aortic Repair (TEVAR) for Complicated Type B Dissection',
        procedureNameAr: 'الدعامة المغطاة للأبهر الصدري (TEVAR) لحالات تسلخ النوع B المعقد',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Patient in supine position; percutaneous femoral access with pre-closure devices (ProGlide) or femoral cutdown.',
          'Step 2: Place cerebrospinal fluid (CSF) drain in high-risk patients to maintain CSF pressure <10 mmHg.',
          'Step 3: Advance 0.035" Lunderquist stiff guidewire into true lumen under transesophageal echocardiography and IVUS guidance.',
          'Step 4: Angiography via pigtail catheter in ascending aorta to identify left subclavian artery (LSA) origin.',
          'Step 5: Advance TEVAR stent-graft delivery system; oversize diameter by 5-10% relative to proximal landing zone in dissection (avoid excessive oversizing to prevent retrograde Type A dissection).',
          'Step 6: Deploy stent-graft under controlled hypotension (SBP <80 mmHg) or rapid ventricular pacing covering the primary entry tear.',
          'Step 7: Perform completion angiogram to confirm entry tear seal, true lumen expansion, and preserved visceral and iliac branch flow.'
        ],
        stepsAr: [
          'الخطوة 1: وخز الشريان الفخذي وإدخال أدوات الإغلاق الأولي تحت التوجيه بالسونار.',
          'الخطوة 2: تركيب قسطرة نزح السائل النخاعي (CSF Drain) لضبط ضغطه دون 10 مم زئبق لحماية النخاع الشوكي.',
          'الخطوة 3: تمرير سلك صلب إلى اللمعة الحقيقية والتأكد منها بالموجات فوق الصوتية داخل الوعاء (IVUS).',
          'الخطوة 4: تصوير الأبهر بقسطرة Pigtail لتحديد مخرج الشريان تحت الترقوة الأيسر.',
          'الخطوة 5: تمرير الدعامة المغطاة مع زيادة قطرها بنسبة 5-10% فقط عن القطر الأصلي لتجنب تمزق الجدار.',
          'الخطوة 6: فتح الدعامة تحت هبوط ضغط مسيطر عليه لتغطية تمزق الدخول الأولي بالكامل.',
          'الخطوة 7: تصوير ظليل ختامي للتأكد من إغلاق التمزق وتوسع اللمعة الحقيقية وسلامة تروية شرايين البطن والأطراف.'
        ],
        surgicalPearlsEn: [
          'Mandatory indication in complicated Type B dissection (malperfusion, refractory pain, rapid expansion) (ESVS Class I, Level B).',
          'Never perform post-dilation with balloons in acute dissection to avoid aortic rupture.'
        ],
        surgicalPearlsAr: [
          'استطباب إلزامي في النوع B المعقد (نقص تروية الأعضاء أو التوسع السريع) (فئة I، مستوى دليل B).',
          'يمنع نفخ بالونات التوسيع اللاحقة (Post-dilation) في التسلخ الحاد تجنباً لتمزق الأبهر.'
        ],
        complicationsEn: [
          'Retrograde Type A dissection (1-3% fatal complication), spinal cord ischemia / paraplegia (3-5%), stroke (2-4%), Type Ia endoleak.'
        ],
        complicationsAr: [
          'تسلخ رجعي من النوع A (مضاعفة خطيرة)، نقص تروية النخاع الشوكي وشلل الساقين (3-5%)، سكتة دماغية، وتسريب داخلي من النوع Ia.'
        ]
      },
      {
        procedureNameEn: 'Prophylactic Left Subclavian Artery Revascularization (Carotid-Subclavian Bypass)',
        procedureNameAr: 'إعادة تروية الشريان تحت الترقوة الأيسر (مجازة سباتية-تحت ترقوية) عند التثبيت في Zone 2',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Supraclavicular incision 2 cm above left clavicle, dividing platysma and clavicular head of sternocleidomastoid.',
          'Step 2: Mobilize phrenic nerve laterally on anterior scalene muscle; divide anterior scalene muscle carefully.',
          'Step 3: Expose proximal subclavian artery and adjacent common carotid artery.',
          'Step 4: Administer heparin (5,000 IU); clamp carotid and perform end-to-side anastomosis using 6-8 mm Dacron graft with 5-0/6-0 polypropylene.',
          'Step 5: Tunnel graft and perform end-to-side or end-to-end anastomosis to subclavian artery, ligating proximal subclavian origin to prevent endoleak.'
        ],
        stepsAr: [
          'الخطوة 1: شق جراحي فوق الترقوة اليسرى بـ 2 سم وتحرير الرأس الترقوي للعضلة القترائية.',
          'الخطوة 2: حماية العصب الحجابي (Phrenic nerve) ودفعه وحشياً، ثم قطع العضلة الأخمصية الأمامية بحذر.',
          'الخطوة 3: تعريض الشريان تحت الترقوة والشريان السباتي المشترك الأيسر.',
          'الخطوة 4: إعطاء هيبارين ومفاغرة طعم داكرون 6-8 مم من الجانب للطرف مع السباتي بخيط برولين 6-0.',
          'الخطوة 5: مفاغرة الطعم مع الشريان تحت الترقوة وربط أصل الشريان القريب لمنع التسريب الداخلي.'
        ],
        surgicalPearlsEn: [
          'Recommended in elective Zone 2 TEVAR to prevent posterior circulation cerebellar/brainstem stroke, spinal cord ischemia, and left arm claudication (ESVS Class IIa, Level B).'
        ],
        surgicalPearlsAr: [
          'يوصى به وقائياً قبل دعامات Zone 2 لحماية الدورة الدموية الدماغية الخلفية والنخاع الشوكي وتروية الذراع اليسرى.'
        ],
        complicationsEn: [
          'Phrenic nerve palsy (diaphragm elevation), thoracic duct injury (chylothorax), Horner syndrome (sympathetic chain injury).'
        ],
        complicationsAr: [
          'شلل العصب الحجابي (ارتفاع الحجاب الحاجز)، إصابة القناة الصدرية (تسرب كيلوسي Chylothorax)، ومتلازمة هورنر Horner.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-taaa-1',
        title: 'Thoracic Aortic Dissection and TEVAR Stent-Graft Entry Tear Coverage',
        titleAr: 'تسلخ الأبهر الصدري وتغطية تمزق الدخول بدعامة TEVAR المغطاة',
        category: 'Aortic Endovascular',
        svgType: 'taaa_dissection',
        caption: 'True and false lumen architecture, primary entry tear seal with TEVAR stent-graft in Zone 2, and visceral branch perfusion.',
        captionAr: 'بنية اللمعة الحقيقية والكاذبة، إغلاق تمزق الدخول بدعامة TEVAR في المنطقة 2، والحفاظ على تروية الشرايين الحشوية.'
      }
    ],
    videos: [
      {
        id: 'vid-taaa-1',
        title: 'TEVAR for Acute Complicated Type B Dissection Operative Technique',
        titleAr: 'تقنية إجراء دعامة TEVAR لتسلخ الأبهر الصدري الحاد خطوة بخطوة',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=TEVAR+type+b+aortic+dissection+step+by+step+surgical',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'True lumen identification, graft sizing, deployment under controlled hypotension, and spinal drainage protocols.',
        descriptionAr: 'شرح تقني كامل لتحديد اللمعة الحقيقية، اختيار مقاس الدعامة، ونشرها تحت هبوط الضغط المراقب.'
      },
      {
        id: 'vid-taaa-2',
        title: 'ESVS 2023 Guidelines on Thoracoabdominal and Descending Thoracic Aorta',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS 2023) لأمراض الأبهر الصدري والصدري البطني',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(23)00004-7/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Official European clinical guidelines on Type B dissection, TEVAR landing zones, Crawford repair, and spinal cord protection.',
        descriptionAr: 'الدليل الأوروبي الشامل لتسلخ النوع B، مناطق تثبيت TEVAR، وتصنيف كروفورد وحماية النخاع الشوكي.'
      }
    ]
  },
  vascular_access: {
    topicKey: 'vascular_access',
    titleEn: 'Vascular Access for Hemodialysis: Arteriovenous Fistulas (AVF) & Grafts (AVG)',
    titleAr: 'مجرى الغسيل الكلوي: النواسير الشريانية الوريدية (AVF) والطعوم الصناعية (AVG)',
    category: 'Vascular Access',
    pathophysiology: {
      definitionEn: 'Surgical creation of a high-flow, low-resistance direct connection between a peripheral artery and vein to enable repeated dual-needle cannulation for high-efficiency extracorporeal hemodialysis in end-stage renal disease (ESRD).',
      definitionAr: 'إنشاء جراحي لمفاغرة مباشرة ذات تدفق عالٍ ومقاومة منخفضة بين شريان ووريد طرفي لتمكين الوخز المتكرر بإبرتين لتنقية الدم بكفاءة عالية في مرضى الفشل الكلوي النهائي (ESRD).',
      etiologyEn: [
        'End-stage kidney disease (ESKD) from Diabetic nephropathy, Hypertensive nephrosclerosis, Glomerulonephritis, Polycystic kidney disease.',
        'Access failure mechanisms: Juxta-anastomotic venous stenosis due to neointimal hyperplasia, thrombosis, central venous stenosis, and non-maturation.'
      ],
      etiologyAr: [
        'الفشل الكلوي النهائي الناتج عن اعتلال الكلية السكري، التصلب الكلوي بفرط الضغط، التهاب كبيبات الكلى، وتكيس الكلى الوراثي.',
        'آليات فشل الناسور: التضيق الوريدي المجاور للمفاغرة بسبب فرط التنسج البطاني، الخثار الحاد، وتضيق الأوردة المركزية.'
      ],
      classificationEn: [
        'Anatomical Hierarchy (Fistula-First principle): 1. Distal Radiocephalic AVF (Snuffbox or wrist Brescia-Cimino); 2. Brachiocephalic AVF (upper arm); 3. Transposed Brachiobasilic AVF; 4. Prosthetic Arteriovenous Graft (AVG); 5. Tunneled Cuffed Central Catheter (Permcath).',
        'Clinical Maturation Criteria: Rule of 6s (Flow >=600 mL/min, Diameter >=6 mm, Depth <=6 mm, Straight length >=6 cm at 6 weeks).',
        'Dialysis Access-Associated Steal Syndrome (DASS) Staging: Grade 0 (None), Grade 1 (Mild coolness without pain), Grade 2 (Claudication / pain during dialysis), Grade 3 (Rest pain), Grade 4 (Tissue necrosis / gangrene).'
      ],
      classificationAr: [
        'التدرج التشريحي المعتمد (الناسور أولاً): 1. الناسور الكعبري الرأسي بالمعصم (Brescia-Cimino)؛ 2. العضدي الرأسي؛ 3. العضدي البازلي المنقول؛ 4. الطعم الصناعي (AVG)؛ 5. قسطرة الغسيل النفقية الدائمة.',
        'معايير نضج الناسور (قاعدة الستات Rule of 6s): تدفق >= 600 مل/دقيقة، قطر >= 6 مم، عمق <= 6 مم، وطول مستقيم >= 6 سم بعد 6 أسابيع.',
        'تصنيف متلازمة السرقة الدموية (DASS): الدرجات 0-4 من البرودة الطفيفة إلى ألم الراحة وتموت الأنسجة.'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Normal mature AVF: Continuous, low-pitch palpable thrill and soft continuous systolic/diastolic bruit on auscultation.',
        'Stenosis warning signs: High-pitched systolic-only bruit, water-hammer bounding pulse (hyper-pulsatility) proximal to stenosis, loss of thrill.',
        'Thrombosis: Complete absence of thrill, bruit, and pulse; firm cord-like thrombosed vein.',
        'Dialysis Steal Syndrome: Pale, cold hand with severe rest pain or numbness during hemodialysis sessions, diminished radial pulse, ischemic digital ulceration.',
        'Central venous hypertension: Massive ipsilateral arm, breast, shoulder, and facial edema with prominent chest wall collateral veins (history of prior subclavian/internal jugular catheter).'
      ],
      cardinalSignsAr: [
        'الناسور الناضج السليم: اهتزاز متصل ملموس (Thrill) ونفخة وعائية ناعمة مستمرة انقباضية وانبساطية (Bruit).',
        'علامات تضيق الناسور: نفخة انقباضية حادة عالية النبرة، نبض قفزي مطرقي (Water-hammer) وفقدان الاهتزاز.',
        'خثار الناسور: غياب تام للاهتزاز والنفخة مع وريد صلب متخثر كالحبل.',
        'متلازمة سرقة تروية اليد (Steal Syndrome): يد شاحبة باردة ومؤلمة مع خدر يزداد أثناء جلسة الغسيل، وضعف نبض الشريان الكعبري.',
        'ارتفاع ضغط الأوردة المركزية: انتفاخ وتورم هائل في كامل الذراع والكتف والوجه وظهور أوردة جانبية بارزة على الصدر.'
      ],
      physicalExamEn: [
        'Arm elevation test: Normal fistula collapses on arm elevation; failure to collapse indicates downstream outflow stenosis.',
        'Sequential pulse augmentation / occlusion test to evaluate accessory branches.',
        'Allen test to ensure dual palmar arch patency before harvesting radial artery inflow.'
      ],
      physicalExamAr: [
        'اختبار رفع الذراع (Arm elevation test): يفرغ الناسور السليم عند رفع الذراع، وعدم تفريغه يدل على تضيق في مجرى التصريف.',
        'اختبار تضخيم النبض والضغط التدريجي لكشف الفروع الجانبية التي تسرق التدفق.',
        'اختبار ألين (Allen test) للتأكد من كفاية الشريان الزندي قبل استخدام الشريان الكعبري.'
      ],
      bedsideTestsEn: [
        'Handheld acoustic Doppler: Verifies continuous arterialized flow waveform.',
        'Tourniquet testing: Checks venous distensibility along the cannulation zone.'
      ],
      bedsideTestsAr: [
        'الدوبلر الصوتي اليدوي: كشف موجة التدفق الشريانية المستمرة.',
        'اختبار الرباط الضاغط: فحص قابلية الوريد للتمدد على مسار الوخز.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Serum Urea, Creatinine, Electrolytes (Potassium monitoring).',
        'Coagulation profile and Platelet count.',
        'Dialysis adequacy parameters: Single-pool Kt/V (target >=1.4) and Urea Reduction Ratio (URR >=65%).'
      ],
      labsAr: [
        'وظائف الكلى واليوريا والشوارد (مراقبة البوتاسيوم).',
        'تحاليل تخثر الدم وتعداد الصفائح.',
        'معايير كفاءة الغسيل: كفاءة تصفية اليوريا Kt/V (الهدف >= 1.4) ونسبة خفض اليوريا URR >= 65%.'
      ],
      imagingDuplexEn: [
        'Preoperative Vessel Mapping (Gold Standard): Cephalic vein internal diameter >=2.0 mm (optimal >=2.5 mm under tourniquet), radial artery internal diameter >=2.0 mm, peak systolic velocity >50 cm/s.',
        'Postoperative Surveillance: Volume flow calculation (Q = Time-averaged velocity x Area x 60; normal mature AVF >600 mL/min).'
      ],
      imagingDuplexAr: [
        'تخطيط الأوعية بالدوبلكس قبل الجراحة (المعيار الذهبي): قطر الوريد الرأسي الداخلي >= 2.0 مم (ومثالياً >= 2.5 مم بالضاغط)، وقطر الشريان الكعبري >= 2.0 مم.',
        'مراقبة ما بعد الجراحة: حساب كمية تدفق الدم (المعدل الطبيعي للناسور الناضج > 600 مل/دقيقة).'
      ],
      imagingCtaEn: [
        'Not routinely indicated. Non-contrast or low-dose contrast CTA reserved for central vein pathology where duplex cannot penetrate bony thorax.'
      ],
      imagingCtaAr: [
        'لا يستطب روتينياً، ويقتصر على حالات تضيق الأوردة المركزية خلف عظام الصدر.'
      ],
      imagingAngioEn: [
        'Fistulography (Catheter Angiography): Diagnostic and therapeutic modality for failing fistulas; allows simultaneous percutaneous transluminal angioplasty (PTA) of stenoses.'
      ],
      imagingAngioAr: [
        'تصوير الناسور الظليل بالقسطرة (Fistulography): الإجراء التشخيصي والعلاجي لتوسيع تضيقات مجرى الناسور بالبالون (PTA).'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Low-Dose Aspirin or Clopidogrel (Antiplatelet Therapy)',
          nameAr: 'الأسبرين أو كلوبيدوغريل (مضادات الصفائح)',
          exactDose: 'Aspirin 81-100 mg PO once daily (or Clopidogrel 75 mg PO once daily).',
          exactDoseAr: 'أسبرين 81-100 مجم فموياً مرة يومياً (أو كلوبيدوغريل 75 مجم).',
          indication: 'Adjunctive antiplatelet therapy to preserve long-term vascular access patency in high-risk patients.',
          indicationAr: 'حماية نفاذية مجرى الغسيل ومنع تشكل الخثرات الدقيقة.',
          sideEffects: 'Prolonged bleeding from needle puncture sites after dialysis sessions, gastritis.',
          sideEffectsAr: 'امتداد زمن النزف من موقع إبر الغسيل بعد انتهاء الجلسة، واضطراب معدي.'
        },
        {
          name: 'Topical Lidocaine/Prilocaine Cream (EMLA)',
          nameAr: 'كريم التخدير الموضعي (ليدوكائين/بريلوكائين EMLA)',
          exactDose: 'Apply thick layer (2-3 g) under occlusive dressing 60 minutes prior to dialysis cannulation.',
          exactDoseAr: 'وضع طبقة سميكة تحت ضماد كتيم قبل 60 دقيقة من موعد وخز إبر الغسيل.',
          indication: 'Local analgesia to minimize needle-stick pain and reduce puncture-related vascular spasm.',
          indicationAr: 'تسكين ألم وخز الإبر وتفادي التشنج الوعائي المنعكس.',
          sideEffects: 'Transient local blanching, erythema, rare contact dermatitis.',
          sideEffectsAr: 'شحوب موضعي مؤقت أو احمرار خفيف.'
        }
      ],
      supportiveCareEn: [
        'Postoperative hand exercises with a soft rubber stress ball (10 minutes 3 times daily) to stimulate venous dilation.',
        'Strict limb protection: NO venipuncture, IV lines, or blood pressure cuffs on the fistula arm.',
        'Aseptic cannulation technique utilizing the rope-ladder or buttonhole method.'
      ],
      supportiveCareAr: [
        'تمارين قبضة اليد بكرة مطاطية مرنة (10 دقائق 3 مرات يومياً) لتنشيط تدفق الدم ونضج الوريد.',
        'حماية الطرف الصارمة: يمنع سحب الدم أو تركيب محاليل أو قياس ضغط الدم في ذراع الناسور.',
        'التعقيم الصارم واتباع تقنية درجات السلم (Rope-ladder) لتوزيع مواقع الوخز.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Radiocephalic Arteriovenous Fistula (Brescia-Cimino Wrist AVF)',
        procedureNameAr: 'الناسور الشرياني الوريدي الكعبري الرأسي بالمعصم (Brescia-Cimino AVF)',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Local infiltration anesthesia (1% lidocaine) or brachial plexus block; longitudinal or lazy-S incision over the wrist between radial artery and cephalic vein.',
          'Step 2: Mobilize cephalic vein for 3-4 cm, ligating small side branches with 4-0 silk to prevent tethering.',
          'Step 3: Mobilize radial artery for 2-3 cm, preserving venae comitantes and avoiding damage to the radial sensory nerve.',
          'Step 4: Administer systemic heparin (3,000-5,000 IU); clamp radial artery with microvascular bulldog clamps.',
          'Step 5: Perform 6-8 mm longitudinal arteriotomy; bevel the spatulated end of the cephalic vein.',
          'Step 6: Construct end-to-side anastomosis using continuous 7-0 polypropylene (Prolene) double-armed suture with parachute technique.',
          'Step 7: Release venous clamp first, then distal radial clamp, then proximal clamp; palpate immediate brisk thrill over the vein.'
        ],
        stepsAr: [
          'الخطوة 1: تخدير موضعي أو إحصار الضفيرة العضدية؛ إجراء شق طولي أو متعرج عند المعصم بين الشريان الكعبري والوريد الرأسي.',
          'الخطوة 2: تحرير الوريد الرأسي لمسافة 3-4 سم وربط فروعه الجانبية بخيوط حرير 4-0.',
          'الخطوة 3: تحرير الشريان الكعبري لمسافة 2-3 سم مع الحفاظ على العصب الكعبري الحسي.',
          'الخطوة 4: إعطاء هيبارين وريدياً ووضع ملاقط مجهرية Bulldog على الشريان الكعبري.',
          'الخطوة 5: عمل شق شرياني طولي بطول 6-8 مم وشطب طرف الوريد الرأسي لتوسيعه.',
          'الخطوة 6: خياطة مفاغرة نهاية بالجانب بخيط برولين مجهري مزدوج الإبرة 7-0 بتقنية الباراشوت.',
          'الخطوة 7: فك ملقط الوريد أولاً ثم ملاقط الشريان؛ والتحقق فوراً من ظهور الاهتزاز القوي (Thrill) فوق الوريد.'
        ],
        surgicalPearlsEn: [
          'First-line vascular access recommended worldwide due to superior long-term patency and lowest infection rate (ESVS Class I, Level A).',
          'Spatulating the vein tip significantly reduces juxta-anastomotic turbulence and prevents early intimal hyperplasia.'
        ],
        surgicalPearlsAr: [
          'الخيار الأول المفضل عالمياً لنفاذيته الممتازة وانخفاض معدل العدوى لأدنى حد (فئة I، مستوى دليل A).',
          'شطب طرف الوريد بزاوية مائلة يمنع الاضطراب الدموي ويقلل من تشكل التضيق البطاني المبكر.'
        ],
        complicationsEn: [
          'Early thrombosis (kinking or small vessel caliber <2 mm), non-maturation (failure to reach Rule of 6s), hematoma, wound infection.'
        ],
        complicationsAr: [
          'تخثر مبكر (انفتال الوريد أو صغر القطر < 2 مم)، عدم النضج (فشل بلوغ قاعدة الستات)، وورم دموي.'
        ]
      },
      {
        procedureNameEn: 'DRIL Procedure (Distal Revascularization Interval Ligation) for Steal Syndrome',
        procedureNameAr: 'عملية DRIL (إعادة التروية البعيدة مع ربط الشريان الفاصل) لعلاج متلازمة السرقة الدموية',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Harvest autologous great saphenous vein from thigh or use 6 mm prosthetic graft.',
          'Step 2: Anastomose vein graft end-to-side to the brachial artery at least 5-7 cm proximal to the arteriovenous fistula anastomosis.',
          'Step 3: Tunnel bypass graft distally and anastomose end-to-side to the brachial or radial artery distal to the fistula.',
          'Step 4: Ligate the native brachial artery in the segment between the fistula anastomosis and the distal bypass anastomosis (interval ligation).',
          'Step 5: Confirm restored distal hand perfusion (strong radial pulse and normal pulse oximetry) while preserving full fistula flow.'
        ],
        stepsAr: [
          'الخطوة 1: استئصال قطعة من الوريد الصافن الكبير أو استخدام طعم صناعي 6 مم.',
          'الخطوة 2: مفاغرة الطعم من الجانب للطرف مع الشريان العضدي على بعد 5-7 سم قبل مخرج الناسور.',
          'الخطوة 3: تمرير المجازة للأسفل ومفاغرتها مع الشريان العضدي أو الكعبري بعد مخرج الناسور.',
          'الخطوة 4: ربط الشريان العضدي الأصلي في المسافة الفاصلة بين الناسور والمفاغرة البعيدة لمنع الارتجاع والسرقة.',
          'الخطوة 5: التأكد الفوري من عودة الدفء والنبض لليد وارتفاع الأكسجين مع بقاء الناسور شغّالاً بكفاءة.'
        ],
        surgicalPearlsEn: [
          'Definitive gold-standard surgical therapy for severe limb-threatening dialysis access steal syndrome (ESVS Class I, Level B).'
        ],
        surgicalPearlsAr: [
          'المعيار الذهبي الجراحي الحاسم لإنقاذ اليد من البتر في متلازمة السرقة الشديدة مع الحفاظ على الناسور.'
        ],
        complicationsEn: [
          'Bypass graft thrombosis, wound infection, ischemic nerve injury.'
        ],
        complicationsAr: [
          'تخثر المجازة الالتفافية، عدوى الجرح، وإصابة عصبية إقفارية عابرة.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-avf-1',
        title: 'Brescia-Cimino Radiocephalic Arteriovenous Fistula Anastomosis',
        titleAr: 'مفاغرة الناسور الشرياني الوريدي الكعبري الرأسي (Brescia-Cimino)',
        category: 'Vascular Access',
        svgType: 'avf_fistula',
        caption: 'Radial artery, spatulated cephalic vein end-to-side Prolene 7-0 anastomosis, and continuous high-flow arterialized vein loop.',
        captionAr: 'الشريان الكعبري، الوريد الرأسي المشطوب بمفاغرة نهاية بالجانب بخيط برولين 7-0، والتدفق الشرياني المتصل.'
      }
    ],
    videos: [
      {
        id: 'vid-avf-1',
        title: 'Radiocephalic AV Fistula (Brescia-Cimino) Surgical Operative Technique',
        titleAr: 'التقنية الجراحية الكاملة لناسور بريشيا-سيمينو بالمعصم خطوة بخطوة',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=radiocephalic+arteriovenous+fistula+surgical+technique+step+by+step',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'Vessel dissection, spatulation, end-to-side microvascular suture, and intraoperative thrill verification.',
        descriptionAr: 'استعراض جراحي دقيق لتحرير الأوعية، الشطب، الخياطة المجهرية، وفحص الاهتزاز على الطاولة.'
      },
      {
        id: 'vid-avf-2',
        title: 'ESVS 2023 Guidelines on Vascular Access for Hemodialysis Overview',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS 2023) لمجرى الغسيل الكلوي',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(23)00088-6/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Latest European guidelines on vessel mapping thresholds, Rule of 6s maturation, DASS treatment, and central vein stenosis.',
        descriptionAr: 'الدليل الأوروبي الشامل لمعايير تخطيط الأوعية، قاعدة الستات، وعلاج متلازمة السرقة وتضيقات الأوردة المركزية.'
      }
    ]
  },
  dvt: {
    topicKey: 'dvt',
    titleEn: 'Deep Vein Thrombosis (DVT), Iliofemoral DVT & Post-Thrombotic Syndrome',
    titleAr: 'الخثار الوريدي العميق (DVT) وخثار الأوردة الحرقفية الفخذية ومتلازمة ما بعد الخثار',
    category: 'Venous Thromboembolism',
    pathophysiology: {
      definitionEn: 'Formation of an occlusive or non-occlusive blood clot within the deep veins of the lower extremity or pelvis, with high risk of pulmonary embolism (PE) and long-term post-thrombotic syndrome (PTS).',
      definitionAr: 'تشكل خثرة دموية سادة أو جزئية داخل الأوردة العميقة للأطراف السفلية أو الحوض، تحمل خطورة عالية لانصمام رئوي مميت (PE) ومتلازمة ما بعد الخثار المزمنة (PTS).',
      etiologyEn: [
        'Virchow Triad: 1. Venous stasis (prolonged bed rest, major surgery, long-haul travel, paresis); 2. Endothelial vessel injury (trauma, orthopedic surgery, central line); 3. Hypercoagulability (Factor V Leiden, Prothrombin G20210A, Antiphospholipid syndrome, active malignancy, combined oral contraceptives, pregnancy).',
        'Anatomical entrapment: Left common iliac vein compression by right common iliac artery (May-Thurner syndrome).'
      ],
      etiologyAr: [
        'ثالوث فيرخوف (Virchow Triad): 1. الركودة الوريدية (المكوث في الفراش، الجراحات الكبرى، السفر الطويل)؛ 2. أذية البطانة الوعائية (الكسور، قساطر الأوردة)؛ 3. فرط التخثر (طفرة العامل الخامس لايدن، متلازمة أضداد الشحوم الفوسفورية، الأورام الخبيثة، وحبوب منع الحمل).',
        'الانضغاط التشريحي: انضغاط الوريد الحرقفي الأيسر بالشريان الحرقفي الأيمن (متلازمة ماي-تيرنر May-Thurner).'
      ],
      classificationEn: [
        'Anatomical Location: Distal (Calf veins below knee) vs Proximal (Popliteal, Femoral, and Iliofemoral).',
        'Phlegmasia Alba Dolens (Milk leg - massive edema without cyanosis) vs Phlegmasia Cerulea Dolens (Severe cyanosis, ischemia, impending venous gangrene).',
        'Wells Score for DVT: Stratifies low, moderate, or high clinical pretest probability.',
        'Villalta Scale for Post-Thrombotic Syndrome (PTS): Evaluates 5 symptoms and 6 clinical signs (Score >=5 indicates PTS, >=15 severe PTS or ulcer).'
      ],
      classificationAr: [
        'الموقع التشريحي: قاصٍ (شرايين الساق تحت الركبة) ومقابل دنوٍ (المأبضي، الفخذي، والحرقفي الفخذي Iliofemoral).',
        'التهاب الوريد الأبيض المؤلم (Phlegmasia Alba Dolens) والتهاب الوريد الأزرق المؤلم (Phlegmasia Cerulea Dolens - إقفار حاد وغرغرينا وريدية وشيكة).',
        'مقياس ويلز (Wells Score): تصنيف احتمالية الخثار إلى منخفضة ومتوسطة وعالية.',
        'مقياس فيلالتا (Villalta Scale): تقييم متلازمة ما بعد الخثار (النتيجة >= 5 تشخص PTS و >= 15 تشير لـ PTS شديدة مع قرح).'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Acute unilateral lower extremity swelling (calf circumference difference >3 cm measured 10 cm below tibial tuberosity).',
        'Dull, aching calf or thigh pain aggravated by walking or standing.',
        'Calf tenderness on deep palpation, prominent superficial collateral veins (Pratt sign).',
        'Phlegmasia Cerulea Dolens: Triad of sudden severe agonizing pain, profound gross limb edema, and cyanotic violaceous mottling with threatened arterial pulses due to compartmental pressure elevation.'
      ],
      cardinalSignsAr: [
        'تورم وانتفاخ حاد وحيد الجانب في الساق أو الفخذ (فارق محيط الساق > 3 سم مقاساً 10 سم تحت الحدبة الظنبوبية).',
        'ألم كليل شادّ في بطة الساق يزداد بالمشي أو الوقوف.',
        'مضض وألم عند جس بطة الساق عميقاً، وبروز أوردة سطحية احتقانية.',
        'التهاب الوريد الأزرق المؤلم (Phlegmasia Cerulea Dolens): ثلاثي الألم الهائل والتورم الشديد والزرقة الجلدية البنفسجية مع تهديد النبض الشرياني بسبب فرط الضغط الحجيري.'
      ],
      physicalExamEn: [
        'Calf circumference measurement 10 cm below the tibial tuberosity.',
        'Palpation of cord along great saphenous, popliteal, and femoral veins.',
        'Homans sign (calf pain on forced ankle dorsiflexion - non-specific).',
        'Peripheral pulse check and capillary refill to rule out phlegmasia.'
      ],
      physicalExamAr: [
        'قياس محيط بطة الساق بدقة بشريط القياس.',
        'جس الأوردة للبحث عن حبل خثاري متصلب.',
        'علامة هومان Homans (ألم في بطة الساق عند عطف الكاحل نحو الأعلى - غير نوعية).',
        'فحص النبضات الشريانية وزمن الامتلاء الشعري لاستبعاد نقص التروية بالتهاب الوريد الأزرق.'
      ],
      bedsideTestsEn: [
        'D-Dimer testing: Negative high-sensitivity D-dimer (<500 ng/mL) with low/unlikely Wells score safely rules out DVT without imaging.',
        'Point-of-care compression ultrasonography (POCUS): Bedside 2-point or 3-point compression test.'
      ],
      bedsideTestsAr: [
        'فحص دي-دايمر (D-Dimer): النتيجة السلبية مع مقياس ويلز منخفض تنفي الخثار بأمان دون حاجة لسونار.',
        'السونار السريري السريع (POCUS): فحص الانضغاط في نقطتين أو ثلاث نقاط رئيسية.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Quantitative high-sensitivity D-dimer (ELISA).',
        'Thrombophilia screening: Indicated ONLY in unprovoked DVT <50 years, recurrent thrombosis, or strong family history (Protein C, Protein S, Antithrombin III, Lupus anticoagulant, Anticardiolipin antibodies, Factor V Leiden mutation). Test after acute phase and anticoagulation completion.',
        'Renal function and liver function tests before initiating DOACs.'
      ],
      labsAr: [
        'فحص دي-دايمر كمي عالي الحساسية.',
        'فحص أهبة التخثر الوراثية: يستطب فقط في الحالات غير المحرضة تحت سن 50 أو المتكررة (البروتين C وS، مضاد الثرومبين، أضداد الشحوم الفوسفورية) بعد انتهاء العلاج.',
        'وظائف الكلى والكبد قبل اختيار جرعات مضادات التخثر الحديثة DOACs.'
      ],
      imagingDuplexEn: [
        'Venous Duplex Compression Ultrasound (Gold Standard): Inability to completely compress the venous lumen with the ultrasound transducer probe confirms intraluminal thrombus. Also evaluates absence of respiratory phasicity and augmentation response.'
      ],
      imagingDuplexAr: [
        'الدوبلكس الوريدي الانضغاطي (المعيار الذهبي): عدم انضغاط جدار الوريد كلياً تحت ضغط مسبار السونار يؤكد وجود الخثرة، مع غياب التغيرات التنفسية بالتدفق.'
      ],
      imagingCtaEn: [
        'Contrast CT Venography (CTV) or MR Venography (MRV): Essential for diagnosing inferior vena cava (IVC) or iliac vein thrombosis and detecting May-Thurner anatomy.'
      ],
      imagingCtaAr: [
        'أشعة مقطعية أو رنين مغناطيسي للأوردة بالصبغة: ضرورية لتشخيص خثار الوريد الأجوف السفلي والأوردة الحرقفية وكشف متلازمة ماي-تيرنر.'
      ],
      imagingAngioEn: [
        'Catheter Venography: Utilized prior to pharmacomechanical catheter-directed thrombolysis or iliac vein stenting.'
      ],
      imagingAngioAr: [
        'تصوير الأوردة الظليل بالقسطرة: يُجرى عند التخطيط لإذابة الخثرة بالقسطرة أو وضع الدعامات الوريدية.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Direct Oral Anticoagulant - Apixaban (Eliquis)',
          nameAr: 'مضاد التخثر الفموي المباشر - أبيكسابان (إليكويس)',
          exactDose: '10 mg PO twice daily for 7 days, then maintenance 5 mg PO twice daily.',
          exactDoseAr: '10 مجم فموياً مرتين يومياً لمدة 7 أيام، ثم جرعة صيانة 5 مجم مرتين يومياً.',
          indication: 'First-line therapy for confirmed DVT without parenteral lead-in (ESVS Class I, Level A). Duration: 3 months for provoked DVT.',
          indicationAr: 'خط أول لعلاج الخثار الوريدي دون حاجة لحقن تمهيدية (فئة I، مستوى دليل A). المدة 3 أشهر للخثار المحرض.',
          sideEffects: 'Major and minor bleeding, hematuria, gastrointestinal hemorrhage.',
          sideEffectsAr: 'نزف كلي أو بولي، نزف هضمي، وفقر دم.'
        },
        {
          name: 'Direct Oral Anticoagulant - Rivaroxaban (Xarelto)',
          nameAr: 'مضاد التخثر الفموي المباشر - ريفاروكسابان (زاريلتو)',
          exactDose: '15 mg PO twice daily with food for 21 days, then 20 mg PO once daily with food.',
          exactDoseAr: '15 مجم فموياً مرتين يومياً مع الطعام لمدة 21 يوماً، ثم 20 مجم مرة يومياً مع الطعام.',
          indication: 'First-line therapy for DVT (ESVS Class I, Level A).',
          indicationAr: 'علاج خط أول للخثار الوريدي العميق.',
          sideEffects: 'Bleeding, elevated liver transaminases.',
          sideEffectsAr: 'نزف، وارتفاع إنزيمات الكبد.'
        },
        {
          name: 'Low Molecular Weight Heparin - Enoxaparin (Clexane)',
          nameAr: 'الهيبارين منخفض الوزن الجزيئي - إينوكسابارين (كليكسان)',
          exactDose: '1 mg/kg subcutaneous injection every 12 hours (or 1.5 mg/kg once daily).',
          exactDoseAr: '1 مجم/كجم حقناً تحت الجلد كل 12 ساعة (أو 1.5 مجم/كجم مرة يومياً).',
          indication: 'Preferred in cancer-associated thrombosis, pregnancy, or severe renal impairment / hemodialysis.',
          indicationAr: 'الخيار المفضل في خثار الأورام الخبيثة والحمل وقصور الكلى.',
          sideEffects: 'Bleeding, injection site bruising/hematoma, rare heparin-induced thrombocytopenia (HIT).',
          sideEffectsAr: 'نزف، كدمات أو ورم دموي بموقع الحقن، ونقص صفائح دم نادر ناتج عن الهيبارين HIT.'
        }
      ],
      supportiveCareEn: [
        'Early ambulation as soon as therapeutic anticoagulation is established (bed rest is discouraged).',
        'Below-knee Class II graduated compression stockings (20-30 mmHg) initiated after acute swelling subsides to prevent post-thrombotic syndrome.',
        'Elevation of the leg at rest above heart level.'
      ],
      supportiveCareAr: [
        'المشي والحركة المبكرة فور بدء مضادات التخثر (يمنع البقاء في الفراش).',
        'جوارب ضاغطة متدرجة فئة II (20-30 مم زئبق) تحت الركبة للوقاية من متلازمة ما بعد الخثار PTS.',
        'رفع الطرف أعلى من مستوى القلب أثناء الراحة.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Catheter-Directed Thrombolysis (CDT) & Pharmacomechanical Thrombectomy (PMT)',
        procedureNameAr: 'إذابة وتفتيت الخثرة الموجه بالقسطرة (CDT / PMT) للخثار الحرقفي الفخذي الحاد',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Patient in prone position; ultrasound-guided retrograde or antegrade access into ipsilateral popliteal vein or mid-femoral vein using 6F-8F sheath.',
          'Step 2: Traverse thrombus with hydrophilic 0.035" guidewire into inferior vena cava (IVC).',
          'Step 3: Position multi-sidehole infusion catheter across the entire length of the iliofemoral thrombus.',
          'Step 4: Infuse recombinant tissue plasminogen activator (Alteplase rtPA at 0.5-1.0 mg/hour) along with subtherapeutic unfractionated heparin (300-500 IU/hour) for 12-24 hours in ICU.',
          'Step 5: Alternatively, perform single-session mechanical rheolytic / aspiration thrombectomy (AngioJet or Inari ClotTriever).',
          'Step 6: Completion venography: identify residual underlying iliac vein stenosis (May-Thurner spur); deploy dedicated self-expanding venous stent (14-16 mm).'
        ],
        stepsAr: [
          'الخطوة 1: وخز الوريد المأبضي موجه بالسونار والمريض بوضعية الانبطاح وإدخال غمد 6F-8F.',
          'الخطوة 2: تمرير سلك هيدروفيلي عبر الخثرة حتى الوريد الأجوف السفلي.',
          'الخطوة 3: إدخال قسطرة متعددة الثقوب وتثبيتها على طول الخثرة الحرقفية الفخذية.',
          'الخطوة 4: ضخ دواء ألتيبيلاز (Alteplase rtPA بجرعة 0.5-1 مجم/ساعة) مع هيبارين وريدي منخفض لمدة 12-24 ساعة بالعناية.',
          'الخطوة 5: أو استخدام أجهزة التفتيت والشفط الميكانيكي الفوري (AngioJet أو Inari ClotTriever).',
          'الخطوة 6: تصوير ظليلي لكشف التضيق الحرقفي المتبقي (متلازمة ماي-تيرنر) ووضع دعامة وريدية ذاتية التمدد (14-16 مم).'
        ],
        surgicalPearlsEn: [
          'Indicated in acute symptomatic iliofemoral DVT (<14 days), low bleeding risk, and functional age <65 to prevent debilitating post-thrombotic syndrome (ESVS Class IIa, Level B).',
          'Mandatory emergency indication in Phlegmasia Cerulea Dolens to prevent venous gangrene and amputation.'
        ],
        surgicalPearlsAr: [
          'يستطب في خثار الأوردة الحرقفية الفخذية الحاد (< 14 يوماً) مع انخفاض خطر النزف للوقاية من متلازمة ما بعد الخثار.',
          'استطباب إسعافي إلزامي في التهاب الوريد الأزرق المؤلم لإنقاذ الطرف من البتر.'
        ],
        complicationsEn: [
          'Major bleeding (intracranial hemorrhage risk <1%), pulmonary embolism during manipulation, stent thrombosis, puncture site hematoma.'
        ],
        complicationsAr: [
          'نزف خطير (نزف دماغي < 1%)، انصمام رئوي أثناء تحريك الخثرة، وتخثر الدعامة الوريدية.'
        ]
      },
      {
        procedureNameEn: 'Iliac Vein Stenting for May-Thurner Syndrome & Post-Thrombotic Occlusion',
        procedureNameAr: 'وضع الدعامات الوريدية المتخصصة لمتلازمة ماي-تيرنر والتضيق المزمن',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Venous access via mid-thigh femoral vein or popliteal vein; perform multi-planar venography and Intravascular Ultrasound (IVUS).',
          'Step 2: IVUS measurement of lumen area: >=50% area reduction confirms hemodynamically significant stenosis.',
          'Step 3: Predilate stenosis with high-pressure balloon (12-14 mm diameter).',
          'Step 4: Deploy dedicated large-diameter self-expanding venous stent (14-16 mm common iliac, extending 3-5 mm into IVC).',
          'Step 5: Post-dilate aggressively with non-compliant balloon to nominal stent diameter.'
        ],
        stepsAr: [
          'الخطوة 1: الدخول عبر الوريد الفخذي أو المأبضي واستخدام الموجات الصوتية داخل الوعاء (IVUS).',
          'الخطوة 2: قياس مساحة اللمعة بـ IVUS: تضيق المساحة >= 50% يؤكد الأهمية الديناميكية للتضيق.',
          'الخطوة 3: التوسيع الأولي ببالون عالي الضغط 12-14 مم.',
          'الخطوة 4: وضع دعامة وريدية مخصصة ذاتية التمدد (14-16 مم بالوريد الحرقفي المشترك، مع بروز 3-5 مم في الوريد الأجوف).',
          'الخطوة 5: التوسيع اللاحق ببالون غير مطاوع حتى قطر الدعامة الاسمي.'
        ],
        surgicalPearlsEn: [
          'Dedicated venous stents provide radial force sufficient to withstand chronic extrinsic compression by the iliac artery crossing.'
        ],
        surgicalPearlsAr: [
          'الدعامات الوريدية المخصصة تمتلك قوة مقاومة شعاعية كافية لمقاومة نبض الشريان الحرقفي الضاغط.'
        ],
        complicationsEn: [
          'Contralateral iliac vein occlusion from stent protruding too far into IVC, in-stent thrombosis, stent migration.'
        ],
        complicationsAr: [
          'انسداد الوريد الحرقفي المقابل بسبب بروز الدعامة الزائد في الأجوف، وخثار داخل الدعامة.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-dvt-1',
        title: 'Iliofemoral Deep Vein Thrombosis & May-Thurner Anatomical Compression',
        titleAr: 'خثار الأوردة الحرقفية الفخذية وانضغاط متلازمة ماي-تيرنر التشريحي',
        category: 'Venous Pathophysiology',
        svgType: 'dvt_veins',
        caption: 'Left common iliac vein compression beneath right common iliac artery, occlusive thrombus, and dedicated venous stent placement.',
        captionAr: 'انضغاط الوريد الحرقفي الأيسر تحت الشريان الحرقفي الأيمن، الخثرة السادة، ووضع الدعامة الوريدية.'
      }
    ],
    videos: [
      {
        id: 'vid-dvt-1',
        title: 'Catheter-Directed Thrombolysis & Venous Stenting Step-by-Step',
        titleAr: 'إذابة الخثرة بالقسطرة ووضع الدعامات الوريدية خطوة بخطوة',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=catheter+directed+thrombolysis+DVT+venous+stent+step+by+step',
        author: 'Society of Interventional Radiology (SIR)',
        description: 'Operative guide on popliteal access, mechanical thrombectomy, IVUS assessment, and iliac vein stent deployment.',
        descriptionAr: 'دليل عملي لوخز الوريد المأبضي، التفتيت الميكانيكي، تقييم IVUS، ونشر الدعامة الوريدية.'
      },
      {
        id: 'vid-dvt-2',
        title: 'ESVS 2021 Guidelines on the Management of Venous Thrombosis',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS 2021) لعلاج الخثار الوريدي العميق',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(20)30872-3/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Comprehensive guidelines on DOAC regimens, early thrombus removal criteria, Villalta scoring, and compression therapy.',
        descriptionAr: 'الدليل الأوروبي الشامل لجرعات DOACs، معايير إزالة الخثرة المبكرة بالقسطرة، ومقياس فيلالتا.'
      }
    ]
  },
  mesenteric_ischemia: {
    topicKey: 'mesenteric_ischemia',
    titleEn: 'Acute & Chronic Mesenteric Ischemia (AMI / CMI) & Intestinal Angina',
    titleAr: 'إقفار الأمعاء الحاد والمزمن (AMI / CMI) والذبحة المعوية واحتشاء المساريقا',
    category: 'Visceral Arterial Disease',
    pathophysiology: {
      definitionEn: 'Critical reduction in blood flow to the gastrointestinal tract resulting in hypoperfusion, cellular necrosis, transmural bowel gangrene, and septic shock (Acute), or postprandial intestinal angina from chronic atherosclerotic stenosis (Chronic).',
      definitionAr: 'انخفاض حرج في التروية الدموية للجهاز الهضمي والأمعاء يسبب نقص تروية وتموت الخلايا، ثم غرغرينا كاملة الجدار بالأمعاء وصدمة إنتانية قاتلة (الحاد)، أو ذبحة معوية بعد الطعام ناتجة عن تضيق عصيدي مزمن (المزمن).',
      etiologyEn: [
        'Superior Mesenteric Artery Embolism (SMAE, 50% of acute cases): Cardioembolism lodging 3-10 cm distal to SMA origin, sparing the proximal jejunal branches.',
        'Acute SMA Thrombosis (SMAT, 25%): Thrombosis over preexisting ostial atherosclerotic plaque; causes extensive bowel necrosis from proximal jejunum to mid-transverse colon.',
        'Non-Occlusive Mesenteric Ischemia (NOMI, 20%): Splanchnic vasoconstriction in low-cardiac-output states, septic shock, or high-dose vasopressor therapy.',
        'Mesenteric Venous Thrombosis (MVT, 5%): Thrombosis of superior mesenteric or portal veins in hypercoagulable states or cirrhosis.',
        'Chronic Mesenteric Ischemia (CMI): Multivessel atherosclerotic stenosis (celiac trunk, SMA, inferior mesenteric artery IMA).'
      ],
      etiologyAr: [
        'انصمام الشريان المساريقي العلوي (SMAE، 50% من الحالات الحادة): صمة قلبية تستقر على بعد 3-10 سم من مخرج الشريان.',
        'تخثر الشريان المساريقي العلوي الحاد (SMAT، 25%): تخثر فوق لويحة عصيدية في فوهة الشريان يسبب تموت أمعاء واسع.',
        'إقفار الأمعاء غير الانسدادي (NOMI، 20%): تقبض وعائي مساريقي حاد بسبب هبوط النتاج القلبي أو الصدمة الإنتانية أو المقبضات الوعائية.',
        'خثار الوريد المساريقي (MVT، 5%): تجلط الأوردة المساريقية في حالات فرط التخثر وتليف الكبد.',
        'إقفار الأمعاء المزمن (CMI): تضيق عصيدي متعدد الأوعية في الجذع الزلاقي والشريان المساريقي العلوي والسفلي.'
      ],
      classificationEn: [
        'Clinical Presentation: Acute Embolic vs Acute Thrombotic vs NOMI vs Mesenteric Venous Thrombosis vs Chronic Intestinal Angina.',
        'Stages of Bowel Ischemia: Reversible mucosal ischemia -> Transmural necrosis -> Perforation, peritonitis, and septic shock.'
      ],
      classificationAr: [
        'الأنماط السريرية: انصمامي حاد، تخثري حاد، غير انسدادي (NOMI)، خثار وريدي، أو ذبحة معوية مزمنة.',
        'مراحل الإقفار المعوي: إقفار مخاطي عكوس -> تموت كامل الجدار غير عكوس -> انثقاب والتهاب صفاق وصدمة إنتانية.'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Acute Mesenteric Ischemia: Classical hallmark is severe, agonizing, unremitting periumbilical abdominal pain out of proportion to physical exam findings (abdomen initially soft without peritoneal signs).',
        'Early emptying: Sudden diarrhea, forceful defecation, or vomiting accompanying pain onset.',
        'Late signs: Involuntary guarding, rigidity, rebound tenderness, silent bowel sounds, bloody diarrhea (currant jelly stool - late bowel infarction).',
        'Chronic Mesenteric Ischemia: Classic triad: 1. Postprandial dull crampy abdominal pain beginning 30-45 minutes after eating ("intestinal angina"); 2. Sitophobia (morbid fear of eating); 3. Severe unintentional weight loss (food avoidance).'
      ],
      cardinalSignsAr: [
        'إقفار الأمعاء الحاد: العلامة الكلاسيكية هي ألم بطني حاد وشديد وغير محتمل حول السرة لا يتناسب مع الفحص السريري (البطن لين وغير مؤلم بالجس الأولي).',
        'التفريغ الهضمي المبكر: إسهال مفاجئ، إقياء، وتفريغ أمعاء فوري عند بدء الألم.',
        'العلامات المتأخرة: بطن خشبي صلب، دفاع صفاقي لا إرادي، غياب أصوات الأمعاء، وبراز مدمى شبيه بهلام الكشمش (تموت الأمعاء).',
        'إقفار الأمعاء المزمن: الثلاثي الكلاسيكي: 1. ألم بطني تشنجي بعد الأكل بـ 30-45 دقيقة (ذبحة معوية)؛ 2. خوف مرضي من الطعام (Sitophobia)؛ 3. نقص وزن شديد وهزال.'
      ],
      physicalExamEn: [
        'Abdominal exam: Palpate for tenderness, involuntary guarding, and rebound peritonitis.',
        'Auscultation for epigastric arterial bruit and presence or absence of bowel sounds.',
        'Digital rectal exam (DRE) for occult blood or frank melena/hematochezia.'
      ],
      physicalExamAr: [
        'فحص البطن: تحري الدفاع الصفاقي اللاإرادي وعلامات التخريش.',
        'إصغاء البطن لتحري النفخات الشريانية وغياب أصوات الأمعاء.',
        'المس الشرجي للتحقق من وجود دم خفي أو براز مدمى.'
      ],
      bedsideTestsEn: [
        'Arterial blood gas (ABG): Elevated anion-gap metabolic acidosis and base deficit.',
        'Point-of-care serum lactate measurement.'
      ],
      bedsideTestsAr: [
        'غازات الدم الشرياني (ABG): حموضة أيضية مع فجوة صواعد مرتفعة ونقص القواعد.',
        'قياس حمض اللاكتيك الفوري في الدم.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Serum Lactate: Elevated levels (>2.0 mmol/L) indicate advanced intestinal transmural necrosis; normal lactate DOES NOT exclude early ischemia (ESVS Class I, Level B).',
        'Complete blood count: Marked leukocytosis (>15,000-20,000/uL with left shift).',
        'D-dimer: Highly elevated in acute mesenteric ischemia (>1,000 ng/mL, high negative predictive value).'
      ],
      labsAr: [
        'حمض اللاكتيك بالدم: الارتفاع (> 2.0) يدل على تموت كامل لجدار الأمعاء؛ والنتيجة الطبيعية لا تنفي الإقفار المبكر.',
        'تعداد كريات الدم البيضاء: ارتفاع حاد في الكريات البيضاء (> 15,000-20,000 مع انزياح لليسار).',
        'دي-دايمر D-dimer: يرتفع بشدة في الإقفار المساريقي الحاد.'
      ],
      imagingDuplexEn: [
        'Duplex ultrasound of celiac and SMA: Highly accurate in elective chronic mesenteric ischemia (SMA PSV >275 cm/s predicts >70% stenosis; Celiac PSV >200 cm/s predicts >70% stenosis). Not suitable for acute emergencies due to bowel gas.'
      ],
      imagingDuplexAr: [
        'الدوبلكس الشرياني: دقيق في حالات الذبحة المعوية المزمنة (سرعة SMA > 275 سم/ثانية تدل على تضيق >70%). لا يصلح للطوارئ الحادة بسبب غازات الأمعاء.'
      ],
      imagingCtaEn: [
        'Biphasic Contrast-Enhanced CTA of Chest, Abdomen, and Pelvis with Thin Slices <=1 mm (Gold Standard): Must include unenhanced, arterial, and portal venous phases. Demonstrates arterial cutoff, bowel wall thickening or thinning (paper-thin wall), pneumatosis intestinalis, portal venous gas, and mesenteric stranding.'
      ],
      imagingCtaAr: [
        'أشعة مقطعية وعائية بالصبغة ثنائية الطور بشرائح رفيعة <= 1 مم (المعيار الذهبي): تشمل الطور الشرياني والوريدي. تكشف انقطاع الشريان، رقة أو سماكة جدار الأمعاء، غازات في جدار الأمعاء (Pneumatosis)، وغازات في وريد الباب.'
      ],
      imagingAngioEn: [
        'Catheter Angiography: Allows therapeutic transcatheter papaverine infusion in NOMI or retrograde/antegrade stenting.'
      ],
      imagingAngioAr: [
        'القسطرة الظليلة: تسمح بضخ دواء البابافيرين لفك التشنج الوعائي في NOMI أو وضع الدعامات.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Immediate Intravenous Unfractionated Heparin (UFH)',
          nameAr: 'الهيبارين غير المجزأ وريدياً فوراً',
          exactDose: '5,000 IU IV bolus immediately upon clinical suspicion, followed by continuous infusion titrated to aPTT ratio 2.0-2.5.',
          exactDoseAr: '5000 وحدة وريدياً فور مجرد الشك السريري، متبوعة بضخ مستمر لضبط aPTT بين 2.0-2.5.',
          indication: 'Arrests thrombus propagation, preserves microvascular collaterals, and reduces mortality (ESVS Class I, Level B).',
          indicationAr: 'إيقاف انتشار الخثرة وحماية التروية الدقيقة وخفض الوفيات.',
          sideEffects: 'Hemorrhage, heparin-induced thrombocytopenia (HIT).',
          sideEffectsAr: 'نزف، ونقص صفائح ناتج عن الهيبارين HIT.'
        },
        {
          name: 'Intra-Arterial Papaverine Infusion (Phosphodiesterase Inhibitor)',
          nameAr: 'ضخ البابافيرين داخل الشريان (لمتلازمة NOMI والتشنج الوعائي)',
          exactDose: '30-60 mg/hour continuous infusion via catheter positioned selectively in the SMA.',
          exactDoseAr: '30-60 مجم/ساعة ضخاً مستمراً عبر قسطرة مثبتة في الشريان المساريقي العلوي.',
          indication: 'First-line therapy for Non-Occlusive Mesenteric Ischemia (NOMI) and refractory vasospasm after revascularization.',
          indicationAr: 'علاج الخط الأول لإقفار الأمعاء غير الانسدادي (NOMI) والتشنج الوعائي بعد الجراحة.',
          sideEffects: 'Hypotension (if systemic spillover occurs), cardiac arrhythmias, hepatic dysfunction.',
          sideEffectsAr: 'هبوط ضغط دموي، واضطراب نظم القلب.'
        },
        {
          name: 'Broad-Spectrum Intravenous Antibiotics (Piperacillin-Tazobactam + Metronidazole)',
          nameAr: 'المضادات الحيوية واسعة الطيف وريدياً (بيبيراسيلين-تازوباكتام + ميترونيدازول)',
          exactDose: 'Piperacillin-Tazobactam 4.5 g IV every 6 hours.',
          exactDoseAr: 'بيبيراسيلين-تازوباكتام 4.5 جم وريدياً كل 6 ساعات.',
          indication: 'Prevents bacterial translocation across compromised ischemic intestinal mucosal barrier.',
          indicationAr: 'منع انتقال البكتيريا عبر الغشاء المخاطي المتقرح للأمعاء وتفادي التسمم الدموي.',
          sideEffects: 'Allergic reactions, diarrhea, Clostridioides difficile colitis.',
          sideEffectsAr: 'تحسس، وإسهال، والتهاب قولون غشائي كاذب.'
        }
      ],
      supportiveCareEn: [
        'Vigorous fluid resuscitation with balanced crystalloids to correct hemoconcentration and lactic acidosis.',
        'Nasogastric tube decompression of gastrointestinal tract.',
        'Avoidance of alpha-adrenergic vasopressors (e.g., Norepinephrine, Epinephrine, Vasopressin) which cause severe splanchnic vasoconstriction; Dobutamine or low-dose Dopamine preferred if inotropic support needed.'
      ],
      supportiveCareAr: [
        'إنعاش مكثف بالسوائل الوريدية المتوازنة لتصحيح الجفاف وحموضة الدم.',
        'أنبوب أنفي معدي لتفريغ الأمعاء وتخفيف الضغط.',
        'تجنب المقبضات الوعائية من نمط ألفا (كالنورإبينفرين) لأنها تسبب تقبضاً مساريقياً شديداً ويفضل الدوبوتامين عند الحاجة لدعم القلب.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Emergency Laparotomy and Surgical SMA Embolectomy',
        procedureNameAr: 'فتح البطن الإسعافي واستئصال صمة الشريان المساريقي العلوي بقسطرة فوغارتي',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Rapid midline laparotomy from xiphoid to pubis; eviscerate small bowel to the right and expose root of the transverse mesocolon.',
          'Step 2: Identify superior mesenteric artery pulsation at the inferior border of the pancreas; incise retroperitoneum and dissect proximal SMA.',
          'Step 3: Administer IV heparin; obtain proximal and distal vessel control with vessel loops.',
          'Step 4: Perform transverse arteriotomy in the SMA; pass Fogarty 3F or 4F embolectomy catheter distally and proximally.',
          'Step 5: Inflate balloon gently and retrieve embolus; confirm vigorous brisk pulsatile inflow and back-bleeding.',
          'Step 6: Flush with heparinized saline; close arteriotomy with interrupted or continuous 6-0/7-0 polypropylene suture (patch angioplasty if caliber <4 mm).',
          'Step 7: Assess bowel viability for 20-30 minutes under warm saline packs (inspection of color, peristalsis, and Doppler signals on mesenteric border); resect frank necrotic bowel; plan MANDATORY SECOND-LOOK laparotomy at 24-48 hours.'
        ],
        stepsAr: [
          'الخطوة 1: فتح البطن الإسعافي عبر خط الوسط من القص حتى العانة، وسحب الأمعاء الدقيقة وإظهار جذر المساريقا.',
          'الخطوة 2: جس نبض الشريان المساريقي العلوي أسفل البنكرياس، وشق الصفاق الخلفي وتحرير الشريان.',
          'الخطوة 3: إعطاء هيبارين وريدياً والسيطرة على الشريان بشرائط وعائية.',
          'الخطوة 4: شق الشريان عرضياً وإدخال قسطرة فوغارتي 3F أو 4F للأعلى والأسفل.',
          'الخطوة 5: نفخ البالون بلطف وسحب الصمة، والتحقق من التدفق الدموي النابض القوي.',
          'الخطوة 6: غسل الشريان وإغلاق الشق بخيط برولين 6-0 أو 7-0 (أو رقعة توسيعية إذا كان القطر صغيراً).',
          'الخطوة 7: تقييم حيوية الأمعاء لمدة 20-30 دقيقة بكمادات دافئة (اللون، الحركات الدودية، وإشارة الدوبلر)، واستئصال الأجزاء الميتة فقط، وجدولة فتح بطن استكشافي ثانٍ إلزامي بعد 24-48 ساعة.'
        ],
        surgicalPearlsEn: [
          'Always use a transverse arteriotomy to prevent longitudinal stenosis upon closure.',
          'Never perform primary definitive anastomosis of questionable bowel in unstable septic patients (damage control surgery, leave in continuity or temporary stomas).',
          'Second-look laparotomy at 24-48 hours is strongly recommended in all cases (ESVS Class I, Level B).'
        ],
        surgicalPearlsAr: [
          'استخدام الشق العرضي دائماً لمنع تضيق لمعة الشريان عند خياطته.',
          'يمنع عمل مفاغرات معوية نهائية لأمعاء مشكوك في حيويتها في مريض يعاني من صدمة إنتانية (جراحة التحكم بالأضرار).',
          'فتح البطن الاستكشافي الثاني بعد 24-48 ساعة إلزامي لتقييم حيوية الأمعاء (فئة I، مستوى دليل B).'
        ],
        complicationsEn: [
          'Intestinal perforation, short bowel syndrome from extensive resection, mesenteric re-thrombosis, reperfusion lung injury, abdominal compartment syndrome.'
        ],
        complicationsAr: [
          'انثقاب الأمعاء، متلازمة الأمعاء القصيرة بسبب الاستئصال الواسع، تجدد الخثار، ومتلازمة الحجرات البطنية.'
        ]
      },
      {
        procedureNameEn: 'Endovascular Revascularization for Chronic Mesenteric Ischemia (SMA Stenting)',
        procedureNameAr: 'إعادة التروية بالقسطرة لإقفار الأمعاء المزمن (دعامات الشريان المساريقي المغطاة)',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Retrograde femoral or left brachial artery access; place 6F guiding sheath at celiac/SMA takeoff.',
          'Step 2: Cross ostial SMA occlusion/stenosis with 0.014" or 0.018" steerable guidewire.',
          'Step 3: Predilate stenosis with small balloon.',
          'Step 4: Deploy balloon-expandable covered stent (e.g., 6-8 mm diameter, protruding 1-2 mm into aortic lumen).',
          'Step 5: Completion angiogram verifying brisk unrestricted visceral flow and absence of dissection.'
        ],
        stepsAr: [
          'الخطوة 1: الدخول عبر الشريان الفخذي أو الشريان العضدي الأيسر وتثبيت غمد توجيه 6F عند مخرج الشريان.',
          'الخطوة 2: اجتياز التضيق بسلك توجيه دقيق 0.014 بوصة.',
          'الخطوة 3: التوسيع الأولي ببالون صغير.',
          'الخطوة 4: نشر دعامة مغطاة قابلة للتمدد بالبالون (قطر 6-8 مم مع بروز 1-2 مم في الأبهر).',
          'الخطوة 5: تصوير ختامي للتأكد من انسياب الدم وغياب أي تسلخ.'
        ],
        surgicalPearlsEn: [
          'Balloon-expandable covered stents provide superior patency and freedom from reintervention compared with bare-metal stents (ESVS Class I, Level B).'
        ],
        surgicalPearlsAr: [
          'الدعامات المغطاة القابلة للتمدد بالبالون تحقق نفاذية أعلى ومعدل إعادة تدخل أقل مقارنة بالدعامات المعدنية العادية.'
        ],
        complicationsEn: [
          'Arterial dissection, vessel perforation, distal embolization, stent fracture.'
        ],
        complicationsAr: [
          'تسلخ الشريان، انثقاب الوعاء، انصمام شرياني بعيد، وانكسار الدعامة.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-mes-1',
        title: 'Superior Mesenteric Artery (SMA) Embolism & Surgical Fogarty Technique',
        titleAr: 'انصمام الشريان المساريقي العلوي واستئصال الصمة بقسطرة فوغارتي',
        category: 'Mesenteric Anatomy',
        svgType: 'mesenteric_anatomy',
        caption: 'Celiac and SMA takeoff, transverse arteriotomy, Fogarty catheter extraction, and bowel viability assessment.',
        captionAr: 'مخرج الشريان المساريقي العلوي، الشق العرضي، استخراج الصمة بقسطرة فوغارتي، وتقييم حيوية الأمعاء.'
      }
    ],
    videos: [
      {
        id: 'vid-mes-1',
        title: 'Acute Mesenteric Ischemia Surgical SMA Embolectomy Operative Guide',
        titleAr: 'استئصال صمة الشريان المساريقي العلوي جراحياً خطوة بخطوة بالفيديو',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=acute+mesenteric+ischemia+SMA+embolectomy+surgical+technique',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'Operative exposure of the SMA at the root of the mesentery, transverse arteriotomy, Fogarty embolectomy, and bowel viability check.',
        descriptionAr: 'تعريض الشريان المساريقي عند جذر المساريقا، الشق العرضي، استخراج الصمة، وفحص الأمعاء.'
      },
      {
        id: 'vid-mes-2',
        title: 'ESVS 2020 Guidelines on Acute and Chronic Mesenteric Artery Disease',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS 2020) لأمراض الشرايين المساريقية والأمعاء',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(19)30906-2/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Official clinical guidelines on biphasic CTA, emergency revascularization, second-look laparotomy, and covered SMA stenting.',
        descriptionAr: 'الدليل الأوروبي الشامل للأشعة المقطعية ثنائية الطور، إعادة التروية الطارئة، واستكشاف البطن الثاني والدعامات.'
      }
    ]
  },
  popliteal_aneurysm: {
    topicKey: 'popliteal_aneurysm',
    titleEn: 'Popliteal Artery Aneurysms (PAA) & Peripheral Aneurysms',
    titleAr: 'أم دم الشريان المأبضي (PAA) وأمهات الدم الطرفية',
    category: 'Peripheral Aneurysm',
    pathophysiology: {
      definitionEn: 'Localized focal dilation of the popliteal artery exceeding 50% of the normal diameter (diameter >=20 mm in adults), carrying a high propensity for thrombosis and distal thromboembolism rather than rupture.',
      definitionAr: 'توسع موضعي في الشريان المأبضي يتجاوز 50% من القطر الطبيعي (القطر >= 20 مم عند البالغين)، يتميز بميل مرتفع جداً للتخثر والانصمام الطرفي المؤدي للبتر بدلاً من التمزق.',
      etiologyEn: [
        'Atherosclerosis and matrix metalloproteinase elastolysis.',
        'High mechanical shear stress behind the knee joint during knee flexion.',
        'Strong association with abdominal aortic aneurysm (AAA in 40-50% of patients) and contralateral popliteal aneurysm (50% bilateral).',
        'Mycotic/infectious popliteal aneurysms (endocarditis, IV drug abuse).'
      ],
      etiologyAr: [
        'التصلب العصيدي وانحلال الألياف المرنة بإنزيمات الماتريكس.',
        'إجهاد القص الميكانيكي الحركي العالي خلف مفصل الركبة أثناء ثني الساق.',
        'ارتباط وثيق بأم دم الأبهر البطني (40-50% من المرضى لديهم AAA) وتناظر الإصابة بالطرفين (50% ثنائية الجانب).',
        'أمهات الدم المنتنة/الفطرية الناتجة عن التهاب الشغاف الجرثومي.'
      ],
      classificationEn: [
        'Clinical Status: Asymptomatic (discovered incidentally or on pulse exam) vs Symptomatic (acute ischemia from thrombosis, chronic microemboli/blue toe syndrome, or compressive edema/DVT).',
        'Size Thresholds: Diameter >=20 mm or presence of laminated mural thrombus justifies elective repair (ESVS Guidelines).'
      ],
      classificationAr: [
        'الحالة السريرية: لا عرضية (تكتشف صدفة بالفحص) مقابل عرضية (إقفار حاد بسبب التخثر، صمات دقيقة كزرقة الأصابع، أو انضغاط الوريد وتورم الساق).',
        'معيار الحجم: القطر >= 20 مم أو وجود خثرة جدارية يستوجب التدخل الجراحي الاختياري.'
      ]
    },
    symptoms: {
      cardinalSignsEn: [
        'Asymptomatic: Prominent, wide, bounding, expansile pulsatile mass in the popliteal fossa.',
        'Acute limb ischemia: Sudden onset of the 6 Ps (severe pain, pallor, pulselessness, paresthesia, paralysis, poikilothermia) from acute popliteal thrombosis.',
        'Blue toe syndrome (trash foot): Painful cyanotic or purpuric toes with intact proximal pedal pulses due to microemboli showering from mural thrombus.',
        'Venous compression: Unilateral calf swelling and deep vein thrombosis due to extrinsic popliteal vein compression.',
        'Tibial nerve compression: Paresthesias and plantar numbness in the foot.'
      ],
      cardinalSignsAr: [
        'لا عرضية: كتلة نابضة عريضة متوسعة وواضحة جداً في الحفرة المأبضية خلف الركبة.',
        'إقفار الأطراف الحاد: ظهور مفاجئ للأعراض الستة (ألم، شحوب، غياب النبض، خدر، شلل، برودة) بسبب التخثر الحاد.',
        'متلازمة أصابع القدم الزرقاء (Blue Toe): زرقة مؤلمة ونخر بأصابع القدم مع بقاء نبض القدم مجسوساً بسبب تطاير صمات دقيقة من جدار أم دم.',
        'انضغاط الوريد المأبضي: تورم الساق والتهاب وريدي خثاري عميق ناتج عن انضغاط الوريد بالكتلة المتوسعة.',
        'انضغاط العصب الظنبوبي: خدر وتنميل في أخمص القدم.'
      ],
      physicalExamEn: [
        'Bimanual palpation of the popliteal fossa with the patient prone and knee flexed at 30-45 degrees.',
        'Complete pulse examination of both lower extremities and abdominal palpation for concurrent AAA.',
        'Inspection of toes for microembolic splinter hemorrhages and purple discoloration.'
      ],
      physicalExamAr: [
        'جس الحفرة المأبضية بكلتا اليدين والمريض بوضعية الانبطاح مع ثني الركبة 30-45 درجة.',
        'فحص نبضات الطرفين السفلين بالكامل وجس البطن للبحث عن أم دم أورطية مرافقة.',
        'فحص أصابع القدم لتحري النزوف الشظوية والزرقة الناتجة عن الصمات الدقيقة.'
      ],
      bedsideTestsEn: [
        'Handheld Doppler assessment of pedal signals (dorsalis pedis and posterior tibial).',
        'Ankle-Brachial Index (ABI).'
      ],
      bedsideTestsAr: [
        'فحص الدوبلر الصوتي لشرايين ظهر القدم والظنبوبي الخلفي.',
        'قياس مؤشر ABI.'
      ]
    },
    diagnosticWorkup: {
      labsEn: [
        'Routine preoperative profile: CBC, coagulation parameters, serum creatinine, electrolytes.'
      ],
      labsAr: [
        'الفحوصات الجراحية الروتينية: تعداد الدم، زمن التخثر، ووظائف الكلى.'
      ],
      imagingDuplexEn: [
        'Color Duplex Ultrasound (Primary Screening Tool): Measures maximum outer-to-outer diameter (transverse and longitudinal planes), evaluates mural thrombus thickness, and checks distal runoff vessels.',
        'Routine contralateral popliteal ultrasound and abdominal aorta ultrasound (mandatory screening).'
      ],
      imagingDuplexAr: [
        'الدوبلكس الملون (أداة المسح الأساسية): قياس القطر الخارجي الأقصى، تقييم سماكة الخثرة الجدارية، وفحص شرايين الساق المفتوحة.',
        'فحص الحفرة المأبضية المقابلة والأبهر البطني بالسونار بشكل إلزامي.'
      ],
      imagingCtaEn: [
        'Computed Tomography Angiography (CTA) of Abdomen, Pelvis, and Lower Extremities: Delineates proximal/distal landing zones, patency of anterior/posterior tibial and peroneal arteries, and tortuosity.'
      ],
      imagingCtaAr: [
        'أشعة مقطعية وعائية بالصبغة (CTA) للبطن والحوض والأطراف السفلية: تحديد مناطق التثبيت، ونفاذية شرايين الساق الثلاثة، والمسار التشريحي.'
      ],
      imagingAngioEn: [
        'Catheter Angiography: Indicated in acute thrombosis to guide catheter-directed thrombolysis before surgical repair.'
      ],
      imagingAngioAr: [
        'القسطرة الظليلة: تستطب في حالات التخثر الحاد لتوجيه إذابة الخثرة بالقسطرة قبل الترميم الجراحي.'
      ]
    },
    medicalTherapy: {
      drugs: [
        {
          name: 'Preoperative Therapeutic Heparinization',
          nameAr: 'الهيبارين العلاجي قبل الجراحة',
          exactDose: '5,000 IU IV bolus followed by 1,000 IU/hour continuous infusion (titrated to aPTT 2.0-2.5).',
          exactDoseAr: '5000 وحدة وريدياً تليها 1000 وحدة/ساعة ضخاً مستمراً لمعايرة aPTT بين 2.0-2.5.',
          indication: 'Essential in acute thrombosis or blue toe syndrome to preserve microvascular runoff.',
          indicationAr: 'ضروري في حالات التخثر الحاد أو صمات أصابع القدم الزرقاء لمنع انتشار الخثرة.',
          sideEffects: 'Bleeding, thrombocytopenia.',
          sideEffectsAr: 'نزف، ونقص صفائح دم.'
        },
        {
          name: 'Antiplatelet Therapy (Aspirin or Clopidogrel)',
          nameAr: 'مضادات الصفائح (الأسبرين أو كلوبيدوغريل)',
          exactDose: 'Aspirin 100 mg PO daily (or Clopidogrel 75 mg daily).',
          exactDoseAr: 'أسبرين 100 مجم فموياً يومياً (أو كلوبيدوغريل 75 مجم).',
          indication: 'Long-term secondary prevention of graft or covered stent thrombosis.',
          indicationAr: 'حماية الطعم أو الدعامة المغطاة من التخثر على المدى الطويل.',
          sideEffects: 'Gastric irritation, bruising.',
          sideEffectsAr: 'عسر هضم، وكدمات جلدية.'
        }
      ],
      supportiveCareEn: [
        'Optimization of cardiovascular risk factors (statins, blood pressure control, smoking cessation).',
        'Avoidance of extreme knee hyperflexion in patients undergoing endovascular repair.'
      ],
      supportiveCareAr: [
        'ضبط عوامل الخطورة القلبية (الستاتينات، ضغط الدم، والإقلاع عن التدخين).',
        'تجنب الثني الشديد للركبة للمرضى الذين تم تركيب دعامات لهم.'
      ]
    },
    surgicalProcedures: [
      {
        procedureNameEn: 'Open Medial Bypass with Aneurysm Ligation (Gold Standard)',
        procedureNameAr: 'الجراحة الالتفافية عبر المدخل الإنسي مع ربط أم دم بالوريد الصافن (المعيار الذهبي)',
        type: 'Open Surgery',
        stepsEn: [
          'Step 1: Patient in supine position with knee slightly flexed and externally rotated; harvest ipsilateral great saphenous vein (GSV).',
          'Step 2: Medial incision above the knee between sartorius and vastus medialis to expose above-knee popliteal artery.',
          'Step 3: Medial incision below the knee between tibia and gastrocnemius to expose below-knee popliteal or tibioperoneal trunk.',
          'Step 4: Systemic heparinization (70-100 IU/kg); double-ligate the popliteal artery immediately above and below the aneurysm sac with 0 silk or heavy polypropylene to eliminate thromboembolic risk and exclude sac.',
          'Step 5: Perform proximal and distal end-to-side bypass anastomoses with reversed autologous GSV using continuous 6-0/7-0 polypropylene.',
          'Step 6: Confirm completion patency with intraoperative duplex ultrasound or completion angiography.'
        ],
        stepsAr: [
          'الخطوة 1: استلقاء المريض مع ثني الركبة قليلاً؛ استئصال الوريد الصافن الكبير الذاتي (GSV).',
          'الخطوة 2: شق إنسي فوق الركبة لتعريض الشريان المأبضي فوق المفصل.',
          'الخطوة 3: شق إنسي تحت الركبة لتعريض الشريان المأبضي أسفل المفصل أو الجذع الظنبوبي الشظوي.',
          'الخطوة 4: إعطاء هيبارين؛ وربط الشريان المأبضي برباطين جراحيين متينين أعلى وأسفل أم دم لعزل الكيس بالكامل ومنع الصمات.',
          'الخطوة 5: خياطة المفاغرة القريبة والبعيدة من الجانب للطرف بالوريد الصافن المقلوب بخيط برولين 6-0 و7-0.',
          'الخطوة 6: التأكد من نبض الطعم وانسياب الدم بالدوبلكس على طاولة العمليات.'
        ],
        surgicalPearlsEn: [
          'First-line treatment of choice with 5-year primary patency >85-90% using autologous vein (ESVS Class I, Level A).',
          'Always ligate the collateral genicular back-bleeding branches into the sac when feasible to prevent endotension and continued sac enlargement.'
        ],
        surgicalPearlsAr: [
          'الخيار الأول المفضل بنفاذية 5 سنوات تتجاوز 85-90% بالوريد الصافن الذاتي (فئة I، مستوى دليل A).',
          'عزل وربط الشريان أعلى وأسفل أم دم يمنع تماماً تجدد الصمات وتغذية الكيس.'
        ],
        complicationsEn: [
          'Graft thrombosis, saphenous nerve sensory neuropathy, groin wound infection, persistent genicular branch feeding of sac.'
        ],
        complicationsAr: [
          'تخثر الطعم، تنميل العصب الصافن الحسي، عدوى الجرح، وتغذية متبقية للكيس من الشرايين الركبية.'
        ]
      },
      {
        procedureNameEn: 'Endovascular Popliteal Repair with Covered Stent-Graft (Viabahn)',
        procedureNameAr: 'الترميم داخل الوعائي بالقسطرة بالدعامة المغطاة (Viabahn)',
        type: 'Endovascular',
        stepsEn: [
          'Step 1: Contralateral or ipsilateral antegrade superficial femoral artery access; place 7F-8F sheath.',
          'Step 2: Cross aneurysm with 0.035" stiff guidewire; measure proximal and distal non-aneurysmal landing zones (must have >=15-20 mm normal artery at both ends).',
          'Step 3: Select heparin-bonded PTFE covered stent-graft (Viabahn), oversizing diameter by 5-10%.',
          'Step 4: Deploy stent-graft across aneurysm, ensuring adequate overlap if using multiple components.',
          'Step 5: Post-dilate landing zones with balloon; confirm total exclusion of aneurysm sac and preserved runoff on completion angiogram.'
        ],
        stepsAr: [
          'الخطوة 1: الدخول عبر الشريان الفخذي بالاتجاه المباشر أو المقابل وإدخال غمد 7F-8F.',
          'الخطوة 2: اجتياز أم دم بسلك صلب وقياس مناطق التثبيت السليمة أعلى وأسفل التوسع (>= 15-20 مم شريان سليم).',
          'الخطوة 3: اختيار دعامة مغطاة بمادة PTFE مرتبطة بالهيبارين (Viabahn) مع زيادة القطر بنسبة 5-10%.',
          'الخطوة 4: فتح الدعامة عبر أم دم وتغطية كامل الكيس.',
          'الخطوة 5: توسيع أطراف التثبيت بالبالون والتأكد من العزل التام واستمرار التروية لشرايين الساق.'
        ],
        surgicalPearlsEn: [
          'Viable alternative in elderly frail patients with hostile operative anatomy or prohibitive open surgical risk (ESVS Class IIa, Level B).',
          'Requires at least 2 patent distal tibial runoff vessels for durable patency.'
        ],
        surgicalPearlsAr: [
          'بديل ممتاز للمرضى كبار السن ذوي الخطورة الجراحية العالية أو في حال عدم توفر وريد صافن.',
          'يتطلب وجود شريانين ساقيين مفتوحين على الأقل لضمان استمرارية النفاذية.'
        ],
        complicationsEn: [
          'Stent-graft thrombosis, stent fracture from repeated knee flexion, Type I or Type II endoleak.'
        ],
        complicationsAr: [
          'تخثر الدعامة المغطاة، انكسار الدعامة بسبب حركة ثني الركبة المتكررة، والتسريب الداخلي Endoleak.'
        ]
      }
    ],
    diagrams: [
      {
        id: 'diag-paa-1',
        title: 'Popliteal Artery Aneurysm: Medial Bypass Exclusion & Viabahn Stent-Graft',
        titleAr: 'أم دم الشريان المأبضي: الجراحة الالتفافية الاستبعادية والدعامة المغطاة',
        category: 'Peripheral Aneurysm',
        svgType: 'popliteal_anatomy',
        caption: 'Popliteal aneurysm sac with laminated thrombus, medial saphenous vein bypass with proximal/distal ligation, and endovascular Viabahn stent-graft.',
        captionAr: 'كيس أم دم الشريان المأبضي بالخثرة الجدارية، المجازة الإنسية بالوريد الصافن مع الربط، ودعامة Viabahn المغطاة.'
      }
    ],
    videos: [
      {
        id: 'vid-paa-1',
        title: 'Popliteal Artery Aneurysm Repair: Medial Approach Operative Guide',
        titleAr: 'جراحة أم دم الشريان المأبضي عبر المدخل الإنسي خطوة بخطوة',
        platform: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=popliteal+artery+aneurysm+repair+medial+approach+surgical+technique',
        author: 'Society for Vascular Surgery (SVS)',
        description: 'Harvesting saphenous vein, exposing popliteal artery above and below the knee, aneurysm exclusion ligation, and bypass.',
        descriptionAr: 'استعراض جراحي كامل لحصاد الوريد، تعريض الشريان أعلى وأسفل الركبة، ربط أم دم، وعمل المجازة الالتفافية.'
      },
      {
        id: 'vid-paa-2',
        title: 'ESVS Guidelines on Popliteal and Peripheral Arterial Aneurysms Overview',
        titleAr: 'إرشادات الجمعية الأوروبية (ESVS) لأمهات دم الشريان المأبضي والأطراف',
        platform: 'EJVES',
        url: 'https://www.ejves.com/article/S1078-5884(21)00713-9/fulltext',
        author: 'European Journal of Vascular & Endovascular Surgery',
        description: 'Official clinical guidelines on screening thresholds (>= 20 mm), thromboembolic risk, open vs endovascular repair, and runoff preservation.',
        descriptionAr: 'الدليل الأوروبي الشامل لمعايير التدخل الجراحي (>= 20 مم)، مخاطر الانصمام الخثاري، والمفاضلة بين الجراحة والدعامات.'
      }
    ]
  }
};

