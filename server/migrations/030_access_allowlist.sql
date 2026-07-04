-- Access allowlist: dev + tester roles for waitlist gate
-- Replaces clerk_id-only checks with email-based access

ALTER TABLE tester_allowlist
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'tester';

ALTER TABLE tester_allowlist
  DROP CONSTRAINT IF EXISTS tester_allowlist_role_check;

ALTER TABLE tester_allowlist
  ADD CONSTRAINT tester_allowlist_role_check
  CHECK (role IN ('tester', 'dev'));

ALTER TABLE tester_allowlist
  ADD COLUMN IF NOT EXISTS clerk_id TEXT;

ALTER TABLE tester_allowlist
  ADD COLUMN IF NOT EXISTS cognito_sub TEXT;

CREATE INDEX IF NOT EXISTS idx_tester_allowlist_clerk_id
  ON tester_allowlist(clerk_id) WHERE clerk_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tester_allowlist_cognito_sub
  ON tester_allowlist(cognito_sub) WHERE cognito_sub IS NOT NULL;

-- Waitlist feedback from public landing (no auth)
CREATE TABLE IF NOT EXISTS waitlist_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  sentiment TEXT CHECK (sentiment IN ('love', 'curious', 'skeptical', 'feature')),
  message TEXT,
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_feedback_created
  ON waitlist_feedback(created_at DESC);
