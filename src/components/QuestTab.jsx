import React, { useState } from 'react';
import { Trophy, Gift, Award, CheckCircle, Flame, Star, Sparkles } from 'lucide-react';

export default function QuestTab({ user, quests, badges, onClaimReward, onOpenTreasure }) {
  const [showChestModal, setShowChestModal] = useState(false);
  const [chestReward, setChestReward] = useState(null);

  const handleOpenChest = () => {
    const rewards = [
      '🎉 [황금 저축 칭호] 획득! +100 EXP',
      '💎 [커피 쿠폰 방어권] 획득! 절약 마일리지 적립',
      '🌟 [예산 수호자의 방패] 배지 잠금 해제!'
    ];
    const picked = rewards[Math.floor(Math.random() * rewards.length)];
    setChestReward(picked);
    setShowChestModal(true);
  };

  return (
    <div className="quest-screen">
      {/* 1. 레벨 & 모험가 정보 카드 */}
      <div style={{
        background: 'linear-gradient(145deg, #1E1B4B 0%, #171E2E 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🧙‍♂️
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                {user.name} <span style={{ color: 'var(--accent)', fontSize: '13px' }}>Lv.{user.level}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#C4B5FD', fontWeight: 600 }}>
                {user.title}
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#FB923C',
            fontWeight: 700
          }}>
            <Flame size={16} /> {user.streakDays}일 연속 절약
          </div>
        </div>

        {/* 경험치 바 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>다음 레벨까지</span>
          <span style={{ color: '#DDD6FE', fontWeight: 700 }}>{user.exp} / {user.maxExp} EXP ({Math.round((user.exp / user.maxExp) * 100)}%)</span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(user.exp / user.maxExp) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8B5CF6, #C084FC)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* 2. 주간 보물상자 이벤트 */}
      <div style={{
        background: 'rgba(251, 191, 36, 0.08)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>🎁</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold)' }}>
              이번 주 절약 보물상자
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              3개 퀘스트 완료 시 오픈 가능!
            </div>
          </div>
        </div>
        <button
          onClick={handleOpenChest}
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
            color: '#78350F',
            border: 'none',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          열기 ✨
        </button>
      </div>

      {/* 3. 절약 퀘스트 목록 */}
      <div style={{ marginBottom: '22px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={16} color="var(--accent)" /> 진행 중인 절약 퀘스트
        </h4>

        <div className="quest-list">
          {quests.map((q) => {
            const isCompleted = q.status === 'success';
            return (
              <div key={q.id} className="quest-item">
                <div className="quest-left">
                  <div className="quest-icon">{q.icon}</div>
                  <div className="quest-info">
                    <h5>{q.title}</h5>
                    <p>{q.description}</p>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                      목표치: {q.target > 0 ? `${q.target.toLocaleString()}원 이하` : '0원 무지출'}
                    </div>
                  </div>
                </div>

                <div className="quest-reward">
                  <div className="quest-exp">+{q.rewardExp} EXP</div>
                  {isCompleted ? (
                    <button
                      onClick={() => onClaimReward(q.id, q.rewardExp)}
                      style={{
                        marginTop: '6px',
                        background: 'var(--success)',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      보상 받기 ✨
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 600 }}>
                      진행 중
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 나의 업적 배지 보관함 */}
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={16} color="var(--gold)" /> 업적 배지 컬렉션
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                background: b.unlocked ? 'var(--bg-surface)' : 'rgba(255, 255, 255, 0.02)',
                border: b.unlocked ? '1px solid var(--border-subtle)' : '1px dashed rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 8px',
                textAlign: 'center',
                opacity: b.unlocked ? 1 : 0.4
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '6px', filter: b.unlocked ? 'none' : 'grayscale(1)' }}>
                {b.icon}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: b.unlocked ? 'var(--text-main)' : 'var(--text-dim)', marginBottom: '2px' }}>
                {b.name}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 보물상자 열기 모달 */}
      {showChestModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            textAlign: 'center',
            maxWidth: '320px',
            width: '100%',
            boxShadow: 'var(--shadow-gold)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👑</div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gold)', marginBottom: '8px' }}>
              축하합니다! 보물상자 오픈!
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '18px', fontWeight: 600 }}>
              {chestReward}
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowChestModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
