# 07 — Cognitive Load

## Purpose
Measure where AIIMIN forces thinking, memory, attention switching, and fatigue — and where it wisely lets users stop thinking.

## Confidence
★★★★☆ — Friction composites + field counts + known working-memory limits. Not lab-measured NASA-TLX.

## Evidence Sources
`friction.md`; `fields.md` / product intelligence matrix; `INTERACTION_COMPRESSION_SCORE.md`; kill list; onboarding step count; Lab module count.

## Files Used
Friction heatmap; Onboarding; Finance EntryForm; Family; Lab launcher; DailyLogForm; Habit toggle.

## Reasoning
Working memory ~4 chunks. Surfaces that present &gt;4 simultaneous decisions create overload. Daily repeated costs matter more than rare setup costs — except activation, which gates everything.

## Dependencies
[[04_USER_JOURNEYS]] · [[14_FRICTION_ANALYSIS]]

## Consumers
Kill-list implementation, Today redesign, form compression.

## Known Unknowns
Per-user median daily interactions live (target ≤5; failure ~15).

---

## Load dimensions

| Dimension | Worst offenders | Best (low load) |
|-----------|-----------------|-----------------|
| Decision count | Onboarding multi-selects; Lab 14 modules; Goals 7 fields | Habit toggle |
| Memory load | 6-digit PIN (× surfaces); OS-ID uniqueness | OAuth path |
| Attention switching | Plan-day across 4 routes | ⌘K stay-put logs |
| Context switching | Desktop↔`/m`↔native IA | — |
| Reading effort | Family emergency wall; ops headers | ProductTour short chapters |
| Learning effort | Multiple navigators; dual Settings/Account | Brand manifesto (conceptual, not operational) |
| Nav complexity | 14 registry + overflow + palette | `/m` 3 tabs (simple but limited) |
| Visual complexity | Overview multi-widget | Habit week strip |
| Interface density | Finance tabs; Family cards | Journal capture |
| Choice overload | Lab; onboarding habits/goals | Mood-only strip (still a choice) |
| Mental fatigue | Activation marathon; end-of-day multi-metric log | One Logger box |

---

## Where users stop thinking (good)

- Habit today toggle — muscle memory loop
- PIN numpad after learning (still memory-taxing to set)
- ⌘K open gesture for power users
- Native habit tick with haptic
- Recurring Finance defaults (when last account remembered)

These are **identity-forming automations**. Protect ruthlessly.

---

## Where users begin thinking (necessary)

- Life Arc meaning
- Goal milestones
- Discipline trigger honesty
- Subscription upgrade tradeoff
- Family emergency accuracy

Necessary thinking should be **scheduled**, not jammed into first session.

---

## Where users become overwhelmed

1. **Activation stack** — waitlist emotional decision + auth + PIN + 10 onboarding steps + tour
2. **Today without briefing** — synthesize your own day plan
3. **Lab launcher** — 14 equal choices
4. **Family vault first enter** — 65+ inputs ecosystem
5. **Mood primitive sprawl** — re-learn 1–10 on 5 surfaces (duplicate pattern)
6. **Stress + Discipline modal** — emotional recall while dysregulated (INT-537)

---

## Cognitive load checklist (critique skill style)

Applied to **Today default**:

1. More than 4 visible competing actions? **Fail**
2. Must remember info from another screen to act? **Fail** (calendar/goals elsewhere)
3. Jargon without scaffold? **Partial fail** (Day Control, Trajectory)
4. Required fields before value? **Pass** if Logger used; **Fail** if DailyLog multi-metric forced
5. Modes before content? **Fail** on Journal if mode first
6. Duplicate decisions? **Fail** (mood)
7. System status unclear? **Partial** (tier, sync on web)
8. Errors blame user? **Mostly pass** (toasts generic)

**Failure count Today: ~5 → critical load surface** despite being the “one screen.”

Applied to **Habit toggle row**: failures 0–1 → low load (good).

---

## Compression gap

Bible/metrics: median daily interactions 15 → **5**; capture &lt;60s.
Interaction compression scores exist as targets — implementation incomplete while kill-list fields still asked.

**Five-year prediction:** If compression ships, cognitive load becomes AIIMIN’s moat. If not, load becomes churn.

---

## Cross-link
[[14_FRICTION_ANALYSIS]] · [[16_BEHAVIORAL_DESIGN]] · [[17_UX_OPPORTUNITIES]]
