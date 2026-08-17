---
authority: operations
derived_from: Genesis C-4 · Phase 2 recovery · Intelligence 05/08
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 3-components
---

# 05 — Shared Behaviors and State Ownership

## Shared behaviors (cross-family)

| Behavior | Owning contract | Components |
|----------|-----------------|------------|
| Focus visible / keyboard | A11y · Phase 2 | T0 · T1 · T2 · T3 |
| Disabled / loading | C-4 | Interactive T0–T4 |
| Error + success feedback | C-7 · Phase 2 recovery | T1 Alert · field-level Input |
| Empty teach | INV-IX-09 | EmptyState |
| Offline / sync ambient | Phase 2 IX-CS-06 | Banners (shell) — not every domain reinvent |
| Destructive confirm | INV-IX-08 | ConfirmDialog |
| Undo affordance (where reversible) | Phase 2 undo REQUIRED | Capture/AI apply hosts — pattern shared |
| Live announcements | LiveRegion | Status changes |

## State ownership

| State | Who owns it | Who must not |
|-------|-------------|--------------|
| Component visual/interaction state (hover/focus/open) | Component | Page hacks bypassing contract |
| Field value / draft | Form/capture host surface | Random sibling widgets |
| Domain entity state (habit done, goal progress) | Domain / data layer | Metric read faking writes |
| Session / auth | Access gate | Domain components |
| Tier lock | Shell TierRouteGuard pattern | Silent hide without feedback |
| Sync/offline/conflict | Shell + sync hosts | Ignoring on desktop |
| AI processing | AI host (logger/palette) | Generic loading conflation only |
| Life Score value | Growth/Day read | `/m` components |

## Mandatory state matrix (architecture)

Every interactive family documents: **default · focus · disabled · loading · error · empty · success** (C-4). Missing = architectural defect (Intelligence: uneven today).
