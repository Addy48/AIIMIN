-- Fix user_oauth_tokens schema for calendar integration + multi-account metadata
-- Safe to run multiple times (IF NOT EXISTS / conditional alters)

-- Ensure composite unique key for (user_id, provider)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_oauth_tokens_pkey'
          AND conrelid = 'public.user_oauth_tokens'::regclass
    ) THEN
        ALTER TABLE public.user_oauth_tokens DROP CONSTRAINT user_oauth_tokens_pkey;
    END IF;
EXCEPTION WHEN undefined_table THEN
    NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_oauth_tokens (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'google',
    linked_email TEXT,
    access_token TEXT,
    access_token_enc TEXT,
    refresh_token TEXT,
    refresh_token_enc TEXT,
    expiry_date TEXT,
    expires_at TIMESTAMPTZ,
    scope TEXT,
    refresh_error TEXT,
    last_refresh_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, provider)
);

ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS linked_email TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS expiry_date TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS refresh_error TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS last_refresh_at TIMESTAMPTZ;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS access_token_enc TEXT;
ALTER TABLE public.user_oauth_tokens ADD COLUMN IF NOT EXISTS refresh_token_enc TEXT;

-- Backfill expiry_date from expires_at when that legacy column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_oauth_tokens' AND column_name = 'expires_at'
    ) THEN
        UPDATE public.user_oauth_tokens
        SET expiry_date = (EXTRACT(EPOCH FROM expires_at) * 1000)::bigint::text
        WHERE expiry_date IS NULL AND expires_at IS NOT NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_oauth_tokens_linked_email
    ON public.user_oauth_tokens (linked_email);

COMMENT ON COLUMN public.user_oauth_tokens.linked_email IS
    'Google account email used for Calendar/YouTube — may differ from AIIMIN login email';
