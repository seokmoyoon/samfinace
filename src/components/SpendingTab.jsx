import React, { useState } from 'react';
import {
  CalendarDays,
  CloudDownload,
  Plus,
  PieChart,
  Sparkles
} from 'lucide-react';

import CalendarTab from './CalendarTab';
import SmartInputTab from './SmartInputTab';
import ReportTab from './ReportTab';

export default function SpendingTab({
  transactions,
  budget,
  currentUser,
  onAddTransaction,
  onAddMultipleTransactions,
  onTriggerPushSimulation,
  onOpenQuickAdd,
  onSwitchToPCMode
}) {
  const [subTab, setSubTab] = useState('report');

  const totalExpense = transactions
    .filter((tx) => tx.type !== 'income')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const tabs = [
    { id: 'report', label: '분석', icon: PieChart },
    { id: 'calendar', label: '내역', icon: CalendarDays },
    { id: 'smart', label: '가져오기', icon: CloudDownload }
  ];

  return (
    <div className="spending-screen spending-refresh" style={{ paddingBottom: '16px' }}>
      <section className="spending-hero">
        <div>
          <div className="spending-eyebrow">
            <Sparkles size={13} /> 이번 달 소비
          </div>
          <strong className="spending-total">₩ {totalExpense.toLocaleString()}</strong>
          <p>기록은 가볍게, 분석은 소비몬이 정리해드려요.</p>
        </div>
        <button className="spending-add-button" onClick={() => onOpenQuickAdd && onOpenQuickAdd()}>
          <Plus size={18} strokeWidth={2.7} />
          <span>소비 기록</span>
        </button>
      </section>

      <div className="spending-segment" role="tablist" aria-label="소비 메뉴">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={subTab === id}
            className={subTab === id ? 'active' : ''}
            onClick={() => setSubTab(id)}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="spending-panel">
        {subTab === 'report' && (
          <ReportTab
            transactions={transactions}
            budget={budget}
            currentUser={currentUser}
            onSwitchToPCMode={onSwitchToPCMode}
          />
        )}

        {subTab === 'calendar' && (
          <CalendarTab
            transactions={transactions}
            onOpenQuickAdd={onOpenQuickAdd}
          />
        )}

        {subTab === 'smart' && (
          <SmartInputTab
            onAddTransaction={onAddTransaction}
            onAddMultipleTransactions={onAddMultipleTransactions}
            onTriggerPushSimulation={onTriggerPushSimulation}
          />
        )}
      </div>
    </div>
  );
}
