import { supabase } from '../utils/supabaseClient';

/**
 * SOBIMON 클라우드 동기화 서비스
 * - 로컬(Local-First) 데이터와 Supabase 클라우드 데이터베이스 간의 양방향 동기화
 */

export const syncService = {
  // 1. 로컬에 쌓인 데이터를 클라우드로 일괄 업로드 (백업 / 회원 전환 시)
  uploadLocalDataToCloud: async (userId, localData) => {
    if (!supabase || !userId) return { success: false, message: '로그인이 필요합니다.' };

    try {
      const { user, budget, transactions, sobimons, quests } = localData;

      // 1) 프로필 동기화
      if (user) {
        await supabase.from('profiles').upsert({
          id: userId,
          name: user.name,
          level: user.level,
          title: user.title,
          exp: user.exp,
          max_exp: user.maxExp,
          coins: user.coins,
          streak_days: user.streakDays,
          updated_at: new Date().toISOString()
        });
      }

      // 2) 예산 동기화
      if (budget) {
        const monthKey = new Date().toISOString().slice(0, 7);
        await supabase.from('budgets').upsert({
          user_id: userId,
          month_key: monthKey,
          total_income: budget.totalIncome,
          fixed_expenses: budget.fixedExpenses,
          monthly_budget: budget.monthlyBudget,
          target_savings: budget.targetSavings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,month_key' });
      }

      // 3) 거래내역 동기화 (기존 클라우드 내역과 중복 방지)
      if (transactions && transactions.length > 0) {
        const rows = transactions.map(tx => ({
          user_id: userId,
          date: tx.date || new Date().toISOString().slice(0, 10),
          time: tx.time || '12:00:00',
          type: tx.type || 'expense',
          category: tx.category || '기타',
          amount: Number(tx.amount) || 0,
          title: tx.title || tx.memo || '지출',
          payment_method: tx.paymentMethod || '신용카드'
        }));

        // 배치로 업로드
        await supabase.from('transactions').insert(rows);
      }

      // 4) 소비몬 도감 상태 동기화
      if (sobimons && sobimons.length > 0) {
        const monRows = sobimons.map(m => ({
          user_id: userId,
          sobimon_id: m.id,
          discovered: Boolean(m.discovered),
          level: Number(m.level) || 1,
          unlocked_at: new Date().toISOString()
        }));

        await supabase.from('user_sobimons').upsert(monRows, { onConflict: 'user_id,sobimon_id' });
      }

      // 5) 퀘스트 상태 동기화
      if (quests && quests.length > 0) {
        const questRows = quests.map(q => ({
          user_id: userId,
          quest_id: q.id,
          current_amount: q.current || 0,
          status: q.status || 'progress',
          updated_at: new Date().toISOString()
        }));

        await supabase.from('user_quests').upsert(questRows, { onConflict: 'user_id,quest_id' });
      }

      return { success: true, message: '클라우드 동기화 완료!' };
    } catch (err) {
      console.error('[SOBIMON Sync Error]:', err);
      return { success: false, message: err.message };
    }
  },

  // 2. 클라우드에서 최신 데이터를 내려받아 로컬 장부로 복원
  downloadCloudData: async (userId) => {
    if (!supabase || !userId) return null;

    try {
      // 1) 프로필 가져오기
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // 2) 예산 가져오기
      const monthKey = new Date().toISOString().slice(0, 7);
      const { data: budget } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month_key', monthKey)
        .maybeSingle();

      // 3) 거래내역 가져오기
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      // 4) 소비몬 도감 가져오기
      const { data: sobimons } = await supabase
        .from('user_sobimons')
        .select('*')
        .eq('user_id', userId);

      // 5) 퀘스트 가져오기
      const { data: quests } = await supabase
        .from('user_quests')
        .select('*')
        .eq('user_id', userId);

      return {
        profile,
        budget,
        transactions,
        sobimons,
        quests
      };
    } catch (err) {
      console.error('[SOBIMON Download Error]:', err);
      return null;
    }
  }
};
