# Native Android — API deploy checklist

Before native sync works in production, ship these together:

## 1. Code (repo)

| Path | Purpose |
|------|---------|
| `server/routes/mobile.js` | `bootstrap`, `sync/batch`, `devices`, `health` |
| `api/index.js` | `mobile` in lazy `routeMap` |
| `supabase/migrations/20260719_mobile_sync.sql` | `mobile_devices`, `mobile_idempotency` |

## 2. Database

Run migration in Supabase SQL editor (or apply via your migration flow):

`supabase/migrations/20260719_mobile_sync.sql`

## 3. EC2 deploy

After push to `main` touching `server/**` or `api/**`, GitHub Action `deploy-api.yml` runs. Or SSH:

```bash
bash ~/AIIMIN/deploy/github-ec2-deploy.sh
```

## 4. Verify

```bash
curl -s https://api.aiimin.in/api/mobile/health
# {"ok":true,"surface":"native-mobile"}

curl -s -o /dev/null -w "%{http_code}" -X POST \
  https://api.aiimin.in/api/mobile/sync/batch \
  -H "Content-Type: application/json" -d '{"mutations":[]}'
# 401 without auth (not 404)
```

**2026-07-19:** Prod returned **404** — `mobile.js` not yet on deployed `main`.
