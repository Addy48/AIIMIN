# AIIMIN Master Plan

> Created: 2026-06-25 | Last Updated: 2026-06-25 | Owner: Aaditya Upadhyay

## CURRENT STATE ASSESSMENT

### What's Already Built (Working)
| Area | Status | Details |
|------|--------|---------|
| **Auth** | ✅ Clerk + Supabase | JWT verification, Clerk SDK, Supabase admin, profile caching |
| **DB** | ✅ Supabase PostgreSQL | `users`, `daily_logs`, `habits`, `goals`, `money_transactions`, `accounts`, `budgets`, `family_*`, `sports_cache`, `pomodoro_sessions`, `notes`, `wealth_assets`, `oauth_tokens`, RLS policies |
| **AI Service** | ✅ Multi-provider | Groq (primary), Kimi K2 (fallback), Gemini (structured). Caching (24h localStorage). Rate limiting. Pre-built task helpers |
| **Journal** | ⚠️ Partial | Markdown editor + mood picker + notes tab. AI analysis cached in localStorage. Mood heatmap exists. |
| **Habits** | ✅ CRUD | API routes, Supabase-backed, completion logging |
| **Goals** | ✅ CRUD | API routes, progress tracking |
| **Focus/Pomodoro** | ✅ Working | Presets (15/25/45/90/120min), breathing visual, XP integration |
| **Discipline** | ⚠️ localStorage → DB Sync | Backend API routes created (Phase 0). Frontend NOT yet migrated. |
| **Sports** | ⚠️ Basic | Cache-based scoreboard via API. No personalization. No news. |
| **Finance** | ✅ Working | Transactions, accounts, budgets, wealth assets, Excel import, universal parser |
| **Family Vault** | ✅ Working | Members, documents, insurance, health, reminders, emergency contacts — all DB-backed |
| **Growth Engine** | ⚠️ Decorative | 6 components — mostly decorative/localStorage |
| **Lab** | ✅ 15 modules | TypingTest, VocalMastery, DecisionMatrix, TechSimulator, SystemDesign, ThePit, etc. |
| **Overview** | ⚠️ Partial | Week calendar, CommandCenter, PulseCheck, AI weekly insight. No widget grid. |
| **Onboarding** | ✅ 8 steps | Name, OS-ID, PIN (set+confirm), Goals, Habits, Wake-up time, Life Score baseline |
| **Legal** | ✅ Pages exist | Privacy, Terms, DataDeletion, Security, About, Contact, Brand — but NOT linked in UI |
| **Server** | ✅ Hono + Express hybrid | 19 route files, cron jobs, services (analyticsData, lifeHealthEngine, weeklyReviewEngine, reportGenerator, userProfileService) |
| **AI Logger** | ✅ Universal | `/api/intelligence/universal-log` |

### What's Missing (Per Master Plan)
| # | Feature | Priority | Effort | Phase |
|---|---------|----------|--------|-------|
| 1 | `user_profile` table + service | P0 | 2 days | ✅ DONE (Phase 0) |
| 2 | Design system overhaul | P0 | 3 days | ✅ DONE (Phase 0) |
| 3 | Discipline → Supabase sync (backend) | P0 | 3 days | ✅ DONE (Phase 0) |
| 4 | Discipline → Supabase sync (frontend) | P1 | 2 days | Phase 0.5 |
| 5 | Legal pages linked in UI | P0 | 1 day | Phase 0.5 |
| 6 | AI Features opt-out toggle | P0 | 1 day | Phase 0.5 |
| 7 | Journal 5 modes (Free Write, CBT, WWW, Morning, Weekly) | P1 | 5 days | Phase 1 |
| 8 | Journal AI: emotion tags, cognitive distortions, Socratic prompts | P1 | 3 days | Phase 1 |
| 9 | Journal Zettelkasten (note connections, knowledge graph, pop quiz) | P2 | 4 days | Phase 1.5 |
| 10 | Goals ↔ Habits ↔ Focus linking | P0 | 4 days | Phase 2 |
| 11 | Discipline: Trigger ID, Urge Surfing, Compassionate Restart | P1 | 5 days | Phase 2 |
| 12 | Sports personalization (favorites, teams, news feed) | P1 | 5 days | Phase 3 |
| 13 | Sports: Transfer news, match previews, post-match summaries | P2 | 4 days | Phase 3 |
| 14 | Growth Engine: Life Score radar chart, real data per node | P0 | 3 days | Phase 5 |
| 15 | Finance: Safe-to-Spend, Spending Velocity, Emotion tags | P1 | 4 days | Phase 4 |
| 16 | Finance: SIP Planner, Subscription Audit, Financial Health Score | P2 | 4 days | Phase 4 |
| 17 | Finance: "What If" simulator UI | P1 | 2 days | Phase 4 |
| 18 | Overview: Customizable widget grid (drag-drop) | P1 | 4 days | Phase 5 |
| 19 | Overview: Monday Insight + Saturday "Week in Numbers" | P2 | 3 days | Phase 5 |
| 20 | Family Vault: Document expiry tracking, Emergency PDF card | P2 | 3 days | Phase 6 |
| 21 | Lab: Key Heatmap, Leitner Box, FSRS-Lite, Cognitive Benchmark | P2 | 5 days | Phase 6 |
| 22 | AI Features toggle in Settings (opt-out) | P0 | 1 day | Phase 0.5 |

---

## PHASE 0 — FOUNDATION (Week 1)

### 0.1 `user_profile` Table + Migration
**Status:** ✅ DONE
**Files:**
- `supabase/migrations/20260625_phase0_foundation_upgrade.sql` — CREATE TABLE user_profiles + RLS + auto-init trigger
- `server/services/userProfileService.js` — getUserProfile(), upsertUserProfile(), patchUserProfile(), initUserProfile()
- `server/routes/account.js` — GET/PATCH /api/account/user-profile endpoints
- `frontend/src/hooks/useUserProfile.js` — React hook with fetchProfile, updateProfile, completeOnboarding

### 0.2 Design System Overhaul
**Status:** ✅ DONE
**Files:**
- `frontend/src/styles/tokens.css` — New CSS variables: electric blue (#2563EB) accent, Outfit font, updated glass/card tints
- `frontend/src/index.css` — Motion principles: page transitions, card hover, particle burst, milestone celebration, count animation, live pulse, node pulse

### 0.3 Discipline → Supabase Sync (Backend)
**Status:** ✅ DONE
**Files:**
- `supabase/migrations/20260625_phase0_foundation_upgrade.sql` — discipline_streaks, discipline_logs, replacement_habits tables + RLS
- `server/routes/discipline.js` — Full CRUD: GET/POST streak, PATCH increment/reset, POST log, GET logs/insights, CRUD replacement-habits

---

## PHASE 0.5 — FOUNDATION FRONTEND + POLISH (Week 1 continuation)

### 0.5.1 Discipline Frontend Migration
**Status:** ⏳ PENDING
**Tasks:**
- [ ] Rewrite `frontend/src/pages/Discipline.jsx` to use API instead of localStorage
- [ ] Add trigger identification modal (mandatory after reset)
- [ ] Add urge surfing log
- [ ] Add compassionate restart UI

### 0.5.2 Legal Pages Linked in UI
**Status:** ⏳ PENDING
**Tasks:**
- [ ] Add legal links in `frontend/src/pages/AccountPage.jsx` footer
- [ ] Add "Your Data" card (download JSON, delete account)
- [ ] Create `frontend/src/services/exportService.js`
- [ ] Add `GET /api/account/export` backend endpoint

### 0.5.3 AI Features Opt-Out Toggle
**Status:** ⏳ PENDING
**Tasks:**
- [ ] Add AI Features section in `frontend/src/pages/Settings.jsx`
- [ ] Master toggle + sub-toggles (saves to user_profiles)
- [ ] Backend respects flag in aiService.js

---

## PHASE 1 — JOURNAL OVERHAUL (Weeks 2-3)

### 1.1 Five Journal Modes
**Status:** ⏳ PENDING
**Schema:** Already created in Phase 0 SQL (journal_entries with mode column, cbt_records, www_entries)
**Tasks:**
- [ ] `server/routes/journal.js` — NEW: CRUD for journal entries with mode, CBT records, WWW entries
- [ ] `frontend/src/components/journal/JournalModes.jsx` — Tab-switched mode selector
- [ ] `frontend/src/components/journal/FreeWriteMode.jsx` — Timed 15-20 min, text blurs
- [ ] `frontend/src/components/journal/CBTMode.jsx` — 6-field structured template
- [ ] `frontend/src/components/journal/WWWMode.jsx` — 3 wins + why
- [ ] `frontend/src/components/journal/MorningMode.jsx` — Auto-open at 6-9am
- [ ] `frontend/src/components/journal/WeeklyMode.jsx` — Sunday template
- [ ] `frontend/src/pages/Journal.jsx` — Rewrite to support all 5 modes

### 1.2 Journal AI Integration
**Status:** ⏳ PENDING
**Tasks:**
- [ ] Update `frontend/src/services/aiService.js` — analyzeJournalEntry with Supabase caching
- [ ] Add `getJournalPrompts` — Socratic prompts on 90-second idle
- [ ] Add `findNoteConnections` — semantic similarity via Gemini embedding
- [ ] Add `generatePopQuiz` — 3 recall questions from note content

### 1.3 Cross-Section Integration
**Status:** ⏳ PENDING
**Tasks:**
- [ ] Journal emotion tags → Overview "Mood This Week" widget
- [ ] WWW wins → Goals "Win Evidence Board"
- [ ] CBT records → Discipline section (linkable after reset)

---

## PHASE 2 — INTERCONNECTED CORE (Weeks 4-5)

### 2.1 Goals ↔ Habits ↔ Focus Linking
**Status:** ⏳ PENDING
**Schema:** Already created in Phase 0 SQL (goal_id on habits, session_intent/reflection/energy_after on pomodoro_sessions)
**Tasks:**
- [ ] `server/routes/habits.js` — Add goal_id to CRUD
- [ ] `server/routes/goals.js` — Add alignment endpoint
- [ ] `frontend/src/pages/Goals.jsx` — Goal wizard: "What daily habit? How many focus sessions?"
- [ ] `frontend/src/pages/Habits.jsx` — Link habit to goal dropdown
- [ ] `frontend/src/pages/FocusRoom.jsx` — Pre/post session prompts, Deep Work Hours chart

### 2.2 Habits Section Upgrades
**Status:** ⏳ PENDING
**Schema:** Already created in Phase 0 SQL (habit_stacks table)
**Tasks:**
- [ ] `frontend/src/pages/Habits.jsx` — Habit Stacking UI
- [ ] "Don't Break the Chain" wall per habit
- [ ] Particle burst on full-day completion
- [ ] AI Habit Coach: weekly insight

### 2.3 Discipline Upgrades
**Status:** ⏳ PENDING
**Tasks:**
- [ ] `frontend/src/pages/Discipline.jsx` — Replacement Habit Linker
- [ ] Historical urge frequency chart

---

## PHASE 3 — SPORTS FULL BUILD (Weeks 6-7)

### 3.1 Sports Personalization
**Status:** ⏳ PENDING
**Schema:** Already created in Phase 0 SQL (sports_favorites table)
**Tasks:**
- [ ] `server/routes/sports.js` — Favorites CRUD, personalized feed, live matches
- [ ] `server/services/sportsNewsService.js` — NEW: Transfer news, session results, caching
- [ ] `frontend/src/pages/Sports.jsx` — Three tabs: My Feed, Live Scores, Explore

### 3.2 Sports Components
**Status:** ⏳ PENDING
**Tasks:**
- [ ] `frontend/src/components/sports/SportsFeed.jsx`
- [ ] `frontend/src/components/sports/TransferNews.jsx`
- [ ] `frontend/src/components/sports/MatchPreview.jsx`
- [ ] `frontend/src/components/sports/PostMatchSummary.jsx`
- [ ] `frontend/src/components/sports/F1RaceTracker.jsx`
- [ ] `frontend/src/components/sports/IPLScorecard.jsx`

---

## PHASE 4 — FINANCE UPGRADE (Weeks 8-9)

### 4.1 Safe-to-Spend + Velocity + Emotion Tags
**Status:** ⏳ PENDING
**Schema:** Already created in Phase 0 SQL (emotion_tag on money_transactions)
**Tasks:**
- [ ] `server/routes/wealth.js` — safe-to-spend, velocity-alerts endpoints
- [ ] `frontend/src/components/finance/FinanceOverview.jsx` — Safe-to-Spend widget, Velocity alert
- [ ] `frontend/src/components/finance/EntryForm.jsx` — Emotion selector

### 4.2 Subscription Audit + SIP + Health Score
**Status:** ⏳ PENDING
**Schema:** Already created in Phase 0 SQL (financial_health_scores table)
**Tasks:**
- [ ] `server/services/subscriptionAuditService.js` — NEW
- [ ] `frontend/src/components/finance/SubscriptionAudit.jsx`
- [ ] `frontend/src/components/finance/SIPPlanner.jsx`
- [ ] `frontend/src/components/finance/FinancialHealthScore.jsx`

### 4.3 What If Simulator
**Status:** ⏳ PENDING
**Tasks:**
- [ ] `frontend/src/components/finance/WhatIfSimulator.jsx` — AI already exists in aiService.js

---

## PHASE 5 — GROWTH ENGINE + OVERVIEW (Weeks 10-11)

### 5.1 Growth Engine: Life Score Radar
**Status:** ⏳ PENDING
**Tasks:**
- [ ] `frontend/src/components/growth/LifeScoreRadar.jsx` — Recharts radar chart
- [ ] `frontend/src/components/growth/GrowthNodes.jsx` — Real data per node
- [ ] `server/routes/dashboard.js` — Aggregated widget data endpoint

### 5.2 Overview Widget Grid
**Status:** ⏳ PENDING
**Tasks:**
- [ ] `frontend/src/pages/Overview.jsx` — Drag-drop widget grid
- [ ] `frontend/src/components/overview/MondayInsight.jsx`
- [ ] `frontend/src/components/overview/WeekInNumbers.jsx`

---

## PHASE 6 — LAB + FAMILY + POLISH (Week 12)

### 6.1 Lab Upgrades
**Status:** ⏳ PENDING
**Tasks:**
- [ ] `frontend/src/components/lab/TypingKeyHeatmap.jsx`
- [ ] `frontend/src/components/lab/FlashcardLeitner.jsx`
- [ ] `frontend/src/components/lab/CognitiveBenchmark.jsx`
- [ ] `frontend/src/components/lab/VocalPostSession.jsx`
- [ ] `frontend/src/components/lab/DecisionPreMortem.jsx`

### 6.2 Family Vault: Document Expiry + Emergency PDF
**Status:** ⏳ PENDING
**Tasks:**
- [ ] `frontend/src/pages/Family.jsx` — Document expiry tracking
- [ ] `frontend/src/components/family/EmergencyCard.jsx`

### 6.3 Final Polish
**Status:** ⏳ PENDING
**Tasks:**
- [ ] All pages use new color palette and typography
- [ ] Framer Motion page transitions
- [ ] Number counters animate
- [ ] Card interactions: 4px lift, 1px border glow
- [ ] Success states: particle burst
- [ ] Discipline milestone: full-screen celebration

---

## IMPLEMENTATION SEQUENCE (SUMMARY)

| Sprint | Weeks | Focus | Key Deliverables | Status |
|--------|-------|-------|-----------------|--------|
| **Sprint 0** | Week 1 | Foundation | user_profile, Design overhaul, Discipline→DB backend | ✅ DONE |
| **Sprint 0.5** | Week 1+ | Foundation Frontend | Discipline frontend, Legal links, AI opt-out | ⏳ PENDING |
| **Sprint 1** | Weeks 2-3 | Journal | 5 modes, AI analysis, Socratic prompts, Zettelkasten | ⏳ PENDING |
| **Sprint 2** | Weeks 4-5 | Interconnected Core | Goals↔Habits↔Focus, Habit Stacking, Discipline triggers | ⏳ PENDING |
| **Sprint 3** | Weeks 6-7 | Sports | Personalization, News feed, Transfer integration | ⏳ PENDING |
| **Sprint 4** | Weeks 8-9 | Finance | Safe-to-Spend, Velocity, Emotion tags, SIP, What-If | ⏳ PENDING |
| **Sprint 5** | Weeks 10-11 | Growth + Overview | Life Score radar, Widget grid, Monday/Saturday insights | ⏳ PENDING |
| **Sprint 6** | Week 12 | Lab + Family + Polish | Key Heatmap, Leitner, Cognitive Benchmark, Emergency PDF | ⏳ PENDING |

---

## TECHNICAL DECISIONS

| Decision | Choice | Why |
|----------|--------|-----|
| AI Provider | Groq (primary), Kimi (fallback), Gemini (structured) | Already configured, Groq is free, Gemini for embeddings |
| Real-time Sports | Polling every 60s for live matches | Balance freshness vs API cost |
| Discipline Data | Migrate from localStorage → Supabase | Multi-device sync, analytics |
| Knowledge Graph | D3.js force-directed | Zero new deps |
| Radar Chart | Recharts | Already in stack |
| File Storage | Supabase Storage | Zero new infrastructure |