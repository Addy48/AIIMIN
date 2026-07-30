# 09 — Emotional Design

## Purpose
Map emotional experience across dayparts and life states — anxiety, pressure, motivation, guilt, delight — against doctrine (anti-shame, recovery-oriented).

## Confidence
★★★★☆ — Copy and flows audited; no diary studies. Intent graph emotional taxonomy used.

## Evidence Sources
ProductTour; Discipline; Gamification notes; Life Score; Onboarding; Family; Focus; HUMAN_INTENT_GRAPH; Product Guide pillars.

## Files Used
`ProductTour.jsx`, Discipline surfaces, Overview PulseCheck/Score, XP modal, Urge flows, Brand manifesto.

## Reasoning
Peak-end rule: activation peaks negative; daily toggle peaks positive; monthly review end unclear.

## Dependencies
[[04_USER_JOURNEYS]] · [[16_BEHAVIORAL_DESIGN]]

## Consumers
Discipline, Score presentation, onboarding tone, notification design.

## Known Unknowns
Whether Life Score currently produces guilt in testers.

---

## Doctrine emotional contract

AIIMIN claims:
- No streak shame
- Recovery-oriented discipline language
- Sparring over sycophancy
- Honest mirror (Life Score) not vanity analytics
- Interruptibility (no coaching during Focus)

---

## Daypart emotions

| Moment | Intended emotion | Likely actual | Why |
|--------|------------------|---------------|-----|
| Morning | Clarity, calm momentum | Mixed: orienting stress | No briefing; widget noise |
| Work / Focus | Deep calm | Good if Focus Room used; else tab temptation | Focus exists; Today pulls back |
| Travel / phone | Lightweight capture | Second-class / deferred | `/m` + native desktop deferral copy |
| Stress | Support | Friction | Discipline modal field recall; nav to find it |
| Burnout | Relief / less ask | Risk of more ask | Daily metrics + Score can feel like performance review |
| Success | Celebrate | Split | Win logs + XP; can feel gamer |
| Failure / slip | Recovery | Mixed | Doctrine good; streak UI may still sting |
| Reflection | Safety | Mostly good | Journal privacy story |
| Planning | Empowered | Overloaded | Goal modal / multi-surface plan |
| Review | Insightful pride | Analytical cold | Reports over narrative digest |
| Night | Closure | Unfinished business | No designed shutdown ritual |

---

## Does AIIMIN reduce anxiety?

**Sometimes.** Logger “one box,” habit tap, Brand calm, Discipline urge surf — reduce anxiety when found.
**Sometimes not.** PIN walls, verification gates, Family forms, Score opacity, tier blocks — increase anxiety.

**Net for new users:** anxiety up until first successful capture.
**Net for retained power users:** anxiety down if they ignore chrome.

---

## Does it create pressure?

Yes — Trajectory percentages, Execution Window countdown (when enabled), streak multipliers, Life Score delta, waitlist cutoffs.
Some pressure is motivational; founder-specific Execution Window is **inappropriate general UX pressure**.

---

## Does it create motivation?

Yes — Arc identity, Micro-tasks, Monday Insight, XP (for some), Career pipeline progress.
Motivation quality: **identity motivation** (arc) &gt; **points motivation** (XP) for five-year health.

---

## Does it create guilt?

**Risk high** if:
- Incomplete habits visually punish
- Score drops without actionable kindness
- Streak breaks highlighted without recovery CTA
- Journal empty days moralized

**Mitigations present:** ProductTour anti-shame; Discipline recovery language; kill-list rejects shame-first UX.
**Mitigations incomplete:** Gamification still ships; Score presentation needs ongoing guilt QA.

---

## Peak–end assessment

| Journey | Peak | End | Healthy? |
|---------|------|-----|----------|
| Activation | PIN/Arc stress | Mission Control enter | Poor peak |
| Daily capture | Logger success toast | Leave app | OK if capture happened |
| Urge | Emotional intensity | Log outcome | Can be excellent if short |
| Family setup | Field wall | Save | Poor |
| Focus session | Flow | Reflection optional | Good if reflection skippable |

---

## Feeling understood — rare peaks

- Discipline “urge surf, not streak shame”
- Journal “without a second productivity cult”
- Mobile copy admitting phone ≠ full OS (honest, bittersweet)
- Human Momentum manifesto

These are the emotional brand. They must colonize Today and Score, not only Tour/Brand.

---

## Cross-link
[[15_DELIGHT_ANALYSIS]] · [[08_TRUST_ANALYSIS]] · [[13_AI_SLOP_ANALYSIS]]
