import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function BudgetProgress({ totalSpent, monthlyBudget }) {
  const remainingHp = Math.max(0, monthlyBudget - totalSpent);
  const spentPercent = monthlyBudget > 0 ? Math.min(100, Math.round((totalSpent / monthlyBudget) * 100)) : 0;
  const remainingPercent = 100 - spentPercent;

  let statusClass = 'good';
  let statusText = '예산 사용률 양호';
  if (spentPercent > 80) {
    statusClass = 'danger';
    statusText = '예산 위험 경보';
  } else if (spentPercent > 50) {
    statusClass = 'warn';
    statusText = '주의 구간';
  }

  return (
    <div className="budget-card">
      <div className="budget-header">
        <span className="budget-title">이번 달 소비 상태</span>
        <div className={`budget-chip ${statusClass}`}>
          {statusClass === 'good' ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
          <span>예산 사용률 {spentPercent}%</span>
        </div>
      </div>

      <div className="budget-amount-row">
        <span className="budget-main-val">₩{totalSpent.toLocaleString()}</span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
          / ₩{monthlyBudget.toLocaleString()}
        </span>
      </div>

      {/* 게이지 바 */}
      <div className="budget-gauge-bg">
        <div 
          className={`budget-gauge-fill ${statusClass}`}
          style={{ width: `${spentPercent}%` }}
        />
      </div>

      <div className="budget-footer-info">
        <span>남은 소비 가능 금액</span>
        <span style={{ fontWeight: 800, color: statusClass === 'danger' ? '#EF4444' : 'var(--primary)' }}>
          ₩{remainingHp.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
