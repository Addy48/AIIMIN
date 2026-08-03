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

# Git Timeline (curated)

#history

Repo: `~/Desktop/DASHBOARD PROJECT`  
**HEAD:** `4e28b7a2` — chore: temporary guest bypass (2026-06-24)

---

## Era 1 — Foundation (Apr–May 2026)

| Date | Commit | Event |
|------|--------|-------|
| 2026-04-17+ | `914ebf67`… | Routine sync commits; initial widgets |
| 2026-05-01 | `2c8f6242` | Initial setup |
| 2026-05-12+ | `b20193cd`… | User auth, dark mode, analytics dashboard |

## Era 2 — OS-ID & Supabase hardening (Jun 10, 2026)

| Commit | Event |
|--------|-------|
| `9491d22b` | OS-ID replaces username globally |
| `8dc908f1`–`c6ff4689` | Supabase pooler URL fixes; auth via Supabase JS |
| `2aeeb41b` | Premium modal 3-column redesign |
| `6a3bc85b` | UI alignments, PIN input fix |

## Era 3 — Theme & Overview (Jun 12, 2026)

| Commit | Event |
|--------|-------|
| `8dc0a819` | **Complete theme architecture overhaul** |
| `c3b352a7` | Overview rebuild: Quick Capture, Command Timeline |
| `c681d89c` | Week-scrollable timeline + calendar sync |
| `5cf398c0` | Admin panel os_id check |

## Era 4 — Sports & Account (Jun 14–16)

| Commit | Event |
|--------|-------|
| `b8fb9ba9` | Sports ESPN direct APIs + UI revamp |
| `d826402c` | AccountPage JSX fix + live telemetry |

## Era 5 — Clerk & AI (Jun 20, 2026)

| Commit | Event |
|--------|-------|
| `1c4f43b3` | Clerk auth + login UI |
| `a9d8ec37` | Complete Clerk integration |
| `d8fc0cc8` | Lab UX + Gemini model fixes |
| `2f7ca5c8` | **Universal Logger + AI Finance Import** |

## Era 6 — Rollback & guest (Jun 24)

| Commit | Event |
|--------|-------|
| `d00d2c95` | Force Vercel rollback deploy |
| `4e28b7a2` | Temporary guest bypass — **current HEAD** |

## Uncommitted (Jul 2026 sessions)

Not in git yet — see [[10-Sessions/2026-07-Design-System]], [[10-Sessions/2026-07-Nav-Logger-Fixes]]

---

## Related

- [[06-History/Build-Timeline]]
- [[04-Deploy/Git-Push-Status]]
