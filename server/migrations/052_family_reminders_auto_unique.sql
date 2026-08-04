-- 052: family_reminders — make auto-generated reminder dedup atomic.
--
-- Why: the doc_expiry and premium_due auto-inserts in routes/family.js guarded
-- with WHERE NOT EXISTS. That closes the common case but not a race — two
-- overlapping requests can both see no row and both insert. A unique index lets
-- the database enforce it, so the route can use ON CONFLICT DO NOTHING.
--
-- Partial on purpose:
--   * is_auto_generated  — manual reminders are allowed to repeat freely;
--                          a user may legitimately want two on the same day.
--   * source_id NOT NULL — production already holds legacy auto-rows with a
--                          NULL source_id (3 of them, source_type
--                          'admin_simulated'). NULLs are distinct in a unique
--                          index anyway, but excluding them states the intent.

CREATE UNIQUE INDEX IF NOT EXISTS family_reminders_auto_key
  ON public.family_reminders (user_id, source_type, source_id, due_date)
  WHERE is_auto_generated AND source_id IS NOT NULL;
