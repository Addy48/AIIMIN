---
authority: operations
derived_from: NN #8 · C-UX-09 · Intelligence empty/success · freshness/cache
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 04 — Outcome and Content States

## ST-EMPTY — Empty

| Field | Definition |
|-------|------------|
| **Intent** | No data yet — **teach** next action (NN #8) |
| **Entry** | First visit · filters yield zero · cleared set |
| **Exit** | User creates/captures → content · navigates away |
| **Transitions** | ← Loading · → Success (first item) · → Failure (load failed mistaken as empty — forbidden) |
| **Ownership** | Domain + EmptyState T1 (Phase 3) |
| **Recovery** | Primary teach CTA (capture/create); never blank shame |
| **Accessibility** | Meaningful empty text; not icon-only |
| **Validation** | D07 voice debt → teach required; ≠ Failure |

## ST-OK — Success

| Field | Definition |
|-------|------------|
| **Intent** | Confirm completed user/system action or healthy loaded content |
| **Entry** | Write committed · load complete with data · AI apply confirmed |
| **Exit** | User continues · auto-dismiss toast · navigate |
| **Transitions** | ← Loading/AI · → Undo window (if reversible) · → Empty (if delete all) |
| **Ownership** | Host surface + StatusAlert/LiveRegion patterns |
| **Recovery** | N/A success; offer Undo when reversible |
| **Accessibility** | Announce success politely |
| **Validation** | Explicit feedback where Intelligence shows silent risk |

## ST-FAIL — Failure

| Field | Definition |
|-------|------------|
| **Intent** | Action/load failed — calm, actionable, blame-light (C-UX-09) |
| **Entry** | Network/API/validation/auth error · AI fail · OAuth fail |
| **Exit** | Retry succeeds · user cancels · Recovery path · navigate |
| **Transitions** | → Retry · → Offline · → Permissions · → Recovery · → Auth |
| **Ownership** | Host + system feedback |
| **Recovery** | Mandatory next step (Retry, fix field, sign-in, support path) |
| **Accessibility** | Error linked to fields; announced |
| **Validation** | Not shame; not empty-looking; Journey recovery weak → REQUIRED |

## ST-EXP — Expired

| Field | Definition |
|-------|------------|
| **Intent** | Time-bound grant/content/session artifact no longer valid |
| **Entry** | TTL elapsed · invite/link expired · stale challenge |
| **Exit** | Re-auth · renew · dismiss · return to Safe state |
| **Transitions** | → Authentication · → Session · → Failure · → Recovery |
| **Ownership** | Access/session hosts · domain for expiring artifacts |
| **Recovery** | Clear renew/re-request path |
| **Accessibility** | Explicit expiry reason |
| **Validation** | Distinguish from generic Failure |

## ST-FRESH — Data freshness

| Field | Definition |
|-------|------------|
| **Intent** | Communicate staleness vs fresh when cache/sync lag matters (Sports cache — Intelligence Constraints) |
| **Entry** | Cached read · last-synced age threshold · provider lag |
| **Exit** | Sync completes → fresh · user refreshes · Offline acknowledges stale |
| **Transitions** | ↔ Syncing · → Offline · → Partial · → Success |
| **Ownership** | Domain with cache (Sports, sync clients) + shell |
| **Recovery** | Refresh/Retry; label “last updated” |
| **Accessibility** | Stale announced, not color-only |
| **Validation** | Must not imply live when stale; honesty over vanity |
