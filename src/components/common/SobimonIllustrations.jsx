import React from 'react';
import SobimonImg from './SobimonImg';

/**
 * SOBIMON 시안의 공식 시그니처 마스코트 캐릭터
 * public/images/sobimon/mascot-*.png 이미지를 우선 로드하고, 없을 시 완성형 SVG 벡터 렌더링
 */
export function SobimonMascot({ size = 120, emotion = 'happy', className = '' }) {
  // 표정에 따른 이미지 파일명 매핑
  const imageNameMap = {
    happy: 'mascot-main',
    joy: 'mascot-happy',
    surprised: 'mascot-surprised',
    sad: 'mascot-sad',
    angry: 'mascot-angry'
  };

  const imageName = imageNameMap[emotion] || 'mascot-main';

  // 표정에 따른 눈/입 변화 SVG
  const renderFace = () => {
    switch (emotion) {
      case 'joy':
        return (
          <>
            <path d="M48 68 Q54 60 60 68" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M76 68 Q82 60 88 68" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <ellipse cx="44" cy="74" rx="6" ry="3.5" fill="#FDA4AF" opacity="0.8" />
            <ellipse cx="92" cy="74" rx="6" ry="3.5" fill="#FDA4AF" opacity="0.8" />
            <path d="M62 73 Q68 83 74 73 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
          </>
        );
      case 'surprised':
        return (
          <>
            <circle cx="53" cy="67" r="5" fill="#1E293B" />
            <circle cx="83" cy="67" r="5" fill="#1E293B" />
            <ellipse cx="44" cy="73" rx="5" ry="3" fill="#FDA4AF" opacity="0.7" />
            <ellipse cx="92" cy="73" rx="5" ry="3" fill="#FDA4AF" opacity="0.7" />
            <ellipse cx="68" cy="76" rx="4" ry="6" fill="#1E293B" />
          </>
        );
      case 'sad':
        return (
          <>
            <path d="M48 65 Q54 70 60 65" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M76 65 Q82 70 88 65" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <ellipse cx="44" cy="74" rx="5" ry="3" fill="#93C5FD" opacity="0.8" />
            <ellipse cx="92" cy="74" rx="5" ry="3" fill="#93C5FD" opacity="0.8" />
            <path d="M63 76 Q68 71 73 76" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'angry':
        return (
          <>
            <path d="M48 64 L60 69" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M88 64 L76 69" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="54" cy="69" r="4" fill="#1E293B" />
            <circle cx="82" cy="69" r="4" fill="#1E293B" />
            <ellipse cx="44" cy="74" rx="6" ry="3.5" fill="#FDA4AF" opacity="0.8" />
            <ellipse cx="92" cy="74" rx="6" ry="3.5" fill="#FDA4AF" opacity="0.8" />
            <path d="M63 77 Q68 72 73 77" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'happy':
      default:
        return (
          <>
            <ellipse cx="53" cy="67" rx="5" ry="6" fill="#1E293B" />
            <circle cx="51.5" cy="65" r="2" fill="#FFFFFF" />
            <ellipse cx="83" cy="67" rx="5" ry="6" fill="#1E293B" />
            <circle cx="81.5" cy="65" r="2" fill="#FFFFFF" />
            <ellipse cx="43" cy="73" rx="6.5" ry="4" fill="#FB7185" opacity="0.75" />
            <ellipse cx="93" cy="73" rx="6.5" ry="4" fill="#FB7185" opacity="0.75" />
            <ellipse cx="68" cy="70" rx="3.5" ry="2.5" fill="#1E293B" />
            <path d="M63 74 Q68 81 73 74" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="#F43F5E" />
          </>
        );
    }
  };

  const vectorFallback = (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 136 136" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 4px 10px rgba(37, 99, 235, 0.15))' }}
    >
      <g>
        <ellipse cx="68" cy="126" rx="36" ry="7" fill="#CBD5E1" opacity="0.6" />
        <rect x="22" y="72" width="24" height="32" rx="7" fill="#0284C7" stroke="#1E293B" strokeWidth="3" />
        <rect x="26" y="78" width="16" height="14" rx="4" fill="#38BDF8" />
        <circle cx="34" cy="85" r="4.5" fill="#FCD34D" />
        <circle cx="32.5" cy="83" r="1" fill="#1E293B" />
        <circle cx="35.5" cy="83" r="1" fill="#1E293B" />
        <ellipse cx="48" cy="120" rx="9" ry="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <ellipse cx="88" cy="120" rx="9" ry="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <ellipse cx="68" cy="95" rx="32" ry="26" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
        <ellipse cx="68" cy="98" rx="20" ry="16" fill="#F8FAFC" />
        <ellipse cx="68" cy="68" rx="38" ry="34" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
        <ellipse cx="36" cy="38" rx="10" ry="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
        <ellipse cx="36" cy="38" rx="5.5" ry="5.5" fill="#FDA4AF" />
        <ellipse cx="100" cy="38" rx="10" ry="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
        <ellipse cx="100" cy="38" rx="5.5" ry="5.5" fill="#FDA4AF" />
        <path d="M32 46 C32 20, 104 20, 104 46 C104 54, 32 54, 32 46 Z" fill="#2563EB" stroke="#1E293B" strokeWidth="3.5" />
        <path d="M26 48 C42 40, 94 40, 110 48 C102 56, 34 56, 26 48 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="3" />
        <ellipse cx="68" cy="32" rx="10" ry="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2" />
        <path d="M64 32 Q68 28 72 32" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <circle cx="65" cy="31" r="1.2" fill="#2563EB" />
        <circle cx="71" cy="31" r="1.2" fill="#2563EB" />
        <circle cx="28" cy="54" r="9" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <circle cx="108" cy="54" r="9" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        {renderFace()}
        <ellipse cx="94" cy="98" rx="8" ry="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <circle cx="98" cy="96" r="11" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
        <circle cx="98" cy="96" r="8" fill="#FBBF24" />
        <text x="98" y="100" textAnchor="middle" fontSize="10" fontWeight="900" fill="#92400E">₩</text>
        <ellipse cx="42" cy="98" rx="8" ry="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      </g>
    </svg>
  );

  return (
    <SobimonImg
      name={imageName}
      width={size}
      height={size}
      className={className}
      alt={`소비몬 마스코트 (${emotion})`}
      fallback={vectorFallback}
    />
  );
}

/**
 * 시안 홈 상단의 아름다운 동화풍 풍경 배경 SVG
 * public/images/sobimon/hero-bg.png 가 있으면 이미지로 보여주고,
 * 없으면 동화풍 SVG 풍경으로 렌더링합니다.
 */
export function FairytaleHeroBackground({ speech = "이번 달도 잘하고 있어요!", onMascotClick }) {
  const [useImgBg, setUseImgBg] = React.useState(true);

  return (
    <div className="fairytale-hero-container" style={{
      position: 'relative',
      width: '100%',
      height: '180px',
      borderRadius: '24px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #74C0FC 0%, #BAE6FD 35%, #DCFCE7 70%, #A7F3D0 100%)',
      boxShadow: '0 8px 24px rgba(56, 189, 248, 0.18)',
      marginBottom: '14px'
    }}>
      {/* 1. 사용자가 hero-bg.png를 넣었을 때 표시되는 실물 배경 이미지 */}
      {useImgBg && (
        <img
          src="/images/sobimon/hero-bg.png"
          alt="동화풍 히어로 배경"
          onError={() => setUseImgBg(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
        />
      )}

      {/* 2. 이미지가 없을 때의 벡터 풍경 일러스트 */}
      {!useImgBg && (
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          <rect width="400" height="200" fill="url(#skyGrad)" />
          <ellipse cx="60" cy="35" rx="28" ry="12" fill="#FFFFFF" opacity="0.85" />
          <ellipse cx="80" cy="30" rx="18" ry="14" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="40" cy="40" rx="18" ry="9" fill="#FFFFFF" opacity="0.8" />
          <ellipse cx="320" cy="42" rx="30" ry="13" fill="#FFFFFF" opacity="0.8" />
          <ellipse cx="345" cy="36" rx="20" ry="14" fill="#FFFFFF" opacity="0.85" />

          {/* 성 */}
          <g opacity="0.85" transform="translate(295, 38) scale(0.6)">
            <rect x="20" y="40" width="60" height="40" fill="#93C5FD" />
            <rect x="10" y="25" width="22" height="55" fill="#60A5FA" />
            <rect x="68" y="25" width="22" height="55" fill="#60A5FA" />
            <polygon points="21,25 9,0 33,0" fill="#2563EB" />
            <polygon points="79,25 67,0 91,0" fill="#2563EB" />
            <polygon points="9,0 0,-7 9,-7" fill="#F59E0B" />
            <polygon points="67,0 58,-7 67,-7" fill="#F59E0B" />
          </g>

          <path d="M-20 130 Q100 80 230 125 T420 120 L420 200 L-20 200 Z" fill="url(#hillGrad1)" opacity="0.7" />
          <path d="M-10 160 Q120 110 250 145 T410 150 L410 200 L-10 200 Z" fill="url(#hillGrad2)" />
          <path d="M90 200 Q150 165 240 180 T360 200 Z" fill="url(#waterGrad)" opacity="0.8" />
          <path d="M120 195 Q200 160 280 195 L270 200 Q200 172 130 200 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          <ellipse cx="200" cy="148" rx="48" ry="18" fill="#64748B" stroke="#334155" strokeWidth="2" />
          <ellipse cx="200" cy="144" rx="42" ry="14" fill="#94A3B8" />
          <ellipse cx="185" cy="142" rx="15" ry="6" fill="#CBD5E1" />
          <circle cx="50" cy="175" r="3" fill="#F43F5E" />
          <circle cx="75" cy="182" r="2.5" fill="#F59E0B" />
          <circle cx="340" cy="178" r="3" fill="#EC4899" />
          <circle cx="370" cy="185" r="2.5" fill="#F59E0B" />
        </svg>
      )}

      {/* 말풍선 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '18px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        padding: '7px 13px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
        border: '1px solid #BAE6FD',
        zIndex: 10,
        animation: 'floatSpeech 3s ease-in-out infinite'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369A1', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>💬</span>
          <span>{speech}</span>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '-5px',
          right: '18px',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '6px solid rgba(255, 255, 255, 0.95)'
        }} />
      </div>

      {/* 중앙 마스코트 캐릭터 */}
      <div 
        onClick={onMascotClick}
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          zIndex: 11,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.06)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
      >
        <SobimonMascot size={106} emotion="joy" />
      </div>
    </div>
  );
}

/**
 * 카페몬 (public/images/sobimon/monster-cafe.png 매칭)
 */
export function CafeMonsterIllustration({ size = 56 }) {
  const fallback = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="58" rx="20" ry="4" fill="#CBD5E1" opacity="0.6" />
      <ellipse cx="32" cy="52" rx="18" ry="4" fill="#F1F5F9" stroke="#334155" strokeWidth="2" />
      <path d="M16 36 L18 50 C18 53, 46 53, 46 50 L48 36 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
      <path d="M47 38 C53 38, 53 47, 46 47" stroke="#334155" strokeWidth="2.5" fill="none" />
      <ellipse cx="32" cy="37" rx="14" ry="4" fill="#854D0E" />
      <ellipse cx="32" cy="32" rx="14" ry="12" fill="#FEF3C7" stroke="#334155" strokeWidth="2" />
      <path d="M26 23 Q32 14 38 23" fill="#D97706" stroke="#334155" strokeWidth="1.5" />
      <path d="M30 18 Q32 11 35 17" fill="#78350F" />
      <ellipse cx="19" cy="30" rx="4" ry="7" fill="#B45309" stroke="#334155" strokeWidth="1.5" />
      <ellipse cx="45" cy="30" rx="4" ry="7" fill="#B45309" stroke="#334155" strokeWidth="1.5" />
      <circle cx="28" cy="33" r="2" fill="#1E293B" />
      <circle cx="36" cy="33" r="2" fill="#1E293B" />
      <ellipse cx="24" cy="36" rx="2.5" ry="1.5" fill="#F87171" />
      <ellipse cx="40" cy="36" rx="2.5" ry="1.5" fill="#F87171" />
      <circle cx="32" cy="35" r="1.5" fill="#78350F" />
      <path d="M30 37 Q32 40 34 37" stroke="#78350F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );

  return (
    <SobimonImg
      name="monster-cafe"
      width={size}
      height={size}
      alt="카페몬"
      fallback={fallback}
    />
  );
}

/**
 * 식비몬 (public/images/sobimon/monster-food.png 매칭)
 */
export function FoodMonsterIllustration({ size = 56 }) {
  const fallback = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="56" rx="18" ry="4" fill="#CBD5E1" opacity="0.6" />
      <ellipse cx="32" cy="36" rx="18" ry="18" fill="#F97316" stroke="#334155" strokeWidth="2" />
      <ellipse cx="32" cy="40" rx="11" ry="11" fill="#FFEDD5" />
      <ellipse cx="20" cy="22" rx="4" ry="6" fill="#EA580C" stroke="#334155" strokeWidth="1.5" />
      <ellipse cx="44" cy="22" rx="4" ry="6" fill="#EA580C" stroke="#334155" strokeWidth="1.5" />
      <circle cx="27" cy="33" r="3" fill="#1E293B" />
      <circle cx="26" cy="32" r="1" fill="#FFFFFF" />
      <circle cx="37" cy="33" r="3" fill="#1E293B" />
      <circle cx="36" cy="32" r="1" fill="#FFFFFF" />
      <path d="M29 39 Q32 45 35 39 Z" fill="#EF4444" stroke="#334155" strokeWidth="1" />
    </svg>
  );

  return (
    <SobimonImg
      name="monster-food"
      width={size}
      height={size}
      alt="식비몬"
      fallback={fallback}
    />
  );
}

/**
 * 쇼핑몬 (public/images/sobimon/monster-shop.png 매칭)
 */
export function ShopMonsterIllustration({ size = 56 }) {
  const fallback = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="56" rx="18" ry="4" fill="#CBD5E1" opacity="0.6" />
      <ellipse cx="32" cy="36" rx="18" ry="16" fill="#EC4899" stroke="#334155" strokeWidth="2" />
      <polygon points="18,25 24,14 30,22" fill="#DB2777" stroke="#334155" strokeWidth="1.5" />
      <polygon points="46,25 40,14 34,22" fill="#DB2777" stroke="#334155" strokeWidth="1.5" />
      <circle cx="32" cy="22" r="3" fill="#FBBF24" stroke="#334155" strokeWidth="1" />
      <polygon points="32,22 24,19 26,25" fill="#F59E0B" />
      <polygon points="32,22 40,19 38,25" fill="#F59E0B" />
      <circle cx="26" cy="34" r="2.5" fill="#1E293B" />
      <circle cx="38" cy="34" r="2.5" fill="#1E293B" />
      <path d="M30 38 Q32 41 34 38" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );

  return (
    <SobimonImg
      name="monster-shop"
      width={size}
      height={size}
      alt="쇼핑몬"
      fallback={fallback}
    />
  );
}

/**
 * 절약몬 (public/images/sobimon/monster-saver.png 매칭)
 */
export function SaverMonsterIllustration({ size = 56 }) {
  const fallback = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="56" rx="18" ry="4" fill="#CBD5E1" opacity="0.6" />
      <circle cx="24" cy="24" r="8" fill="#10B981" stroke="#334155" strokeWidth="1.5" />
      <circle cx="40" cy="24" r="8" fill="#10B981" stroke="#334155" strokeWidth="1.5" />
      <circle cx="32" cy="18" r="8" fill="#34D399" stroke="#334155" strokeWidth="1.5" />
      <ellipse cx="32" cy="38" rx="16" ry="16" fill="#059669" stroke="#334155" strokeWidth="2" />
      <polygon points="32,32 39,37 36,46 32,49 28,46 25,37" fill="#FEF08A" stroke="#334155" strokeWidth="1" />
      <circle cx="27" cy="36" r="2" fill="#FFFFFF" />
      <circle cx="37" cy="36" r="2" fill="#FFFFFF" />
    </svg>
  );

  return (
    <SobimonImg
      name="monster-saver"
      width={size}
      height={size}
      alt="절약몬"
      fallback={fallback}
    />
  );
}

/**
 * 황금 보물상자 (public/images/sobimon/treasure-box.png 매칭)
 */
export function TreasureBoxIllustration({ size = 64 }) {
  const fallback = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="58" rx="22" ry="4" fill="#CBD5E1" opacity="0.6" />
      <rect x="12" y="32" width="40" height="24" rx="4" fill="#D97706" stroke="#334155" strokeWidth="2.5" />
      <path d="M10 24 C10 18, 54 18, 54 24 L52 32 L12 32 Z" fill="#F59E0B" stroke="#334155" strokeWidth="2.5" />
      <polygon points="20,30 32,16 44,30" fill="#FEF08A" opacity="0.8" />
      <rect x="28" y="30" width="8" height="10" rx="2" fill="#FDE047" stroke="#334155" strokeWidth="1.5" />
      <circle cx="32" cy="35" r="1.5" fill="#78350F" />
      <path d="M48 14 L50 20 L56 22 L50 24 L48 30 L46 24 L40 22 L46 20 Z" fill="#FDE047" />
    </svg>
  );

  return (
    <SobimonImg
      name="treasure-box"
      width={size}
      height={size}
      alt="황금 보물상자"
      fallback={fallback}
    />
  );
}
