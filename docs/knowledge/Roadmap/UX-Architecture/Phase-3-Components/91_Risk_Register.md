---
authority: operations
derived_from: 90_Component_Audit
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 3-components
---

# 91 — Risk Register (Phase 3)

| ID | Risk | Sev | Status | Mitigation |
|----|------|-----|--------|------------|
| P3-R01 | DS ships third Metric card anyway | S1 | Open | INV-C-03 · MERGE mandate |
| P3-R02 | Raw buttons bypass T0 forever | S1 | Open | DEP reuse P0 · debt tracking |
| P3-R03 | KokonutUI becomes default shell look | S1 | Mitigated in docs | T9 gate · INV-C-12 |
| P3-R04 | Charts ship without text alternatives | S1 | Open | A11Y charts · INV-C-14 |
| P3-R05 | `/m` gains score/metric widgets | S1 | Mitigated | D05 · CR-10 · INV-C-09 |
| P3-R06 | Native ignores web contracts | S2 | Open | CA-15 · T10 |
| P3-R07 | Waitlist styles leak into OS | S2 | Mitigated | T8 isolation |
| P3-R08 | Phase 3 mistaken for full program freeze | S1 | Mitigated | 93 scope |
| P3-R09 | Confirm pattern regresses to window.confirm | S2 | Open | INV-C-05 |
| P3-R10 | Slot model treated as React API law | S3 | Accepted | Slots = architecture regions |

## Blocking Phase 3 freeze?

**No.**
