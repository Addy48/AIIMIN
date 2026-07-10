# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-11

## Today

- Waitlist mobile join form fixed (was hidden in desktop-only)
- Click-upgrade for all users (no Stripe) + B identity celebration + per-tier card souls

## Working on

- Ship/verify: Account → Subscription click upgrade + celebration
- Phone-verify waitlist landing after deploy

## Recent decisions

- Click-upgrade auto-on until Stripe prices configured (or `SUBSCRIPTION_MODE=true`)
- Testing: up + down allowed; later `UPGRADE_ONLY=true` for upgrade-only
- Celebration: B identity-shift, per-tier colors (gray/teal/orange/amber)
- Access service honors profile tier while click-upgrade on (no force-elite)

## Files modified (this effort)

- Waitlist: `WaitlistHeroSection.jsx`, `WaitlistLanding.jsx`, `waitlistLanding.css`
- Billing: `billingService.js`, `billing.js`, `accessService.js`
- UI: `SubscriptionSection.jsx`, `TierUpgradeCelebration.jsx`, celebration + subscription CSS
- Spec: `docs/superpowers/specs/2026-07-11-click-upgrade-celebration-design.md`
- Vault: Account + Waitlist changelogs, Current Context

## Known issues

- EC2 must redeploy API for click-upgrade; Vercel for frontend
- Left untracked: `.cursor/debug-40de69.log` (do not commit)

## Next step

1. Commit + push
2. Redeploy frontend + API
3. Test Account → Subscription upgrade on phone + desktop
