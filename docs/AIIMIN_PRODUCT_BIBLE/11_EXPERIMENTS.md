# 11 — Experiments

## Proposed A/B tests (from telemetry taxonomy)

Telemetry is **proposed, not shipped**. These experiments validate compression and AI-first hypotheses.

---

### E-01: Finance NL capture vs form

| Arm | Experience |
|-----|------------|
| A (control) | Current 6-field EntryForm |
| B | `⌘K` / finance bar NL + confirm chips |

**Primary metric:** `finance_entry_saved` completion rate  
**Secondary:** `interaction_time_ms`, `field_count`, 7-day finance DAU  
**Hypothesis:** B increases tx logs/day by 40%+  
**Guardrail:** category correction rate < 30%

---

### E-02: Onboarding 9-step vs 3-step

| Arm | Steps |
|-----|-------|
| A | Current 9 steps + PIN |
| B | OAuth → optional capture → dashboard (PIN deferred) |

**Primary metric:** `onboarding_completed` rate  
**Secondary:** `day_7_return`, `first_journal_saved` time  
**Hypothesis:** B improves completion by 25%  
**Guardrail:** security survey on PIN defer acceptance

---

### E-03: Journal mood infer vs picker

| Arm | Mood UX |
|-----|---------|
| A | Explicit 1–10 picker |
| B | AI infer + correction chip |

**Primary metric:** `journal_entry_saved` rate  
**Secondary:** mood correction rate, `journal_ai_analyze_completed`  
**Hypothesis:** B increases daily journal rate  
**Guardrail:** user trust survey (NPS)

---

### E-04: Morning briefing card

| Arm | Overview |
|-----|----------|
| A | Current widget grid |
| B | AI morning briefing (calendar + habits + goals) |

**Primary metric:** Overview session depth, habit toggle same session  
**Secondary:** `interaction_time_ms` to first action  
**Hypothesis:** B reduces navigation_depth to plan day

---

### E-05: Goals NL create

| Arm | Create flow |
|-----|-------------|
| A | 7-field modal |
| B | Single sentence → AI milestone review card |

**Primary metric:** `goal_created` / `modal_abandoned` ratio  
**Secondary:** milestones completed at 30 days  
**Hypothesis:** B reduces abandonment 40%

---

### E-06: Unified mood primitive

| Arm | Surfaces |
|-----|----------|
| A | 5 independent mood pickers |
| B | Single sync'd mood; other surfaces read-only display |

**Primary metric:** `mood_picker_loop` telemetry (abandon)  
**Secondary:** mood data consistency score  
**Hypothesis:** B eliminates `mood_picker_loop` events

---

### E-07: Command Palette discoverability

| Arm | Onboarding |
|-----|------------|
| A | No palette teaching |
| B | Interactive `⌘K` tour step |

**Primary metric:** `command_palette_opened` DAU %  
**Secondary:** `universal_logger_saved` vs palette ratio

---

### E-08: Kill finance category dropdown

| Arm | Category |
|-----|----------|
| A | Required dropdown |
| B | Inferred chip only |

**Primary metric:** `finance_entry_saved` latency  
**Secondary:** budget accuracy (user corrections)  
**Source:** Kill List #1 ROI item

---

## Experiment prioritization

| ID | Priority | Effort | Impact |
|----|----------|--------|--------|
| E-08 | P0 | Medium | High frequency |
| E-01 | P0 | High | High frequency |
| E-03 | P0 | Medium | Core loop |
| E-02 | P1 | High | Activation |
| E-05 | P1 | Medium | Setup |
| E-06 | P1 | Medium | Cross-cutting |
| E-04 | P2 | High | Engagement |
| E-07 | P2 | Low | Power users |

## Related

- `docs/interaction-telemetry.md`
- [[12_METRICS]]
