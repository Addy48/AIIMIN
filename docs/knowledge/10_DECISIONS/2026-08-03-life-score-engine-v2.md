---
authority: operations
derived_from: Genesis · 10_DECISIONS/2026-08-03-life-score-options
status: accepted
owner: founder
lifecycle: decision
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-DECISION
graph_role: hub
note_type: NT-DECISION
tags:
  - type/decision
  - domain/product
  - status/accepted
---

# Life Score engine v2 — the full instrument

> **DECIDED 2026-08-03.** Founder chose **O12 + O8 + O2 + O6 + O7 + O9** from
> [[10_DECISIONS/2026-08-03-life-score-options]]. This note is the build
> contract: the maths, the schema, the failure modes, and the app changes it
> forces. Supersedes the fixed five-dimension formula in
> `server/services/lifeHealthEngine.js`.

## 0. The two problems that had to be solved first

The founder rejected two things by name. Both are load-bearing, so they are
solved here before any of the maths.

### 0.1 The cliff — "12,990 steps is not a failure"

> *"everyday I walk 13k steps so on my streak marker it gets marked, but if I
> walk 12.99k steps it's not marked and told as a failure."*

A binary threshold on a continuous quantity destroys information and lies about
effort. 12,990 and 13,000 differ by 0.08%. Any system that scores them
differently is broken.

**Fix: nothing in this engine is binary.** Every commitment resolves to a
continuous **attainment** `a ∈ [0, 1.1]`:

```
soft floor  F = 0.4 · T          (below this, the day genuinely didn't happen)
raw         u = (x − F) / (T − F)
attainment  a = easeOut(clamp(u, 0, 1))             # 1 − (1 − u)²
overshoot   a += min(0.10, 0.10 · (x − T)/T)   when x > T
```

- 12,990 / 13,000 → `a = 0.9997`. **Visually and numerically identical to a hit.**
- 9,000 / 13,000 → `a = 0.74`. Not a failure. A three-quarter day.
- 3,000 / 13,000 → `a = 0`. The floor exists so the scale means something.
- 18,000 / 13,000 → `a = 1.10`. Overshoot counts, but is capped so one heroic
  day can't buy a week.

**Ease-out, not a symmetric S-curve.** A smoothstep was tried first and rejected
in test: it is flat at *both* ends, so it compressed the low end too and scored
9,000 of 13,000 steps at 0.48. Two thirds of the work is not half a day. The
ease-out is flat near the target — small misses cost almost nothing, which is
exactly the complaint — and steep down low, so *starting* to do the thing is
worth the most, which is where effort is hardest to produce.

### 0.2 The collapse — "10 days clean, one slip, 'you failed'"

> *"I didn't masturbate for 10 days, but 1 day I did, so the streak breaks and
> the system says u failed."*

A streak counter is a **fragile state variable**: one event annihilates all
accumulated evidence. That is factually wrong (ten days of evidence still
exists) and psychologically the exact mechanism the SDT literature identifies as
guilt-driven — introjected regulation, which predicts short-term compliance and
long-term abandonment.

**Fix: three separate numbers, none of them fragile.**

| Number | What it is | What a slip does to it |
|---|---|---|
| **Hold** (headline) | EWMA of attainment with **asymmetric memory** — falling `α = 2/15` (14-day half-life), returning `α = 0.30` | 1.00 → **0.87**. Drops proportionally, keeps the memory of ten good days |
| **Rate** (for abstinence commitments) | incidents per 30 days, trending | 0/30 → 1/30. Still an excellent rate, and it *says so* |
| **Best run** | longest run ever | **never resets.** A record is a record. It does not vanish because a new run started |

Current run is still counted — it is a fact — but it is **never the headline**
and never carries a verdict. And because Hold has memory, the app can show the
one thing a streak counter never can: **the way back**.

> `HOLD 0.87 · two days at your usual returns you to 0.93`

That is competence support instead of shame, and it is computable exactly:
`days = ceil( ln((1−H_target)/(1−H_now)) / ln(1−α_return) )` for a return to `a = 1`.

**The memory is asymmetric on purpose: slow to fall, quick to return.** A
symmetric average punished one slip for a week, which is a streak wearing better
clothes. Falling keeps the fourteen-day half-life so a bad day costs little;
returning runs at `α = 0.30` so two or three ordinary days visibly bring it back.
This is the mix the founder asked for, and it is pinned by `HoldTest`.

**Language rule, absolute:** the engine emits facts and deltas. The strings
"failed", "missed", "broken" do not exist in the score surface. `12,990 · floor
13,000 · 99.9%` is the whole message.

### 0.3 The identity problem — archetypes are dead

> *"a student may not do all students thing, he may manage a startup, go to gym…
> this won't work"*

Correct, and the archetype list in the earlier note is hereby **withdrawn**. A
person is not a category. A label is lossy in exactly the cases that matter
(the student who runs a startup and lifts), and being told the wrong label in
your first session is a reason to delete an app.

**Replacement: model the load and the commitments, never the person.**

The onboarding AI outputs no label. It outputs two structures:

```jsonc
"load": {                    // how the days are actually shaped — a vector, not a class
  "seated_hours": 10,        // → step floor, break floor
  "screen_hours": 12,        // → eye/sleep-onset floor
  "training_days_per_week": 3,// → recovery floor
  "caregiving_hours": 0,      // → own-time floor
  "travel": "low",
  "sleep_window": { "start": "01:30", "end": "08:00" }
},
"commitments": [ /* pursuits and floors, each attached to an instrument */ ]
```

**Floors are derived mechanically from the load vector**, not from a category:

| Load fact | Floor it generates | Why (shown to the user) |
|---|---|---|
| seated ≥ 8 h/day | steps ≥ 5,000 · break every 90 min | sedentary work day |
| screen ≥ 10 h | screen off 45 min before sleep window | sleep onset |
| training ≥ 3 days/wk | ≥ 1 full rest day, sleep ≥ 7 h | recovery debt |
| caregiving ≥ 4 h | ≥ 30 min own time | carer burnout |
| sleep window < 6.5 h | sleep ≥ 6.5 h | non-negotiable physiology |

A person who is a student **and** a founder **and** a lifter simply has three
commitment clusters and a load vector that reflects all three. There is nothing
to be wrong about. Life modes (BUILD · RECOVER · EXAM · TRAVEL) carry the
*temporal* shifts on top.

### 0.4 Floors vs pursuits, finally stated

| | Pursuit | Floor |
|---|---|---|
| Origin | you chose it | derived from body facts / load / ledger, then confirmed by you |
| Example | "one deep-work block", "walk 13k" | "≥ 5,000 steps", "≥ 6.5 h sleep", "don't breach budget" |
| Scored? | **yes** — contributes attainment to its instrument | **no** |
| On breach | lowers attainment, proportionally | raises **one quiet warning**, and lowers *nothing* |
| Can be removed? | yes, freely | yes, but it asks once why |

**A floor never touches the score.** This is what stops the OS from punishing a
person for having a body. A coder who walks 3,000 steps sees one line —
`3,100 · floor 5,000` — and his Life Score is untouched, because he never
promised to walk.

## 1. Architecture — five layers

```
L0  SIGNALS        raw daily facts from the graph, each with a coverage flag
L1  NORMALISE      commitments → attainment (§0.1) · free signals → robust z vs
                   personal 28-day baseline, shrunk toward a prior when young
L2  INSTRUMENTS    8 canonical; each user runs 4–6; server computes all it can
L3  COMPOSE        base weights ⊙ mode multipliers → after 60 days, blended with
                   weights learned from the user's own correlations
L4  PUBLISH        STATE (today, 0–100) · TRAJECTORY (28-day slope ± SE) ·
                   CONFIDENCE (coverage, never a penalty) · ATTRIBUTION
```

### L0 · Signals

```
Signal { key, day, value, direction: HIGHER|LOWER|BAND, source, observed: Bool }
```
Missing is `observed = false`, never `value = 0`. This one rule removes the
"not logging looks like failing" failure.

### L1 · Normalisation

**Commitment signals** → attainment, §0.1.

**Free signals** (mood, sleep duration, HRV later) → robust personal z:
```
z = (x − median₂₈) / (1.4826 · MAD₂₈)        clipped to ±3
s = 50 + 50 · tanh(z / 2)                    → 0–100, saturating
```
Median/MAD rather than mean/SD because a single 3 a.m. night must not move the
baseline. Requires **≥ 10 observations in the 28-day window**; below that,
shrink toward a sane prior:
```
s = λ · prior + (1 − λ) · s_observed          λ = k / (k + n),  k = 10
```
So day 1 is honest (mostly prior, low confidence) and day 30 is fully personal.

### L2 · Instruments (O12)

Canonical superset — **keys immutable forever**:

| Key | Label | Typical members |
|---|---|---|
| `BODY` | BODY | steps, training, sleep duration, food |
| `MIND` | MIND | mood, journal, focus quality, screen load |
| `CRAFT` | CRAFT | deep work, shipped work, practice |
| `MONEY` | MONEY | budget adherence, spend vs baseline, savings |
| `PEOPLE` | PEOPLE | contact, time with people, conflict/repair |
| `ORDER` | ORDER | minimums kept, captures settled, plan followed |
| `RECOVERY` | RECOVERY | rest days, sleep debt, deliberate downtime |
| `LEARNING` | LEARNING | reading, study, courses, new skill reps |

```
instrument_i = Σ (w_ij · a_ij) / Σ w_ij        over covered members only
coverage_i   = Σ w_ij(covered) / Σ w_ij(all)
```
Each user **runs 4–6**. The server computes every instrument it has data for, so
switching instruments later never loses history — that is the no-breakage
requirement, and it is why the subset is a display concern, not a storage one.

### L3 · Composition (O8 + O6)

```
w_base    from onboarding priorities, normalised to 1
w_mode    = normalise(w_base ⊙ m_mode)
```

Mode multipliers (`m_mode`), the thing that makes RECOVER mean something:

| Instrument | BUILD | RECOVER | EXAM | TRAVEL |
|---|---|---|---|---|
| BODY | 1.0 | 1.2 | 0.8 | 0.8 |
| MIND | 1.0 | 1.2 | 1.1 | 1.0 |
| CRAFT | 1.4 | 0.5 | 0.7 | 0.6 |
| MONEY | 1.0 | 0.9 | 0.8 | 1.3 |
| PEOPLE | 0.8 | 1.1 | 0.6 | 1.2 |
| ORDER | 1.1 | 0.8 | 1.2 | 0.9 |
| RECOVERY | 0.7 | **1.6** | 1.0 | 1.1 |
| LEARNING | 0.9 | 0.7 | **1.5** | 0.8 |

On RECOVER, a 14-hour grind day genuinely scores **lower** than a walk and nine
hours of sleep. That is the point.

**Idiographic refinement (O6)** — only when `n ≥ 60` days, only with explicit
consent, always explained:
```
w_learned ∝ |ρ_i|   for instruments whose Spearman ρ against the user's chosen
                    outcome survives Benjamini–Hochberg at q < 0.10
w_final   = λ · w_mode + (1 − λ) · w_learned      λ = 60 / (60 + n)
clamp: no w_i may move more than ±40 % from w_mode, none may reach 0
```
The clamp is what stops the engine from chasing noise into a corner. Copy stays
descriptive — *"your MIND days track your CRAFT days"* — never causal.

### L4 · Publication (O7 + O9)

```
STATE       = Σ w_i · instrument_i   over covered instruments, weights renormalised
TRAJECTORY  = OLS slope of STATE over 28 days, with standard error.
              Reported as RISING / HOLDING / SLIPPING only when |slope| > 1.96·SE
CONFIDENCE  = coverage_weighted × baseline_maturity
              coverage = Σ w_i(covered) / Σ w_i(all)
              maturity = 1 − exp(−n_days / 14)
ATTRIBUTION = top 3 instruments by |contribution today − contribution 7-day mean|
```

**Missing data never lowers STATE.** It shrinks CONFIDENCE, which is drawn as a
band around the figure. A person who logged nothing sees a wide band and an
honest prompt, not a bad number.

## 2. Anti-breakage contract

The founder's words: *"very well, proper structured, no breakage."* These are
the rules that deliver that.

1. **Instrument and signal keys are immutable.** Adding one is additive; renaming
   is forbidden. Labels may change, keys never.
2. **Server-side only.** `lifeHealthEngine.js` v2 owns the maths; clients render
   what the API returns and never recompute. (Existing law — restated because
   this engine is more tempting to duplicate.)
3. **Every stored score carries `engine_version` and a snapshot of its inputs.**
   A formula change never silently rewrites history; recomputation is an explicit,
   logged operation.
4. **Deterministic**: `(user_id, date, config_version) → the same number, always.`
5. **Total functions.** No division by zero, no NaN, no unclamped values. Missing
   → excluded and renormalised. Every clamp is written down.
6. **Degrades honestly.** Day 1 with one instrument and no baseline still returns
   a number, with low confidence and a stated reason.
7. **Migration is additive.** New tables and columns; the v1 five dimensions map
   onto v2 instruments (`physical→BODY, cognitive→MIND, discipline→ORDER,
   financial→MONEY, emotional→MIND/PEOPLE`) so old rows keep meaning.
8. **`USER_SCOPED_TABLES` + an RLS policy in the same migration** for every new
   table. No exceptions.

## 3. Schema (additive)

```sql
-- what this person measures
user_instruments(user_id, instrument_key, enabled, base_weight, position)

-- what this person promised, and what their body requires
commitments(id, user_id, instrument_key, kind /* PURSUIT|FLOOR */,
            shape /* MORE|LESS|BAND|SHOW_UP */, label, unit,
            target, floor_value, band_low, band_high, cadence, active, created_at)

-- the load vector that generates floors
user_load(user_id, seated_hours, screen_hours, training_days, caregiving_hours,
          travel_level, sleep_start, sleep_end, height_cm, weight_kg, updated_at)

-- per-day, per-commitment
attainments(user_id, day, commitment_id, raw_value, attainment, observed)

-- the non-fragile consistency numbers
holds(user_id, commitment_id, hold /* EWMA */, current_run, best_run,
      incidents_30d, updated_at)

-- what was published
life_scores(user_id, day, state, confidence, trajectory_slope, trajectory_se,
            mode, engine_version, instruments_json, attribution_json, created_at)
```

## 4. What this forces in the app

| Surface | Change |
|---|---|
| **`:core:model`** (new module) | pure-Kotlin instruments, commitments, attainment, Hold — with the maths unit-tested. Client-side mirror of the contract for rendering and for offline reads |
| **Score** | one large STATE figure with a **confidence band**, a 28-day trajectory line, the instrument rail (only the user's 4–6), attribution ("what moved it"), mode switcher |
| **Today** | score read *below* capture (GOV-106). Shows state + trajectory + confidence, plus floor warnings as one quiet line each |
| **Capture** | presets generated from the user's commitments, not a fixed six |
| **Config** | instruments picker · mode switcher · commitments editor (pursuit vs floor) · body facts with unit toggles |
| **Onboarding** | ten steps; the AI step sits **second-to-last**, takes **voice or text**, and outputs load + commitments (§0.3) |
| **Lab** | already computes ρ/q — becomes the source for the L3 idiographic refinement at 60 days |

## 5. Groq at onboarding — placement and guardrails

**Placement: second-to-last step**, immediately before the first capture. By
then the user has an identity, has seen the language, and knows what the app is
for — so the sentence they speak is informed rather than blind.

**Voice and text, equally.** Voice records → transcribes → the transcript lands
in the same text field, editable before it is sent. Nothing is sent without the
user seeing the text.

**Guardrails — non-negotiable:**

1. **Strict JSON schema, constrained decoding.** The client never parses prose.
2. **Server-side only**, session cookie, through the existing `aiChat.js`
   pipeline and the per-provider daily cap in `apiUsageService.js`.
3. **One call per user, one retry.** Then the rule-based path takes over.
4. **Rule-based fallback always present**: the load vector can be filled with six
   sliders. The AI is an accelerator, never a dependency.
5. **Output is a proposal, never a commitment.** Every field lands as a
   correctable chip. Nothing is written until the user settles it — the same law
   as Capture.
6. **No diagnosis, no medical claim, no verdict.** The model may not output
   judgements about the body; it fills a load vector and suggests commitments.
   Floors come from the deterministic table in §0.3, not from the model.
7. **Bounded output**: instruments ⊆ the canonical 8, commitments ≤ 8, every
   numeric clamped to a sane range server-side before it is shown.
8. **Raw transcript is stored only with consent** and is deletable; the derived
   structure is what the OS keeps.
9. **No dark patterns**: the AI never sets a target higher than the user stated,
   never adds a commitment the user did not imply, and never uses the transcript
   for anything but this calibration.

## 6. Build order (revised)

| # | Unit | Depends on |
|---|---|---|
| 2 | **Today (capture-first)** with the score block rendering STATE/TRAJECTORY/CONFIDENCE from `:core:model` | `:core:model` |
| 3 | `:core:model` + the attainment / Hold maths, unit-tested | — |
| 4 | Money | — |
| 5 | Config (instruments · mode · commitments · body facts) | `:core:model` |
| 6 | OS-ID | — |
| 7 | Onboarding, ten steps incl. the Groq step | `:core:model`, server route |
| 8 | Score surface (full) | server engine v2 |
| 9 | Journal · Lab | — |
| — | **server `lifeHealthEngine` v2 + migrations** | this note |

## Related

- [[10_DECISIONS/2026-08-03-life-score-options]] — the option space this chose from
- [[17_NATIVE_APP_V2/PERSONALIZATION-AND-ONBOARDING]] — §2 archetypes withdrawn, replaced by §0.3 here
- [[17_NATIVE_APP_V2/V3-BUILD-TRACKER]]
