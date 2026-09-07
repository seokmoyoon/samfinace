import React, { useState } from 'react';
import { ChevronLeft, Check, Sparkles, Trophy } from 'lucide-react';
import { SobimonMascot, TreasureBoxIllustration } from './common/SobimonIllustrations';

export default function MissionTab({ user, quests = [], onClaimReward }) {
  const [period, setPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  // 시안 스타일의 기본 미션 목록 (실제 퀘스트 데이터와 통합 매핑)
  const defaultMissions = {
    daily: [
      {
        id: 'm_daily_1',
        title: '오늘 소비 30,000원 이하',
        current: 18000,
        target: 30000,
        status: 'progress', // 'progress' | 'completed' | 'claimed'
        rewardExp: 20,
        rewardCoin: 30,
        iconBg: '#FEF3C7',
        iconColor: '#F59E0B'
      },
      {
        id: 'm_daily_2',
        title: '불필요한 소비 0원',
        current: 0,
        target: 0,
        status: 'completed',
        rewardExp: 30,
        rewardCoin: 10,
        iconBg: '#DCFCE7',
        iconColor: '#10B981'
      },
      {
        id: 'm_daily_3',
        title: '소비 1건 기록하기',
        current: 1,
        target: 1,
        status: 'completed',
        rewardExp: 10,
        rewardCoin: 5,
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6'
      }
    ],
    weekly: [
      {
        id: 'm_weekly_1',
        title: '배달음식 3회 이하로 주문하기',
        current: 1,
        target: 3,
        status: 'progress',
        rewardExp: 100,
        rewardCoin: 50,
        iconBg: '#FEE2E2',
        iconColor: '#EF4444'
      },
      {
        id: 'm_weekly_2',
        title: '무지출 데이 2일 달성하기',
        current: 2,
        target: 2,
        status: 'completed',
        rewardExp: 150,
        rewardCoin: 80,
        iconBg: '#DCFCE7',
        iconColor: '#10B981'
      }
    ],
    monthly: [
      {
        id: 'm_monthly_1',
        title: '이번 달 예산 내에서 완주하기',
        current: 1284000,
        target: 1800000,
        status: 'progress',
        rewardExp: 500,
        rewardCoin: 200,
        iconBg: '#EDE9FE',
        iconColor: '#8B5CF6'
      }
    ]
  };

  const currentList = defaultMissions[period] || defaultMissions.daily;

  return (
    <div className="mission-screen-sobimon" style={{ paddingBottom: '20px' }}>
      
      {/* 상단 헤더: < 미션 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>
          미션
        </h3>
      </div>

      {/* 1. 일일 / 주간 / 월간 세그먼트 버튼 */}
      <div style={{
        display: 'flex',
        background: '#F1F5F9',
        padding: '4px',
        borderRadius: '9999px',
        marginBottom: '18px'
      }}>
        {[
          { id: 'daily', label: '일일' },
          { id: 'weekly', label: '주간' },
          { id: 'monthly', label: '월간' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setPeriod(item.id)}
            style={{
              flex: 1,
              padding: '8px 0',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              background: period === item.id ? '#2563EB' : 'transparent',
              color: period === item.id ? '#FFFFFF' : '#64748B',
              boxShadow: period === item.id ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 2. 미션 카드 목록 (시안 반영) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
        {currentList.map((m) => {
          const isCompleted = m.status === 'completed';
          const percent = m.target > 0 ? Math.min(100, Math.round((m.current / m.target) * 100)) : 100;

          return (
            <div
              key={m.id}
              className="sobimon-card"
              style={{
                marginBottom: 0,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: isCompleted ? '1.5px solid #BBF7D0' : '1px solid #E2E8F0'
              }}
            >
              {/* 좌측 동그란 컬러 아이콘 */}
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: m.iconBg,
                color: m.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {isCompleted ? <Check size={20} strokeWidth={3} /> : <Trophy size={20} />}
              </div>

              {/* 중앙 미션 정보 & 진행바 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.title}
                  </span>
                  
                  {/* 상태 배지 */}
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: isCompleted ? '#DCFCE7' : '#EFF6FF',
                    color: isCompleted ? '#15803D' : '#2563EB'
                  }}>
                    {isCompleted ? '완료' : '진행중'}
                  </span>
                </div>

                {/* 진행 금액 / 수치 */}
                {m.target > 0 && (
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{
                      width: '100%',
                      height: '5px',
                      background: '#F1F5F9',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      marginBottom: '3px'
                    }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: isCompleted ? '#10B981' : '#3B82F6',
                        borderRadius: '9999px'
                      }} />
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>
                      ₩ {m.current.toLocaleString()} / {m.target.toLocaleString()}
                    </div>
                  </div>
                )}

                {/* 보상 배지 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#0284C7' }}>
                    ⭐ +{m.rewardExp} EXP
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706' }}>
                    🪙 +{m.rewardCoin} COIN
                  </span>
                </div>
              </div>

              {/* 완료 시 보상 받기 버튼 인터랙션 */}
              {isCompleted && (
                <button
                  onClick={() => onClaimReward && onClaimReward(m)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10B981',
                    color: '#FFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  수령
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. 하단 프로모션 배너 (시안 반영) */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #FEF3C7 100%)',
        borderRadius: '20px',
        border: '1px solid #DBEAFE',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)'
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#1E293B', marginBottom: '4px' }}>
            미션을 클리어하고<br />보상을 받아보세요!
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
            매일 자정에 새로운 미션 충전
          </div>
        </div>

        {/* 보물상자 또는 마스코트 일러스트 */}
        <div style={{ flexShrink: 0 }}>
          <TreasureBoxIllustration size={56} />
        </div>
      </div>

    </div>
  );
}
