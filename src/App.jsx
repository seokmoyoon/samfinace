import React, { useState, useEffect } from 'react';
import {
  Home,
  CreditCard,
  BookOpen,
  User,
  Zap,
  Plus
} from 'lucide-react';

import HomeTab from './components/HomeTab';
import SpendingTab from './components/SpendingTab';
import MissionTab from './components/MissionTab';
import SobimonDexTab from './components/SobimonDexTab';
import MyTab from './components/MyTab';
import QuickAddModal from './components/QuickAddModal';
import GymArenaModal from './components/common/GymArenaModal';
import GymLeaderDashboard from './components/pc/admin/GymLeaderDashboard';
import GymModePC from './components/pc/GymModePC';

import {
  INITIAL_USER,
  INITIAL_BUDGET,
  INITIAL_QUESTS,
  INITIAL_BADGES,
  INITIAL_TRANSACTIONS,
  INITIAL_SOBIMONS
} from './data/mockData';

import {
  loadFromStorage,
  saveToStorage,
  clearAllSobimonStorage,
  STORAGE_KEYS
} from './utils/storage';

import { authService } from './services/authService';
import { syncService } from './services/syncService';
import AuthModal from './components/common/AuthModal';
import { parseCardSMS } from './utils/smsParser';

const getTodayKey = () => new Date().toLocaleDateString('sv-SE');

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const [user, setUser] = useState(() => loadFromStorage(STORAGE_KEYS.USER, INITIAL_USER));
  const [budget, setBudget] = useState(() => loadFromStorage(STORAGE_KEYS.BUDGET, INITIAL_BUDGET));
  const [transactions, setTransactions] = useState(() => loadFromStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS));
  const [quests, setQuests] = useState(() => loadFromStorage(STORAGE_KEYS.QUESTS, INITIAL_QUESTS));
  const [badges, setBadges] = useState(() => loadFromStorage(STORAGE_KEYS.BADGES, INITIAL_BADGES));
  const [sobimons, setSobimons] = useState(() => loadFromStorage(STORAGE_KEYS.SOBIMONS, INITIAL_SOBIMONS));

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [isGymArenaOpen, setIsGymArenaOpen] = useState(false);
  const [isGymLeaderDashboardOpen, setIsGymLeaderDashboardOpen] = useState(false);
  const [isGymPCMode, setIsGymPCMode] = useState(false);
  const [pendingGymTarget, setPendingGymTarget] = useState(null);

  useEffect(() => { saveToStorage(STORAGE_KEYS.USER, user); }, [user]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.BUDGET, budget); }, [budget]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.QUESTS, quests); }, [quests]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.BADGES, badges); }, [badges]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SOBIMONS, sobimons); }, [sobimons]);

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const subscription = authService.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  const handleSyncCloud = async (authUser = currentUser) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSyncing(true);
    const res = await syncService.uploadLocalDataToCloud(authUser.id, {
      user,
      budget,
      transactions,
      sobimons,
      quests
    });
    setIsSyncing(false);

    if (res.success) {
      grantExp(40, '☁️ 클라우드 동기화 성공!', 20);
    } else {
      alert(`동기화 알림: ${res.message}`);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
    alert('로그아웃되었습니다. (로컬 게스트 모드로 전환됩니다)');
  };

  const handleResetData = () => {
    if (window.confirm('정말로 모든 가계부 내역과 소비몬 데이터를 초기 샘플 데이터로 리셋하시겠습니까?')) {
      clearAllSobimonStorage();
      setUser(INITIAL_USER);
      setBudget(INITIAL_BUDGET);
      setTransactions(INITIAL_TRANSACTIONS);
      setQuests(INITIAL_QUESTS);
      setBadges(INITIAL_BADGES);
      setSobimons(INITIAL_SOBIMONS);
      alert('초기 데이터로 깔끔하게 리셋되었습니다.');
    }
  };

  const [expToast, setExpToast] = useState(null);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [activePushNotification, setActivePushNotification] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState(getTodayKey());

  const grantExp = (amount, reason = '소비 기록 완료', coinBonus = 3) => {
    setExpToast({ amount, coins: coinBonus, reason });
    setTimeout(() => setExpToast(null), 2500);

    setUser((prev) => {
      const nextExp = prev.exp + amount;
      const nextCoins = (prev.coins || 3250) + coinBonus;

      if (nextExp >= prev.maxExp) {
        const nextLevel = prev.level + 1;
        setLevelUpModal({
          oldLevel: prev.level,
          newLevel: nextLevel,
          title: nextLevel >= 4 ? '황금 자산 수호자' : prev.title
        });

        return {
          ...prev,
          level: nextLevel,
          exp: nextExp - prev.maxExp,
          maxExp: Math.floor(prev.maxExp * 1.3),
          coins: nextCoins,
          title: nextLevel >= 4 ? '황금 자산 수호자' : prev.title
        };
      }
      return { ...prev, exp: nextExp, coins: nextCoins };
    });
  };

  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    grantExp(10, '👾 소비몬 출현 감지!', 5);

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

  const handleAddMultipleTransactions = (items) => {
    setTransactions((prev) => [...items, ...prev]);
    grantExp(50, '📜 카드 명세서 분석 완료!', 20);
    setBadges((prev) => prev.map((b) => (b.id === 'b4' ? { ...b, unlocked: true } : b)));
  };

  const handleClaimReward = (quest) => {
    grantExp(quest.rewardExp, `🎯 [${quest.title}] 클리어!`, quest.rewardCoin || 10);
    setQuests((prev) => prev.map((q) => (q.id === quest.id ? { ...q, status: 'claimed' } : q)));
  };

  const handleOpenTreasure = () => {
    grantExp(50, '🎁 보물상자 오픈!', 30);
  };

  const handleTriggerPushSimulation = (smsRawText) => {
    const parsed = parseCardSMS(smsRawText);
    if (!parsed) return;

    setActivePushNotification(parsed);
    handleAddTransaction(parsed);
    setTimeout(() => setActivePushNotification(null), 4500);
  };

  const handleOpenQuickAdd = (targetDate) => {
    setQuickAddDate(targetDate || getTodayKey());
    setIsQuickAddOpen(true);
  };

  const handleOpenGymPCMode = () => {
    if (!currentUser) {
      setPendingGymTarget('pc');
      alert('소비몬 PC는 로그인한 사용자만 이용할 수 있습니다.\n로그인하거나 무료 회원가입을 진행해 주세요.');
      setIsAuthModalOpen(true);
      return;
    }
    setIsGymPCMode(true);
  };

  const handleOpenGymArena = () => {
    if (!currentUser) {
      setPendingGymTarget('arena');
      alert('소비몬 아레나는 로그인한 사용자만 이용할 수 있습니다.\n로그인하거나 무료 회원가입을 진행해 주세요.');
      setIsAuthModalOpen(true);
      return;
    }
    setIsGymArenaOpen(true);
  };

  if (isGymLeaderDashboardOpen) {
    return (
      <GymLeaderDashboard
        currentUser={currentUser}
        onBackToGame={() => setIsGymLeaderDashboardOpen(false)}
      />
    );
  }

  if (isGymPCMode) {
    return (
      <GymModePC
        user={user}
        budget={budget}
        transactions={transactions}
        sobimons={sobimons}
        currentUser={currentUser}
        onSwitchToPhoneView={() => setIsGymPCMode(false)}
        onOpenAdminHQ={() => setIsGymLeaderDashboardOpen(true)}
        onOpenQuickAdd={() => handleOpenQuickAdd()}
      />
    );
  }

  return (
    <div className="app-wrapper">
      {expToast && (
        <div className="exp-gain-toast">
          <Zap size={16} color="#FBBF24" />
          <span>+{expToast.amount} EXP</span>
          <span style={{ fontSize: '11px', color: '#FEF08A' }}>(+{expToast.coins} COIN)</span>
          <span style={{ fontSize: '11px', color: '#DBEAFE', fontWeight: 600 }}>{expToast.reason}</span>
        </div>
      )}

      {levelUpModal && (
        <div className="levelup-overlay" onClick={() => setLevelUpModal(null)}>
          <div className="levelup-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)', marginBottom: '6px' }}>LEVEL UP!</h3>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              Lv.{levelUpModal.oldLevel} ➔ <span style={{ color: 'var(--primary)' }}>Lv.{levelUpModal.newLevel}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>새로운 소비 습관 레벨에 도달했어요.</p>
            <button className="btn-primary" onClick={() => setLevelUpModal(null)} style={{ padding: '12px', fontSize: '13px' }}>계속하기</button>
          </div>
        </div>
      )}

      <div className="mobile-frame">
        {activePushNotification && (
          <div className="push-simulation-banner" style={{ borderLeft: `4px solid ${activePushNotification.badgeColor || 'var(--primary)'}` }}>
            <div className="push-avatar" style={{ background: activePushNotification.badgeColor || 'var(--primary)', color: '#fff' }}>👾</div>
            <div className="push-content">
              <div className="push-header">
                <strong>{activePushNotification.channel} (소비몬 알림)</strong>
                <span>방금 전</span>
              </div>
              <div className="push-msg">[{activePushNotification.merchant}] {activePushNotification.amount?.toLocaleString()}원 소비 감지! (+10 EXP)</div>
            </div>
          </div>
        )}

        <div className="screen-content">
          {activeTab === 'home' && (
            <HomeTab
              user={user}
              budget={budget}
              transactions={transactions}
              quests={quests}
              sobimons={sobimons}
              onNavigateTab={setActiveTab}
              onOpenQuickAdd={() => handleOpenQuickAdd()}
            />
          )}

          {activeTab === 'spending' && (
            <SpendingTab
              transactions={transactions}
              budget={budget}
              currentUser={currentUser}
              onAddTransaction={handleAddTransaction}
              onAddMultipleTransactions={handleAddMultipleTransactions}
              onTriggerPushSimulation={handleTriggerPushSimulation}
              onOpenQuickAdd={handleOpenQuickAdd}
              onSwitchToPCMode={handleOpenGymPCMode}
            />
          )}

          {activeTab === 'missions' && (
            <MissionTab user={user} quests={quests} onClaimReward={handleClaimReward} />
          )}

          {activeTab === 'dex' && <SobimonDexTab user={user} sobimons={sobimons} />}

          {activeTab === 'my' && (
            <MyTab
              user={user}
              badges={badges}
              currentUser={currentUser}
              isSyncing={isSyncing}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onSyncCloud={() => handleSyncCloud()}
              onSignOut={handleSignOut}
              onOpenTreasure={handleOpenTreasure}
              onResetData={handleResetData}
              onOpenAdminHQ={() => setIsGymLeaderDashboardOpen(true)}
            />
          )}
        </div>

        <div className="bottom-nav bottom-nav-v2">
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <div className="nav-icon-wrap"><Home size={18} /></div>
            <span>홈</span>
          </button>

          <button className={`nav-item ${activeTab === 'spending' ? 'active' : ''}`} onClick={() => setActiveTab('spending')}>
            <div className="nav-icon-wrap"><CreditCard size={18} /></div>
            <span>소비</span>
          </button>

          <button className="nav-quick-add" onClick={() => handleOpenQuickAdd()} aria-label="소비 빠른 기록">
            <span><Plus size={27} strokeWidth={2.8} /></span>
            <small>기록</small>
          </button>

          <button className={`nav-item ${activeTab === 'dex' ? 'active' : ''}`} onClick={() => setActiveTab('dex')}>
            <div className="nav-icon-wrap"><BookOpen size={18} /></div>
            <span>도감</span>
          </button>

          <button className={`nav-item ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
            <div className="nav-icon-wrap"><User size={18} /></div>
            <span>MY</span>
          </button>
        </div>

        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onSave={handleAddTransaction}
          defaultDate={quickAddDate}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingGymTarget(null);
          }}
          onAuthSuccess={(u) => {
            setCurrentUser(u);
            handleSyncCloud(u);
            if (pendingGymTarget === 'pc') setIsGymPCMode(true);
            else if (pendingGymTarget === 'arena') setIsGymArenaOpen(true);
            setPendingGymTarget(null);
          }}
        />

        <GymArenaModal
          isOpen={isGymArenaOpen}
          onClose={() => setIsGymArenaOpen(false)}
          budget={budget}
          user={user}
          onSwitchToPCMode={handleOpenGymPCMode}
        />
      </div>
    </div>
  );
}
