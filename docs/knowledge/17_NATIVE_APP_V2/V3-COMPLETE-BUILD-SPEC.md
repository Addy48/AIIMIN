---
authority: engineering
derived_from: Genesis · Handoff-Native-App-Build · Native-Notification-Voice · Play-Store-Launch
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-13
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-SPEC
tags:
  - type/spec
  - domain/native
  - status/living
---

# Native V3 — Complete leftover build spec

> One contract for every remaining slice. Agents implement **one row at a time**.
> Palette LOCKED. Five tabs only. Data through `/api/*` with session cookie.
> Phone may be unplugged — proof = unit tests + `:app:assembleDebug`, then founder install.
> **Do not claim device parity** without AIN065 evidence.

**Companion:** [[Native-Notification-Voice]] · [[Native-Plan-System]] · [[Play-Store-Launch]] · [[V3-BUILD-TRACKER]]

**2026-08-14 APK status:** A6 `note.delete` in batch (local code). D3 minimums scroll · HC background · emulator loop. Prior 2026-08-13: A1–A5 · B knocks · C1–C4 · D1 18+ · D4 Google website-only · D5 Unlock {OS-ID} · E Search/Timeline/Family/Documents/Goals · Glance. Still PARK: FCM, Room, Billing, Groq, FI/burn. **Prod `note.delete` waits commit+push+EC2.**

## Law

1. Drafting Table look: steel `#749dc4` / `#416180`, spark `#ff6b35` on BrandMark only, Barlow Condensed chrome, Barlow body, JetBrains Mono numerals, square corners, hairline borders.
2. One job per surface (P8-R-124). No sixth tab.
3. Nothing writes without Settle (Capture) or an explicit user confirm.
4. Life Score is **server-only** (`GET /intelligence/lhs`). Never recompute.
5. No auth schema / Play Billing / account wipe without founder. **Google signup is website-only.** Gmail is already bound to the OS-ID during web onboarding (PIN mandated). Phone login is OS-ID + PIN. Biometrics identify that plate and resume a stored session — they never mint credentials.
6. Knock copy from [[Native-Notification-Voice]] — witty, never shame.

## Depth scale

| Depth | Meaning |
|-------|---------|
| **D1 ship** | Must work offline-capable on this APK. Core loop / trust. |
| **D2 wire** | Live `/api` already exists. Client hydrate + honest empty. |
| **D3 surface** | New Compose route, contextual, not a tab. |
| **D4 later** | V1 Blueprint yes, not this APK. Spec only until D1–D3 land. |
| **D5 founder** | Legal, Console, keys, grants. Engineering cannot finish alone. |

---

## TRACK A — Trust (D1)

### A1 · Screen time header (BUG — founder 2026-08-13)

**One job:** Day SCREEN ≈ Digital Wellbeing / home widget, never 20+ minutes high.

**Root cause (inferred from code + founder report):** busy-day path `union_unlock_w2 = (2·unlocked + exclusiveUnion)/3` weights **unlocked** (AOD / shade residue). Exclusive ACTIVITY union is the donut. When they diverge ~30m, the blend sits ~20m **above** the union — exactly the over-read.

**Law (replace `union_unlock_w2`):**

- Quiet / reliable union (≥92% of unlocked) → exclusive union.
- Busy (interactive−unlocked ≥45m, union truncated) → `shown = min(unlocked, exclusiveUnion + 12 minutes)`. Path `union_plus_12`.
- Never cap against **interactive** (that includes AOD). Cap against **unlocked**.
- Cannot query DW provider. Do not invent a third blend.

**Look:** Day strip SCREEN label stays `DIGITAL WELLBEING DONUT` / hours in JetBrains Mono. No extra chrome.

**Connect:** `UsageDayParser.parseDay` → `ScreenTime.digitalWellbeingTotalMs` → `DeviceMetricsRepository` → Today + Config + Lab heat + export. Same number everywhere.

**Done when:** unit test pins founder case (unlocked 30m above union ⇒ shown ≤ union+12m). assembleDebug green. Founder eyeball when phone returns.

**Files:** `ScreenTime.kt` · `ScreenTimeTest.kt` · `DeviceMetricsRepository` KDoc · this note · Native-Device-Insights.

**Not this slice:** reading WellbeingSettingsProvider (permission denied).

### A2 · Voice capture

**One job:** hold-to-talk fills the Capture composer, then the same Offer → Settle.

**Look:** VOICE preset becomes hold control — accent bar fill, mono timer `0:34`, release to transcribe. No new grammar. Reduce-motion: instant full bar.

**Function:** Android `RecognizerIntent` / `RecognitionService` (already queried in manifest). On fail → keep typed composer, notice `VOICE · OFFLINE`. Never auto-Settle.

**Connect:** `CaptureViewModel` existing VOICE kind → composer text → parse (local rules, then `/intelligence/parse` if session). Same chips.

**Done when:** unit/UI state: VOICE result sets composer; Settle still required. Device E2E when phone returns.

### A3 · Scan OCR

**One job:** camera or gallery → text into composer → Offer.

**Look:** SCAN SOURCE sheet already exists. Keep steel. No Material picker chrome.

**Function:** ML Kit OCR (already in catalog). Camera | Gallery. Empty OCR → honest notice, no fake chips.

**Connect:** same Capture parse path.

### A4 · Money ingest E2E (code exists)

**One job:** share / paste / SMS-opt-in / file / AI → draft → **Approve** → wealth POST with Idempotency-Key.

**Look:** Money “Log · import” collapsed. Drafts as Blueprint rows. OTP never queued.

**Connect:** `PaymentInboxStore` · `TransactionalSmsScanner` · `MoneyImportRepository` · `GraphSyncRepository` money outbox · `POST /wealth/transactions`.

**Play:** SMS declaration before store. Not this code slice.

### A5 · Journal voice / search / export

**One job:** reflection capture stays type-first; voice is a bar, not a gate.

**Look:** composer keyboard-ready; VoiceRecordBar secondary; templates chips after Catch. History list with excerpt + mood. Search = filter field on history. Export = share TXT of selected/all via existing `LifeExport` pattern.

**Connect:** `journal.upsert` already in GraphSync. Audio stays on-device until cloud replay (Pro — D4).

### A6 · Note server delete

**One job:** delete on phone removes the graph row, not a local hide.

**Function:** `note.delete` on `POST /mobile/sync/batch` — `DELETE FROM notes WHERE id AND user_id` (same as web `DELETE /notes/:id`). No new table. Phone enqueues delete, drops pending `note.upsert` for that id, and bootstrap excludes pending delete ids. Notice `DELETED · SYNC WILL WIPE`. **On api.aiimin.in as of 2026-08-14 via scp (not in git).**

**Connect:** `NoteStore` · `GraphSyncRepository`.

---

## TRACK B — Knocks / notifications (D1) — SHIP THIS APK

Source of truth for copy: [[Native-Notification-Voice]].

**One job:** earned attention (Genesis Knock), never spam.

### Look

Config → **Notifications** full screen (not a jump to system Settings as the only UI).

1. Head: `KNOCKS` · “One ping. One job.”
2. Master: On / Off (soul = steel, not a Material switch rainbow).
3. Quiet hours row: default `22:30–07:00 Asia/Kolkata`, editable.
4. Channel list: hair rows, ON/OFF, defaults from the voice plan.
5. Foot: `System permission` ghost → OS notification settings. POST_NOTIFICATIONS rationale on first On.

Tray: small BrandMark or steel square; title ≤42 chars; body ≤90; 0–1 emoji; no stack of three scolds.

### Function

| Channel | Default | Trigger |
|---------|---------|---------|
| `day.evening` | On | 20:30–21:30 · ≥1 SHOW_UP pursuit open · not quiet |
| `day.morning` | Off | 07:30–09:00 · opt-in · app not opened prior evening |
| `body.steps` | On | 50% / 90% / 100% of steps goal · once each |
| `body.screen` | On | 85% ceiling · 100% once |
| `body.still` | Off | ≥90 min seated (only if we have a seated signal; else skip) |
| `lab.english` | On if Core+ | 18:00–20:00 · 0 speaking sessions today |
| `money.pulse` | Off | spend > 80% day budget · never “broke” |
| `sync.hold` | On | pending ≥5 for ≥30m **or** lastError |
| `agenda.soon` | On if events | 15m before start |
| `notes.park` | Off | pinned note untouched ≥3 days |
| `score.week` | Off | Sunday 10:00 · published LHS |

Caps: max 1 of same case per local day (except sync.hold may retry). Copy A/B/C seeded by `osId+date+case`.

### Connect

- `WorkManager` periodic 15m (no network required) + oneshot after metrics refresh.
- Channels via `NotificationManager` matching ids above.
- Deep link extra `aiimin.knock` = `day|money|english|config|notes|score`.
- Analytics: channel + case id only — never body text.
- `mobile_devices.push_token` exists server-side. **This APK ships local knocks.** FCM remote push = D4 (needs Firebase + server send). Register empty token is fine.

**Done when:** evaluator unit tests cover quiet hours, caps, evening unfinished, screen over, steps half. assembleDebug. Channels created. Config screen toggles persist.

---

## TRACK C — Live graph (D2)

### C1 · Lab correlations

**One job:** ask, review, act on **your** patterns — not seed demo.

**Look:** existing Lab Blueprint pair card (ρ · q · n), plain-English line, scatter, survivors. Head meta `LIVE · n=Nd` or `INSUFFICIENT · need 14 days`. Never show seed numbers while signed in.

**Function:** `GET /intelligence/correlations` (Spearman + BH already on server). Map `bhPassed` survivors. Rejected count = total − survivors. Pull on bootstrap/`refreshAll`. Empty → honest empty, keep last live, do not fall back to fake seed.

**Connect:** `AiiminApi` · `LabStore.applyLive` · `GraphSyncRepository.hydrateLabSafe`. Reports entry (C2) from Lab foot.

### C2 · Reports

**One job:** export a settled drawing of the week — **web is the deep surface**.

**Look:** contextual from Lab foot `REPORTS · OPEN ON WEB`. Not a sixth tab. If in-app: list Snapshot / Life OS Review / Interactive / Deep with tier gates matching `tierGating.js`. Locked rows → Plan catalog (existing S3 wall).

**Function this APK:** Chrome Custom Tab / browser to `https://aiimin.in/reports` when session exists. Native PDF gen = D4.

### C3 · Score rails → daily_logs

**One job:** mark and settle the day; published figure stays server LHS.

**Look:** keep Published block above provisional rails.

**Function:** Settle writes `POST` daily_logs **only if** `/db/daily_logs` or a mobile mutation exists. If not, keep local ScoreStore and label `MARKED ON PHONE · SERVER PENDING`. Do not invent a table.

### C4 · Agenda write

**One job:** upcoming list on Today; create/edit is web until calendar capture ships.

**This APK:** keep read-only hydrate. Foot: `Add on aiimin.in/calendar`. D3 later: create sheet → mutation.

### C5 · Money depth (FI / burn / runway)

**One job:** log and see money truth. Wealth AI is Pro/web.

**This APK:** Overview figures from ledger + budgets (already). FI velocity / burn / runway = read `GET /wealth/*` if those fields exist; else omit (never fake ₹0). Budget **edit** on device = D3.

### C6 · OS-ID revision

**One job:** one lifetime revision.

**This APK:** plate + live availability already. Revision write waits for the existing claim/revision endpoint. Do not add a second id.

---

## TRACK D — Calibration & gates (D1/D2)

### D1 · 18+ age gate (Play P-09)

**One job:** no minor on the OS.

**Look:** Welcome, under the law line: hair checkbox `I am 18 or older`. BEGIN disabled until ticked. Skip demo also requires it (Play). Copy: no medical/health claims.

**Function:** `ageConfirmed` on `OnboardingState`. Persist with onboarding completed. No DOB field this APK (DPDP minimization).

### D2 · Groq 10-step calibration

**One job:** personal OS from one sentence.

**Look:** Capture-identical chips (archetype · instruments · floors · arc).

**Function:** `POST /intelligence/arc/sharpen` exists (stub/fallback). Full “tell me about your days” = D4 until founder confirms Groq path. Do not fake an archetype.

### D3 · Config minimums editor

**One job:** edit the day’s SHOW_UP list without a dead-end notice.

**Look:** Config row opens Today scrolled to the same Daily minimums list. No second catalog. No dead-end toast.

**Connect:** `DayStore.requestFocusMinimums` · Today `scroll.animateScrollTo` · `setProgress` / bootstrap habits. One list — not onboarding 3 vs web 8 without labels.

**Done when:** unit test pins one-shot focus flag. Config tap lands on Today minimums. assembleDebug green. **Shipped 2026-08-14 (code).** Emulator visual pending.

### D4 · Google sign-in

**Website-only (founder 2026-08-13).** Gmail is linked to the OS-ID on aiimin.in; web onboarding still mandates OS-ID + PIN even for Google signup. The phone never shows a Google button. Custom Tabs / Play Google Sign-In = out of scope unless the founder reverses this.

### D5 · Biometric — Unlock {OS-ID}

**Look:** Sign-in primary `Unlock {OS-ID}` when a session + plate is stored. Config row `On · unlock {OS-ID}` / `Off · PIN`. Prompt title `Unlock {OS-ID}`, negative `Use PIN`.

**Function:** `BiometricPrompt` · DataStore flag. Success **resumes the stored session** (never mints). Cancel / no hardware → PIN for that OS-ID. After first PIN, optional offer to enable for next cold open. Cold-open with flag on: prompt once; cancel stays on Sign-in (does **not** skip into the shell).

---

## TRACK E — Genesis later surfaces (D3/D4)

All **contextual**, never new tabs.

| Surface | One job | Look | Function / connect | Depth |
|---------|---------|------|--------------------|-------|
| **Search** | Recall across the graph | Config or Day overflow · query field · grouped results | Filter local stores (notes, journal, money, agenda). Server search later | D3 |
| **Timeline** | Chronology not feed | Day of entries | Merge captures + journal + money by time | D3 |
| **Family** | Shared care | Pro gate | Bootstrap `familyDocuments` already on DTO — list + open | D3 |
| **Documents / resumes** | Grab a file | Vault list | Bootstrap `resumes` · share sheet | D3 |
| **Focus / Discipline / Goals** | Web Core tools | List + `EDIT ON WEB` | Bootstrap `goals` on VaultListStore · Config row | D4 lite **shipped list** |
| **Widgets** | Ambient Day score/steps | Glance, steel, no purple | `DayGlanceWidget` · Core app-unlocks names it | D3 **shipped** |
| **Room** | Survive process death for day/money | Invisible | Convention plugin exists. Migrate stores after D1 stable | D4 |
| **Play Billing** | Paid ladder | Plan catalog already | `GET billing/status` wired. Checkout UI later | D5 |
| **Account wipe** | Delete me | Veil stays refuse until `/data-deletion` E2E | G6 | D5 |
| **FCM push** | Server Knock | Same channels | Firebase + token on `mobile_devices` | D4 |
| **Crash reporting** | Sentry | — | After signed AAB | D5 |
| **iOS** | — | — | Out of V1 | — |

---

## TRACK F — Play / legal (D5)

See [[Play-Store-Launch]]. State `BUILDING`. Engineering this unit does **not** fill entity name, GSTIN, counsel, keystore backup, Console forms.

Must-have in APK before Console: 18+ gate (D1), notification rationale (B), SMS off-by-default (already), no medical claims, honest delete.

---

## Screen map — how things connect

```
Splash → Onboarding (18+) → Sign-in (OS-ID+PIN · Unlock {OS-ID} biometric)
      → Shell tabs: DAY · MONEY · CAPTURE · LAB · CONFIG

DAY ── Capture composer ── CAPTURE (Offer → Settle/Drift)
    ── Score (published LHS + local mark)
    ── Notes strip ── Notes vault
    ── Agenda strip (read)
    ── Device strip (steps/screen) ── insight sheets
    ── Minimums (DayStore)

MONEY ── Log·import ── Capture / drafts
      ── wealth GET/POST
      ── Core+ gate

LAB ── GET /intelligence/correlations
    ── English Spark (Core+)
    ── Reports → web

CONFIG ── Plan catalog (S0–S6)
       ── Knocks screen (this spec B)
       ── OS-ID · Journal · Notes · English
       ── Sync WorkManager 15m
       ── Export

Knocks WorkManager 15m ── evaluator ── tray ── deep link into above
```

---

## Agent partitions (do not collide)

| Agent | Owns | Must not touch |
|-------|------|----------------|
| A-screen | `ScreenTime.kt` + tests + insights vault | Knocks, Lab, Onboarding |
| B-knocks | `core/data/knock/*` · `app/knock/*` · Notifications UI · Destinations `Notifications` | ScreenTime formula |
| C-lab | `AiiminApi` correlations · `LabStore` · GraphSync hydrate | ScreenTime, Knocks |
| D-age | Onboarding welcome checkbox + store | Shell tabs |
| E-search | new feature module only until shell wire | other features |
| F-journal-voice | `feature/journal` | Capture parser |
| G-notes-delete | NoteStore + GraphSync mutation | Money |
| H-widgets | Glance + `:app` receiver | Theme tokens |

Shell/`Destinations.kt` integration is **one owner** after feature modules compile.

---

## Proof bar (every slice)

1. Failing unit test first where logic exists (TDD).
2. `:app:assembleDebug` BUILD SUCCESSFUL.
3. No seed numbers labeled LIVE.
4. Vault changelog append + Current-Context.
5. Device install = founder when AIN065 returns. Label **unverified on device**.

## Explicitly not in this APK

Google OAuth · Play Billing checkout · Room migration · FCM · signed AAB · counsel legal fields · iOS · Groq 10-step calibration · medical/health claims · reading DW private DB.
