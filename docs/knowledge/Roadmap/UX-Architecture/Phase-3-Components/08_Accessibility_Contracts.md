---
authority: operations
derived_from: Genesis C-6 · P5 A11y · Phase 2 INV-14 · Intelligence 10 A11y · D15/D23
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 3-components
---

# 08 — Accessibility Contracts

A11y is **component API**, not afterthought (C-6).

## Contracts by family

| Family | Required a11y contract |
|--------|----------------------|
| Button/Icon button | Accessible name; keyboard operable; focus visible |
| Input/Textarea | Label (visible or aria); error linked; autocomplete where auth |
| Modal/Confirm/Drawer | Focus trap; escape; restore focus; labelled dialog |
| Empty/Alert | Appropriate role; LiveRegion for dynamic status |
| Nav / pins | Current page announced; BrandLockup targets distinct |
| Command palette | Keyboard complete path; results announced |
| List rows / HabitCircle | Name + state (done/not); not color-only |
| Metric | Text alternative for value meaning |
| Charts | **Text alternative / summary REQUIRED** (D23 weak) |
| Capture / PIN | Labels as Login evidence; touch targets on `/m` |
| Native | Platform a11y — map to same intents |

## Global a11y invariants (components)

| ID | Contract |
|----|----------|
| A11Y-C-01 | Hover never sole critical affordance |
| A11Y-C-02 | Reduced motion honored where motion exists (D15 gap → obligation) |
| A11Y-C-03 | Touch targets meet mobile capture requirements on `/m` |
| A11Y-C-04 | No information by color alone on status/metric |
| A11Y-C-05 | Decorative icons `aria-hidden`; interactive icons named |

## Out of scope here

WCAG certification scores · visual contrast token values (DS) — obligations only.
