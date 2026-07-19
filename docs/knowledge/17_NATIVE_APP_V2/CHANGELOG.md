# Native Compose Android — Phase 1 changelog

## 2026-07-19 — v2.2.0 full UI audit pass

- **What:** Dark-mode PIN/auth, theme tokens, ScreenChrome safe areas, Journal/Notes layout fixes, copy polish. See [[UI-AUDIT]].
- **Files:** `PinComponents.kt`, `AuthScreen.kt`, `Theme.kt`, `ScreenChrome.kt`, `JournalScreen.kt`, `NotesScreen.kt`, `HomeScreen.kt`, `MoreScreen.kt`, sub-screens
- **Status:** audit fixes shipped locally

## 2026-07-19 — v2.1.8 release CI + deploy checklist + welcome polish

- **What:** CI uploads unsigned release APK; `README.md`; vault deploy note; WelcomeGate feature rows.
- **Files:** `native-android.yml`, `WelcomeGate.kt`, `native-android/README.md`, `07_DEPLOYMENT/Native-Android-API.md`
- **Status:** P3-6 partial; EC2 blocked until push

## 2026-07-19 — v2.1.7 WorkManager offline sync queue

- **What:** `SyncWorker` flushes outbox when network available; periodic 15m + immediate on `syncNow()`. Pending count in banner.
- **Files:** `SyncWorker.kt`, `SyncWorkScheduler.kt`, `SyncEngine.kt`, `SyncBanner.kt`, `Database.kt`
- **Status:** P3-5 complete; prod `sync/batch` 404 until EC2 deploy

## 2026-07-19 — v2.1.6 biometric unlock + journal mode chips

- **What:** `BiometricGateScreen` on cold start / resume when enabled. Settings → Security toggle. Journal FilterChips for entry modes.
- **Files:** `BiometricGateScreen.kt`, `BiometricHelper.kt`, `MainActivity.kt`, `SettingsScreen.kt`, `JournalScreen.kt`, `AppPrefs.kt`
- **Status:** P3-4 complete

## 2026-07-19 — v2.1.5 CI workflow + release signing hook

- **What:** GitHub Actions `native-android.yml` (debug artifact every push; signed release on manual dispatch). Env-based `signingConfigs.release`. CI-safe `gradle.properties`.
- **Files:** `.github/workflows/native-android.yml`, `app/build.gradle.kts`, `gradle.properties`, `WORKFLOW-PLAN.md`
- **Status:** P3-6 partial — needs keystore secrets for signed APK

## 2026-07-19 — v2.1.4 signup tier + Life Arc + workflow dashboard

- **What:** `WORKFLOW-PLAN.md` sidebar dashboard. Sign-up steps: tier cards (Pro default) + Life Arc skip/continue. `SignupExtras.kt`.
- **Files:** `WORKFLOW-PLAN.md`, `SignupExtras.kt`, `AuthScreen.kt`, `00_INDEX.md`, `00_HOME.md`
- **Status:** P2 complete; P3 next

## 2026-07-19 — v2.1.3 sync fix + theme toggle

- **What:** `syncAll()` resilient to batch 404. Theme System/Light/Dark in Settings. Vault EmptyStates. Notes draft autosave. Nav bar polish.
- **Files:** `MobileRepository.kt`, `AppPrefs.kt`, `MainActivity.kt`, `SettingsScreen.kt`, `AiiminRoot.kt`, `VaultScreen.kt`, `NotesScreen.kt`
- **Status:** partial — sign-up tiers, server batch deploy if needed

## 2026-07-19 — v2.1.2 discipline/focus/settings/journal detail

- **What:** `AppPrefs` DataStore. Discipline toolkit timers + streak. Focus Stats tab. Journal detail. Native Settings.
- **Files:** `AppPrefs.kt`, `DisciplineUrgeScreen.kt`, `FocusTimerScreen.kt`, `JournalDetailScreen.kt`, `SettingsScreen.kt`, `HomeScreen.kt`, `MoreScreen.kt`
- **Status:** partial — sign-up tiers, notes autosave, server sync for focus/discipline still open

## 2026-07-19 — v2.1.1 sync banner + screen polish

- **What:** `SyncBanner` + `SyncUiState`. Home habit chips. Journal voice timer/waveform. More 2-col grid. Focus preset grid. Goals real progress from meta.
- **Why:** P1 week-1 closeout per workflow plan.
- **Files:** `SyncBanner.kt`, `RecordingWaveform.kt`, `MobileRepository.kt`, `HomeScreen.kt`, `JournalScreen.kt`, `MoreScreen.kt`, `FocusTimerScreen.kt`, `GoalsLiteScreen.kt`, `NotesScreen.kt`, `VaultScreen.kt`
- **Status:** partial — P2 discipline toolkit, focus stats, settings still open
- **Notes:** Discipline/focus streak on Home shows `—` until bootstrap exposes those fields.

## 2026-07-19 — Workflow plan + v2.1.0 polish batch

- **What:** Living `WORKFLOW-PLAN.md`. P0: orange adaptive icon, M3 buttons (no washout), auth Continue always enabled. P1: EmptyState, Welcome trim, Home life-score arc, Notes/Vault/Goals/Discipline/Journal polish.
- **Why:** Founder production plan — rigorous tracking, no empty black screens, fix button/icon blockers.
- **Files:** `WORKFLOW-PLAN.md`, `EmptyState.kt`, `AiiminButtons.kt`, `WelcomeGate.kt`, `HomeScreen.kt`, `NotesScreen.kt`, `VaultScreen.kt`, `GoalsLiteScreen.kt`, `DisciplineUrgeScreen.kt`, `JournalScreen.kt`, `res/mipmap-*`, `colors.xml`
- **Status:** partial — build+install OK; auth stay-on-Home + full PRD screens still open per workflow
- **Notes:** API plan `/mobile/home` etc. = `IN_CONFLICT`; use `bootstrap` until server split.

## 2026-07-19 — Auth session fix (v2.0.6)

- **What:** Login bounce fixed. Root cause: custom `CookieJar` never sent cookies on follow-up requests (`loadForRequest` keyed by host only). Also parse Better Auth JSON `token` from sign-in body; single shared OkHttp client; bearer from cookie jar when needed; `validateSession` only clears on 401; less splash flicker after sign-in.
- **Why:** Founder: loading spinner then back to login — session saved but bootstrap 401 → wipe.
- **Files:** `ApiModels.kt`, `MobileRepository.kt`, `AppContainer.kt`, `MainActivity.kt`, `SessionStore.kt`
- **Status:** shipped — `assembleDebug` exit 0 · `adb install` Success
- **Notes:** Proof = sign in → stay on Home with name/habits.

## 2026-07-19 — Auth fix + form UI polish (v2.0.5)

- **What:** Fixed sign-in/sign-up not completing: `LaunchedEffect` had `loading` in keys → coroutine cancelled mid-auth when PIN hit 6 digits. Session token now resolved via `set-auth-token` header → cookie jar → `GET /auth/get-session` (no bogus `cookie-session` bearer). Auth form UI matches welcome gate: orange hero strip, raised white card, `AiiminPrimaryButton`, M3 colors.
- **Why:** Founder: login/signup broken, auth form looked prototype-tier vs welcome screen.
- **Files:** `ApiModels.kt`, `MobileRepository.kt`, `AuthScreen.kt`, `app/build.gradle.kts` (2.0.5-native)
- **Status:** partial — code shipped locally; device smoke pending (`assembleDebug` blocked here: JDK 11 only, needs Java 17)
- **Notes:** Proof bar = welcome → OS-ID+PIN → Home with real name/habits on physical device.

## 2026-07-19 — Welcome gate + session validation (v2.0.4)

- **What:** First screen is now a branded welcome gate (hero + value props + bottom CTA deck): **Sign in**, **Create free account**, **Continue with Google**. Form auth is secondary (back from welcome). Cold start runs `validateSession()` — invalid token cleared, user lands on welcome not fake Home. Sign-in/sign-up rollback session if bootstrap fails. Branded splash during session check.
- **Why:** Founder: no login buttons on main page, app felt like prototype; top apps put primary CTAs in thumb zone before forms.
- **Files:** `WelcomeGate.kt`, `AuthScreen.kt`, `BrandedSplash.kt`, `MainActivity.kt`, `MobileRepository.kt`, `AiiminButtons.kt`
- **Status:** shipped — `assembleDebug` exit 0 · `adb install` Success on AIN065
- **Notes:** Google still opens `aiimin.in/login` in Custom Tabs (no deep link return yet).

## 2026-07-19 — Auth UX rebuild (website parity)

- **What:** Replaced bare email/password auth screen. Ivory `#EDE4D3` canvas, Arch Bracket mark, Sign in / Sign up tabs, OS-ID or email → 6-digit PIN numpad (dots + shake), signup steps Info → OS-ID → PIN → Confirm. Resolve via `GET /auth/resolve`. CookieJar + bearer for session. Google opens Custom Tabs to `aiimin.in/login`. Forced light theme on auth.
- **Why:** Founder rejected generic auth UI; native must match website OS-ID + PIN flow and brand.
- **Files:** `native-android/.../ui/auth/*`, `ui/brand/ArchBracketMark.kt`, `MobileRepository.kt`, `ApiModels.kt`, `MainActivity.kt`, `Theme.kt`
- **Status:** partial — UI+flow shipped on device v2.0.2; Google OAuth deep-link return still website handoff
- **Notes:** Token-paste escape hatch removed from primary UI.

## 2026-07-19 — Prod sync live + voice journal + More shells

- **What:** Applied `mobile_devices`/`mobile_idempotency` migration. Deployed `/api/mobile` to EC2 (`health` ok on `api.aiimin.in`). Hardened sync SQL to real columns (`encrypted_content`, notes `body_text`/`content`, calendar `start_time`, habit status `completed`). Debug APK uses prod API. Journal voice bar (SpeechRecognizer). More: Goals lite, Focus timer, Discipline urge sheet. Installed on device AIN065.
- **Why:** Same Better Auth user must sync phone ↔ desktop; emulator URL blocked physical device.
- **Files:** `server/routes/mobile.js`, `api/index.js` (EC2 patched), `native-android/**`, `supabase/migrations/20260719_mobile_sync.sql`
- **Status:** partial — prod endpoints live; sign-in round-trip smoke still needs founder credentials on device
- **Notes:** Hot-deployed to EC2; commit/push still pending user ask. Capacitor `frontend/android/` remains legacy.

## 2026-07-19 — Phase 1 walking skeleton (Compose)

- **What:** New `native-android/` Jetpack Compose app (not Capacitor). Tabs Home · Journal · Notes · Vault · More. Same Better Auth user as website via `GET /api/mobile/bootstrap` + `POST /api/mobile/sync/batch` + Room outbox. Vault lists family docs, Drive status, resume download links. Habit tick / journal / notes enqueue offline then flush.
- **Why:** User rejected WebView of `/m`; want native companion synced to desktop OS id.
- **Files:** `native-android/**`, `server/routes/mobile.js`, `api/index.js` (`mobile` route), `supabase/migrations/20260719_mobile_sync.sql` (apply when approved)
- **Status:** partial — debug APK builds; migration not applied; OAuth Custom Tabs / voice journal / Focus-Discipline not shipped
- **Notes:** Package `in.aiimin.app` (Kotlin backticks). Capacitor `frontend/android/` = legacy capture shell only.
