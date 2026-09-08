import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, User, ShieldCheck, ArrowRight, Cloud, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('트레이너 이름을 입력해주세요.');
        }
        if (password.length < 6) {
          throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
        }
        const data = await authService.signUp(email, password, name);
        setSuccessMsg('회원가입이 완료되었습니다! 자동 로그인 중...');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        const data = await authService.signIn(email, password);
        setSuccessMsg('성공적으로 로그인되었습니다! 클라우드 동기화 중...');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(data.user);
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || '인증 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setErrorMsg('');
    try {
      await authService.signInWithOAuth(provider);
    } catch (err) {
      setErrorMsg(err.message || `${provider} 로그인 중 오류가 발생했습니다.`);
    }
  };

  return (
    <div className="holo-modal-backdrop" onClick={onClose}>
      <div 
        className="auth-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '400px',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
      >
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B'
          }}
        >
          <X size={18} />
        </button>

        {/* 상단 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 10px',
            background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
          }}>
            👾
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px' }}>
            SOBIMON 클라우드 계정
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
            {mode === 'login' ? '로그인하여 기기간 실시간 동기화를 시작하세요' : '새로운 소비 트레이너 계정을 생성합니다'}
          </p>
        </div>

        {/* 탭 전환 (로그인 / 회원가입) */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '16px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              background: mode === 'login' ? '#FFFFFF' : 'transparent',
              color: mode === 'login' ? '#0F172A' : '#64748B',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              background: mode === 'signup' ? '#FFFFFF' : 'transparent',
              color: mode === 'signup' ? '#0F172A' : '#64748B',
              boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            간편 가입
          </button>
        </div>

        {/* 메시지 알림 */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle size={14} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                트레이너 닉네임
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="예: 절약왕피카"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
                <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              이메일 주소
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="trainer@sobimon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="6자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              marginBottom: '14px',
              transition: 'transform 0.15s ease'
            }}
          >
            {loading ? '처리 중...' : mode === 'login' ? '로그인 & 동기화 시작' : '소비몬 트레이너 가입하기'}
          </button>
        </form>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>간편 소셜 연동</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => handleOAuth('kakao')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#FEE500',
              color: '#191919',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '14px' }}>💬</span>
            <span>카카오로 1초 시작하기</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('google')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#F8FAFC',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '14px' }}>🔴</span>
            <span>구글 계정으로 로그인</span>
          </button>
        </div>

        {/* 스마트 동기화 안내 및 게스트 모드 복귀 */}
        <div style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '10px',
          fontSize: '11px',
          color: '#1E40AF',
          lineHeight: '1.5',
          marginBottom: '12px'
        }}>
          💡 <strong>스마트 자동 병합</strong>: 로그인 시 지금까지 기기에 기록된 가계부 내역과 획득한 소비몬 카드가 내 클라우드 계정으로 안전하게 자동 백업됩니다.
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            로그인 없이 게스트 모드로 계속 쓰기
          </button>
        </div>
      </div>
    </div>
  );
}
