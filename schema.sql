-- 1. Tabloların Oluşturulması

-- Kullanıcılar (Ekstra bilgiler için, giriş sistemi Supabase auth.users üzerinden çalışır)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text,
  role text DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hesaplar (Kasa/Banka)
CREATE TABLE public.accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  currency text DEFAULT '₺' NOT NULL,
  balance numeric DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cariler (Müşteri/Tedarikçi)
CREATE TABLE public.contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  email text,
  phone text,
  tax_number text,
  tax_office text,
  address text,
  balance numeric DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- İşlemler (Gelir/Gider)
CREATE TABLE public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT '₺' NOT NULL,
  date timestamp with time zone NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  category_name text,
  description text,
  status text DEFAULT 'completed' NOT NULL,
  payment_method text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ödemeler (Alacak/Borç Planları)
CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  amount numeric NOT NULL,
  paid_amount numeric DEFAULT 0 NOT NULL,
  currency text DEFAULT '₺' NOT NULL,
  due_date timestamp with time zone NOT NULL,
  contact_id uuid REFERENCES public.contacts(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  description text,
  status text DEFAULT 'pending' NOT NULL,
  payment_type text,
  is_recurring boolean DEFAULT false,
  recurring_interval text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Güvenlik Politikaları (RLS - Sadece Giriş Yapanlar Görebilir)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read/write for authenticated users only" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read/write for authenticated users only" ON public.accounts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read/write for authenticated users only" ON public.contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read/write for authenticated users only" ON public.transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read/write for authenticated users only" ON public.payments FOR ALL USING (auth.role() = 'authenticated');
