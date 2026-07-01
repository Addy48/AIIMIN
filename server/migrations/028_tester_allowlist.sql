-- Phase 5 waitlist: approved tester emails (invite flow)
CREATE TABLE IF NOT EXISTS tester_allowlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_tester_allowlist_email ON tester_allowlist(email);

ALTER TABLE tester_allowlist ENABLE ROW LEVEL SECURITY;
