import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

/**
 * SOBIMON 인증 서비스
 * - Supabase Auth 기반 이메일 / 소셜 로그인 및 세션 관리
 */

export const authService = {
  isConfigured: () => isSupabaseConfigured && Boolean(supabase),

  // 현재 로그인 세션 가져오기
  getSession: async () => {
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // 현재 사용자 정보
  getCurrentUser: async () => {
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  // 이메일 회원가입
  signUp: async (email, password, name = '소비마스터') => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) throw error;
    return data;
  },

  // 이메일 로그인
  signIn: async (email, password) => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // 로그아웃
  signOut: async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 소셜 로그인 (구글, 카카오 등)
  signInWithOAuth: async (provider) => {
    if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  // 인증 상태 변화 감지 리스너
  onAuthStateChange: (callback) => {
    if (!supabase) return { unsubscribe: () => {} };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      }
    );
    return subscription;
  }
};
