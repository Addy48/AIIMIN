-- 049: journal_entries — one entry per (user, date, MODE), not one per (user, date).
--
-- Why: the app models a journal entry per mode (write / free_write / cbt / www /
-- morning / weekly) — findEntryForDate() in frontend/src/components/journal/journalUtils.js
-- keys on date AND mode. The table only carried UNIQUE (user_id, date), so writing a
-- second mode on the same day raised a duplicate-key 500.
--
-- Mode currently lives inside the v2 JSON envelope in encrypted_content:
--   {"v":2,"mode":"write",...}
-- Rows written before the v2 envelope are plain text and get 'legacy'.
--
-- Non-destructive: adds a column, backfills it, swaps one uniqueness rule for a
-- strictly weaker one. No row is deleted or rewritten beyond the new column.

ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS mode TEXT;

-- Backfill. Parsed per row with its own exception block so a single malformed
-- encrypted_content cannot abort the migration.
DO $$
DECLARE
  r RECORD;
  m TEXT;
BEGIN
  FOR r IN SELECT id, encrypted_content FROM public.journal_entries WHERE mode IS NULL LOOP
    m := NULL;
    BEGIN
      IF r.encrypted_content ~ '^\s*\{' THEN
        m := (r.encrypted_content::jsonb ->> 'mode');
      END IF;
    EXCEPTION WHEN others THEN
      m := NULL;
    END;
    UPDATE public.journal_entries
       SET mode = COALESCE(NULLIF(m, ''), 'legacy')
     WHERE id = r.id;
  END LOOP;
END $$;

ALTER TABLE public.journal_entries ALTER COLUMN mode SET DEFAULT 'legacy';
ALTER TABLE public.journal_entries ALTER COLUMN mode SET NOT NULL;

-- Swap the constraint. Safe ordering: the old rule is strictly stronger than the
-- new one, so every existing row already satisfies the new index.
ALTER TABLE public.journal_entries
  DROP CONSTRAINT IF EXISTS journal_entries_user_id_date_key;

CREATE UNIQUE INDEX IF NOT EXISTS journal_entries_user_date_mode_key
  ON public.journal_entries (user_id, date, mode);
