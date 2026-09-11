import React from 'react';
import SobimonImg from './SobimonImg';

/**
 * SOBIMON 시안의 공식 시그니처 마스코트 캐릭터
 * public/images/sobimon/mascot-*.png 이미지를 우선 로드하고, 없을 시 완성형 SVG 벡터 렌더링
 */
export function SobimonMascot({ size = 120, emotion = 'happy', className = '' }) {
  const imageNameMap = {
    happy: 'mascot-main',
    joy: 'mascot-happy',
    surprised: 'mascot-surprised',
    sad: 'mascot-sad',
    angry: 'mascot-angry'
  };

  const imageName = imageNameMap[emotion] || 'mascot-main';

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
      style={{ filter: 'drop-shadow(0 6px 14px rgba(37, 99, 235, 0.2))' }}
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
 * 첨부 이미지의 1번 전체 배경 (Full-bleed Hero Banner)
 */
export function FairytaleHeroBackground({
  user,
  speech = "이번 달도 잘하고 있어요!",
  onMascotClick
}) {
  const [useImgBg, setUseImgBg] = React.useState(true);

  return (
    <div className="fairytale-hero-container">
      {useImgBg && (
        <img
          src="/images/sobimon/hero-bg.png"
          alt="1번 전체 동화풍 배경"
          onError={() => setUseImgBg(false)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 1
          }}
        />
      )}

      {!useImgBg && (
        <svg
          viewBox="0 0 400 315"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        >
          <defs>
            <linearGradient id="skyGradFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="45%" stopColor="#7DD3FC" />
              <stop offset="75%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#BBF7D0" />
            </linearGradient>
          </defs>
          <rect width="400" height="315" fill="url(#skyGradFull)" />
        </svg>
      )}

      <div style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '16px 16px 0 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '50%', background: '#FFFFFF',
            border: '2px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)', overflow: 'hidden'
          }}>
            <SobimonMascot size={46} emotion="joy" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF', textShadow: '0 1px 4px rgba(15, 23, 42, 0.45)' }}>
              Lv.{user?.level || 12}
            </span>
            <div style={{ width: '110px', height: '8px', background: 'rgba(255,255,255,.45)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round(((user?.exp || 820) / (user?.maxExp || 1000)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg,#38BDF8,#2563EB)' }} />
            </div>
            <span style={{ fontSize: '10px', color: '#FFFFFF', fontWeight: 800, textShadow: '0 1px 3px rgba(15,23,42,.5)' }}>
              {user?.exp || 820} / {user?.maxExp || 1000} EXP
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.92)', padding: '5px 12px', borderRadius: 999, boxShadow: '0 4px 12px rgba(15,23,42,.1)' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#F59E0B', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 900 }}>⭐</div>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#1E293B' }}>{(user?.coins || 3250).toLocaleString()}</span>
          </div>
          <div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px rgba(15,23,42,.1)' }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            <div style={{ position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#EF4444', border: '1px solid #fff' }} />
          </div>
        </div>
      </div>

      <div className="hero-stage-center">
        <div className="hero-speech-bubble">
          <div className="hero-speech-bubble-text">{speech || '이번 달도 잘하고 있어요!'}</div>
          <div className="hero-speech-tail" />
        </div>
        <div className="hero-mascot-wrap" onClick={onMascotClick}>
          <SobimonMascot size={160} emotion="joy" />
        </div>
      </div>
    </div>
  );
}

export function CafeMonsterIllustration({ size = 56 }) {
  const fallback = <svg width={size} height={size} viewBox="0 0 64 64" />;
  return <SobimonImg name="monster-cafe" width={size} height={size} alt="카페몬" fallback={fallback} />;
}

export function FoodMonsterIllustration({ size = 56 }) {
  const fallback = <svg width={size} height={size} viewBox="0 0 64 64" />;
  return <SobimonImg name="monster-food" width={size} height={size} alt="식비몬" fallback={fallback} />;
}

export function ShopMonsterIllustration({ size = 56 }) {
  const fallback = <svg width={size} height={size} viewBox="0 0 64 64" />;
  return <SobimonImg name="monster-shop" width={size} height={size} alt="쇼핑몬" fallback={fallback} />;
}

export function SaverMonsterIllustration({ size = 56 }) {
  const fallback = <svg width={size} height={size} viewBox="0 0 64 64" />;
  return <SobimonImg name="monster-saver" width={size} height={size} alt="절약몬" fallback={fallback} />;
}
