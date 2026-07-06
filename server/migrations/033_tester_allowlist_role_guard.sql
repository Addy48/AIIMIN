-- Guard: ensure tester_allowlist.role exists (if 030 was skipped or partial)
ALTER TABLE tester_allowlist
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'tester';

ALTER TABLE tester_allowlist
  DROP CONSTRAINT IF EXISTS tester_allowlist_role_check;

ALTER TABLE tester_allowlist
  ADD CONSTRAINT tester_allowlist_role_check
  CHECK (role IN ('tester', 'dev'));

ALTER TABLE tester_allowlist
  ADD COLUMN IF NOT EXISTS cognito_sub TEXT;
