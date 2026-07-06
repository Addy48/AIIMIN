-- Waitlist referral codes and referrer tracking
ALTER TABLE waitlist_emails
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by TEXT,
  ADD COLUMN IF NOT EXISTS referral_count INT NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_emails_referral_code
  ON waitlist_emails (referral_code)
  WHERE referral_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_waitlist_emails_referred_by
  ON waitlist_emails (referred_by)
  WHERE referred_by IS NOT NULL;
