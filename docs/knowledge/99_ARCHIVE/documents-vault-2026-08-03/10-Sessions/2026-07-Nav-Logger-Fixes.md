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

# 2026-07 Nav & Logger Fixes

#history

## Logger shortcut evolution

1. ⌘K → ⌥Space / Alt+Space (OS conflicts)
2. → **Space · L** chord (700ms window)
3. Voice: removed Space toggle; **⌥⇧V** only in log mode

## Voice vs typing fix

- Mic header button no longer auto-starts listening
- Plain `v` in search is just text
- Space chord disabled while palette open

## Navbar

- Max pins: 7 → 9 → **10**
- Links centered between brand and actions

## Related

- [[02-Features/Command-Palette]]
- [[03-Design/Navbar]]
