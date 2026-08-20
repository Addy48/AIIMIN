---
authority: operations
derived_from: Genesis · 10_DECISIONS/2026-08-03-life-score-taxonomy
status: proposed
owner: founder
lifecycle: decision
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-DECISION
graph_role: leaf
note_type: NT-DECISION
tags:
  - type/decision
  - domain/product
  - status/open
---

# Life Score — every option on the table

> **This note exists to be decided on, not to be admired.** §7 is the
> recommendation; §3 is the full option space; §8 is what I would ship first if
> you say "just pick one". Research behind it is cited in §9.

## 1. What is actually broken today

`server/services/lifeHealthEngine.js` computes five dimensions with **fixed
weights on population-shaped formulas**:

```
physical  = sleep*0.4 + activity*0.4 + nutrition*0.2
cognitive = focus*0.7 + learning*0.3
discipline= habits*0.5 + routine*0.3 + focus*0.2
financial = budget*0.7 + savings*0.3
emotional = mood*0.5 + journalConsistency*0.5
overall   = 0.25p + 0.20c + 0.25d + 0.15f + 0.15e
```

Four things are wrong with it, and they are the four things every option below
is judged against:

1. **It is the same for everyone.** A person who codes 14 hours a day and a
   person who walks 15 km a day get scored on the same axes with the same
   weights. One of them is always losing at a game they never entered.
2. **Missing data reads as failure.** Not logging is scored identically to doing
   badly. This is the single most common reason people quit self-tracking apps.
3. **Rest is punished.** A deliberate recovery day and a wasted day are
   indistinguishable to the formula.
4. **It explains nothing.** The number moves and there is no attributable
   reason, so it cannot change behaviour — it can only make you feel judged.

Every consumer wearable has hit the same wall. Independent review of 14 composite
health scores across the major manufacturers found **only 2 of 12 have any
published validation**, and that identical physiological data yields materially
different scores across vendors because weighting, normalisation and baseline
windows all differ. There is no industry standard to copy. That is a threat and
an opening: nobody has solved this, so an honest, legible score is a real
differentiator.

## 2. The design axes (decide these, and the options fall out)

| Axis | Choices | Note |
|---|---|---|
| **A1 · Meaning** | compliance · readiness/capacity · deviation from own norm · trajectory · alignment to stated intent · debt/reserve | This is the big one. What does the number *claim*? |
| **A2 · Reference frame** | population norms · your own rolling baseline · your own declared targets | Wearables converged on personal baselines (14–21 days minimum). |
| **A3 · Composition** | fixed weights · user-set weights · mode-conditioned weights · weights learned from your own correlations | |
| **A4 · Dimension set** | one fixed 5 for everyone · user-chosen subset of a canonical superset · emergent from data | Resolves the current three-way taxonomy clash. |
| **A5 · Cadence** | settled once at day end · live all day · weekly | Live-all-day is what makes people open the app twice. |
| **A6 · Missing data** | penalise · impute · shrink toward prior · lower *confidence* not score | Penalising is the classic own-goal. |
| **A7 · Transparency** | black box · full attribution ("what moved it") | |
| **A8 · Output shape** | one number · number + vector · two numbers (state + trajectory) · no single number | |

## 3. The options

Each is: **mechanism → maths → what it feels like → cost → risk.**

### O1 · Compliance Index (what exists)
Weighted percentage of targets met.
`score = Σ wᵢ · min(1, doneᵢ/targetᵢ)`
Feels like: a report card. Cheap, familiar, already built.
**Risk:** identical for everyone, punishes rest, drives guilt-based
(introjected) motivation, which research links to short-term compliance and
long-term abandonment. Gameable by lowering targets.

### O2 · Personal-baseline z-composite ("today vs your normal")
Every signal is normalised against **your own** rolling 28-day distribution
using robust statistics, then squashed.
```
z  = (x − median₂₈) / (1.4826 · MAD₂₈)      # robust, outlier-proof
s  = 50 + 50 · tanh(z / 2)                   # 0–100, saturating
```
Feels like: WHOOP/Oura, but for a life instead of a body. Unique per person on
day 29 with zero configuration.
**Cost:** needs 14–28 days before it means anything (every wearable has this
problem; they hide it, we should show it as a confidence bar).
**Risk:** "your normal" can lock in a bad normal — a person sleeping 5 h for a
month scores well on sleep. Must be paired with declared floors (O5).

### O3 · Alignment score (Arc-weighted)
You already have **Life Arc** — a declared direction. Score = how much of the
day's captured record matched the arc and the minimums *you* set.
`score = Σ (weightᵢ from your own onboarding) · achievementᵢ`, weights
normalised to 1.
Feels like: the OS is keeping your word for you, not grading you against
strangers. Constitutionally the most AIIMIN-shaped option.
**Cost:** low maths, high onboarding quality — which we are building anyway.
**Risk:** self-report bias; people declare aspirations, not intentions. Mitigate
by re-asking at 14 days with evidence ("you said reading mattered; you logged it
twice — keep it, drop it, or shrink it?").

### O4 · Capacity / reserve model (stock-and-flow, "Body Battery for a life")
The score is a **reserve that drains and refills through the day**.
```
R(t+1) = clamp(R(t) − Σ drainⱼ(t)·δⱼ + Σ refillₖ(t)·ρₖ , 0, 100)
```
Drains: hours worked, poor sleep, overspend against budget, unprocessed
captures, conflict logged. Refills: sleep, walk, journal, deliberate rest,
social contact. **δ and ρ are fitted per person** from their own history.
Feels like: a fuel gauge you check at 3 pm — the only option that gives a real
reason to open the app mid-day.
**Cost:** highest of the simple options; needs a state model and per-user fitting.
**Risk:** if the coefficients feel wrong the whole thing feels wrong. Ship with
visible, editable coefficients.

### O5 · Debt ledger (the anti-score)
Do not score the day. Track what you **owe**: sleep debt, movement debt, money
debt (spend over budget), attention debt (captures never settled), people debt
(nobody seen in N days), craft debt (no deep work in N days).
`score = 100 − Σ normalised debtᵢ` — or publish no score at all and show the
debts.
Feels like: a balance sheet for a life. Every number has one obvious payoff
action, which is what a score never has.
**Cost:** low. **Risk:** can read as nagging if the copy is wrong; needs debts to
be *your* commitments, never defaults.

### O6 · Idiographic weights (N-of-1, learned from your own data)
The Lab already computes Spearman ρ with Benjamini–Hochberg FDR. Use each
user's **own significant correlations** to weight the composite toward what
actually predicts their own outcome (their mood, or their own end-of-day rating).
```
wᵢ ∝ |ρᵢ| where qᵢ < 0.10, shrunk toward the prior by n:
wᵢ = λ·w_prior + (1−λ)·w_learned,  λ = k/(k+n)
```
Feels like: the app learned *you*. This is a genuine moat — it is the formal
n-of-1 method from personalised-medicine research, and no consumer life app
ships it honestly.
**Cost:** needs 60–90 days of data; needs the shrinkage or it will chase noise.
**Risk:** correlation shown as causation. Copy must stay descriptive.

### O7 · Two numbers: State + Trajectory
Publish **today's state** (0–100) *and* the **28-day slope** with a band. A bad
day inside a rising month should read as exactly that.
`trajectory = OLS slope over 28d, reported with its standard error`
Feels like: the difference between a mood and a life. Cheap to add on top of any
other option.
**Risk:** two numbers is one more than most people want. Solve by drawing the
trajectory as a line and keeping only one figure large.

### O8 · Mode-conditioned weights
Weights switch with the life mode you already approved — **BUILD · RECOVER ·
EXAM · TRAVEL**. On RECOVER, sleep and rest carry the weight and grinding
*lowers* the score. On EXAM, focus hours dominate and social drops out.
Feels like: the OS understands seasons. Kills the "why would a coder walk"
problem outright.
**Cost:** trivial once weights are a vector. **Do this regardless of what else
you pick.**

### O9 · Confidence, not punishment
Every score ships with a **confidence** that grows with data density. Missing
data widens the band; it never lowers the number.
`confidence = 1 − exp(−observed_signals / expected_signals)`
Feels like: honesty. Removes the biggest reason people quit.
**Cost:** trivial. **Do this regardless.**

### O10 · Prediction / calibration loop
Each morning the OS predicts your day from your own patterns. Each evening you
settle. The score is **how close the day came to your own intent**, and a second
figure tracks how well the model predicted you.
Feels like: a mirror with a memory. Creates a genuine two-touch daily loop
(morning read → evening settle) without a single notification guilt-trip.
**Cost:** medium; needs a per-user predictor (a mean/EWMA baseline is enough at
first). **Risk:** a wrong prediction feels like being misread — show it as a
question, not a claim.

### O11 · Self-percentile ("top 18% of your quarter")
No composite at all: rank today against **your own** last 90 days.
`score = percentile_rank(today, last 90 days)`
Feels like: unarguable. Immune to "your normal is wrong" — it only ever compares
you to you.
**Cost:** trivial. **Risk:** insensitive at the extremes; a great day and a
brilliant day both read 99.

### O12 · Composable instruments (fixes the taxonomy clash)
Stop shipping one set of five. Keep a **canonical superset** server-side —
`BODY · MIND · CRAFT · MONEY · PEOPLE · ORDER · RECOVERY · LEARNING` — and let
each person run **4–6 of them**. The server computes all it has data for; the
client shows the user's chosen instruments.
Feels like: a personal OS instead of a template.
**Cost:** medium (schema + UI). **This is the honest answer to "different for
everyone" and it resolves the three-way label clash without picking a winner.**

## 4. What each option does about the four failures

| | Same for all | Missing = fail | Rest punished | Explains itself |
|---|---|---|---|---|
| O1 Compliance | ✗ fails | ✗ fails | ✗ fails | ✗ |
| O2 Baseline-z | ✓ solves | partly | ✓ | partly |
| O3 Alignment | ✓ | ✗ | partly | ✓ |
| O4 Capacity | ✓ | partly | ✓ solves | ✓ |
| O5 Debt | ✓ | ✓ | ✓ | ✓ strongest |
| O6 Idiographic | ✓ strongest | ✗ | ✓ | partly |
| O7 State+Traj | – | – | ✓ | ✓ |
| O8 Mode | ✓ | – | ✓ solves | ✓ |
| O9 Confidence | – | ✓ solves | – | ✓ |
| O10 Prediction | ✓ | ✓ | ✓ | ✓ |
| O11 Self-%ile | ✓ | ✗ | partly | ✗ |
| O12 Instruments | ✓ solves | – | – | ✓ |

## 5. Combinations worth naming

- **"The honest wearable"** — O2 + O7 + O9. Familiar, defensible, ~2 weeks work.
- **"The personal OS"** — O12 + O8 + O3 + O9. Every user runs a different
  instrument set with mode-aware weights seeded from what they told us.
- **"The balance sheet"** — O5 + O9, no composite at all. The most differentiated
  and the riskiest; a life app with no score is a hard sell to a person who came
  for a score.
- **"The mirror"** — O10 + O4. Best daily loop, most engineering.
- **"The full instrument"** — O12 + O8 + O2 + O6 + O7 + O9, staged over months.

## 6. What the research actually supports

- **Personal baselines beat population norms.** Fitbit, Garmin, Oura, Polar,
  Ultrahuman and WHOOP all use user-specific baselines; 14–21 days is the
  accepted minimum before a score means anything.
- **Composite scores are unvalidated black boxes.** Only 2 of 12 major scores
  have published validation. Transparency is available as a differentiator
  precisely because nobody else offers it.
- **Streaks and heavy gamification cut both ways.** They drive introjected
  (guilt) regulation; gamification feature-richness follows an S-curve, and past
  the second inflection point extra mechanics *increase* burnout and abandonment.
  Badge complexity predicted "gamification burnout" → app abandonment in a
  1,188-user fitness study.
- **Personalisation pays, measurably.** Personalised onboarding is reported at
  +30–50% activation and materially better D30 retention; ~80% of mobile users
  churn within three days, so the first session is the whole game.
- **N-of-1 / idiographic methods are real science**, not a gimmick — the same
  machinery as personalised-trial research, which is what makes O6 defensible.

## 7. Recommendation (neutral, and I will argue against it below)

**Ship a layered engine, not a formula.**

```
L0  signals        robust per-person normalisation (28d median/MAD) + confidence
L1  instruments    canonical superset of 8; each user runs 4–6      [O12]
L2  composition    mode-conditioned weights, seeded from onboarding,
                   editable by the user, optionally refined after 60 days
                   by their own correlations                    [O8+O3+O6]
L3  publication    ONE large figure = today's state, ONE line = 28-day
                   trajectory, always with a confidence band     [O7+O9]
L4  action         the debt view: what you owe and the one thing that pays
                   it down                                            [O5]
```

Why this and not something simpler: every layer is independently shippable, each
one alone fixes a specific failure in §1, and the whole thing degrades to
something honest on day 1 (low confidence, few instruments) instead of lying.

**The case against it:** it is more machinery than a one-person team should own,
and L2's learned weights can wait a year without anyone noticing. If that
argument lands, ship §8 instead.

## 8. If you want one answer today

Ship **O12 + O8 + O9 + O7**, in that order, and leave O6 for next year:

1. **Instruments** — 8 canonical, user picks 4–6 at onboarding. *(Unblocks the
   taxonomy clash: the answer is that there is no single answer, and the schema
   stops pretending there is.)*
2. **Mode weights** — BUILD / RECOVER / EXAM / TRAVEL vectors.
3. **Confidence** — missing data widens the band, never lowers the score.
4. **State + trajectory** — one big figure, one line.

That is roughly two weeks of server work and one screen, it is unique per person
from day one, and nothing in it has to be undone to add O4/O5/O6 later.

## 9. Sources

- [Readiness, recovery and strain: composite health scores in consumer wearables](https://www.degruyterbrill.com/document/doi/10.1515/teb-2025-0001/html?lang=en) — validation gap, per-vendor divergence
- [Building reliable health scores from wearable data](https://www.themomentum.ai/blog/health-scores-wearable-data) — z-scores, baselines, rolling windows
- [How Body Battery / Recovery / Readiness are each calculated (2026)](https://www.sensai.fit/blog/garmin-body-battery-vs-whoop-recovery-vs-oura-readiness-how-calculated-2026)
- [Why recovery scores differ between devices](https://getfitcraft.com/science/why-recovery-scores-differ-between-devices)
- [S-shaped impact of gamification feature richness on adherence (Frontiers, 2025)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1671543/full)
- [Gamification-induced feelings and continued mHealth use (SDT model)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8391751/)
- [Gamification gone wrong: when streaks become the point](https://nerdsip.com/blog/gamification-gone-wrong-when-streaks-become-the-point)
- [N-of-1 trials in healthcare](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8000055/) · [Person as population: single-subject causal inference on self-tracked data](https://arxiv.org/pdf/1901.03423)
- [SaaS onboarding statistics 2026](https://www.shno.co/marketing-statistics/saas-onboarding-statistics) · [Onboarding strategies: activation and retention](https://www.appcues.com/blog/8-user-onboarding-strategies)

## Related

- [[10_DECISIONS/2026-08-03-life-score-taxonomy]] · [[17_NATIVE_APP_V2/PERSONALIZATION-AND-ONBOARDING]]
- [[17_NATIVE_APP_V2/V3-BUILD-TRACKER]] — screen 9 stays blocked until this is decided
