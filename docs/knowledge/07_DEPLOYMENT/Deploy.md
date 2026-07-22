# Deployment

## Surfaces

| Surface | Typical host | Notes |
|---------|--------------|-------|
| Frontend | Vercel | `REACT_APP_*` build envs; prod waitlist via `frontend/.env.production` |
| API | EC2 / `api.aiimin.in` | See `deploy/` for env paste examples — **never commit secrets** |
| DB | Supabase | `DATABASE_URL`, service role on server only |

## Critical env names

See [[01_PRODUCT/Product]] environment matrix. Values live in host secret stores / local `.env` — not in vault.

## Cron

- `deploy/cron.sh` — sports refresh and other system jobs
- Auth: Bearer `CRON_SECRET`

## Local vs prod waitlist

- Local full dashboard: `REACT_APP_WAITLIST_MODE=false` in `.env.local`
- Production waitlist: `true` via committed production env pattern

## Related

- [[02_ARCHITECTURE/Backend]]
- [[09_FEATURES/Waitlist/Waitlist]]
