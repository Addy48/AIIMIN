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

# Two Views — Desktop vs Mobile

#architecture

## Desktop (`/`)

Full dashboard:
- Analytics, charts, insights
- Pomodoro, reports, lab
- Command palette ([[02-Features/Command-Palette]])
- Masthead navbar ([[03-Design/Navbar]])

## Mobile (`/m`)

**Data collection ONLY** per AGENTS.md constraint:
- `MobileApp.jsx` — state + save + XP
- 9 sections: sleep, body, mind, tasks, money, notes, wins, DSA, reset
- No analytics, no pomodoro, no insight engine on mobile

## Bottom nav

Mobile-only tab bar synced with nav pin prefs. See [[03-Design/Navbar]].
