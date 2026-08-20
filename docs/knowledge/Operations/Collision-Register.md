---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/06_Metadata_Migration_Plan
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
knowledge_layer: KL-META
graph_role: leaf
note_type: NT-DOC
migration_batch: W5
program: Brain-OS-Implementation
artifact: collision-register
---

# Basename Collision Register (living)

**Purpose:** Document duplicate basenames. **No frozen renames** (Genesis / UXA / UXI). Prefer path-qualified wikilinks.

**Generated:** 2026-07-26 · Wave W5 · cite Program V1 `06` MD-04

## Policy

| Zone | Action |
|------|--------|
| Genesis / UXA / UXI collisions | **Leave.** Link with full path. |
| Living `Changelog.md` under Features | OK pattern — always path-qualify `[[09_FEATURES/<Entity>/Changelog]]` |
| Living `00_INDEX.md` under programs | OK — path-qualify |
| Living `Index.md` / `Overview.md` / `Product.md` | Soft — prefer unique titles on next edit |
| `.obsidian/plugins/*/INSTALL.md` | Ignore (config) |

## High-count living/program collisions (actionable awareness)

| Basename | Count | Notes |
|----------|------:|-------|
| `00_INDEX` | 16 | Includes Archive + programs — always path-link |
| `Changelog` | 11 | Feature entity pattern — OK |
| `README` | 10 | Folder readmes — OK |
| `Index` | 3 | Features / API / Database — soft rename later |
| `Overview` | 3 | Features / Arch / AI — soft |
| `Product` | 2 | MOC vs `01_PRODUCT` — path-qualify |

## Frozen/law collisions (do not rename)

| Basename | Zone | Rule |
|----------|------|------|
| `01_GOVERNANCE_REPORT` etc. | Genesis P7 | Path-implied; never rename |
| `91_Risk_Register` / phase matrices | UXA | Frozen; path-qualify only |
| Genesis `20_MANIFEST` / exec summaries | Genesis | Immutable |

## Next hygiene (optional)

1. When creating new notes, avoid bare `Index` / `Overview` / `Product` basenames outside established patterns.
2. Dashboards and agents: prefer full-path wikilinks for any basename in this register.
3. Do **not** bulk-rename Archive or law packs in this wave.
