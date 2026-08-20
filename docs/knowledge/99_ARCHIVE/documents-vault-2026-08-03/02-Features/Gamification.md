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

# Gamification

#feature

## XP Engine (`xpEngine.js`)

- 10 ranks: Apprentice → Grandmaster
- Daily XP per metric (sleep +30, gym +25, etc.)
- Streak multiplier 1.0× → 2.5×
- 16 quests (deterministic daily pool)
- 16 achievements with auto-detection

## Sound (`soundEngine.js`)

Web Audio API: bell, chime, levelUp, xp

## Tables (Section 15)

- `user_xp`, `xp_log`, `achievements`

## Mobile integration

`MobileApp.jsx` — save handler calculates XP, upserts ranks

## Related

- [[02-Features/16-Locked-Features]]
- [[01-Architecture/Database-Schema]]
