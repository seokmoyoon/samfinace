import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import {
  SobimonMascot,
  CafeMonsterIllustration,
  FoodMonsterIllustration,
  ShopMonsterIllustration,
  SaverMonsterIllustration
} from './common/SobimonIllustrations';
import SobimonHoloCardModal from './common/SobimonHoloCardModal';

export default function SobimonDexTab({ user, sobimons = [] }) {
  const [filterRarity, setFilterRarity] = useState('all'); // 'all' | 'normal' | 'rare' | 'epic' | 'legend'
  const [selectedHoloMonster, setSelectedHoloMonster] = useState(null);

  // 공식 10종 소비몬 + 미스터리 도감 데이터
  const dexList = [
    {
      id: 'saver',
      name: '절약몬',
      typeName: '절약 속성',
      level: 1,
      rarity: 'normal',
      discovered: true,
      characterImage: '/images/sobimon/characters/savermon.png',
      cardImage: '/images/sobimon/sobicard-savermon.png',
      bg: '#FEF9C3',
      border: '#FDE047',
      typeBg: '#FEF08A',
      typeColor: '#854D0E',
      condition: '한 달 동안 불필요한 소비 0원'
    },
    {
      id: 'cafe',
      name: '카페몬',
      typeName: '카페 속성',
      level: 3,
      rarity: 'normal',
      discovered: true,
      characterImage: '/images/sobimon/characters/cafemon.png',
      cardImage: '/images/sobimon/sobicard-cafemon.png',
      bg: '#FFFBEB',
      border: '#FDE68A',
      typeBg: '#FEF3C7',
      typeColor: '#92400E',
      condition: '이번 달 카페 소비 10만원 이상'
    },
    {
      id: 'card',
      name: '카드몬',
      typeName: '카드 속성',
      level: 3,
      rarity: 'rare',
      discovered: true,
      characterImage: '/images/sobimon/characters/cardmon.png',
      cardImage: '/images/sobimon/sobicard-savermon.png',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      typeBg: '#EDE9FE',
      typeColor: '#6D28D9',
      condition: '이번 달 카드 사용 20만원 이상'
    },
    {
      id: 'traffic',
      name: '교통몬',
      typeName: '교통 속성',
      level: 4,
      rarity: 'normal',
      discovered: true,
      characterImage: '/images/sobimon/characters/trafficmon.png',
      cardImage: '/images/sobimon/sobicard-cafemon.png',
      bg: '#F0F9FF',
      border: '#BAE6FD',
      typeBg: '#E0F2FE',
      typeColor: '#0369A1',
      condition: '이번 달 교통비 10만원 이상'
    },
    {
      id: 'delivery',
      name: '배달몬',
      typeName: '배달 속성',
      level: 4,
      rarity: 'rare',
      discovered: true,
      characterImage: '/images/sobimon/characters/deliverymon.png',
      cardImage: '/images/sobimon/sobicard-cafemon.png',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      typeBg: '#DBEAFE',
      typeColor: '#1D4ED8',
      condition: '이번 달 배달비 5만원 이상'
    },
    {
      id: 'food',
      name: '식비몬',
      typeName: '식비 속성',
      level: 5,
      rarity: 'normal',
      discovered: true,
      characterImage: '/images/sobimon/characters/foodmon.png',
      cardImage: '/images/sobimon/sobicard-foodmon.png',
      bg: '#FFF7ED',
      border: '#FED7AA',
      typeBg: '#FFEDD5',
      typeColor: '#C2410C',
      condition: '이번 달 식비 20만원 이상'
    },
    {
      id: 'shop',
      name: '쇼핑몬',
      typeName: '쇼핑 속성',
      level: 5,
      rarity: 'rare',
      discovered: true,
      characterImage: '/images/sobimon/characters/shopmon.png',
      cardImage: '/images/sobimon/sobicard-shopmon.png',
      bg: '#FEF2F2',
      border: '#FECACA',
      typeBg: '#FEE2E2',
      typeColor: '#B91C1C',
      condition: '이번 달 쇼핑 소비 15만원 이상'
    },
    {
      id: 'saving',
      name: '저축몬',
      typeName: '저축 속성',
      level: 6,
      rarity: 'epic',
      discovered: true,
      characterImage: '/images/sobimon/characters/savingmon.png',
      cardImage: '/images/sobimon/sobicard-savingmon.png',
      bg: '#F0FDF4',
      border: '#BBF7D0',
      typeBg: '#DCFCE7',
      typeColor: '#15803D',
      condition: '저축 목표 달성'
    },
    {
      id: 'impulse',
      name: '충동소비몬',
      typeName: '충동 속성',
      level: 7,
      rarity: 'epic',
      discovered: true,
      characterImage: '/images/sobimon/characters/impulsemon.png',
      cardImage: '/images/sobimon/sobicard-shopmon.png',
      bg: '#FAF5FF',
      border: '#E9D5FF',
      typeBg: '#F3E8FF',
      typeColor: '#7E22CE',
      condition: '하루 3건 이상 소비 기록'
    },
    {
      id: 'growth',
      name: '성장몬',
      typeName: '성장 속성',
      level: 10,
      rarity: 'legend',
      discovered: true,
      characterImage: '/images/sobimon/characters/growthmon.png',
      cardImage: '/images/sobimon/sobicard-savingmon.png',
      bg: '#F0FDFA',
      border: '#99F6E4',
      typeBg: '#CCFBF1',
      typeColor: '#0F766E',
      condition: '모든 미션 클리어'
    },
    {
      id: 'hidden_1',
      name: '???',
      typeName: '미스터리',
      level: null,
      rarity: 'legend',
      discovered: false,
      characterImage: null,
      cardImage: null,
      bg: '#F8FAFC',
      border: '#E2E8F0',
      typeBg: '#F1F5F9',
      typeColor: '#94A3B8',
      condition: '숨겨진 특별 조건 달성'
    }
  ];

  const filteredList = dexList.filter(item => {
    if (filterRarity === 'all') return true;
    return item.rarity === filterRarity;
  });

  return (
    <div className="dex-screen-sobimon" style={{ paddingBottom: '20px' }}>

      {/* 상단 헤더: < 소비몬 도감 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>
          소비몬 도감
        </h3>
      </div>

      {/* 1. 전체 / 일반 / 고급 / 희귀 / 전설 필터 칩 */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '18px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'all', label: '전체' },
          { id: 'normal', label: '일반' },
          { id: 'rare', label: '고급' },
          { id: 'epic', label: '희귀' },
          { id: 'legend', label: '전설' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilterRarity(item.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: filterRarity === item.id ? '#2563EB' : '#E2E8F0',
              background: filterRarity === item.id ? '#2563EB' : '#FFFFFF',
              color: filterRarity === item.id ? '#FFFFFF' : '#64748B',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filterRarity === item.id ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 2. 소비몬 그리드 카드 (포켓몬 도감 스타일 - 캐릭터 단독 썸네일) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {filteredList.map((mon) => (
          <div
            key={mon.id}
            onClick={() => {
              if (mon.discovered) {
                setSelectedHoloMonster(mon);
              } else {
                alert('아직 발견되지 않은 미스터리 소비몬입니다! 지출을 기록하여 발견해보세요 🔍');
              }
            }}
            style={{
              background: mon.bg,
              border: `1.5px solid ${mon.border}`,
              borderRadius: '18px',
              padding: '12px 6px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* 캐릭터 단독 썸네일 (카드 프레임 대신 순수 캐릭터 일러스트) */}
            {mon.discovered && mon.characterImage ? (
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '18px',
                background: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={mon.characterImage} 
                  alt={mon.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    transform: 'scale(1.05)'
                  }} 
                />
              </div>
            ) : (
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '18px',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.4
              }}>
                <HelpCircle size={28} color="#94A3B8" />
              </div>
            )}

            {/* 소비몬 이름 및 속성/레벨 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', width: '100%' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 900,
                color: mon.discovered ? '#0F172A' : '#94A3B8'
              }}>
                {mon.name}
              </span>

              {mon.discovered ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    background: mon.typeBg,
                    color: mon.typeColor,
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap'
                  }}>
                    {mon.typeName}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#64748B'
                  }}>
                    Lv.{mon.level}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 600 }}>미발견</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. 하단 CTA 다크 배너: "더 많은 소비몬을 만나보세요! >" */}
      <div
        className="sobimon-card-banner"
        onClick={() => setSelectedHoloMonster(dexList[1])} // 카페몬 홀로 카드 미리보기
        style={{
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <SobimonMascot size={26} emotion="joy" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800 }}>
            카드 터치하여 3D 홀로그램 포켓몬 카드 보기 ✨
          </span>
        </div>
        <ChevronRight size={16} color="#94A3B8" />
      </div>

      {/* 4. 3D 인터랙티브 홀로그램 포켓몬 TCG 카드 모달 */}
      <SobimonHoloCardModal
        isOpen={!!selectedHoloMonster}
        onClose={() => setSelectedHoloMonster(null)}
        monster={selectedHoloMonster}
      />

    </div>
  );
}
