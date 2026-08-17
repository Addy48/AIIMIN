# 12 — Metrics

## North Star

**Weekly Active Capture (WAC):** Users who complete ≥1 meaningful capture (journal, habit toggle, finance tx, discipline log, command palette save) in a 7-day window.

**Why:** AIIMIN value compounds from data; passive readers who do not capture churn.

**Target:** 60% WAC among activated users by launch + 90 days

---

## Supporting metrics

| Metric | Definition | Target |
|--------|------------|--------|
| TTV-1 | Login → Overview | <60s |
| TTV-2 | Activation → first capture | <3 min |
| Median daily interactions | Capture actions per DAU | 15 → 5 |
| Inference opportunity | inferrable_fields / total_fields | >50% |
| Compression score | weighted avg from compression doc | >60% on top 5 flows |
| Journal funnel completion | started → saved | >70% |
| Finance tx completion | started → saved | >85% |
| Onboarding completion | started → done | >75% |
| Day 7 return | activation cohort | >40% |
| Palette DAU % | users opening ⌘K | >15% power users |

---

## Funnels (from telemetry spec)

### 1. Journal Core
```
overview_viewed → journal_navigated → journal_entry_started → first_character_typed → journal_entry_saved → journal_ai_analyze_completed
```

### 2. Activation
```
auth_login_completed → email_verified → onboarding_completed → first_habit_toggle OR first_journal_saved → day_7_return
```

### 3. Command Palette
```
command_palette_opened → search_query_typed → results_filtered → command_palette_action_executed → save_success
```

### 4. AI Usage
```
ai_surface_viewed → ai_input_started → ai_request_sent → ai_response_rendered → ai_action_accepted
```

### 5. Drop-off
```
any_form_started → field_focused → field_abandoned → form_abandoned → route_exit
```

---

## Composite scores (derived)

| Score | Use |
|-------|-----|
| Interaction cost | clicks + fields×2 + confirms×3 |
| Cognitive burden | decision_fatigue + hesitation |
| Automation opportunity | AI-eligible / total interactions |
| Inference opportunity | inferrable fields / total fields |

---

## Behavioral indicators

| Signal | Threshold | Meaning |
|--------|-----------|---------|
| rage_click | ≥3 in 800ms | Broken UI |
| field_hesitation | >8s no input | Bad field |
| mood_picker_loop | ≥3 opens no save | Duplicate mood UX |
| decision_fatigue | ≥5 dropdown changes | Form too heavy |
| onboarding_idle | >60s on step | Drop-off risk |

---

## Dashboard panels (proposed)

1. Auth funnel
2. Onboarding by step
3. Capture DAU (journal, habit, finance)
4. Palette adoption
5. AI latency + acceptance
6. Friction heatmap by route
7. Compression progress (field_count trend)

## Related

- `docs/interaction-telemetry.md`
- [[../product-intelligence/INTERACTION_COMPRESSION_SCORE]]
- [[11_EXPERIMENTS]]
