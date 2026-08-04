---
authority: operations
derived_from: 15_MEMORY/Handoff-Native-App-Build · 17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-LOG
tags:
  - type/log
  - domain/build
  - status/active
---

# Native Android V3 — build tracker

> One row per screen. A screen is only ticked with real build output and a render
> behind it (G5 · evidence before claims). Screens are built in the order set by
> [[15_MEMORY/Handoff-Native-App-Build]] §3.

**Project:** `native-android-v3/` · package `in.aiimin.app` (debug installs as
`in.aiimin.app.v3`, so it sits next to V2) · Kotlin package root `aiimin.*`.

## Progress

| # | Screen | State | Evidence |
|---|--------|-------|----------|
| 0 | **Foundation** — project, theme, shell | ✅ done 2026-08-03 | `:app:assembleDebug` BUILD SUCCESSFUL · APK 12.5 MB · 4 screenshot goldens recorded and validating |
| 1 | **Capture** — the trust surface | ✅ done 2026-08-03 (local state; API not wired) | `:app:assembleDebug` BUILD SUCCESSFUL · APK 13.0 MB · 13/13 parser unit tests · 5 screenshot goldens |
| 2 | **`:core:model`** — Life Score engine v2 maths | ✅ done 2026-08-03 | 28/28 unit tests · attainment curve, asymmetric Hold, robust baseline, trajectory, composition |
| 3 | **Today** — capture-first | ✅ done 2026-08-04 (local state) | `:app:assembleDebug` SUCCESSFUL · APK 13.0 MB · 71 tests green · 12 screenshot goldens |
| 4 | **Money** — log and see money truth | ✅ done 2026-08-04 (local state) | `:app:assembleDebug` SUCCESSFUL · APK 12 MB · 11/11 MoneyStore tests · 18 screenshot goldens validating (6 Money) |
| 5 | **Config** — configure the OS | ✅ done 2026-08-04 (local state) | `:app:assembleDebug` SUCCESSFUL · APK 13 MB · 6/6 ConfigStore tests · 22 screenshot goldens validating (4 Config) |
| 6 | **OS-ID** — own your identifier | ✅ done 2026-08-04 (local state) | `:app:assembleDebug` SUCCESSFUL · OsIdRulesTest 5/5 · 24 screenshot goldens (2 OS-ID) · Config → OS-ID push |
| 7 | **Onboarding** — 6-step calibration | ✅ done 2026-08-04 (local state) | `:app:assembleDebug` SUCCESSFUL · OnboardingStoreTest 7/7 · core:data unit tests green · 28 screenshot goldens (4 Onboarding) · MainActivity gate + Config replay |
| 8 | **Score** — mark and settle the day | ✅ done 2026-08-04 (local state) | `:app:assembleDebug` SUCCESSFUL · ProvisionalScoreTest 4/4 · ScoreStoreTest 4/4 · 31 screenshot goldens (3 Score) · Today → Score push |
| 9 | **Journal** — reflection capture | ✅ done 2026-08-04 (local state) | JournalStoreTest 3/3 · 34 screenshot goldens (3 Journal) · Config → Journal |
| 10 | **Lab** — correlations | ✅ done 2026-08-04 (local state) | LabStoreTest 4/4 · 37 screenshot goldens (3 Lab) · LAB tab live |

## Leftover (after screen map)

| Track | State |
|-------|--------|
| Phone reinstall | ✅ 2026-08-04 17:32 — `adb install -r` Success · device `9597fdea` · `in.aiimin.app.v3` launched |
| Scoped commits | waiting founder ask |
| **API wiring** | **in progress** — `:core:network` + live OS-ID + `/intelligence/parse` added; **EC2 deploy needed** for prod |
| DataStore persistence | ✅ done 2026-08-04 |
| Groq calibration steps 4–5 | deferred (keys on server; arc sharpen still auth-gated) |
| Reports / Search / voice | out of V3 screen map |

Screen map **complete** for local Drafting Table parity (Foundation → Lab).

## API wiring · OS-ID live — 2026-08-04 (partial)

**One job this slice:** stop lying that shape-valid = available. Claim step now
checks the live graph.

**Server (needs deploy to `api.aiimin.in`):**
- `GET /api/auth/osid-available?id=` — public; checks waitlist + `users` +
  Better Auth `"user"`; returns `{ id, available, reason, message }`
- `POST /api/intelligence/parse` — auth + AI budget; uses `GROQ_API_KEY` /
  OpenRouter on the **server** (never shipped in the APK); Capture Offer chips
  only, no writes
- Waitlist `isUsernameTaken` aligned to the same three tables

**Android:**
- New module `:core:network` (Retrofit 3 · OkHttp · kotlinx.serialization) →
  `https://api.aiimin.in/api/`
- `OsIdAvailabilityRepository` + Claim UI: CHECKING / AVAILABLE · LIVE / TAKEN /
  INVALID / OFFLINE · UNVERIFIED
- Debounced live check from `OnboardingViewModel`

**AI keys:** present in root `.env` (`GROQ_API_KEY`, `GEMINI_*`, `OPENROUTER_*`).
Client never embeds them. Capture AI parse waits on session + EC2 ship of
`/intelligence/parse`.

**Evidence (local):**
- `:core:network:testDebugUnitTest` — 3/3
- `:app:assembleDebug` SUCCESS · APK ~14.0 MB · 37 screenshot goldens validating
- Live curl `GET /api/auth/osid-available` → **404** until API redeploy (expected)

**Next:** founder asks push+ship API → then curl free=`ZZZZ9999` / taken=`AADI0837`
→ Capture AI when session exists · Room for day/money.

## DataStore prefs — done 2026-08-04

**One job:** survive process death for the shell gates that matter — theme,
reduce-motion, onboarding completed, and the OS-ID / arc / minimums label
calibration writes.

**Shape.** `AppPreferences` in `:core:data` · Preferences DataStore file
`aiimin_prefs` · Hilt `DataModule` (`@ApplicationScope` +
`DataStoreAppPreferences`) · `InMemoryAppPreferences` for JVM unit tests.
`ConfigStore` / `OnboardingStore` hydrate once on init and write on mutate.
Day / Money / Lab / Journal / Score seed data stays in-memory (Room or API
later — G8).

**Motion.** `AiiminTheme(reduceMotion=…)` exposes `LocalReduceMotion`.
`TapSurface`, Score figure/rail, and Capture offer enter respect it (duration 0).

**Defaults held.** Cold DataStore still defaults `onboardingCompleted=true` so
craft / screenshots reach the shell without a forced replay. Replay from Config
persists `false` across kill.

**Evidence 2026-08-04**

- `:core:data:testDebugUnitTest` — 44 tests, 0 failures (incl. PrefsPersistenceTest 3/3)
- `:app:assembleDebug` — BUILD SUCCESSFUL · APK ~13.5 MB · `in.aiimin.app.v3` · `3.0.0-alpha01`
- `:app:validateDebugScreenshotTest` — 37 goldens validating

**Not done:** phone install (no adb device) · Room for day/money.

## 0 · Foundation — done 2026-08-03

**One job:** give every later screen a floor — the locked palette and type as
code, the brand mark, base components, and a five-tab shell that installs.

**Stack, as decided in the handoff.** Every version was checked against Maven
Central / Google Maven on the day, not recalled:

| | |
|---|---|
| AGP | 9.3.1 (needs Gradle 9.5.0 — the wrapper is pinned to it) |
| Kotlin | 2.3.21 · KSP 2.3.10 (KSP has tracked its own version line since 2.3.0) |
| SDK | compileSdk / targetSdk **37** (Android 17) · minSdk 26 |
| Compose | BOM 2026.06.01, Material3 as substrate only |
| DI · nav · data | Hilt 2.60.1 · Navigation3 1.1.5 · Room 3.0.1 + DataStore 1.2.1 + WorkManager 2.11.2 in the catalog, wired when a screen needs them |
| Build logic | `build-logic/` composite build, ten convention plugins, `gradle/libs.versions.toml` version catalog, type-safe project accessors |

**Modules.** `:app` and `:core:designsystem`. More are added when a screen needs
them (G1 — no speculative scaffolding).

**Design.** `frontend/src/prototypes/drafting-table/tokens.css` ported to Compose
one-for-one: `AiiminColors` (both themes), `AiiminTypography` (the prototype's
`F` scale), `AiiminSpacing` (the 3.4 dp grid), square corners with radius on
buttons only. Barlow / Barlow Condensed / JetBrains Mono are **bundled** as OFL
font files — no Google Fonts CDN at runtime. The peak-A mark is redrawn from the
same 512-unit geometry as the web mark, warm node `#ff6b35` and nothing else.
The five tab glyphs are hand-drawn strokes, not Material icons.

**Verification without a device.** The machine has no emulator package installed
and 8 GB of RAM with swap already loaded, so booting one alongside Gradle is out.
Instead the project uses **Compose preview screenshot tests** — previews render
to PNG on the JVM through layoutlib:

```
./gradlew :app:updateDebugScreenshotTest     # record goldens
./gradlew :app:validateDebugScreenshotTest   # fail the build on a visual change
```

Goldens live in `app/src/screenshotTestDebug/reference/`. Every screen from here
on gets a dark and a light golden, so a palette or type regression fails the
build instead of reaching the phone.

**Evidence 2026-08-03**

- `:app:assembleDebug` — BUILD SUCCESSFUL, `app-debug.apk` 12.5 MB.
- `aapt2 dump badging`: `in.aiimin.app.v3`, versionName `3.0.0-alpha01`,
  minSdk 26, targetSdk 37, compileSdk 37.
- `:app:updateDebugScreenshotTest` — 4 rendered: shell dark, shell light,
  specimen dark, specimen light. `:app:validateDebugScreenshotTest` passes.

**Not installed on a phone yet** — no device was attached. `adb install` when the
phone is plugged in:

```
adb install -r native-android-v3/app/build/outputs/apk/debug/app-debug.apk
```

**Deliberately deferred**, so the first build stayed small on an 8 GB machine —
raise if you want them: Detekt and Spotless (Detekt's current release is an
alpha), JaCoCo coverage, baseline profiles, crash reporting, Gradle managed
devices.

## 6 · OS-ID — done 2026-08-04 (local state)

**One job:** own your identifier.

Part-number card (Blueprint accent) · specification (8 / uppercase / max 4 digits /
1 lifetime revision) · appears-on chips · copy to clipboard. Rules live in
`:core:model` `OsIdRules` (5 unit tests). Reached contextually from Config profile
— not a sixth tab. Seed id `AADI2004` from ConfigStore.

**Evidence 2026-08-04:** assembleDebug SUCCESSFUL · OsIdRulesTest 5/5 ·
validateDebugScreenshotTest passes · dark + light goldens.

**Not done, deliberately:** live availability check, claim / revision write via API.

## 7 · Onboarding — done 2026-08-04 (local state)

**One job:** get a person from install to their first settled log.

Six Drafting Table steps (not the full 10-step Groq calibration yet): Welcome ·
Sign in (visual stub — PIN never stored) · Claim OS-ID · Arc · Minimums · First
capture. Module `:feature:onboarding` + `OnboardingStore` in `:core:data`. Settle
writes identity/arc/minimums into `ConfigStore` / `DayStore`, records the first
capture, opens the shell. MainActivity gates on `completed`. Config → Replay
calibration restarts the path. Skip · local demo escapes for craft.

**Evidence 2026-08-04:** `:app:assembleDebug` SUCCESSFUL · APK ~12.6 MB ·
`OnboardingStoreTest` 7/7 · `:core:data:testDebugUnitTest` 30/30 ·
`:app:validateDebugScreenshotTest` 28 goldens (4 Onboarding).

**Craft pass (same day, before Onboarding):** blueprint `+` marks, button height
parity, Money/Config tab strips single outer border, WowBars labels, Config
profile+rank one frame, OS-ID `ScreenHead`, bottom-bar inactive α 0.55.
Goldens re-recorded and validating. Device disconnected — `adb install` when
phone returns.

**Not done, deliberately:** Groq “tell me about your days” + proposal chips,
live auth / Google, live OS-ID availability. DataStore `completed` ✅ (see Leftover).

## 8 · Score — done 2026-08-04 (local state)

**One job:** mark and settle the day.

Provisional figure (Drafting Table curve: mins + rails + rung) · Mechanism 01
Rail (Body/Mind/People, snap to fives) · Mechanism 02 Ladder (1–5) · what moved
the number · Settle the day. Engine v2 state shown as honesty meta under the
figure — pursuits stay on Today. `ScoreStore` + `ProvisionalScore` in
`:core:model`. Today’s read taps into Score. Settle appends into `DayStore`
history.

**Evidence 2026-08-04:** assembleDebug SUCCESSFUL · APK ~12.6 MB ·
ProvisionalScoreTest 4/4 · ScoreStoreTest 4/4 · OnboardingStoreTest 7/7 ·
validateDebugScreenshotTest 31 goldens (3 Score).

**Polish same pass:** onboarding gate defaults complete (Replay incomplete);
OS-ID claim cells use hair dividers.

**Not done, deliberately:** live drag rails, `/db/daily_logs` write, published
engine figure as the Live Score headline (stays provisional mark for now).

## 9 · Journal — done 2026-08-04 (local state)

**One job:** reflection capture.

Four templates (Free Write · CBT · Morning Pages · Weekly Review) · Blueprint
composer · mood 1–5 (ROUGH→STRONG, mono, no emoji) · Save · history with excerpt.
Module `:feature:journal` + `JournalStore`. Opened from Config → Journal
(contextual, Config tab stays lit). Seed history labelled local.

**Evidence 2026-08-04:** assembleDebug SUCCESSFUL · JournalStoreTest 3/3 ·
validateDebugScreenshotTest 34 goldens (3 Journal).

**Not done, deliberately:** voice entry, history search, export, `/journal` API.

## 10 · Lab — done 2026-08-04 (local state)

**One job:** ask, review, act on patterns.

Selected-pair Blueprint card (ρ · q · n) · plain-English line · deterministic
scatter (Drafting Table seed jitter + dashed trend) · survivors table (tap to
select) · rejected-by-correction note (14). Module `:feature:lab` + `LabStore`.
LAB tab swaps the placeholder for the real surface.

**Evidence 2026-08-04:** assembleDebug SUCCESSFUL · APK ~12.7 MB · LabStoreTest
4/4 · validateDebugScreenshotTest 37 goldens (3 Lab).

**Not done, deliberately:** live Spearman + Benjamini–Hochberg, browse by area,
date range, Reports entry, `/lab/*` API.

## 5 · Config — done 2026-08-04 (local state)

**One job:** configure the OS.

Profile hero (BrandMark + OS-ID strip) · XP/rank · Life Arc · life-mode switcher
(BUILD/RECOVER/EXAM/TRAVEL, shared with Today via DayStore) · sync demo · appearance
(drives `AiiminTheme` from MainActivity) · reduce motion · notifications / minimums
labels · data rows · delete veil that **refuses** even after typing DELETE (G6).

OS-ID tap is honest: notice that the OS-ID surface is next. Connections / export /
minimums name what they wait for instead of fake forms.

**Evidence 2026-08-04:** `:app:assembleDebug` SUCCESSFUL, APK 13 MB · ConfigStoreTest
6/6 · `:app:validateDebugScreenshotTest` passes with 22 goldens (dark, light,
syncing, delete veil).

**Not done, deliberately:** live sync, real account delete. OS-ID surface ✅.
DataStore theme / reduce-motion ✅ (see Leftover § DataStore).

## 4 · Money — done 2026-08-04 (local state)

**One job:** log and see money truth.

Three tabs, one instrument — Overview (safe-to-spend, spend bar, categories,
week-over-week, seed-labelled net worth / receivable), Budgets (allocations +
upcoming 14d), Ledger (signed income in accent, expenses mono). Add never invents
a second form: it opens Capture. Capture settle with an amount writes the shared
`MoneyStore` ledger; Undo reverses both day and ledger.

**Empty is empty.** `MoneyState.empty()` draws "No money logged … That is empty —
not ₹0." Safe-to-spend, net worth and receivable are `null` when there is no data —
never a fake MTD zero. Seed month is labelled `SEED · LOCAL` / `SEED READ · NOT LIVE`.

**Module:** `:feature:money` + `MoneyStore` in `:core:data`. Overview figures are
derived from ledger rows and budget limits, not hard-coded beside live rows.

**Evidence 2026-08-04:** `:app:assembleDebug` SUCCESSFUL, APK 12 MB ·
`:core:data:testDebugUnitTest` MoneyStoreTest 11/11 · capture + model tests still
green · `:app:validateDebugScreenshotTest` passes with 18 goldens (overview
dark/light, budgets, ledger, empty, offline).

**Not done, deliberately:** `/api` wealth routes, FI velocity / burn / runway,
editing budgets on device, offline queue flush. Local surface first (G7).

## 3 · Today — done 2026-08-04 (local state)

**One job:** act on this day.

Reading order is doctrine, not taste (GOV-106, GOV-165 — there is no Dashboard):
① the composer doorway ② the one small thing ③ floor warnings ④ the read
⑤ minimums ⑥ what settled. Nothing above the fold asks to be understood before
something can be done, and the score sits below because a number you cannot act
on is not a reason to open an app.

**The engine is on the screen now.** The figure carries its ± band and says how
covered it is; the 28-day line only claims RISING when the slope clears its own
error bar; instruments with no data read `—`, never `0`; minimums show **HOLD**,
not a streak.

**Floors behave as specified.** `3,100 · floor 5,000 steps · TEN HOURS SEATED`
draws in danger, states the fact and the reason, and leaves the score untouched.
Pinned by `DayStoreTest`: adding a breached floor moves the state by exactly
zero.

**New module `:core:data`** — an in-memory `DayStore` shared by every surface, so
settling on Capture lands on Today immediately. It holds the shape the API will
fill; nothing above it changes when `/api` arrives. `DayState.seed()` is a
**seed, not a default** — it is the first thing calibration deletes.

Two design bugs were caught in the render pass: the demo day claimed 12,990 steps
*and* a breached 5,000-step floor (impossible), and quantity rows wore a checkbox
that promised a tap they did not have. Both fixed — quantities now draw a fill
gauge instead.

**Evidence 2026-08-04:** `:app:assembleDebug` SUCCESSFUL, APK 13.0 MB · 71 tests
across four modules, 0 failures · 12 screenshot goldens validating.

## 2 · `:core:model` — the Life Score maths — done 2026-08-03

Founder chose **O12 + O8 + O2 + O6 + O7 + O9** — the full instrument. Contract:
[[10_DECISIONS/2026-08-03-life-score-engine-v2]]. The maths lives in pure Kotlin
so it is testable without a device and mirrors the server contract exactly.

Two founder complaints were solved here, and both are pinned by tests:

- **The cliff.** 12,990 steps against a 13,000 target is `0.9997`, indistinguishable
  from a hit. Nothing in the engine is binary. A symmetric S-curve was tried and
  rejected in test — it scored 9,000 of 13,000 at 0.48, and two thirds of the work
  is not half a day. The ease-out curve gives 0.74.
- **The collapse.** Ten clean days then one slip takes Hold from 1.00 to 0.87, not
  to zero. Best run never resets. The memory is asymmetric on purpose — slow to
  fall (14-day half-life), quick to return (α = 0.30) — so the app can say
  *"two days at your usual and you are back"*, which a streak counter never can.

Three more real bugs were caught by the same test pass: a perfectly straight
trend was being reported as HOLDING (zero standard error read as "flat"), a
perfectly steady history could not answer whether today was unusual, and a day
not logged risked being folded in as a zero.

**Evidence:** `:core:model:test` — 28 tests, 0 failures.

## 1 · Capture — done 2026-08-03 (local state)

**One job:** turn one sentence into structured truth you can correct before it
commits.

**The rule that shapes it:** nothing writes without an explicit Settle. The
offer is a proposal — it lives in UI state and dies there unless the user
presses Settle. Drift keeps the sentence in the hold tray with nothing written.

**Correcting a wrong parse takes two taps.** Tap a chip → its editor opens
pre-filled → SET. Dropping a reading is one tap on the chip's `×`. A reading the
rules are not sure about (a bare number with no money context, a mood inferred
from an adjective) arrives switched **off**, so an unattended Settle never
writes a guess.

**The parser is on-device and rule-based, on purpose.** `CaptureParser` reads
amount · category · merchant · people · mood · duration. It is not the AI parse:
`/intelligence/parse` is the real reader and lands with the API wiring. This one
works offline, costs nothing, and is the fallback when the parse call fails or
the tier's parse budget is spent. 13 unit tests pin its rules, including the two
that bite: a duration is never read as an amount, and `8/10` is a mood, not ten
rupees.

**Module:** `:feature:capture`, the first module on the `aiimin.android.feature`
convention plugin. MVVM with an immutable `CaptureUiState` and a `StateFlow`;
the screen composable is stateless and takes callbacks, which is what lets the
screenshot tests render every state.

**Evidence 2026-08-03**

- `:app:assembleDebug` BUILD SUCCESSFUL — `app-debug.apk` 13.0 MB.
- `:feature:capture:testDebugUnitTest` — 13 tests, all passing.
- `:app:validateDebugScreenshotTest` — 9 goldens (4 from Foundation + 5 here:
  offer dark, offer light, correcting, settled with the Undo toast, empty).
- A render bug was caught by this: the surface was not painting its own ground,
  so dark-theme ink drew on white. Fixed, and every surface now paints its bg.

**Not done, deliberately** — these need the API and land with the wiring step:
Settle writing through `/api/*`, the offline queue flushing the hold tray
(`HoldReason.QUEUED_OFFLINE` exists and renders, nothing enqueues yet), and the
AI parse. Four of the six presets (Journal, Voice, Scan, Habit) are drawn muted
and say what they are waiting for instead of pretending.

## Related

- [[15_MEMORY/Handoff-Native-App-Build]] · [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]]
- [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §3 — the screen build units
