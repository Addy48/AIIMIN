# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-15

## Today

- Shipping Login Selfloop QA fixes (PIN UI/a11y + rate limit 30/15m + Retry-After)
- Register: `docs/knowledge/11_BUGS/QA-Run-2026-07-14-Login.md`

## Next

1. Confirm Vercel READY + EC2 health/SHA
2. Selfloop re-run `/login`
3. Regrade from new screenshots

## Touch

- `frontend/src/pages/Login.jsx`
- `frontend/src/context/AuthContext.jsx`
- `server/middleware/rateLimiter.js`
- `server/lib/auth.js`
