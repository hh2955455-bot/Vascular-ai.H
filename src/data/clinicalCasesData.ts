import { ClinicalCase } from '../types';

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-ali-01',
    title: 'Acute Right Lower Limb Ischemia in a 68-Year-Old Female',
    titleAr: 'إقفار حاد في الطرف السفلي الأيمن لدى مريضة تبلغ 68 عاماً',
    patientProfile: '68-year-old female with long-standing atrial fibrillation, non-compliant with oral anticoagulation, presents to ED with 4-hour history of excruciating right leg pain.',
    difficulty: 'Resident',
    category: 'Arterial',
    initialVitals: {
      BP: '142/86 mmHg',
      HR: '118 bpm (irregularly irregular)',
      RR: '18/min',
      Temp: '36.8 °C',
      SpO2: '98% on room air'
    },
    chiefComplaint: 'Sudden onset of severe, cold, painful right lower extremity beginning 4 hours ago.',
    historySummary: 'Patient describes acute sudden pain in right calf and foot while watching TV. No preceding claudication history. History of hypertension, atrial fibrillation (stopped apixaban 3 months ago due to cost). No history of diabetes or smoking.',
    steps: [
      {
        id: 'step-1-exam',
        stageTitle: 'Initial Bedside Examination',
        descriptionEn: 'You perform an urgent focused vascular and neurological examination of both lower extremities. What are your priority bedside findings?',
        descriptionAr: 'تقوم بإجراء فحص سريري وعصبي وعائي فوري وموجه للطرفين السفليين. ما هي الموجودات السريرية ذات الأولوية؟',
        patientData: {
          vitals: {
            'Right Leg': 'Pale, cold from mid-calf distally. Femoral pulse 2+ bounding. Popliteal, DP, and PT pulses ABSENT.',
            'Left Leg': 'Warm, normal color, 2+ pulses throughout (Femoral, Popliteal, DP, PT).',
            'Neurology': 'Right foot: diminished light touch sensation over toes and forefoot (paresthesia). Intact active toe flexion and ankle dorsiflexion (no motor deficit).',
            'Handheld Doppler': 'Right femoral: triphasic. Right DP and PT: no audible arterial Doppler signals. Venous Doppler signals are audible in the popliteal vein and posterior tibial vein.'
          }
        },
        options: [
          {
            id: 'opt-1a',
            textEn: 'Classify as Rutherford Category IIa (Marginally Threatened) and order urgent contrast-enhanced CTA of the aorta and lower extremities.',
            isOptimal: false,
            feedbackEn: 'While the classification is correct (IIa: sensory loss over toes, no motor deficit, venous audible), delaying immediate systemic heparinization while arranging transportation to the CT scanner is a critical error.',
            feedbackAr: 'التصنيف صحيح (IIa)، لكن تأخير إعطاء الهيبارين الوريدي الفوري بانتظار الأشعة المقطعية خطأ سريري حرج.'
          },
          {
            id: 'opt-1b',
            textEn: 'Classify as Rutherford Category IIa, initiate immediate IV unfractionated heparin bolus (80 U/kg) with infusion, and assess bedside continuous monitoring.',
            isOptimal: true,
            feedbackEn: 'Excellent! Immediate intravenous heparinization arrests propagation of the distal thrombus and prevents microvascular thrombosis. Rutherford IIa limbs are salvageable if treated promptly within hours.',
            feedbackAr: 'ممتاز! البدء الفوري بالهيبارين الوريدي غير المجزأ يمنع امتداد الخثرة ويحمي التروية الدقيقة. أطراف رذرفورد IIa قابلة للإنقاذ إذا عولجت سريعاً.'
          },
          {
            id: 'opt-1c',
            textEn: 'Classify as Rutherford Category III (Irreversible) and book immediate guillotine amputation.',
            isOptimal: false,
            feedbackEn: 'Incorrect and dangerous. The patient has intact motor function (no paralysis) and audible venous Doppler signals. The limb is viable and salvageable, not irreversible.',
            feedbackAr: 'غير صحيح وخطير! المريض لديه حركة سليمة وأصوات وريدية بالدوبلر. الطرف قابل للإنقاذ وليس غير قابل للاسترداد.'
          }
        ]
      },
      {
        id: 'step-2-decision',
        stageTitle: 'Revascularization Strategy',
        descriptionEn: 'The patient has received 5,000 IU IV heparin. The bounding right femoral pulse with absent popliteal pulse in a patient with AFib strongly points to a cardioembolic occlusion at the common femoral bifurcation or popliteal artery. What is the most appropriate management?',
        descriptionAr: 'تلقى المريض 5000 وحدة هيبارين. نبض الفخذي المشترك القوي مع غياب النبض المأبضي لدى مريضة بالرجفان الأذيني يشير بشدة لصمة قلبية المنشأ. ما هو التدبير الأمثل؟',
        options: [
          {
            id: 'opt-2a',
            textEn: 'Emergency open surgical embolectomy with a Fogarty balloon catheter via common femoral artery cutdown under local/regional anesthesia.',
            isOptimal: true,
            feedbackEn: 'Optimal choice! Cardioembolic occlusion of native, non-atherosclerotic vessels has a discrete clot that is rapidly and completely cleared with a Fogarty embolectomy catheter (4F for CFA/SFA, 3F for calf vessels) under local or light anesthesia without time delay.',
            feedbackAr: 'الخيار الأمثل! الصمات القلبية في شرايين سليمة تُستخرج بنجاح وسرعة فائقة باستخدام قسطرة فوغارتي عبر شق فخذي تحت التخدير الموضعي.'
          },
          {
            id: 'opt-2b',
            textEn: 'Admit to the vascular ward for 48 hours of therapeutic IV heparin monotherapy alone.',
            isOptimal: false,
            feedbackEn: 'Inadequate. Heparin alone does not lyse acute occluding macro-emboli; progressive irreversible ischemic necrosis and neuromuscular loss will follow.',
            feedbackAr: 'غير كافٍ! الهيبارين وحده لا يذيب الخثرات الانسدادية الكبيرة، وسيتدهور الطرف إلى نخر عضلي عصبي دائم.'
          },
          {
            id: 'opt-2c',
            textEn: 'Transfer to angiography suite for 24-hour catheter-directed thrombolysis (CDT) infusion with Alteplase.',
            isOptimal: false,
            feedbackEn: 'While CDT can be considered in Class I or early IIa with in-situ thrombosis, discrete macro-emboli in a threatened limb with no prior claudication are much faster and safer to treat with surgical balloon embolectomy (15 minutes vs 24 hours of lysis).',
            feedbackAr: 'إذابة الخثرة بالقسطرة تستغرق 24 ساعة، بينما الاستئصال الجراحي ببالون فوغارتي يستغرق 15 دقيقة ويحقق الشفاء الفوري للصمات.'
          }
        ]
      },
      {
        id: 'step-3-postop',
        stageTitle: 'Postoperative Monitoring & Complication Prevention',
        descriptionEn: 'Successful Fogarty embolectomy yielded fresh rubbery thrombus with vigorous backbleeding. Distal DP and PT pulses are now 2+ palpable. Two hours into recovery, the patient complains of progressive severe calf pain, and the calf feels tense on palpation. What is the diagnosis and urgent step?',
        descriptionAr: 'تم استخراج الصمة بنجاح وعاد النبض للقدم. بعد ساعتين، تشكو المريضة من ألم شديد متزايد في بطة الساق وتوتر عند الجس. ما هو التشخيص والخطوة العاجلة؟',
        options: [
          {
            id: 'opt-3a',
            textEn: 'Suspect reperfusion Compartment Syndrome; perform immediate emergent two-incision, four-compartment lower leg fasciotomy.',
            isOptimal: true,
            feedbackEn: 'Crucial clinical pearl! Post-ischemic reperfusion increases capillary permeability leading to massive muscle edema within the rigid fascial compartments. Delaying fasciotomy results in irreversible peroneal nerve palsy (foot drop) and myonecrosis.',
            feedbackAr: 'لؤلؤة سريرية حرجة! إعادة التروية تؤدي إلى وذمة عضلية عنيفة داخل حجرات اللفافة الصلبة (متلازمة الحجرات). التدخل الفوري ببضع اللفافة للأربع حجرات ينقذ العصب الشظوي والعضلات.'
          },
          {
            id: 'opt-3b',
            textEn: 'Elevate the leg and administer higher intravenous opioid analgesia.',
            isOptimal: false,
            feedbackEn: 'Contraindicated! Elevating an ischemic or reperfused limb reduces arterial perfusion gradient and accelerates tissue necrosis.',
            feedbackAr: 'ممنوع! رفع الطرف يقلل ضغط التروية الشريانية ويفاقم متلازمة الحجرات والنخر العضلي.'
          }
        ]
      }
    ],
    learningPearls: [
      'The 6 Ps of ALI: Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia.',
      'Rutherford Class IIa = sensory loss limited to toes, motor intact; IIb = motor deficit present (requires emergent OR).',
      'Always heparinize immediately upon suspicion before imaging.',
      'Cardioembolic clots: Fogarty embolectomy via CFA groin cutdown is fastest and highest yield.',
      'Reperfusion syndrome: monitor for hyperkalemia, acute kidney injury (myoglobinuria), and compartment syndrome.'
    ],
    references: [
      "Rutherford's Vascular Surgery 10th Ed., Chapter 52 & 53",
      'ESVS 2024 Clinical Practice Guidelines on Acute Limb Ischemia'
    ]
  },
  {
    id: 'case-raaa-02',
    title: 'Ruptured Abdominal Aortic Aneurysm (rAAA) in a 74-Year-Old Male',
    titleAr: 'تمزق تمدد الشريان الأورطي البطني لدى رجل يبلغ 74 عاماً',
    patientProfile: '74-year-old male with known 4.8 cm AAA (lost to follow-up 2 years ago) presents with sudden collapse, excruciating back pain radiating to the left groin, and diaphoresis.',
    difficulty: 'Fellow',
    category: 'Aorta',
    initialVitals: {
      BP: '82/48 mmHg',
      HR: '124 bpm',
      RR: '24/min',
      Temp: '36.2 °C',
      SpO2: '93% on high-flow oxygen'
    },
    chiefComplaint: 'Sudden syncope followed by tearing back and left flank pain.',
    historySummary: 'Wife found patient collapsed on bathroom floor. Pale, sweaty. Known heavy smoker (50 pack-years). Previous ultrasound 2 years ago showed 4.8 cm infrarenal aneurysm. On exam: soft, tender pulsatile epigastric mass with left flank ecchymosis (Grey Turner sign).',
    steps: [
      {
        id: 'step-raaa-1',
        stageTitle: 'Immediate Resuscitation Philosophy',
        descriptionEn: 'The emergency nursing staff prepares to infuse 3 liters of warm normal saline under pressure to bring the blood pressure back up to 130 mmHg. What is your directive as the vascular surgeon?',
        descriptionAr: 'يستعد تمريض الطوارئ لضخ 3 لترات من المحلول الملحي لرفع الضغط إلى 130 مم زئبق. ما هو توجيهك الجراحي كجراح أوعية دموية؟',
        options: [
          {
            id: 'opt-raaa-1a',
            textEn: 'Stop excessive crystalloids and enforce Permissive Hypotension (target systolic BP 70-90 mmHg, patient alert and responding).',
            isOptimal: true,
            feedbackEn: 'Correct! Permissive hypotension prevents "popping the clot" (disrupting the fragile retroperitoneal hematoma tamponade) and avoids worsening dilutional coagulopathy and hypothermia.',
            feedbackAr: 'صحيح تماماً! استراتيجية هبوط الضغط المسموح به (70-90 مم زئبق) تحمي خثرة الدك الارتجاعية وتمنع تمزقها الإضافي واعتلال التخثر.'
          },
          {
            id: 'opt-raaa-1b',
            textEn: 'Support rapid crystalloid boluses until systolic BP exceeds 120 mmHg before moving the patient.',
            isOptimal: false,
            feedbackEn: 'Fatal mistake! Aggressive volume resuscitation will dislodge the retroperitoneal tamponade, causing free intraperitoneal rupture and rapid circulatory collapse.',
            feedbackAr: 'خطأ قاتل! ضخ السوائل العنيف يزيل الدك خلف البريتون ويسبب انفجاراً حراً في تجويف البطن وموتاً سريعاً.'
          }
        ]
      },
      {
        id: 'step-raaa-2',
        stageTitle: 'Operative Modality & Technique',
        descriptionEn: 'The hospital has a 24/7 endovascular hybrid operating room and an on-call endovascular team. An ultra-fast non-contrast + arterial phase CT scan shows a 7.6 cm ruptured infrarenal aneurysm with a 18 mm infrarenal neck, 25 degree angulation, and bilateral 8 mm iliac access. What is the evidence-based recommendation?',
        descriptionAr: 'تتوفر غرفة عمليات هجينة وفريق تداخلي. الأشعة المقطعية أظهرت تمدداً 7.6 سم متمزقاً مع عنق بطول 18 مم وزاوية 25 درجة. ما هي التوصية القائمة على الدليل؟',
        options: [
          {
            id: 'opt-raaa-2a',
            textEn: 'Emergency EVAR under local anesthesia with conscious sedation, using an intra-aortic occlusion balloon (REBOA) on standby.',
            isOptimal: true,
            feedbackEn: 'Top-tier recommendation! Current ESVS and SVS guidelines endorse an EVAR-first strategy for ruptured AAA when anatomy is suitable. EVAR under local anesthesia significantly reduces 30-day mortality compared to emergency open laparotomy.',
            feedbackAr: 'توصية عالمية من الدرجة الأولى! توصي إرشادات ESVS و SVS باستراتيجية EVAR أولاً للتمزق عند ملاءمة التشريح تحت تخدير موضعي لتقليل الوفيات مقارنة بالجراحة المفتوحة.'
          },
          {
            id: 'opt-raaa-2b',
            textEn: 'Immediate open midline laparotomy with suprarenal clamping without attempting EVAR.',
            isOptimal: false,
            feedbackEn: 'Open repair carries significantly higher perioperative mortality and cardiac morbidity in elderly patients when suitable EVAR anatomy and hybrid suites exist.',
            feedbackAr: 'الجراحة المفتوحة تحمل نسبة وفيات أعلى لدى كبار السن إذا كانت البيئة الهجينة والتشريح يدعمان دعامة الأورطي.'
          }
        ]
      }
    ],
    learningPearls: [
      'Triad of Ruptured AAA: Abdominal/back pain, pulsatile mass, hypotension.',
      'Permissive Hypotension: Maintain SBP 70-90 mmHg until proximal control is gained.',
      'EVAR-first approach reduces operative mortality in anatomically suitable patients.',
      'Look out for Abdominal Compartment Syndrome (ACS) post-repair; measure bladder pressure.'
    ],
    references: [
      'SVS / ESVS Clinical Practice Guidelines on Abdominal Aortic Aneurysms (2023)',
      "Rutherford's Vascular Surgery 10th Ed., Chapter 78 & 79"
    ]
  }
];
