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
    <svg width={size} height={size} viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ filter: 'drop-shadow(0 6px 14px rgba(37, 99, 235, 0.2))' }}>
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

  return <SobimonImg name={imageName} width={size} height={size} className={className} alt={`소비몬 마스코트 (${emotion})`} fallback={vectorFallback} />;
}

export function FairytaleHeroBackground({ user, speech = "이번 달도 잘하고 있어요!", onMascotClick }) {
  const [useImgBg, setUseImgBg] = React.useState(true);
  return (
    <div className="fairytale-hero-container">
      {useImgBg && (
        <img src="/images/sobimon/hero-bg.png" alt="1번 전체 동화풍 배경" onError={() => setUseImgBg(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', objectFit: 'cover', zIndex: 1 }} />
      )}
      {!useImgBg && (
        <svg viewBox="0 0 400 315" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <defs>
            <linearGradient id="skyGradFull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38BDF8" /><stop offset="45%" stopColor="#7DD3FC" /><stop offset="75%" stopColor="#BAE6FD" /><stop offset="100%" stopColor="#BBF7D0" /></linearGradient>
            <linearGradient id="hillGreen1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ADE80" /><stop offset="100%" stopColor="#16A34A" /></linearGradient>
            <linearGradient id="hillGreen2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#86EFAC" /><stop offset="100%" stopColor="#22C55E" /></linearGradient>
            <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D97706" /><stop offset="60%" stopColor="#92400E" /><stop offset="100%" stopColor="#78350F" /></linearGradient>
          </defs>
          <rect width="400" height="315" fill="url(#skyGradFull)" />
          <ellipse cx="60" cy="90" rx="38" ry="16" fill="#FFFFFF" opacity="0.85" /><ellipse cx="85" cy="85" rx="26" ry="18" fill="#FFFFFF" opacity="0.9" /><ellipse cx="330" cy="110" rx="42" ry="18" fill="#FFFFFF" opacity="0.85" /><ellipse cx="360" cy="100" rx="28" ry="16" fill="#FFFFFF" opacity="0.9" />
          <g transform="translate(265, 100)"><path d="M15 65 L40 15 L95 25 L120 75 L120 150 L5 150 Z" fill="#D97706" opacity="0.9" /><path d="M25 65 L45 20 L85 28 L105 75 L105 150 L20 150 Z" fill="#B45309" opacity="0.7" /><rect x="35" y="15" width="45" height="32" rx="3" fill="#FEF08A" stroke="#78350F" strokeWidth="1.5" /><rect x="25" y="0" width="18" height="46" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5" /><rect x="72" y="0" width="18" height="46" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5" /><polygon points="34,-16 20,0 48,0" fill="#2563EB" stroke="#1E293B" strokeWidth="1.5" /><polygon points="81,-16 67,0 95,0" fill="#2563EB" stroke="#1E293B" strokeWidth="1.5" /><rect x="52" y="5" width="12" height="15" fill="#93C5FD" stroke="#1E293B" strokeWidth="1.2" /><polygon points="58,-5 49,5 67,5" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" /><circle cx="20" cy="65" r="14" fill="#22C55E" /><circle cx="100" cy="70" r="16" fill="#16A34A" /></g>
          <path d="M-20 220 Q60 165 180 215 L180 315 L-20 315 Z" fill="url(#hillGreen1)" opacity="0.75" /><circle cx="25" cy="190" r="22" fill="#22C55E" /><circle cx="50" cy="180" r="26" fill="#16A34A" /><circle cx="78" cy="195" r="20" fill="#15803D" /><path d="M220 235 Q310 180 420 210 L420 315 L220 315 Z" fill="url(#hillGreen2)" /><circle cx="330" cy="225" r="24" fill="#22C55E" /><circle cx="365" cy="215" r="28" fill="#16A34A" /><circle cx="395" cy="230" r="22" fill="#15803D" /><path d="M-10 270 Q140 230 260 250 T410 260 L410 315 L-10 315 Z" fill="#4ADE80" />
          <g transform="translate(145, 230)"><path d="M10 50 L20 18 L100 18 L110 50 Z" fill="url(#rockGrad)" stroke="#451A03" strokeWidth="2.5" /><ellipse cx="60" cy="18" rx="44" ry="14" fill="#B45309" stroke="#451A03" strokeWidth="2" /><ellipse cx="60" cy="16" rx="36" ry="10" fill="#FDE68A" opacity="0.6" /></g>
        </svg>
      )}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #fff' }}><SobimonMascot size={36} emotion="happy" /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={{ fontSize: 14, fontWeight: 900, color: '#fff', textShadow: '0 1px 4px rgba(15,23,42,.45)' }}>Lv.{user?.level || 12}</span><div style={{ width: 110, height: 8, background: 'rgba(255,255,255,.45)', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: `${Math.round(((user?.exp || 820) / (user?.maxExp || 1000)) * 100)}%`, height: '100%', background: 'linear-gradient(90deg,#38BDF8,#2563EB)' }} /></div><span style={{ fontSize: 10, color: '#fff', fontWeight: 800, textShadow: '0 1px 3px rgba(15,23,42,.5)' }}>{user?.exp || 820} / {user?.maxExp || 1000} EXP</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.92)', padding: '5px 12px', borderRadius: 999 }}><div style={{ width: 18, height: 18, borderRadius: '50%', background: '#F59E0B', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11 }}>⭐</div><span style={{ fontSize: 13, fontWeight: 900, color: '#1E293B' }}>{(user?.coins || 3250).toLocaleString()}</span></div><div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'grid', placeItems: 'center' }}><span style={{ fontSize: 16 }}>🔔</span><div style={{ position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#EF4444', border: '1px solid #fff' }} /></div></div>
      </div>
      <div className="hero-stage-center"><div className="hero-speech-bubble"><div className="hero-speech-bubble-text">{speech || '이번 달도 잘하고 있어요!'}</div><div className="hero-speech-tail" /></div><div className="hero-mascot-wrap" onClick={onMascotClick}><SobimonMascot size={160} emotion="joy" /></div></div>
    </div>
  );
}

export function CafeMonsterIllustration({ size = 56 }) {
  const fallback = (<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="58" rx="20" ry="4" fill="#CBD5E1" opacity="0.6" /><ellipse cx="32" cy="52" rx="18" ry="4" fill="#F1F5F9" stroke="#334155" strokeWidth="2" /><path d="M16 36 L18 50 C18 53, 46 53, 46 50 L48 36 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="2" /><path d="M47 38 C53 38, 53 47, 46 47" stroke="#334155" strokeWidth="2.5" fill="none" /><ellipse cx="32" cy="37" rx="14" ry="4" fill="#854D0E" /><ellipse cx="32" cy="32" rx="14" ry="12" fill="#FEF3C7" stroke="#334155" strokeWidth="2" /><path d="M26 23 Q32 14 38 23" fill="#D97706" stroke="#334155" strokeWidth="1.5" /><path d="M30 18 Q32 11 35 17" fill="#78350F" /><ellipse cx="19" cy="30" rx="4" ry="7" fill="#B45309" stroke="#334155" strokeWidth="1.5" /><ellipse cx="45" cy="30" rx="4" ry="7" fill="#B45309" stroke="#334155" strokeWidth="1.5" /><circle cx="28" cy="33" r="2" fill="#1E293B" /><circle cx="36" cy="33" r="2" fill="#1E293B" /><ellipse cx="24" cy="36" rx="2.5" ry="1.5" fill="#F87171" /><ellipse cx="40" cy="36" rx="2.5" ry="1.5" fill="#F87171" /><circle cx="32" cy="35" r="1.5" fill="#78350F" /><path d="M30 37 Q32 40 34 37" stroke="#78350F" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>);
  return <SobimonImg name="monster-cafe" width={size} height={size} alt="카페몬" fallback={fallback} />;
}
export function FoodMonsterIllustration({ size = 56 }) {
  const fallback = (<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="56" rx="18" ry="4" fill="#CBD5E1" opacity="0.6" /><ellipse cx="32" cy="36" rx="18" ry="18" fill="#F97316" stroke="#334155" strokeWidth="2" /><ellipse cx="32" cy="40" rx="11" ry="11" fill="#FFEDD5" /><ellipse cx="20" cy="22" rx="4" ry="6" fill="#EA580C" stroke="#334155" strokeWidth="1.5" /><ellipse cx="44" cy="22" rx="4" ry="6" fill="#EA580C" stroke="#334155" strokeWidth="1.5" /><circle cx="27" cy="33" r="3" fill="#1E293B" /><circle cx="26" cy="32" r="1" fill="#FFFFFF" /><circle cx="37" cy="33" r="3" fill="#1E293B" /><circle cx="36" cy="32" r="1" fill="#FFFFFF" /><path d="M29 39 Q32 45 35 39 Z" fill="#EF4444" stroke="#334155" strokeWidth="1" /></svg>);
  return <SobimonImg name="monster-food" width={size} height={size} alt="식비몬" fallback={fallback} />;
}
export function ShopMonsterIllustration({ size = 56 }) {
  const fallback = (<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="56" rx="18" ry="4" fill="#CBD5E1" opacity="0.6" /><ellipse cx="32" cy="36" rx="18" ry="16" fill="#EC4899" stroke="#334155" strokeWidth="2" /><polygon points="18,25 24,14 30,22" fill="#DB2777" stroke="#334155" strokeWidth="1.5" /><polygon points="46,25 40,14 34,22" fill="#DB2777" stroke="#334155" strokeWidth="1.5" /><circle cx="32" cy="22" r="3" fill="#FBBF24" stroke="#334155" strokeWidth="1" /><polygon points="32,22 24,19 26,25" fill="#F59E0B" /><polygon points="32,22 40,19 38,25" fill="#F59E0B" /><circle cx="26" cy="34" r="2.5" fill="#1E293B" /><circle cx="38" cy="34" r="2.5" fill="#1E293B" /><path d="M30 38 Q32 41 34 38" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>);
  return <SobimonImg name="monster-shop" width={size} height={size} alt="쇼핑몬" fallback={fallback} />;
}
export function SaverMonsterIllustration({ size = 56 }) {
  const fallback = (<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="56" rx="18" ry="4" fill="#CBD5E1" opacity="0.6" /><circle cx="24" cy="24" r="8" fill="#10B981" stroke="#334155" strokeWidth="1.5" /><circle cx="40" cy="24" r="8" fill="#10B981" stroke="#334155" strokeWidth="1.5" /><circle cx="32" cy="18" r="8" fill="#34D399" stroke="#334155" strokeWidth="1.5" /><ellipse cx="32" cy="38" rx="16" ry="16" fill="#059669" stroke="#334155" strokeWidth="2" /><polygon points="32,32 39,37 36,46 32,49 28,46 25,37" fill="#FEF08A" stroke="#334155" strokeWidth="1" /><circle cx="27" cy="36" r="2" fill="#FFFFFF" /><circle cx="37" cy="36" r="2" fill="#FFFFFF" /></svg>);
  return <SobimonImg name="monster-saver" width={size} height={size} alt="절약몬" fallback={fallback} />;
}
export function TreasureBoxIllustration({ size = 64 }) {
  const fallback = (<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="58" rx="22" ry="4" fill="#CBD5E1" opacity="0.6" /><rect x="12" y="32" width="40" height="24" rx="4" fill="#D97706" stroke="#334155" strokeWidth="2.5" /><path d="M10 24 C10 18, 54 18, 54 24 L52 32 L12 32 Z" fill="#F59E0B" stroke="#334155" strokeWidth="2.5" /><polygon points="20,30 32,16 44,30" fill="#FEF08A" opacity="0.8" /><rect x="28" y="30" width="8" height="10" rx="2" fill="#FDE047" stroke="#334155" strokeWidth="1.5" /><circle cx="32" cy="35" r="1.5" fill="#78350F" /><path d="M48 14 L50 20 L56 22 L50 24 L48 30 L46 24 L40 22 L46 20 Z" fill="#FDE047" /></svg>);
  return <SobimonImg name="treasure-box" width={size} height={size} alt="황금 보물상자" fallback={fallback} />;
}
