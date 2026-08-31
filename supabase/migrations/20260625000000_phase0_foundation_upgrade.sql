-- ============================================================
-- AIIMIN — User Profile + Discipline + Journal Schema Upgrade
-- Date: 2026-06-25
-- Purpose: Foundation phase — multi-user personalization,
--          discipline DB sync, journal modes, interconnected core
-- ============================================================

-- ============================================================
-- SECTION 1: user_profiles — Multi-user Personalization Engine
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    persona_tags TEXT[] DEFAULT '{}',
    favorite_sports TEXT[] DEFAULT '{}',
    favorite_teams JSONB DEFAULT '{}',
    dashboard_modules TEXT[] DEFAULT '{}',
    ai_tone TEXT DEFAULT 'motivating',
    ai_features_enabled BOOLEAN DEFAULT true,
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_profiles_updated_at();


-- ============================================================
-- SECTION 2: discipline_streaks — Discipline DB Sync
-- ============================================================

CREATE TABLE IF NOT EXISTS public.discipline_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addiction_type TEXT NOT NULL DEFAULT '',
    replacement_habit TEXT,
    streak_days INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    total_resets INT DEFAULT 0,
    started_at TIMESTAMPTZ,
    last_reset_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.discipline_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_discipline_streaks" ON public.discipline_streaks
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 3: discipline_logs — Discipline Event Tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS public.discipline_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_id UUID REFERENCES public.discipline_streaks(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('reset', 'urge', 'milestone', 'reflection')),
    trigger_type TEXT CHECK (trigger_type IN ('stress', 'boredom', 'social_pressure', 'physical', 'other')),
    hal_check JSONB DEFAULT '{}',
    craving_intensity INT CHECK (craving_intensity BETWEEN 1 AND 5),
    time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.discipline_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_discipline_logs" ON public.discipline_logs
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 4: replacement_habits — Discipline Replacement Linker
-- ============================================================

CREATE TABLE IF NOT EXISTS public.replacement_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_name TEXT NOT NULL,
    linked_to_addiction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.replacement_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_replacement_habits" ON public.replacement_habits
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 5: journal_entries — Journal 5 Modes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL DEFAULT 'free_write' CHECK (mode IN ('free_write', 'cbt', 'www', 'morning', 'weekly')),
    content TEXT NOT NULL,
    mood INT CHECK (mood BETWEEN 1 AND 5),
    ai_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_journal_entries" ON public.journal_entries
    FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_journal_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_journal_entries_updated_at ON public.journal_entries;
CREATE TRIGGER trigger_journal_entries_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_journal_entries_updated_at();


-- ============================================================
-- SECTION 6: cbt_records — CBT Thought Records
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cbt_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    situation TEXT,
    automatic_thought TEXT,
    emotion_intensity INT CHECK (emotion_intensity BETWEEN 1 AND 10),
    evidence_for TEXT,
    evidence_against TEXT,
    balanced_thought TEXT,
    ai_grade TEXT CHECK (ai_grade IN ('excellent', 'good', 'needs_work')),
    journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cbt_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_cbt_records" ON public.cbt_records
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 7: www_entries — What Went Well
-- ============================================================

CREATE TABLE IF NOT EXISTS public.www_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    win_1 TEXT,
    win_1_why TEXT,
    win_2 TEXT,
    win_2_why TEXT,
    win_3 TEXT,
    win_3_why TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.www_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_www_entries" ON public.www_entries
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 8: habit_stacks — Habit Stacking
-- ============================================================

CREATE TABLE IF NOT EXISTS public.habit_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    habit_ids UUID[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habit_stacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_habit_stacks" ON public.habit_stacks
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 9: goals — Add linking columns
-- ============================================================

-- Add goal_id to habits for linking
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'habits' AND column_name = 'goal_id'
    ) THEN
        ALTER TABLE public.habits ADD COLUMN goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add session_intent, session_reflection, energy_after to pomodoro_sessions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'pomodoro_sessions' AND column_name = 'session_intent'
    ) THEN
        ALTER TABLE public.pomodoro_sessions ADD COLUMN session_intent TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'pomodoro_sessions' AND column_name = 'session_reflection'
    ) THEN
        ALTER TABLE public.pomodoro_sessions ADD COLUMN session_reflection TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'pomodoro_sessions' AND column_name = 'energy_after'
    ) THEN
        ALTER TABLE public.pomodoro_sessions ADD COLUMN energy_after INT CHECK (energy_after BETWEEN 1 AND 5);
    END IF;
END $$;


-- ============================================================
-- SECTION 10: money_transactions — Add emotion_tag
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'money_transactions' AND column_name = 'emotion_tag'
    ) THEN
        ALTER TABLE public.money_transactions ADD COLUMN emotion_tag TEXT CHECK (emotion_tag IN ('felt_good', 'necessary', 'regret'));
    END IF;
END $$;


-- ============================================================
-- SECTION 11: sports_favorites — Sports Personalization
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sports_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sport TEXT NOT NULL CHECK (sport IN ('cricket', 'football', 'f1', 'ipl', 'nba', 'tennis')),
    team_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    team_badge_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sports_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_sports_favorites" ON public.sports_favorites
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 12: financial_health_scores — Financial Health Score
-- ============================================================

CREATE TABLE IF NOT EXISTS public.financial_health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INT CHECK (score BETWEEN 0 AND 100),
    emergency_fund_pct DECIMAL(5,2),
    savings_rate DECIMAL(5,2),
    budget_adherence DECIMAL(5,2),
    debt_to_income DECIMAL(5,2),
    month_year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.financial_health_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_financial_health_scores" ON public.financial_health_scores
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 13: cognitive_benchmarks — Lab Cognitive Benchmark
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cognitive_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    n_back_score DECIMAL(5,2),
    digit_span_score DECIMAL(5,2),
    reaction_speed_ms INT,
    overall_score DECIMAL(5,2),
    test_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cognitive_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_cognitive_benchmarks" ON public.cognitive_benchmarks
    FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 14: Auto-create user_profile on new user signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_user_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_create_user_profile ON auth.users;
CREATE TRIGGER trigger_create_user_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_user_profile_on_signup();


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check all new tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN (
    'user_profiles', 'discipline_streaks', 'discipline_logs',
    'replacement_habits', 'journal_entries', 'cbt_records',
    'www_entries', 'habit_stacks', 'sports_favorites',
    'financial_health_scores', 'cognitive_benchmarks'
) ORDER BY table_name;

-- Check RLS is enabled on all new tables
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN (
    'user_profiles', 'discipline_streaks', 'discipline_logs',
    'replacement_habits', 'journal_entries', 'cbt_records',
    'www_entries', 'habit_stacks', 'sports_favorites',
    'financial_health_scores', 'cognitive_benchmarks'
) ORDER BY tablename;