---
authority: engineering
derived_from: 17_NATIVE_APP_V2/12_SYNC.md
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
  - domain/sync
  - status/living
---

# Native Graph Sync (notes · agenda · Life Score)

## What GraphSync hydrates now

| Entity | Pull | Push | Store / UI |
|--------|------|------|------------|
| Habits | bootstrap | `habit.tick` / `untick` | DayStore · Today |
| Journal | bootstrap | `journal.upsert` | JournalStore |
| Money | wealth GET | wealth POST + outbox | MoneyStore |
| **Notes** | bootstrap | `note.upsert` | NoteStore · Today strip |
| **Agenda** | bootstrap | — (read-only) | AgendaStore · Today strip |
| **Life Score** | bootstrap `lifeScore` + `GET intelligence/lhs` | — | PublishedLifeScoreStore · Today + Score |
| Speaking | `lab/summary` | `lab/practice/speaking` | SpeakingStore · English |

## Life Score rule

Server LHS only (`physical · cognitive · discipline · financial · emotional` → BODY · MIND · DISCIPLINE · MONEY · MOOD). Local provisional mark stays for “mark the day”; it does not replace published score.

## Server

`GET /api/mobile/bootstrap` now computes `lifeScore` via `getAnalyticsDataset(14)` + `summarizeLifeHealth` (was always null).

`user.username` is the Better Auth OS-ID. Native remembers it as the plate (`ConfigStore.rememberOsId`) — never derived from the email prefix.

## Files

- `GraphSyncRepository.kt` · `NoteStore.kt` · `AgendaStore.kt` · `PublishedLifeScoreStore.kt`
- `server/routes/mobile.js`
- Tests: `GraphHydrateStoresTest.kt`

## Changelog

### 2026-08-13 — Bootstrap returns username (OS-ID plate)
- **What:** `GET /api/mobile/bootstrap` `user.username` from the auth context. Native `applyRemoteIdentity` remembers a valid OS-ID; email never becomes the plate.
- **Why:** Phone biometric unlock needs the real OS-ID after Google-on-web signup.
- **Files:** `server/routes/mobile.js`, `ApiDtos.kt` `BootstrapUser.username`, `GraphSyncRepository.kt`, `ConfigStore.kt`
- **Status:** partial — assembleDebug BUILD SUCCESSFUL · device unverified
- **Notes:** Additive JSON field. No table/schema change.

### 2026-08-08 — Device QA + Capture notes + outbox + EC2 LHS
- **What:** Installed on AIN065; published LHS verified on Today; Capture `note:` settles via `note.upsert`; outbox drops answered failures (fixes stuck pending); EC2 hotfixed `mobile.js` bootstrap LHS
- **Why:** Phone reconnect · production path must sync and clear queue
- **Files:** CaptureViewModel.kt, GraphSyncRepository.kt, server/routes/mobile.js
- **Status:** shipped (device + API hotfix; git push still pending founder ask)
- **Notes:** Client also pulls `/intelligence/lhs` so score worked before bootstrap hotfix

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

