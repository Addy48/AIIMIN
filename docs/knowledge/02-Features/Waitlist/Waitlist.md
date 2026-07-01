# Waitlist

## Current state

Public waitlist gate active when `REACT_APP_WAITLIST_MODE=true` (frontend) and `WAITLIST_MODE=true` (backend).

## Signup flow

1. User lands on `/` → `WaitlistLanding.jsx`
2. Form collects **email** (required), **first name** (required), **OS-ID reservation** (required, 8 chars)
3. `POST /api/waitlist` validates, checks username uniqueness against `waitlist_emails` + `users`
4. Confirmation email via SES with waitlist perks
5. Owner notified with name + reserved OS-ID

## Waitlist exclusives (documented + emailed)

| Perk | Detail |
|------|--------|
| OS-ID lock | 8-char username reserved at signup |
| Core free 3 months | Launch perk for waitlist signups |
| Early prototypes | Life Score, Discipline Engine, Cognitive Lab |
| Priority sports feed | Cricket, football, F1 briefings |
| Priority onboarding | Skip queue at September open |

## Pricing tiers (public)

| Tier | Price | Notes |
|------|-------|-------|
| Explore | Free | Limited usage |
| Core | ₹25/mo | Habits, sports, money OS |
| Pro | ₹61/mo | + Family Vault |
| Elite | ₹99/mo | Unlimited AI + priority |

## Access control (dev + testers)

| Role | Emails | Tier |
|------|--------|------|
| Dev (owner) | `aadityaupadhyay10@gmail.com` | Elite |
| Testers | `aadityaupadhyay85@gmail.com`, `sanchitbhatia2006@gmail.com`, `adityamehta298@gmail.com`, `shishangthakur@icloud.com` | Elite |

Seeded via `DEV_EMAILS` / `TESTER_EMAILS` env + `scripts/seed-access-allowlist.mjs` → `tester_allowlist` table.

## Related files

- `frontend/src/pages/WaitlistLanding.jsx`
- `frontend/src/components/waitlist/WaitlistForm.jsx`
- `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`
- `server/routes/waitlist.js`
- `server/services/accessService.js`
- `server/migrations/023_waitlist_emails.sql`
- `server/migrations/031_waitlist_username_reservation.sql`
- `deploy/.env.production.example`

## API

| Method | Path | Auth | Rate limit |
|--------|------|------|------------|
| GET | `/api/waitlist/count` | Public | General |
| POST | `/api/waitlist` | Public | 3/hr/IP |
| POST | `/api/waitlist/feedback` | Public | 10/hr/IP |
| GET | `/api/waitlist/list` | Owner | — |
| POST | `/api/waitlist/approve` | Owner | — |
