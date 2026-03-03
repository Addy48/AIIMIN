-- Ensure columns exist if table already existed from V1
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS timezone   TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS all_day    BOOLEAN DEFAULT false;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'personal';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date
  ON calendar_events(user_id, start_time DESC)
  WHERE deleted_at IS NULL;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own calendar_events" ON calendar_events;
CREATE POLICY "Users can access own calendar_events" ON calendar_events
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON calendar_events FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON calendar_events TO authenticated;
GRANT ALL ON calendar_events TO service_role;

-- ─── 2. Sessions table (atomic behavioral events) ────────────
-- daily_logs captures day-level summaries.
-- sessions captures individual atomic focus events.
CREATE TABLE IF NOT EXISTS sessions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at       TIMESTAMPTZ NOT NULL,
  ended_at         TIMESTAMPTZ,
  duration_minutes INTEGER,
  session_type     TEXT DEFAULT 'focus',          -- 'focus' | 'learning' | 'reflection'
  mood_before      SMALLINT CHECK (mood_before BETWEEN 1 AND 5),
  mood_after       SMALLINT CHECK (mood_after BETWEEN 1 AND 5),
  energy_level     SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  distraction_src  TEXT,
  playlist_used    TEXT,
  notes            TEXT,
  deleted_at       TIMESTAMPTZ,                   -- soft delete
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_started
  ON sessions(user_id, started_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user_date
  ON sessions(user_id, CAST(started_at AT TIME ZONE 'UTC' AS DATE));
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own sessions" ON sessions;
CREATE POLICY "Users can access own sessions" ON sessions
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON sessions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO authenticated;
GRANT ALL ON sessions TO service_role;

-- ─── 3. Soft delete columns on mutable tables ────────────────
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE goals      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE wins       ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Partial indexes: existing queries should filter WHERE deleted_at IS NULL
CREATE INDEX IF NOT EXISTS idx_daily_logs_active
  ON daily_logs(user_id, date DESC) WHERE deleted_at IS NULL;

-- ─── 4. Internal analytics (founder self-metrics) ────────────
CREATE TABLE IF NOT EXISTS internal_metrics (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_name  TEXT NOT NULL,
  value        NUMERIC,
  meta         JSONB DEFAULT '{}',
  recorded_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_internal_metrics_user_name
  ON internal_metrics(user_id, metric_name, recorded_at DESC);
ALTER TABLE internal_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own internal_metrics" ON internal_metrics;
CREATE POLICY "Users can access own internal_metrics" ON internal_metrics
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON internal_metrics FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON internal_metrics TO authenticated;
GRANT ALL ON internal_metrics TO service_role;

-- ─── 5. Insight versioning on weekly_summaries ───────────────
ALTER TABLE weekly_summaries
  ADD COLUMN IF NOT EXISTS insight_version INTEGER DEFAULT 1;

-- Ensure idempotency index for drift notifications:
-- Drift alerts should not be created twice for same metric + same day.
-- Store metric in the body — use a deterministic partial unique approach:
-- We use the title as the dedup key with a 24h dedupe in application code (see notifications.js).
-- For belt-and-suspenders, add a composite check index:
CREATE INDEX IF NOT EXISTS idx_notifications_drift_dedup
  ON notifications(user_id, type, title)
  WHERE type = 'drift_alert' AND dismissed_at IS NULL;

-- ─── 6. Notification dedup helper: last_notification_key ─────
-- Expose as view for dedup check in createNotification()
CREATE OR REPLACE VIEW recent_notifications AS
  SELECT user_id, type, title, MAX(created_at) AS last_at
  FROM notifications
  WHERE dismissed_at IS NULL
  GROUP BY user_id, type, title;

-- ─── 7. Refresh user_daily_metrics view to include sessions ───
-- Supersedes V2 version — now joins sessions table for granular data
DROP VIEW IF EXISTS user_daily_metrics;
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
    dl.protein_grams,
    COALESCE(ps.total_focus_minutes, 0)                                         AS focus_minutes,
    COALESCE(ps.cycles_completed, 0)                                            AS focus_cycles,
    COALESCE(dc.fulfillment_pct, 0)                                             AS commitment_pct,
    -- Session-level aggregates
    COALESCE((
      SELECT COUNT(*) FROM sessions s
      WHERE s.user_id = dl.user_id
        AND s.started_at::date = dl.date
        AND s.deleted_at IS NULL
    ), 0)                                                                        AS session_count,
    COALESCE((
      SELECT AVG(s.mood_before) FROM sessions s
      WHERE s.user_id = dl.user_id
        AND s.started_at::date = dl.date
        AND s.mood_before IS NOT NULL
        AND s.deleted_at IS NULL
    ), dl.mood_before)                                                           AS session_mood_avg
  FROM daily_logs dl
  LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
  LEFT JOIN daily_commitments dc ON dc.user_id = dl.user_id AND dc.date = dl.date
  WHERE dl.deleted_at IS NULL;
