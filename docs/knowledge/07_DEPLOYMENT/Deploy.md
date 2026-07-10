# Deployment

## Surfaces

| Surface | Typical host | Notes |
|---------|--------------|-------|
| Frontend | Vercel | Auto on `main`. `REACT_APP_*` build envs; prod waitlist via `frontend/.env.production` |
| API | EC2 / `api.aiimin.in` | **Always redeploy after commit+push** (Action or SSH). See below. |
| DB | Supabase | `DATABASE_URL`, service role on server only |

## Agent rule (locked)

Whenever code is **committed and pushed**, also ship the API to EC2 in the same turn. Do not stop at git push.

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

- **Empty dashboard placeholders:** Vercel may set `REACT_APP_API_URL=""` etc. `verify-production-env.mjs` backfills from committed `frontend/.env.production` when unset/empty.
- **`sts_credentials_fetch_failed`:** transient Vercel infra at `build-container-init` — not app code. Bypass: `vercel pull --yes --environment=production` → `vercel build --prod --yes` → `vercel deploy --prebuilt --prod --yes` from repo root after local `npm run build` passes.

## Related

- [[02_ARCHITECTURE/Backend]]
- [[09_FEATURES/Waitlist/Waitlist]]
