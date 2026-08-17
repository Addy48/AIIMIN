# 13 — Naming Language

```yaml
document: Naming Language
version: 3.0
last_updated: 2026-07-22
```

## Purpose

Standardize product names, route concepts, verbs, and entity labels so humans and agents share one lexicon.

## Reasoning

Renames already happened (Folio → Life OS Review; Insights consolidated into Reports). Uncontrolled naming recreates duplicate primitives in language before they appear in UI.

## Evidence

Product decisions (D-FOLIO, D-INS, D-NOTE, D-J0A); Information Model entity names; Brand Human Momentum; Constitution terminology.

---

## Product identity names

| Name | Use |
|------|-----|
| AIIMIN | Product name |
| Human Momentum | Brand philosophy / manifesto frame |
| Life OS | Category claim |
| Life Score | Honest composite mirror |
| Universal Logger / Capture | Primary capture primitive language |
| Command Palette | Universal router (`⌘K`) |
| Arch Bracket | Mark identity (not “leaf”) |

## Surface names (canonical)

| Canon | Aliases / notes |
|-------|-----------------|
| Today | Overview daily command surface |
| Journal | Reflection capture |
| Notes / Knowledge | Reference library — not second journal |
| Documents | File artifacts; often Family-linked |
| Family | Care / emergency vault |
| Finance | Money capture + budgets |
| Calendar / Timeline | Time planning & chronology |
| Goals | Direction |
| Habits | Recurring commitments |
| Focus | Deep work sessions |
| Discipline | Pattern/urge tooling (non-clinical) |
| Reports | Calm read / review (includes former Insights consumption) |
| Intelligence / AI | Mixed-initiative layer surfaces — not chatbot identity |
| Lab | Experimental/power tools — never sole entry for basics |
| Placements | Career pipeline |
| Settings | Rare configuration |
| Profile / Identity | Self-authorship (Life Arc) |
| Brand | `/brand` manifesto |
| Search | Palette + find |
| Mobile Capture | Phone web `/m` |

## Verb lexicon

| Verb | Meaning |
|------|---------|
| Capture / Log | Write a life event quickly |
| Save | Persist current draft |
| Complete / Done | Mark habit or task finished |
| Confirm | Accept inference or destructive act |
| Edit | Correct inferred or existing data |
| Review | Read-derived intelligence |
| Connect | Link entities / edges |
| Export | User takes data out |
| Delete | User removes data |
| Pin | User owns nav placement |

Avoid synonym sprawl (Submit/Send/Add/Create for the same capture act across siblings).

## Entity naming rules

1. User-facing names prefer life language over table names.
2. One concept → one name across web, native, docs.
3. Deprecated names (Folio, leaf logo, WaitlistBrand-as-OS) stay in archive notes only.
4. “AI” is a capability, not a page mascot name that implies therapist/chatbot.

## Code vs product names

Engineering may keep route/file names temporarily; product copy and Bible names are canonical for UX. Migrations should converge, not invent third synonyms.

## Dependencies

[[06_INFORMATION_ARCHITECTURE_PRINCIPLES]] · [[12_CONTENT_AND_MICROCOPY]] · Product Decisions.

## Future impact

New features propose names against this lexicon before UI work. Duplicate synonyms rejected.

## Tradeoffs

Strict naming feels pedantic in brainstorms. Pedantry prevents product schizophrenia.

## Known risks

- Genesis page titles (Knowledge/Documents/Timeline) drifting from shipped routes without alias mapping — blueprints must map both.
- LLM features inventing cute feature names weekly.

## Related sections

[[15_PAGE_BLUEPRINTS]] · [[20_MANIFEST]]
