# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-12

## Today

- Vercel fixed + **READY**: `dpl_8eTzBgrhKmc192bix9v9VAissfP4` / SHA `d420cef9`
- Cause: `EntryForm.jsx` ternary siblings without fragment → SyntaxError
- QA code on `main` (`e3212bc9` + build fix)
- **EC2 still blocked from agent** (SSH denied). User/Action must deploy API.

## Ship checklist

| Step | Status |
|------|--------|
| Commit+push QA | done `e3212bc9` |
| Fix Vercel build | done `d420cef9` |
| Vercel production | **READY** |
| EC2 API | **not from agent** — run SSH script |

## EC2 (you)

```bash
ssh -i ~/Desktop/aiimin.pem ubuntu@13.207.146.15 \
  'bash ~/AIIMIN/deploy/github-ec2-deploy.sh'
curl -sS https://api.aiimin.in/api/health
# POST /api/user/pulse-check must be 401 not 404
```

## Next

1. EC2 deploy verify
2. Selfloop re-run

## Links

- QA: `11_BUGS/QA-Run-2026-07-12.md`
- Vercel: https://vercel.com/fwvevs-projects/aiimin/8eTzBgrhKmc192bix9v9VAissfP4
