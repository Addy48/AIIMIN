# 09 — Motion Principles

```yaml
document: Motion Principles
version: 3.0
last_updated: 2026-07-22
```

## Purpose

Define when and why AIIMIN moves — so motion communicates rather than entertains.

## Reasoning

Craft history already set discipline: ~150–250ms, opacity+transform, max 2–3 intentional motions per composition. Native has its own motion language doc; principles must keep web and native emotionally consistent.

## Evidence

DESIGN.md motion discipline; Design History; Interaction Principles IX-8; impeccable/emil craft norms; Constitutional calm.

---

## M-1 — Motion is meaning

Allowed purposes:

1. Feedback (saved, failed, toggled)
2. Continuity (shared-element orientation)
3. Hierarchy (attention to primary action)
4. State (expand/collapse, enter/exit)

Forbidden purposes: idle flair, perpetual loops, “AI awake” breathing glows as identity.

## M-2 — Short by default

Prefer ~150–250ms for micro-interactions. Longer motion needs a narrative reason (first-run brand moment), not a dashboard habit.

## M-3 — Opacity + transform preferred

Prefer fade/slide/scale over layout thrash and blur fireworks. Avoid motion that causes vestibular distress (see Accessibility).

## M-4 — Budget per composition

Marketing/brand: 2–3 intentional motions can create presence. Product OS: fewer. If everything moves, calm is dead.

## M-5 — Respect reduced motion

Honor `prefers-reduced-motion`. Essential feedback may remain as instant state change; decorative motion must yield.

## M-6 — Never delay capture

Motion must not add latency to save/log/toggle paths. Feedback can animate after commit, not before.

## M-7 — Consistent physics metaphor

One easing family per surface class. Do not mix bouncy carnival with corporate easeInOut randomly.

## M-8 — Platform vernacular

Native may use platform motion tokens; web may use Framer/Motion — but emotional tempo (calm, quick, purposeful) must match.

## M-9 — Celebration is rare and proportional

Completion can acknowledge; it must not fireworks every habit tick. XP celebration ≠ confetti addiction.

## M-10 — Page transitions serve orientation

Route changes may gently orient; they must not become cinematic taxes on daily use.

## Dependencies

[[03_DESIGN_PHILOSOPHY]] · [[08_INTERACTION_PRINCIPLES]] · [[11_ACCESSIBILITY_PRINCIPLES]].

## Future impact

AR/voice will redefine “motion”; the meaning test still applies.

## Tradeoffs

Restrained motion looks “less demoable” on Dribbble. Demoability is not the north star.

## Known risks

- Craft polish adding motion debt.
- Loading animations masking poor performance.
- Reduced-motion users getting broken states if logic tied to animation end events.

## Related sections

[[14_DESIGN_SYSTEM_SPECIFICATION]] · [[16_COMPONENT_BLUEPRINTS]]
