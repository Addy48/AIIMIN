# Product

## Snapshot

AIIMIN is a personal operating system for disciplined execution, reflection, and daily recovery. It combines logging, focus systems, accountability, sports/news context, and financial awareness into one dashboard.

## Target users

- Students and early-career builders managing high cognitive load
- People who want measurable daily routines and recovery loops
- Users who prefer practical coaching over vanity analytics

## Why it exists

- Reduce chaos by turning goals into daily behaviors
- Keep truth visible with real usage data
- Build long-term consistency through streaks, rituals, and feedback loops

## Build status (launch lens)

- Code progress: high for core product features
- Launch blockers: final env setup (GA4/Sentry), launch checklist verification, tester onboarding E2E

## Waitlist launch behavior

When `REACT_APP_WAITLIST_MODE=true`:

- `/` shows modular waitlist landing (`WaitlistLanding.jsx` + `components/waitlist/landing/*`)
- Wordmark links to `/brand` — WaitlistBrand for public visitors
- Pricing: Pro founding ₹49/mo; Elite founding ₹79/mo; complimentary Core at launch; Core standard ₹29/mo
- Primary CTA: **Reserve my spot**
- Signup returns position + referral code; `localStorage` key `aiimin_waitlist`
- Social proof only when signup count ≥ 100
- Go-live target: end of September 2026. Tester registration closes 31 July.
- Dev/tester emails get elite tier + full app access
- Public sign-in without allowlist → pending screen

Details: [[09_FEATURES/Waitlist/Waitlist]]

## Launch runbook (LC-01 to LC-14)

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

## Environment matrix (names only — no secrets)

- Auth: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `GOOGLE_LOGIN_CLIENT_ID`, `GOOGLE_LOGIN_CLIENT_SECRET`
- Google OAuth redirect (login): `{BETTER_AUTH_URL}/api/auth/callback/google`
- Frontend: `REACT_APP_API_URL`
- Data: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Billing: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_CORE`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET`
- Email: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`
- Runtime: `CRON_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- AI/Analytics: `GEMINI_API_KEY`, `GROQ_API_KEY`, `NVIDIA_API_KEY`, `REACT_APP_GA_MEASUREMENT_ID`
- Cricket: `CRICAPI_KEY`, `RAPIDAPI_CRICKET_KEY`, `RAPIDAPI_CRICKET_HOST`

## Chronology rule

Never delete prior context from entity changelogs. Append dated entries only.

## Related

- [[00_HOME]]
- [[09_FEATURES/Index]]
- [[07_DEPLOYMENT/Deploy]]
