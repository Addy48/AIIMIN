# AIIMIN — Behavior-Shaping OS

A precision-engineered personal operating system that transforms scattered daily routines into measurable behavioral momentum. Built for individuals who take deliberate self-improvement seriously.

<p align="center">
  <img src="https://img.shields.io/badge/version-3.0-44634F?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/status-active-E8DCC8?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/license-private-63605A?style=flat-square" alt="License" />
</p>

## What It Does

AIIMIN tracks behavioral patterns across six domains — discipline, fitness, learning, finance, focus, and emotional clarity — and surfaces correlations that are invisible in isolation. Think of it as a personal Bloomberg terminal, but for your life metrics.

### Three Operating Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| **Dashboard** | Daily logging, habit tracking, session timers | Log gym, sleep, mood, focus sessions |
| **The Lab** | Pattern detection, typing/reaction benchmarks, belief audits | "When sleep drops below 6h, focus score drops 40%" |
| **Reports** | Weekly summaries, momentum scoring, behavioral audits | PDF exports with 30-day trailing analysis |

## Key Features

- **Momentum Engine** — Weighted scoring across domains with streak multipliers
- **Causal Correlation Engine** — Spearman rank correlation with Benjamini-Hochberg FDR across 10+ daily signals
- **The Lab** — Practice module (typing speed, speaking confidence, reaction time, decision scenarios), Intel module (growth dashboard, mindset state, pattern insights), and Audit module (quarterly belief inventory across 6 life domains)
- **Financial Tracker** — Income/expense/transfer tracking with accounts, budgets, recurring transactions, and lending
- **Session Timer** — Pomodoro-style focus sessions with mood-before/after tracking
- **Calendar Integration** — Google Calendar sync with OAuth2 token management
- **XP & Gamification** — Rank progression, achievements, and streak-based rewards
- **Dark/Light Themes** — Garden-inspired "Nordic Calm" palette with true warm-black dark mode
- **Mobile PWA** — Responsive progressive web app with dedicated mobile view

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18, React Router 6, CSS Custom Properties |
| **Backend** | Node.js, Express.js 4.x |
| **Database** | PostgreSQL via Supabase (RLS-enabled) |
| **Auth** | Supabase Auth + Google OAuth2 |
| **Hosting** | Vercel (frontend), Railway/Render (backend) |
| **Design** | Custom design system with DM Sans/DM Mono, glassmorphism, Garden palette |

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 15+ (or a Supabase project)
- npm or pnpm
- A Google Cloud project (for Calendar OAuth — optional)

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Addy48/AIIMIN.git
cd AIIMIN

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` with:

```env
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=development
PORT=5000
```

Create `frontend/.env` with:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup

Open the Supabase SQL Editor and run the contents of:

```
backend/supabase_full.sql
```

This single file creates all 30+ tables, views, RLS policies, indexes, and seeds the belief prompts. It is fully idempotent — safe to run multiple times.

### 4. Start Development

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm start
```

Visit `http://localhost:3000` for the dashboard, or `http://localhost:3000/m` for the mobile PWA.

## Architecture

```
AIIMIN/
├── backend/
│   ├── index.js              # Express entry point, middleware, route mounting
│   ├── supabase.js           # Supabase client initialization
│   ├── supabase_init.sql     # Schema source of truth (development)
│   ├── supabase_full.sql     # Consolidated schema (production deploy)
│   ├── middleware/            # Auth, rate-limit, correlation-id
│   ├── routes/               # RESTful route handlers
│   │   ├── dailyLogs.js      # Daily logging + streak-based stage progression
│   │   ├── dashboard.js      # Aggregate dashboard queries
│   │   ├── lab.js            # The Lab — 13 endpoints across Practice/Intel/Audit
│   │   ├── finance.js        # Financial tracking + budgets
│   │   └── ...               # Sessions, goals, habits, calendar, etc.
│   ├── lib/                  # Shared utilities
│   │   ├── db.js             # Central database pool
│   │   ├── spearman.js       # Spearman rank correlation + BH-FDR
│   │   ├── quarter.js        # Quarterly anchor math
│   │   └── crypto.js         # Token encryption/decryption
│   ├── jobs/                 # Background jobs
│   │   └── correlationEngine.js  # Nightly 10-signal pairwise correlation
│   ├── tests/                # Unit tests (Node.js test runner)
│   └── migrations/           # Incremental schema migrations
├── frontend/
│   ├── src/
│   │   ├── App.js            # Root router with lazy-loaded pages
│   │   ├── pages/            # Page components (Overview, Finance, Lab, Reports, etc.)
│   │   ├── components/       # Reusable UI components
│   │   │   ├── lab/          # Lab interactive modules
│   │   │   │   ├── TypingTest.jsx      # 60-sec typing speed test
│   │   │   │   ├── ReactionTest.jsx    # 5-trial reaction time test
│   │   │   │   ├── SpeakingLogger.jsx  # 3-slider confidence logger
│   │   │   │   ├── DecisionScenario.jsx # 6-domain scenario responses
│   │   │   │   ├── MindsetLogger.jsx   # 8-state daily picker
│   │   │   │   └── BeliefEntry.jsx     # Quarterly belief inventory
│   │   │   ├── mobile/       # Mobile PWA components
│   │   │   └── Navbar.jsx    # Primary navigation
│   │   ├── hooks/            # React hooks (useAuth, useLabSummary, etc.)
│   │   ├── context/          # Auth, Theme context providers
│   │   └── styles/
│   │       └── tokens.css    # Design system tokens (single source of truth)
│   └── public/
└── README.md
```

## The Lab — Three-Pillar Dashboard

### Practice (4 modules)
- **Typing Speed** — 60-second timed test with WPM/accuracy scoring. Valid tests require 95%+ accuracy. Mastery badges: Bronze (60 WPM) → Platinum (140 WPM).
- **Speaking** — Self-rated confidence/clarity/pace after a speaking exercise. Mastery tracks consistency over time.
- **Reaction Time** — 5-trial green-screen test. Mean of middle 3 trials (discards outliers). Mastery: Platinum at ≤180ms.
- **Decision Scenarios** — Pick a domain (money / opportunity / women / identity / society / fear), respond to a scenario prompt, self-rate decision quality 1–5.

### Intel (4 modules)
- **Growth Dashboard** — Active correlations from the nightly Spearman engine.
- **RC Sub-Logger** — Private reset counter with timestamped entries. Status dot indicates recency.
- **Mindset State** — Daily picker across 8 states: clarity, scarcity, abundance, fear, growth, aimlessness, focus, noise.
- **Insights** — Statistically significant behavioral patterns surfaced by the correlation engine with read/unread tracking.

### Audit (3 modules)
- **Belief Inventory** — 6 domains × 3 prompts per domain per quarter. Tracks belief evolution over time.
- **Pattern Flags** — High-correlation warnings (ρ ≥ 0.60) that need manual review.
- **Quarterly Review** — Progress tracking toward the current quarter's end date.

## Correlation Engine

Runs nightly as a cron job. Collects 30 days of data across 10 signals (mood, sleep, focus, RC count, gym, steps, water, typing WPM, reaction MS, speaking score), computes all pairwise Spearman rank correlations, applies Benjamini-Hochberg false discovery rate correction at α=0.10, and generates human-readable insight headlines for correlations with |ρ| ≥ 0.35.

```bash
# Run manually
node backend/jobs/correlationEngine.js

# Schedule with cron (2 AM daily)
0 2 * * * cd /path/to/AIIMIN && node backend/jobs/correlationEngine.js
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` (backend) | Start Express server on PORT (default 5000) |
| `npm start` (frontend) | Start React dev server on port 3000 |
| `npm run build` (frontend) | Production build |
| `node --test backend/tests/` | Run all backend unit tests |
| `node backend/jobs/correlationEngine.js` | Run correlation engine manually |

## Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `JWT_SECRET` | Yes | Secret for JWT verification |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | No | Server port (default: 5000) |
| `ENCRYPTION_KEY` | Optional | 32-byte hex key for token encryption |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Yes | Backend API URL |
| `REACT_APP_SUPABASE_URL` | Yes | Supabase project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |

## Database

AIIMIN uses PostgreSQL through Supabase with Row Level Security enabled on every table. The schema contains:

- **16 core tables** — users, daily_logs, goals, sessions, habits, notifications, money_transactions, etc.
- **12 Lab tables** — lab_typing_tests, lab_speaking_logs, lab_reaction_tests, lab_decision_scenarios, lab_mindset_logs, lab_beliefs, lab_belief_prompts, lab_correlations, lab_insights, lab_insight_reads, lab_streaks, lab_mastery_badges
- **3 financial tables** — accounts, money_lent, financial_goals
- **3 gamification tables** — user_xp, xp_log, achievements
- **2 views** — user_daily_metrics, pomodoro_sessions (aggregated from sessions)
- **18 belief prompts** across 6 domains (seeded on install)

To deploy to a fresh Supabase project, run `backend/supabase_full.sql` in the SQL Editor. To apply incremental changes, use the numbered files in `backend/migrations/`.

## Design System

The visual layer uses a custom design token system with two themes:

- **Dark (default)** — True warm-black base (`#0A0C0B`), cream text hierarchy, forest green accent (`#44634F`), terracotta secondary (`#D27958`)
- **Light** — Parchment base (`#F5F0E8`), deep olive text, same accent palette

Typography uses DM Sans (body) and DM Mono (data/labels). All interactive elements use glassmorphism with backdrop blur and subtle border glow transitions.

## Testing

```bash
# Run all unit tests
cd backend && node --test tests/

# Run specific test file
node --test tests/lib/spearman.test.js
node --test tests/lib/quarter.test.js
```

Test coverage includes:
- Spearman rank correlation (rank computation, tie handling, p-value, bootstrap CI, BH-FDR)
- Quarter anchor math (Q1–Q4 transitions, UTC timezone safety, leap year handling)

## License

Private. All rights reserved.
