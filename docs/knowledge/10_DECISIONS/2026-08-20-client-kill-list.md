---
authority: engineering
derived_from: 02_ARCHITECTURE/Monorepo · 10_DECISIONS/2026-07-30-repository-layout · 16_DOCUMENTATION/Vault-And-Repo-Simplification-Plan
status: accepted
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-DEC
graph_role: decision
note_type: NT-ADR
tags:
  - type/decision
  - domain/engineering
  - status/accepted
---

# ADR — Client kill list (surfaces after simplification)

## Context

The monorepo had four client paths and docs that disagreed on which were current. Phase R0/R1 proved local/EC2/Vercel drift. Founder confirmed Manus = prototype only; native V3 + web were built in-repo.

## Decision

| Surface | Path | Fate |
|---------|------|------|
| **Web Life OS** | `frontend/` | **KEEP** — primary deep OS · Vercel `main` |
| **Native Android V3** | `native-android-v3/` | **KEEP** — current companion product app |
| **Capacitor `/m`** | `frontend/android/` + `/m` | **SUNSET** when V3 capture E2E proven on device; until then maintain, no feature growth |
| **Native Android V2** | `native-android/` | **FREEZE** — reference `sync/` `session/` `security/` `data/network/` only · never copy `ui/` · no new features |
| **Drafting Table** | `frontend/prototypes/AIIMIN-Drafting-Table.html` | **DESIGN LOCK only** — not a third product · `/proto/draft` ok for craft reference |

## Consequences

- Agents edit V3 + web + API — not V2 UI, not Capacitor chrome, not Manus-as-owner.
- Commit boundaries stay separate (Monorepo ADR).
- Sunset Capacitor requires Founder OK after V3 leftover capture slices pass.

## Validation

- [[02_ARCHITECTURE/Monorepo]] matches this table.
- [[Maps of Content/Native-App]] points at V3 hot docs.
- [[16_DOCUMENTATION/Simplification-Phase-Tracker]] Phase R2 checked.
