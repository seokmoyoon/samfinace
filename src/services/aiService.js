const CACHE_PREFIX = 'sobimon.ai.insight.';
const CACHE_TTL = 6 * 60 * 60 * 1000;

const categoryLabel = (category = '') => {
  if (category.includes('카페')) return '카페';
  if (category.includes('쇼핑') || category.includes('마트')) return '쇼핑';
  if (category.includes('식비') || category.includes('외식') || category.includes('배달')) return '식비';
  if (category.includes('교통') || category.includes('차량')) return '교통';
  if (category.includes('문화') || category.includes('여가')) return '문화·여가';
  if (category.includes('의료') || category.includes('건강')) return '의료·건강';
  return category.split('/')[0] || '생활비';
};

function buildSummary(transactions = [], budget = {}) {
  const expenses = transactions.filter((tx) => tx.type !== 'income');
  const total = expenses.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const monthlyBudget = Number(budget?.monthlyBudget || 0);
  const byCategory = expenses.reduce((acc, tx) => {
    const key = tx.category || '기타';
    acc[key] = (acc[key] || 0) + Number(tx.amount || 0);
    return acc;
  }, {});
  const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] || ['기타', 0];
  const topRate = total > 0 ? Math.round((top[1] / total) * 100) : 0;
  const budgetRate = monthlyBudget > 0 ? Math.round((total / monthlyBudget) * 100) : 0;

  return {
    total,
    monthlyBudget,
    remaining: Math.max(0, monthlyBudget - total),
    budgetRate,
    topCategory: categoryLabel(top[0]),
    topCategoryAmount: top[1],
    topCategoryRate: topRate,
    transactionCount: expenses.length
  };
}

function localCharacterInsight(summary) {
  if (!summary.transactionCount) {
    return {
      headline: '첫 소비를 알려줘!',
      message: '한 건만 기록해도 소비몬이 패턴을 읽기 시작해요.',
      missionTitle: '오늘 첫 소비 1건 기록하기',
      missionReason: '기록이 쌓일수록 조언이 더 정확해져요.',
      mood: 'curious',
      source: 'local'
    };
  }

  if (summary.budgetRate >= 90) {
    return {
      headline: '예산 방어가 필요해!',
      message: `이번 달 예산의 ${summary.budgetRate}%를 사용했어요. 특히 ${summary.topCategory} 비중이 ${summary.topCategoryRate}%예요.`,
      missionTitle: `${summary.topCategory} 소비 하루 쉬기`,
      missionReason: '지금 한 번 멈추면 월말 부담을 크게 줄일 수 있어요.',
      mood: 'alert',
      source: 'local'
    };
  }

  if (summary.topCategoryRate >= 35) {
    return {
      headline: `${summary.topCategory}몬이 강해졌어!`,
      message: `이번 달 ${summary.topCategory}에 ${summary.topCategoryAmount.toLocaleString()}원을 썼어요. 전체 지출의 ${summary.topCategoryRate}%예요.`,
      missionTitle: `${summary.topCategory} 지출 10% 줄이기`,
      missionReason: '가장 큰 항목 하나만 줄여도 체감 효과가 커요.',
      mood: 'focus',
      source: 'local'
    };
  }

  return {
    headline: '소비 균형이 좋아!',
    message: `이번 달 ${summary.total.toLocaleString()}원을 기록했어요. 가장 큰 항목은 ${summary.topCategory}예요.`,
    missionTitle: '오늘 계획 밖 소비 0원',
    missionReason: '좋은 흐름을 하루 더 이어가면 돼요.',
    mood: 'happy',
    source: 'local'
  };
}

function cacheKey(summary, user) {
  return `${CACHE_PREFIX}${btoa(unescape(encodeURIComponent(JSON.stringify({
    summary,
    level: user?.level || 1,
    title: user?.title || ''
  })))).slice(0, 180)}`;
}

function readCache(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data || null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Storage quota/private mode failures should never break the app.
  }
}

export const aiService = {
  buildSummary,

  async getCharacterInsight({ transactions = [], budget = {}, user = null }) {
    const summary = buildSummary(transactions, budget);
    const fallback = localCharacterInsight(summary);
    const endpoint = import.meta.env.VITE_SOBIMON_AI_ENDPOINT?.trim() || '/api/sobimon-ai';
    const key = cacheKey(summary, user);
    const cached = readCache(key);

    if (cached) return { ...cached, source: 'remote-cache', summary };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8500);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sobimon_character_insight',
          user: user ? { level: user.level, title: user.title } : null,
          summary
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!response.ok) throw new Error(`AI endpoint ${response.status}`);

      const data = await response.json();
      const result = {
        headline: data.headline || fallback.headline,
        message: data.message || fallback.message,
        missionTitle: data.missionTitle || fallback.missionTitle,
        missionReason: data.missionReason || fallback.missionReason,
        mood: data.mood || fallback.mood
      };

      writeCache(key, result);
      return { ...result, source: 'remote', summary };
    } catch (error) {
      console.warn('[SOBIMON AI] remote insight failed, using local fallback.', error);
      return { ...fallback, summary };
    }
  }
};
