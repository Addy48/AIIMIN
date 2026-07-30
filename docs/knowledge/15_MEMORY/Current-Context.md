---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-30
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
> [[00_HOME]] → this note → only `Touch` paths. Read [[Maps of Content/Genesis]] only for constitutional work. Proof-or-stop on every completion claim.

**Date:** 2026-07-30 · **Branch:** `chore/repository-tidy`

## Today

**Active program:** safe repository + Vault reorganization.

**V1 implementation source:** [[Roadmap/AIIMIN-V1-Blueprint]] (§0–§23). Use it for product scope, IA, onboarding, feature contracts, Life Graph, API, AI, privacy, sync, cloud target, quality, roadmap, and open decisions.

**Historical raw capture:** [[Archive/Superseded/Planning/Current-Context-pre-blueprint-2026-07-30]]. Useful provenance; not living scope.

**Protected checkpoints:**
- `aee0a821` — pre-tidy repository state
- `a6e58854` — completed V1 Blueprint + handoff
- `fbf31b46` — Blueprint-first Vault operating model
- `e6924e1b` — generated npm cache removed from Git index

## Authority

1. `Genesis/` = immutable constitutional law.
2. [[Roadmap/AIIMIN-V1-Blueprint]] = current V1 implementation contract; cannot override Genesis.
3. Feature / architecture / DB / API notes = subsystem contracts.
4. This note = current execution focus only. No product backlog duplication.
5. `Archive/` and `99_ARCHIVE/` = provenance, never living authority.

## Current work

- Repository reorganization validation passed. Report: [[16_DOCUMENTATION/Repository-Reorganization]].
- Production roots remain canonical under [[10_DECISIONS/2026-07-30-repository-layout]].
- Root diagnostics moved to `scripts/diagnostics/`; movement-required imports validated.
- Vault now boots Home → Current Context → Blueprint → subsystem notes.

## Known blockers

- Mobbin MCP authenticated but paid-plan blocked.
- Final production GA4/Sentry env + launch E2E remain outside this cleanup.
- Dependency restore reports npm audit debt: root 66 findings; frontend 6. No forced upgrade applied during safe organization.

## Next

1. Review `chore/repository-tidy`; push only on Founder request.
2. Open `docs/knowledge/` in Obsidian and smoke the three native Bases visually.
3. Start V1 implementation from Blueprint roadmap W0 after cleanup review.
4. Handle npm audit findings as a separate dependency/security change.

## Do not

- Edit `Genesis/`.
- Change auth logic or database schema.
- Delete or move local `.env`, key, certificate, keystore, or `local.properties` files.
- Treat archived notes as current truth.
- Duplicate Blueprint sections into Current Context.
- Claim build/deploy success without same-turn evidence.

## Touch

- `docs/knowledge/00_HOME.md`
- `docs/knowledge/15_MEMORY/Current-Context.md`
- `docs/knowledge/Roadmap/AIIMIN-V1-Blueprint.md`
- `docs/knowledge/16_DOCUMENTATION/Repository-Reorganization.md`
- `docs/knowledge/10_DECISIONS/2026-07-30-repository-layout.md`
- `docs/knowledge/02_ARCHITECTURE/Monorepo.md`
- `docs/knowledge/_manifest.json`
- `scripts/diagnostics/`
- `.gitignore`
