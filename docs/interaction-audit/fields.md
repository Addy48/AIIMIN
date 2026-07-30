# AIIMIN — Master Field Table

Every field AIIMIN asks users to provide.

| Feature | Field | Type | Required | Optional | Frequency | Could infer? | Confidence |
|---------|-------|------|----------|----------|-----------|--------------|------------|
| Auth | email | email | signup/signin | — | per session | Partial (OAuth) | High |
| Auth | password | password | email auth | — | per session | NO | — |
| Auth | confirmPassword | password | signup | — | once | NO | — |
| Auth | PIN (4) | numpad | login PIN | — | per login | NO | — |
| Auth | PIN (6) | numpad | onboarding | — | once | NO | — |
| Onboarding | fullName | text | yes | — | once | High (OAuth) | High |
| Onboarding | username | text | yes | — | once | Medium (email) | Medium |
| Onboarding | selectedGoals[] | multi-select | yes (≥1) | — | once | Medium (persona) | Medium |
| Onboarding | selectedHabits[] | multi-select | yes (≥1) | — | once | Medium (goals) | Medium |
| Onboarding | wakeTime | time | yes | — | once | Medium (first open) | Low |
| Onboarding | lifeArc | textarea | yes | — | once | Medium (goals) | Medium |
| Waitlist | email | email | yes | — | once | High (autofill) | High |
| Waitlist | name | text | — | yes | once | Medium | Medium |
| Daily Log | mood | 1-10 | — | yes | daily | High (text/voice) | Medium |
| Daily Log | sleep_hours | number | — | yes | daily | High (wearable) | Medium |
| Daily Log | gym | boolean | — | yes | daily | Medium (calendar) | Low |
| Daily Log | learning_hours | number | — | yes | daily | Medium (focus timer) | Medium |
| Journal | body | textarea | OR mood-only | yes | daily+ | NO | — |
| Journal | mood | 1-10 | — | yes | daily+ | High (NLP) | Medium |
| Journal | mode fields (CBT) | structured | mode-dep | yes | weekly | Medium (AI) | Low |
| Habits | name | text | yes | — | per habit | NO | — |
| Habits | emoji | picker | — | yes | per habit | Low (name) | Low |
| Habits | category | dropdown | — | yes | per habit | Medium (name) | Low |
| Habits | color | color | — | yes | per habit | Low | Low |
| Habits | description | text | — | yes | per habit | Medium (name) | Low |
| Goals | title | text | yes | — | per goal | NO | — |
| Goals | pillar | select | yes | — | per goal | Medium (title NLP) | Low |
| Goals | priority | select | yes | — | per goal | Medium (deadline) | Low |
| Goals | targetDate | date | — | yes | per goal | Medium (milestones) | Low |
| Goals | why | textarea | — | yes | per goal | Medium (title) | Low |
| Goals | milestones[].text | text | — | yes (≤5) | per goal | Medium (AI) | Medium |
| Finance | amount | number | yes | — | per tx | NO | — |
| Finance | type | income/expense | yes | — | per tx | Medium (sign) | Low |
| Finance | category | dropdown | yes | — | per tx | High (merchant NLP) | High |
| Finance | account | dropdown | yes | — | per tx | Medium (last used) | Medium |
| Finance | date | date | yes | — | per tx | High (today default) | High |
| Finance | note | text | — | yes | per tx | Medium (receipt OCR) | Medium |
| Calendar | title | text | yes | — | per event | Partial (NLP) | Low |
| Calendar | start/end | datetime | yes | — | per event | Medium (duration default) | Medium |
| Calendar | allDay | boolean | — | yes | per event | Medium (time) | Medium |
| Calendar | recurrence | select | — | yes | per event | Low | Low |
| Family | member.name | text | yes | — | per member | NO | — |
| Family | member.relation | select | — | yes | per member | NO | — |
| Family | member.DOB | date | — | yes | per member | NO | — |
| Family | member.blood_group | select | — | yes | per member | NO | — |
| Family | member.phone | tel | — | yes | per member | Medium (contacts) | Low |
| Family | document.file | file | yes | — | per doc | NO | — |
| Family | document.label | text | — | yes | per doc | Medium (filename) | Medium |
| Family | emergency.contacts[] | composite | — | yes | rare | Medium (members) | Medium |
| Family | emergency.meds[] | text | — | yes | rare | NO | — |
| Family | emergency.allergies | text | — | yes | rare | NO | — |
| Placements | company | text | yes | — | per app | NO | — |
| Placements | role | text | yes | — | per app | Medium (JD paste) | Medium |
| Placements | stage | select | yes | — | per app | Medium (email parse) | Low |
| Placements | application_date | date | — | yes | per app | High (today) | High |
| Placements | notes | textarea | — | yes | per app | Medium (AI) | Low |
| Placements | link | url | — | yes | per app | Medium (clipboard) | Medium |
| Placements | resume PDF | file | ATS | — | per analyze | NO | — |
| Placements | job description | textarea | ATS | — | per analyze | Medium (URL fetch) | Medium |
| Focus | session rating | 1-5 | — | yes | per session | Medium (duration) | Low |
| Focus | session notes | text | — | yes | per session | Medium (AI) | Low |
| Focus | linked goalId | select | — | yes | per session | Medium (last active) | Medium |
| Discipline | trigger | text/tags | yes | — | per log | Medium (patterns) | Medium |
| Discipline | intensity | 1-10 | — | yes | per log | Low | Low |
| Discipline | replacement_habit | select | — | yes | per log | Medium (habits) | Medium |
| Notes | title | text | — | yes | per note | Medium (first line) | High |
| Notes | body | textarea | — | yes | per note | NO | — |
| Account | displayName | text | — | yes | rare | High (onboarding) | High |
| Account | location | text | — | yes | rare | Medium (IP/geo) | Low |
| Account | bio | textarea | — | yes | rare | Medium (AI) | Low |
| Account | avatar | image | — | yes | rare | Medium (OAuth) | Medium |
| Settings | theme | select | — | yes | rare | High (OS) | High |
| Settings | pinnedNav[] | multi | yes (≥1) | — | rare | Medium (usage) | Medium |
| Settings | persona preset | select | — | yes | once | Medium (behavior) | Medium |
| Feedback | message | textarea | yes | — | rare | NO | — |
| Feedback | category | select | — | yes | rare | Medium (page) | Medium |
| Lab Addiction | substance | select | yes | — | per log | NO | — |
| Lab Addiction | intensity | number | — | yes | per log | Low | Low |
| Lab Addiction | trigger | text | — | yes | per log | Medium (patterns) | Medium |
| Command Palette | ai_log text | text/voice | yes | — | ad hoc | Partial | — |
| Command Palette | win/note text | text | yes | — | ad hoc | NO | — |
