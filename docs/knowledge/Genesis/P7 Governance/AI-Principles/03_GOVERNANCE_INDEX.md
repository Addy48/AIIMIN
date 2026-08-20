# 03 — AI Principles Governance Index

```yaml
document: AI Principles Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-136 | AI is mixed-initiative layer — not chatbot-on-forms; one tap from correction | AI — Philosophy | Approved | High | High | GOV-047, GOV-048, GOV-051, GOV-053, GOV-126 | How AI should behave in AIIMIN |
| GOV-137 | Confidence band thresholds — ≥70 auto; 40–70 confirm; <40 ask; safety never infer | AI — Confidence Bands | Needs Discussion | High | Extreme | GOV-048, GOV-035, GOV-051, GOV-070, GOV-126, GOV-136 | Confidence bands — table; Confidence bands — table |
| GOV-138 | Five AI roles — Router, Inferencer, Analyzer, Coach, Composer | AI — Role Model | Approved | High | High | GOV-136, GOV-047, GOV-048 | Roles — table; Roles — table |
| GOV-139 | Capture AI input stack order — intent → entities → Kill List → write → telemetry → coaching window | AI — Context / Pipeline | Approved | High | Extreme | GOV-047, GOV-074, GOV-033, GOV-136, GOV-138, GOV-094 | Input stack order; Input stack order |
| GOV-140 | AI must not change auth or billing without explicit user action | AI — Automation Limits / Refusal | Approved | High | Medium | GOV-018, GOV-042, GOV-136 | What AI must not do |
| GOV-141 | Coaching surfaces only when interruptibility window is open | AI — Coaching Behavior | Approved | High | High | GOV-033, GOV-088, GOV-138, GOV-139, GOV-030 | Input stack order; Roles — table |

## Existing GOV referenced (no new ID)

| AI item | Existing GOV | Note |
|---------|--------------|------|
| Philosophy — NL intent + derived structure | GOV-047, GOV-052, GOV-028 | AI-first NL + structure-after-capture + capture-first — mixed-initiative layer elevated in GOV-136 |
| Confidence bands gate action (principle without thresholds) | GOV-048 | Constitution asserts bands; numeric thresholds elevated in GOV-137 (Needs Discussion / REC-004) |
| Correctable inference / chips | GOV-035, GOV-051, GOV-126, GOV-123 | Silent-wrong forbid + infer-then-chip — one-tap correction in GOV-136 |
| Sparring / anti-magic / anti-therapist | GOV-049, GOV-053, GOV-050, GOV-006 | Sparring + no magic patronage + no clinical/therapist — reused |
| Must-not: clinical diagnose | GOV-006, GOV-050 | Refuse clinical/therapist already Constitution/AI |
| Must-not: auto-share private life / journal | GOV-078, GOV-016, GOV-083 | No auto-post + journal out of analytics/push |
| Must-not: invent finance | GOV-082 | No invented finance without utterance |
| Must-not: block capture behind modes | GOV-008, GOV-066 | Refuse form-builder/capture blockers + Enter-to-save |
| Safety never infer meds/allergies/PIN | GOV-070 | NN already — Safety/legal row in bands table confirms |
| Interruptibility / no mid-Focus coaching | GOV-033, GOV-088 | Core interruptibility; coaching-window stack step elevated in GOV-141 |
| Kill List in AI path | GOV-074 | Kill List consult — stack step 3 cites check Kill List |
| Auth/schema change control (adjacent) | GOV-018, GOV-042 | Human ask for auth/schema; AI Model adds billing+auth never without explicit user action → GOV-140 |
| Remembered context / vision | GOV-002, GOV-061 | Capture once + tomorrow lighter — memory philosophy not detailed in AI Model |
| Dev agent memory hygiene (not product AI) | GOV-086 | Cursor/agent vault hygiene ≠ product AI roles — do not conflate |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-055 | Ratify GOV-137 confidence thresholds and close REC-004 / GOV-048 gap | P0 | Pending Founder | GOV-137, GOV-048, GOV-070, GOV-126 |
| REC-056 | Ratify Approved AI GOVs (136, 138–141) as citeable AI product canon | P0 | Pending Founder | GOV-136, GOV-138, GOV-139, GOV-140… |
| REC-057 | Govern 07_AUTOMATION_RULES next for infer/ask/never matrices (field-level) | P0 | Pending Founder | GOV-137, GOV-070, GOV-074, GOV-123 |
| REC-058 | Publish AI Provider Map operational companion (vault pointer already exists) | P1 | Pending Founder | GOV-138, GOV-136 |
| REC-059 | Add AI QA gates: role declaration, band compliance, stack order, coaching window, auth/billing refuse | P0 | Pending Founder | GOV-136, GOV-137, GOV-138, GOV-139… |
| REC-060 | Define sparring vs shame bounds for Coach role (keep REC-015) | P0 | Pending Founder | GOV-049, GOV-031, GOV-141, GOV-138 |
| REC-061 | Next P7 after founder OK: 07_AUTOMATION_RULES or 11_ACCESSIBILITY or 13_NAMING | P0 | Pending Founder | GOV-137, GOV-133, GOV-131 |

## Quick filters

### Needs Discussion

- GOV-137 — Confidence band thresholds — ≥70 auto; 40–70 confirm; <40 ask; safety never infer

### High / Extreme cost

- GOV-136 — AI is mixed-initiative layer — not chatbot-on-forms; one tap from correction (High)
- GOV-137 — Confidence band thresholds — ≥70 auto; 40–70 confirm; <40 ask; safety never infer (Extreme)
- GOV-138 — Five AI roles — Router, Inferencer, Analyzer, Coach, Composer (High)
- GOV-139 — Capture AI input stack order — intent → entities → Kill List → write → telemetry → coaching window (Extreme)
- GOV-141 — Coaching surfaces only when interruptibility window is open (High)

### Conflicts

- CF-AI-001 — Complementary Needs Discussion — bands
- CF-AI-002 — Source alias — no 10_AI_PRINCIPLES.md
- CF-AI-003 — Extract gap — memory / hallucination / explainability / personalization / learning / multi-model
- CF-AI-004 — Known adjacent — Automation Rules not governed this pass
- CF-AI-005 — Tone tension — Coach sparring vs never shame
