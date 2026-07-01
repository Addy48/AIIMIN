# AIIMIN Command Center

Last updated: 2026-07-04
Canonical for agents: this file + `docs/knowledge/_manifest.json`

## Product Snapshot

AIIMIN is a personal operating system for disciplined execution, reflection, and daily recovery. It combines logging, focus systems, accountability, sports/news context, and financial awareness into one dashboard.

## Target Users

- Students and early-career builders managing high cognitive load
- People who want measurable daily routines and recovery loops
- Users who prefer practical coaching over vanity analytics

## Why It Exists

- Reduce chaos by turning goals into daily behaviors
- Keep truth visible with real usage data, not motivational fluff
- Build long-term consistency through streaks, rituals, and feedback loops

## Build Status (Launch Lens)

- Code progress: high for core product features
- Launch blockers: Clerk production domains, final env setup, launch checklist verification
- C-items in progress: C1-C7 tracked in feature notes below

## Feature Map

- Architecture: `docs/knowledge/01-Architecture/Architecture.md`
- Sports: `docs/knowledge/02-Features/Sports/Sports.md`
- Account and Personalization: `docs/knowledge/02-Features/Account/Personalization.md`
- Calendar: `docs/knowledge/02-Features/Calendar/Calendar.md`
- Typography: `docs/knowledge/02-Features/Typography/Typography.md`
- Waitlist: `docs/knowledge/02-Features/Waitlist/Waitlist.md`
- API Usage / Dev Tools: `docs/knowledge/02-Features/DevTools/ApiUsage.md`

## Waitlist launch behavior (2026-07-04)

When `REACT_APP_WAITLIST_MODE=true`:

- `/` shows waitlist landing with pricing preview + exclusive perks
- Signup requires email, first name, and 8-char OS-ID reservation
- Dev/tester emails in `DEV_EMAILS` / `TESTER_EMAILS` get elite tier + full app access
- Public sign-in without allowlist → pending screen

Pricing: Explore (free), Core ₹25, Pro ₹61, Elite ₹99.

## Launch Runbook (LC-01 to LC-14)

Source: `AIIMIN_PROGRESS_SUMMARY.md`

- LC-01: IDOR + SQL injection production test
- LC-02: Lighthouse baseline on production
- LC-03: Backup restore test
- LC-04: Verify required production environment variables
- LC-05: Visual and copy walkthrough in production
- LC-06: Full smoke test with fresh account
- LC-07: Email test for waitlist and re-engagement flows
- LC-08: Set `REACT_APP_WAITLIST_MODE=false` and redeploy
- LC-09: Configure Sentry
- LC-10: Verify GA4 custom events
- LC-11: Bring up status page
- LC-12: Complete onboarding test
- LC-13: Legal/data-deletion E2E test
- LC-14: Launch-day monitoring protocol

## Environment Matrix (Critical)

- Auth: `REACT_APP_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Data: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Billing: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_CORE`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET`
- Email: `AWS_SES_SMTP_USER`, `AWS_SES_SMTP_PASS`, `SES_FROM_EMAIL`
- Runtime: `CRON_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- AI/Analytics: `GEMINI_API_KEY`, `GROQ_API_KEY`, `NVIDIA_API_KEY`, `REACT_APP_GA_MEASUREMENT_ID`
- Cricket: `CRICAPI_KEY`, `RAPIDAPI_CRICKET_KEY`, `RAPIDAPI_CRICKET_HOST` (set in `.env` — never commit values)

## Chronology Rule (Append-Only)

Never delete prior context from entity changelogs. Add a new dated entry that states:

1. what changed
2. why it changed
3. which files changed
4. current status
