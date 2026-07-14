# AIIMIN Command Center

Last updated: 2026-07-07
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
- Launch blockers: final env setup (GA4/Sentry), launch checklist verification, tester onboarding E2E
- C-items in progress: C1-C7 tracked in feature notes below

## Feature Map

- Architecture: `docs/knowledge/01-Architecture/Architecture.md`
- Sports: `docs/knowledge/02-Features/Sports/Sports.md`
- Account and Personalization: `docs/knowledge/02-Features/Account/Personalization.md`
- Calendar: `docs/knowledge/02-Features/Calendar/Calendar.md`
- Typography: `docs/knowledge/02-Features/Typography/Typography.md`
- Waitlist: `docs/knowledge/02-Features/Waitlist/Waitlist.md`
- API Usage / Dev Tools: `docs/knowledge/02-Features/DevTools/ApiUsage.md`

## Waitlist launch behavior (2026-07-06)

When `REACT_APP_WAITLIST_MODE=true`:

- `/` shows **modular waitlist landing** (`WaitlistLanding.jsx` + `components/waitlist/landing/*`): full-width brand top bar, equal-height hero split, premium pricing, **4-phase launch ladder** (access → launch → rollout → expand)
- Wordmark in nav/footer links to `/brand` — **WaitlistBrand** for public waitlist visitors (theme synced with landing via `aiimin-waitlist-theme`); system OAuth brand at `/brand/system` or `/brand` when user has app access
- **Pricing policy:** Pro founding ₹49/mo (~17% off ₹59) for waitlist; Elite founding ₹79/mo (~20% off ₹99); complimentary Core at launch; Core standard ₹29/mo
- Primary CTA copy: **Reserve my spot** — nav outline button, form solid submit
- Mobile desktop-notice inside hero container; hidden on desktop
- Signup returns waitlist position + referral code; post-signup share (WhatsApp/X/copy) + inline feature vote; returning visitors restored from `localStorage` key `aiimin_waitlist`
- Social proof counter only renders when signup count ≥ 100
- Go-live target: end of September 2026. Tester registration closes 31 July.
- Fonts on landing: Familjen Grotesk + Figtree + JetBrains Mono. Canonical/OG: `aiimin.in`, `og-image-v2.png`
- Dev/tester emails in `DEV_EMAILS` / `TESTER_EMAILS` get elite tier + full app access
- Public sign-in without allowlist → pending screen

Pricing (landing copy): Explore (free), Core ₹29/mo, Pro ₹59/mo (₹49 founding for waitlist), Elite ₹99/mo (₹79 founding for waitlist).

Apply `server/migrations/034_waitlist_referrals.sql` for referral_code / referred_by columns — **applied on Supabase 2026-07-06**.

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
- LC-12: Complete onboarding test — API URL + session token fixes deployed 2026-07-07 (see Waitlist changelog)
- LC-13: Legal/data-deletion E2E test
- LC-14: Launch-day monitoring protocol

## Environment Matrix (Critical)

- Auth (Supabase): `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Data: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Billing: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_CORE`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET`
- Email: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO` (Resend — SES removed)
- Runtime: `CRON_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- AI/Analytics: `GEMINI_API_KEY`, `GROQ_API_KEY`, `NVIDIA_API_KEY`, `REACT_APP_GA_MEASUREMENT_ID`
- Cricket: `CRICAPI_KEY`, `RAPIDAPI_CRICKET_KEY`, `RAPIDAPI_CRICKET_HOST` (set in `.env` — never commit values)

## Chronology Rule (Append-Only)

Never delete prior context from entity changelogs. Add a new dated entry that states:

1. what changed
2. why it changed
3. which files changed
4. current status
