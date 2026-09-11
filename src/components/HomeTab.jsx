import React, { useState } from 'react';
import {
  ChevronRight,
  Plus,
  Bell,
  Award,
  Sparkles,
  TrendingDown
} from 'lucide-react';

import {
  FairytaleHeroBackground,
  FairytaleBottomBackground,
  SobimonMascot,
  CafeMonsterIllustration,
  FoodMonsterIllustration,
  ShopMonsterIllustration,
  SaverMonsterIllustration
} from './common/SobimonIllustrations';
import { geminiAiService } from '../services/geminiAiService';


export default function HomeTab({
  user,
  budget,
  transactions,
  quests = [],
  sobimons = [],
  onNavigateTab,
  onOpenQuickAdd,
  onClaimReward,
  onOpenGymArena,
  onOpenAIChat
}) {
  const totalSpent = transactions
    .filter(t => t.type !== 'income')
    .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

  // 실제 DB 기반 실시간 소비액 및 예산
  const displaySpent = totalSpent;
  const targetBudget = budget?.monthlyBudget > 0 ? budget.monthlyBudget : 1000000;
  const spentPercent = targetBudget > 0 ? Math.min(100, Math.round((displaySpent / targetBudget) * 100)) : 0;
  const remainingBudget = Math.max(0, targetBudget - displaySpent);

  // 캐릭터 AI 동적 말풍선 대사 (Gemini 비동기 생성)
  const [speechText, setSpeechText] = useState('소비몬을 터치해 AI 재정 코칭을 받아보세요! 💬');


  React.useEffect(() => {
    let isMounted = true;
    geminiAiService.generateCharacterSpeech({
      user,
      budget,
      totalSpent,
      recentTransactions: transactions
    }).then((res) => {
      if (isMounted && res) setSpeechText(res);
    });
    return () => { isMounted = false; };
  }, [totalSpent, budget?.monthlyBudget, user?.name]);

  // 이번 달 발견한 소비몬들 (최대 3마리)
  const discoveredMonsters = sobimons.filter(m => m.discovered).slice(0, 3);

  // 오늘의 대표 미션 (카페 소비 또는 첫 번째 일일 미션)
  const cafeMission = quests.find(q => q.category?.includes('카페') || q.title?.includes('카페')) || quests[0] || {
    id: 'm_cafe_demo',
    title: '카페 소비 10,000원 이하',
    current: 0,
    target: 10000,
    rewardExp: 50,
    rewardCoin: 10,
    status: 'progress'
  };

  const missionPercent = cafeMission.target > 0 ? Math.min(100, Math.round((cafeMission.current / cafeMission.target) * 100)) : 0;

  return (
    <div className="home-screen-sobimon" style={{ paddingBottom: '16px' }}>

      {/* 1. 첨부 이미지와 동일한 1번 전체 배경 (프로필 + 성 + 2번 캐릭터 + 말풍선 통합) */}
      <FairytaleHeroBackground
        user={user}
        speech={speechText}
        onMascotClick={onOpenAIChat}
      />

      {/* 2~7. 메인 대시보드 카드 영역 (모바일/PC폰목업: 1열 스택 / 아이패드 태블릿: 2열 대시보드) */}
      <div className="home-dashboard-grid">
        {/* 좌측 그리드: 이번 달 소비 카드 + 풍경 데코 */}
        <div className="home-grid-left">
          {/* 2. 이번 달 소비 카드 (시안 메인 금융 카드 - 1번 배경과 자연스럽게 오버랩) */}
          <div
            className="sobimon-card home-spending-card"
            onClick={() => onNavigateTab && onNavigateTab('spending')}
            style={{ cursor: 'pointer', position: 'relative', zIndex: 15 }}
          >
            <div className="sobimon-card-header">
              <div className="sobimon-card-title">
                <span style={{ color: '#F59E0B', fontSize: '15px' }}>⭐</span>
                <span>이번 달 소비</span>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            {/* 메인 지출 금액 & 예산 */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
                ₩ {displaySpent.toLocaleString()}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#64748B',
                fontWeight: 700,
                background: '#F1F5F9',
                padding: '3px 8px',
                borderRadius: '9999px'
              }}>
                예산 {targetBudget.toLocaleString()}
              </div>
            </div>

            {/* 프로그레스 바 (에메랄드 ~ 스카이블루 그라디언트) + 퍼센트 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                flex: 1,
                height: '10px',
                background: '#F1F5F9',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${spentPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981 0%, #34D399 40%, #38BDF8 100%)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7', minWidth: '32px', textAlign: 'right' }}>
                {spentPercent}%
              </span>
            </div>

            {/* 남은 소비 가능 금액 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '10px',
              fontSize: '12px'
            }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>남은 소비 가능 금액</span>
              <span style={{ color: '#0F172A', fontWeight: 900 }}>₩ {remainingBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 우측 그리드: 발견한 소비몬 + 오늘의 미션 + CTA 버튼 */}
        <div className="home-grid-right">
          {/* 4. 이번 달에 발견한 소비몬 카드 */}
          <div
            className="sobimon-card home-monsters-card"
            onClick={() => onNavigateTab && onNavigateTab('dex')}
            style={{ cursor: 'pointer' }}
          >
            <div className="sobimon-card-header">
              <div className="sobimon-card-title">
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  border: '1.5px solid #3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <SobimonMascot size={22} emotion="joy" />
                </div>
                <span>이번 달에 발견한 소비몬 <strong style={{ color: '#2563EB' }}>3마리</strong></span>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            {/* 소비몬 3마리 썸네일 & 도감 보기 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* 그린/외식몬 */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.1)'
                }}>
                  <FoodMonsterIllustration size={38} />
                </div>

                {/* 블루/카페몬 */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(59, 130, 246, 0.1)'
                }}>
                  <CafeMonsterIllustration size={38} />
                </div>

                {/* 레드/쇼핑몬 */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: '#FFF1F2',
                  border: '1px solid #FECDD3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(244, 63, 94, 0.1)'
                }}>
                  <ShopMonsterIllustration size={38} />
                </div>
              </div>

              {/* 도감 보기 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab && onNavigateTab('dex');
                }}
                style={{
                  padding: '8px 14px',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  border: '1px solid #BFDBFE',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                도감 보기
              </button>
            </div>
          </div>

          {/* 5. 오늘의 미션 카드 */}
          <div className="sobimon-card home-mission-card">
            <div className="sobimon-card-header">
              <div className="sobimon-card-title">
                <span style={{ color: '#F59E0B', fontSize: '15px' }}>🏆</span>
                <span>오늘의 미션</span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('missions')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '11px',
                  color: '#94A3B8',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  cursor: 'pointer'
                }}
              >
                더보기 <ChevronRight size={14} />
              </button>
            </div>

            {/* 미션 내용 및 우측 카페몬 일러스트 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                  {cafeMission.title}
                </div>

                {/* 프로그레스 바 */}
                <div style={{
                  width: '100%',
                  height: '7px',
                  background: '#F1F5F9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    width: `${missionPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                    borderRadius: '9999px'
                  }} />
                </div>

                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '8px' }}>
                  ₩ {cafeMission.current?.toLocaleString()} / {cafeMission.target?.toLocaleString()}
                </div>

                {/* 보상 배지 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    background: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '9999px'
                  }}>
                    ⭐ +{cafeMission.rewardExp} EXP
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    background: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '9999px'
                  }}>
                    🪙 +{cafeMission.rewardCoin || 10} COIN
                  </span>
                </div>
              </div>

              {/* 우측 카페몬 일러스트 */}
              <div style={{
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CafeMonsterIllustration size={60} />
              </div>
            </div>
          </div>

          {/* 6. 시안의 메인 CTA: + 소비 기록하기 버튼 */}
          {/* <button
            className="sobimon-main-cta-btn home-cta-btn"
            onClick={() => onOpenQuickAdd && onOpenQuickAdd('2026-09-07')}
          >
            <Plus size={20} strokeWidth={3} />
            <span>소비 기록하기</span>
          </button> */}
        </div>
      </div>

      {/* 7. 상단 fairytale-hero-container와 대칭되는 하단 풍경 이미지 (full-width) */}
      {/* <FairytaleBottomBackground /> */}
    </div>
  );
}

