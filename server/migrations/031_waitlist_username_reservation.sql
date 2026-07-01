-- Waitlist username reservation + required first name
-- Run after 023_waitlist_emails.sql

ALTER TABLE waitlist_emails
  ADD COLUMN IF NOT EXISTS first_name TEXT;

ALTER TABLE waitlist_emails
  ADD COLUMN IF NOT EXISTS reserved_username TEXT;

-- Backfill first_name from legacy name column
UPDATE waitlist_emails
SET first_name = name
WHERE first_name IS NULL AND name IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_reserved_username
  ON waitlist_emails (lower(reserved_username))
  WHERE reserved_username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_waitlist_first_name
  ON waitlist_emails (first_name)
  WHERE first_name IS NOT NULL;
