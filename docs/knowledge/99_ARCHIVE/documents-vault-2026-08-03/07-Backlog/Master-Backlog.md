---
authority: none
status: superseded
superseded_by: docs/knowledge (canonical vault)
owner: founder
lifecycle: archive
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-COLD
graph_role: cold
note_type: NT-COLD
archived_from: ~/Documents/AIIMIN VAULT
archived_on: 2026-08-03
---

> [!danger] SUPERSEDED — DO NOT USE AS TRUTH
> Snapshot of the pre-Brain-OS `~/Documents/AIIMIN VAULT` (authored 2026-07-04).
> Its architecture claims are **factually wrong** for the current codebase: it names
> **Clerk** as auth (real: **Better Auth**, OS-ID+PIN — Clerk has 0 matches in the repo),
> a `backend/` directory and single `supabase_init.sql` (real: `server/` + `api/` with
> 48 numbered migrations), and git HEAD `4e28b7a2`. Kept for provenance only.
> Canonical: [[00_HOME]] · routing: [[00_ROUTING]].

# Master Backlog

Full detailed backlog lives on Desktop:

**`~/Desktop/AIIMIN_MASTER_BACKLOG.md`**

This note is the Obsidian entry point. Open that file for the complete tables, or read the summary below.

---

## Quick status

| Bucket | Count | Priority |
|--------|-------|----------|
| Pre-existing debt (A) | 6 | Phase 4 |
| Partial work (C) | 8 | Phase 2 |
| Production blockers (G) | 8 | Phase 0–1 |
| Security (J) | 11 | Phase 1 |
| Debug cleanup (K) | 2 | **Phase 0 first** |

---

## Phase 0 (do before push)

1. [[05-Security/Debug-Instrumentation]] — remove agent log fetches
2. [[04-Deploy/Git-Push-Status]] — commit + push uncommitted work
3. [[02-Features/Waitlist]] — fix count masking + prod verify

---

## Links

- [[06-History/Git-Timeline]]
- [[05-Security/Production-Gap-Report]]
- [[08-Migration/AWS-Cognito-Exploration]]
- [[00-Home]]
