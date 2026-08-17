---
authority: operations
derived_from: 03–07 flows · Phase 1–4
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 5-flows
---

# 08 — Flow Dependency Map

```text
FL-AUTH → FL-ACCT/SET (config)
       → Onboarding/FL-ID → FL-TODAY
       → Pending (Session) → (wait)
       → FL-TODAY

FL-TODAY → FL-CAPTURE → FL-AI
        → FL-SEARCH
        → FL-REPORTS
        → domain pins (Career, Learn/Lab, …)
        → FL-ACCT

FL-CAPTURE ↔ FL-OFF / FL-XDEV / FL-RECOV
FL-AI → FL-RECOV / Undo (Phase 4)
FL-NOTIF → FL-DEEP / FL-ACCT permissions / Hold gate (Phase 2)
FL-XDEV spans Capture, Focus/Discipline, Family, Score(Today)
FL-DEEP → FL-AUTH → target (never `/m/score`)
FL-OFF → FL-RECOV → Sync → continue
FL-SET ⊆ FL-ACCT (MERGE)
FL-ID ⊆ Onboarding + Goals (MERGE)
FL-SCORE-M = NULL
```

## Critical dependency rules

| Rule | Trace |
|------|-------|
| Today before period Reports for daily score | CS-SCORE |
| Capture before AI Structure offer | Catch spine |
| Auth before private deep targets | FL-DEEP |
| Offline before assuming sync success | FL-OFF |
