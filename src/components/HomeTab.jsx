import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  ArrowRight, 
  PlusCircle, 
  Flame, 
  ChevronRight,
  Coffee,
  ShoppingBag,
  Utensils,
  Car,
  HelpCircle
} from 'lucide-react';

const CATEGORY_ICONS = {
  '카페/디저트': '☕',
  '식비/외식': '🍱',
  '쇼핑/마트': '🛒',
  '교통/차량': '🚕',
  '생활/통신': '📱',
  '의료/건강': '💊',
  '기타/생활': '💳'
};

export default function HomeTab({ 
  user, 
  budget, 
  transactions, 
  quests, 
  onNavigateTab,
  onOpenQuickAdd
}) {
  // 지출 총액 계산
  const totalSpent = transactions.reduce((acc, cur) => acc + cur.amount, 0);
  const remainingHp = Math.max(0, budget.monthlyBudget - totalSpent);
  const hpPercent = Math.min(100, Math.round((remainingHp / budget.monthlyBudget) * 100));

  // 상태 판정
  let statusClass = 'good';
  let statusText = '체력 충만 (안전)';
  if (hpPercent < 30) {
    statusClass = 'danger';
    statusText = '위험! 예산 방어 필요';
  } else if (hpPercent < 60) {
    statusClass = 'warn';
    statusText = '주의 구간 돌입';
  }

  // 오늘 일일 권장 지출액 (잔여 예산 / 남은 일수 약 23일)
  const remainingDays = 23;
  const dailyTarget = Math.max(0, Math.floor(remainingHp / remainingDays));

  // 이번 달 예상 저축 가능액
  const projectedSavings = budget.totalIncome - budget.fixedExpenses - totalSpent;

  return (
    <div className="home-screen">
      {/* 1. 상단 유저 뱃지 및 게이미피케이션 상태 */}
      <div className="user-level-badge">
        <div className="user-tag">
          <div className="level-icon-box">⚔️</div>
          <div>
            <div className="user-title">{user.name} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lv.{user.level}</span></div>
            <div className="user-rank">{user.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="exp-pill" title="경험치">
            ⭐ {user.exp} / {user.maxExp} EXP
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#F97316', fontWeight: 700 }}>
            <Flame size={15} />
            <span>{user.streakDays}일째</span>
          </div>
        </div>
      </div>

      {/* 2. 대형 예산 체력 (HP) 카드 */}
      <div className="hp-card">
        <div className="hp-card-header">
          <div className="hp-title-wrap">
            <h3>이번 달 생활비 방어 체력 (HP)</h3>
            <div className="hp-amount">{remainingHp.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 600 }}>원 남음</span></div>
          </div>
          <div className={`hp-status-chip ${statusClass}`}>
            {statusClass === 'good' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span>{hpPercent}%</span>
          </div>
        </div>

        {/* 체력 게이지 */}
        <div className="hp-gauge-bg">
          <div 
            className={`hp-gauge-fill ${statusClass}`} 
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="hp-subinfo">
          <span>총 지출: {totalSpent.toLocaleString()}원</span>
          <span>목표 예산: {budget.monthlyBudget.toLocaleString()}원</span>
        </div>
      </div>

      {/* 3. 오늘 권장 지출 안내 배너 */}
      <div className="daily-target-banner">
        <div className="text-group">
          <Sparkles size={18} color="#818CF8" />
          <div>
            <div className="label">오늘 하루 목표 지출액</div>
            <div className="val">{dailyTarget.toLocaleString()}원 이하로 쓰기</div>
          </div>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => onNavigateTab('quests')}
          style={{ fontSize: '11px', padding: '6px 10px' }}
        >
          퀘스트 보기
        </button>
      </div>

      {/* 4. 돈의 흐름 파이프라인 (수입 -> 고정비 -> 생활비 -> 저축) */}
      <div className="flow-diagram-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            🌊 돈의 흐름 맵
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>한눈에 보는 자금 파이프라인</span>
        </div>

        <div className="flow-step-container">
          <div className="flow-step-box income">
            <div className="flow-step-title">월 수입</div>
            <div className="flow-step-val" style={{ color: 'var(--success)' }}>
              +{(budget.totalIncome / 10000).toFixed(0)}만
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step-box fixed">
            <div className="flow-step-title">고정 지출</div>
            <div className="flow-step-val" style={{ color: 'var(--warning)' }}>
              -{(budget.fixedExpenses / 10000).toFixed(0)}만
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step-box variable">
            <div className="flow-step-title">생활비 지출</div>
            <div className="flow-step-val" style={{ color: 'var(--danger)' }}>
              -{(totalSpent / 10000).toFixed(1)}만
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step-box savings">
            <div className="flow-step-title">예상 저축액</div>
            <div className="flow-step-val" style={{ color: '#818CF8' }}>
              {(projectedSavings / 10000).toFixed(0)}만
            </div>
          </div>
        </div>
      </div>

      {/* 5. 활성 절약 퀘스트 섹션 */}
      <div className="section-header">
        <h4>⚔️ 진행 중인 절약 퀘스트</h4>
        <button className="action-link" onClick={() => onNavigateTab('quests')}>
          더보기 <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
        </button>
      </div>

      <div className="quest-list">
        {quests.slice(0, 2).map((q) => (
          <div key={q.id} className="quest-item" onClick={() => onNavigateTab('quests')} style={{ cursor: 'pointer' }}>
            <div className="quest-left">
              <div className="quest-icon">{q.icon}</div>
              <div className="quest-info">
                <h5>{q.title}</h5>
                <p>{q.description}</p>
              </div>
            </div>
            <div className="quest-reward">
              <div className="quest-exp">+{q.rewardExp} EXP</div>
              <div className={`quest-status ${q.status}`}>
                {q.status === 'success' ? '달성 완료 🎉' : `${q.current.toLocaleString()} / ${q.target.toLocaleString()}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 6. 최근 지출 타임라인 & 빠른 추가 버튼 */}
      <div className="section-header">
        <h4>💳 최근 지출 내역</h4>
        <button className="action-link" onClick={() => onNavigateTab('input')}>
          + 내역서/SMS 등록
        </button>
      </div>

      <div className="transaction-list">
        {transactions.slice(0, 4).map((tx) => (
          <div key={tx.id} className="transaction-item">
            <div className="tx-left">
              <div className="tx-icon-circle" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
                {CATEGORY_ICONS[tx.category] || '💸'}
              </div>
              <div className="tx-details">
                <h6>{tx.merchant}</h6>
                <span>{tx.date} · {tx.category} ({tx.source})</span>
              </div>
            </div>
            <div className="tx-amount minus">
              -{tx.amount.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
