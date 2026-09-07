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
  onAddTransaction, 
  onAddMultipleTransactions, 
  onTriggerPushSimulation,
  onOpenQuickAdd 
}) {
  const [subTab, setSubTab] = useState('report'); // 시안의 소비 분석을 우선 확인 가능하게 지원

  return (
    <div className="spending-screen" style={{ paddingBottom: '16px' }}>
      {/* 3단 서브 탭 스위처 (시안 감성 알약 버튼) */}
      <div style={{
        display: 'flex',
        background: '#F1F5F9',
        padding: '4px',
        borderRadius: '9999px',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => setSubTab('report')}
          style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: subTab === 'report' ? '#2563EB' : 'transparent',
            color: subTab === 'report' ? '#FFFFFF' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            boxShadow: subTab === 'report' ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <PieChart size={14} /> 소비 분석
        </button>

        <button
          onClick={() => setSubTab('calendar')}
          style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: subTab === 'calendar' ? '#2563EB' : 'transparent',
            color: subTab === 'calendar' ? '#FFFFFF' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            boxShadow: subTab === 'calendar' ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.15s ease'
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
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            background: subTab === 'smart' ? '#2563EB' : 'transparent',
            color: subTab === 'smart' ? '#FFFFFF' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            boxShadow: subTab === 'smart' ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <UploadCloud size={14} /> 스마트 수집
        </button>
      </div>

      {/* 서브 탭 컨텐츠 */}
      {subTab === 'report' && (
        <ReportTab 
          transactions={transactions}
          budget={budget}
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
  );
}
