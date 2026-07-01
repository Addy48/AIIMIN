# Waitlist Changelog

## 2026-07-05

- Removed: all Clerk auth integration (frontend SDK, backend JWT verify, env-based Clerk ID gates)
- Why: Clerk project deleted; migrating to AWS Cognito; waitlist uses email allowlist only
- Files: `frontend/src/context/AuthContext.jsx`, `frontend/src/App.js`, `frontend/src/pages/Login.jsx`, `server/middleware/auth.js`, `server/services/accessService.js`, `server/routes/auth.js` (`GET /auth/access`), deleted `ClerkAuthContext.jsx`, `clerkUserId.js`
- Status: local; push + redeploy Vercel/EC2 when ready

## 2026-07-04

- Added: required first name + OS-ID username reservation on waitlist signup
- Why: exclusive waitlist perk; lock usernames before launch; improve owner notifications
- Files: `server/migrations/031_waitlist_username_reservation.sql`, `server/routes/waitlist.js`, `server/middleware/validate.js`, `frontend/src/components/waitlist/WaitlistForm.jsx`, `frontend/src/pages/WaitlistLanding.jsx`, `server/lib/emailTemplates.js`, `scripts/seed-access-allowlist.mjs`, `deploy/.env.production.example`
- Status: shipped; run migration 031 on RDS before deploy

## 2026-07-04 (access + security)

- Added: dev/tester email allowlist seeded (1 dev, 4 testers + 3 future slots documented)
- Added: `feedbackLimiter` on public feedback endpoints; HTML escape on owner emails
- Removed: debug agent ingest calls from `wealth.js` and `validate.js`
- Files: `server/middleware/rateLimiter.js`, `server/routes/feedback.js`, `server/routes/wealth.js`, `server/services/accessService.js` (unchanged — env-driven)
- Status: shipped

## 2026-07-04 (reserved username auto-apply)

- Added: on sign-in/sign-up, if email matches `waitlist_emails`, auto-set `users.username` from `reserved_username` when user has no username yet
- Why: honor waitlist OS-ID reservations without manual admin steps
- Files: `server/services/userProfileService.js` (`applyReservedUsernameFromWaitlist`), `server/middleware/auth.js`
- Status: live
