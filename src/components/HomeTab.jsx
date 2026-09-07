import React from 'react';
import { 
  ChevronRight, 
  Flame, 
  Plus, 
  Sparkles,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

import LevelBadge from './common/LevelBadge';
import ExpBar from './common/ExpBar';
import CoinBadge from './common/CoinBadge';
import CharacterAvatar from './common/CharacterAvatar';
import BudgetProgress from './common/BudgetProgress';
import SobimonMiniCard from './common/SobimonMiniCard';
import MissionCard from './common/MissionCard';

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
  onOpenQuickAdd,
  onClaimReward
}) {
  // 이번 달 소비 총액 계산 (수입 제외)
  const totalSpent = transactions
    .filter(t => t.type !== 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const spentPercent = budget.monthlyBudget > 0 ? Math.round((totalSpent / budget.monthlyBudget) * 100) : 0;

  // 카페 지출액 파악
  const cafeSpent = transactions
    .filter(t => t.category === '카페/디저트' && t.type !== 'income')
    .reduce((acc, cur) => acc + cur.amount, 0);

  // 캐릭터 동적 말풍선 대사 생성 (소비 상태에 반응)
  let speechText = '이번 달 소비 잘 관리하고 있어요! 🛡️';
  let subText = `예산의 ${spentPercent}% 사용 중 (안전 구간)`;
  if (spentPercent > 80) {
    speechText = '앗! 이번 달 소비 게이지가 위험해요! ⚠️';
    subText = '긴급 절약 모드로 소비몬 출현을 막아주세요';
  } else if (cafeSpent >= 30000) {
    speechText = '이번 주 카페몬이 조금 자주 출현했어요! ☕';
    subText = `카페 누적 소비 ${cafeSpent.toLocaleString()}원`;
  } else if (spentPercent < 30) {
    speechText = '축하해요! 예산 안에서 절약몬과 함께 완벽 방어 중! ✨';
    subText = `${user.streakDays}일 연속 절약 콤보 유지 중`;
  }

  // 발견한 소비몬 목록 (상위 3마리)
  const discoveredMonsters = sobimons.filter(m => m.discovered).slice(0, 3);

  // 오늘의 대표 미션
  const todayMission = quests.find(q => q.type === 'daily' && q.status !== 'claimed') || quests[0];

  // 이번 달 예상 저축액
  const projectedSavings = budget.totalIncome - budget.fixedExpenses - totalSpent;

  return (
    <div className="home-screen">
      {/* 1. 상단 프로필 & EXP & 코인 바 */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        marginBottom: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-main)' }}>
              {user.name}
            </span>
            <LevelBadge level={user.level} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {user.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              color: '#F97316',
              fontWeight: 800,
              fontSize: '11px',
              background: '#FFF7ED',
              padding: '4px 8px',
              borderRadius: '9999px',
              border: '1px solid #FFEDD5'
            }}>
              <Flame size={13} />
              <span>{user.streakDays}일 콤보</span>
            </div>
            <CoinBadge coins={user.coins || 450} />
          </div>
        </div>

        {/* EXP 프로그레스 바 */}
        <ExpBar current={user.exp} max={user.maxExp} />
      </div>

      {/* 2. 중앙 SOBIMON 캐릭터 인터랙티브 말풍선 영역 */}
      <CharacterAvatar 
        avatarIcon="👾"
        speechText={speechText}
        subText={subText}
        onClick={() => onNavigateTab('dex')}
      />

      {/* 3. 이번 달 소비 & 예산 게이지 카드 */}
      <BudgetProgress 
        totalSpent={totalSpent}
        monthlyBudget={budget.monthlyBudget}
      />

      {/* 4. 이번 달 발견한 소비몬 위젯 */}
      <div className="active-monsters-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👾 이번 달 발견한 소비몬</span>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
              ({discoveredMonsters.length}마리 활성)
            </span>
          </h4>
          <button 
            onClick={() => onNavigateTab('dex')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            도감 보기 <ChevronRight size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {discoveredMonsters.map(mon => (
            <SobimonMiniCard 
              key={mon.id}
              monster={mon}
              onClick={() => onNavigateTab('dex')}
            />
          ))}
        </div>
      </div>

      {/* 5. 오늘의 추천 미션 */}
      {todayMission && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
              🎯 오늘의 미션
            </h4>
            <button 
              onClick={() => onNavigateTab('missions')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              전체 미션
            </button>
          </div>
          <MissionCard 
            mission={todayMission}
            onClaim={onClaimReward}
          />
        </div>
      )}

      {/* 6. 가장 중요한 대형 CTA: + 소비 기록하기 */}
      <div style={{ marginBottom: '18px' }}>
        <button 
          className="btn-floating-cta"
          onClick={onOpenQuickAdd}
        >
          <Plus size={18} />
          <span>+ 소비 기록하기 (소비몬 발견 & EXP)</span>
        </button>
      </div>

      {/* 7. 자금 흐름 파이프라인 (돈의 흐름 맵) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
            🌊 자금 파이프라인
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            수입 ➔ 고정비 ➔ 소비 ➔ 성장
          </span>
        </div>

        <div className="flow-step-container" style={{ marginTop: '12px' }}>
          <div className="flow-step-box income" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
            <div className="flow-step-title" style={{ color: '#166534' }}>월 수입</div>
            <div className="flow-step-val" style={{ color: '#15803D' }}>
              +{(budget.totalIncome / 10000).toFixed(0)}만
            </div>
          </div>

          <div className="flow-arrow" style={{ color: '#94A3B8' }}>➔</div>

          <div className="flow-step-box fixed" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
            <div className="flow-step-title" style={{ color: '#854D0E' }}>고정 지출</div>
            <div className="flow-step-val" style={{ color: '#B45309' }}>
              -{(budget.fixedExpenses / 10000).toFixed(0)}만
            </div>
          </div>

          <div className="flow-arrow" style={{ color: '#94A3B8' }}>➔</div>

          <div className="flow-step-box variable" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
            <div className="flow-step-title" style={{ color: '#991B1B' }}>이번 달 소비</div>
            <div className="flow-step-val" style={{ color: '#DC2626' }}>
              -{(totalSpent / 10000).toFixed(1)}만
            </div>
          </div>

          <div className="flow-arrow" style={{ color: '#94A3B8' }}>➔</div>

          <div className="flow-step-box savings" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
            <div className="flow-step-title" style={{ color: '#1E40AF' }}>성장 목표액</div>
            <div className="flow-step-val" style={{ color: '#2563EB' }}>
              {(projectedSavings / 10000).toFixed(0)}만
            </div>
          </div>
        </div>
      </div>

      {/* 8. 최근 소비 기록 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
          📝 최근 소비 기록
        </h4>
        <button 
          onClick={() => onNavigateTab('spending')}
          style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
        >
          소비 탭 바로가기 <ChevronRight size={13} style={{ verticalAlign: 'middle' }} />
        </button>
      </div>

      <div className="transaction-list">
        {transactions.slice(0, 3).map((tx) => (
          <div key={tx.id} className="transaction-item">
            <div className="tx-left">
              <div className="tx-icon-circle">
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
