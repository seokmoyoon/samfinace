import React, { useState } from 'react';
import { Sparkles, HelpCircle, ChevronRight, X, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function SobimonDexTab({ user, sobimons = [] }) {
  const [selectedMon, setSelectedMon] = useState(null);
  const [filterElement, setFilterElement] = useState('all');

  const elements = ['all', '카페/음료', '식비/외식', '쇼핑/마트', '교통/차량', '절약/무지출', '성장/저축', '구독/정기결제'];

  const filteredSobimons = sobimons.filter(m => {
    if (filterElement === 'all') return true;
    return m.element === filterElement;
  });

  const discoveredCount = sobimons.filter(m => m.discovered).length;
  const totalCount = sobimons.length;
  const dexRate = Math.round((discoveredCount / totalCount) * 100);

  return (
    <div className="dex-screen">
      {/* 도감 요약 헤더 */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📖 SOBIMON DEX</span>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>(소비몬 도감)</span>
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              내 소비 습관에 따라 소환되고 진화하는 몬스터 도감입니다.
            </p>
          </div>
          <div style={{
            background: 'var(--primary-pastel)',
            border: '1px solid #BFDBFE',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '11px',
            color: 'var(--primary)',
            fontWeight: 900
          }}>
            수집률 {dexRate}% ({discoveredCount}/{totalCount})
          </div>
        </div>

        {/* 수집 프로그레스 바 */}
        <div style={{
          width: '100%',
          height: '6px',
          background: '#F1F5F9',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${dexRate}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* 속성 필터 알약 칩 */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '14px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {elements.map(el => (
          <button
            key={el}
            onClick={() => setFilterElement(el)}
            style={{
              padding: '5px 12px',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: filterElement === el ? 'var(--primary)' : 'var(--border-subtle)',
              background: filterElement === el ? 'var(--primary)' : '#FFFFFF',
              color: filterElement === el ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filterElement === el ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none'
            }}
          >
            {el === 'all' ? '전체 속성' : el}
          </button>
        ))}
      </div>

      {/* 소비몬 그리드 */}
      <div className="dex-grid">
        {filteredSobimons.map(mon => {
          if (mon.discovered) {
            return (
              <div 
                key={mon.id}
                className="dex-card discovered"
                onClick={() => setSelectedMon(mon)}
                style={{ cursor: 'pointer' }}
              >
                <div className="dex-card-top">
                  <div className="dex-card-avatar" style={{ background: `${mon.color}15`, border: `1px solid ${mon.color}40` }}>
                    {mon.badge}
                  </div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    color: mon.threat === '보스급 소비몬' ? '#EF4444' : mon.threat === '아군 수호신' ? '#10B981' : '#F59E0B',
                    background: '#F8FAFC',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #E2E8F0'
                  }}>
                    {mon.threat}
                  </span>
                </div>

                <div className="dex-card-name">
                  {mon.name} <span style={{ fontSize: '11px', color: 'var(--primary)' }}>Lv.{mon.level}</span>
                </div>
                <div className="dex-card-element">
                  속성: {mon.element}
                </div>
                <div className="dex-card-quote">
                  {mon.quote}
                </div>
                <div className="dex-card-condition">
                  🔍 {mon.condition}
                </div>
              </div>
            );
          } else {
            return (
              <div key={mon.id} className="dex-card silhouette">
                <div className="dex-card-top">
                  <div className="dex-card-avatar" style={{ background: '#E2E8F0', color: '#94A3B8' }}>
                    ❓
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8' }}>미발견</span>
                </div>
                <div className="dex-card-name" style={{ color: '#94A3B8' }}>
                  ??? (미확인 몬스터)
                </div>
                <div className="dex-card-element">
                  속성: 미확인
                </div>
                <div className="dex-card-quote" style={{ background: '#F1F5F9', color: '#94A3B8' }}>
                  "아직 출현 조건이 해금되지 않았습니다..."
                </div>
                <div className="dex-card-condition" style={{ color: '#EF4444' }}>
                  🔒 {mon.condition}
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* 소비몬 상세 & 진화 트리 모달 (Section 11) */}
      {selectedMon && (
        <div className="levelup-overlay" onClick={() => setSelectedMon(null)}>
          <div 
            className="levelup-card" 
            onClick={e => e.stopPropagation()}
            style={{ border: '2px solid var(--primary)', maxWidth: '360px', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '28px' }}>{selectedMon.badge}</span>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)' }}>
                    {selectedMon.name} <span style={{ fontSize: '12px', color: 'var(--primary)' }}>Lv.{selectedMon.level}</span>
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    속성: {selectedMon.element} · {selectedMon.threat}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMon(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '14px'
            }}>
              <p style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '6px' }}>
                {selectedMon.description}
              </p>
              <div style={{ fontSize: '11px', color: '#4F46E5', fontStyle: 'italic', fontWeight: 600 }}>
                {selectedMon.quote}
              </div>
            </div>

            {/* 진화 트리 (Section 11) */}
            {selectedMon.evolutions && (
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  🌱 캐릭터 진화 트리
                </h5>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#EFF6FF',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #DBEAFE'
                }}>
                  {selectedMon.evolutions.map((stage, idx) => (
                    <React.Fragment key={stage}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: stage === selectedMon.name ? 900 : 600,
                        color: stage === selectedMon.name ? 'var(--primary)' : 'var(--text-muted)'
                      }}>
                        {stage}
                      </span>
                      {idx < selectedMon.evolutions.length - 1 && (
                        <span style={{ color: '#94A3B8', fontSize: '10px' }}>➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="btn-primary"
              onClick={() => setSelectedMon(null)}
              style={{ width: '100%', padding: '10px' }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
