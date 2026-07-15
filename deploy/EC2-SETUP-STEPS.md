# EC2 deploy — paste env + restart API

## 1. Copy env to EC2 (from your Mac)

```bash
scp "/Users/aaditya/Desktop/DASHBOARD PROJECT/deploy/EC2.env.paste" ubuntu@YOUR_EC2_IP:/home/ubuntu/AIIMIN/.env
```

Or SSH in and `nano /home/ubuntu/AIIMIN/.env` — paste entire contents of `deploy/EC2.env.paste`.

## 2. SSH + pull latest code + restart

```bash
ssh ubuntu@YOUR_EC2_IP

cd ~/AIIMIN
git pull origin main
npm install --omit=dev --ignore-scripts

# Verify Better Auth
curl -s https://api.aiimin.in/api/auth/ok
# expect: {"ok":true}

pm2 reload deploy/ecosystem.config.cjs --update-env
pm2 logs aiimin-api --lines 30
```

### If you get **502 Bad Gateway**

The API process crashed or isn’t listening on port 3001. Diagnose on EC2:

```bash
pm2 status
pm2 logs aiimin-api --lines 50 --nostream
curl -s http://localhost:3001/api/health    # bypass nginx
```

Common causes:
- **Code/env mismatch** — `.env` has `BETTER_AUTH_*` but `main` doesn’t include Better Auth yet. `git pull origin main` again after the migration is pushed, then `npm install --omit=dev`.
- **Missing secret** — `BETTER_AUTH_SECRET` must be set in `.env`.
- **Bad .env paste** — no smart quotes; each `KEY=value` on its own line.

After fix: `pm2 reload deploy/ecosystem.config.cjs --update-env`

## 3. Quick health checks

```bash
curl -s https://api.aiimin.in/api/health
curl -s https://api.aiimin.in/api/auth/ok
```

## 4. Vercel (frontend — separate from EC2)

Vercel uses `frontend/.env.production` (already has `REACT_APP_API_URL=https://api.aiimin.in/api`).
Redeploy Vercel after pushing Better Auth frontend changes.

## 5. Fresh DB (already done locally — shared Supabase)

Database is shared between local + EC2. Fresh reset was run:
- 0 users, 0 waitlist, 0 OS-IDs taken
- 6 tester allowlist rows kept

Re-run from Mac if needed: `npm run auth:reset-fresh`

---

See also: `docs/GOOGLE-CLOUD-OAUTH-SETUP.md`, `docs/LOCAL-CHROME.md`
