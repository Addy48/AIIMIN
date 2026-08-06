# Auth

## Current state

- Better Auth + Google OAuth for login
- Waitlist / allowlist access gates
- Calendar Google OAuth is separate integration
- Login/signup `Field` inputs are native textboxes with `htmlFor`/`id`, `name`, `aria-label`, and real `placeholder` (no fake overlay)
- Login PIN: 6 digits; CSS filled-circle masks; active-slot ring; equal-gap slots; plain `Del` numpad
- Sign-in rate limit: **30 / 15 min** (Hono credential limiter + Better Auth `/sign-in/**`)

## Contracts

- Login callback: `{BETTER_AUTH_URL}/api/auth/callback/google`
- Env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `GOOGLE_LOGIN_CLIENT_ID`, `GOOGLE_LOGIN_CLIENT_SECRET`
- Routes: see [[04_API/auth]]
- Login a11y: identifier / Full Name / Recovery Email / OS-ID must appear as `role=textbox` with accessible names matching placeholders (`OS-ID / EMAIL`, etc.)
- PIN step subtitle masks identity (`AA****37` / email) — never show raw OS-ID
- Login OS-ID → PIN only after `GET /auth/resolve` finds the user (404 stays on identifier step)
- Desktop: brand only on left panel; mobile (≤900px): brand on form panel

## Files

- `server/routes/auth.js`
- `server/lib/auth.js` (Better Auth rateLimit)
- `server/middleware/rateLimiter.js` (`authCredentialLimiter`)
- Frontend auth hooks/pages: `useAuth`, `Login.jsx`, `AuthCallback.jsx`

## Open risks

- Confusing login OAuth with calendar OAuth
- Waitlist mode access edge cases for returning users
- Selfloop re-run needed after Vercel + EC2 deploy for Login PIN visual/a11y proof
- Wrong PIN → still rejects (correct); rate limit no longer false-fails after ~5 QA attempts

## Related

- [[02_ARCHITECTURE/Authentication]]
- [[01_PRODUCT/Product]]
- [[11_BUGS/QA-Run-2026-07-14-Login]]

## Changelog

### 2026-07-18 — API data plane + P0 security harden
- **What:** Frontend supabase client now proxies table I/O through `/api/db` (Better Auth). Query-string session tokens removed. DB: DEFINER revoke, oauth PK, rateLimit table, hot FK indexes.
- **Why:** Audit FAIL #22 identity split + #12/#13 security
- **Files:** `frontend/src/utils/supabase.js`, `server/routes/db.js`, `server/lib/sessionResolve.js`, `server/lib/auth.js`, migrations 045–047, [[11_BUGS/Audit-Auth-DB-2026-07-18]]
- **Status:** partial — restart API required; budget category embeds stripped by shim
- **Notes:** Waitlist still uses `/api/waitlist` (not Data API).

### 2026-07-17 — Ghost OS-ID no longer opens PIN step
- **What:** Login only advances to PIN after `/auth/resolve` succeeds for an OS-ID. Unknown OS-ID stays on step 1 with “OS-ID not found…”. Email path unchanged (format check only).
- **Why:** Auto-advance at 8 chars skipped existence check — fake OS-IDs still asked for PIN
- **Files:** `frontend/src/pages/Login.jsx`, this note
- **Status:** local

### 2026-07-15 — Login Selfloop QA crush pass
- **What:** Pass 2 kills remaining partials: CTA chips (no fake hit area), Forgot as 48px surface button, dark-glass pills, stronger PIN borders/mask/active pulse, numpad **Clear\|0\|Del** (no empty cell), error `#991b1b`/`#fef2f2`, form subtitle `#1a1a1a`, rate-limiter `Retry-After`. Pass 1: sentence-case hero, mask identity, hide desktop form brand, Del text, limit 30/15m.
- **Why:** Selfloop `2026-07-14T20-06-37-663Z` + user demand to close partials honestly
- **Files:** `Login.jsx`, `AuthContext.jsx`, `rateLimiter.js`, `auth.js`, `11_BUGS/QA-Run-2026-07-14-Login.md`
- **Status:** shipped — EC2 `2c4e2691` health ok; Vercel READY `25cd5d03` on `aiimin.in`
- **Notes:** #41 wrong PIN still rejects. Selfloop re-run next.

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
