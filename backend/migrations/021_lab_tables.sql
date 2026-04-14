-- ============================================================
-- Migration 021: The Lab — 12 New Tables
-- Section 17 of the AIIMIN schema
-- ============================================================

BEGIN;

-- 17.1 PRACTICE: typing tests
CREATE TABLE IF NOT EXISTS public.lab_typing_tests (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    wpm             SMALLINT NOT NULL CHECK (wpm BETWEEN 0 AND 300),
    accuracy_pct    NUMERIC(5,2) NOT NULL CHECK (accuracy_pct BETWEEN 0 AND 100),
    duration_sec    SMALLINT DEFAULT 60,
    test_invalid    BOOLEAN GENERATED ALWAYS AS (accuracy_pct < 95) STORED,
    taken_at        TIMESTAMPTZ DEFAULT NOW(),
    day_of          DATE GENERATED ALWAYS AS ((taken_at AT TIME ZONE 'Asia/Kolkata')::date) STORED
);
CREATE INDEX IF NOT EXISTS idx_typing_user_day ON public.lab_typing_tests(user_id, day_of DESC);
ALTER TABLE public.lab_typing_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_typing_own" ON public.lab_typing_tests;
CREATE POLICY "lab_typing_own" ON public.lab_typing_tests
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_typing_tests FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_typing_tests TO authenticated;
GRANT ALL ON public.lab_typing_tests TO service_role;


-- 17.2 PRACTICE: speaking logs
CREATE TABLE IF NOT EXISTS public.lab_speaking_logs (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    confidence_score    SMALLINT NOT NULL CHECK (confidence_score BETWEEN 1 AND 100),
    clarity_score       SMALLINT CHECK (clarity_score BETWEEN 1 AND 100),
    pace_score          SMALLINT CHECK (pace_score BETWEEN 1 AND 100),
    prompt_id           UUID,
    audio_url           TEXT,
    notes               TEXT,
    logged_at           TIMESTAMPTZ DEFAULT NOW(),
    day_of              DATE GENERATED ALWAYS AS ((logged_at AT TIME ZONE 'Asia/Kolkata')::date) STORED
);
CREATE INDEX IF NOT EXISTS idx_speaking_user_day ON public.lab_speaking_logs(user_id, day_of DESC);
ALTER TABLE public.lab_speaking_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_speaking_own" ON public.lab_speaking_logs;
CREATE POLICY "lab_speaking_own" ON public.lab_speaking_logs
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_speaking_logs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_speaking_logs TO authenticated;
GRANT ALL ON public.lab_speaking_logs TO service_role;


-- 17.3 PRACTICE: reaction tests
CREATE TABLE IF NOT EXISTS public.lab_reaction_tests (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    trial_ms        SMALLINT[] NOT NULL,
    mean_ms         SMALLINT NOT NULL CHECK (mean_ms BETWEEN 100 AND 1000),
    test_invalid    BOOLEAN DEFAULT false,
    taken_at        TIMESTAMPTZ DEFAULT NOW(),
    day_of          DATE GENERATED ALWAYS AS ((taken_at AT TIME ZONE 'Asia/Kolkata')::date) STORED
);
CREATE INDEX IF NOT EXISTS idx_reaction_user_day ON public.lab_reaction_tests(user_id, day_of DESC);
ALTER TABLE public.lab_reaction_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_reaction_own" ON public.lab_reaction_tests;
CREATE POLICY "lab_reaction_own" ON public.lab_reaction_tests
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_reaction_tests FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_reaction_tests TO authenticated;
GRANT ALL ON public.lab_reaction_tests TO service_role;


-- 17.4 PRACTICE: decision scenarios
CREATE TABLE IF NOT EXISTS public.lab_decision_scenarios (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    prompt_id       UUID,
    domain          TEXT NOT NULL CHECK (domain IN ('money','opportunity','women','identity','society','fear')),
    response_text   TEXT,
    quality_self    SMALLINT NOT NULL CHECK (quality_self BETWEEN 1 AND 5),
    responded_at    TIMESTAMPTZ DEFAULT NOW(),
    iso_week        SMALLINT GENERATED ALWAYS AS (EXTRACT(WEEK FROM responded_at AT TIME ZONE 'Asia/Kolkata')::int) STORED,
    iso_year        SMALLINT GENERATED ALWAYS AS (EXTRACT(ISOYEAR FROM responded_at AT TIME ZONE 'Asia/Kolkata')::int) STORED
);
CREATE INDEX IF NOT EXISTS idx_decisions_user_week ON public.lab_decision_scenarios(user_id, iso_year DESC, iso_week DESC);
ALTER TABLE public.lab_decision_scenarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_decisions_own" ON public.lab_decision_scenarios;
CREATE POLICY "lab_decisions_own" ON public.lab_decision_scenarios
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_decision_scenarios FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_decision_scenarios TO authenticated;
GRANT ALL ON public.lab_decision_scenarios TO service_role;


-- 17.5 INTEL: mindset logs
CREATE TABLE IF NOT EXISTS public.lab_mindset_logs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    state           TEXT NOT NULL CHECK (state IN ('clarity','scarcity','abundance','fear','growth','aimlessness','focus','noise')),
    note            TEXT,
    logged_at       TIMESTAMPTZ DEFAULT NOW(),
    day_of          DATE GENERATED ALWAYS AS ((logged_at AT TIME ZONE 'Asia/Kolkata')::date) STORED,
    UNIQUE(user_id, day_of)
);
CREATE INDEX IF NOT EXISTS idx_mindset_user_day ON public.lab_mindset_logs(user_id, day_of DESC);
ALTER TABLE public.lab_mindset_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_mindset_own" ON public.lab_mindset_logs;
CREATE POLICY "lab_mindset_own" ON public.lab_mindset_logs
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_mindset_logs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_mindset_logs TO authenticated;
GRANT ALL ON public.lab_mindset_logs TO service_role;


-- 17.6 AUDIT: beliefs
CREATE TABLE IF NOT EXISTS public.lab_beliefs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    domain          TEXT NOT NULL CHECK (domain IN ('money','opportunity','women','identity','society','fear')),
    prompt_id       UUID NOT NULL,
    response_text   TEXT NOT NULL,
    quarter_anchor  DATE NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, domain, quarter_anchor)
);
CREATE INDEX IF NOT EXISTS idx_beliefs_user_quarter ON public.lab_beliefs(user_id, quarter_anchor DESC);
ALTER TABLE public.lab_beliefs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_beliefs_own" ON public.lab_beliefs;
CREATE POLICY "lab_beliefs_own" ON public.lab_beliefs
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_beliefs FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_beliefs TO authenticated;
GRANT ALL ON public.lab_beliefs TO service_role;


-- 17.7 AUDIT: belief prompts (shared bank, read-only for users)
CREATE TABLE IF NOT EXISTS public.lab_belief_prompts (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain          TEXT NOT NULL CHECK (domain IN ('money','opportunity','women','identity','society','fear')),
    prompt_text     TEXT NOT NULL,
    sort_order      SMALLINT DEFAULT 0
);
ALTER TABLE public.lab_belief_prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_prompts_read_all" ON public.lab_belief_prompts;
CREATE POLICY "lab_prompts_read_all" ON public.lab_belief_prompts FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.lab_belief_prompts FROM PUBLIC;
GRANT SELECT ON public.lab_belief_prompts TO authenticated;
GRANT ALL ON public.lab_belief_prompts TO service_role;


-- 17.8 INTEL: correlations
CREATE TABLE IF NOT EXISTS public.lab_correlations (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    signal_a        TEXT NOT NULL,
    signal_b        TEXT NOT NULL,
    rho             NUMERIC(4,3) NOT NULL CHECK (rho BETWEEN -1 AND 1),
    p_value         NUMERIC(8,6),
    bh_passed       BOOLEAN DEFAULT false,
    n_samples       SMALLINT NOT NULL,
    window_days     SMALLINT DEFAULT 30,
    computed_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_correlations_user_recent ON public.lab_correlations(user_id, computed_at DESC);
ALTER TABLE public.lab_correlations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_correlations_own" ON public.lab_correlations;
CREATE POLICY "lab_correlations_own" ON public.lab_correlations
    FOR ALL TO authenticated USING (auth.uid() = user_id);
REVOKE ALL ON public.lab_correlations FROM PUBLIC;
GRANT SELECT ON public.lab_correlations TO authenticated;
GRANT ALL ON public.lab_correlations TO service_role;


-- 17.9 INTEL: insights
CREATE TABLE IF NOT EXISTS public.lab_insights (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    correlation_id  UUID REFERENCES public.lab_correlations(id) ON DELETE CASCADE,
    headline        TEXT NOT NULL,
    headline_ai     TEXT,
    effect_pct      SMALLINT,
    n_samples       SMALLINT NOT NULL,
    rho             NUMERIC(4,3) NOT NULL,
    severity        TEXT DEFAULT 'surface' CHECK (severity IN ('surface','flag')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_insights_user_recent ON public.lab_insights(user_id, created_at DESC);
ALTER TABLE public.lab_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_insights_own" ON public.lab_insights;
CREATE POLICY "lab_insights_own" ON public.lab_insights
    FOR ALL TO authenticated USING (auth.uid() = user_id);
REVOKE ALL ON public.lab_insights FROM PUBLIC;
GRANT SELECT ON public.lab_insights TO authenticated;
GRANT ALL ON public.lab_insights TO service_role;


-- 17.10 INTEL: read state
CREATE TABLE IF NOT EXISTS public.lab_insight_reads (
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    insight_id      UUID REFERENCES public.lab_insights(id) ON DELETE CASCADE NOT NULL,
    read_at         TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, insight_id)
);
ALTER TABLE public.lab_insight_reads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_insight_reads_own" ON public.lab_insight_reads;
CREATE POLICY "lab_insight_reads_own" ON public.lab_insight_reads
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_insight_reads FROM PUBLIC;
GRANT SELECT, INSERT, DELETE ON public.lab_insight_reads TO authenticated;
GRANT ALL ON public.lab_insight_reads TO service_role;


-- 17.11 PRACTICE: streaks
CREATE TABLE IF NOT EXISTS public.lab_streaks (
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    metric          TEXT NOT NULL CHECK (metric IN ('typing','speaking','reaction','decisions')),
    current_streak  SMALLINT DEFAULT 0,
    longest_streak  SMALLINT DEFAULT 0,
    last_logged_day DATE,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, metric)
);
ALTER TABLE public.lab_streaks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_streaks_own" ON public.lab_streaks;
CREATE POLICY "lab_streaks_own" ON public.lab_streaks
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
REVOKE ALL ON public.lab_streaks FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE ON public.lab_streaks TO authenticated;
GRANT ALL ON public.lab_streaks TO service_role;


-- 17.12 PRACTICE: mastery badges
CREATE TABLE IF NOT EXISTS public.lab_mastery_badges (
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    metric          TEXT NOT NULL CHECK (metric IN ('typing','speaking','reaction','decisions')),
    tier            TEXT NOT NULL CHECK (tier IN ('bronze','silver','gold','platinum')),
    granted_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, metric, tier)
);
ALTER TABLE public.lab_mastery_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_mastery_own" ON public.lab_mastery_badges;
CREATE POLICY "lab_mastery_own" ON public.lab_mastery_badges
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
REVOKE ALL ON public.lab_mastery_badges FROM PUBLIC;
GRANT SELECT ON public.lab_mastery_badges TO authenticated;
GRANT ALL ON public.lab_mastery_badges TO service_role;


COMMIT;
