---
authority: engineering
derived_from: 09_FEATURES/Mobile/Native-Device-Insights
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-13
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
tags:
  - type/feature
  - domain/native
  - status/living
---

# Device metrics — code inventory (screen + steps)

> [!abstract] Satellite note
> Not the primary feature MOC. Primary contracts live in the folder’s main feature note + [[09_FEATURES/Index]].


> Root-cause inventory before further “fix”. Full sources live under
> `native-android-v3/`. This note is the call-chain map + anomaly flags.
> Do not invent a second collection path.

**Module root:** `native-android-v3/` · package `aiimin.core.data.device`

## Call chain (today)

```
MainActivity / Hilt
  → DeviceMetricsRepository.start()          // sensors + 15s poll
  → refreshAll()
       ├─ refreshHealthConnectSteps()        // HealthConnectSteps.readToday
       │     └─ publishMergedSteps()         // mergePhoneSteps(hc, sensor)
       └─ UsageDayParser.parseDay(...)       // UsageStatsManager.queryEvents
             └─ ScreenTime.digitalWellbeingTotalMs(...)
  → StateFlow<DeviceMetrics>
       ├─ TodayViewModel.deviceMetrics → TodayScreen.DeviceStrip
       ├─ ConfigViewModel.deviceMetrics → ConfigScreen “This phone”
       └─ DeviceInsights sheets (long-press)
```

**No Supabase / GraphSync path for screen or steps.** Verified: no matches in
`GraphSyncRepository` or `server/**/mobile*` for `screen_time` / `step_count`.
Export only: `LifeExport` + `phoneHistory()` → Markdown/JSON share.

---

## 1. Data collection

### Permissions (`app/src/main/AndroidManifest.xml`)

| Permission | Use |
|------------|-----|
| `ACTIVITY_RECOGNITION` | `TYPE_STEP_COUNTER` / `TYPE_STEP_DETECTOR` |
| `health.READ_STEPS` | Health Connect StepsRecord |
| `PACKAGE_USAGE_STATS` | UsageStatsManager (user must grant in system Settings) |

Runtime: Config / Today launchers for HC + activity recognition; usage via
`Settings.ACTION_USAGE_ACCESS_SETTINGS`.

### Steps — Health Connect

**File:** `core/data/.../HealthConnectSteps.kt`  
**Entry:** `suspend fun readToday(context: Context): ReadResult?`

- Window: `LocalDate.now(systemDefault).atStartOfDay` → `Instant.now()`
- Aggregate `StepsRecord.COUNT_TOTAL` (all origins + per phone origin)
- Phone origins: `android` · SPN `com.android.healthconnect.phone.*` · Nothing health/pedometer
- **Never sum** multiple phone origins — pick single highest stream
- Merge with sensor: `mergePhoneSteps(hc, sensor, maxSensorLead=400)`

### Steps — sensors

**File:** `DeviceMetricsRepository.kt`  
**Listener:** `SensorEventListener` on `TYPE_STEP_COUNTER` (FASTEST) + `TYPE_STEP_DETECTOR` (NORMAL)

- Baseline in DataStore (`device_step_baseline` + calendar day)
- Day total = `max(counter−baseline, detector count)` → `sensorToday`
- Not authoritative alone when HC available

### Screen — UsageStats

**File:** `UsageDayParser.kt` · `parseDay` / `collectDwDay` / `parse`  
**API:** `UsageStatsManager.queryEvents` in **30-minute chunks** with carried-open ACTIVITY sessions; full-range query for unlocks / interactive / unlocked.

Events used:

| Event | Role |
|-------|------|
| `SCREEN_INTERACTIVE` / `NON_INTERACTIVE` | interactive clock + pickups (≥15s) |
| `KEYGUARD_SHOWN` / `HIDDEN` | unlocks (800ms debounce) |
| `ACTIVITY_RESUMED` / `PAUSED` / `STOPPED` (+ MOVE_TO_*) | app FG spans → exclusive union |

**Also:** `queryUsageStats(INTERVAL_DAILY)` in `refreshAll` for **app row weights** (scaled to header).

---

## 2. Data storage

| Key / store | What |
|-------------|------|
| DataStore prefs | `device_step_day`, `device_step_baseline`, `device_detector_steps`, `device_last_cumulative`, `device_last_cum_day`, `device_last_screen_ms`, `device_steps_target`, `device_screen_target_ms` |
| In-memory | `MutableStateFlow<DeviceMetrics>` · `boutBuffer` · HC/sensor caches |
| Room | **none** for device metrics |
| Supabase | **none** for device metrics |

Goals: steps 3k–30k (±500); screen ceiling 1h–12h (±15m, default 4h).

---

## 3. Transformation

**File:** `ScreenTime.kt` · `digitalWellbeingTotalMs(...)`

Law (AIN065 2026-08-10 — UsageStats only; DW provider locked to 3rd parties):

1. Parser: chunked UsageEvents; AOD keeps `unlocked`; KEYGUARD_SHOWN ≤5s after INTERACTIVE **aborts** unlock pulse (no closeUnlocked into sum).
2. Busy (gap ≥45m) and union <92% unlocked: `shown = min(unlocked, exclusiveUnion + 12m)` (`union_plus_12`). Never cap against interactive (AOD).
3. Else exclusive ACTIVITY_* union (quiet / complete).
4. App list: `scaleAppForegroundToTotal(dailyFg, shownTotal)`.

Retired: fixed/adaptive AOD%, unlock+18% keep, unlocked-only, homeChrome subtract, unbounded daily-fill.

**Format:** `UsageDayParser.formatHours` — half-up to nearest minute.

**Walks / hourly steps:** `deriveWalks` / `deriveHourlySteps` from sensor bout buffer only (need app listening).

**Timezone:** all day bounds + hour buckets use `ZoneId.systemDefault()`.

---

## 4. UI display

| Surface | Binding |
|---------|---------|
| Day strip | `TodayScreen.DeviceStrip` — STEPS / SCREEN cells |
| Deep sheets | `DeviceInsights.kt` |
| Config grants | `ConfigScreen` “This phone” PrefRows |
| Lab heat | hourly from `DeviceMetrics` / sample |
| Export | `LifeExport` + `phoneHistory(days)` |

Refresh: ON_RESUME (Config) · 15s poll · sensor ticks · tap strip.

---

## 5. Sync logic

**Not applicable to cloud.** Local only.

- Frequency: HC+screen every 15s while `start()`; sensors continuous
- Conflict: HC phone stream wins; sensor raises ≤400; no server merge
- API schema: none for metrics (habit sync is separate GraphSync)

---

## Anomaly flags (for RCA)

1. **Stale class KDoc** (fixed 2026-08-10): claimed “Never AOD-gap heuristics” while `ScreenTime` **is** AOD-trim — docs lied vs code.
2. **OEM event buffer truncation:** busy-day ACTIVITY_* under-reads (Instagram events ≪ DW). Law falls back to AOD-trimmed interactive — device-calibrated, not universal.
3. **INTERVAL_DAILY FG over-reads** if used as header (explicitly avoided); still used for **app rows** then scaled — relative weights can drift vs DW app list.
4. **Hourly screen** from union/interactive spans; **hourly steps** only while app listens — incomplete vs Settings.
5. **Double-count trap avoided:** never sum HC phone origins; never Σ `totalTimeVisible` as total.
6. **formatHours half-up** vs DW “hrs, mins” wording — ±1m possible.
7. **Day boundary:** midnight via system zone; travel / TZ change mid-day not special-cased.
8. **Sensor baseline float:** cumulative counter is `Float` — long-lived devices can lose sub-step precision.
9. **No cloud truth:** comparing app to DW is local; nothing in Supabase to reconcile.
10. **Config copy lag:** older “Σ app foreground” wording (updated 2026-08-10 with Config craft).
11. **LIVE 2026-08-10 21:29 IST — Health Connect break when not true foreground:**  
    `SecurityException: must be in foreground … does not have android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND`  
    plus `Caller does not have permission to read data for StepsRecord from other applications`.  
    Result: `healthConnect phone=null` · `steps=13098 source=SENSOR` · msg `sensor · waiting for phone steps`.  
    Manifest has `READ_STEPS` only — **no** `READ_HEALTH_DATA_IN_BACKGROUND`. Poll every 15s while paused/dream fails HC → sensor-only path ≠ pedometer/Health app.
12. **LIVE screen transform (same minute):** interactive=19365668 · unlocked=13781415 · gap=5584253 (≥45m) · trimmed=AOD 45%=16852755 · union=13028691 (<85% trimmed) → shown **4h 41m**.
13. **FIX 2026-08-10 21:50 IST — background permission + FG gate:** Manifest + `PERMISSIONS` include `READ_HEALTH_DATA_IN_BACKGROUND`. `readToday` skips when background without grant; SecurityException logged under tag `HC`; `refreshHealthConnectSteps` keeps `lastHc` on null. FG proof: `phone=9600` `source=HEALTH_CONNECT`. BG without grant: `skip background poll` · `lastHc=9600`. Runtime `bgPerm=false` until founder grants in HC settings.

## Changelog

### 2026-08-10 — Screen unlocked header + AOD unlock-clock fix
- **What:** Parser no longer clears `unlocked` on `SCREEN_NON_INTERACTIVE`. Busy-day SCREEN header = `unlockedMs` (`unlocked_screen_on`). Same-minute ~22:42: widget **4h 59m** · AIIMIN **4h 57m** · Δ **−2m**.
- **Why:** Home widget mismatch; prior AOD% laws compensated for frozen unlockedMs.
- **Files:** UsageDayParser.kt · ScreenTime.kt · tests · Native-Device-Insights.md · this note
- **Status:** shipped (APK on AIN065)
- **Notes:** Shots `w_uonly_224235.png` · `a_uonly_224256.png`.

### 2026-08-10 — Live diagnostic (AIN065, phone on dream/keyguard)
- **What:** Full pipeline audit + live `AiiminMetrics` capture. HC blocked without foreground/background health permission; screen AOD path verified with numbers.
- **Why:** Founder FULL DEVICE METRICS DIAGNOSTIC prompt.
- **Files:** this note · live logcat
- **Status:** partial — DW/Health UI numbers need unlocked phone
- **Notes:** Focus was `deskclock` DreamActivity when sampled.

### 2026-08-10 — Inventory + Config craft
- **What:** Full layer inventory written; DeviceMetricsRepository KDoc aligned to AOD law; Config IA polish from settings inspiration (steel glyphs, section regroup, initials profile).
- **Why:** Founder RCA ask + Config improvement.
- **Files:** this note · DeviceMetricsRepository.kt · ConfigScreen.kt · Native-Device-Insights.md
- **Status:** shipped (compile + device unit tests)
- **Notes:** VP0 settings search returned 0 designs — inspiration from founder PNG only.
