---
authority: operations
derived_from: Current-Context · V3-LEFTOVER-CHECKLIST · V3-COMPLETE-BUILD-SPEC · Handoff-Native-App-Build
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-HANDOFF
tags:
  - type/handoff
  - domain/native
  - status/archived
---

# Handoff — Manus (prototype helper brief) — historical

> [!warning] Ownership truth (2026-08-20)
> **Manus did not build the AIIMIN app.** Manus = prototype help only. The full product (web Life OS + native V3) was built in this repo by the founder with Cursor agents.
> This note is a **temporary external-helper paste brief**, not ownership. Do **not** treat “Manus takes Native V3” as current authority.
> Living focus: [[15_MEMORY/Current-Context]] · [[16_DOCUMENTATION/Simplification-Phase-Tracker]] · [[17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST]]

> Paste **§ Paste into Manus** at the bottom only if the founder explicitly asks for external prototype help again. Path facts below may still be useful; ownership framing above wins.

## 0. One-sentence job (historical brief)

Finish, harden, and **prove** the existing Kotlin Compose app at `native-android-v3/` — leftover slices, real tests, emulator/device evidence — without rebuilding, without a sixth tab, without touching PARK items, without committing unless the founder asks.

---

## 1. Repo facts (verified 2026-08-15)

| Fact | Value |
|------|-------|
| Repo root | `/Users/aaditya/Desktop/DASHBOARD PROJECT` |
| Branch | `feat/native-android-v3` (tracks `origin/feat/native-android-v3`) |
| App to work in | **`native-android-v3/`** only |
| Debug applicationId | `in.aiimin.app.v3` |
| Release applicationId | `in.aiimin.app` |
| Launch activity | `aiimin.app.MainActivity` |
| Kotlin package root | `aiimin.*` |
| Gradle root name | `aiimin-v3` (`native-android-v3/settings.gradle.kts`) |
| API | `https://api.aiimin.in/api/` (cookie session, Better Auth) |
| Web | `https://aiimin.in` |
| Physical phone | AIN065 (may be unplugged) |
| Emulator AVD | `AiiminLean` |
| Current APK (install copy) | `native-android-v3/dist/aiimin-v3-current.apk` |
| Live leftover list | `docs/knowledge/17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST.md` |

**Clients in this monorepo (never mix in one commit):**

| Client | Path | Touch? |
|--------|------|--------|
| Native V3 (this job) | `native-android-v3/` | **Yes** |
| Native V2 (old) | `native-android/` | **Read only** — `sync/`, `session/`, `security/`, `data/network/` — **never copy `ui/`** |
| Web Life OS | `frontend/` | No, unless a V3 slice needs a matching API/web bug |
| Capacitor `/m` | `frontend/android/` + `frontend/src/components/mobile/` | **Never** — capture-only phone web, not the native app |
| API | `server/` + `api/` | Only if a slice needs it (e.g. `note.delete` still **uncommitted** in `server/routes/mobile.js`) |

There is **no** `backend/` directory. Schema lives in `server/migrations/`. Auth is **Better Auth**, not Clerk.

---

## 2. Do not destroy what exists

V3 is **brownfield**. Screen map Foundation → Lab is already built. ~188 Kotlin files. Modules already included in `native-android-v3/settings.gradle.kts`:

```
:app
:core:designsystem  :core:model  :core:data  :core:network
:feature:capture  :feature:today  :feature:money  :feature:config
:feature:osid  :feature:onboarding  :feature:score  :feature:journal
:feature:lab  :feature:english  :feature:notes
```

**Forbidden:** new project, Expo/RN, Compose Multiplatform, copying V2 UI, adding a sixth tab, scaffolding speculative modules, rewriting the theme, recomputing Life Score on device.

---

## 3. Stale notes — do not treat as current

| File | Trap |
|------|------|
| `docs/knowledge/00_HOME.md` | Still says mobile build **ON HOLD** (2026-08-03). **False.** V3 is the active product surface. |
| `docs/knowledge/15_MEMORY/Handoff-Native-App-Build.md` §3 | Greenfield “build from scratch, one screen at a time.” **Historical.** Use this Manus note. |
| `docs/knowledge/17_NATIVE_APP_V2/WORKFLOW-PLAN.md` | **V2** tracker (`native-android/`, 2.1.8). Ignore for V3. |
| `docs/knowledge/17_NATIVE_APP_V2/00_INDEX.md` | “Native on hold” banner. Stale. |
| `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md` §4 | Life Score taxonomy “founder to pick.” **Decided 2026-08-03.** |
| Same plan §5 | “Ship React `/proto/draft` first, then port.” **Superseded.** Native V3 is the app. |
| `docs/knowledge/02_ARCHITECTURE/Monorepo.md` | Diagram still names V2 as the native client. Code fact: V3. |

**Living sources (higher wins):** founder chat → Genesis (`docs/knowledge/Genesis/`, never edit) → `V3-LEFTOVER-CHECKLIST.md` + `V3-COMPLETE-BUILD-SPEC.md` + `Current-Context.md` → this note → the Kotlin/JS on disk. If a note and the code disagree, **code is the fact**; fix the note.

---

## 4. Boot order (read these, then code)

1. `docs/knowledge/00_ROUTING.md`
2. `docs/knowledge/15_MEMORY/Current-Context.md`
3. **This file**
4. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md` **§0 only** (G1–G10)
5. `docs/knowledge/17_NATIVE_APP_V2/V3-COMPLETE-BUILD-SPEC.md` (remaining slice contracts)
6. `docs/knowledge/17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST.md` (living ticks — rewrite in place)
7. `docs/knowledge/17_NATIVE_APP_V2/Emulator-Workflow.md`
8. Design: open `frontend/prototypes/AIIMIN-Drafting-Table.html` + `frontend/src/prototypes/drafting-table/tokens.css`
9. Constitutional only if a surface/job is unclear: `docs/knowledge/Maps of Content/Genesis.md` → `docs/knowledge/Genesis/P8 Master Specification/`
10. Then **only** the Kotlin/JS files for the current slice

Skills (read `SKILL.md` before writing Android):

- `.agents/skills/claude-android-ninja/SKILL.md`
- `.agents/skills/android-dev/SKILL.md`
- `.agents/skills/compose/SKILL.md` (Compose work)
- `.agents/skills/android-testing/SKILL.md` (tests)
- `.agents/skills/android-debugging/SKILL.md` (logcat / ANR)
- Proof: `docs/knowledge/14_PROMPTS/Proof-or-Stop.md` + Anti-Lie labels (Verified / Inferred / Proposed / Blocked)

UI craft only: VP0 MCP (`search_vp0_designs` / `get_vp0_design`) then map to Drafting Table — never copy VP0 brand.

---

## 5. Locked product law

**Tabs (exactly five):** DAY · MONEY · CAPTURE · LAB · CONFIG  
Contextual (not tabs): Score, OS-ID, Onboarding, Journal, Notes, Search, Timeline, Family, Documents, Goals, Notifications, English. Adding a sixth tab is a Genesis violation.

**Today** is capture-first. There is **no Dashboard surface** (GOV-165).

**Capture contract:** free text → parse → **editable chips** → **SETTLE** commits (UNDO toast) or **DRIFT** holds. Nothing writes without Settle. Wrong parse correctable in ≤2 taps. Offline queues into Hold.

**Life Score:** keys `physical · cognitive · discipline · financial · emotional`, labels **BODY · MIND · DISCIPLINE · MONEY · MOOD**. Read `GET /intelligence/lhs`. **Never recompute on the client.** Decision: `docs/knowledge/10_DECISIONS/2026-08-03-life-score-taxonomy.md`. Engine: `server/services/lifeHealthEngine.js`.

**Auth on phone:** OS-ID + PIN only. **Google = website only.** Biometrics resume a stored session; they never mint credentials. Never type the founder’s PIN.

**Data:** `/api/*` with session cookie. Never direct PostgREST. Never client-supplied user id. New table ⇒ `USER_SCOPED_TABLES` in `server/routes/db.js` **and** an RLS policy in the same migration.

**Palette (Drafting Table, LOCKED):**

| Token | Dark | Light |
|-------|------|-------|
| Accent | `#749dc4` | `#416180` |
| Brand spark | `#ff6b35` — peak-A **only**, never UI accent | |
| Type | Barlow Condensed chrome · Barlow body · JetBrains Mono **every numeral** | |
| Shape | Square corners; radius on buttons only | |

Do **not** use the old web-lock palette (`#1a1a1a` / `#ff6b35` as UI accent) on native V3.

**Machine:** 8 GB RAM. Do **not** run `./gradlew :app:assembleDebug` (or Android Studio Lite **Run**) while qemu/`AiiminLean` is up. Do not start the emulator as a child of the agent shell.

**Git:** commit / push / PR **only when the founder asks**. No `--no-verify`. No secrets in vault or git.

**G6:** no delete/purchase/send/schema/auth change on **real** founder data without ask. A6 note-delete E2E = **create a test note**, then delete that. Never delete pinned live notes (e.g. `Capture beats memory`).

---

## 6. Exact paths Manus will live in

### 6.1 Gradle / toolchain

| Thing | Path |
|-------|------|
| Wrapper | `native-android-v3/gradlew` (repo-root `gradlew` is a **forwarder** into V3 for Android Studio Lite) |
| Catalog | `native-android-v3/gradle/libs.versions.toml` (AGP 9.3.1 · Kotlin 2.3.21 · compile/targetSdk 37 · minSdk 26) |
| Heap (8 GB) | `native-android-v3/gradle.properties` (`-Xmx1280m`, `parallel=false`) |
| Convention plugins | `native-android-v3/build-logic/` |
| Debug APK output | `native-android-v3/app/build/outputs/apk/debug/app-debug.apk` |
| Promote script | `native-android-v3/scripts/promote-v3-apk.sh` |
| Emulator start | `native-android-v3/scripts/start-emulator.command` — `open` this; never spawn qemu in the agent |
| Install + shot | `native-android-v3/scripts/emu-run.sh` (default: install existing APK; `--build` only if qemu is **down**) |
| Emu captures | `native-android-v3/captures/emu/` (gitignored) |
| Leftover shots | `native-android-v3/captures/emu/leftover/` |
| Founder screenshot pack | `~/Desktop/aiimin-images/` + `~/Desktop/aiimin-images/AIIMIN-APP-STATUS.md` |
| SDK | `~/Library/Android/sdk` · `ANDROID_HOME` · `JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home` |

### 6.2 App shell

| Job | Path |
|-----|------|
| Application | `native-android-v3/app/src/main/kotlin/aiimin/app/AiiminApplication.kt` |
| Activity | `native-android-v3/app/src/main/kotlin/aiimin/app/MainActivity.kt` |
| 5-tab shell | `native-android-v3/app/src/main/kotlin/aiimin/app/ui/AiiminShell.kt` |
| Destinations | `native-android-v3/app/src/main/kotlin/aiimin/app/navigation/Destinations.kt` |
| Bottom bar | `native-android-v3/app/src/main/kotlin/aiimin/app/ui/shell/BottomBar.kt` |
| Surfaces | `native-android-v3/app/src/main/kotlin/aiimin/app/ui/surface/Surfaces.kt` |
| Sync worker | `native-android-v3/app/src/main/kotlin/aiimin/app/sync/SyncWorker.kt` |
| Knocks | `native-android-v3/app/src/main/kotlin/aiimin/app/knock/KnockWorker.kt` · `KnockNotifier.kt` |
| Biometric gate | `native-android-v3/app/src/main/kotlin/aiimin/app/security/BiometricGate.kt` |
| Glance widget | `native-android-v3/app/src/main/kotlin/aiimin/app/widget/DayGlanceWidget.kt` |
| Payment notifs | `native-android-v3/app/src/main/kotlin/aiimin/app/payments/PaymentNotificationListener.kt` |
| Compose goldens | `native-android-v3/app/src/screenshotTest/kotlin/aiimin/app/` |

### 6.3 Feature screens (one job each)

| Surface | Screen | ViewModel |
|---------|--------|-----------|
| Capture (trust) | `feature/capture/.../CaptureScreen.kt` | `CaptureViewModel.kt` |
| Voice | `VoiceSpeech.kt` · `VoiceCapture.kt` | — |
| Scan OCR | `ScanOcr.kt` | — |
| Parser | `feature/capture/.../parse/CaptureParser.kt` | tests: `CaptureParserTest.kt` |
| Today | `feature/today/.../TodayScreen.kt` | `TodayViewModel.kt` |
| Search | `SearchScreen.kt` | `SearchViewModel.kt` |
| Timeline | `TimelineScreen.kt` | `TimelineViewModel.kt` |
| Device insights | `DeviceInsights.kt` | — |
| Money | `feature/money/.../MoneyScreen.kt` | `MoneyViewModel.kt` |
| Config | `feature/config/.../ConfigScreen.kt` | `ConfigViewModel.kt` |
| Knocks UI | `NotificationsScreen.kt` | — |
| Family / Docs / Goals | `FamilyScreen.kt` · `DocumentsScreen.kt` · `GoalsScreen.kt` | `VaultListViewModel.kt` |
| OS-ID | `feature/osid/.../OsIdScreen.kt` | `OsIdViewModel.kt` |
| Onboarding | `feature/onboarding/.../OnboardingScreen.kt` | `OnboardingViewModel.kt` |
| Score | `feature/score/.../ScoreScreen.kt` | `ScoreViewModel.kt` |
| Journal | `feature/journal/.../JournalScreen.kt` | `JournalViewModel.kt` |
| Lab | `feature/lab/.../LabScreen.kt` | `LabViewModel.kt` |
| English Spark | `feature/english/.../EnglishScreen.kt` | `EnglishViewModel.kt` |
| Notes | `feature/notes/.../NotesScreen.kt` | `NotesViewModel.kt` |

Journal research (do not claim therapy): `docs/knowledge/09_FEATURES/Journal/Research-Backed-Design.md`

### 6.4 Data / network (the real graph)

| Job | Path |
|-----|------|
| Retrofit API | `native-android-v3/core/network/src/main/kotlin/aiimin/core/network/AiiminApi.kt` |
| DTOs | `ApiDtos.kt` |
| Cookie jar | `SessionCookieJar.kt` |
| Base URL | `core/network/build.gradle.kts` `API_BASE_URL` = `https://api.aiimin.in/api/` |
| Session | `core/data/.../session/SessionRepository.kt` |
| Graph sync + outbox | `core/data/.../sync/GraphSyncRepository.kt` |
| Day / habits | `DayStore.kt` |
| Notes | `NoteStore.kt` |
| Journal | `JournalStore.kt` |
| Money | `MoneyStore.kt` · `core/data/.../money/` (`PaymentInboxStore`, `MoneyImportRepository`, `TransactionalSmsScanner`) |
| Lab | `LabStore.kt` |
| Score (provisional local) | `ScoreStore.kt` — published figure from LHS API via `PublishedLifeScoreStore.kt` |
| Screen time | `core/data/.../device/ScreenTime.kt` · `DeviceMetricsRepository.kt` |
| Vault lists | `VaultListStore.kt` |
| Knocks evaluator | `core/data/.../knock/` |
| Theme / type | `core/designsystem/.../theme/` (`Type.kt` and siblings) |
| OS-ID rules | `core/model/.../OsIdRules.kt` |
| Life Score maths (display helpers only) | `core/model/` — **do not** replace `GET /intelligence/lhs` |

### 6.5 Server (same graph as web)

| Job | Path |
|-----|------|
| Mobile routes | `server/routes/mobile.js` — `GET /mobile/bootstrap`, `POST /mobile/sync/batch`, `POST /mobile/devices` |
| `note.delete` | Implemented in working tree `mobile.js` (~L321). **Uncommitted** vs last git version. **Also scp’d to EC2 2026-08-14.** Next `git reset --hard` on the box drops it until commit+push+deploy. |
| User-scoped tables | `server/routes/db.js` `USER_SCOPED_TABLES` |
| Life Score engine | `server/services/lifeHealthEngine.js` |
| Migrations | `server/migrations/` |
| Health | `https://api.aiimin.in/api/health` |

**`AiiminApi` endpoints already wired (relative to `/api/`):**

`auth/osid-available` · `auth/resolve` · `auth/get-session` · `auth/sign-in/email` · `auth/sign-in/username` · `intelligence/parse` · `mobile/bootstrap` · `mobile/sync/batch` · `mobile/devices` · `wealth/transactions` · `wealth/budgets` · `wealth/import` · `wealth/import/ai` · `billing/status` · `billing/select-tier` · `intelligence/lhs` · `intelligence/correlations` · `lab/summary` · `lab/practice/speaking` · `daily-logs`

Sync mutation types in `GraphSyncRepository`: `habit.tick` · `habit.untick` · `journal.upsert` · `note.upsert` · `note.delete` (and money via wealth POST + Idempotency-Key).

### 6.6 V2 reference only (do not copy UI)

```
native-android/app/src/main/java/in/aiimin/app/sync/SyncEngine.kt
native-android/app/src/main/java/in/aiimin/app/sync/SyncWorker.kt
native-android/app/src/main/java/in/aiimin/app/session/SessionStore.kt
native-android/app/src/main/java/in/aiimin/app/security/BiometricHelper.kt
native-android/app/src/main/java/in/aiimin/app/data/network/ApiModels.kt
```

### 6.7 Vault notes to update after every slice

| Note | Rule |
|------|------|
| `docs/knowledge/17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST.md` | Rewrite status **in place** |
| `docs/knowledge/17_NATIVE_APP_V2/V3-COMPLETE-BUILD-SPEC.md` | If contract changes |
| `docs/knowledge/17_NATIVE_APP_V2/CHANGELOG.md` | Append, never rewrite history |
| `docs/knowledge/15_MEMORY/Current-Context.md` | Today / Next / Touch |
| Feature MOC under `docs/knowledge/09_FEATURES/` | If behavior/contract shifts |

Knock copy: `docs/knowledge/09_FEATURES/Notifications/Native-Notification-Voice.md`  
Play (do not fake Console): `docs/knowledge/17_NATIVE_APP_V2/Play-Store-Launch.md`

---

## 7. What is already shipped vs still open

Source: leftover checklist **2026-08-15**. Proof labels: `code` · `emu` · `ain065`.

**In code (do not rebuild):** A1 screen-time `union_plus_12` · A2 HOLD TO TALK in THE LINE · A3 SCAN SOURCE chooser · A4 Money ingest UI · A5 Journal voice/search/export · A6 `note.delete` client + local server file · Knocks Config + WorkManager 15m · Lab correlations (demo seed honest) · Reports open-on-web · Score card · Agenda read + web add · Welcome 18+ · D3 minimums focus · D5 biometric row · Search/Timeline/Family/Documents/Goals · Glance widget · 18+ in APK · SMS off-by-default.

**Still open (this is the job):**

1. **A6 emu** — create a **new test note**, delete it, confirm gone. Never delete live vault notes. SAVE tap drifted to Knocks last pass — retry.
2. **A6 ain065** — same on physical phone, then confirm gone on web.
3. **A2 emu** — hold-to-talk actually records (layout code exists; APK at 21:15 still had HOLD-in-grid — rebuild+install after qemu down).
4. **A3** — camera + OCR **fire** (chooser seen; fire not proven).
5. **D1 emu** — 18+ Welcome while signed in (BEGIN disabled until tick).
6. **D5 ain065** — biometric sensor (emu row only).
7. **A1 ain065** — screen-time vs Digital Wellbeing on device.
8. **Commit `note.delete`** in `server/routes/mobile.js` **when founder asks**, then push + EC2 deploy so `git reset --hard` cannot drop it.
9. Depth pass: unit tests that still miss the slice; honest empty vs LIVE seed; Capture AI parse (`POST /intelligence/parse`) vs local `CaptureParser` fallback.

**PARK — do not implement this APK:**

FCM · Room migration · Groq 10-step calibration · Play Billing checkout · account wipe E2E · OS-ID revision write · FI/burn/runway fake ₹0 · Google OAuth on phone · signed AAB / Play Console / GSTIN / counsel · Sentry · iOS · mess-menu extractor (`~/Desktop/mess-menu-extractor`, not V3) · reading DW private DB.

---

## 8. Build / test / see loop (every slice)

**Unit tests (no qemu):**

```bash
cd "/Users/aaditya/Desktop/DASHBOARD PROJECT/native-android-v3"
./gradlew :core:model:test :core:data:test :core:network:test :feature:capture:test --offline || \
./gradlew :core:model:test :core:data:test :core:network:test :feature:capture:test
```

Existing test files (extend, don’t ignore):

- `core/data/src/test/kotlin/aiimin/core/data/` — DayStore, Journal, Money, Lab, Note hydrate, Knocks, ScreenTime, GraphHydrate, Outbox, Biometric, Prefs, VaultList, Widget, WalkInsight, LiveHydrate, PaymentAlertParser, HealthConnectStepsOrigin, UsageDayParserLogic
- `core/model/src/test/` — LifeScore, OsIdRules, ProvisionalScore, Hold, Attainment, SubscriptionTier
- `feature/capture/src/test/` — CaptureParserTest, VoiceCaptureTest

**Assemble (qemu must be STOPPED):**

```bash
cd "/Users/aaditya/Desktop/DASHBOARD PROJECT/native-android-v3"
./gradlew :app:assembleDebug
```

**See on emulator:**

```bash
open "/Users/aaditya/Desktop/DASHBOARD PROJECT/native-android-v3/scripts/start-emulator.command"
# wait for home screen, then:
cd "/Users/aaditya/Desktop/DASHBOARD PROJECT/native-android-v3"
./scripts/emu-run.sh          # install + launch + PNG
./scripts/emu-run.sh --shot   # screenshot only
```

Useful after qemu is up (agent `adb` is fine; starting qemu in the agent is not):

```bash
adb devices
adb logcat --pid=$(adb shell pidof -s in.aiimin.app.v3)
android screen capture -o=native-android-v3/captures/emu/now.png
android layout --pretty
```

**Do not** Android Studio Lite **Run** while qemu is up. Physical AIN065 USB is the safe Lite Run target (Gradle only). Ignore AVD `Medium_Phone_API_36.1` (broken image).

**Maestro / Appium:** not installed. Do not add until this loop stays up for a full onboarding pass.

---

## 9. Per-slice loop (G1 — do not skip)

1. State the surface’s **one job**.
2. Write a failing unit test when the change is logic.
3. Implement in the existing module (no speculative `:feature:*`).
4. Run the relevant `./gradlew :…:test` and `:app:assembleDebug` **with qemu down**. Cite real exit + `BUILD SUCCESSFUL`.
5. If visual: emu-run or founder install. Screenshot path in the leftover checklist.
6. Rewrite leftover checklist in place. Append changelog. Patch Current-Context Touch.
7. **Stop.** Report evidence. Next slice only after this one is proven. Do not scaffold five screens.
8. Commit **only if founder asked**.

Truth labels on every claim: **Verified** (this-turn tool output) · **Inferred** · **Proposed** · **Blocked** · **Not performed**. No “done” without a receipt.

---

## 10. Depth — what “all the work” means

Not a new app. A **hardening pass** on the existing one:

| Layer | How to prove |
|-------|----------------|
| Parser / screen-time / knocks / OS-ID rules | Unit tests, red then green |
| Sync outbox | `OutboxSerializationTest` + `GraphHydrateStoresTest`; signed-in bootstrap against `api.aiimin.in` |
| Capture | Composer → chips → Settle/Drift; voice fills composer **without** auto-Settle; scan OCR empty = honest notice |
| Today | Capture leads; score below; minimums tick; D3 scroll-to-list |
| Money | Approve drafts; never OTP; never fake FI ₹0 |
| Lab | Signed-in: no seed labeled LIVE; Reports Custom Tab to `https://aiimin.in/reports` |
| Journal | Type-first; voice secondary; search filters history; export TXT |
| Notes | Delete test note only; notice `DELETED · SYNC WILL WIPE`; web gone |
| Config | Knocks persist; biometric Off·PIN until founder flips; HC grant row |
| Onboarding | 18+ gate; 6 steps; no Weekly Pulse; no Google button |
| Offline | Hold tray + WorkManager 15m; idempotency key on money POST |

If a slice needs API: prefer existing `AiiminApi` methods. New table/auth/schema = **ask founder first**.

---

## 11. Founder-only (ask, do not invent)

PIN / Google / Play Console / GSTIN / keystore / signed AAB / Groq keys / FCM Firebase / account wipe / deleting real notes / commit+push+EC2 / schema.

EC2 (only when founder says ship API): host `13.207.146.15`, deploy script `deploy/github-ec2-deploy.sh` / Action `deploy-api.yml`. Verify `https://api.aiimin.in/api/health`.

---

## Paste into Manus

Copy everything in the block below.

```text
You are taking over AIIMIN native Android V3. This is BROWNFIELD. The app already exists. Do not create a new project. Do not follow any “build from scratch screen by screen” prompt. Do not copy UI from native-android/ (V2). Do not add a sixth tab. Do not implement PARK items. Commit/push only when I ask.

Repo: /Users/aaditya/Desktop/DASHBOARD PROJECT
Branch: feat/native-android-v3
Work only in: native-android-v3/  (and server/ only if a slice needs it)
Debug id: in.aiimin.app.v3
Activity: aiimin.app.MainActivity
API: https://api.aiimin.in/api/  (Better Auth cookie — never Clerk, never PostgREST, never client user id)

READ FIRST, in this order, then confirm the list:
1. docs/knowledge/00_ROUTING.md
2. docs/knowledge/15_MEMORY/Current-Context.md
3. docs/knowledge/15_MEMORY/Handoff-Manus-Native-V3.md   ← this is your full path map
4. docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md  §0 only (G1–G10)
5. docs/knowledge/17_NATIVE_APP_V2/V3-COMPLETE-BUILD-SPEC.md
6. docs/knowledge/17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST.md
7. docs/knowledge/17_NATIVE_APP_V2/Emulator-Workflow.md
8. Open frontend/prototypes/AIIMIN-Drafting-Table.html and frontend/src/prototypes/drafting-table/tokens.css
9. Skills: .agents/skills/claude-android-ninja/SKILL.md and .agents/skills/android-dev/SKILL.md before writing Kotlin

IGNORE as stale: Home “ON HOLD”; Handoff-Native-App-Build.md §3 greenfield paste; WORKFLOW-PLAN.md (that is V2); agent plan §4 taxonomy unresolved (DECIDED); agent plan §5 React-first.

LOCKED:
- Tabs: DAY · MONEY · CAPTURE · LAB · CONFIG only
- Accent steel #749dc4 / #416180; #ff6b35 peak-A spark only
- Barlow Condensed / Barlow / JetBrains Mono numerals; square corners
- Life Score: GET /intelligence/lhs only. Keys physical·cognitive·discipline·financial·emotional = BODY·MIND·DISCIPLINE·MONEY·MOOD
- Phone login: OS-ID + PIN. Google = website. Never type my PIN.
- Capture: nothing writes without Settle. Drift holds. Undo after Settle.
- 8 GB Mac: NEVER assembleDebug or Lite-Run while AiiminLean qemu is up. Start emu with: open native-android-v3/scripts/start-emulator.command
- G6: never delete my real notes. A6 test = create a throwaway note, delete that.

START WORK (one slice at a time, prove each):
1. Inventory native-android-v3/ against V3-LEFTOVER-CHECKLIST. Do not rebuild shipped screens.
2. qemu DOWN → ./gradlew :core:model:test :core:data:test :core:network:test :feature:capture:test then :app:assembleDebug. Cite real BUILD SUCCESSFUL.
3. Then leftover in this order unless blocked:
   a. Rebuild+install so HOLD TO TALK in THE LINE is on device (A2) — current dist APK is older
   b. A6: new TEST note only → delete → confirm; then web confirm if signed in
   c. A3 camera/OCR fire
   d. D1 18+ Welcome while signed in
   e. Depth: Capture parse (local + /intelligence/parse), sync outbox, honest Lab LIVE vs seed, Journal search/export, Money approve-not-OTP
4. After each slice: rewrite V3-LEFTOVER-CHECKLIST in place, append 17_NATIVE_APP_V2/CHANGELOG.md, patch 15_MEMORY/Current-Context.md
5. PARK (do not build): FCM, Room, Groq, Play Billing, account wipe, OS-ID revision, FI/burn fake, Google on phone, signed AAB, iOS
6. server/routes/mobile.js has uncommitted note.delete (+ other diffs). Do not commit unless I ask. Warn if EC2 git reset would drop it.

Proof-or-stop: no “done” without this-turn gradle/adb/screenshot receipt. Label Verified / Inferred / Proposed / Blocked.

Modules already exist (settings.gradle.kts): :app :core:designsystem :core:model :core:data :core:network :feature:capture :feature:today :feature:money :feature:config :feature:osid :feature:onboarding :feature:score :feature:journal :feature:lab :feature:english :feature:notes

API interface: native-android-v3/core/network/src/main/kotlin/aiimin/core/network/AiiminApi.kt
Sync: native-android-v3/core/data/src/main/kotlin/aiimin/core/data/sync/GraphSyncRepository.kt
Shell: native-android-v3/app/src/main/kotlin/aiimin/app/ui/AiiminShell.kt
Destinations: native-android-v3/app/src/main/kotlin/aiimin/app/navigation/Destinations.kt

V2 reference only (API/sync, never ui/):
native-android/app/src/main/java/in/aiimin/app/sync/
native-android/app/src/main/java/in/aiimin/app/session/
native-android/app/src/main/java/in/aiimin/app/security/
native-android/app/src/main/java/in/aiimin/app/data/network/ApiModels.kt

Go. First message: confirm you read the eight files, then run the test+assemble with qemu down, then start leftover A2/A6 with evidence.
```
