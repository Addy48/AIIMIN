# AIIMIN System Handoff Documentation

## 1. Executive Summary
AIIMIN is a comprehensive behavioral intelligence and productivity system designed to track daily habits, health metrics, financial transactions, and productivity (Pomodoro sessions). The system is built around a centralized Supabase backend and a web-based analytics dashboard.

---

## 2. Technical Architecture

### 2.1 System Components
- **Backend:** Supabase (Postgres, Auth, Edge Functions).
- **Dashboard (Web):** Single Page Application (SPA) built with React and Tailwind CSS.
- **Design System:** "Analogue Monolith" — A premium, dark-mode-first aesthetic with a cream/brown secondary palette, focusing on flat surfaces and high information density.

### 2.2 Data Flow
1. **User Activity:** Tracked via the Dashboard (deep focus/analytics).
2. **Persistence:** The dashboard communicates directly with Supabase via the client SDK.
3. **Authentication:** Managed via Supabase Auth (Email/Password).

---

## 3. Component Details

### 3.1 Web Dashboard
- **Location:** `/Users/aaditya/.gemini/antigravity/DASHBOARD PROJECT/frontend`
- **Tech Stack:**
  - React (v19+)
  - Tailwind CSS
  - Framer Motion (animations)
  - Recharts (data visualization)
  - Supabase JS SDK
- **Key Scripts:**
  - `npm start`: Runs the development server.
  - `npm run build`: Generates the production bundle.

### 3.3 Backend (Supabase)
- **Project ID:** `yubxgftugxbwtywyhcsv`
- **Schema:** `public`
- **Primary Modules:** Auth, Database, Storage.

---

## 4. Database Schema (Supabase)

### 4.1 Core Tables
| Table | Description |
|---|---|
| `users` | User profiles, settings, and XP levels. |
| `daily_logs` | Snapshot of daily metrics (sleep, water, gym, mood, energy). |
| `money_transactions` | Financial logs (IN/OUT, categories, account mapping). |
| `pomodoro_sessions` | Focus session history including duration and task tags. |
| `habits` | Definitions and tracking for recurring activities. |
| `routines` | Grouped habits or timed sequences. |
| `goals` | Long-term objectives tracked by status. |
| `dsa_problems` | Solving history for Data Structures & Algorithms. |
| `user_xp` | Gamification data for leveling up. |

### 4.2 Key Relationships
- Most tables are linked via `user_id` (UUID from `auth.users`).
- `daily_logs` is indexed by `(user_id, date)` for efficient retrieval.

---

## 5. Design System: "Analogue Monolith"
The system follows a strict design philosophy defined in Stitch project `3792220278095392804`.
- **Base Background:** `#1C1814` (Hero) / `#0D0B08` (Dark Base) / `#F5F0E8` (Page Cream).
- **Cards:** Flat surfaces with subtle `0.5dp` borders.
- **Accents:** `#C8621A` (Primary Terracotta) / `#F5A623` (Accent Gold).
- **Typography:** DM Sans (Body) / DM Mono (Metrics/Labels).
- **Principles:** No gradients, no rounded corners except for specific pills, high contrast, forensic feel.

---

## 6. Development Status & Roadmap

### 6.1 Current Status
- **Dashboard:** Stable analytics core, integrates with all Supabase tables.

### 6.2 Immediate Roadmap
1. **Focus Session Timer:** Move from draft to production-ready Kotlin implementation (+10 XP logic).
2. **Weekly Mission System:** Implement the star-based weekly goal tracker in the mobile Planner.
3. **Reflection Vault:** Searchable history for mood and wins.
4. **7-Day Heatmap:** New visual component for the History screen.

---

## 7. Setup & Run Instructions

### 7.1 Web Dashboard
1. `cd "/Users/aaditya/.gemini/antigravity/DASHBOARD PROJECT/frontend"`
2. Verify `.env` contains correct Supabase keys.
3. Run `npm install` (if node_modules missing).
4. Run `npm start`.

---

**Document generated on:** 2026-04-04  
**By:** Antigravity (AI System)
