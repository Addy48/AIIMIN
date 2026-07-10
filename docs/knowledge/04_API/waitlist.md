# API — Waitlist

## Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/waitlist/count` | Public | Signup count for social proof |
| POST | `/api/waitlist` | Public | Signup; returns position, referral_code, etc. |
| POST | `/api/waitlist/feedback` | Public/session as implemented | Feature vote / feedback |

## Files

- `server/routes/waitlist.js`
- Feature: [[09_FEATURES/Waitlist/Waitlist]]
- Table: [[03_DATABASE/waitlist_emails]]
