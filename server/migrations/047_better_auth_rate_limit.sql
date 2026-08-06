-- Better Auth rateLimit table for storage: "database"
-- Applied remotely as p1_better_auth_rate_limit_table

CREATE TABLE IF NOT EXISTS public."rateLimit" (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  "lastRequest" BIGINT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS rateLimit_key_uidx ON public."rateLimit" (key);
ALTER TABLE public."rateLimit" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS deny_all_rateLimit ON public."rateLimit";
CREATE POLICY deny_all_rateLimit ON public."rateLimit" FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
REVOKE ALL ON TABLE public."rateLimit" FROM anon, authenticated;
