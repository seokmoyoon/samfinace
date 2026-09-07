import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  MessageSquare, 
  Smartphone, 
  CheckCircle2, 
  FileText,
  Settings,
  BellRing,
  ShieldCheck
} from 'lucide-react';
import { parseCardSMS, SAMPLE_MULTI_CHANNEL_MESSAGES } from '../utils/smsParser';
import { parseStatementCSV, SAMPLE_STATEMENT_CSV } from '../utils/csvParser';

export default function SmartInputTab({ 
  onAddTransaction, 
  onAddMultipleTransactions,
  onTriggerPushSimulation 
}) {
  const [activeSubTab, setActiveSubTab] = useState('message'); // 'message' | 'statement' | 'simulate' | 'listener'
  const [inputText, setInputText] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);
  const [statementSuccessCount, setStatementSuccessCount] = useState(null);

  // 안드로이드 모의 알림 리스너 토글 상태
  const [listenerSettings, setListenerSettings] = useState({
    smsAuto: true,
    kakaoAuto: true,
    tossAuto: true,
    cardAppAuto: true
  });

  const fileInputRef = useRef(null);

  // 텍스트 변경 시 실시간 파싱
  const handleTextChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    if (text.length > 8) {
      const parsed = parseCardSMS(text);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  // 등록 확정
  const handleConfirmMessage = () => {
    if (parsedPreview) {
      onAddTransaction(parsedPreview);
      setInputText('');
      setParsedPreview(null);
      alert(`[${parsedPreview.merchant}] ${parsedPreview.amount.toLocaleString()}원 소비 기록 완료!\n👾 소비몬 출현 감지! (+10 EXP 획득)`);
    }
  };

  // CSV 파일 업로드
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const items = parseStatementCSV(content);
        if (items.length > 0) {
          onAddMultipleTransactions(items);
          setStatementSuccessCount(items.length);
        } else {
          alert('CSV 파일에서 유효한 거래 내역을 찾지 못했습니다.');
        }
      }
    };
    reader.readAsText(file);
  };

  // 샘플 명세서 CSV 즉시 불러오기
  const handleLoadSampleCSV = () => {
    const items = parseStatementCSV(SAMPLE_STATEMENT_CSV);
    onAddMultipleTransactions(items);
    setStatementSuccessCount(items.length);
  };

  const toggleListener = (key) => {
    setListenerSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="smart-input-screen">
      {/* 탭 헤더 */}
      <div style={{ marginBottom: '18px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>⚡ 스마트 통합 수집 센터</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          SMS 문자, 카카오톡 알림톡, 토스/카드사 앱 알림을 모두 자동으로 인식합니다.
        </p>
      </div>

      {/* 서브 탭 전환 버튼 */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        padding: '4px', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '18px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveSubTab('message')}
          style={{
            flex: 1,
            padding: '8px 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            background: activeSubTab === 'message' ? 'var(--primary)' : 'transparent',
            color: activeSubTab === 'message' ? '#fff' : 'var(--text-muted)'
          }}
        >
          💬 카톡/문자 파서
        </button>
        <button
          onClick={() => setActiveSubTab('simulate')}
          style={{
            flex: 1,
            padding: '8px 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            background: activeSubTab === 'simulate' ? 'var(--accent)' : 'transparent',
            color: activeSubTab === 'simulate' ? '#fff' : 'var(--text-muted)'
          }}
        >
          🔔 모바일 알림 체험
        </button>
        <button
          onClick={() => setActiveSubTab('listener')}
          style={{
            flex: 1,
            padding: '8px 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            background: activeSubTab === 'listener' ? '#10B981' : 'transparent',
            color: activeSubTab === 'listener' ? '#fff' : 'var(--text-muted)'
          }}
        >
          ⚙️ 자동 수신 설정
        </button>
        <button
          onClick={() => setActiveSubTab('statement')}
          style={{
            flex: 1,
            padding: '8px 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            background: activeSubTab === 'statement' ? 'var(--primary)' : 'transparent',
            color: activeSubTab === 'statement' ? '#fff' : 'var(--text-muted)'
          }}
        >
          📑 명세서(CSV)
        </button>
      </div>

      {/* 1. 카톡/문자 통합 파서 */}
      {activeSubTab === 'message' && (
        <div className="sms-parser-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <MessageSquare size={16} color="var(--primary-light)" />
            <h4 style={{ fontSize: '13px', fontWeight: 700 }}>카카오톡 알림톡 & 문자메시지 붙여넣기</h4>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            카카오페이 알림톡, 배민 결제톡, 토스 푸시, 카드사 SMS를 복사해 넣으면 금액과 사용처를 자동 분류합니다.
          </p>

          <textarea
            className="sms-textarea"
            placeholder="예시: [카카오페이] 결제 안내 17,000원 결제완료 사용처: 넷플릭스"
            value={inputText}
            onChange={handleTextChange}
          />

          {/* 원클릭 샘플 채널 버튼들 */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginRight: '6px' }}>샘플 알림 바로 테스트:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {SAMPLE_MULTI_CHANNEL_MESSAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(sample.text);
                    setParsedPreview(parseCardSMS(sample.text));
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{sample.appIcon}</span> {sample.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* 파싱 결과 실시간 미리보기 카드 */}
          {parsedPreview && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '12px', fontWeight: 700 }}>
                  <CheckCircle2 size={15} /> 자동 분석 완료!
                </div>
                <span style={{ 
                  fontSize: '10px', 
                  padding: '2px 8px', 
                  borderRadius: 'var(--radius-full)', 
                  background: parsedPreview.channel.includes('카카오') ? '#FEE500' : parsedPreview.channel.includes('토스') ? '#0064FF' : '#4F46E5',
                  color: parsedPreview.channel.includes('카카오') ? '#191919' : '#fff',
                  fontWeight: 700
                }}>
                  {parsedPreview.channel}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                <div><span style={{ color: 'var(--text-dim)' }}>사용처:</span> <strong>{parsedPreview.merchant}</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>금액:</span> <strong style={{ color: '#F87171' }}>-{parsedPreview.amount.toLocaleString()}원</strong></div>
                <div><span style={{ color: 'var(--text-dim)' }}>분류:</span> <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{parsedPreview.category}</span></div>
                <div><span style={{ color: 'var(--text-dim)' }}>금융사:</span> {parsedPreview.cardCompany}</div>
              </div>
              <button 
                className="btn-primary" 
                onClick={handleConfirmMessage}
                style={{ marginTop: '10px', padding: '10px' }}
              >
                가계부에 바로 등록하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. 모바일 알림 체험관 (카카오톡 알림톡, 토스, SMS 시뮬레이션) */}
      {activeSubTab === 'simulate' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <BellRing size={18} color="var(--accent)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>멀티 채널 자동 수신 체험관</h4>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
            각 채널 버튼을 누르면 스마트폰 상단에 해당 앱 스타일의 푸시 알림이 뜨며 <strong>입력 없이 가계부에 즉시 자동 수집</strong>됩니다!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SAMPLE_MULTI_CHANNEL_MESSAGES.map((sample, idx) => {
              const parsed = parseCardSMS(sample.text);
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: sample.bgColor,
                      color: sample.textColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 800
                    }}>
                      {sample.appIcon}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {parsed?.merchant}
                      </div>
                      <div style={{ fontSize: '11px', color: '#F87171', fontWeight: 600 }}>
                        -{parsed?.amount.toLocaleString()}원 · {sample.title.split(' ')[1]}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onTriggerPushSimulation(sample.text)}
                    style={{
                      background: sample.bgColor,
                      color: sample.textColor,
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    수신 시뮬레이션 🔔
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. 자동 수신(Notification Listener) 설정 안내 */}
      {activeSubTab === 'listener' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Settings size={18} color="var(--success)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>자동 수신 백그라운드 리스너 설정</h4>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
            스마트폰에서 결제가 발생할 때 SaveQuest가 감지할 수신 채널을 선택합니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>💬 카카오톡 알림톡 자동 감지</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>카카오페이, 배민, 토스 등 알림톡 결제 승인 즉시 기록</div>
              </div>
              <input 
                type="checkbox" 
                checked={listenerSettings.kakaoAuto} 
                onChange={() => toggleListener('kakaoAuto')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--success)', cursor: 'pointer' }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>✉️ 카드 승인 SMS 문자 자동 감지</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>통신사 SMS 문자 수신 즉시 백그라운드 수집</div>
              </div>
              <input 
                type="checkbox" 
                checked={listenerSettings.smsAuto} 
                onChange={() => toggleListener('smsAuto')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--success)', cursor: 'pointer' }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>💙 토스/네이버페이 앱 푸시 감지</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>간편결제 앱 푸시 수신 시 자동 기록</div>
              </div>
              <input 
                type="checkbox" 
                checked={listenerSettings.tossAuto} 
                onChange={() => toggleListener('tossAuto')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--success)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '11px',
            color: 'var(--text-main)',
            lineHeight: '1.6'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> 개인정보 및 보안 안내
            </div>
            SaveQuest는 결제와 관련된 '금액, 가맹점, 일시' 정보만을 로컬 기기 내에서 안전하게 분석하며, 사적인 대화나 개인 인증 문자는 절대 저장하거나 외부로 전송하지 않습니다.
          </div>
        </div>
      )}

      {/* 4. 카드 내역서(CSV) 첨부 분석 */}
      {activeSubTab === 'statement' && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv, text/csv"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          <div className="dropzone-box" onClick={() => fileInputRef.current?.click()}>
            <UploadCloud className="dropzone-icon" size={40} />
            <div className="dropzone-title">카드사 명세서(CSV) 파일 첨부</div>
            <div className="dropzone-desc">
              신한, 국민, 현대, 삼성 등 카드사 홈에서 다운받은<br />
              이용내역 CSV 파일을 클릭하거나 드래그하여 업로드하세요.
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '14px 0' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>— 또는 준비된 파일이 없다면 —</span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleLoadSampleCSV}
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <FileText size={16} /> 샘플 카드 명세서 (8건) 즉시 분석해보기
          </button>

          {statementSuccessCount !== null && (
            <div style={{
              marginTop: '16px',
              padding: '14px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={24} color="#818CF8" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                {statementSuccessCount}건의 지출 내역이 반영되었습니다!
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                홈 화면에서 체력(HP)과 돈의 흐름이 실시간으로 업데이트되었습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
