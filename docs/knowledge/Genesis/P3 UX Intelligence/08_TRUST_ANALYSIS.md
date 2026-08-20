# 08 — Trust Analysis

## Purpose
Assess whether users would entrust AIIMIN with journal, finances, documents, family, memories, and future plans — and why.

## Confidence
★★★★☆ — Strong doctrine + UI affordances. No security penetration test in this UX pass; privacy claims from product principles.

## Evidence Sources
Product Bible principles / never-build; Auth PIN; journal encryption claims; Account data export/delete; Family vault; Guest mode; SyncBanner; live waitlist professionalism; AI Logger routing.

## Files Used
`13_PRODUCT_PRINCIPLES.md`, `15_THINGS_NEVER_TO_BUILD.md`, Account sections, Journal, Family, Login, native biometric gate.

## Reasoning
Trust = predictability + honesty + control + competence. Marketing claims without matching UX destroy trust faster than silence.

## Dependencies
[[09_EMOTIONAL_DESIGN]] · [[10_MICROCOPY_AUDIT]]

## Consumers
Privacy UX, AI capture, Family progressive disclosure.

## Known Unknowns
Independent audit of journal encryption; user perception studies; incident history.

---

## Trust dimensions

| Dimension | Score /10 | Evidence |
|-----------|----------:|----------|
| Reliability | 6 | Sync paths exist; 404 batch policy can mask failed native sync; guest writes blocked |
| Privacy confidence | 7 doctrine / 5 felt | “Journal body never in analytics”; footer privacy; export/delete — but AI analyze & multi-device sync raise felt risk |
| Professionalism | 7 | Brand + waitlist polish; demo wins & GuestTour contradictions hurt |
| Consistency | 4 | Cross-platform IA + dual settings + Insights redirect |
| Predictability | 5 | Tier gates surprise; AI routing opaque when wrong |
| Transparency | 6 | Life Score contributors partially shown; inference consent still maturing |
| Brand confidence | 7 | Human Momentum coherent; ops jargon dilutes |

---

## Would users trust AIIMIN with…

### Journal / memories
**Conditional yes** for users who read privacy story and feel capture calm.
**Risks:** AI analyze; voice STT; mode CBT framing feels clinical-adjacent (Bible forbids clinical claims — copy must stay non-diagnostic). Native read-only detail + “edit on desktop” can feel like loss of control.

### Finances
**Cautious yes** if export works and categories aren’t shamey.
**Risks:** 6-field friction → under-logging → user blames self; What-If simulators can feel toy-like for real money.

### Documents / family
**Highest stakes.** Emergency card UX currently maximizes setup anxiety (20+ fields). Users may refuse to enter meds/allergies if UI feels like a form farm, not a care tool.
Bible: never infer emergency meds — good. Progressive wizard still needed for felt safety.

### Future plans (goals / arc / career)
**Yes for builders** who like explicit systems.
**Risk:** Arc blank page + public-seeming “Mission Control” tone can make intimate plans feel performative.

### Family
Trust requires household consent model. Product is personal OS — shared vault without clear multi-stakeholder UX is a trust gap.

---

## Trust builders (shipped)

- Export / wipe / delete account flows (high friction intentional on delete — good)
- Biometric gate on native
- PIN re-auth
- Guest mode honesty (“Data will not be saved”) when visible
- ProductTour: journal private by default; urge surf not streak shame
- SyncBanner states on native (pending/error/last synced)
- Locked palette + serious brand book

## Trust breakers (shipped or latent)

- GuestTour “No subscriptions — free to explore” vs real tiers
- Demo Recent Wins appearing real
- AI mis-route without obvious undo/correct
- Native “Life OS in your pocket” vs constant “on desktop”
- Waitlist urgency overclaiming readiness
- Inconsistent docs (`/m` missing in old audit; Product Guide native “not shipped”) — team trust, spills to product polish perception
- Telemetry not live while metrics promised — fine if quiet; harmful if dashboards fake certainty

---

## Sparring note

Security theater (PIN everywhere) can **increase** felt trust while **decreasing** activation trust (“do they think I’m under attack or is my life data that sensitive?”). Best path: biometric + passkey future (intelligence layer already suggests) with clear plain-language why.

---

## Cross-link
[[11_ACCESSIBILITY]] · [[18_RISK_REGISTER]] · [[14_FRICTION_ANALYSIS]]
