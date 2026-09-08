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

  // 시안 기준의 대표 소비몬 그리드 데이터
  const dexList = [
    {
      id: 'food',
      name: '식비몬',
      level: 5,
      rarity: 'normal',
      discovered: true,
      component: <FoodMonsterIllustration size={44} />,
      bg: '#FFF7ED',
      border: '#FED7AA'
    },
    {
      id: 'cafe',
      name: '카페몬',
      level: 3,
      rarity: 'normal',
      discovered: true,
      component: <CafeMonsterIllustration size={44} />,
      bg: '#EFF6FF',
      border: '#BFDBFE'
    },
    {
      id: 'shop',
      name: '쇼핑몬',
      level: 6,
      rarity: 'rare',
      discovered: true,
      component: <ShopMonsterIllustration size={44} />,
      bg: '#FDF2F8',
      border: '#FBCFE8'
    },
    {
      id: 'saving',
      name: '저축몬',
      level: 6,
      rarity: 'epic',
      discovered: true,
      component: (
        <div style={{ fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🪙
        </div>
      ),
      bg: '#FEFCE8',
      border: '#FEF08A'
    },
    {
      id: 'saver',
      name: '절약몬',
      level: 4,
      rarity: 'epic',
      discovered: true,
      component: <SaverMonsterIllustration size={44} />,
      bg: '#ECFDF5',
      border: '#A7F3D0'
    },
    {
      id: 'hidden_1',
      name: '???',
      level: null,
      rarity: 'legend',
      discovered: false,
      component: (
        <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HelpCircle size={32} />
        </div>
      ),
      bg: '#F8FAFC',
      border: '#E2E8F0'
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

      {/* 2. 소비몬 그리드 카드 (모바일 3열, 아이패드 태블릿 반응형 확장) */}
      <div className="sobimon-dex-grid">
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
              padding: '14px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              transition: 'transform 0.15s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* 캐릭터 이미지 / 실루엣 */}
            <div style={{
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: mon.discovered ? 1 : 0.4
            }}>
              {mon.component}
            </div>

            {/* 소비몬 이름 */}
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              color: mon.discovered ? '#0F172A' : '#94A3B8'
            }}>
              {mon.name}
            </span>

            {/* 레벨 뱃지 */}
            {mon.discovered && mon.level && (
              <span style={{
                fontSize: '10px',
                color: '#64748B',
                fontWeight: 700
              }}>
                Lv.{mon.level}
              </span>
            )}
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
