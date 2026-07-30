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

## Authority

1. `Genesis/` = immutable constitutional law.
2. [[Roadmap/AIIMIN-V1-Blueprint]] = current V1 implementation contract; cannot override Genesis.
3. Feature / architecture / DB / API notes = subsystem contracts.
4. This note = current execution focus only. No product backlog duplication.
5. `Archive/` and `99_ARCHIVE/` = provenance, never living authority.

## Current work

- Make Vault useful as human + agent source of truth.
- Keep frozen Stage A paths; improve navigation and operating views instead of mass-renaming linked folders.
- Archive stale root Markdown with original filenames and Git history.
- Untrack generated npm cache while preserving local files.
- Validate links, JSON/YAML, Git hygiene, and available builds before production-directory moves.

## Known blockers

- Frontend baseline build unavailable: CRACO binary missing from current dependency install.
- Mobbin MCP authenticated but paid-plan blocked.
- Final production GA4/Sentry env + launch E2E remain outside this cleanup.

## Next

1. Wire Home, Knowledge Graph, Roadmap, Founder Workspace, bookmarks, and Bases to Blueprint.
2. Repair `_manifest.json` duplication/staleness.
3. Finish archive indexes and root-doc reference updates.
4. Untrack `frontend/.npm-cache/`; keep 298 MB local cache and all env/key files untouched.
5. Run repository, link, config, frontend, native, and API checks.
6. Move production roots only after a passing baseline and explicit dependency-safe move plan.

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
- `docs/knowledge/Maps of Content/00_Knowledge-Graph.md`
- `docs/knowledge/Maps of Content/Roadmap.md`
- `docs/knowledge/Dashboards/`
- `docs/knowledge/.obsidian/`
- `docs/knowledge/_manifest.json`
- `docs/knowledge/Archive/Superseded/`
- `.gitignore`
