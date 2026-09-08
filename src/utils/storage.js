/**
 * SOBIMON 로컬 저장소(localStorage) 매니저
 * - 편한가계부와 동일한 'Local-First' 오프라인 영구 저장소 구조
 * - 로그인 없이도 사용자가 기록한 모든 지출, 경험치, 소비몬 도감 등이 새로고침해도 기기에 영구 보존됩니다.
 */

const STORAGE_PREFIX = 'sobimon_data_';

export const STORAGE_KEYS = {
  USER: `${STORAGE_PREFIX}user`,
  BUDGET: `${STORAGE_PREFIX}budget`,
  TRANSACTIONS: `${STORAGE_PREFIX}transactions`,
  QUESTS: `${STORAGE_PREFIX}quests`,
  BADGES: `${STORAGE_PREFIX}badges`,
  SOBIMONS: `${STORAGE_PREFIX}sobimons`,
};

/**
 * 로컬 스토리지에서 안전하게 데이터를 불러옵니다.
 * 데이터가 없거나 파싱 오류 시 fallback 값을 반환합니다.
 */
export function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[SOBIMON Storage] Failed to load key "${key}":`, err);
    return fallback;
  }
}

/**
 * 로컬 스토리지에 데이터를 안전하게 저장합니다.
 */
export function saveToStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[SOBIMON Storage] Failed to save key "${key}":`, err);
  }
}

/**
 * 모든 소비몬 로컬 데이터를 초기화하고 기본 샘플 데이터로 복원합니다.
 */
export function clearAllSobimonStorage() {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch (err) {
    console.warn('[SOBIMON Storage] Failed to clear storage:', err);
  }
}
