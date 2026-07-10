# API — Sports

## Routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/sports` | Required |
| POST | `/api/sports/refresh` | Required |
| POST | `/api/sports/refresh/system` | `CRON_SECRET` Bearer |

## Files

- `server/routes/sports.js`
- Feature: [[09_FEATURES/Sports/Sports]]
