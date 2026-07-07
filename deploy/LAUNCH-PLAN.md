# AIIMIN Launch Plan — July 2026

Last updated: 2026-07-07  
Status: Waitlist live · Tester window closes **31 July** · Go-live target **September 2026**

---

## Phase 0 — Email (this week) ✅ in progress

| # | Task | Owner | Status |
|---|------|-------|--------|
| 0.1 | Migrate code from SES → Resend SDK | Dev | ✅ Done |
| 0.2 | Add `aiimin.in` domain in Resend + DNS | You | **TODO** |
| 0.3 | Set `RESEND_API_KEY` on EC2, remove SES vars | You | **TODO** |
| 0.4 | `node scripts/test-email.mjs` → inbox | You | **TODO** |
| 0.5 | Waitlist signup E2E → user + owner mail | You | **TODO** |
| 0.6 | Decommission SES SMTP IAM user | You | After 0.5 |
| 0.7 | **Rotate Resend API key** (was pasted in chat) | You | **URGENT** |

See `deploy/RESEND-SETUP.md`.

---

## Phase 1 — Tester access (by 31 July)

| # | Task | Notes |
|---|------|-------|
| 1.1 | Run `node scripts/invite-tester-auth.mjs` | Pre-create Supabase auth users |
| 1.2 | Run `node scripts/seed-access-allowlist.mjs` | 6 tester emails |
| 1.3 | Google OAuth redirect URLs in Supabase | `www.aiimin.in/auth/callback` |
| 1.4 | Each tester: Google login → onboarding → `/overview` | LC-12 |
| 1.5 | EC2 env: `TESTER_EMAILS`, `DEV_EMAILS`, `WAITLIST_MODE=true` | |

Testers: au10 (dev), au85, sanchit, aditya mehta, shishang, kuldeep.

---

## Phase 2 — Production verification (launch checklist)

| ID | Task |
|----|------|
| LC-01 | IDOR + SQL injection smoke on production API |
| LC-04 | Verify all env vars (Vercel + EC2) vs `deploy/.env.production.example` |
| LC-05 | Visual/copy walkthrough on production |
| LC-06 | Full smoke test with fresh account |
| LC-07 | Email flows (waitlist, invite, re-engagement stub) |
| LC-09 | Sentry DSN |
| LC-10 | GA4 events on waitlist signup |
| LC-13 | Legal / data-deletion E2E |

---

## Phase 3 — AWS infra (non-email)

| Item | Keep / Drop | Notes |
|------|-------------|-------|
| EC2 `api.aiimin.in` | **Keep** | Express API + PM2 |
| SES | **Drop** | Replaced by Resend |
| Route53 / DNS | **Keep** | `aiimin.in` + Resend DKIM records |
| S3 + CloudFront | **Defer** | Assets on Vercel for now |
| EventBridge crons | **Optional** | `/api/keepalive` on Vercel cron works |
| CloudWatch alarms | **Keep** | Billing alerts in `deploy/setup-billing-alerts.sh` |
| Cognito | **Defer** | Supabase Auth works for testers |

---

## Phase 4 — Public launch (September 2026)

| # | Task |
|---|------|
| 4.1 | `REACT_APP_WAITLIST_MODE=false` on Vercel |
| 4.2 | `WAITLIST_MODE=false` on EC2 |
| 4.3 | Promote waitlist → `tester_allowlist` batch approve script |
| 4.4 | Status page + launch monitoring (LC-14) |
| 4.5 | Stripe live keys if billing at launch |

---

## Phase 5 — Deferred (post-launch)

- Cognito full migration (`deploy/COGNITO-SETUP.md`)
- Puppeteer PDF monthly reports
- Native mobile app
- SES → never (Resend is permanent)

---

## Env matrix (current)

### EC2 (required)

```
DATABASE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL=noreply@aiimin.in
RESEND_FROM_NAME=AIIMIN
RESEND_REPLY_TO=...
OWNER_NOTIFY_EMAIL=...
WAITLIST_MODE=true
DEV_EMAILS=...
TESTER_EMAILS=...
CRON_SECRET=...
NODE_ENV=production
FRONTEND_URL=https://www.aiimin.in
```

### Vercel (required)

```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REACT_APP_API_URL=https://api.aiimin.in/api
REACT_APP_WAITLIST_MODE=true
REACT_APP_DEV_EMAILS=...
REACT_APP_TESTER_EMAILS=...
```

### Removed (do not set)

```
AWS_SES_REGION
AWS_SES_SMTP_USER
AWS_SES_SMTP_PASS
SES_FROM_EMAIL
SES_FROM_NAME
EMAIL_PROVIDER
```

---

## Your immediate checklist (today)

1. Resend dashboard → verify `aiimin.in` domain  
2. Resend → **rotate API key** → update `.env` + EC2  
3. EC2: remove SES vars, add Resend vars, `pm2 reload`  
4. `node scripts/test-email.mjs aadityaupadhyay10@gmail.com`  
5. Clear waitlist: `node scripts/clear-waitlist.mjs`  
6. Fresh waitlist signup test  
7. Onboarding test as au85  
8. AWS SES → delete SMTP credentials  
