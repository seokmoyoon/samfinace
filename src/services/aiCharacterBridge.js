import { aiService } from './aiService';
import { STORAGE_KEYS } from '../utils/storage';

const MOOD_MAP = {
  happy: 'happy',
  proud: 'celebrate',
  celebrate: 'celebrate',
  success: 'celebrate',
  alert: 'worry',
  worry: 'worry',
  worried: 'worry',
  focus: 'thinking',
  thinking: 'thinking',
  curious: 'thinking',
  sad: 'sad',
  tired: 'sad',
  idle: 'idle'
};

const safeRead = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeMood = (mood) => MOOD_MAP[String(mood || '').toLowerCase()] || 'idle';

const applyInsightToOriginalHero = (insight) => {
  const speech = document.querySelector('.hero-speech-bubble-text');
  if (speech && insight?.message) speech.textContent = insight.message;

  const hero = document.querySelector('.fairytale-hero-container');
  if (hero) {
    hero.dataset.aiMood = normalizeMood(insight?.mood);
    hero.dataset.aiSource = insight?.source || 'local';
  }

  window.dispatchEvent(new CustomEvent('sobimon:ai-insight', { detail: insight }));
};

const refreshInsight = async () => {
  const transactions = safeRead(STORAGE_KEYS.TRANSACTIONS, []);
  const budget = safeRead(STORAGE_KEYS.BUDGET, {});
  const user = safeRead(STORAGE_KEYS.USER, null);
  const insight = await aiService.getCharacterInsight({ transactions, budget, user });
  applyInsightToOriginalHero(insight);
};

export function initAICharacterBridge() {
  if (typeof window === 'undefined') return () => {};

  let timer;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(refreshInsight, 250);
  };

  const observer = new MutationObserver(() => {
    if (document.querySelector('.hero-speech-bubble-text')) schedule();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('storage', schedule);
  window.addEventListener('sobimon:data-changed', schedule);
  schedule();

  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
    window.removeEventListener('storage', schedule);
    window.removeEventListener('sobimon:data-changed', schedule);
  };
}
