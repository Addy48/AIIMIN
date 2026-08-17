---
Purpose: Inventory every product feature group with purpose, status, dependencies, files, importance, completion estimate.
Confidence: 0.87
Generated From: docs/knowledge/09_FEATURES/Index.md; _manifest.json; App.js routes; server/routes; Product.md
Dependencies: [00_PROJECT_SUMMARY.md](00_PROJECT_SUMMARY.md), [02_ARCHITECTURE.md](02_ARCHITECTURE.md)
Consumers: [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md), [07_DATA_MODELS.md](07_DATA_MODELS.md), [08_API_MAP.md](08_API_MAP.md)
Last Updated: 2026-07-22
Pass: 1/6
---

# 03 — Feature Inventory

Completion estimates are **engineering judgment from code+vault status labels**, not measured coverage. Scale: 0–100%.

Status vocabulary from vault: `shipped`, `*-live`, `*-local`, `in-progress`, `planned`, `legacy`.

---

## Authentication & access

| Field | Value |
|-------|-------|
| Purpose | Sign-in (email/password, Google), OS-ID username, PIN, email verify, waitlist gate, tester allowlist |
| Status | Better Auth + waitlist gates shipped |
| Importance | P0 |
| Completion | ~90% |
| Primary files | `frontend/src/pages/Login.jsx`, `AuthCallback.jsx`, `VerifyEmail.jsx`; `server/routes/auth.js`; `server/lib/auth.js`; `server/services/accessService.js` |
| Related | `useAccessGate`, `EmailVerifiedGuard`, waitlist pending screen |
| Dependencies | Better Auth, Google login env, `tester_allowlist`, `waitlist_emails` |
| API | `/api/auth/*` — see [08_API_MAP.md](08_API_MAP.md) |

---

## Waitlist & marketing

| Field | Value |
|-------|-------|
| Purpose | Public landing, reserve spot, referrals, founding pricing, brand book |
| Status | google-oauth-bearer-fix-shipped; live when waitlist mode |
| Importance | P0 launch |
| Completion | ~85% |
| Primary files | `WaitlistLanding.jsx`, `components/waitlist/**`, `Brand.jsx`, `server/routes/waitlist.js` |
| Dependencies | `REACT_APP_WAITLIST_MODE`, Resend templates |

---

## Today / Overview

| Field | Value |
|-------|-------|
| Purpose | Daily command center: widgets, week signals, pulse check, universal logger |
| Status | j0a-single-logger / core shipped |
| Importance | P0 |
| Completion | ~80% |
| Primary files | `pages/Overview.jsx`, `components/overview/*`, `components/dashboard/UniversalLogger.jsx` |
| API | `/api/dashboard/summary`, `/widgets`, `/api/daily-logs` |

---

## Daily Log / Capture

| Field | Value |
|-------|-------|
| Purpose | Sleep, gym, steps, water, mood, energy, RC, etc. |
| Status | core-logging-shipped |
| Importance | P0 |
| Completion | ~85% |
| Primary files | `DailyLogForm.jsx`, mobile `MobileCaptureApp.jsx`, `server/routes/dailyLogs.js` |
| Surfaces | Desktop overview + `/m` |

---

## Habits

| Field | Value |
|-------|-------|
| Purpose | Habit CRUD, logs, streaks, stacks, heatmaps |
| Status | Tier-gated core; API-backed |
| Importance | P0 |
| Completion | ~80% |
| Primary files | `pages/Habits.jsx`, `components/habits/*`, `server/routes/habits.js` |

---

## Goals & Vision

| Field | Value |
|-------|-------|
| Purpose | Goals with metric/target/meta mapping; vision/identity adjacent |
| Status | pipeline-achieved-fix (vault) |
| Importance | P0 |
| Completion | ~75% |
| Primary files | `pages/Goals.jsx`, `server/routes/goals.js` |
| Note | DB columns `metric/target/meta` vs UI title/status/progress mapping |

---

## Journal

| Field | Value |
|-------|-------|
| Purpose | Modes: free write, CBT, WWW, morning pages, weekly review; encrypted content paths |
| Status | craft-b1-in-progress |
| Importance | P0 |
| Completion | ~70% |
| Primary files | `pages/Journal.jsx`, `components/journal/*`, `styles/journalStudio.css`, `server/routes/journal.js` |

---

## Notes

| Field | Value |
|-------|-------|
| Purpose | Source-grounded notes (pdf/voice/text), OCR, Drive watches, anchors, voice recall |
| Status | crud-fixed-044-local / ocr-drive-watch |
| Importance | P1 |
| Completion | ~65% |
| Primary files | `pages/Notes.jsx`, `server/routes/notes.js`, `server/lib/notesOcr.js`, `notesDrive.js` |
| ADR | `docs/knowledge/10_DECISIONS/ADR-Notes-SourceGrounded.md` |

---

## Calendar

| Field | Value |
|-------|-------|
| Purpose | Events, Google sync pull/push, heatmap, day agenda |
| Status | google-sync-tasks-auto-pull |
| Importance | P1 |
| Completion | ~75% |
| Primary files | `pages/CalendarPage.jsx`, `components/calendar/*`, `server/routes/calendar.js`, `googleAuth.js` |

---

## Finance / Wealth

| Field | Value |
|-------|-------|
| Purpose | Accounts, transactions, budgets, categories, assets, AI import, health score |
| Status | React Query wired; wealth AI import service exists |
| Importance | P0 |
| Completion | ~75% |
| Primary files | `pages/Finance.jsx`, `components/finance/*`, `components/money/*`, `MoneyManager.jsx`, `server/routes/wealth.js` |

---

## Family Vault

| Field | Value |
|-------|-------|
| Purpose | Members, docs, insurance, health, vehicles, finance, relationships, reminders, emergency |
| Status | Pro tier; card menus shipped (Current-Context) |
| Importance | P1 |
| Completion | ~70% |
| Primary files | `pages/Family.jsx`, `pages/family/*`, `components/family/*`, `server/routes/family.js` |

---

## Discipline

| Field | Value |
|-------|-------|
| Purpose | Streaks, resets, urges, replacement habits, patterns |
| Status | urge-redesign-planned; API urge events exist |
| Importance | P1 |
| Completion | ~60% (UI redesign incomplete; dead modal components exist) |
| Primary files | `pages/Discipline.jsx`, `components/discipline/*`, `server/routes/discipline.js` |
| ADR | `ADR-Discipline-UrgeEvent.md` |

---

## Focus / Pomodoro

| Field | Value |
|-------|-------|
| Purpose | Focus room, pomodoro sessions, week stats |
| Status | Core tier route; sessions via `/api/focus` |
| Importance | P1 |
| Completion | ~70% |
| Primary files | `pages/FocusRoom.jsx`, `components/productivity/PomodoroTimer.jsx`, `components/pomodoro/*`, `server/routes/focus.js` |
| Note | `pomodoro_sessions` is a **view** over `sessions` (conflict with older ALTER-as-table migrations) |

---

## Sports

| Field | Value |
|-------|-------|
| Purpose | Cached scoreboard / cricket failover / news strip |
| Status | dual-cricket-failover-live |
| Importance | P2 |
| Completion | ~80% |
| Primary files | `pages/Sports.jsx`, `components/sports/*`, `server/routes/sports.js`, `sportsCacheService.js` |

---

## Lab (cognitive / skills)

| Field | Value |
|-------|-------|
| Purpose | Typing, speaking, reaction, decisions, mindset, reading, flashcards, aptitude, system design, etc. |
| Status | Core tier; many modules under `components/lab/` |
| Importance | P1 |
| Completion | ~65% (module depth varies) |
| Primary files | `pages/LabFullPage.jsx`, `components/lab/*`, `server/routes/lab.js` |
| Entry | `/lab?module=` query, not nested routes |

---

## Placements / Career

| Field | Value |
|-------|-------|
| Purpose | Resume archive, applications, ATS analyze, readiness scores |
| Status | Core tier |
| Importance | P1 |
| Completion | ~70% |
| Primary files | `pages/Placements.jsx`, `ATSAnalyzer.jsx`, `components/placements/*`, `server/routes/placements.js`, `ats.js` |

---

## Reports / Insights / Intelligence

| Field | Value |
|-------|-------|
| Purpose | Ivory snapshot, patterns/correlations, skill tree, PDF, Life Health System, AI chat/generate |
| Status | core-pro-live-elite-web-craft; `/insights` redirects to `/reports` |
| Importance | P0 |
| Completion | ~75% |
| Primary files | `pages/Reports.jsx`, `Insights.jsx`, `components/reports/*`, `server/routes/intelligence.js`, `correlationService.js` |

---

## Gamification

| Field | Value |
|-------|-------|
| Purpose | XP, ranks, quests, level-up |
| Status | xp-ranks-quests-shipped (vault); `LevelUpModal` / `XPProvider` mount gap flagged |
| Importance | P2 |
| Completion | ~60% UI wiring uncertainty |
| Primary files | `components/gamification/*`, `XPContext.jsx`, `user_xp` / `xp_log` tables |

---

## Account / Settings / Personalization

| Field | Value |
|-------|-------|
| Purpose | Profile, persona/font, nav pins, design lab, notifications, privacy, subscription, data export/wipe, legal |
| Status | persona-presets-shipped; Account is canonical hub |
| Importance | P0 |
| Completion | ~80% |
| Primary files | `pages/account/AccountPage.jsx` + sections; `pages/Settings.jsx` (**legacy overlap**, not in NAV_REGISTRY) |
| API | `/api/account/*`, `/api/billing/*` |

---

## Onboarding & tours

| Field | Value |
|-------|-------|
| Purpose | Life Arc gate, product tour, guest tour |
| Status | life-mode-gate-local; product tour v2-eight-stop |
| Importance | P1 |
| Completion | ~70% |
| Primary files | `pages/Onboarding.jsx`, `ProductTour.jsx`, `GuestTour.jsx`, `ArcGuard.jsx` |

---

## Notifications

| Field | Value |
|-------|-------|
| Purpose | Bell dropdown, unread count, mark read |
| Status | API live |
| Importance | P2 |
| Completion | ~75% |
| Primary files | `components/notifications/*`, Navbar bell, `server/routes/notifications.js` |

---

## Mobile web `/m`

| Field | Value |
|-------|-------|
| Purpose | Phone capture only — no analytics/tools |
| Status | Product lock |
| Importance | P0 stopgap |
| Completion | ~70% |
| Primary files | `components/mobile/*` |
| Routes | `/m`, `/m/score`, `/m/account` |

---

## Native Android V2

| Field | Value |
|-------|-------|
| Purpose | Offline-first companion: Today/Home, Journal, Notes, Vault, More, biometric, sync |
| Status | Functional per Current-Context (auth, bootstrap, outbox, WorkManager) |
| Importance | P0 product track |
| Completion | ~55–65% vs design pack ambitions |
| Primary files | `native-android/app/...`; `server/routes/mobile.js` |
| Docs | `docs/knowledge/17_NATIVE_APP_V2/` |

---

## DevTools / Admin / API usage

| Field | Value |
|-------|-------|
| Purpose | Owner/dev API usage dashboards, table inspect, wipe/simulate |
| Status | dev-dashboard-live |
| Importance | P2 internal |
| Completion | ~80% |
| Primary files | `components/account/Admin*.jsx`, `server/routes/admin.js` |

---

## Typography / Design system / Themes

| Field | Value |
|-------|-------|
| Purpose | Locked palette, type tokens, theme prefs |
| Status | token-rollout-phase1-complete |
| Importance | P0 lock |
| Completion | ~85% |
| Docs | [09_DESIGN_SYSTEM.md](09_DESIGN_SYSTEM.md), [10_THEME_SYSTEM.md](10_THEME_SYSTEM.md) |

---

## Features Index gaps

Vault `09_FEATURES/Index.md` lists a subset. Code also implements Money Manager legacy shell, Identity page (`/identity` not in NAV_REGISTRY), Seed Data (`/seed-data`), Feedback widget, Command Palette, Global Music Player — treat as first-class until proven dead.

## Cross-references

- Screens → [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md)
- APIs → [08_API_MAP.md](08_API_MAP.md)
- Incomplete / dead → [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md)
