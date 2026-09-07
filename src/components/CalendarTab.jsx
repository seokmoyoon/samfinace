import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, ShieldCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const CATEGORY_ICONS = {
  '카페/디저트': '☕',
  '식비/외식': '🍱',
  '쇼핑/마트': '🛒',
  '교통/차량': '🚕',
  '생활/통신': '📱',
  '의료/건강': '💊',
  '급여/월급': '💰',
  '기타/생활': '💳'
};

export default function CalendarTab({ transactions, onOpenQuickAdd }) {
  // 기준 년월: 2026년 9월
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [selectedDateStr, setSelectedDateStr] = useState('2026-09-07');

  // 2026년 9월 날짜 계산 (9월은 총 30일, 9월 1일은 화요일 = index 2)
  const daysInMonth = 30;
  const startDayOfWeek = 2; // 0: 일, 1: 월, 2: 화...

  // 날짜별 수입/지출 집계 맵
  const dailySummary = {};
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    dailySummary[dayStr] = { expense: 0, income: 0, items: [] };
  }

  // 거래 내역 매핑
  transactions.forEach((tx) => {
    // tx.date가 '2026-09-07' 형태이거나 한글인 경우 보정
    let key = tx.date;
    if (tx.date.includes('09월 07일') || tx.date.includes('오늘')) {
      key = '2026-09-07';
    } else if (tx.date.includes('09월 06일')) {
      key = '2026-09-06';
    } else if (tx.date.includes('09월 05일')) {
      key = '2026-09-05';
    }

    if (dailySummary[key]) {
      if (tx.type === 'income') {
        dailySummary[key].income += tx.amount;
      } else {
        dailySummary[key].expense += tx.amount;
      }
      dailySummary[key].items.push(tx);
    }
  });

  // 이번 달 전체 통계
  let monthTotalExpense = 0;
  let monthTotalIncome = 0;
  let noSpendDaysCount = 0;

  Object.entries(dailySummary).forEach(([dateStr, data]) => {
    monthTotalExpense += data.expense;
    monthTotalIncome += data.income;
    const dayNum = parseInt(dateStr.split('-')[2], 10);
    // 오늘(7일) 이전 날 중 지출이 0원인 날
    if (dayNum < 7 && data.expense === 0) {
      noSpendDaysCount++;
    }
  });

  // 선택된 날짜의 거래 목록
  const selectedDayData = dailySummary[selectedDateStr] || { expense: 0, income: 0, items: [] };

  return (
    <div className="calendar-screen">
      {/* 1. 상단 월 이동 및 월간 총결산 바 (편한가계부 핵심 스타일) */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
            {currentYear}년 {currentMonth}월
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 수입 / 지출 / 무지출일 요약 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '10px 8px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>총 수입</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)' }}>
              +{monthTotalIncome > 0 ? (monthTotalIncome / 10000).toFixed(0) + '만' : '0'}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>총 지출</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F87171' }}>
              -{(monthTotalExpense / 10000).toFixed(1)}만
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>무지출 성공</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>
              ⭐ {noSpendDaysCount}일째
            </div>
          </div>
        </div>
      </div>

      {/* 2. 월간 캘린더 그리드 */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 10px',
        marginBottom: '16px'
      }}>
        {/* 요일 헤더 (일 ~ 토) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-dim)',
          marginBottom: '10px'
        }}>
          <span style={{ color: '#F87171' }}>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span style={{ color: '#60A5FA' }}>토</span>
        </div>

        {/* 날짜 셀 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px'
        }}>
          {/* 시작 요일 이전 빈 셀 */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty_${i}`} style={{ height: '58px' }} />
          ))}

          {/* 1일 ~ 30일 셀 */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const data = dailySummary[dateStr];
            const isSelected = selectedDateStr === dateStr;
            const isToday = dayNum === 7;
            const isPast = dayNum < 7;
            const isNoSpend = isPast && data.expense === 0 && data.income === 0;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                style={{
                  height: '62px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.18)' : isToday ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  border: isSelected ? '1px solid var(--primary-light)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 2px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'var(--transition-fast)'
                }}
              >
                {/* 날짜 숫자 */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: isToday || isSelected ? 800 : 500,
                  color: isToday ? 'var(--primary-light)' : 'var(--text-main)',
                  marginBottom: '2px'
                }}>
                  {dayNum}
                </span>

                {/* 수입 표시 (초록) */}
                {data.income > 0 && (
                  <span style={{ fontSize: '8px', color: 'var(--success)', fontWeight: 700, lineHeight: 1 }}>
                    +{(data.income / 10000).toFixed(0)}만
                  </span>
                )}

                {/* 지출 표시 (빨강) */}
                {data.expense > 0 && (
                  <span style={{ fontSize: '8px', color: '#F87171', fontWeight: 700, lineHeight: 1.1 }}>
                    -{(data.expense / 10000).toFixed(1)}만
                  </span>
                )}

                {/* 무지출 도장 */}
                {isNoSpend && (
                  <span style={{ fontSize: '9px', marginTop: 'auto' }} title="무지출 성공!">
                    🛡️
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 선택한 날짜의 상세 거래 리스트 (하단 슬라이드 패널) */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
              📅 {selectedDateStr} 내역
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              총 지출: <strong style={{ color: '#F87171' }}>-{selectedDayData.expense.toLocaleString()}원</strong>
              {selectedDayData.income > 0 && ` · 총 수입: +${selectedDayData.income.toLocaleString()}원`}
            </span>
          </div>

          <button
            onClick={() => onOpenQuickAdd(selectedDateStr)}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={14} /> 직접 추가
          </button>
        </div>

        {selectedDayData.items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px 10px',
            color: 'var(--text-dim)',
            fontSize: '12px'
          }}>
            <Sparkles size={22} color="var(--gold)" style={{ margin: '0 auto 6px auto' }} />
            <div>이 날은 지출이 없는 무지출 데이입니다!</div>
            <div style={{ fontSize: '11px', marginTop: '2px', color: 'var(--text-muted)' }}>
              불필요한 소비를 막아 예산 체력을 지켜냈어요 🛡️
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedDayData.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    {CATEGORY_ICONS[item.category] || '💸'}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.merchant}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {item.cardCompany} · {item.category} {item.memo && `(${item.memo})`}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: item.type === 'income' ? 'var(--success)' : '#F87171'
                }}>
                  {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
