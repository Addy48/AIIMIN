# AIIMIN — Full AWS Option A Master Plan

Last updated: 2026-07-04  
Owner email: `aadityaupadhyay10@gmail.com`  
Frontend: **Vercel** · DNS: **GoDaddy** · Backend: **AWS ap-south-1**

---

## Goal

Replace **Supabase** (PostgreSQL + Auth + Storage) and **Clerk** with AWS **RDS + Cognito + S3**, keep API on **EC2 t4g.nano** (no NAT Gateway), stay under **$10/month** with **$40 credits** (~8 months runway).

---

## Architecture (no NAT)

```
Vercel (aiimin.in) ──► api.aiimin.in (Elastic IP → EC2 public subnet)
                              │
                    ┌─────────┼──────────┐
                    ▼         ▼          ▼
              RDS Postgres   S3        Cognito
              (private)    uploads    User Pool
                    │
              SES (email) · EventBridge (crons) · CloudWatch (alarms)
```

**VPC:** default or `aiimin-vpc` with **Internet Gateway only** — no NAT Gateway.

---

## Phased execution

| Phase | Scope | Duration | Blocks launch? |
|-------|--------|----------|----------------|
| **0** | Teardown old AWS + fresh EC2/RDS/Cognito/S3 | 1 day | Yes (API down ~1h) |
| **1** | RDS data migration from Supabase (`pg_dump`) | 1–2 days | Yes |
| **2** | Cognito auth (replace Clerk) + frontend login | 3–5 days | Yes |
| **3** | S3 uploads (replace Supabase Storage) | 1 day | Partial |
| **4** | Waitlist + dev/tester access (email gate) | 1 day | No |
| **5** | Billing alerts + budget guardrails | 0.5 day | No |
| **6** | Decommission Supabase + Clerk | 0.5 day | After stable 7d |

---

## Phase 0 — Fresh AWS (you run teardown, then setup)

### Scripts (repo)

| Script | Purpose |
|--------|---------|
| `deploy/teardown-aws.sh` | Delete EC2, EIP, optional VPC, old alarms |
| `deploy/setup-option-a.sh` | Orchestrator: S3, RDS, Cognito, EC2, budgets |
| `deploy/setup-rds.sh` | RDS PostgreSQL 16, private, SG from EC2 |
| `deploy/setup-cognito.sh` | User Pool + app client + domain |
| `deploy/setup-billing-alerts.sh` | $10 budget, SNS email, weekly Cost Explorer |
| `deploy/setup-aws-resources.sh` | S3 buckets + budgets (updated) |
| `deploy/setup-ec2.sh` | EC2 + VPC + EIP (existing, updated) |

### Teardown order

```bash
bash deploy/teardown-aws.sh
```

Deletes: EC2 `aiimin-api`, Elastic IP, CloudWatch alarms, optional `aiimin-vpc` resources.

### Setup order

```bash
export OWNER_EMAIL=aadityaupadhyay10@gmail.com
bash deploy/setup-option-a.sh
# Then DNS: api.aiimin.in → new Elastic IP
bash deploy/rsync-to-ec2.sh <NEW_EIP>
ssh ubuntu@<NEW_EIP> 'cd AIIMIN && bash deploy/bootstrap.sh'
```

### Your manual steps (Phase 0)

1. **GoDaddy DNS** — point `api` A record to new Elastic IP after setup prints it.
2. **SES** — verify `aiimin.in` if not already; create SMTP credentials.
3. **EC2 `.env`** — fill `deploy/.env.production.example` copy on server.
4. **Vercel env** — update `REACT_APP_API_URL`, Cognito vars after Phase 2.
5. **GitHub Actions** — update `EC2_HOST` secret with new IP.

---

## Phase 1 — Database migration

### Export (from your machine, needs Supabase DB password)

```bash
pg_dump "postgresql://postgres:PASSWORD@db.yubxgftugxbwtywyhcsv.supabase.co:5432/postgres?sslmode=require" \
  --no-owner --no-acl -Fc -f aiimin_backup.dump
```

### Import to RDS

```bash
pg_restore -h <RDS_ENDPOINT> -U aiimin_admin -d aiimin -Fc aiimin_backup.dump
```

### Apply migrations

```bash
for f in server/migrations/*.sql; do psql "$DATABASE_URL" -f "$f"; done
```

### Code changes

- `DATABASE_URL` → RDS endpoint (port 5432, SSL)
- Remove `getSupabaseAdmin()` from all routes → `pool.query`
- `server/lib/db.js` — `max: 10` on EC2

---

## Phase 2 — Cognito (replace Clerk)

### Cognito console / `setup-cognito.sh`

- User Pool: email sign-in, Google IdP
- App client: SPA, PKCE, no secret
- Callback: `https://aiimin.in`, `http://localhost:3000`
- Logout: `https://aiimin.in`

### Env vars

| Remove | Add |
|--------|-----|
| `CLERK_SECRET_KEY` | `COGNITO_USER_POOL_ID` |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | `COGNITO_CLIENT_ID` |
| `OWNER_CLERK_IDS` | `OWNER_COGNITO_SUBS` + `DEV_EMAILS` |
| `TESTER_CLERK_IDS` | `TESTER_EMAILS` + DB allowlist |

### Frontend

- Replace `ClerkProvider` → `CognitoAuthProvider`
- `Login.jsx` — Cognito Hosted UI or custom
- `api.js` — Bearer Cognito access token

### User migration (50 users)

- Export Clerk users → Cognito bulk import CSV
- Or: invite via SES on first login attempt

---

## Phase 3 — S3 storage

- Bucket: `aiimin-uploads-808850080350`
- Replace `blobService.js` Supabase storage with `server/lib/s3.js`
- Migrate files from Supabase `dashboard-uploads` bucket

---

## Phase 4 — Waitlist & access (implemented in code)

### Public users (`REACT_APP_WAITLIST_MODE=true`)

- `/` → premium waitlist landing
- Email signup → confirmation via SES
- Owner notified on each signup
- Public quick feedback (no login)
- Sign in → if not dev/tester → friendly “pending” screen

### Dev accounts (1)

- `DEV_EMAILS=aadityaupadhyay10@gmail.com`
- Full app access + **elite** tier

### Testers (4 active + 3 future slots)

- `TESTER_EMAILS=aadityaupadhyay85@gmail.com,sanchitbhatia2006@gmail.com,adityamehta298@gmail.com,shishangthakur@icloud.com`
- Future slots documented in `deploy/.env.production.example` and `scripts/seed-access-allowlist.mjs`
- Full app access + **elite** tier (same as dev)
- Seed DB: `node scripts/seed-access-allowlist.mjs` (uses env or built-in defaults)

### API

- `GET /api/auth/access` — returns `{ canAccess, role, tier }`
- `POST /api/waitlist/feedback` — public, rate-limited
- `POST /api/waitlist/approve` — owner only

---

## Phase 5 — Billing & alerts

| Alert | Threshold | Delivery |
|-------|-----------|----------|
| Monthly budget | $10 actual | Email at 80%, 100% |
| Forecast | $8 forecasted | Email |
| Weekly digest | Every Monday | Cost by service (SNS) |
| EC2 CPU | >80% 5min | SNS |
| RDS storage | >80% | SNS |

All notifications → `aadityaupadhyay10@gmail.com`

---

## Cost model ($40 credits)

| Month | Est. spend | Credits left |
|-------|------------|--------------|
| 1–8 | ~$4.85/mo | $40 covers ~8 mo |
| 9–12 (RDS free ends) | ~$18/mo | Need card or optimize |

**Never enable:** NAT Gateway, ALB, Multi-AZ RDS, Secrets Manager (use `.env`).

---

## Files changed (inventory)

See agent exploration report — ~70 files total. Critical path:

- `server/middleware/auth.js`
- `server/routes/waitlist.js`, `auth.js`, `feedback.js`
- `server/services/accessService.js`
- `frontend/src/App.js`, `WaitlistLanding.jsx`
- `frontend/src/context/CognitoAuthContext.jsx` (Phase 2)
- `deploy/*.sh`

---

## Current infrastructure (2026-07-04)

| Resource | Value |
|----------|-------|
| EC2 public IP | `13.207.146.15` |
| EC2 instance ID | `i-005323efcc7f1ba3c` |
| Region | `ap-south-1` |
| DNS target | `api.aiimin.in` → Elastic IP above |

Update GitHub Actions `EC2_HOST` secret and GoDaddy `api` A record to this IP after deploy.

---

## Launch checklist after migration

- [ ] `api.aiimin.in/health` → 200
- [ ] Sign up waitlist → confirmation email + owner email
- [ ] Dev login → full dashboard, elite tier
- [ ] Tester login → full dashboard, elite tier
- [ ] Public login → pending screen, not dashboard
- [ ] Feedback from waitlist → owner email
- [ ] AWS budget email received
- [ ] Supabase project paused
- [ ] Clerk cancelled

---

## Waiting on you

1. **Run migration 031** on RDS: `psql "$DATABASE_URL" -f server/migrations/031_waitlist_username_reservation.sql`
2. **Seed allowlist** on RDS: `node scripts/seed-access-allowlist.mjs`
3. **EC2 `.env`** — copy `deploy/.env.production.example`, fill secrets (no passwords in shell history)
4. **DNS** — point `api.aiimin.in` A record to `13.207.146.15`
5. **Vercel env** — `REACT_APP_API_URL`, `REACT_APP_WAITLIST_MODE=true`, Cognito vars after Phase 2
6. **Supabase DB password** — for `pg_dump` (or run dump yourself)
7. **Confirm tester list** — 4 testers seeded; add future slots to `TESTER_EMAILS` when ready
