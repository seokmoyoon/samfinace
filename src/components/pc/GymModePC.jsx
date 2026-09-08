import React, { useState } from 'react';
import { 
  Trophy, 
  Smartphone, 
  Crown, 
  FileSpreadsheet, 
  CreditCard, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { INITIAL_ACCOUNTS } from '../../data/mockData';
import LevelBadge from '../common/LevelBadge';
import CoinBadge from '../common/CoinBadge';
import SobimonHoloCardModal from '../common/SobimonHoloCardModal';

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

  // 카테고리별 지출 집계
  const spendingByCategory = transactions.reduce((acc, tx) => {
    if (tx.type === 'income') return acc;
    const cat = tx.category || '기타';
    acc[cat] = (acc[cat] || 0) + Number(tx.amount || 0);
    return acc;
  }, {});

  const totalSpent = Object.values(spendingByCategory).reduce((a, b) => a + b, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0F19',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ===================== [체육관 상단 컨트롤 바] ===================== */}
      <header style={{
        background: '#111827',
        borderBottom: '1px solid #1F2937',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={20} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 900, margin: 0, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>SOBIMON 체육관 (Gym Professional Mode)</span>
              <span style={{ fontSize: '10px', background: '#374151', padding: '2px 8px', borderRadius: '4px', color: '#9CA3AF' }}>PC 대화면</span>
            </h1>
          </div>
        </div>

        {/* 우측 유저 프로필 & 모드 전환 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 유저 요약 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#F3F4F6' }}>{user.name}</span>
            <LevelBadge level={user.level} size="sm" />
            <CoinBadge coins={user.coins} />
          </div>

          {/* 체육관장(Admin) 집무실 입장 버튼 (관장 계정 또는 테스트 지원) */}
          <button
            onClick={onOpenAdminHQ}
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #B45309)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Crown size={15} />
            <span>체육관장 GM 스튜디오 🏛️</span>
          </button>

          {/* 스마트폰 뷰로 전환 */}
          <button
            onClick={onSwitchToPhoneView}
            style={{
              background: '#1F2937',
              border: '1px solid #374151',
              color: '#E5E7EB',
              borderRadius: '9999px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={14} />
            <span>모바일 폰 뷰 전환</span>
          </button>
        </div>
      </header>

      {/* ===================== [체육관 3단 데스크톱 레이아웃] ===================== */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px 1fr 340px',
        gap: '20px',
        padding: '24px 28px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* [1열 - 좌측]: 자산 덱 & 계좌 인벤토리 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1F2937',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#9CA3AF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={16} color="#38BDF8" /> <span>자산 덱 & 결제수단</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {INITIAL_ACCOUNTS.map(acc => (
                <div key={acc.id} style={{
                  background: '#1F2937',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${acc.color}`
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#F3F4F6' }}>{acc.name}</div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{acc.type === 'credit' ? '신용카드' : '체크/입출금'}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: acc.balance < 0 ? '#F87171' : '#34D399' }}>
                    {acc.balance.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 월간 예산 상태 카드 */}
          <div style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #111827 100%)',
            border: '1px solid #312E81',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#A5B4FC', fontWeight: 800, marginBottom: '6px' }}>
              한 달 생활비 목표 예산 (HP)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>
              {(budget?.monthlyBudget || 1200000).toLocaleString()}원
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
              현재 총 소비: <span style={{ color: '#F87171', fontWeight: 800 }}>{totalSpent.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* [2열 - 중앙]: 엑셀 정산 연구소 & 거래내역 테이블 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1F2937',
            borderRadius: '20px',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#F9FAFB', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={18} color="#10B981" />
                <span>엑셀 정산 연구소 (거래내역 명세서)</span>
              </h3>
              <button
                onClick={onOpenQuickAdd}
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} />
                <span>지출 수기 등록</span>
              </button>
            </div>

            {/* 거래내역 대형 테이블 */}
            <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#1F2937', color: '#9CA3AF' }}>
                    <th style={{ padding: '10px 14px' }}>날짜</th>
                    <th style={{ padding: '10px 14px' }}>카테고리</th>
                    <th style={{ padding: '10px 14px' }}>상호명 / 메모</th>
                    <th style={{ padding: '10px 14px' }}>결제수단</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 15).map((tx, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1F2937' }}>
                      <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{tx.date}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          background: '#374151',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: '#F3F4F6'
                        }}>
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#F9FAFB' }}>{tx.title}</td>
                      <td style={{ padding: '10px 14px', color: '#6B7280' }}>{tx.paymentMethod}</td>
                      <td style={{
                        padding: '10px 14px',
                        textAlign: 'right',
                        fontWeight: 900,
                        color: tx.type === 'income' ? '#34D399' : '#F87171'
                      }}>
                        {tx.type === 'income' ? '+' : '-'}{Number(tx.amount).toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* [3열 - 우측]: 소비몬 홀로그램 도감 덱 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1F2937',
            borderRadius: '20px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#9CA3AF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#F59E0B" /> <span>소비몬 카드 덱 ({sobimons.length}종)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {sobimons.slice(0, 6).map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMonster(m)}
                  style={{
                    background: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{m.badge}</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#F9FAFB' }}>{m.name}</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Lv.{m.level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 카드 모달 */}
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
