import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Save, 
  Trash2, 
  PlusCircle, 
  CheckCircle, 
  Zap, 
  Shield, 
  Flame, 
  Award,
  Layers,
  Palette,
  Eye
} from 'lucide-react';
import { sobimonMasterService } from '../../../services/sobimonMasterService';
import { 
  CafeMonsterIllustration, 
  FoodMonsterIllustration, 
  ShopMonsterIllustration, 
  SaverMonsterIllustration,
  SobimonMascot 
} from '../../common/SobimonIllustrations';

const CATEGORY_OPTIONS = [
  { value: 'cafe', label: '카페 / 음료', icon: '☕', defaultColor: '#0284C7' },
  { value: 'food', label: '식비 / 외식 / 배달', icon: '🍖', defaultColor: '#EA580C' },
  { value: 'shop', label: '쇼핑 / 마트 / 패션', icon: '🛒', defaultColor: '#DB2777' },
  { value: 'traffic', label: '교통 / 택시 / 차량', icon: '🚕', defaultColor: '#3B82F6' },
  { value: 'alcohol', label: '술자리 / 회식 / 모임', icon: '🍺', defaultColor: '#8B5CF6' },
  { value: 'sub', label: 'OTT / 정기구독', icon: '📺', defaultColor: '#6366F1' },
  { value: 'saver', label: '절약 / 무지출 수호', icon: '🛡️', defaultColor: '#059669' },
  { value: 'saving', label: '저축 / 투자 자산', icon: '🪙', defaultColor: '#D97706' }
];

const STAGE_OPTIONS = [
  '기본 (Basic)',
  '1진화 (Stage 1)',
  '2진화 (Stage 2 - VMAX)',
  '특수 (Special Holo)',
  '전설 (Legend / Secret)'
];

const RARITY_OPTIONS = [
  { value: 'common', label: '★ COMMON', text: '★ COMMON' },
  { value: 'uncommon', label: '★★ UNCOMMON', text: '★★ UNCOMMON HOLO' },
  { value: 'rare', label: '★★★ HOLO RARE', text: '★★★ HOLO RARE' },
  { value: 'epic', label: '★★★★ ULTRA RARE (VMAX)', text: '★★★★ ULTRA RARE (VMAX)' },
  { value: 'legend', label: '★★★★★ SECRET GOLD RAINBOW', text: '★★★★★ SECRET GOLD RAINBOW' }
];

const DEFAULT_NEW_MONSTER = {
  id: '',
  name: '',
  subtitle: '신비한 소비 정령',
  category: 'food',
  icon: '🍱',
  stage: '기본 (Basic)',
  hp: 150,
  rarity: 'rare',
  theme_color: '#EA580C',
  spawn_condition: '주 3회 이상 특정 지출 발생 시 소환',
  ability: {
    name: '소비 유혹',
    type: '특성 (Ability)',
    desc: '결제 시 잔고를 조금씩 줄여나갑니다.'
  },
  attacks: [
    {
      name: '기본 결제 어택',
      damage: '6,500',
      desc: '일상적인 소비 유혹'
    },
    {
      name: '지갑 파괴 필살기',
      damage: '18,000',
      desc: '단숨에 장바구니 총액을 늘립니다.'
    }
  ],
  weakness: '체계적인 월간 예산 방어',
  resistance: '포인트 적립 유혹',
  retreat_cost: 1,
  quote: '"오늘 고생했으니 이 정도는 써도 괜찮잖아...?"',
  illustrator: 'SOBIMON Game Master'
};

export default function MonsterCreatorStudio() {
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_NEW_MONSTER);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // 3D 카드 프리뷰 틸트 상태
  const previewRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0.6,
    bgX: 50,
    bgY: 50
  });

  // 몬스터 목록 불러오기
  const loadMonsters = async () => {
    setLoading(true);
    const data = await sobimonMasterService.getAllMasterSobimons();
    setMonsters(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMonsters();
  }, []);

  // 3D 카드 마우스 틸트 핸들러
  const handlePointerMove = (e) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    const percentY = Math.max(0, Math.min(100, Math.round((y / rect.height) * 100)));

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const rotateX = -(centerY / 50) * 18;
    const rotateY = (centerX / 50) * 18;

    setTilt({
      rotateX,
      rotateY,
      glareX: percentX,
      glareY: percentY,
      glareOpacity: 0.85,
      bgX: 50 + centerX * 0.8,
      bgY: 50 + centerY * 0.8
    });
  };

  const handlePointerLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0.3,
      bgX: 50,
      bgY: 50
    });
  };

  // 몬스터 저장 (배포)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('몬스터 이름을 입력해주세요.');
      return;
    }

    const id = formData.id.trim() 
      ? formData.id.trim() 
      : `mon_${Date.now()}`;

    const payload = {
      ...formData,
      id
    };

    try {
      setLoading(true);
      await sobimonMasterService.saveMasterSobimon(payload);
      setFeedbackMsg(`✨ [${payload.name}] 소비몬이 전 세계 도감에 배포되었습니다!`);
      setTimeout(() => setFeedbackMsg(null), 3500);
      setIsEditing(false);
      setFormData(DEFAULT_NEW_MONSTER);
      loadMonsters();
    } catch (err) {
      alert(`저장 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 기존 몬스터 수정 모드 진입
  const handleEdit = (monster) => {
    setFormData({
      ...monster,
      ability: monster.ability || DEFAULT_NEW_MONSTER.ability,
      attacks: Array.isArray(monster.attacks) && monster.attacks.length > 0 
        ? monster.attacks 
        : DEFAULT_NEW_MONSTER.attacks
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 몬스터 삭제
  const handleDelete = async (id, name) => {
    if (!window.confirm(`정말로 [${name}] 소비몬을 도감에서 삭제하시겠습니까?`)) return;
    try {
      setLoading(true);
      await sobimonMasterService.deleteMasterSobimon(id);
      loadMonsters();
    } catch (err) {
      alert(`삭제 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 일러스트 렌더링 헬퍼
  const renderArt = () => {
    const cat = formData.category;
    if (cat === 'cafe') return <CafeMonsterIllustration size={110} />;
    if (cat === 'food' || cat === 'alcohol') return <FoodMonsterIllustration size={110} />;
    if (cat === 'shop') return <ShopMonsterIllustration size={110} />;
    if (cat === 'saver' || cat === 'saving') return <SaverMonsterIllustration size={110} />;
    return <SobimonMascot size={110} emotion="happy" />;
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 상단 타이틀 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 6px' }}>
            <Sparkles size={24} color="#F59E0B" />
            <span>소비몬 창작 공방 (Monster Creator Studio)</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            새로운 소비몬과 홀로그램 카드를 실시간으로 디자인하고, 전 세계 도전자 도감에 즉시 배포합니다.
          </p>
        </div>

        {feedbackMsg && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            padding: '10px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)'
          }}>
            <CheckCircle size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* 2단 레이아웃: 좌측 설정 폼 / 우측 실시간 3D 홀로그램 카드 프리뷰 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(480px, 1fr) 380px',
        gap: '24px',
        alignItems: 'start',
        marginBottom: '36px'
      }}>
        {/* ===================== [좌측 폼] ===================== */}
        <form onSubmit={handleSave} style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#3B82F6" />
            <span>{isEditing ? '소비몬 스펙 개조' : '새로운 소비몬 창조'}</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                소비몬 이름 *
              </label>
              <input
                type="text"
                placeholder="예: 편의점야식몬, OTT폭식몬"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                서브타이틀 (이명)
              </label>
              <input
                type="text"
                placeholder="예: 새벽 골목의 유혹자"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                소비 카테고리
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const found = CATEGORY_OPTIONS.find(c => c.value === e.target.value);
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    icon: found?.icon || '👾',
                    theme_color: found?.defaultColor || formData.theme_color
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  background: '#FFF'
                }}
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                진화 단계 (Stage)
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  background: '#FFF'
                }}
              >
                {STAGE_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                기본 체력 (HP)
              </label>
              <input
                type="number"
                min="60"
                max="340"
                step="10"
                value={formData.hp}
                onChange={(e) => setFormData({ ...formData, hp: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                카드 레어도 (Rarity)
              </label>
              <select
                value={formData.rarity}
                onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  background: '#FFF'
                }}
              >
                {RARITY_OPTIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                테마 컬러
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={formData.theme_color}
                  onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                  style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                />
                <input
                  type="text"
                  value={formData.theme_color}
                  onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
              출현 조건 (Spawn Trigger)
            </label>
            <input
              type="text"
              placeholder="예: 주 3회 이상 밤 10시 배달앱 이용 시 출현"
              value={formData.spawn_condition}
              onChange={(e) => setFormData({ ...formData, spawn_condition: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 특성 (Ability) 설정 */}
          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#92400E', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> <span>특성 (Ability)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="특성명 (예: 4캔의 마법)"
                value={formData.ability?.name || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  ability: { ...formData.ability, name: e.target.value }
                })}
                style={{ padding: '8px 10px', border: '1px solid #F59E0B', borderRadius: '8px', fontSize: '12px' }}
              />
              <input
                type="text"
                placeholder="특성 발동 효과 설명"
                value={formData.ability?.desc || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  ability: { ...formData.ability, desc: e.target.value }
                })}
                style={{ padding: '8px 10px', border: '1px solid #F59E0B', borderRadius: '8px', fontSize: '12px' }}
              />
            </div>
          </div>

          {/* 공격 기술 1 & 2 */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={14} color="#DC2626" /> <span>공격 기술 (Attacks)</span>
            </div>
            
            {/* 기술 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 100px 1fr', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="기술 1 이름"
                value={formData.attacks?.[0]?.name || ''}
                onChange={(e) => {
                  const updated = [...(formData.attacks || [])];
                  updated[0] = { ...(updated[0] || {}), name: e.target.value };
                  setFormData({ ...formData, attacks: updated });
                }}
                style={{ padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
              />
              <input
                type="text"
                placeholder="피해액 (데미지)"
                value={formData.attacks?.[0]?.damage || ''}
                onChange={(e) => {
                  const updated = [...(formData.attacks || [])];
                  updated[0] = { ...(updated[0] || {}), damage: e.target.value };
                  setFormData({ ...formData, attacks: updated });
                }}
                style={{ padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
              />
              <input
                type="text"
                placeholder="기술 설명"
                value={formData.attacks?.[0]?.desc || ''}
                onChange={(e) => {
                  const updated = [...(formData.attacks || [])];
                  updated[0] = { ...(updated[0] || {}), desc: e.target.value };
                  setFormData({ ...formData, attacks: updated });
                }}
                style={{ padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
              />
            </div>

            {/* 기술 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 100px 1fr', gap: '8px' }}>
              <input
                type="text"
                placeholder="기술 2 (필살기)"
                value={formData.attacks?.[1]?.name || ''}
                onChange={(e) => {
                  const updated = [...(formData.attacks || [])];
                  updated[1] = { ...(updated[1] || {}), name: e.target.value };
                  setFormData({ ...formData, attacks: updated });
                }}
                style={{ padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
              />
              <input
                type="text"
                placeholder="피해액"
                value={formData.attacks?.[1]?.damage || ''}
                onChange={(e) => {
                  const updated = [...(formData.attacks || [])];
                  updated[1] = { ...(updated[1] || {}), damage: e.target.value };
                  setFormData({ ...formData, attacks: updated });
                }}
                style={{ padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
              />
              <input
                type="text"
                placeholder="필살기 설명"
                value={formData.attacks?.[1]?.desc || ''}
                onChange={(e) => {
                  const updated = [...(formData.attacks || [])];
                  updated[1] = { ...(updated[1] || {}), desc: e.target.value };
                  setFormData({ ...formData, attacks: updated });
                }}
                style={{ padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                약점 (방어 행동)
              </label>
              <input
                type="text"
                value={formData.weakness}
                onChange={(e) => setFormData({ ...formData, weakness: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                저항력 (취약점)
              </label>
              <input
                type="text"
                value={formData.resistance}
                onChange={(e) => setFormData({ ...formData, resistance: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
              플레이버 명언 (유저의 뼈를 때리는 소비 명언)
            </label>
            <input
              type="text"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          {/* 액션 버튼 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Save size={18} />
              <span>{isEditing ? '스펙 변경 사항 도감에 배포' : '새로운 소비몬 도감에 배포'}</span>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(DEFAULT_NEW_MONSTER);
                }}
                style={{
                  padding: '14px 20px',
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
            )}
          </div>
        </form>

        {/* ===================== [우측 실시간 3D 홀로그램 카드 프리뷰] ===================== */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#475569',
              background: '#F1F5F9',
              padding: '4px 12px',
              borderRadius: '9999px'
            }}>
              <Eye size={13} color="#3B82F6" />
              <span>실시간 3D 홀로그램 프리뷰 (마우스 틸트 반응)</span>
            </span>
          </div>

          <div
            className="holo-card-stage"
            style={{ width: '340px', height: '505px', margin: '0 auto' }}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
          >
            <div
              ref={previewRef}
              className={`holo-card-3d ${isFlipped ? 'flipped' : ''}`}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY + (isFlipped ? 180 : 0)}deg) scale3d(1.02, 1.02, 1.02)`
              }}
            >
              {/* 앞면 */}
              <div 
                className="holo-card-face holo-card-front"
                style={{
                  background: `linear-gradient(135deg, #FFFFFF 0%, ${formData.theme_color}33 100%)`
                }}
              >
                <div 
                  className="holo-layer-glare"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 30%, transparent 65%)`,
                    opacity: tilt.glareOpacity
                  }}
                />
                <div 
                  className="holo-layer-rainbow"
                  style={{
                    backgroundPosition: `${tilt.bgX}% ${tilt.bgY}%`
                  }}
                />
                <div className="holo-layer-sparkles" />

                {/* 카드 내부 프레임 */}
                <div className="holo-card-inner-frame" style={{ borderColor: formData.theme_color }}>
                  {/* 헤더 */}
                  <div className="holo-card-header">
                    <div className="holo-header-left">
                      <span className="holo-card-stage-tag">{formData.stage}</span>
                      <h4 className="holo-card-name">{formData.name || '미지의 소비몬'}</h4>
                    </div>
                    <div className="holo-header-right">
                      <span className="holo-card-hp-label">HP</span>
                      <span className="holo-card-hp-val">{formData.hp}</span>
                      <div className="holo-element-badge" style={{ background: formData.theme_color }}>
                        {formData.icon}
                      </div>
                    </div>
                  </div>

                  {/* 일러스트 창 */}
                  <div className="holo-art-window">
                    <div className="holo-art-bg-aura" />
                    <div className="holo-art-sprite">
                      {renderArt()}
                    </div>
                    <div className="holo-art-caption">
                      {formData.subtitle}
                    </div>
                  </div>

                  {/* 특성 박스 */}
                  {formData.ability?.name && (
                    <div className="holo-ability-box">
                      <div className="holo-ability-title-row">
                        <span className="holo-ability-badge">특성</span>
                        <strong className="holo-ability-name">{formData.ability.name}</strong>
                      </div>
                      <p className="holo-ability-desc">{formData.ability.desc}</p>
                    </div>
                  )}

                  {/* 기술 목록 */}
                  <div className="holo-attacks-box">
                    {(formData.attacks || []).map((atk, i) => (
                      <div key={i} className="holo-attack-row">
                        <div className="holo-attack-cost">
                          <span className="holo-cost-orb">{formData.icon}</span>
                        </div>
                        <div className="holo-attack-info">
                          <div className="holo-attack-name-row">
                            <strong className="holo-attack-name">{atk.name || `기술 ${i + 1}`}</strong>
                            <span className="holo-attack-damage">{atk.damage || '0'}</span>
                          </div>
                          <p className="holo-attack-desc">{atk.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 약점 / 저항력 */}
                  <div className="holo-weakness-bar">
                    <div className="holo-rule-col">
                      <span>약점</span>
                      <strong>{formData.weakness}</strong>
                    </div>
                    <div className="holo-rule-col">
                      <span>저항력</span>
                      <strong>{formData.resistance}</strong>
                    </div>
                    <div className="holo-rule-col">
                      <span>후퇴 비용</span>
                      <strong>{'⭐'.repeat(formData.retreat_cost || 1)}</strong>
                    </div>
                  </div>

                  {/* 하단 메타 */}
                  <div className="holo-card-footer">
                    <p className="holo-quote-text">{formData.quote}</p>
                    <div className="holo-footer-meta">
                      <span>Illus. {formData.illustrator}</span>
                      <span className="holo-rarity-stamp">
                        {RARITY_OPTIONS.find(r => r.value === formData.rarity)?.text || '★★★ HOLO RARE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 뒷면 */}
              <div className="holo-card-face holo-card-back">
                <div className="holo-back-pattern">
                  <div className="holo-back-center-crest">
                    <div className="holo-back-mascot-circle">
                      <SobimonMascot size={72} emotion="joy" />
                    </div>
                    <div className="holo-back-brand-text">SOBIMON</div>
                    <div className="holo-back-sub-text">GAME MASTER FORGE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#475569',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <RotateCw size={12} />
              <span>카드 뒤집기 ({isFlipped ? '앞면 보기' : '뒷면 보기'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== [하단: 기등록된 마스터 도감 목록] ===================== */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            전 세계 배포 중인 마스터 소비몬 목록 ({monsters.length}종)
          </h3>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData(DEFAULT_NEW_MONSTER);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#EFF6FF',
              color: '#2563EB',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={14} />
            <span>새 소비몬 만들기</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {monsters.map((m) => (
            <div
              key={m.id}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderLeft: `4px solid ${m.theme_color || '#3B82F6'}`,
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{m.icon || '👾'}</span>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', margin: 0 }}>{m.name}</h4>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>{m.subtitle}</span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#DC2626',
                    background: '#FEF2F2',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    HP {m.hp}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px', lineHeight: '1.4' }}>
                  <strong>출현:</strong> {m.spawn_condition}
                </div>

                <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 800 }}>
                  {m.rarity?.toUpperCase()} • {m.stage}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                <button
                  onClick={() => handleEdit(m)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#0F172A',
                    cursor: 'pointer'
                  }}
                >
                  스펙 수정
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  style={{
                    padding: '6px 10px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#DC2626',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
