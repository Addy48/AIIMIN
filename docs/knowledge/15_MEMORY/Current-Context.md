# Current Context

> **Handoff ready.** New chat: read Home → this file → [[17_NATIVE_APP_V2/WORKFLOW-PLAN]]

**Date:** 2026-07-19 · **APK:** `2.2.1-native` · **Branch:** `main`

## Device

- Phone: OnePlus AIN065 (`9597fdea`) — signed release installed
- APK: `native-android/dist/app-release-2.2.1-native.apk`

## Functional status

- Native app: auth, bootstrap, journal/notes/habits outbox, WorkManager sync, biometric gate
- **Prod API:** `GET /api/mobile/health` OK · `POST /api/mobile/sync/batch` → 401 without auth
- Supabase: `mobile_sync` + RLS deny-all on mobile tables (server-only via service role)
- Launcher: official Editor Pick mark (`ic_aiimin_mark`)

## Next

1. Play Console internal track upload
2. Founder smoke: offline journal → sync → desktop verify

## Touch

- `native-android/dist/app-release-2.2.1-native.apk`
- `docs/knowledge/17_NATIVE_APP_V2/WORKFLOW-PLAN.md`

Palette · `/m` capture on phone web · no auth/schema without ask · no tool attribution in docs
