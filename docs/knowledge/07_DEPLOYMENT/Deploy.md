---
authority: engineering
derived_from: Genesis
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
migration_batch: W4
fm_source: script
---
# Deployment

## Surfaces

| Surface | Typical host | Notes |
|---------|--------------|-------|
| Frontend | Vercel | Auto on `main`. `REACT_APP_*` build envs; prod waitlist via `frontend/.env.production` |
| API | EC2 / `api.aiimin.in` | **Always redeploy after commit+push** (Action or SSH). See below. |
| DB | Supabase | `DATABASE_URL`, service role on server only |

## Agent rule (locked)

Whenever a commit touching `server/`, `api/`, or `deploy/` is pushed—or the Founder says ship—also deploy the API to EC2 in the same turn. Do not stop at git push.

1. Prefer GitHub Action `Deploy API to EC2` (`.github/workflows/deploy-api.yml`) — triggers on `server/**`, `api/**`, `deploy/**`, etc.
2. If Action unavailable/failed, or user says deploy now: SSH and run remote deploy script.
3. Confirm health + SHA.

### Manual SSH deploy

```bash
ssh -i "/Users/aaditya/Desktop/aiimin.pem" ubuntu@13.207.146.15 \
  'bash ~/AIIMIN/deploy/github-ec2-deploy.sh'
curl -sS https://api.aiimin.in/api/health
```

Env paste examples live in `deploy/` — **never commit secrets**.

## Critical env names

See [[01_PRODUCT/Product]] environment matrix. Values live in host secret stores / local `.env` — not in vault.

## Cron

- `deploy/cron.sh` — sports refresh and other system jobs
- Auth: Bearer `CRON_SECRET`

## Local vs prod waitlist

- Local full dashboard: `REACT_APP_WAITLIST_MODE=false` in `.env.local`
- Production waitlist: `true` via committed `frontend/.env.production`

## Vercel build failures

- **Empty dashboard placeholders:** Vercel may set `REACT_APP_API_URL=""` etc. `verify-production-env.mjs` backfills from committed `frontend/.env.production` when unset/empty. Run `deploy/sync-vercel-frontend-env.sh` to fix dashboard vars.
- **`sts_credentials_fetch_failed`:** transient Vercel infra at `build-container-init`. Bypass: `vercel pull` → `vercel build --prod --yes` → `vercel deploy --prebuilt --prod --yes`.

## Historical AWS snapshot

The following table records the 2026-07-17 check. Reverify before using it as current operational state.

| Item | Status |
|------|--------|
| Budget `aiimin-monthly-10` ($10) | HEALTHY — actual $0 · forecast ~$3.18 |
| Budget `aiimin-credits-buffer` ($8) | HEALTHY — same forecast |
| EC2 `aiimin-api` t4g.nano | Running · EIP `13.207.146.15` · health ok |
| NAT / ALB / RDS / Cognito | None (Option A RDS+Cognito not completed; auth = Better Auth, DB = Supabase) |
| S3 `aiimin-uploads-*` / `aiimin-family-vault-*` | Exist, empty |
| CloudWatch alarms / SNS subs | Missing / empty — budgets email only |
| Ops risk | Root disk **97%** used; SSH port 22 open to `0.0.0.0/0` |

Planning references: [[07_DEPLOYMENT/AWS_MIGRATION_MASTER_PLAN]] · [[07_DEPLOYMENT/AWS_SETUP]].

## Related

- [[07_DEPLOYMENT/Runbooks-Index]]
- [[02_ARCHITECTURE/Backend]]
- [[09_FEATURES/Waitlist/Waitlist]]
- [[09_FEATURES/Mobile/Capacitor-Android]]

## Android (Capacitor)

```bash
cd frontend && npm run cap:android && npm run cap:open:android
```

Remote WebView → `https://aiimin.in/m`. No Firebase. Details: [[09_FEATURES/Mobile/Capacitor-Android]].
