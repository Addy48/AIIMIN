---
authority: engineering
derived_from: Genesis/P8 · Genesis/P9
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
migration_batch: W4
fm_source: script
---
# Native Compose Android — Phase 1 changelog

> [!tip] Size budget
> Append-only. When this file exceeds ~40 KB, roll older months to `CHANGELOG-2026H1.md` (Phase V3 policy).


### 2026-08-15 — Android Studio Lite in Cursor
- **What:** Cursor is the Android IDE path. Android Studio Lite (`krishna-kudari.android-studio-lite` 0.0.10) SDK paths, cmdline-tools, repo-root `gradlew` forwarder to `native-android-v3/`, `ANDROID_HOME`/`JAVA_HOME` for GUI Cursor. Runbook in Emulator-Workflow.
- **Why:** Founder: stay out of Android Studio.app; use the extension in detail.
- **Files:** `gradlew`, `.vscode/settings.json`, `.vscode/extensions.json`, `docs/knowledge/17_NATIVE_APP_V2/Emulator-Workflow.md`, User `settings.json`, `~/.zshrc`, `~/Library/LaunchAgents/in.aiimin.env.android.plist`
- **Status:** partial — extension installed · `avdmanager list avd` shows AiiminLean · Lite **Run** not executed (qemu already up; 8 GB RAM law)
- **Notes:** Ignore AVD `Medium_Phone_API_36.1`. Lite Run on USB AIN065 is the safe Gradle path.

### 2026-08-14 — Capture HOLD TO TALK alignment
- **What:** Hold-to-talk left the cramped Quick Starts cell (left-aligned `HOLD TO TALK` vs centered siblings). It is now a full-width centered bar inside THE LINE, 44dp min. Quick Starts are tap presets only (EXPENSE · NOTE · JOURNAL / SCAN · HABIT).
- **Why:** Founder screenshot — chip alignment on Capture.
- **Files:** `native-android-v3/feature/capture/src/main/kotlin/aiimin/feature/capture/CaptureScreen.kt`
- **Status:** partial — code written · **assemble blocked while AiiminLean qemu is up**
- **Notes:** Teal ring on the screenshot is emulator pinch-finger chrome, not app paint.

### 2026-08-14 — A6 `note.delete` on mobile batch
- **What:** Phone note delete now enqueues `note.delete` on `POST /mobile/sync/batch` (same `DELETE FROM notes WHERE id AND user_id` as web). Local hide label is `DELETED · SYNC WILL WIPE`. Bootstrap skips pending delete ids so a lagging pull cannot resurrect the row. Pending `note.upsert` for that id is dropped.
- **Why:** Leftover A6 was honest-hide only. Founder asked to continue leftover app work.
- **Files:** `server/routes/mobile.js`, `GraphSyncRepository.kt`, `NoteStore.kt`, `NotesViewModel.kt`, `GraphHydrateStoresTest.kt`, `OutboxSerializationTest.kt`
- **Status:** partial — `:core:data:testDebugUnitTest` GraphHydrateStoresTest + OutboxSerializationTest BUILD SUCCESSFUL · `:app:assembleDebug` BUILD SUCCESSFUL · APK 61M · **EC2 live via scp 2026-08-14 (not committed)** · device unverified
- **Notes:** No new table. FCM / Groq / Room / Billing / FI-burn still PARK.

### 2026-08-14 — Config minimums scroll · HC background honesty · emulator loop
- **What:** Config Daily minimums requests Today scroll to the same list (no dead-end toast). Config This phone shows `Steps · background` from `READ_HEALTH_DATA_IN_BACKGROUND`. Living leftover checklist. Emulator workflow (`AiiminLean`, `emu-run.sh`).
- **Why:** Founder asked to see the app without USB and keep a leftover list current; D3 was jump-only; HC background grant was silent.
- **Files:** `DayStore.kt`, `DayStoreTest.kt`, `TodayScreen.kt`, `TodayViewModel.kt`, `ConfigScreen.kt`, `ConfigViewModel.kt`, `DeviceMetricsRepository.kt`, `scripts/emu-run.sh`, `scripts/start-emulator.command`, `V3-LEFTOVER-CHECKLIST.md`, `Emulator-Workflow.md`
- **Status:** partial — `DayStoreTest` 7/7 · `:app:assembleDebug` BUILD SUCCESSFUL · APK 62M · **emu tab-walk next** · AIN065 unverified
- **Notes:** Do not Gradle while qemu is up on 8 GB. FCM / Groq / Room / Billing / `note.delete` still PARK.

### 2026-08-13 — Hold-to-talk · Glance Day widget · Goals list
- **What:** Capture VOICE is hold-to-talk (steel fill, `m:ss`, release into composer, never auto-Settle; empty → `VOICE · OFFLINE`). Home Glance widget: OS-ID · server score · steps · screen (steel, no purple). Config Goals lists bootstrap goals; edit on web. Core app-unlocks now names the widget because it exists.
- **Why:** Founder keep-going — A2 half-done as system RecognizerIntent; widget was a lie-or-build fork; goals DTO unused.
- **Files:** `VoiceCapture.kt`, `VoiceSpeech.kt`, `CaptureScreen.kt`, `CaptureViewModel.kt`, `DayGlanceWidget.kt`, `WidgetBridge.kt`, `WidgetSnapshotStore.kt`, `GoalsScreen.kt`, `VaultListStore.kt`, `AiiminApplication.kt`, `AndroidManifest.xml`
- **Status:** partial — data 130/130 · capture 18/18 · network 3/3 · `:app:assembleDebug` BUILD SUCCESSFUL · APK 61M · **device unverified**
- **Notes:** Widget score is published LHS only. FCM / Room / Billing / Groq / `note.delete` still D4/D5.

### 2026-08-13 — Phone auth = OS-ID + PIN; biometric Unlock {OS-ID}
- **What:** No Google on the phone. Sign-in is OS-ID + PIN (Gmail already bound on the website). `Unlock {OS-ID}` resumes a stored session; cancel does not skip into the shell. After PIN, optional biometric offer. Config row `On · unlock {OS-ID}`. Bootstrap `user.username` remembered; email prefix never invents an OS-ID.
- **Why:** Founder — Google signup already linked; phone identity is the plate.
- **Files:** `BiometricUnlock.kt`, `BiometricGate.kt`, `MainActivity.kt`, `OnboardingScreen.kt`, `OnboardingViewModel.kt`, `ConfigStore.kt`, `AuthRepository.kt`, `ConfigScreen.kt`, `server/routes/mobile.js`
- **Status:** partial — `:core:data:testDebugUnitTest` 128/128 · `:core:network` 3/3 · `:app:assembleDebug` BUILD SUCCESSFUL · APK `native-android-v3/app/build/outputs/apk/debug/app-debug.apk` (60M) · **device unverified** (AIN065 unplugged)
- **Notes:** Google OAuth on phone stays out. FCM / Glance / Room / Billing / Groq remain D4/D5.

### 2026-08-13 — Leftover D1–D3 pack (screen cap · knocks · Lab live · 18+ · journal · search)

- **What:** Busy-day screen law `union_plus_12` (never +20m via unlocked blend). Local Knock channels + Config Notifications + WorkManager 15m. Lab `GET /intelligence/correlations` (seed killed when live). Welcome 18+ checkbox. Journal search/export/voice-append. Local Search + Timeline. Family/Documents from bootstrap. Score settle `POST /daily-logs` with honest pending. Lab Reports → web. Agenda create → web. Note hide labeled `HIDDEN ON PHONE · NOT WIPED`. Core copy no longer claims widgets. Optional biometric cold-open (fail still enters).
- **Why:** Founder leftover spec + screen still 20m high + knocks pending; phone unplugged so proof = unit tests + assembleDebug.
- **Files:** `ScreenTime.kt`, `knock/*`, `LabStore`, `OnboardingStore`, `JournalStore`, `LocalGraphSearch.kt`, `VaultListStore.kt`, `DailyLogRepository.kt`, `Destinations.kt`, `AiiminShell.kt`, `ConfigScreen.kt`, `V3-COMPLETE-BUILD-SPEC.md`
- **Status:** partial — `:core:data:testDebugUnitTest` 122/122 · `:core:network:testDebugUnitTest` 3/3 · `:app:assembleDebug` BUILD SUCCESSFUL · APK `native-android-v3/app/build/outputs/apk/debug/app-debug.apk` · **device unverified** (AIN065 unplugged)
- **Notes:** Server has no `note.delete` — local hide only. FCM / Glance widgets / Google sign-in / Play Billing / Groq 10-step remain D4/D5. Do not claim DW parity until founder eyeball.

### 2026-08-08 — Config depth · Today strips · published Life Score

- **What:** Config: native English Spark nav (no lab web Intent), notifications open system settings, Help & legal, DiscoveryStore "Find your way", account email on profile/sync. Today: agenda (≤4) + notes (≤3 pinnedFirst) strips; Life Score prefers `PublishedLifeScoreStore` when available. Score screen: Published · server block above provisional rails. Lab English card: `colors.ink` → `colors.text` (compile fix).
- **Why:** Kill web handoff · surface graph hydrate · server Life Score honesty (ADR 2026-08-03).
- **Files:** `ConfigScreen.kt`, `ConfigViewModel.kt`, `ConfigStore.kt`, `TodayScreen.kt`, `TodayViewModel.kt`, `ScoreScreen.kt`, `ScoreViewModel.kt`, `LabScreen.kt`
- **Status:** partial — `compileDebugKotlin` config/today/score/lab/core:data exit 0 · no device QA
- **Notes:** Do not commit until founder asks. Email only surfaces after `applyRemoteIdentity`.

### 2026-08-08 — Screen = DW interactive · plan rect · journal write-first

- **What:** Screen figure prefers SCREEN_INTERACTIVE (DW match; unlocked under-read −21m). Plan cards `RoundedCornerShape(0)`. Onboarding BrandMark + Bodoni + law. Journal composer-first, prompts optional. Config English → `aiimin.in/lab?module=speaking`.
- **Why:** Founder — screen ≠ Settings; config/journal/onboarding/English visibility.
- **Files:** `UsageDayParser.kt`, `DeviceMetricsRepository.kt`, `TodayScreen.kt`, `SubscriptionPlan.kt`, `OnboardingScreen.kt`, `JournalScreen.kt`, `ConfigScreen.kt`, `Reliability-Log.md`
- **Status:** shipped (build+install) — tests 9 ✅ · AIN065 AiiminMetrics interactive label
- **Notes:** DW dashboard can lag live UsageEvents by minutes. Sync notes/agenda still gap.

### 2026-08-08 — Splash law travel → stick under AIIMIN

- **What:** Law starts high/off-center under wordmark, sweeps X→0 + descends past stick then spring-plants; tracking tightens 0.28→0.12em; hairline grows from center; full-width centered lockup; ~2.9s hold then single veil (no mid-dim).
- **Why:** Founder — proper motion: go through, stick under AIIMIN, better flow.
- **Files:** `BrandMark.kt`, `15_MEMORY/Current-Context.md`
- **Status:** shipped (build) — `assembleDebug` BUILD SUCCESSFUL · APK `dist/aiimin-v3-current.apk`
- **Notes:** Reduce-motion still instant full lockup. Install when device present.

### 2026-08-06 — Splash Genesis law under wordmark

- **What:** Cold-open lockup: mark → Bodoni AIIMIN → short steel hairline → muted `One screen. Every day.` (`splashLaw` token). Law fades in ~330ms after word starts; ~2.7s hold so line breathes. Reduce-motion shows law immediately.
- **Why:** Founder — frame DNA tagline under splash with proper spacing/centering.
- **Files:** `BrandMark.kt`, `Type.kt`, `15_MEMORY/Current-Context.md`
- **Status:** shipped (build) — `assembleDebug` BUILD SUCCESSFUL · APK `dist/aiimin-v3-current.apk` · **install blocked** (no adb device)
- **Notes:** Periods kept (two beats). Hairline = editorial pause, not second slogan. Plug AIN065 → `adb install -r dist/aiimin-v3-current.apk`

### 2026-08-06 — Plan System P0–P2 shipped (souls + catalog + celebration)

- **What:** `TierSoul` catalog (web Account colors/icons/copy). Full-screen Plan catalog with App|Web, founding strikes, RECOMMENDED Pro. Degrade confirm. Celebration overlay (hold→dissolve→land→unlocks→receipt). Gate walls soul-colored. Profile chip soul tint.
- **Why:** Founder — build the planned plan system.
- **Files:** `SubscriptionTier.kt`, `SubscriptionPlan.kt`, `ConfigScreen.kt`, tests, Native-Plan-System.md
- **Status:** shipped — assembleDebug ✅ · model tests ✅
- **Notes:** Billing still local-instant. Try Config → Plan.

### 2026-08-06 — Native Plan System design contract


- **What:** Full plan/tier design vault note — souls, labels, icons, prices, App\|Web copy, screens S0–S6, upgrade/degrade celebration phases, implementation P0–P4. Canonical from web Account + celebration (not waitlist green marketing).
- **Why:** Founder — plan tiers completely with colours, labels, visuals, upgrade/degrade screens from website.
- **Files:** `docs/knowledge/09_FEATURES/Subscription/Native-Plan-System.md`, Index, App-Web-Tiers, Current-Context
- **Status:** shipped (docs) — UI implementation next (P0)
- **Notes:** Mobbin MCP unavailable this session; designed from live web sources.

### 2026-08-06 — Steps/screen accuracy (3031 vs 3041 · 1m floor)


- **What:** Steps — pick highest single phone HC stream (not SPN-rank-first); `mergePhoneSteps` raises HC with sensor lag ≤400; poll 15s. Screen — `formatHours` half-up minutes (DW-style), not floor.
- **Why:** Founder: Settings 3041 / app 3031; screen ~1m off — same class of bug kept recurring.
- **Files:** `HealthConnectSteps.kt`, `DeviceMetricsRepository.kt`, `UsageDayParser.kt`, tests, `15_MEMORY/Reliability-Log.md`
- **Status:** shipped — unit tests 7+8 ✅ · device log `phone=5031` · `unlocked=13838155` (rounds to +1m vs floor)
- **Notes:** Root cause documented in Reliability-Log. Same-minute Settings eye-QA still founder.

### 2026-08-06 — Splash polish v4 + app↔web plan tiers


- **What:** Splash — no grey tip bead (Butt arch + full-path settle), word connects via tracking tighten into one AIIMIN, bigger mark (192dp) + Bodoni splash 40sp, faster ~2.15s, spark pop + hot core. Config Plan sheet (Explore/Core/Pro/Elite) with App|Web unlock columns; persist tier; Money + Lab gated at Core+.
- **Why:** Founder ask — tip dot, connect word, spark, size, speed; subscription change + tier restrictions + web interlink.
- **Files:** `BrandMark.kt`, `Type.kt`, `SubscriptionTier.kt`, `SubscriptionPlan.kt`, `ConfigStore.kt`, prefs, `ConfigScreen.kt`, Money/Lab routes, `AiiminShell.kt`, vault `09_FEATURES/Subscription/App-Web-Tiers.md`
- **Status:** shipped — assembleDebug ✅ · device `splash-v4-dock.png`
- **Notes:** Billing still local-instant (same as web). Play Billing later.

### 2026-08-06 — Splash motion smoother (~2.85s)


- **What:** Stroke climb uses `StrokeEase` (not linear); no scale overshoot; softer spark/ring/word dock (`MeetEase`); word fade+scale overlap; cached path geometry (less frame jank); tip glow quieter.
- **Why:** Founder — animation a bit better / smooth.
- **Files:** `BrandMark.kt`
- **Status:** shipped — assembleDebug ✅ · device `splash-smooth-mid.png` · `splash-smooth-dock.png`
- **Notes:** Total still ~2.85s; Bodoni wordmark unchanged.

### 2026-08-06 — Splash wordmark = Bodoni Moda (site font)


- **What:** Splash AIIMIN text uses Bodoni Moda 700 (`letterSpacing -0.04em`) — same as web `Wordmark.jsx` / `--font-brand`. Font file `core_designsystem_bodoni_moda_variable.ttf`; `AiiminTypography.wordmark`.
- **Why:** Founder — logo screen font must match official website.
- **Files:** `Type.kt`, `BrandMark.kt`, `res/font/core_designsystem_bodoni_moda_variable.ttf`
- **Status:** shipped — assembleDebug ✅ · device `splash-bodoni-word.png` (serif AIIMIN)
- **Notes:** Wordmark face only — product chrome stays Barlow Condensed.

### 2026-08-06 — Bilateral splash + minimums without emoji

- **What:** Splash: left+right arch/peak/inner grow toward summit together; spark mixes at meet; **AII** + **MIN** dock into AIIMIN (~2.8s). Minimums: no habit emoji — instrument code (BODY/CRAFT/…) + clean name.
- **Why:** Founder — one-side stroke felt wrong; emoji list looked AI slop.
- **Files:** `BrandMark.kt`, `DayStore.kt` (`cleanHabitLabel`), `TodayScreen.kt` MinimumRow, Current-Context
- **Status:** shipped — assembleDebug ✅ · AIN065 `splash-bi-*` · `day-minima.png` (CRAFT/BODY/MIND tags, no emoji)
- **Notes:** Pull/sync re-hydrates names without emoji prefix.

### 2026-08-06 — Steps goal · Day SIGNAL quotes · splash 2.8s smooth

- **What:** Long-press STEPS → goal dialog (±500, persist 3k–30k, default 10k). Day strip is SIGNAL motivational quote (120 lines, no repeat 90 days) — name stays Config only. Splash retimed ~2.8s: linear arch/peak draw, center spark, AIIMIN letters assemble center-out, soft exit (no bounce hang).
- **Why:** Founder — change steps goal; kill “Signed in as” on Day; splash too short then too hangy — want smooth 2.5–3s with arc + center focus.
- **Files:** `DeviceMetricsRepository.kt`, `DayQuoteRepository.kt`, `DayStore.kt`, `TodayScreen.kt`, `TodayViewModel.kt`, `BrandMark.kt`, `Buttons.kt` (long-press), Current-Context
- **Status:** shipped — assembleDebug ✅ · AIN065: SIGNAL quote · goal dialog · splash-v3 frames
- **Notes:** Name still on Config profile. Life Score still 0 after settle (separate).

### 2026-08-06 — Single-logo cold open (no duplicate system mark)

- **What:** System SplashScreen is silent ground only (`splash_silent` transparent icon + instant `remove()`). One Compose `AiiminSplash` owns BrandMark: atmosphere → ink draw with tip glow → parallax layers → spring settle → spark ignition + shockwave rings → wordmark → exit. No second logo.
- **Why:** Founder — first open showed logo then logo-again-with-motion; want one crazy-level reveal only.
- **Files:** `BrandMark.kt`, `MainActivity.kt`, `splash_silent.xml`, `themes.xml` / `values-night/themes.xml`, Current-Context
- **Status:** shipped — assembleDebug ✅ · AIN065 frames `splash-v2-01..16` (no circular launcher plate)
- **Notes:** Palette locked. Force-stop + reopen to feel full ~2.5s.

### 2026-08-06 — Cold-open AiiminSplash (device-proven)

- **What:** Full brand opening: steel atmosphere bloom → staged stroke draw (arch/peak/inner) → soft scale overshoot → BrandSpark bloom + pulse → AIIMIN wordmark rise + tracking settle → hold → veil out. System `SplashScreen` handoff (no dead black plate). Choreography frozen once so prefs hydrate cannot restart. Reduce-motion: short path.
- **Why:** Founder — initial open logo must feel deep and premium on device.
- **Files:** `BrandMark.kt` (`AiiminSplash`), `MainActivity.kt`, `app/build.gradle.kts` (core-splashscreen), `themes.xml` / `values-night/themes.xml`, `Current-Context.md`
- **Status:** shipped — assembleDebug ✅ · install AIN065 ✅ · frames `dist/device-shots/splash-01..14.png` + Money/Config smoke
- **Notes:** Palette locked (steel + spark only). Metrics goal editor still open.

### 2026-08-06 — Device E2E: Origin fix + returning claim skip + full screen pass

- **What:** OkHttp `Origin`/`Referer: https://aiimin.in` (fixes Better Auth “Missing or null Origin”). Returning OS-ID sign-in skips claim → Arc. Device AIN065: install, live sign-in, onboarding, Capture settle (1 TODAY), Money LIVE API, Config/Export chooser, OS-ID plate, Day unlocked screen.
- **Why:** Founder asked download APK + per-screen + data input with live credentials.
- **Files:** `NetworkModule.kt`, `OnboardingStore.kt`, `OnboardingViewModel.kt`, Current-Context, shots `dist/device-shots/e2e-*`
- **Status:** partial — E2E largely passed on device · Life Score still 0 after settle · OS-ID plate shows `AADITYAU` from graph (login was `aadi0837`)
- **Notes:** Never store PIN in vault. Export share sheet opened (ChatGPT/Chrome/WPS).

### 2026-08-06 — OS-ID credential plate (not Copy-only)

- **What:** OS-ID rebuilt as industrial credential: BrandMark + PART NO plate, tap/long-press copy, ticket perforation, stamp fields, revision seal, 2×2 spec grid. Primary = Share plate; Copy = quiet ghost. Steel tokens unchanged.
- **Why:** Founder — Copy identifier looked cheap; invent better; use design MCP (Mobbin absent; VP0 no identity matches).
- **Files:** `OsIdScreen.kt`, `OsIdViewModel.kt`, `OsIdScreenshots.kt`, Current-Context
- **Status:** partial — assembleDebug ✅ · APK promoted · device QA blocked
- **Notes:** Export/data pack already coded (`LifeExport` TXT+JSON share); E2E not proven on device.

### 2026-08-06 — Craft plan + Money/Config DT align (palette locked)

- **What:** Vault craft matrix (`Craft-Execution-Plan.md`). Money: rise-in on tabs/safe figure; ledger CTA accent. Config: flat PrefList (no boxed cards), no Account rule, DT sync copy, quieter Connections. Steel tokens unchanged.
- **Why:** Founder — get designs, adapt to app, complete features in detail; do not change theme/colors.
- **Files:** `MoneyScreen.kt`, `ConfigScreen.kt`, `Craft-Execution-Plan.md`, `Current-Context.md`, CHANGELOG
- **Status:** partial — assembleDebug ✅ · APK promoted · device QA blocked (adb empty)
- **Notes:** Mobbin MCP unavailable this session; DT screens = SoT.

### 2026-08-06 — Craft repair: Money overview-first · splash motion · Config quiet

- **What:** Money: Review drafts (if any) → tabs → overview/budgets/ledger first; ingest collapsed to quiet “Log · import” (Type / Paste / File / SMS). No Primary “Allow SMS” wall. Splash: `AnimatedBrandMark` stroke draw + spark pulse + steel radial + fade-out (~1.1s). Config: “This phone”, Needed/On/Off, “Enable SMS · Money”.
- **Why:** Founder — Money turned into Allow/Decline mockery; splash dull static badge; Config permission theater.
- **Files:** `MoneyScreen.kt`, `BrandMark.kt`, `MainActivity.kt`, `ConfigScreen.kt`, `Current-Context.md`
- **Status:** partial — assembleDebug ✅ · APK → `native-android-v3/dist/aiimin-v3-current.apk` · **adb empty (no device)** · visual QA pending
- **Notes:** Mobbin paid blocked; Drafting Table Money.jsx + impeccable product register used. Metrics unlock fix still needs replug install.

### 2026-08-05 — Screen time: unlocked not interactive (AOD −1h)

- **What:** Device screen figure = unlocked spans (KEYGUARD). Interactive kept for debug only. Live proof: interactive 5h10 · unlocked 4h10 · Δ 60m — that was the “1 hour mismatch.”
- **Why:** Founder — screen still ~1h high vs Settings.
- **Files:** `UsageDayParser.kt`, `DeviceMetricsRepository.kt`, `TodayScreen.kt`
- **Status:** partial — assembleDebug ✅ · APK promoted · **adb install blocked (device unplugged mid-install)**
- **Notes:** Replug → install; Today meta `Android · unlocked`.

### 2026-08-05 — Device metrics: direct Android (no midpoint / no HC double)

- **What:** Screen time = `UsageEvents.SCREEN_INTERACTIVE` only (dropped midpoint invent). Steps = single best HC on-device origin (SPN > Nothing > android); never sum origins that duplicate the pedometer stream.
- **Why:** Founder: screen + steps mismatch vs phone Settings; stop inventing blends.
- **Files:** `UsageDayParser.kt`, `HealthConnectSteps.kt`, `DeviceMetricsRepository.kt`, `TodayScreen.kt`, tests
- **Status:** partial — build/install green · Settings/DW parity needs founder unlock compare
- **Notes:** Today SCREEN meta shows `Android · interactive`. If Nothing DW still differs, that OEM may use unlocked — report both numbers.

### 2026-08-05 — Money ingest ladder (SMS opt-in + AI + Excel)

- **What:** Opt-in `READ_SMS` transactional inbox scan → drafts. Manual entry. AI text → `/wealth/import/ai`. Excel/CSV → `/wealth/import`. Share MIME for pdf/xls/xlsx/csv. Deny SMS still fully usable.
- **Why:** Founder: allow SMS when user consents; otherwise self-entry / AI / spreadsheet.
- **Files:** `TransactionalSmsScanner.kt`, `MoneyImportRepository.kt`, `MoneyViewModel.kt`, `MoneyScreen.kt`, `AndroidManifest.xml`, `AiiminApi.kt`, prefs sms_opt_in, Play-Store-Launch.md, Current-Context.md
- **Status:** partial — assembleDebug ✅ · unit tests ✅ · device QA pending · Play SMS declaration open
- **Notes:** PDF binary not parsed on device. Privacy copy on web must update before Play.

### 2026-08-05 — V3 payment sync round 2 (idempotency + date + categories)

- **What:** Wealth `POST /transactions` honors `Idempotency-Key` via existing `mobile_idempotency` (no schema change). Money outbox dedupes by `notes=mobile:<clientKey>`. Share intent cleared after ingest. Parser extracts alert date. Approve maps FOOD→Food & Dining etc; `source=mobile`.
- **Why:** Payment/UPI sync is product-critical; retries were able to duplicate website rows.
- **Files:** `server/lib/mobileIdempotency.js`, `server/routes/wealth.js`, `PaymentAlertParser.kt`, `GraphSyncRepository.kt`, `MainActivity.kt`
- **Status:** partial — EC2 undeployed · device share E2E still needs unlock QA

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

### 2026-08-15 — A2 Hold-to-Talk 5X verification
- **What:** Rebuilt and installed the current V3 debug APK, then verified the `THE LINE` full-width `HOLD TO TALK` interaction on AiiminLean/emulator-5554. Press/hold visibly changed the label to the elapsed timer (`0:00`) and release returned it to `HOLD TO TALK`; no automatic Settle occurred.
- **Evidence:** Baseline prescribed Gradle tests and `:app:assembleDebug` both returned `BUILD SUCCESSFUL`; fresh `adb install` returned `Success`; `aiimin.app.MainActivity` resumed; focused `:feature:capture:test` returned `BUILD SUCCESSFUL`; screenshots are in `native-android-v3/.device-shots/a2-*.png`.
- **Status:** **Verified on emulator-5554; AIN065 device proof remains unverified.**
- **Notes:** A transient System UI ANR appeared during initial emulator startup and cleared after selecting Wait. No app crash signature was found in the captured log window. No commit or push performed.

### 2026-08-15 — A6 throwaway TEST-note delete 5X verification
- **What:** Created `AIIMIN_TEST_NOTE_20260815` with body `THROWAWAY_TEST_ONLY_DELETE_ME` through the V3 Notes vault, saved it, then deleted only that throwaway record. Verified the local list returned from `LIVE · 2` to `LIVE · 1` and showed `DELETED · SYNC WILL WIPE`; the seeded `Capture beats memory` note remained.
- **Evidence:** Fresh APK from the A2 build/install receipt; focused data/network tests completed successfully; UIAutomator and screenshots at `native-android-v3/.device-shots/a6-note-{filled,saved,deleted}.png`; source path verified `NotesViewModel` → `NoteStore` → `GraphSyncRepository.note.delete`.
- **Status:** **Verified on emulator-5554 for test-only data; AIN065 and web round-trip remain unverified.**
- **Notes:** No real note was deleted. No commit or push performed.

### 2026-08-15 — A3 camera/OCR fire 5X verification
- **What:** Verified the SCAN SOURCE chooser, emulator camera permission flow, camera activity launch, shutter/review/Done return, on-device OCR handoff, and honest blank-OCR placeholder. Verified that the resulting draft offers `SETTLE` and `DRIFT`; Drift created a temporary hold only and did not settle or write.
- **Evidence:** Focused `:feature:capture:test` returned `BUILD SUCCESSFUL`; UIAutomator and screenshots at `native-android-v3/.device-shots/a3-*.png`; after force-stop/relaunch the temporary hold was absent and the app reported `NOTHING LOGGED YET`; no app crash signature.
- **Status:** **Verified on emulator-5554; AIN065 hardware proof remains unverified.**
- **Notes:** Emulator-only camera permission was granted for the test and was not used to alter real user data. No commit or push performed.

### 2026-08-15 — D1 18+ Welcome 5X verification
- **What:** Replayed the existing onboarding flow from Config, verified the 18+ Welcome boundary and normal path, confirmed Begin is blocked before age acknowledgement, confirmed `18 OR OLDER · CONFIRMED` enables Begin, and advanced to the existing OS-ID + PIN sign-in step.
- **Evidence:** `:core:data:test :feature:onboarding:test` returned `BUILD SUCCESSFUL`; UIAutomator and screenshots at `native-android-v3/.device-shots/d1-*.png`; restored the completed five-tab shell using the documented age-confirmed local-demo exit.
- **Status:** **Welcome gate verified on emulator-5554; signed-in continuation blocked because entering the user’s PIN is not permitted and no signed-in session was available.**
- **Notes:** No PIN was typed, logged, or requested. No account, note, or capture data was deleted. No commit or push performed.

### 2026-08-15 — Depth phase 5X verification and QA truth labels
- **What:** Validated Capture parse/Settle safety, sync outbox contracts, Lab seed honesty, Journal search/no-match behavior, JournalStore save/query/export tests, Money seed honesty, explicit Approve/Dismiss semantics, and OTP rejection behavior.
- **Evidence:** Full `./gradlew test` returned `BUILD SUCCESSFUL` in 31s; final qemu-down `:app:assembleDebug` returned `BUILD SUCCESSFUL` in 2s; Lab screenshot `depth-lab.png`; Journal screenshots `depth-journal-verified.png` and `depth-journal-no-match3.png`; Money screenshots `depth-money-initial.png` and `depth-money-log.png`; source/tests inspected for sync, parser, journal, and approval contracts.
- **Status:** Lab and Journal search are Verified on emulator-5554; Capture/sync/Money live-auth paths remain Inferred or Blocked where authentication or safe controlled data prevented live proof. No unsupported completion claims were added.
- **Notes:** No code change was required by the tested depth paths. No commit or push performed.
