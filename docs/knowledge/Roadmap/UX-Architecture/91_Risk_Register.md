---
authority: operations
derived_from: 90_Architecture_Audit
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
---

# 91 — Risk Register (Founder Audit)

Severity: S1 high · S2 med · S3 low  
Status: Open · Mitigated · Accepted

| ID | Risk | Sev | Status | Evidence | Mitigation / handling |
|----|------|-----|--------|----------|------------------------|
| R-01 | Deliverable filename churn (Open Decisions/Evidence/Surface numbers shifted as Founder ordered early artifacts) | S3 | Accepted | `05` vs `06` historical strings | Catalog in `06` is SoT for filenames; roadmap planned-file table points to catalog |
| R-02 | No formal Open Decisions Register for remaining Intelligence S1 debts (D01–D04, D06+, D20…) | S2 | Open | Catalog D09 not written; D05 closed only in IA §7 | Create `09_Open_Decisions_Register` before next architecture bodies / full freeze |
| R-03 | Evidence Binding protocol (`10_Evidence_Binding`) not yet written | S2 | Open | Catalog D10 missing | Required before Surface/Journey bodies for citation discipline |
| R-04 | IA cites Genesis primarily via Intelligence Alignment + C-UX chain (not direct P8 path on every IA row) | S3 | Accepted | User ordered Intelligence-only for IA body | C-UX + Alignment remain mandatory companions; Validation Report later checks chain |
| R-05 | Account/Settings MERGE · Insights→Reports · Identity MERGE are architecture targets — eng not done; drift if forgotten | S2 | Open | IA §13 | Downstream handoff + Decision Register must list before publication |
| R-06 | `/m` account lite retained under capture ceiling — boundary ambiguity vs pure capture-only | S2 | Accepted | Intelligence routes `/m/account`; IA KEEP lite | BR-01 allows account lite only; score/tools still forbidden |
| R-07 | Native Home as score analogue — Intelligence does not prove Home currently shows Life Score | S2 | Open | IA §7 native analogue | Surface Architecture must verify/keep as continuity *intent* not invented feature claim |
| R-08 | Full program mistaken for Phase 1 freeze | S1 | Mitigated | Freeze Recommendation scopes Phase 1 only | Certificate language: foundation freeze ≠ program PUBLISHED |
| R-09 | Stale D05 open language (pre-patch) | S2 | **Mitigated** | Was in 03/05/06/07 | Patched this audit turn |
| R-10 | Parallel launch ops change UX without Architecture update | S2 | Open | Program 0 parallel track · C-UX-17 | Process rule; watch waitlist/`/m` changes |

## Residual blocking full program freeze

R-02 · R-03 · unfinished bodies (Journey/State/Interaction/Handoff/Validation) · Founder Acceptance (Phase 13).

## Not residual for Phase 1 foundation freeze

R-09 mitigated · D05 closed · Genesis/Intelligence unmodified · no impl/visual/eng leak in artifacts.
