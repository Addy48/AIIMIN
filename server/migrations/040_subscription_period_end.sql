-- Click-upgrade testing: track when the current plan period ends (1 month from change).
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;
