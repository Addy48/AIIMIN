# AIIMIN — Behavior-OS Backend (The Mesh)

The backend component of the **AIIMIN Behavior-Shaping OS**. It acts as the analytical processing hub and integration mesh for the ecosystem.

## 🧠 Core Functions
- **Analytical Processing**: Calculates Stage Progression and Behavioral Drift through the `BehavioralEngine`.
- **Identity Resolver**: Maps case-insensitive usernames (e.g., `AU48`) to unique Supabase identities.
- **Data Integration**: Standardizes data flows from Supabase, Google Calendar, and YouTube API.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase) with `pg` pool for specific analytical queries.
- **Integration**: `googleapis` for Calendar and YouTube sync.

## 🚀 Development

### Scripts
- `npm start`: Launches the server on `PORT` (default 5000).
- `npm run dev`: Launches with `nodemon` for active development.

### Key Directory Structure
- `/routes`: API endpoints grouped by domain (auth, dailyLogs, routines, etc.).
- `/lib`: Shared utilities including encryption for OAuth tokens.
- `/utils`: The engine room, containing logic for behavioral stage determination.

---
*Backend v2.1.1 — Integrated Analytics Hub*
