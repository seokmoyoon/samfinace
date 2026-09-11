import { supabase } from '../utils/supabaseClient';

/**
 * SOBIMON 거래내역(Transactions) Supabase DB 연계 서비스
 */
export const transactionService = {
  /**
   * 사용자의 모든 거래내역 조회 (최신 날짜순)
   */
  fetchTransactions: async (userId) => {
    if (!supabase || !userId) return { success: false, data: [] };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) throw error;

      // 앱 내부 거래내역 포맷으로 정규화
      const formatted = (data || []).map((row) => ({
        id: row.id,
        user_id: row.user_id,
        date: row.date,
        time: row.time?.slice(0, 5) || '12:00',
        type: row.type || 'expense',
        category: row.category || '기타',
        amount: Number(row.amount) || 0,
        merchant: row.title || '소비',
        cardCompany: row.payment_method || '신용카드',
        paymentMethod: row.payment_method || '신용카드',
        memo: row.title || '',
        createdAt: row.created_at
      }));

      return { success: true, data: formatted };
    } catch (err) {
      console.error('[transactionService.fetchTransactions error]:', err);
      return { success: false, error: err.message, data: [] };
    }
  },

  /**
   * 새 거래내역 DB 저장 (INSERT)
   */
  createTransaction: async (userId, tx) => {
    if (!supabase || !userId) {
      console.warn('[transactionService] Supabase 또는 userId가 없어 로컬 모드로 동작합니다.');
      return { success: false, data: tx };
    }

    try {
      const payload = {
        user_id: userId,
        date: tx.date || new Date().toISOString().slice(0, 10),
        time: tx.time ? (tx.time.length === 5 ? `${tx.time}:00` : tx.time) : new Date().toTimeString().slice(0, 8),
        type: tx.type || 'expense',
        category: tx.category || '기타',
        amount: Math.round(Number(tx.amount)) || 0,
        title: tx.merchant || tx.title || tx.memo || '소비',
        payment_method: tx.cardCompany || tx.paymentMethod || '신용카드'
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      const formatted = {
        id: data.id,
        user_id: data.user_id,
        date: data.date,
        time: data.time?.slice(0, 5) || '12:00',
        type: data.type,
        category: data.category,
        amount: Number(data.amount),
        merchant: data.title,
        cardCompany: data.payment_method,
        paymentMethod: data.payment_method,
        memo: data.title,
        createdAt: data.created_at
      };

      return { success: true, data: formatted };
    } catch (err) {
      console.error('[transactionService.createTransaction error]:', err);
      return { success: false, error: err.message, data: tx };
    }
  },

  /**
   * 여러 거래내역 일괄 DB 저장 (배치 INSERT)
   */
  createMultipleTransactions: async (userId, txList) => {
    if (!supabase || !userId || !txList?.length) return { success: false, count: 0 };

    try {
      const rows = txList.map((tx) => ({
        user_id: userId,
        date: tx.date || new Date().toISOString().slice(0, 10),
        time: tx.time ? (tx.time.length === 5 ? `${tx.time}:00` : tx.time) : '12:00:00',
        type: tx.type || 'expense',
        category: tx.category || '기타',
        amount: Math.round(Number(tx.amount)) || 0,
        title: tx.merchant || tx.title || tx.memo || '소비',
        payment_method: tx.cardCompany || tx.paymentMethod || '신용카드'
      }));

      const { data, error } = await supabase
        .from('transactions')
        .insert(rows)
        .select();

      if (error) throw error;

      return { success: true, count: data?.length || 0, data };
    } catch (err) {
      console.error('[transactionService.createMultipleTransactions error]:', err);
      return { success: false, error: err.message, count: 0 };
    }
  },

  /**
   * 특정 거래내역 삭제 (DELETE)
   */
  deleteTransaction: async (userId, txId) => {
    if (!supabase) return { success: false };

    try {
      let query = supabase.from('transactions').delete().eq('id', txId);
      if (userId) query = query.eq('user_id', userId);

      const { error } = await query;
      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error('[transactionService.deleteTransaction error]:', err);
      return { success: false, error: err.message };
    }
  }
};
