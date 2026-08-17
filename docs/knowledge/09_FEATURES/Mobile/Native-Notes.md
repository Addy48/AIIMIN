---
authority: engineering
derived_from: 09_FEATURES/Mobile/Native-Graph-Sync
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: feature
note_type: NT-FEATURE
tags:
  - type/feature
  - domain/notes
  - status/living
---

# Native Notes

## One job

Park a thought. Not a diary (Journal) and not Capture money. Syncs via `note.upsert`.

## Placement

| Surface | Role |
|---------|------|
| **Today** | Strip under Signal, above phone OS — teaser + open vault |
| **Notes screen** | Full composer · pinned · vault list |
| **Config** | Pref row “Notes · Park thoughts” |
| **Capture** | `note:` prefix still settles into vault |

## Files

- `feature/notes/` — `NotesScreen` · `NotesViewModel`
- `core/data/NoteStore.kt`
- `GraphSyncRepository.enqueueNote` / `saveNote`

## Changelog

### 2026-08-08 — Today NotesStrip overlap fix
- **What:** Wrap NotesStrip children in `Column` inside `TapSurface` (Box). Titles/excerpts no longer paint on top of each other.
- **Why:** Device QA — `uiautomator` showed identical Y-bounds for multiple note titles
- **Files:** `feature/today/.../TodayScreen.kt` (`NotesStrip`)
- **Status:** shipped (AIN065 install verified — overlap_count 0)
- **Notes:** OPEN VAULT · N NOTES still under the three teasers

### 2026-08-08 — Full Notes surface
- **What:** Dedicated Notes route; Today strip relocated (after Signal); pin/edit/delete local; Config entry
- **Why:** Strip was teaser-only; founder asked complete feature + proper placing
- **Files:** feature/notes/*, NoteStore.kt, TodayScreen.kt, ConfigScreen.kt, AiiminShell.kt
- **Status:** shipped (device install pending this turn)
- **Notes:** Server delete mutation not in batch yet — delete is local hide

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

