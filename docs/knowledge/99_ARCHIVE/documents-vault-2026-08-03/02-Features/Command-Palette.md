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

# Command Palette (Smart Logger)

#feature

**File:** `frontend/src/components/system/CommandPalette.jsx`  
**Shortcut:** **Space · L** (`frontend/src/utils/loggerShortcut.js`)

## Capabilities

- Navigate to any page
- Quick log: win, note, mood, voice, Smart AI Log
- Search-filtered action list

## Voice dictation

- **Does NOT** start on plain `v` or `Space` (fixed Jul 2026)
- **⌥⇧V** / **Alt+Shift+V** when in Smart AI Log or Voice Log mode
- Mic button opens AI log form without auto-starting mic

## Related

- [[02-Features/Journal]]
- [[09-Integrations/Gemini-AI]]
- [[10-Sessions/2026-07-Nav-Logger-Fixes]]
