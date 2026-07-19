# Current Context

> **Handoff ready.** New chat: read Home → this file → [[17_NATIVE_APP_V2/WORKFLOW-PLAN]]

**Date:** 2026-07-19

## Repo structure (locked)

**One repo · three clients · never mix commits**

| Client | Path | Branch |
|--------|------|--------|
| Web Life OS | `frontend/` | `main` |
| Capacitor `/m` | `frontend/android/`, `components/mobile/` | `feat/mobile-capture-capacitor` |
| Native Android V2 | `native-android/` | feature branch |

Docs: `docs/knowledge/02_ARCHITECTURE/Monorepo.md` · `CONTRIBUTING.md` · root `README.md` overhauled.

## Git ship

- `main` @ website commits (pushed)
- `feat/mobile-capture-capacitor` @ native + Capacitor (pushed)
- Build artifacts stripped from `native-android/` index (this session)

## Next

1. Merge mobile branch when founder approves
2. Native smoke: offline journal → sync → desktop verify
3. Supabase migration `20260719_mobile_sync.sql`

## Locks

Palette · no auth/schema without ask · no tool attribution in docs · commit/push on ask
