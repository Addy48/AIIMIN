-- P0 auth/DB security hardening (2026-07-18 audit)
-- Applied remotely via Supabase MCP as p0_auth_db_security_hardening

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.prevent_username_update() SET search_path = public;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.user_oauth_tokens'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public.user_oauth_tokens
      ADD CONSTRAINT user_oauth_tokens_pkey PRIMARY KEY (id);
  END IF;
END $$;

REVOKE ALL ON TABLE public."user" FROM anon, authenticated;
REVOKE ALL ON TABLE public."session" FROM anon, authenticated;
REVOKE ALL ON TABLE public."account" FROM anon, authenticated;
REVOKE ALL ON TABLE public."verification" FROM anon, authenticated;
REVOKE ALL ON TABLE public."twoFactor" FROM anon, authenticated;
REVOKE ALL ON TABLE public.user_oauth_tokens FROM anon, authenticated;

DROP INDEX IF EXISTS public.idx_calendar_events_user_start_not_deleted;
DROP INDEX IF EXISTS public.idx_sleep_quality_tags_log;
