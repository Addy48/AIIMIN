# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-12

## Today

- QA fixes **committed + pushed**: `e3212bc9` on `main` / `origin/main`
- Tracker: 176 fixed / 80 partial / 28 wontfix
- **EC2 deploy blocked from this agent** (SSH port 22 + API curl proxy 403). User must deploy or wait for GitHub Action.

## Ship checklist

| Step | Status |
|------|--------|
| Commit | done `e3212bc9` |
| Push `main` | done |
| Vercel frontend | auto from `main` — confirm READY in dashboard |
| EC2 API | **NOT verified from agent** — run SSH deploy or check Action |

## Deploy if Action fails

```bash
ssh -i ~/Desktop/aiimin.pem ubuntu@13.207.146.15 \
  'bash ~/AIIMIN/deploy/github-ec2-deploy.sh'
curl -sS https://api.aiimin.in/api/health
# expect SHA e3212bc9; POST /api/user/pulse-check → 401 not 404
```

## Next

1. Confirm EC2 health SHA = `e3212bc9`
2. Confirm Vercel READY
3. Re-run Selfloop

## Links

- `11_BUGS/QA-Run-2026-07-12.md`
