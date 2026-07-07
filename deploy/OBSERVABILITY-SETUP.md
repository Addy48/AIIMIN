# LC-09 / LC-10 — Observability setup

Optional before waitlist launch. Required before September public launch.

## GA4 (LC-10)

1. Go to [Google Analytics](https://analytics.google.com/) → Admin → Create property **AIIMIN**
2. Add Web data stream for `https://www.aiimin.in`
3. Copy Measurement ID (`G-XXXXXXXXXX`)
4. Set on **Vercel** (Production):
   - `REACT_APP_GA_MEASUREMENT_ID=G-...`
5. Local: add to `frontend/.env.production` and run `node scripts/sync-react-env.mjs --force`
6. Redeploy Vercel (auto on push to `main`)

Events already wired: `usePageAnalytics.js`, `waitlist_signup` in `WaitlistForm.jsx`.

## Sentry (LC-09)

1. Create project at [sentry.io](https://sentry.io) → React
2. Copy DSN
3. Set on **Vercel** (Production):
   - `REACT_APP_SENTRY_DSN=https://...@....ingest.sentry.io/...`
4. Set on **EC2** `~/AIIMIN/.env`:
   - `SENTRY_DSN=` (same or server DSN)
5. Install SDK (when ready):
   ```bash
   cd frontend && npm install @sentry/react
   ```
   Then extend `frontend/src/utils/sentry.js` with `Sentry.init()`.

Currently `initSentry()` is a stub — errors are not sent until DSN + package are set.

## Verify

```bash
node scripts/sync-react-env.mjs --force
node scripts/launch-verify.mjs
```

Observability section should show ✅ when real IDs are set.
