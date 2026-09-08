import React, { useState } from 'react';
import { 
  ChevronLeft, 
  X, 
  Sparkles,
  Utensils,
  Coffee,
  Bus,
  ShoppingBag,
  Home as HomeIcon,
  Gamepad2,
  Pill,
  LayoutGrid
} from 'lucide-react';

import { SobimonMascot } from './common/SobimonIllustrations';
import { INITIAL_ACCOUNTS } from '../data/mockData';

// 시안의 8대 카테고리 정의
const CATEGORIES_DATA = [
  { id: '식비/외식', label: '식비', icon: Utensils, bg: '#FFEDD5', color: '#EA580C' },
  { id: '카페/디저트', label: '카페', icon: Coffee, bg: '#CCFBF1', color: '#0D9488' },
  { id: '교통/차량', label: '교통', icon: Bus, bg: '#E0F2FE', color: '#0284C7' },
  { id: '쇼핑/마트', label: '쇼핑', icon: ShoppingBag, bg: '#FCE7F3', color: '#DB2777' },
  { id: '생활/통신', label: '생활', icon: HomeIcon, bg: '#D1FAE5', color: '#059669' },
  { id: '문화/여가', label: '문화/여가', icon: Gamepad2, bg: '#EDE9FE', color: '#7C3AED' },
  { id: '의료/건강', label: '의료', icon: Pill, bg: '#DBEAFE', color: '#2563EB' },
  { id: '기타/생활', label: '기타', icon: LayoutGrid, bg: '#FEF3C7', color: '#D97706' }
];

export default function QuickAddModal({ isOpen, onClose, onSave, defaultDate }) {
  if (!isOpen) return null;

  const [type, setType] = useState('expense'); // 'expense' | 'income' | 'transfer'
  const [amount, setAmount] = useState('12000');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES_DATA[0].id);
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(defaultDate || '2026-09-07');
  const [showDiscoveryPopup, setShowDiscoveryPopup] = useState(false);
  const [savedData, setSavedData] = useState(null);

  // 금액 포맷팅
  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setAmount(raw);
  };

  const handleClearAmount = () => {
    setAmount('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('올바른 금액을 입력해 주세요.');
      return;
    }

    const newItem = {
      id: 'tx_' + Date.now(),
      type: type === 'transfer' ? 'expense' : type,
      amount: numAmount,
      merchant: memo.trim() || (type === 'income' ? '수입' : selectedCat.split('/')[0]),
      cardCompany: INITIAL_ACCOUNTS[0].name,
      category: selectedCat,
      date,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      source: '직접 입력',
      memo: memo.trim()
    };

    onSave(newItem);
    setSavedData(newItem);
    // 시안의 "소비몬이 발견됐어요!" 피드백 팝업 띄우기
    setShowDiscoveryPopup(true);
  };

  const handleFinish = () => {
    setShowDiscoveryPopup(false);
    onClose();
  };

  return (
    <div className="fullscreen-sub-page">
      {/* 상단 네비게이션 헤더 */}
      <div className="sub-page-header">
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E293B',
            padding: '8px',
            marginLeft: '-8px',
            borderRadius: '50%'
          }}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>

        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px', margin: 0 }}>
          소비 기록
        </h3>

        {/* 우측 캐릭터 아바타 */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#EFF6FF',
          border: '1.5px solid #3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <SobimonMascot size={30} emotion="happy" />
        </div>
      </div>

      {/* 스크롤 가능한 본문 영역 */}
      <div className="sub-page-body" style={{ padding: '20px 20px 24px' }}>
        {/* 1. 지출 / 수입 / 이체 세그먼트 버튼 */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          padding: '4px',
          borderRadius: '9999px',
          marginBottom: '20px'
        }}>
          {[
            { id: 'expense', label: '지출' },
            { id: 'income', label: '수입' },
            { id: 'transfer', label: '이체' }
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setType(item.id)}
              style={{
                flex: 1,
                padding: '9px 0',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                background: type === item.id ? '#2563EB' : 'transparent',
                color: type === item.id ? '#FFFFFF' : '#64748B',
                boxShadow: type === item.id ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 2. 금액 입력 (12,000 원 + 클리어 버튼) */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '8px' }}>
            금액
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '12px 16px'
          }}>
            <input
              type="text"
              value={amount ? Number(amount).toLocaleString() : ''}
              onChange={handleAmountChange}
              placeholder="0"
              autoFocus
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '22px',
                fontWeight: 900,
                color: '#0F172A',
                width: '100%',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {amount && (
                <button
                  type="button"
                  onClick={handleClearAmount}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#CBD5E1',
                    border: 'none',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} strokeWidth={3} />
                </button>
              )}
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#64748B' }}>원</span>
            </div>
          </div>
        </div>

        {/* 3. 카테고리 8개 그리드 (시안 반영) */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              카테고리
            </label>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 800 }}>
              {selectedCat.split('/')[0]} &gt;
            </span>
          </div>

          <div className="sobimon-category-grid">
            {CATEGORIES_DATA.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCat === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`sobimon-cat-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCat(cat.id)}
                >
                  <div 
                    className="sobimon-cat-icon"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    <IconComp size={22} strokeWidth={2.2} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? '#1D4ED8' : '#64748B'
                  }}>
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 날짜 선택 */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '8px' }}>
            날짜
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 5. 메모 (선택) */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '8px' }}>
            메모 (선택)
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예) 점심 식사"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: '13px',
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* 하단 고정 액션 버튼 푸터 */}
      <div className="sub-page-footer">
        <button
          type="button"
          onClick={handleSubmit}
          className="sobimon-main-cta-btn"
          style={{ margin: 0, width: '100%' }}
        >
          소비 기록 완료 ✨
        </button>
      </div>

      {/* 시안의 '소비몬이 발견됐어요!' 축하 팝업/카드 피드백 */}
      {showDiscoveryPopup && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px 20px',
            width: '100%',
            maxWidth: '340px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <SobimonMascot size={110} emotion="joy" />
            </div>

            <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>
              소비몬이 발견됐어요!
            </h4>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
              [{savedData?.category.split('/')[0]}] {savedData?.amount.toLocaleString()}원 기록 완료
            </p>

            {/* 획득 보상 칩 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              padding: '8px 16px',
              borderRadius: '9999px',
              marginBottom: '18px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#B45309' }}>
                ⭐ +10 EXP
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#B45309' }}>
                🪙 +5 COIN
              </span>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="sobimon-main-cta-btn"
              style={{ margin: 0 }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
