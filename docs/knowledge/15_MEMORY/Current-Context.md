# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-11

## Today

- Waitlist mobile join form fixed
- Click-upgrade for all + B celebration + per-tier souls
- EC2 API at `15242be6` healthy
- **Rule locked:** every commit+push → also deploy EC2 API

## Working on

- Phone-verify waitlist + Account subscription upgrade on prod

## Recent decisions

- Click-upgrade auto-on until Stripe ready
- Testing: up+down; later `UPGRADE_ONLY=true`
- **Ship loop:** push `main` → Vercel (FE) + EC2 API (Action or SSH `github-ec2-deploy.sh`) — never leave API stale

## Files modified (this effort)

- Billing/UI/waitlist as in `15242be6`
- Memory: `.cursor/rules/aiimin-git-workflow.mdc`, `docs/knowledge/07_DEPLOYMENT/Deploy.md`

## Known issues

- Left untracked: `.cursor/debug-40de69.log` (do not commit)

## Next step

1. Verify Account → Subscription click-upgrade on prod
2. Verify waitlist join on phone
