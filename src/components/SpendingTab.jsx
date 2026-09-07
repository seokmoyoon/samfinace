import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  UploadCloud, 
  PieChart, 
  Plus, 
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import CalendarTab from './CalendarTab';
import SmartInputTab from './SmartInputTab';
import ReportTab from './ReportTab';

export default function SpendingTab({ 
  transactions, 
  budget, 
  onAddTransaction, 
  onAddMultipleTransactions, 
  onTriggerPushSimulation,
  onOpenQuickAdd 
}) {
  const [subTab, setSubTab] = useState('calendar'); // 'calendar' | 'smart' | 'report'

  return (
    <div className="spending-screen">
      {/* 3단 서브 탭 스위처 */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: '#FFFFFF',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button
          onClick={() => setSubTab('calendar')}
          style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: subTab === 'calendar' ? 'var(--primary)' : 'transparent',
            color: subTab === 'calendar' ? '#FFFFFF' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'var(--transition-fast)'
          }}
        >
          <CalendarIcon size={14} /> 일별 달력
        </button>

        <button
          onClick={() => setSubTab('smart')}
          style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: subTab === 'smart' ? 'var(--primary)' : 'transparent',
            color: subTab === 'smart' ? '#FFFFFF' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'var(--transition-fast)'
          }}
        >
          <UploadCloud size={14} /> 스마트 수집
        </button>

        <button
          onClick={() => setSubTab('report')}
          style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: subTab === 'report' ? 'var(--primary)' : 'transparent',
            color: subTab === 'report' ? '#FFFFFF' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'var(--transition-fast)'
          }}
        >
          <PieChart size={14} /> 소비 분석
        </button>
      </div>

      {/* 서브 탭 컨텐츠 */}
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

      {subTab === 'report' && (
        <ReportTab 
          transactions={transactions}
          budget={budget}
        />
      )}
    </div>
  );
}
