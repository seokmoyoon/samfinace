import React from 'react';
import { X, Swords, Shield, Trophy, Award, Sparkles, Monitor, ArrowRight } from 'lucide-react';
import { CafeMonsterIllustration } from './SobimonIllustrations';

export default function GymArenaModal({ isOpen, onClose, budget, user, onSwitchToPCMode }) {
  if (!isOpen) return null;

  const monthlyBudget = budget?.monthlyBudget || 1200000;
  // 예시: 376,000원 지출 상태
  const spentAmount = 376000;
  const remainingHp = Math.max(0, monthlyBudget - spentAmount);
  const hpPercent = Math.round((remainingHp / monthlyBudget) * 100);

  return (
    <div className="holo-modal-backdrop" onClick={onClose}>
      <div 
        className="gym-arena-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '440px',
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '28px',
          padding: '24px',
          color: '#F8FAFC',
          border: '2px solid #F59E0B',
          boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.35)',
          position: 'relative'
        }}
      >
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94A3B8'
          }}
        >
          <X size={18} />
        </button>

        {/* 체육관 타이틀 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #F59E0B',
            color: '#FBBF24',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            <Trophy size={13} />
            <span>제 1 소비몬 체육관</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px' }}>
            월간 관장 배틀: 카페대왕몬 레이드
          </h2>
          <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
            한 달 동안 내 예산 체력(HP)을 지켜내고 체육관 뱃지를 획득하세요!
          </p>
        </div>

        {/* 배틀 아레나 무대 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '18px',
          textAlign: 'center'
        }}>
          {/* 보스 일러스트 */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <CafeMonsterIllustration size={90} />
            <div style={{
              position: 'absolute',
              bottom: '0',
              background: '#EF4444',
              color: '#FFF',
              fontSize: '10px',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '9999px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}>
              BOSS VMAX
            </div>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 900, color: '#F8FAFC', marginBottom: '4px' }}>
            체육관 관장: 카페대왕몬
          </div>
          <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 16px' }}>
            "이번 달 달콤한 라떼 결제로 지갑을 무너뜨려 주겠다!"
          </p>

          {/* 1:1 대치 체력바 */}
          <div style={{ background: '#1E293B', borderRadius: '14px', padding: '14px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} /> <span>내 예산 잔여 방어력 (HP)</span>
              </span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#38BDF8' }}>
                {hpPercent}% ({remainingHp.toLocaleString()}원)
              </span>
            </div>

            <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                width: `${hpPercent}%`,
                height: '100%',
                background: hpPercent > 40 ? 'linear-gradient(90deg, #10B981, #38BDF8)' : 'linear-gradient(90deg, #EF4444, #F59E0B)',
                transition: 'width 0.5s ease'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginTop: '6px' }}>
              <span>관장 총 공격 피해: {spentAmount.toLocaleString()}원</span>
              <span>목표 한도: {monthlyBudget.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 배틀 클리어 보상 */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏅</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FBBF24' }}>이달의 격파 보상</div>
              <div style={{ fontSize: '11px', color: '#CBD5E1' }}>공식 [카페몬 봉인 뱃지] + 300 EXP</div>
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#10B981',
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            방어 성공 중
          </span>
        </div>

        {/* PC 대화면 체육관 전환 안내 */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              onClose();
              if (onSwitchToPCMode) onSwitchToPCMode();
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
            }}
          >
            <Monitor size={16} />
            <span>💻 PC 대화면 체육관 3단 연구소로 가기</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
