---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-PROMPT
tags:
  - type/prompt
  - domain/ops
  - status/living
---

# Pre-Ship Gate — 5× Inspect + 5× Anti-Lie

> **Law:** Before every commit+push / deploy claim / “live fixed” statement, run **I1–I5** and **A1–A5** in the same turn. Fail any gate → **blocked** — do not push.

**Always-on Cursor rule (local):** `.cursor/rules/aiimin-pre-ship-10x.mdc`  
**Pairs with:** [[Anti-Lie-Strategy]] · [[Proof-or-Stop]] · `.cursor/rules/aiimin-anti-lie.mdc` · `.cursor/rules/aiimin-proof-or-stop.mdc`

## Inspect (I1–I5)

| # | Gate | Verify |
|---|------|--------|
| I1 | Contract grep | Dates/copy/routes match; stale strings gone |
| I2 | Diff hygiene | No secrets, PEM, `.env`, accidental `dist/` |
| I3 | Source read-back | Critical files show intended fix |
| I4 | Build / lint / test | Frontend build or relevant test exit 0 when UI/server changed |
| I5 | Links & surfaces | `#waitlist-join`, `/app`, `/brand`, `/login` etc. wired in code |

## Anti-Lie (A1–A5)

| # | Gate | Rule |
|---|------|------|
| A1 | Labels | Verified / Inferred / Proposed / Blocked / Not performed |
| A2 | Receipt | Action · target · evidence · result |
| A3 | Independent verify | Second signal (HTTP, deploy status, second grep) |
| A4 | Plan ≠ done | Pushing ≠ shipped until tool confirms |
| A5 | Adversarial self-check | Any claim without evidence? Wrong SHA? |

## After push

1. Tip SHA matches remote  
2. Vercel READY (web) or EC2 health+SHA (API)  
3. Live fetch contains expected string  

No deploy receipt → Status `partial`/`blocked` for prod claims.

## Changelog

### 2026-08-20 — Gate installed
- **What:** Founder mandated ~10× deep testing before pushes forever.
- **Why:** Anti-lie + inspect discipline on marketing/ship work.
- **Files:** this note · `.cursor/rules/aiimin-pre-ship-10x.mdc` · always-index
- **Status:** shipped (vault + local rule)
