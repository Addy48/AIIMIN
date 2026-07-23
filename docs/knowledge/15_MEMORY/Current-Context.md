# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-11

## Today

- Account UX polish: wider desktop, plan chip only on My Profile (icons not C/P/E, `till …` copy)
- Removed Stripe/testing billing copy from celebration + banners
- Prior: billing 500 fixed (lazy Stripe); click-upgrade + period_end shipped

## Working on

- Profile OS-ID + plan meta row polish (matched height/inline chip)

## Recent decisions

- Plan status: profile only, not sidebar
- Click-upgrade default on; `REACT_APP_SUBSCRIPTION_MODE !== 'false'`
- Commit+push always includes EC2 API deploy when server touched

## Next step

1. Wait Vercel READY for `93c889ea`
2. Hard-refresh Account → My Profile meta row
