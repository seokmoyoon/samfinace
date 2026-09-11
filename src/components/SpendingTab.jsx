import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  UploadCloud,
  PieChart
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

  const tabs = [
    { id: 'report', label: '분석', icon: PieChart },
    { id: 'calendar', label: '내역', icon: CalendarIcon },
    { id: 'smart', label: '가져오기', icon: UploadCloud }
  ];

  return (
    <div className="spending-screen spending-refresh" style={{ paddingBottom: '16px' }}>
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
