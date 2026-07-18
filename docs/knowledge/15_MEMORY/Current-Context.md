# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-19

## Today (this chat — closed)

- Touch audit pass: `mobileTouchTargets.css` + `Touch-Audit.md`
- Inventory: `plans/uncommitted-inventory-2026-07-19.md` (180 paths)
- Dev APK built; `capacitor.config.json` **restored** to `https://aiimin.in/m`
- Commit/push plan: `plans/commit-push-plan-2026-07-19.md`
- **Nothing committed/pushed** — awaiting explicit user ask

## Next (new chat)

1. **Mobile:** USB debug → `adb install` → smoke `/m` (dev: `cap:dev:phone` + LAN server)
2. **Website first:** W1–W4 on `main` per commit plan → push → Vercel + EC2
3. **Mobile branch:** `feat/mobile-capture-capacitor` M1 then M2 → merge after frontend deploy
4. SeedData stays for QA · Play Store later

## Touch

- `plans/commit-push-plan-2026-07-19.md`
- `plans/mobile-commit-split.md`
- `docs/knowledge/09_FEATURES/Mobile/Touch-Audit.md`

## Locks

- Palette LOCKED · `/m` capture-only · no auth/schema without ask
- Never mix website + mobile in one commit
