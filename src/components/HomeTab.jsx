import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Flame, 
  ChevronRight,
  Coins,
  Swords,
  Target
} from 'lucide-react';

const CATEGORY_ICONS = {
  '카페/디저트': '☕',
  '식비/외식': '🍱',
  '쇼핑/마트': '🛒',
  '교통/차량': '🚕',
  '생활/통신': '📱',
  '의료/건강': '💊',
  '급여/월급': '💰',
  '기타/생활': '💳'
};

export default function HomeTab({ 
  user, 
  budget, 
  transactions, 
  quests, 
  sobimons = [],
  onNavigateTab,
  onOpenQuickAdd
}) {
  // 지출 총액 계산 (수입 제외)
  const totalSpent = transactions
    .filter(t => t.type !== 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const remainingHp = Math.max(0, budget.monthlyBudget - totalSpent);
  const hpPercent = Math.min(100, Math.round((remainingHp / budget.monthlyBudget) * 100));

  // 상태 판정
  let statusClass = 'good';
  let statusText = '예산 게이지 안정적 (방어 성공 중)';
  if (hpPercent < 30) {
    statusClass = 'danger';
    statusText = '앗! 소비 게이지 위험! 긴급 절약 필요';
  } else if (hpPercent < 60) {
    statusClass = 'warn';
    statusText = '주의 구간! 소비몬들의 출현이 늘고 있어요';
  }

  // 오늘 일일 권장 소비액 (잔여 예산 / 남은 일수 약 23일)
  const remainingDays = 23;
  const dailyTarget = Math.max(0, Math.floor(remainingHp / remainingDays));

  // 이번 달 예상 저축 가능액
  const projectedSavings = budget.totalIncome - budget.fixedExpenses - totalSpent;

  // 대표 활성 소비몬 (지출 발생 카테고리 몬스터들)
  const activeMonsters = sobimons.filter(m => m.discovered && m.level > 0).slice(0, 3);

  // 오늘의 핵심 미션
  const todayMission = quests.find(q => q.type === 'daily' || q.status === 'progress') || quests[0];

  return (
    <div className="home-screen">
      {/* 1. 상단 프로필 & EXP HUD */}
      <div className="user-level-badge">
        <div className="user-tag">
          <div className="level-icon-box">👾</div>
          <div>
            <div className="user-title">
              {user.name} <span style={{ fontSize: '11px', color: '#A5B4FC', fontWeight: 800 }}>Lv.{user.level}</span>
            </div>
            <div className="user-rank">{user.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="exp-pill" title="경험치">
            ⭐ {user.exp} / {user.maxExp} EXP
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#F97316', fontWeight: 800 }}>
            <Flame size={15} />
            <span>{user.streakDays}일 콤보</span>
          </div>
        </div>
      </div>

      {/* 2. 중앙 게임 HUD: 이번 달 소비 vs 예산 게이지 */}
      <div className="hp-card">
        <div className="hp-card-header">
          <div className="hp-title-wrap">
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>9월 소비 방어전</span>
            <div className="hp-amount">
              {remainingHp.toLocaleString()} <span style={{ fontSize: '15px', fontWeight: 600 }}>원 남음</span>
            </div>
          </div>
          <div className={`hp-status-chip ${statusClass}`}>
            {statusClass === 'good' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span>게이지 {hpPercent}%</span>
          </div>
        </div>

        {/* 예산 게이지 바 */}
        <div className="hp-gauge-bg">
          <div 
            className={`hp-gauge-fill ${statusClass}`} 
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="hp-subinfo">
          <span>이번 달 소비: {totalSpent.toLocaleString()}원</span>
          <span>소비 제한(예산): {budget.monthlyBudget.toLocaleString()}원</span>
        </div>

        <div style={{
          marginTop: '10px',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '11px',
          color: statusClass === 'good' ? '#34D399' : statusClass === 'warn' ? '#FBBF24' : '#F87171',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>{statusClass === 'good' ? '🛡️' : '⚠️'}</span>
          <span>{statusText}</span>
        </div>
      </div>

      {/* 3. 이번 달 서식 중인 소비몬 위젯 */}
      <div className="active-monsters-wrap">
        <div className="active-monsters-header">
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👾 이번 달 서식 중인 소비몬</span>
              <span style={{ fontSize: '11px', color: '#F43F5E', fontWeight: 700 }}>(3마리 발견)</span>
            </h4>
          </div>
          <button 
            className="action-link" 
            onClick={() => onNavigateTab('dex')}
            style={{ fontSize: '11px', color: '#A5B4FC', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            도감 보기 <ChevronRight size={13} style={{ verticalAlign: 'middle' }} />
          </button>
        </div>

        <div className="monster-badge-row">
          {activeMonsters.map(mon => (
            <div 
              key={mon.id} 
              className="monster-mini-card"
              onClick={() => onNavigateTab('dex')}
            >
              <div className="mon-icon">{mon.badge}</div>
              <div className="mon-name">{mon.name} <span style={{ fontSize: '10px', color: '#818CF8' }}>Lv.{mon.level}</span></div>
              <div className="mon-status">{mon.threat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 오늘의 미션 카드 */}
      {todayMission && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))',
          border: '1px solid rgba(99, 102, 241, 0.28)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#DDD6FE' }}>
              <Target size={15} color="#A78BFA" />
              <span>오늘의 추천 미션</span>
            </div>
            <span style={{ fontSize: '10px', color: '#C084FC', fontWeight: 700, background: 'rgba(139, 92, 246, 0.2)', padding: '2px 8px', borderRadius: '12px' }}>
              +{todayMission.rewardExp} EXP · +{todayMission.rewardCoin || 20} 코인
            </span>
          </div>
          <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{todayMission.title}</h5>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>{todayMission.description}</p>
          
          <button 
            className="btn-primary" 
            onClick={() => onNavigateTab('dex')}
            style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '8px' }}
          >
            미션 현황 확인 및 리워드 수령
          </button>
        </div>
      )}

      {/* 5. 빠른 소비 기록 바 */}
      <div style={{
        background: 'linear-gradient(135deg, #3730A3, #4F46E5)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        boxShadow: '0 4px 16px rgba(79, 70, 229, 0.25)'
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>⚡ 빠른 소비 기록</div>
          <div style={{ fontSize: '11px', color: '#C7D2FE' }}>기록할 때마다 +10 EXP & 소비몬 발견!</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={onOpenQuickAdd}
            style={{
              background: '#fff',
              color: '#312E81',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            직접 입력
          </button>
          <button 
            onClick={() => onNavigateTab('input')}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            SMS/명세서
          </button>
        </div>
      </div>

      {/* 6. 자금 흐름 파이프라인 (돈의 흐름 맵) */}
      <div className="flow-diagram-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            🌊 자금 파이프라인
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>수입 → 고정비 → 소비 → 저축</span>
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
            <div className="flow-step-title">이번 달 소비</div>
            <div className="flow-step-val" style={{ color: 'var(--danger)' }}>
              -{(totalSpent / 10000).toFixed(1)}만
            </div>
          </div>

          <div className="flow-arrow">➔</div>

          <div className="flow-step-box savings">
            <div className="flow-step-title">성장 목표액</div>
            <div className="flow-step-val" style={{ color: '#818CF8' }}>
              {(projectedSavings / 10000).toFixed(0)}만
            </div>
          </div>
        </div>
      </div>

      {/* 7. 최근 소비 기록 */}
      <div className="section-header">
        <h4>📝 최근 소비 기록</h4>
        <button className="action-link" onClick={() => onNavigateTab('calendar')}>
          전체 달력 <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
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
            <div className={`tx-amount ${tx.type === 'income' ? 'plus' : 'minus'}`}>
              {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
