import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';

import {
  FairytaleHeroBackground,
  SobimonMascot,
  CafeMonsterIllustration,
  FoodMonsterIllustration,
  ShopMonsterIllustration
} from './common/SobimonIllustrations';

const getCurrentMonthKey = () => new Date().toLocaleDateString('sv-SE').slice(0, 7);

export default function HomeTab({
  user,
  budget,
  transactions = [],
  quests = [],
  sobimons = [],
  onNavigateTab,
  onOpenQuickAdd
}) {
  const currentMonthKey = getCurrentMonthKey();
  const monthlyExpenses = transactions.filter((t) =>
    t?.type !== 'income' && String(t?.date || '').startsWith(currentMonthKey)
  );

  const displaySpent = monthlyExpenses.reduce((sum, tx) => sum + Number(tx?.amount || 0), 0);
  const targetBudget = Number(budget?.monthlyBudget || 0);
  const hasBudget = targetBudget > 0;
  const spentPercent = hasBudget
    ? Math.min(100, Math.round((displaySpent / targetBudget) * 100))
    : 0;
  const remainingBudget = hasBudget ? Math.max(0, targetBudget - displaySpent) : 0;

  let speechText = '첫 소비를 기록해보세요!';
  if (!hasBudget) {
    speechText = '이번 달 예산을 설정해보세요!';
  } else if (displaySpent > 0 && spentPercent > 80) {
    speechText = '예산의 80%를 넘었어요! 절약 모드 가동!';
  } else if (displaySpent > 0) {
    speechText = '이번 달도 잘하고 있어요!';
  }

  const discoveredMonsters = sobimons.filter((m) => m?.discovered).slice(0, 3);
  const discoveredCount = sobimons.filter((m) => m?.discovered).length;
  const cafeMission = quests.find((q) => q?.category?.includes('카페') || q?.title?.includes('카페')) || quests[0] || null;
  const missionTarget = Number(cafeMission?.target || 0);
  const missionCurrent = Number(cafeMission?.current || 0);
  const missionPercent = cafeMission && missionTarget > 0
    ? Math.min(100, Math.round((missionCurrent / missionTarget) * 100))
    : 0;

  const monsterSlots = [
    { key: 'food', bg: '#ECFDF5', border: '#A7F3D0', shadow: 'rgba(16, 185, 129, 0.1)', node: <FoodMonsterIllustration size={38} /> },
    { key: 'cafe', bg: '#EFF6FF', border: '#BFDBFE', shadow: 'rgba(59, 130, 246, 0.1)', node: <CafeMonsterIllustration size={38} /> },
    { key: 'shop', bg: '#FFF1F2', border: '#FECDD3', shadow: 'rgba(244, 63, 94, 0.1)', node: <ShopMonsterIllustration size={38} /> }
  ];

  return (
    <div className="home-screen-sobimon" style={{ paddingBottom: '16px' }}>
      <FairytaleHeroBackground
        user={user}
        speech={speechText}
        onMascotClick={() => {}}
      />

      <div className="home-dashboard-grid">
        <div className="home-grid-left">
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

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
                ₩ {displaySpent.toLocaleString()}
              </div>
              <div style={{
                fontSize: '11px',
                color: hasBudget ? '#64748B' : '#2563EB',
                fontWeight: 700,
                background: '#F1F5F9',
                padding: '3px 8px',
                borderRadius: '9999px'
              }}>
                {hasBudget ? `예산 ${targetBudget.toLocaleString()}` : '예산 설정 필요'}
              </div>
            </div>

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
                {hasBudget ? `${spentPercent}%` : '-'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '10px',
              fontSize: '12px'
            }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>남은 소비 가능 금액</span>
              <span style={{ color: '#0F172A', fontWeight: 900 }}>
                {hasBudget ? `₩ ${remainingBudget.toLocaleString()}` : '-'}
              </span>
            </div>
          </div>

          <div className="home-scenery-deco">
            <img
              src="/images/sobimon/bottom-bridge.png"
              alt="돌다리 풍경"
              onError={(e) => e.currentTarget.style.display = 'none'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <svg
              viewBox="0 0 400 80"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%' }}
            >
              <defs>
                <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#86EFAC" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
                <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7DD3FC" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
              <rect width="400" height="80" fill="url(#grassGrad)" rx="16" />
              <path d="M0 60 Q100 30 200 50 T400 35 L400 80 L0 80 Z" fill="url(#riverGrad)" opacity="0.8" />
              <path d="M140 70 Q200 40 260 70 L250 80 Q200 52 150 80 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="60" cy="30" r="3" fill="#F43F5E" />
              <circle cx="85" cy="42" r="2.5" fill="#F59E0B" />
              <circle cx="320" cy="25" r="3" fill="#EC4899" />
              <circle cx="350" cy="38" r="2.5" fill="#FEF08A" />
            </svg>
          </div>
        </div>

        <div className="home-grid-right">
          <div
            className="sobimon-card home-monsters-card"
            onClick={() => onNavigateTab && onNavigateTab('dex')}
            style={{ cursor: 'pointer' }}
          >
            <div className="sobimon-card-header">
              <div className="sobimon-card-title">
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', background: '#EFF6FF',
                  border: '1.5px solid #3B82F6', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', overflow: 'hidden'
                }}>
                  <SobimonMascot size={22} emotion="joy" />
                </div>
                <span>발견한 소비몬 <strong style={{ color: '#2563EB' }}>{discoveredCount}마리</strong></span>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {discoveredMonsters.length > 0 ? monsterSlots.slice(0, discoveredMonsters.length).map((slot) => (
                  <div key={slot.key} style={{
                    width: '46px', height: '46px', borderRadius: '14px', background: slot.bg,
                    border: `1px solid ${slot.border}`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', boxShadow: `0 2px 6px ${slot.shadow}`
                  }}>
                    {slot.node}
                  </div>
                )) : (
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>아직 발견한 소비몬이 없어요.</span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab && onNavigateTab('dex');
                }}
                style={{
                  padding: '8px 14px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE',
                  borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer'
                }}
              >
                도감 보기
              </button>
            </div>
          </div>

          <div className="sobimon-card home-mission-card">
            <div className="sobimon-card-header">
              <div className="sobimon-card-title">
                <span style={{ color: '#F59E0B', fontSize: '15px' }}>🏆</span>
                <span>오늘의 미션</span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('missions')}
                style={{
                  background: 'transparent', border: 'none', fontSize: '11px', color: '#94A3B8',
                  fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer'
                }}
              >
                더보기 <ChevronRight size={14} />
              </button>
            </div>

            {cafeMission ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                    {cafeMission.title}
                  </div>

                  <div style={{ width: '100%', height: '7px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{
                      width: `${missionPercent}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                      borderRadius: '9999px'
                    }} />
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '8px' }}>
                    ₩ {missionCurrent.toLocaleString()} / {missionTarget.toLocaleString()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-flex', background: '#FEF3C7', color: '#B45309', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px' }}>
                      ⭐ +{Number(cafeMission.rewardExp || 0)} EXP
                    </span>
                    <span style={{ display: 'inline-flex', background: '#FEF3C7', color: '#B45309', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px' }}>
                      🪙 +{Number(cafeMission.rewardCoin || 0)} COIN
                    </span>
                  </div>
                </div>

                <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CafeMonsterIllustration size={60} />
                </div>
              </div>
            ) : (
              <div style={{ padding: '10px 0 4px', fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>
                아직 진행 중인 미션이 없어요.
              </div>
            )}
          </div>

          <button
            className="sobimon-main-cta-btn home-cta-btn"
            onClick={() => onOpenQuickAdd && onOpenQuickAdd()}
          >
            <Plus size={20} strokeWidth={3} />
            <span>소비 기록하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
