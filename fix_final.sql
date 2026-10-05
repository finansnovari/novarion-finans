-- =============================================
-- NOVARION FİNANS — SUPABASE MASTER FIX
-- Bu script tüm eksik sütunları ekler, 
-- güvenlik politikalarını düzeltir.
-- Bir kere çalıştırman yeterli.
-- =============================================

-- ═══════════════════════════════════════════
-- 1. ACCOUNTS (Hesaplar) — Eksik sütunlar
-- ═══════════════════════════════════════════
-- TypeScript: bank_name?, iban?, description?, is_active
-- Schema'da yok: bank_name, iban, description, is_active
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS iban text;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- ═══════════════════════════════════════════
-- 2. CONTACTS (Cariler) — Eksik sütunlar
-- ═══════════════════════════════════════════
-- TypeScript: title?, tax_office?, currency?, notes?, is_active
-- Schema'da yok: title, currency, notes, is_active (tax_office var)
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS currency text DEFAULT '₺';
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- ═══════════════════════════════════════════
-- 3. TRANSACTIONS (İşlemler) — Eksik sütunlar
-- ═══════════════════════════════════════════
-- TypeScript: category_id?, subcategory?, tags?, attachment_url?, is_recurring, recurring_interval?, account_name?, contact_name?
-- Schema'da yok: category_id, subcategory, tags, attachment_url, is_recurring, recurring_interval, account_name, contact_name
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS category_id text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS subcategory text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS attachment_url text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS invoice_url text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS receipt_url text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS recurring_interval text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS account_name text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS contact_name text;

-- ═══════════════════════════════════════════
-- 4. PAYMENTS (Ödemeler) — Eksik sütunlar
-- ═══════════════════════════════════════════
-- TypeScript: direction, check_number?, reminder_notes?, contact_name?, account_name?
-- Schema'da yok: direction, check_number, reminder_notes, contact_name, account_name
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS direction text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS check_number text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS reminder_notes text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS contact_name text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS account_name text;

-- ═══════════════════════════════════════════
-- 5. GÜVENLİK POLİTİKALARI (RLS) — Düzeltme
-- ═══════════════════════════════════════════
-- Mevcut politikaları sil (WITH CHECK eksikti, INSERT engelleniyordu)
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.accounts;
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.contacts;
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.transactions;
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.payments;
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.profiles;

DROP POLICY IF EXISTS "Enable all for auth users" ON public.accounts;
DROP POLICY IF EXISTS "Enable all for auth users" ON public.contacts;
DROP POLICY IF EXISTS "Enable all for auth users" ON public.transactions;
DROP POLICY IF EXISTS "Enable all for auth users" ON public.payments;
DROP POLICY IF EXISTS "Enable all for auth users" ON public.profiles;

-- Yeniden oluştur (USING + WITH CHECK = hem okuma hem yazma izni)
CREATE POLICY "Enable all for auth users" ON public.profiles FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for auth users" ON public.accounts FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for auth users" ON public.contacts FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for auth users" ON public.transactions FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for auth users" ON public.payments FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
