---
authority: engineering
derived_from: Genesis
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
tags:
  - type/feature
  - domain/native
  - status/living
---

# Native · Device deep insights (steps + screen)

## State

Shipped on `feat/native-android-v3` (2026-08-08). Day strip gestures + Lab phone-day heat + ranged export.

## Gestures (Day · From this phone)

| Gesture | STEPS | SCREEN |
|---------|-------|--------|
| Tap | refresh / grant | refresh / grant |
| Long-press | Deep insight sheet | Deep insight sheet |
| Triple-tap | Edit daily steps goal | Edit daily screen ceiling |

## Insight contents

**Steps:** count · % of goal · km (stride 0.762 m est.) · peak/quiet hour · hourly bars (tap readout) · named walks · meaning lines.

**Screen:** DW donut via exclusive app-foreground union (`ScreenTime` + chunked `UsageDayParser.parseDay`) · ceiling · unlocks · pickups · peak/quiet · hourly minutes · top apps · under/over ceiling readout.

## Goals

- Steps: DataStore `device_steps_target` (3k–30k, ±500)
- Screen ceiling: DataStore `device_screen_target_ms` (1h–12h, ±15m, default 4h)

## Also in this unit

- Config: Plan chip = tier icon + label only (no Manage/Free)
- Config → Data: **Load 10-day sample** / Clear sample (QA past days; today stays live)
- Export: 7 / 14 / 30 day picker · `LifeExport` v2 · phone ledger via usage stats
- Money: category bar + wealth figures tap readout
- Daily minimums: habit title only (no BODY/MIND/CRAFT labels)
- Splash: tighter lockup · no law Y-overshoot bounce
- Lab: screen/km/walks cells + hourly screen heat

## Files

`DeviceInsights.kt` · `TodayScreen.kt` · `DeviceMetricsRepository.kt` · `UsageDayParser.kt` · `ScreenTime.kt` · `HealthConnectSteps.kt` · `TenDaySample.kt` · `LifeExport.kt` · `ConfigScreen.kt` · `LabScreen.kt` · `MoneyScreen.kt` · `BrandMark.kt` · `SubscriptionPlan.kt` · inventory [[Device-Metrics-Code-Inventory]]

## Changelog

### 2026-08-13 — Screen time: stop +20m over-read (`union_plus_12`)
- **What:** Busy-day path no longer blends unlocked. `shown = min(unlocked, exclusiveUnion + 12m)`. Cap against unlocked, never interactive (AOD). Quiet days still exclusive union.
- **Why:** Founder — app still ~20m above Digital Wellbeing / home widget. Old `union_unlock_w2 = (2·unlocked + exclusiveUnion)/3` overweight AOD residue.
- **Files:** ScreenTime.kt, ScreenTimeTest.kt, DeviceMetricsRepository KDoc, Device-Metrics-Code-Inventory.md
- **Status:** unit tests pin founder case · assembleDebug green · **device unverified** (AIN065 unplugged)
- **Notes:** Cannot query WellbeingSettingsProvider. Eyeball when phone returns.

### 2026-08-10 — Screen time: no DW read API · OS mid/weight law
- **What:** Confirmed WellbeingSettingsProvider / slices **reject** third-party query — cannot paste widget number. Parser: chunked UsageEvents; lockscreen-wake abort (KEYGUARD_SHOWN ≤5s after INTERACTIVE does not `closeUnlocked` into sum); AOD keeps `unlocked`. Header when busy: `(2·unlocked + exclusiveUnion) / 3` (`union_unlock_w2`) — exclusive ACTIVITY union under-reads, unlocked wall-clock over-reads; weight toward unlocked (widget side). Same-minute ~23:48: AIIMIN **5h 16m** · refreshed home widget **5h 14m** · Δ **+2m** (was +19m on aod_trim; user +3m on unlocked-only).
- **Why:** Founder — stop heuristic roaming; find OS source. Source = UsageStats (only public substrate); DW internal number locked.
- **Files:** UsageDayParser.kt, ScreenTime.kt, DeviceMetricsRepository.kt, ScreenTimeTest.kt, UsageDayParserLogicTest.kt
- **Status:** shipped local APK; Δ≤2m vs refreshed widget this proof
- **Notes:** DW dashboard UI can lag widget (5h08 vs 5h14 same evening). Tap widget refresh before compare. Cannot ship “read DW DB” without system privilege.

### 2026-08-10 — Screen time core: unlock-clock fix + unlocked header
- **What:** (1) `UsageDayParser`: `SCREEN_NON_INTERACTIVE` no longer clears `unlocked` / invents keyguard — AOD blinks were freezing `unlockedMs` and inflating the gap. (2) `ScreenTime`: busy-day header = **unlocked screen-on** (path `unlocked_screen_on`) when gap ≥45m; quiet days keep exclusive ACTIVITY_* union. Retired fixed-45% / adaptive-AOD / unlock+18% keep (those were compensating for the freeze). Same-minute AIN065 ~22:42: home widget **4h 59m** · AIIMIN **4h 57m** · Δ **−2m** (was **+19m** on aod_trim). Unlocks 106.
- **Why:** Founder — home Screen time widget ≠ AIIMIN; fix to the core.
- **Files:** UsageDayParser.kt, ScreenTime.kt, ScreenTimeTest.kt, UsageDayParserLogicTest.kt, DeviceMetricsRepository.kt, Device-Metrics-Code-Inventory.md, Current-Context.md
- **Status:** superseded by weighted union/unlock law above (unlocked-only drifted to ~+8m over)
- **Notes:** Shots `w_uonly_224235.png` · `a_uonly_224256.png`. Widget has refresh affordance — tap refresh before compare.

### 2026-08-10 — Screen reconciliation: DW_CALC + same-minute DW
- **What:** Added `DW_CALC` log in `ScreenTime.digitalWellbeingTotalMs`. Live: path=`aod_trim` · union≈239m · trim/out≈305m · AIIMIN UI **5h 06m** · DW dashboard **4 hrs, 47 mins** · unlocks **104=104**. Δ ≈ **+19m** (AIIMIN over). Union farther from DW than trim (|239−287|=48m vs |305−287|=18m) — do **not** prefer union tonight; raise AOD bloat % or blend if fixing.
- **Why:** Founder 20m over-read investigation.
- **Files:** ScreenTime.kt · debug-shots/
- **Status:** superseded by unlock-clock + unlocked header above
- **Notes:** Shots `aiimin_215848.png` · `dw_dash_215935.png` (<2 min apart).

### 2026-08-10 — HC background permission + FG skip
- **What:** Manifest `READ_HEALTH_DATA_IN_BACKGROUND`; request set includes it; `readToday` skips when background without grant; SecurityException → null under tag `HC`; keep last HC on failed poll. FG live: phone=9600 HEALTH_CONNECT. BG: skip + lastHc=9600.
- **Why:** Diagnostic — sensor 13k vs HC when locked.
- **Files:** AndroidManifest.xml, HealthConnectSteps.kt, DeviceMetricsRepository.kt, Device-Metrics-Code-Inventory.md
- **Status:** shipped (APK installed); founder must grant background in HC for locked polls
- **Notes:** `bgPerm=false` until grant. Health-app same-minute delta still needs founder eyeball.

### 2026-08-10 — Config craft + metrics inventory
- **What:** Config IA: subtitle, circular initials profile, Account / Preferences / This phone / Data & sync / Support, steel outline PrefGlyphs + ›. Full device-metrics inventory note. DeviceMetricsRepository KDoc aligned to AOD-trim law.
- **Why:** Founder settings inspiration + RCA before more sensor “fixes”.
- **Files:** ConfigScreen.kt, DeviceMetricsRepository.kt, Device-Metrics-Code-Inventory.md, Current-Context.md
- **Status:** shipped (compile green)
- **Notes:** VP0 settings queries empty. Palette locked — no cream / rainbow discs / navy-gold accents.

### 2026-08-08 — Screen time proof: AOD-gap trim (45%) when events truncated
- **What:** Same-minute on AIN065: Day SCREEN **6h 27m** · DW **6h 26m** · unlocks **64=64** (Δ **+1m**). Root cause: ACTIVITY_* event buffer under-reads Instagram (~81m vs DW 3h35); INTERVAL_DAILY FG over-reads. Law in `ScreenTime`: when interactive−unlocked ≥45m **and** exclusive app-union is <85% of trimmed clock, show `interactive − 45%·gap`. App list = daily FG (no launcher chrome) scaled to that total. Chunked carried-open `parseDay` kept for quiet days / unlocks / hourly.
- **Why:** Exclusive-union-only read 4h16 vs DW 6h23 — wrong geometry when OEM drops app events.
- **Files:** ScreenTime.kt, UsageDayParser.kt, DeviceMetricsRepository.kt, ScreenTimeTest.kt, TodayScreen.kt, Current-Context.md
- **Status:** shipped (AIN065 install + uiautomator DW proof 2026-08-08 ~18:38)
- **Notes:** Export untouched. 10-day sample at Config → Data.

### 2026-08-08 — Screen time core: exclusive app-union (chunked events)
- **What:** Displayed SCREEN = exclusive union of DW-counted app FG spans. `parseDay` walks overlapping 2h UsageEvents chunks (busy-day buffer was truncating morning apps). `ScreenTime.digitalWellbeingTotalMs(..., exclusiveAppUnionMs)` prefers that union over interactive / INTERVAL_DAILY FG. Phone/dialer **included** (DW lists them); deskclock/systemui/gms still out. Hourly heat from merged union spans. Strip copy: SCREEN = DIGITAL WELLBEING DONUT. Unit tests green (ScreenTime 7 · UsageDayParserLogic 8).
- **Why:** Prior “fixes” flip-flopped unlocked / interactive / AOD% / daily FG — all wrong geometry vs DW donut. Core law: DW today ≈ exclusive time with a counted app in FG, not raw screen-on.
- **Files:** ScreenTime.kt, UsageDayParser.kt, DeviceMetricsRepository.kt, ScreenTimeTest.kt, TodayScreen.kt, DeviceInsights.kt, Current-Context.md
- **Status:** superseded — union under-read on busy days; see AOD-gap trim proof above
- **Notes:** 10-day sample already at Config → Data. Export untouched.

### 2026-08-08 — Screen time DW parity (AOD trim) + Day strip craft
- **What:** `UsageDayParser.pickScreenOnMs` — when interactive−unlocked ≥45m, show interactive − 28%·gap (AOD/lock bloat). Same-minute proof on AIN065: DW **5h58** · unlocks **56** · app trim **~6h06** (was raw interactive **6h24**, Δ+19m → ~+8m). Day strip: over-ceiling danger stroke, clean SCREEN meta, body-floor copy (`physiology · not the 13k goal`), 2 note teasers.
- **Why:** Founder — screen still mismatched after flip-flops (unlocked vs interactive). Ground truth = Digital Wellbeing donut, not vibes.
- **Files:** UsageDayParser.kt, DeviceMetricsRepository.kt, UsageDayParserLogicTest.kt, TodayScreen.kt, DayStore.kt
- **Status:** shipped (AIN065 install) · Δ still ~±5–10m under heavy adb session; unlocks exact
- **Notes:** Do not Σ UsageStats aggregates (aggRaw ~8.5h — double-counts). Export button untouched. **Superseded** by exclusive app-union changelog above.

### 2026-08-08 — Insights v2 + habit-tick fix + plan radius
- **What:** Goal rings, day bands, narratives, app share bars, swipe-down dismiss; habit toggle no longer wiped by bootstrap; plan cards 10dp corners; splash one continuous lockup arc.
- **Why:** Founder — insights too basic · ticks reset · want rounded plans · smoother splash.
- **Files:** DeviceInsights.kt, TodayViewModel.kt, DayStore.kt, GraphSyncRepository.kt, SubscriptionPlan.kt, BrandMark.kt
- **Status:** shipped
- **Notes:** Delete audit reported in chat — waiting founder OK before removals.

### 2026-08-08 — Deep insights + goals + polish pack
- **What:** Long-press deep reads for steps/screen; triple-tap goals; Lab heat; export window; plan chip quiet; money tap; minimums de-clutter; splash smooth.
- **Why:** Founder ask — deep physical/screen insight without leaving Day.
- **Files:** paths above
- **Status:** shipped (APK installed AIN065 `9597fdea`)
- **Notes:** Hourly steps need app listening for bout ticks; screen hours from usage events.

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Current state

Status / scope / last meaningful change. Update when behavior changes.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Related

- [[09_FEATURES/Index|Features Index]]
- [[15_MEMORY/Current-Context]]

