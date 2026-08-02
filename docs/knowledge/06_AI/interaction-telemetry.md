# AIIMIN — Interaction Telemetry Specification

**Status:** Proposed taxonomy (no telemetry shipped).  
**Interactions covered:** 578

---

## Event Schema (Standard Properties)

All events SHOULD include where applicable:

| Property | Type | Description |
|----------|------|-------------|
| page | string | Current route |
| source | string | UI component / trigger |
| device | enum | desktop, mobile, tablet |
| input_type | enum | click, keyboard, voice, file, etc. |
| previous_page | string | document.referrer route |
| interaction_time_ms | number | Duration |
| words_typed | number | NLP count |
| characters_deleted | number | Backspace aggregate |
| backspaces | number | Backspace count |
| paste_count | number | Paste events |
| voice_duration_ms | number | Recording length |
| dropdown_changes | number | Selection changes |
| selection_count | number | Multi-select count |
| undo_count | number | Undo actions |
| navigation_depth | number | Steps from /overview |
| time_since_last_interaction_ms | number | Idle gap |
| session_duration_ms | number | Session length |
| scroll_depth_pct | number | Max scroll |
| focus_lost_count | number | blur events |
| idle_time_ms | number | No input period |
| completion_status | enum | started, completed, abandoned, error |

---

## Event Taxonomy (by feature)

### Auth & Onboarding

#### auth_login_started
| Field | Value |
|-------|-------|
| **Trigger** | User lands `/login` or clicks sign in |
| **Properties** | page, source, device, previous_page |
| **Business Question** | Which auth path do users prefer? |
| **Success Metric** | auth_login_completed |
| **Failure Metric** | auth_login_abandoned |
| **North Star Impact** | Activation gate |
| **Retention Impact** | High — blocked without login |
| **Activation Impact** | Critical |
| **Engineering Difficulty** | Low |
| **Privacy** | No PII in event name; hash email server-side |
| **Sampling** | 100% |
| **Dashboard** | Auth funnel panel |

#### auth_oauth_clicked
| Field | Value |
|-------|-------|
| **Trigger** | Click Continue with Google |
| **Properties** | page, device, interaction_time_ms |
| **Business Question** | OAuth vs email split? |
| **Success Metric** | auth_callback_success |
| **Failure Metric** | auth_callback_error |
| **North Star Impact** | Faster TTV |
| **Retention Impact** | Medium |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Provider name only |
| **Sampling** | 100% |
| **Dashboard** | Auth method breakdown |

#### onboarding_step_viewed / onboarding_step_completed
| Field | Value |
|-------|-------|
| **Trigger** | Step render / Continue click |
| **Properties** | step_index, step_name, interaction_time_ms, completion_status, dropdown_changes, selection_count |
| **Business Question** | Where does onboarding drop off? |
| **Success Metric** | onboarding_completed |
| **Failure Metric** | onboarding_abandoned at step N |
| **North Star Impact** | Setup quality |
| **Retention Impact** | Very high |
| **Activation Impact** | Critical |
| **Engineering Difficulty** | Medium |
| **Privacy** | No raw PIN; step names only |
| **Sampling** | 100% |
| **Dashboard** | Onboarding funnel by step |

#### onboarding_pin_completed
| Field | Value |
|-------|-------|
| **Trigger** | PIN confirm match |
| **Properties** | interaction_time_ms, backspaces, completion_status |
| **Business Question** | PIN entry frustration? |
| **Success Metric** | onboarding_step_completed |
| **Failure Metric** | pin_mismatch_shake |
| **North Star Impact** | Security vs drop-off |
| **Retention Impact** | Medium |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Never log PIN digits |
| **Sampling** | 100% |
| **Dashboard** | PIN retry rate |

### Global Shell

#### command_palette_opened
| Field | Value |
|-------|-------|
| **Trigger** | ⌘/Ctrl+K or programmatic |
| **Properties** | source (keyboard/button), session_duration_ms |
| **Business Question** | Power feature adoption? |
| **Success Metric** | command_palette_action_executed |
| **Failure Metric** | command_palette_closed_empty |
| **North Star Impact** | Efficiency |
| **Retention Impact** | High for power users |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Low |
| **Privacy** | None |
| **Sampling** | 100% |
| **Dashboard** | Palette DAU % |

#### command_palette_action_executed
| Field | Value |
|-------|-------|
| **Trigger** | Enter on action |
| **Properties** | action_id, action_type, words_typed, voice_duration_ms, interaction_time_ms, completion_status |
| **Business Question** | Which quick actions used? |
| **Success Metric** | log_saved_success |
| **Failure Metric** | log_saved_error |
| **North Star Impact** | Capture rate |
| **Retention Impact** | High |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Medium |
| **Privacy** | Hash free-text length only client-side; content server |
| **Sampling** | 100% |
| **Dashboard** | Top palette actions |

#### universal_logger_opened / universal_logger_saved
| Field | Value |
|-------|-------|
| **Trigger** | Space→L chord / save |
| **Properties** | source, words_typed, interaction_time_ms, completion_status |
| **Business Question** | Chord discoverability? |
| **Success Metric** | saved |
| **Failure Metric** | abandoned |
| **North Star Impact** | Daily capture |
| **Retention Impact** | Medium |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Medium |
| **Privacy** | Content server-side only |
| **Sampling** | 100% |
| **Dashboard** | Logger usage vs palette |

### Journal

#### journal_entry_started
| Field | Value |
|-------|-------|
| **Trigger** | Focus capture input or mood tap |
| **Properties** | page, mode, source, device, input_type |
| **Business Question** | Why do users abandon journaling? |
| **Success Metric** | journal_entry_saved |
| **Failure Metric** | journal_entry_abandoned |
| **North Star Impact** | Core loop |
| **Retention Impact** | Very high |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | No body content in analytics |
| **Sampling** | 100% |
| **Dashboard** | Journal funnel |

#### journal_entry_saved
| Field | Value |
|-------|-------|
| **Trigger** | Send click or mood-only save |
| **Properties** | mode, mood, words_typed, voice_duration_ms, interaction_time_ms, input_type, completion_status |
| **Business Question** | Mood-only vs text ratio? |
| **Success Metric** | save OK |
| **Failure Metric** | save error |
| **North Star Impact** | Daily active reflection |
| **Retention Impact** | Very high |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Mood OK; body encrypted |
| **Sampling** | 100% |
| **Dashboard** | Capture mode mix |

#### journal_ai_analyze_requested / journal_ai_analyze_completed
| Field | Value |
|-------|-------|
| **Trigger** | Post-save analyze |
| **Properties** | interaction_time_ms, completion_status |
| **Business Question** | AI value perception? |
| **Success Metric** | analyze_completed |
| **Failure Metric** | analyze_timeout |
| **North Star Impact** | AI differentiation |
| **Retention Impact** | Medium |
| **Activation Impact** | Medium |
| **Engineering Difficulty** | Medium |
| **Privacy** | Entry ID only client |
| **Sampling** | 80% |
| **Dashboard** | AI latency + completion |

### Habits & Goals

#### habit_toggle_completed
| Field | Value |
|-------|-------|
| **Trigger** | Checkbox click |
| **Properties** | habit_id, done, interaction_time_ms |
| **Business Question** | Daily habit engagement? |
| **Success Metric** | API success |
| **Failure Metric** | revert on fail |
| **North Star Impact** | Consistency |
| **Retention Impact** | Very high |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | habit_id OK |
| **Sampling** | 100% |
| **Dashboard** | Habits DAU |

#### habit_created / goal_created
| Field | Value |
|-------|-------|
| **Trigger** | Modal save |
| **Properties** | field_count, dropdown_changes, interaction_time_ms, completion_status |
| **Business Question** | Setup friction for new habits/goals? |
| **Success Metric** | created |
| **Failure Metric** | modal_abandoned |
| **North Star Impact** | Personalization |
| **Retention Impact** | High |
| **Activation Impact** | High |
| **Engineering Difficulty** | Low |
| **Privacy** | Titles server-side |
| **Sampling** | 100% |
| **Dashboard** | Create funnel |

### Finance, Calendar, Family, Lab, Placements

| Event Name | Trigger | Key Properties | Business Question |
|------------|---------|----------------|-------------------|
| finance_entry_started | Open EntryForm | page, tab | Tx logging friction? |
| finance_entry_saved | Add click | amount, category, interaction_time_ms | Category accuracy? |
| finance_entry_abandoned | Close w/o save | fields_filled_count | Drop-off fields? |
| calendar_event_created | EventModal save | recurrence, allDay | Scheduling patterns? |
| calendar_quick_add_used | Enter inline | interaction_time_ms | Fast path adoption? |
| family_member_saved | Member form save | field_count | Vault completion? |
| family_document_uploaded | Upload success | file_type, interaction_time_ms | Upload friction? |
| lab_module_opened | Module card click | module_key | Module popularity? |
| lab_vocal_recording_completed | 60s done | voice_duration_ms | Speaking engagement? |
| lab_ats_analyze_completed | Analyze done | interaction_time_ms, completion_status | ATS TTV? |
| placements_application_created | Intake submit | stage | Pipeline inflow? |
| placements_stage_changed | Pipeline update | from_stage, to_stage | Conversion rates? |

### Account & Destructive

| Event Name | Trigger | Business Question |
|------------|---------|-------------------|
| account_delete_started | Click delete | Churn intent? |
| account_delete_confirmed | Typed confirm OK | Irreversible churn |
| data_export_requested | Export click | Portability usage |
| settings_wipe_data_confirmed | Wipe confirm | Recovery failures? |
| tier_upgrade_clicked | Upgrade CTA | Monetization |
| tier_gate_hit | Blocked route | Feature demand |

---

## Funnels

### 1. Journal Core Funnel
```
overview_viewed → journal_navigated → journal_entry_started → first_character_typed → journal_entry_saved → journal_ai_analyze_completed
```

### 2. Drop-off Funnel
```
any_form_started → field_focused → field_abandoned → form_abandoned → route_exit
```

### 3. Activation Funnel
```
auth_login_completed → email_verified → onboarding_completed → first_habit_toggle OR first_journal_saved → day_7_return
```

### 4. Habit Completion Funnel
```
habits_page_viewed → habit_toggle_started → habit_toggle_completed → streak_milestone_viewed
```

### 5. Search Funnel
```
command_palette_opened → search_query_typed → results_filtered → command_palette_action_executed
```

### 6. Command Palette Funnel
```
palette_opened → action_highlighted → action_executed → save_success
```

### 7. AI Usage Funnel
```
ai_surface_viewed → ai_input_started → ai_request_sent → ai_response_rendered → ai_action_accepted
```

---

## Behavioral Indicators

### 10. Rage click indicators
- ≥3 clicks same element in 800ms → `rage_click_detected` (element_id, page)

### 11. Hesitation indicators
- Field focused >8s without input → `field_hesitation` (field_name, page)
- Palette open >15s no action → `palette_hesitation`

### 12. Confusion indicators
- Back-nav within 3s of route enter → `quick_back_navigation`
- Repeated tier_gate_hit same session → `upgrade_confusion`

### 13. Abandonment indicators
- Form started, no submit, route change → `form_abandoned`
- Onboarding step >60s idle → `onboarding_idle_abandon`

### 14. Decision fatigue indicators
- ≥5 dropdown_changes single form → `decision_fatigue_signal`
- Mood picker opened ≥3x session without save → `mood_picker_loop`

---

## Composite Scores (derived metrics)

| Score | Formula (conceptual) | Use |
|-------|---------------------|-----|
| **15. Interaction cost** | clicks×1 + fields×2 + confirms×3 + context_switch×2 | Page compare |
| **16. Typing burden** | words_typed × session | Content-heavy flows |
| **17. Cognitive burden** | decision_fatigue_events + hesitation_ms/1000 | Onboarding/Lab |
| **18. Click burden** | clicks + navigation_depth×2 | Mobile nav |
| **19. Inference opportunity** | fields_inferrable / fields_total | Automation ROI |
| **20. Automation opportunity** | AI-eligible interactions / total | AI roadmap |

---

## Time-to-Value Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| TTV-1 | Login → Overview | <60s |
| TTV-2 | Overview → first capture saved | <3 min |
| TTV-3 | Signup → onboarding complete | <8 min |
| TTV-4 | First journal → first AI insight | <24h |
| TTV-5 | First habit create → first toggle | <5 min |

---

## Master Priority Table

| Feature | Events | Current Manual Work | Automation Potential | Est. Retention Gain | Priority |
|---------|--------|--------------------|-----------------------|--------------------:|----------|
| Journal | 8 | Mood+text entry | High — infer mood/mode | +15% D7 | P0 |
| Command Palette / AI Log | 6 | NL classification | Full AI routing | +12% D7 | P0 |
| Habits | 5 | Daily toggle | Medium — smart reminders | +18% D7 | P0 |
| Onboarding | 12 | 9-step setup | High — infer goals/habits | +10% activation | P0 |
| Overview DailyLog | 4 | Multi-metric form | High — wearable/calendar | +8% D7 | P1 |
| Finance | 6 | 6-field tx | High — merchant category | +5% D30 | P1 |
| Goals | 4 | 7-field modal | Medium — milestone AI | +6% D30 | P1 |
| Calendar | 4 | EventModal | Medium — NLP title→event | +4% D30 | P2 |
| Family | 5 | 65+ field vault | Low short-term | +2% D30 | P3 |
| Lab | 8 | Module-specific | Mixed | +5% engagement | P2 |
| Placements | 5 | CRM entry | High — email/JD parse | Niche | P2 |
| Focus | 4 | Timer+reflection | Medium — auto session detect | +5% D7 | P2 |
| Auth | 6 | PIN+email | Medium — passkey | +3% activation | P1 |
| Account/Settings | 6 | Nav/theme config | Medium — usage-based pins | +2% D30 | P3 |

---

## Complete Event Index

`auth_*`, `onboarding_*`, `waitlist_*`, `command_palette_*`, `universal_logger_*`, `nav_*`, `notification_*`, `journal_*`, `habit_*`, `goal_*`, `finance_*`, `calendar_*`, `family_*`, `focus_*`, `lab_*`, `placements_*`, `discipline_*`, `notes_*`, `insights_*`, `reports_*`, `account_*`, `settings_*`, `tier_*`, `feedback_*`, `tour_*`, `rage_click_*`, `hesitation_*`, `form_abandoned`, `decision_fatigue_signal`
