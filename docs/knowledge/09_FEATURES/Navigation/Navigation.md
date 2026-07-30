---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
migration_batch: W4
fm_source: script
---

# Navigation

## Parent

- [[09_FEATURES/Index]]

## Current state

- Free-pin 1–12 (user order). No sidebar. No forced grouping.
- **Pinned destinations stay in the primary masthead.** Unpinned active sections live under **More (N)**.
- Notes + Reports are pinnable. More menu always offers “Customize navigation…”

## Reject

- Sidebar navigation  
- Forced module taxonomy replacing free pin  
- Removing ability to pin up to 12 items  

## Files

- `frontend/src/constants/navItems.js`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/hooks/useNavPreferences.js`
- `frontend/src/components/settings/NavPinEditor.jsx`
- `frontend/src/components/system/CommandPalette.jsx`

## Changelog

### 2026-07-15 — Notes visible + pin restore
- **What:** Notes added to `NAV_REGISTRY` (default pinned after Journal); existing prefs migrate Notes into active+pinned when room. Priority+ width overflow of pins removed — **pinned = primary masthead**, unpinned actives = `More (N)`. More always includes “Customize navigation…”
- **Why:** Notes missing from nav; pin-to-tail overflow felt broken
- **Files:** `navItems.js`, `useNavPreferences.js`, `Navbar.jsx`
- **Status:** local
