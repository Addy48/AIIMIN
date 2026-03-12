# AIIMIN — Project Memory

## Owner
Aaditya Upadhyay — B.Tech CSE, Manipal University Jaipur

## Project
Personal Life Tracker Web Dashboard. Browser-based. Tracks daily metrics,
manages money, schedules via Google Calendar, measures focus via Pomodoro.
Gamification layer with XP, ranks, achievements, quests, streaks.

---

## Tech Stack

- Frontend: React 19 + Tailwind CSS
- Backend: Node.js + Express
- Database: Supabase hosted PostgreSQL (project: yubxgftugxbwtywyhcsv)
- Supabase URL: https://yubxgftugxbwtywyhcsv.supabase.co
- Hosting: Vercel (frontend) + Railway or Render (backend)
- Charts: Recharts
- Auth: Google OAuth 2.0 + Supabase Auth
- Excel parsing: XLSX library
- PDF reports: jsPDF (client-side), Puppeteer deferred
- Gamification: Custom XP engine, Web Audio API sounds

---

## Color Palette (LOCKED — do not deviate)

Dark mode:
- Background: #1a1a1a
- Cards: #2d2d2d
- Accent: #ff6b35 (burnt orange)
- Completion: #10b981 (green)
- Incomplete: #6b7280 (gray)

Light mode:
- Background: #f9f9f9
- Cards: #ffffff
- Accents: same as dark mode

---

## Architecture

### Two Views
- **Desktop** (`/`): Full dashboard with analytics, charts, insights, pomodoro, reports
- **Mobile** (`/m`): Data collection ONLY — log form, quick-entry sections, no analytics

### Frontend Structure
```
frontend/src/
├── components/
│   ├── mobile/          # Mobile data collection view
│   │   ├── MobileApp.jsx         # Main container, state, save handler, XP processing
│   │   ├── MobileHeader.jsx      # XP bar, rank badge, completion ring, streak
│   │   ├── MobileSaveBar.jsx     # Save button with XP preview
│   │   ├── MobileSections.jsx    # 9 data input sections (sleep, body, mind, etc.)
│   │   ├── MobileStreaks.jsx     # 5 streaks + XP multiplier display
│   │   ├── MobileGoals.jsx       # Goal setting + progress bars
│   │   ├── DailyQuests.jsx       # 3 daily quests from deterministic pool
│   │   ├── LevelUpModal.jsx      # Full-screen rank-up celebration
│   │   ├── AchievementUnlock.jsx # Achievement unlock modal
│   │   ├── AchievementsGallery.jsx # 4-column grid of all achievements
│   │   └── YearlyHeatmap.jsx     # 365-day GitHub-style grid
│   ├── calendar/        # MonthlyGrid, CalendarHeatmap, MetricMonthGrid
│   ├── dashboard/       # StatCard, WeekRows, QuickCapture, SettingsSection
│   ├── habits/          # HabitManager, HabitsPage, HabitsWidget, StreakAnalytics
│   ├── notifications/   # NotificationBell, NotificationPanel
│   ├── account/         # AccountModal, GoogleCalendarIntegration
│   ├── (desktop)        # CalendarIntegration, DailyLogForm, DSACounter,
│   │                    # InsightEngine, MomentumBar, MoneyManager, MoodTracker,
│   │                    # PomodoroTimer, Reports, SleepAnalytics, Streaks,
│   │                    # WeeklyReport, WinsEngine, YearlyHeatmap, YouTubePlayer
│   └── icons/
├── hooks/               # useAuth, useTheme, useFeatureFlag, useNotifications
├── pages/               # Dashboard, Login, AuthCallback, Brand
├── services/            # dbService.js (upsertRow, insertRow, updateRow, deleteRow)
├── utils/               # supabase.js, xpEngine.js, soundEngine.js, toast.js, api.js
└── styles/
```

### Backend Structure
```
backend/
├── supabase_init.sql     # SINGLE source of truth — 16 sections, all tables
├── index.js              # Express server entry
├── db.js / supabase.js   # Database connections
├── routes/               # 13 route files (auth, dailyLogs, calendar, commitment,
│                         #   dashboard, drift, googleAuth, habits, health,
│                         #   notifications, routines, youtube, account)
├── controllers/          # authController, dailyLogsController
├── middleware/            # auth, correlationId, errorHandler, requestLogger
├── jobs/                 # commitmentEvaluator, driftEvaluator
├── lib/                  # cache, crypto, googleClient, logger, oauthLogger
└── utils/                # BehavioralEngine
```

---

## 16 Locked Features — Status

| # | Feature | Status |
|---|---------|--------|
| 1 | Daily log form | ✅ DONE — sleep, gym, breakfast, steps, water, mood, energy, learning, journal, brain fog, headache |
| 2 | Monthly LeetCode grid | ✅ DONE — MonthlyGrid.jsx + CalendarHeatmap.jsx |
| 3 | Weekly charts | ✅ DONE — Recharts in SleepAnalytics, WeeklyReport |
| 4 | Money Manager | ✅ DONE — Excel import, manual entry, 13 categories, accounts system |
| 5 | Pomodoro timer | ✅ DONE — Desktop: 25/45/90 presets, reflection, deep mode, XP awards |
| 6 | Google Calendar | ✅ DONE — OAuth sync, drag/drop, auto-log to daily metrics |
| 7 | iPad journal sync | ⚠️ MVP — Manual copy-paste textarea (API sync deferred) |
| 8 | Streaks per metric | ✅ DONE — Overall, gym, learning, clean, steps streaks |
| 9 | Dark/Light mode | ✅ DONE — Persistent via useTheme hook |
| 10 | Color palette | ✅ LOCKED — CSS variables applied globally |
| 11 | Yearly heatmap | ✅ DONE — GitHub-style 365 grid, mobile + desktop |
| 12 | Win tracking | ✅ DONE — WinsEngine + MobileWinSection |
| 13 | Sleep quality tags | ✅ DONE — 8 tags UI (stress, caffeine, screen, gym fatigue, late night, noise, sickness, meds) |
| 14 | Monthly report | ⚠️ PARTIAL — jsPDF client-side export; Puppeteer deferred |
| 15 | Weekly/monthly goals | ✅ DONE — MobileGoals with 8 metrics × 3 frequencies |
| 16 | DSA counter | ✅ DONE — Desktop DSACounter + MobileDSASection |

---

## Gamification System

### XP Engine (xpEngine.js)
- 10 ranks (Apprentice → Grandmaster, DBZ-inspired thresholds)
- Daily XP: sleep +30, gym +25, breakfast +15, steps +20, water +10, learning +20, journal +15, win +10, clarity +10, clean_day +20, perfect_day +50
- Streak multiplier: 1.0× → 2.5× based on streak length
- Pomodoro XP: +30 per completed focus session
- Money XP: +15 per transaction (capped 3/day)
- 16 quest pool with deterministic daily selection
- 16 achievement definitions with auto-detection

### Sound Engine (soundEngine.js)
- Web Audio API: bell, chime, alarm, levelUp, xp sounds
- Browser notification support with permission management

### Gamification Tables (in supabase_init.sql SECTION 15)
- user_xp: total_xp, current_rank, power_level, longest_streak, clean_streak
- xp_log: daily XP history with breakdown JSONB + multiplier
- achievements: unlocked badges with xp_granted

---

## Mobile Data Logging Sections (MobileSections.jsx)

The mobile view is ONLY for data collection. No analytics, insights, or tools.

| Section | Component | Fields |
|---------|-----------|--------|
| Sleep | MobileSleepSection | bedtime, wake time, auto-calc hours, sleep quality tags (8 tags when <7h) |
| Body | MobileBodySection | gym (yes/no + duration), breakfast (yes/no), steps (text + chips), water (counter) |
| Mind | MobileMindSection | mood (1-10 slider), energy level (5 buttons), learning (toggle + topic chips), brain fog (foggy/okay/sharp), headache (toggle) |
| Journal | Inline textarea | Free text entry |
| Tasks | MobileTaskSection | Calendar events, add task, toggle complete |
| Money | MobileMoneySection | Quick transaction entry with account selection |
| Notes | MobileNotesSection | Quick notes |
| Wins | MobileWinSection | Daily small wins text |
| DSA | MobileDSASection | Log problems (platform, difficulty), stats |
| Reset | MobileResetSection | Private reset counter (resets clean_streak) |

---

## Database Schema (supabase_init.sql — 16 Sections)

1. Functions & Triggers (handle_new_user, updated_at trigger)
2. Users (id, email, googleId, theme, etc.)
3. Daily Tracking (daily_logs with all metric columns including brain_fog, headache)
4. Goals & Focus (personal_goals, pomodoro_sessions, dsa_problems)
5. Calendar & Notes (calendar_events, notes)
6. Wins & Commitments (wins, daily_commitments)
7. Money System (money_transactions, accounts, money_categories)
8. Habits & Routines (habits, routines, habit_completions, routine_logs)
9. Auth / OAuth (google_tokens, feature_flags)
10. Notifications & Analytics (notifications, user_daily_metrics)
11. Admin & System (admin_audit, system_config)
12. Schema Upgrade Guards (safe ALTER migrations)
13. Extended Financial (budgets, savings_goals, recurring_transactions)
14. Views (user_daily_metrics, behavioral_daily_summary)
15. Gamification (user_xp, xp_log, achievements, brain_fog/headache ALTER)
16. Verification Queries

---

## Key Data Fields — daily_logs table

sleep_start, sleep_end, sleep_hours, gym_done, gym_duration, breakfast_done,
steps, water_bottles (replaced protein_grams), mood, energy_level,
learning_done, learning_topic, journal_entry, brain_fog (1-3), headache (bool),
rc_count (reset counter), rc_entries (JSON timestamps)

**Note:** protein_grams column exists in DB for historical data but was replaced
by water_bottles in the UI. Do NOT add protein input to mobile.

---

## Grid Completion Logic

Score = (metrics_logged / 8) * 100
8/8 = dark green (#10b981)
6-7/8 = light green (lighter shade of #10b981)
<6/8 = gray (#6b7280)

---

## Constraints

- Solo developer. One feature at a time.
- No high-memory processes. MacBook Air M2, 8GB RAM.
- No local storage for sensitive data. All persisted on backend.
- Do not modify auth logic or database schema without explicit instruction.
- Always use the locked color palette. Never introduce new colors without approval.
- Mobile view is DATA COLLECTION ONLY — no analytics, insights, pomodoro, or tools.
- Single SQL file: all schema changes go in backend/supabase_init.sql — NO separate migration files.

---

## Build Timeline — Actual Progress

### Phase 1: Foundation (Completed — prior sessions)
- React + Tailwind + Supabase setup
- Daily log form (desktop DailyLogForm.jsx)
- Monthly grid (MonthlyGrid.jsx, CalendarHeatmap.jsx)
- Weekly charts (Recharts integration)
- Dark/Light mode (useTheme hook)
- Supabase migration from raw PostgreSQL

### Phase 2: Core Features (Completed — prior sessions)
- Money Manager with Excel import, 13 spending categories, accounts system
- Pomodoro timer with presets (25/45/90), reflection, deep mode
- Google Calendar OAuth integration with drag-drop
- Habits & Routines system (HabitManager, StreakAnalytics)
- Notifications system (drift detection, commitment tracking)
- YouTube integration
- Sleep analytics with correlation engine

### Phase 3: Mobile Data Collection (Completed — prior sessions)
- MobileApp.jsx with full state management
- All 9 mobile sections (sleep, body, mind, tasks, money, notes, wins, reset)
- Mobile header with completion ring, streak counter
- Save bar with auto-draft to localStorage

### Phase 4: Gamification — Tier 1 (Completed — 2026-03-09)
- Created xpEngine.js — 10 ranks, XP calculation, streak multiplier, quests, achievements
- Created soundEngine.js — Web Audio API sounds + browser notifications
- Created LevelUpModal.jsx — full-screen rank-up celebration
- Created DailyQuests.jsx — 3 daily quests from deterministic pool
- Added brain fog (3-option) + headache (toggle) to MobileMindSection
- Added XP bar + rank badge to MobileHeader.jsx
- Added XP preview to MobileSaveBar.jsx
- Wired XP integration into MobileApp.jsx (save handler: calculate XP, upsert user_xp, log xp_log)
- Added sound + notification to PomodoroTimer.jsx on session complete/break end
- Added dynamic tab title (🔥 MM:SS focus / ☕ MM:SS break)

### Phase 5: Gamification — Tier 2 (Completed — 2026-03-09)
- Pomodoro XP: +30 per completed focus session via user_xp upsert
- Achievement system: checkAchievements() with 16 definitions, AchievementUnlock modal
- AchievementsGallery.jsx — 4-column grid of all achievements
- Clean streak: MobileResetSection resets clean_streak to 0; handleSave increments on clean days
- MobileStreaks.jsx — 5 streaks (overall, gym, learning, clean, 10K steps) + XP multiplier
- MobileGoals.jsx — goal setting (8 metrics × daily/weekly/monthly) with progress bars
- YearlyHeatmap.jsx — GitHub-style 365-day grid, filterable by metric
- Money Manager XP: +15 per transaction (capped 3/day) in MoneyManager.jsx

### Phase 6: SQL Consolidation + Feature Completion (Completed — 2026-03-10)
- Merged gamification tables (user_xp, xp_log, achievements) into supabase_init.sql as SECTION 15
- Deleted backend/migrations/ directory (3 separate files consolidated)
- Added sleep quality tags UI — 8 tag buttons in MobileSleepSection (shows when sleep <7h)
- Wired sleep_quality_tags table into MobileApp save handler + data loading
- Created MobileDSASection — compact problem logger with stats + quick-add form
- Wired MobileDSASection into MobileApp.jsx

### Phase 7: UI Fixes + Cleanup (Completed — 2026-03-10)
- Gym: Replaced toggle with explicit YES / NO buttons (green/red)
- Breakfast: Same YES / NO button treatment
- Steps: Changed from type="number" (with browser spinners) to type="text" with inputMode="numeric"
- Added global CSS rule in index.css to kill number spinners on all inputs
- Removed non-logging components from mobile (Pomodoro, InsightEngine, MomentumBar)
  - Mobile is DATA COLLECTION ONLY — analytics/tools stay on desktop
- Removed protein_grams from mobile (replaced by water_bottles in earlier session)
- Updated AGENTS.md with full timeline and current architecture

---

## Stack Update — Supabase Migration (2026-02-28)
- Database: Supabase hosted PostgreSQL (project: yubxgftugxbwtywyhcsv)
- Supabase URL: https://yubxgftugxbwtywyhcsv.supabase.co
- Auth: Supabase Auth will replace custom JWT in Phase 2
- Schema: Run backend/supabase_init.sql in Supabase SQL editor to initialize tables
- Frontend uses Supabase JS client directly for database operations
- Backend Express remains for complex logic, file parsing, PDF generation
- demo-user-id is placeholder until auth is implemented
