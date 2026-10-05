import { supabase } from '@/lib/supabase';
import type { Account, Transaction, Contact, Category, Payment } from '@/types';

export const db = {
  async fetchAll() {
    const [
      { data: accounts },
      { data: transactions },
      { data: contacts },
      { data: payments }
    ] = await Promise.all([
      supabase.from('accounts').select('*'),
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('contacts').select('*'),
      supabase.from('payments').select('*').order('due_date', { ascending: true })
    ]);
    return {
      accounts: accounts || [],
      transactions: transactions || [],
      contacts: contacts || [],
      payments: payments || []
    };
  }
};
