import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  Flame, 
  Coins, 
  Settings,
  Database,
  ExternalLink,
  Cloud,
  RotateCw
} from 'lucide-react';
import { INITIAL_ACCOUNTS } from '../data/mockData';
import LevelBadge from './common/LevelBadge';
import ExpBar from './common/ExpBar';
import CoinBadge from './common/CoinBadge';

export default function MyTab({ 
  user, 
  badges = [], 
  currentUser, 
  isSyncing, 
  onOpenAuth, 
  onSyncCloud, 
  onSignOut, 
  onOpenTreasure, 
  onResetData 
}) {
  const [showChestModal, setShowChestModal] = useState(false);
  const [chestReward, setChestReward] = useState(null);

  const handleOpenChest = () => {
    const rewards = [
      '🎉 [황금 절약 탐험가 칭호] 획득! +100 EXP',
      '💎 [카페몬 봉인 부적] 획득! +50 COIN',
      '🌟 [예산 수호자의 방패] 획득! +150 EXP'
    ];
    const picked = rewards[Math.floor(Math.random() * rewards.length)];
    setChestReward(picked);
    setShowChestModal(true);
    if (onOpenTreasure) onOpenTreasure();
  };

  return (
    <div className="my-screen">
      {/* 0. 클라우드 계정 & 동기화 상태 배너 */}
      {currentUser ? (
        <div style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1px solid #A7F3D0',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#065F46' }}>
              <Cloud size={14} color="#059669" />
              <span>클라우드 동기화 계정</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857' }}>
              {currentUser.email}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={onSyncCloud}
              disabled={isSyncing}
              style={{
                background: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCw size={12} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? '동기화 중...' : '동기화'}</span>
            </button>
            <button
              onClick={onSignOut}
              style={{
                background: '#FFFFFF',
                color: '#64748B',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          marginBottom: '16px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '14px' }}>☁️</span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#F8FAFC' }}>
                클라우드 동기화 켜기
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
              기기 변경 시에도 내 소비몬과 장부를 안전하게 지키세요!
            </p>
          </div>
          <button
            onClick={onOpenAuth}
            style={{
              background: 'linear-gradient(135deg, #38BDF8, #3B82F6)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '7px 13px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(56, 189, 248, 0.4)'
            }}
          >
            로그인 / 가입 🔒
          </button>
        </div>
      )}

      {/* 1. 프로필 카드 */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
        border: '1px solid #DBEAFE',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: '#FFFFFF',
            border: '2px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
          }}>
            👾
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)' }}>
                {user.name}
              </h3>
              <LevelBadge level={user.level} size="lg" />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
              {user.title}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              color: '#F97316',
              fontWeight: 800,
              fontSize: '11px',
              background: '#FFF7ED',
              padding: '3px 8px',
              borderRadius: '9999px',
              border: '1px solid #FFEDD5'
            }}>
              <Flame size={13} />
              <span>{user.streakDays}일 콤보</span>
            </div>
            <CoinBadge coins={user.coins || 450} />
          </div>
        </div>

        {/* EXP 게이지 */}
        <ExpBar current={user.exp} max={user.maxExp} />
      </div>

      {/* 2. 주간 보물상자 이벤트 카드 */}
      <div style={{
        background: '#FFFBEB',
        border: '1px solid #FDE68A',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: 800, fontSize: '13px', marginBottom: '2px' }}>
            <Sparkles size={16} /> <span>절약 콤보 보물상자</span>
          </div>
          <p style={{ fontSize: '11px', color: '#92400E' }}>
            {user.streakDays}일 연속 절약 콤보 달성 기념 상자 오픈 가능!
          </p>
        </div>
        <button
          onClick={handleOpenChest}
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
          }}
        >
          열기 🎁
        </button>
      </div>

      {/* 3 & 4. 결제수단 및 업적 뱃지 (태블릿 2열 그리드 반응형) */}
      <div className="my-two-col-grid">
        {/* 3. 결제수단 및 자산 계좌 현황 */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={16} color="var(--primary)" /> <span>연동된 결제수단 및 통장 ({INITIAL_ACCOUNTS.length})</span>
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {INITIAL_ACCOUNTS.map(acc => (
              <div
                key={acc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #F1F5F9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{acc.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {acc.name}
                  </span>
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: acc.balance < 0 ? '#EF4444' : '#2563EB'
                }}>
                  {acc.balance < 0 ? `-${Math.abs(acc.balance).toLocaleString()}원 (청구예정)` : `${acc.balance.toLocaleString()}원`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 달성한 업적 뱃지 */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="var(--accent)" /> <span>달성한 업적 뱃지</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {badges.map(b => (
              <div
                key={b.id}
                style={{
                  background: b.unlocked ? '#F8FAFC' : '#F1F5F9',
                  border: b.unlocked ? '1px solid var(--border-subtle)' : '1px dashed #CBD5E1',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: b.unlocked ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: '20px' }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: b.unlocked ? 'var(--text-main)' : '#94A3B8' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. 데이터 백업 & 시스템 설정 */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Settings size={15} color="var(--text-muted)" /> <span>설정 및 데이터 관리 (Local-First)</span>
        </h4>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '12px' }}>
          • <strong>저장소 상태</strong>: <span style={{ color: '#059669', fontWeight: 800 }}>🟢 기기 내부 안전 보관 중 (오프라인 영구 보존)</span><br />
          • <strong>클라우드 동기화</strong>: {currentUser ? (
            <span style={{ color: '#059669', fontWeight: 800 }}>☁️ Supabase 연결 완료 ({currentUser.email})</span>
          ) : (
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>⚪ 게스트 모드 (로그인 시 클라우드 자동 백업)</span>
          )}<br />
          • <strong>버전</strong>: SOBIMON v1.2.0 (Supabase 하이브리드 엔진)
        </div>

        {onResetData && (
          <button
            onClick={onResetData}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#DC2626',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s ease'
            }}
          >
            🔄 모든 가계부 & 소비몬 데이터 초기화 (기본 샘플 복원)
          </button>
        )}
      </div>

      {/* 보물상자 오픈 모달 */}
      {showChestModal && (
        <div className="levelup-overlay" onClick={() => setShowChestModal(false)}>
          <div className="levelup-card" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎁</div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#D97706', marginBottom: '8px' }}>
              보물상자 오픈!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 700, marginBottom: '16px' }}>
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
