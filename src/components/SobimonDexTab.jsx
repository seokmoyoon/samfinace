import React, { useState } from 'react';
import { 
  Trophy, 
  Gift, 
  Award, 
  CheckCircle, 
  Flame, 
  Star, 
  Sparkles, 
  Target, 
  Coins, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function SobimonDexTab({ 
  user, 
  sobimons = [], 
  quests = [], 
  badges = [], 
  onClaimReward, 
  onOpenTreasure 
}) {
  const [activeSubTab, setActiveSubTab] = useState('dex'); // 'dex' | 'quests' | 'badges'
  const [showChestModal, setShowChestModal] = useState(false);
  const [chestReward, setChestReward] = useState(null);
  const [selectedMonster, setSelectedMonster] = useState(null);

  // 도감 수집률 계산
  const discoveredCount = sobimons.filter(m => m.discovered).length;
  const totalMonsters = sobimons.length;
  const dexRate = Math.round((discoveredCount / totalMonsters) * 100);

  const handleOpenChest = () => {
    const rewards = [
      '🎉 [황금 절약 탐험가 칭호] 획득! +100 EXP',
      '💎 [카페몬 봉인 부적] 획득! +50 코인',
      '🌟 [예산 수호자의 방패] 획득! +150 EXP'
    ];
    const picked = rewards[Math.floor(Math.random() * rewards.length)];
    setChestReward(picked);
    setShowChestModal(true);
    if (onOpenTreasure) onOpenTreasure();
  };

  return (
    <div className="dex-screen">
      {/* 1. 상단 캐릭터 상태 카드 */}
      <div style={{
        background: 'linear-gradient(145deg, #1E1B4B 0%, #171E2E 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👾
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: '#FB923C',
              fontWeight: 800
            }}>
              <Flame size={14} /> {user.streakDays}일 콤보
            </div>
            <div style={{ fontSize: '11px', color: '#FBBF24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Coins size={13} /> {user.coins || 450} COIN
            </div>
          </div>
        </div>

        {/* 경험치 바 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>다음 레벨(Lv.{user.level + 1})까지</span>
          <span style={{ color: '#DDD6FE', fontWeight: 700 }}>
            {user.exp} / {user.maxExp} EXP ({Math.round((user.exp / user.maxExp) * 100)}%)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(100, (user.exp / user.maxExp) * 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8B5CF6, #C084FC)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* 2. 서브 탭 스위처 */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '18px',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          style={{
            flex: 1,
            padding: '8px 0',
            border: 'none',
            background: activeSubTab === 'dex' ? 'var(--primary)' : 'transparent',
            color: activeSubTab === 'dex' ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onClick={() => setActiveSubTab('dex')}
        >
          👾 소비몬 도감 ({discoveredCount}/{totalMonsters})
        </button>
        <button
          style={{
            flex: 1,
            padding: '8px 0',
            border: 'none',
            background: activeSubTab === 'quests' ? 'var(--primary)' : 'transparent',
            color: activeSubTab === 'quests' ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onClick={() => setActiveSubTab('quests')}
        >
          🎯 미션/퀘스트 ({quests.filter(q => q.status === 'success').length} 완료)
        </button>
        <button
          style={{
            flex: 1,
            padding: '8px 0',
            border: 'none',
            background: activeSubTab === 'badges' ? 'var(--primary)' : 'transparent',
            color: activeSubTab === 'badges' ? '#fff' : 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onClick={() => setActiveSubTab('badges')}
        >
          🏆 업적 & 보물
        </button>
      </div>

      {/* 3-A. 소비몬 도감 (DEX) 뷰 */}
      {activeSubTab === 'dex' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            padding: '0 4px'
          }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800 }}>📖 SOBIMON DEX</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>내 소비 습관에 따라 소환되는 몬스터 도감</p>
            </div>
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '11px',
              color: '#A5B4FC',
              fontWeight: 800
            }}>
              수집률 {dexRate}%
            </div>
          </div>

          <div className="dex-grid">
            {sobimons.map(mon => {
              if (mon.discovered) {
                return (
                  <div 
                    key={mon.id} 
                    className="dex-card discovered"
                    onClick={() => setSelectedMonster(mon)}
                    style={{ cursor: 'pointer', borderColor: selectedMonster?.id === mon.id ? 'var(--accent)' : 'var(--border-subtle)' }}
                  >
                    <div className="dex-card-top">
                      <div className="dex-card-avatar" style={{ background: `${mon.color}22`, border: `1px solid ${mon.color}55` }}>
                        {mon.badge}
                      </div>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: mon.threat === '보스급 소비몬' ? '#F87171' : mon.threat === '아군 수호신' ? '#34D399' : '#FBBF24',
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {mon.threat}
                      </span>
                    </div>

                    <div className="dex-card-name">
                      {mon.name} <span style={{ fontSize: '11px', color: '#818CF8' }}>Lv.{mon.level}</span>
                    </div>
                    <div className="dex-card-element">속성: {mon.element}</div>
                    <div className="dex-card-quote">{mon.quote}</div>
                    <div className="dex-card-condition">🔍 {mon.condition}</div>
                  </div>
                );
              } else {
                return (
                  <div key={mon.id} className="dex-card silhouette">
                    <div className="dex-card-top">
                      <div className="dex-card-avatar" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#6B7280' }}>
                        ❓
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF' }}>미발견</span>
                    </div>
                    <div className="dex-card-name" style={{ color: '#9CA3AF' }}>??? (미발견 몬스터)</div>
                    <div className="dex-card-element">속성: 미확인</div>
                    <div className="dex-card-quote" style={{ color: '#6B7280' }}>"정체를 알 수 없는 소비의 기운이 감돕니다..."</div>
                    <div className="dex-card-condition" style={{ color: '#F43F5E' }}>🔒 {mon.condition}</div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {/* 3-B. 퀘스트 & 미션 뷰 */}
      {activeSubTab === 'quests' && (
        <div>
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '2px' }}>🎯 미션 챌린지</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>미션을 클리어하고 EXP와 코인을 획득하세요.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quests.map(q => {
              const isSuccess = q.status === 'success';
              return (
                <div 
                  key={q.id}
                  style={{
                    background: isSuccess ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                    border: isSuccess ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      {q.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: q.type === 'daily' ? 'rgba(99, 102, 241, 0.2)' : q.type === 'weekly' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                          color: q.type === 'daily' ? '#A5B4FC' : q.type === 'weekly' ? '#FCD34D' : '#F472B6'
                        }}>
                          {q.type === 'daily' ? '일일' : q.type === 'weekly' ? '주간' : '월간'}
                        </span>
                        <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{q.title}</h5>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{q.description}</p>
                      
                      <div style={{ marginTop: '6px', fontSize: '10px', color: '#FBBF24', fontWeight: 700 }}>
                        리워드: +{q.rewardExp} EXP · +{q.rewardCoin || 20} COIN
                      </div>
                    </div>
                  </div>

                  <div>
                    {isSuccess ? (
                      <button
                        onClick={() => onClaimReward && onClaimReward(q)}
                        style={{
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        리워드 수령 🎉
                      </button>
                    ) : (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                          진행 중
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-C. 업적 및 보물상자 뷰 */}
      {activeSubTab === 'badges' && (
        <div>
          {/* 주간 보물상자 이벤트 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(245, 158, 11, 0.06))',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontWeight: 800, fontSize: '13px', marginBottom: '2px' }}>
                <Sparkles size={16} /> <span>절약 콤보 보물상자</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {user.streakDays}일 연속 절약 콤보 달성 기념 상자 오픈 가능!
              </p>
            </div>
            <button
              onClick={handleOpenChest}
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
              }}
            >
              상자 열기 🎁
            </button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800 }}>🎖️ 달성 업적 뱃지</h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {badges.map(b => (
              <div
                key={b.id}
                style={{
                  background: b.unlocked ? 'var(--bg-surface)' : 'rgba(20, 26, 40, 0.4)',
                  border: b.unlocked ? '1px solid var(--border-subtle)' : '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  opacity: b.unlocked ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: '24px' }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: b.unlocked ? 'var(--text-main)' : '#6B7280' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 보물상자 오픈 모달 */}
      {showChestModal && (
        <div className="levelup-overlay" onClick={() => setShowChestModal(false)}>
          <div className="levelup-card" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎁</div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FBBF24', marginBottom: '8px' }}>
              보물상자 오픈!
            </h3>
            <p style={{ fontSize: '13px', color: '#fff', fontWeight: 700, marginBottom: '16px' }}>
              {chestReward}
            </p>
            <button 
              className="btn-primary" 
              onClick={() => setShowChestModal(false)}
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
