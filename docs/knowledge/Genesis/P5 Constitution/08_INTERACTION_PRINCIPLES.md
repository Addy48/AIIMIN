# 08 — Interaction Principles

```yaml
document: Interaction Principles
version: 3.0
last_updated: 2026-07-22
```

## Purpose

Define timeless interaction rules so every control, gesture, notification, and automation earns its place.

## Reasoning

The interaction audit recorded 578 actions and high friction in onboarding, family, and finance. Compression is not a slogan; it is interaction law. These principles expand Constitution Article V into operational rules.

## Evidence

Interaction Model; Kill List; Automation confidence bands; Product Principles (Enter to save, ConfirmDialog, empty states); Future Framework compression targets.

---

## IX-1 — One obvious primary action

Every view declares one primary action. Secondary actions stay visually and cognitively quieter. If everything is primary, nothing is.

## IX-2 — Never surprise the user

Automation may delight; it must not ambush. Writes that matter show feedback. Irreversible actions confirm. Silent wrong data without a correction path is forbidden.

## IX-3 — Reduce decisions

If a choice can wait, it waits. If AI can infer with correction, do not ask upfront. Kill List fields stay dead.

## IX-4 — Progressive disclosure

Show the next needed thing, not the entire schema. High-stakes flows may expand; daily flows must shrink.

## IX-5 — Context before controls

Orient the user (what is this moment for?) before presenting a toolbar of possibilities. Capture bar before settings. Briefing before widget garage.

## IX-6 — Intelligence without interruption

AI works in confidence bands. It does not steal Focus. It does not modal-interrupt protected states. Coaching links to action when the window is open.

## IX-7 — Every interaction must justify itself

Test: Does this interaction increase fidelity, speed, trust, or clarity? If it only increases “engagement,” cut it.

## IX-8 — Every animation must communicate

Motion explains state change, spatial relationship, or feedback. Motion that exists to look busy is rejected. (See Motion Principles.)

## IX-9 — Every notification must deserve attention

Notifications require: user value, timing respect, and a clear action. Digest > drip nag. No notification for vanity metrics.

## IX-10 — Everything should have purpose

Decorative controls, placeholder widgets, and duplicate entries are interaction debt. Remove or merge.

## IX-11 — Enter to save

Inline capture defaults to keyboard submit. Power and speed are inclusive, not elitist.

## IX-12 — Optimistic where safe; confirm where destructive

Habit toggles may be optimistic. Account delete, vault wipe, irreversible money, and privacy-affecting shares confirm — branded dialog, typed confirm when stakes peak.

## IX-13 — Infer, then chip

Pre-filled structure shows chips for correction. Chips are first-class UI, not afterthoughts.

## IX-14 — Capture beats navigation

Getting data in beats touring the information architecture. Palette/Logger outrank deep-link tourism for daily intents.

## IX-15 — Feedback is mandatory

Every successful write, failed write, and pending sync state must be perceivable. Silent failure is a critical defect.

## IX-16 — Undo over fear

Prefer undo windows for recoverable mistakes; prefer confirm for unrecoverable ones. Do not use fear copy for recoverable acts.

## IX-17 — Shortcuts are progressive enhancement

Chords (`⌘K`, `Space→L`, `Esc`) accelerate; they never become the only path for essential capture on desktop. Mobile has equivalent one-thumb primary paths.

## IX-18 — Forms are a last resort

NL + chips + progressive fields beat six-field finance as the only path. Forms remain for high-stakes accuracy when needed — not as default personality.

## IX-19 — Empty states teach

Show the next action and relevant shortcuts. Never generic “No data” void.

## IX-20 — Consistency of verbs

Same action uses same verb across surfaces (Save, Log, Complete, Delete). See Naming Language.

## IX-21 — Latency honesty

Skeleton/progress for known waits. Do not fake instant if sync is pending — especially on native outbox.

## IX-22 — Accessibility is interaction quality

Keyboard, focus order, hit targets, and announcements are part of interaction design — not a later audit (see Accessibility Principles).

## IX-23 — Device-appropriate gestures

Platform conventions (back, share sheets, system biometrics) win over reinvented gestures — unless Constitution requires otherwise (e.g., capture ceiling).

## IX-24 — No duplicate navigation systems fighting

One mental model for “where am I / where can I go.” Parallel nav metaphors without hierarchy create thrash.

## IX-25 — Compression is continuous

New features must estimate interaction delta. Net-positive interaction count for the same outcome is a fail unless stakes demand it.

## Dependencies

[[05_BEHAVIORAL_PHILOSOPHY]] · [[09_MOTION_PRINCIPLES]] · [[11_ACCESSIBILITY_PRINCIPLES]] · Interaction Audit.

## Future impact

Voice, watch, and AR interactions inherit these laws; modality changes, justification does not.

## Tradeoffs

Strict justification slows “fun” experimental chrome. AIIMIN prefers durable clarity.

## Known risks

- Chip fatigue if everything is “inferred.”
- Over-compression removing necessary safety asks.
- Desktop shortcuts never taught → power features rot.

## Related sections

[[15_PAGE_BLUEPRINTS]] · [[16_COMPONENT_BLUEPRINTS]] · [[18_NON_NEGOTIABLES]]
