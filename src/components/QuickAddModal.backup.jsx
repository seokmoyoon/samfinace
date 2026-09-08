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
  LayoutGrid,
  Delete,
  Calculator,
  Check
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

// 금액을 읽기 쉬운 한글 단위(만/억)로 변환하는 토스/카카오페이 스타일 헬퍼
function formatKoreanCurrency(amountStr) {
  const num = parseInt(amountStr, 10);
  if (!num || isNaN(num) || num <= 0) return '';

  const eok = Math.floor(num / 100000000); // 억
  const man = Math.floor((num % 100000000) / 10000); // 만
  const remainder = num % 10000; // 천원 이하

  const parts = [];
  if (eok > 0) parts.push(`${eok.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (remainder > 0 && eok === 0) {
    parts.push(`${remainder.toLocaleString()}`);
  }

  return parts.length > 0 ? `${parts.join(' ')} 원` : '';
}

// 자릿수에 맞춰 말줄임 없이 전체 금액이 다 보이도록 폰트 크기 동적 조절
function getAmountFontSize(len) {
  if (len <= 6) return '30px'; // 999,999 이하 (가장 빈번한 일반 지출)
  if (len <= 8) return '25px'; // 10,000,000 이하
  if (len <= 10) return '21px'; // 1,000,000,000 이하
  return '18px';
}

export default function QuickAddModal({ isOpen, onClose, onSave, defaultDate }) {
  if (!isOpen) return null;

  const [type, setType] = useState('expense'); // 'expense' | 'income' | 'transfer'
  const [amount, setAmount] = useState('12000');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES_DATA[0].id);
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(defaultDate || '2026-09-07');
  const [showDiscoveryPopup, setShowDiscoveryPopup] = useState(false);
  const [savedData, setSavedData] = useState(null);

  // 하단 슬라이딩 숫자 키패드 열림 여부
  const [showKeypad, setShowKeypad] = useState(false);

  // 계산기 모달 열림 여부 및 계산기 상태
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcExpr, setCalcExpr] = useState('');
  const [calcResult, setCalcResult] = useState('');

  const handleClearAmount = (e) => {
    if (e) e.stopPropagation();
    setAmount('');
  };

  // 슬라이딩 숫자 키패드 핸들러
  const handleKeypadPress = (key) => {
    if (key === 'backspace') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : ''));
    } else if (key === 'clear') {
      setAmount('');
    } else if (key === '+1000') {
      setAmount((prev) => (Number(prev || 0) + 1000).toString());
    } else if (key === '+5000') {
      setAmount((prev) => (Number(prev || 0) + 5000).toString());
    } else if (key === '+10000') {
      setAmount((prev) => (Number(prev || 0) + 10000).toString());
    } else if (key === '+50000') {
      setAmount((prev) => (Number(prev || 0) + 50000).toString());
    } else if (key === '00') {
      if (!amount || amount === '0') return;
      if (amount.length < 10) setAmount((prev) => prev + '00');
    } else {
      if (amount.length >= 10) return;
      if (amount === '0' || !amount) {
        setAmount(key);
      } else {
        setAmount((prev) => prev + key);
      }
    }
  };

  // 계산기 열기
  const handleOpenCalculator = (e) => {
    if (e) e.stopPropagation();
    setCalcExpr(amount || '');
    setCalcResult(amount || '');
    setShowCalculator(true);
    setShowKeypad(false);
  };

  // 계산기 버튼 클릭 처리
  const handleCalcBtn = (val) => {
    if (val === 'C') {
      setCalcExpr('');
      setCalcResult('');
    } else if (val === '⌫') {
      const next = calcExpr.slice(0, -1);
      setCalcExpr(next);
      evalCalc(next);
    } else if (val === '=') {
      evalCalc(calcExpr, true);
    } else {
      const next = calcExpr + val;
      setCalcExpr(next);
      evalCalc(next);
    }
  };

  // 계산기 수식 안전 계산
  const evalCalc = (expr, isFinal = false) => {
    try {
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
      if (!/^[\d+\-*/. ]+$/.test(sanitized)) return;
      if (/[+\-*/.]$/.test(sanitized.trim())) return;
      // eslint-disable-next-line no-new-func
      const res = Function(`'use strict'; return (${sanitized})`)();
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        const rounded = Math.round(res);
        setCalcResult(rounded.toString());
        if (isFinal) {
          setCalcExpr(rounded.toString());
        }
      }
    } catch {
      // 무시
    }
  };

  // 계산된 금액을 입력창에 적용
  const handleApplyCalc = () => {
    const finalVal = calcResult || calcExpr;
    if (finalVal && Number(finalVal) > 0) {
      setAmount(finalVal);
    }
    setShowCalculator(false);
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
    setShowDiscoveryPopup(true);
  };

  const handleFinish = () => {
    setShowDiscoveryPopup(false);
    onClose();
  };

  return (
    <div className="fullscreen-sub-page">
      {/* 1. 상단 네비게이션 헤더 */}
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

      {/* 2. 스크롤 가능한 본문 영역 (평소에는 키패드가 없어 극도로 깔끔함) */}
      <div 
        className="sub-page-body" 
        style={{ padding: '20px 20px 24px' }}
        onClick={() => setShowKeypad(false)} // 바깥 터치 시 키패드 닫기
      >
        {/* 지출 / 수입 / 이체 세그먼트 */}
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
              onClick={(e) => { e.stopPropagation(); setType(item.id); }}
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

        {/* 금액 입력 디스플레이 카드 (터치 시 하단 키패드 슬라이드 업) */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              금액
            </label>
            <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>
              터치하여 입력
            </span>
          </div>

          <div 
            onClick={(e) => { e.stopPropagation(); setShowKeypad(true); }}
            style={{
              background: '#FFFFFF',
              border: showKeypad ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '16px 18px',
              cursor: 'pointer',
              boxShadow: showKeypad ? '0 4px 16px rgba(37, 99, 235, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* 숫자 및 원화 기호 (말줄임 없이 항상 온전한 숫자 노출) */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                flex: 1,
                minWidth: 0
              }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB', flexShrink: 0 }}>₩</span>
                <span style={{
                  fontSize: getAmountFontSize(amount ? amount.length : 0),
                  fontWeight: 900,
                  color: amount ? '#0F172A' : '#94A3B8',
                  letterSpacing: '-0.5px',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.1,
                  transition: 'font-size 0.15s ease'
                }}>
                  {amount ? Number(amount).toLocaleString() : '0'}
                </span>
                {/* 입력 중일 때 은은하게 깜빡이는 포커스 커서 */}
                {showKeypad && (
                  <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '24px',
                    background: '#2563EB',
                    marginLeft: '2px',
                    borderRadius: '1px',
                    animation: 'pulse 1s infinite'
                  }} />
                )}
              </div>

              {/* 우측 상태 칩 (오터치 방지를 위해 X 버튼 대신 상태 표시) */}
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: showKeypad ? '#2563EB' : '#94A3B8',
                background: showKeypad ? '#EFF6FF' : '#F8FAFC',
                padding: '4px 8px',
                borderRadius: '6px',
                flexShrink: 0,
                border: showKeypad ? '1px solid #BFDBFE' : '1px solid #E2E8F0'
              }}>
                {showKeypad ? '입력 중' : '수정'}
              </span>
            </div>

            {/* 토스/카카오페이 스타일 한글 단위 실시간 표기 (예: 1만 2,000 원) */}
            {amount && Number(amount) > 0 && (
              <div style={{
                marginTop: '6px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>{formatKoreanCurrency(amount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 카테고리 8개 그리드 */}
        <div style={{ marginBottom: '22px' }}>
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
                  onClick={(e) => { e.stopPropagation(); setSelectedCat(cat.id); }}
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

        {/* 날짜 선택 */}
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

        {/* 메모 (선택) */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '8px' }}>
            메모 (선택)
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예) 점심 식사, 장보기"
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

      {/* 3. 하단 고정 액션 버튼 푸터 */}
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

      {/* =========================================================================
          🌟 방법 2. 슬라이딩 바텀 숫자 키패드 (터치 시만 올라오는 미니멀 키패드)
         ========================================================================= */}
      {showKeypad && (
        <div 
          onClick={() => setShowKeypad(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.3)',
            zIndex: 1150,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.15s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '16px 18px 24px',
              boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.12)',
              animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* 키패드 상단 컨트롤 바 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid #F1F5F9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, flexShrink: 0 }}>금액:</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ₩ {amount ? Number(amount).toLocaleString() : '0'}
                </span>
                {amount && Number(amount) >= 10000 && (
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', whiteSpace: 'nowrap' }}>
                    ({formatKoreanCurrency(amount)})
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {/* 키패드 내부 안전한 전체삭제 버튼 */}
                {amount && (
                  <button
                    type="button"
                    onClick={() => setAmount('')}
                    style={{
                      background: '#F1F5F9',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                  >
                    초기화
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenCalculator}
                  style={{
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    padding: '5px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#2563EB',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Calculator size={13} />
                  <span>계산기</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowKeypad(false)}
                  style={{
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  완료 ✓
                </button>
              </div>
            </div>

            {/* 퀵 단위 칩 (1천, 5천, 1만, 5만) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              marginBottom: '10px'
            }}>
              {[
                { label: '+1천', val: '+1000' },
                { label: '+5천', val: '+5000' },
                { label: '+1만', val: '+10000' },
                { label: '+5만', val: '+50000' }
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => handleKeypadPress(chip.val)}
                  style={{
                    padding: '7px 0',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* 3x4 극도로 단순한 미니멀 숫자 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px'
            }}>
              {[
                '1', '2', '3',
                '4', '5', '6',
                '7', '8', '9',
                '00', '0', 'backspace'
              ].map((k) => {
                const isBackspace = k === 'backspace';
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleKeypadPress(k)}
                    style={{
                      height: '44px',
                      background: isBackspace ? '#FEF2F2' : '#FFFFFF',
                      border: '1px solid',
                      borderColor: isBackspace ? '#FECACA' : '#F1F5F9',
                      borderRadius: '10px',
                      fontSize: isBackspace ? '13px' : '17px',
                      fontWeight: 800,
                      color: isBackspace ? '#DC2626' : '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                      userSelect: 'none'
                    }}
                  >
                    {isBackspace ? <Delete size={18} /> : k}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          🧮 편한가계부 스타일 간편 계산기 모달
         ========================================================================= */}
      {showCalculator && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            width: '100%',
            maxWidth: '320px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            animation: 'zoomInModal 0.2s ease-out'
          }}>
            {/* 계산기 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calculator size={18} color="#2563EB" />
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>
                  간편 계산기
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCalculator(false)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* 수식 & 결과 디스플레이 */}
            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, minHeight: '16px' }}>
                {calcExpr || '수식을 입력하세요'}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                ₩ {calcResult ? Number(calcResult).toLocaleString() : '0'}
              </div>
            </div>

            {/* 4x4 계산기 버튼 패드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              marginBottom: '14px'
            }}>
              {[
                { k: '7', t: 'num' }, { k: '8', t: 'num' }, { k: '9', t: 'num' }, { k: '÷', t: 'op' },
                { k: '4', t: 'num' }, { k: '5', t: 'num' }, { k: '6', t: 'num' }, { k: '×', t: 'op' },
                { k: '1', t: 'num' }, { k: '2', t: 'num' }, { k: '3', t: 'num' }, { k: '-', t: 'op' },
                { k: 'C', t: 'clear' }, { k: '0', t: 'num' }, { k: '⌫', t: 'del' }, { k: '+', t: 'op' }
              ].map(({ k, t }) => {
                const isOp = t === 'op';
                const isClear = t === 'clear';
                const isDel = t === 'del';

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleCalcBtn(k)}
                    style={{
                      height: '42px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: isOp ? '#BFDBFE' : '#E2E8F0',
                      background: isOp ? '#EFF6FF' : isClear ? '#FEE2E2' : '#FFFFFF',
                      color: isOp ? '#1D4ED8' : isClear ? '#DC2626' : isDel ? '#DC2626' : '#0F172A',
                      fontSize: '15px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                    }}
                  >
                    {k}
                  </button>
                );
              })}
            </div>

            {/* 계산된 금액 적용 버튼 */}
            <button
              type="button"
              onClick={handleApplyCalc}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Check size={16} />
              <span>이 금액으로 적용하기</span>
            </button>
          </div>
        </div>
      )}

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
