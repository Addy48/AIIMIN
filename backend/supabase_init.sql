-- ============================================================
-- AIIMIN — Complete Supabase Schema v5.0
-- Single source of truth. Copy-paste this entire file into
-- the Supabase SQL editor and run once.
-- Idempotent: safe to re-run on an existing database.
-- ============================================================


-- ============================================================
-- SECTION 1: FUNCTIONS & TRIGGERS
-- ============================================================

-- Sync auth.users → public.users on every signup / Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, username)
    VALUES (
        new.id,
        new.email,
        (new.raw_user_meta_data->>'full_name'),
        (new.raw_user_meta_data->>'username')
    )
    ON CONFLICT (id) DO UPDATE SET
        email     = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
        username  = COALESCE(EXCLUDED.username,  public.users.username);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Prevent username changes after it has been set
CREATE OR REPLACE FUNCTION public.prevent_username_update()
RETURNS trigger AS $$
BEGIN
    IF OLD.username IS NOT NULL AND NEW.username IS DISTINCT FROM OLD.username THEN
        RAISE EXCEPTION 'Username is immutable after it has been set.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_username_update ON public.users;
-- (trigger is re-created after users table is created below)


-- ============================================================
-- SECTION 2: USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
    id               UUID PRIMARY KEY,               -- mirrors auth.users.id
    email            TEXT UNIQUE NOT NULL,
    google_id        TEXT,
    full_name        TEXT,
    username         TEXT UNIQUE,
    avatar_url       TEXT,
    theme            TEXT DEFAULT 'dark',
    timezone         TEXT DEFAULT 'Asia/Kolkata',
    role             TEXT DEFAULT 'user'
                         CHECK (role IN ('user', 'admin', 'super_admin')),
    onboarding_stage INTEGER DEFAULT 0
                         CHECK (onboarding_stage BETWEEN 0 AND 4),
    sleep_need_hours NUMERIC(4,2) DEFAULT 8.0,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Re-attach immutable-username trigger now that the table exists
CREATE TRIGGER tr_prevent_username_update
    BEFORE UPDATE OF username ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.prevent_username_update();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_own"         ON public.users;
DROP POLICY IF EXISTS "users_insert_own"         ON public.users;
DROP POLICY IF EXISTS "users_update_own"         ON public.users;
DROP POLICY IF EXISTS "users_delete_own"         ON public.users;
DROP POLICY IF EXISTS "Users can select own row" ON public.users;
DROP POLICY IF EXISTS "Users can insert own row" ON public.users;
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
DROP POLICY IF EXISTS "Users can delete own row" ON public.users;
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "users_delete_own" ON public.users
    FOR DELETE TO authenticated USING ((SELECT auth.uid()) = id);

CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
REVOKE ALL ON public.users FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO service_role;


-- ============================================================
-- SECTION 3: DAILY TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.daily_logs (
    id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id            UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date               DATE NOT NULL,
    -- Sleep
    sleep_start        TIME,
    sleep_end          TIME,
    sleep_hours        NUMERIC(4,2),
    -- Reset counter (masturbation / urge tracker)
    masturbation_count INTEGER DEFAULT 0,
    masturbation_times JSONB DEFAULT '[]',
    rc_count           INTEGER DEFAULT 0,
    rc_entries         JSONB DEFAULT '[]',
    -- Activity
    gym_done           BOOLEAN DEFAULT false,
    gym_duration       INTEGER,
    breakfast_done     BOOLEAN DEFAULT false,
    steps              INTEGER DEFAULT 0,
    protein_grams      INTEGER DEFAULT 0,  -- kept for historical data, UI now uses water_bottles
    water_bottles      SMALLINT DEFAULT 0,
    -- Learning & journal
    learning_done      BOOLEAN DEFAULT false,
    learning_topic     TEXT,
    journal_entry      TEXT,
    -- Mood: 1-10 scale, saved by DailyLogForm
    mood               SMALLINT CHECK (mood BETWEEN 1 AND 10),
    -- Session-level mood: 1-5 scale from PomodoroTimer / sessions
    mood_before        SMALLINT CHECK (mood_before BETWEEN 1 AND 5),
    mood_after         SMALLINT CHECK (mood_after  BETWEEN 1 AND 5),
    energy_level       SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
    distraction_src    TEXT,
    playlist_used      TEXT,
    -- Metadata
    source_type        TEXT DEFAULT 'user'
                           CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar')),
    deleted_at         TIMESTAMPTZ,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own daily_logs" ON public.daily_logs;
DROP POLICY IF EXISTS "daily_logs_own"                  ON public.daily_logs;
CREATE POLICY "daily_logs_own" ON public.daily_logs
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON public.daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_active  ON public.daily_logs(user_id, date DESC)
    WHERE deleted_at IS NULL;
REVOKE ALL ON public.daily_logs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_logs TO authenticated;
GRANT ALL ON public.daily_logs TO service_role;


CREATE TABLE IF NOT EXISTS public.sleep_quality_tags (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    daily_log_id UUID REFERENCES public.daily_logs(id) ON DELETE CASCADE,
    tags         JSONB DEFAULT '[]',
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.sleep_quality_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own sleep_quality_tags" ON public.sleep_quality_tags;
DROP POLICY IF EXISTS "sleep_quality_tags_own"                  ON public.sleep_quality_tags;
CREATE POLICY "sleep_quality_tags_own" ON public.sleep_quality_tags
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.daily_logs
        WHERE daily_logs.id = sleep_quality_tags.daily_log_id
          AND daily_logs.user_id = (SELECT auth.uid())
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.daily_logs
        WHERE daily_logs.id = sleep_quality_tags.daily_log_id
          AND daily_logs.user_id = (SELECT auth.uid())
    ));
CREATE INDEX IF NOT EXISTS idx_sleep_quality_tags_log ON public.sleep_quality_tags(daily_log_id);
REVOKE ALL ON public.sleep_quality_tags FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sleep_quality_tags TO authenticated;
GRANT ALL ON public.sleep_quality_tags TO service_role;


-- ============================================================
-- SECTION 4: GOALS & FOCUS SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.goals (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
    metric     TEXT NOT NULL,
    target     NUMERIC NOT NULL,
    frequency  TEXT NOT NULL,
    start_date DATE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own goals" ON public.goals;
DROP POLICY IF EXISTS "goals_own"                  ON public.goals;
CREATE POLICY "goals_own" ON public.goals
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
REVOKE ALL ON public.goals FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;


CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date                DATE NOT NULL,
    cycles_completed    INTEGER DEFAULT 0,
    total_focus_minutes INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own pomodoro_sessions" ON public.pomodoro_sessions;
DROP POLICY IF EXISTS "pomodoro_sessions_own"                  ON public.pomodoro_sessions;
CREATE POLICY "pomodoro_sessions_own" ON public.pomodoro_sessions
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON public.pomodoro_sessions(user_id);
REVOKE ALL ON public.pomodoro_sessions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pomodoro_sessions TO authenticated;
GRANT ALL ON public.pomodoro_sessions TO service_role;


-- Deep-work sessions (used by SessionStats component)
CREATE TABLE IF NOT EXISTS public.sessions (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id          UUID REFERENCES public.users(id) ON DELETE CASCADE,
    started_at       TIMESTAMPTZ NOT NULL,
    ended_at         TIMESTAMPTZ,
    duration_minutes INTEGER,
    session_type     TEXT DEFAULT 'focus',
    mood_before      SMALLINT CHECK (mood_before BETWEEN 1 AND 5),
    mood_after       SMALLINT CHECK (mood_after  BETWEEN 1 AND 5),
    energy_level     SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
    distraction_src  TEXT,
    playlist_used    TEXT,
    notes            TEXT,
    source_type      TEXT DEFAULT 'user'
                         CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar')),
    deleted_at       TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own sessions" ON public.sessions;
DROP POLICY IF EXISTS "sessions_own"                  ON public.sessions;
CREATE POLICY "sessions_own" ON public.sessions
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_started
    ON public.sessions(user_id, started_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user_date
    ON public.sessions(user_id, CAST(started_at AT TIME ZONE 'UTC' AS DATE));
REVOKE ALL ON public.sessions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;


-- ============================================================
-- SECTION 5: CALENDAR & NOTES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.calendar_events (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE,
    google_event_id TEXT,
    title           TEXT,
    start_time      TIMESTAMPTZ,
    end_time        TIMESTAMPTZ,
    completed       BOOLEAN DEFAULT false,
    synced_to_log   BOOLEAN DEFAULT false,
    all_day         BOOLEAN DEFAULT false,
    event_type      TEXT DEFAULT 'personal',
    timezone        TEXT,
    source_type     TEXT DEFAULT 'user'
                        CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar')),
    deleted_at      TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own calendar_events" ON public.calendar_events;
DROP POLICY IF EXISTS "calendar_events_own"                  ON public.calendar_events;
CREATE POLICY "calendar_events_own" ON public.calendar_events
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id
    ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date
    ON public.calendar_events(user_id, start_time DESC) WHERE deleted_at IS NULL;
REVOKE ALL ON public.calendar_events FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT ALL ON public.calendar_events TO service_role;


-- DSA problem tracking
CREATE TABLE IF NOT EXISTS public.dsa_problems (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    platform     TEXT DEFAULT 'leetcode'
                     CHECK (platform IN ('leetcode', 'codeforces', 'gfg', 'codechef', 'hackerrank', 'other')),
    difficulty   TEXT DEFAULT 'medium'
                     CHECK (difficulty IN ('easy', 'medium', 'hard')),
    topic        TEXT,
    solved_at    TIMESTAMPTZ DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dsa_problems_own" ON public.dsa_problems;
CREATE POLICY "dsa_problems_own" ON public.dsa_problems
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_dsa_problems_user_id
    ON public.dsa_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_dsa_problems_user_date
    ON public.dsa_problems(user_id, solved_at DESC) WHERE deleted_at IS NULL;
REVOKE ALL ON public.dsa_problems FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dsa_problems TO authenticated;
GRANT ALL ON public.dsa_problems TO service_role;


-- notes: references auth.users directly (no public.users FK — safe for early load)
CREATE TABLE IF NOT EXISTS public.notes (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title             TEXT,
    content           TEXT NOT NULL,
    type              TEXT DEFAULT 'note' CHECK (type IN ('note', 'reminder')),
    reminder_time     TIMESTAMPTZ,
    linked_session_id UUID,
    linked_event_id   TEXT,
    completed         BOOLEAN DEFAULT false,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own notes" ON public.notes;
DROP POLICY IF EXISTS "notes_own"       ON public.notes;
CREATE POLICY "notes_own" ON public.notes
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_reminder_time
    ON public.notes(user_id, reminder_time)
    WHERE type = 'reminder' AND completed = false;
REVOKE ALL ON public.notes FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;


-- ============================================================
-- SECTION 6: WINS & COMMITMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.wins (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    description TEXT NOT NULL,
    source_type TEXT DEFAULT 'user'
                    CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar')),
    deleted_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.wins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own wins" ON public.wins;
DROP POLICY IF EXISTS "wins_own"                  ON public.wins;
CREATE POLICY "wins_own" ON public.wins
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_wins_user_id ON public.wins(user_id);
REVOKE ALL ON public.wins FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wins TO authenticated;
GRANT ALL ON public.wins TO service_role;


CREATE TABLE IF NOT EXISTS public.daily_commitments (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    targets         JSONB NOT NULL DEFAULT '[]',
    met_count       INTEGER DEFAULT 0,
    total_count     INTEGER DEFAULT 0,
    fulfillment_pct NUMERIC(5,2) DEFAULT 0,
    evaluated_at    TIMESTAMPTZ,
    source_type     TEXT DEFAULT 'user'
                        CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);
ALTER TABLE public.daily_commitments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own daily_commitments" ON public.daily_commitments;
DROP POLICY IF EXISTS "daily_commitments_own"                  ON public.daily_commitments;
CREATE POLICY "daily_commitments_own" ON public.daily_commitments
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_daily_commitments_user_date
    ON public.daily_commitments(user_id, date DESC);
REVOKE ALL ON public.daily_commitments FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_commitments TO authenticated;
GRANT ALL ON public.daily_commitments TO service_role;


CREATE TABLE IF NOT EXISTS public.weekly_summaries (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id                 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    week_start              DATE NOT NULL,
    data                    JSONB NOT NULL DEFAULT '{}',
    insight_version         INTEGER DEFAULT 1,
    behavior_engine_version INTEGER DEFAULT 1,
    generated_at            TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);
ALTER TABLE public.weekly_summaries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own weekly_summaries" ON public.weekly_summaries;
DROP POLICY IF EXISTS "weekly_summaries_own"                  ON public.weekly_summaries;
CREATE POLICY "weekly_summaries_own" ON public.weekly_summaries
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_week
    ON public.weekly_summaries(user_id, week_start DESC);
REVOKE ALL ON public.weekly_summaries FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_summaries TO authenticated;
GRANT ALL ON public.weekly_summaries TO service_role;


-- ============================================================
-- SECTION 7: MONEY SYSTEM
-- ============================================================

-- money_categories: system rows have user_id = NULL (shared with all users)
CREATE TABLE IF NOT EXISTS public.money_categories (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    color      TEXT,
    icon       TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default categories matching MoneyManager.jsx EXPENSE_CATS (idempotent)
INSERT INTO public.money_categories (user_id, name, color, icon)
SELECT NULL, v.name, v.color, v.icon
FROM (VALUES
    ('Food & Dining',  '#ff6b35', '🍛'),
    ('Transport',      '#3b82f6', '🚗'),
    ('Shopping',       '#a855f7', '🛍️'),
    ('Utilities',      '#f59e0b', '🏠'),
    ('Health',         '#10b981', '💊'),
    ('Entertainment',  '#ec4899', '🎬'),
    ('Other',          '#6b7280', '📦')
) AS v(name, color, icon)
WHERE NOT EXISTS (
    SELECT 1 FROM public.money_categories mc
    WHERE mc.user_id IS NULL AND mc.name = v.name
);

ALTER TABLE public.money_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_money_categories" ON public.money_categories;
DROP POLICY IF EXISTS "money_categories_access"           ON public.money_categories;
CREATE POLICY "money_categories_access" ON public.money_categories
    FOR ALL TO authenticated
    USING (user_id IS NULL OR (SELECT auth.uid()) = user_id);
REVOKE ALL ON public.money_categories FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.money_categories TO authenticated;
GRANT ALL ON public.money_categories TO service_role;


CREATE TABLE IF NOT EXISTS public.money_transactions (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    category    TEXT,
    category_id UUID REFERENCES public.money_categories(id),
    description TEXT,
    amount      NUMERIC(10,2),
    currency    TEXT DEFAULT 'INR',
    source      TEXT DEFAULT 'manual',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.money_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own money_transactions"  ON public.money_transactions;
DROP POLICY IF EXISTS "users_can_access_own_transactions"        ON public.money_transactions;
DROP POLICY IF EXISTS "money_transactions_own"                   ON public.money_transactions;
CREATE POLICY "money_transactions_own" ON public.money_transactions
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_money_transactions_user_id
    ON public.money_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_money_transactions_user_date
    ON public.money_transactions(user_id, date DESC);
REVOKE ALL ON public.money_transactions FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.money_transactions TO authenticated;
GRANT ALL ON public.money_transactions TO service_role;


CREATE TABLE IF NOT EXISTS public.recurring (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id       UUID REFERENCES public.users(id)          ON DELETE CASCADE,
    name          TEXT NOT NULL,
    amount        NUMERIC(10,2) NOT NULL,
    category_id   UUID REFERENCES public.money_categories(id),
    frequency     TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    next_due_date DATE NOT NULL,
    active        BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.recurring ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_recurring" ON public.recurring;
DROP POLICY IF EXISTS "recurring_own"                  ON public.recurring;
CREATE POLICY "recurring_own" ON public.recurring
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_user_due
    ON public.recurring(user_id, next_due_date) WHERE active = true;
REVOKE ALL ON public.recurring FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recurring TO authenticated;
GRANT ALL ON public.recurring TO service_role;


CREATE TABLE IF NOT EXISTS public.budgets (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES public.users(id)          ON DELETE CASCADE,
    category_id UUID REFERENCES public.money_categories(id),
    amount      NUMERIC(10,2) NOT NULL,
    period      TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly')),
    start_date  DATE NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_budgets" ON public.budgets;
DROP POLICY IF EXISTS "budgets_own"                  ON public.budgets;
CREATE POLICY "budgets_own" ON public.budgets
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_period
    ON public.budgets(user_id, period, start_date);
REVOKE ALL ON public.budgets FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO authenticated;
GRANT ALL ON public.budgets TO service_role;


CREATE TABLE IF NOT EXISTS public.savings_goals (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name           TEXT NOT NULL,
    target_amount  NUMERIC(10,2) NOT NULL,
    current_amount NUMERIC(10,2) DEFAULT 0,
    deadline       DATE,
    status         TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_savings_goals" ON public.savings_goals;
DROP POLICY IF EXISTS "savings_goals_own"                  ON public.savings_goals;
CREATE POLICY "savings_goals_own" ON public.savings_goals
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON public.savings_goals(user_id);
REVOKE ALL ON public.savings_goals FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.savings_goals TO authenticated;
GRANT ALL ON public.savings_goals TO service_role;


-- ============================================================
-- SECTION 8: HABITS & ROUTINES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.habits (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    emoji      TEXT DEFAULT '🎯',
    category   TEXT,
    frequency  TEXT DEFAULT 'daily',
    status     TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_habits" ON public.habits;
DROP POLICY IF EXISTS "habits_own"                  ON public.habits;
CREATE POLICY "habits_own" ON public.habits
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_status ON public.habits(user_id, status);
REVOKE ALL ON public.habits FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;
GRANT ALL ON public.habits TO service_role;


CREATE TABLE IF NOT EXISTS public.routines (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    time_of_day TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_routines" ON public.routines;
DROP POLICY IF EXISTS "routines_own"                  ON public.routines;
CREATE POLICY "routines_own" ON public.routines
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON public.routines(user_id);
REVOKE ALL ON public.routines FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routines TO authenticated;
GRANT ALL ON public.routines TO service_role;


CREATE TABLE IF NOT EXISTS public.routine_habits (
    routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
    habit_id   UUID REFERENCES public.habits(id)   ON DELETE CASCADE,
    position   INTEGER DEFAULT 0,
    PRIMARY KEY (routine_id, habit_id)
);
ALTER TABLE public.routine_habits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_routine_habits" ON public.routine_habits;
DROP POLICY IF EXISTS "routine_habits_own"                  ON public.routine_habits;
CREATE POLICY "routine_habits_own" ON public.routine_habits
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.routines r
            WHERE r.id = routine_habits.routine_id
              AND r.user_id = (SELECT auth.uid())
        )
    );
CREATE INDEX IF NOT EXISTS idx_routine_habits_routine ON public.routine_habits(routine_id, position);
REVOKE ALL ON public.routine_habits FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routine_habits TO authenticated;
GRANT ALL ON public.routine_habits TO service_role;


CREATE TABLE IF NOT EXISTS public.habit_logs (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id     UUID REFERENCES public.habits(id)  ON DELETE CASCADE,
    user_id      UUID REFERENCES public.users(id)   ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    status       TEXT DEFAULT 'done' CHECK (status IN ('done', 'skipped')),
    session      TEXT,
    notes        TEXT
);
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_habit_logs" ON public.habit_logs;
DROP POLICY IF EXISTS "habit_logs_own"                  ON public.habit_logs;
CREATE POLICY "habit_logs_own" ON public.habit_logs
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date
    ON public.habit_logs(user_id, completed_at DESC);
REVOKE ALL ON public.habit_logs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habit_logs TO authenticated;
GRANT ALL ON public.habit_logs TO service_role;


CREATE TABLE IF NOT EXISTS public.routine_runs (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    routine_id   UUID REFERENCES public.routines(id) ON DELETE CASCADE,
    user_id      UUID REFERENCES public.users(id)    ON DELETE CASCADE,
    started_at   TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    completed    BOOLEAN DEFAULT false
);
ALTER TABLE public.routine_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_can_access_own_routine_runs" ON public.routine_runs;
DROP POLICY IF EXISTS "routine_runs_own"                  ON public.routine_runs;
CREATE POLICY "routine_runs_own" ON public.routine_runs
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_routine_runs_user_date
    ON public.routine_runs(user_id, started_at DESC);
REVOKE ALL ON public.routine_runs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routine_runs TO authenticated;
GRANT ALL ON public.routine_runs TO service_role;


-- ============================================================
-- SECTION 9: AUTH / OAUTH
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_oauth_tokens (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id           UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider          TEXT NOT NULL,
    access_token      TEXT NOT NULL,
    access_token_enc  TEXT,
    refresh_token     TEXT,
    refresh_token_enc TEXT,
    expiry_date       BIGINT,
    scope             TEXT,
    last_refresh_at   TIMESTAMPTZ,
    refresh_error     TEXT,
    provider_split    TEXT DEFAULT 'google',
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);
ALTER TABLE public.user_oauth_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own user_oauth_tokens" ON public.user_oauth_tokens;
DROP POLICY IF EXISTS "oauth_tokens_own"                       ON public.user_oauth_tokens;
CREATE POLICY "oauth_tokens_own" ON public.user_oauth_tokens
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_user_oauth_tokens_user_id ON public.user_oauth_tokens(user_id);
REVOKE ALL ON public.user_oauth_tokens FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_oauth_tokens TO authenticated;
GRANT ALL ON public.user_oauth_tokens TO service_role;


-- oauth_states: short-lived PKCE states, service_role only
CREATE TABLE IF NOT EXISTS public.oauth_states (
    state      TEXT PRIMARY KEY,
    user_id    UUID,
    is_login   BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires ON public.oauth_states(expires_at);
REVOKE ALL ON public.oauth_states FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.oauth_states TO service_role;


CREATE TABLE IF NOT EXISTS public.oauth_audit_log (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider   TEXT NOT NULL,
    event      TEXT NOT NULL,
    detail     JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.oauth_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can select own oauth audit" ON public.oauth_audit_log;
DROP POLICY IF EXISTS "oauth_audit_select_own"           ON public.oauth_audit_log;
CREATE POLICY "oauth_audit_select_own" ON public.oauth_audit_log
    FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_audit_user
    ON public.oauth_audit_log(user_id, created_at DESC);
REVOKE ALL ON public.oauth_audit_log FROM PUBLIC;
GRANT SELECT ON public.oauth_audit_log TO authenticated;
GRANT ALL ON public.oauth_audit_log TO service_role;


-- ============================================================
-- SECTION 10: NOTIFICATIONS & ANALYTICS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type         TEXT NOT NULL,
    title        TEXT NOT NULL,
    body         TEXT,
    action_url   TEXT,
    read_at      TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_own"                  ON public.notifications;
CREATE POLICY "notifications_own" ON public.notifications
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON public.notifications(user_id, read_at, dismissed_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_drift_dedup
    ON public.notifications(user_id, type, title)
    WHERE type = 'drift_alert' AND dismissed_at IS NULL;
REVOKE ALL ON public.notifications FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;


CREATE TABLE IF NOT EXISTS public.internal_metrics (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    value       NUMERIC,
    meta        JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.internal_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own internal_metrics" ON public.internal_metrics;
DROP POLICY IF EXISTS "internal_metrics_own"                  ON public.internal_metrics;
CREATE POLICY "internal_metrics_own" ON public.internal_metrics
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_internal_metrics_user_name
    ON public.internal_metrics(user_id, metric_name, recorded_at DESC);
REVOKE ALL ON public.internal_metrics FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internal_metrics TO authenticated;
GRANT ALL ON public.internal_metrics TO service_role;


CREATE TABLE IF NOT EXISTS public.momentum_history (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id                 UUID REFERENCES public.users(id) ON DELETE CASCADE,
    score                   NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
    behavior_engine_version INTEGER DEFAULT 1,
    calculated_at           TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.momentum_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access own momentum_history" ON public.momentum_history;
DROP POLICY IF EXISTS "momentum_history_own"                  ON public.momentum_history;
CREATE POLICY "momentum_history_own" ON public.momentum_history
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_momentum_history_user_date
    ON public.momentum_history(user_id, calculated_at DESC);
REVOKE ALL ON public.momentum_history FROM PUBLIC;
GRANT ALL ON public.momentum_history TO authenticated;
GRANT ALL ON public.momentum_history TO service_role;


-- ============================================================
-- SECTION 11: ADMIN & SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_action_log (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id  UUID REFERENCES public.users(id),
    action_type    TEXT NOT NULL,
    target_user_id UUID REFERENCES public.users(id),
    payload        JSONB DEFAULT '{}',
    timestamp      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all logs"    ON public.admin_action_log;
DROP POLICY IF EXISTS "admin_action_log_superadmin" ON public.admin_action_log;
CREATE POLICY "admin_action_log_superadmin" ON public.admin_action_log
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = (SELECT auth.uid()) AND role = 'super_admin'
        )
    );
REVOKE ALL ON public.admin_action_log FROM PUBLIC;
GRANT SELECT, INSERT ON public.admin_action_log TO authenticated;
GRANT ALL ON public.admin_action_log TO service_role;


-- api_errors: backend error log, service_role only
CREATE TABLE IF NOT EXISTS public.api_errors (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    correlation_id TEXT,
    route          TEXT,
    method         TEXT,
    message        TEXT,
    stack          TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);
REVOKE ALL ON public.api_errors FROM PUBLIC;
GRANT INSERT, SELECT ON public.api_errors TO service_role;


-- ============================================================
-- SECTION 12: SCHEMA UPGRADE GUARDS
-- Safe to run on any existing database. A fresh install does
-- not need these — all columns are in the CREATE TABLE blocks.
-- These bring older Supabase projects to full parity.
-- MUST run before views so columns like mood, deleted_at exist.
-- ============================================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name        TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS timezone         TEXT DEFAULT 'Asia/Kolkata';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url       TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role             TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username         TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarding_stage INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sleep_need_hours NUMERIC(4,2) DEFAULT 8.0;

ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS rc_count        INTEGER DEFAULT 0;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS rc_entries      JSONB DEFAULT '[]';
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS mood               SMALLINT CHECK (mood BETWEEN 1 AND 10);
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS mood_before        SMALLINT;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS mood_after         SMALLINT;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS energy_level       SMALLINT;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS distraction_src    TEXT;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS playlist_used      TEXT;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS source_type        TEXT DEFAULT 'user';
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS deleted_at         TIMESTAMPTZ;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS focus_score        INTEGER DEFAULT 0;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS routines_completed INTEGER DEFAULT 0;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS habits_completed   INTEGER DEFAULT 0;
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS water_bottles      SMALLINT DEFAULT 0;

ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS timezone    TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS all_day     BOOLEAN DEFAULT false;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS event_type  TEXT DEFAULT 'personal';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user';

ALTER TABLE public.wins ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user';
ALTER TABLE public.wins ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ;

ALTER TABLE public.daily_commitments ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user';

ALTER TABLE public.weekly_summaries ADD COLUMN IF NOT EXISTS insight_version         INTEGER DEFAULT 1;
ALTER TABLE public.weekly_summaries ADD COLUMN IF NOT EXISTS behavior_engine_version INTEGER DEFAULT 1;

ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user';

ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS access_token_enc  TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS refresh_token_enc TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS scope             TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS last_refresh_at   TIMESTAMPTZ;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS refresh_error     TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS provider_split    TEXT DEFAULT 'google';

ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS category_id        UUID REFERENCES public.money_categories(id);
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS description        TEXT;
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS currency           TEXT DEFAULT 'INR';
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS behavior_snapshot  JSONB;

-- GIN index for behavioral snapshot queries
CREATE INDEX IF NOT EXISTS idx_transactions_behavior_snapshot
    ON public.money_transactions USING GIN (behavior_snapshot);

ALTER TABLE public.savings_goals ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '🎯';


-- ============================================================
-- SECTION 13: EXTENDED FINANCIAL SYSTEM
-- ============================================================

-- accounts: bank accounts, wallets, credit cards
CREATE TABLE IF NOT EXISTS public.accounts (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('bank', 'wallet', 'credit_card', 'cash', 'investment')),
    currency    TEXT DEFAULT 'INR',
    balance     NUMERIC(12,2) DEFAULT 0,
    icon        TEXT DEFAULT '🏦',
    color       TEXT DEFAULT '#6b7280',
    is_default  BOOLEAN DEFAULT false,
    archived    BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "accounts_own" ON public.accounts;
CREATE POLICY "accounts_own" ON public.accounts
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.accounts(user_id) WHERE archived = false;
REVOKE ALL ON public.accounts FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounts TO authenticated;
GRANT ALL ON public.accounts TO service_role;

-- Extend money_categories with hierarchy
ALTER TABLE public.money_categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.money_categories(id);
ALTER TABLE public.money_categories ADD COLUMN IF NOT EXISTS type      TEXT DEFAULT 'expense' CHECK (type IN ('income', 'expense', 'transfer'));

-- Extend money_transactions with account & transfer pairing
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS account_id       UUID REFERENCES public.accounts(id);
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS type             TEXT DEFAULT 'expense' CHECK (type IN ('income', 'expense', 'transfer_out', 'transfer_in', 'lend', 'repayment'));
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS transfer_pair_id UUID REFERENCES public.money_transactions(id);
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS is_recurring     BOOLEAN DEFAULT false;
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS recurring_id     UUID REFERENCES public.recurring(id);
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS tags             JSONB DEFAULT '[]';
ALTER TABLE public.money_transactions ADD COLUMN IF NOT EXISTS time_of_day      TEXT;

CREATE INDEX IF NOT EXISTS idx_money_tx_account  ON public.money_transactions(account_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_money_tx_type     ON public.money_transactions(user_id, type, date DESC);
CREATE INDEX IF NOT EXISTS idx_money_tx_transfer ON public.money_transactions(transfer_pair_id) WHERE transfer_pair_id IS NOT NULL;

-- money_lent: track money lent / borrowed
CREATE TABLE IF NOT EXISTS public.money_lent (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID REFERENCES public.users(id)     ON DELETE CASCADE,
    person_name  TEXT NOT NULL,
    amount       NUMERIC(10,2) NOT NULL,
    direction    TEXT NOT NULL CHECK (direction IN ('lent', 'borrowed')),
    reason       TEXT,
    date_given   DATE NOT NULL DEFAULT CURRENT_DATE,
    date_due     DATE,
    date_settled DATE,
    status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'settled')),
    account_id   UUID REFERENCES public.accounts(id),
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.money_lent ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "money_lent_own" ON public.money_lent;
CREATE POLICY "money_lent_own" ON public.money_lent
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_money_lent_user ON public.money_lent(user_id, status);
REVOKE ALL ON public.money_lent FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.money_lent TO authenticated;
GRANT ALL ON public.money_lent TO service_role;

-- financial_goals: targeted savings with behavioral tie-ins
CREATE TABLE IF NOT EXISTS public.financial_goals (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name           TEXT NOT NULL,
    target_amount  NUMERIC(12,2) NOT NULL,
    current_amount NUMERIC(12,2) DEFAULT 0,
    deadline       DATE,
    priority       TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status         TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    icon           TEXT DEFAULT '🎯',
    created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "financial_goals_own" ON public.financial_goals;
CREATE POLICY "financial_goals_own" ON public.financial_goals
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
REVOKE ALL ON public.financial_goals FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_goals TO authenticated;
GRANT ALL ON public.financial_goals TO service_role;

-- Extend recurring with account
ALTER TABLE public.recurring ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id);
ALTER TABLE public.recurring ADD COLUMN IF NOT EXISTS type       TEXT DEFAULT 'expense' CHECK (type IN ('income', 'expense'));

-- Extend budgets with alert threshold
ALTER TABLE public.budgets ADD COLUMN IF NOT EXISTS alert_threshold NUMERIC(5,2) DEFAULT 80;
ALTER TABLE public.budgets ADD COLUMN IF NOT EXISTS alert_sent      BOOLEAN DEFAULT false;


-- ============================================================
-- SECTION 14: VIEWS
-- Views are created AFTER all upgrade guards and table
-- extensions so every referenced column is guaranteed to exist.
-- ============================================================

DROP VIEW IF EXISTS public.recent_notifications CASCADE;
CREATE OR REPLACE VIEW public.recent_notifications AS
    SELECT user_id, type, title, MAX(created_at) AS last_at
    FROM public.notifications
    WHERE dismissed_at IS NULL
    GROUP BY user_id, type, title;


DROP VIEW IF EXISTS public.behavioral_daily_summary CASCADE;
DROP VIEW IF EXISTS public.user_daily_metrics CASCADE;

-- Fixed view: removed non-existent columns (focus_score, routines_completed, habits_completed)
-- These columns were never added to daily_logs table
CREATE OR REPLACE VIEW public.user_daily_metrics AS
    SELECT
        dl.user_id,
        dl.date,
        dl.mood,
        dl.energy_level,
        dl.sleep_hours,
        dl.gym_done,
        dl.breakfast_done,
        dl.steps,
        dl.water_bottles,
        dl.learning_done,
        (dl.journal_entry IS NOT NULL AND dl.journal_entry != '') AS journal_logged,
        COUNT(DISTINCT hl.id) AS habits_logged
    FROM public.daily_logs dl
    LEFT JOIN public.habit_logs hl
           ON hl.user_id = dl.user_id
          AND DATE(hl.completed_at AT TIME ZONE 'Asia/Kolkata') = dl.date
    WHERE dl.deleted_at IS NULL
    GROUP BY
        dl.user_id,
        dl.date,
        dl.mood,
        dl.energy_level,
        dl.sleep_hours,
        dl.gym_done,
        dl.breakfast_done,
        dl.steps,
        dl.water_bottles,
        dl.learning_done,
        dl.journal_entry;


CREATE OR REPLACE VIEW public.behavioral_daily_summary AS
    SELECT
        user_id,
        date,
        mood,
        energy_level,
        sleep_hours,
        gym_done,
        learning_done,
        journal_logged,
        habits_logged,
        -- Simple behavioral score based on actual metrics
        (
            CASE WHEN mood >= 7 THEN 1 ELSE 0 END +
            CASE WHEN energy_level >= 3 THEN 1 ELSE 0 END +
            CASE WHEN sleep_hours >= 7 THEN 1 ELSE 0 END +
            CASE WHEN gym_done THEN 1 ELSE 0 END +
            CASE WHEN learning_done THEN 1 ELSE 0 END +
            CASE WHEN journal_logged THEN 1 ELSE 0 END +
            CASE WHEN habits_logged > 0 THEN 1 ELSE 0 END
        ) AS behavioral_score
    FROM public.user_daily_metrics;



-- ============================================================
-- SECTION 15: GAMIFICATION (XP, Achievements, Brain Fog)
-- ============================================================

-- 15a. User XP state (one row per user)
CREATE TABLE IF NOT EXISTS public.user_xp (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id          UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    total_xp         INTEGER DEFAULT 0,
    current_rank     INTEGER DEFAULT 1 CHECK (current_rank BETWEEN 1 AND 10),
    power_level      INTEGER DEFAULT 0,
    longest_streak   INTEGER DEFAULT 0,
    clean_streak     INTEGER DEFAULT 0,
    last_xp_date     DATE,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_xp_own" ON public.user_xp;
CREATE POLICY "user_xp_own" ON public.user_xp
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_user ON public.user_xp(user_id);
REVOKE ALL ON public.user_xp FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_xp TO authenticated;
GRANT ALL ON public.user_xp TO service_role;

-- 15b. Daily XP log (history + charts)
CREATE TABLE IF NOT EXISTS public.xp_log (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date         DATE NOT NULL,
    xp_earned    INTEGER NOT NULL,
    breakdown    JSONB,
    multiplier   NUMERIC(4,2) DEFAULT 1.0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "xp_log_own" ON public.xp_log;
CREATE POLICY "xp_log_own" ON public.xp_log
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user_date ON public.xp_log(user_id, date DESC);
REVOKE ALL ON public.xp_log FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.xp_log TO authenticated;
GRANT ALL ON public.xp_log TO service_role;

-- 15c. Achievements (unlocked badges)
CREATE TABLE IF NOT EXISTS public.achievements (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    xp_granted     INTEGER DEFAULT 0,
    unlocked_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "achievements_own" ON public.achievements;
CREATE POLICY "achievements_own" ON public.achievements
    FOR ALL TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id);
REVOKE ALL ON public.achievements FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;

-- 15d. Add brain_fog and headache columns to daily_logs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_logs' AND column_name='brain_fog') THEN
        ALTER TABLE public.daily_logs ADD COLUMN brain_fog SMALLINT CHECK (brain_fog BETWEEN 1 AND 3);
        -- 1=foggy, 2=okay, 3=sharp
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_logs' AND column_name='headache') THEN
        ALTER TABLE public.daily_logs ADD COLUMN headache BOOLEAN DEFAULT false;
    END IF;
END $$;


-- ============================================================
-- SECTION 16: VERIFICATION QUERIES
-- Run these to confirm columns exist after schema execution.
-- ============================================================

-- Verify daily_logs columns
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'daily_logs';

-- Verify behavior_snapshot column on money_transactions
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'money_transactions'
  AND column_name = 'behavior_snapshot';
