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

-- ==========================================
-- ROW LEVEL SECURITY (RLS) FOR PUBLIC.USERS
-- ==========================================

-- 1. Enable RLS on the table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Create SELECT policy
DROP POLICY IF EXISTS "Users can select own row" ON public.users;
CREATE POLICY "Users can select own row" ON public.users
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

-- 3. Create INSERT policy
DROP POLICY IF EXISTS "Users can insert own row" ON public.users;
CREATE POLICY "Users can insert own row" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- 4. Create UPDATE policy
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
CREATE POLICY "Users can update own row" ON public.users
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- 5. Create DELETE policy
DROP POLICY IF EXISTS "Users can delete own row" ON public.users;
CREATE POLICY "Users can delete own row" ON public.users
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = id);

-- 6. Add index for performance on id
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);

-- 7. Audit GRANTS on the table
REVOKE ALL ON public.users FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO service_role;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) FOR OTHER TABLES
-- ==========================================

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

-- daily_logs
DROP POLICY IF EXISTS "Users can access own daily_logs" ON public.daily_logs;
CREATE POLICY "Users can access own daily_logs" ON public.daily_logs FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON public.daily_logs(user_id);
REVOKE ALL ON public.daily_logs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_logs TO authenticated;
GRANT ALL ON public.daily_logs TO service_role;

-- goals
DROP POLICY IF EXISTS "Users can access own goals" ON public.goals;
CREATE POLICY "Users can access own goals" ON public.goals FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
REVOKE ALL ON public.goals FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;

-- pomodoro_sessions
DROP POLICY IF EXISTS "Users can access own pomodoro_sessions" ON public.pomodoro_sessions;
CREATE POLICY "Users can access own pomodoro_sessions" ON public.pomodoro_sessions FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON public.pomodoro_sessions(user_id);
REVOKE ALL ON public.pomodoro_sessions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pomodoro_sessions TO authenticated;
GRANT ALL ON public.pomodoro_sessions TO service_role;

-- calendar_events
DROP POLICY IF EXISTS "Users can access own calendar_events" ON public.calendar_events;
CREATE POLICY "Users can access own calendar_events" ON public.calendar_events FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON public.calendar_events(user_id);
REVOKE ALL ON public.calendar_events FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT ALL ON public.calendar_events TO service_role;

-- money_transactions
DROP POLICY IF EXISTS "Users can access own money_transactions" ON public.money_transactions;
CREATE POLICY "Users can access own money_transactions" ON public.money_transactions FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_money_transactions_user_id ON public.money_transactions(user_id);
REVOKE ALL ON public.money_transactions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.money_transactions TO authenticated;
GRANT ALL ON public.money_transactions TO service_role;

-- wins
DROP POLICY IF EXISTS "Users can access own wins" ON public.wins;
CREATE POLICY "Users can access own wins" ON public.wins FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_wins_user_id ON public.wins(user_id);
REVOKE ALL ON public.wins FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wins TO authenticated;
GRANT ALL ON public.wins TO service_role;

-- user_oauth_tokens
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
