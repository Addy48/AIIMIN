---
authority: product
derived_from: Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-APPENDIX
tags:
  - type/appendix
  - domain/product
  - status/living
---

# Blueprint appendix — Onboarding & feature specs (§7–8)

> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

## 7. Complete onboarding

### 7.1 Objectives

| # | Objective | Success measure |
|---|-----------|-----------------|
| 1 | Reach one true value moment fast | First Settle (a real capture) < 90s from first product screen |
| 2 | Make the system feel **real and connected** | ≥1 person imported **or** ≥1 calendar connected **or** ≥1 health source linked |
| 3 | Establish honest baseline | Life Arc written; daily minimum chosen; optional AEI baseline |
| 4 | Earn trust before asking for sensitive scopes | Every permission preceded by rationale; refusal fully supported |
| 5 | Set day-2 return hook | Widget added, or one notification type chosen, or drill scheduled |

### 7.2 Before signup (public)

| Stage | Surface | Content |
|-------|---------|---------|
| Discover | `/` | Hero (*One screen. Every day.*), personas, four tiers with founding prices, launch journey, FAQ, waitlist form (email required; first name + OS-ID optional) |
| Understand | `/brand` | Human Momentum manifesto, pillars, **storage ledger** (what is stored, where, for how long), privacy/terms links |
| Reserve | `POST /api/waitlist` | Position, referral code, reserved OS-ID; confirmation email |
| Guest tour | `/` modal | Read-only slices (Today shape, Depth explainer, Money shape). **No fake data claiming to be theirs.** |

### 7.3 Signup / auth options

| Method | V1 status | Flow |
|--------|-----------|------|
| **Google** | EXISTS | OAuth (login client only, minimal scopes: `openid email profile`) → API handoff → OTT → SPA → profile completion |
| **Email + PIN** | EXISTS | Email → verify → 6-digit PIN as credential; OS-ID assigned/claimed |
| **OS-ID + PIN** | EXISTS | `GET /api/auth/resolve` OS-ID→email → PIN |
| **Apple** | POST-V1 (iOS gate) | Mandatory only when iOS ships with Google |
| **Passkeys** | POST-V1 | Better Auth plugin path documented |
| **Guest** | Read-only tour only | Guest **cannot** write life data (prevents orphan data + trust ambiguity) |

**Waitlist gate:** signed-in but not approved → `A-06 Pending access` (explicitly *not* an error state; shows position, referral, expected window).

### 7.4 The 12-step onboarding (V1 canonical)

Progress is a thin top bar; **Skip** visible except where marked Required; every step is resumable (server-persisted `onboarding_step`).

| Step | Screen | Ask | Required | Writes |
|------|--------|-----|----------|--------|
| 0 | Welcome | Name; one-line promise; theme picker (light/dark/dim) | Name | `users.name`, `theme` |
| 1 | OS-ID | Claim 8-char handle (live availability) | Yes | `username` |
| 2 | Security | Set 6-digit PIN + confirm; offer biometric (native) | Yes | credential, `biometric_enabled` |
| 3 | Life mode | Persona: student / professional / founder / family / athlete / custom | Yes | `persona`, applies nav pins + widget preset |
| 4 | Life Arc | North Star sentence (AI "sharpen" optional) | **Yes** (product redirects if missing) | `users.life_arc` |
| 5 | Focus areas | Pick 3–6 domains to pin | ≥3 | `nav_pins`, widget set |
| 6 | Daily minimum | Choose the 3 actions that define a surfaced day (default: 1 habit + 1 log + 1 movement/voice) | Yes | `daily_minimum` config |
| 7 | Starter habits | 1–5 from persona suggestions or custom | ≥1 | `habits` |
| 8 | **Privacy briefing** | One screen: tiers of data, what is never done (no selling, no ads, journal excluded from analytics), where controls live | Ack | `consent_ack` |
| 9 | **Connections** (progressive) | Google Calendar · Contacts/People · Health (native) · Notifications · SMS money (native) · Microphone (English) · Location (**not requested in V1**) | All optional | `user_consents` rows |
| 10 | **English baseline** (optional) | 3-part placement: read-aloud → 60s topic → 1 debate exchange → AEI + skill radar | Optional | `english_sessions`, `english_index` |
| 11 | First success | Guided single action: tick one habit **or** log one line → Depth rises visibly → "Surfaced" | Yes | real life entity |
| 12 | Land | Today with real content + widget prompt (native) + one notification choice | — | `onboarding_complete` |

Total target: **~4 minutes** with connections, **~90 seconds** if all optional steps skipped.

### 7.5 Permission model — rationale before dialog

Every sensitive scope uses the same 4-part pattern (component `A-08`):

1. **Plain purpose** — one sentence: what it enables
2. **Exact scope** — what is read; what is *not* read
3. **Where it lives** — device only / server / both, and retention
4. **Reversal** — "You can turn this off in Account → Privacy anytime"

| Permission | Platform | Purpose sentence | Read | Never | Storage | Refusal behavior |
|------------|----------|------------------|------|-------|---------|------------------|
| Google Calendar | web + native | See and manage your day alongside habits | events (r/w), Tasks (r) | Gmail, contacts | server (event metadata) | Manual events only; sync UI hidden |
| Google People / Contacts | web (People API) / native (device) | Turn names into real linked people | name, phone, email, photo of contacts **you select** | full book upload, call logs | server: name + normalized phone hash + optional display phone | Manual person entry |
| Health Connect | native | Count steps, distance, sleep toward your day | daily aggregates | per-workout GPS routes | server: **daily totals only** | Manual movement log |
| Usage stats (screen time) | native | Show screen time next to focus | daily total + top apps (local) | per-minute history upload | server: daily total (+ top-3 categories if opted) | Screen chip hidden |
| SMS / notification read | native | Turn UPI alerts into transactions | bank/UPI sender templates only | personal messages, OTPs beyond discard, raw body upload | server: parsed transaction only | Manual + statement import |
| Microphone | web + native | Record practice so you can hear progress | audio during an active session | background listening | device by default; cloud only if opted | Text-only English drills (typed) |
| Notifications | both | Only what you choose to be reminded about | — | — | token in `mobile_devices` | In-app only |
| Camera | native | Scan receipts and documents | frames during scan | background | uploaded doc only | Gallery/file picker |
| Storage/files | both | Attach and open your documents | files you pick | library scan | vault object storage | View-only, no attach |
| Location | — | **Not requested in V1** | — | — | — | — |
| Call log | — | **Not requested in V1** (relationship ledger stays manual) | — | — | — | — |

Rules: no permission is requested during step 0–8; refusing never blocks the app; a refused scope is re-askable at most **once per 30 days** and only in context ("Add from contacts?"), never as a modal on launch.

### 7.6 Guest, re-entry, and multi-device onboarding

| Case | Behavior |
|------|----------|
| Guest tour → signup | Nothing to migrate (guest cannot write); tour choices (theme) carried in `sessionStorage` |
| Returning user, new device (web) | Login → session → **no onboarding**; a 2-card "what's here" hint if `last_seen > 30d` |
| First native install for existing web user | Login → bootstrap → 3 native-only asks (biometric, notifications, health) → Today. **No repeat of steps 0–8** |
| Web after native | Nothing asked again; Connections tab shows native-only scopes as "managed on your phone" |
| Account restored after deletion | Treated as new user; prior data is gone (documented in delete Veil copy) |

### 7.7 First week / first month (activation, not nagging)

| Day | Moment | Channel | Rule |
|-----|--------|---------|------|
| 1 | Land + first Settle | in-app | — |
| 2 | One tip in-app: swipe to complete | in-app card, dismissible | Never a push |
| 3 | "Add one person or connect calendar" if neither done | in-app Open Loop | Once |
| 4 | First Depth surface celebration (proportional) | in-app | Once ever |
| 7 | **Weekly insight** — first real narrative with citations | in-app + optional push if opted | Requires ≥3 days data or says so honestly |
| 10 | Widget suggestion (native) | in-app | Once |
| 14 | Ivory Snapshot / first report offered | in-app | Tier-aware, no dark-pattern nag |
| 21 | Skill/AEI progress card if English used | in-app | Only with ≥5 sessions |
| 30 | Month replay + "what to change" | in-app | Optional push |

Re-engagement (`/api/cron/re-engagement` EXISTS) rules: maximum **1 message per 72h**, always specific ("₹500 from Rahul is 3 days overdue", "AEI +3 this week"), never "we miss you", never streak shame, honors quiet hours and notification prefs, stops after 3 unopened messages.

---


## 8. Feature specifications

Every feature is specified with the same 14 fields:
**Purpose · Why it exists · Discovery · Learning · Core use · Graph links · States · Edge cases · Permissions · Offline · Sync · AI · Notifications · Recovery/Deletion/History.**

### 8.1 Today + Depth (DOM-DAY) — the spine

**Purpose.** Answer "what is true today and what do I do next" on one screen.
**Why it exists.** P8 Ch08: Today owns the day; there is no Dashboard surface. Every other domain is reachable from here or from the palette.
**Discovery.** Default post-auth landing; wordmark click; native Today tab.
**Learning.** Onboarding step 11 performs one action and shows Depth respond. A one-time card explains the daily minimum.

**Core use (layout order, desktop):**

1. **Depth hero** — state machine below
2. **Daily minimum** — 3 slots with labels chosen in onboarding
3. **Open Loops** — carousel of things the system needs from the user (§8.14)
4. **Universal Logger** — one field, always focused by `L`
5. **Habits strip** — today's habits, swipe/tap
6. **Command timeline** — day spine merging calendar events + focus blocks + due items
7. **Health chips** — steps / km / screen time / sleep (native-sourced)
8. **Life Score card** — 0–98 with domain breakdown (D05 primary location)
9. **Weekly insight** — Coach output, only inside an open interruptibility window
10. **Micro-task** and **Recovery card** (conditional)

Widgets are user-toggleable and reorderable (drag handle); Today is **not** a widget landfill — max 8 visible blocks, others in "Show more of today".

**Depth state machine**

```text
inputs: minimumMet (0..3), hour, streak7 (days met of last 7), brokeYesterday

state =
  brokeYesterday && minimumMet == 0        -> depth.recover
  minimumMet == 0 && hour >= 11            -> depth.submerged
  minimumMet == 0 && hour <  11            -> depth.dawn        (neutral, no judgement)
  minimumMet in 1..2                       -> depth.rising
  minimumMet == 3 && streak7 <  5          -> depth.surface
  minimumMet == 3 && streak7 >= 5          -> depth.glide
```

- Transition animation only **After-Settle** of the action that changed `minimumMet`.
- Depth never reads a different data source than Life Score inputs.
- `depth.dawn` prevents "you are failing" at 7am — a real trust detail.

**Graph links.** Depth ← habits, daily_logs, focus_sessions, english_sessions, health_days. Open Loops ← every domain. Timeline ← calendar_events + focus_sessions + reminders + lend due dates.

**States.** Loading (skeleton per block, never a full-page spinner) · Partial (some APIs failed → that block shows honest error, rest renders) · Empty (first day: minimum slots + logger + "tick one habit") · Offline (banner + cached values labeled with timestamp) · Stale (`as of 9:02`) · Error per block.

**Edge cases.**
- Timezone change mid-day → day boundary follows `users.timezone`; a travel banner explains the shift once.
- Midnight rollover while app open → Today re-fetches at local midnight; unsettled Pulse is preserved as Drift.
- Clock skew (device vs server) → server `serverTime` wins for day boundary.
- Score unavailable (AI/DB partial) → show inputs and "score updating", never `0`.
- User completed minimum yesterday at 23:59 in another timezone → counted in the local day it was logged.
- Fresh account with zero data → `depth.dawn` regardless of hour.

**Permissions.** None required; health chips hidden without Health consent.
**Offline.** Today renders from cache; capture works; score shows last computed with timestamp.
**Sync.** Pull on focus + pull-to-refresh + after any local Settle.
**AI.** Coach (weekly insight, micro-task suggestion) only; Router for the logger. No AI blocks the page.
**Notifications.** None generated by Today itself except (opt-in) evening "minimum not met" single reminder at a user-chosen hour.
**Recovery / deletion / history.** Every block links to its domain where the record can be edited/deleted. Depth has no own data.

---

### 8.2 Capture system: Universal Logger, Journal, Notes, Daily Log

**Purpose.** Get anything out of the human's head into the graph in under 5 seconds, then structure it.
**Why.** P8 Ch06 + C-UX-02: capture first, structure later; no gate before Catch.

**Universal Logger flow (canonical Catch→Settle→Offer):**

```text
type "lent rahul 500 for cab, pay back friday"
  ↓ Enter (or ⌘Enter)
raw Pulse saved immediately  →  Settle ack ("Saved")     ← never blocked by AI
  ↓ async Router (Ch07)
OfferStack:
  [Lend ₹500 · person Rahul · due Fri 3 Aug]  confidence 82%  "from your text"
  [Add calendar reminder Fri 09:00]           confidence 61%  → needs confirm
  ↓ Accept / Adjust (chips) / Dismiss
Commit → money_lent row + person link + optional calendar_event
```

Rules: raw text is retained on the entity as `source_utterance` (provenance); AI never creates a finance record without an utterance (P5 kill list); dismissed Offers never re-appear in the same session; low confidence (<40%) asks one question instead of guessing.

**Journal (FLAGSHIP — Android + desktop).** Full research map: [[09_FEATURES/Journal/Research-Backed-Design]].

| Mode | Evidence (post-2020) | Session |
|------|----------------------|---------|
| Free write | Capture-first + EW baseline | 5–15 min |
| Expressive (one event) | Guo 2023 delayed durable effect; prefer 1–3 day intervals | Pack of 3 short sessions |
| 3 goods / WWW | Gratitude subset · Sohal 2022 meta | 2–5 min |
| Evening debrief | Day closure + delayed-effect support | ~5 min after 20:00 soft prompt |
| Structured reflection (CBT worksheet shape) | Common worksheet; **not therapy** | Labeled non-clinical |
| Weekly review | Links goals/habits | 10–15 min |

Mode is a **chip after entry starts**, never a gate (kill list: "journal mode gate"). Body = **private reflection** (P8-R-219) — never analytics, never push content, AI only on explicit per-entry ask. Never claim cure/diagnosis. Depth: journal can fill one daily-minimum slot. Android: biometric lock option on Journal; drafts survive process death. Streak freeze applies — no shame for skips.

**Notes.** List + editor, tags, search, attachments, Google Drive folder watch (EXISTS), anchor edges (link suggestions with confirm — `anchor_edges` EXISTS).
**Daily Log.** Structured day metrics (sleep, mood, water, energy, custom); the mobile version deliberately omits desktop-only fields (kill list: no protein input on mobile).

**States.** Draft (autosave local every 2s) · Saving · Settled · Hold (offline queued) · Conflict (same entity edited on two devices) · Drift (navigated away unsettled → restore card) · Error.
**Edge cases.** Empty submit ignored (no error) · 20k-character journal entry (server limit + graceful message) · paste of an image into notes (upload or reject with reason) · duplicate log for same day (upsert, not duplicate) · offline for 5 days then reconnect (batch of 200 → chunked 50 per request) · logger text that matches two domains (Offer stack shows both, user picks) · logger while a Veil is open (blocked — one Anchor rule).
**AI.** Router → Inferencer → Analyzer; Coach only outside capture. Journal AI is opt-in per entry.
**Deletion/history.** Soft delete with `deleted_at` + 30-day recovery bin for journal/notes; hard delete available in Privacy tab; edit history kept for journal (last 5 versions) so accidental overwrite is recoverable.

---

### 8.3 Habits (DOM-EXEC, core+)

**Purpose.** Make consistency visible.
**Core use.** CRUD with category, schedule (daily/weekly/N-per-week/custom days), reminder time; today's row swipe-to-complete; streak; 7-day strip; monthly dot grid; **yearly heatmap**; archive (never silent delete).
**Grid completion colors** (locked): 8/8 `#10b981`, 6–7/8 lighter green, <6/8 `#6b7280`.
**Graph links.** habit → daily minimum → Depth/Life Score; habit ↔ goal (a habit can serve a goal); habit ↔ english drill (the "English 3min" habit is satisfied by a real session, not a manual tick — the system ticks it and says why).
**Edge cases.** Habit created mid-week (no fake back-fill) · scheduled-day logic vs "any day" streaks (streak counts scheduled days only; UI states the rule) · retroactive tick (allowed up to 2 days back, marked `backfilled`) · timezone travel (day per user timezone) · archived habit with history (history preserved, excluded from score) · two devices tick the same habit (idempotent by `(habit_id, date)`).
**Offline/sync.** `habit.tick` is an idempotent mutation type (EXISTS).
**Notifications.** Per-habit reminder; one "streak at risk" per day maximum, calm tone; never guilt.
**Recovery.** Undo tick within toast window; unarchive; streak freeze (§8.13).

---

### 8.4 Goals + Life Arc (DOM-PLAN, core+)

**Purpose.** Keep direction visible and connected to daily action.
**Core use.** Pipeline kanban (Active / On Track / At Risk / Achieved), Grid by pillar (Academic, Career, Health, Personal), Archive; deadline picker (branded, not native input); progress %, notes; **Life Arc** tab (merged from `/identity`).
**Reverse planner.** From a goal deadline, generate weekly targets (e.g. "offer by Dec" → 3 applications/week + 2 English drills/week). Output is **suggestions** the user commits — never auto-created habits (P8-R-255).
**Graph links.** goal ↔ habits, goal ↔ job_applications, goal ↔ english sessions, goal ↔ savings target, goal ↔ calendar milestones.
**Edge cases.** Deadline in the past (allowed, marked overdue, no shame) · goal with no linked action (nudge once: "nothing feeds this goal") · achieved then reopened (history retained) · pillar deleted (goals reassigned to Personal).
**AI.** Composer drafts milestones; Coach flags at-risk based on linked activity, citing the evidence.

---

### 8.5 Calendar + two-way Google sync (DOM-EXEC, explore+)

**Purpose.** One honest day, whether the event came from Google or AIIMIN.

**Current (EXISTS):** read-only pull, all readable calendars, 90 days back / 365 forward, Google Tasks with due dates as `event_type=task`, upsert on `(user_id, google_event_id)`, manual "Pull Google" + auto-pull after connect. Push route exists but is limited.

**V1 target — two-way sync**

| Concern | Design |
|---------|--------|
| Scopes | `calendar.events` (read/write) + `tasks.readonly`; **separate OAuth from login** (EXISTS pattern) |
| Direction | AIIMIN-created events push to a dedicated **"AIIMIN" Google calendar** by default (user may choose primary) — keeps user's own calendars clean and makes rollback trivial |
| Change detection | Google `syncToken` incremental sync + webhook (`watch`) where available; fall back to 15-min poll on native, on-focus poll on web |
| Local changes | Outbox with `etag`/`updated` compare-and-set |
| Conflict | If both sides changed since last sync: `E-06 ConflictResolver` shows both versions + timestamps + source; options **Keep Google / Keep AIIMIN / Keep both**; never silent last-write-wins |
| Deletions | Tombstones both ways; deletion of a Google event that anchors a focus block asks what to do with the block |
| Recurrence | Read full RRULE; V1 **edits single instances only** (creating/editing a recurring rule is POST-V1 — clearly labeled in UI, not silently broken) |
| Timezones | Store UTC + original `tzid`; render in `users.timezone`; all-day events are date-only (no TZ shifting bug) |
| Privacy | Event **titles** are stored to be usable; user may switch to "busy-only" mode which stores times + a hash only |

**Sync status contract (user-visible).** `SyncPill`: `Synced 2m ago` · `Syncing…` · `3 held` · `Offline` · `Reconnect needed`. Tapping opens Sync tray with per-source detail and last error verbatim.
**Edge cases.** Token revoked externally → Reconnect state, not an error crash · quota exceeded (429) → backoff + honest "Google is rate-limiting; retry in Xm" · event moved to a different calendar · 5000-event month (virtualized rendering) · Tasks without due dates (documented as not synced) · DST boundary event (test case) · account switch on device (per-account token storage).
**Notifications.** Event reminders come from **one** source: if Google reminders are on, AIIMIN suppresses duplicates by default and says so.
**Deletion/history.** Disconnect asks: keep imported events (frozen copies) or delete them all.

---

### 8.6 Money: transactions, budgets, wealth, **UPI ingest**, **lend/borrow** (DOM-MONEY, core+)

**Purpose.** Know where money went and who owes whom, with minimal typing and zero surveillance creep.

#### 8.6.1 Structure

| Tab | Contents |
|-----|----------|
| Overview | Net position (assets − liabilities incl. borrowings), month spend vs budget, recent activity, bills due |
| Analytics | Category trend, month compare, merchant top-N |
| Accounts | Bank/cash/credit with balances (manual or statement-derived) |
| Transactions | Ledger with filters (date, category, account, person, source) |
| Budgets | Monthly per category with rollover option |
| Wealth | Investments/assets, net worth snapshots |
| **Lending** | Lent · Borrowed · Settled, per-person rollups |

#### 8.6.2 UPI / SMS ingest (native only) — privacy tier T3

```text
Android SMS/notification listener (opt-in, scoped)
  → on-device template match (bank/UPI senders allowlist)
  → extract {direction, amount, counterparty_raw, ref, timestamp}
  → discard raw body from memory; NEVER persisted, NEVER uploaded
  → draft transaction in local review queue (Hold)
  → user reviews (swipe right approve / left dismiss / tap edit)
  → approved → POST /api/wealth/transactions (source='upi_sms')
```

Rules: sender allowlist is shipped and updatable; unmatched messages are ignored silently (no "we couldn't read your SMS"); OTP messages are never parsed; a per-message "why did this appear" shows the matched template, not the raw text; the review queue is an **Open Loop** on Today.
Fallbacks when refused: manual entry, statement import, share-to-AIIMIN of a payment screenshot (OCR).

#### 8.6.3 Statement import (web + native)

Upload CSV/PDF → parse (CSV mapper; PDF text extraction, no OCR guessing for tables it cannot read) → AI categorize with confidence → **confirm queue** (user accepts/edits) → commit. Import is a first-class object: `import_batch` with source file reference, row count, and **one-tap "undo this import"** (deletes only rows from that batch).

#### 8.6.4 Lend / borrow ledger (`money_lent` EXISTS)

| Field | Notes |
|-------|-------|
| `direction` | `lent` \| `borrowed` |
| `person_id` | Link to People (§8.7) — required for rollups |
| `amount`, `currency` | INR default, mono display |
| `date`, `reason` | Reason is free text |
| `due_date` | Optional; drives reminders |
| `repayments[]` | Partial repayments with date + amount |
| `status` | `open` \| `partial` \| `settled` \| `written_off` |
| `proof_doc_id` | Optional vault document (screenshot/receipt) |
| `linked_tx_ids[]` | Matched transactions |

**Auto-match.** An incoming UPI credit whose counterparty matches a person with an open `lent` record proposes: "Settle ₹500 of Rahul's ₹2,400?" — an Offer, never automatic (P8-R-255).
**Rollups.** Person card shows net position; Finance overview lists top open positions; net worth includes lends as assets and borrowings as liabilities.
**Formal debt.** EMIs/loans are a distinct type with principal, rate, tenure, amortization schedule and a monthly bill — not mixed with informal IOUs.
**Social care.** Reminder copy is neutral and optional ("Send a reminder to Rahul?" produces a **draft message the user sends themselves** — AIIMIN never messages anyone on the user's behalf; P8-R-261).

#### 8.6.5 Subscriptions & bills

Recurring detection from transaction patterns (≥3 similar amounts at similar intervals) → Offer "Track as subscription?" → subscription object with next-due, category, cancel-URL note. Bills due appear on Today timeline and as reminders (opt-in).

#### 8.6.6 Cross-cutting money details

**States.** Empty (teach: "add one expense or import a statement") · review-queue pending · import parsing · partial parse (some rows failed → shown, not hidden) · offline (local queue) · conflict · error.
**Edge cases.** Duplicate transaction from both SMS and statement → dedupe by `(amount, date±1d, ref)`; flagged for user, not auto-deleted · refunds/negative amounts · split across people · currency other than INR (stored per-tx currency; totals per currency, no fake conversion unless a rate is user-set) · deleting an account with transactions (Veil: reassign or delete) · budget for a deleted category · month with zero income · lend written off then repaid (reopen).
**AI.** Analyzer for categorization; Coach for spend narrative and what-if (pro). Never infers a transaction without a source (utterance, SMS match, statement row, or manual).
**Permissions.** SMS (optional, native), storage (statement upload), camera (receipt).
**Deletion/history.** Per-row delete with undo; import-batch undo; "delete all money data" scoped wipe in Privacy; audit of source on every row (`source` = manual | logger | upi_sms | statement | ocr).

---

### 8.7 People (contacts as real humans) `[ADR-B1]`

**Purpose.** Make the graph feel like life: money, documents, events and notes attach to actual people.
**Why.** Founder requirement; also the mechanism that makes Money and Family stop feeling like spreadsheets.

**Model.** One `people` entity with **roles** (multi): `family`, `friend`, `colleague`, `lender`, `borrower`, `emergency`, `professional`. "Family member" is a role + household flag, not a separate table. (Existing `family_members` migrates in — §9.4.)

**Import options.**

| Source | Platform | Mechanism | Stored |
|--------|----------|-----------|--------|
| Device contacts | native | Contacts picker; **user selects** individuals (no bulk book read by default) | display name, normalized phone (E.164) + hash, email, photo (local ref or uploaded if user opts) |
| Google People | web | Minimal-scope OAuth, explicit "choose people" step | same |
| Manual | both | Form | same |
| vCard | web | File import with preview | same |
| Derived | both | From an utterance ("lent Rahul 500") → proposes creating person "Rahul" | name only until user links |

**Dedupe/merge.** Match on phone hash, then email, then normalized name; `F-04` merge dialog shows both records and what will combine; merge is reversible for 30 days.

**Person detail (F-02).**

```text
Rahul Sharma   friend · +91 •••• 3210          [call] [message] [⋯]
─────────────────────────────────────────────
Money        Rahul owes you ₹2,400  · 2 open
             last: received ₹500 · 2d ago
Documents    1 shared (insurance copy)
Calendar     Lunch — Thu 1:00 PM
Notes        3 notes mention Rahul
Timeline     every linked record, newest first
Care         last called 12 days ago (manual log)
```

**Quick actions.** Call (`tel:`), message (`sms:`/WhatsApp `wa.me` deep link — user-initiated only), add lend, split an expense, schedule follow-up, attach document, add note.
**Graph links.** person ↔ money_lent, transactions, family docs, calendar_events, notes, journal mentions (opt-in linking), english debate partner (no), emergency card.
**Birthdays.** From contacts (if present) or manual → calendar + a single day-of reminder.
**Relationship ledger.** "Last interaction" is derived from records the user creates (call log permission is **not** requested in V1) plus an optional manual "logged a call" action. Framed as care, never as a scoring system; can be hidden entirely.
**States.** Empty (teach: "add one person — Money and Documents get smarter") · importing · merge needed · permission denied · offline (local person creation queued).
**Edge cases.** Two people with the same name (disambiguate by phone/last-4) · person with no phone (allowed) · contact deleted on the phone (AIIMIN copy remains; a badge notes "not in your contacts anymore") · person referenced by an open loan is deleted → Veil: settle/transfer/keep-as-name-only · imported photo (stored only with consent; otherwise initials) · international numbers · person is also the account owner (self) — one `is_self` record used for "me" in splits.
**Permissions.** Contacts (device or Google) — fully optional.
**Privacy.** Never uploaded in bulk; delete-import removes AIIMIN copies and leaves the phone untouched; contacts never used for growth/invites/referral mining (explicit product promise).

---

### 8.8 Family vault + Documents OS `[ADR-B5]`

**Purpose.** Household life-admin that survives emergencies: documents, insurance, health records, vehicles, reminders — and the ability to actually **open** the files.

**Structure (route `/family`, pro+):** People (§8.7) · Documents · Insurance · Health records · Vehicles · Family finance · Reminders · Emergency contacts.

**Documents.**

| Aspect | Design |
|--------|--------|
| Types | ID (PAN/Aadhaar/passport/licence), insurance, health, vehicle, education, property, tax, other |
| Fields | title, type, owner (person), issue/expiry, number (sensitive field), file(s), tags, notes, shared-with |
| Upload | file picker, camera scan (auto-crop, multi-page → single PDF), share-to-AIIMIN |
| Viewer (`F-06`) | **PDF**: paginated, zoom, search, page thumbnails, annotate (highlight + note) · **DOCX**: read-only render, text reflow · **XLSX/CSV**: sheet tabs, frozen header, cell select, formula values (not formulas), export · **images**: zoom/rotate · unsupported type → "Open with…" system handoff |
| Expiry | reminder ladder at −60/−30/−7 days + optional calendar event; expiry badge on row |
| Sensitive fields | masked by default, reveal requires vault unlock, copy clears clipboard after 45s, never logged |
| Sharing | V1 = **visibility rules within the owner's account** (who a doc is *about*/*for*) + explicit export/share sheet. Real multi-user household accounts are POST-V1 (stated plainly in UI) |
| Emergency card | Generates a one-page PDF: blood groups, allergies, insurance numbers, emergency contacts — printable/wallet |

**Vault lock (`F-13`).** Entire Family route is gated by PIN/biometric when `vault_lock=on` (default on for native, opt-in web); auto-relock after 2 minutes background or on app switch; failed attempts backoff (5 tries → 60s).
**Storage & encryption.** Files in object storage with server-side encryption; per-object keys; signed short-lived URLs (≤5 min, single-use); no public buckets ever. Sensitive text fields encrypted at column level. E2E (client-held keys) for vault is **POST-V1** with an explicit key-recovery design (§12.6) — until then the UI says "encrypted at rest", never "end-to-end".
**Health records.** Conditions, allergies, medications, vitals, doctor contacts, reports (documents). **AIIMIN never infers medical facts** (P8-R-223) — these are user-entered only; no diagnosis, no clinical language.
**Vehicles.** RC, insurance, PUC, service log with reminders.
**Reminders.** Any family object can carry a reminder; reminders surface on Today timeline and as (opt-in) notifications.
**States.** Locked · unlocking · empty per tab (teach with one action) · uploading (progress, cancelable) · virus/type rejected · quota exceeded (tier storage cap shown) · viewer unsupported · offline (view cached docs only if previously opened and cached with consent) · shared-link expired.
**Edge cases.** 200MB scan (compress + warn) · password-protected PDF (prompt, never store the password) · corrupted file (honest error + keep the original) · duplicate upload (offer to replace or keep both) · document for a deleted person · expiry date in the past on import (immediate "expired" badge, no notification storm — one summary instead) · vault lock forgotten (PIN reset via account recovery; documented that this does **not** decrypt anything the server cannot already read).
**Permissions.** Storage/files, camera, biometric.
**Deletion/history.** 30-day recycle bin for documents; hard delete purges object + thumbnails + OCR text; access log per document (who/when opened — for a single-user account this is device-level, still useful).

---

### 8.9 English system — AIIMIN English Index (AEI) `[ADR-B2]`

**Purpose.** Measurably improve spoken English (fluency, vocabulary, pronunciation, professional register) with a real level, a real curriculum, and daily 60-second entry cost.
**Why it exists.** Founder need + placement/career linkage; existing `VocalMastery.jsx` + `SpeakingTopics.js` + `lab_speaking_logs` + `vocal_scorecard` provider chain are the seed. V1 promotes this from a Lab experiment to a first-class module inside Lab (no new top-level route).

#### 8.9.1 The index

**AEI = 0–100**, mapped to CEFR bands, computed from six skill branches (each 0–10):

| Branch | Weight | Signals |
|--------|--------|---------|
| Fluency | 0.22 | WPM within target band (110–160), pause count/length, filler rate per minute |
| Vocabulary | 0.20 | unique lemma count, CEFR band distribution of used words, word-bank retention |
| Grammar-in-speech | 0.18 | AI-detected error rate per 100 words (agreement, tense, article, preposition) |
| Pronunciation | 0.16 | accent-pack scores, shadow-match similarity, flagged phoneme improvement |
| Coherence | 0.14 | structure adherence (hook/points/close), discourse markers, on-topic ratio |
| Professional register | 0.10 | performance on HR/technical/meeting prompts |

```text
AEI = round( Σ (branch_score/10 × weight) × 100 )
band: 0–19 A1 · 20–34 A2 · 35–49 B1 · 50–64 B1+ · 65–79 B2 · 80–91 C1 · 92–100 C2
```

**Honesty rules (critical).**
- AEI is `unrated` until **3 completed sessions** (or a placement test). Never show a fabricated number.
- Each branch shows **confidence** (low/medium/high) based on sample size; low-confidence branches are excluded from AEI and shown as "needs 2 more sessions".
- AEI moves with **EWMA** (α = 0.25) over session scores, so one bad day cannot crater it and one lucky day cannot inflate it.
- Decay: after 21 days of no sessions, AEI is shown with an "as of <date>" stamp rather than silently decaying.
- The user can always see **why** a number moved (per-session contribution).

#### 8.9.2 Placement test (`L-07`, ~10 min, optional)

| Part | Task | Measures |
|------|------|----------|
| 1 | Read a 90-word paragraph aloud | pronunciation baseline, WPM, phoneme flags |
| 2 | Speak 60s on a random everyday topic | fluency, vocabulary, coherence |
| 3 | Speak 90s on a professional prompt | register, grammar |
| 4 | One debate exchange (AI counter → user rebuttal) | responsiveness, coherence under pressure |

Output: AEI, skill radar, 3 named weaknesses, and a starting **prescription**.

#### 8.9.3 Session modes (`L-03`)

| Mode | Length | Structure | Primary branches |
|------|--------|-----------|------------------|
| **Spark** | 60s | random topic → speak → scorecard | fluency, vocabulary |
| **Deep** | 3 min | hook 20s → point 1 → point 2 → close (timed section cues) | coherence, register |
| **Debate** | 3–5 min | AI takes the opposing side; 2–3 rebuttal rounds | coherence, grammar |
| **Shadow** | 1–2 min | listen to a reference line → repeat → similarity + timing compare | pronunciation |
| **Word drill** | 30s | new word (from bank/next CEFR band) → use it in a sentence → usage check | vocabulary |
| **Accent pack** | 2 min | phoneme set (e.g. /θ/-/t/, /v/-/w/, word stress, sentence stress) + minimal pairs | pronunciation |
| **Meeting English** | 2 min | standup update, disagreement politely, status escalation | register |
| **Read aloud** | 1–3 min | user's own note/article → pace + clarity | fluency, pronunciation |

Accent target is a **user choice** (`neutral international` default, `US`, `UK`) framed as "target for context", never "fix your accent". No mode is locked behind a mood/level gate other than difficulty of prompts.

#### 8.9.4 Scoring pipeline

```text
record (device) 
  → ASR transcript  [on-device where available; else server ASR with delete-after-scoring]
  → deterministic metrics (WPM, pauses, fillers, unique lemmas, CEFR bands)  ← no LLM needed
  → LLM pass (task `vocal_scorecard`, providers groq → openrouter):
        grammar errors, coherence rating, register rating, 3 upgrade words,
        one rewritten "best sentence"
  → pronunciation: phoneme flags from accent-pack expectations + shadow similarity
  → session score per branch → EWMA into english_index
  → word bank updates (struggled words, new words used)
```

Determinism first: fluency and vocabulary metrics are computed **without** the LLM, so the number is stable and cheap. The LLM adds qualitative feedback. If the LLM is unavailable, the session still scores (branches that need it show "feedback pending", and the session is retried later) — never a lost session.

#### 8.9.5 Scorecard (`L-04`)

Shows: transcript with filler/error highlights · WPM + pause profile · filler count vs your 7-day average · 3 upgrade words with the sentence they'd improve · best sentence rewrite · pronunciation flags with replay of your own audio at that word · branch deltas · "add 4 words to bank" one tap · "next drill" one swipe.

#### 8.9.6 Prescription engine (what to learn next)

Daily prescription = 3 items, generated from gaps:

```text
if filler_rate > 6/min          → Pace drill (Deep, 3min)
if vocab_band mode == B1        → Word drill ×5 (next-band words)
if phoneme_flag(/θ/) recurring  → Accent pack TH (2min)
if register_score < 5           → Meeting English
if interview within 7 days      → HR/technical lane ×2
else                            → Spark (variety topic not seen in 14 days)
```
Total daily cost target **≤ 6 minutes**. Prescription completion satisfies the "English" habit and contributes to the daily minimum.

#### 8.9.7 Goal modes

`placement` · `daily fluency` · `accent` · `meeting English` — each reweights the prescription and the AEI display emphasis (not the AEI formula itself, which stays comparable over time).

#### 8.9.8 System integration (why this beats a standalone app)

| Link | Behavior |
|------|----------|
| Depth / daily minimum | A completed drill can be one of the 3 minimum actions |
| Habits | "English 3 min" habit is auto-ticked by a real session, with the session linked as evidence |
| Career | Application card shows target band; interview in ≤7 days switches the lane and schedules drills |
| Calendar | "Voice practice" blocks; auto-suggested before interview events |
| Journal | Post-session prompt "what felt hard?" (optional, one line) |
| Lab flashcards | Word bank feeds spaced repetition |
| Reports | AEI curve + minutes practiced in weekly/monthly reports |
| Notifications | At most one drill reminder per day, at the user's chosen time |
| Health | Optional "walk & talk": if steps > 500 today, suggest a walking Spark session (motivational tie, never a gate) |

#### 8.9.9 Data, privacy, storage

| Item | Default | Options |
|------|---------|---------|
| Audio | **stays on device**; deleted after scoring unless the user saves it | opt-in encrypted cloud replay (pro), TTL 30 days, delete anytime |
| Transcript | stored (needed for progress + highlights) | can be disabled → numeric scores only |
| Metrics/scores | stored | wiped with "delete English data" |
| Cloud ASR | only if on-device ASR unavailable and user consented | provider must not retain (DPA); audio deleted post-transcription |

**States.** No mic permission · mic busy (call in progress) · too quiet / clipping (live meter + hint) · background noise warning · session interrupted (call/alarm) → partial session saved with a note, not scored · ASR failure → keep audio locally, retry, or let the user self-score (existing sliders as fallback) · offline → session recorded and queued; deterministic metrics computed locally, LLM feedback on reconnect · LLM quota exhausted (tier caps) → deterministic score now + "feedback when quota resets".
**Edge cases.** Non-English speech detected (honest message, no score) · 2-second session (discarded, no penalty) · user reads from a script in a Spark session (flagged as "read-like" only if obvious; never accusatory) · headset/Bluetooth mic latency · two sessions in the same minute · placement test abandoned midway (partial results, resumable) · user with a strong regional accent scoring low on pronunciation → wording focuses on **intelligibility and chosen target**, never "wrong".
**History/deletion.** Full session history with replay of transcripts; per-session delete; "delete all English data" (index + sessions + word bank) in Privacy.
**Other languages.** Hindi and others are **POST-V1**; the schema is language-tagged from day one (`language='en'`) so no migration is needed later. The UI shows "English" explicitly rather than implying general language support.

---

### 8.10 Health signals: steps, distance, screen time, sleep `[ADR-B4]`

**Purpose.** Make the body part of the day's truth without becoming a fitness app.

| Signal | Android source | iOS (POST-V1) | Stored server-side |
|--------|----------------|---------------|--------------------|
| Steps | Health Connect `StepsRecord` (daily aggregate) | HealthKit | daily total |
| Distance (km) | Health Connect `DistanceRecord`; **fallback** `steps × stride` | HealthKit | daily total + `estimated` flag |
| Active minutes | Health Connect | HealthKit | daily total |
| Sleep | Health Connect `SleepSessionRecord` (duration only) | HealthKit | duration + bedtime/waketime |
| Screen time | `UsageStatsManager` (PACKAGE_USAGE_STATS) | **not available** | daily total; top-3 **categories** only if opted; per-app stays on device |

**Stride estimation.** `stride_m = height_cm × 0.415` (walking) when height is known; else 0.75 m default. UI always labels estimated distance with a tap-through explanation and an option to enter a measured stride.
**OEM devices (OnePlus etc.).** No vendor SDKs. Instruction card: install/enable Health Connect and allow the OEM health app to write to it. If only steps are available, distance is estimated.
**Screen time framing.** Shown next to focus minutes as a neutral pair ("Screen 4h 12m · Focus 1h 20m"). Optional daily cap produces **one** calm nudge, never a block. Correlation with focus/sleep appears only in Reports with sample-size honesty.
**Contribution to Depth/Score.** Movement can be one of the 3 daily minimum actions (user choice: e.g. "3,000 steps"). Sleep feeds the Life Score sleep domain. Screen time **never** lowers the Life Score — it is context, not judgment (anti-shame law).
**States.** No permission · Health Connect not installed (install CTA) · no data today (honest "no data yet", not 0 steps as a fact) · stale (last sync time) · permission revoked externally · device without step sensor.
**Edge cases.** Multiple sources double-counting (prefer Health Connect aggregate; dedupe by source priority) · timezone travel (day bucket by user timezone) · phone left at home (low steps — never "you were lazy") · screen time permission granted then revoked (chip disappears, data retained per retention setting) · midnight boundary partial data · user shares phone with family (documented limitation).
**Privacy.** Daily aggregates only; per-app usage and GPS routes never leave the device; disconnect deletes stored aggregates on request.

---

### 8.11 Focus + Discipline (DOM-EXEC, core+)

**Focus.** Intent-first pomodoro: write the intent → choose length (25/50/custom) → ring → optional calendar write-back → session stats. Interruptibility **closed** during a session: no Knocks, no Coach, no upgrade prompts (P8 Ch07 prohibition). Ambient sound optional, off by default. Session end asks one honest question: "did you do what you intended?" (yes/partly/no) — feeds focus quality, never a score penalty.
**Discipline.** Streak with pledge, milestones, toolkit, **urge surfing** (15-min timer, breathing cues, +5 extend, distraction list), slip log with recovery tone, trigger patterns. Never uses the word "relapse" in UI (P5 tone), never sends shame notifications, never displays a "days wasted" counter.
**Streak freeze.** One earned freeze per month prevents a single missed day from breaking a streak; the freeze is visible and manual (user applies it) — no silent falsification of history.
**Links.** Screen-time spike → optional urge-surfing suggestion (one, dismissible). Focus block → calendar. Discipline streak → Depth minimum (user choice).
**Edge cases.** App killed mid-session (session resumed from stored start time; if >2× planned length, ask instead of assuming) · phone call interrupt · two devices running a timer (server-side single active session; second device offers to take over) · slip logged for a past date · timezone change mid-streak.

---

### 8.12 Career, Sports, Lab (other domains)

**Career (`/placements`).** Application kanban (applied → screening → interview → offer → rejected), timeline, resources, resumes (vault-linked, versioned, "sent to X on date"), readiness score, ATS analyzer. Links: interview event → calendar + English drill lane; offer → goal achieved; company → person (referrer).
**Sports (`/sports`).** Cricket/football/basketball/F1 feeds with cache and provider failover (EXISTS). Purely contextual: never generates notifications by default; team favorites from persona; a match day may optionally appear on the timeline.
**Lab (other modules).** Typing, aptitude/quant, STAR method, tech simulator, flashcards (fed by English word bank), system design, decision matrix, reading log, personality. Each module: session → score → history → mastery badge thresholds. Lab has **one** hub and no competing dashboard.

---

### 8.13 Life Score, gamification, and honesty

**Life Score 0–98** across Habits, Journal, Goals, Sleep, Wealth (existing engine + API `/api/intelligence/lhs`). V1 completes the sleep/movement pipeline.

**Honesty rules.** Score is API-computed (SYS-05) · shows per-domain contribution and **what would move it** · never uses a curve that hides bad weeks · 98 (not 100) is intentional — perfection is not claimable · missing inputs reduce **confidence**, not the score, and are labeled.
**XP/ranks/quests.** Retained but subordinate: XP is a texture, the Life Score and Depth are the truth. No loot boxes, no leaderboards, no social comparison (Article III), no confetti for existing (proportional celebration).
**Streaks.** Visible, freezable, recoverable. Never used in a notification that implies loss of worth.

---

### 8.14 Open Loops (the "inbox zero for life")

**Purpose.** One queue of things the system genuinely needs from the human — the antidote to scattered badges.

**Sources.** Unreviewed UPI drafts · unconfirmed AI Offers · unscored/partial English sessions · documents expiring ≤30 days · overdue lend/borrow · calendar conflicts · unresolved sync conflicts · failed imports · unanswered onboarding connection (once) · unread critical notifications.

**Rules.** Maximum **7** items shown; the rest are behind "more". Every loop has exactly **one** primary action and a snooze. Clearing loops contributes to Depth only if the loop represents a real action (not just dismissing). No loop may be created by marketing/upsell.
**Edge cases.** Loop whose underlying record was deleted (loop self-destructs) · loop snoozed 3× (offers "stop asking about this") · loops while offline (only local-resolvable ones are actionable).

---

### 8.15 Search (S-04) — graph query

Single entry: `⌘K` (desktop), search icon (native/tablet). Scope: notes, journal (opt-in — see privacy), transactions, people, documents, habits, goals, events, English sessions, reports.

Ranking: exact person/document match → recency → domain relevance. Result rows show domain + date + snippet + the linked person if any. Query `rahul money` returns transactions + lends + docs mentioning Rahul. Filters: `person:`, `domain:`, `before:`, `after:`, `has:file`.
**Privacy.** Journal is searchable **only** by the user's own query, never indexed into a shared/AI corpus; a setting can exclude journal from search entirely.
**Edge cases.** Very short query (≥2 chars) · zero results (teach: create instead) · offline (searches local cache only, labeled) · large result sets (virtualized, capped at 200 with "refine").

---

### 8.16 Notifications (DOM-SYSTEM, REDESIGN)

**Philosophy (P8 Ch16 + P9 Phase 3).** A notification is a **Knock** — it must earn attention. Interruptibility windows: **Breath (capture)** and **Veil** are closed; Focus is closed; Scan/Command are open.

**Catalog (each independently toggleable, all default-off except the two marked ●):**

| Type | Trigger | Default | Channel |
|------|---------|---------|---------|
| Daily minimum reminder | user-chosen hour, minimum unmet | off | push/local |
| Habit reminder | per-habit time | ● on if the user set a time | local |
| Streak at risk | ≥1 habit streak ends today | off | push |
| Weekly insight ready | Monday generation | ● on | push + in-app |
| Lend/borrow due | due date, then +3d | off | push |
| Bill / subscription due | 2 days before | off | push |
| Document expiry | −30/−7 days | off | push |
| Calendar conflict | sync detects conflict | off | in-app + push |
| Sync failed repeatedly | 3 consecutive failures | on (in-app) | in-app, push after 24h |
| English drill reminder | user-chosen time | off | local |
| Report ready | generation complete | on (in-app) | in-app |
| Security | new device sign-in, PIN changed | **always on** | push + email |
| Billing | payment failed, plan change | always on | email + in-app |

**Global controls.** Quiet hours (default 22:00–07:00) · max 3 non-critical pushes/day · digest mode (bundle into one) · per-type channel choice · one-tap "only security and billing".
**Content rules.** Specific and honest ("₹500 from Rahul is 3 days overdue") · never guilt · **never** include journal content, PIN, document numbers, or amounts if the user enabled "hide amounts in notifications" · deep link to the exact surface.
**Edge cases.** Push token invalid (silently re-register) · notification for a deleted record (opens the domain with "this no longer exists") · device time wrong · user denied OS notifications but enabled types in-app (in-app only, with a one-time hint) · duplicate Google + AIIMIN event reminders (suppressed by default).

---

### 8.17 Settings, Account, Personalization (DOM-CONFIG, MERGE)

`/settings` redirects to `/account` (BR-05). One hub, grouped like the reference: profile card on top, then sections with chevrons/toggles.

| Section | Contents |
|---------|----------|
| Profile | Name, photo, OS-ID (mono credential card + copy), email, timezone, Life Arc, height (for stride) |
| Personalization | Theme (light/dark/**dim**), monotone toggle for chart color, **font scale**, density, reduced motion override, haptics, nav pins (drag), Today widgets, persona preset, sounds |
| Privacy & data | Consent list, privacy dashboard, activity log, export, wipe life data, delete account, journal-in-search toggle, notification content masking |
| Connections | Google (Calendar/Drive/People) per-scope, Health Connect, screen time, SMS money, devices list with revoke |
| Subscription | 4 tiers, current plan chip, upgrade/switch, invoices, AI usage today |
| Security | PIN change, biometric, vault lock, active sessions, sign out everywhere |
| Notifications | Full catalog (§8.16), quiet hours, digest |
| Support & legal | Contact, status, privacy/terms/security/data-deletion, app version + build SHA |

**Edge cases.** Changing timezone rewrites day buckets going **forward** only (history keeps its original day) with an explanatory note · changing OS-ID (allowed once per 90 days; old handle reserved 30 days) · font scale ×1.3 on the densest table (table switches to card rows) · sign out with unsynced items (Veil: "3 items not synced — sync now / discard").

---

### 8.18 Billing and tiers

Same four tiers on website and Android. Android copy is **more aggressive** about capture-power unlocks (sensors, offline, widgets) — web copy emphasises command/analytics. Entitlement is always server-side.

| Tier | Price (list / founding) | Web unlocks | Android unlocks (extra punch) | AI/day |
|------|------------------------|-------------|-------------------------------|--------|
| **Explore** | Free | Today, Depth, Journal, Notes, Calendar, account | Quick capture, Depth, Journal, **1 English Spark/day**, no Health/UPI | 1 |
| **Core** | ₹29 / complimentary waitlist | Habits, goals, finance, focus, Lab English full, sports, discipline, career, Snapshot, journal AI | **Health Connect** steps/sleep · offline mutation queue · home widgets · journal packs · full English | 10 |
| **Pro** | ₹59 / ₹49 | Family+vault, PDF Review, correlations, wealth AI, what-if, cloud voice replay | **UPI on-device review queue** · Documents viewer · People import · vault lock + biometric | 25 |
| **Elite** | ₹99 / ₹79 | Interactive Intelligence, 3 Deep reports/mo, unlimited Standard PDFs | Highest priority for new native capture surfaces · same intelligence as web | 40 |

**Persona → suggested tier (user can still pick any):**

| Persona | Suggested | Why |
|---------|-----------|-----|
| Curious / testing | Explore | Feel Depth + Journal with zero card |
| Student / early pro daily loop | Core | Habits + money + focus + English + Health |
| Household + money + docs | Pro | Vault + UPI + People |
| Power / reports | Elite | Deep intelligence pools |

Rules: show **all four**, never three · founding strikethrough on Pro/Elite · "Recommended" only on Pro · **no purple premium styling** · never "unlimited AI" · downgrade never deletes data · backend entitlement authority (SYS-02) · Android uses Play Billing where store policy requires; web uses Stripe/click-upgrade; both write the same subscription row.
**Edge cases.** Payment failed (grace 7 days, banner not lockout) · refund/chargeback (revert tier, keep data) · store purchase on a different account (link flow) · offline purchase attempt (queued, honest message) · quota exhausted mid-action (current finishes; next blocked with reset time).

---

