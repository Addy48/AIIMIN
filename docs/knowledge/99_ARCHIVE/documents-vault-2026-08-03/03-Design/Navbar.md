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

# Navbar

#design

## Masthead (desktop)

- Height: 68px (`--nav-height`)
- Brand zone left (hairline separator)
- **Centered** nav links (grid `1fr auto 1fr`)
- Actions right: theme, notifications, avatar, mobile menu

## Customizable pins

- **1–10** items in top bar (`NAV_MAX_PINNED`)
- Rest under **More** dropdown
- Settings: Account → Personalization → Navigation bar
- Storage: `localStorage` key `aiimin-nav-prefs`

## Mobile

- Hamburger drawer (all links)
- Bottom nav: first 4 pins + More (toggle in settings)

## Registry

`frontend/src/constants/navItems.js` — 12 routes

## History

- Was 4 hardcoded + 8 in More
- Design audit → masthead concept
- Jul 2026: centered layout, 10 max pins

## Related

- [[10-Sessions/2026-07-Design-System]]
- [[10-Sessions/2026-07-Nav-Logger-Fixes]]
