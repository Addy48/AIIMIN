# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-19

## Repo structure (locked)

**One repo · three clients · never mix commits**

| Client | Path | Typical branch |
|--------|------|----------------|
| Web Life OS | `frontend/` | `main` |
| Capacitor `/m` | `frontend/android/`, `components/mobile/` | `feat/mobile-capture-capacitor` |
| Native Android V2 | `native-android/` | feature branch (on mobile branch until merge) |

Docs: `docs/knowledge/02_ARCHITECTURE/Monorepo.md` · `CONTRIBUTING.md` · root `README.md` overhauled.

## Git ship

- `main` — website API + frontend polish (pushed)
- `feat/mobile-capture-capacitor` — Capacitor + native V2 + repo docs (pushed `0d6cff87`)

## Next

1. Merge `feat/mobile-capture-capacitor` when founder approves (brings native + `/m`)
2. Play signed APK + Supabase mobile migration

## Locks

Palette · `/m` capture on phone web · no auth/schema without ask · no tool attribution in public docs
