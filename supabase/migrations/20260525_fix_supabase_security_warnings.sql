-- Fix CRITICAL: RLS Disabled in Public for sports_cache
ALTER TABLE public.sports_cache ENABLE ROW LEVEL SECURITY;

-- If sports_cache should be publicly readable (like a generic cache for sports data), uncomment below:
-- CREATE POLICY "Enable read access for all users" ON public.sports_cache FOR SELECT USING (true);
-- If it should only be accessible by authenticated users:
-- CREATE POLICY "Enable read access for authenticated users" ON public.sports_cache FOR SELECT TO authenticated USING (true);

-- Fix CRITICAL: Security Definer View
-- By default, Postgres views run with the privileges of the user who created them, bypassing RLS.
-- Setting security_invoker = true ensures the view respects the RLS policies of the user querying it.
ALTER VIEW public.pomodoro_sessions SET (security_invoker = true);
ALTER VIEW public.recent_notifications SET (security_invoker = true);
ALTER VIEW public.behavioral_daily_summary SET (security_invoker = true);
ALTER VIEW public.user_daily_metrics SET (security_invoker = true);

-- Note: The "Auth RLS Initialization Plan" warnings are informational.
-- They appear when RLS is enabled but Supabase wants to ensure you have proper policies set up.
-- As long as those tables have correct RLS policies (e.g. USING (auth.uid() = user_id)), you can safely ignore or dismiss those warnings.
