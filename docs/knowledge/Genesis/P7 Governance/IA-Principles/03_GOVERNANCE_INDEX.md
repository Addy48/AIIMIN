# 03 — IA Principles Governance Index

```yaml
document: IA Principles Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-094 | Graph-over-folders IA — edges not table names | IA — Graph Structure | Approved | High | Extreme | GOV-019, GOV-043, GOV-001, GOV-004 | Principle IA-1 — Graph over folders; Reasoning |
| GOV-095 | Primary IA intents: capture, review, plan, prepare, configure | IA — Intent Entry Points | Needs Discussion | High | High | GOV-027, GOV-028, GOV-002 | Principle IA-2 — Intent before taxonomy |
| GOV-096 | Four IA node layers: Capture, Execution, Planning, Derived | IA — Node Layers | Approved | High | High | GOV-028, GOV-029, GOV-052, GOV-032 | Principle IA-4 — Capture nodes vs derived nodes; Principle IA-4 — Capture nodes vs derived nodes — table |
| GOV-097 | User-owned masthead free-pin navigation (bounded); honest More | IA — Navigation Ownership | Needs Discussion | High | High | GOV-008, GOV-075, GOV-066, GOV-028 | Principle IA-6 — User-owned navigation; Reasoning |
| GOV-098 | Consolidate read surfaces; new dashboard must kill an old one | IA — Read Surface Consolidation | Approved | High | Medium | GOV-029, GOV-076, GOV-034 | Principle IA-7 — Consolidate read surfaces; Known risks |
| GOV-099 | Command Palette / universal search are first-class IA | IA — Routing Spine | Needs Discussion | High | Extreme | GOV-027, GOV-047, GOV-094, GOV-095 | Principle IA-9 — Search and palette are first-class IA |
| GOV-100 | Settings are a penalty box — no daily actions or junk drawer | IA — Settings Policy | Approved | High | Medium | GOV-032, GOV-095, GOV-066 | Principle IA-10 — Settings are a penalty box |
| GOV-101 | Knowledge/Notes ≠ Journal ≠ Documents | IA — Concept Separation | Approved | High | High | GOV-010, GOV-020, GOV-096 | Principle IA-11 — Knowledge ≠ Journal ≠ Documents; Principle IA-11 — Knowledge ≠ Journal ≠ Documents — table |
| GOV-102 | Timeline/Calendar is chronology, not a social feed | IA — Timeline Role | Approved | High | Medium | GOV-005, GOV-078, GOV-029 | Principle IA-12 — Timeline is chronology, not a feed |
| GOV-103 | New entities must declare IA contract (layer, write owner, edges, ceiling, blueprint) | IA — Entity Intake Contract | Approved | High | Low | GOV-096, GOV-020, GOV-094, GOV-013, GOV-074 | Future impact |

## Existing GOV referenced (no new ID)

| IA item | Existing GOV | Note |
|---------|--------------|------|
| IA-3 | GOV-020, GOV-080 | One primitive, many surfaces; anti-picker proliferation |
| IA-5 | GOV-032 | Progressive disclosure by stakes |
| IA-8 | GOV-013, GOV-041, GOV-085, GOV-092 | Device ceilings as product law (/m, native, marketing honesty) |
| IA-2 (intent core) | GOV-027, GOV-028 | Intent over interface + capture-first; five named intents elevated in GOV-095 |
| IA-1 (graph integrity) | GOV-019, GOV-043 | One linking system; IA-1 elevates graph-over-folders presentation as GOV-094 |
| IA-4 (derived calm) | GOV-029, GOV-052, GOV-009 | Calm read / structure-after-capture / Life Score derived; layers elevated in GOV-096 |
| IA-6 (forced taxonomy ban) | GOV-008, GOV-075 | No form-builder/sidebar sermons; no duplicate nav; free-pin elevated in GOV-097 |
| IA-7 (calm read) | GOV-029 | Read surfaces stay calm; consolidation rule elevated in GOV-098 |
| IA-11 (GoodNotes mush) | GOV-010 | GoodNotes PWA refuse; concept split elevated in GOV-101 |
| IA-12 (social refuse) | GOV-005, GOV-078 | No social feed/auto-post; timeline chronology elevated in GOV-102 |
| Purpose/Reasoning (free-pin + consolidated read locked) | GOV-075, GOV-029 | Reasoning asserts free-pin + consolidated read already locked — elevated as GOV-097/GOV-098 this pass; cite GOV-075/GOV-029 as prior anchors |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-027 | Publish free-pin sensible defaults for new users | P0 | Pending Founder | GOV-097, GOV-075 |
| REC-028 | Publish primary destination map under five intents (capture/review/plan/prepare/configure) | P0 | Pending Founder | GOV-095, GOV-075, GOV-097, GOV-012 |
| REC-029 | Add entity IA declaration checklist to feature/schema intake | P0 | Pending Founder | GOV-103, GOV-074 |
| REC-030 | Publish Command Palette / universal search scope spec | P0 | Pending Founder | GOV-099, GOV-047 |
| REC-031 | Page Blueprint review gate against everything-page dumps | P1 | Pending Founder | GOV-098, GOV-076 |
| REC-032 | Founder confirm GOV-075 primacy model = free-pin masthead (GOV-097); destinations still via REC-028 | P1 | Pending Founder | GOV-075, GOV-097 |
| REC-033 | Next P7 artifact after founder OK: 15_PAGE_BLUEPRINTS or 13_NAMING_LANGUAGE | P0 | Pending Founder | GOV-095, GOV-098, GOV-103 |

## Quick filters

### Needs Discussion

- GOV-095 — Primary IA intents: capture, review, plan, prepare, configure
- GOV-097 — User-owned masthead free-pin navigation (bounded); honest More
- GOV-099 — Command Palette / universal search are first-class IA

### Extreme cost

- GOV-094 — Graph-over-folders IA — edges not table names
- GOV-099 — Command Palette / universal search are first-class IA

### Conflicts

- CF-IA-001 — Complementary Needs Discussion (not contradiction)
- CF-IA-002 — Incomplete vs Constitution route bind
- CF-IA-003 — Known risk — cross-client IA divergence
- CF-IA-004 — Known risk — free-pin without defaults
- CF-IA-005 — Incomplete — linking system still unnamed
- CF-IA-006 — Incomplete — Command Palette scope

