---
authority: operations
derived_from: 16_DOCUMENTATION/Simplification-Phase-Tracker
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

# Truth Recon — Local | Git | Vercel | EC2 (2026-08-20)

> Phase **R0** evidence. Refresh when shipping. Tracker: [[16_DOCUMENTATION/Simplification-Phase-Tracker]].

## Matrix

| Surface | Value | Label |
|---------|-------|-------|
| Local branch | `feat/native-android-v3` | Verified |
| Local HEAD | `67c087fe` | Verified |
| Local `main` tip | `bd7cf38e` feat(family): card menu… | Verified — **stale vs origin** |
| `origin/main` | `fc9e2a76` docs: lead public README… | Verified |
| Vercel production | READY · `fc9e2a76` · target production · project `aiimin` | Verified (MCP list_deployments) |
| Vercel preview feat branch | ERROR · `67c087fe` on `feat/native-android-v3` | Verified — preview broken |
| EC2 API health | `https://api.aiimin.in/api/health` → `{"status":"ok"}` | Verified |
| EC2 git SHA | **unknown** — health has no SHA field | Blocked |
| Working tree | ~243 modified · ~117 untracked | Verified |
| Commits local HEAD ahead of local `main` | **26** | Verified |
| Commits local HEAD behind local `main` | **0** | Verified |

## Drift story (plain)

1. **Production web (Vercel)** tracks **`origin/main`** at `fc9e2a76` (README docs commit on `docs/public-readme` lineage).
2. **Local `main`** is behind at `bd7cf38e` — founder machine has not fast-forwarded `main`.
3. **Active work** is on `feat/native-android-v3` @ `67c087fe` **plus a huge dirty tree** (V3 modules, legal pages, vault plan, server edits).
4. **API** is up, but we **cannot** prove which git SHA EC2 runs (no SHA in `/api/health`). Context historically claimed `note.delete` via scp.

## Ghosts / local-only

| Item | State |
|------|-------|
| `note.delete` in `server/routes/mobile.js` | **In working tree** (lines ~321–328). **Not** in HEAD, **not** in `main`, **not** on origin/feat tip. Uncommitted. |
| Migrations `049`–`052` | On disk, **untracked** |
| Migrations `040`–`048` | On disk and **tracked** |
| Legal pages / AndroidApp / consent | Untracked under `frontend/src/` |
| Large V3 kotlin trees | Many untracked under `native-android-v3/` |
| Vault simplification notes | New/untracked or modified under `docs/knowledge/` |

## What live has that local branch tip lacks

- Vercel prod = `origin/main` README commit — not in `feat/native-android-v3` ancestry (merge-base check).
- Possible EC2-only patches beyond `note.delete` — **Blocked** until SSH inventory (Phase R1 / deploy SSH).

## What local has that live lacks

- Entire dirty working tree + 26 commits of native V3 feat not on `main`/Vercel prod.
- Untracked migrations 049–052 (may or may not be applied on Supabase — not checked this pass).

## Next (R1)

1. Keep `note.delete` in working tree; prepare as commit-slice when founder asks.
2. Optional: SSH EC2 and `git rev-parse HEAD` + diff `mobile.js` — only if founder permits.
3. Document remaining ghosts after file compare.

## Commands used

```bash
git rev-parse HEAD main origin/main
curl -sS https://api.aiimin.in/api/health
# Vercel MCP list_deployments project prj_VhXm0y6sc4TY3SMHXLEfJb4AQPRg
```
