import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, RotateCw, Shield, Zap, Award, Flame, Smartphone, Compass } from 'lucide-react';
import { 
  CafeMonsterIllustration, 
  FoodMonsterIllustration, 
  ShopMonsterIllustration, 
  SaverMonsterIllustration,
  SobimonMascot 
} from './SobimonIllustrations';

// simeydotme/pokemon-cards-css 원본 포인터 트래킹 수식 (clamp / round / adjust)
const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

// 소비몬 카드별 스킬 및 포켓몬 TCG 스타일 세부 스펙 데이터
const HOLO_CARD_SPECS = {
  cafe: {
    name: '카페몬',
    cardImage: '/images/sobimon/sobicard-cafemon.png',
    subtitle: '달콤한 유혹의 정령',
    stage: '기본 (Basic)',
    hp: 140,
    element: '카페/디저트',
    elementIcon: '☕',
    elementColor: '#0284C7',
    gradientBg: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)',
    borderGradient: 'linear-gradient(135deg, #BAE6FD, #38BDF8, #60A5FA, #93C5FD)',
    rarity: 'rare',
    rarityText: '★★★ HOLO RARE',
    cardNo: 'NO. 002 / 015',
    ability: {
      name: '달콤한 유혹 (Sweet Temptation)',
      type: '특성 (Ability)',
      desc: '오후 2시~4시 사이 나른할 때 발동. 달콤한 바닐라 라떼 결제를 유도하여 지갑 내구도를 6,500 깎습니다.'
    },
    attacks: [
      {
        cost: ['☕', '⭐'],
        name: '원두 샷 추가 (Shot Extra)',
        damage: '4,500',
        desc: '결제 시 "디카페인으로 변경 + 샷 추가" 콤보로 추가 지출을 발생시킵니다.'
      }
    ],
    weakness: '텀블러 할인 (-300원)',
    resistance: '카카오페이 1초 결제',
    retreatCost: 1,
    quote: '"피곤할 땐 커피 한 잔 마셔도 괜찮아... 내일 절약하면 되지!"',
    illustrator: 'SOBIMON Design Lab'
  },
  food: {
    name: '식비몬',
    cardImage: '/images/sobimon/sobicard-foodmon.png',
    subtitle: '새벽 배달의 망령',
    stage: '1진화 (Stage 1)',
    hp: 180,
    element: '식비/외식',
    elementIcon: '🍖',
    elementColor: '#EA580C',
    gradientBg: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 50%, #FDBA74 100%)',
    borderGradient: 'linear-gradient(135deg, #FED7AA, #FB923C, #F97316, #FBBF24)',
    rarity: 'rare',
    rarityText: '★★ UNCOMMON HOLO',
    cardNo: 'NO. 001 / 015',
    ability: {
      name: '야식의 속삭임 (Midnight Feast)',
      type: '특성 (Ability)',
      desc: '밤 10시 이후 배달앱을 켜는 순간 발동. 배달팁 3,500원을 당연하게 여기게 만듭니다.'
    },
    attacks: [
      {
        cost: ['🍖', '🍖', '⭐'],
        name: '최소주문금액 채우기',
        damage: '18,000',
        desc: '사이드 메뉴(치즈볼)를 추가하여 장바구니 총액을 강제로 증가시킵니다.'
      }
    ],
    weakness: '냉장고 파먹기 (-20,000원 방어)',
    resistance: '쿠팡이츠 와우할인',
    retreatCost: 2,
    quote: '"맛있게 먹으면 0칼로리... 지갑 잔고도 0원!"',
    illustrator: 'SOBIMON Design Lab'
  },
  shop: {
    name: '쇼핑몬',
    cardImage: '/images/sobimon/sobicard-shopmon.png',
    subtitle: '장바구니 폭주마왕',
    stage: '2진화 (Stage 2 - VMAX)',
    hp: 220,
    element: '쇼핑/마트',
    elementIcon: '🛒',
    elementColor: '#DB2777',
    gradientBg: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 50%, #F472B6 100%)',
    borderGradient: 'linear-gradient(135deg, #FBCFE8, #F472B6, #EC4899, #A855F7, #6366F1)',
    rarity: 'epic',
    rarityText: '★★★★ ULTRA RARE (VMAX)',
    cardNo: 'NO. 003 / 015',
    ability: {
      name: '타임세일 환술 (Flash Sale Mirage)',
      type: '특성 (Ability)',
      desc: '"마감 10분 전!" 카운트다운을 보면 필요 없는 물건도 즉시 결제하게 만듭니다.'
    },
    attacks: [
      {
        cost: ['🛒', '🛒', '⚡'],
        name: '1+1 무료배송 콤보',
        damage: '49,000',
        desc: '3만원 무료배송 기준을 맞추기 위해 불필요한 양말 5켤레를 추가합니다.'
      }
    ],
    weakness: '장바구니 3일 숙성법 (지출 취소)',
    resistance: '무이자 6개월 할부',
    retreatCost: 3,
    quote: '"지금 사면 50% 할인이라니까? 안 사면 손해라구!"',
    illustrator: 'SOBIMON Design Lab'
  },
  saving: {
    name: '저축몬',
    cardImage: '/images/sobimon/sobicard-savingmon.png',
    subtitle: '황금빛 자산 수호신',
    stage: '전설 (Legend / Secret)',
    hp: 250,
    element: '저축/투자',
    elementIcon: '🪙',
    elementColor: '#D97706',
    gradientBg: 'linear-gradient(135deg, #FEFCE8 0%, #FEF08A 50%, #FDE047 100%)',
    borderGradient: 'linear-gradient(135deg, #FDE047, #F59E0B, #EAB308, #FACC15, #FFFFFF)',
    rarity: 'legend',
    rarityText: '★★★★★ SECRET GOLD RAINBOW',
    cardNo: 'NO. 004 / 015',
    ability: {
      name: '복리의 마법 (Compound Magic)',
      type: '수호 특성 (Guardian Ability)',
      desc: '매달 저축 목표 달성 시 통장 잔액에 비례해 황금 코인을 자동 채굴합니다.'
    },
    attacks: [
      {
        cost: ['🪙', '🪙', '🪙'],
        name: '철벽의 예적금 실드',
        damage: '+100,000 EXP',
        desc: '불필요한 충동구매 공격을 100% 무효화하고 지갑을 단단하게 수호합니다.'
      }
    ],
    weakness: '신용카드 무이자 유혹',
    resistance: '모든 소비몬 공격 데미지 50% 감소',
    retreatCost: 0,
    quote: '"티끌 모아 만든 황금산, 자산 수호자가 지킨다!"',
    illustrator: 'SOBIMON Master Artist'
  },
  saver: {
    name: '절약몬',
    cardImage: '/images/sobimon/sobicard-savermon.png',
    subtitle: '무지출 데이의 수호신',
    stage: '특수 (Special Holo)',
    hp: 160,
    element: '절약/무지출',
    elementIcon: '🛡️',
    elementColor: '#059669',
    gradientBg: 'linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 50%, #6EE7B7 100%)',
    borderGradient: 'linear-gradient(135deg, #A7F3D0, #34D399, #10B981, #38BDF8)',
    rarity: 'epic',
    rarityText: '★★★★ EPIC HOLO',
    cardNo: 'NO. 005 / 015',
    ability: {
      name: '지출 봉인술 (Zero-Spending Seal)',
      type: '특성 (Ability)',
      desc: '하루 종일 지갑을 열지 않는 무지출 데이 달성 시 모든 소비몬을 잠재웁니다.'
    },
    attacks: [
      {
        cost: ['🛡️', '⭐'],
        name: '도시락 패링 (Lunchbox Parry)',
        damage: '12,000 방어',
        desc: '점심시간 외식 유혹을 집밥 도시락으로 완벽히 쳐냅니다.'
      }
    ],
    weakness: '동료들의 "오늘 커피 쏠게" 2차 제안',
    resistance: '배달의민족 푸시 알림 차단',
    retreatCost: 1,
    quote: '"단 1원도 새어나가지 않는다! 철통 방어 완료!"',
    illustrator: 'SOBIMON Design Lab'
  }
};

/**
 * 3D 인터랙티브 홀로그램 포켓몬 TCG 스타일 소비몬 카드 모달
 * - simeydotme/pokemon-cards-css의 원리 (Perspective tilt + Glare sheen + Rainbow Diffraction foil)
 */
export default function SobimonHoloCardModal({ isOpen, onClose, monster }) {
  if (!isOpen || !monster) return null;

  const cardRef = useRef(null);
  const isTouchRef = useRef(false);
  const gyroBaseRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroPermissionRequired, setGyroPermissionRequired] = useState(false);
  // --rotate-x/--rotate-y/--pointer-x/--pointer-y/--background-x/--background-y/--card-opacity 와 1:1 대응
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    pointerX: 50,
    pointerY: 50,
    cardOpacity: 0,
    bgX: 50,
    bgY: 50
  });

  const spec = HOLO_CARD_SPECS[monster.id] || {
    name: monster.name || '소비몬',
    subtitle: '신비한 소비 정령',
    stage: '기본 (Basic)',
    hp: 120,
    element: '일반/소비',
    elementIcon: '👾',
    elementColor: '#3B82F6',
    gradientBg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    borderGradient: 'linear-gradient(135deg, #BFDBFE, #60A5FA, #3B82F6)',
    rarity: monster.rarity || 'normal',
    rarityText: '★★ HOLO RARE',
    cardNo: 'NO. ??? / 015',
    ability: {
      name: '소비 관찰 (Money Sight)',
      type: '특성 (Ability)',
      desc: '가계부에 기록될 때마다 경험치와 코인을 소환합니다.'
    },
    attacks: [
      {
        cost: ['👾', '⭐'],
        name: '스마트 결제 유도',
        damage: '10,000',
        desc: '카드를 긁는 순간 깜찍한 모습으로 출현합니다.'
      }
    ],
    weakness: '체계적인 월간 예산',
    resistance: '포인트 적립',
    retreatCost: 1,
    quote: '"내 소비를 잘 관찰하면 더 멋진 트레이너가 될 수 있어!"',
    illustrator: 'SOBIMON'
  };

  // 모바일 자이로스코프(스마트폰 기울기) 이벤트 핸들러 (원본의 상대 기준각 보정 방식과 동일)
  const handleOrientation = useCallback((e) => {
    // 사용자가 손가락으로 화면을 직접 터치 드래그 중이면 터치 우선
    if (isTouchRef.current) return;

    const gamma = e.gamma; // 좌우 회전각
    const beta = e.beta;   // 전후 회전각

    if (gamma === null || beta === null) return;

    // 처음 감지된 기울기를 기준각(0)으로 삼아, 이후 상대 변화량만 사용
    if (!gyroBaseRef.current) {
      gyroBaseRef.current = { gamma, beta };
    }
    const relGamma = gamma - gyroBaseRef.current.gamma;
    const relBeta = beta - gyroBaseRef.current.beta;

    setGyroActive(true);

    const limX = 16;
    const limY = 18;
    const zx = clamp(relGamma, -limX, limX);
    const zy = clamp(relBeta, -limY, limY);

    setTilt({
      rotateX: round(zx * -1),
      rotateY: round(zy),
      pointerX: adjust(zx, -limX, limX, 0, 100),
      pointerY: adjust(zy, -limY, limY, 0, 100),
      cardOpacity: 1,
      bgX: adjust(zx, -limX, limX, 37, 63),
      bgY: adjust(zy, -limY, limY, 33, 67)
    });
  }, []);

  // 기기 방향 센서 이벤트 리스너 등록
  useEffect(() => {
    let isListening = false;

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+는 사용자 제스처 터치로 권한 승인 필요
        setGyroPermissionRequired(true);
      } else {
        // 안드로이드 크롬 및 모바일 웹 즉시 연동
        window.addEventListener('deviceorientation', handleOrientation, true);
        isListening = true;
      }
    }

    return () => {
      if (isListening) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [handleOrientation]);

  // iOS Safari 등에서 자이로 권한 승인 요청
  const enableGyroPermission = async () => {
    if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await window.DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          setGyroPermissionRequired(false);
          setGyroActive(true);
        } else {
          alert('기기 모션 권한이 거부되었습니다.');
        }
      } catch (err) {
        console.error('Gyro request error:', err);
      }
    }
  };

  // 마우스 / 터치 포인터 3D 틸트 추적 핸들러 (simeydotme/pokemon-cards-css 원본 수식 그대로)
  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const percentX = clamp(round((100 / rect.width) * x));
    const percentY = clamp(round((100 / rect.height) * y));

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    setTilt({
      rotateX: round(-(centerX / 3.5)),
      rotateY: round(centerY / 2),
      pointerX: round(percentX),
      pointerY: round(percentY),
      cardOpacity: 1,
      bgX: adjust(percentX, 0, 100, 37, 63),
      bgY: adjust(percentY, 0, 100, 33, 67)
    });
  };

  // 포인터가 벗어났을 때 원래 각도로 복귀
  const handlePointerLeave = () => {
    if (gyroActive) return; // 자이로 활성 시 자이로가 계속 각도 유지
    setTilt({
      rotateX: 0,
      rotateY: 0,
      pointerX: 50,
      pointerY: 50,
      cardOpacity: 0,
      bgX: 50,
      bgY: 50
    });
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="holo-modal-backdrop"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button 
        className="holo-modal-close-btn"
        onClick={onClose}
        aria-label="카드 닫기"
      >
        <X size={22} />
      </button>

      {/* 상단 힌트 배너 및 자이로 상태 */}
      <div className="holo-modal-hint-bar" onClick={(e) => e.stopPropagation()}>
        <div className="holo-hint-left">
          <Sparkles size={16} color="#FBBF24" />
          <span>마우스나 <strong>폰을 기울여서</strong> 3D 홀로그램 호일 광택을 느껴보세요!</span>
        </div>

        {gyroActive ? (
          <div className="holo-gyro-pill active">
            <Smartphone size={12} className="holo-pulse-icon" />
            <span>자이로 감지 중</span>
          </div>
        ) : gyroPermissionRequired ? (
          <button className="holo-gyro-req-btn" onClick={enableGyroPermission}>
            <Compass size={12} />
            <span>📱 폰 기울기 센서 켜기</span>
          </button>
        ) : null}
      </div>

      {/* 3D 카드 스테이지 (원근감 컨테이너) */}
      <div 
        className="holo-card-stage"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handlePointerMove}
        onTouchStart={() => { isTouchRef.current = true; }}
        onTouchMove={handlePointerMove}
        onTouchEnd={() => { 
          isTouchRef.current = false;
          if (!gyroActive) handlePointerLeave();
        }}
        onMouseLeave={handlePointerLeave}
      >
        <div
          ref={cardRef}
          className={`holo-card-3d ${isFlipped ? 'flipped' : ''}`}
          style={{
            '--rotate-x': `${tilt.rotateX}deg`,
            '--rotate-y': `${tilt.rotateY}deg`,
            '--pointer-x': `${tilt.pointerX}%`,
            '--pointer-y': `${tilt.pointerY}%`,
            '--background-x': `${tilt.bgX}%`,
            '--background-y': `${tilt.bgY}%`,
            '--card-opacity': tilt.cardOpacity,
            '--card-glow': spec.elementColor,
            transform: `perspective(1000px) rotateY(${tilt.rotateX + (isFlipped ? 180 : 0)}deg) rotateX(${tilt.rotateY}deg)`
          }}
        >
          {/* ===================== [카드 앞면] ===================== */}
          <div className="holo-card-face holo-card-front" style={{ background: spec.gradientBg, padding: 0 }}>
            
            {/* 0. 실물 포켓몬 TCG 완성형 카드 이미지 (sobicard-cafemon.png 스타일) */}
            {spec.cardImage ? (
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                <img 
                  src={spec.cardImage} 
                  alt={spec.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    display: 'block',
                    borderRadius: '16px'
                  }}
                />
              </div>
            ) : (
              <div className="holo-card-inner-frame" style={{ borderImage: `${spec.borderGradient} 1` }}>
                {/* 상단: 이름 + HP + 속성 아이콘 */}
                <div className="holo-card-header">
                  <div className="holo-header-left">
                    <span className="holo-card-stage-tag">{spec.stage}</span>
                    <h3 className="holo-card-name">{spec.name}</h3>
                  </div>
                  <div className="holo-header-right">
                    <span className="holo-card-hp-label">HP</span>
                    <span className="holo-card-hp-val">{spec.hp}</span>
                    <div className="holo-element-badge" style={{ background: spec.elementColor }}>
                      <span>{spec.elementIcon}</span>
                    </div>
                  </div>
                </div>

                {/* 중앙: 캐릭터 일러스트 창 (입체 박스) */}
                <div className="holo-art-window">
                  <div className="holo-art-bg-aura" />
                  <div className="holo-art-sprite">
                    {monster.id === 'cafe' && <CafeMonsterIllustration size={92} />}
                    {monster.id === 'food' && <FoodMonsterIllustration size={92} />}
                    {monster.id === 'shop' && <ShopMonsterIllustration size={92} />}
                    {monster.id === 'saving' && <span style={{ fontSize: '72px', filter: 'drop-shadow(0 6px 12px rgba(245, 158, 11, 0.4))' }}>🪙</span>}
                    {monster.id === 'saver' && <SaverMonsterIllustration size={92} />}
                    {!['cafe', 'food', 'shop', 'saving', 'saver'].includes(monster.id) && <SobimonMascot size={92} emotion="happy" />}
                  </div>
                  {/* 일러스트 하단 자막 */}
                  <div className="holo-art-caption">
                    <span>{spec.cardNo} | {spec.subtitle}</span>
                  </div>
                </div>

                {/* 특성 (Ability) 박스 */}
                {spec.ability && (
                  <div className="holo-ability-box">
                    <div className="holo-ability-title">
                      <span className="holo-ability-badge">{spec.ability.type}</span>
                      <strong>{spec.ability.name}</strong>
                    </div>
                    <p className="holo-ability-desc">{spec.ability.desc}</p>
                  </div>
                )}

                {/* 공격기 (Attack) 리스트 */}
                <div className="holo-attack-list">
                  {spec.attacks.map((atk, idx) => (
                    <div key={idx} className="holo-attack-item">
                      <div className="holo-attack-cost">
                        {atk.cost.map((c, cIdx) => (
                          <span key={cIdx} className="holo-cost-orb">{c}</span>
                        ))}
                      </div>
                      <div className="holo-attack-info">
                        <div className="holo-attack-name-row">
                          <strong>{atk.name}</strong>
                          <span className="holo-attack-damage">{atk.damage}</span>
                        </div>
                        <p className="holo-attack-desc">{atk.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 약점 / 저항력 / 후퇴 비용 바 */}
                <div className="holo-weakness-bar">
                  <div className="holo-rule-col">
                    <span>약점 (Weakness)</span>
                    <strong>{spec.weakness}</strong>
                  </div>
                  <div className="holo-rule-col">
                    <span>저항력 (Resistance)</span>
                    <strong>{spec.resistance}</strong>
                  </div>
                  <div className="holo-rule-col">
                    <span>후퇴 비용</span>
                    <strong>{'⭐'.repeat(spec.retreatCost)}</strong>
                  </div>
                </div>

                {/* 하단 희귀도 및 플레이버 텍스트 */}
                <div className="holo-card-footer">
                  <p className="holo-quote-text">{spec.quote}</p>
                  <div className="holo-footer-meta">
                    <span>Illus. {spec.illustrator}</span>
                    <span className="holo-rarity-stamp">{spec.rarityText}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Rare Holo 무지개 회절광 + 포일 스캔라인 (card__shine) */}
            <div className="holo-card-shine" />

            {/* 2. 포인터를 따라다니는 글레어 반사광 (card__glare) */}
            <div className="holo-card-glare" />
          </div>

          {/* ===================== [카드 뒷면] ===================== */}
          <div className="holo-card-face holo-card-back">
            <div className="holo-back-pattern">
              <div className="holo-back-center-crest">
                <div className="holo-back-mascot-circle">
                  <SobimonMascot size={72} emotion="joy" />
                </div>
                <div className="holo-back-brand-text">SOBIMON</div>
                <div className="holo-back-sub-text">GAME FINANCE TCG</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 하단 컨트롤 바 (카드 뒤집기 버튼 등) */}
      <div className="holo-modal-bottom-bar" onClick={(e) => e.stopPropagation()}>
        <button 
          className="holo-flip-btn"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCw size={16} />
          <span>카드 뒤집기 ({isFlipped ? '앞면 보기' : '뒷면 보기'})</span>
        </button>
      </div>
    </div>
  );
}
