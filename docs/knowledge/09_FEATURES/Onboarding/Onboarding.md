# Onboarding

## Decision (H)

New accounts must pick a **life-mode preset** (Student / Working professional / Founder / Family / Athlete / Custom) before first Today landing.  
Custom remains available and fully manual — but is **not** a silent skip default.

Existing accounts: pin data is **never** retroactively rewritten by this flow.

## Product tour (post-auth)

- Component: `frontend/src/components/onboarding/ProductTour.jsx` + `frontend/src/styles/productTour.css`
- Storage: `aiimin_tour_v2_completed` — any value suppresses auto-invite forever (`true` finished, `dismissed` Not now / close)
- **Not now / X / Esc / Skip** never re-prompts; retake only via Account → Personalization (or Settings)
- Manual `window.startProductTour()` does **not** clear the opt-out flag
- First-run **invite card**: Start tour / Not now
- **8 stops** — Today → Habits → Journal → Notes → Discipline → Focus → Reports?tab=patterns → Account
- Keyboard: ←/→/Enter/Esc; Event: `aiimin:start-tour`

## Files

- `frontend/src/pages/Onboarding.jsx`
- `frontend/src/components/onboarding/ProductTour.jsx`
- `frontend/src/styles/productTour.css`
- Presets: `frontend/src/constants/navItems.js` → `NAV_PERSONA_PRESETS`
- Apply via `useNavPreferences().applyPersonaPreset`
- Retake: `frontend/src/pages/account/sections/PersonalizationSection.jsx` · `frontend/src/pages/Settings.jsx`

## Changelog

### 2026-07-15 — Tour Not now = permanent opt-out
- **What:** Auto-invite never returns after Not now / X / Esc / Skip. Retake only Account → Personalization (and Settings). Manual start no longer clears storage.
- **Why:** User: stop asking again and again
- **Files:** `ProductTour.jsx`, `PersonalizationSection.jsx`, `Settings.jsx`
- **Status:** local

### 2026-07-15 — Product tour revamp
- **What:** Replace 12-step brochure tour + green pill with invite card, progress, lessons on real Life OS routes (incl. Notes/Discipline/Reports patterns). Settings starts tour in-place.
- **Why:** User asked major onboarding tour revamp
- **Files:** `ProductTour.jsx`, `productTour.css`, `Settings.jsx`
- **Status:** local

### 2026-07-14 — Life-mode step before Today
- **What:** Onboarding inserts explicit life-mode preset step after wake-up / before baseline. Custom allowed only when clicked. Applies `applyPersonaPreset` before `/overview`. Existing accounts untouched.
- **Why:** Track H
- **Files:** `frontend/src/pages/Onboarding.jsx`, `frontend/src/constants/navItems.js`, `frontend/src/hooks/useNavPreferences.js`
- **Status:** shipped
- **Schema migrations:** none
