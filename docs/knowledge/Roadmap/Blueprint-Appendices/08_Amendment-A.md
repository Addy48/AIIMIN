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

# Blueprint appendix — Amendment A (§24–28)

> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

# Amendment A — 2026-07-31

> Chapters §24–§28 were added on 2026-07-31. They do not replace §1–§23; they deepen four areas the founder called out: an evidence base for the features where evidence is actually possible, the Journal as an Android flagship, an aggressive Android tier architecture with user categories, and the store-policy corrections that force a redesign of payment capture. §28 replaces the blocked Mobbin research dependency.

---


## 24. Evidence base — which features are research-backed, and which are not

### 24.0 Why this chapter exists, and its honesty rule

The founder's instruction was to make features "research and study backed so they stay effective," using post-2020 work — and, critically, to be honest that **not every feature can be**. That second half matters more than the first. A product that cites a study for a contacts list is a product that will cite a study for anything, and then nobody can trust the citations that are real.

So this chapter has two halves:

- **§24.1–24.5** — features where a real, post-2020 empirical literature exists, what it actually says (including where it says the effect is *small* or *conditional*), and the concrete design rules we adopt because of it.
- **§24.6** — features where no such literature exists or applies. These are justified by job-to-be-done, craft, and heuristic evaluation instead, and we say so in our own docs. We never claim otherwise in marketing.

**Rule E-01.** A feature may only be described as "research-backed" in user-facing copy if it appears in §24.1–24.5 *and* the copy states the effect honestly (no inflating a small effect into a promise).

**Rule E-02.** Where the research says an effect is conditional, the *conditions become product requirements*, not optional polish. This is the whole point of doing the reading: the moderators are the spec.

### 24.1 Journaling / expressive writing

**What the literature actually says.**

| Finding | Source |
|---|---|
| Across 31 RCTs with follow-up (N = 4,012), expressive writing had a **small but significant** effect on depression, anxiety and stress (Hedges' g ≈ −0.12), and the effect **emerged at follow-up, not immediately** — it is delayed and durable | Meta-analysis of long-term-follow-up studies, 2022 (PubMed 36536513) |
| The single intervention feature that moderated effect size was **interval**: sessions spaced **1–3 days apart** outperformed 4–7 day or >7 day spacing | same |
| Effects are hard to replicate; **writer engagement** (indexed by essay length) moderated outcomes — condition differences appeared *only* among participants who wrote longer entries. Adding **emotion-acceptance framing** to the instructions outperformed both classic instructions and control | Frontiers in Psychology, 2023 — "Chasing elusive expressive writing effects" |
| In a general (non-clinical) population meta-analysis, effect ≈ 0.33 uncorrected, ≈ 0.16 after correcting publication bias — small, but "at least harmless" and worthwhile given how cheap the intervention is | Frontiers in Psychiatry, 2023 (Korean sample meta-analysis) |
| Earlier meta-analytic work found brief, self-directed writing did **not** reliably reduce depressive symptoms, but effects were **larger with more sessions and a more specific writing topic** | Reinhold et al. meta-analysis (context for the above) |
| Universal, untargeted deployment fails; adherence was low and intent-to-treat differences were null in a large RCT, though within-session stress *did* drop | Postpartum expressive-writing RCT |

**Design rules adopted (each maps to a moderator above).**

| ID | Rule | Because |
|---|---|---|
| J-R1 | The default cadence target is **every 2 days**, not daily. The app never shames a non-daily journaller. | 1–3 day intervals produced the strongest effects; daily-or-nothing framing creates false failure |
| J-R2 | **Depth over streak.** The primary journal metric is *sessions completed* and *median entry length*, never an unbroken-days counter. A "streak" is not shown on journal at all. | Engagement (length) moderates outcome; session count is the dose |
| J-R3 | At ~40 words the editor offers one gentle "keep going?" affordance and then goes silent. It never blocks saving. | Longer entries carried the effect; nagging kills adherence, which is the failure mode of the null trials |
| J-R4 | Prompts are written in **acceptance framing** ("what would it look like to let this feeling be here?") rather than pure catharsis framing. | Acceptance-enhanced instructions beat traditional instructions |
| J-R5 | Prompts are **specific**, drawn from the user's own Life Graph, not generic. | More specific topics produced larger effects |
| J-R6 | The app **never promises a mood improvement today**. Reflection insight is shown on a 2–4 week horizon. | The effect is delayed; an immediate promise would be a lie the user can falsify on day one |
| J-R7 | Journaling is offered, not pushed, and is **targeted**: the invitation appears when the Life Graph suggests a hard day, not on a fixed schedule for everyone. | Universal deployment fails; targeted use works |
| J-R8 | We surface a **within-session** signal ("how does that feel now?" 1-tap, optional) because the acute stress drop is the one reliably observed immediate effect. | Within-session stress reduction was significant even where ITT effects were null |

**What we will not claim.** "Journaling reduces depression." "Journal daily to feel better." "Clinically proven." The honest line, which is also better copy: *"Writing for a few minutes, a few times a week, is one of the cheapest things you can do for your head. The research says the benefit is small and shows up later — so we count your sessions, not your streak."*

### 24.2 Habits

**What the literature actually says.**

| Finding | Source |
|---|---|
| There is **no magic number**. Time to reach peak automaticity for a self-selected nutrition behaviour had a **median of 59 days** and an individual range of **4 to 335 days** | Keller et al., *British Journal of Health Psychology*, 2021 (RCT) |
| **Routine-based cues and time-based cues were equally effective.** Neither beat the other | same |
| **Repeated plan enactment was the key predictor** of automaticity — not intention, not motivation | same |
| Habit formation time is **behaviour-specific**: machine-learning analysis of 12M gym visits and 40M handwashing events found gym habits take *months* while handwashing takes *weeks* | Buyalskaya et al., *PNAS*, 2023 |
| Systematic review/meta-analysis: median 59–66 days, means 106–154 days, range 4–335; determinants were frequency and timing of practice, context stability, enjoyment, implementation plans, and daily routines; automaticity plateaus around ~12 weeks | *Healthcare*, 2024 systematic review |
| Implementation intentions (if-then plans) accelerate formation by making the cue cognitively accessible | consistent across the above |

**Design rules adopted.**

| ID | Rule | Because |
|---|---|---|
| H-R1 | **The "21 days" claim is banned** from product, marketing, and notification copy. | It is false and the literature is unambiguous |
| H-R2 | Creating a habit **requires a cue**, chosen as either *after [existing routine]* or *at [time]* — both offered as equals, neither recommended over the other. | Routine-based ≈ time-based |
| H-R3 | The habit engine tracks **plan enactment** (done *at/after the planned cue*) separately from **ad-hoc completion** (done, but off-plan). Automaticity is modelled from enactment, not raw completions. | Plan enactment is *the* predictor |
| H-R4 | Each habit shows an **automaticity curve** with an honest band: "most people reach automatic around 2 months; it ranges from a few weeks to most of a year." No countdown to a fake finish line. | Median 59, range 4–335 |
| H-R5 | The automaticity estimate is **per habit**, and heavier behaviours (gym, study block) are modelled as slower than light ones (water, vitamin). | Behaviour-specificity is the PNAS headline |
| H-R6 | If the user's context changes (the cue routine stops happening, or the location changes), the app **flags the cue, not the person**: "your 7am cue hasn't fired in 9 days — want a different cue?" | Context stability determines habit strength |
| H-R7 | Enjoyment is a first-class field. A habit rated unpleasant three weeks running triggers a redesign prompt, not more nagging. | Enjoyment is a listed determinant |
| H-R8 | Streaks exist but are **secondary**, breakable without loss of history, and repairable (one freeze per week). The headline number is *automaticity*, not streak length. | Streak is a proxy the literature does not use; automaticity is the construct |

### 24.3 English — vocabulary and retention

**What the literature actually says.**

| Finding | Source |
|---|---|
| Spaced practice has a **medium-to-large** effect on L2 learning (98 effect sizes, 48 experiments, N = 3,411). Shorter spacing equals longer spacing on immediate tests, but **longer spacing wins on delayed tests** | *Language Learning* meta-analysis of spaced practice in L2 |
| **Equal and expanding schedules were statistically equivalent** | same, and Latimier et al. |
| Spaced retrieval practice beat massed retrieval strongly (**g = 0.74**); expanding vs uniform difference was negligible (g = 0.034), with expanding gaining an edge only when the item is tested many times | Latimier et al., *Educational Psychology Review*, 2021 |
| In an actual web app, **optimal spacing + corrective feedback + testing together improved learning by 29 percentage points** over massed practice with no corrective feedback. Spacing and feedback were the significant main effects | Frontiers/PMC 2021 web-application study |
| Technology-assisted L2 vocabulary learning: **d = 0.64**, and **mobile beat desktop** | *CALL* meta-analysis, 2021 |
| Mobile-app vocabulary learning over treatments of **≥ 10 weeks**: large pooled effect (**≈ 1.28**, Bayesian meta-analysis of 65 studies, 2010–2024) | *ReCALL* meta-analysis |

**Design rules adopted.**

| ID | Rule | Because |
|---|---|---|
| E-R1 | The word bank uses a **simple fixed/equal interval ladder** (e.g. 1 · 3 · 7 · 16 · 35 · 90 days) rather than a bespoke expanding algorithm. Do not spend engineering weeks on SM-2 tuning in V1. | Equal ≈ expanding; the gain is in *spacing at all* |
| E-R2 | **Retrieval, not recognition.** Every review is a production or recall attempt before the answer is shown. | Retrieval practice is half the g = 0.74 |
| E-R3 | **Corrective feedback is mandatory and immediate** on every item — show what was wrong and the right form, not just a red cross. This is the single highest-leverage requirement in the chapter. | Feedback × testing interaction; +29pp |
| E-R4 | Intervals lengthen toward durability rather than optimising tomorrow's quiz score. The UI states the goal is remembering in a month, not today. | Longer spacing wins on delayed tests |
| E-R5 | Progress is judged on a **10-week horizon**; the AEI trend view defaults to 10 weeks. | The large mobile effects appear at ≥10 weeks |
| E-R6 | Daily dose is **small and capped** (default 8 items, hard cap 25) to protect adherence. | Adherence is the failure mode; spacing beats volume |

### 24.4 English — speaking, shadowing, and the AEI

**What the literature actually says — including an inconvenient result.**

| Finding | Source |
|---|---|
| A 42-day daily shadowing programme improved learners' **perception** of segments and prosody significantly *without explicit instruction* — but **production did not significantly improve in the self-learning condition** | Kunihara et al., Interspeech 2022 |
| Learners struggled to reproduce a model-like pitch pattern **from text alone**; audio input mattered | same |
| Shadowing practice with structured comparison improves fluency and pronunciation accuracy in classroom studies | EFL shadowing studies, 2020–2025 |
| Automated speech scoring correlates strongly with human/standardised measures when it combines several features (pronunciation goodness, word recognition rate, silence ratio, alignment likelihood) rather than a single score; open-source scoring correlates moderately with commercial scoring | automated speech scoring literature, incl. 2022 comparison study |

**Design rules adopted.**

| ID | Rule | Because |
|---|---|---|
| S-R1 | **Shadowing without feedback is not a feature.** Every shadowing drill ends with an explicit **model-vs-you comparison**: aligned A/B playback, a per-word timing/stress diff, and one named target for next time. | Self-directed shadowing improved perception but *not* production — feedback is the missing ingredient |
| S-R2 | Drills always provide **audio**, never text-only, when prosody is the target. | Learners could not produce model pitch from text alone |
| S-R3 | The AEI is **multi-feature** (pronunciation goodness, fluency/pause profile, lexical range, grammatical accuracy, task completion) and never a single opaque number derived from one signal. | Multi-feature scoring is what correlates with human raters |
| S-R4 | The AEI is presented as an **estimate with a confidence band and a CEFR band**, explicitly not a certification, in both UI and legal copy. | Honest limits of automated scoring; see Legal Pack L8 |
| S-R5 | The 42-day framing is used for the "Marathon" programme structure: **6 weeks, daily short sessions, four passages a day** — because that is the dose the study actually ran. | Direct transfer of a tested protocol |
| S-R6 | Perception drills (minimal pairs, prosody discrimination) are **first-class**, not warm-ups, since that is where the reliable self-study gain was found. | Perception improved without instruction; harvest the easy win |

### 24.5 Cross-cutting behaviour-change rules

| ID | Rule | Grounding |
|---|---|---|
| X-R1 | Self-monitoring is the mechanism the whole product rests on, so **capture must be near-frictionless** — every domain reachable in ≤2 taps from Today. Friction, not motivation, is the binding constraint. | Adherence collapse is the common failure across all the null results above |
| X-R2 | **Implementation-intention scaffolding** is offered in habits, goals, and English ("when X, I will Y"), because if-then plans are the most consistently supported technique in the set. | Habit literature |
| X-R3 | Effects are **small and delayed**. Every insight surface must therefore show *trend over weeks*, and no surface may show a day-over-day mood claim. | Delayed-effect findings in §24.1 |
| X-R4 | Every research-derived number in the product (59 days, 10 weeks, 1–3 day interval) is stored in **one config module** with a citation string, so copy and logic cannot drift apart. | Traceability |

### 24.6 Features where no research claim is available — and how they are justified instead

The founder's point stands: you cannot cite a study for a contacts list. These features are justified by **job-to-be-done, craft quality, and heuristic evaluation**, and our docs say so plainly.

| Feature | Justification basis | What "good" means here |
|---|---|---|
| People / contacts | Job-to-be-done: money, events and documents are *about people*; without person entities the graph is a pile of strings | Zero duplicate-person confusion; linking never requires a full address-book upload |
| Family vault & documents | Job-to-be-done: document panic is a real, dateable event (expiry, renewal, emergency) | Retrieval in under 10 seconds, offline, and expiry never surprises you |
| Calendar sync | Utility + platform convention | Two-way sync with no duplicate events, ever |
| Lend & borrow ledger | Job-to-be-done: informal debt in India is socially awkward and badly tracked | Net position per person is always correct and reconciles |
| Sports | Interest/retention feature; no efficacy claim | Fast, accurate, never a notification you didn't ask for |
| Depth / Human Momentum | Brand and emotional design; **explicitly not a clinical construct** | Legible in one glance, never punitive |
| Life Score | Composite index of the user's own inputs; not a validated psychometric | Fully explainable — every point traceable to a source |
| Documents OS / file viewing | Platform utility | Opens what it says it opens |
| Notifications | Design discipline, not efficacy research | Fewer than 3/day by default, each one earning its interruption |

**Rule E-03.** For every feature in this table, marketing copy describes *what it does for you*, never *what it does to your outcomes*.

---


## 25. Journal — Android flagship specification

> Journal is a flagship on the Android app, not a port of the web studio. Web (`09_FEATURES/Journal/Journal.md`, craft B1) is an editorial *writing room* built for a keyboard and a wide canvas. Android is a **thumb-first reflection surface** built for two minutes in bed with one hand. Same data, same table, different product.

### 25.1 What it is for

One job: **get the thought out of your head and into your life record, with the least possible resistance, and let it come back to you later when it is useful.**

Three failure modes it must design against, all observed in the literature (§24.1): the blank page, the daily-streak guilt spiral, and writing that disappears into a void and never returns.

### 25.2 Modes

Modes are presented as a single row of chips in the capture bar. Free Write is the default and always one tap away; nobody is forced through a mode picker.

| Mode | Shape | Target dose | Research anchor |
|---|---|---|---|
| **Free Write** (default) | Blank, one prompt shown faintly, dismissible | Any length | Baseline expressive writing |
| **Reflect** (acceptance-framed) | 3 sequential prompts: what happened · what it brought up · what it would look like to let that be here | 5–8 min | J-R4 — acceptance framing beat classic instructions |
| **CBT Record** | Situation → automatic thought → evidence for/against → balanced thought → feeling before/after (0–10) | 6–10 min | Structured/specific topic → larger effects |
| **Morning Pages** | Timer-led, no editing, no word count shown | 10 min or 3 screens | Engagement-by-volume (J-R2) |
| **Weekly Review** | Pulls the week's Life Graph facts in as read-only context, then asks 4 questions | 10–15 min | Specificity from own data (J-R5) |
| **Gratitude / Three Good Things** | Three short fields, ships with a hard 3-item cap | 2 min | Lowest-friction entry point for hard days |
| **Voice note** | Hold-to-talk, on-device transcription, transcript is the entry, audio discarded after transcription unless kept | 1–3 min | Removes the blank-page barrier entirely |

### 25.3 The Android capture flow (the thing that must be perfect)

```
Today ──[FAB long-press]──▶ Journal sheet opens at 45% height, cursor already in the field,
                            keyboard already up, mode = last used
        ──[swipe up]──────▶ full screen writing
        ──[swipe down]────▶ collapses; draft saved, nothing lost, no dialog
```

Non-negotiables:

1. **Zero-tap-to-typing.** Opening the sheet places the cursor and raises the keyboard. No title field. No mode gate. No date picker (defaults to today, editable in the header).
2. **Local-first save.** Every keystroke persists to the on-device database on a 400 ms debounce. Sync is a background concern. The word "draft" never appears — it is simply saved.
3. **Backdating** is a single tap on the date in the header, with a 7-day quick strip plus a calendar for older.
4. **Never lose text.** Process death, low memory, call interruption, battery kill — recovery on next open shows the text exactly as it was, with a one-line "recovered" note.
5. **Save happens before AI.** Any AI action operates on already-persisted text (Blueprint §11 rule; Legal Pack L8 rule 1).
6. **No streak UI anywhere in Journal.** Session count and median length only (J-R2).
7. **Optional 1-tap "how does that feel now?"** on save — a 5-point face row, skippable, feeding the within-session signal from J-R8. This is the *only* rating in the whole feature.

### 25.4 Prompt engine

Prompts are the difference between a text box and a journal. The engine is deterministic and local; AI is not required to produce a prompt.

**Selection order:**

1. **Graph-grounded** (highest priority) — built from a fact in the user's own data: a broken habit cue, a heavy spend day, a missed goal milestone, a person not seen in a long time, a hard discipline day. Specificity is the moderator (J-R5).
2. **Acceptance-framed** rotation — a curated bank, phrased per J-R4.
3. **Mode-native** — CBT and Weekly Review carry their own fixed structures.
4. **Neutral fallback** — five evergreen prompts, so the engine never shows nothing.

Prompts are **always dismissible in one tap**, never mandatory, and never repeat within 21 days. If the user dismisses three prompts of a category in a row, that category is suppressed for 30 days.

**Cadence.** The invitation targets **every 2 days** (J-R1) and is delivered at the user's chosen reflection time. If the user writes daily, nothing changes and nothing is praised for the daily-ness. If they write twice a week, the app treats that as success, because the evidence does.

### 25.5 Return — the half of journaling that products always skip

Writing that never comes back is a diary, not a system. Android gets four return surfaces:

| Surface | Behaviour |
|---|---|
| **On this day** | A quiet card on Today when an entry exists from 1 month / 6 months / 1 year ago. Tap to read. Dismiss forever per anniversary. |
| **Thread** | Entries the graph links to the same person, goal, or theme, readable as a sequence. Shows *change over time*, which is the payoff of the delayed effect (J-R6). |
| **Reflection digest** | Every 2–4 weeks: session count, median length, the themes that recurred, and one honest observation. Explicitly framed on a multi-week horizon. Never a mood score. |
| **Search** | Full-text over your own entries, on device, with an opt-out that removes journal from global search results. |

### 25.6 Privacy contract (stricter than the rest of the app)

| Guarantee | Implementation |
|---|---|
| Journal content is never sent to analytics or crash reporting | Field-level deny-list in the telemetry layer, plus a test that fails the build if journal text can reach the analytics adapter |
| No AI touches an entry unless the user presses AI on that entry | Per-entry action only; no batch, no background job, no "analyse my journal" |
| Journal is never quoted in a notification | Notification builder receives entry *metadata* only, never body text |
| Encrypted at rest, column-level | Beyond database-level encryption |
| Vault lock covers Journal optionally | Biometric/PIN gate, auto-relock on background |
| Excluded from Family sharing, permanently | No share affordance exists to build later |
| Export includes journal in full | Never a hostage |

This is written into Legal Pack L1 §6 and must stay consistent with it.

### 25.7 Offline, sync, and conflict

Journal is **offline-complete**: create, edit, read, search, and delete all work with no network. Sync is last-write-wins per entry at field level, except the body, where a conflict creates a **second entry** appended with a "conflicted copy" marker rather than silently discarding a version. Losing writing is the one unacceptable outcome.

### 25.8 Tier placement (see §26)

| Capability | Explore | Core | Pro | Elite |
|---|---|---|---|---|
| Free Write, Gratitude, unlimited entries, backdating, export | ✓ | ✓ | ✓ | ✓ |
| Reflect / CBT / Morning Pages / Weekly Review modes | 1 mode | all | all | all |
| Graph-grounded prompts | generic only | ✓ | ✓ | ✓ |
| Voice journal with on-device transcription | 3 / month | ✓ | ✓ | ✓ |
| On this day + Thread | On this day | ✓ | ✓ | ✓ |
| AI per-entry actions (tag, summarise, reframe) | — | ✓ (quota) | ✓ | ✓ |
| Reflection digest | — | monthly | fortnightly | fortnightly + theme correlations |
| Journal in Vault lock | — | ✓ | ✓ | ✓ |

**Never gated at any tier:** writing, saving, reading your own history, searching it, exporting it, deleting it. Charging for access to your own words is a line we do not cross.

### 25.9 Metrics that judge this feature

| Metric | Target | Note |
|---|---|---|
| Time from FAB long-press to first keystroke | < 400 ms | The whole feature lives or dies here |
| Entries per active journaller per week | ≥ 2.5 | Matches the 1–3 day interval target |
| Median entry length | ≥ 90 words, trending up | Engagement is the moderator |
| Prompt dismissal rate | < 55% | Above that, the prompt bank is bad |
| Return-surface engagement (On this day / Thread opens) | ≥ 20% of journallers weekly | Proves return works |
| Text-loss incidents | **0** | Any occurrence is a P0 |

### 25.10 Vault obligation

Shipping this updates `09_FEATURES/Journal/Journal.md` (add Android surface + mode table + prompt engine), appends `09_FEATURES/Journal/Changelog.md`, and patches `_manifest.json` `entities.journal` when contracts change.

---


## 26. Android tier architecture and user categories

### 26.1 Principle

Web tiering gates **surfaces** (which pages open). That is fine on a browser, where the user has room to explore. On Android that model is weak — it makes free users feel walled out and paying users feel they bought a menu.

Android tiering gates **capability, automation, and depth** instead. The ladder answers one question at each step: *what does the app now do for me that I previously had to do myself?*

| Tier | The one-sentence promise on Android |
|---|---|
| **Explore** | "You can capture your whole life here, free, forever." |
| **Core** | "It starts keeping score for you." |
| **Pro** | "It starts doing the work for you." |
| **Elite** | "It starts telling you things you didn't know." |

Prices are unchanged from `15_MEMORY/Business-Rules.md`: Explore free · Core ₹29 · Pro ₹59 (founding ₹49) · Elite ₹99 (founding ₹79). Entitlement is always resolved **server-side**; the client never decides its own tier.

### 26.2 The four ladder rungs, in detail

**Explore — capture is never paywalled**

Today · Depth · full capture in every domain · unlimited journal entries · notes · calendar (AIIMIN-only events) · manual money entry · 1 English drill/day · 7-day history · export · delete. One widget. No AI automation. Manual everything.

*Why generous:* a life OS with a crippled capture tier has no data, and with no data it can prove nothing. Explore exists to make the graph real.

**Core — the app keeps score (₹29)**

Everything in Explore, plus: habits with the cue/automaticity engine (§24.2) · goals · budgets and money categories · focus timer · Health Connect daily sync (steps, distance, sleep) · screen-time daily total · Life Score with full explainability · 90-day history · weekly insight · journal modes and per-entry AI (quota) · 3 widgets · Vault lock · 10 AI units/month.

**Pro — the app does the work (₹59 / ₹49 founding)**

Everything in Core, plus: **two-way Google Calendar sync** · **document vault with OCR, expiry tracking and reminders** · **payment-capture automation** (share-to-AIIMIN, statement import, and the opt-in notification reader — §27) · **people linking and net position per person** · family (2 seats) · correlations and patterns · PDF Life OS Review · unlimited history · unlimited widgets · full shadowing lab with model-vs-you comparison (§24.4) · offline document access · 25 AI units/month.

*Why this is the recommended rung:* every item is a chore removed, and the automation cluster is what a daily user will actually pay for.

**Elite — the app tells you things (₹99 / ₹79 founding)**

Everything in Pro, plus: interactive Intelligence web (cross-domain graph exploration) · 3 deep reports/month · bulk statement/history import · household seats (up to 5) · priority AI routing and higher context · AEI deep diagnostics with phoneme-level breakdown · early access to new capability · 40 AI units/month.

### 26.3 Aggressive — but honest — merchandising rules

"Aggressive" must not mean hostile. Six rules:

| ID | Rule |
|---|---|
| T-R1 | **Show, don't hide.** Locked capability is visible with a real preview of the user's own data, blurred at the value line — never an empty page or a grey box. A user must be able to see what they are missing. |
| T-R2 | **Contextual, single upgrade point.** The upsell appears at the exact moment of need (tapping "sync my Google Calendar"), as a bottom sheet naming *that* capability first, price second. Never an interstitial on launch. Never more than one upsell per session. |
| T-R3 | **Honest quota meters.** AI units are shown as a visible counter with a plain explanation of what consumes one. No silent throttling, ever. |
| T-R4 | **Downgrade is safe.** Losing a tier never deletes data. Paid features become read-only; export stays available at every tier. This is stated *before* purchase, which is exactly why people purchase. |
| T-R5 | **No dark patterns.** Cancel is as easy as subscribe (Legal Pack L7). No fake scarcity, no countdown timers, no pre-ticked upgrades, no "are you sure you want to miss out" guilt screen. |
| T-R6 | **Never gate safety or ownership.** Data export, deletion, security settings, privacy controls, and reading your own history are free at every tier, forever. |

### 26.4 User categories — how a new user picks their AIIMIN

The product is broad. Breadth is the founder's intent and also the clutter risk. The resolution is not fewer features — it is **fewer features visible on day one**, chosen by the user.

During onboarding (Blueprint §7) the user picks **1–2 categories** from six. Each category is a **starter kit**: which surfaces are pinned to the nav, which widgets are proposed, which prompts and drills are prioritised, and what the first-week plan looks like. Nothing is deleted — everything else lives in "More" and can be pinned any time.

| Category | Who | Pinned surfaces | First-week plan | Natural tier |
|---|---|---|---|---|
| **The Student** | Exams, semesters, tight money | Today · Focus · English · Journal | 2 focus blocks/day, 8 word-bank items, weekly review | Core |
| **The Builder** | Founder/freelancer, income is lumpy | Today · Goals · Money · Focus | Goal with milestones, weekly money reconcile, deep-work streaks | Pro |
| **The Professional** | 9-to-5, calendar-driven, wants their evenings back | Today · Calendar · Habits · Screen time | Calendar sync, 2 habits with cues, screen-time baseline | Pro |
| **The Rebuilder** | Discipline, urges, getting out of a hole | Today · Discipline · Journal · Habits | Urge log, daily 2-minute Reflect, one keystone habit | Core |
| **The Family Anchor** | Holds the household's paperwork and dates | Today · Family · Documents · Calendar | Vault set-up, 5 documents with expiries, shared dates | Pro |
| **The Speaker** | English fluency and accent are the goal | Today · English · Journal | AEI placement, 6-week Marathon, daily perception drill | Core → Elite |

**Rules.** Selection is reversible from Settings at any time, with no data consequence. Maximum two categories, because three is the same as none. The category never restricts access — it only sets defaults. After 30 days, if actual usage disagrees with the chosen category, the app offers to re-tune the nav once, and then stops asking.

### 26.5 Anti-clutter contract

The founder's hardest constraint: many features, no clutter. Seven enforceable rules.

| ID | Rule |
|---|---|
| C-R1 | **Five nav items maximum**, ever. Today · one category surface · FAB · one category surface · More. |
| C-R2 | **Today shows at most 6 cards.** Cards are earned by relevance, not by feature existence. A feature with nothing to say today shows nothing. |
| C-R3 | **One primary action per screen.** If a screen has two equally weighted primary buttons, the screen is wrong. |
| C-R4 | **Progressive disclosure by default:** every feature has a simple mode that works with zero configuration, and depth behind an explicit "more" affordance. |
| C-R5 | **Empty means empty.** An unused feature renders a single quiet line, not a marketing card. |
| C-R6 | **Feature budget:** adding a card to Today requires removing or demoting one. Enforced in review. |
| C-R7 | **The category system is the clutter valve.** A Student never sees Family cards on Today until they ask for them. |

---


## 27. Store and permission compliance — amendments to §8.6 and §12

> **This chapter overrides earlier drafting.** Blueprint §8.6.2 assumed reading UPI **SMS** on Android. Google Play policy does not permit that for AIIMIN. Detail and rationale live in `Roadmap/Legal-Pack-V1.md` §11; the product consequences are recorded here.

### 27.1 SMS is not available — and it does not need to be

Google Play grants the SMS permission group only to apps **actively registered as the device's default SMS or Assistant handler**, and explicitly prohibits obtaining the same data by alternative means. AIIMIN will not become a default SMS app. Therefore:

**AIIMIN V1 declares no SMS permission and no call-log permission.** No marketing may say "reads your SMS".

**Replacement design, in shipping order:**

| Wave | Path | User experience | Permission cost |
|---|---|---|---|
| **1 (V1)** | **Share-to-AIIMIN** | Share any payment confirmation from any app into AIIMIN; it parses and shows a draft to confirm | None |
| **1 (V1)** | **Statement import** | Upload a bank CSV/PDF; confirm queue; one-tap undo of the whole batch | None |
| **2 (V1, opt-in)** | **Notification reader** (`NotificationListenerService`) | Payment alerts from a curated bank/UPI template list are matched **on device**; only the draft you approve is stored; raw text never leaves the device | Special access, off by default, prominent disclosure required, independently revocable |
| **3 (V1.1)** | **RBI Account Aggregator** | Regulated, consent-artefact-based bank data through a licensed AA | Requires an FIU relationship — the correct long-term answer for India |

The user-visible promise changes from "we read your messages" to something better: **"forward it, or upload the statement, and it becomes a confirmed record."**

### 27.2 Permissions AIIMIN requests, and the ones it refuses

| Permission | Status | Feature | Disclosure |
|---|---|---|---|
| `POST_NOTIFICATIONS` | runtime | Reminders | Standard rationale |
| `CAMERA` | runtime | Document/receipt scan | Rationale at first scan |
| `RECORD_AUDIO` | runtime | Practice sessions | Rationale + "audio stays on device" |
| `READ_MEDIA_IMAGES` / picker | runtime | Attach a photo | Prefer the photo picker over broad access |
| Health Connect read: steps, distance, active minutes, sleep | Health Connect grant | Health day | Health apps declaration form + policy naming |
| `PACKAGE_USAGE_STATS` | special access via settings | Screen time | In-app explanation before the settings hand-off; daily totals only |
| `NotificationListenerService` | special access via settings | Payment capture (opt-in) | Full disclosure sheet; off by default |
| Google Calendar / Tasks / Drive / People | OAuth | Sync features | Limited Use; per-scope explanation |
| **Location** | **refused** | — | Not requested at any precision |
| **SMS / call log** | **refused** | — | Policy-prohibited for this app class |
| **Accessibility service, device admin, bulk contact read** | **refused** | — | Never |
| Background health read, 30-day health history | **not in V1** | — | Foreground daily sync is sufficient |

### 27.3 Mandatory disclosure pattern

Every special-access permission uses the sheet in Legal Pack L11.6: exactly what is read, exactly what is not read, where it is stored and for how long, how to turn it off, and two equally prominent buttons where "Not now" is never a dead end. Denial must always leave a working manual path — this is the difference between a product and a hostage situation.

### 27.4 Play submission gates (blocking for launch)

Data safety form matching Legal Pack §10 · Health apps declaration form · account-deletion URL (`/data-deletion`) in the listing · target API level current for the August 2026 requirement · prominent-disclosure screen recordings for each special-access permission · privacy policy URL live and naming Health Connect explicitly.

### 27.5 Consequential edits

`§8.6.2` payment capture — replaced by §27.1 · `§12.2` permission table — replaced by §27.2 · `§22 OD-10` age gate — **closed at 18** (DPDP requires verifiable parental consent below 18) · `§22 OD-11` legal entity — now blocking, tracked in Legal Pack §0.2 · new open decision **OD-17**: whether to pursue an FIU/Account Aggregator relationship for V1.1, and with which AA.

---


## 28. Design reference and inspiration sources

### 28.1 Why this chapter exists

Blueprint §4–§6 were written with the Mobbin MCP unavailable (paid tier). This chapter replaces that dependency permanently: a named set of sources, a method for using them, and the actual visual direction decisions taken from them.

### 28.2 Reference sources (Mobbin replacements)

| Source | What it is good for | Cost | How we use it |
|---|---|---|---|
| **Refcat** (`refcat.app`) | Real app flows searchable **by intent** — onboarding, paywall, settings — with Figma export | Free tier: top 10 trending flows/week + 5 exports; Pro ≈ $2/mo | **Primary Mobbin replacement.** Search by intent before designing any flow |
| **UIguana** (`uiguana.com`) | 7,700+ screens across 126 flows, grouped by journey, fully free | Free | Journey-level reference; good for capture and onboarding sequences |
| **Banani references** (`banani.co/references/apps`) | Screens from Duolingo, Things 3, Calm, Perplexity, Reddit, Substack etc., no sign-up | Free | Pattern reference for the apps closest to AIIMIN's domains |
| **Material 3 Expressive guidelines + Compose docs** | The authoritative Android target: components, motion physics, type scale, shape scale | Free | **Normative for the native app**, not merely inspirational |
| **Android Large Screen / adaptive guidance** | Foldables and tablets | Free | Track D device tier |
| **Mobbin** | Best breadth, if a seat is ever bought | Paid | Optional; re-run the searches listed in §28.5 if purchased |

**Method.** Search by *intent*, not by app name. Collect 3–5 references per flow. Extract the **structural decision** (where the primary action sits, how many steps, what is deferred) — never the visual skin. Map every borrowed structure onto the locked palette and Genesis interaction law. Record the decision in the vault; do not keep a scrapbook of screenshots.

### 28.3 Visual direction decisions

The four GPT-generated concept boards the founder supplied (light clean / light playful / dark focus / dark soft-neutral) are useful as a **decision forcing function**. Assessment:

| Board | Verdict |
|---|---|
| 1 — Light, clean & focused | **Adopt as the light theme base.** Correct information density, clear grouping, right hierarchy |
| 2 — Light, playful & illustrative | **Reject.** Stock illustrations are exactly the generic-AI-product look the design rules forbid, and they age badly |
| 3 — Dark, focus & flow with blue accents | **Reject the blue.** The accent is locked to `#ff6b35`. Keep its calm card rhythm |
| 4 — Dark, soft & neutral | **Adopt as the dark theme base.** This directly answers the "dark mode hurts my eyes" feedback — warm neutrals, softer contrast, no pure black, no pure white text |

Concrete adoptions from those boards, now normative for §4:

1. **Sectioned settings with muted uppercase group labels** (ACCOUNT · PREFERENCES · DATA & SYNC · SUPPORT) and a value preview on the right of each row. This is the settings pattern.
2. **Profile card at the top of Settings**, avatar + name + email, tappable to the profile.
3. **Today = greeting + one hero metric + plan list + two stat tiles + quick actions + recent activity.** That is six blocks — exactly the C-R2 budget.
4. **Bottom nav of 4 + centre FAB.** Matches C-R1.
5. **Warm neutral dark**, not blue-black: background near `#1a1a1a`, cards `#2d2d2d`, primary text off-white rather than `#ffffff`.

### 28.4 Modern-not-dated checklist (Material 3 Expressive derived)

M3 Expressive is Google's current direction and is research-backed by their own studies on hierarchy and glanceability. What we take:

| Element | Decision |
|---|---|
| **Motion** | Physics-based **spring** tokens, not fixed-duration easing, for spatial transitions; short duration tokens for opacity/colour effects |
| **Typography** | Use the **emphasised** type styles — larger, heavier headlines — to build hierarchy, so we can drop decorative chrome |
| **Shape** | A shape *scale* (not one radius everywhere); shape-morph on state change for the FAB and primary controls |
| **Components** | Adopt button groups, split buttons, FAB menu, and toolbars where they replace bespoke widgets |
| **Haptics** | Paired with dismissal, completion, and threshold crossings — never decorative |
| **Containment** | Group with containers and blur/depth rather than with borders everywhere |
| **What we refuse** | Neon gradients, glassmorphism everywhere, purple-and-cream AI-startup palette, stock illustrations, and dense data walls |

**Dated signals to avoid** (audit list for review): hamburger menu as primary navigation · tab bars with 5+ items and tiny labels · drop shadows on everything · centred 1990s-style dialogs · full-screen loading spinners · text-only tables on mobile · pure `#000000` dark mode with pure `#ffffff` text · fixed-duration linear animations.

### 28.5 If a Mobbin seat is purchased, run exactly these

`search_flows`: onboarding permission education (ios/android) · subscription paywall with tiers · finance transaction confirmation queue · journaling daily entry · habit creation with reminder · document scan and save · language-learning speaking drill · account deletion.
`search_screens`: settings index sectioned · empty state productivity · today dashboard single metric hero · bottom-sheet quick capture · streak and progress display.
`search_sections`: pricing four tiers · trust and privacy section · FAQ.

### 28.6 Prototype artifact

The interactive reference implementation of §4, §5, §7, §25 and §26 is now `frontend/prototypes/AIIMIN-Drafting-Table.html` (locked 2026-08). The older `frontend/prototypes/personal-os/` HTML shells were deleted 2026-08-14; see `docs/knowledge/16_DOCUMENTATION/Completed-Work-Ledger.md`. When the prototype and this document disagree, this document wins.

---

*End of Blueprint v1.0 + Amendment A (2026-07-31). This document is living: append changes with dates; do not silently rewrite decisions. It expresses Genesis and cannot amend it.*

