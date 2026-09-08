import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import { CafeMonsterIllustration } from './common/SobimonIllustrations';

export default function ReportTab({ transactions = [], budget, currentUser, onSwitchToPCMode }) {
  const [period, setPeriod] = useState('current'); // 'current' (이번 달) | 'last' (지난 달)

  // 소비(수입 제외)만 필터링
  const expenseList = transactions.filter(t => t.type !== 'income');
  const actualTotal = expenseList.reduce((acc, cur) => acc + cur.amount, 0);

  // 시안 기준 표시 총액 (기본 1,284,000원)
  const totalSpent = actualTotal > 0 ? actualTotal : 1284000;

  // 카테고리별 통계 (시안 비율 매핑)
  const categories = [
    { name: '식비', percent: 32, amount: Math.round(totalSpent * 0.32), color: '#F97316' },
    { name: '카페', percent: 18, amount: Math.round(totalSpent * 0.18), color: '#06B6D4' },
    { name: '교통', percent: 12, amount: Math.round(totalSpent * 0.12), color: '#3B82F6' },
    { name: '쇼핑', percent: 10, amount: Math.round(totalSpent * 0.10), color: '#EC4899' },
    { name: '기타', percent: 28, amount: Math.round(totalSpent * 0.28), color: '#F59E0B' },
  ];

  // SVG 도넛 차트 계산 (둘레: 2 * PI * r)
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  // 최근 소비 패턴 가상 막대 데이터 (7일간)
  const weeklyPattern = [
    { day: '25', value: 35, color: '#CBD5E1' },
    { day: '26', value: 50, color: '#F59E0B' },
    { day: '27', value: 65, color: '#38BDF8' },
    { day: '28', value: 90, color: '#06B6D4' },
    { day: '29', value: 75, color: '#3B82F6' },
    { day: '30', value: 45, color: '#F97316' },
    { day: '31', value: 60, color: '#3B82F6' }
  ];

  return (
    <div className="report-screen-sobimon" style={{ paddingBottom: '20px' }}>
      
      {/* 상단 헤더: < 소비 분석 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>
          소비 분석
        </h3>
      </div>

      {/* 1. 이번 달 / 지난 달 토글 알약 버튼 */}
      <div style={{
        display: 'flex',
        background: '#F1F5F9',
        padding: '4px',
        borderRadius: '9999px',
        width: '200px',
        margin: '0 auto 20px'
      }}>
        <button
          onClick={() => setPeriod('current')}
          style={{
            flex: 1,
            padding: '7px 0',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: period === 'current' ? '#2563EB' : 'transparent',
            color: period === 'current' ? '#FFFFFF' : '#64748B',
            boxShadow: period === 'current' ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          이번 달
        </button>
        <button
          onClick={() => setPeriod('last')}
          style={{
            flex: 1,
            padding: '7px 0',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: period === 'last' ? '#2563EB' : 'transparent',
            color: period === 'last' ? '#FFFFFF' : '#64748B',
            boxShadow: period === 'last' ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          지난 달
        </button>
      </div>

      {/* 2. 도넛 차트 & 카테고리별 범례 카드 */}
      <div className="sobimon-card" style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          
          {/* 좌측: SVG 도넛 차트 (중앙에 총 소비 금액) */}
          <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
            <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="18"
              />
              {categories.map((cat, idx) => {
                const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += cat.percent;

                return (
                  <circle
                    key={idx}
                    cx="75"
                    cy="75"
                    r={radius}
                    fill="none"
                    stroke={cat.color}
                    strokeWidth="18"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                );
              })}
            </svg>

            {/* 도넛 중앙 텍스트 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '90px'
            }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>총 소비</div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', lineHeight: '1.2' }}>
                ₩ {totalSpent.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 우측: 범례 목록 (식비, 카페, 교통, 쇼핑, 기타) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                  <span style={{ color: '#475569', fontWeight: 700 }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{cat.percent}%</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{cat.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 🌟 체육관 PC버전 이동 배너 (참고 디자인 시안 A 반영) */}
      <div 
        onClick={onSwitchToPCMode}
        role="button"
        tabIndex={0}
        style={{
          marginTop: '14px',
          marginBottom: '16px',
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1.5px solid #FDE68A',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.12)',
          backgroundImage: 'url(/images/banner_gym_pc.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          minHeight: '130px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '16px 18px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.22)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.12)';
        }}
      >
        {/* 왼쪽 텍스트 오버레이 영역 (가독성을 위한 반투명 소프트 그라데이션) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '65%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(254, 252, 246, 0.96) 0%, rgba(254, 252, 246, 0.85) 65%, rgba(254, 252, 246, 0) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* 텍스트 컨텐츠 */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '62%' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: currentUser ? '#FEF3C7' : '#EFF6FF',
            color: currentUser ? '#B45309' : '#1D4ED8',
            fontSize: '10px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '9999px',
            marginBottom: '6px'
          }}>
            <span>{currentUser ? '⚡ PC 와이드 아레나' : '🔒 로그인 회원 전용'}</span>
          </div>

          <h4 style={{
            fontSize: '16px',
            fontWeight: 900,
            color: '#0F172A',
            margin: '0 0 4px 0',
            letterSpacing: '-0.3px',
            lineHeight: 1.25
          }}>
            소비 체육관 가기
          </h4>

          <p style={{
            fontSize: '11px',
            color: '#64748B',
            fontWeight: 600,
            margin: '0 0 10px 0',
            lineHeight: 1.3
          }}>
            {currentUser 
              ? '소비몬을 훈련하고 3단 분석 대시보드로 배틀!' 
              : '로그인하고 PC 3단 아레나 체육관에 입장하세요!'}
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#2563EB',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 12px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
          }}>
            <span>{currentUser ? 'PC ver 바로가기' : '로그인 후 입장하기'}</span>
            <span style={{ fontSize: '10px' }}>➔</span>
          </div>
        </div>
      </div>

      {/* 3 & 4. 하단 소비 분석 세부 카드 (태블릿 2열 그리드 반응형) */}
      <div className="report-sub-grid">
        {/* 3. 가장 강력한 소비몬 카드 (시안 반영) */}
        <div className="sobimon-card">
          <div className="sobimon-card-header" style={{ marginBottom: '8px' }}>
            <div className="sobimon-card-title">
              <span style={{ color: '#8B5CF6', fontSize: '14px' }}>👾</span>
              <span>가장 강력한 소비몬</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CafeMonsterIllustration size={50} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A' }}>카페몬</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    background: '#F3E8FF',
                    color: '#7E22CE',
                    padding: '2px 6px',
                    borderRadius: '9999px'
                  }}>
                    Lv.3
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>
                    ₩ 184,000
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1px'
                  }}>
                    ▲ 23%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. 최근 소비 패턴 카드 (시안 하단 막대 차트) */}
        <div className="sobimon-card">
          <div className="sobimon-card-header" style={{ marginBottom: '12px' }}>
            <div className="sobimon-card-title">
              <span>최근 소비 패턴</span>
            </div>
            <button style={{
              background: 'transparent',
              border: 'none',
              fontSize: '11px',
              color: '#94A3B8',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              더보기 &gt;
            </button>
          </div>

          {/* 막대 차트 영역 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '80px',
            padding: '0 10px',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '8px'
          }}>
            {weeklyPattern.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '18px',
                  height: `${item.value}px`,
                  background: item.color,
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 0.3s ease'
                }} />
                <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
