-- 051: family_health — one health record per (user, member).
--
-- Why: routes/family.js POST /health-records is an upsert. Without a unique
-- constraint it had to read-then-write, which two concurrent requests for the
-- same member can both win, leaving duplicate rows for one person. The
-- constraint lets the route use a real ON CONFLICT upsert instead.
--
-- Safe to apply: verified 2026-08-03 that no (user_id, member_id) pair is
-- duplicated in production (6 rows, 0 duplicate groups). The index build below
-- will fail loudly rather than silently drop data if that ever stops being true.

CREATE UNIQUE INDEX IF NOT EXISTS family_health_user_member_key
  ON public.family_health (user_id, member_id);
