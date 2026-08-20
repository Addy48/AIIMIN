---
authority: engineering
derived_from: Guides/The-App-Build · 15_MEMORY/Current-Context
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-06
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
tags:
  - type/audit
  - domain/native
  - status/living
---

# Native V3 — Device E2E audit (2026-08-06)

**Device:** Nothing AIN065 (`9597fdea`) · Package `in.aiimin.app.v3`  
**Session:** live sign-in after Origin fix · shots in `native-android-v3/dist/device-shots/e2e-*`  
**Authority for UI:** Drafting Table · steel palette locked  
**This note:** honest grade of every surface after install + data-input pass. No PIN / secrets.

---

## Priority: Steps + Screen (founder rage zone)

### What the phone showed (live)

| Figure | App (Day strip) | Notes |
|--------|-----------------|--------|
| Steps | **2,082** | Meta `OF 13,000 · PHONE` · Health Connect origin |
| Steps floor (separate line) | **floor 5,000** | Physiology floor under Life Score rail — different number than 13k target |
| Screen | **~2h 47m–2h 50m** | Meta `ANDROID · UNLOCKED` |
| Long-press STEPS | **No UI change** | Only refresh / grant path on tap — **no goal editor** |

### Accuracy model (code)

| Metric | Intended source | Status |
|--------|-----------------|--------|
| Steps | Single best Health Connect **on-device** origin (SPN > Nothing > android). Never sum origins. | Logic coded · live HC reads · **not re-compared to Settings step counter this session** |
| Screen | **Unlocked** spans (`KEYGUARD_HIDDEN` → lock/off) — matches Nothing Digital Wellbeing, not interactive/AOD | Coded after 2026-08-05 proof (interactive − unlocked ≈ 1h AOD bloat) · live label says unlocked · **founder DW compare still required on this install** |

### Why it still feels mismatched

1. **Two step goals on one screen** — `of 13,000` (display target) vs `floor 5,000` (score physiology). Looks like the app cannot decide what “goal” means.
2. **No long-press to edit steps goal** — founder ask; **not built**. Tap only refreshes or opens permission.
3. **Screen accuracy** depends on Usage Access + KEYGUARD events. Label is honest (`unlocked`), but without a same-minute Digital Wellbeing screenshot in this pass we cannot claim ≤5 min parity.
4. **Config minimums vs Day floors vs HC target** — onboarding locked 3 minimums; Day later showed web-synced “0 OF 8” habit list. Three systems, one brain overload.

### Must-build (P0)

1. Long-press STEPS → sheet: edit **daily steps goal** (persist; drive `stepsTarget` / progress bar).
2. One vocabulary on Day: **Goal** (editable) vs **Floor** (body minimum, not editable here) — never show both as competing “of N” without labels.
3. Same-session proof: log `AiiminMetrics` unlocked minutes next to Settings → Digital Wellbeing screenshot; ship only when Δ ≤ 5m or document OEM delta.

---

## Grade key

| Grade | Meaning |
|-------|---------|
| **Great** | Live on device; trustworthy; craft close to Drafting Table |
| **Mid** | Works but friction, craft debt, or confusing copy |
| **Broken** | Fails job, wrong data, or blocks trust |
| **Missing** | Not built / stub / seed-only |
| **Plan debt** | Built, but IA or product contract wrong |

---

## Per-screen audit

### 0 · Splash / cold open

| | |
|--|--|
| **Grade** | Great (2026-08-06 retest) |
| **Works** | `AiiminSplash`: atmosphere → stroke draw → spark bloom → wordmark → fade. System SplashScreen → Compose handoff. Reduce-motion short path. Device frames `splash-01..14`. |
| **Mid** | Android 12 circular system icon still a brief beat before free Compose mark. Onboarding welcome logo-in-badge separate. |
| **Missing** | — |

### 1 · Onboarding (Welcome → Sign-in → Claim → Arc → Minimums → First log)

| | |
|--|--|
| **Grade** | Mid → Great after fixes |
| **Works** | Live sign-in with OS-ID + PIN after **Origin header** fix. Returning OS-ID user **skips claim** → Arc. Arc, pick 3 minimums, settle first line enters shell. HC permission prompt appears. |
| **Mid** | `adb` space typing brittle. Claim plate still exists for email logins / new users — fine. Welcome badge box. |
| **Broken (fixed this pass)** | Better Auth `Missing or null Origin` blocked all live auth until OkHttp sent `Origin: https://aiimin.in`. |
| **Plan debt** | Calibration minimums (3) do not own Day’s later “0 OF 8” list — two catalogs. |

### 2 · Day (Today)

| | |
|--|--|
| **Grade** | Mid (metrics trust still fragile) |
| **Works** | Universal capture strip · LOG → · Device strip · Life Score rail · Daily minimums list · Sync identity line. Steps + unlocked screen populate when granted. |
| **Mid** | Life Score stayed **0 / NOTHING LOGGED YET** after Capture settle — score path not visibly tied to settled lines. Dual step targets (13k vs 5k floor). |
| **Broken / Missing** | **Long-press edit steps goal — missing.** Screen vs DW same-minute proof — not closed this session. |
| **Plan debt** | Day tries to be capture + phone OS + score + minimums — density fights “one job.” |

### 3 · Capture

| | |
|--|--|
| **Grade** | Great (core loop) |
| **Works** | Free text → **AI · LIVE offer** (₹95, Transport, Food, Auto, Rohan chips) → SETTLE / DRIFT. After settle: **1 TODAY**. Quick starts (Expense/Note/Journal/Voice/Scan/Habit) present. Journal row opens. |
| **Mid** | Composer retained stale prefix (`paidpaid…`) during automation. Voice/Scan not proven live. |
| **Missing** | Full undo toast E2E not re-proven this pass. |

### 4 · Money

| | |
|--|--|
| **Grade** | Great (data) / Mid (craft polish) |
| **Works** | **LIVE · API** · Overview-first · Safe to spend figure · Category MTD · Budgets/Ledger tabs · **Log · import** collapsed (Open). Real spent/budget numbers. |
| **Mid** | Negative safe-to-spend (over budget) reads harsh without coaching copy. Log·import SMS/file/AI not fully exercised on device this pass. |
| **Missing** | Approve draft queue E2E (share/SMS → Approve → web) not re-proven here. |

### 5 · Lab

| | |
|--|--|
| **Grade** | Mid / under-tested |
| **Works** | Screen exists · “Phone day · this device” section · patterns shell. |
| **Mid** | Automation often landed wrong when notification shade open. Depth of phone-day / walks / app breakdown not fully walked. |
| **Missing** | Founder-grade pattern insights vs seed — unclear what’s live vs stub. |

### 6 · Config

| | |
|--|--|
| **Grade** | Great (ops) / Mid (IA) |
| **Works** | Profile · rank/XP · Life Arc · Life mode · Sync LIVE · Appearance · Reduce motion · This phone (Steps 2,082 · Usage On) · Connections · **Export everything** → real files in `cache/exports` + share chooser · Delete veil (honest refuse). Flat PrefList. |
| **Mid** | “Daily minimums” row opens notice (“edit on Today”) — dead-end feel. Replay calibration resets trust without warning copy enough. |
| **Plan debt** | Config shows OS-ID **`AADITYAU`** while login used **`aadi0837`** — username vs public plate not explained. |

### 7 · OS-ID

| | |
|--|--|
| **Grade** | Great (craft) / Mid (identity source) |
| **Works** | Credential plate · PART NO · stamp fields · revision seal · 2×2 spec · Appears-on chips · **Share plate** · tap-to-copy. Steel language intact. |
| **Mid** | Plate shows graph id `AADITYAU`, not the login string. Share may open unexpected handlers on OEM. |
| **Missing** | Live revision / claim change flow. |

### 8 · Export / data sharing

| | |
|--|--|
| **Grade** | Great (code + device proof) |
| **Works** | `LifeExport` writes `.txt` + `.json` (`AIIMIN_life_export_2026-08-06_1244.*` on device). Share sheet **Open with** (ChatGPT / Chrome / WPS). |
| **Mid** | Chooser UX OEM-dependent. User must pick app; no in-app preview of pack. |
| **Missing** | Account delete E2E wipe (intentionally refused until API). |

### 9 · Life Score / Settle day

| | |
|--|--|
| **Grade** | Broken / Missing feel |
| **Works** | Rail exists · tap to mark day entry point. |
| **Broken** | After live Capture settle, Day still **0 · NOTHING LOGGED YET** — score not reflecting settled money/capture. Trust killer. |
| **Plan debt** | Server LHS vs local provisional not clearly labeled on phone. |

### 10 · Journal (from Capture)

| | |
|--|--|
| **Grade** | Mid / partial |
| **Works** | Entry from Capture “JOURNAL · templates · mood”. |
| **Missing** | Full template / history / export round-trip not device-proven this pass. |

---

## Cross-cutting

### Works great

- Live auth (after Origin) · graph Money · Capture AI settle loop · Export pack files · OS-ID plate craft · unlocked screen **labeling** · HC single-origin steps **intent**.

### Mid / needs improvement

- Day information architecture · dual step goals · Config minimums dead-end · Lab depth · splash/onboarding badge box · OS-ID string vs login alias · Capture composer hygiene.

### Ain’t working (trust)

- Life Score not updating after settle.  
- Long-press steps goal **absent**.  
- Steps/screen **founder parity vs Settings** not closed on this install with side-by-side evidence.

### Ain’t built

- Editable steps goal (long-press).  
- Unified minimums editor.  
- Account wipe.  
- Full SMS money ingest E2E proof.  
- Voice/Scan capture E2E.  
- Native widgets / push (if still out of V3 scope — say so in tracker).

### Ain’t planned correctly

1. **Three “goal” systems** — HC display target (13k), body floor (5k), daily minimums (onboarding 3 vs web 8).  
2. **Day one-job law** vs stacking capture + phone OS + score.  
3. **OS-ID**: login identifier ≠ plate PART NO without teaching.  
4. **Claim step** for new users vs returning users was wrong until skip fix — email path still needs product story.

---

## Evidence index

| Artifact | Path / note |
|----------|-------------|
| APK | `native-android-v3/dist/aiimin-v3-current.apk` |
| Screenshots | `native-android-v3/dist/device-shots/e2e-*.png` |
| Export files on device | `cache/exports/AIIMIN_life_export_2026-08-06_1244.{txt,json}` |
| Origin fix | `NetworkModule.kt` |
| Returning claim skip | `OnboardingStore.skipClaimForReturningUser` |
| Screen = unlocked | `UsageDayParser.kt` · Day meta `ANDROID · UNLOCKED` |
| Long-press steps | **Not in** `TodayScreen.DeviceStrip` — tap only |

---

## Ordered fix list (recommended)

1. **P0** Long-press STEPS → edit goal; clarify Goal vs Floor on Day.  
2. **P0** Same-minute DW vs app screen + Settings steps vs HC — proof or document OEM delta.  
3. **P0** Life Score refresh after Capture settle (or honest “provisional / server pending”).  
4. **P1** OS-ID plate shows login alias + PART NO or one canonical string with subtitle.  
5. **P1** Lab phone-day full walk + Money ingest ladder device proof.  
6. **P2** Onboarding welcome de-badge; Config minimums open real editor.

---

## Status

**Audit status:** `passed` as documentation of device state  
**Product status:** `partial` — core capture/money/auth live; metrics trust + score loop + steps goal editor still open
