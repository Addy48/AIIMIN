# Audit — Auth + Database (22-skill rubric)

**Date:** 2026-07-18  
**Project:** Supabase `yubxgftugxbwtywyhcsv` (Addy48's dashboard)  
**Canvas:** `canvases/auth-db-audit-22.canvas.tsx`  
**Status:** P0 fixes applied (partial remaining — see Remaining)

## Rubric source

Consolidated 22 checks from:

- `.agents/skills/supabase-postgres-best-practices`
- `.agents/skills/supabase`
- `.agents/skills/better-auth-best-practices`
- `.agents/skills/database-schema-designer`

(`obsidian-bases` N/A for this audit.)

## Score (initial audit)

| PASS | WARN | FAIL |
|------|------|------|
| 6 | 8 | 8 |

## P0 fixes shipped 2026-07-18

1. **Identity split:** `frontend/src/utils/supabase.js` replaced with API-backed query client → `/api/db` (Better Auth cookies). `api.js` DELETE now sends JSON body. `db.js` gained `gt/lt/in/is`, `routine_runs`, `money_categories`, self-read `users|profiles|user_profiles`.
2. **`handle_new_user`:** REVOKE EXECUTE from anon/authenticated/PUBLIC; `search_path` pinned. Advisors no longer flag DEFINER RPC.
3. **`user_oauth_tokens`:** PRIMARY KEY `(id)` added; UNIQUE `(user_id, provider)` kept. BA + oauth tables REVOKE from anon/authenticated.
4. **Query-token session:** removed from `sessionResolve.js`.
5. **Rate limit:** `storage: 'database'` + `"rateLimit"` table created.
6. **Indexes:** hot FK indexes added (family/habits/discipline/money…); duplicate calendar/sleep indexes dropped. Unindexed FK advisors **50 → ~25**.

Migrations (repo + applied remote): `045_*`, `046_*`, `047_*`.

## Remaining / known issues

- **API process on :3001 may still be old binary** until user restarts `node dev_server.js` (EADDRINUSE blocked agent restart).
- **PostgREST embeds** (e.g. `budgets` + `money_categories(...)`) stripped by shim — budgets load without nested category object until MoneyManager uses `/api/wealth` join or client-side hydrate.
- **RLS INFO:** ~27 tables still RLS-on / 0 policies (OK for API-only if grants locked; defense-in-depth policies still nice).
- **WARN:** waitlist_emails + user_feedback INSERT `WITH CHECK (true)` still open via Data API (waitlist UI uses `/api/waitlist` — can tighten later).
- **WARN:** 183 multiple_permissive_policies + 43 auth_rls_initplan remain (less critical now Data API unused for app reads).
- **ssl.rejectUnauthorized: false** on pool still WARN.

## Related

- [[09_FEATURES/Auth/Auth]]
- [[03_DATABASE/user_oauth_tokens]]
- [[02_ARCHITECTURE/Authentication]]

## Changelog

### 2026-07-18 — P0 fix pass
- **What:** Security hardening migrations + API data plane shim + session query-token removal + BA rateLimit table
- **Why:** Close audit FAILs #12 #13 #16 #19 #22
- **Files:** `supabase.js`, `api.js`, `db.js`, `sessionResolve.js`, `auth.js`, `Discipline.jsx`, `SystemHealth.jsx`, migrations 045–047
- **Status:** shipped locally / DB remote; API restart may be required

### 2026-07-18 — Initial 22-point audit
- **What:** Full auth/DB audit against installed skill rubric; live advisors + SQL evidence
- **Why:** User request after skill install
- **Files:** canvas `auth-db-audit-22.canvas.tsx`, this note, Current-Context
- **Status:** documented
