import { supabase } from '../utils/supabaseClient';

/**
 * SOBIMON 월간 예산(Budgets) Supabase DB 연계 서비스
 */
export const budgetService = {
  /**
   * 사용자의 특정 월 예산 조회
   * @param {string} userId 
   * @param {string} monthKey 'YYYY-MM'
   */
  fetchBudget: async (userId, monthKey = new Date().toISOString().slice(0, 7)) => {
    if (!supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month_key', monthKey)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        monthKey: data.month_key,
        totalIncome: Number(data.total_income) || 0,
        fixedExpenses: Number(data.fixed_expenses) || 0,
        monthlyBudget: Number(data.monthly_budget) || 1000000,
        targetSavings: Number(data.target_savings) || 0
      };
    } catch (err) {
      console.error('[budgetService.fetchBudget error]:', err);
      return null;
    }
  },

  /**
   * 예산 저장 / 업데이트 (Upsert)
   */
  saveBudget: async (userId, budgetData, monthKey = new Date().toISOString().slice(0, 7)) => {
    if (!supabase || !userId) return { success: false };

    try {
      const payload = {
        user_id: userId,
        month_key: monthKey,
        total_income: Number(budgetData.totalIncome) || 0,
        fixed_expenses: Number(budgetData.fixedExpenses) || 0,
        monthly_budget: Number(budgetData.monthlyBudget) || 1000000,
        target_savings: Number(budgetData.targetSavings) || 0,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('budgets')
        .upsert(payload, { onConflict: 'user_id,month_key' })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: {
          id: data.id,
          userId: data.user_id,
          monthKey: data.month_key,
          totalIncome: Number(data.total_income) || 0,
          fixedExpenses: Number(data.fixed_expenses) || 0,
          monthlyBudget: Number(data.monthly_budget) || 1000000,
          targetSavings: Number(data.target_savings) || 0
        }
      };
    } catch (err) {
      console.error('[budgetService.saveBudget error]:', err);
      return { success: false, error: err.message };
    }
  }
};
