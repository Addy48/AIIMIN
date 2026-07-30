---
authority: operations
derived_from: D10 · D09 · Phase 2 undo/recovery · Intelligence conflict gaps
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 07 — Undo, Retry, Recovery States

## ST-UNDO — Undo

| Field | Definition |
|-------|------------|
| **Intent** | Reverse a reversible write within a window (capture, toggle, AI apply) |
| **Entry** | After Success on reversible action |
| **Exit** | Undo applied · window expires · user continues |
| **Transitions** | ← Success · → Success (restored) · → Expired (undo window) · → Failure |
| **Ownership** | Host that committed write + shared undo pattern (Phase 2 REQUIRED · D10 GAP) |
| **Recovery** | Undo itself is recovery; if undo fails → Retry/Failure |
| **Accessibility** | Undo control named; announce restore |
| **Validation** | REQUIRED architectural; irreversible never fake-undo (use Confirm) |

## ST-RETRY — Retry

| Field | Definition |
|-------|------------|
| **Intent** | Re-attempt failed or interrupted operation without losing user intent |
| **Entry** | From Failure · Offline restored · Sync fail · AI fail |
| **Exit** | Success · Failure again · user cancel |
| **Transitions** | → Loading/AI/Syncing · → Success · → Failure · → Offline |
| **Ownership** | Same owner as failed operation |
| **Recovery** | Preserve inputs; don’t wipe forms |
| **Accessibility** | Retry control reachable by keyboard |
| **Validation** | Always offered when Failure recoverable |

## ST-RECOV — Recovery

| Field | Definition |
|-------|------------|
| **Intent** | Broader return to safe usable state after error, conflict, crash, or lost draft |
| **Entry** | Failure · Conflict · ErrorBoundary · draft resume · OAuth opaque fail |
| **Exit** | Stable content · Auth · Empty teach · user abandons |
| **Transitions** | → Retry · → Undo · → Auth · → Empty · → Success · → Conflict resolve |
| **Ownership** | Shell (fatal) + domain (drafts) + sync (conflict) |
| **Recovery** | Self-describing steps; draft resume (Onboarding/Journal gaps → REQUIRED) |
| **Accessibility** | Stepwise instructions; focus to primary recovery action |
| **Validation** | Journey “recovery weak” → MUST strengthen; no shame |

## ST-CONF — Conflict (required companion)

| Field | Definition |
|-------|------------|
| **Intent** | Divergent local/remote versions need user choice (Intelligence Conflict missing — D09) |
| **Entry** | Sync detects conflict |
| **Exit** | User chooses version/merge policy → Syncing/Success · defer |
| **Transitions** | ← Syncing · → Success · → Failure · → Offline |
| **Ownership** | Sync hosts |
| **Recovery** | Explicit choose/keep/replace — never silent clobber |
| **Accessibility** | Options clearly labeled |
| **Validation** | REQUIRED where sync exists (`/m`, native, calendar) |
