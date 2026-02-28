# DASHBOARD PROJECT — Project Memory

## Owner
Aaditya Upadhyay — B.Tech Data Science, Manipal University Jaipur

## Project
Personal Life Tracker Web Dashboard. Browser-based. Tracks 8 daily metrics,
manages money, schedules via Google Calendar, measures focus via Pomodoro.

---

## Tech Stack

- Frontend: React 18 + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- Hosting: Vercel (frontend) + Railway or Render (backend)
- Charts: Recharts
- Auth: Google OAuth 2.0
- Excel parsing: XLSX library
- PDF reports: Puppeteer (Phase 3)

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

## 16 Locked Features

1. Daily log form: sleep (start/end, auto-calc hours), masturbation (count + timestamps), gym (yes/no + duration), breakfast (yes/no), steps, protein (grams), learning (yes/no + topic), journal entry
2. Monthly LeetCode-style grid: 12x31 cells, color by completion score (8/8 = dark green, 6-7 = light green, <6 = gray), hover shows day details
3. Weekly charts: sleep hours trend, masturbation frequency, steps, protein intake (line/bar via Recharts)
4. Money Manager: Excel import via XLSX, parse historical transactions, ongoing manual daily entry, stored in PostgreSQL
5. Pomodoro timer: 25min work + 5min break (customizable to 35/10), track daily cycles, weekly/monthly totals
6. Google Calendar integration: OAuth login, time blocking with drag/drop, auto-log completed events to daily metrics
7. iPad journal sync: manual text entry MVP (copy-paste), API sync in future
8. Streaks per metric: consecutive days tracked per metric (gym streak, sleep streak, focus streak, etc.)
9. Dark/Light mode toggle: persistent via user preference, applies globally
10. Color palette: as defined above — LOCKED
11. Yearly heatmap: 365-day GitHub-style contribution view, per-metric or combined
12. Win tracking: daily small wins log, displayed on dashboard
13. Sleep quality tags: poor sleep night tags (stress, gym fatigue, late night, caffeine, noise)
14. Monthly accountability report: exportable PDF/email via Puppeteer, covers all metrics
15. Weekly/monthly goals: user sets targets, tracker shows progress bars and alerts on miss
16. DSA problem counter: daily/weekly coding problems solved, correlated with calendar study sessions

---

## Database Schema

users: id, email, googleId, theme, createdAt
daily_logs: id, userId, date, sleepStart, sleepEnd, masturbationCount, masturbationTimes(JSON), gymDone, gymDuration, breakfastDone, steps, proteinGrams, learningDone, learningTopic, journalEntry, createdAt
goals: id, userId, metric, target, frequency (daily/weekly/monthly), startDate, createdAt
pomodoro_sessions: id, userId, date, cyclesCompleted, totalFocusMinutes, createdAt
calendar_events: id, userId, googleEventId, title, startTime, endTime, completed, syncedToLog, createdAt
money_transactions: id, userId, date, category, amount, source (manual/imported), createdAt
wins: id, userId, date, description, createdAt
sleep_quality_tags: id, dailyLogId, tags (JSON array)

---

## API Endpoints

POST   /auth/google
POST   /daily-logs
GET    /daily-logs/:userId/:date
GET    /daily-logs/:userId?startDate&endDate
POST   /goals
GET    /goals/:userId
POST   /pomodoro-sessions
GET    /pomodoro-sessions/:userId
POST   /calendar/sync
POST   /money/import
POST   /wins
GET    /dashboard/:userId
GET    /heatmap/:userId

---

## Grid Completion Logic

Score = (metrics_logged / 8) * 100
8/8 = dark green (#10b981)
6-7/8 = light green (lighter shade of #10b981)
<6/8 = gray (#6b7280)

---

## Build Timeline

MVP (Week 1-2): daily log form, monthly grid, weekly charts, dark/light mode
Phase 2 (Week 3): Money Manager import, Pomodoro timer, Google Calendar
Phase 3 (Week 4): goals, streaks, win tracking, sleep tags, PDF reports
Phase 4 (optional): yearly heatmap, DSA counter, advanced correlations

---

## Constraints

- Solo developer. One feature at a time.
- No high-memory processes. MacBook Air M2, 8GB RAM.
- No local storage for sensitive data. All persisted on backend.
- Do not modify auth logic or database schema without explicit instruction.
- Always use the locked color palette. Never introduce new colors without approval.
- Component scope per prompt: one component per request, no bundling.