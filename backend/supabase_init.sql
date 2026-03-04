CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    google_id TEXT,
    theme TEXT DEFAULT 'dark',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sleep_start TIME,
    sleep_end TIME,
    sleep_hours NUMERIC(4,2),
    masturbation_count INTEGER DEFAULT 0,
    masturbation_times JSONB DEFAULT '[]',
    gym_done BOOLEAN DEFAULT false,
    gym_duration INTEGER,
    breakfast_done BOOLEAN DEFAULT false,
    steps INTEGER DEFAULT 0,
    protein_grams INTEGER DEFAULT 0,
    learning_done BOOLEAN DEFAULT false,
    learning_topic TEXT,
    journal_entry TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric TEXT NOT NULL,
    target NUMERIC NOT NULL,
    frequency TEXT NOT NULL,
    start_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    cycles_completed INTEGER DEFAULT 0,
    total_focus_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    google_event_id TEXT,
    title TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    completed BOOLEAN DEFAULT false,
    synced_to_log BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS money_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    category TEXT,
    amount NUMERIC(10,2),
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sleep_quality_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_oauth_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expiry_date BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- ROW LEVEL SECURITY (RLS) FOR PUBLIC.USERS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can select own row" ON public.users;
CREATE POLICY "Users can select own row" ON public.users FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "Users can insert own row" ON public.users;
CREATE POLICY "Users can insert own row" ON public.users FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
CREATE POLICY "Users can update own row" ON public.users FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "Users can delete own row" ON public.users;
CREATE POLICY "Users can delete own row" ON public.users FOR DELETE TO authenticated USING ((SELECT auth.uid()) = id);
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
REVOKE ALL ON public.users FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO service_role;

-- Enable RLS for all remaining tables
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.money_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_quality_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Helper to apply standard user_id based policies
DROP POLICY IF EXISTS "Users can access own daily_logs" ON public.daily_logs;
CREATE POLICY "Users can access own daily_logs" ON public.daily_logs FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON public.daily_logs(user_id);
REVOKE ALL ON public.daily_logs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_logs TO authenticated;
GRANT ALL ON public.daily_logs TO service_role;

DROP POLICY IF EXISTS "Users can access own goals" ON public.goals;
CREATE POLICY "Users can access own goals" ON public.goals FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
REVOKE ALL ON public.goals FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;

DROP POLICY IF EXISTS "Users can access own pomodoro_sessions" ON public.pomodoro_sessions;
CREATE POLICY "Users can access own pomodoro_sessions" ON public.pomodoro_sessions FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON public.pomodoro_sessions(user_id);
REVOKE ALL ON public.pomodoro_sessions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pomodoro_sessions TO authenticated;
GRANT ALL ON public.pomodoro_sessions TO service_role;

DROP POLICY IF EXISTS "Users can access own calendar_events" ON public.calendar_events;
CREATE POLICY "Users can access own calendar_events" ON public.calendar_events FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON public.calendar_events(user_id);
REVOKE ALL ON public.calendar_events FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT ALL ON public.calendar_events TO service_role;

DROP POLICY IF EXISTS "Users can access own money_transactions" ON public.money_transactions;
CREATE POLICY "Users can access own money_transactions" ON public.money_transactions FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_money_transactions_user_id ON public.money_transactions(user_id);
REVOKE ALL ON public.money_transactions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.money_transactions TO authenticated;
GRANT ALL ON public.money_transactions TO service_role;

DROP POLICY IF EXISTS "Users can access own wins" ON public.wins;
CREATE POLICY "Users can access own wins" ON public.wins FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_wins_user_id ON public.wins(user_id);
REVOKE ALL ON public.wins FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wins TO authenticated;
GRANT ALL ON public.wins TO service_role;

DROP POLICY IF EXISTS "Users can access own user_oauth_tokens" ON public.user_oauth_tokens;
CREATE POLICY "Users can access own user_oauth_tokens" ON public.user_oauth_tokens FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_user_oauth_tokens_user_id ON public.user_oauth_tokens(user_id);
REVOKE ALL ON public.user_oauth_tokens FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_oauth_tokens TO authenticated;
GRANT ALL ON public.user_oauth_tokens TO service_role;

-- sleep_quality_tags (relies on daily_logs)
DROP POLICY IF EXISTS "Users can access own sleep_quality_tags" ON public.sleep_quality_tags;
CREATE POLICY "Users can access own sleep_quality_tags" ON public.sleep_quality_tags FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.daily_logs WHERE daily_logs.id = sleep_quality_tags.daily_log_id AND daily_logs.user_id = (SELECT auth.uid()))) 
WITH CHECK (EXISTS (SELECT 1 FROM public.daily_logs WHERE daily_logs.id = sleep_quality_tags.daily_log_id AND daily_logs.user_id = (SELECT auth.uid())));
CREATE INDEX IF NOT EXISTS idx_sleep_quality_tags_daily_log_id ON public.sleep_quality_tags(daily_log_id);
REVOKE ALL ON public.sleep_quality_tags FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sleep_quality_tags TO authenticated;
GRANT ALL ON public.sleep_quality_tags TO service_role;

-- ============================================================
-- V2 Migrations
-- ============================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS full_name   TEXT,
  ADD COLUMN IF NOT EXISTS timezone    TEXT DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS avatar_url  TEXT,
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.user_oauth_tokens
  ADD COLUMN IF NOT EXISTS access_token_enc  TEXT,
  ADD COLUMN IF NOT EXISTS refresh_token_enc TEXT,
  ADD COLUMN IF NOT EXISTS scope             TEXT,
  ADD COLUMN IF NOT EXISTS last_refresh_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refresh_error     TEXT,
  ADD COLUMN IF NOT EXISTS provider_split    TEXT DEFAULT 'google';

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
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at, dismissed_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own notifications" ON notifications;
CREATE POLICY "Users can access own notifications" ON notifications
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON notifications FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
GRANT ALL ON notifications TO service_role;

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
CREATE INDEX IF NOT EXISTS idx_daily_commitments_user_date ON daily_commitments(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_week ON weekly_summaries(user_id, week_start DESC);
ALTER TABLE daily_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries  ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own daily_commitments" ON daily_commitments;
CREATE POLICY "Users can access own daily_commitments" ON daily_commitments FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Users can access own weekly_summaries" ON weekly_summaries;
CREATE POLICY "Users can access own weekly_summaries" ON weekly_summaries FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON daily_commitments FROM PUBLIC;
REVOKE ALL ON weekly_summaries  FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON daily_commitments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON weekly_summaries  TO authenticated;
GRANT ALL ON daily_commitments TO service_role;
GRANT ALL ON weekly_summaries  TO service_role;

ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS mood_before      SMALLINT CHECK (mood_before BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS mood_after       SMALLINT CHECK (mood_after BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS energy_level     SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS distraction_src  TEXT,
  ADD COLUMN IF NOT EXISTS playlist_used    TEXT;

DROP VIEW IF EXISTS user_daily_metrics CASCADE;
CREATE OR REPLACE VIEW user_daily_metrics AS
  SELECT
    dl.user_id, dl.date, dl.sleep_hours, dl.gym_done, dl.steps, dl.mood_before,
    dl.mood_after, dl.energy_level, COALESCE(ps.total_focus_minutes, 0) AS focus_minutes,
    COALESCE(ps.cycles_completed, 0) AS focus_cycles, COALESCE(dc.fulfillment_pct, 0) AS commitment_pct
  FROM daily_logs dl
  LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
  LEFT JOIN daily_commitments dc ON dc.user_id = dl.user_id AND dc.date = dl.date;

CREATE TABLE IF NOT EXISTS oauth_states (
  state      TEXT PRIMARY KEY,
  user_id    UUID,
  is_login   BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires ON oauth_states(expires_at);

CREATE TABLE IF NOT EXISTS notes (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title             TEXT,
  content           TEXT NOT NULL,
  type              TEXT CHECK (type IN ('note', 'reminder')) DEFAULT 'note',
  reminder_time     TIMESTAMPTZ,
  linked_session_id UUID,
  linked_event_id   TEXT,
  completed         BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_reminder_time ON notes(user_id, reminder_time) WHERE type = 'reminder' AND completed = false;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own notes" ON notes;
CREATE POLICY "Users own notes" ON notes FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON notes FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON notes TO authenticated;
GRANT ALL ON notes TO service_role;

CREATE TABLE IF NOT EXISTS api_errors (
  id uuid default gen_random_uuid() primary key,
  correlation_id text,
  route text,
  method text,
  message text,
  stack text,
  created_at timestamptz default now()
);

-- ============================================================
-- V3/V3.5 Migrations
-- ============================================================

ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS timezone   TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS all_day    BOOLEAN DEFAULT false;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'personal';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, start_time DESC) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS sessions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at       TIMESTAMPTZ NOT NULL,
  ended_at         TIMESTAMPTZ,
  duration_minutes INTEGER,
  session_type     TEXT DEFAULT 'focus',
  mood_before      SMALLINT CHECK (mood_before BETWEEN 1 AND 5),
  mood_after       SMALLINT CHECK (mood_after BETWEEN 1 AND 5),
  energy_level     SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  distraction_src  TEXT,
  playlist_used    TEXT,
  notes            TEXT,
  deleted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON sessions(user_id, started_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON sessions(user_id, CAST(started_at AT TIME ZONE 'UTC' AS DATE));
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own sessions" ON sessions;
CREATE POLICY "Users can access own sessions" ON sessions FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON sessions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO authenticated;
GRANT ALL ON sessions TO service_role;

ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE goals      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE wins       ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_daily_logs_active ON daily_logs(user_id, date DESC) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS internal_metrics (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_name  TEXT NOT NULL,
  value        NUMERIC,
  meta         JSONB DEFAULT '{}',
  recorded_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_internal_metrics_user_name ON internal_metrics(user_id, metric_name, recorded_at DESC);
ALTER TABLE internal_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own internal_metrics" ON internal_metrics;
CREATE POLICY "Users can access own internal_metrics" ON internal_metrics FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON internal_metrics FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON internal_metrics TO authenticated;
GRANT ALL ON internal_metrics TO service_role;

ALTER TABLE weekly_summaries ADD COLUMN IF NOT EXISTS insight_version INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_notifications_drift_dedup ON notifications(user_id, type, title) WHERE type = 'drift_alert' AND dismissed_at IS NULL;

DROP VIEW IF EXISTS recent_notifications CASCADE;
CREATE OR REPLACE VIEW recent_notifications AS
  SELECT user_id, type, title, MAX(created_at) AS last_at FROM notifications WHERE dismissed_at IS NULL GROUP BY user_id, type, title;

DROP VIEW IF EXISTS user_daily_metrics CASCADE;
CREATE OR REPLACE VIEW user_daily_metrics AS
  SELECT
    dl.user_id, dl.date, dl.sleep_hours, dl.gym_done, dl.steps, dl.mood_before,
    dl.mood_after, dl.energy_level, dl.protein_grams,
    COALESCE(ps.total_focus_minutes, 0) AS focus_minutes,
    COALESCE(ps.cycles_completed, 0) AS focus_cycles,
    COALESCE(dc.fulfillment_pct, 0) AS commitment_pct,
    COALESCE((SELECT COUNT(*) FROM sessions s WHERE s.user_id = dl.user_id AND s.started_at::date = dl.date AND s.deleted_at IS NULL), 0) AS session_count,
    COALESCE((SELECT AVG(s.mood_before) FROM sessions s WHERE s.user_id = dl.user_id AND s.started_at::date = dl.date AND s.mood_before IS NOT NULL AND s.deleted_at IS NULL), dl.mood_before) AS session_mood_avg
  FROM daily_logs dl
  LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
  LEFT JOIN daily_commitments dc ON dc.user_id = dl.user_id AND dc.date = dl.date
  WHERE dl.deleted_at IS NULL;

ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS onboarding_stage INTEGER DEFAULT 0 CHECK (onboarding_stage BETWEEN 0 AND 4);

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
CREATE TRIGGER tr_prevent_username_update BEFORE UPDATE OF username ON public.users FOR EACH ROW EXECUTE PROCEDURE public.prevent_username_update();

ALTER TABLE public.daily_logs       ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.sessions         ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.daily_commitments ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.wins              ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
ALTER TABLE public.calendar_events  ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user' CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));

ALTER TABLE public.weekly_summaries ADD COLUMN IF NOT EXISTS behavior_engine_version INTEGER DEFAULT 1;

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
CREATE POLICY "Users can access own momentum_history" ON public.momentum_history FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
GRANT ALL ON public.momentum_history TO authenticated;
GRANT ALL ON public.momentum_history TO service_role;

CREATE TABLE IF NOT EXISTS public.admin_action_log (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id   UUID REFERENCES users(id),
  action_type     TEXT NOT NULL,
  target_user_id  UUID REFERENCES users(id),
  payload         JSONB DEFAULT '{}',
  timestamp       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all logs" ON public.admin_action_log;
CREATE POLICY "Admins can view all logs" ON public.admin_action_log FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = (SELECT auth.uid()) AND role = 'super_admin'));
GRANT SELECT, INSERT ON public.admin_action_log TO authenticated;
GRANT ALL ON public.admin_action_log TO service_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, username)
  VALUES (new.id, new.email, (new.raw_user_meta_data->>'full_name'), (new.raw_user_meta_data->>'username'))
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    username = COALESCE(EXCLUDED.username, public.users.username);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
