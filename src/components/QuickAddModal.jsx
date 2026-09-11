import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Coffee, Utensils, Bus, ShoppingBag, Home as HomeIcon, Gamepad2, Pill, LayoutGrid, Delete } from 'lucide-react';
import { SobimonMascot } from './common/SobimonIllustrations';
import { INITIAL_ACCOUNTS } from '../data/mockData';

const CATEGORIES = [
  { id: '식비/외식', label: '식비', icon: Utensils, bg: '#FFEDD5', color: '#EA580C' },
  { id: '카페/디저트', label: '카페', icon: Coffee, bg: '#CCFBF1', color: '#0D9488' },
  { id: '교통/차량', label: '교통', icon: Bus, bg: '#E0F2FE', color: '#0284C7' },
  { id: '쇼핑/마트', label: '쇼핑', icon: ShoppingBag, bg: '#FCE7F3', color: '#DB2777' },
  { id: '생활/통신', label: '생활', icon: HomeIcon, bg: '#D1FAE5', color: '#059669' },
  { id: '문화/여가', label: '문화/여가', icon: Gamepad2, bg: '#EDE9FE', color: '#7C3AED' },
  { id: '의료/건강', label: '의료', icon: Pill, bg: '#DBEAFE', color: '#2563EB' },
  { id: '기타/생활', label: '기타', icon: LayoutGrid, bg: '#FEF3C7', color: '#D97706' }
];

const todayKey = () => new Date().toLocaleDateString('sv-SE');
const RECENT_CATEGORY_KEY = 'sobimon_recent_category';

export default function QuickAddModal({ isOpen, onClose, onSave, defaultDate }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(todayKey());
  const [showKeypad, setShowKeypad] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setType('expense');
    setAmount('');
    setMemo('');
    setDate(defaultDate || todayKey());
    setShowKeypad(false);
    setSaving(false);
    try {
      const recent = localStorage.getItem(RECENT_CATEGORY_KEY);
      if (recent && CATEGORIES.some((c) => c.id === recent)) setSelectedCat(recent);
    } catch { /* storage unavailable */ }
  }, [isOpen, defaultDate]);

  const orderedCategories = useMemo(() => {
    const selected = CATEGORIES.find((c) => c.id === selectedCat);
    return selected ? [selected, ...CATEGORIES.filter((c) => c.id !== selected.id)] : CATEGORIES;
  }, [selectedCat]);

  if (!isOpen) return null;

  const press = (key) => {
    if (key === 'backspace') return setAmount((v) => v.slice(0, -1));
    if (key === 'clear') return setAmount('');
    if (key.startsWith('+')) return setAmount((v) => String(Number(v || 0) + Number(key.slice(1))));
    if (key === '00' && !amount) return;
    setAmount((v) => (v.length >= 10 ? v : `${v}${key}`.replace(/^0+(?=\d)/, '')));
  };

  const chooseCategory = (id) => {
    setSelectedCat(id);
    try { localStorage.setItem(RECENT_CATEGORY_KEY, id); } catch { /* ignore */ }
  };

  const submit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || saving) return;
    setSaving(true);
    const tx = {
      id: `tx_${Date.now()}`,
      type: type === 'transfer' ? 'expense' : type,
      amount: Math.round(value),
      merchant: memo.trim() || (type === 'income' ? '수입' : selectedCat.split('/')[0]),
      cardCompany: INITIAL_ACCOUNTS[0]?.name || '직접 입력',
      category: selectedCat,
      date: date || todayKey(),
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      source: '직접 입력',
      memo: memo.trim()
    };
    onSave?.(tx);
    window.dispatchEvent(new CustomEvent('sobimon:data-changed', { detail: { type: 'transaction-added', tx } }));
    onClose?.();
  };

  const canSave = Number(amount) > 0;

  return (
    <div className="fullscreen-sub-page">
      <div className="sub-page-header">
        <button onClick={onClose} aria-label="뒤로가기" style={{ background: 'transparent', border: 0, padding: 8, marginLeft: -8, cursor: 'pointer' }}><ChevronLeft size={24} /></button>
        <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>소비 기록</h3>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', border: '1.5px solid #3B82F6', overflow: 'hidden', display: 'grid', placeItems: 'center' }}><SobimonMascot size={30} emotion="happy" /></div>
      </div>

      <form className="sub-page-body" onSubmit={submit} style={{ padding: showKeypad ? '18px 20px 180px' : '18px 20px 24px' }}>
        <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 999, marginBottom: 18 }}>
          {[['expense','지출'],['income','수입'],['transfer','이체']].map(([id,label]) => <button key={id} type="button" onClick={() => setType(id)} style={{ flex: 1, padding: '9px 0', border: 0, borderRadius: 999, fontSize: 13, fontWeight: 800, background: type === id ? '#2563EB' : 'transparent', color: type === id ? '#fff' : '#64748B' }}>{label}</button>)}
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>금액</label>
        <button type="button" onClick={() => setShowKeypad(true)} style={{ width: '100%', marginTop: 8, marginBottom: 20, padding: '16px 18px', background: '#fff', border: showKeypad ? '2px solid #2563EB' : '1.5px solid #E2E8F0', borderRadius: 16, textAlign: 'left', cursor: 'pointer' }}>
          <span style={{ color: '#2563EB', fontSize: 18, fontWeight: 800 }}>₩ </span><span style={{ fontSize: 28, fontWeight: 900, color: amount ? '#0F172A' : '#94A3B8' }}>{amount ? Number(amount).toLocaleString() : '0'}</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><label style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>카테고리</label><span style={{ fontSize: 11, color: '#2563EB', fontWeight: 800 }}>최근 선택 우선</span></div>
        <div className="sobimon-category-grid" style={{ marginBottom: 20 }}>
          {orderedCategories.map((cat) => { const Icon = cat.icon; const active = selectedCat === cat.id; return <button key={cat.id} type="button" className={`sobimon-cat-btn ${active ? 'active' : ''}`} onClick={() => chooseCategory(cat.id)} style={{ border: 0 }}><div className="sobimon-cat-icon" style={{ background: cat.bg, color: cat.color }}><Icon size={22} /></div><span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? '#1D4ED8' : '#64748B' }}>{cat.label}</span></button>; })}
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>날짜</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', margin: '8px 0 16px', padding: 13, border: '1.5px solid #E2E8F0', borderRadius: 12, background: '#fff' }} />

        <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>사용처 · 메모 <span style={{ fontWeight: 500 }}>(선택)</span></label>
        <input value={memo} onChange={(e) => setMemo(e.target.value)} maxLength={60} placeholder="예: 점심 김치찌개" style={{ width: '100%', boxSizing: 'border-box', marginTop: 8, padding: 13, border: '1.5px solid #E2E8F0', borderRadius: 12, background: '#fff' }} />

        <button type="submit" disabled={!canSave || saving} className="sobimon-main-cta-btn" style={{ width: '100%', marginTop: 18, opacity: canSave ? 1 : .45 }}>{saving ? '저장 중...' : canSave ? `${Number(amount).toLocaleString()}원 기록하기` : '금액을 입력해 주세요'}</button>
      </form>

      {showKeypad && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50, background: '#fff', borderTop: '1px solid #E2E8F0', padding: '10px 16px 14px', boxShadow: '0 -8px 24px rgba(15,23,42,.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          {['+1000','+5000','+10000','+50000'].map(k => <button key={k} type="button" onClick={() => press(k)} style={{ padding: 8, border: 0, borderRadius: 9, background: '#EFF6FF', color: '#2563EB', fontWeight: 800, fontSize: 11 }}>{k.replace('+','+').replace(/000$/, '천').replace('100천','10만').replace('50000','5만')}</button>)}
          {['1','2','3','4','5','6','7','8','9','00','0'].map(k => <button key={k} type="button" onClick={() => press(k)} style={{ padding: 11, border: 0, borderRadius: 9, background: '#F8FAFC', fontWeight: 900, fontSize: 17 }}>{k}</button>)}
          <button type="button" onClick={() => press('backspace')} aria-label="한 자리 지우기" style={{ padding: 11, border: 0, borderRadius: 9, background: '#F1F5F9' }}><Delete size={20} /></button>
        </div>
      </div>}
    </div>
  );
}
