# Auth

## Current state

- Better Auth + Google OAuth for login
- Waitlist / allowlist access gates
- Calendar Google OAuth is separate integration
- Login/signup `Field` inputs are native textboxes with `htmlFor`/`id`, `name`, `aria-label`, and real `placeholder` (no fake overlay)

## Contracts

- Login callback: `{BETTER_AUTH_URL}/api/auth/callback/google`
- Env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `GOOGLE_LOGIN_CLIENT_ID`, `GOOGLE_LOGIN_CLIENT_SECRET`
- Routes: see [[04_API/auth]]
- Login a11y: identifier / Full Name / Recovery Email / OS-ID must appear as `role=textbox` with accessible names matching placeholders (`OS-ID / EMAIL`, etc.)

## Files

- `server/routes/auth.js`
- Frontend auth hooks/pages: `useAuth`, `Login.jsx`, `AuthCallback.jsx`

## Open risks

- Confusing login OAuth with calendar OAuth
- Waitlist mode access edge cases for returning users
- Re-run Selfloop after Vercel deploy to confirm textbox roles on `/login`

## Related

- [[02_ARCHITECTURE/Authentication]]
- [[01_PRODUCT/Product]]

## Changelog

### 2026-07-11 — Login Field a11y (Selfloop QA round 2)
- **What:** Removed Safari fake-placeholder overlay (`placeholder=" "` + absolute `div`). `Field` now uses a native `<input>` with real `placeholder`, stable `login-field-${name}` ids, `htmlFor`/`aria-label`, and step motion locked to `opacity: 1` (never 0).
- **Why:** Selfloop QA (9 high a11y flaws) found zero `textbox` roles on `/login` while waitlist native inputs appeared fine. Overlay + space placeholder left fields unnamed/undiscoverable; prior opacity animation also hid inputs from the tree.
- **Files:** `frontend/src/pages/Login.jsx`, `docs/knowledge/09_FEATURES/Auth/Auth.md`, `docs/knowledge/15_MEMORY/Current-Context.md`, `docs/knowledge/_manifest.json`
- **Status:** shipped
- **Notes:** Shipped `b4fe7963` — Vercel prod READY + EC2 API reload healthy. Re-run Selfloop on login + signup step 1. Do not restore placeholder overlay.

### 2026-07-10 — Vault Brain OS registration
- **What:** Auth feature MOC created under brain OS tree
- **Why:** Project Brain cutover
- **Files:** `docs/knowledge/09_FEATURES/Auth/Auth.md`
- **Status:** shipped
