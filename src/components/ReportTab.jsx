import React, { useState } from 'react';
import { Lightbulb, CheckCircle, CreditCard, PieChart, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { INITIAL_ACCOUNTS, INITIAL_SOBIMONS } from '../data/mockData';

export default function ReportTab({ transactions, budget }) {
  const [reportType, setReportType] = useState('category'); // 'category' | 'account'

  // 소비(수입 제외)만 필터링
  const expenseList = transactions.filter(t => t.type !== 'income');
  const totalSpent = expenseList.reduce((acc, cur) => acc + cur.amount, 0);

  // 1. 소비 속성(카테고리)별 합산
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

  // 지출 1위 속성에 매핑되는 소비몬 찾기
  const getMonsterForCategory = (cat) => {
    if (!cat) return null;
    if (cat.includes('카페')) return INITIAL_SOBIMONS.find(m => m.id === 'mon_cafe');
    if (cat.includes('식비') || cat.includes('외식')) return INITIAL_SOBIMONS.find(m => m.id === 'mon_delivery');
    if (cat.includes('쇼핑') || cat.includes('마트')) return INITIAL_SOBIMONS.find(m => m.id === 'mon_shop');
    if (cat.includes('교통')) return INITIAL_SOBIMONS.find(m => m.id === 'mon_traffic');
    return INITIAL_SOBIMONS[0];
  };

  const strongestMonster = topCategory ? getMonsterForCategory(topCategory.category) : null;

  // 2. 결제수단 / 카드별 소비 합산
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

  // 속성별 색상
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
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>📊 월간 탐험 소비 분석</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          내 소비 속성을 게임 통계로 분석하고 가장 강력한 소비몬을 추적합니다.
        </p>
      </div>

      {/* 1. 이번 달 가장 강력한 소비몬 (보스 몬스터 HUD) */}
      {strongestMonster && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(139, 92, 246, 0.08))',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={14} /> 이번 달 가장 강력한 소비몬 (지출 1위)
            </span>
            <span style={{ fontSize: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              보스 경보
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0
            }}>
              {strongestMonster.badge}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                {strongestMonster.name} <span style={{ fontSize: '12px', color: '#FCA5A5' }}>Lv.{strongestMonster.level}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#E2E8F0', marginTop: '2px' }}>
                이번 달 누적 <strong style={{ color: '#F87171' }}>{topCategory.amount.toLocaleString()}원</strong> ({topCategory.percent}% 차지)
              </div>
              <div style={{ fontSize: '11px', color: '#DDD6FE', fontStyle: 'italic', marginTop: '4px' }}>
                {strongestMonster.quote}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 서브 탭: 소비 속성별 vs 카드/결제수단별 */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
        border: '1px solid var(--border-subtle)'
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
          <PieChart size={14} /> 소비 속성별 분석
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
          <CreditCard size={14} /> 결제수단별 분석
        </button>
      </div>

      {/* 속성별 순위 바 */}
      {reportType === 'category' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-main)' }}>
            소비 속성 분포
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
          <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-main)' }}>
            카드 및 보유 계좌별 소비 금액
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
