# AIIMIN — Personal Life Operating System

> A precision-engineered self-tracking dashboard that turns scattered daily habits into measurable behavioral momentum. Built by a solo developer as a production-grade full-stack system.

<p align="center">
  <a href="https://aiimin.in" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-aiimin.in-ff6b35?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  &nbsp;
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" alt="React" />
  &nbsp;
  <img src="https://img.shields.io/badge/Hono-4.x-e36002?style=for-the-badge" alt="Hono" />
  &nbsp;
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-00e699?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  &nbsp;
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

---

## Problem Statement

People who want to improve themselves face a fragmentation problem: their gym data is in one app, finances in another, mood in a journal, focus in a timer. None of these talk to each other. You can't know that your sleep debt is the reason your focus crashed on Wednesday unless something correlates those signals automatically.

**AIIMIN** is a single unified operating system for personal performance. It:
- Collects 15+ daily signals (sleep, gym, steps, water, mood, energy, learning, money, wins)
- Finds hidden causal correlations across those signals using Spearman rank statistics
- Gamifies consistency to drive long-term habit formation
- Gives you one dashboard instead of twelve apps

---

## Live URL

**→ [https://aiimin.in](https://aiimin.in)**

| View | URL | Purpose |
|------|-----|---------|
| Desktop Dashboard | `aiimin.in/` | Analytics, charts, insights, Pomodoro, reports |
| Mobile PWA | `aiimin.in/m` | Daily data entry optimized for phone |
| Placements Tracker | `aiimin.in/placements` | Job application pipeline |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        aiimin.in                            │
│                    (Vercel Hosting)                         │
├────────────────────────────┬────────────────────────────────┤
│   React 19 Frontend        │   Hono API Routes              │
│   /frontend/build          │   /api/index.js                │
│                            │   (Vercel Serverless)          │
│  ┌──────────┐              │                                │
│  │ Desktop  │─────────────►│  /api/auth         Supabase Auth│
│  │Dashboard │              │  /api/daily-logs   UPSERT logs │
│  └──────────┘              │  /api/dashboard    Aggregate   │
│  ┌──────────┐              │  /api/lab          Intelligence│
│  │ Mobile   │─────────────►│  /api/notifications Push msgs  │
│  │  PWA     │              │  /api/wealth       Finance     │
│  └──────────┘              │  /api/habits       Tracking    │
│                            │  /api/placements   Job tracker │
│                            │  /api/google       OAuth2      │
└────────────────────────────┴───────────────┬────────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────┐
                              │   Supabase PostgreSQL     │
                              │   (Auth + RLS + storage)  │
                              │                           │
                              │  30+ tables               │
                              │  daily_logs, users,       │
                              │  lab_*, notifications,    │
                              │  money_transactions...    │
                              └──────────────────────────┘
                                             │
                              ┌──────────────┴──────────────┐
                              │   Vercel Blob               │
                              │   (File storage, private)   │
                              └─────────────────────────────┘
```

**Request flow:**
1. React app at `aiimin.in` makes `fetch('/api/...')` calls
2. Vercel routes `/api/*` → `api/index.js` (serverless function, Node.js runtime)
3. Hono router dispatches to the correct handler
4. Handler verifies the Supabase access token and syncs the profile row
5. Handler runs `pool.query()` against Supabase PostgreSQL with RLS-backed ownership rules

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 19, React Router 6 | Component model, hooks, lazy loading |
| **Styling** | Tailwind CSS + Custom CSS vars | Locked color palette, dark/light theming |
| **Charts** | Recharts | Declarative, composable chart library |
| **API Server** | Hono 4.x (Vercel Serverless) | Lightweight, edge-ready, zero cold starts |
| **Auth** | Supabase Auth | Canonical user sessions, Google login, verified API tokens |
| **Database** | Supabase PostgreSQL | Managed Postgres with RLS policies and service-role server access |
| **File Storage** | Vercel Blob | Integrated, private access, zero config |
| **OAuth** | Supabase Google Auth + Google OAuth 2.0 (googleapis) | App login via Supabase; Calendar connection via backend OAuth |
| **Hosting** | Vercel Hobby (frontend + API) | Free, global CDN, Git auto-deploy |
| **Excel parsing** | SheetJS (xlsx) | Import bank statements / budget exports |
| **PDF export** | jsPDF (client-side) | Monthly report downloads without a server |
| **Gamification** | Custom XP engine (xpEngine.js) | 10 ranks, streak multipliers, achievements |
| **Sounds** | Web Audio API (soundEngine.js) | Level-up and completion feedback |

---

## Key Features

### 1. Behavioral Intelligence Engine
- **Spearman rank correlation** across 10+ daily signals (sleep, mood, gym, focus, steps, water, typing speed, reaction time, speaking confidence, reset counter)
- **Benjamini-Hochberg FDR correction** at α=0.10 to filter false positives
- Nightly cron job surfaces human-readable insight headlines: _"When you sleep <6h, your focus score drops 40%"_

### 2. The Lab (3 pillars)
- **Practice** — Typing speed test (WPM/accuracy), reaction time (5-trial, discards outliers), speaking confidence logger, decision scenario journal with self-rated quality
- **Intel** — Active correlations dashboard, mindset state tracker (8 states), behavioral insight feed
- **Audit** — Quarterly belief inventory (6 life domains × 3 prompts), pattern flags, quarter progress

### 3. Daily Tracking (Mobile + Desktop)
- Sleep (bedtime, wake time, auto-calc hours, quality tags)
- Body (gym yes/no + duration, breakfast, steps, water bottles)
- Mind (mood slider 1–10, energy level, brain fog, headache)
- Journal, tasks, wins, DSA problems, private reset counter

### 4. Financial Tracker
- Income / Expense / Transfer with 13 categories
- Multiple accounts (savings, checking, credit)
- Recurring transactions, budgets, savings goals
- Excel import (bank statement CSV/XLSX)
- XP rewards: +15 XP per transaction (capped 3/day)

### 5. Gamification System
- 10 ranks (Apprentice → Grandmaster, DBZ-inspired XP thresholds)
- Streak multiplier: 1.0× → 2.5×
- 16 daily quests from a deterministic pool
- 16 achievement definitions with auto-detection
- Level-up modal with sound, achievement unlock toasts

### 6. Google Calendar Integration
- Full OAuth2 flow (authorization code + refresh tokens)
- Calendar events auto-sync to daily task list
- Encrypted token storage in PostgreSQL

---

## Database Schema (30+ Tables)

```
Core          daily_logs, users, personal_goals, calendar_events, notes
Focus         pomodoro_sessions, dsa_problems
Finance       money_transactions, accounts, money_categories, budgets,
              savings_goals, recurring_transactions, money_lent
Habits        habits, routines, habit_logs, routine_logs
Lab (12)      lab_typing_tests, lab_speaking_logs, lab_reaction_tests,
              lab_decision_scenarios, lab_mindset_logs, lab_beliefs,
              lab_belief_prompts, lab_correlations, lab_insights,
              lab_insight_reads, lab_streaks, lab_mastery_badges
Gamification  user_xp, xp_log, achievements
Auth          google_tokens, oauth_states, user_oauth_tokens, feature_flags
System        notifications, wins, daily_commitments, weekly_summaries,
              admin_audit, system_config
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- A [Vercel](https://vercel.com) account
- A Google Cloud project (for Calendar OAuth — optional)

### 1. Clone & Install

```bash
git clone https://github.com/Addy48/AIIMIN.git
cd AIIMIN
npm install          # installs root deps (hono, pg, googleapis…)
cd frontend && npm install
```

### 2. Environment Variables

Create `.env` in the project root:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:password@host/postgres?sslmode=require
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth
NVIDIA_API_KEY=server-only-nvidia-key
TOKEN_ENCRYPTION_KEY=64-char-hex-string

# Google OAuth (optional – for Calendar sync)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/google/auth/callback

# Vercel Blob (optional – for file uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# App
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### 3. Database Setup

Run the SQL schema against your Neon project:

```bash
# Option A: Neon dashboard → SQL Editor → paste contents of:
backend/supabase_init.sql

# Option B: psql
psql "$DATABASE_URL" -f backend/supabase_init.sql
```

### 4. Start Development

```bash
# Single command — Vercel dev proxies frontend + API together
npx vercel dev --listen 3001
```

Open **http://localhost:3001** — dashboard at `/`, mobile at `/m`.

### 5. Deploy to Production

```bash
# One-time: link to your Vercel project
npx vercel link

# Deploy
npx vercel --prod
```

Add all environment variables in Vercel Dashboard → Project Settings → Environment Variables.

---

## Project Structure

```
AIIMIN/
├── api/                        ← Hono serverless API (deployed as Vercel function)
│   ├── index.js                  Router entry point + middleware
│   ├── lib/
│   │   ├── db.js                 Neon pg Pool (lazy, singleton)
│   │   ├── crypto.js             AES-256 token encryption
│   │   ├── quarter.js            Quarterly anchor math
│   │   └── spearman.js           Rank correlation + BH-FDR
│   ├── middleware/
│   │   └── auth.js               JWT verify, profile cache (10s TTL)
│   ├── routes/
│   │   ├── auth.js               signup, login, /me, logout
│   │   ├── dailyLogs.js          UPSERT daily log, stage progression
│   │   ├── dashboard.js          Aggregate summary endpoint
│   │   ├── lab.js                13 Lab endpoints (practice/intel/audit)
│   │   ├── notifications.js      In-app notification CRUD
│   │   ├── wealth.js             Finance tracker (transactions, budgets)
│   │   ├── habits.js             Habit CRUD + logs
│   │   ├── tasks.js              Task CRUD
│   │   ├── placements.js         Job application tracker
│   │   ├── googleAuth.js         Google OAuth2 flow + token storage
│   │   ├── calendar.js           Google Calendar read/sync
│   │   ├── intelligence.js       LHS scores + weekly report
│   │   ├── account.js            Profile, export, delete account
│   │   └── health.js             /api/health ping
│   ├── jobs/
│   │   ├── correlationEngine.js  Nightly Spearman correlation job
│   │   └── recurringTransactions.js  Auto-post recurring entries
│   └── services/                 Analytics dataset builder, report generators
│
├── frontend/src/
│   ├── pages/                    Dashboard, Login, Placements, Brand…
│   ├── components/
│   │   ├── mobile/               MobileApp, 9 data-entry sections, XP bar
│   │   ├── dashboard/            StatCard, WeekRows, QuickCapture
│   │   ├── habits/               HabitManager, StreakAnalytics
│   │   └── notifications/        Bell + slide-in panel
│   ├── context/                  AuthContext (Supabase Auth + Google login)
│   ├── hooks/                    useAuth, useTheme, useLabSummary…
│   └── utils/
│       ├── xpEngine.js           XP calc, rank thresholds, quests, achievements
│       ├── soundEngine.js        Web Audio API: bell, chime, levelUp
│       └── api.js                Axios instance with /api base URL
│
├── vercel.json                   Routing: /api/* → serverless, /* → React
├── package.json                  Root deps: hono, pg, googleapis, supabase-js…
└── .env                          Local secrets (git-ignored)
```

---

## Design System

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| Background | `#1a1a1a` | `#f9f9f9` |
| Cards | `#2d2d2d` | `#ffffff` |
| Accent (primary) | `#ff6b35` | `#ff6b35` |
| Success / completion | `#10b981` | `#10b981` |
| Muted / incomplete | `#6b7280` | `#6b7280` |

Typography: **DM Sans** (body), **DM Mono** (data/labels). All interactive elements use glassmorphism with backdrop blur and smooth micro-animations.

---

## Gamification (XP Engine)

| Action | XP |
|--------|----|
| Sleep logged | +30 |
| Gym done | +25 |
| Learning session | +20 |
| Steps > 10k | +20 |
| Breakfast logged | +15 |
| Journal written | +15 |
| Finance transaction | +15 (max 3/day) |
| Water logged | +10 |
| Daily win | +10 |
| Pomodoro session | +30 |
| Perfect day (all 8) | +50 bonus |

Streak multiplier: 1.0× (day 1) → 2.5× (30+ day streak).

---

## Author

**Aaditya Upadhyay** — B.Tech CSE, Manipal University Jaipur  
Built as a solo full-stack project to track and optimize personal performance.

- GitHub: [@Addy48](https://github.com/Addy48)
- Live: [aiimin.in](https://aiimin.in)

---

*Private project. All rights reserved.*
