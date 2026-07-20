-- Lock down Better Auth core tables (no direct anon/authenticated access via PostgREST)
-- Apply in Supabase SQL editor. API uses service role / direct pool — not affected.

ALTER TABLE IF EXISTS public."user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."twoFactor" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_user" ON public."user";
CREATE POLICY "deny_all_user" ON public."user" FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_session" ON public."session";
CREATE POLICY "deny_all_session" ON public."session" FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_account" ON public."account";
CREATE POLICY "deny_all_account" ON public."account" FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_verification" ON public."verification";
CREATE POLICY "deny_all_verification" ON public."verification" FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_twoFactor" ON public."twoFactor";
CREATE POLICY "deny_all_twoFactor" ON public."twoFactor" FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
