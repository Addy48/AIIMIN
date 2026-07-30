# AIIMIN — Friction Analysis

## Section 2 — Screen Friction Heatmap (Highest → Lowest)

| Rank | Screen / Route | Avg Friction | Avg Decision Fatigue | Primary cost drivers |
|------|----------------|-------------:|---------------------:|----------------------|
| 1 | Onboarding `/onboarding` | 6.8 | 6.5 | 9 steps, PIN, goal/habit picks, arc typing |
| 2 | Family Vault `/family` | 6.5 | 5.8 | 65+ fields, uploads, emergency card |
| 3 | Finance `/finance` | 5.8 | 5.2 | Multi-tab, 6-field tx form, budgets |
| 4 | Placements `/placements` | 5.5 | 5.0 | Pipeline CRM, resume upload, ATS |
| 5 | Lab `/lab` | 5.0 | 4.8 | 14-module choice, module-specific forms |
| 6 | Login `/login` | 4.8 | 4.5 | OAuth + email + PIN paths |
| 7 | Goals `/goals` | 4.5 | 4.8 | 7-field modal, milestones |
| 8 | Calendar `/calendar` | 4.2 | 3.8 | EventModal 6 fields |
| 9 | Overview `/overview` | 4.0 | 3.5 | DailyLog multi-metric |
| 10 | Journal `/journal` | 3.8 | 3.0 | Mode choice; capture itself low |
| 11 | Account `/account` | 4.0 | 3.5 | 8 sections, delete account |
| 12 | Settings `/settings` | 3.8 | 3.2 | Theme, nav pins, wipe data |
| 13 | Discipline `/discipline` | 4.5 | 4.0 | Trigger modal |
| 14 | Focus `/focus` | 3.5 | 2.8 | Timer + reflection |
| 15 | Habits `/habits` | 3.2 | 2.5 | Toggle low; create modal higher |
| 16 | Insights `/insights` | 3.0 | 2.0 | Read + filter |
| 17 | Reports `/reports` | 3.0 | 2.0 | Period select |
| 18 | Notes `/notes` | 3.0 | 2.0 | Inline typing |
| 19 | Identity `/identity` | 3.5 | 3.0 | Arc editing |
| 20 | Sports `/sports` | 2.0 | 1.5 | Read-only |
| 21 | Waitlist `/` | 2.5 | 2.5 | Email + pricing |
| 22 | Legal pages | 1.5 | 1.0 | Read only |
| 23 | Command Palette (overlay) | 2.5 | 2.0 | Power-user fast path |

---

## Section 3 — Top 100 Most Expensive Interactions

Ranked by composite: time + thinking + typing + decisions + context switch.

| Rank | INT-ID | Interaction | Feature | Composite | Primary burden |
|------|--------|-------------|---------|----------:|----------------|
| 1 | INT-006 | Onboarding 6-digit PIN setup | Onboarding | 95 | Memory + 12 taps |
| 2 | INT-039 | Delete account typed confirm | Account | 92 | Fear + typing + irreversible |
| 3 | INT-024 | Family emergency card full edit | Family | 90 | 20+ fields, rare use |
| 4 | INT-023 | Family member add (10+ fields) | Family | 88 | High field count |
| 5 | INT-011 | Onboarding goal multi-select | Onboarding | 85 | Decision fatigue |
| 6 | INT-012 | Onboarding habit multi-select | Onboarding | 85 | Decision fatigue |
| 7 | INT-003 | Login PIN create 4-digit | Auth | 82 | Security friction |
| 8 | INT-285 | Finance EntryForm 6 fields | Finance | 80 | Every transaction |
| 9 | INT-014 | Life Arc free-text editor | Onboarding | 78 | Blank page syndrome |
| 10 | INT-493 | Placements application intake | Placements | 75 | CRM data entry |
| 11 | INT-435 | Lab ATS resume + JD analyze | Lab | 72 | File + paste + wait |
| 12 | INT-022 | Family document upload | Family | 70 | File pick + metadata |
| 13 | INT-265 | Goals create modal 7 fields | Goals | 68 | Planning overhead |
| 14 | INT-333 | Calendar EventModal full | Calendar | 65 | Date/time cognitive load |
| 15 | INT-010 | Onboarding username availability | Onboarding | 62 | Wait + uniqueness |
| 16 | INT-432 | Lab module launcher (14 choices) | Lab | 60 | Choice overload |
| 17 | INT-002 | Email signup 3 fields | Auth | 58 | Password rules |
| 18 | INT-537 | Discipline trigger modal | Discipline | 55 | Emotional recall |
| 19 | INT-099 | DailyLogForm multi-metric | Overview | 55 | Daily repeated cost |
| 20 | INT-056 | Command Palette Smart AI Log | Shell | 52 | NL trust + wait |
| 21 | INT-213 | Habits create modal 5 fields | Habits | 50 | Setup friction |
| 22 | INT-505 | Account password change 3 fields | Account | 48 | Security |
| 23 | INT-431 | Vocal Mastery 60s record | Lab | 48 | Performance anxiety |
| 24 | INT-288 | Finance budget inline edit | Finance | 45 | Numeric planning |
| 25 | INT-013 | Onboarding wake time | Onboarding | 42 | Low confidence default |
| 26 | INT-008 | Onboarding full name | Onboarding | 40 | Could prefill |
| 27 | INT-494 | Placements resume archive upload | Placements | 40 | File management |
| 28 | INT-290 | Finance delete asset confirm | Finance | 38 | Destructive |
| 29 | INT-291 | Finance account remove confirm | Finance | 38 | Destructive |
| 30 | INT-536 | Notes delete confirm | Notes | 35 | Destructive |
| 31 | INT-417 | Focus abandon flow confirm | Focus | 35 | Interrupt cost |
| 32 | INT-496 | Placements abandon track confirm | Placements | 35 | Destructive |
| 33 | INT-268 | Goals milestone batch entry | Goals | 35 | Multiple text fields |
| 34 | INT-434 | Decision Matrix grid scoring | Lab | 35 | Matrix thinking |
| 35 | INT-166 | Journal structured mode switch | Journal | 32 | Mode decision |
| 36 | INT-167 | Journal CBT mode fields | Journal | 32 | Therapeutic prompts |
| 37 | INT-059 | Command Palette mood 1-10 | Shell | 30 | Duplicate surface |
| 38 | INT-163 | Journal voice dictation | Journal | 30 | Privacy + STT |
| 39 | INT-060 | Universal Logger Space→L | Shell | 28 | Discoverability |
| 40 | INT-035 | Personalization persona preset | Account | 28 | Identity choice |
| 41 | INT-034 | Nav pin editor | Account | 28 | Layout config |
| 42 | INT-287 | Finance WhatIf simulator | Finance | 28 | Scenario thinking |
| 43 | INT-433 | Typing test lesson + passage | Lab | 25 | Sustained typing |
| 44 | INT-509 | Settings wipe all data confirm | Settings | 25 | Destructive |
| 45 | INT-510 | Settings permanent delete confirm | Settings | 25 | Destructive |
| 46 | INT-007 | Verify email resend flow | Auth | 25 | Context switch email |
| 47 | INT-016 | Waitlist pricing tier select | Waitlist | 25 | Pricing decision |
| 48 | INT-269 | Goals pillar filter tabs | Goals | 22 | Low |
| 49 | INT-332 | Calendar quick-add inline | Calendar | 22 | Fast path |
| 50 | INT-161 | Journal capture type+send | Journal | 20 | Core loop |
| 51 | INT-162 | Journal mood-only strip | Journal | 15 | Lowest capture |
| 52 | INT-211 | Habit today toggle | Habits | 12 | Lowest action |
| 53 | INT-054 | Command Palette ⌘K open | Shell | 12 | Power user |
| 54 | INT-055 | Command Palette search | Shell | 15 | Filter |
| 55 | INT-057 | Command Palette Log Win | Shell | 18 | Inline |
| 56 | INT-058 | Command Palette Log Note | Shell | 18 | Inline |
| 57 | INT-061 | ProductTour step advance | Shell | 15 | One-time |
| 58 | INT-062 | Guest tour CTA | Shell | 18 | Conversion |
| 59 | INT-063 | Guest banner Sign Up | Shell | 15 | Conversion |
| 60 | INT-064 | Notification bell open | Shell | 12 | Glance |
| 61 | INT-065 | Notification mark read | Shell | 10 | Triage |
| 62 | INT-066 | TierRouteGuard upgrade modal | Shell | 25 | Paywall |
| 63 | INT-067 | InstallPrompt PWA | Shell | 15 | One-time |
| 64 | INT-068 | GlobalMusicPlayer toggle | Shell | 8 | Ambient |
| 65 | INT-069 | XP level-up modal | Shell | 10 | Reward |
| 66 | INT-049 | Navbar pinned link | Shell | 8 | Navigation |
| 67 | INT-050 | Navbar More dropdown | Shell | 12 | Navigation |
| 68 | INT-051 | Navbar avatar account | Shell | 8 | Navigation |
| 69 | INT-052 | Mobile hamburger drawer | Shell | 12 | Navigation |
| 70 | INT-053 | BottomNav tab | Shell | 8 | Navigation |
| 71 | INT-170 | Journal entry sidebar select | Journal | 12 | History |
| 72 | INT-171 | Journal AI analyze | Journal | 15 | Post-save |
| 73 | INT-215 | Habit delete confirm | Habits | 25 | Destructive |
| 74 | INT-216 | Streak analytics filter | Habits | 15 | Analytics |
| 75 | INT-334 | Calendar event delete | Calendar | 25 | Destructive |
| 76 | INT-335 | Calendar sidebar day pick | Calendar | 10 | Navigation |
| 77 | INT-436 | Flashcard review session | Lab | 20 | Learning |
| 78 | INT-437 | Addiction craving log | Lab | 25 | Sensitive |
| 79 | INT-495 | Pipeline stage update | Placements | 20 | CRM |
| 80 | INT-529 | Insights domain filter | Insights | 12 | Filter |
| 81 | INT-530 | Reports period select | Reports | 12 | Filter |
| 82 | INT-533 | Notes new (N shortcut) | Notes | 18 | Capture |
| 83 | INT-502 | Profile save | Account | 22 | Profile |
| 84 | INT-503 | Theme swatch pick | Account | 10 | Preference |
| 85 | INT-504 | Data export JSON | Account | 15 | Compliance |
| 86 | INT-506 | Subscription upgrade | Account | 25 | Monetization |
| 87 | INT-018 | Feedback submit | Auth/Global | 20 | Feedback |
| 88 | INT-415 | Pomodoro start | Focus | 12 | Timer |
| 89 | INT-416 | Pomodoro goal link | Focus | 18 | Attribution |
| 90 | INT-418 | Focus reflection save | Focus | 22 | Retrospective |
| 91 | INT-001 | Google OAuth | Auth | 15 | Auth |
| 92 | INT-004 | Email signin | Auth | 18 | Auth |
| 93 | INT-015 | Waitlist email submit | Waitlist | 12 | Acquisition |
| 94 | INT-019 | Legal read | Legal | 5 | Compliance |
| 95 | INT-531 | Sports match preview scroll | Sports | 8 | Read |
| 96 | INT-532 | Identity arc edit | Identity | 25 | Self-concept |
| 97 | INT-538 | Discipline score view | Discipline | 8 | Read |
| 98 | INT-559 | Seed data dev | Dev | 15 | Dev only |
| 99 | INT-560 | Admin table wipe | Dev | 40 | Destructive dev |
| 100 | INT-020 | Brand assets scroll | Brand | 5 | Marketing |
