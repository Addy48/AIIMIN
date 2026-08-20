---
authority: operations
derived_from: V3-COMPLETE-BUILD-SPEC · Current-Context
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-15
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-LOG
tags:
  - type/checklist
  - domain/native
  - status/living
---

# V3 leftover checklist (living)

> Agents **rewrite status in place** after every slice. Do not append a second copy.
> Spec: [[V3-COMPLETE-BUILD-SPEC]]. Emulator: [[Emulator-Workflow]].
> Proof labels: `code` = unit + assembleDebug · `emu` = AiiminLean screenshot · `ain065` = physical phone.

**Updated:** 2026-08-15 · Branch `feat/native-android-v3`

## How to read

| Mark | Meaning |
|------|---------|
| `[x] code` | Implemented; tests/assemble this machine |
| `[x] emu` | Seen on AiiminLean this session |
| `[ ]` | Still open for this APK |
| `PARK` | D4/D5 or founder-only — do not fake |
| `N/A emu` | Needs real phone / Play / keys |

---

## TRACK A — Trust

- [x] code · [x] emu · [ ] ain065 — **A1** Screen law `union_plus_12` + capped daily-foreground recovery when UsageEvents truncates (emu Day SCREEN ALLOW — no DW on AVD)
- [x] code · [ ] emu (layout) · [ ] ain065 — **A2** Hold-to-talk lives in THE LINE (`HOLD TO TALK` full-width, centered). Quick Starts are EXPENSE · NOTE · JOURNAL · SCAN · HABIT only
- [x] code · [x] emu chooser · [ ] ain065 · [ ] camera/OCR fire — **A3** Scan OCR (`SCAN SOURCE` · `CAMERA` · `GALLERY`)
- [x] code · [x] emu · [ ] ain065 — **A4** Money ingest UI (`Log · import` · Approve copy)
- [x] code · [x] emu — **A5** Journal (`VOICE · APPEND` · `Search history` · `EXPORT · TXT`)
- [x] code · [x] emu delete · [ ] ain065 · **EC2 live 2026-08-14** (scp, no git) — **A6** `note.delete` on `POST /mobile/sync/batch` · notice `DELETED · SYNC WILL WIPE` · emu signed in as founder — did **not** tap DELETE on live notes

## TRACK B — Knocks

- [x] code · [x] emu — Config Notifications screen (`KNOCKS` · quiet 22:30–07:00 · channels)
- [x] code — Quiet hours default 22:30–07:00
- [x] code — Channel ON/OFF persist
- [x] code — WorkManager 15m evaluator + unit tests
- [x] code — Deep link `aiimin.knock`
- PARK — **FCM** remote push (Firebase + server token)

## TRACK C — Live graph

- [x] code · [x] emu — **C1** Lab correlations (`SEED · DEMO` on local demo — honest)
- [x] code · [x] emu — **C2** Reports → `https://aiimin.in/reports` (`REPORTS · OPEN ON WEB` · did not open Chrome)
- [x] code · [x] emu — **C3** Score card on Day (`TAP · MARK THE DAY`)
- [x] code · [x] emu — **C4** Agenda + `ADD ON AIIMIN.IN/CALENDAR`
- PARK omit — **C5** FI / burn / runway (fields absent; never ₹0)
- PARK — **C6** OS-ID revision write (endpoint wait)

## TRACK D — Calibration & gates

- [x] code · [ ] emu — **D1** Welcome 18+ (`I AM 18 OR OLDER` / BEGIN disabled)
- PARK — **D2** Groq 10-step calibration
- [x] code · [x] emu — **D3** Config Daily minimums → Today scrolled to list (`DayStore.requestFocusMinimums`)
- PARK out — **D4** Google on phone
- [x] code · [x] emu row · [ ] ain065 sensor — **D5** Unlock {OS-ID} biometric (`Unlock with biometrics` · `Off · PIN` · did not flip ON)

## TRACK E — Contextual surfaces

- [x] code · [x] emu — Search (`LOCAL GRAPH` · empty query dumps nothing)
- [x] code · [x] emu — Timeline (`21 ROWS` live)
- [x] code · [x] emu — Family (`LIVE · EMPTY`)
- [x] code · [x] emu — Documents (`LIVE · EMPTY`)
- [x] code · [x] emu — Goals list + `EDIT ON WEB` (`LIVE · EMPTY`)
- [x] code · N/A emu home — Glance Day widget (needs launcher pin)
- PARK — Room
- PARK D5 — Play Billing checkout
- PARK D5 — Account wipe E2E
- PARK — Crash / Sentry
- N/A — iOS

## TRACK F — Play / legal

- PARK D5 — Console, GSTIN, counsel, keystore, signed AAB
- [x] code — 18+ in APK
- [x] code — SMS off-by-default
- [x] code — Delete veil refuses until `/data-deletion`

## Tooling (this Mac)

- [x] Android CLI + emulator 37.1.11 + AVD `AiiminLean`
- [x] code · N/A emu (no HC on AVD) — **HC background** Config row `Steps · background`
- [x] Scripts `native-android-v3/scripts/start-emulator.command` · `emu-run.sh`
- [x] emu splash + Welcome (prior) + Day sheet
- [x] emu full tab walk DAY · MONEY · CAPTURE · LAB · CONFIG
- [x] emu Knocks + Daily minimums focus
- [x] emu Journal + Notes + Graph rows + SCAN chooser + Lab Reports + biometric row
- [ ] emu hold-to-talk mic actually recording / scan camera+OCR fire / 18+ BEGIN (signed in, past Welcome)
- [ ] emu A6 delete of a **new test note only** (SAVE tap drifted to Knocks this pass — retry; never DELETE pinned `Capture beats memory`)
- RAM: do **not** Gradle while qemu up

## Parked (do not implement this APK)

- FCM · Room · Groq · Play Billing · account wipe · OS-ID revision · FI/burn fake · Google OAuth · mess-menu extractor (separate tool, not V3) · DW private DB

## Now (agent)

1. ~~A6 `note.delete`~~ code + **EC2 file live** 2026-08-14 (scp `mobile.js`, no git). **Next `git reset --hard` on the box will drop it until you commit.**
2. Emu leftover Graph/Journal/Scan/Reports/D5 row: **this session** (`captures/emu/leftover/`). Still open: A6 test-note delete · camera OCR · 18+ Welcome · AIN065.
3. Still PARK: FCM · Groq · Room · Billing
4. Do **not** commit unless asked

## Evidence log

| When | What | Receipt |
|------|------|---------|
| 2026-08-13 | assembleDebug leftover pack | BUILD SUCCESSFUL · APK ~60M |
| 2026-08-13 | emu install + launch | Welcome + Day sheet PNGs |
| 2026-08-14 | D3 + HC + honesty | DayStoreTest 7/7 · assembleDebug EXIT 0 · APK 61M |
| 2026-08-14 21:20 | A6 on EC2 (no git) | scp `mobile.js` · remote grep `note.delete` L321 · pm2 reload · `GET /api/health` `{"status":"ok"}` · `POST /mobile/sync/batch` HTTP 401 |
| 2026-08-14 21:55 | emu leftover walk AiiminLean | PNGs `native-android-v3/captures/emu/leftover/20-journal.png` … `26-goals.png` · `27-biometric-row.png` · `31-scan-chooser.png` · `33-lab-reports.png` · uiautomator: JOURNAL / SEARCH / TIMELINE 21 ROWS / FAMILY EMPTY / DOCUMENTS EMPTY / GOALS EDIT ON WEB / SCAN SOURCE CAMERA GALLERY / REPORTS · OPEN ON WEB / Unlock with biometrics Off · PIN |
| 2026-08-15 | founder screenshot pack | `~/Desktop/aiimin-images/` · live-emu dark 18 PNG · light 19 PNG · compose goldens 38 PNG · status `AIIMIN-APP-STATUS.md` · APK still 2026-08-14 21:15 (HOLD-in-THE-LINE not in APK) |
| 2026-08-15 | screen-time truncated-union recovery | `ScreenTimeTest` red: 270m daily foreground was reduced to 92m; green: focused class passes after capped daily foreground recovery |

### 2026-08-15 — A3 5X anti-lie receipt
- **Status:** **Verified for emulator camera/OCR fire and Settle-safety behavior; AIN065 remains unverified.**
- **Pass 1 — static truth:** `ScanOcr.readText()` uses on-device ML Kit, closes the recognizer on success/failure/cancellation, and `seedFromOcr()` returns an honest placeholder when OCR is blank. `CaptureScreen` routes CAMERA through permission → `TakePicture` → OCR → THE LINE; the resulting draft exposes Settle and Drift rather than auto-writing.
- **Pass 2 — focused tests:** `./gradlew :feature:capture:test` — `BUILD SUCCESSFUL` in 1s; CaptureParser and VoiceCapture tests remained green. OCR source failure/empty handling was inspected; no fake OCR text is generated.
- **Pass 3 — runtime:** fresh A2 APK remained installed; emulator camera permission was intentionally reset and the Android permission dialog appeared. Granting only emulator permission launched `com.android.camera2` from the V3 flow.
- **Pass 4 — black-box:** shutter and Done returned to `aiimin.app.MainActivity`; the Capture draft showed `scan receipt · image ready · describe amount/merchant:` plus `SETTLE` and `DRIFT`. Choosing Drift produced `HOLD TRAY · 1 WAITING` and `NOTHING SETTLED YET`. Screenshots: `.device-shots/a3-scan-chooser.png`, `.device-shots/a3-camera-live.png`, `.device-shots/a3-camera-review.png`, `.device-shots/a3-after-photo.png`, `.device-shots/a3-after-drift.png`.
- **Pass 5 — reconciliation:** after force-stop/relaunch, the temporary hold was gone and the app showed `NOTHING LOGGED YET`; no app crash signature appeared. No Settle action and no durable capture write occurred. The emulator camera permission was not changed on AIN065; hardware proof remains unverified.

### 2026-08-15 — D1 5X anti-lie receipt
- **Status:** **Verified for the 18+ Welcome gate and local restore path on emulator-5554; signed-in continuation is Blocked because no PIN was entered.**
- **Pass 1 — static truth:** `WelcomeStep` renders `I AM 18 OR OLDER`, toggles to `18 OR OLDER · CONFIRMED`, and leaves `BEGIN` disabled until age confirmation. `OnboardingStore.skipToShell()` refuses completion when age is not confirmed; no PIN is stored or logged by the local continuation path.
- **Pass 2 — focused tests:** `./gradlew :core:data:test :feature:onboarding:test` — `BUILD SUCCESSFUL` in 4s; onboarding persistence and age-gate helpers were included in the inspected source/test scope.
- **Pass 3 — runtime:** replayed onboarding through the existing Config `Replay calibration` control on the current installed APK; MainActivity resumed throughout. No account, note, or capture reset was performed.
- **Pass 4 — black-box:** initial screen showed `STEP 01 / 06 · WELCOME`, `I AM 18 OR OLDER`, disabled `BEGIN`, and `SKIP · LOCAL DEMO`; tapping disabled Begin did not advance. After tapping the age control, UI showed `18 OR OLDER · CONFIRMED` and enabled Begin; Begin advanced to `STEP 02 / 06 · SIGN IN`, showing `SIGN IN WITH PIN` and `CONTINUE OFFLINE (DEMO)`. Screenshots: `.device-shots/d1-welcome-initial.png`, `.device-shots/d1-welcome-confirmed2.png`, `.device-shots/d1-step2.png`.
- **Pass 5 — reconciliation:** no PIN was typed or requested from the user. The replay was safely exited by confirming age and choosing the documented local-demo exit; the normal five-tab shell returned with `AIIMIN · DAY SHEET`, DAY, MONEY, CAPTURE, LAB, and CONFIG. The full “while signed in” D1 acceptance remains **Blocked**, not inferred.

### 2026-08-15 — Depth phase 5X receipts
- **Capture parse — Verified/Inferred:** local parser, delayed `/intelligence/parse` mapping, blank/failure fallback, and no-write-before-Settle were traced; `:feature:capture:test` passed. Camera/OCR draft and Drift safety were device-verified above. Live authenticated `/intelligence/parse` round-trip is not claimed because no signed-in session was available.
- **Sync outbox — Verified by tests/source:** full `./gradlew test` passed; `GraphSyncRepository` outbox enqueue, serialization, note-delete exclusion, idempotency keys, and retry/queue paths were inspected. Live authenticated drain remains unverified.
- **Lab truth — Verified on emulator-5554:** the Lab surface showed `SEED · DEMO` and `Demo correlations — not computed from your live graph yet.`; no seed content was labelled LIVE. Screenshot: `.device-shots/depth-lab.png`.
- **Journal search/export — Search Verified on emulator-5554; export device path Inferred:** Journal showed seeded `HISTORY 2 / 2`, `Search history`, and `EXPORT · TXT`; entering `zzzz_AIIMIN_NO_MATCH_20260815` produced `NOTHING MATCHES`. `JournalStoreTest` covers empty save refusal, save, query filtering, clearing query, export text, and voice append. Source confirms ACTION_SEND `text/plain`; share-chooser proof was not obtained and is not claimed.
- **Money approval — Source/test Verified; device approval Blocked:** Money showed `SEED · LOCAL` / `SEED READ · NOT LIVE` and “Approve drafts before they write.” `PaymentDraftRow` exposes explicit `Approve` and `Dismiss` controls; OTP-only messages are rejected by `PaymentAlertParser` tests and the UI states OTP is skipped for SMS. A fresh controlled approval draft was not completed without risking an unremovable financial record; no real financial data was entered or changed.
