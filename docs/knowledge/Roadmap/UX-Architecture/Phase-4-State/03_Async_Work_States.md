---
authority: operations
derived_from: Intelligence 08 · DH-66 · Phase 2 · Skeleton/AI gaps
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 03 — Async Work States

## ST-LOAD — Loading

| Field | Definition |
|-------|------------|
| **Intent** | Show that requested content/action is in progress without implying Hold or success |
| **Entry** | User navigates/opens surface · pull/refresh · submit awaiting response |
| **Exit** | Data ready → content/success · fail → Failure · offline → Offline · timeout → Failure/Retry |
| **Transitions** | → Partial (some chunks) · → Empty · → Success · → Failure · → Offline · → AI processing (if AI-bound) |
| **Ownership** | Surface host + T1 Skeleton (Phase 3) |
| **Recovery** | Fail path must offer Retry or navigate away; never infinite skeleton |
| **Accessibility** | Announce busy where appropriate; not only spinner color |
| **Validation** | Not treated as Hold (DH-66); feedback mandatory (IX-15) |

## ST-PART — Partial

| Field | Definition |
|-------|------------|
| **Intent** | Show incomplete but usable truth — honesty over fake completeness (SA-13) |
| **Entry** | Subset of modules loaded · tier-limited · optional widgets off · some providers unavailable |
| **Exit** | Remaining modules resolve → Success/content · user dismisses unavailable · Failure on critical subset |
| **Transitions** | ↔ Loading · → Success · → Failure · → Empty (if zero usable) |
| **Ownership** | Surface / domain composing multiple sources |
| **Recovery** | Label unavailable parts; Retry per section; no silent blank modules |
| **Accessibility** | Each region announces available vs pending |
| **Validation** | Must not present Partial as full Success |

## ST-BG — Background work

| Field | Definition |
|-------|------------|
| **Intent** | Non-blocking work continues while user stays on surface (sync, upload, export prep) |
| **Entry** | User starts long task · auto-sync · file ingest (Finance drag — Intelligence) |
| **Exit** | Complete → Success ambient · fail → Failure/Retry · cancelled by user |
| **Transitions** | ↔ Syncing · → Success · → Failure · → Offline |
| **Ownership** | Shell ambient + initiating domain |
| **Recovery** | Visible status; cancel if safe; Retry on fail |
| **Accessibility** | LiveRegion polite updates; don’t steal focus |
| **Validation** | Must not modal-block like Hold unless destructive |

## ST-AI — AI processing

| Field | Definition |
|-------|------------|
| **Intent** | Distinct “intelligence working” — not generic Loading (SA-05) |
| **Entry** | Logger/palette/intelligence invoke (Intelligence AI surfaces) |
| **Exit** | Preview/chips ready · Success apply · Failure · user cancel |
| **Transitions** | → Success (with confirm if needed) · → Failure · → Undo-eligible after apply · never silent commit |
| **Ownership** | AI host (logger/command) |
| **Recovery** | Cancel · Retry · edit chips · Undo after apply (Phase 2 AI model) |
| **Accessibility** | Announce processing start/end; results focusable |
| **Validation** | Distinct from ST-LOAD; no clinical framing; `/m` no Structure AI offers (DH-42) |
