import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Plus, Sparkles } from 'lucide-react';
import AnimatedAISobimon from './common/AnimatedAISobimon';
import { aiService } from '../services/aiService';

export default function HomeTab({
  user,
  budget,
  transactions = [],
  quests = [],
  sobimons = [],
  onNavigateTab,
  onOpenQuickAdd
}) {
  const [aiInsight, setAiInsight] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(true);
  const [characterNudge, setCharacterNudge] = useState('');

  const summary = useMemo(() => aiService.buildSummary(transactions, budget), [transactions, budget]);
  const monthlyBudget = Number(budget?.monthlyBudget || 0);
  const spentRate = monthlyBudget > 0 ? Math.min(100, Math.round((summary.total / monthlyBudget) * 100)) : 0;
  const discovered = sobimons.filter((m) => m.discovered !== false);
  const activeMission = quests.find((q) => q.status === 'progress' || q.status === 'completed') || quests[0];

  useEffect(() => {
    let mounted = true;
    setIsAiThinking(true);

    aiService.getCharacterInsight({ transactions, budget, user }).then((result) => {
      if (mounted) {
        setAiInsight(result);
        setIsAiThinking(false);
      }
    });

    return () => { mounted = false; };
  }, [transactions, budget, user?.level, user?.title]);

  const missionTitle = aiInsight?.missionTitle || activeMission?.title || '오늘 소비 1건 기록하기';
  const missionReason = aiInsight?.missionReason || '작은 기록 하나가 이번 달 소비 패턴을 바꿔요.';

  const handleCharacterInteract = () => {
    const nudges = [
      '오늘 소비도 내가 같이 볼게!',
      '기록이 쌓일수록 내가 더 똑똑해져.',
      summary.topCategoryAmount > 0
        ? `${summary.topCategory} 소비가 지금 제일 눈에 띄어.`
        : '첫 기록을 남기면 바로 분석해볼게.'
    ];
    setCharacterNudge(nudges[Math.floor(Math.random() * nudges.length)]);
    window.setTimeout(() => setCharacterNudge(''), 2600);
  };

  return (
    <div className="home-screen-sobimon home-v2">
      <header className="home-v2-topbar">
        <div>
          <span className="home-v2-kicker">SOBIMON</span>
          <h1>{user?.name || '사용자'}님의 소비몬</h1>
        </div>
        <div className="home-v2-level">Lv.{user?.level || 1}</div>
      </header>

      <section className={`ai-character-hero mood-${aiInsight?.mood || 'happy'}`}>
        <div className="ai-character-copy">
          <div className="ai-character-label"><Sparkles size={14} /> AI 소비몬</div>
          <h2>{isAiThinking ? '소비 패턴을 읽는 중이에요' : (aiInsight?.headline || '오늘의 소비를 같이 볼게요')}</h2>
          <p>{characterNudge || aiInsight?.message || '기록이 쌓이면 소비몬이 오늘의 소비를 설명해드려요.'}</p>
          <div className="ai-character-status">
            <span>{isAiThinking ? 'AI 분석 중' : (aiInsight?.source === 'remote' ? 'Gemini AI 연결됨' : '스마트 분석 모드')}</span>
            <span>·</span>
            <span>{summary.transactionCount}건 분석</span>
          </div>
        </div>
        <div className="ai-character-art">
          <AnimatedAISobimon
            mood={aiInsight?.mood || 'happy'}
            thinking={isAiThinking}
            onInteract={handleCharacterInteract}
          />
          <span className="ai-character-tap-hint">톡 눌러보세요</span>
        </div>
      </section>

      <section className="home-money-card" onClick={() => onNavigateTab?.('spending')}>
        <div className="home-card-heading">
          <div>
            <span>이번 달 소비</span>
            <strong>{summary.total.toLocaleString()}원</strong>
          </div>
          <ChevronRight size={18} />
        </div>
        <div className="home-budget-track"><span style={{ width: `${spentRate}%` }} /></div>
        <div className="home-budget-meta">
          <span>예산 {monthlyBudget.toLocaleString()}원</span>
          <strong>{spentRate}%</strong>
        </div>
      </section>

      <section className="home-ai-mission-card">
        <div className="home-mission-icon">✦</div>
        <div className="home-mission-copy">
          <span>AI 캐릭터 미션</span>
          <h3>{missionTitle}</h3>
          <p>{missionReason}</p>
        </div>
        <button type="button" onClick={() => onNavigateTab?.('missions')}>
          미션 보기 <ChevronRight size={15} />
        </button>
      </section>

      <section className="home-v2-grid">
        <button className="home-v2-mini-card" type="button" onClick={() => onOpenQuickAdd?.()}>
          <span className="home-v2-mini-icon primary"><Plus size={20} /></span>
          <span>빠른 기록</span>
          <strong>한 번에 입력</strong>
        </button>

        <button className="home-v2-mini-card" type="button" onClick={() => onNavigateTab?.('dex')}>
          <span className="home-v2-mini-icon gold">👾</span>
          <span>발견한 소비몬</span>
          <strong>{discovered.length}마리</strong>
        </button>
      </section>

      {summary.topCategoryAmount > 0 && (
        <section className="home-insight-strip">
          <div>
            <span>이번 달 가장 강한 소비</span>
            <strong>{summary.topCategory}</strong>
          </div>
          <div className="home-insight-value">
            <strong>{summary.topCategoryAmount.toLocaleString()}원</strong>
            <span>전체의 {summary.topCategoryRate}%</span>
          </div>
        </section>
      )}
    </div>
  );
}
