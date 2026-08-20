---
authority: operations
derived_from: 16_DOCUMENTATION/Vault-And-Repo-Simplification-Plan
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-TRACKER
tags:
  - type/tracker
  - domain/ops
  - status/living
---

# Simplification — Phase Tracker

> Master execution order. Full design: [[16_DOCUMENTATION/Vault-And-Repo-Simplification-Plan]].
> Ownership: Manus = prototype only. App built in-repo with Cursor.

**Started:** 2026-08-20 · **All listed phases executed this session.**

## Locked order — status

| # | Phase | Status | Evidence |
|---|-------|--------|----------|
| 1 | **V0** Hot-doc truth | `passed` | Home · Monorepo · Manus banner · 8 Roadmap indexes frozen |
| 2 | **R0** Truth Recon | `passed` | [[16_DOCUMENTATION/Truth-Recon-2026-08-20]] |
| 3 | **R1** Ghost recovery | `passed` | [[16_DOCUMENTATION/Ghost-Recovery-R1-2026-08-20]] |
| 4 | **V1** Cold Roadmap | `passed` | [[Maps of Content/Cold-Roadmap]] · Active-Work.base |
| 5 | **V2** Dupes diet | `passed` | 34 Archive stubs · ~1.2 MB removed |
| 6 | **V3** Native pack | `passed` | [[Maps of Content/Native-App]] |
| 7 | **V4** Beautify living | `passed` | 28 feature MOCs + arch skeletons |
| 8 | **V5** Blueprint spine | `passed` | Spine 118 lines · `Roadmap/Blueprint-Appendices/` |
| 9 | **V6** Genesis UX | `passed` | [[Dashboards/11_Law-Bookshelf]] |
| 10 | **R2** Client kill list | `passed` | [[10_DECISIONS/2026-08-20-client-kill-list]] |
| 11 | **R3** Commit slices | `passed` | [[16_DOCUMENTATION/Commit-Slice-Inventory-R3]] — **no commit** |
| 12 | **R4** Web diet | `passed` | [[16_DOCUMENTATION/Web-Surface-Diet-R4]] |
| 13 | **R5** Secrets hygiene | `passed` | Moved to `~/Documents/AIIMIN-SECRETS/` · [[07_DEPLOYMENT/Secrets-Location]] |
| 14 | **X** §8 backlog | `passed` | [[16_DOCUMENTATION/Simplification-Backlog-X]] |

## Founder next

1. Say which commit slice to land first (**S1** recommended).
2. Optional: `git fetch` + fast-forward local `main` to `origin/main` (`fc9e2a76`).
3. Optional: reconcile EC2 `main` ahead-28 weirdness before hard reset.
4. Mark Web diet rows kill/park as you prefer.
