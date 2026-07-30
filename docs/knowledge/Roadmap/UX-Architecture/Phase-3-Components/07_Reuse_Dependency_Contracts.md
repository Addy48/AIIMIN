---
authority: operations
derived_from: Intelligence 05 reuse scores · Genesis C-2/C-3 · Program-0 surface breadth
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 3-components
---

# 07 — Reuse and Dependency Contracts

## Reuse priority (from Intelligence DS candidates + debt)

| Priority | Family | Reuse contract |
|----------|--------|----------------|
| P0 | Button · Input · Confirm/Modal · Empty · Skeleton · Badge | Must be default; raw bypass = debt |
| P0 | Nav chrome · BrandLockup · Command | Shell-only reuse rules |
| P0 | StatusAlert · LiveRegion | System feedback |
| P1 | Capture/Logger · Mood · List rows | Domain + capture |
| P1 | Metric (merged) | Day/Reports read |
| P2 | Charts selective | Derived domains |
| P3 | Waitlist | Public only |
| Audit | KokonutUI · DesktopWindow | KEEP subset or REMOVE |

## Dependency rules

| ID | Rule |
|----|------|
| DEP-01 | Domain → may depend on T0–T2–T3–T5; not on T8 Waitlist |
| DEP-02 | T3 Capture → must not depend on T5 Metric as write path |
| DEP-03 | T2 Nav → must not depend on domain feature modules (cycle) |
| DEP-04 | T6 Charts → depend on T1 for L/E/Err |
| DEP-05 | T10 Native → no hard dependency on web CommandPalette |
| DEP-06 | `/m` → Capture + lite account deps only; **no** Score/Metric analytics deps |
| DEP-07 | T9 kokonutui → must not become dependency of T2 shell |
| DEP-08 | Changing Confirm/Capture default behavior → vault note (C-14) |

## Consumer obligations (downstream DS/Eng)

Reuse P0 families before inventing; Metric MERGE before new metric card; document contract diffs in vault.
