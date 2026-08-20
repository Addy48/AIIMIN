---
Purpose: Entry point for the AIIMIN Design Context intelligence package. Indexes every document, reading order, and how Codex should consume this folder.
Confidence: 0.92
Generated From: All sibling docs in this folder; vault `docs/knowledge/00_HOME.md`; repo root README.md
Dependencies: None (root index)
Consumers: Codex / any agent bootstrapping AIIMIN without prior repo knowledge
Last Updated: 2026-07-22
Pass: 1/6 Repository Intelligence
---

# AIIMIN Design Context — MANIFEST

## What this package is

Machine-readable reverse-engineering of the AIIMIN monorepo as of 2026-07-22.
Built for another AI (Codex) that has never seen the repository.
**Pass 1 of 6** — full-repository intelligence. No code was modified.

## Hard constraints observed during generation

- No redesign / refactor / fix recommendations unless a later pass asks.
- Secrets never recorded (env **names** only).
- Conflicts between docs and code are **explicitly flagged**, not silently resolved.
- Canonical product memory also lives in `docs/knowledge/` (Obsidian Brain OS). This package is a Codex-facing **snapshot**; vault remains day-to-day source of truth for humans/agents in Cursor.

## Document index

| File | Purpose | Depends on | Consumed by |
|------|---------|------------|-------------|
| [00_PROJECT_SUMMARY.md](00_PROJECT_SUMMARY.md) | Product + architecture + status in ≤2 pages | README, Home, Product | All other docs; first read |
| [01_REPOSITORY_MAP.md](01_REPOSITORY_MAP.md) | Folder tree + labels (prod/legacy/archive/…) | 00 | 02, 11, 14 |
| [02_ARCHITECTURE.md](02_ARCHITECTURE.md) | Frontend/backend/API/DB/auth/storage/theme/routing | 00, 01 | 03–08, 12 |
| [03_FEATURE_INVENTORY.md](03_FEATURE_INVENTORY.md) | Every feature group + status | 00, 02, Features Index | 04, 07, 08 |
| [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md) | Every web + mobile + native screen | App.js, nav, native screens | 05, 06 |
| [05_COMPONENT_LIBRARY.md](05_COMPONENT_LIBRARY.md) | Reusable frontend components | components/ tree | 04, 09 |
| [06_NAVIGATION_GRAPH.md](06_NAVIGATION_GRAPH.md) | Routes, modals, deep links, entry/exit | App.js, navItems | 04 |
| [07_DATA_MODELS.md](07_DATA_MODELS.md) | Tables, relationships, FE/API mapping | migrations, db.js | 08, 03 |
| [08_API_MAP.md](08_API_MAP.md) | Every HTTP endpoint | api/index.js, server/routes | 03, 07, 12 |
| [09_DESIGN_SYSTEM.md](09_DESIGN_SYSTEM.md) | Factual tokens, type, motion, assets | Palette.md, tokens.css, DESIGN.md | 10, 05 |
| [10_THEME_SYSTEM.md](10_THEME_SYSTEM.md) | Theme switching + CSS variable model | ThemeContext, themes.js | 09 |
| [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md) | Unused/legacy/conflicts/incomplete (facts only) | 01–08 | Planning agents |
| [12_DEPENDENCY_GRAPH.md](12_DEPENDENCY_GRAPH.md) | npm/Gradle/internal deps + risks | package.json files | 13 |
| [13_BUILD_SYSTEM.md](13_BUILD_SYSTEM.md) | Build, CI/CD, host, scripts, env names | vercel.json, workflows, Deploy.md | Ops |
| [14_REPOSITORY_STATISTICS.md](14_REPOSITORY_STATISTICS.md) | Counts and sizes | filesystem metrics | All |
| [15_GLOSSARY.md](15_GLOSSARY.md) | AIIMIN terminology | Product + code | All |

## Recommended reading order (Codex)

1. **MANIFEST** (this file)
2. **00_PROJECT_SUMMARY**
3. **01_REPOSITORY_MAP** + **02_ARCHITECTURE** (parallel OK)
4. **06_NAVIGATION_GRAPH** + **03_FEATURE_INVENTORY**
5. **08_API_MAP** + **07_DATA_MODELS**
6. **04_SCREEN_INVENTORY** + **05_COMPONENT_LIBRARY**
7. **09_DESIGN_SYSTEM** + **10_THEME_SYSTEM**
8. **12_DEPENDENCY_GRAPH** + **13_BUILD_SYSTEM**
9. **11_TECHNICAL_DEBT** + **14_REPOSITORY_STATISTICS** + **15_GLOSSARY**

## Cross-links to existing Brain OS (do not duplicate blindly)

| Need | Vault path |
|------|------------|
| Agent entry | `docs/knowledge/00_HOME.md` |
| Handoff | `docs/knowledge/15_MEMORY/Current-Context.md` |
| Features | `docs/knowledge/09_FEATURES/Index.md` |
| Palette lock | `docs/knowledge/08_DESIGN/Palette.md` |
| Monorepo rules | `docs/knowledge/02_ARCHITECTURE/Monorepo.md` |
| Native tracker | `docs/knowledge/17_NATIVE_APP_V2/WORKFLOW-PLAN.md` |
| Product Bible | `docs/AIIMIN_PRODUCT_BIBLE/00_INDEX.md` |
| Product intelligence dump | `docs/product-intelligence/COMPLETE_PRODUCT_INTELLIGENCE.md` |
| Interaction audit | `docs/interaction-audit/COMPLETE_INTERACTION_AUDIT.md` |

## Confidence model used in headers

| Score | Meaning |
|-------|---------|
| 0.9–1.0 | Directly verified from primary source files this pass |
| 0.7–0.89 | Strong evidence; some inference from vault or naming |
| 0.5–0.69 | Partial coverage; live DB or runtime not probed |
| <0.5 | Speculative / design draft only |

## What this pass did NOT do

- Live Supabase `information_schema` introspection
- Runtime HTTP probing of every endpoint
- Exhaustive import-graph / reuse-count for every component (sample counts only)
- Full native Compose component prop documentation
- Passes 2–6 (deeper design / interaction / intent layers)

## Generation method

Parallel explore agents + shell metrics + vault reads + package.json / App.js / api/index.js / migrations evidence. See each file `Generated From`.
