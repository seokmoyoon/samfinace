import React, { useState } from 'react';
import { Lightbulb, CheckCircle, CreditCard, PieChart } from 'lucide-react';
import { INITIAL_ACCOUNTS } from '../data/mockData';

export default function ReportTab({ transactions, budget }) {
  const [reportType, setReportType] = useState('category'); // 'category' | 'account'

  // 지출만 필터링
  const expenseList = transactions.filter(t => t.type !== 'income');
  const totalSpent = expenseList.reduce((acc, cur) => acc + cur.amount, 0);

  // 1. 카테고리별 합산
  const categoryTotals = {};
  expenseList.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percent: totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = sortedCategories[0];

  // 2. 결제수단 / 카드별 지출 합산 (편한가계부 핵심 스타일)
  const accountTotals = {};
  expenseList.forEach((tx) => {
    const accName = tx.cardCompany || '기타';
    accountTotals[accName] = (accountTotals[accName] || 0) + tx.amount;
  });

  const sortedAccounts = Object.entries(accountTotals)
    .map(([acc, amt]) => ({
      account: acc,
      amount: amt,
      percent: totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // 카테고리별 색상
  const CAT_COLORS = {
    '식비/외식': '#EF4444',
    '쇼핑/마트': '#F59E0B',
    '카페/디저트': '#8B5CF6',
    '교통/차량': '#3B82F6',
    '생활/통신': '#10B981',
    '기타/생활': '#6B7280'
  };

  return (
    <div className="report-screen">
      {/* 헤더 */}
      <div style={{ marginBottom: '18px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>📊 쉬운 지출 흐름 분석</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          카테고리별 지출과 카드/통장별 결제 비중을 한눈에 파악합니다.
        </p>
      </div>

      {/* 1. 지출 요약 카드 */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>이번 달 누적 생활비</div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          {totalSpent.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 600 }}>원</span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginTop: '10px', 
          fontSize: '12px',
          color: 'var(--success)'
        }}>
          <CheckCircle size={14} />
          <span>예산 대비 <strong>{Math.max(0, budget.monthlyBudget - totalSpent).toLocaleString()}원</strong> 절약 방어 중!</span>
        </div>
      </div>

      {/* 2. 서브 탭: 카테고리별 vs 카드/결제수단별 */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => setReportType('category')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: reportType === 'category' ? 'var(--primary)' : 'transparent',
            color: reportType === 'category' ? '#fff' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <PieChart size={14} /> 카테고리별 분석
        </button>

        <button
          onClick={() => setReportType('account')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            background: reportType === 'account' ? 'var(--primary)' : 'transparent',
            color: reportType === 'account' ? '#fff' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <CreditCard size={14} /> 카드/결제수단별 분석
        </button>
      </div>

      {/* 스마트 어드바이저 팁 */}
      {topCategory && reportType === 'category' && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
            <Lightbulb size={16} /> 어디서 돈이 제일 많이 나갔을까?
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
            이번 달은 <strong style={{ color: '#F87171' }}>[{topCategory.category}]</strong>에 지출의 <strong style={{ color: '#F87171' }}>{topCategory.percent}%</strong> ({topCategory.amount.toLocaleString()}원)가 사용되었어요.
          </p>
        </div>
      )}

      {/* 카테고리별 랭킹 바 */}
      {reportType === 'category' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>
            소비 카테고리 순위
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sortedCategories.map((item) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{item.category}</span>
                  <span>
                    <strong style={{ color: 'var(--text-main)' }}>{item.amount.toLocaleString()}원</strong>{' '}
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({item.percent}%)</span>
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.percent}%`,
                    height: '100%',
                    background: CAT_COLORS[item.category] || 'var(--primary-light)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 결제수단 / 카드별 랭킹 바 */}
      {reportType === 'account' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>
            카드 및 결제수단별 지출 금액
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sortedAccounts.map((item) => (
              <div key={item.account}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💳 {item.account}
                  </span>
                  <span>
                    <strong style={{ color: 'var(--text-main)' }}>{item.amount.toLocaleString()}원</strong>{' '}
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({item.percent}%)</span>
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.percent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #38BDF8, #818CF8)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
