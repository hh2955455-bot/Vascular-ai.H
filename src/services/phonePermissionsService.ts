// Phone Permissions & Reading Topics Notification Service

export interface ReadingTopic {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  guidelineSource: string;
  category: 'Arterial' | 'Venous' | 'Aortic' | 'Carotid' | 'Lymphatic' | 'Access';
}

export const CURATED_READING_TOPICS: ReadingTopic[] = [
  {
    id: 'topic-aaa-guidelines',
    titleAr: 'تمدد الشريان الأورطي البطني (AAA) - إرشادات ESVS 2024',
    titleEn: 'Abdominal Aortic Aneurysm (AAA) - ESVS 2024 Guidelines',
    summaryAr: 'مؤشرات التدخل الجراحي: القطر ≥ 5.5 سم للرجال و ≥ 5.0 سم للنساء أو نمو سريع > 1 سم/سنة. معايير اختيار EVAR مقابل الفتح الجراحي المفتوح.',
    summaryEn: 'Surgical threshold: ≥5.5 cm in men, ≥5.0 cm in women, or rapid expansion >1 cm/year. Anatomical suitability for EVAR vs open repair.',
    guidelineSource: 'ESVS 2024 AAA Guidelines',
    category: 'Aortic'
  },
  {
    id: 'topic-ali-rutherford',
    titleAr: 'إقفار الأطراف الحاد (ALI) وتصنيف رذرفورد العاجل',
    titleEn: 'Acute Limb Ischemia (ALI) & Rutherford Emergency Classification',
    summaryAr: 'التمييز السريري الحاسم لدرجة IIb (وجود ضعف حركي وسقوط القدم) التي تستوجب التدخل الجراحي الفوري دون تأخير للأشعة، مع إعطاء الهيبارين الوريدي الفوري.',
    summaryEn: 'Critical triage: Class IIb (motor deficit) requires immediate revascularization without waiting for CTA. Bolus IV heparin 80 U/kg immediately.',
    guidelineSource: 'Rutherford 10th Ed. & SVS Guidelines',
    category: 'Arterial'
  },
  {
    id: 'topic-carotid-stenosis',
    titleAr: 'تضيق الشريان السباتي: استئصال البطانة (CEA) مقابل القسطرة (CAS)',
    titleEn: 'Carotid Stenosis: Endarterectomy (CEA) vs Stenting (CAS)',
    summaryAr: 'مقارنة تجارب ACST-2 و CREST. استئصال البطانة هو الخيار الذهبي للمرضى فوق 70 عاماً أو ذوي اللويحات المعقدة مع مراقبة shunt والحفاظ على العصب تحت اللسان.',
    summaryEn: 'Evidence from ACST-2 and CREST: CEA preferred in patients >70y with calcified tortuous arches; CAS in hostile neck or radiation arteritis.',
    guidelineSource: 'ESVS 2023 Carotid Guidelines',
    category: 'Carotid'
  },
  {
    id: 'topic-dvt-pe-protocol',
    titleAr: 'تخثر الأوردة العميقة والأورام الخثرية الحوضية (Iliofemoral DVT)',
    titleEn: 'Iliofemoral DVT: Catheter-Directed Thrombolysis & Stenting',
    summaryAr: 'متلازمة May-Thurner: انضغاط الوريد الحرقفي الأيسر بالشريان الحرقفي الأيمن، بروتوكولات إذابة الخثرة بالقسطرة الموجهة (CDT) لتجنب متلازمة ما بعد التخثر.',
    summaryEn: 'May-Thurner syndrome: compression of left common iliac vein by right common iliac artery. Catheter-directed thrombolysis (CDT) indications.',
    guidelineSource: 'American Venous Forum & ESVS Guidelines',
    category: 'Venous'
  },
  {
    id: 'topic-tos-vascular',
    titleAr: 'متلازمة مخرج الصدر الوعائية (Thoracic Outlet Syndrome)',
    titleEn: 'Vascular Thoracic Outlet Syndrome & Paget-Schroetter Disease',
    summaryAr: 'تخثر الوريد الإبطي تحت الترقوة الإجهادي، الفحص بالرنين المغناطيسي، واستئصال الضلع الأول عبر الإبط أو فوق الترقوة لتخفيف الضغط الوعائي العصبي.',
    summaryEn: 'Effort thrombosis of the axillary-subclavian vein, catheter-directed lysis followed by first rib resection to decompress thoracic outlet.',
    guidelineSource: 'Society for Vascular Surgery (SVS) Guidelines',
    category: 'Venous'
  },
  {
    id: 'topic-diabetic-foot-wifi',
    titleAr: 'القدم السكرية ونظام WIfI لتصنيف خطورة بتر الأطراف',
    titleEn: 'Diabetic Foot & SVS WIfI Classification for Amputation Risk',
    summaryAr: 'تقييم الجرح (Wound)، الإقفار الشرياني (Ischemia via ABI/TP)، والعدوى (foot Infection). مفهوم Angiosome لتوجيه إعادة التروية الشريانية الدقيقة.',
    summaryEn: 'Scoring Wound, Ischemia, and foot Infection to predict 1-year amputation risk and benefit of revascularization following angiosome territories.',
    guidelineSource: 'SVS & Global Vascular Guidelines (GVG 2023)',
    category: 'Arterial'
  },
  {
    id: 'topic-type-b-dissection',
    titleAr: 'تشريح الأورطي الصدري النازل من النوع B (Type B Dissection)',
    titleEn: 'Type B Aortic Dissection: Complicated vs Uncomplicated',
    summaryAr: 'مؤشرات TEVAR العاجل: تمزق، ألم مستمر، سوء تروية حشوية أو طرفية، أو ارتفاع ضغط غير مسيطر عليه. دور الدعامة في غلق فجوة الدخول وتوسيع القناة الحقيقية.',
    summaryEn: 'Management algorithm: TEVAR for complicated cases (rupture, visceral malperfusion, refractory pain/HTN). Medical management with anti-impulse therapy.',
    guidelineSource: 'STS/AATS & ESVS Aortic Guidelines',
    category: 'Aortic'
  },
  {
    id: 'topic-ceap-venous',
    titleAr: 'تصنيف CEAP للقصور الوريدي المزمن والعلاج داخل الوريد (EVLA)',
    titleEn: 'CEAP Classification for Chronic Venous Disease & Endovenous Ablation',
    summaryAr: 'التدرج من C1 (الشعيرات العنكبوتية) إلى C6 (القرحة الوريدية النشطة). معايير استئصال الوريد الصافن بالليزر أو التردد الحراري (RFA) ومضادات التخثر.',
    summaryEn: 'Clinical class C0 to C6 (active venous ulcer). Saphenous vein thermal ablation (EVLA/RFA) techniques and compression therapy principles.',
    guidelineSource: 'ESVS 2022 Chronic Venous Disease Guidelines',
    category: 'Venous'
  }
];

// Play pleasant web-audio chime for notifications (works 100% reliably in all browsers)
export function playNotificationTone(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.35);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.5);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export interface PermissionDetails {
  notifications: 'granted' | 'denied' | 'default' | 'unsupported';
  microphone: 'granted' | 'denied' | 'prompt' | 'unsupported';
  storagePersist: boolean | 'unsupported';
  vibrationSupported: boolean;
}

export async function checkAllPermissions(): Promise<PermissionDetails> {
  const details: PermissionDetails = {
    notifications: 'unsupported',
    microphone: 'unsupported',
    storagePersist: 'unsupported',
    vibrationSupported: typeof navigator !== 'undefined' && 'vibrate' in navigator
  };

  // 1. Notifications
  if (typeof window !== 'undefined' && 'Notification' in window) {
    details.notifications = Notification.permission;
  }

  // 2. Microphone
  if (typeof navigator !== 'undefined' && typeof navigator.permissions?.query === 'function') {
    try {
      // TypeScript lib doesn't always include 'microphone' as standard PermissionName in older typings
      const micStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      details.microphone = micStatus.state as 'granted' | 'denied' | 'prompt';
    } catch {
      details.microphone = 'prompt';
    }
  } else if (typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function') {
    details.microphone = 'prompt';
  }

  // 3. Persistent Storage
  if (typeof navigator !== 'undefined' && typeof navigator.storage?.persisted === 'function') {
    try {
      details.storagePersist = await navigator.storage.persisted();
    } catch {
      details.storagePersist = false;
    }
  }

  return details;
}

/**
 * Requests all available phone permissions:
 * - Notification permission for new reading topics
 * - Storage persist to keep medical textbooks offline
 * - Microphone access for AI Voice discussion
 */
export async function requestAllPhonePermissions(): Promise<{
  notificationGranted: boolean;
  storageGranted: boolean;
  micGranted: boolean;
}> {
  let notificationGranted = false;
  let storageGranted = false;
  let micGranted = false;

  // 1. Request Notification Permission
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const result = await Notification.requestPermission();
      notificationGranted = result === 'granted';
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  }

  // 2. Request Storage Persistence
  if (typeof navigator !== 'undefined' && typeof navigator.storage?.persist === 'function') {
    try {
      storageGranted = await navigator.storage.persist();
    } catch (err) {
      console.warn('Storage persistence error:', err);
    }
  }

  // 3. Request Microphone Permission (quick probe and stop tracks immediately)
  if (typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micGranted = true;
      // Immediately stop all tracks so the mic is not kept recording
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn('Microphone permission optional or denied:', err);
    }
  }

  // Device vibration feedback
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate([80, 40, 80]);
    } catch {
      // Safe ignore
    }
  }

  // Record that user accepted permissions in localStorage
  try {
    localStorage.setItem('phone_permissions_granted', 'true');
    localStorage.setItem('phone_notifications_enabled', notificationGranted ? 'true' : 'false');
  } catch {
    // Ignore
  }

  // If notification granted, immediately deliver the welcome reading topic notification!
  if (notificationGranted) {
    sendReadingTopicNotification(
      '📚 تم تفعيل إشعارات الهاتف بنجاح!',
      'ستصلك تنبيهات بأحدث مواضيع القراءة الطبية وجراحة الأوعية الدموية يومياً وفق إرشادات ESVS و Rutherford.'
    );
  }

  return { notificationGranted, storageGranted, micGranted };
}

/**
 * Sends a native phone notification for a new reading topic
 */
export function sendReadingTopicNotification(
  customTitle?: string,
  customBody?: string,
  topic?: ReadingTopic
): boolean {
  // Play soft chime
  playNotificationTone();

  // Vibrate phone
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate([100, 50, 100]);
    } catch {
      // Ignore
    }
  }

  const selectedTopic = topic || CURATED_READING_TOPICS[Math.floor(Math.random() * CURATED_READING_TOPICS.length)];
  const title = customTitle || `📖 موضوع جديد للقراءة: ${selectedTopic.titleAr}`;
  const body = customBody || `${selectedTopic.summaryAr}\n(${selectedTopic.guidelineSource})`;

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'vascular-reading-topic',
        badge: '/favicon.ico',
        lang: 'ar'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return true;
    } catch (e) {
      console.warn('Could not fire browser Notification:', e);
      return false;
    }
  }

  return false;
}
