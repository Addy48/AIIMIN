---
authority: operations
derived_from: 16_DOCUMENTATION/Simplification-Phase-Tracker · 16_DOCUMENTATION/Ghost-Recovery-R1-2026-08-20
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-INVENTORY
tags:
  - type/inventory
  - domain/ops
  - status/living
---

# Commit-slice inventory (R3) — no commit until Founder asks

> Dirty tree ~439 paths (2026-08-20). Never one mega-commit. Order below is suggested ship order.

| Slice | Contents (approx) | Notes |
|-------|-------------------|-------|
| **S1** `api-mobile-ghosts` | `mobile.js` · `mobileIdempotency.js` · `journalMode.js` | Matches EC2 WT — ship first before any EC2 hard reset |
| **S2** `server-other-routes` | dailyLogs, discipline, family, focus, habits, journal, lab, wealth, correlation | Diff before commit |
| **S3** `migrations-049-052` | 049–052 SQL | Apply to Supabase **before** or with deploy — absent on EC2 disk |
| **S4** `web-legal-consent` | legal pages · consent · `/app` · WaitlistAndroid | Frontend-only |
| **S5** `native-v3` | `native-android-v3/**` (~141) | Largest · separate PR |
| **S6** `vault-simplification` | `docs/knowledge/**` this program | Docs-only OK |
| **S7** `deploy-tooling` | deploy scripts · vercel.json · sync-personal-vault | |
| **S8** `rules-skills` | `.cursor` · AGENTS · skills-lock · CLAUDE | |
| **S9** `cleanup-misc` | deleted stubs · personal-os deletions · .gitignore | Pair with ledger |

**Do not commit** until Founder says which slice. Prefer S1 → S3 → S6 → S4 → S5.
