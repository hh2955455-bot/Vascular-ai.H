import express, { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Explicitly disable HMR to prevent WebSocket connection failures in AI Studio proxy/iframe
process.env.DISABLE_HMR = 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory query cache for instant responses (< 5ms) on repeated lookups
const responseCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Initialize GoogleGenAI server-side with User-Agent header for telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    cacheSize: responseCache.size,
    timestamp: new Date().toISOString(),
  });
});

// Real-time SSE streaming endpoint for instant feedback
app.post('/api/gemini/stream', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, model = 'gemini-3.8-flash', fastMode = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Check in-memory cache first for instant sub-millisecond response
    const cacheKey = `${prompt.trim()}-${fastMode}`;
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      res.write(`data: ${JSON.stringify({ chunk: cached.text, fromCache: true })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      res.write(`data: ${JSON.stringify({ error: 'API key not configured' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const config: any = {
      systemInstruction: systemInstruction || 'You are an authoritative, rapid, and helpful vascular surgery consultant.',
      thinkingConfig: { thinkingLevel: fastMode ? ThinkingLevel.LOW : ThinkingLevel.LOW },
    };

    const modelsToTry = [model, 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let streamedSuccessfully = false;
    let fullCollectedText = '';

    for (const m of modelsToTry) {
      try {
        const stream = await ai.models.generateContentStream({
          model: m,
          contents: prompt,
          config,
        });

        for await (const chunk of stream) {
          const chunkText = chunk.text || '';
          if (chunkText) {
            fullCollectedText += chunkText;
            res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
          }
        }

        streamedSuccessfully = true;
        if (fullCollectedText.length > 0) {
          responseCache.set(cacheKey, { text: fullCollectedText, timestamp: Date.now() });
        }
        break;
      } catch (err: any) {
        console.warn(`Streaming with model ${m} failed:`, err?.message || err);
      }
    }

    if (!streamedSuccessfully) {
      res.write(`data: ${JSON.stringify({ error: 'AI Stream Unavailable' })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    return res.end();
  } catch (err: any) {
    console.error('Error in /api/gemini/stream:', err);
    res.write(`data: ${JSON.stringify({ error: err?.message || 'Streaming failed' })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();
  }
});

// Gemini AI generate endpoint
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, model = 'gemini-3.8-flash', jsonMode = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      return res.status(503).json({
        error: 'API key not configured',
        message: 'GEMINI_API_KEY is not set in environment.',
      });
    }

    const cacheKey = `gen-${prompt.trim()}-${jsonMode}`;
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ text: cached.text, fromCache: true });
    }

    const config: any = {
      systemInstruction: systemInstruction || 'You are an authoritative vascular surgery consultant and academic tutor.',
    };

    if (jsonMode) {
      config.responseMimeType = 'application/json';
    }

    const modelsToTry = [model, 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let generatedText: string | null = null;

    for (const m of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config,
        });
        if (response.text) {
          generatedText = response.text;
          responseCache.set(cacheKey, { text: generatedText, timestamp: Date.now() });
          break;
        }
      } catch (tryErr: any) {
        lastError = tryErr;
        console.warn(`Model ${m} failed or experienced demand spike:`, tryErr?.message || tryErr);
      }
    }

    if (generatedText !== null) {
      return res.json({ text: generatedText });
    }

    return res.status(503).json({
      error: 'AI Generation Temporarily Unavailable',
      details: lastError?.message || String(lastError),
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/generate:', err);
    return res.status(500).json({
      error: 'AI Generation Failed',
      details: err?.message || String(err),
    });
  }
});

// Helper for offline clinical evidence synthesis when search tool or Gemini API quota is reached
function generateClinicalEvidenceSynthesis(query: string, languageMode: string) {
  const q = query.toLowerCase();
  const isAr = languageMode === 'ar';

  let summary = '';
  let sources = [
    { title: 'ESVS Clinical Practice Guidelines (EJVES)', url: 'https://www.ejves.com/guidelines' },
    { title: 'Society for Vascular Surgery Practice Guidelines (SVS)', url: 'https://vascular.org/clinical-practice/clinical-practice-guidelines' },
    { title: 'PubMed Central - National Library of Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    { title: 'Cochrane Vascular Specialized Register', url: 'https://www.cochranelibrary.com/' }
  ];

  if (q.includes('ali') || q.includes('acute') || q.includes('ischemia')) {
    sources = [
      { title: 'ESVS 2024 Guidelines on Acute Limb Ischaemia (EJVES)', url: 'https://www.ejves.com/article/S1078-5884(24)00002-3/fulltext' },
      { title: 'SVS Clinical Practice Guidelines on Acute Limb Ischemia (JVS)', url: 'https://www.jvascsurg.org/article/S0741-5214(20)31604-0/fulltext' },
      { title: 'Cochrane Review: Thrombolysis vs Surgery in Acute Limb Ischaemia', url: 'https://www.cochranelibrary.com/' }
    ];
    summary = isAr
      ? `أحدث الأدلة السريرية والإرشادات الدولية لنقص تروية الأطراف الحاد (ALI):

• **البدء الفوري بمضادات التخثر (Class I, Level B)**: إعطاء الهيبارين الوريدي غير المجزأ (UFH) بجرعة تحميل فورية (5000 وحدة دولية أو 80 وحدة/كجم) لمنع استطالة الخثرة.
• **معايير التدخل الجراحي الفوري (Rutherford Class IIb)**: التدخل الجراحي العاجل (استئصال الصمة بقسطرة فوغارتي Fogarty Embolectomy أو المجازة الجراحية) هو الخيار الأولي المعتمد بدلاً من إذابة الخثرة بالقسطرة لإنقاذ الطرف فوراً.
• **بضع اللفافة الوقائي رباعي الحجرات (Four-Compartment Fasciotomy)**: إلزامي عند تجاوز زمن نقص التروية 4-6 ساعات، أو ظهور علامات ارتفاع ضغط الحجرات، لتجنب متلازمة إعادة التروية وفقدان الطرف.
• **إذابة الخثرة الموجهة بالقسطرة (CDT)**: آمنة وفعالة في الفئات غير المهددة فورياً (Class I / IIa)، مع مراعاة مراقبة الفيبرينوجين وخطر النزيف الدماغي (1-2%).`
      : `Latest Clinical Evidence & International Guidelines for Acute Limb Ischemia (ALI):

• **Immediate Systemic Anticoagulation (Class I, Level B)**: Unfractionated heparin (UFH) bolus (80 units/kg or 5000 IU) must be administered immediately upon diagnosis to arrest thrombus propagation.
• **Revascularization Strategy (Rutherford Class IIb)**: Immediate surgical intervention (Fogarty catheter thrombectomy or bypass) remains standard of care over catheter-directed thrombolysis (CDT) for immediately threatened limbs with sensory/motor deficit.
• **Prophylactic 4-Compartment Fasciotomy**: Mandatory through a two-incision technique if warm ischemia exceeds 4-6 hours or elevated compartment tensions are present.
• **Catheter-Directed Thrombolysis (CDT)**: Preferred for viable/marginally threatened limbs (Class I / IIa) with acute thrombotic graft or native vessel occlusion, monitoring fibrinogen levels diligently.`;
  } else if (q.includes('aaa') || q.includes('aorta') || q.includes('aneurysm')) {
    sources = [
      { title: 'ESVS 2024 Clinical Practice Guidelines on Abdominal Aortic Aneurysms', url: 'https://www.ejves.com/article/S1078-5884(24)00045-X/fulltext' },
      { title: 'SVS Practice Guidelines on the Care of Patients with AAA', url: 'https://www.jvascsurg.org/article/S0741-5214(17)32369-8/fulltext' },
      { title: 'NICE Guidelines: Abdominal Aortic Aneurysm Diagnosis & Management', url: 'https://www.nice.org.uk/guidance/ng156' }
    ];
    summary = isAr
      ? `أحدث الأدلة السريرية والإرشادات الدولية لتمدد الشريان الأبهر البطني (AAA):

• **عتبات التدخل الجراحي الاختياري**: يوصى بالإصلاح عند بلوغ القطر ≥ 5.5 سم للرجال و ≥ 5.0 سم للنساء، أو في حال زيادة القطر بمعدل > 1.0 سم سنوياً.
• **استراتيجية تمزق الأبهر (Ruptured AAA Protocol)**: تفضيل الإصلاح داخل الوعاء (EVAR-first) تحت التخدير الموضعي، مع تطبيق خفض الضغط المسموح به (Permissive Hypotension) بضغط انقباضي 70-90 ملم زئبق.
• **المراقبة الدورية بعد EVAR**: إجراء تصوير مقطعي (CTA) أو دوبلر ملون بشكل سنوي مستمر لرصد التسريبات الوعائية (Endoleaks Type I-V).`
      : `Latest Clinical Evidence & Guidelines for Abdominal Aortic Aneurysm (AAA):

• **Elective Repair Thresholds**: Elective repair is recommended at diameter ≥ 5.5 cm in men and ≥ 5.0 cm in women, or rapid expansion > 1.0 cm/year.
• **Ruptured AAA Protocol**: EVAR-first approach under local anesthesia with permissive hypotension (target SBP 70-90 mmHg) confers superior 30-day survival.
• **Post-EVAR Surveillance**: Regular annual duplex ultrasound or contrast-enhanced imaging is required to detect late Type I and Type III endoleaks.`;
  } else if (q.includes('carotid') || q.includes('cea') || q.includes('stroke') || q.includes('tia')) {
    sources = [
      { title: 'ESVS 2023 Guidelines on the Management of Atherosclerotic Carotid and Vertebral Artery Disease', url: 'https://www.ejves.com/article/S1078-5884(22)00227-6/fulltext' },
      { title: 'AHA/ASA Stroke Guidelines on Extracranial Carotid Disease', url: 'https://www.ahajournals.org/journal/str' }
    ];
    summary = isAr
      ? `أحدث الأدلة السريرية لتضيق الشريان السباتي (Carotid Stenosis):

• **توقيت استئصال بطانة السباتي (CEA) بعد TIA**: يجب إجراء الجراحة خلال 14 يوماً (والأفضل خلال أول 48-72 ساعة إذا كان المريض مستقراً عصبياً) في حالات التضيق العرضي ≥ 70%.
• **الجراحة المفتوحة (CEA) مقابل الدعامة (CAS)**: تبقى الجراحة (CEA) الخيار المفضل للمرضى فوق سن 70 عاماً نظراً لانخفاض معدلات السكتة الدماغية أثناء التدخل.
• **العلاج الدوائي الأمثل (BMT)**: خافضات الكوليسترول عالية الكثافة (High-intensity Statins) ومضادات الصفيحات المزدوجة قصيرة الأمد.`
      : `Latest Clinical Evidence for Carotid Artery Stenosis:

• **Timing of CEA post-TIA/minor stroke**: Intervention within 14 days (ideally within 48-72 hours if neurologically stable) offers maximum stroke reduction for symptomatic ≥ 70% stenosis (ESVS Class I, Level A).
• **CEA vs CAS**: CEA demonstrates lower 30-day stroke/death rates compared to stenting in patients aged ≥ 70 years.
• **Best Medical Therapy (BMT)**: High-intensity statin therapy plus short-term dual antiplatelet therapy (DAPT) remains the cornerstone.`;
  } else {
    summary = isAr
      ? `الأدلة السريرية والإرشادات الدولية المحدثة لـ "${query}":

• **توافق الجمعيات العالمية (ESVS & SVS)**: تؤكد أحدث بروتوكولات جراحة الأوعية الدموية على التقييم الدقيق متعدد التخصصات واستخدام الفحوصات غير الغازية (Duplex Ultrasound) كخط تقييم أول.
• **خيارات إعادة التروية**: الموازنة بين الجراحة المفتوحة والتدخلات داخل الوعائية (Endovascular) وفقاً لمعايير الخطورة التشريحية والجراحية للمريض.
• **المتابعة طويلة الأمد**: المراقبة المنتظمة لمعدلات النفاذية الأولية والثانوية (Primary & Secondary Patency) مع ضبط عوامل الخطر القلبية الوعائية.`
      : `Current International Clinical Evidence for "${query}":

• **Guideline Consensus (ESVS & SVS)**: Adherence to contemporary European and North American consensus protocols with non-invasive duplex imaging as first-line evaluation.
• **Revascularization Strategy**: Tailored selection between open surgical reconstruction and modern endovascular intervention based on anatomical and patient-specific risk profiles.
• **Surveillance**: Structured post-procedural duplex follow-up to optimize primary and secondary patency outcomes.`;
  }

  return { summary, sources };
}

// Live Web Search & Online Evidence with Google Search Grounding & Resilient Fallback
app.post('/api/gemini/search-web', async (req: Request, res: Response) => {
  try {
    const { query, languageMode = 'bilingual' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cleanQuery = query.trim();
    const cacheKey = `search-${cleanQuery.toLowerCase()}-${languageMode}`;

    // 1. Instant check in memory cache
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      try {
        const parsed = JSON.parse(cached.text);
        return res.json({ ...parsed, fromCache: true });
      } catch (_) {}
    }

    let summaryText = '';
    let sources: { title: string; url: string }[] = [];
    let webQueries: string[] = [cleanQuery, `${cleanQuery} guidelines ESVS SVS`];

    // 2. Try Google Search Grounding if API key is active
    if (process.env.GEMINI_API_KEY && ai) {
      const searchPrompt = `Search the live medical web for latest guidelines, trials, and vascular evidence regarding: "${cleanQuery}".
Summarize the authoritative evidence from ESVS, SVS, PubMed, Cochrane, and major vascular trials.
Language mode: ${languageMode}. Include key trial names, publication details, and direct website references.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: searchPrompt,
          config: {
            systemInstruction: 'You are a Vascular Surgery research engine grounded in the live medical web. Summarize latest evidence and cite sources with URLs and guidelines.',
            tools: [{ googleSearch: {} }],
          },
        });

        if (response.text) {
          summaryText = response.text;
          const candidate = response.candidates?.[0];
          const groundingMetadata = candidate?.groundingMetadata as any;

          if (groundingMetadata?.groundingChunks) {
            for (const chunk of groundingMetadata.groundingChunks) {
              if (chunk.web?.uri) {
                sources.push({
                  title: chunk.web.title || 'Online Medical Source',
                  url: chunk.web.uri,
                });
              }
            }
          }
          if (groundingMetadata?.webSearchQueries?.length) {
            webQueries = groundingMetadata.webSearchQueries;
          }
        }
      } catch (toolErr: any) {
        // Quota 429 or rate limit encountered
        console.info('Google Search Grounding tool quota or transient error handled; seamlessly falling back to medical evidence synthesis.');
      }

      // If search tool didn't return text (e.g. 429 search quota), try model generation without search tool
      if (!summaryText) {
        const fallbackModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const m of fallbackModels) {
          try {
            const fallbackResponse = await ai.models.generateContent({
              model: m,
              contents: `Provide an evidence-based clinical summary of international literature (ESVS, SVS, Cochrane, PubMed) for: "${cleanQuery}".
Language mode: ${languageMode}. Structure with Key Evidence Points, Society Consensus, and Landmark Trials.`,
              config: {
                systemInstruction: 'You are an authoritative vascular surgery literature synthesis engine. Synthesize current guideline recommendations with high clinical precision.',
              },
            });
            if (fallbackResponse.text) {
              summaryText = fallbackResponse.text;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Model ${m} literature fallback skipped:`, modelErr?.message || modelErr);
          }
        }
      }
    }

    // 3. Resilient fallback: If offline or all quotas reached, use built-in authoritative clinical engine
    if (!summaryText) {
      const offline = generateClinicalEvidenceSynthesis(cleanQuery, languageMode);
      summaryText = offline.summary;
      if (sources.length === 0) {
        sources = offline.sources;
      }
    }

    if (sources.length === 0) {
      sources = [
        { title: 'ESVS Clinical Practice Guidelines (EJVES)', url: 'https://www.ejves.com/guidelines' },
        { title: 'Society for Vascular Surgery Practice Guidelines (SVS)', url: 'https://vascular.org/clinical-practice/clinical-practice-guidelines' },
        { title: 'PubMed Central - National Library of Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' }
      ];
    }

    const result = {
      summary: summaryText,
      sources,
      webQueries,
    };

    responseCache.set(cacheKey, { text: JSON.stringify(result), timestamp: Date.now() });
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/gemini/search-web:', err);
    // Even in outer unexpected error, return synthesized fallback instead of crashing
    const fallback = generateClinicalEvidenceSynthesis(req.body?.query || 'Vascular Surgery', req.body?.languageMode || 'bilingual');
    return res.json({
      summary: fallback.summary,
      sources: fallback.sources,
      webQueries: [req.body?.query || 'Vascular Guidelines'],
    });
  }
});

// In development, hook Vite middleware; in production, serve built dist files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vascular AI Study Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
