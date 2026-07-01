# Account Personalization

## Current state

- Theme and text-size controls exist in account personalization UI
- Text-size now persists in `user_profiles.font_scale` and hydrates on profile fetch
- Local bootstrap still applies immediately from localStorage and is reconciled with profile state after auth

## Key files

- `frontend/src/pages/account/sections/PersonalizationSection.jsx`
- `frontend/src/index.js`
- `frontend/src/hooks/useUserProfile.js`
- `server/services/userProfileService.js`
- `server/routes/account.js`

## Changelog

### 2026-07-04
- Moved: text scale from localStorage-only to backend-backed profile field
- Why: cross-device persistence and consistent login hydration
- Files: `server/migrations/029_user_profile_font_scale.sql`, `server/services/userProfileService.js`, `frontend/src/hooks/useFontScale.js`, `frontend/src/hooks/useUserProfile.js`
- Status: shipped
