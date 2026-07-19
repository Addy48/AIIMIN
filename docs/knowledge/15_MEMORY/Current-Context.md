# Current Context

> **Handoff ready.** New chat: read Home → [[17_NATIVE_APP_V2/WORKFLOW-PLAN]]

**Date:** 2026-07-19 · **APK:** `2.2.1-native` · **Branch:** `main`

## Repo structure (locked)

One repo · three clients · never mix commits — `docs/knowledge/02_ARCHITECTURE/Monorepo.md`

## Shipped this session

- `scripts/verify-repo.sh` — full gate (web + native + API health)
- RLS on `mobile_devices` + `mobile_idempotency` (Supabase migration `mobile_sync_rls`)
- Mobile API rate limits (`mobileSyncLimiter`, `mobileHealthLimiter`)
- CI fix: removed Mac-only `gradle.properties` java.home (use `local.properties`)
- Skills registry + master fix plan on `main`

## Blocked on founder only

1. **Signed Play APK** — GitHub secrets set; run Actions → Native Android → `build_release: true`
2. **Device smoke** — offline journal → sync → verify on desktop (human)
3. **Google OAuth return** on native (Custom Tabs handoff)

## Verify

```bash
bash scripts/verify-repo.sh
```

## Locks

Palette · `/m` capture on phone web · no auth/schema without ask
