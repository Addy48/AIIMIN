# 11 — Accessibility Principles

```yaml
document: Accessibility Principles
version: 3.0
last_updated: 2026-07-22
```

## Purpose

Make accessibility a constitutional quality of AIIMIN — not a compliance afterthought.

## Reasoning

A Life OS used under stress (urge moments, emergency vault, money mistakes) fails harder when inaccessible. Calm premium identity without access is incomplete craft.

## Evidence

Palette contrast rules; ConfirmDialog focus patterns; mobile hit-target craft; reduced-motion principle; product privacy of sensitive flows.

---

## A-1 — Perceivable by default

Text and essential iconography meet contrast requirements. Color is never the only signal (done/muted also use labels/patterns where critical).

## A-2 — Operable under load

Critical capture and destructive confirms work with keyboard on desktop and one-thumb reach on phone. Hit targets meet platform minimums (e.g., ~48dp native guidance).

## A-3 — Understandable language

Microcopy uses plain verbs. Error messages say how to fix. Clinical jargon is banned for product and accessibility reasons alike.

## A-4 — Robust semantics

Controls expose correct roles/names/states to assistive tech. Custom components inherit responsibilities from Component Principles.

## A-5 — Focus is visible and logical

Focus order follows reading/action order. Modals trap focus appropriately and restore on close.

## A-6 — Motion is optional

Honor reduced motion. Do not bind critical state completion solely to animation end.

## A-7 — Timeouts are humane

Session and PIN flows explain timing; avoid punishing timeouts during journaling.

## A-8 — Sensitive flows get extra care

Journal, discipline, family medical, and finance errors must not leak content via notifications or shared screens without user intent.

## A-9 — Captions and alternatives for media

If audio/video coaching appears, text alternatives exist. Voice capture always has typed fallback.

## A-10 — Accessible empty and error states

Empty/error states remain actionable with assistive tech — not image-only voids.

## A-11 — Do not ship inaccessible “premium”

Premium never means low-contrast gray-on-gray fashion. Restraint ≠ invisibility.

## A-12 — Test with real tasks

Accessibility acceptance uses capture, confirm, and review tasks — not only automated lint.

## Dependencies

[[07_VISUAL_LANGUAGE_PRINCIPLES]] · [[08_INTERACTION_PRINCIPLES]] · [[10_COMPONENT_PRINCIPLES]].

## Future impact

Watch/car/AR modalities need modality-specific a11y addenda without weakening A-1–A-12.

## Tradeoffs

Some cinematic motion and dense dashboards are constrained. Worth it.

## Known risks

- Custom canvas/charts without text equivalents.
- Chip-only confirmations without accessible names.
- Native and web diverging on focus behavior.

## Related sections

[[12_CONTENT_AND_MICROCOPY]] · [[16_COMPONENT_BLUEPRINTS]] · [[18_NON_NEGOTIABLES]]
