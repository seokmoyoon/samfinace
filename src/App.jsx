import React, { useState } from 'react';
import { 
  Home, 
  Calendar as CalendarIcon,
  PlusCircle, 
  PieChart, 
  Trophy, 
  Smartphone, 
  Monitor, 
  Wifi, 
  BatteryMedium,
  Plus
} from 'lucide-react';

import HomeTab from './components/HomeTab';
import CalendarTab from './components/CalendarTab';
import SmartInputTab from './components/SmartInputTab';
import ReportTab from './components/ReportTab';
import QuestTab from './components/QuestTab';
import QuickAddModal from './components/QuickAddModal';

import { 
  INITIAL_USER, 
  INITIAL_BUDGET, 
  INITIAL_QUESTS, 
  INITIAL_BADGES, 
  INITIAL_TRANSACTIONS 
} from './data/mockData';

import { parseCardSMS } from './utils/smsParser';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'calendar' | 'input' | 'report' | 'quests'
  const [isFullWidth, setIsFullWidth] = useState(false);

  // 앱 데이터 상태
  const [user, setUser] = useState(INITIAL_USER);
  const [budget, setBudget] = useState(INITIAL_BUDGET);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [badges, setBadges] = useState(INITIAL_BADGES);

  // 상단 가상 푸시 알림 배너 상태
  const [activePushNotification, setActivePushNotification] = useState(null);

  // 직접 추가(Quick Add) 모달 상태
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState('2026-09-07');

  // 단일 거래 내역 추가 (지출/수입/SMS 등)
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);

    // 지출인 경우 퀘스트 진행도 체크
    if (newTx.type !== 'income') {
      setQuests((prevQuests) =>
        prevQuests.map((q) => {
          if (q.category === newTx.category) {
            const nextVal = q.current + newTx.amount;
            return {
              ...q,
              current: nextVal,
              status: nextVal <= q.target ? 'progress' : 'failed'
            };
          }
          return q;
        })
      );
    }
  };

  // 복수 거래 내역 추가 (명세서 CSV)
  const handleAddMultipleTransactions = (items) => {
    setTransactions((prev) => [...items, ...prev]);

    setBadges((prev) =>
      prev.map((b) => (b.id === 'b4' ? { ...b, unlocked: true } : b))
    );
  };

  // 퀘스트 보상 수령
  const handleClaimReward = (questId, exp) => {
    setUser((prev) => {
      const nextExp = prev.exp + exp;
      if (nextExp >= prev.maxExp) {
        return {
          ...prev,
          level: prev.level + 1,
          exp: nextExp - prev.maxExp,
          maxExp: Math.floor(prev.maxExp * 1.3),
          title: prev.level + 1 >= 4 ? '황금 자산 수호자' : prev.title
        };
      }
      return { ...prev, exp: nextExp };
    });

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'claimed' } : q))
    );
  };

  // 모바일 알림 시뮬레이션
  const handleTriggerPushSimulation = (smsRawText) => {
    const parsed = parseCardSMS(smsRawText);
    if (!parsed) return;

    setActivePushNotification(parsed);
    handleAddTransaction(parsed);

    setTimeout(() => {
      setActivePushNotification(null);
    }, 4500);
  };

  const handleOpenQuickAdd = (targetDate) => {
    setQuickAddDate(targetDate || '2026-09-07');
    setIsQuickAddOpen(true);
  };

  return (
    <div className="app-wrapper">
      {/* 뷰 모드 토글 */}
      <div className="device-toolbar">
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>화면 뷰 모드:</span>
        <button 
          className={!isFullWidth ? 'active' : ''} 
          onClick={() => setIsFullWidth(false)}
        >
          <Smartphone size={15} /> 모바일 폰 뷰
        </button>
        <button 
          className={isFullWidth ? 'active' : ''} 
          onClick={() => setIsFullWidth(true)}
        >
          <Monitor size={15} /> 와이드 뷰
        </button>
      </div>

      {/* 스마트폰 목업 프레임 */}
      <div className={`mobile-frame ${isFullWidth ? 'full-width' : ''}`}>
        
        {/* 상단 상태바 */}
        <div className="phone-status-bar">
          <span>09:41</span>
          <div className="phone-island">
            <span>● 5G SaveQuest</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={13} />
            <BatteryMedium size={14} />
          </div>
        </div>

        {/* 상단 푸시 알림 배너 */}
        {activePushNotification && (
          <div className="push-simulation-banner" style={{
            borderLeft: `4px solid ${activePushNotification.badgeColor || 'var(--primary)'}`
          }}>
            <div className="push-avatar" style={{
              background: activePushNotification.badgeColor || 'var(--primary)',
              color: activePushNotification.badgeColor === '#FEE500' ? '#191919' : '#fff'
            }}>
              {activePushNotification.channel.includes('카카오') ? '💬' : activePushNotification.channel.includes('토스') ? '💙' : activePushNotification.channel.includes('네이버') ? '💚' : '💳'}
            </div>
            <div className="push-content">
              <div className="push-header">
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  [{activePushNotification.channel}] {activePushNotification.cardCompany}
                </span>
                <span>방금 전</span>
              </div>
              <div className="push-msg">
                {activePushNotification.merchant} -{activePushNotification.amount.toLocaleString()}원
              </div>
              <div style={{ fontSize: '10px', color: 'var(--success)', marginTop: '2px', fontWeight: 600 }}>
                ⚡ 자동 수집 완료 (체력 차감 및 달력 반영)
              </div>
            </div>
          </div>
        )}

        {/* 본문 스크린 */}
        <div className="screen-content">
          {activeTab === 'home' && (
            <HomeTab 
              user={user}
              budget={budget}
              transactions={transactions}
              quests={quests}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenQuickAdd={() => handleOpenQuickAdd('2026-09-07')}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarTab 
              transactions={transactions}
              onOpenQuickAdd={handleOpenQuickAdd}
            />
          )}

          {activeTab === 'input' && (
            <SmartInputTab 
              onAddTransaction={handleAddTransaction}
              onAddMultipleTransactions={handleAddMultipleTransactions}
              onTriggerPushSimulation={handleTriggerPushSimulation}
            />
          )}

          {activeTab === 'report' && (
            <ReportTab 
              transactions={transactions}
              budget={budget}
            />
          )}

          {activeTab === 'quests' && (
            <QuestTab 
              user={user}
              quests={quests}
              badges={badges}
              onClaimReward={handleClaimReward}
            />
          )}
        </div>

        {/* 편한가계부 스타일 5버튼 하단 내비게이션 바 */}
        <div className="bottom-nav">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <div className="nav-icon-wrap">
              <Home size={18} />
            </div>
            <span>홈/체력</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <div className="nav-icon-wrap">
              <CalendarIcon size={18} />
            </div>
            <span>달력</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'input' ? 'active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            <div className="nav-icon-wrap">
              <PlusCircle size={18} />
            </div>
            <span>통합수집</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <div className="nav-icon-wrap">
              <PieChart size={18} />
            </div>
            <span>분석</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            <div className="nav-icon-wrap">
              <Trophy size={18} />
            </div>
            <span>퀘스트</span>
          </button>
        </div>

        {/* 수기 직접 입력 모달 */}
        <QuickAddModal 
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onSave={handleAddTransaction}
          defaultDate={quickAddDate}
        />

      </div>
    </div>
  );
}
