# 20 — Manifest

```yaml
purpose: Package manifest — file checklist, corpus inventory pointers, load order, pass metadata.
confidence: ★★★★★
generated_from:
  - AIIMIN_KNOWLEDGE_CONTEXT/* generation 2026-07-22
  - docs/** inventory (208 md files)
related_notes: [00_KNOWLEDGE_SUMMARY.md, 19_KNOWLEDGE_GRAPH.md]
dependencies: none
consumers: Codex bootstrap; pass 3–6 continuation
importance: ★★★★★
pass: 2/6
generated: 2026-07-22
```

---

## PACKAGE FILES

| # | File | Bytes role | Status |
|---|------|------------|--------|
| 00 | `00_KNOWLEDGE_SUMMARY.md` | Entrypoint WHY | written |
| 01 | `01_PRODUCT_HISTORY.md` | Timeline | written |
| 02 | `02_PRODUCT_PHILOSOPHY.md` | Doctrine | written |
| 03 | `03_PRODUCT_DECISIONS.md` | Decision catalog | written |
| 04 | `04_DESIGN_HISTORY.md` | Design evolution | written |
| 05 | `05_ARCHITECTURE_HISTORY.md` | Arch evolution | written |
| 06 | `06_RESEARCH_INDEX.md` | Research corpora | written |
| 07 | `07_USER_RESEARCH.md` | Personas/testers | written |
| 08 | `08_FEATURE_HISTORY.md` | Feature pivots | written |
| 09 | `09_NAMING_HISTORY.md` | Renames | written |
| 10 | `10_BRAND_HISTORY.md` | Brand | written |
| 11 | `11_ROADMAP_HISTORY.md` | Plans | written |
| 12 | `12_DECISION_LOG.md` | Decision chronology | written |
| 13 | `13_OPEN_QUESTIONS.md` | Unresolved | written |
| 14 | `14_CONTRADICTIONS.md` | Conflicts | written |
| 15 | `15_OBSOLETE_IDEAS.md` | Dead paths | written |
| 16 | `16_VALUABLE_IDEAS.md` | Keep-alive ideas | written |
| 17 | `17_PRD_INDEX.md` | Spec inventory | written |
| 18 | `18_RESEARCH_GRAPH.md` | Research edges | written |
| 19 | `19_KNOWLEDGE_GRAPH.md` | Note graph (72 nodes) | written |
| 20 | `20_MANIFEST.md` | This file | written |
| — | `_source_inventory.txt` | 208 doc paths | written |

---

## CODEX LOAD ORDER

```
00_KNOWLEDGE_SUMMARY
 → 02_PRODUCT_PHILOSOPHY + 14_CONTRADICTIONS
 → task file (08|05|04|10|03|…)
 → 19_KNOWLEDGE_GRAPH node path
 → open vault source (read-only)
```

Never start with `MASTER_PLAN.md`.

---

## CORPUS ROOTS AUDITED

| Root | Role |
|------|------|
| `docs/knowledge/` | Operational vault Brain OS |
| `docs/AIIMIN_PRODUCT_BIBLE/` | Doctrine pack |
| `docs/product-intelligence/` | Phases 2–7 intel |
| `docs/interaction-audit/` | Interaction empirical |
| `docs/superpowers/` | Specs/plans |
| `docs/knowledge/99_ARCHIVE/` | Pre-Brain history |
| `docs/knowledge/17_NATIVE_APP_V2/` | Native PRD pack |
| Root `PRODUCT.md` `DESIGN.md` `MASTER_PLAN.md` `audit.md` `AIIMIN_PROGRESS_SUMMARY.md` | Root registers |

**Not modified:** vault notes unchanged (extraction only).

---

## CLASSIFICATION TAXONOMY USED

Mission · Vision · Research · Design · Engineering · Architecture · Roadmap · Planning · Meeting · Experiment · Prototype · Archive · Reference · Documentation · Implementation · Draft · Journal · Unknown

---

## PASS 2 SCOPE / LIMITS

| Included | Limit |
|----------|-------|
| All Product Bible | full |
| All product-intelligence | full |
| Feature MOCs + changelogs | primary pass |
| Native pack index/PRD/IA/UX/DS/roadmap/workflow | deep; 07–19 legal skimmed via index |
| Interaction audit | summary + friction; not every INT line |
| Archive | key files; not every duplicate MOC |
| Meetings / Experiments folders | empty stubs noted |
| Pre-2026-06 history | thin evidence |

---

## SUGGESTED PASS 3+

| Pass | Focus |
|------|-------|
| 3 | Line-level interaction-audit → decision edges |
| 4 | Per-feature changelog → micro-timeline graph |
| 5 | Native legal + eng docs 09–19 deep extract |
| 6 | Cross-link verification + contradiction resolution proposals |

---

## WHY THIS PACKAGE EXISTS

So a new AI team can reconstruct AIIMIN institutional memory — **why it exists, what it refuses, what it decided, what contradicted, what still open** — without opening thousands of markdown files.
