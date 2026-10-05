-- Hesaplar (Accounts) Tablosu Eksik Kolonlar
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS iban text;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- İşlemler (Transactions) Tablosu Eksik Kolonlar
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS category_id text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS invoice_url text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS receipt_url text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS account_name text;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS contact_name text;

-- Cariler (Contacts) Tablosu Eksik Kolonlar
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Ödemeler (Payments) Tablosu Eksik Kolonlar
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS account_name text;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS contact_name text;
