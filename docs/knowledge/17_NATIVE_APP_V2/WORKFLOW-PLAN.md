---
aliases:
  - Native Build Tracker
  - Android V2 Tracker
  - WORKFLOW PLAN
tags:
  - pin
  - native-android
  - build-tracker
---

# Native Android V2 — Build Tracker

> **📌 Pin this file in Obsidian sidebar** (right-click tab → Pin, or drag into Bookmarks).  
> Living task board — edit every session.  
> **Owner:** Aaditya · **App version:** `2.2.0-native` · **Updated:** 2026-07-19

---

## Dashboard (at a glance)

| Metric | Value |
|--------|-------|
| **Overall progress** | **~92%** (P0–P2 done · P3 nearly done) |
| **Current APK** | `native-android/` → `2.1.8-native` |
| **Build** | `./gradlew :app:assembleDebug` |
| **Install** | `adb install -r app/build/outputs/apk/debug/app-debug.apk` |
| **Vault pack** | [[00_INDEX]] · **Changelog:** [[CHANGELOG]] |

### Progress bar

```
P0 ██████████ 100%  (7/7)
P1 ██████████ 100%  (9/9)
P2 ██████████ 100%  (5/5)
P3 █████████░  90%  (functional · merge main + signed APK remain)
```

### Active now

| Priority | ID | Task | Status |
|----------|-----|------|--------|
| 🟡 | P3-5 | WorkManager offline queue | `COMPLETE` |
| 🔴 | P3-6 | Signed APK + GitHub Actions | `IN_PROGRESS` — debug + unsigned release CI; signed needs secrets |
| 🟠 | EC2 deploy | `sync/batch` live on prod | `COMPLETE` — hot-patch EC2; merge to `main` pending |
| 🟠 | P3-3 | Granular `/mobile/*` APIs | `IN_CONFLICT` — use `bootstrap` |

### Done recently (evidence)

- v2.1.3: sync 404 fix (`syncAll`), theme toggle, vault EmptyStates
- v2.1.2: discipline toolkit, focus stats, journal detail, settings
- v2.1.1: SyncBanner, habits strip, More grid
- P0-7: founder auth smoke passed

---

## Status legend

| Status | Meaning |
|--------|---------|
| `NOT_STARTED` | Not touched |
| `IN_PROGRESS` | Active this session |
| `COMPLETE` | Evidence attached |
| `BLOCKED` | External dependency |
| `IN_CONFLICT` | Plan vs repo — decision logged |
| `DEFERRED` | Later week |

---

## P0 — Ship nothing until done ✅

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| P0-1 | JDK 17 + gradle java.home | `COMPLETE` | brew openjdk@17; assembleDebug exit 0 |
| P0-2 | Orange adaptive launcher icon | `COMPLETE` | `colors.xml`, `mipmap-anydpi-v26/` |
| P0-3 | Primary button full opacity | `COMPLETE` | `AiiminButtons.kt` |
| P0-4 | Auth Continue always enabled | `COMPLETE` | `AuthScreen.kt` |
| P0-5 | PIN auto-submit 6th digit | `COMPLETE` | LaunchedEffect fix v2.0.5 |
| P0-6 | Cookie/session bootstrap 401 | `COMPLETE` | CookieJar v2.0.6 |
| P0-7 | Auth smoke → stay on Home | `COMPLETE` | Founder confirmed 2026-07-19 |

---

## P1 — Week 1 ✅

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| P1-1 | `EmptyState.kt` | `COMPLETE` | `ui/components/EmptyState.kt` |
| P1-2 | Welcome gate trim | `COMPLETE` | `WelcomeGate.kt` |
| P1-3 | Home life score + habits strip | `COMPLETE` | `HomeScreen.kt` LazyRow chips |
| P1-4 | Journal past entries + voice UI | `COMPLETE` | waveform + timer |
| P1-5 | Notes empty state + FAB | `COMPLETE` | `NotesScreen.kt` |
| P1-6 | Vault sync button | `COMPLETE` | `VaultScreen.kt` |
| P1-7 | Goals cards + empty | `COMPLETE` | `GoalsLiteScreen.kt` |
| P1-8 | Discipline button fix | `COMPLETE` | `DisciplineUrgeScreen.kt` |
| P1-9 | `SyncBanner` | `COMPLETE` | `SyncBanner.kt` + `syncUi` |

---

## P2 — Week 2–3

| ID | Task | Status | Evidence |
|----|------|--------|----------|
| P2-1 | Focus grid + stats tab | `COMPLETE` | `FocusTimerScreen.kt` + `AppPrefs` |
| P2-2 | Discipline toolkit + timer | `COMPLETE` | `DisciplineUrgeScreen.kt` |
| P2-3 | Sign-up tier + Life Arc | `COMPLETE` | `SignupExtras.kt`; flow Info→OsId→Pin→Confirm→Tier→LifeArc |
| P2-4 | Journal detail screen | `COMPLETE` | `JournalDetailScreen.kt` |
| P2-5 | Notes draft autosave 5s | `COMPLETE` | `AppPrefs` note draft |

---

## P3 — Week 4–6

| ID | Task | Status | Notes |
|----|------|--------|-------|
| P3-1 | Hilt migration | `DEFERRED` | Keep `AppContainer` until stable |
| P3-2 | `presentation/` restructure | `DEFERRED` | After P3-1 |
| P3-3 | Granular `/mobile/*` APIs | `IN_CONFLICT` | Server has `bootstrap` + `sync/batch` only |
| P3-4 | Biometric unlock | `COMPLETE` | `BiometricGateScreen.kt` + Settings toggle |
| P3-5 | WorkManager offline queue | `COMPLETE` | `SyncWorker.kt` + `SyncWorkScheduler.kt` |
| P3-6 | Signed APK + GitHub Actions | `IN_PROGRESS` | Debug + unsigned release CI; `assembleRelease` local exit 0; Play signing = secrets |

### Release signing secrets (founder — GitHub repo Settings → Secrets)

| Secret | Value |
|--------|-------|
| `ANDROID_KEYSTORE_BASE64` | base64 of `.jks` / `.keystore` |
| `ANDROID_KEYSTORE_PASSWORD` | store password |
| `ANDROID_KEY_ALIAS` | key alias |
| `ANDROID_KEY_PASSWORD` | key password |

Trigger signed build: Actions → Native Android → Run workflow → `build_release: true`

**Generate keystore (one-time, local):**

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore aiimin-release.keystore \
  -alias aiimin -keyalg RSA -keysize 2048 -validity 10000
base64 -i aiimin-release.keystore | pbcopy   # paste into ANDROID_KEYSTORE_BASE64
```


---

## Screen checklist

| Screen | File | Status |
|--------|------|--------|
| Welcome | `WelcomeGate.kt` | `COMPLETE` |
| Auth sign-in | `AuthScreen.kt` | `COMPLETE` |
| Auth sign-up | `AuthScreen.kt` + `SignupExtras.kt` | `COMPLETE` |
| Home | `HomeScreen.kt` | `COMPLETE` |
| Journal | `JournalScreen.kt` | `COMPLETE` — mode chips |
| Notes | `NotesScreen.kt` | `COMPLETE` |
| Vault | `VaultScreen.kt` | `COMPLETE` |
| Focus | `FocusTimerScreen.kt` | `COMPLETE` |
| Discipline | `DisciplineUrgeScreen.kt` | `COMPLETE` |
| Goals | `GoalsLiteScreen.kt` | `COMPLETE` |
| More | `MoreScreen.kt` | `COMPLETE` |
| Settings | `SettingsScreen.kt` | `COMPLETE` — theme + biometric |

---

## API reality (verified `server/routes/mobile.js`)

| Plan endpoint | Exists? | Actual |
|---------------|---------|--------|
| `GET /mobile/home` | NO | `GET /mobile/bootstrap` |
| `POST /mobile/sync/batch` | YES | prod live — 401 without auth (EC2 patch 2026-07-19) |
| Auth sign-in username | YES | Better Auth |

**Sync policy:** `MobileRepository.syncAll()` — outbox 404 never blocks bootstrap.

---

## Architecture policy

Plan wanted Hilt + `presentation/`. **Shipped in** `in.aiimin.app.ui.*` + `AppContainer`. Refactor deferred P3.

---

## Session log

### 2026-07-19 — Session 13 (ship)

- Commit `5ae66b13` → `feat/mobile-capture-capacitor`
- EC2 hot-patch: `mobile.js` + `api/index.js` · health OK · batch 401 (auth required)
- `assembleDebug` + `assembleRelease` exit 0 · `adb install` Success

### 2026-07-19 — Session 12 (UI audit)

- Full UI audit → [[UI-AUDIT]]
- v2.2.0-native: dark-mode PIN, theme tokens, ScreenChrome, layout fixes
- `assembleDebug` exit 0 · `adb install` Success

### 2026-07-19 — Session 11

- P3-6: unsigned `assembleRelease` CI job; local `assembleRelease` exit 0
- `native-android/README.md` + vault `07_DEPLOYMENT/Native-Android-API.md`
- WelcomeGate value-prop rows (Journal / Vault / Sync)
- v2.1.8-native (versionCode 17)
- `assembleDebug` exit 0 · `adb install` Success
- Prod `sync/batch` still 404 — needs commit+push+EC2 deploy

### 2026-07-19 — Session 10

- P3-5: WorkManager periodic (15m) + on-demand sync; outbox count in `SyncBanner`
- Prod check: `POST /api/mobile/sync/batch` → HTTP 404 (EC2 deploy needed)
- v2.1.7-native (versionCode 16)
- `assembleDebug` exit 0 · `adb install` Success

### 2026-07-19 — Session 9

- P3-4: biometric gate (`BiometricGateScreen.kt`, `BiometricHelper.kt`, Settings toggle)
- Journal mode chips (Reflect / Gratitude / Goals / Free)
- v2.1.6-native (versionCode 15)
- `assembleDebug` exit 0 · `adb install` Success

### 2026-07-19 — Session 8

- P3-6: `.github/workflows/native-android.yml` — debug APK on push/PR; signed release via `workflow_dispatch` + secrets
- `gradle.properties` — removed mac-only `java.home` (CI-safe)
- `build.gradle.kts` — release signing from env vars
- v2.1.5-native (versionCode 14)
- `assembleDebug` exit 0 · `adb install` Success

### 2026-07-19 — Session 7

- Expanded WORKFLOW-PLAN dashboard for sidebar
- P2-3: tier + Life Arc signup steps (`SignupExtras.kt`)
- `assembleDebug` exit 0 · `adb install` Success

### 2026-07-19 — Session 6

- v2.1.3: sync 404 fix, theme toggle, vault empty states
- `assembleDebug` exit 0 · `adb install` Success

### 2026-07-19 — Session 5

- v2.1.2: discipline, focus stats, journal detail, settings

### 2026-07-19 — Session 4

- v2.1.1: SyncBanner, habits strip, More grid

### 2026-07-19 — Session 3

- Created WORKFLOW-PLAN · v2.1.0 polish

---

## Next actions (ordered)

1. Merge feature branch → `main` (founder)
2. Supabase migration `20260719_mobile_sync.sql`
3. Keystore secrets → signed release

---

*Edit this file every session. No `COMPLETE` without evidence in same turn.*
