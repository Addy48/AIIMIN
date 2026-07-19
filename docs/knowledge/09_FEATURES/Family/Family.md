# Family Vault

Route: `/family` · `frontend/src/pages/Family.jsx`

## Card actions (all tabs)

Every record card uses `FamilyCardMenu` (⋯) with:

- **View Details** — read-only modal
- **Edit** — opens prefilled save modal (Supabase update)
- **Duplicate** — inserts copy
- **Archive** — hides card (localStorage per user; no schema change)
- **Delete** — confirm + Supabase delete

Tabs covered: Members, Documents, Insurance, Health, Vehicles, Finance, Relationships, Reminders, Emergency.

## Files

- `frontend/src/components/family/FamilyCardMenu.jsx`
- `frontend/src/components/family/FamilyRecordDetails.jsx`
- `frontend/src/pages/Family.jsx`

## Changelog

### 2026-07-19 — Card ⋯ menu + edit across Family section
- **What:** Replaced per-card ✕ delete with three-dots menu; full edit/update on all 9 Family tabs
- **Why:** User needs to fix data entry mistakes after save
- **Files:** `Family.jsx`, `FamilyCardMenu.jsx`, `FamilyRecordDetails.jsx`
- **Status:** shipped (local build pass; deploy on push)
