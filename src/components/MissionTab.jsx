import React, { useState } from 'react';
import { Target, Sparkles, Flame, CheckCircle2, Award } from 'lucide-react';
import MissionCard from './common/MissionCard';

export default function MissionTab({ user, quests, onClaimReward }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'daily' | 'weekly' | 'monthly'

  const filteredQuests = quests.filter(q => {
    if (filterType === 'all') return true;
    return q.type === filterType;
  });

  const successCount = quests.filter(q => q.status === 'success').length;
  const claimedCount = quests.filter(q => q.status === 'claimed').length;

  return (
    <div className="mission-screen">
      {/* 헤더 & 진행 상황 */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
        border: '1px solid #DBEAFE',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🎯</span>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)' }}>
              SOBIMON 미션 센터
            </h3>
          </div>
          <div style={{
            background: 'var(--primary-pastel)',
            color: 'var(--primary)',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 800,
            border: '1px solid #BFDBFE'
          }}>
            {claimedCount}/{quests.length} 완료됨
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          미션을 수행하고 절약하여 대량의 EXP와 COIN을 획득하세요!
        </p>

        {successCount > 0 && (
          <div style={{
            marginTop: '10px',
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#15803D',
            fontWeight: 700
          }}>
            <Sparkles size={14} />
            <span>수령 가능한 리워드가 {successCount}개 있습니다! 지금 받아보세요.</span>
          </div>
        )}
      </div>

      {/* 필터 칩 */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '14px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'all', label: '전체' },
          { id: 'daily', label: '일일 미션' },
          { id: 'weekly', label: '주간 미션' },
          { id: 'monthly', label: '월간 미션' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilterType(item.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: filterType === item.id ? 'var(--primary)' : 'var(--border-subtle)',
              background: filterType === item.id ? 'var(--primary)' : '#FFFFFF',
              color: filterType === item.id ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: filterType === item.id ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 미션 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredQuests.map(q => (
          <MissionCard 
            key={q.id}
            mission={q}
            onClaim={onClaimReward}
          />
        ))}
      </div>
    </div>
  );
}
