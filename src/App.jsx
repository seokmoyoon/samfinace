import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  Target, 
  BookOpen, 
  User, 
  Zap 
} from 'lucide-react';

import HomeTab from './components/HomeTab';
import SpendingTab from './components/SpendingTab';
import MissionTab from './components/MissionTab';
import SobimonDexTab from './components/SobimonDexTab';
import MyTab from './components/MyTab';
import QuickAddModal from './components/QuickAddModal';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'spending' | 'missions' | 'dex' | 'my'

  // 앱 데이터 상태 (Local-First: 로컬 저장소 우선 로드)
  const [user, setUser] = useState(() => loadFromStorage(STORAGE_KEYS.USER, INITIAL_USER));
  const [budget, setBudget] = useState(() => loadFromStorage(STORAGE_KEYS.BUDGET, INITIAL_BUDGET));
  const [transactions, setTransactions] = useState(() => loadFromStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS));
  const [quests, setQuests] = useState(() => loadFromStorage(STORAGE_KEYS.QUESTS, INITIAL_QUESTS));
  const [badges, setBadges] = useState(() => loadFromStorage(STORAGE_KEYS.BADGES, INITIAL_BADGES));
  const [sobimons, setSobimons] = useState(() => loadFromStorage(STORAGE_KEYS.SOBIMONS, INITIAL_SOBIMONS));

  // Supabase 클라우드 계정 및 동기화 상태
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 상태 변경 시 로컬 스토리지에 실시간 영구 자동 동기화
  useEffect(() => { saveToStorage(STORAGE_KEYS.USER, user); }, [user]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.BUDGET, budget); }, [budget]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.QUESTS, quests); }, [quests]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.BADGES, badges); }, [badges]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SOBIMONS, sobimons); }, [sobimons]);

  // 앱 로딩 시 Supabase 세션 체크
  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    const subscription = authService.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // 클라우드 동기화 (로컬 ➡️ Supabase 백업 & 동기화)
  const handleSyncCloud = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSyncing(true);
    const res = await syncService.uploadLocalDataToCloud(currentUser.id, {
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

  // 로그아웃
  const handleSignOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
    alert('로그아웃되었습니다. (로컬 게스트 모드로 전환됩니다)');
  };

  // 데이터 전체 초기화 핸들러 (샘플 데이터 복원)
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

  // EXP & COIN 획득 플로팅 토스트 상태
  const [expToast, setExpToast] = useState(null);

  // 레벨업 축하 모달 상태
  const [levelUpModal, setLevelUpModal] = useState(null);

  // 상단 가상 푸시 알림 배너 상태
  const [activePushNotification, setActivePushNotification] = useState(null);

  // 직접 추가(Quick Add) 모달 상태
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState('2026-09-07');

  // 경험치 추가 및 레벨업 체크
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

  // 단일 거래 내역 추가 (지출/수입/SMS 등)
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);

    // 소비 기록 완료 시 +10 EXP & +5 COIN 피드백
    grantExp(10, '👾 소비몬 출현 감지!', 5);

    // 소비인 경우 퀘스트 진행도 체크
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
    grantExp(50, '📜 카드 명세서 분석 완료!', 20);

    setBadges((prev) =>
      prev.map((b) => (b.id === 'b4' ? { ...b, unlocked: true } : b))
    );
  };

  // 퀘스트 보상 수령
  const handleClaimReward = (quest) => {
    grantExp(quest.rewardExp, `🎯 [${quest.title}] 클리어!`, quest.rewardCoin || 10);

    setQuests((prev) =>
      prev.map((q) => (q.id === quest.id ? { ...q, status: 'claimed' } : q))
    );
  };

  // 보물상자 오픈
  const handleOpenTreasure = () => {
    grantExp(50, '🎁 보물상자 오픈!', 30);
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
      {/* EXP & COIN 획득 플로팅 토스트 */}
      {expToast && (
        <div className="exp-gain-toast">
          <Zap size={16} color="#FBBF24" />
          <span>+{expToast.amount} EXP</span>
          <span style={{ fontSize: '11px', color: '#FEF08A' }}>
            (+{expToast.coins} COIN)
          </span>
          <span style={{ fontSize: '11px', color: '#DBEAFE', fontWeight: 600 }}>
            {expToast.reason}
          </span>
        </div>
      )}

      {/* 레벨업 축하 모달 */}
      {levelUpModal && (
        <div className="levelup-overlay" onClick={() => setLevelUpModal(null)}>
          <div className="levelup-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary)', marginBottom: '6px' }}>
              LEVEL UP!
            </h3>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              Lv.{levelUpModal.oldLevel} ➔ <span style={{ color: 'var(--primary)' }}>Lv.{levelUpModal.newLevel}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              축하합니다! 새로운 소비몬과의 탐험 레벨이 올랐습니다.
            </p>
            <button 
              className="btn-primary"
              onClick={() => setLevelUpModal(null)}
              style={{ padding: '12px', fontSize: '13px' }}
            >
              계속 탐험하기 ⚔️
            </button>
          </div>
        </div>
      )}
      {/* MVP 모바일 서비스 컨테이너 */}
      <div className="mobile-frame">
        {/* 상단 푸시 알림 배너 */}
        {activePushNotification && (
          <div className="push-simulation-banner" style={{
            borderLeft: `4px solid ${activePushNotification.badgeColor || 'var(--primary)'}`
          }}>
            <div className="push-avatar" style={{
              background: activePushNotification.badgeColor || 'var(--primary)',
              color: '#fff'
            }}>
              👾
            </div>
            <div className="push-content">
              <div className="push-header">
                <strong>{activePushNotification.channel} (소비몬 알림)</strong>
                <span>방금 전</span>
              </div>
              <div className="push-msg">
                [{activePushNotification.merchant}] {activePushNotification.amount?.toLocaleString()}원 소비 감지! (+10 EXP)
              </div>
            </div>
          </div>
        )}

        {/* 본문 스크린 (5대 탭) */}
        <div className="screen-content">
          {activeTab === 'home' && (
            <HomeTab 
              user={user}
              budget={budget}
              transactions={transactions}
              quests={quests}
              sobimons={sobimons}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenQuickAdd={() => handleOpenQuickAdd('2026-09-07')}
              onClaimReward={handleClaimReward}
            />
          )}

          {activeTab === 'spending' && (
            <SpendingTab 
              transactions={transactions}
              budget={budget}
              onAddTransaction={handleAddTransaction}
              onAddMultipleTransactions={handleAddMultipleTransactions}
              onTriggerPushSimulation={handleTriggerPushSimulation}
              onOpenQuickAdd={handleOpenQuickAdd}
            />
          )}

          {activeTab === 'missions' && (
            <MissionTab 
              user={user}
              quests={quests}
              onClaimReward={handleClaimReward}
            />
          )}

          {activeTab === 'dex' && (
            <SobimonDexTab 
              user={user}
              sobimons={sobimons}
            />
          )}

          {activeTab === 'my' && (
            <MyTab 
              user={user}
              badges={badges}
              currentUser={currentUser}
              isSyncing={isSyncing}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onSyncCloud={handleSyncCloud}
              onSignOut={handleSignOut}
              onOpenTreasure={handleOpenTreasure}
              onResetData={handleResetData}
            />
          )}
        </div>

        {/* 5대 탭 하단 내비게이션 바: 홈 / 소비 / 미션 / 도감 / MY */}
        <div className="bottom-nav">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <div className="nav-icon-wrap">
              <Home size={18} />
            </div>
            <span>홈</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'spending' ? 'active' : ''}`}
            onClick={() => setActiveTab('spending')}
          >
            <div className="nav-icon-wrap">
              <CreditCard size={18} />
            </div>
            <span>소비</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'missions' ? 'active' : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            <div className="nav-icon-wrap">
              <Target size={18} />
            </div>
            <span>미션</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'dex' ? 'active' : ''}`}
            onClick={() => setActiveTab('dex')}
          >
            <div className="nav-icon-wrap">
              <BookOpen size={18} />
            </div>
            <span>도감</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            <div className="nav-icon-wrap">
              <User size={18} />
            </div>
            <span>MY</span>
          </button>
        </div>

        {/* 직접 수기 추가 모달 */}
        <QuickAddModal 
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onSave={handleAddTransaction}
          defaultDate={quickAddDate}
        />

        {/* 클라우드 로그인 / 회원가입 모달 */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(u) => {
            setCurrentUser(u);
            handleSyncCloud();
          }}
        />

      </div>
    </div>
  );
}
