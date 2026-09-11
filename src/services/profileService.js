import { supabase } from '../utils/supabaseClient';

/**
 * SOBIMON 사용자 프로필(Profiles) Supabase DB 연계 서비스
 */
export const profileService = {
  /**
   * 사용자 프로필 조회
   */
  fetchProfile: async (userId) => {
    if (!supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      return {
        id: data.id,
        email: data.email,
        name: data.name || '소비마스터',
        level: Number(data.level) || 1,
        title: data.title || '초보 절약 모험가',
        exp: Number(data.exp) || 0,
        maxExp: Number(data.max_exp) || 100,
        coins: Number(data.coins) || 0,
        streakDays: Number(data.streak_days) || 1,
        role: data.role || 'trainer'
      };
    } catch (err) {
      console.error('[profileService.fetchProfile error]:', err);
      return null;
    }
  },

  /**
   * 사용자 프로필 저장/업데이트 (Upsert)
   */
  saveProfile: async (userId, profileData) => {
    if (!supabase || !userId) return { success: false };

    try {
      const payload = {
        id: userId,
        name: profileData.name || '소비마스터',
        level: Number(profileData.level) || 1,
        title: profileData.title || '초보 절약 모험가',
        exp: Number(profileData.exp) || 0,
        max_exp: Number(profileData.maxExp) || 100,
        coins: Number(profileData.coins) || 0,
        streak_days: Number(profileData.streakDays) || 1,
        updated_at: new Date().toISOString()
      };

      if (profileData.email) payload.email = profileData.email;

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: {
          id: data.id,
          email: data.email,
          name: data.name,
          level: data.level,
          title: data.title,
          exp: data.exp,
          maxExp: data.max_exp,
          coins: data.coins,
          streakDays: data.streak_days,
          role: data.role
        }
      };
    } catch (err) {
      console.error('[profileService.saveProfile error]:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * 사용자 가입 또는 첫 로그인 시 기본 프로필 초기화 보장
   */
  ensureProfile: async (user) => {
    if (!supabase || !user?.id) return null;

    try {
      const existing = await profileService.fetchProfile(user.id);
      if (existing) return existing;

      // 프로필이 없는 경우 기본 생성
      const defaultProfile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '소비마스터',
        level: 1,
        title: '초보 절약 모험가',
        exp: 0,
        max_exp: 100,
        coins: 50,
        streak_days: 1,
        role: 'trainer'
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        level: data.level,
        title: data.title,
        exp: data.exp,
        maxExp: data.max_exp,
        coins: data.coins,
        streakDays: data.streak_days,
        role: data.role
      };
    } catch (err) {
      console.error('[profileService.ensureProfile error]:', err);
      return null;
    }
  }
};
