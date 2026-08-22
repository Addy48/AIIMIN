-- RLS for native mobile sync tables (defense in depth; API uses service role + requireAuth)
-- Safe to re-run.

ALTER TABLE IF EXISTS public.mobile_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mobile_idempotency ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mobile_devices_own ON public.mobile_devices;
CREATE POLICY mobile_devices_own ON public.mobile_devices
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS mobile_idempotency_own ON public.mobile_idempotency;
CREATE POLICY mobile_idempotency_own ON public.mobile_idempotency
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role (EC2 API) bypasses RLS; anon/authenticated direct Supabase access is scoped.
