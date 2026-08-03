-- 050: users.lab_onboarded_at — Lab onboarding flag.
--
-- Why: server/routes/lab.js reads it (GET /api/lab/status) and sets it
-- (POST /api/lab/onboard). The column was never created, so both statements
-- failed with 42703 and Lab onboarding had no server-side state at all.
--
-- Non-destructive: additive nullable column. NULL == "has not onboarded",
-- which is exactly what the existing `lab_onboarded_at IS NULL` guard expects.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS lab_onboarded_at TIMESTAMPTZ;
