import { supabase } from '../utils/supabaseClient';

/**
 * SOBIMON 체육관장(Game Master) 마스터 서비스
 * - 소비몬 창작 공방 등록/수정/삭제
 * - 긴급 칙령(공지) 송출
 * - 도전자 목록 및 생태계 통계 조회
 */

export const sobimonMasterService = {
  // 1. 등록된 모든 마스터 소비몬 조회
  getAllMasterSobimons: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('sobimon_master')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[MasterService] Fetch error:', err);
      return [];
    }
  },

  // 2. 신규 소비몬 등록 또는 기존 몬스터 업데이트
  saveMasterSobimon: async (monsterData) => {
    if (!supabase) throw new Error('Supabase가 연결되지 않았습니다.');
    const row = {
      ...monsterData,
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('sobimon_master')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // 3. 소비몬 삭제
  deleteMasterSobimon: async (id) => {
    if (!supabase) throw new Error('Supabase가 연결되지 않았습니다.');
    const { error } = await supabase
      .from('sobimon_master')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // 4. 긴급 공지 목록 조회
  getAnnouncements: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('admin_announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[MasterService] Announcements error:', err);
      return [];
    }
  },

  // 5. 긴급 칙령(공지) 발행
  sendAnnouncement: async ({ title, content, badgeColor = '#EF4444' }) => {
    if (!supabase) throw new Error('Supabase가 연결되지 않았습니다.');
    const { data, error } = await supabase
      .from('admin_announcements')
      .insert([{
        title,
        content,
        badge_color: badgeColor,
        is_active: true
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // 6. 도전자 목록 조회 (관장 전용)
  getAllTrainers: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('exp', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[MasterService] Trainers error:', err);
      return [];
    }
  },

  // 7. 유저 권한 승격 (체육관장 지정)
  setGymLeaderRole: async (userId, role = 'gym_leader') => {
    if (!supabase) throw new Error('Supabase가 연결되지 않았습니다.');
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
