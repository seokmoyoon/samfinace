import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  Radio, 
  Swords, 
  Users, 
  BarChart3, 
  Send, 
  CheckCircle, 
  ShieldAlert, 
  ArrowLeft,
  Flame,
  Award,
  Zap,
  RotateCcw
} from 'lucide-react';
import MonsterCreatorStudio from './MonsterCreatorStudio';
import { sobimonMasterService } from '../../../services/sobimonMasterService';

export default function GymLeaderDashboard({ onBackToGame, currentUser }) {
  const [activeTab, setActiveTab] = useState('forge'); // 'forge' | 'radar' | 'raid' | 'broadcast' | 'trainers'
  const [trainers, setTrainers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // 긴급 칙령 폼 상태
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastColor, setBroadcastColor] = useState('#EF4444');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // 도전자 목록 및 공지 목록 로드
  useEffect(() => {
    sobimonMasterService.getAllTrainers().then(setTrainers);
    sobimonMasterService.getAnnouncements().then(setAnnouncements);
  }, []);

  // 칙령 방송 전송
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;

    try {
      await sobimonMasterService.sendAnnouncement({
        title: broadcastTitle,
        content: broadcastContent,
        badgeColor: broadcastColor
      });
      setBroadcastSent(true);
      setBroadcastTitle('');
      setBroadcastContent('');
      setTimeout(() => setBroadcastSent(false), 3000);
      sobimonMasterService.getAnnouncements().then(setAnnouncements);
    } catch (err) {
      alert(`방송 실패: ${err.message}`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F172A',
      color: '#F8FAFC',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* ===================== [상단 네비게이션 헤더] ===================== */}
      <header style={{
        background: 'linear-gradient(90deg, #1E293B 0%, #0F172A 100%)',
        borderBottom: '1px solid #334155',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBackToGame}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#F8FAFC',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>탐험 모드로 복귀</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.5)'
            }}>
              <Crown size={22} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.3px', margin: 0, color: '#FFFFFF' }}>
                SOBIMON 체육관장 집무실 (Game Master HQ)
              </h1>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                소비몬 생태계 통솔 & 몬스터 창작 스튜디오
              </span>
            </div>
          </div>
        </div>

        {/* 관장 정보 배지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Crown size={14} />
            <span>체육관장 인가 완료 ({currentUser?.email || 'Master GM'})</span>
          </div>
        </div>
      </header>

      {/* ===================== [체육관장 5대 메뉴 바] ===================== */}
      <div style={{
        background: '#1E293B',
        borderBottom: '1px solid #334155',
        padding: '0 28px',
        display: 'flex',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('forge')}
          style={{
            padding: '14px 18px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'forge' ? '#FBBF24' : '#94A3B8',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            borderBottom: activeTab === 'forge' ? '3px solid #F59E0B' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} />
          <span>소비몬 창작 공방 (Creator Studio)</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          style={{
            padding: '14px 18px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'radar' ? '#FBBF24' : '#94A3B8',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            borderBottom: activeTab === 'radar' ? '3px solid #F59E0B' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BarChart3 size={16} />
          <span>생태계 레이더 (Radar)</span>
        </button>

        <button
          onClick={() => setActiveTab('raid')}
          style={{
            padding: '14px 18px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'raid' ? '#FBBF24' : '#94A3B8',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            borderBottom: activeTab === 'raid' ? '3px solid #F59E0B' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Swords size={16} />
          <span>보스 레이드 & 퀘스트 기획</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          style={{
            padding: '14px 18px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'broadcast' ? '#FBBF24' : '#94A3B8',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            borderBottom: activeTab === 'broadcast' ? '3px solid #F59E0B' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Radio size={16} />
          <span>체육관 긴급 칙령 방송</span>
        </button>

        <button
          onClick={() => setActiveTab('trainers')}
          style={{
            padding: '14px 18px',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'trainers' ? '#FBBF24' : '#94A3B8',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            borderBottom: activeTab === 'trainers' ? '3px solid #F59E0B' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} />
          <span>도전자 명부 ({trainers.length}명)</span>
        </button>
      </div>

      {/* ===================== [메인 컨텐츠 영역] ===================== */}
      <main style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* 1. 소비몬 창작 공방 */}
        {activeTab === 'forge' && (
          <div style={{ background: '#F8FAFC', color: '#0F172A', minHeight: 'calc(100vh - 120px)' }}>
            <MonsterCreatorStudio />
          </div>
        )}

        {/* 2. 생태계 실시간 레이더 */}
        {activeTab === 'radar' && (
          <div style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} color="#38BDF8" /> <span>소비몬 침공 현황 및 생태계 레이더</span>
            </h2>

            {/* 상단 통계 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, marginBottom: '6px' }}>총 도전자 (트레이너)</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#38BDF8' }}>{Math.max(1, trainers.length)}명</div>
              </div>
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, marginBottom: '6px' }}>침공 1위 보스</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#EF4444' }}>☕ 카페몬 VMAX</div>
              </div>
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, marginBottom: '6px' }}>도전자 예산 방어 성공률</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#10B981' }}>74.2%</div>
              </div>
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '16px', padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, marginBottom: '6px' }}>수여된 관장 뱃지</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#F59E0B' }}>128개</div>
              </div>
            </div>

            {/* 소비 침공 분석 랭킹 */}
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
                🚨 이달의 도전자 지갑 파괴 랭킹 (Top Threat Monsters)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: '카페몬 계열', share: '36%', amount: '1,420,000원', threat: '치명적 침공', color: '#0284C7' },
                  { name: '식비/배달몬 계열', share: '28%', amount: '1,120,000원', threat: '경계 대상', color: '#EA580C' },
                  { name: '쇼핑몬 계열', share: '21%', amount: '840,000원', threat: '주의 단계', color: '#DB2777' },
                  { name: '교통/택시몬', share: '15%', amount: '600,000원', threat: '안정권', color: '#3B82F6' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: item.color }}>#{idx + 1}</span>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#F8FAFC' }}>{item.name}</strong>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>총 지출 점유율: {item.share}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#F8FAFC' }}>{item.amount}</div>
                      <span style={{ fontSize: '10px', color: item.color, fontWeight: 800 }}>{item.threat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. 월간 보스 레이드 기획실 */}
        {activeTab === 'raid' && (
          <div style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Swords size={20} color="#F59E0B" /> <span>월간 체육관 관장 보스 레이드 기획</span>
            </h2>

            <div style={{
              background: 'linear-gradient(135deg, #78350F 0%, #1E293B 100%)',
              border: '2px solid #F59E0B',
              borderRadius: '24px',
              padding: '28px',
              marginBottom: '24px',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <span style={{
                    background: '#F59E0B',
                    color: '#000',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    CURRENT BOSS RAID
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 4px' }}>
                    🏆 9월 관장 배틀: 추석 명절 지름신 대방어전 (VMAX)
                  </h3>
                  <p style={{ fontSize: '13px', color: '#FDE68A', margin: 0 }}>
                    도전자들이 명절 기간 동안 불필요한 과소비를 0원으로 방어할 때마다 보스 HP가 깎입니다.
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#FDE68A' }}>전체 레이드 보스 HP</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF' }}>3,240,000 / 5,000,000 HP</div>
                </div>
              </div>

              {/* 보스 HP 게이지 */}
              <div style={{ width: '100%', height: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '64.8%', height: '100%', background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
              </div>
            </div>
          </div>
        )}

        {/* 4. 체육관 긴급 칙령 방송 */}
        {activeTab === 'broadcast' && (
          <div style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={20} color="#EF4444" /> <span>체육관 긴급 칙령 (Live Broadcast)</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* 방송 송출 폼 */}
              <form onSubmit={handleSendBroadcast} style={{
                background: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '20px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
                  📢 전 도전자 실시간 팝업 송출
                </h3>

                {broadcastSent && (
                  <div style={{
                    background: '#ECFDF5',
                    color: '#059669',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle size={14} /> <span>칙령이 전 도전자 앱 상단에 성공적으로 송출되었습니다!</span>
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                    칙령 제목 (경보 레벨)
                  </label>
                  <input
                    type="text"
                    placeholder="예: [체육관장 긴급 칙령] 금요일 야식몬 기습 주의보!"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0F172A',
                      border: '1px solid #334155',
                      color: '#FFF',
                      borderRadius: '10px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                    칙령 내용 (도전자 행동 지침)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="예: 오늘 밤 10시 배달앱의 속삭임을 물리치고 0원으로 방어 시, 내일 아침 +50 EXP와 황금 뱃지를 수여합니다!"
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0F172A',
                      border: '1px solid #334155',
                      color: '#FFF',
                      borderRadius: '10px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                    배너 테마 컬러
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'].map(col => (
                      <button
                        type="button"
                        key={col}
                        onClick={() => setBroadcastColor(col)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: col,
                          border: broadcastColor === col ? '3px solid #FFFFFF' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <Send size={16} />
                  <span>전 도전자 앱으로 실시간 칙령 송출</span>
                </button>
              </form>

              {/* 최근 송출된 칙령 히스토리 */}
              <div style={{
                background: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '20px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
                  📜 최근 발령된 체육관장 칙령 기록
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {announcements.map(a => (
                    <div key={a.id} style={{
                      background: '#0F172A',
                      borderLeft: `4px solid ${a.badge_color || '#EF4444'}`,
                      borderRadius: '10px',
                      padding: '12px 14px'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>
                        {a.title}
                      </div>
                      <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, lineHeight: '1.4' }}>
                        {a.content}
                      </p>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <div style={{ color: '#64748B', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>
                      발령된 칙령이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. 도전자 명부 */}
        {activeTab === 'trainers' && (
          <div style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="#A855F7" /> <span>등록된 도전자(트레이너) 명부 ({trainers.length}명)</span>
            </h2>

            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '20px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#0F172A', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '14px 18px', fontSize: '12px', color: '#94A3B8' }}>트레이너</th>
                    <th style={{ padding: '14px 18px', fontSize: '12px', color: '#94A3B8' }}>이메일</th>
                    <th style={{ padding: '14px 18px', fontSize: '12px', color: '#94A3B8' }}>레벨 / 칭호</th>
                    <th style={{ padding: '14px 18px', fontSize: '12px', color: '#94A3B8' }}>경험치</th>
                    <th style={{ padding: '14px 18px', fontSize: '12px', color: '#94A3B8' }}>보유 코인</th>
                    <th style={{ padding: '14px 18px', fontSize: '12px', color: '#94A3B8' }}>권한</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: '#FFF' }}>{t.name}</td>
                      <td style={{ padding: '14px 18px', color: '#94A3B8', fontSize: '12px' }}>{t.email || '-'}</td>
                      <td style={{ padding: '14px 18px', color: '#38BDF8', fontSize: '12px', fontWeight: 700 }}>
                        Lv.{t.level} ({t.title})
                      </td>
                      <td style={{ padding: '14px 18px', color: '#FBBF24', fontSize: '12px', fontWeight: 800 }}>
                        {t.exp} EXP
                      </td>
                      <td style={{ padding: '14px 18px', color: '#34D399', fontSize: '12px', fontWeight: 800 }}>
                        {t.coins} 🪙
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          background: t.role === 'gym_leader' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                          color: t.role === 'gym_leader' ? '#FBBF24' : '#94A3B8',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 800
                        }}>
                          {t.role === 'gym_leader' ? '👑 체육관장' : '도전자'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {trainers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                        현재 등록된 도전자가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
