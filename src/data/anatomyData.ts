import { VascularAnatomyModule } from '../types';

export const VASCULAR_ANATOMY_MODULES: VascularAnatomyModule[] = [
  {
    id: 'femoral-system',
    nameEn: 'Femoral Arterial System (CFA, SFA, Deep Femoral / PFA)',
    nameAr: 'الشرايين الفخذية (الشريان الفخذي المشترك، السطحي، والعميق)',
    category: 'Femoral',
    diagramType: 'femoral',
    course: 'The Common Femoral Artery (CFA) begins as a direct continuation of the External Iliac Artery beneath the inguinal ligament midway between the anterior superior iliac spine (ASIS) and pubic symphysis (midinguinal point). It courses downward for approximately 4 cm within the femoral sheath before bifurcating into the Superficial Femoral Artery (SFA) and the Profunda Femoris (Deep Femoral Artery). The SFA descends vertically through the femoral triangle and traverses the adductor (Hunter\'s) canal, terminating as it passes through the adductor hiatus in the adductor magnus tendon to become the Popliteal Artery.',
    branches: [
      {
        name: 'Superficial Epigastric Artery',
        description: 'Arises from the anterior aspect of the CFA 1 cm below inguinal ligament, passes superiorly toward the umbilicus.',
        clinicalSignificance: 'Vascularizes lower abdominal wall; landmark for proximal control during CFA exposure.'
      },
      {
        name: 'Superficial Circumflex Iliac Artery',
        description: 'Runs laterally toward the ASIS parallel to the inguinal ligament.',
        clinicalSignificance: 'Supplies superficial groin skin; divided during groin exposure.'
      },
      {
        name: 'Superficial External Pudendal Artery',
        description: 'Crosses medially anterior to the femoral vein to supply the scrotum or labium majus.',
        clinicalSignificance: 'Crosses over femoral vein; must be ligated to mobilize the saphenofemoral junction safely.'
      },
      {
        name: 'Profunda Femoris Artery (Deep Femoral)',
        description: 'Arises posterolaterally from the CFA ~4 cm below inguinal ligament, giving off Medial and Lateral Femoral Circumflex arteries and 3-4 perforating branches.',
        clinicalSignificance: 'Vital collateral lifeline in SFA occlusion. Profundaplasty can preserve limb viability without distal bypass.'
      },
      {
        name: 'Descending Genicular Artery',
        description: 'Arises from SFA just proximal to the adductor hiatus, dividing into saphenous and articular branches.',
        clinicalSignificance: 'Crucial collateral source around the knee in popliteal artery occlusion.'
      }
    ],
    relations: [
      'Lateral: Femoral nerve and its muscular branches (outside the femoral sheath)',
      'Medial: Femoral vein (lies medial to the artery at the inguinal ligament, gradually spirals posterior as it enters the adductor canal)',
      'Anterior: Fascia lata, cribriform fascia, superficial lymphatics and groin nodes',
      'Posterior: Psoas major muscle tendon (cushions CFA against the superior pubic ramus)',
      'Femoral Sheath: Formed by transversalis fascia anteriorly and iliac fascia posteriorly'
    ],
    landmarks: [
      'Midinguinal Point: Midway between ASIS and pubic symphysis (pulse palpation landmark)',
      'Inguinal Crease: Usually 1-2 cm distal to the inguinal ligament (do not mistake skin crease for ligament!)',
      'Femoral Triangle borders: Inguinal ligament (superior), Sartorius (lateral), Adductor longus (medial)'
    ],
    surgicalExposure: {
      incision: 'Vertical longitudinal incision centered over the femoral pulse, two fingerbreadths below the inguinal ligament, angled slightly laterally toward the ASIS proximally.',
      plane: 'Incise skin and subcutaneous fat with electrocautery. Retract lymph nodes laterally without excessive skeletonization to reduce lymphatic leak (lymphocele/groin fistula).',
      structuresAtRisk: [
        'Femoral Nerve (lateral) - excessive lateral retraction causes quadriceps weakness and knee buckling.',
        'Femoral Vein (medial/posterior) - tethered medial circumflex branches can tear easily causing profuse venous bleeding.',
        'Accessory obturator vein / circumflex veins crossing anteriorly.'
      ],
      pearls: [
        'Always obtain proximal control of the CFA before mobilizing distal branches.',
        'Never clamp across the bifurcation blindly; dissect the SFA and Profunda origins separately.',
        'In heavily calcified vessels, use soft vascular clamps or intraluminal occlusion balloons to prevent plaque fracturing.'
      ]
    },
    commonPathology: [
      'Atherosclerotic Occlusive Disease: SFA at the adductor hiatus is the most common site of claudication occlusion due to mechanical compression by adductor magnus tendon.',
      'Femoral Pseudoaneurysm: Typically post-catheterization iatrogenic complication.',
      'Femoral Artery Aneurysm: Highly associated with synchronous Abdominal Aortic Aneurysm (85%) and contralateral femoral/popliteal aneurysms.',
      'Groin SSI & Lymphatic Leaks: Common after reoperative groin dissections.'
    ],
    examHighlights: [
      'What nerve lies lateral to the CFA outside the femoral sheath? Femoral nerve (L2-L4).',
      'What structure crosses the femoral vein anteriorly just below the CFA bifurcation? Superficial external pudendal artery.',
      'What is the key collateral vessel that salvages the lower limb when the SFA is occluded? The Profunda Femoris via its descending branch of the lateral circumflex joining the genicular network.'
    ],
    references: [
      "Rutherford's Vascular Surgery 10th Ed., Chapter 10: Surgical Anatomy of the Extremities",
      'Haimovici Vascular Surgery, Chapter 14: Exposure of the Femoral Vessels'
    ]
  },
  {
    id: 'popliteal-artery',
    nameEn: 'Popliteal Artery & Adductor Canal',
    nameAr: 'الشريان المأبضي وقناة المقربات',
    category: 'Popliteal',
    diagramType: 'popliteal',
    course: 'The Popliteal Artery begins as the continuation of the SFA at the adductor hiatus in the adductor magnus tendon (junction of middle and lower thirds of the thigh). It descends obliquely through the popliteal fossa behind the knee joint, lying deep to the popliteal vein and tibial nerve. At the lower border of the popliteus muscle, it terminates by bifurcating into the Anterior Tibial Artery and the Tibioperoneal Trunk.',
    branches: [
      {
        name: 'Superior Genicular Arteries (Medial & Lateral)',
        description: 'Encircle the distal femur above the condyles.',
        clinicalSignificance: 'Participate in rich genicular collateral network around the patella.'
      },
      {
        name: 'Middle Genicular Artery',
        description: 'Pierces the oblique popliteal ligament.',
        clinicalSignificance: 'Supplies the cruciate ligaments and synovial membrane of the knee joint.'
      },
      {
        name: 'Inferior Genicular Arteries (Medial & Lateral)',
        description: 'Wind around the tibial condyles below the joint line.',
        clinicalSignificance: 'Crucial collateral pathways when popliteal bypass crosses above vs below the knee.'
      },
      {
        name: 'Sural Arteries',
        description: 'Large muscular branches supplying the gastrocnemius, soleus, and plantaris muscles.',
        clinicalSignificance: 'Must be controlled during exposure to prevent troublesome muscular bleeding.'
      }
    ],
    relations: [
      'Tibial Nerve: Most superficial (posterior) structure in the popliteal fossa.',
      'Popliteal Vein: Intermediate structure, closely adherent to the posterior wall of the artery.',
      'Popliteal Artery: Deepest (most anterior) structure, resting directly on the popliteal surface of femur, joint capsule, and popliteus muscle.',
      'Surgical mnemonic: From superficial to deep: Nerve, Vein, Artery (N-V-A).'
    ],
    landmarks: [
      'Upper border: Tendons of Biceps femoris (lateral) and Semimembranosus/Semitendinosus (medial)',
      'Lower border: Medial and lateral heads of Gastrocnemius',
      'Floor: Popliteal surface of femur, posterior capsule of knee, and Popliteus muscle'
    ],
    surgicalExposure: {
      incision: 'Medial Above-Knee / Below-Knee approaches (standard for bypass) or Posterior lazy-S incision (for isolated popliteal aneurysm or trauma).',
      plane: 'In medial below-knee approach: Incise deep fascia posterior to the tibia, retract medial head of gastrocnemius posteriorly, divide tendon of sartorius/gracilis/semitendinosus (pes anserinus) if higher exposure is needed.',
      structuresAtRisk: [
        'Saphenous Nerve and Great Saphenous Vein (GSV) along the medial incision.',
        'Tibial Nerve (in posterior approach).',
        'Popliteal vein tear due to dense adventitial adhesions.'
      ],
      pearls: [
        'Below-knee popliteal artery exposure requires gentle anterior mobilization of the gastrocnemius muscle belly.',
        'The anterior tibial artery takes a sharp 90-degree anterior turn through the interosseous membrane; avoid excessive traction.'
      ]
    },
    commonPathology: [
      'Popliteal Artery Aneurysm (PAA): Most common peripheral artery aneurysm (70%). Highly bilateral (50%) and 40% associated with AAA. Embolizes distally causing "blue toe syndrome" or acute thrombosis.',
      'Popliteal Artery Entrapment Syndrome (PAES): Young athletic patient with intermittent calf claudication due to aberrant medial gastrocnemius head anatomy.',
      'Adventitial Cystic Disease: Mucinous cysts in the adventitia compressing the lumen, classically affecting middle-aged men with knee flexion-induced claudication.'
    ],
    examHighlights: [
      'What is the most frequent peripheral artery aneurysm? Popliteal Artery Aneurysm.',
      'What is the threshold for treating an asymptomatic Popliteal Aneurysm? >= 2.0 cm or presence of mural thrombus.',
      'What is the arrangement of neurovascular structures in the popliteal fossa from superficial to deep? Nerve -> Vein -> Artery (N-V-A).'
    ],
    references: [
      "Rutherford's Vascular Surgery 10th Ed., Chapter 10 & 81: Popliteal Aneurysm",
      'ESVS 2020 Popliteal Artery Aneurysm Guidelines'
    ]
  },
  {
    id: 'carotid-bifurcation',
    nameEn: 'Extracranial Carotid System (CCA, ICA, ECA)',
    nameAr: 'منظومة الشريان السباتي خارج القحف (المشترك، الداخلي، والخارجي)',
    category: 'Carotid',
    diagramType: 'carotid',
    course: 'The Common Carotid Artery (CCA) ascends in the neck within the carotid sheath deep to the sternocleidomastoid (SCM) muscle. At the upper border of the thyroid cartilage (vertebral level C3-C4), it bifurcates into the Internal Carotid Artery (ICA) and External Carotid Artery (ECA). The ICA initially lies posterolateral to the ECA before ascending vertically into the carotid canal of the temporal bone without giving off ANY branches in the neck. The ECA courses anteromedially and gives off multiple cervical branches supplying the face, neck, and scalp.',
    branches: [
      {
        name: 'Internal Carotid Artery (ICA)',
        description: 'Has NO branches in the neck (cervical segment C1). Dilated at its origin (carotid bulb / sinus containing baroreceptors).',
        clinicalSignificance: 'Primary source of stroke from plaque rupture/embolization. Absence of cervical branches confirms ICA identity during surgery.'
      },
      {
        name: 'Superior Thyroid Artery (1st branch of ECA)',
        description: 'Arises anteriorly from ECA near the bifurcation and descends toward the thyroid gland.',
        clinicalSignificance: 'Key surgical landmark; clamped or controlled during CEA.'
      },
      {
        name: 'Ascending Pharyngeal Artery',
        description: 'Arises from the deep medial surface of ECA.',
        clinicalSignificance: 'Collateral channel; can cause backbleeding if not occluded.'
      },
      {
        name: 'Lingual Artery',
        description: 'Arises anteriorly, passes deep to hyoglossus muscle.',
        clinicalSignificance: 'Facial and tongue perfusion.'
      },
      {
        name: 'Facial Artery',
        description: 'Curves over the submandibular gland and inferior border of mandible.',
        clinicalSignificance: 'Provides anastomosis with ophthalmic artery via angular branch.'
      },
      {
        name: 'Occipital Artery',
        description: 'Courses posteriorly, crossed by the Hypoglossal Nerve (CN XII).',
        clinicalSignificance: 'The sternocleidomastoid artery branch of the occipital artery anchors CN XII; dividing this branch allows cranial mobilization of CN XII for high exposures.'
      }
    ],
    relations: [
      'Carotid Sheath contents: Common Carotid Artery (medial), Internal Jugular Vein (lateral), Vagus Nerve (CN X, posterior within the groove between artery and vein).',
      'Anterior: Sternocleidomastoid muscle, superior belly of omohyoid, ansa cervicalis.',
      'Deep/Posterior: Sympathetic trunk, prevertebral fascia, transverse processes of cervical vertebrae.',
      'Carotid Sinus: Dilated base of ICA containing baroreceptors innervated by Hering\'s nerve (branch of CN IX).',
      'Carotid Body: Chemoreceptor in the bifurcation crutch responding to hypoxia and hypercapnia.'
    ],
    landmarks: [
      'Bifurcation Level: Upper border of thyroid cartilage / C3-C4 vertebral level (palpable carotid pulse)',
      'Anterior border of SCM: Surgical incision path',
      'Common Facial Vein: Crosses anterior to the bifurcation to join the IJV (crucial landmark to divide for carotid exposure)'
    ],
    surgicalExposure: {
      incision: 'Oblique incision along the anterior border of the sternocleidomastoid muscle from the mastoid tip to 2-3 cm above the sternal notch.',
      plane: 'Incise platysma, retract SCM laterally, identify and divide the Common Facial Vein (vein of Troy) crossing anterior to the carotid bifurcation.',
      structuresAtRisk: [
        'Hypoglossal Nerve (CN XII): Crosses ECA/ICA anteriorly ~2 cm above bifurcation. Injury leads to tongue deviation toward the side of injury and dysarthria.',
        'Vagus Nerve (CN X): Posterior in carotid sheath. Clamping causes hoarseness due to recurrent laryngeal nerve palsy.',
        'Marginal Mandibular branch of Facial Nerve (CN VII): Retraction near angle of mandible causes lower lip drooping.',
        'Superior Laryngeal Nerve (external branch): Runs medial to carotid bulb near superior thyroid artery; injury causes loss of high-pitched voice projection.'
      ],
      pearls: [
        'Infiltrate carotid sinus with 1% lidocaine if bradycardia occurs during bulb manipulation.',
        'Differentiate ICA from ECA: ICA is posterolateral and has NO cervical branches; ECA is anteromedial and has the Superior Thyroid Artery as its first branch.',
        'Divide the sternocleidomastoid branch of the occipital artery to mobilize CN XII superiorly when carotid disease extends high.'
      ]
    },
    commonPathology: [
      'Atherosclerotic Carotid Stenosis: Predominantly affects carotid bulb and proximal ICA due to low shear stress and flow separation. Risk of TIA and ischemic stroke.',
      'Carotid Artery Dissection: Often post-trauma or spontaneous; presents with Horner syndrome, neck pain, and cerebral ischemia.',
      'Carotid Body Tumor (Paraganglioma): Chemodectoma at the bifurcation splaying ICA and ECA (Lyre sign on angiography).'
    ],
    examHighlights: [
      'How do you definitively identify the ICA from the ECA during carotid endarterectomy? The ICA has NO branches in the neck, while the ECA immediately gives off branches (starting with Superior Thyroid).',
      'What nerve crosses the internal carotid artery approximately 2 cm above the bifurcation? The Hypoglossal Nerve (CN XII).',
      'Which nerve injury causes tongue deviation toward the operated side? Hypoglossal nerve injury (CN XII).'
    ],
    references: [
      "Rutherford's Vascular Surgery 10th Ed., Chapter 96: Carotid Endarterectomy",
      'ESVS 2023 Guidelines on the Management of Atherosclerotic Carotid and Vertebral Artery Disease'
    ]
  },
  {
    id: 'abdominal-aorta-iliac',
    nameEn: 'Abdominal Aorta & Iliac Arteries',
    nameAr: 'الشريان الأورطي البطني والشرايين الحرقفية',
    category: 'Aorta',
    diagramType: 'aorta',
    course: 'The Abdominal Aorta enters the abdomen through the aortic hiatus in the diaphragm at T12 vertebral level (anterior to T12 and slightly left of midline). It descends in the retroperitoneum anterior to the lumbar vertebrae and terminates at L4 (plane of the iliac crests) by bifurcating into the Right and Left Common Iliac Arteries. Each common iliac artery courses downward and laterally for ~5 cm, bifurcating at the pelvic brim (anterior to sacroiliac joint, L5-S1) into the Internal Iliac Artery (Hypogastric) and External Iliac Artery.',
    branches: [
      {
        name: 'Celiac Trunk (T12)',
        description: 'First major anterior branch giving Common Hepatic, Left Gastric, Splenic arteries.',
        clinicalSignificance: 'Supplies foregut; involved in Thoracoabdominal Aneurysm (TAAA) repair.'
      },
      {
        name: 'Superior Mesenteric Artery / SMA (L1)',
        description: 'Arises 1 cm below celiac trunk behind pancreas.',
        clinicalSignificance: 'Main midgut blood supply; vital to evaluate in acute mesenteric ischemia.'
      },
      {
        name: 'Renal Arteries (L1-L2)',
        description: 'Right renal passes posterior to IVC (longer); Left renal passes directly to left kidney.',
        clinicalSignificance: 'Infrarenal aortic clamp must be placed below renal artery origins.'
      },
      {
        name: 'Inferior Mesenteric Artery / IMA (L3)',
        description: 'Arises anteriorly 3-4 cm above aortic bifurcation.',
        clinicalSignificance: 'Supplies hindgut; re-implanted in open AAA repair if backbleeding is poor or arc of Riolan deficient to prevent fatal ischemic colitis.'
      },
      {
        name: 'Internal Iliac Artery (Hypogastric)',
        description: 'Branches into anterior and posterior pelvic divisions.',
        clinicalSignificance: 'Vital for pelvic perfusion, buttock claudication prevention, and spinal cord collateral flow (Adamkiewicz).'
      }
    ],
    relations: [
      'Left Renal Vein: Crosses anterior to the aorta immediately below the SMA origin (crucial surgical landmark for proximal infrarenal neck).',
      'Inferior Vena Cava (IVC): Lies to the right of the abdominal aorta and bifurcates at L5 behind the right common iliac artery.',
      'Duodenum (3rd/4th part): Crosses anterior to the infrarenal aorta; vulnerable to aorto-enteric fistula.',
      'Sympathetic Plexus & Nervi Erigentes: Crosses anterior to the aortic bifurcation and left iliac artery (preserve to prevent retrograde ejaculation in men).'
    ],
    landmarks: [
      'Aortic Hiatus: T12',
      'Renal Arteries: L1-L2 (approximately 1 vertebral body below SMA)',
      'Aortic Bifurcation: L4 (umbilicus level / imaginary line connecting highest points of iliac crests)',
      'Sacroiliac joint: Common iliac bifurcation into internal/external iliacs'
    ],
    surgicalExposure: {
      incision: 'Transperitoneal midline laparotomy (xiphoid to pubis) or Left Retroperitoneal flank incision (10th/11th intercostal space).',
      plane: 'Eviscerate small bowel to the right, incise posterior peritoneum over the aorta, divide ligament of Treitz, expose left renal vein superiorly.',
      structuresAtRisk: [
        'Left Renal Vein: Mobilize carefully; lumbar vein branches entering its posterior wall can avulse and bleed massively.',
        'Duodenum: Protect with moist packs to prevent serosal tearing.',
        'Left common iliac vein: Lies directly posterior/medial to right common iliac artery; high risk of laceration during iliac clamping.',
        'Autonomic nerve plexus: Dissect on the arterial wall to prevent autonomic injury.'
      ],
      pearls: [
        'Before applying aortic clamp: Check ACT (activated clotting time) >200-250s with systemic heparin.',
        'Release clamps sequentially: Internal iliac first (to wash out debris/emboli to pelvis rather than lower extremity), then external iliac.'
      ]
    },
    commonPathology: [
      'Abdominal Aortic Aneurysm (AAA): >90% infrarenal. Degenerative loss of elastin/collagen in media.',
      'Aortoiliac Occlusive Disease (Leriche Syndrome): Triad of bilateral buttock/thigh claudication, erectile dysfunction, and absent femoral pulses.',
      'Aortic Dissection (Type B): Tears distal to left subclavian extending into abdominal aorta.',
      'Aorto-enteric Fistula: Primary (rare) or Secondary (post-open/EVAR erosion into 3rd part of duodenum).'
    ],
    examHighlights: [
      'What anatomic structure crosses anterior to the abdominal aorta just below the origin of the superior mesenteric artery? The Left Renal Vein.',
      'What classic clinical triad characterizes Leriche syndrome? Bilateral buttock/thigh claudication, absent femoral pulses, and erectile dysfunction in men.',
      'Which iliac vein lies directly behind the right common iliac artery bifurcation and is prone to laceration? The Left Common Iliac Vein (also anatomical basis for May-Thurner syndrome).'
    ],
    references: [
      "Rutherford's Vascular Surgery 10th Ed., Chapter 78 & 79",
      'SVS Guidelines on the Management of Abdominal Aortic Aneurysm'
    ]
  },
  {
    id: 'venous-system',
    nameEn: 'Lower Extremity Venous System (Superficial, Deep & Perforators)',
    nameAr: 'المنظومة الوريدية للطرف السفلي (السطحية، العميقة، والمثقبة)',
    category: 'Venous',
    diagramType: 'venous',
    course: 'The lower limb venous system consists of three interconnected systems: Superficial veins (Great Saphenous Vein GSV and Small Saphenous Vein SSV), Deep veins (accompanying arteries in muscular compartments, transporting 90% of venous return), and Perforating veins (penetrating the deep muscular fascia to direct flow from superficial to deep). The GSV originates anterior to the medial malleolus, ascends along the medial calf and thigh within the saphenous compartment (between muscular fascia and saphenous fascia - the "Egyptian eye" on ultrasound), and terminates at the Saphenofemoral Junction (SFJ) in the Common Femoral Vein (CFV).',
    branches: [
      {
        name: 'Saphenofemoral Junction (SFJ) Tributaries',
        description: 'Superficial Epigastric, Superficial Circumflex Iliac, Superficial External Pudendal, and Anterior Accessory Saphenous Vein (AASV).',
        clinicalSignificance: 'All tributaries must be flush-ligated during high ligation & stripping to prevent recurrence of varicose veins.'
      },
      {
        name: 'Anterior Accessory Saphenous Vein (AASV)',
        description: 'Courses anteriorly in the thigh; has its own fascial compartment (alignment sign).',
        clinicalSignificance: 'Common culprit in recurrent varicosities after successful GSV ablation.'
      },
      {
        name: 'Small Saphenous Vein (SSV)',
        description: 'Originates posterior to the lateral malleolus, ascends in the midline of posterior calf, enters popliteal fossa to join popliteal vein at SPJ.',
        clinicalSignificance: 'Surat nerve closely accompanies SSV in the lower third; thermal ablation must stop 10 cm above ankle to prevent nerve injury.'
      },
      {
        name: 'Cockett (Posterior Tibial) Perforators',
        description: 'Connect posterior arch vein (Leonardo\'s vein) with posterior tibial veins in the lower medial calf.',
        clinicalSignificance: 'Classically incompetent in venous stasis ulceration (CEAP C5/C6).'
      }
    ],
    relations: [
      'Saphenous Nerve: Accompanies the GSV closely in the lower calf and ankle (risk of paresthesia/numbness if stripped below the knee).',
      'Sural Nerve: Accompanies the SSV in the posterior calf and behind lateral malleolus.',
      'Femoral Vein: Lies deep to the cribriform fascia; forms the SFJ with the GSV.'
    ],
    landmarks: [
      'Medial Malleolus: GSV consistently passes 1 cm anterior and superior (classic site for emergency surgical venous cutdown).',
      'Saphenous Opening (Fossa Ovalis): Oval aperture in fascia lata 3-4 cm below and lateral to pubic tubercle.',
      'Popliteal Crease: SPJ location (variable, 2-5 cm above joint line in 70%).'
    ],
    surgicalExposure: {
      incision: 'SFJ High Ligation: Transverse or oblique groin incision placed 1 cm below and parallel to the inguinal ligament crease medial to the CFA pulse.',
      plane: 'Incise skin and fat, identify GSV in its fascial sheath, trace proximally to SFJ, isolate all 5-6 tributaries.',
      structuresAtRisk: [
        'Common Femoral Vein: Mistaking CFV for GSV results in catastrophic CFV ligation or avulsion.',
        'CFA & Deep Femoral Artery: Just lateral to CFV.',
        'Saphenous nerve at ankle cutdown.'
      ],
      pearls: [
        'Flush ligation of GSV at CFV without narrowing the lumen of the CFV.',
        'Always verify with duplex ultrasound before surgery for anatomic variations like duplicated GSV.'
      ]
    },
    commonPathology: [
      'Chronic Venous Disease & Varicose Veins (CEAP C1-C6): Valvular reflux causing venous hypertension.',
      'Deep Vein Thrombosis (DVT): Virchow triad; risk of pulmonary embolism and post-thrombotic syndrome (PTS).',
      'May-Thurner Syndrome: Left common iliac vein compression by right common iliac artery against L5 spine leading to left leg DVT.',
      'Venous Stasis Ulcers: Typically located in the gaiter area (medial lower calf).'
    ],
    examHighlights: [
      'What nerve runs in close proximity to the Great Saphenous Vein in the lower calf and foot? The Saphenous Nerve.',
      'What ultrasound sign identifies the Great Saphenous Vein within its fascial envelope? The "Egyptian Eye" sign.',
      'Why is stripping of the GSV usually performed only to the knee level? To prevent injury to the saphenous nerve in the calf.'
    ],
    references: [
      "Rutherford's Vascular Surgery 10th Ed., Chapter 148: Surgical Anatomy of the Venous System",
      'ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease'
    ]
  },
  {
    id: 'dialysis-access-anatomy',
    nameEn: 'Hemodialysis Access Anatomy (Cimino-Brescia, Brachiocephalic, Transposition)',
    nameAr: 'تشريح وصلات الغسيل الكلوي (ناسورة سيمينو، العضدية الرأسية، والنقل البازيلي)',
    category: 'Dialysis Access',
    diagramType: 'fistula',
    course: 'Autogenous arteriovenous fistulas (AVF) are created in accordance with the "distal-to-proximal, non-dominant arm first" rule: 1) Radiocephalic AVF (Cimino-Brescia) at the wrist; 2) Brachiocephalic AVF at the elbow; 3) Brachiobasilic AVF with surgical superficialization/transposition; 4) Prosthetic Arteriovenous Graft (AVG). The Radial Artery at the wrist lies on the pronator quadratus and flexor pollicis longus. The Cephalic Vein lies superficially in the subcutaneous tissue of the radial wrist (anatomical snuffbox) and ascends along the lateral forearm.',
    branches: [
      {
        name: 'Radial Artery at Wrist',
        description: 'Runs between Brachioradialis tendon (lateral) and Flexor Carpi Radialis tendon (medial).',
        clinicalSignificance: 'Minimum diameter for successful AVF creation: >= 2.0 mm (ideally >= 2.5 mm).'
      },
      {
        name: 'Cephalic Vein at Wrist',
        description: 'Originates from dorsal venous arch of thumb/hand, passes over anatomical snuffbox.',
        clinicalSignificance: 'Minimum tourniquet-distended vein diameter: >= 2.5 mm without stenosis/occlusion.'
      },
      {
        name: 'Brachial Artery at Antecubital Fossa',
        description: 'Medial to biceps tendon, giving off radial and ulnar arteries near radial neck.',
        clinicalSignificance: 'Source artery for Brachiocephalic and Brachiobasilic AVFs. High flow risk for steal syndrome.'
      },
      {
        name: 'Basilic Vein at Medial Arm',
        description: 'Courses deep to deep fascia in the mid-arm, piercing to join brachial veins to form axillary vein.',
        clinicalSignificance: 'Lies deep, requires two-stage or one-stage transposition anteriorly to allow safe dialysis needle cannulation.'
      }
    ],
    relations: [
      'Allen Test / Duplex Palmar Arch: Evaluates patency of Ulnar artery and deep palmar arch before using Radial artery.',
      'Median Nerve: Lies medial to brachial artery in antecubital fossa.',
      'Medial Antebrachial Cutaneous Nerve (MACN): Accompanies the basilic vein in the arm (injury causes medial arm paresthesia).',
      'Lateral Antebrachial Cutaneous Nerve (LACN): Accompanies the cephalic vein at the elbow.'
    ],
    landmarks: [
      'Radial pulse between FCR and Brachioradialis tendons',
      'Bicipital Aponeurosis (Lacertus Fibrosus): Covers brachial artery and median nerve at elbow',
      'Cephalic vein cross-over at wrist'
    ],
    surgicalExposure: {
      incision: 'Radiocephalic AVF: Longitudinal or curved lazy-S incision at the radial aspect of the wrist 2 cm proximal to the radial styloid.',
      plane: 'Dissect Cephalic Vein, mobilize 3-4 cm, divide distal branches. Incise fascia over radial artery, mobilize 2 cm, control with microvascular vessel loops.',
      structuresAtRisk: [
        'Superficial branch of Radial Nerve (courses under brachioradialis; injury causes painful neuroma over dorsum of thumb/index finger).',
        'MACN during Basilic vein harvest.',
        'Median nerve during brachial artery dissection.'
      ],
      pearls: [
        'Anastomosis technique: End-to-side (vein end to artery side) is gold standard to prevent venous hypertension of hand.',
        'Rule of 6s for AVF Maturation at 6 weeks: Flow >= 600 mL/min, Diameter >= 6 mm, Depth <= 6 mm from skin surface, cannulation length >= 6 cm.'
      ]
    },
    commonPathology: [
      'Dialysis-Associated Steal Syndrome (DASS): Ischemia of the hand due to reversed flow in distal artery into low-resistance fistula. Graded from mild coldness to gangrene. Treated with PANDORRA, DRIL (Distal Revascularization Interval Ligation), or banding.',
      'Juxta-anastomotic Stenosis: Most common cause of non-maturation (intimal hyperplasia within 2 cm of anastomosis).',
      'Central Venous Stenosis: Caused by prior subclavian/jugular dialysis catheters. Leads to massive arm edema.'
    ],
    examHighlights: [
      'What is the Rule of 6s for hemodialysis fistula maturation? Blood flow >= 600 mL/min, vessel diameter >= 6 mm, depth <= 6 mm from skin, length >= 6 cm at 6 weeks.',
      'What nerve is at risk of neuroma formation during wrist radiocephalic AVF surgery? Superficial branch of the Radial Nerve.',
      'What procedure is the surgical gold standard for severe Dialysis-Associated Steal Syndrome? DRIL procedure (Distal Revascularization Interval Ligation).'
    ],
    references: [
      "Rutherford's Vascular Surgery 10th Ed., Chapter 84: Hemodialysis Access",
      'KDOQI Clinical Practice Guideline for Vascular Access: 2019 Update'
    ]
  }
];
