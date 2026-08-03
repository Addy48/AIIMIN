---
authority: engineering
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-TEST
tags:
  - type/report
  - domain/build
  - status/active
---

# AIIMIN — Website Test Report · Genesis Gap · App Build Plan

> Date 2026-08-02 · Branch `feat/drafting-table-prototype` · Author: Claude (partner pass)
> Sources: live `aiimin.in` (authed as AADI0837 · **Elite till 12 Aug 2026**), local API on :3001,
> Genesis P8 Master Spec, the Drafting Table handoff, the prototype at `/proto/draft`.

Scope of this doc: (A) full website test results — no filter, (B) genesis gap recheck,
(C) website→app feature harvest, (D) app build master plan, (E) prototype fine-tune plan.

---

## A. Website in-depth test results

Tested authed on live prod. Surfaces swept: Today, Finance, Journal, Habits, Goals, Focus,
Reports, Notes, Account, plus login + landing. Severity: 🔴 breaks a feature · 🟠 wrong/misleading
· 🟡 polish/UX · 🟢 works well.

### A1. Findings (ranked)

| # | Sev | Surface | Finding | Evidence / Fix |
|---|-----|---------|---------|----------------|
| 1 | 🔴 | Global (Overview) | **Reminders/notifications broken in prod.** Every authed page throws `Failed to fetch reminders: TypeError: …order(…).abortSignal is not a function`, dozens of times/session. Bell shows "2 unread" but the fetch always fails. | Root cause: [Overview.jsx:495-501](../../../frontend/src/pages/Overview.jsx#L501) — `family_reminders` query chains `.abortSignal(abortController.signal)`; the prod Supabase builder (shim `l.A`) has no `.abortSignal`. Fix: drop `.abortSignal()` or guard `typeof q.abortSignal==='function'`; or wire the AbortController via fetch options. |
| 2 | 🟠 | Finance | **Contradictory dashboard.** Net worth ₹5,86,100 + portfolio +161.65%, but Income/Expenses/Monthly-Burn MTD all **₹0**, Liquid Runway "—", "0 months", "Need savings data" — while the AI Insight narrates "income ₹65,000 … surplus ₹58,611". Populated portfolio + empty cashflow = mixed truth on one screen. | Likely: no August cashflow rows yet, but AI insight runs on a 30-day trailing window. Reconcile windows + show an empty-state for MTD tiles instead of ₹0 that reads as "you earned nothing." |
| 3 | 🟠 | Cross-surface | **Life Score inconsistency.** Score reads **49** (Today Command Center), **47** (Reports this-week), **54** (prior). Dimension labels differ too: Today = Body/Mental/Goals/Money/Sleep; Reports = Physical/Cognitive/Discipline/Financial/Emotional. | Confirm these are different windows (this-week vs period-avg) and **label them as such**; unify dimension naming to one canonical taxonomy across surfaces. |
| 4 | 🟡 | Entry | **Two interruptions stack on first load** — Weekly Pulse Check (WHO-5) modal + "Start tour" invite fire together over Today. Cognitive overload at the exact calm-first moment genesis protects (GOV-029). | Sequence them (tour OR pulse, not both), or gate the pulse to once/week and never on the same session as the tour. |
| 5 | 🟡 | Goals | Count mismatch: header "**9 active commitments**" vs "**10 SHOWING · 1 WON**"; lanes Active 3 + On Track 4 + At Risk 2 + Achieved 1 = 10. | "9 active" likely excludes the achieved one; make the headline count and the lane totals agree or label the difference. |
| 6 | 🟢 | Journal | Free Write / CBT Record / Morning Pages / Weekly Review, emoji mood scale, voice ("hold the mic"), History + Export. Warm, human, template-rich. | Model for app Journal. |
| 7 | 🟢 | Habits | 8 emoji habits, categories, streak + week + all-time, weekly matrix, GitHub-style yearly heatmap ("180 active days, best streak 180d"). | Gamified + legible. |
| 8 | 🟢 | Reports | Genuinely deep: Snapshot/Standard-PDF/Interactive/Deep, range picker, 7-day pulse, **plain-English correlations** ("+0.40 mood↑ → sleep↑"), LHS score, 5-dim breakdown, drivers, action plan, PDF. | This is the real "Lab"; far past the proto's raw ρ/q. |

### A2. Still-to-test (next auth session — flagging so nothing is "left for others")
Transactions add/edit/delete flow (Finance), Journal save+history+export round-trip, Habit toggle
persistence, Goal create/milestone, Focus timer full run, Reports PDF download + Patterns/Skills
tabs, Search/command palette, Personalization (life modes, nav pins), Subscription/billing UI,
Data export, mobile `/m` shell, offline behavior, theme toggle on every surface, keyboard/a11y,
form validation edge cases (empty/oversized/paste), and destructive flows (delete — **read-only, will
not execute on the real account**). These need careful, mostly non-destructive runs; I paused before
any write/irreversible action on the live account.

### A3. Technical baseline
Landing + assets 200, redirects apex→www, no console errors when logged out. Authed: the reminders
TypeError is the only recurring console error observed (finding #1). No layout breakage on the
surfaces swept at ~840px width.

---

## B. Genesis gap recheck (P8 vs prototype)

**Canonical P8 surface stack (§3.13 + GOV-169 six layers):**

| Layer | Genesis surfaces |
|-------|------------------|
| 1 System | Splash, Onboarding, Auth |
| 2 Day | **Today** (hosts the *primary capture story*, GOV-106) |
| 3 Memory | **Knowledge**, **Journal**, **Timeline**, **Search** |
| 4 Pillars | **Family**, **Finance**, **Documents** |
| 5 Intelligence | **AI** (ask/review/act) |
| 6 Account | Profile, Settings |

**Prototype has:** Day(≈Today), Money(=Finance), Capture, Lab(≈AI/correlations slice), Config(=Settings),
OS-ID, Onboarding, Edge States.

**Gaps / off-doctrine (why it feels incomplete + "too robotic"):**

1. **Missing whole surfaces:** Knowledge, Journal (separate reflection), Documents, Timeline, Search,
   a dedicated **AI/Intelligence** surface, Family. The proto is the validated *core loop*, not the OS.
2. **Capture is at the wrong altitude.** GOV-106: capture is the **primary universal story on Today**,
   not a co-equal bottom tab. Proto demotes it to 1-of-5.
3. **Day Sheet is dashboard-shaped.** Genesis **refuses a dashboard/collage home** (GOV-165, §3.18) and
   mandates Today = capture-first, derived reads *secondary*. `EC-P8-302`/`EC-P8-802`: Life Score must
   not lead with capture chrome / masquerade as the capture-first surface. The proto's Day Sheet leads
   with a derived score grid → the instrument-panel / robotic feel.
4. **Top level should stay minimal.** Goals/Focus/Discipline/Sports/Career are **domains/features**, not
   tabs (Goals lives under Search recall per GOV-165). The marketing site sells them as "modules"; genesis
   surfaces them *through* Today/Timeline/Finance/AI, not as nav peers.
5. **No AI-as-center**, but a real AI surface is required (GOV-047: not chatbot-as-center; GOV-141:
   interruptible). Proto has none.

**Verdict:** proto ≈ 40% of the genesis surface set, and its home violates the capture-first / no-dashboard
doctrine. That's the "a lot is missing" instinct, confirmed against the constitution.

---

## C. Website → App feature harvest

Ranked by usefulness to the mobile app. "Place" = where in the DT app; "Design" = how in the language.

| Feature (from web) | Use | Place in app | How to design (Drafting Table) |
|--------------------|-----|--------------|--------------------------------|
| **Universal capture** ("Worked out 45m, 8/10") → AI parse | ★★★★★ | Today primary story + FAB everywhere | Promote Capture to the omnipresent primary; the Offer chips already match |
| **Life Arc** (Daily/Weekly/Life direction) | ★★★★★ | New surface / Today header | Blueprint "PART NO."-style card; Arc as a spec line that steers nudges |
| **Plain-English correlations** | ★★★★★ | Lab/AI surface | Keep ρ/q mono, add a one-line human read under each (web does this) |
| **Reports** (Snapshot/PDF/Interactive/Deep) | ★★★★★ | AI/Intelligence surface | Blueprint report sheet; tier-gated (Core/Pro/Elite) |
| **Habit streaks + yearly heatmap** | ★★★★☆ | Discipline/Today minimums | Replace stark checkbox minimums with streak + mini-heatmap warmth |
| **XP / Life ranks** (Rank 6/10, 17,091 XP, 2.5× streak) | ★★★★☆ | Profile/Today ambient | Mono XP counter, rank as a part-number grade; subtle, not gamer-loud |
| **Journal templates + emoji mood + voice** | ★★★★☆ | Journal surface (new) | Emoji mood is the warmth injection; keep templates as blueprint tabs |
| **Finance depth** (net worth, FI velocity, burn, runway) | ★★★★☆ | Money surface tabs | Extends proto Money; add Analytics/Wealth tabs |
| **Life modes** (context presets) | ★★★☆☆ | Settings + Today switcher | Segmented control in chrome |
| **Command Timeline** (week, add target/day) | ★★★☆☆ | Timeline surface (new) | Chronology, not feed (GOV-102) |
| **Weekly Pulse (WHO-5)** | ★★★☆☆ | Journal/AI cadence | Gate to weekly; never stack with onboarding |
| **Micro-task** ("one small thing today") | ★★★☆☆ | Today | One-line mono input under the score |

---

## D. App build master plan (mobile, interlinked with web)

**North star:** one Personal OS. Mobile = fast capture + calm reads + score; web = the full drawing
(deep analytics, reports, Lab). They share one graph via sync. Genesis-faithful surface stack, DT skin.

**Stack decision (to confirm):** the handoff names two targets — React 19 + Tailwind (web) and
Kotlin/Compose (native Android). The proto is React. Recommendation: **ship the mobile app as the DT
React surface first** (promote proto → real `/m`, wire to the existing API), then port to native Android
V2 once the surface set + data contracts are frozen. Rationale: reuse the live backend, one codebase to
validate genesis surfaces, native later for polish/offline/notifications.

### Phases

- **P0 — Foundation (freeze contracts).** Data model + sync contract (daily logs, transactions,
  correlations, reminders — *fix finding #1 first*), auth (OS-ID+PIN, Google), tier gating reuse
  (`tierGating.js`), canonical Life-Score taxonomy (resolve finding #3). Token layer already built.
- **P1 — Capture-first Today (fix the doctrine).** Rebuild Day Sheet so the **capture story leads**,
  derived score/reads secondary (GOV-106, GOV-165). Universal capture + Offer + micro-task + calm
  score read. This is also the "de-robotify" restructure.
- **P2 — Core loop wired to real data.** Money (Finance depth), Live Score (real formula, replace
  placeholder), Lab/AI (plain-English correlations + Reports entry), OS-ID, Config, Onboarding.
- **P3 — Genesis surfaces.** Journal (templates+mood+voice), Knowledge/Notes, Timeline, Search,
  Family, dedicated AI surface. Each: one-job sentence + hierarchy layer (P8 §3.17 intake).
- **P4 — Paywall real.** Tier badges on locked, upgrade sheets, keep the test-mode interswitch.
- **P5 — Intelligence + Reports.** Snapshot/PDF/Interactive/Deep, tier-gated; life modes; XP/ranks;
  notifications (post-fix).
- **P6 — Native Android V2 port** (if pursued) once surfaces frozen.

### Interlink model
Mobile writes captures → shared graph (API/Supabase) → web reads/deep-analyzes → both show one Life
Score. "Capture through the week on mobile; Sunday the web opens the full drawing" (already the proto's
Config copy — make it real).

---

## E. Prototype fine-tune plan ("too robotic" → warmer, no rewrite)

Constraint from founder: *fine-tune, don't change everything.* The DT language (hairlines, mono, all-caps)
is intentional and stays. Robotic feel comes from **stillness + rigidity**, not the language. Motion +
small warmth fixes (respecting `prefers-reduced-motion`):

1. **Score count-up** — animate the life-score figure to its value on mount/recompute (not just opacity
   tick). ~500ms ease-out-expo.
2. **Sparkline / bars draw-in** — stagger bar heights on enter (already have stagger scaffold).
3. **Hover/press life** — accent-tint hover on every tappable (cards, cells, rows), not just press-scale.
4. **Rail marker glide** — smooth the marker to its new value on tap (transform, 200ms) instead of jump.
5. **Warmth injections** (fine, not loud): emoji mood in a capture/journal preset; streak flame on
   minimums; a single human line under the score. Keep the blueprint restraint.
6. **Rung + chip micro-interactions** — subtle scale/tint on select.

Deeper (P1, not now): make Today capture-first per genesis — the real cure for "robotic" is leading with
the human act (capture) instead of the instrument grid.

---

## Open decisions for founder
1. Mobile app = DT React first (then native Android), or native Android straight away?
2. Fix finding #1 (reminders) now, or log for the web track? (It's live-prod, ~1 line.)
3. Canonical Life-Score dimensions: Body/Mental/Goals/Money/Sleep (Today) or
   Physical/Cognitive/Discipline/Financial/Emotional (Reports)? Pick one.
4. Should the proto's Day Sheet be restructured to capture-first now, or kept as-is for the "check"?
