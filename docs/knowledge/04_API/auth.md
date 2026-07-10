# API — Auth

## Notable routes

| Method | Path | Notes |
|--------|------|-------|
| Better Auth handlers | `/api/auth/*` | Session + Google callback under Better Auth |
| GET | `/api/auth/me` | Current user |
| GET | `/api/auth/resolve` | Access resolution |
| POST | `/api/auth/complete-google-profile` | Profile completion |

## Warning

Login Google callback ≠ calendar Google callback. See [[02_ARCHITECTURE/Authentication]].

## Files

- `server/routes/auth.js`
- Feature: [[09_FEATURES/Auth/Auth]]
