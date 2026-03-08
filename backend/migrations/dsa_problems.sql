-- ============================================================
-- Migration: dsa_problems table
-- Run this in the Supabase SQL editor
-- ============================================================

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
