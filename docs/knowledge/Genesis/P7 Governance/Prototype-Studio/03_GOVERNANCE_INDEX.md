# 03 — Prototype Studio Governance Index

```yaml
document: Prototype Studio Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-162 | Living Momentum OS v1 product concept lock | Product — Concept | Approved | High | Extreme | GOV-001, GOV-002, GOV-028, GOV-136 | 01_CONCEPTS_AND_CRITIQUE.md |
| GOV-163 | Phone primary shell — Today | Knowledge | Capture FAB | Timeline | More | UX — Navigation | Needs Discussion | High | Extreme | GOV-162, GOV-075, GOV-097, GOV-095 | 02_DESIGN_DECISIONS.md |
| GOV-164 | Surface one-job law — every surface declares exactly one job | UX — Hierarchy / Layout | Approved | High | High | GOV-162, GOV-098, GOV-100, GOV-122 | 02_DESIGN_DECISIONS.md |
| GOV-165 | Refuse Tasks tab, Projects board, and widget dashboard as primary IA | Product — IA Refuse | Approved | High | Medium | GOV-007, GOV-074, GOV-076, GOV-162 | 02_DESIGN_DECISIONS.md |
| GOV-166 | First-run flow — Splash → Onboarding ≤3 beats → Auth → App Shell | UX — Onboarding / Navigation | Approved | High | Medium | GOV-002, GOV-009, GOV-079, GOV-162 | 04_PAGE_DESIGNS.md |
| GOV-167 | Knowledge surface unifies Journal | Notes as one memory layer | UX — Information Architecture | Needs Discussion | High | High | GOV-101, GOV-163, GOV-164, GOV-096 | 02_DESIGN_DECISIONS.md |
| GOV-168 | More is honest overflow — pillars and meta under More on phone | UX — Navigation | Approved | High | High | GOV-163, GOV-100, GOV-162, GOV-097 | 02_DESIGN_DECISIONS.md |
| GOV-169 | Six page hierarchy layers — System / Day / Memory / Pillars / Intelligence / Account | UX — Hierarchy | Approved | High | Medium | GOV-096, GOV-103, GOV-162, GOV-164 | 03_SYSTEM_DESIGN.md |
| GOV-170 | Global Capture FAB sheet is primary capture path | UX — Interaction / Capture | Approved | High | Extreme | GOV-028, GOV-066, GOV-126, GOV-127, GOV-130, GOV-163 | 02_DESIGN_DECISIONS.md |

## Existing GOV referenced (no new ID)

| Studio item | Existing GOV | Note |
|-------------|--------------|------|
| Personal Life OS / Human Momentum identity | GOV-001, GOV-003 | Category + brand frame — Studio Living Momentum sits inside |
| Capture once / capture-first | GOV-002, GOV-028, GOV-059, GOV-066 | Vision + capture-first + speed + Enter/primary save — FAB sheet elevates in GOV-170 |
| Refuse social / clinical / form-builder / casino Life Score | GOV-005, GOV-006, GOV-008, GOV-009 | Studio anti-decisions + Family not social + no clinical copy |
| Split brand lockup (web mapping) | GOV-012, GOV-039 | 10_WEB_TABLET_MAPPING preserves mark→/brand wordmark→Today — not re-minted |
| Phone web /m capture-only; native ≠ /m | GOV-013, GOV-041, GOV-085 | Studio Android prototype ≠ /m ceiling — reused |
| Calm read / anti-clutter Today / empty teach | GOV-029, GOV-076, GOV-067 | Calm Contextual Today + no widget marketplace + teach empty |
| Emotional refuse / no shame streaks | GOV-031, GOV-068 | Honest Life Score; Profile no shame carnival — XP roles still ND |
| Destructive confirm / optimistic safe | GOV-015, GOV-065, GOV-125 | Confirm sheet + optimistic habit toggles — reused |
| Shared primitives / graph IA / Timeline chronology | GOV-040, GOV-094, GOV-102 | Cross-surface primitives; Timeline primary in shell elevates GOV-102 placement |
| Nav primacy / free-pin / intents / palette / settings | GOV-075, GOV-095, GOV-097, GOV-099, GOV-100 | Studio fixed shell (GOV-163/148) conflicts/complements open IA ND items |
| Knowledge ≠ Journal ≠ Documents entity law | GOV-101 | Studio Knowledge tabs unify Journal|Notes — CF-PS-002 / GOV-167 ND |
| Compression / capture beats nav / infer chips / forms last / one primary | GOV-034, GOV-122, GOV-126, GOV-127, GOV-130, GOV-135 | Median ~5 via capture sheet; chips; NL capture |
| AI never home shell / mixed-initiative coach | GOV-136 | Studio kill AI-Native Home; AI under More + coach surface |
| Palette lock (identity only — not visual craft judgment) | GOV-036 | Product lock honored; visual quality out of scope this pass |
| Family not auto-post social | GOV-078 | Family trust vault framing |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-077 | Ratify GOV-163 phone shell as nav primacy — close GOV-075 / GOV-097 / REC-022 gap | P0 | Pending Founder | GOV-163, GOV-075, GOV-097, GOV-095 |
| REC-078 | Resolve GOV-167 Knowledge tabs vs GOV-101 entity separation | P0 | Pending Founder | GOV-167, GOV-101 |
| REC-079 | Ratify Approved Prototype Studio GOVs (162, 164–166, 168–170) as citeable shell canon | P0 | Pending Founder | GOV-162, GOV-164, GOV-165, GOV-166, GOV-168, GOV-169, GOV-170 |
| REC-080 | Founder ADR — tablet/desktop Finance elevation vs phone Finance-in-More | P0 | Pending Founder | GOV-168, GOV-163, GOV-075, GOV-109 |
| REC-081 | Map Studio shell → native WORKFLOW-PLAN / Compose bottom-nav migration | P0 | Pending Founder | GOV-163, GOV-167, GOV-168, GOV-170 |
| REC-082 | Publish Search page + Command Palette coexistence note under GOV-099 | P1 | Pending Founder | GOV-099, GOV-168, GOV-164 |
| REC-083 | Next P7 after founder OK — Page Blueprints or Automation Rules or Accessibility | P0 | Pending Founder | GOV-164, GOV-169, GOV-137 |
| REC-084 | Govern Goals (not Projects board) naming in Naming Language pass | P1 | Pending Founder | GOV-165, GOV-131 |

## Quick filters

### Needs Discussion

- GOV-163 — Phone primary shell — Today | Knowledge | Capture FAB | Timeline | More
- GOV-167 — Knowledge surface unifies Journal | Notes as one memory layer

### High / Extreme cost

- GOV-162 — Living Momentum OS v1 product concept lock (Extreme)
- GOV-163 — Phone primary shell — Today | Knowledge | Capture FAB | Timeline | More (Extreme)
- GOV-164 — Surface one-job law — every surface declares exactly one job (High)
- GOV-167 — Knowledge surface unifies Journal | Notes as one memory layer (High)
- GOV-168 — More is honest overflow — pillars and meta under More on phone (High)
- GOV-170 — Global Capture FAB sheet is primary capture path (Extreme)

### Conflicts

- CF-PS-001 — Nav primacy tension
- CF-PS-002 — Knowledge surface vs entity law
- CF-PS-003 — Finance density by device
- CF-PS-004 — Search placement vs Palette first-class
- CF-PS-005 — Capture beats nav concrete answer
- CF-PS-006 — Queue order — AI next vs Studio now

### Score

**78 / 100**
