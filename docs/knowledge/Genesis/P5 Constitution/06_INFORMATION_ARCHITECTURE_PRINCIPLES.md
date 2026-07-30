# 06 — Information Architecture Principles

```yaml
document: Information Architecture Principles
version: 3.0
last_updated: 2026-07-22
```

## Purpose

Define timeless rules for organizing information, navigation, and entity relationships — independent of any particular screen layout.

## Reasoning

AIIMIN’s core claim is a connected life graph. IA that mirrors engineering tables or vendor modules will recreate the fragmentation the product exists to solve. Free-pin navigation and consolidated read surfaces are already locked decisions; principles must protect them.

## Evidence

Information Model / Data Graph; Navigation free-pin decision; Insights→Reports consolidation; Device tiers; Human Intent Graph; duplicate primitive kill list.

---

## Principle IA-1 — Graph over folders

Life entities relate through edges. IA must express relationships (goal→habit→log→score) rather than forcing users to know table names.

## Principle IA-2 — Intent before taxonomy

Primary entry points serve intents: capture, review, plan, prepare, configure. Domain nouns (Finance, Family) are valid destinations, not mandatory first gates for every utterance.

## Principle IA-3 — One primitive, many surfaces

Mood, Life Arc, theme, resume, and similar concepts have **one write primitive**. Multiple read surfaces may consume them. New write UIs for an existing primitive are presumed guilty.

## Principle IA-4 — Capture nodes vs derived nodes

| Layer | Examples | IA rule |
|-------|----------|---------|
| Capture | Journal, notes, transactions, logs | Fast write; minimal fields |
| Execution | Habits, calendar, focus | Direct action |
| Planning | Goals, milestones | Direction first |
| Derived | Life Score, insights, reports | Calm read; no fake input |

Do not force derived-node UI patterns onto capture nodes.

## Principle IA-5 — Progressive disclosure by stakes

Daily = zero ceremony. High-stakes rare (emergency vault, account delete) = wizards, confirms, typed confirms. Same friction everywhere is malpractice.

## Principle IA-6 — User-owned navigation

Masthead free-pin (bounded) beats forced sidebar taxonomy sermons. Overflow is honest (“More”) — do not hide essential capture behind personalization debt.

## Principle IA-7 — Consolidate read surfaces

When two pages answer the same “how am I doing?” question, merge. Insights redirecting into Reports is the template. New dashboard pages require killing an old one.

## Principle IA-8 — Device ceilings are IA, not CSS

| Surface | Ceiling |
|---------|---------|
| Phone web `/m` | Capture-only |
| Tablet / desktop web | Full Life OS |
| Native Android | Rich companion (not `/m` ceiling) |

IA must not “helpfully” ship analytics onto phone web because space exists.

## Principle IA-9 — Search and palette are first-class IA

Command Palette / universal search are not power-user Easter eggs; they are the routing spine for “one utterance, many tables.”

## Principle IA-10 — Settings are a penalty box

Settings hold rare preference and account risk. Do not park daily actions in Settings. Do not use Settings as a junk drawer for unfinished features.

## Principle IA-11 — Knowledge ≠ Journal ≠ Documents

| Concept | Meaning |
|---------|---------|
| Knowledge / Notes | Source-grounded reference library |
| Journal | Reflection capture |
| Documents | Files/artifacts (often family/vault-linked) |

IA must keep these distinct to prevent GoodNotes/Notion mush.

## Principle IA-12 — Timeline is chronology, not a feed

Timeline/Calendar surfaces organize by time for planning and memory. They must not become social feeds or infinite engagement scrolls.

## Dependencies

[[02_PRODUCT_PHILOSOPHY]] · Information Graph · Navigation.md · Device-Tiers.

## Future impact

New entities must declare: capture vs derived, write primitive owner, edges, device ceiling, and which page blueprint owns them.

## Tradeoffs

Graph IA is harder to explain in a screenshot than a grid of apps. Depth is the product.

## Known risks

- Free-pin chaos without sensible defaults for new users.
- “Everything page” dumping grounds.
- Native and web IA diverging until the brand feels like two products (tokens must still unify).

## Related sections

[[15_PAGE_BLUEPRINTS]] · [[13_NAMING_LANGUAGE]] · [[17_FUTURE_GROWTH_RULES]]
