-- Phase 0 foundation — Clerk auth (references public.users, not auth.users)
-- Applied via Supabase MCP 2026-06-30

CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    persona_tags TEXT[] DEFAULT '{}',
    favorite_sports TEXT[] DEFAULT '{}',
    favorite_teams JSONB DEFAULT '{}',
    dashboard_modules TEXT[] DEFAULT '{}',
    domain_priorities JSONB DEFAULT '[]',
    ai_tone TEXT DEFAULT 'motivating',
    ai_features_enabled BOOLEAN DEFAULT true,
    ai_journal_opt_in BOOLEAN DEFAULT true,
    onboarding_complete BOOLEAN DEFAULT false,
    tagline TEXT,
    location TEXT,
    notification_prefs JSONB DEFAULT '{}',
    seen_tips TEXT[] DEFAULT ARRAY[]::TEXT[],
    prev_tier TEXT DEFAULT 'explore',
    last_celebrated_milestone INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discipline_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.discipline_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    streak_id UUID REFERENCES public.discipline_streaks(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    trigger_type TEXT,
    hal_check JSONB DEFAULT '{}',
    craving_intensity INT,
    time_of_day TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.replacement_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    habit_name TEXT NOT NULL,
    habit_id UUID,
    linked_to_addiction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.habit_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    habit_ids UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
