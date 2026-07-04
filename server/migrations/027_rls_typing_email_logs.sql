-- SEC-12: RLS on lab typing tables (applied via Supabase MCP 2026-06-30)

ALTER TABLE IF EXISTS public.typing_personal_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.typing_session_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.typing_milestone ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'typing_personal_bank' AND policyname = 'deny_anon_typing_bank') THEN
    CREATE POLICY deny_anon_typing_bank ON public.typing_personal_bank FOR ALL USING (false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'typing_session_detail' AND policyname = 'deny_anon_typing_detail') THEN
    CREATE POLICY deny_anon_typing_detail ON public.typing_session_detail FOR ALL USING (false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'typing_milestone' AND policyname = 'deny_anon_typing_milestone') THEN
    CREATE POLICY deny_anon_typing_milestone ON public.typing_milestone FOR ALL USING (false);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_logs' AND policyname = 'deny_anon_email_logs') THEN
    CREATE POLICY deny_anon_email_logs ON public.email_logs FOR ALL USING (false);
  END IF;
END $$;
