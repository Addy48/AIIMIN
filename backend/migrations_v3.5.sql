-- ============================================================
-- AIIMIN V3.5 — Behavioral Intelligence OS Refactor
-- ============================================================

-- ─── 1. User Role & Onboarding Extensions ───────────────────
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS onboarding_stage INTEGER DEFAULT 0 CHECK (onboarding_stage BETWEEN 0 AND 4);

-- Prevent username updates after initial set
CREATE OR REPLACE FUNCTION public.prevent_username_update()
RETURNS trigger AS $$
BEGIN
  IF OLD.username IS NOT NULL AND NEW.username IS DISTINCT FROM OLD.username THEN
    RAISE EXCEPTION 'Username is immutable after creation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_username_update ON public.users;
CREATE TRIGGER tr_prevent_username_update
  BEFORE UPDATE OF username ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.prevent_username_update();

-- ─── 2. Data Integrity (Source Flags) ────────────────────────
-- Apply to all behavioral log tables
ALTER TABLE public.daily_logs       ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.sessions         ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.daily_commitments ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.wins              ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.calendar_events  ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));

-- ─── 3. Behavioral Engine Versioning ─────────────────────────
ALTER TABLE public.weekly_summaries
  ADD COLUMN IF NOT EXISTS behavior_engine_version INTEGER DEFAULT 1;

-- Momentum History for tracking performance over time
CREATE TABLE IF NOT EXISTS public.momentum_history (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID REFERENCES users(id) ON DELETE CASCADE,
  score                   NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  behavior_engine_version INTEGER DEFAULT 1,
  calculated_at           TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_momentum_history_user_date ON public.momentum_history(user_id, calculated_at DESC);
ALTER TABLE public.momentum_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own momentum_history" ON public.momentum_history;
CREATE POLICY "Users can access own momentum_history" ON public.momentum_history 
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
GRANT ALL ON public.momentum_history TO authenticated;
GRANT ALL ON public.momentum_history TO service_role;

-- ─── 4. Admin Audit Logging ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_action_log (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id   UUID REFERENCES users(id),
  action_type     TEXT NOT NULL,
  target_user_id  UUID REFERENCES users(id),
  payload         JSONB DEFAULT '{}',
  timestamp       TIMESTAMPTZ DEFAULT NOW()
);
-- Admin logs only accessible by super_admin or service_role
ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all logs" ON public.admin_action_log;
CREATE POLICY "Admins can view all logs" ON public.admin_action_log
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = (SELECT auth.uid()) AND role = 'super_admin')
  );
GRANT SELECT, INSERT ON public.admin_action_log TO authenticated;
GRANT ALL ON public.admin_action_log TO service_role;
