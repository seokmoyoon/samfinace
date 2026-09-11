import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Crown,
  FileSpreadsheet,
  Layers,
  PieChart,
  Plus,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { INITIAL_ACCOUNTS } from '../../data/mockData';
import SobimonHoloCardModal from '../common/SobimonHoloCardModal';

const formatWon = (value = 0) => `${Number(value || 0).toLocaleString()}원`;

export default function GymModePC({
  user,
  budget,
  transactions = [],
  sobimons = [],
  currentUser,
  onSwitchToPhoneView,
  onOpenAdminHQ,
  onOpenQuickAdd
}) {
  const [selectedMonster, setSelectedMonster] = useState(null);

  const stats = useMemo(() => {
    const expense = transactions
      .filter((tx) => tx.type !== 'income')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const income = transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const byCategory = transactions.reduce((acc, tx) => {
      if (tx.type === 'income') return acc;
      const key = tx.category || '기타';
      acc[key] = (acc[key] || 0) + Number(tx.amount || 0);
      return acc;
    }, {});
    const topCategories = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return { expense, income, byCategory, topCategories };
  }, [transactions]);

  const monthlyBudget = Number(budget?.monthlyBudget || 0);
  const remaining = Math.max(0, monthlyBudget - stats.expense);
  const budgetRate = monthlyBudget > 0 ? Math.min(100, Math.round((stats.expense / monthlyBudget) * 100)) : 0;

  return (
    <div className="sobimon-pc-shell">
      <aside className="sobimon-pc-sidebar">
        <div className="sobimon-pc-brand">
          <div className="sobimon-pc-logo">S</div>
          <div>
            <strong>SOBIMON PC</strong>
            <span>Finance Workspace</span>
          </div>
        </div>

        <nav className="sobimon-pc-nav" aria-label="PC 재무 메뉴">
          <button className="active"><PieChart size={17} /> 대시보드</button>
          <button><FileSpreadsheet size={17} /> 거래내역</button>
          <button><Layers size={17} /> 월·연간 분석</button>
          <button><CreditCard size={17} /> 예산 관리</button>
          <button><FileSpreadsheet size={17} /> 세금·사업비 <span className="soon">준비중</span></button>
        </nav>

        <div className="sobimon-pc-sidebar-bottom">
          <button onClick={onSwitchToPhoneView}><Smartphone size={17} /> 모바일 소비몬으로</button>
          <button className="admin-link" onClick={onOpenAdminHQ}><Crown size={16} /> 운영 스튜디오</button>
        </div>
      </aside>

      <main className="sobimon-pc-main">
        <header className="sobimon-pc-header">
          <div>
            <p>내 돈을 한눈에 정리하는 공간</p>
            <h1>{user?.name || '사용자'}님의 재무 대시보드</h1>
          </div>
          <div className="sobimon-pc-header-actions">
            <span className="sync-state">● {currentUser ? '클라우드 연결됨' : '로컬 모드'}</span>
            <button className="pc-primary-action" onClick={onOpenQuickAdd}><Plus size={17} /> 거래 추가</button>
          </div>
        </header>

        <section className="pc-kpi-grid">
          <article className="pc-kpi-card featured">
            <div className="pc-kpi-label"><CreditCard size={16} /> 이번 달 지출</div>
            <strong>{formatWon(stats.expense)}</strong>
            <span>예산의 {budgetRate}% 사용</span>
          </article>
          <article className="pc-kpi-card">
            <div className="pc-kpi-label"><CreditCard size={16} /> 남은 예산</div>
            <strong>{formatWon(remaining)}</strong>
            <span>월 예산 {formatWon(monthlyBudget)}</span>
          </article>
          <article className="pc-kpi-card">
            <div className="pc-kpi-label"><ArrowUpRight size={16} /> 이번 달 수입</div>
            <strong>{formatWon(stats.income)}</strong>
            <span>{transactions.filter((tx) => tx.type === 'income').length}건 기록</span>
          </article>
          <article className="pc-kpi-card">
            <div className="pc-kpi-label"><FileSpreadsheet size={16} /> 전체 거래</div>
            <strong>{transactions.length.toLocaleString()}건</strong>
            <span>모바일과 동일한 데이터</span>
          </article>
        </section>

        <section className="pc-content-grid">
          <div className="pc-panel pc-transactions-panel">
            <div className="pc-panel-head">
              <div>
                <span className="pc-section-kicker">LEDGER</span>
                <h2>최근 거래내역</h2>
              </div>
              <button>전체 보기 <ChevronRight size={15} /></button>
            </div>

            <div className="pc-table-wrap">
              <table className="pc-ledger-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>카테고리</th>
                    <th>내용</th>
                    <th>결제수단</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 12).map((tx, index) => (
                    <tr key={tx.id || `${tx.date}-${index}`}>
                      <td>{tx.date || '-'}</td>
                      <td><span className="pc-category-chip">{tx.category || '기타'}</span></td>
                      <td><strong>{tx.title || tx.merchant || '거래'}</strong></td>
                      <td>{tx.paymentMethod || '-'}</td>
                      <td className={tx.type === 'income' ? 'income' : 'expense'}>
                        {tx.type === 'income' ? '+' : '-'}{formatWon(tx.amount)}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr><td colSpan="5" className="pc-empty">모바일에서 소비를 기록하면 여기에 자동으로 모입니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pc-side-stack">
            <div className="pc-panel">
              <div className="pc-panel-head compact">
                <div>
                  <span className="pc-section-kicker">SPENDING</span>
                  <h2>카테고리 지출</h2>
                </div>
              </div>
              <div className="pc-category-list">
                {stats.topCategories.map(([name, amount]) => {
                  const rate = stats.expense > 0 ? Math.round((amount / stats.expense) * 100) : 0;
                  return (
                    <div className="pc-category-row" key={name}>
                      <div><strong>{name}</strong><span>{rate}%</span></div>
                      <div className="pc-category-track"><span style={{ width: `${rate}%` }} /></div>
                      <em>{formatWon(amount)}</em>
                    </div>
                  );
                })}
                {stats.topCategories.length === 0 && <div className="pc-empty-card">분석할 지출 데이터가 아직 없습니다.</div>}
              </div>
            </div>

            <div className="pc-panel pc-sobimon-insight">
              <div className="pc-panel-head compact">
                <div>
                  <span className="pc-section-kicker">SOBIMON INSIGHT</span>
                  <h2>내 소비몬</h2>
                </div>
                <Sparkles size={18} />
              </div>
              <p>소비몬은 재미를 담당하고, PC에서는 데이터가 중심이 됩니다.</p>
              <div className="pc-monster-strip">
                {sobimons.filter((m) => m.discovered !== false).slice(0, 4).map((monster) => (
                  <button key={monster.id} onClick={() => setSelectedMonster(monster)}>
                    <span>{monster.badge || '👾'}</span>
                    <strong>{monster.name}</strong>
                    <small>Lv.{monster.level || 1}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="pc-panel pc-account-panel">
              <div className="pc-panel-head compact"><h2>결제수단</h2><CreditCard size={18} /></div>
              {INITIAL_ACCOUNTS.slice(0, 3).map((account) => (
                <div className="pc-account-row" key={account.id}>
                  <div><span className="pc-account-dot" style={{ background: account.color }} /><strong>{account.name}</strong></div>
                  <span>{formatWon(account.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedMonster && (
        <SobimonHoloCardModal
          isOpen={Boolean(selectedMonster)}
          onClose={() => setSelectedMonster(null)}
          monster={selectedMonster}
        />
      )}
    </div>
  );
}
