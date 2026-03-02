-- ============================================================
-- AIIMIN V2 Schema Migrations
-- Run in order. These are additive — no destructive changes.
-- ============================================================

-- ─── Migration 1: Extend users table ───────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS full_name   TEXT,
  ADD COLUMN IF NOT EXISTS timezone    TEXT DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS avatar_url  TEXT,
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT NOW();

-- ─── Migration 2: Extend user_oauth_tokens for encryption ──
ALTER TABLE public.user_oauth_tokens
  ADD COLUMN IF NOT EXISTS access_token_enc  TEXT,
  ADD COLUMN IF NOT EXISTS refresh_token_enc TEXT,
  ADD COLUMN IF NOT EXISTS scope             TEXT,
  ADD COLUMN IF NOT EXISTS last_refresh_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refresh_error     TEXT,
  ADD COLUMN IF NOT EXISTS provider_split    TEXT DEFAULT 'google';
-- Note: after installing crypto.js and backfilling _enc columns,
-- the plaintext access_token / refresh_token columns should be cleared.

-- ─── Migration 3: OAuth audit log ──────────────────────────
CREATE TABLE IF NOT EXISTS oauth_audit_log (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  provider   TEXT NOT NULL,
  event      TEXT NOT NULL,
  detail     JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_oauth_audit_user ON oauth_audit_log(user_id, created_at DESC);
ALTER TABLE oauth_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can select own oauth audit" ON oauth_audit_log;
CREATE POLICY "Users can select own oauth audit" ON oauth_audit_log
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
REVOKE ALL ON oauth_audit_log FROM PUBLIC;
GRANT SELECT ON oauth_audit_log TO authenticated;
GRANT ALL ON oauth_audit_log TO service_role;

-- ─── Migration 4: In-app notifications ─────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          TEXT,
  action_url    TEXT,
  read_at       TIMESTAMPTZ,
  dismissed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, read_at, dismissed_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON notifications(user_id, created_at DESC);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own notifications" ON notifications;
CREATE POLICY "Users can access own notifications" ON notifications
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON notifications FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
GRANT ALL ON notifications TO service_role;

-- ─── Migration 5: Commitment engine ────────────────────────
CREATE TABLE IF NOT EXISTS daily_commitments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  date             DATE NOT NULL,
  targets          JSONB NOT NULL DEFAULT '[]',
  met_count        INTEGER DEFAULT 0,
  total_count      INTEGER DEFAULT 0,
  fulfillment_pct  NUMERIC(5,2) DEFAULT 0,
  evaluated_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start   DATE NOT NULL,
  data         JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);
CREATE INDEX IF NOT EXISTS idx_daily_commitments_user_date
  ON daily_commitments(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_week
  ON weekly_summaries(user_id, week_start DESC);
ALTER TABLE daily_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries  ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own daily_commitments" ON daily_commitments;
CREATE POLICY "Users can access own daily_commitments" ON daily_commitments
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Users can access own weekly_summaries" ON weekly_summaries;
CREATE POLICY "Users can access own weekly_summaries" ON weekly_summaries
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON daily_commitments FROM PUBLIC;
REVOKE ALL ON weekly_summaries  FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON daily_commitments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON weekly_summaries  TO authenticated;
GRANT ALL ON daily_commitments TO service_role;
GRANT ALL ON weekly_summaries  TO service_role;

-- ─── Migration 6: Extend daily_logs with behavioral signals ─
ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS mood_before      SMALLINT CHECK (mood_before BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS mood_after       SMALLINT CHECK (mood_after BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS energy_level     SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS distraction_src  TEXT,
  ADD COLUMN IF NOT EXISTS playlist_used    TEXT;

-- ─── Useful views (optional but helpful for drift queries) ──
CREATE OR REPLACE VIEW user_daily_metrics AS
  SELECT
    dl.user_id,
    dl.date,
    dl.sleep_hours,
    dl.gym_done,
    dl.steps,
    dl.mood_before,
    dl.mood_after,
    dl.energy_level,
    COALESCE(ps.total_focus_minutes, 0) AS focus_minutes,
    COALESCE(ps.cycles_completed, 0)    AS focus_cycles,
    COALESCE(dc.fulfillment_pct, 0)     AS commitment_pct
  FROM daily_logs dl
  LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
  LEFT JOIN daily_commitments dc ON dc.user_id = dl.user_id AND dc.date = dl.date;
