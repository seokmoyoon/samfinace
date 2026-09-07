import React, { useState } from 'react';
import { X, Check, ArrowDownCircle, ArrowUpCircle, Repeat } from 'lucide-react';
import { INITIAL_ACCOUNTS } from '../data/mockData';

const EXPENSE_CATEGORIES = ['식비/외식', '카페/디저트', '쇼핑/마트', '교통/차량', '생활/통신', '의료/건강', '기타/생활'];
const INCOME_CATEGORIES = ['급여/월급', '상여금', '금융소득', '부수입/용돈', '기타 수입'];
const TRANSFER_CATEGORIES = ['적금/저축', '투자/주식', '대출상환', '통장간이체'];

export default function QuickAddModal({ isOpen, onClose, onSave, defaultDate }) {
  if (!isOpen) return null;

  const [type, setType] = useState('expense'); // 'expense' | 'income' | 'transfer'
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [account, setAccount] = useState(INITIAL_ACCOUNTS[0].name);
  const [date, setDate] = useState(defaultDate || '2026-09-07');
  const [memo, setMemo] = useState('');

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'expense') setCategory(EXPENSE_CATEGORIES[0]);
    else if (newType === 'income') setCategory(INCOME_CATEGORIES[0]);
    else setCategory(TRANSFER_CATEGORIES[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('올바른 금액을 입력해 주세요.');
      return;
    }

    const newItem = {
      id: 'manual_' + Date.now(),
      type: type === 'transfer' ? 'expense' : type,
      amount: numAmount,
      merchant: merchant.trim() || (type === 'income' ? '수입' : '지출'),
      cardCompany: account,
      category,
      date,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      source: '직접 입력',
      memo: memo.trim()
    };

    onSave(newItem);
    onClose();
  };

  const categories = type === 'expense' 
    ? EXPENSE_CATEGORIES 
    : type === 'income' 
      ? INCOME_CATEGORIES 
      : TRANSFER_CATEGORIES;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        border: '1px solid var(--border-subtle)',
        width: '100%',
        maxWidth: '420px',
        padding: '24px 20px',
        boxShadow: 'var(--shadow-md)',
        animation: 'slideUp 0.25s ease-out'
      }}>
        {/* 모달 상단 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
            직접 내역 기록하기
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. 수입 / 지출 / 이체 3단 탭 */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '18px'
        }}>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              background: type === 'expense' ? '#EF4444' : 'transparent',
              color: type === 'expense' ? '#fff' : 'var(--text-muted)'
            }}
          >
            지출 (-)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              background: type === 'income' ? 'var(--success)' : 'transparent',
              color: type === 'income' ? '#fff' : 'var(--text-muted)'
            }}
          >
            수입 (+)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('transfer')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              background: type === 'transfer' ? 'var(--primary)' : 'transparent',
              color: type === 'transfer' ? '#fff' : 'var(--text-muted)'
            }}
          >
            저축/이체 (⇄)
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 금액 입력 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              금액
            </label>
            <input
              type="text"
              placeholder="0원"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '18px',
                fontWeight: 800,
                color: type === 'income' ? 'var(--success)' : '#F87171',
                outline: 'none'
              }}
              autoFocus
            />
          </div>

          {/* 가맹점 / 내용 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              사용처 / 가맹점
            </label>
            <input
              type="text"
              placeholder="예: 스타벅스, 회사 월급, 저축 등"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          {/* 자산 / 결제수단 & 날짜 2열 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                결제수단 / 자산
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1A2138',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  fontSize: '12px',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              >
                {INITIAL_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.name}>
                    {acc.icon} {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                날짜
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1A2138',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '9px 10px',
                  fontSize: '12px',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* 카테고리 선택 알약 칩 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              카테고리
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: category === cat ? 'var(--primary-light)' : 'var(--border-subtle)',
                    background: category === cat ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: category === cat ? '#fff' : 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              메모 (선택)
            </label>
            <input
              type="text"
              placeholder="상세 메모"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: '12px',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: '8px', padding: '14px', fontSize: '14px' }}
          >
            기록 완료 ✨
          </button>
        </form>
      </div>
    </div>
  );
}
