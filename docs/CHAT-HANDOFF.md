# AIIMIN — Chat Handoff Context (2026-07-08)

**Paste this into a new chat** to continue without re-explaining the project.

---

## What we are

Personal Life OS dashboard — **www.aiimin.in** (Vercel) + **api.aiimin.in** (EC2 `13.207.146.15`).  
DB: **Supabase PostgreSQL** (`yubxgftugxbwtywyhcsv`). Auth: **Supabase Auth** for testers (Cognito deferred).

---

## Done this session arc (waitlist + email + brand)

### Email (Resend — production)
- **SES removed.** All transactional mail via Resend (`server/lib/email.js`).
- **From:** `noreply@admin.aiimin.in` (domain `admin.aiimin.in` verified).
- **Published Resend template:** `aiimin-waitlist-confirmation`  
  ID: `cf437c26-b3c9-4474-a312-1a4ec4e7340c`
- **Design:** c6 light + Route Y dark via `prefers-color-scheme`.
- **Subject:** `#N — FirstName, it starts here`
- **Member counter:** `#123 → #300` (`WAITLIST_MEMBER_OFFSET=122`, `WAITLIST_DISPLAY_CAP=300`)
- **Sync:** `node scripts/sync-resend-waitlist-template.mjs`  
- **Test:** `node scripts/test-email.mjs you@email.com`
- Prototypes deleted (`deploy/email-preview/`, preview scripts).

### Logo (Arch Bracket — everywhere)
- Legacy **leaf logo** replaced with **Editor Pick** (light) / **Route Y** `DARK_PICK` (dark).
- `BrandLockup` in navbar; `ThemedMark` on login/onboarding/auth/waitlist.
- Assets: `AIIMIN_logo.svg`, `AIIMIN_logo_dark.svg`, theme favicons.
- Email headers: dual logo by device theme.

### Waitlist / access
- Tester allowlist seeded (6 emails). `/login` checks allowlist.
- OS-ID post-signup emails wired. Waitlist UX polish (no public position #).

### Deploy state
- Latest commits on `main` pushed; EC2 pulled + `pm2 reload`.
- **Vercel** auto-deploys frontend from `main` — hard refresh after propagate.
- **Rotate `RESEND_API_KEY`** if still using key that was pasted in chat.

---

## Critical env (EC2 `~/AIIMIN/.env`)

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@admin.aiimin.in
RESEND_WAITLIST_TEMPLATE_ID=cf437c26-b3c9-4474-a312-1a4ec4e7340c
WAITLIST_MEMBER_OFFSET=122
WAITLIST_DISPLAY_CAP=300
WAITLIST_MODE=true
OWNER_NOTIFY_EMAIL=aadityaupadhyay10@gmail.com
DATABASE_URL=...supabase...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Vercel: `REACT_APP_WAITLIST_MODE=true`, `REACT_APP_API_URL=https://api.aiimin.in/api`

---

## Your immediate test checklist

1. Live waitlist signup on **www.aiimin.in** → confirmation email (light + dark client).
2. `node scripts/test-email.mjs` on EC2 or local.
3. Toggle waitlist/app dark mode → Arch Bracket logo updates.
4. Tester Google login → onboarding → `/overview` (6 allowlisted emails).

---

## Next: AWS full plan (Option A)

**Master doc:** `docs/AWS_MIGRATION_MASTER_PLAN.md`  
**Launch runbook:** `deploy/LAUNCH-PLAN.md`  
**Goal:** Replace Supabase (DB + auth + storage) + Clerk with **RDS + Cognito + S3** on EC2, stay ~**$10/mo**, no NAT gateway.

| Phase | What | Status |
|-------|------|--------|
| **0** | Teardown old AWS → fresh EC2/RDS/Cognito/S3 (`deploy/teardown-aws.sh`, `setup-option-a.sh`) | Not started |
| **1** | `pg_dump` Supabase → RDS, wire `DATABASE_URL`, remove Supabase client from routes | Not started |
| **2** | Cognito replaces Clerk/Supabase Auth — login, callbacks, Vercel env | **Deferred** — Supabase Auth works for testers now |
| **3** | S3 uploads (replace Supabase Storage) | Deferred |
| **4** | Waitlist + tester gate | **Mostly done** (allowlist) |
| **5** | Billing alerts (`setup-billing-alerts.sh`) | Partial |
| **6** | Kill Supabase + Clerk after 7d stable | After launch |

**Keep now:** EC2 API, GoDaddy DNS, Resend (not SES), Vercel frontend.  
**Defer:** Cognito until post-tester window unless auth pain forces it.  
**September launch:** `WAITLIST_MODE=false`, promote waitlist → app access.

---

## Key files

| Area | Path |
|------|------|
| Waitlist API | `server/routes/waitlist.js` |
| Email send | `server/lib/email.js` |
| Email template | `server/lib/waitlistResendTemplate.js` |
| Logo system | `frontend/src/components/brand/archBracketMark.js`, `ThemedMark.jsx`, `BrandLockup.jsx` |
| Vault docs | `docs/knowledge/00-Command-Center.md`, `02-Features/Waitlist/` |
| AWS scripts | `deploy/setup-option-a.sh`, `deploy/teardown-aws.sh` |

---

## Open TODOs for next chat

1. **Phase 0.5** — E2E waitlist signup: `node scripts/test-waitlist-e2e.mjs you+test@gmail.com --cleanup`
2. **Phase 0.7** — Rotate Resend API key in dashboard → update EC2 `.env` + local `.env` → `pm2 reload`
3. **LC-12** — Each of 6 allowlist emails: Google login → onboarding → `/overview` (auth users confirmed ✅)
4. **LC-09 / LC-10** — Create GA4 property + Sentry project; set `REACT_APP_GA_MEASUREMENT_ID`, `REACT_APP_SENTRY_DSN`, `SENTRY_DSN` on Vercel + EC2
5. **AWS Phase 0–1** — Defer until post-tester window unless Supabase limits bite; September launch stays on Supabase
6. Run `node scripts/launch-verify.mjs` anytime for LC-04 health snapshot

### Verified 2026-07-08 (this session)

- ✅ `api.aiimin.in/health` → 200
- ✅ `www.aiimin.in` → 200, Arch Bracket logo live
- ✅ Resend test email sent (`scripts/test-email.mjs`)
- ✅ 6/6 `tester_allowlist` rows + Supabase Auth users exist (kuldeep was missing from seed script — fixed)
- ✅ **OAuth callback fix pushed** (`4e5be3e2`) — cross-browser PKCE + hash handling; Vercel deploying
- ⚠️ GA4 + Sentry DSNs not set
- ⚠️ Production waitlist count = 1 (prior signup)

---

*Generated 2026-07-08 — close this chat and `@docs/CHAT-HANDOFF.md` in the new one.*
