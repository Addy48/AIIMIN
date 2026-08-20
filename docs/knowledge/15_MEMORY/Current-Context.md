---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: context
note_type: NT-CONTEXT
tags:
  - type/hub
  - domain/ops
  - status/living
---

# Current Context

> [!tip] Agent boot
> [[00_HOME]] → [[00_ROUTING]] → this note → Touch only. Proof-or-stop + Anti-Lie.

**Date:** 2026-08-20 · Branch **`main`** @ `5c6a86d0` (+ pending `/app` public-path fix) · PR [#5](https://github.com/Addy48/AIIMIN/pull/5) **merged**

## Stage

Simplification closed. Feat shipped to **`main`**. Vercel prod READY on merge SHA. Deploy API Action success. EC2 on **`main`** @ `5c6a86d0`. Migrations 049–052 already on Supabase.

| Gate | Status |
|------|--------|
| PR #5 merge → `main` | Verified — `5c6a86d0` |
| Deploy API Action | Verified success |
| Verify Frontend Action | Verified success |
| Vercel production | Verified READY · commit message PR #5 · SHA `5c6a86d0` |
| EC2 branch/SHA | Verified `main` @ `5c6a86d0` · health ok |
| Prod bundle has `/app` + `/legal` | Verified strings in `main.2991b620.js` |
| `/app` in PUBLIC_PATH_PREFIXES | **This turn** — fix for signed-in waitlist users |

## P0 next

1. Push `/app` public-path fix (this session)
2. Web diet kill rows — founder taste ([[16_DOCUMENTATION/Web-Surface-Diet-R4]])
3. V3 leftover physical/emu open items — [[17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST]]

## Touch

- `frontend/src/App.js` (`/app` public prefix)
- `docs/knowledge/16_DOCUMENTATION/Simplification-Phase-Tracker.md`
- `docs/knowledge/17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST.md` (A6 EC2 via git)
