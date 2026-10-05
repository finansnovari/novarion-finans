import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function runTests() {
  console.log("🚀 Veritabanı ve Şema Testleri Başlıyor...");

  // 1. Üye ol ve Giriş yap (RLS'yi aşmak için)
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: 'test_robot_12345@novarion.com',
    password: 'TestPassword123!',
  });

  if (authErr) {
    console.error("⚠️ Kayıt olunamadı (Muhtemelen email onayı açık):", authErr.message);
    // Kayıt olunamadıysa, sadece session almayı deneyelim (belki zaten kaydolduk)
    const { error: loginErr } = await supabase.auth.signInWithPassword({
      email: 'test_robot_12345@novarion.com',
      password: 'TestPassword123!',
    });
    if (loginErr) {
      console.error("❌ Oturum açılamadı, RLS testi yapılamıyor:", loginErr.message);
      return;
    }
  }
  console.log("✅ Oturum başarıyla açıldı! RLS test ediliyor...");

  // 1. Hesap Testi
  console.log("\n[1] Hesaplar (Accounts) Tablosu Test Ediliyor...");
  const { data: account, error: accErr } = await supabase.from('accounts').insert([{
    name: 'Test Hesabı',
    type: 'bank',
    balance: 100,
    currency: '₺',
    bank_name: 'Test Bank',
    iban: 'TR0000',
    description: 'Test',
    is_active: true
  }]).select().single();
  
  if (accErr) console.error("❌ Hata:", accErr.message);
  else {
    console.log("✅ Başarılı! ID:", account.id);
    await supabase.from('accounts').delete().eq('id', account.id);
  }

  // 2. Cari Testi
  console.log("\n[2] Cariler (Contacts) Tablosu Test Ediliyor...");
  const { data: contact, error: contErr } = await supabase.from('contacts').insert([{
    name: 'Test Cari',
    type: 'customer',
    title: 'Test Şirket',
    tax_number: '1234567890',
    tax_office: 'Test VD',
    currency: '₺',
    notes: 'Test',
    is_active: true
  }]).select().single();
  
  if (contErr) console.error("❌ Hata:", contErr.message);
  else {
    console.log("✅ Başarılı! ID:", contact.id);
    await supabase.from('contacts').delete().eq('id', contact.id);
  }

  // 3. İşlem Testi
  console.log("\n[3] İşlemler (Transactions) Tablosu Test Ediliyor...");
  const { data: transaction, error: transErr } = await supabase.from('transactions').insert([{
    type: 'income',
    amount: 50,
    currency: '₺',
    date: new Date().toISOString(),
    status: 'completed',
    category_id: 'c1',
    description: 'Test İşlem'
  }]).select().single();

  if (transErr) console.error("❌ Hata:", transErr.message);
  else {
    console.log("✅ Başarılı! ID:", transaction.id);
    await supabase.from('transactions').delete().eq('id', transaction.id);
  }

  // 4. Ödeme Testi
  console.log("\n[4] Ödemeler (Payments) Tablosu Test Ediliyor...");
  const { data: payment, error: payErr } = await supabase.from('payments').insert([{
    direction: 'payable',
    type: 'payable',
    amount: 100,
    paid_amount: 0,
    currency: '₺',
    due_date: new Date().toISOString(),
    status: 'pending'
  }]).select().single();

  if (payErr) console.error("❌ Hata:", payErr.message);
  else {
    console.log("✅ Başarılı! ID:", payment.id);
    await supabase.from('payments').delete().eq('id', payment.id);
  }
}
runTests();
