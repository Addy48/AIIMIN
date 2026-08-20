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

# Commit-slice inventory (R3) — shipped on `feat/native-android-v3`

> Originally ~439 dirty paths (2026-08-20). Slices below landed on feat; tip after Context closeout was `cb218e2e` (then merge `origin/main`).

| Slice | Status | Notes |
|-------|--------|-------|
| **S1** `api-mobile-ghosts` | **shipped** | `note.delete` · idempotency · journalMode |
| **S2** `server-other-routes` | **shipped** | with server align commit |
| **S3** `migrations-049-052` | **shipped** | applied on Supabase |
| **S4** `web-legal-consent` | **shipped** | not yet on Vercel prod (`main`) |
| **S5** `native-v3` | **shipped** | brownfield modules |
| **S6** `vault-simplification` | **shipped** | + Context/tracker follow-ups |
| **S7–S9** | **partial / folded** | cleanup + tooling landed with other slices |

## Still open (not R3)

- Merge feat → `main` for Vercel prod (founder)
- Web diet kill rows ([[16_DOCUMENTATION/Web-Surface-Diet-R4]]) — founder taste
- Capacitor sunset after V3 capture E2E ([[10_DECISIONS/2026-08-20-client-kill-list]])
