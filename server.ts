import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI:', err);
    }
  }
  return aiClient;
}

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Analyze guest using Gemini 3.8 Flash
app.post('/api/analyze-guest', async (req, res) => {
  const { guestData, existingGuestsCount, eventContext, duplicatesDetected } = req.body;

  if (!guestData || !guestData.name) {
    return res.status(400).json({ error: 'Missing guest data' });
  }

  const ai = getGenAI();
  if (!ai) {
    // Return flag indicating client should use built-in engine
    return res.status(503).json({ error: 'GEMINI_API_KEY not configured, fallback to client analyzer' });
  }

  try {
    const prompt = `
你是一位專業的「活動優化師」(Event Guest Intelligence Specialist)。
你的核心任務是協助品牌與活動主辦方，從報名來賓的公開資料、活動目的、專業背景、過往參與紀錄，建立專業、客觀且具建設性的來賓管理與價值洞察機制。

【重要倫理原則】
1. 嚴禁使用性別、年齡、種族、宗教、外貌、身心狀況或人格好壞等歧視性或敏感個資做為評判標準。
2. 這不是判斷一個人「好或壞」，而是客觀評估：
   - 是否符合活動目的與目標定位
   - 是否可能與活動主題產生正向連結與互補價值
   - 是否存在重複報名、資格不符或需要人工確認的項目
   - 是否可能對其他參與者體驗或品牌現場秩序造成需要留意的風險（例如未經許可的單向強迫推銷、競業索取通訊名單等）
   - 哪些情況應交給主辦方人工進一步觀察，而不是由 AI 任意裁決。

【活動情境】
活動名稱：${eventContext?.name || '企業高階峰會'}
活動主軸：${eventContext?.theme || '產業趨勢與商業合作'}
目標受眾：${eventContext?.targetAudience || '企業決策主管與專業人士'}
活動目標：${eventContext?.objective || '促進實質商務與專業知識共享'}

【來賓報名資料】
姓名／暱稱：${guestData.name}
公司／機構：${guestData.company || '未填寫'}
職稱／職業：${guestData.profession || '未填寫'}
產業別：${guestData.industry || '未填寫'}
專業背景：${guestData.professionalBackground || '未填寫'}
參加活動目的：${guestData.attendancePurpose || '未填寫'}
過往參與紀錄：${guestData.pastAttendanceHistory || '初次參加'}
曾與品牌互動：${guestData.hasBrandInteraction ? '是' : '否'}${guestData.brandInteractionDetails ? ` (詳情: ${guestData.brandInteractionDetails})` : ''}
來賓身分別：${guestData.guestType} (general/vip/partner/media)
備註說明：${guestData.notes || '無'}
同名或同單位重複報名提醒：${duplicatesDetected ? '系統偵測到可能之重複報名或同單位多次填寫' : '無重複登記'}

請以 JSON 格式輸出嚴謹分析結果，格式必須如下（不得輸出其他文字，直接為 valid JSON）：
{
  "category": "高度契合" | "值得觀察" | "需要確認" | "不符合本次活動條件",
  "fitScore": number (0-100),
  "fitAssessment": "簡潔明瞭的活動契合度分析（約 60-120 字）",
  "brandSynergyPotential": "極高合作價值" | "潛在商務機會" | "具社群傳播力" | "中等交流價值" | "需進一步探索" | "無明顯互補效益",
  "brandSynergyDetails": "品牌合作潛力深入說明（約 60-100 字）",
  "humanVerificationItems": [
    "需要主辦方人工確認的具體事項1（若無可為空陣列）"
  ],
  "recommendedObservations": [
    "現場或會前建議觀察重點與互動建議1",
    "現場或會前建議觀察重點與互動建議2"
  ],
  "anomalyAlerts": [
    "重複報名、異常意圖或資料缺漏提示（若無可為空陣列）"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({
      ...parsed,
      analyzedAt: new Date().toISOString(),
      isAiGenerated: true,
    });
  } catch (err: any) {
    console.error('Gemini API call failed:', err);
    return res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Event Guest Intelligence Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
