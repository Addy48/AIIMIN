---
authority: engineering
derived_from: Genesis/P8 · Genesis/P9
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
migration_batch: W4
fm_source: script
---
# 12 — Sync Architecture

> **Depends:** [[09_BACKEND]] [[10_DATABASE]] [[11_AUTHENTICATION]]  
> **Status:** Complete draft · 2026-07-19

---

## 1. Devices in scope

Android · iOS · Web · iPad web · Desktop web — **same user truth**.

---

## 2. Model

**Server authoritative** for committed data.  
**Room/local DB** authoritative for offline UX until ack.

```
Pull: GET /sync?since=cursor → {upserts, tombstones, next_cursor}
Push: POST /sync/batch Idempotency-Key [{entity, op, payload, client_mutated_at}]
```

---

## 3. Conflict resolution

| Entity | Strategy |
|--------|----------|
| Habit completion per day | LWW by `client_mutated_at` then server |
| Habit definition | LWW + optional merge name |
| Goal progress | Max(progress) if numeric else LWW |
| Journal / notes body | **Manual merge UI** if both dirty; else LWW |
| Finance tx | Prefer both if different idempotency keys (no silent drop). Native wealth POST: `Idempotency-Key` → `mobile_idempotency` (same store as sync/batch). Client money outbox dedupes `notes=mobile:<clientKey>`. |
| Preferences | LWW |

---

## 4. Optimistic updates

UI applies mutation → enqueue → rollback on hard fail · undo window for ticks.

---

## 5. Realtime

Optional websocket/Realtime for habit/score when online multi-device.  
Fallback: pull on foreground / every N min.

---

## 6. Retry queue

Exponential backoff · jitter · dead-letter after N · user-visible sync error.

---

## 7. Ordering

Per-entity clocks · causal: don’t apply completion before habit exists (server accepts and creates dependency or rejects with instruction).

---

## 8. Bandwidth

Batch · gzip · field masks · blob separate.

---

## 9. Security

Auth on all sync · rate limit · payload size cap · no cross-user cursors.

---

## V3 client (2026-08-05)

`native-android-v3` live path (not the older Room/WorkManager draft above):

| Direction | Endpoint / action |
|-----------|-------------------|
| Pull | `GET /mobile/bootstrap` · `GET /wealth/transactions` · `GET /wealth/budgets` |
| Push batch | `POST /mobile/sync/batch` — `habit.tick` · `habit.untick` · `journal.upsert` · `note.upsert` · `note.delete` |
| Push money | `POST /wealth/transactions` — Capture settle · payment approve; failures queue locally |
| Auth | Better Auth email/username + PIN · cookie jar + Bearer |
| UI | Pull-to-refresh Today/Money · Config Sync · Sign out |
| Durability | DataStore outbox JSON · WorkManager 15m + resume oneshot |

Code: `GraphSyncRepository` · `AuthRepository` · `SessionRepository` · `SyncWorker`.

---

*Next: [[13_OFFLINE]]*
