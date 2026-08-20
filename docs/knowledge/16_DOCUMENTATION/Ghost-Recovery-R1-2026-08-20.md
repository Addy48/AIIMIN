---
authority: operations
derived_from: 16_DOCUMENTATION/Truth-Recon-2026-08-20
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-RECON
tags:
  - type/recon
  - domain/ops
  - status/living
---

# Ghost recovery — R1 (2026-08-20)

> Pair with [[16_DOCUMENTATION/Truth-Recon-2026-08-20]]. **No commit this phase** — founder must ask.

## EC2 (SSH Verified)

| Field | Value |
|-------|-------|
| Host | `ubuntu@13.207.146.15` · `/home/ubuntu/AIIMIN` |
| `git` HEAD | `1cb24104` — `feat(android-v3): screen map, DataStore, live OS-ID` |
| Branch line | `main...origin/main [ahead 28]` |
| Dirty | `M server/routes/mobile.js` · `?? server/lib/journalMode.js` · `?? server/lib/mobileIdempotency.js` · `?? logs/` |
| Migrations on box | through `048_*` only — **no** `049`–`052` |

## Byte match (local WT ↔ EC2)

| File | md5 | Verdict |
|------|-----|---------|
| `server/routes/mobile.js` | `464595d5d2b78ba0e8805740f0892358` | **Identical** (includes `note.delete`) |
| `server/lib/mobileIdempotency.js` | `434a653277b3d9366f4d04fdce740fcb` | **Identical** · untracked both sides |
| `server/lib/journalMode.js` | `17a3b5ad2f356a10afb61fde9edf483f` | **Identical** · untracked both sides |

## Git vs live API code

| Location | `note.delete`? |
|----------|----------------|
| Local HEAD `67c087fe` | No |
| Local `main` `bd7cf38e` | No |
| `origin/main` / Vercel | No (web only) |
| Local working tree | **Yes** |
| EC2 working tree | **Yes** (same bytes) |

**R1 goal met:** ghost is **in local working tree**, ready for a future commit slice. EC2 already running that WT file; `git reset --hard` on EC2 would still wipe it until committed + deployed.

## Remaining ghosts / risks

1. **EC2 `main` ahead 28 of `origin/main`** at a feat commit — deploy story confused. Needs founder-aware reconcile (Phase R3 / ship).
2. **Migrations `049`–`052`** exist locally untracked; **absent on EC2 disk**. Unknown if applied to Supabase.
3. **Other local modified routes** (`dailyLogs`, `discipline`, `family`, `focus`, `habits`, `journal`, `lab`, `wealth`, `correlationService`) — not proven identical on EC2 this pass.
4. Ban future scp-only hotfixes — commit then Action/SSH deploy script.

## Ready commit slice (when founder says commit)

Suggested slice name: **`api-mobile-note-delete-idempotency`**

- `server/routes/mobile.js`
- `server/lib/mobileIdempotency.js`
- `server/lib/journalMode.js` (if journal mode ships with same unit)
- optionally migrations `049`–`052` after DB apply decision

Do **not** mix with V3 kotlin or vault-only files.
