-- API usage tracking + provider daily budgets (free-tier guardrails)
-- Run after user/waitlist migrations

CREATE TABLE IF NOT EXISTS api_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  tokens_or_hits INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_log_provider_created
  ON api_usage_log (provider, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_usage_log_user_created
  ON api_usage_log (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_usage_log_created_at
  ON api_usage_log (created_at DESC);

CREATE TABLE IF NOT EXISTS api_provider_budgets (
  provider TEXT PRIMARY KEY,
  daily_limit INTEGER NOT NULL,
  used_today INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ NOT NULL
);

-- Seed default free-tier budgets (override via env at runtime if needed)
INSERT INTO api_provider_budgets (provider, daily_limit, used_today, reset_at)
VALUES
  ('cricapi', 100, 0, (date_trunc('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day') AT TIME ZONE 'UTC'),
  ('rapidapi_cricket', 100, 0, (date_trunc('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day') AT TIME ZONE 'UTC'),
  ('gemini', 1500, 0, (date_trunc('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day') AT TIME ZONE 'UTC'),
  ('groq', 14400, 0, (date_trunc('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day') AT TIME ZONE 'UTC'),
  ('moonshot', 500, 0, (date_trunc('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day') AT TIME ZONE 'UTC'),
  ('sports_cron', 48, 0, (date_trunc('day', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 day') AT TIME ZONE 'UTC')
ON CONFLICT (provider) DO NOTHING;
