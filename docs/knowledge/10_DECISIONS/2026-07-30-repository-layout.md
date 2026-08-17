---
authority: engineering
derived_from: Genesis P1 · 02_ARCHITECTURE/Monorepo · repository reorganization audit
status: accepted
owner: founder
lifecycle: living
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-DEC
graph_role: decision
note_type: NT-ADR
tags:
  - type/decision
  - domain/engineering
  - status/accepted
---

# ADR — Keep production clients at canonical top-level paths

## Context

The repository already separates production surfaces by build and release boundary:

- `frontend/` — React web plus its tightly coupled Capacitor `/m` wrapper.
- `native-android/` — independent Kotlin Compose application.
- `server/` + `api/` — one Node API with EC2 and Vercel entrypoints.

Wrapping these roots under `apps/`, or splitting the React source into artificial `website/`, `mobile/`, and `shared/` folders, would touch Vercel configuration, CRA/CRACO paths, Gradle projects, GitHub Actions, deployment scripts, agent rules, and hundreds of documentation references. It would not create a new dependency or release boundary.

## Decision

Keep the production roots canonical:

```text
frontend/          web + Capacitor as one dependency unit
native-android/    native mobile client
server/ + api/     backend implementation + serverless entry
supabase/          database migrations
deploy/            deployment automation
scripts/           maintained tooling and diagnostics
docs/knowledge/    Obsidian source of truth
plans/             active delivery plans
prototypes/        clearly non-production experiments
```

Do not create a generic `shared/` package until two production clients import a real shared runtime contract. Shared product truth belongs in API schemas and the Vault; React and Compose UI code remain separate.

Repository cleanup targets generated files, stale root documents, ad-hoc scripts, and misleading duplicates—not stable production paths.

## Consequences

- Build and deployment paths remain stable.
- Git history stays readable.
- Web, Capacitor, and native commit boundaries remain explicit.
- The root remains a monorepo map instead of gaining an extra `apps/` nesting level.
- A future path migration requires a concrete tooling or ownership benefit plus passing before/after builds.

## Validation

- Frontend production build passes from the current root.
- Backend service tests pass.
- Native and Capacitor builds pass or record a specific environment blocker.
- Generated caches are ignored and absent from the Git index.
- Root diagnostics live under `scripts/diagnostics/`.
