---
authority: operations
derived_from: Mission list · Intelligence 08 · Phase 2 recovery
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 02 — State Catalog

| State ID | Name | Family | Detail doc | Intelligence reality |
|----------|------|--------|------------|----------------------|
| ST-LOAD | Loading | Async | [[03_Async_Work_States]] | ● many / Skeleton |
| ST-PART | Partial | Async | 03 | ○ implied (partial features) |
| ST-BG | Background work | Async | 03 | ○ sync/AI related |
| ST-AI | AI processing | Async | 03 | ○ weak distinct |
| ST-EMPTY | Empty | Content | [[04_Outcome_and_Content_States]] | ●/○ teach uneven |
| ST-OK | Success | Content | 04 | ● uneven feedback |
| ST-FAIL | Failure | Content | 04 | ●/○ |
| ST-EXP | Expired | Content | 04 | — rare; REQUIRED where TTL |
| ST-FRESH | Data freshness | Content | 04 | Sports/cache stale risk |
| ST-OFF | Offline | Connectivity | [[05_Connectivity_and_Sync_States]] | ● `/m`/native · ○ desktop |
| ST-CONN | Connectivity | Connectivity | 05 | related offline |
| ST-SYNC | Syncing | Connectivity | 05 | ● banners |
| ST-PERM | Permissions | Access | [[06_Auth_Session_Permission_States]] | tier · OAuth · bio |
| ST-AUTH | Authentication | Access | 06 | Login · callback |
| ST-SESS | Session | Access | 06 | pending access · expiry |
| ST-UNDO | Undo | Recovery | [[07_Undo_Retry_Recovery_States]] | **missing** D10 |
| ST-RETRY | Retry | Recovery | 07 | ○ |
| ST-RECOV | Recovery | Recovery | 07 | journeys weak |

**Also required (Intelligence, not renamed out):** Conflict (ST-CONF) under Recovery — see 07.

## Maturity key

REQUIRED = must exist in product UX architecture · PRESENT = evidenced · GAP = Intelligence missing/weak
