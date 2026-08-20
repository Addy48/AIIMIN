# 07 — User Research

```yaml
purpose: All user-facing research — personas, testers, friction evidence. No invented interviews.
confidence: ★★★☆☆
generated_from:
  - docs/knowledge/09_FEATURES/Onboarding/Onboarding.md
  - docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md
  - docs/knowledge/17_NATIVE_APP_V2/01_PRD.md
  - docs/knowledge/09_FEATURES/Waitlist/*
  - docs/interaction-audit/friction.md
  - docs/knowledge/11_BUGS/*
  - docs/knowledge/13_MEETINGS/README.md
related_notes: [06_RESEARCH_INDEX.md, 08_FEATURE_HISTORY.md, 13_OPEN_QUESTIONS.md]
dependencies: [06_RESEARCH_INDEX.md]
consumers: PM / design / native agents
importance: ★★★★☆
```

---

## HARD FACT

| Claim | Evidence |
|-------|----------|
| **No formal user interview transcripts in vault** | `13_MEETINGS/` is empty template only |
| Personas are product-constructed | Onboarding presets + Native PRD |
| Waitlist testimonials are fictional regional personas | Waitlist.md — "no IIT/IIM celebrity tone" |
| Strongest empirical UX signal = interaction audit + QA | interaction-audit/, 11_BUGS/ |

---

## TARGET USERS (PRODUCT)

| Segment | Need | Source |
|---------|------|--------|
| Students | High cognitive load; rituals; placements context | PRODUCT.md, Product Guide |
| Early-career builders | Consistency + recovery loops | same |
| Prefer practical coaching | Anti vanity analytics | same |

---

## PERSONAS

### Web / Onboarding presets
| Persona | Role in product | Source |
|---------|-----------------|--------|
| Student | Nav/widget preset | Onboarding.md |
| Working professional | preset | same |
| Founder | preset | same |
| Family | preset | same |
| Athlete | preset | same |

### Native PRD personas
| Name | Profile | Source |
|------|---------|--------|
| Aarav | 21, GATE prep | `01_PRD.md` §5 |
| Isha | 24, SWE | same |
| Kabir | 19, waitlist | same |
| Meera | Power user | same |

### Waitlist social proof personas
Fictional: 2 professors, 1 student, 1 working professional — regional tone.

---

## TESTER PROGRAM

| Fact | Detail | Source |
|------|--------|--------|
| Allowlist | 1 dev + 4 testers | Waitlist.md |
| Perk | Elite free 1yr if registered by 31 Jul (invite) | Changelog 2026-07-07 |
| Public users | Sign-in without allowlist → pending | Product.md |
| Close date | Tester registration 31 Jul 2026 | Product.md |
| Go-live | End Sep 2026 | Product.md |

---

## FRICTION EVIDENCE (INTERACTION AUDIT)

| Area | Friction score (higher=worse) | Implication |
|------|-------------------------------|-------------|
| Onboarding | 6.8 | Compress steps; OAuth-first |
| Family | 6.5 | Wizard only when stakes high |
| Finance | 5.8 | Infer category; fewer fields |
| Journal capture | 3.8 | Relatively healthy — protect |

Source: `docs/interaction-audit/friction.md`

---

## BEHAVIORAL / QA SIGNALS

| Signal | Finding | Source |
|--------|---------|--------|
| Punitive streaks | Demotivate | audit.md |
| Fake Insights skill domains | Hardcoded gamification | audit.md |
| Selfloop 2026-07-12 | Mass defects fixed locally; prod lag | QA-Run |
| Login QA 2026-07-14 | 47 issues | QA-Run Login |
| Screenshot audit | 38 shots → P0–P4 polish brief | UI-Improvement-Brief |

---

## INTENTS (FROM HUMAN INTENT GRAPH)

Primary intents product optimizes for (not interview quotes):
- Vent / journal
- Log spend
- Focus / can't focus
- Habit check
- Plan day
- Reflect weekly
- Family emergency info
- Capture on phone quickly

Source: `docs/product-intelligence/HUMAN_INTENT_GRAPH.md`

---

## GAPS (USER RESEARCH)

| Gap | Risk |
|-----|------|
| No real interview corpus | Personas may overfit founder intuition |
| No cohort analytics yet (GA4 blocker) | WAC/funnels unmeasured in prod |
| Telemetry taxonomy proposed not shipped | Experiments unvalidated |
| Tester E2E incomplete | LC-12 open |

---

## NORTH STAR USER OUTCOME

Users complete meaningful capture weekly (WAC) with median ≤5 interactions/day and leave with honest Life Score + non-clinical coaching — not social performance.
