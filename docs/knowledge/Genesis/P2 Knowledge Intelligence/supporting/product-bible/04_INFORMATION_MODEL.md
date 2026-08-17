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
