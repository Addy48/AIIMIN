-- SEC-13: Fix Supabase linter CRITICAL — RLS disabled in public (2026-07-08)
-- Tables accessed only via Express API (postgres pool / service role bypasses RLS).
-- Enabling RLS with no anon/authenticated policies blocks PostgREST direct access.

ALTER TABLE IF EXISTS public.api_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.api_provider_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.waitlist_feedback ENABLE ROW LEVEL SECURITY;

-- Revoke direct API access from anon/authenticated (defense in depth)
REVOKE ALL ON public.api_usage_log FROM anon, authenticated;
REVOKE ALL ON public.api_provider_budgets FROM anon, authenticated;
REVOKE ALL ON public.waitlist_feedback FROM anon, authenticated;
