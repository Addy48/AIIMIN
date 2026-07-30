# 18 — Risk Register

## Purpose
Catalog experiential risks that can destroy retention, trust, or identity over five years.

## Confidence
★★★★☆ — Triangulated from friction, trust, platform, emotional, and doctrine contradictions.

## Evidence Sources
Entire UX package; Product Bible never-build; Current-Context; stale Product Guide native status.

## Files Used
[[08_TRUST_ANALYSIS]] · [[12_PLATFORM_CONTINUITY]] · [[13_AI_SLOP_ANALYSIS]] · [[14_FRICTION_ANALYSIS]]

## Reasoning
Risk = likelihood × impact on five-year relationship. Includes product-doc drift as UX risk (team ships confusion).

## Dependencies
[[00_EXECUTIVE_SUMMARY]]

## Consumers
Founder, PM, UX lead, QA.

## Known Unknowns
Legal/compliance residual; market competitor shock.

---

## Risk register

| ID | Risk | Likelihood | Impact | Early signal | Mitigation direction |
|----|------|------------|--------|--------------|----------------------|
| R1 | Activation abandonment | High | Critical | Onboarding idle &gt;60s; incomplete PIN | O2 compression |
| R2 | Phone users feel second-class | High | Critical | Native desktop deferral complaints; `/m` bounce | O4 O9 O10 |
| R3 | Life Score guilt → avoidance | Medium | Critical | Opens drop after low score days | O16 |
| R4 | AI misclassification → Logger abandonment | Medium | Critical | Logger retry down | O12 |
| R5 | Ecosystem fragmentation | High | High | Cross-device support tickets; prototype confusion | O4 O19 O25 |
| R6 | Feature bloat / Lab tourism | Medium | High | Capture down, Lab opens up | O17; kill list |
| R7 | Trust leak from copy contradictions | Medium | High | GuestTour vs tiers; urgency vs readiness | O13; doc hygiene |
| R8 | Family vault never completed | High | Medium–High | Partial members; empty emergency | O8 |
| R9 | Becoming “productivity cult” they reject | Medium | Critical | XP &gt; capture; shame UI regress | Govern gamification |
| R10 | Slop identity erasure | Medium | High | Interchangeable screenshots | O5 O21 O22 |
| R11 | Search failure at archive scale | Medium | High (year 2+) | “I know I wrote it” failures | O14 |
| R12 | Privacy scare (inference/clinical vibe) | Low–Med | Critical | CBT modes + phenotyping without consent UX | Principles enforcement |
| R13 | Stale documentation → agent/UX drift | High | Medium | Guide says native unshipped | Vault update discipline |
| R14 | Security friction mistaken for safety theater | Medium | Medium | PIN fatigue workarounds (shared PINs) | Passkey/biometric path |
| R15 | Customization procrastination | Medium | Medium | Widget edit &gt; capture | O1 O5 |

---

## Contradiction risks (meta)

| Contradiction | UX danger |
|---------------|-----------|
| Anti-dashboard brand vs Day Control shell | Cognitive dissonance |
| Anti-shame doctrine vs streak/XP systems | Emotional whiplash |
| Capture-only `/m` vs Life OS ads | Betrayal |
| Rich companion docs vs capture-heavy native | Expectation gap |
| Intent-first Bible vs domain-first nav | Chronic planning friction |

---

## Risk ownership suggestion

- R1 R3 R9 R10 — Design + Product
- R2 R5 — Mobile + Product
- R4 R12 — AI + Privacy
- R8 — Family feature owner
- R13 — Vault steward (always-on)

---

## Cross-link
[[17_UX_OPPORTUNITIES]] · [[19_EXECUTIVE_SCORECARD]]
