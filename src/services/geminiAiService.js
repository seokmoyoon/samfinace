/**
 * SOBIMON Gemini AI 서비스
 * Google Gemini API를 활용한 캐릭터 AI화:
 * 1. 실시간 동적 말풍선 대사 생성
 * 2. 1:1 재정 코칭 대화 (감정 분석 포함)
 * 3. 소비 등록 시 실시간 반응 및 피드백
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

// Gemini API 호출 헬퍼
async function callGemini(prompt, systemInstruction = '', model = DEFAULT_MODEL) {
  if (!GEMINI_API_KEY) {
    console.warn('[geminiAiService] GEMINI_API_KEY가 설정되지 않았습니다.');
    return null;
  }

  // 폴백 모델 목록
  const candidateModels = [model, 'gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const targetModel of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${GEMINI_API_KEY}`;
      
      const bodyPayload = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 600
        }
      };

      if (systemInstruction) {
        bodyPayload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[geminiAiService] Model ${targetModel} failed (${response.status}):`, errText);
        continue; // 다음 모델로 폴백 시도
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (err) {
      console.warn(`[geminiAiService] Error with ${targetModel}:`, err);
    }
  }

  return null;
}

export const geminiAiService = {
  /**
   * 1. 홈 화면 마스코트의 실시간 동적 말풍선 대사 생성
   */
  generateCharacterSpeech: async ({ user, budget, totalSpent = 0, recentTransactions = [] }) => {
    const monthlyBudget = budget?.monthlyBudget || 1000000;
    const spentPercent = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));
    const remaining = Math.max(0, monthlyBudget - totalSpent);

    const systemPrompt = `
당신은 모바일 가계부 RPG 게임 "소비몬(Sobimon)"의 마스코트이자 길잡이인 백곰 몬스터 '소비몬'입니다.
말투: 친근하고 귀엽고, 절약을 응원하는 활기찬 한국어 어투 (~해요!, ~해보자구!, ~예요).
역할: 유저의 지출 상태를 보고 딱 한 문장(25자 내외)으로 짧고 재치있는 격려나 소비 경고 대사를 만드세요. 이모지 1~2개 포함.
`;

    const recentDesc = recentTransactions.slice(0, 3).map(t => `${t.merchant}(${t.amount?.toLocaleString()}원)`).join(', ');
    const userPrompt = `
- 사용자: ${user?.name || '소비마스터'} (Lv.${user?.level || 1})
- 이번 달 목표 예산: ${monthlyBudget.toLocaleString()}원
- 현재 총 지출액: ${totalSpent.toLocaleString()}원 (${spentPercent}% 소진)
- 남은 예산: ${remaining.toLocaleString()}원
- 최근 소비 내역: ${recentDesc || '아직 없음'}

홈 화면 말풍선에 들어갈 1문장의 짧고 강력한 대사만 출력하세요. 따옴표 없이 텍스트만 출력:
`;

    const result = await callGemini(userPrompt, systemPrompt);
    if (result) {
      return result.replace(/^["']|["']$/g, '');
    }

    // AI 호출 실패 시 규칙 기반 대사
    if (spentPercent > 80) return '🚨 예산의 80%를 넘었어요! 절약 모드 가동!';
    if (spentPercent > 50) return '절반이나 썼어요! 지갑 단속 들어갈까요? 👀';
    if (totalSpent === 0) return '새로운 달의 시작! 무지출 데이를 노려봐요 ✨';
    return '이번 달도 잘하고 있어요! 절약몬이 지켜보고 있어요 🛡️';
  },

  /**
   * 2. 캐릭터 1:1 대화 (소비몬 AI 코치 대화창)
   */
  chatWithSobimonCoach: async ({ message, chatHistory = [], context = {} }) => {
    const { user, budget, totalSpent = 0, transactions = [] } = context;
    const monthlyBudget = budget?.monthlyBudget || 1000000;
    const remaining = Math.max(0, monthlyBudget - totalSpent);
    const spentPercent = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));

    // 주요 카테고리별 지출 요약
    const categoryTotals = {};
    (transactions || []).forEach(tx => {
      if (tx.type !== 'income') {
        const cat = tx.category || '기타';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(tx.amount) || 0);
      }
    });
    const categorySummary = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: ${amt.toLocaleString()}원`)
      .join(', ');

    const systemPrompt = `
당신은 가계부 게임 앱 '소비몬'의 공식 마스코트 백곰 캐릭터 '소비몬'입니다.
캐릭터 특징:
- 돈과 절약, 소비몬 배틀에 대해 잘 아는 든든한 재정 파트너
- 유저를 '트레이너님' 또는 '${user?.name || '소비마스터'}님'이라고 부름
- 솔직하지만 따뜻하고 귀여운 어투 (~해요!, ~했군요!, ~하자구요!)
- 유저의 질문에 실질적인 절약 팁이나 공감, 금융 조언을 전달함
- 답변 끝에는 [EMOTION: happy | joy | surprised | sad | angry] 중 어울리는 감정 하나를 반드시 태그로 붙이세요.

유저의 현재 금융 상태:
- 레벨: Lv.${user?.level || 1} (${user?.title || '초보 절약 모험가'})
- 이번 달 예산: ${monthlyBudget.toLocaleString()}원 (지출: ${totalSpent.toLocaleString()}원, ${spentPercent}% 소진, 잔여: ${remaining.toLocaleString()}원)
- 지출 상위 분야: ${categorySummary || '지출 내역 없음'}
`;

    // 이전 대화 기록 포맷팅
    const historyText = chatHistory.slice(-6).map(h => `${h.role === 'user' ? '트레이너' : '소비몬'}: ${h.text}`).join('\n');

    const prompt = `
[이전 대화 기록]
${historyText || '(대화 시작)'}

트레이너: ${message}

소비몬의 답변 (마지막에 [EMOTION: ...] 태그 필수):
`;

    const rawResponse = await callGemini(prompt, systemPrompt);

    if (!rawResponse) {
      return {
        text: '트레이너님, 지금은 전파가 살짝 불안정해요! 하지만 절약 정신만큼은 잊지 마세요 ✨',
        emotion: 'happy'
      };
    }

    // 감정 태그 파싱
    let emotion = 'happy';
    let cleanText = rawResponse;
    const match = rawResponse.match(/\[EMOTION:\s*(happy|joy|surprised|sad|angry)\]/i);
    if (match) {
      emotion = match[1].toLowerCase();
      cleanText = rawResponse.replace(/\[EMOTION:\s*(happy|joy|surprised|sad|angry)\]/gi, '').trim();
    }

    return {
      text: cleanText,
      emotion
    };
  },

  /**
   * 3. 새 소비 입력 시 즉시 반응 코멘트
   */
  evaluateExpenseReaction: async (tx, budget) => {
    const systemPrompt = `
당신은 가계부 게임 '소비몬'의 마스코트 백곰입니다.
유저가 방금 소비를 입력했습니다. 이에 대해 1줄짜리(20~30자) 즉각적인 반응(칭찬, 절약 다짐, 또는 귀여운 잔소리)을 남겨주세요.
`;
    const prompt = `
- 지출처: ${tx.merchant || tx.title || '소비'}
- 금액: ${Number(tx.amount)?.toLocaleString()}원
- 카테고리: ${tx.category || '기타'}

소비몬의 반응 한마디:
`;

    const result = await callGemini(prompt, systemPrompt);
    return result ? result.replace(/^["']|["']$/g, '').trim() : `${tx.merchant}에서 ${Number(tx.amount)?.toLocaleString()}원 소비 완료! 기록 성공이에요!`;
  }
};
