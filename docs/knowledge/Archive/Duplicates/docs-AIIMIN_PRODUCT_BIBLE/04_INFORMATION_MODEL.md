---
authority: historical
derived_from: Genesis
status: archived
owner: founder
lifecycle: archive
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-COLD
graph_role: cold
note_type: NT-COLD
migration_batch: W4
fm_source: script
---

> **ARCHIVED — provenance**
> - **Why archived:** Duplicate of Genesis P2 supporting Product Bible (byte-identical). Removed from docs/ to restore single source.
> - **Status:** duplicate-archived
> - **Canonical / active successor:** [[Genesis/P2 Knowledge Intelligence/supporting/product-bible/00_INDEX]]
> - **Use:** Historical reference only. Do not treat as living law. Cannot override Genesis.

# 04 — Information Model

## Summary

AIIMIN's information model is a **directed graph of life entities** where capture nodes feed derived intelligence nodes. This is data architecture, not navigation.

## Core entities

| Layer | Entities |
|-------|----------|
| **Identity** | Life Arc, Profile |
| **Planning** | Goals, Milestones, Tasks |
| **Execution** | Habits, Calendar Events, Focus Sessions |
| **Capture** | Journal, Daily Log, Notes, Command Palette Logs |
| **Health** | Mood (unified target), Sleep, Discipline Logs |
| **Money** | Transactions, Budgets |
| **Derived** | Life Score, Insights, Reports, AI Recommendations |

## Primary flows

```
Goals → Milestones → Tasks
Goals → Habits → Daily Log → Life Score
Journal → Mood → Insights
Calendar → Focus → Learning hours → Daily Log
Finance → Budgets → Reports → Life Score
All capture → Command Palette router → correct table
```

## Consumption map

| Derived output | Reads from |
|----------------|------------|
| Life Score | Habits, Goals, Daily Log, Finance |
| Insights | Journal NLP, Daily Log, Habits, Life Score |
| Reports | All periodic aggregates |
| AI Recommendations | Insights + Intent Graph |
| Gamification XP | Habits, wins, journal, focus |

## Duplicate primitives (must unify)

- Mood — 5 surfaces today → 1 primitive
- Life Arc — 3 editors → 1 source
- Theme — 3 pickers → OS system setting
- Resume — Placements + Lab ATS → shared vault

## Full detail

See [[08_DATA_GRAPH]] and [[../product-intelligence/INFORMATION_GRAPH]].

## Related

- [[08_DATA_GRAPH]]
- Vault: `docs/knowledge/03_DATABASE/`
