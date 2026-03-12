-- ============================================================
-- Migration v4a: Habits & Routines System
-- Run in Supabase SQL editor
-- ============================================================

-- habits
CREATE TABLE IF NOT EXISTS habits (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    emoji       TEXT DEFAULT '🎯',
    category    TEXT,
    frequency   TEXT DEFAULT 'daily',
    status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Add emoji if upgrading from a prior version
ALTER TABLE habits ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '🎯';

-- routines
CREATE TABLE IF NOT EXISTS routines (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    time_of_day TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- routine_habits (junction table — no arrays, proper relational design)
-- position supports drag-drop ordering
CREATE TABLE IF NOT EXISTS routine_habits (
    routine_id  UUID REFERENCES routines(id) ON DELETE CASCADE,
    habit_id    UUID REFERENCES habits(id)   ON DELETE CASCADE,
    position    INTEGER DEFAULT 0,
    PRIMARY KEY (routine_id, habit_id)
);

-- habit_logs
CREATE TABLE IF NOT EXISTS habit_logs (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id     UUID REFERENCES habits(id)   ON DELETE CASCADE,
    user_id      UUID REFERENCES users(id)    ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    status       TEXT DEFAULT 'done' CHECK (status IN ('done', 'skipped')),
    session      TEXT,
    notes        TEXT
);

-- routine_runs — one record per execution of a routine
CREATE TABLE IF NOT EXISTS routine_runs (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    routine_id   UUID REFERENCES routines(id) ON DELETE CASCADE,
    user_id      UUID REFERENCES users(id)    ON DELETE CASCADE,
    started_at   TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    completed    BOOLEAN DEFAULT false
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE habits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines      ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_runs  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_can_access_own_habits"         ON habits;
DROP POLICY IF EXISTS "users_can_access_own_routines"       ON routines;
DROP POLICY IF EXISTS "users_can_access_own_routine_habits" ON routine_habits;
DROP POLICY IF EXISTS "users_can_access_own_habit_logs"     ON habit_logs;
DROP POLICY IF EXISTS "users_can_access_own_routine_runs"   ON routine_runs;

CREATE POLICY "users_can_access_own_habits"
    ON habits FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "users_can_access_own_routines"
    ON routines FOR ALL
    USING (auth.uid() = user_id);

-- routine_habits scoped through routine ownership (no direct user_id column)
CREATE POLICY "users_can_access_own_routine_habits"
    ON routine_habits FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM routines r
            WHERE r.id = routine_habits.routine_id
              AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "users_can_access_own_habit_logs"
    ON habit_logs FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "users_can_access_own_routine_runs"
    ON routine_runs FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================
-- Indexes for common query patterns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_habits_user_status
    ON habits (user_id, status);

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date
    ON habit_logs (user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_routine_runs_user_date
    ON routine_runs (user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_routine_habits_routine
    ON routine_habits (routine_id, position);

-- ============================================================
-- behavioral_daily_summary VIEW
-- Unified dataset for cross-feature analytics
-- Columns: date, user_id, focus_score, habit_completion, mood_score, spending_total
-- ============================================================

CREATE OR REPLACE VIEW behavioral_daily_summary AS
SELECT
    dl.date,
    dl.user_id,
    -- Reproduce MomentumBar scoring formula (mirrored from frontend calcScore)
    LEAST(100,
        COALESCE(CASE WHEN dl.sleep_hours >= 5           THEN 25 ELSE 0 END, 0) +
        COALESCE(CASE WHEN dl.gym_done                   THEN 20 ELSE 0 END, 0) +
        COALESCE(CASE WHEN dl.learning_done              THEN 15 ELSE 0 END, 0) +
        COALESCE(CASE WHEN dl.journal_entry IS NOT NULL
                           AND LENGTH(dl.journal_entry) > 5 THEN 10 ELSE 0 END, 0) +
        COALESCE(CASE WHEN dl.steps >= 5000              THEN 10 ELSE 0 END, 0) +
        COALESCE(CASE WHEN dl.mood IS NOT NULL           THEN 20 ELSE 0 END, 0)
    ) AS focus_score,

    -- Habit completion ratio for the day (done / total logged)
    COALESCE(
        (
            SELECT
                COUNT(*) FILTER (WHERE hl.status = 'done') * 1.0
                / NULLIF(COUNT(*), 0)
            FROM habit_logs hl
            WHERE hl.user_id = dl.user_id
              AND DATE(hl.completed_at AT TIME ZONE 'Asia/Kolkata') = dl.date
        ),
        0
    ) AS habit_completion,

    dl.mood         AS mood_score,

    -- Daily spend total
    COALESCE(
        (
            SELECT SUM(mt.amount)
            FROM money_transactions mt
            WHERE mt.user_id = dl.user_id
              AND mt.date = dl.date
        ),
        0
    ) AS spending_total

FROM daily_logs dl;
