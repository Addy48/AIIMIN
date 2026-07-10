# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-11

## Today

Working on: **Login/signup a11y** — Selfloop QA: OS-ID/EMAIL + signup fields missing from a11y tree.

## Working on

- `Login.jsx` `Field`: native input + real placeholder; drop overlay; opacity locked at 1 on step motion
- Auth vault changelog + manifest status

## Recent decisions

- Fake placeholder overlay (`placeholder=" "` + absolute div) = Selfloop cannot find textbox. Match WaitlistForm pattern.
- Step motion must never use `opacity: 0` (Chrome drops those nodes from a11y tree)
- Vault = OS for Cursor/Claude/GPT, not note dump

## Files modified (this effort)

- `frontend/src/pages/Login.jsx`
- `docs/knowledge/09_FEATURES/Auth/Auth.md`
- `docs/knowledge/_manifest.json`
- `docs/knowledge/09_FEATURES/Waitlist/Changelog.md` (cross-note)

## Known issues

- Fix local until Vercel deploy; re-run Selfloop after ship
- Not every table/endpoint has own page yet — create when touched

## Next step

1. Deploy frontend (Vercel) with Login.jsx a11y fix
2. Re-run Selfloop on `/login` + signup step 1 — expect `textbox` roles for OS-ID / EMAIL, Full Name, Recovery Email
3. Commit when user asks
