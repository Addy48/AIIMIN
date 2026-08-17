---
authority: operations
derived_from: 17_NATIVE_APP_V2
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-06
---

# Reliability log — device metrics

## 2026-08-13 — Biometric cancel must not skip into shell

### Observed
Prior leftover pack: Config biometric flag + cold-open prompt; **deny still entered the shell**. Wrong for OS-ID identity.

### Root cause
`authenticateIfNeeded` treated cancel as pass-through so the day was usable.

### Fix
`authenticateForLogin` returns false on cancel. MainActivity stays on Sign-in. `Unlock {OS-ID}` resumes stored session only. PIN remains the mint path.

### Evidence
`BiometricUnlockTest` · ConfigStore `rememberOsId` / username tests · assemble this turn.

### Status
unit 128/128 data + 3/3 network · assembleDebug exit 0 · device **unverified**

### Guardrail
Biometrics never mint a session. Cancel ≠ enter shell.

---

## 2026-08-13 — Screen +20m over-read vs widget

### Observed
Founder: app SCREEN more than Digital Wellbeing / home widget by >20 minutes.

### Root cause
Busy-day blend `union_unlock_w2 = (2·unlocked + exclusiveUnion)/3` weighted unlocked (AOD / shade residue) over exclusive ACTIVITY union (donut).

### Fix
`shown = min(unlocked, exclusiveUnion + 12m)` path `union_plus_12`. Never cap against interactive.

### Evidence
`ScreenTimeTest` 10/10 including `busy_day_never_reads_twenty_minutes_above_union`. Device eyeball **not performed** (AIN065 unplugged).

### Status
`passed` unit · device **unverified**

### Guardrail
Never blend unlocked into the donut figure. Never treat interactive as a cap.

---

## 2026-08-08 — Daily minimums tick then reset

### Observed
Tick SHOW_UP habit → UI flips done → instantly/soon reverts.

### Root cause
`TodayViewModel.onToggle` called `sync.refreshAll()` after enqueue. Bootstrap `habitCompletedToday` lagged the flush → `hydrateFromBootstrap` rebuilt Day with observation null.

### Fix
- Toggle → `flushPendingMutations()` only (no bootstrap).
- `pendingHabitOverlay()` merges queued tick/untick into bootstrap completed set.
- `hydrateFromBootstrap` keeps local done when server lag empties `completedToday`.

### Evidence
`LiveHydrateTest` 4/4 · install Success · AIN065

### Status
`passed` unit + install · founder tick QA open

### Guardrail
Never `refreshAll()` on habit toggle. Flush outbox or wait for resume sync with overlay.

---

## 2026-08-08 — Deep insights + hourly buckets + screen ceiling

### Built
- Long-press Day STEPS/SCREEN → insight sheets (km, peak/quiet, hourly tap bars, walks/apps).
- Triple-tap → steps goal / screen ceiling (DataStore).
- `UsageDayParser.hourlyInteractiveMs` + `deriveHourlySteps`.
- Lab screen heat · export v2 phone ledger (7/14/30).

### Evidence
- Unit: `UsageDayParserLogicTest` **11 tests, 0 failures** (incl. `span_splits_across_hour_boundary`, `peak_and_quiet_hour_helpers`).
- Compile: `:feature:today|lab|money|config` + `:core:data|designsystem` SUCCESS.
- Install: `adb -s 9597fdea install -r dist/aiimin-v3-current.apk` → **Success**.

### Status
`passed` unit + install · founder gesture QA still open

### Guardrail
Hourly steps only while app listens (bout ticks). Screen hours from usage events even backgrounded.

---

## 2026-08-08 — Screen time: wrong metric (unlocked vs Digital Wellbeing)

### Observed (AIN065, same session)
| Source | Time | Unlocks |
|--------|------|---------|
| Digital Wellbeing dashboard | **3h 8m** (12:26) | 35 |
| AIIMIN (unlocked-only) | **2h 47m** | 35 |
| AIIMIN (interactive / screen-on) | **3h 4m** | 35 |

Unlocks matched. Screen under-read **−21m** on unlocked. Interactive within **−4m** of DW when both fresh.

Later DW UI stayed at **3h 12m** while live UsageEvents advanced — DW buckets lag; not a second parser bug.

### Root cause
`UsageDayParser` preferred **unlocked** (KEYGUARD spans) after a 2026-08-05 AOD note. On current Nothing + Google DW, the dashboard total tracks **SCREEN_INTERACTIVE** spans, not unlocked-only. Unlocked excludes lock-glance / partial interactive that DW still counts.

### Fix
- `screenOnMs` = interactive first, else unlocked, else app-fg union.
- Keep unlocked for delta meta (`screen on · +Nm vs unlocked`).
- Do **not** midnight lookback-seed (over-counted +15–25m vs DW).
- Keep 1s interactive floor + half-up `formatHours`.

### Files
`UsageDayParser.kt` · `DeviceMetricsRepository.kt` · `TodayScreen.kt` · tests

### Status
`passed` unit tests (9) · device install · same-minute DW at 12:26 interactive≈DW −4m · unlocks 35=35

### Guardrail
Never re-prefer unlocked without a fresh same-minute DW screenshot proving it.

---

## 2026-08-06 — Steps 3031 vs Settings 3041 · screen ~1m off

### Observed
- Android Settings / pedometer: **3041** steps
- AIIMIN Day strip: **3031** steps (−10)
- Screen time: recurring **~1 minute** under Settings / Digital Wellbeing

### Root cause (not “OEM mystery”)
1. **Steps — two bugs stacked**
   - `pickBestPhoneOrigin` ranked **SPN before count**. SPN stream can lag `android` by tens of steps; Settings shows the higher single stream. We locked to the lagging origin.
   - `publishMergedSteps` **ignored sensor** when HC present, even though the comment said sensor raises the HC lag floor. HC batches; TYPE_STEP_COUNTER is live.
2. **Screen — display floor**
   - `UsageDayParser.formatHours` used `toMinutes` (**floor**). Digital Wellbeing **rounds** to nearest minute → systematic ~0–59s under-read that shows as **1m** often.

### Fix
- Pick phone origin by **highest single-stream count** (never sum); rank only ties.
- `mergePhoneSteps(hc, sensor)` — sensor may raise HC by ≤400 steps.
- Poll refresh **15s**.
- `formatHours` half-up `(ms + 30_000) / 60_000`.

### Files
`HealthConnectSteps.kt` · `DeviceMetricsRepository.kt` · `UsageDayParser.kt` · tests

### Status
`passed` unit tests · device same-minute compare still founder eye-QA after install
