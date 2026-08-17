# AIIMIN — Dropdown Audit

Every select, dropdown-menu, custom picker, and option list.

---

## Summary

| Metric | Count |
|--------|------:|
| Files with Select/Dropdown patterns | 52 |
| Native `<select>` tags | 26 |
| Custom dropdown components | 53 surfaces |

---

## Dropdown Registry

| DD-ID | Location | Options / Values | Purpose | Should exist? | Notes |
|-------|----------|------------------|---------|---------------|-------|
| DD-001 | Login theme picker | light, dark, system | Auth page theme preview | YES | Duplicates Settings theme |
| DD-002 | Onboarding goal chips | 12 preset goals | Seed goals | YES | Could infer from persona |
| DD-003 | Onboarding habit chips | 12 preset habits | Seed habits | YES | Could infer from goals |
| DD-004 | Onboarding wake time | time picker | Morning anchor | YES | Infer from usage |
| DD-005 | Navbar More menu | overflow NAV_REGISTRY routes | Desktop overflow nav | YES | Required for 12 routes |
| DD-006 | BottomNav More sheet | unpinned routes | Mobile overflow | YES | Required mobile |
| DD-007 | NotifDropdown | notification list | Alert inbox | YES | — |
| DD-008 | CommandPalette action list | 15 nav + 5 quick log | Universal launcher | YES | Core power-user UX |
| DD-009 | CommandPalette mood picker | 1-10 emoji moods | Quick mood | PARTIAL | Duplicates MoodTracker |
| DD-010 | FeedbackWidget category | bug, feature, other | Route feedback | YES | — |
| DD-011 | WaitlistQuickFeedback area | product areas | Targeted feedback | YES | — |
| DD-012 | Waitlist pricing tier | Free, Pro, Ultra | Interest signal | YES | — |
| DD-013 | Journal mode tabs | write, free, cbt, www, morning, weekly | Journal mode | YES | Could infer sentiment |
| DD-014 | Journal sidebar entry list | dated entries | History nav | YES | — |
| DD-015 | Habits create category | Health, Mind, Work, etc. | Organize habits | PARTIAL | Could default |
| DD-016 | Habits routine wizard | preset routines | Template pick | YES | — |
| DD-017 | Goals pillar select | 4 life pillars | Goal taxonomy | YES | — |
| DD-018 | Goals priority | High, Medium, Low | Prioritize | PARTIAL | Could infer urgency |
| DD-019 | Goals status | Active, Paused, Done | Lifecycle | YES | — |
| DD-020 | Finance entry type | income, expense | Transaction type | YES | — |
| DD-021 | Finance category | 20+ categories | Categorize spend | PARTIAL | Infer from merchant/note |
| DD-022 | Finance account | user accounts | Account attribution | YES | — |
| DD-023 | Finance tab bar | Overview, Transactions, Analytics, Wealth | Finance sections | YES | — |
| DD-024 | Calendar view | month, week | Calendar view | YES | — |
| DD-025 | EventModal color | preset colors | Event visual | PARTIAL | Default ok |
| DD-026 | EventModal recurrence | none, daily, weekly, monthly | Repeat rules | YES | — |
| DD-027 | EventTagSelector system_type | work, personal, health, etc. | Event tagging | PARTIAL | Infer from title |
| DD-028 | Family member relation | parent, sibling, etc. | Relationship | YES | — |
| DD-029 | Family doc category | medical, legal, etc. | Document type | PARTIAL | Infer from filename |
| DD-030 | Family member select (linked docs) | member list | Link doc to person | YES | — |
| DD-031 | Pomodoro goal link | active goals list | Session attribution | PARTIAL | Infer last active goal |
| DD-032 | Placements pipeline stage | Applied, OA, Interview, Offer, etc. | CRM stage | YES | — |
| DD-033 | Placements role filter | All + role tags | Filter applications | YES | — |
| DD-034 | Lab module launcher | 14 module keys | Tool picker | YES | Many modules = high choice load |
| DD-035 | VocalMastery topic | Technology, Politics, etc. | Speaking topic | PARTIAL | Random/spin exists |
| DD-036 | TypingTest lesson list | lesson catalog | Lesson pick | YES | — |
| DD-037 | AddictionTracker substance | preset list | Substance type | YES | — |
| DD-038 | Discipline TriggerModal time-of-day | morning, afternoon, evening, night | Trigger context | PARTIAL | Infer from clock |
| DD-039 | Discipline trigger multi-select | preset triggers | Trigger tags | PARTIAL | NL input |
| DD-040 | Insights domain cards | life domains | Filter insights | YES | — |
| DD-041 | Reports period | week, month, quarter | Report range | YES | — |
| DD-042 | Account section nav | 8 sections | Account areas | YES | — |
| DD-043 | Personalization persona | student, professional, etc. | Layout preset | PARTIAL | Infer from usage |
| DD-044 | NavPinEditor route list | NAV_REGISTRY | Pin management | YES | — |
| DD-045 | Settings theme swatches | light, dark, variants | Theme | YES | Duplicated 3x |
| DD-046 | Subscription tier | Free, Pro, Ultra | Plan select | YES | — |
| DD-047 | AdminPanel table select | DB tables | Dev admin | DEV ONLY | — |
| DD-048 | ProfileDropdown (design lab) | mock profile menu | Prototype | NO (internal) | design-internal |
| DD-049 | TeamSelector (design lab) | mock teams | Prototype | NO (internal) | design-internal |
| DD-050 | PersonalCalendar month/year | month grid picker | Jump month | YES | — |
| DD-051 | CalendarToolbar filter | event types | Filter calendar | YES | — |
| DD-052 | Money tabs account type | checking, savings, credit | Account setup | YES | — |
| DD-053 | Resume archive tags | custom tags | Version label | PARTIAL | Auto from filename |

---

## Audit Verdict

| Verdict | Count | Examples |
|---------|------:|----------|
| **Required** | 38 | Nav overflow, finance type, calendar view |
| **Partial — could simplify** | 11 | Mood picker dupes, finance category, goal priority |
| **Internal/dev only** | 4 | AdminPanel, Design Lab prototypes |
