-- Native mobile sync support tables (run in Supabase when ready)
-- Safe to re-run.

CREATE TABLE IF NOT EXISTS mobile_devices (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  platform text NOT NULL DEFAULT 'android',
  app_version text,
  push_token text,
  last_seen_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mobile_devices_user_idx ON mobile_devices (user_id);

CREATE TABLE IF NOT EXISTS mobile_idempotency (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  idem_key text NOT NULL,
  response_json jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, idem_key)
);

CREATE INDEX IF NOT EXISTS mobile_idempotency_created_idx ON mobile_idempotency (created_at);
