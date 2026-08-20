# 03 — Motion Principles Governance Index

```yaml
document: Motion Principles Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-112 | Motion purpose allowlist — feedback, continuity, hierarchy, state | Motion — Purpose | Approved | High | Medium | GOV-063, GOV-054, GOV-038, GOV-053 | M-1; Purpose |
| GOV-113 | Duration band — ~150–250ms micro; longer needs narrative reason | Motion — Duration | Needs Discussion | High | Medium | GOV-112, GOV-054, GOV-118 | M-2; Reasoning |
| GOV-114 | Prefer opacity + transform; avoid layout thrash and vestibular distress | Motion — Technique / Accessibility | Approved | High | Medium | GOV-112, GOV-072, GOV-056 | M-3; Reasoning |
| GOV-115 | Motion budget per composition — brand 2–3; product fewer | Motion — Budget | Approved | High | Low | GOV-112, GOV-029, GOV-054, GOV-003 | M-4; Reasoning |
| GOV-116 | Never delay capture — animate after commit, not before | Motion — Performance / Capture | Approved | High | Medium | GOV-059, GOV-066, GOV-028, GOV-112, GOV-077 | M-6 |
| GOV-117 | One easing family per surface class | Motion — Easing | Approved | High | Medium | GOV-112, GOV-113, GOV-040 | M-7 |
| GOV-118 | Platform vernacular OK — emotional tempo must match | Motion — Cross-Platform Consistency | Approved | High | High | GOV-040, GOV-085, GOV-054, GOV-112 | M-8; Reasoning |
| GOV-119 | Celebration rare and proportional — no habit-tick fireworks | Motion — Success / Celebration | Approved | High | Medium | GOV-055, GOV-009, GOV-112, GOV-068 | M-9 |
| GOV-120 | Page transitions orient — not cinematic taxes on daily use | Motion — Navigation / Transitions | Approved | High | Medium | GOV-112, GOV-113, GOV-029, GOV-115 | M-10 |
| GOV-121 | Loading motion must not mask poor performance | Motion — Loading / Performance Honesty | Approved | Medium | Medium | GOV-112, GOV-116, GOV-089 | Known risks; Purpose |

## Existing GOV referenced (no new ID)

| M item | Existing GOV | Note |
|--------|--------------|------|
| M-1 (general meaning + triad) | GOV-063, GOV-054, GOV-038 | Purpose allowlist elevated in GOV-112 |
| M-5 (reduced motion core) | GOV-072 | Ops via REC-045 — no re-mint |
| M-6 (capture speed anchors) | GOV-059, GOV-066, GOV-028 | After-commit elevated in GOV-116 |
| M-9 (anti-casino anchors) | GOV-055, GOV-009, GOV-068 | Proportional celebration elevated in GOV-119 |
| Feedback existence | GOV-077 | Motion is one feedback channel |
| Calm / Human Momentum | GOV-029, GOV-030, GOV-003, GOV-031 | Philosophy bound |
| Cross-surface | GOV-040, GOV-085 | Tempo match elevated in GOV-118 |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-041 | Ratify Approved Motion GOVs (112, 114–121) as citeable motion canon | P0 | Pending Founder | GOV-112, GOV-114…GOV-121 |
| REC-042 | Publish motion token companion under Design System Spec / token SoT | P0 | Pending Founder | GOV-113, GOV-117, GOV-118, GOV-073 |
| REC-043 | Add Motion QA gates (purpose / capture / budget / celebration / reduced-motion) | P0 | Pending Founder | GOV-112, GOV-115, GOV-116, GOV-119, GOV-072 |
| REC-044 | Founder resolve CF-M-001: ms band as emotional tempo × platform tokens | P0 | Pending Founder | GOV-113, GOV-118 |
| REC-045 | Ban animation-end as sole success path; instant essential feedback under reduced motion | P0 | Pending Founder | GOV-072, GOV-116, GOV-077, GOV-114 |
| REC-046 | Align celebration motion with Life Score vs XP when GOV-068 ratified | P1 | Pending Founder | GOV-119, GOV-068, GOV-055 |
| REC-047 | Next P7: Interaction or Accessibility or Design System Spec | P0 | Pending Founder | GOV-112, GOV-072, GOV-114, GOV-073 |

## Quick filters

### Needs Discussion

- GOV-113 — Duration band — ~150–250ms micro; longer needs narrative reason

### High cost

- GOV-118 — Platform vernacular OK — emotional tempo must match

### Conflicts

- CF-M-001 — Duration band vs platform vernacular
- CF-M-002 — Celebration depends on open GOV-068
- CF-M-003 — Demoability tradeoff (not contradiction)
- CF-M-004 — Craft polish motion debt
- CF-M-005 — Reduced-motion broken on animation-end
- CF-M-006 — Gesture motion absent from source
