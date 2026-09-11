import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Bot, Zap } from 'lucide-react';
import { SobimonMascot } from './SobimonIllustrations';
import { geminiAiService } from '../../services/geminiAiService';

export default function SobimonAIChatModal({
  isOpen,
  onClose,
  user,
  budget,
  transactions = []
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `안녕하세요, 트레이너 ${user?.name || '소비마스터'}님! 🐻\n저는 트레이너님의 소비 습관을 지켜주는 AI 소비몬이에요. 이번 달 가계부나 절약에 대해 무엇이든 물어보세요!`,
      emotion: 'joy'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('joy');
  const chatBottomRef = useRef(null);

  const quickQuestions = [
    '📊 이번 달 소비 상태 분석해줘',
    '💡 지금 실천할 절약 팁 알려줘',
    '☕ 커피 줄이는 꿀팁 있어?',
    '🎯 오늘 무지출 하려면 어떻게 해?'
  ];

  // 새 메시지 시 스크롤 자동 이동
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const totalSpent = transactions
    .filter(t => t.type !== 'income')
    .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await geminiAiService.chatWithSobimonCoach({
        message: text,
        chatHistory: newMessages,
        context: {
          user,
          budget,
          totalSpent,
          transactions
        }
      });

      setCurrentEmotion(response.emotion || 'happy');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: response.text,
          emotion: response.emotion
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: '잠시 생각을 정리하는 중이에요! 다시 한번 말씀해 주시겠어요?',
          emotion: 'sad'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          height: '85vh',
          maxHeight: '680px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* 상단 헤더: 캐릭터 아바타 + 감정 상태 + 닫기 */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <SobimonMascot size={40} emotion={currentEmotion} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '16px' }}>소비몬 AI 코치</span>
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.25)',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  fontWeight: 700
                }}>
                  Gemini Flash
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>
                실시간 1:1 재정 조언 & 소비몬 배틀 코칭
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 대화 영역 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    <SobimonMascot size={26} emotion={m.emotion || 'happy'} />
                  </div>
                )}

                <div style={{
                  maxWidth: '78%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isUser 
                    ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' 
                    : '#FFFFFF',
                  color: isUser ? '#FFFFFF' : '#1E293B',
                  fontSize: '13.5px',
                  lineHeight: '1.55',
                  boxShadow: isUser 
                    ? '0 4px 12px rgba(37, 99, 235, 0.25)' 
                    : '0 2px 8px rgba(15, 23, 42, 0.06)',
                  border: isUser ? 'none' : '1px solid #E2E8F0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {m.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '40px' }}>
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                padding: '8px 14px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#64748B'
              }}>
                <Sparkles size={14} className="animate-spin" color="#3B82F6" />
                <span>소비몬이 가계부를 분석하고 있어요...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 추천 질문 칩 */}
        <div style={{
          padding: '8px 16px',
          background: '#F1F5F9',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              style={{
                whiteSpace: 'nowrap',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '9999px',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.color = '#2563EB';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#334155';
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* 하단 텍스트 입력 바 */}
        <div style={{
          padding: '12px 16px',
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <input 
            type="text"
            placeholder="소비몬에게 가계부나 절약에 대해 물어보세요..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '9999px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              outline: 'none',
              transition: 'border 0.2s',
              background: '#F8FAFC'
            }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#CBD5E1'}
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: inputText.trim() && !isLoading ? '#2563EB' : '#94A3B8',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
              boxShadow: inputText.trim() && !isLoading ? '0 4px 10px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
