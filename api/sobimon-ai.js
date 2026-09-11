const DEFAULT_MODEL = 'gemini-3.8-flash';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const clampNumber = (value, min = 0, max = 100000000000) => {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return 0;
  return Math.min(max, Math.max(min, number));
};

function sanitizeSummary(input = {}) {
  return {
    total: clampNumber(input.total),
    monthlyBudget: clampNumber(input.monthlyBudget),
    remaining: clampNumber(input.remaining),
    budgetRate: clampNumber(input.budgetRate, 0, 999),
    topCategory: String(input.topCategory || '생활비').slice(0, 40),
    topCategoryAmount: clampNumber(input.topCategoryAmount),
    topCategoryRate: clampNumber(input.topCategoryRate, 0, 100),
    transactionCount: clampNumber(input.transactionCount, 0, 100000)
  };
}

function stripJsonFence(text = '') {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function normalizeInsight(data = {}) {
  return {
    headline: String(data.headline || '').slice(0, 36),
    message: String(data.message || '').slice(0, 180),
    missionTitle: String(data.missionTitle || '').slice(0, 52),
    missionReason: String(data.missionReason || '').slice(0, 140),
    mood: ['happy', 'curious', 'focus', 'alert'].includes(data.mood) ? data.mood : 'happy'
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return res.status(503).json({ error: 'Gemini is not configured' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (body.type !== 'sobimon_character_insight') {
    return res.status(400).json({ error: 'Unsupported request type' });
  }

  const summary = sanitizeSummary(body.summary);
  const level = clampNumber(body.user?.level, 1, 999);
  const title = String(body.user?.title || '').slice(0, 40);

  const prompt = `너는 한국어 가계부 앱 SOBIMON의 AI 캐릭터다.\n사용자의 집계된 소비 데이터만 보고 짧고 구체적으로 반응한다.\n비난하거나 겁주지 말고, 숫자를 근거로 다음 행동 하나를 제안한다.\n캐릭터 말투는 친근하지만 유치하지 않게 한다. 금융상품 추천, 투자 조언, 세금 확정 판단은 하지 않는다.\n\n사용자 레벨: ${level}\n사용자 칭호: ${title || '없음'}\n이번 달 집계:\n${JSON.stringify(summary)}\n\n반드시 아래 JSON 객체만 출력한다. 마크다운이나 설명을 붙이지 않는다.\n{\n  "headline": "20자 안팎의 한 줄",\n  "message": "소비 데이터에 근거한 2문장 이내 설명",\n  "missionTitle": "오늘 또는 이번 주에 바로 실행할 수 있는 한 가지 미션",\n  "missionReason": "왜 이 미션이 도움이 되는지 짧게",\n  "mood": "happy | curious | focus | alert 중 하나"\n}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(`${GEMINI_URL}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.55,
          maxOutputTokens: 320,
          responseMimeType: 'application/json'
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const detail = await response.text();
      console.error('[SOBIMON Gemini]', response.status, detail.slice(0, 500));
      return res.status(response.status === 429 ? 429 : 502).json({
        error: response.status === 429 ? 'Gemini quota exceeded' : 'Gemini request failed'
      });
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();

    if (!text) {
      return res.status(502).json({ error: 'Gemini returned an empty response' });
    }

    const parsed = JSON.parse(stripJsonFence(text));
    const insight = normalizeInsight(parsed);

    if (!insight.headline || !insight.message || !insight.missionTitle) {
      return res.status(502).json({ error: 'Gemini returned an invalid response' });
    }

    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).json(insight);
  } catch (error) {
    console.error('[SOBIMON Gemini] unexpected error', error);
    return res.status(502).json({ error: 'AI service unavailable' });
  }
}
