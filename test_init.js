import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const [
    { data: accounts, error: err1 },
    { data: transactions, error: err2 },
    { data: contacts, error: err3 },
    { data: payments, error: err4 }
  ] = await Promise.all([
    supabase.from('accounts').select('*'),
    supabase.from('transactions').select('*').order('date', { ascending: false }),
    supabase.from('contacts').select('*'),
    supabase.from('payments').select('*').order('due_date', { ascending: true })
  ]);
  
  console.log("Accounts:", accounts?.length, err1?.message);
  console.log("Transactions:", transactions?.length, err2?.message);
  console.log("Contacts:", contacts?.length, err3?.message);
  console.log("Payments:", payments?.length, err4?.message);
}
run();
