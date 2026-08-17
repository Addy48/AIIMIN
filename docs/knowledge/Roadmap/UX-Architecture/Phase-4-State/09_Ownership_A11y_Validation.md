---
authority: operations
derived_from: 03–07 · Phase 3 A11Y · SA principles
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 09 — Ownership, Accessibility, Validation (cross-cut)

## Ownership rollup

| Layer | Owns |
|-------|------|
| Shell | Offline, Connectivity, Syncing ambient, Session gate, fatal Recovery, Tier Permissions |
| Access | Authentication, Session pending, biometric |
| Domain surface | Loading, Empty, Partial, Success, Failure, Freshness, domain Retry |
| Capture / AI hosts | AI processing, capture Success/Undo |
| Sync hosts | Syncing, Conflict, related Recovery |
| System T1 components | Skeleton, EmptyState, Alert, LiveRegion, Confirm (presentation contracts) |

## Accessibility rollup

| Requirement | Applies |
|-------------|---------|
| Announce dynamic changes (LiveRegion) | Success, Failure, Offline, Syncing, AI, Undo |
| Not color-only | Failure, Freshness, Permissions |
| Focus to recovery CTA | Failure, Recovery, Conflict, Auth errors |
| Keyboard Retry/Undo | Retry, Undo |
| Teach text in Empty | Empty |
| Busy ≠ only spinner | Loading, AI |

## Validation rollup

| Gate | Rule |
|------|------|
| V-S1 | Every catalog state defined with 8 fields |
| V-S2 | Intelligence GAP states marked REQUIRED (Undo, Conflict, desktop Offline, AI distinct) |
| V-S3 | Empty ≠ Failure; Loading ≠ Hold; AI ≠ Loading |
| V-S4 | `/m` has no score/analytics states |
| V-S5 | No shame retention messaging in Failure/Empty |
| V-S6 | Pending Session ≠ Failure |
| V-S7 | Trace to Genesis / Intelligence / Phase 1–3 |
