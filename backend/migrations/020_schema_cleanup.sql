-- ============================================================
-- Migration 020: Schema Cleanup
-- Addresses audit items C-1 through C-4
-- Run as a single transaction in Supabase SQL editor.
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────
-- C-1: financial_goals absorbs savings_goals
-- ────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'savings_goals') THEN
    INSERT INTO public.financial_goals (
        id, user_id, name, target_amount, current_amount, deadline, status, created_at
    )
    SELECT id, user_id, name, target_amount, current_amount, deadline, status, created_at
    FROM public.savings_goals
    ON CONFLICT (id) DO NOTHING;

    DROP TABLE public.savings_goals CASCADE;
    RAISE NOTICE 'C-1: savings_goals migrated and dropped';
  ELSE
    RAISE NOTICE 'C-1: savings_goals already dropped, skipping';
  END IF;
END $$;


-- ────────────────────────────────────────────────────────
-- C-2: rc_* absorbs masturbation_*
-- ────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'daily_logs' AND column_name = 'masturbation_count'
  ) THEN
    UPDATE public.daily_logs
    SET rc_count = COALESCE(rc_count, 0) + COALESCE(masturbation_count, 0),
        rc_entries = COALESCE(rc_entries, '[]'::jsonb) || COALESCE(masturbation_times, '[]'::jsonb)
    WHERE masturbation_count IS NOT NULL OR masturbation_times IS NOT NULL;

    ALTER TABLE public.daily_logs DROP COLUMN masturbation_count;
    ALTER TABLE public.daily_logs DROP COLUMN masturbation_times;
    RAISE NOTICE 'C-2: masturbation_* columns migrated and dropped';
  ELSE
    RAISE NOTICE 'C-2: masturbation_* columns already dropped, skipping';
  END IF;
END $$;


-- ────────────────────────────────────────────────────────
-- C-3: pomodoro_sessions table → VIEW over sessions
-- ────────────────────────────────────────────────────────
DO $$
BEGIN
  -- Check if it's a table (not already a view)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pomodoro_sessions' AND table_type = 'BASE TABLE'
  ) THEN
    DROP TABLE public.pomodoro_sessions CASCADE;
    RAISE NOTICE 'C-3: pomodoro_sessions table dropped';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' AND table_name = 'pomodoro_sessions'
  ) THEN
    DROP VIEW public.pomodoro_sessions;
    RAISE NOTICE 'C-3: existing pomodoro_sessions view dropped for recreation';
  END IF;
END $$;

CREATE VIEW public.pomodoro_sessions AS
SELECT
    user_id,
    DATE(started_at AT TIME ZONE 'Asia/Kolkata') AS date,
    COUNT(*)::int AS cycles_completed,
    COALESCE(SUM(duration_minutes), 0)::int AS total_focus_minutes
FROM public.sessions
WHERE deleted_at IS NULL
  AND session_type = 'focus'
GROUP BY user_id, DATE(started_at AT TIME ZONE 'Asia/Kolkata');

GRANT SELECT ON public.pomodoro_sessions TO authenticated, service_role;


-- ────────────────────────────────────────────────────────
-- C-4: Collapse mood from 1-10 to 1-5 scale
-- ────────────────────────────────────────────────────────
DO $$
BEGIN
  -- Check if mood column still has the old CHECK (1-10)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'daily_logs' AND column_name = 'mood'
  ) THEN
    -- Only migrate if the constraint allows > 5
    IF EXISTS (
      SELECT 1 FROM information_schema.check_constraints cc
      JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
      WHERE ccu.table_schema = 'public' AND ccu.table_name = 'daily_logs' AND ccu.column_name = 'mood'
        AND cc.check_clause LIKE '%10%'
    ) THEN
      -- Add temporary column
      ALTER TABLE public.daily_logs ADD COLUMN mood_5 SMALLINT CHECK (mood_5 BETWEEN 1 AND 5);
      UPDATE public.daily_logs SET mood_5 = CEIL(mood::numeric / 2.0) WHERE mood IS NOT NULL;
      ALTER TABLE public.daily_logs DROP COLUMN mood;
      ALTER TABLE public.daily_logs RENAME COLUMN mood_5 TO mood;
      RAISE NOTICE 'C-4: mood column collapsed from 1-10 to 1-5';
    ELSE
      RAISE NOTICE 'C-4: mood column already in 1-5 range, skipping';
    END IF;
  ELSE
    RAISE NOTICE 'C-4: mood column not found, skipping';
  END IF;
END $$;


-- ────────────────────────────────────────────────────────
-- Add new columns to users for Lab support
-- ────────────────────────────────────────────────────────
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS quarterly_review_anchor DATE DEFAULT '2026-01-01',
    ADD COLUMN IF NOT EXISTS lab_onboarded_at TIMESTAMPTZ;


COMMIT;

-- Verification queries (run after migration)
-- SELECT count(*) FROM information_schema.tables WHERE table_name = 'savings_goals';  -- should be 0
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'daily_logs' AND column_name LIKE 'masturbation%';  -- should be empty
-- SELECT table_type FROM information_schema.tables WHERE table_name = 'pomodoro_sessions';  -- should be 'VIEW'
