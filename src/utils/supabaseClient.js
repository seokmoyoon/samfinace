import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sobimon.auth'
      },
      global: {
        headers: {
          'x-application-name': 'sobimon-web'
        }
      }
    })
  : null;

export function assertSupabaseConfigured() {
  if (!supabase) {
    throw new Error(
      'Supabase 환경변수가 없습니다. VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해 주세요.'
    );
  }
  return supabase;
}
