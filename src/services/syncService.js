import { supabase } from '../utils/supabaseClient';

const monthKey = () => new Date().toISOString().slice(0, 7);

const txCloudId = (userId, tx) => {
  if (tx.cloudId) return tx.cloudId;
  const raw = [userId, tx.id || '', tx.date || '', tx.time || '', tx.amount || 0, tx.title || tx.memo || ''].join('|');
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `local-${(hash >>> 0).toString(16)}`;
};

const ensure = (error) => {
  if (error) throw error;
};

export const syncService = {
  uploadLocalDataToCloud: async (userId, localData) => {
    if (!supabase || !userId) return { success: false, message: '로그인이 필요합니다.' };

    try {
      const { user, budget, transactions = [], sobimons = [], quests = [] } = localData;

      if (user) {
        const { error } = await supabase.from('profiles').upsert({
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
        ensure(error);
      }

      if (budget) {
        const { error } = await supabase.from('budgets').upsert({
          user_id: userId,
          month_key: monthKey(),
          total_income: budget.totalIncome,
          fixed_expenses: budget.fixedExpenses,
          monthly_budget: budget.monthlyBudget,
          target_savings: budget.targetSavings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,month_key' });
        ensure(error);
      }

      if (transactions.length) {
        const rows = transactions.map((tx) => ({
          user_id: userId,
          client_id: txCloudId(userId, tx),
          date: tx.date || new Date().toISOString().slice(0, 10),
          time: tx.time || '12:00:00',
          type: tx.type || 'expense',
          category: tx.category || '기타',
          amount: Number(tx.amount) || 0,
          title: tx.title || tx.memo || '지출',
          payment_method: tx.paymentMethod || tx.payment_method || '기타',
          updated_at: new Date().toISOString()
        }));
        const { error } = await supabase.from('transactions').upsert(rows, { onConflict: 'user_id,client_id' });
        ensure(error);
      }

      if (sobimons.length) {
        const rows = sobimons.map((m) => ({
          user_id: userId,
          sobimon_id: String(m.id),
          discovered: Boolean(m.discovered),
          level: Number(m.level) || 1,
          unlocked_at: m.unlockedAt || m.unlocked_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        const { error } = await supabase.from('user_sobimons').upsert(rows, { onConflict: 'user_id,sobimon_id' });
        ensure(error);
      }

      if (quests.length) {
        const rows = quests.map((q) => ({
          user_id: userId,
          quest_id: String(q.id),
          current_amount: Number(q.current) || 0,
          status: q.status || 'progress',
          updated_at: new Date().toISOString()
        }));
        const { error } = await supabase.from('user_quests').upsert(rows, { onConflict: 'user_id,quest_id' });
        ensure(error);
      }

      return { success: true, message: '클라우드 동기화 완료!' };
    } catch (err) {
      console.error('[SOBIMON Sync Error]:', err);
      return { success: false, message: err.message };
    }
  },

  downloadCloudData: async (userId) => {
    if (!supabase || !userId) return null;

    try {
      const [profileRes, budgetRes, txRes, monRes, questRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('budgets').select('*').eq('user_id', userId).eq('month_key', monthKey()).maybeSingle(),
        supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }).order('time', { ascending: false }),
        supabase.from('user_sobimons').select('*').eq('user_id', userId),
        supabase.from('user_quests').select('*').eq('user_id', userId)
      ]);

      [profileRes, budgetRes, txRes, monRes, questRes].forEach((res) => ensure(res.error));

      return {
        profile: profileRes.data,
        budget: budgetRes.data,
        transactions: txRes.data || [],
        sobimons: monRes.data || [],
        quests: questRes.data || []
      };
    } catch (err) {
      console.error('[SOBIMON Download Error]:', err);
      return null;
    }
  },

  mergeCloudIntoLocal: (cloud, local) => {
    if (!cloud) return local;

    const cloudTx = (cloud.transactions || []).map((tx) => ({
      id: tx.client_id || tx.id,
      cloudId: tx.client_id,
      date: tx.date,
      time: tx.time,
      type: tx.type,
      category: tx.category,
      amount: Number(tx.amount) || 0,
      title: tx.title,
      memo: tx.title,
      paymentMethod: tx.payment_method
    }));

    const localTxMap = new Map((local.transactions || []).map((tx) => [txCloudId(local.currentUserId || '', tx), tx]));
    cloudTx.forEach((tx) => localTxMap.set(tx.cloudId || tx.id, tx));

    const monMap = new Map((local.sobimons || []).map((m) => [String(m.id), m]));
    (cloud.sobimons || []).forEach((row) => {
      const base = monMap.get(String(row.sobimon_id)) || { id: row.sobimon_id };
      monMap.set(String(row.sobimon_id), { ...base, discovered: row.discovered, level: row.level, unlockedAt: row.unlocked_at });
    });

    const questMap = new Map((local.quests || []).map((q) => [String(q.id), q]));
    (cloud.quests || []).forEach((row) => {
      const base = questMap.get(String(row.quest_id)) || { id: row.quest_id };
      questMap.set(String(row.quest_id), { ...base, current: row.current_amount, status: row.status });
    });

    return {
      user: cloud.profile ? {
        ...local.user,
        name: cloud.profile.name ?? local.user?.name,
        level: cloud.profile.level ?? local.user?.level,
        title: cloud.profile.title ?? local.user?.title,
        exp: cloud.profile.exp ?? local.user?.exp,
        maxExp: cloud.profile.max_exp ?? local.user?.maxExp,
        coins: cloud.profile.coins ?? local.user?.coins,
        streakDays: cloud.profile.streak_days ?? local.user?.streakDays
      } : local.user,
      budget: cloud.budget ? {
        ...local.budget,
        totalIncome: cloud.budget.total_income,
        fixedExpenses: cloud.budget.fixed_expenses,
        monthlyBudget: cloud.budget.monthly_budget,
        targetSavings: cloud.budget.target_savings
      } : local.budget,
      transactions: Array.from(localTxMap.values()).sort((a, b) => `${b.date || ''} ${b.time || ''}`.localeCompare(`${a.date || ''} ${a.time || ''}`)),
      sobimons: Array.from(monMap.values()),
      quests: Array.from(questMap.values())
    };
  }
};
