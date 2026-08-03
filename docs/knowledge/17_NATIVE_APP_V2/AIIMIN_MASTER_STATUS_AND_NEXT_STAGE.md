---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-STATUS
tags:
  - type/status
  - domain/build
  - status/active
---

# AIIMIN — Master Status, App Plan & Next-Stage Handoff

> Date 2026-08-02 · Branch `feat/drafting-table-prototype` (pushed to origin)
> Companions: [AIIMIN_APP_BUILD_AGENT_PLAN.md](AIIMIN_APP_BUILD_AGENT_PLAN.md) (guardrails)
> · [DRAFTING_TABLE_TESTING_AND_PLAN.md](DRAFTING_TABLE_TESTING_AND_PLAN.md) (test results)
>
> **Stage:** prototype + website hardening. **The real app build is ON HOLD** by founder
> decision. Everything here prepares for it.

---

## 1. WHERE WE ARE

### 1.1 Prototype — DONE (deliverable shipped)
Single self-contained file: `frontend/prototypes/AIIMIN-Drafting-Table.html` (271kb, React
inlined, opens offline). Regenerate any time: `node frontend/scripts/build-proto.mjs`.
Live dev route: `/proto/draft`.

**10 screens:** 6-step Onboarding · Today (capture-first) · Live Score · Money (Overview/
Budgets/Ledger) · Capture · **Journal** · Lab · OS-ID · Config · Edge States.
Dark "Drafting Table" ↔ light "Industry sheet"; TIER interswitch (Explore/Core/Pro/Elite).

**Verified working:** all 6 onboarding steps advance · Journal saves + history · minimums
recompute the score (78 → 82 at 5/5, `DAY CLEARED`) · money tabs · capture Offer → Settle →
ledger + Undo · Lab pair selection · theme + tier switching. Lint clean, 0 errors.

**Craft state:** real AIIMIN peak-A brand mark (warm `#ff6b35` node = the one heat spark),
animated minimums (draw-in check + progress track), real axed scatter, redesigned Config
(brand hero + XP rank + Life Arc + life modes), score count-up, rail glide, hover warmth.

### 1.2 Website (aiimin.in) — LIVE, with known gaps

| Area | State |
|------|-------|
| Landing / waitlist | ✅ solid, no console errors, assets 200 |
| Auth (OS-ID + PIN, Google) | ✅ works |
| Today, Habits, Goals, Journal, Notes, Finance, Reports, Focus, Account | ✅ all render with real data |
| Reports (Snapshot/PDF/Interactive/Deep, correlations, 5-dim LHS) | ✅ genuinely deep — the crown jewel |
| Account (Life Arc, XP ranks, life modes, personalization) | ✅ rich |
| **Reminders/notifications** | 🔧 **FIXED this session** (see 1.3) — needs deploy + verify |
| **Journal + Notes** | ❌ founder reports broken — **not yet reproduced**; top priority |
| Finance MTD vs AI-insight contradiction | ❌ open |
| Life Score inconsistency (47/49/54, two dimension namings) | ❌ open — needs founder decision |
| Weekly Pulse (WHO-5) on entry | ❌ rejected — remove |

### 1.3 Fixed this session (committed)
`frontend/src/utils/supabase.js` is a **custom API-backed shim** (Better Auth sessions don't
populate Supabase RLS, so all table access proxies through `/api/db`). It lacked
`.abortSignal()`, so `Overview.jsx`'s `family_reminders` fetch threw on **every authed page
load**. The ErrorBoundary caught it → remounted → re-ran the effect → threw again: a
**remount loop that also hammered `/api/auth/get-session`** and destabilized the whole
authed app. Added chainable `abortSignal()` and `range()`. Repo-wide grep confirms no other
shim-method clash.

### 1.4 Data isolation — VERIFIED GOOD (your "user sees only their own data" requirement)
Two independent layers already exist:
1. **Server-side scoping** — `server/routes/db.js` injects `user_id = $n` from the session
   for every `USER_SCOPED_TABLES` query, rejects client-supplied `user_id`, and runs
   ownership checks (`verifyRoutineOwnership`, `verifyHabitOwnership`).
2. **Database RLS** — migrations incl. `032_rls_better_auth_lockdown.sql`.

**Rule for the app:** the mobile client gets data the same way — through `/api/*` with the
session cookie. Never direct PostgREST, never a client-supplied user id. Any new table must
be added to `USER_SCOPED_TABLES` **and** get an RLS policy in the same migration.

---

## 2. MCP — CONFIGURED

`.mcp.json` at the repo root is correct and already holds all three, each for one purpose:

| Server | Purpose | Status |
|--------|---------|--------|
| `aws-api` (uvx, profile `cursor-mcp`, ap-south-1) | **backend / infra** — EC2, S3, RDS, logs | ✅ connected |
| `better-auth` (https://mcp.better-auth.com/mcp) | **auth** — docs/reference for the auth layer | ✅ connected |
| `supabase` (https://mcp.supabase.com/mcp) | **database** — schema, migrations, queries | ⚠ needs OAuth |
| `mobbin` | design reference | ⚠ needs OAuth |

**Action for you:** the two HTTP servers use OAuth, which cannot be completed from a
non-interactive session. Authorize them once from an interactive `claude` terminal (`/mcp`)
or your claude.ai connector settings. After that they work in every session.

---

## 3. THE APP — SCREEN BY SCREEN

Bottom tabs (5): **DAY · MONEY · CAPTURE · LAB · CONFIG**. Everything else is reached
contextually — genesis keeps the top level minimal (GOV-165).

Each screen below is written as a build unit: **one job → contents → data → tier → done-when.**

### S1 · Onboarding (6 steps) — System layer
Job: get a new user from install to their first captured log.
1. **Welcome** — brand lockup, "One screen. Every day.", BEGIN.
2. **Sign in** — OS-ID + PIN or Google. (Never auto-typed by an agent.)
3. **Claim OS-ID** — 8 chars, live availability, alternates, one lifetime revision.
4. **Set your Arc** — one line of direction. Minimal (founder: minimal on mobile).
5. **Pick daily minimums** — choose ~5; seeds the day loop.
6. **First capture** — type one line → see the AI Offer → Settle → land on Today.
Data: `POST /auth`, OS-ID availability check, `PATCH /user` (arc), `POST /db/habits`,
`POST /capture`. Tier: n/a. **Done when:** a brand-new account reaches Today with 1 log and
≥3 minimums set, no dead ends, back works at every step.

### S2 · Today (Day layer) — the home
Job: **act on this day** (capture-first, GOV-106 — NOT a dashboard, GOV-165).
Order is doctrine: ① universal capture composer ② one-small-thing micro-task ③ Action
Required nudge ④ **TODAY'S READ**: Life Score + sparkline ⑤ six-area grid ⑥ detected pattern
→ Lab ⑦ metric grid ⑧ daily minimums (progress + DAY CLEARED).
Data: `GET /dashboard/today`, `GET /db/daily_logs`, score from server. Tier: explore.
**Done when:** typing a line and pressing enter lands on Capture with the text parsed;
ticking a minimum moves the score; nothing above the fold demands reading before acting.

### S3 · Capture (the trust surface — build most carefully)
Job: turn one sentence into structured truth the user can correct before it commits.
Flow: free text → **AI parse** → editable chips (amount · category · merchant · people ·
mood · duration) → **SETTLE** (commits, toast with **UNDO**) or **DRIFT** (holds,
uncommitted). Plus: 6 mode presets, hold tray, today's captures.
Data: `POST /intelligence/parse` → `POST /db/<entity>`. Tier: explore (parse limits by tier).
**Done when:** a wrong parse is always correctable in ≤2 taps; nothing writes without an
explicit Settle; Undo reverses the last write; offline queues into Hold.

### S4 · Live Score
Job: mark and settle the day.
Two mechanisms feeding one figure: **Rail** (per-area, snaps to fives; production = drag) and
**Ladder** (5 rungs, one tap). Plus "what moved the number" attribution and SETTLE THE DAY.
Data: `GET/POST /db/daily_logs`, server score model (replace the prototype placeholder
`round(70.7 + done*1.9 + (rung-3)*1.6 + (railAvg-70)*0.12)`).
**Done when:** the number the app shows equals the number the website shows for the same day.

### S5 · Money (Pillars)
Job: log and see money truth. Tabs: **Overview** (safe-to-spend, spend bar, category
breakdown, week-over-week, net worth / receivable) · **Budgets** (allocations + upcoming 14d)
· **Ledger** (transactions, income in accent, add). **Add from web depth:** Analytics/Wealth
— net worth, FI velocity, monthly burn, liquid runway, savings rate.
Data: `/db/transactions`, `/db/budgets`, `/wealth/*`. Tier: core (wealth AI: pro).
**Done when:** MTD tiles show a real empty-state instead of ₹0 when there is no data (the
current website bug), and every figure is mono and column-aligned.

### S6 · Journal (Memory) ✅ built in the prototype
Job: reflection capture. 4 templates (Free Write · CBT · Morning Pages · Weekly Review),
1–5 mood scale in the mono language, composer, saved history with excerpt + mood.
**Add next:** voice entry (§5), history search, export.
Data: `/journal` (dedicated route, already exists server-side). Tier: explore (AI: core).

### S7 · Lab / Intelligence
Job: ask, review, act on patterns. Spearman ρ with Benjamini–Hochberg FDR 0.10, selected-pair
card (ρ, q, n), **real axed scatter** with trend, survivors table, "14 rejected by correction".
**Add from web:** a plain-English line under each pair ("when mood is higher, sleep trends up
~40%"), browse by life area, date-range, and the entry into **Reports** (Snapshot / Life OS
Review PDF / Interactive / Deep).
Data: `/lab/*`, `/intelligence/*`. Tier: core → pro (correlations) → elite (deep).

### S8 · OS-ID
Job: own your identifier. Part-number card, spec (exactly 8 · uppercase · max 4 digits · 1
lifetime revision), appears-on list, copy. Tier: explore.

### S9 · Config
Job: configure the OS. Brand profile hero → OS-ID · **XP / rank strip** · **Life Arc** ·
**life-mode switcher** (BUILD/RECOVER/EXAM/TRAVEL) · sync (LIVE/SYNCING + Sync now) ·
preferences (appearance, reduce motion, notifications, minimums) · data (connections, export,
delete). Tier: explore.

### S10 · Edge States (reference, not shipped as a screen)
Error (OS-ID taken) · empty (money first run) · loading (skeleton sweep, never a spinner) ·
offline (held locally) · destructive (typed veil requiring DELETE).

### Later surfaces (genesis, after the core loop)
Knowledge/Notes · Timeline (chronology, not feed) · Search (cross-graph recall) · Family
(shared care + vault) · Documents · dedicated AI surface.

---

## 4. SYNC — APP ↔ WEBSITE (both ways)

**Model:** one graph, one backend. The phone is a fast-capture client; the web is the deep
surface. No separate mobile database.

- **App → Web:** captures, logs, minimums, score marks, journal entries `POST` to `/api/*`
  with the session cookie. The web reads the same rows immediately.
- **Web → App:** budgets, goals, habits, connections, computed Life Score, correlations and
  reports are configured/computed on the web and read by the app.
- **Offline:** writes queue locally (Hold tray + `offlineLogQueue`), flush on reconnect, show
  `SETTLED LOCALLY · n IN HOLD`, then `LIVE`. Idempotency key per capture so a retry can't
  double-write.
- **Conflict rule:** last-write-wins per field, except money rows which are append-only
  (never silently edited by sync).
- **Contract to freeze before P2:** entity list + field names + the score model. Write it
  once, both clients consume it.

---

## 5. VOICE LOGGING · ENGLISH LEARNING · NOTES — the new feature line

**Current reality:** `server/lib/aiVoice.js` is **brand voice rules for prompts**, not speech.
There is **no STT/TTS in the codebase**. So this is genuinely new work — and it is the single
most differentiating thing on the list, because it collapses capture friction to zero.

### 5.1 One pipeline, three products
Speak once → the same pipeline serves all three:

```
mic → record (keep the audio) → transcribe → classify intent → structure → user confirms → commit
                    │                                                     │
                    └── audio stored (playback + feedback later) ──────────┘
```

| Product | What the user does | What comes back |
|---------|--------------------|-----------------|
| **Voice log** | holds mic, says "paid 240 metro, walked 25 min, felt sharp 8 out of 10" | the Capture Offer chips — same correct-before-commit flow as typing |
| **Voice note → structured note** | speaks 60s about a topic to study | a structured note: title, key points, questions, tags — plus the original audio |
| **English learning** | speaks 60s on a prompt | transcript + **playback of their own voice** + feedback: filler words, pace (wpm), repetition, clarity, suggested rephrasings |

### 5.2 Why storing the audio matters
Keeping the recording is what makes English practice real — you hear yourself, then read the
feedback against it. It also lets a bad transcript be re-run later without asking the user to
repeat. Store the blob (S3/Supabase storage, user-scoped path), keep a `duration`, and let the
user delete it. Never share it anywhere.

### 5.3 Design in the Drafting Table language
- **Capture surface:** the existing VOICE preset becomes a hold-to-talk control — an accent
  bar that fills while recording, mono timer `0:34`, release to transcribe. Then the normal
  Offer chips. No new visual grammar.
- **Notes:** a transcribed note renders as a blueprint sheet — kicker `VOICE · 0:58`, title,
  numbered key points, tags — with a small playback row (mono timestamp + accent scrub bar).
- **English:** a "session sheet": the transcript with filler words marked in `--muted`, a
  metrics row (WPM · FILLERS · UNIQUE WORDS) in mono, then 3 numbered rewrites. Feels like a
  marked-up drafting sheet, which is exactly the brand.

### 5.4 Build order (cheap → good)
1. **Ship transcription only** into the existing Capture Offer (voice = another way to fill
   the same composer). Smallest change, biggest daily value.
2. **Store audio + playback** in Notes.
3. **English feedback pass** (metrics are computable *without* an LLM — see §6.3).

---

## 6. AI ON A MINIMUM BUDGET — you are further along than you think

### 6.1 What already exists
`server/lib/aiChat.js` is already a **multi-provider router with tiering and fallback**:
`liteChat()` / `heavyChat()` / `nvidiaOrGroqChat()`, model **pools**
(`OPENROUTER_LITE_MODELS`, `OPENROUTER_HEAVY_MODELS`), and keys for **Groq · Gemini +
Gemini-Lite · OpenRouter · NVIDIA NIM · Kimi**. That is the correct architecture — do not
replace it. Exploit it.

### 6.2 The strategy: right-size every call, spend nothing by default
1. **Free tiers first, by task.**
   - **Groq** — fastest free tier; use for capture parsing (short, structured, latency
     matters most).
   - **Gemini Lite / Flash** — generous free quota; use for daily summaries and journal
     enrichment.
   - **OpenRouter free models** (`:free` suffixed) — use as the overflow pool.
   - **NVIDIA NIM** — free credits; keep as the third fallback.
   Route by task, fall through on 429/5xx. The pool env vars already support lists.
2. **Cache aggressively.** Same-day, same-input parses should never hit a model twice.
   Hash the input text → store the parse. Journal enrichment is once per entry, not per view.
3. **Batch the non-urgent.** Weekly reports, correlations and digests run on a schedule, not
   on page load. One nightly job beats 50 interactive calls.
4. **Tier the spend to the plan.** Explore gets rule-based only; Core gets lite models; Pro
   gets heavy on reports; Elite gets the dedicated deep pool. This is already how the pricing
   is written — enforce it in the router, and your cost tracks revenue by construction.
5. **Hard budget guards.** Per-user daily call cap (the site already advertises "25 AI calls
   per day" on Pro) + a global monthly ceiling that degrades to rule-based instead of failing.

### 6.3 Do NOT use an LLM where code is better (biggest saving)
A large share of your "AI" features are deterministic:
- **Correlations** — Spearman + Benjamini–Hochberg is pure statistics. No model. Already so.
- **Life Score, streaks, XP, budgets, runway, savings rate, FI projection** — arithmetic.
- **English metrics** — WPM, filler-word count, repetition, vocabulary diversity, sentence
  length are all computable in plain JS from a transcript. Only the *rewrite suggestions*
  need a model, and only 3 of them, on demand.
- **Capture parsing** — a regex/dictionary pass catches "paid 240 swiggy" (amount + known
  merchant → category) with no model at all; call the LLM **only when the rule pass is
  unsure**. This one change can remove most parse calls.

### 6.4 Speech-to-text on a budget
- **Browser Web Speech API — ₹0** for live dictation on supported browsers. Ship this first
  as the default path on web/Android WebView.
- **Groq Whisper** — whisper-large via Groq is extremely cheap/fast; use as the accurate
  fallback and for stored audio.
- **`whisper.cpp` / faster-whisper on your own box** — one small VM transcribes on CPU for
  free if volume grows. This is the right place for self-hosting, *not* chat.
- Fine-tuning a HuggingFace model is **not** worth it now: you would pay for GPU hours and
  hosting to underperform the free tiers you already have keys for. Revisit only if a
  specific task (e.g. Hinglish capture parsing) proves consistently bad on hosted models —
  and then fine-tune a **small** model for that one task, nothing else.

### 6.5 Keys — what to actually do
You said you don't have keys right now. Minimum viable set, all free to start:
`GROQ_API_KEY` (chat + whisper) → `GEMINI_API_KEY` (summaries) → `OPENROUTER_API_KEY`
(free-model overflow). Three free signups cover the entire product at prototype scale. Put
them in `.env` (already gitignored) — **never in the vault or a commit**.

---

## 7. WHAT'S LEFT — prioritized

### P0 — blocking, do first
1. **Reproduce and fix Journal + Notes.** Protocol: log in → `/journal` → write → Save →
   capture (a) the failing network call + status, (b) the console component stack, (c) the
   exact action. Same for `/notes` add-source. Do not blind-patch.
2. **Deploy + verify the reminders fix** (remount loop gone, no `abortSignal` errors).
3. **Decide the canonical Life Score taxonomy** — one 5-dimension set for app + web.
   Currently three different namings exist.

### P1 — website correctness
4. Finance MTD ₹0 vs AI-insight contradiction → reconcile windows + real empty states.
5. Remove the Weekly Pulse from entry; never stack it with the tour.
6. Goals count mismatch (9 vs 10).

### P2 — untested surfaces (nothing has exercised these yet)
Transactions add/edit/delete · Journal save→history→export round-trip · habit toggle
persistence · goal create + milestones · a full focus session · Reports PDF download +
Patterns/Skills tabs · Search/command palette · Personalization (life modes, nav pins) ·
Subscription/billing UI · data export · `/m` mobile shell · offline behaviour · theme on every
surface · keyboard + screen-reader pass · form validation edges (empty / oversized / paste).

### P3 — new feature line
Voice logging → voice notes → English learning (§5), built in that order.

### P4 — the app
Only after P0–P2. Follow `AIIMIN_APP_BUILD_AGENT_PLAN.md` phases with its guardrails.

---

## 8. HANDOFF — paste this into a new chat

> **Context.** I'm building AIIMIN, a Personal Life OS — live website at aiimin.in (React 19
> + CRA, Node/Hono API, Supabase/Postgres, Better Auth with OS-ID+PIN) and a mobile app that
> is **planned but on hold**. Repo: `/Users/aaditya/Desktop/DASHBOARD PROJECT`, branch
> `feat/drafting-table-prototype`.
>
> **Read these first, in order:**
> 1. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE.md` (status, app
>    plan screen-by-screen, voice/AI strategy, what's left)
> 2. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md` (guardrails — follow
>    them)
> 3. `docs/knowledge/17_NATIVE_APP_V2/DRAFTING_TABLE_TESTING_AND_PLAN.md` (website test
>    results)
>
> **Done:** the Drafting Table prototype is finished — 10 screens, one self-contained file at
> `frontend/prototypes/AIIMIN-Drafting-Table.html` (rebuild with `node
> frontend/scripts/build-proto.mjs`), also at `/proto/draft`. Today is capture-first per
> genesis. A production bug was fixed: the API-backed supabase shim lacked `.abortSignal`,
> which crashed the reminders fetch on every authed page and caused an ErrorBoundary remount
> loop.
>
> **Rules:** the Drafting Table palette/typography is approved and **locked** — don't
> redesign it; craft and layout are open. Genesis (`docs/knowledge/Genesis/P8 Master
> Specification`) is constitutional: Today is capture-first, there is no Dashboard surface,
> every surface declares one job. Never enter my PIN or any credential. Don't run destructive
> operations on the live account. Verify before claiming done.
>
> **Next task:** [pick one]
> (a) reproduce and fix the Journal + Notes breakage on the live site — I'll log in for you;
> (b) work through the P2 untested-surface list and give me a written pass/fail report;
> (c) build voice logging into Capture, transcription only, using the free-tier route
>     (Web Speech API first, Groq Whisper fallback).

---

## 9. OPEN DECISIONS FOR FOUNDER
1. **Life Score taxonomy** — pick one 5-dimension set (blocks app + web consistency).
2. ~~**App stack**~~ — **DECIDED 2026-08-03: Kotlin + Jetpack Compose, native, Android-first,
   built from scratch at `native-android-v3/`.** The earlier "React first" recommendation is
   superseded by founder decision. `native-android/` (V2) is the old app — reference only for
   its API/sync layer, never its UI. → [[15_MEMORY/Handoff-Native-App-Build]]
3. **AI keys** — create the three free keys (Groq, Gemini, OpenRouter) so the router has
   something to route to.
4. **Voice scope** — ship transcription-into-Capture first (recommended), or wait and build
   the full voice+English suite in one pass?
