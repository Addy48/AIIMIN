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

# 2026-07 Design System Session

#history #design

## Shipped (local, not necessarily pushed)

### Themes
- 4 themes → **2**: `aiimin-dark`, `aiimin-light`
- `tokens.css` full token blocks; orange accent unified
- View Transitions API for theme toggle (circular reveal)
- `themeTransition.js` + `ThemeContext.jsx` flushSync

### Navbar
- Masthead 68px, opaque
- Customizable pins 1–**10** (`navItems.js`, `useNavPreferences.js`)
- More dropdown for overflow
- Centered nav links (grid layout)
- Mobile bottom nav synced with pins

### Brand & typography
- BrandLockup unified; Figtree H1s; Bodoni wordmark only
- Design Lab at `/account?section=design`

### Overview fixes
- Micro-task single-field UI
- Week calendar hover clip fix

## Files touched

- `frontend/src/components/Navbar.jsx`
- `frontend/src/styles/tokens.css`
- `frontend/src/context/ThemeContext.jsx`
- `frontend/src/constants/navItems.js`
- `frontend/src/hooks/useNavPreferences.js`
- `frontend/src/components/settings/NavPinEditor.jsx`
- `frontend/src/index.css`

## Related

- [[03-Design/Themes]]
- [[03-Design/Navbar]]
- [[04-Deploy/Git-Push-Status]]
