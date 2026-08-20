---
authority: operations
derived_from: 16_DOCUMENTATION/Simplification-Phase-Tracker
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-RUNBOOK
tags:
  - type/runbook
  - domain/deploy
  - status/living
---

# Secrets location (R5)

> **Never commit secret values.** Env **names** OK in `.env.example`.

## After 2026-08-20 move

| Item | Location |
|------|----------|
| Screenshots / client_secret JSON / key PNGs | `~/Documents/AIIMIN-SECRETS/Secrets-Keys-20260820/` |
| EC2 PEM (Desktop) | `~/Desktop/aiimin.pem` |
| EC2 PEM copy | `~/Documents/AIIMIN-SECRETS/aiimin.pem.project-copy` |
| Project root `aiimin.pem` | still present, **gitignored** — prefer Desktop path for SSH |
| App env | host secrets / local `.env` — not vault |

Former in-repo folder `Secrets, Keys /` was moved out in Phase R5.
