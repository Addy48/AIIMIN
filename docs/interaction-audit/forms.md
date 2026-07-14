# AIIMIN — Forms Inventory

Every form-like submit flow: explicit `<form>` or `onSubmit` + field-level detail.

---

## Summary Table

| Form ID | Location | Submit trigger | Fields | Validation | Success | Cancel |
|---------|----------|----------------|--------|------------|---------|--------|
| F-001 | Login — email signup | Primary button / Enter | email, password, confirmPassword | email format, pwd match, min length | → PIN step or dashboard | Back link |
| F-002 | Login — PIN create/verify | Auto on 4 digits | PIN (4), confirm PIN | match, shake on fail | session | Back |
| F-003 | Login — email signin | Submit | email, password | required | session | toggle signup |
| F-004 | Onboarding step 0 | Continue | fullName | non-empty | → step 1 | — |
| F-005 | Onboarding step 1 | Continue | username | availability API | → step 2 | Back |
| F-006 | Onboarding step 2–3 | Auto PIN complete | pin, confirmPin | 6 digits, match | → step 4 | Back |
| F-007 | Onboarding step 4 | Continue | selectedGoals[] | ≥1 goal | → step 5 | Back |
| F-008 | Onboarding step 5 | Continue | selectedHabits[] | ≥1 habit | → step 6 | Back |
| F-009 | Onboarding step 6 | Continue | wakeTime | time | → step 7 | Back |
| F-010 | Onboarding step 7 | ArcEditor submit | lifeArc text | hasLifeArc rules | → step 8 | Back |
| F-011 | WaitlistForm | Submit | email, name (optional) | email required | waitlist confirm | — |
| F-012 | WaitlistQuickFeedback | Submit | feedback text, rating | — | toast | close |
| F-013 | FeedbackWidget | Submit | message, category | message required | API post | dismiss |
| F-014 | DailyLogForm | Save button | gym, mood, sleep, learning, etc. | — | API sync | — |
| F-015 | UniversalLogger / QuickCapture | Enter / Save | free text, category | — | multi-table insert | Esc |
| F-016 | JournalCapture | Send / mood strip | body, mood | body OR mood-only | journal_entries | — |
| F-017 | JournalEditor (structured) | Save per mode | mode-specific fields | mode rules | encrypted_content | discard |
| F-018 | Habits — create modal | Save | name, emoji, category, color, description | name required | API POST | modal close |
| F-019 | Goals — create/edit modal | Save | title, pillar, priority, targetDate, why, milestones[] | title required | API/local | modal close |
| F-020 | Finance EntryForm | Add | amount, type, category, account, date, note | amount > 0 | supabase | clear |
| F-021 | Finance WhatIfSimulator | Calculate | income, expenses, savings rate | numeric | display only | reset |
| F-022 | Calendar EventModal | Save | title, start, end, allDay, color, recurrence | title, dates | events table | delete confirm |
| F-023 | Calendar quick-add (CalendarShared) | Enter | title, time | — | inline create | Esc |
| F-024 | Family — member add | Save | name, relation, DOB, blood, phone, etc. | name | members API | cancel |
| F-025 | Family — document upload | Upload | file, label, category | file type | storage | cancel |
| F-026 | Family — emergency card | Save | contacts[], meds[], allergies | — | local/API | — |
| F-027 | Placements ApplicationIntakeModal | Submit | company, role, stage, date, notes, link | company+role | applications | close |
| F-028 | Placements ResumeArchiveModal | Upload | PDF file, tags | PDF | archive | close |
| F-029 | Discipline TriggerModal | Log | trigger, intensity, replacement habit | trigger text | discipline log | close |
| F-030 | Focus PostSessionReflection | Save | rating, notes, distractions | — | session log | skip |
| F-031 | PomodoroReflection | Submit | focus quality, notes | — | localStorage | skip |
| F-032 | Settings — password change | Update | newPwd, confirmPwd | match, min | API patch | — |
| F-033 | Settings — username edit | Save | nameVal | non-empty | metadata update | cancel edit |
| F-034 | ProfileSection | Save profile | display name, location, bio, avatar | — | API patch | — |
| F-035 | PersonalizationSection | Apply preset | persona, pinned nav, widgets | — | localStorage + API | reset |
| F-036 | NavPinEditor | Save pins | pinnedIds[], activeIds[] | min 1 pin | preferences hook | — |
| F-037 | SecuritySection | Change password | current, new, confirm | match | auth API | — |
| F-038 | DataSection — export | Click export | — | session | JSON download | — |
| F-039 | DataSection — delete account | Confirm + submit | confirm text | exact match | API delete | cancel |
| F-040 | MoneyAddTab / LendingTab / AccountsTab | Per-tab submit | amount, party, account fields | tab-specific | money tables | — |
| F-041 | DSACounter | Log session | problems, topic, duration | numeric | stats | — |
| F-042 | Lab AddictionTracker | Log craving | substance, intensity, trigger | — | lab table | — |
| F-043 | ATSAnalyzer | Analyze | resume file, JD text | both required | AI score | reset |
| F-044 | Notes — inline create | Enter / blur | title, body | — | localStorage | delete |
| F-045 | Contact legal page | mailto/link | — | — | external | — |
| F-046 | ArcEditor (onboarding/profile) | Save | arc statement | min length | profile | skip |
| F-047 | AdminPanel (dev) | Various | tier override, flags | admin email | API | — |

---

## Field Detail by Form

### F-016 Journal Capture

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| body | free text | OR mood-only | "" | trim for save |
| mood | slider 1–10 | no | 6 | 1–10 |
| voice | voice | no | — | browser API |

### F-018 Habits Create

| Field | Type | Required |
|-------|------|----------|
| name | text | yes |
| emoji | picker | no (default 💪) |
| category | dropdown | no |
| color | color picker | no |
| description | text | no |

### F-019 Goals Modal

| Field | Type | Required |
|-------|------|----------|
| title | text | yes |
| pillar | select (4) | yes |
| priority | select High/Med/Low | yes |
| targetDate | date | no |
| why | textarea | no |
| milestones[].text | text | no (max 5) |
| status | select | default Active |

### F-020 Finance Entry

| Field | Type | Required |
|-------|------|----------|
| amount | number | yes |
| type | income/expense | yes |
| category | dropdown | yes |
| account | dropdown | yes |
| date | date | yes |
| note | text | no |

### F-022 Calendar Event

| Field | Type | Required |
|-------|------|----------|
| title | text | yes |
| start | datetime | yes |
| end | datetime | yes |
| allDay | boolean | no |
| color | select | no |
| recurrence | select | no |

---

## Submit Flow Patterns

| Pattern | Examples | Steps |
|---------|----------|-------|
| **Optimistic toggle** | Habit done, goal milestone | 1 click → API → revert on fail |
| **Modal save** | Goals, Habits, Events | open → fill → save → close → list refresh |
| **Inline Enter** | Command palette, week tasks, notes | type → Enter → toast → clear |
| **Chord open** | Universal logger | Space→L → type → save |
| **Auto-advance PIN** | Login, Onboarding | digit entry → auto next step |
| **Confirm destructive** | Delete account, delete habit | action → ConfirmDialog → API |

---

## Forms Without Native `<form>` Tag

Most React pages use controlled inputs + `onClick` handlers. Functionally forms: F-014–F-047 listed above.

**Explicit `<form>` elements:** Login (partial), WaitlistForm, FeedbackWidget, EntryForm, ApplicationIntakeModal, ResumeArchiveModal, Money tabs, AddictionTracker, ai-input-search kokonutui.

---

## Validation & Error Surfaces

| Form | Error display |
|------|---------------|
| Login | inline red text, PIN shake animation |
| Onboarding | step error banner, username "taken" |
| Journal | toast on save fail |
| Finance | toast, inline amount highlight |
| Settings password | toast success/error |
| Tier gated | FeatureGate modal |
