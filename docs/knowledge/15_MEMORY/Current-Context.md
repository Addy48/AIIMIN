# Current Context

> **Handoff ready.** New chat: read Home → this file → [[17_NATIVE_APP_V2/WORKFLOW-PLAN]]

**Date:** 2026-07-19 · **APK:** `2.2.0-native` · **Branch:** `main` (post-merge)

## Repo structure (locked)

**One repo · three clients · never mix commits**

| Client | Path | Branch |
|--------|------|--------|
| Web Life OS | `frontend/` | `main` |
| Capacitor `/m` | `frontend/android/`, `components/mobile/` | `main` |
| Native Android V2 | `native-android/` | `main` |

Docs: `docs/knowledge/02_ARCHITECTURE/Monorepo.md` · `CONTRIBUTING.md` · root `README.md`

## Functional status

- Native app: auth, bootstrap, journal/notes/habits outbox, WorkManager sync, biometric gate
- **Prod API:** `GET /api/mobile/health` OK · `POST /api/mobile/sync/batch` → 401 without auth
- Supabase: `mobile_sync` migration applied (`mobile_devices`, `mobile_idempotency`)
- EC2: permanent deploy via `main` push (replaces hot-patch)

## Next

1. Run `bash scripts/verify-repo.sh` before ship claims
2. GitHub keystore secrets → signed Play APK
3. RLS for `mobile_devices` / `mobile_idempotency`
4. P1 backlog: `plans/repo-fix-master-plan.md`

## Touch

- `docs/knowledge/16_DOCUMENTATION/Skills-Registry.md`
- `plans/repo-fix-master-plan.md`
- `scripts/verify-repo.sh`

Palette · `/m` capture on phone web · no auth/schema without ask · no tool attribution in docs
