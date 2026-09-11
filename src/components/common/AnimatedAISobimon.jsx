import React, { useEffect, useMemo, useState } from 'react';
import { SobimonMascot } from './SobimonIllustrations';

const MOOD_LABELS = {
  happy: '기분 좋음',
  proud: '뿌듯함',
  alert: '주의 중',
  curious: '궁금함',
  focus: '집중 중',
  sad: '아쉬움',
  thinking: '분석 중'
};

const normalizeMood = (mood, thinking) => {
  if (thinking) return 'thinking';
  if (MOOD_LABELS[mood]) return mood;
  return 'happy';
};

export default function AnimatedAISobimon({ mood = 'happy', thinking = false, onInteract }) {
  const [tapReaction, setTapReaction] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const activeMood = useMemo(() => normalizeMood(mood, thinking), [mood, thinking]);

  useEffect(() => {
    setPulseKey((prev) => prev + 1);
  }, [activeMood]);

  const handleTap = () => {
    setTapReaction(false);
    requestAnimationFrame(() => setTapReaction(true));
    window.setTimeout(() => setTapReaction(false), 720);
    onInteract?.();
  };

  return (
    <button
      type="button"
      className={`ai-sobimon ai-sobimon--${activeMood} ${tapReaction ? 'is-tapped' : ''}`}
      onClick={handleTap}
      aria-label={`AI 소비몬, ${MOOD_LABELS[activeMood]}`}
      title="눌러보세요"
    >
      <span className="ai-sobimon-aura" aria-hidden="true" />
      <span className="ai-sobimon-ring ai-sobimon-ring-one" aria-hidden="true" />
      <span className="ai-sobimon-ring ai-sobimon-ring-two" aria-hidden="true" />
      <span className="ai-sobimon-particles" key={pulseKey} aria-hidden="true">
        <i className="particle particle-1">✦</i>
        <i className="particle particle-2">•</i>
        <i className="particle particle-3">✦</i>
      </span>
      <span className="ai-sobimon-body">
        <SobimonMascot size={126} emotion="happy" />
      </span>
      <span className="ai-sobimon-shadow" aria-hidden="true" />
      <span className="ai-sobimon-mood" aria-hidden="true">{MOOD_LABELS[activeMood]}</span>
    </button>
  );
}
