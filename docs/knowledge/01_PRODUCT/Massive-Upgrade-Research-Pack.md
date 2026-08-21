---
authority: product
derived_from: Roadmap/AIIMIN-V1-Blueprint · Genesis · 10_DECISIONS/2026-08-03-life-score-taxonomy · 10_DECISIONS/2026-08-20-client-kill-list
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: hub
note_type: NT-RESEARCH
tags:
  - type/research
  - domain/product
  - status/living
  - program/massive-upgrade
---

# Massive Upgrade Research Pack — Link · Depth · Personalization

> **Date:** 2026-08-20  
> **Job of this note:** Founder + agents use this as the **idea and sequencing spine** for the next major product climb — without inventing a second Genesis or a sixth Life Score.  
> **Not** a commit to ship every idea. Ideas are labelled `FOUNDATION` · `V1-WAVE` · `EXPERIMENT` · `POST-V1` · `REJECT`.

## 0. Verdict (read this first)

**The massive upgrade is not “more pages.”**  
It is making every Settle **cite**, **link**, and **compound** — so the same Capture on phone and the same Today on web feel like one mind that knows *who*, *why*, *how sure*, and *what it unlocked*.

Three laws for every proposal below:

1. **Genesis holds** — Capture-first, no Dashboard hub, Knock discipline, Offer≠auto-write, Life Score stays `physical · cognitive · discipline · financial · emotional` (BODY · MIND · DISCIPLINE · MONEY · MOOD).
2. **Linking beats features** — Prefer `graph_edges` / People / provenance over a new top-level surface.
3. **Accuracy before theatre** — Prefer server truth + confidence bands over RPG cosplay that invents XP clientside.

**Sparring take:** LifeForge / Habitica / ulives prove the market wants *progression*. Copying their fantasy layer would fight AIIMIN’s craft identity. Steal the *mechanics that map to real life* (stat decay → honest dimension decay; quest arcs → Life Arc chapters; AI log → Capture Offer). Reject pets, parties, and fake gold as product core.

---

## 1. What already exists (substrate you upgrade, not replace)

| Layer | Surfaces | Role in the upgrade |
|-------|----------|---------------------|
| **Web Life OS** | Today/Overview, Journal, Notes, Finance, Habits, Goals, Calendar, Focus, Discipline, Family, Lab, Reports, Account, Sports | Deep OS — where links, reports, vault, and calibration live |
| **Native V3** | Day · Money · Capture · Lab · Config (+ notes/journal/scan/knocks) | High-signal capture + companion truth; not a second OS |
| **API** | `api.aiimin.in` · Better Auth · LHS engine · mobile sync | Single truth; clients never recompute Life Score |
| **Design lock** | Drafting Table tokens | Craft language for all new UI |
| **Diet (R4)** | Career chrome parked; seed-data locked | Room to deepen *core* without career distraction |
| **Blueprint waves** | W0–W13 in [[Roadmap/Blueprint-Appendices/07_Roadmap-Validation-Decisions]] | Already sequenced “complete V1” — this pack **amplifies** those waves with link/personalization detail |

**Native leftover (device-gated, not idea-gated):** [[17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST]] — AIN065 proof, live Settle delete, OCR fire, FCM PARK, etc. Finish trust before inventing new modules.

---

## 2. External research (2026-08-20) — what the market is teaching

### 2.1 Personal OS → graph substrate (direction we should own)

| Source | Pattern | AIIMIN translation |
|--------|---------|-------------------|
| [The Age of the Personal OS](https://barancezayirli.com/blog/ai/the-age-of-the-personal-os/) (Cezayirli, 2026) | AI is bookkeeping; *human* owns conviction; confidence in metadata; scars deserve a home; small “operating manual” for models | **Provenance + confidence on every Offer**; journal “scar” / lesson objects; short OS-ID “agent card” for intelligence |
| Karpathy LLM Wiki (cited there) | Flat linked notes > RAG at personal scale | Prefer **typed edges + citations** over embedding theatre until corpus is huge |
| Open-source LifeOS / Nexus / Locus-style graphs | Entities · events · relations; people/assets/places | Blueprint **W3 Graph + People** is the correct spine — implement hard |
| Indian student/professional context | Waitlist, ₹ pricing, UPI, family, placements parked | Personalization defaults: **IST, UPI drafts, family reminders, exam/semester arcs** — not US calendar defaults |

### 2.2 Progression / RPG wave (steal mechanics, reject costume)

| Product | What works | What AIIMIN rejects |
|---------|------------|-------------------|
| **LifeForge** | AI plain-language → stats; Health Connect → XP; class *reflects* behaviour; quest arcs; streak freeze; half-quest for hard days | Skyrim cosplay as brand; social leagues as core; client-side “stats” |
| **ulives** | User-designed attributes / currencies | Infinite customization before Capture (Genesis forbids) |
| **Habitica** | Clear level loop; parties for ADHD accountability | Pets/gold as identity of product |

**AIIMIN progression thesis:** Unlock **capability and clarity**, not costumes. Levels = *what the OS is allowed to know and show*, gated by trust + data density + consent.

### 2.3 Design references (VP0)

| Slug | Use as |
|------|--------|
| [welcome-onboarding](https://vp0.com/source/welcome-onboarding) | Paged Life Arc / 18+ / consent rhythm — adapt to Drafting Table, not copy |
| [pulse-habit-ring](https://vp0.com/source/pulse-habit-ring) | Calm daily ring for **daily minimums** / Depth — not a new Habits product |

VP0 library is thin on “finance ledger” / “life score” keywords today — lean on Drafting Table + Genesis P3/P4 for money and score craft.

### 2.4 Research tooling note

`agent-reach` / `mcporter` were **not installed** in this shell; research used WebSearch + Jina fetch + VP0 + vault Blueprint. Re-run Exa/Reddit/X when agent-reach is online for Indian student discourse.

---

## 3. The Link Layer — the actual “massive” product

Everything below assumes one primitive:

```
Pulse / Settle → Entity → typed Edge → cited Insight
```

### 3.1 Edge vocabulary (ship as schema + UI)

| Edge type | Example | Surfaces that show it |
|-----------|---------|------------------------|
| `spent_with` | UPI → Person | Money, Person, Today |
| `about_person` | Journal mention → Person | Journal, Family |
| `supports_goal` | Habit → Goal | Habits, Goals, Depth |
| `drains_dimension` | Screen time → BODY/MIND | Day score, Reports |
| `earns_dimension` | Focus session → DISCIPLINE | Focus, LHS |
| `opens_loop` | Note “call Mom” → Open Loop | Today, Knocks |
| `closes_loop` | Settle that resolves loop | After-Settle |
| `from_document` | OCR receipt → tx | Money, Documents |
| `correlates_with` | Sleep ↔ MOOD (server only) | Lab, Reports — always cite |

**FOUNDATION:** `graph_edges` + People (Blueprint W3). Without this, “personalization” is just themes.

### 3.2 Confidence & provenance (accuracy)

Every AI Offer and every Insight must carry:

| Field | Values | UX |
|-------|--------|-----|
| `confidence` | high / mid / low | Band colour + plain language |
| `sources[]` | entity ids + timestamps | Provenance drawer (W10) |
| `method` | rule / model / aggregate | Never hide |
| `stale_after` | ISO | Insights expire; no zombie advice |

**REJECT:** Insights that cannot cite. Prefer silence.

### 3.3 Person as hub (Family stays the IA home)

Person card shows: lends, spends, care logs, calendar overlaps, journal mentions (opt-in), open loops.  
No new “CRM” top-level hub (Genesis BR).

---

## 4. Depth machine — make Today feel alive

Blueprint W2 already names Depth + Open Loops + daily minimums. Amplify:

### 4.1 Depth states (server-driven)

| State | Meaning | UI job |
|-------|---------|--------|
| `dawn` | Early, no shame | Soft empty |
| `building` | Below minimums | Show *one* next Catch |
| `steady` | Minimums met | Quiet affirmation |
| `deep` | Extra settled truth | Optional Lab tease |
| `drift_heavy` | Holds waiting | Sync tray + Settle CTA |

**EXPERIMENT:** Depth reacts to *linked* Settles more than raw count (quality > spam logging).

### 4.2 Open Loops queue

- Extract from Notes / Journal / Capture Offers (human Commit required).
- Knock only inside quiet-hours rules.
- Closing a loop = After-Settle celebration (proportional, interruptible).

### 4.3 Daily minimums (already Partial on V3)

Make minimums **persona-aware**:

| Persona | Default minimums |
|---------|------------------|
| Student | Journal 1 · Habit 2 · Focus 25m |
| Working | Money glance · Calendar conflict check · Habit 1 |
| Founder | Capture 3 · Goals touch · Discipline check-in |
| Family | Family reminder scan · Money · Mood |

Stored on server; native + web share.

---

## 5. Life Score — deepen without renaming

Canonical taxonomy locked: [[10_DECISIONS/2026-08-03-life-score-taxonomy]].

### 5.1 Per-dimension “sub-truth” (server only)

| Dimension | Deepen with | Unlock when |
|-----------|-------------|-------------|
| **BODY** | Health Connect steps/sleep; screen-time drain; workout Settles | HC consent + 7 days data |
| **MIND** | Focus minutes; journal word-count quality (not vanity); English AEI later | Focus + journal density |
| **DISCIPLINE** | Habit adherence; streak freeze honesty; daily minimums | Habits + Config |
| **MONEY** | Budget adherence; lend/borrow; UPI review queue accuracy | Finance Settles + review |
| **MOOD** | Explicit mood Settles only; never infer from chat tone | User opt-in mood logging |

**REJECT:** Client recomputation. **REJECT:** Sixth dimension.

### 5.2 Score storytelling (Reports)

Weekly narrative = five paragraphs max, each citing sources. Interactive report (W10) lets user click citation → entity.

---

## 6. Progression / unlocks — AIIMIN-native (not Habitica)

### 6.1 Progression axes (three parallel tracks)

| Track | What levels | What unlocks | Never unlocks |
|-------|-------------|--------------|---------------|
| **Trust** | Consent + permissions + PIN/biometric | Sensors, SMS-off-by-default paths, vault | Data sale |
| **Density** | Days with ≥N Settles; edge count | Correlations, weekly PDF, Lab SEED→LIVE | Fake LIVE labels |
| **Craft** | Life Arc chapters completed | Persona presets, deeper Knocks, English tree | Coercive streaks |

### 6.2 Suggested unlock ladder (product copy, not XP theatre)

| Level name | Gate (honest) | Unlocks |
|------------|---------------|---------|
| **Seed** | Account + 18+ | Capture, Today, Journal, Notes |
| **Root** | 7 days Settles OR Arc set | Goals link, Habits, minimums, Knocks quiet |
| **Lattice** | ≥20 typed edges OR People ≥3 | Person cards, Open Loops, graph context API |
| **Canopy** | Finance Settles + review queue used | Lending, subscriptions, import undo |
| **Summit** | Lab LIVE correlations (not demo) | Provenance reports, PDF, weekly rhythm |

Show ladder in Account → “OS maturity” — craft language, not RPG classes.

### 6.3 Soft “class” without cosplay (optional EXPERIMENT)

Mirror LifeForge’s insight that **behaviour shapes identity**, but render as:

> “This month your OS reads **Builder** — high DISCIPLINE + Capture density.”  
> “Last month it read **Steward** — MONEY + Family care.”

Computed server-side from LHS + edges. User can pin a preferred Arc label. **No avatars required.**

---

## 7. Domain upgrade catalogue (what more to build)

Status tags relative to Blueprint.

### 7.1 Capture & truth (Native heavy)

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Unified review queue | V1-WAVE W5 | UPI + OCR + SMS drafts → Approve/Dismiss; never silent write |
| Counterparty → Person inline | V1-WAVE | Unknown UPI payee Create Person |
| Hold tray → Open Loops | FOUNDATION | Drift items that look like todos become loops on Commit |
| Voice → Offer with Adjust | PARTIAL | Already Capture AI path; force confidence band |
| Screen-time honest unions | PARTIAL | A1 law; keep anti-lie |

### 7.2 Money depth (Web + Native)

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Lending ledger ↔ Person | W4 | Rollups; Veil on forgive |
| Subscriptions / bills | W4 | Detect + Confirm |
| Import batch + undo | W4 | Hand-back |
| Safe-to-spend (real endpoint) | EXPERIMENT | Only if server formula + citations |
| Category personalization | EXPERIMENT | Learn from Adjusts, not hardcode US merchants |

### 7.3 People / Family

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| People graph | W3 | Merge contacts; Google import |
| Care interaction log | W2/W3 | “Called Mom” Settle |
| Reminder → Knock | PARTIAL | Quiet hours |
| Household multi-user | POST-V1 | Deferred consciously |

### 7.4 Calendar

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Two-way write + conflict UI | W6 | No silent overwrite |
| Focus write-back | W6 | |
| Exam / semester mode | EXPERIMENT | Indian academic calendar templates |

### 7.5 Lab / Intelligence

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Graph-cited insights only | W10 | |
| Correlation LIVE gate | PARTIAL | Kill demo confusion |
| English / AEI skill tree | W7 | Inside Lab |
| AI-off mode | PLANNED | Full product usable |

### 7.6 Documents / Vault

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Document OS | W8 | PDF/DOCX/XLSX viewer |
| Expiry ladder | W8 | |
| OCR → money | W5/W8 | |
| Emergency card | W8 | |

### 7.7 Privacy / Trust

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Consent registry UI | W9 | |
| Activity log | W9 | |
| Scoped delete | W9 | |
| Journal excluded from analytics | LAW | Keep |

### 7.8 Notifications

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Knock type registry | W11 | |
| Digest / streak freeze | W11 | |
| Content masking | PLANNED | |

### 7.9 Web-only craft

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Reports interactive provenance | W10 | |
| Soft Monotone / a11y | W1 | |
| Command Palette → graph search | EXPERIMENT | “Mom” finds Person + loops |
| Placements | PARKED | Stay deep-link only unless Founder unparks |

### 7.10 Native-only craft

| Idea | Tag | Spec sketch |
|------|-----|-------------|
| Widgets / haptics / swipe grammar | W5 | |
| FCM remote Knocks | PARK | After local Knocks proven |
| Play Billing | PARK D5 | |

---

## 8. Personalization engine (specifics to *this* user)

### 8.1 Inputs (already partially exist)

Life Arc · persona presets · nav pins · sports teams · quiet hours · daily minimums · tier · timezone · OS-ID.

### 8.2 Outputs (build)

| Output | Behaviour |
|--------|-----------|
| **Today composition** | Widget order from persona + Density level |
| **Knock schedule** | Derived from failures (missed minimums), not spam |
| **Offer templates** | Indian ₹, UPI, family language |
| **Empty states** | Teach *one* next Catch tied to Arc |
| **Reports tone** | Steward vs Builder language from §6.3 |

### 8.3 Anti-goals

- No infinite theme kitchen before first Settle.
- No dark-pattern “complete profile” walls.
- No social feed as core (Campfire-style is optional POST-V1 experiment only).

---

## 9. Experimentation lab (safe sandboxes)

Run inside Account → Design / Lab **SEED**, never as silent LIVE.

| ID | Hypothesis | Metric | Stop rule |
|----|------------|--------|-----------|
| E1 | Linked Settles raise 7-day retention more than raw Settle count | D7 return | 2 weeks |
| E2 | Half-minimum “grace day” beats streak shame | Minimum completion | Genesis: no shame UX |
| E3 | Provenance drawer increases Adjust rate (better truth) | Adjust/Offer ratio | |
| E4 | Person-first money review reduces unknown payees | % txs with person | |
| E5 | OS maturity ladder increases consent grants | HC/UsageStats opt-in | No paywalling trust |
| E6 | Command Palette graph search vs page search | Time-to-entity | |

---

## 10. Design & craft direction

1. **One composition** on first viewport (web marketing + Today).
2. **Drafting Table** steel accent; orange = peak-A only.
3. Motion: After-Settle, Honest Hold, One Motion — no confetti storms.
4. EmptyCoach teaching variant for every parked-or-new surface.
5. VP0 onboarding + habit ring = **rhythm references**, remixed.

---

## 11. Sequencing — how to climb without drowning

### Phase A — Finish honesty (now)

1. Native leftover AIN065 / live Settle proof.  
2. Lab LIVE vs SEED clarity.  
3. Keep web diet (Career parked).

### Phase B — Link core (align W2–W3)

1. `graph_edges` + People + Open Loops.  
2. `/today` aggregate + Depth states.  
3. Provenance on one insight type end-to-end (golden path).

### Phase C — Money + body sensors (W4–W5)

1. Review queues.  
2. Lending ↔ Person.  
3. Health Connect / screen-time feeding BODY honestly.

### Phase D — Intelligence that cites (W10–W11)

1. Reports with drawers.  
2. Knock registry + freeze.  
3. OS maturity ladder UI.

### Phase E — POST-V1 bets

Semantic search · household · iOS · Hindi · social forge · Career unpark — only with ADR.

---

## 12. Surface ownership matrix

| Capability | Native V3 | Web | API |
|------------|-----------|-----|-----|
| Catch / Settle | Primary | Secondary | Truth |
| Graph browse | Light | Primary | Edges |
| Reports / PDF | Link out | Primary | Generate |
| Sensors | Primary | — | Aggregate |
| Consent / delete | Config | Account | Registry |
| English AEI | Lab light | Lab full | Sessions |

---

## 13. Explicit REJECT list (save years)

- New top-level Dashboard.
- Client-side Life Score / XP economy as source of truth.
- Habitica pets / gold as brand.
- Auto-writing journal from model without Commit.
- Inferring MOOD from private text without explicit Settle.
- Reviving Career into masthead without Founder unpark.
- Growing Capacitor `/m` features (sunset path).
- Copying V2 UI into V3.

---

## 14. Founder decision prompts (answer to prioritize)

1. Is **OS maturity ladder** (capability unlocks) the progression brand — yes/no?  
2. Unpark **Career** later as Lab module only, or permanent park?  
3. First golden path for provenance: **Money**, **Mood**, or **Discipline**?  
4. Social accountability (friend VS): POST-V1 forever, or small experiment?  
5. Agent-reach install for continuous Indian-market discourse research?

---

## 15. Related

- [[Roadmap/AIIMIN-V1-Blueprint]]
- [[Roadmap/Blueprint-Appendices/07_Roadmap-Validation-Decisions]]
- [[10_DECISIONS/2026-08-03-life-score-taxonomy]]
- [[10_DECISIONS/2026-08-20-client-kill-list]]
- [[16_DOCUMENTATION/Web-Surface-Diet-R4]]
- [[17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST]]
- [[Maps of Content/Native-App]]
- [[15_MEMORY/Current-Context]]
- [[01_PRODUCT/Dual-Market-Pricing]] — INR locked + USD $0/$3/$7/$16 founding plan
- [[01_PRODUCT/AI-Preference-Map]] — where users want / refuse AI
- [[01_PRODUCT/Marketing-And-Go-To-Market]] — India + Americas GTM
- [[01_PRODUCT/Build-Next-Now]] — one-page “what to build next” card
- [[01_PRODUCT/Phase-B-Prep-Spec]] — eng tickets for link core (schema gated)
- [[01_PRODUCT/Owned-PR-Kit]] — Stage-1 owned channels kit
- [[01_PRODUCT/Stage1-Marketing-Ops-Plan]] — day calendar + AARRR

## 16. Follow-on research (2026-08-20 deep pass)

See dedicated notes rather than duplicating here:

| Topic | Note |
|-------|------|
| Dual-market pricing + age/sensing bands | [[Dual-Market-Pricing]] |
| AI want vs refuse | [[AI-Preference-Map]] |
| Professional marketing plan | [[Marketing-And-Go-To-Market]] |

**Waitlist engineering (same day):** multi-form localStorage desync + dual theme-hook bug fixed in `waitlistSignupStorage.js` / `WaitlistForm.jsx` / `HeroBrandLockup.jsx` / `useWaitlistSurfaceTheme.js`.
