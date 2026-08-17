---
authority: operations
derived_from: P8 Ch14 · D08/D09 · Intelligence offline/sync · Phase 2 IX-CS-06/07
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 05 — Connectivity and Sync States

## ST-OFF — Offline

| Field | Definition |
|-------|------------|
| **Intent** | User knows device/network cannot reach required services; capture may queue where allowed |
| **Entry** | Connectivity loss · API unreachable |
| **Exit** | Connectivity restored → Syncing/fresh · user works local-only where supported |
| **Transitions** | → Connectivity restored · → Syncing · → Failure (if hard require online) · → Partial |
| **Ownership** | Shell banners (`/m`/native stronger — Intelligence); **desktop REQUIRED gap (D08)** |
| **Recovery** | Queue capture if ceiling allows · Retry when online · honest limits |
| **Accessibility** | Persistent polite live announcement |
| **Validation** | Visible; not silent fail |

## ST-CONN — Connectivity

| Field | Definition |
|-------|------------|
| **Intent** | Broader link quality/reachability than binary offline (degraded, reconnecting) |
| **Entry** | Flaky network · reconnecting · captive portal |
| **Exit** | Stable online · Offline confirmed · user dismisses degraded notice |
| **Transitions** | → Offline · → Syncing · → Success · → Failure |
| **Ownership** | Shell |
| **Recovery** | Retry · wait · switch network guidance (message-level, not eng) |
| **Accessibility** | Status text, not icon-only |
| **Validation** | Distinguish degraded from Offline and from app Failure |

## ST-SYNC — Syncing

| Field | Definition |
|-------|------------|
| **Intent** | Local and remote reconciling — ambient, non-blocking when safe |
| **Entry** | Back online · explicit refresh · native/`/m` sync · calendar sync |
| **Exit** | Synced success · Conflict · Failure · Offline again |
| **Transitions** | → Success/fresh · → Conflict (ST-CONF) · → Failure · → Offline |
| **Ownership** | Sync hosts + SyncBanner patterns (Intelligence) |
| **Recovery** | On fail → Retry; on conflict → Recovery choose |
| **Accessibility** | Polite live updates; don’t steal focus from capture |
| **Validation** | Ambient ≠ Hold; Capture spine preserved |
