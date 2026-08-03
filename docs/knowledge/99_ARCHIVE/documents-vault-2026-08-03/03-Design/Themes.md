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

# Themes

#design

## Live themes (2)

| ID | Label | Default |
|----|-------|---------|
| `aiimin-dark` | AIIMIN Dark | ✅ default |
| `aiimin-light` | AIIMIN Light | |

Legacy aliases map to these (`vercel`/`midnight` → dark; `nordic`/`studio` → light).

## Tokens

`frontend/src/styles/tokens.css`  
`frontend/src/constants/themes.js`  
`frontend/src/context/ThemeContext.jsx`

## Transitions

`frontend/src/utils/themeTransition.js`
- View Transitions API: circular reveal from click point
- Fallback: overlay crossfade
- Respects `prefers-reduced-motion`

## Design Lab

`/account?section=design` — isolated `--proto-*` tokens for experiments only.

## Palette (locked)

See [[03-Design/Color-Palette]]

## Related

- [[10-Sessions/2026-07-Design-System]]
