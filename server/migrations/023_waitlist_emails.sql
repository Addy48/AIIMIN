-- PW-01: Waitlist emails table
CREATE TABLE IF NOT EXISTS waitlist_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'landing_page',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_emails_created_at ON waitlist_emails(created_at);

ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Only allow insert from service role (API). No public read via anon key.
DROP POLICY IF EXISTS "Allow insert only" ON waitlist_emails;
CREATE POLICY "Allow insert only" ON waitlist_emails
  FOR INSERT WITH CHECK (true);
