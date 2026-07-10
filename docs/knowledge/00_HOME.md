# AIIMIN — Home

> **Agents: read this first.** Then `15_MEMORY/Current-Context.md`. Then only docs for the task. Never whole-repo scan unless user says so.

**Last updated:** 2026-07-10

## Project goal

Personal Life OS — daily metrics, money, calendar, focus, discipline, sports context, gamification. Browser dashboard. Owner: Aaditya Upadhyay.

## Current version / lens

- Waitlist gate live when `REACT_APP_WAITLIST_MODE=true`
- Go-live target: end Sep 2026; tester close 31 Jul
- Code progress: high; launch blockers: GA4/Sentry, LC checklist, tester E2E

## Current sprint

See [[12_SPRINTS/Sprint-Current]]

## Current blockers

- Final prod env (GA4, Sentry)
- Launch checklist LC-01..LC-14 verification
- Tester onboarding E2E

## Architecture (one screen)

- Frontend: React 19 + Tailwind — `frontend/`
- Backend: Node Express/Hono routes — `server/`
- DB: Supabase PostgreSQL
- Auth: Better Auth + Google OAuth
- Host: Vercel (frontend) + EC2/API (`api.aiimin.in`)
- Desktop `/` = full OS; Mobile `/m` = data capture only

Deep: [[02_ARCHITECTURE/Overview]]

## Important rules

Always-on Cursor rules (see `.cursor/rules/aiimin-always-index.mdc`):

1. Vault = source of truth. Update vault before task done.
2. Load order: Home → Current Context → feature/arch/DB/API → only needed source files.
3. Token discipline: no whole-repo scan unless user asks.
4. Color palette LOCKED — see [[08_DESIGN/Palette]]
5. Mobile = data collection only. No analytics/tools on `/m`.
6. No secrets in vault. No schema/auth changes without explicit user ask.
7. Commit / push / PR only when user explicitly asks.
8. Caveman chat; vault human docs = clear prose; AI packs in `15_MEMORY` = compressed.
9. Skills before acting. Sparring > blind agreement.
10. Long/confused/topic-change → **SWITCH CHAT**; use [[15_MEMORY/Handoff-Latest]] pack.

## Next tasks

- Keep Current Context fresh daily
- Fill remaining API/DB pages as features touch them
- Run launch checklist when ready

## Links

| Need | Path |
|------|------|
| Current context | [[15_MEMORY/Current-Context]] |
| Product | [[01_PRODUCT/Product]] |
| Architecture | [[02_ARCHITECTURE/Overview]] |
| Features index | [[09_FEATURES/Index]] |
| Design | [[08_DESIGN/Palette]] |
| Deploy | [[07_DEPLOYMENT/Deploy]] |
| Manifest | `_manifest.json` |
| Spec | `docs/superpowers/specs/2026-07-10-vault-brain-os-design.md` |
