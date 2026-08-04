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
| 4 | Money | next | |
| 5 | Config (instruments · mode · commitments · body facts) | | |
| 6 | OS-ID | | |
| 7 | Onboarding, 10 steps incl. the Groq calibration | | |
| 8 | Score surface (state · trajectory · confidence · attribution) | **unblocked** 2026-08-03 — engine v2 decided | |
| 9 | Journal · Lab | | |

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
