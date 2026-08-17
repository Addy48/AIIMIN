---
authority: operations
derived_from: Intelligence Today/Capture journeys · Phase 1 Day/Capture · D05 · Catch spine
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 5-flows
---

# 03 — Core Day and Capture Flows

## FL-TODAY — Today

| Field | Definition |
|-------|------------|
| **Purpose** | Day spine — orient, plan, capture entry, calm Life Score read |
| **Entry** | Wordmark → Today · pin Today · post-auth/onboarding land · native Home analogue |
| **Exit** | Navigate pins · open Capture/AI · open Reports period · logout |
| **Transitions** | → Capture · → Search/Command · → domain pins · → Account · Loading→Partial/Success/Empty |
| **Dependencies** | DOM-DAY · Growth score seat · widgets (REDESIGN target — not UI now) · Phase 4 states |
| **Cross-surface** | CS-DAY · CS-SCORE (score on Today/Home, never `/m`) |
| **Exceptional** | Widget overload (D06) · tier-locked widget deps · offline partial day |
| **Recovery** | Retry load · Empty teach · Partial honesty · no `/m/score` fallback |
| **Validation** | Day primary (FA-04); route evidence `/overview` until eng ALIGN (D01) |

## FL-CAPTURE — Capture

| Field | Definition |
|-------|------------|
| **Purpose** | Fast Catch of intent/data — structure later |
| **Entry** | Logger on Today · `/m` root · Journal/Notes create · Native journal/notes |
| **Exit** | Saved/synced · AI preview/confirm · abandon |
| **Transitions** | Catch → Settle · → AI processing → confirm/chips · → Undo window · → Offline queue |
| **Dependencies** | T3 Capture components · ST-AI/UNDO · no Structure-first gate |
| **Cross-surface** | CS-CAPTURE (`/m` write → desktop/native structure) |
| **Exceptional** | Offline queue uneven · undo missing (D10) · journal studio complexity |
| **Recovery** | Retry save · draft resume · Undo · conflict resolve if sync |
| **Validation** | FA-02/05; `/m` capture-only; Enter-to-save; no score tools on `/m` |
