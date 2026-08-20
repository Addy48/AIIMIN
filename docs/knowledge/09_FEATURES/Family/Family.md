---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-FEATURE-LEAF
migration_batch: W4
fm_source: script
---

# Family Vault

## Parent

- [[09_FEATURES/Index]]

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

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Current state

Status / scope / last meaningful change. Update when behavior changes.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Related

- [[09_FEATURES/Index|Features Index]]
- [[15_MEMORY/Current-Context]]

