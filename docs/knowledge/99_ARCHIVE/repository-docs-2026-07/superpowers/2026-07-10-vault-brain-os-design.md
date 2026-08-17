# Vault Brain OS — Design Spec

**Date:** 2026-07-10  
**Status:** Approved (user: full cutover A, slim AGENTS A, dual-layer + caveman packs)  
**Goal:** Turn `docs/knowledge/` into the AIIMIN Project Brain so agents load curated context instead of the whole repo.

## Problem

Cursor usage shows huge contexts (~985k avg tokens). Agents re-scan the repo and reuse fat cache. Vault today is thin docs, not an operating system. Result: cost, drift, wrong architecture guesses.

## Decision

Full cutover under `docs/knowledge/` to numbered brain folders. Dual-layer content: human-readable feature/architecture docs; caveman-compressed AI memory packs. Slim `AGENTS.md` to a pointer. Hard Cursor rule: Home → Current Context → relevant docs → only needed source files.

## Structure

```
docs/knowledge/
  00_HOME.md
  01_PRODUCT/
  02_ARCHITECTURE/
  03_DATABASE/
  04_API/
  05_FRONTEND/
  06_AI/
  07_DEPLOYMENT/
  08_DESIGN/
  09_FEATURES/
  10_DECISIONS/
  11_BUGS/
  12_SPRINTS/
  13_MEETINGS/
  14_PROMPTS/
  15_MEMORY/
  16_DOCUMENTATION/
  17_EXPERIMENTS/
  99_ARCHIVE/
  _templates/
  _manifest.json
```

## Agent load order (mandatory)

1. `00_HOME.md`
2. `15_MEMORY/Current-Context.md`
3. Relevant architecture / feature / DB / API notes
4. Only source files involved in the change
5. Update vault before task complete

Never whole-repo scan unless user explicitly requests.

## Content policy

| Layer | Style | Examples |
|-------|--------|----------|
| Human docs | Clear Obsidian prose | Feature MOCs, ADRs, DB/API pages |
| AI packs | Caveman-compressed | `15_MEMORY/*`, slim `AGENTS.md`, `00_HOME` body |
| Templates | Structured | Feature, bug, API, decision, sprint |

## Migration

- Move existing Feature/Architecture/History notes into new paths (or archive copies).
- Fold Command Center into `00_HOME` + `01_PRODUCT`.
- Archive old paths under `99_ARCHIVE/pre-brain-os-2026-07-10/`.
- Update `_manifest.json` entrypoint + entity paths.
- Replace `obsidian-vault-documentation.mdc`; add `vault-brain-os.mdc`.

## Out of scope

- Auto-doc generation scripts
- One file per every HTTP endpoint (use endpoint groups first)
- Meeting backfill

## Success criteria

- Agent rule enforces load order
- `AGENTS.md` ≤ ~40 lines
- Home + Current Context exist and stay short
- Known features (Waitlist, Sports, Calendar, Auth, Deploy, Design) seeded
- Templates present
- Old vault archived, not deleted history
