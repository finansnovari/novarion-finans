-- Güvenlik politikalarını (RLS) yenileme
-- Bazen "USING" tek başına Insert (Ekleme) işlemi için yetmez, "WITH CHECK" de gerekir.

DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.accounts;
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.contacts;
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.transactions;
DROP POLICY IF EXISTS "Enable read/write for authenticated users only" ON public.payments;

CREATE POLICY "Enable all for auth users" ON public.accounts FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for auth users" ON public.contacts FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for auth users" ON public.transactions FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for auth users" ON public.payments FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
