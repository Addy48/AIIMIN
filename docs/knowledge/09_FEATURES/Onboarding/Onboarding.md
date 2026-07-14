# Onboarding

## Decision (H)

New accounts must pick a **life-mode preset** (Student / Working professional / Founder / Family / Athlete / Custom) before first Today landing.  
Custom remains available and fully manual — but is **not** a silent skip default.

Existing accounts: pin data is **never** retroactively rewritten by this flow.

## Files

- `frontend/src/pages/Onboarding.jsx`
- Presets: `frontend/src/constants/navItems.js` → `NAV_PERSONA_PRESETS`
- Apply via `useNavPreferences().applyPersonaPreset`

## Changelog

### 2026-07-14 — Life-mode step before Today
- **What:** Onboarding inserts explicit life-mode preset step after wake-up / before baseline. Custom allowed only when clicked. Applies `applyPersonaPreset` before `/overview`. Existing accounts untouched.
- **Why:** Track H
- **Files:** `frontend/src/pages/Onboarding.jsx`, `frontend/src/constants/navItems.js`, `frontend/src/hooks/useNavPreferences.js`
- **Status:** local (protocol screenshots pending)
- **Schema migrations:** none
