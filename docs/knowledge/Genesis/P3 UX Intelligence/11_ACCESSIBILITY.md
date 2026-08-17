# 11 — Accessibility

## Purpose
Assess who can use AIIMIN successfully — motor, sensory, cognitive accessibility — as part of human experience, not compliance theater.

## Confidence
★★★☆☆ — Code pattern review + prior interaction audit a11y section. No axe/WAVE full crawl this turn; no screen-reader user test.

## Evidence Sources
`COMPLETE_INTERACTION_AUDIT.md` §7; Login PIN a11y; Navbar focus trap; UniversalLogger labels; Onboarding numpad gaps; BottomNav sheet; Overview checkboxes; contrast notes in Palette.

## Files Used
`Login.jsx`, `Navbar.jsx`, `BottomNav.jsx`, `UniversalLogger.jsx`, `Onboarding.jsx`, `Overview.jsx`, `ErrorBoundary.jsx`, Palette.md.

## Reasoning
Accessibility failures concentrate where emotion is high (auth, onboarding, capture) — compounding exclusion.

## Dependencies
[[07_COGNITIVE_LOAD]] · [[08_TRUST_ANALYSIS]]

## Consumers
A11y backlog, craft polish.

## Known Unknowns
Mobile TalkBack/VoiceOver full pass; colorblind Score encoding beyond green/gray; vestibular response to LIVE pulse.

---

## Strengths

| Area | Evidence |
|------|----------|
| Login PIN | `role="group"`, `aria-live`, per-key `aria-label` |
| Navbar | `aria-label="Main"`, Escape, focus trap on drawer |
| BottomNav | `aria-current="page"` |
| Logger | Textarea labels |
| Trajectory SVG | `role="img"` + label |
| Week buttons | Previous/Next aria-labels |
| Contrast intent | Charcoal on ivory ≥4.5:1 documented |
| Touch targets | Tablet Focus 48px; water-btn 44px floor noted in Device-Tiers |

---

## Gaps (experience impact)

| Gap | Severity | Why it hurts humans |
|-----|----------|---------------------|
| Onboarding numpad lacking aria-labels | Major | Blocks independent activation |
| Overview week task checkboxes unlabeled | Medium | Silent failures for AT users |
| BottomNav More sheet not dialog-patterned | Medium | Focus escapes / unclear modal |
| Emoji-only mood differentiation | Major | Meaning lost for SR / cultural decode |
| Lab modules uneven Esc/focus | Medium | Trap risk |
| Finance inline edits mouse-leaning (audit) | Medium | Keyboard users excluded from money |
| Motion LIVE dots | Minor–Medium | Distraction / vestibular |
| Cognitive a11y (density) | Critical | See [[07_COGNITIVE_LOAD]] — affects everyone |

---

## Cognitive accessibility (often ignored)

AIIMIN’s largest a11y debt is **cognitive**:
- 10-step onboarding
- Multi-navigator learning
- Domain filing under stress
- Ops jargon

WCAG-oriented fixes without cognitive simplification will miss the product’s actual exclusion mode.

---

## Inclusive emotional design

Discipline and journal copy aim non-clinical — good for users with mental-health sensitivity.
Risk: CBT journal modes + phenotyping inference without clear consent UX.

---

## Platform notes

- Native M3 components inherit some a11y defaults; custom Welcome/Auth need TalkBack QA.
- Biometric fallback to PIN must remain operable offline/error states with clear focus.

---

## Cross-link
[[14_FRICTION_ANALYSIS]] · [[18_RISK_REGISTER]]
