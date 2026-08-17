---
authority: founder
derived_from: Genesis · Founder/01_VAULT_FREEZE_CERTIFICATE · Roadmap/AIIMIN-V1-Blueprint
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
  - domain/ops
  - status/accepted
---

# ADR — Vault operating model after the V1 Blueprint

## Context

The Vault already contains the immutable Genesis nucleus, frozen Stage A paths, implementation notes, historical programs, and derived dashboards. The completed [[Roadmap/AIIMIN-V1-Blueprint]] now consolidates V1 product and engineering intent. `Current-Context.md` had become a second 300-line product backlog, while the Vault entrypoints did not surface the Blueprint.

Mass-renaming the numbered Stage A folders would break wikilinks, agent rules, scripts, bookmarks, and historical traceability without improving the truth model.

## Decision

Use four operational layers:

1. **Law:** `Genesis/` — immutable.
2. **V1 contract:** [[Roadmap/AIIMIN-V1-Blueprint]] — implementation source, subordinate to Genesis.
3. **Subsystem truth:** feature, architecture, database, API, design, deployment, and decision notes.
4. **Execution handoff:** [[15_MEMORY/Current-Context]] — short-lived Today / Next / Blockers / Touch only.

Derived dashboards and Obsidian Bases may query these layers but never become authority.

Keep frozen Stage A folder paths. Improve usability through Home, Maps of Content, bookmarks, workspace state, Bases, and archive indexes.

Move stale root Markdown into `Archive/Superseded/Repository-Root/` with filenames and Git history preserved. Keep `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `PRODUCT.md`, and `DESIGN.md` at repository root as project-facing entrypoints/registers.

## Consequences

- Agents load less duplicated context.
- Founder gets one obvious V1 contract and operational cockpit.
- Historical material remains searchable and reversible.
- Existing links and constitutional paths remain stable.
- New product scope belongs in the Blueprint or an accepted ADR, not Current Context.

## Validation

- `00_HOME.md` exposes the authority chain and Blueprint.
- Current Context stays below 120 lines.
- Archive indexes record original paths and superseding notes.
- `_manifest.json` parses and contains one key per entity.
- `.base` files parse as YAML and use existing frontmatter fields.
- Genesis files remain byte-for-byte untouched.
