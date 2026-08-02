# AIIMIN Mobile App — Agentic Build Plan & Guardrails

> The executable map for building the AIIMIN mobile app. Written **for an AI agent**
> to follow one step at a time without drifting. Date 2026-08-02.
> Companion: [DRAFTING_TABLE_TESTING_AND_PLAN.md](DRAFTING_TABLE_TESTING_AND_PLAN.md) (test results, genesis gap, harvest).

---

## 0. HOW TO USE THIS (read first, every session)

### Source-of-truth hierarchy (higher wins)
1. **Founder instruction** (chat) — always wins.
2. **Genesis** (`docs/knowledge/Genesis/`, esp. P8 §03 IA, §08 Surfaces) — constitutional.
3. **This plan.**
4. **Drafting Table handoff** (`~/Downloads/design_handoff_aiimin_drafting_table/`) — visual language.
5. The existing web app (`frontend/src`) — reference for data + behavior, not for mobile layout.

### GUARDRAILS — the "don't go insane" rules (non-negotiable)
- **G1 — One surface at a time.** Build → verify → commit → next. Never scaffold 5 screens at once.
- **G2 — One-job law (P8-R-124).** Every surface states ONE job before building. No multi-job dumps.
- **G3 — No new top-level surface** without checking it against the genesis 6-layer stack (§2). Goals/Focus/Discipline/Sports are **domains/features**, not tabs.
- **G4 — The theme is LOCKED.** Palette, type, tokens (Drafting Table) are founder-approved. Do NOT redesign colors/fonts. Craft (layout, motion, components) is open.
- **G5 — Verify before "done."** Run it, screenshot/inspect the real output, confirm it works. Evidence before claims. (superpowers:verification-before-completion)
- **G6 — No destructive or irreversible action on real accounts/data.** No delete, no purchase, no send, no schema/auth change without explicit founder approval. Use guest/seed data for testing.
- **G7 — Local state first for new surfaces**, then wire to the API once the surface is confirmed. Don't couple design work to backend shape.
- **G8 — Scope fence per task.** If a task grows beyond its one job, STOP, write down the overflow, finish the one job, raise the overflow. Do not auto-expand.
- **G9 — Fix root cause, not symptoms.** Reproduce → understand → fix → re-check nothing else clashes (grep the pattern repo-wide). (superpowers:systematic-debugging)
- **G10 — Ask, don't assume, on: data model, auth, pricing/tiers, anything irreversible.**

### Definition of Done (every task)
Compiles clean · renders correctly (verified visually or via DOM) · no new console errors · matches the one-job + the token language · committed with a clear message · founder-visible change noted.

### Anti-slop checklist (before commit)
No placeholder/TODO left · no dead imports · no duplicated component that an existing one covers · copy is end-user voice, active, sentence case · reduced-motion respected · touch targets ≥ 44px.

---

## 1. PRODUCT TRUTH (locked)

**AIIMIN = one Personal Life OS.** Mobile = fast capture + calm reads + the day's score; web = the full drawing (deep analytics, reports, Lab). One shared graph, synced both ways. "Capture through the week on the phone; Sunday the web opens the full drawing."

### Genesis 6-layer surface stack (the only legal top-level map)
| Layer | Surfaces |
|-------|----------|
| 1 System | Splash · Onboarding · Auth |
| 2 Day | **Today** — capture-first (hosts the primary universal capture story, GOV-106) |
| 3 Memory | Knowledge · Journal · Timeline · Search |
| 4 Pillars | Family · Finance · Documents |
| 5 Intelligence | AI (ask/review/act) |
| 6 Account | Profile · Settings |
Refused as primary home: Dashboard, Tasks board, Projects board, collage of read modules (GOV-165).

### Feature ledger (founder decisions — locked)
| Feature | Decision | Build note |
|---------|----------|-----------|
| AI-parse the log (Capture Offer) | ✅ | Build **very carefully, precise** — parse → editable chips → commit. The trust surface. |
| Life Arc | ✅ | Minimal on mobile — a steering line, not a page. |
| Reports (Snapshot/PDF/Interactive/Deep) | ✅ | Tier-gated. |
| Correlations (plain-English) | ✅ | ρ/q mono + one human line each. |
| Streak heatmaps | ✅ | Habits/minimums warmth. |
| XP / Life ranks | ✅ | Ambient, not gamer-loud. |
| Journal (templates + mood + voice) | ✅ fully | Dedicated surface. |
| Finance depth | ✅ strong focus | Net worth, FI velocity, burn, runway, wealth. |
| Life modes | ✅ | Context presets (BUILD/RECOVER/EXAM/TRAVEL). |
| Command Timeline | ✅ | Chronology (not feed, GOV-102). |
| Micro-task ("one small thing today") | ✅ | Today, one line. |
| A mobile shortcut (like Life Arc, minimal) | ✅ | Quick-action; keep minimal. |
| Weekly Pulse (WHO-5) | ❌ rejected | Remove from entry flow. |

### Design language (LOCKED — G4)
Drafting Table: graphite dark ground / light Industry sheet toggle; hairline borders, square corners (radius on buttons only); Barlow Condensed chrome, Barlow body, JetBrains Mono for every numeral; steel accent `#749dc4` (dark)/`#416180` (light); one warm spark = the brand node `#ff6b35`. Tokens live in `frontend/src/prototypes/drafting-table/tokens.css` scoped to `.dt-root`. Real brand mark = the peak-A (`BrandMark`).

---

## 2. SURFACE MAP (the app to build)

Bottom tab bar (5): **DAY · MONEY · CAPTURE · LAB · CONFIG** (current proto). Contextual: Score, OS-ID, Onboarding, Search, Notifications. **Genesis-faithful additions** reached contextually or via a "more" affordance, not new tabs: Journal, Knowledge/Notes, Timeline, Family, AI, Documents.

> **Doctrine fix (required):** Today must be **capture-first**. The universal capture + micro-task lead; the Life Score and derived grid are *secondary* reads below. (Fix EC-P8-302/802 — the current Day Sheet leads with the score grid.)

Per-surface one-jobs (build against these):
| Surface | One job | Key contents | Tier |
|---------|---------|--------------|------|
| Today | Act on this day | Universal capture (lead) · micro-task · Action Required · calm Life Score + area reads · daily minimums | explore |
| Capture | Turn a sentence into structured truth | AI-parse → editable chips (amount/category/merchant/people/mood) → Settle/Drift · presets · hold tray | explore |
| Money | Log and see money truth | Overview (safe-to-spend) · Budgets · Ledger · Analytics/Wealth (net worth, FI velocity, burn, runway) | core |
| Lab (AI) | Ask, review, act on patterns | Correlations (ρ/q + human line) · scatter · survivors · Reports entry | core (deeper: pro/elite) |
| Config | Configure the OS | Profile+brand · XP/rank · Life Arc · life mode · sync · preferences · data | explore |
| Journal | Reflection capture | Free Write/CBT/Morning Pages/Weekly Review · mood · voice · history | explore |
| Score | Mark and settle the day | Rail + Ladder mechanisms · what moved the number | explore |
| OS-ID | Own your identifier | Part-number card · spec · appears-on | explore |
| Onboarding | Get a new user to their first capture | 6-step (see §3) | — |
| Search | Recall across the graph | Cross-entity recall; Goals appear as results | explore |

---

## 3. FLOWS (build these end-to-end so the proto is "what the app really is")

### 3.1 New-user onboarding (step by step — the full first-run)
1. **Welcome** — brand lockup, one-line promise, "Begin".
2. **Auth** — OS-ID + PIN or Google (never Claude-typed).
3. **Claim OS-ID** — 8-char, live availability, alternates (proto screen exists).
4. **Set your Arc** — one Life Arc line (steers the OS). Minimal.
5. **Pick daily minimums** — choose ~5 from suggestions (seeds the day).
6. **First capture** — guided universal capture → see the Offer → Settle → land on Today with the day started.
No Weekly Pulse. No tour stacked over the first screen.

### 3.2 Daily-use loop (returning user)
Open → Today (capture-first) → log via universal capture or preset → AI-parse Offer → Settle (writes ledger/log, Undo toast) → tick minimums (score recomputes) → optional: mark the day on Score (rail/ladder) → Sunday nudge to open web.

### 3.3 Sync — app ↔ web, both ways
- **App → Web:** captures/logs/minimums/score marks write to the shared graph via API; web reads them for deep analytics + Reports.
- **Web → App:** budgets, goals, habits, journal, connections configured on web appear on mobile; Life Score + correlations computed server-side surface on mobile.
- **Offline:** captures queue locally (hold tray), sync on reconnect ("held locally" edge state). Show LIVE/SYNCING states.
- **Contract:** one canonical entity graph; mobile is a thin client over the same `/api/db` + dedicated routes the web uses.

---

## 4. DATA & INTERLINK CONTRACTS

- **Client:** the app talks to the same backend as web. Table access via the API-backed shim (`utils/supabase.js`) or dedicated routes (`/api/journal`, `/api/notes`, `/api/lab`, `/api/wealth`, etc. — all exist server-side).
- **Auth:** Better Auth (OS-ID+PIN, Google). Sessions do NOT populate Supabase RLS → all data goes through `/api/*` (never direct PostgREST).
- **Life Score — resolve the taxonomy clash before building the score UI.** Web shows two label sets (Today: Body/Mental/Goals/Money/Sleep; Reports: Physical/Cognitive/Discipline/Financial/Emotional). **Founder to pick ONE canonical 5-dimension set; app + web must match.** The proto's Craft/Body/Order/Mind/Money/People is a third set — align it.
- **Score formula:** proto uses a placeholder (`70.7 + …`). Replace with the real server model on wiring.

---

## 5. BUILD PHASES (the sequence — one gate at a time)

Each phase: scope → acceptance gate (must pass to proceed) → guardrail focus.

- **P0 · Contracts & fixes.** Resolve Life-Score taxonomy; confirm sync contract; ship web bug fixes (§6). Gate: reminders loop gone on prod; taxonomy chosen. Guardrail: G6/G9.
- **P1 · Capture-first Today (proto restructure).** Rebuild Today so capture leads, score secondary. Gate: matches §3.2 + genesis doctrine; founder sign-off. Guardrail: G2/G4.
- **P2 · Core loop → real data.** Capture(AI-parse precise), Money(+depth), Lab(correlations+Reports entry), Score(real formula), OS-ID, Config. Gate: each writes/reads real graph; Undo works. Guardrail: G1/G5/G7.
- **P3 · Genesis surfaces.** Journal(full), Knowledge/Notes, Timeline, Search, Family, AI. Each with one-job + layer. Gate: one-job audit per surface. Guardrail: G2/G3.
- **P4 · Paywall real.** Tier badges on locked, upgrade sheets; keep the test-mode tier interswitch. Gate: gating matches `tierGating.js`. Guardrail: G10.
- **P5 · Intelligence & polish.** Reports (Snapshot/PDF/Interactive/Deep, tier-gated), life modes, XP/ranks, notifications (post-fix), motion polish. Gate: no reduced-motion violations. Guardrail: G4/G5.
- **P6 · Native Android V2 port** (optional, once surfaces + contracts frozen). Gate: contract parity.

**Recommended stack:** ship mobile as the **Drafting Table React surface** first (promote `/proto/draft` → real `/m`, wire to the live API), then port to native Android once frozen. Reuses the live backend; one surface set to validate.

---

## 6. OPEN WEB BUGS (fix deeply, re-check nothing clashes)

| Bug | Status | Action |
|-----|--------|--------|
| Reminders `.abortSignal` crash → ErrorBoundary remount loop → auth storm | **FIXED** (shim now has abortSignal/range) | Deploy; verify loop gone on prod. |
| **Journal + Notes "broken"** | **Open — needs live repro.** Routes exist, frontend API clean, pages load. Break is interaction-level. | Repro protocol: log in → /journal → perform Free Write → Save; capture (a) network 4xx/5xx on `/api/journal`, (b) component stack in console, (c) exact failing action. Then root-cause + fix. Same for /notes add-source. DO NOT blind-patch. |
| Finance MTD ₹0 vs AI-insight ₹65k contradiction | Open | Reconcile windows; empty-state MTD tiles instead of ₹0. |
| Life Score 47/49/54 + dimension-name drift across surfaces | Open | Pick canonical taxonomy (P0); label windows. |
| Onboarding stacks WHO-5 + tour | Open | Remove WHO-5 from entry (rejected); sequence tour. |

---

## 7. VERIFICATION GATES (per phase, before founder review)
1. `npm run build` (or webpack compile) clean — no import/type errors.
2. Load every changed surface; confirm render (screenshot or DOM); no new console errors.
3. Exercise the primary interaction; confirm the write/read round-trips (or local-state end-state on unwired proto).
4. Reduced-motion + touch targets pass.
5. Grep the repo for any pattern you changed (e.g., a shim method) to confirm no other caller clashes.
6. Commit with a message stating what + why. Report to founder with what changed and what's next.

---

## Appendix — current proto state (2026-08-02)
`/proto/draft` (React, local state): 9 screens, both themes, tier interswitch. Recent craft pass: real BrandMark, cleaner Action box (no + marks), animated minimums with progress + DAY CLEARED, real ax- scatter, redesigned Config (brand hero + XP + Life Arc + life mode). Motion: score count-up, rail glide, hover warmth. Not yet: capture-first Today (P1), backend wiring (P2), genesis surfaces (P3).
