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

# 05 — Interaction Model

## Summary

The interaction audit documented **578 unique user actions (INT-001…INT-578)** across 37 routes, 59 page components, and 47 form surfaces.

**Full audit:** `docs/interaction-audit/COMPLETE_INTERACTION_AUDIT.md`

## Headline findings

| Finding | Detail |
|---------|--------|
| Highest friction | Onboarding (6.8), Family (6.5), Finance (5.8) |
| Lowest friction | Habit toggle, journal mood-only, command palette |
| Top duplicates | Mood ×5, PIN ×3, theme ×3, arc editor ×3 |
| Global shortcuts | `⌘K` palette, `Space→L` logger, `Esc` close |
| Mobile reality | No `/m` router; responsive routes + BottomNav |

## Interaction patterns

| Pattern | Status | Examples |
|---------|--------|----------|
| Optimistic toggle | Good | Habit done, milestone check |
| Modal save | Compress | Goals, habits, events |
| Inline Enter | Good | Palette, notes, calendar quick-add |
| Auto-advance PIN | Compress | Biometric target |
| Confirm destructive | OK | 18 confirms; branded dialog migration |

## Friction heatmap (top 5)

1. Onboarding `/onboarding` — 6.8
2. Family Vault `/family` — 6.5
3. Finance `/finance` — 5.8
4. Placements `/placements` — 5.5
5. Lab `/lab` — 5.0

## AI touchpoints today

| Surface | Automation potential |
|---------|---------------------|
| Command Palette AI Log | Full |
| Journal analyze | Partial |
| Finance category | High |
| Placements ATS | Full |
| Insights | Read-mostly |

## Compression target

Median daily interactions: **15 → 5** (see [[../product-intelligence/INTERACTION_COMPRESSION_SCORE]])

## Related

- `docs/interaction-audit/friction.md`
- `docs/interaction-audit/forms.md`
- `docs/interaction-telemetry.md`
- [[06_AI_MODEL]]
