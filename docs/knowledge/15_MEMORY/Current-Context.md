# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-11

## Today

- Root cause live upgrade 500: `billing.js` imported missing `stripe` package (lazy route load)
- Fix: dynamic Stripe import only in webhook; select-tier always
- Plan badge (sidebar + profile) → subscription; Active until +1 month; CTA prices

## Working on

- Ship fix + EC2 redeploy; verify upgrade on prod

## Recent decisions

- Click-upgrade default on; `REACT_APP_SUBSCRIPTION_MODE !== 'false'`
- `subscription_period_end` column for 30-day active window
- Commit+push always includes EC2 API deploy

## Next step

1. Commit + push + EC2 deploy
2. Hard-refresh Account → Subscription; upgrade Core/Pro
