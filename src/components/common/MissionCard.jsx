import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function MissionCard({ mission, onClaim }) {
  if (!mission) return null;
  const isSuccess = mission.status === 'success';
  const isClaimed = mission.status === 'claimed';

  return (
    <div className={`mission-card ${isSuccess ? 'success' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: isSuccess ? '#DCFCE7' : '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0
        }}>
          {mission.icon}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              background: '#EFF6FF',
              color: '#2563EB'
            }}>
              {mission.type === 'daily' ? '일일' : mission.type === 'weekly' ? '주간' : '월간'}
            </span>
            <h5 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)' }}>
              {mission.title}
            </h5>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {mission.description}
          </p>
          <div style={{ marginTop: '4px', fontSize: '10px', color: '#D97706', fontWeight: 800 }}>
            보상: +{mission.rewardExp} EXP · +{mission.rewardCoin || 10} COIN
          </div>
        </div>
      </div>

      <div>
        {isClaimed ? (
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700 }}>
            수령 완료
          </span>
        ) : isSuccess ? (
          <button
            onClick={() => onClaim && onClaim(mission)}
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
            리워드 받기 🎉
          </button>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
            진행 중
          </span>
        )}
      </div>
    </div>
  );
}
