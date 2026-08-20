---
authority: operations
derived_from: Intelligence Command/AI/Notifications · Phase 2 Search/AI/Attention
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 5-flows
---

# 05 — System Flows

## FL-SEARCH — Search

| Field | Definition |
|-------|------------|
| **Purpose** | Find destinations/actions — canonical = **Command palette** (desktop) |
| **Entry** | Keyboard command · palette affordance |
| **Exit** | Navigate/act · dismiss · no result |
| **Transitions** | Query → results → action · → AI inline if present · Empty results teach |
| **Dependencies** | Command T2 · CS-COMMAND · no global full-text hub |
| **Cross-surface** | Desktop only; `/m`/native use nav not palette |
| **Exceptional** | Incomplete shortcut map · no full-text |
| **Recovery** | Clear query · navigate pins · Failure provider |
| **Validation** | FA-09; do not invent Search hub |

## FL-NOTIF — Notifications

| Field | Definition |
|-------|------------|
| **Purpose** | Deserve-attention notices with clear action (immature → structure REQUIRED) |
| **Entry** | System/AI allowed window · user opens notification center |
| **Exit** | Act · dismiss · digest |
| **Transitions** | Notice → action surface · blocked if Hold (Phase 2) · Permissions push |
| **Dependencies** | DOM-SYSTEM · Phase 2 Attention · ST-PERM |
| **Cross-surface** | Desktop chrome; native push TBD under Ph3 cite — no invented Knock windows |
| **Exceptional** | Immature D16 · vanity drip forbidden |
| **Recovery** | Open settings permissions · Retry fetch |
| **Validation** | FA-13; INV-IX-11; Digest > drip |

## FL-AI — AI

| Field | Definition |
|-------|------------|
| **Purpose** | Mixed-initiative assist — logger structure + palette actions |
| **Entry** | Logger · Command · intelligence paths |
| **Exit** | Confirmed apply · cancel · chips corrected |
| **Transitions** | ST-AI → preview/chips → confirm → Success → Undo · Failure → Retry |
| **Dependencies** | Phase 2 AI model · ST-AI/UNDO · cost/trust visibility |
| **Cross-surface** | Desktop AI write; `/m` no Structure offers (DH-42) |
| **Exceptional** | Provider fail · silent-write debt D22 · voice experimental |
| **Recovery** | Retry · edit · Undo · never clinical |
| **Validation** | Confirm/correct; no decorative AI; FA-02 Catch first |
