# AIIMIN Mobile — Product Requirements Document v1.0

**Owner:** Aaditya Upadhyay  
**Created:** 2026-03-09  
**Status:** Approved for MVP  

---

## 1. Vision

**AIIMIN Mobile** is a focused, frictionless Android web app companion to the AIIMIN desktop dashboard. The desktop is your analytics cockpit. The mobile app is your daily pilot checklist and task planner.

**Core principle:** Collect data fast. Under 2 minutes per session. No analysis, no charts, no heavy features. Pure structured input and task management.

---

## 2. What's IN (Mobile)

| Feature | Notes |
|---|---|
| Sleep logging | Bedtime + wake time + computed hours + debt indicator |
| Body metrics | Gym toggle + duration, breakfast toggle, steps, water bottles |
| Mood + Energy | Slider (1-10) + energy dots (1-5) |
| Learning toggle | Yes/No + topic field |
| Reset tracker | Collapsible, private. Count + timestamps |
| Tasks / Reminders / Todos | Create with title, time, type (task/reminder/todo). Syncs to `calendar_events` table so desktop calendar shows them |
| Money Quick Log | Tap In/Out, enter amount, auto-timestamp, auto-date, description, auto-categorize, select account. Writes to `money_transactions` |
| Quick Notes | Fast note capture — one-tap, type, save. Writes to `notes` table, visible in desktop QuickCapture |
| Quick Win | One-liner daily win entry |
| Completion ring | Header shows X/8 metrics filled, streak flame |
| Auto-draft | localStorage saves every 30s, syncs on explicit Save |
| PWA | Add-to-home-screen, theme color, offline draft queue |

## 3. What's OUT (Desktop Only)

| Feature | Reason |
|---|---|
| Pomodoro timer | Desktop focus tool, not mobile |
| Journal / long-form text | Desktop only — mobile is for quick capture |
| Weekly/monthly charts | Unreadable on small screens |
| Money Manager (full) | Table-heavy analysis, budgets, recurring, charts — desktop only. Mobile has Quick Log for fast entry |
| Calendar month view | Complex, desktop only. Mobile adds items to it |
| Yearly heatmap | 365 cells unreadable |
| Sleep debt charts | Show number only on mobile, chart on desktop |
| Insight Engine | Read-only analysis, desktop |
| Reports / PDF export | Desktop only |
| YouTube / Music | Desktop focus session feature |
| DSA problem history | Desktop. Mobile can add new problem |
| Settings / Admin | Desktop only |

---

## 4. Information Architecture

**Single scrollable page. No routing. No navigation tabs.**

The page is divided into time-anchored sections matching your day's rhythm:

```
┌─────────────────────────────────────┐
│  STICKY HEADER                      │
│  Mon, Mar 9  ●●●●●○○○  5/8          │
│  [streak 🔥 12]  [Save ✓]           │
└─────────────────────────────────────┘

SECTION 1 — SLEEP (Morning)
┌─────────────────────────────────────┐
│  🌙 Sleep                           │
│  Bedtime:  [11:30 PM]  native picker │
│  Wake up:  [7:00 AM]   native picker │
│  = 7.5 hrs   Debt: +0.5 hrs  🟡     │
└─────────────────────────────────────┘

SECTION 2 — BODY (Morning/Day)
┌─────────────────────────────────────┐
│  💪 Body                            │
│  Gym       [ OFF ●────── ON ]       │
│  Duration   [30] [45] [60] [90] tap │
│  Breakfast  [ OFF ●────── ON ]      │
│  Steps     [───] stepper + presets  │
│  Water   [−]    3    [+]  tap         │
│           × 1.5L bottles · Goal: 3   │
└─────────────────────────────────────┘

SECTION 3 — MIND (Anytime)
┌─────────────────────────────────────┐
│  🧠 Mind                            │
│  Mood   😞 ●──────────── 😄  7/10   │
│  Energy  ○ ○ ● ○ ○   3/5           │
│  Learning  [ OFF ●────── ON ]       │
│  Topic: chip selector + custom      │
└─────────────────────────────────────┘

SECTION 4 — TASKS (Core mobile feature)
┌─────────────────────────────────────┐
│  📋 Tasks & Reminders               │
│                                     │
│  + Add task...                      │
│  ┌───────────────────────────────┐  │
│  │ Title: [___________________]  │  │
│  │ Type: [Task] [Reminder] [Todo]│  │
│  │ Time: [native time picker]    │  │
│  │        [ Add ✓ ]              │  │
│  └───────────────────────────────┘  │
│                                     │
│  Today's items:                     │
│  ☐ DSA practice        2:00 PM      │
│  ☐ Call dentist         4:30 PM  🔔 │ 
│  ☑ Morning walk         done        │
│                                     │
│  Items sync to Calendar on desktop  │
└─────────────────────────────────────┘

SECTION 5 — MONEY (Quick Log)
┌─────────────────────────────────────┐
│  💸 Money                           │
│                                     │
│  [  💰 IN  ]    [  💸 OUT  ]  ← tap │
│                                     │
│  Amount: ₹ [________]  numpad       │
│                                     │
│  What for: [Groceries / Uber / ___] │
│  ↳ auto-match: 🍛 Food & Dining     │
│                                     │
│  Account:                           │
│  [🏦 SBI] [👛 Paytm] [💵 Cash] tap │
│                                     │
│  ⏱ 2:34 PM · Mar 9  (auto-filled)  │
│                                     │
│  [ Log ✓ ]                          │
│                                     │
│  Recent:                            │
│  ↓ ₹120  Uber         💳 HDFC  1h  │
│  ↓ ₹45   Tea + snack  💵 Cash  3h  │
│  ↑ ₹5000 Freelance    🏦 SBI   5h  │
└─────────────────────────────────────┘

SECTION 6 — QUICK NOTES
┌─────────────────────────────────────┐
│  📝 Quick Note                      │
│  ┌───────────────────────────────┐  │
│  │ [Type something quickly...]   │  │
│  └───────────────────────────────┘  │
│  [ Save Note ✓ ]                    │
│                                     │
│  Today's notes:                     │
│  • Call Rahul about project    10m  │
│  • Buy milk on way home        2h  │
└─────────────────────────────────────┘

SECTION 7 — WIN
┌─────────────────────────────────────┐
│  🏆 Today's Win                     │
│  [One thing I'm proud of...    ]    │
└─────────────────────────────────────┘

SECTION 8 — PRIVATE (collapsible)
┌─────────────────────────────────────┐
│  🔒 Private Log  ▾                  │
│  (expands on tap, discreet)         │
│  Count: [0]  [−] [+]               │
│  Times: [+ Add timestamp]          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   [ SAVE DAY LOG ✓ ]               │
│   sticky bottom bar, always visible │
└─────────────────────────────────────┘
```

---

## 5. UX Principles

### 5.1 No Keyboard Unless Necessary
- Booleans: full-width toggle switches (large 48dp hit targets)
- Steps: stepper buttons (+/−) with preset chips (5k, 8k, 10k, 12k)
- Water: tap chips [0] [1] [2] [3] [4+] — each = one 1.5L bottle, goal is 3
- Gym duration: tap chips (30 / 45 / 60 / 90 min)
- Sleep times: native `<input type="time">` (OS time picker)
- Mood: large horizontal slider with emoji endpoints
- Energy: 5-dot tap selector
- Tasks: keyboard only for title, rest is taps
- Money: numpad for amount, keyboard for description, rest is taps
- Notes: keyboard only for note text

### 5.2 Save is Progressive
- Auto-draft saves form state to `localStorage` every 30 seconds
- Explicit "SAVE" button upserts daily_log to Supabase
- Works offline — queues writes, syncs when online via `navigator.onLine` event
- Saved indicator: subtle ✓ animation in header

### 5.3 Section Completion Indicators
- Each section card gets a green ✓ dot in corner when "complete enough":
  - Sleep: both times set
  - Body: at least gym toggle touched
  - Mind: mood set
  - Tasks: section always "complete" (optional)
  - Win: text entered
- Header completion ring fills as sections complete (X/8 metrics)

### 5.4 Sizing & Touch
- Minimum touch target: 48dp (Android Material guideline)
- Cards: 16px horizontal margin, 12px gap
- Font: 16px base (no squinting)
- Dark mode default (same palette as desktop)
- No hover states — all tap/active states

---

## 6. Task System Design

### 6.1 Data Model
Tasks created on mobile write to the existing `calendar_events` table:

```
calendar_events:
  user_id     → auth user
  title       → task name
  start_time  → scheduled time (TIMESTAMPTZ)
  end_time    → null for point tasks, or start_time + 30min
  completed   → boolean toggle
  event_type  → 'task' | 'reminder' | 'todo' (existing column, extend CHECK)
  all_day     → true if no time set
```

### 6.2 Desktop Sync
- Tasks appear on PersonalCalendar automatically (same table)
- Desktop calendar already renders tasks, reminders, events with color coding
- Completing a task on mobile marks `completed = true`, visible on desktop
- No new table needed

### 6.3 Mobile Task UI
- Inline form: title field + type chips + time picker + "Add" button
- Today's tasks listed below with checkbox toggle
- Completed tasks get line-through + gray
- Swipe-to-delete (stretch goal, MVP uses long-press menu)

---

## 7. Money Quick Log Design

### 7.1 Flow
1. User taps the Money section card
2. Picks **IN** (income) or **OUT** (expense) — two large toggle buttons
3. Types amount (₹ numpad, large font)
4. Types description — "What for?" (e.g. "Uber", "Groceries", "Freelance payment")
5. **Auto-categorize**: fuzzy-match description against desktop categories:
   - "Uber" / "Ola" / "Metro" → 🚗 Transport
   - "Zomato" / "Swiggy" / "Tea" / "Lunch" → 🍛 Food & Dining
   - "Amazon" / "Flipkart" → 🛍️ Shopping
   - "Gym" / "Medicine" → 💊 Health
   - "Netflix" / "Movie" → 🎬 Entertainment
   - "Electricity" / "Rent" / "WiFi" → 🏠 Utilities
   - Fallback → 📦 Other (user can override)
6. Select account — chips showing user's accounts from `accounts` table (fetched on load)
7. **Time** = `new Date()` auto-filled (display only, no picker needed)
8. **Date** = today auto-filled
9. Tap "Log ✓" → writes to `money_transactions`
10. Recent transactions (today) shown below for reference

### 7.2 Data Model
Writes to existing `money_transactions` table:

```
money_transactions:
  user_id      → auth user
  date         → today (auto)
  category     → auto-matched category name
  description  → user input ("Uber to office")
  amount       → number entered
  type         → 'income' or 'expense'
  account_id   → selected account UUID
  time_of_day  → current time string ("14:34")
  source       → 'mobile' (to distinguish from desktop manual entry)
  currency     → 'INR' (default)
```

### 7.3 Auto-Category Matching
Keyword map (case-insensitive, checks if description contains any keyword):

```javascript
const CATEGORY_KEYWORDS = {
  'Food & Dining':  ['food', 'zomato', 'swiggy', 'lunch', 'dinner', 'breakfast',
                     'tea', 'coffee', 'snack', 'restaurant', 'cafe', 'biryani'],
  'Transport':      ['uber', 'ola', 'metro', 'bus', 'train', 'petrol', 'fuel',
                     'auto', 'cab', 'rapido', 'parking'],
  'Shopping':       ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes',
                     'electronics', 'phone'],
  'Utilities':      ['electricity', 'rent', 'wifi', 'water', 'gas', 'recharge',
                     'bill', 'maintenance'],
  'Health':         ['medicine', 'doctor', 'gym', 'pharmacy', 'hospital',
                     'supplement', 'protein'],
  'Entertainment':  ['netflix', 'movie', 'spotify', 'game', 'concert',
                     'subscription'],
};
// Fallback: 'Other'
```

User can tap the auto-matched category chip to override with a different one.

### 7.4 Desktop Sync
- Transactions appear instantly in Money Manager (same table)
- `source: 'mobile'` lets desktop distinguish mobile entries
- Category analysis, charts, budgets on desktop use these same rows
- No new table or API needed

---

## 8. Quick Notes Design

### 8.1 Flow
1. Tap into text field, type note
2. Tap "Save Note ✓"
3. Note appears in today's list below
4. Notes sync to desktop QuickCapture (same `notes` table)

### 8.2 Data Model
Writes to existing `notes` table:

```
notes:
  user_id    → auth user
  content    → note text
  type       → 'note' (default)
  created_at → auto timestamp
```

### 8.3 Display
- Today's notes listed with relative time ("10m ago", "2h ago")
- Tap to mark complete (sets `completed = true`)
- Desktop QuickCapture already reads from this table

---

## 9. Technical Plan

### 9.1 Route & Detection
```
/m → MobileApp.jsx (single page, no sub-routes)

Auto-redirect logic in App.js:
  if (window.innerWidth < 768 && !path.startsWith('/m') && !path.startsWith('/auth'))
    → redirect to /m

Desktop can access /m too (for testing), but mobile never sees desktop.
```

### 9.2 Component Structure
```
src/
  components/
    mobile/
      MobileApp.jsx           ← main single-page shell
      MobileSleepSection.jsx   ← sleep inputs + debt number
      MobileBodySection.jsx    ← gym, breakfast, steps, protein
      MobileMindSection.jsx    ← mood slider, energy, learning
      MobileTaskSection.jsx    ← add task + today's list
      MobileMoneySection.jsx   ← quick money log + recent list
      MobileNotesSection.jsx   ← quick note capture + today's notes
      MobileWinSection.jsx     ← one-liner win
      MobileResetSection.jsx   ← collapsible private tracker
      MobileHeader.jsx         ← sticky header with ring
      MobileSaveBar.jsx        ← sticky bottom save
```

### 9.3 Data Layer
- Same `supabase` client, same `useAuth` hook
- Daily log: same `upsertRow('daily_logs', payload, 'user_id,date')`
- Tasks: `insertRow('calendar_events', ...)` / `updateRow('calendar_events', ...)`
- Money: `insertRow('money_transactions', ...)` — each entry saved independently (not batched with daily log)
- Notes: `insertRow('notes', ...)` / `updateRow('notes', ...)`
- Wins: `insertRow('wins', ...)`
- Accounts + Categories: read-only fetch on mount for Money section chips
- No new API endpoints needed

### 9.4 PWA Config
- Existing `manifest.json` already has `theme_color` and icons
- Add `"display": "standalone"` if not present
- Add `"start_url": "/m"` for mobile-specific entry
- Service worker for offline draft queue (Phase 2)

### 9.5 Offline Strategy (MVP)
```
On every field change → save to localStorage('aiimin_mobile_draft')
On "Save" tap:
  if (navigator.onLine) → upsert to Supabase
  else → queue in localStorage('aiimin_offline_queue')

On navigator.onLine event 'online':
  flush aiimin_offline_queue → Supabase

Money + Notes: saved individually on each "Log" / "Save Note" tap.
If offline, queued same way as daily log.
```

---

## 10. Design Tokens (Mobile-Specific)

Uses the same CSS variable system. Additional mobile overrides:

```css
/* Mobile layout tokens */
--mobile-px: 16px;
--mobile-gap: 12px;
--mobile-card-radius: 14px;
--mobile-section-gap: 16px;
--mobile-font-base: 16px;
--mobile-touch-min: 48px;
```

---

## 11. Color Palette (Same as Desktop — LOCKED)

| Element | Dark | Light |
|---|---|---|
| Background | `#0E100D` | `#f5f0e8` |
| Cards | `#1C1E1B` | `#ffffff` |
| Accent | `#F5A623` | `#c27814` |
| Success | `#63C185` | `#2d7a4a` |
| Danger | `#EF4444` | `#d46b6b` |
| Text Primary | `#F5F5F5` | `#1a1408` |
| Text Secondary | `#B7C1B2` | `#6b5d3f` |
| Text Muted | `#8E9B8A` | `#a89878` |

---

## 12. Build Order (MVP)

| Phase | What | Depends On |
|---|---|---|
| M1 | MobileApp shell + Header + Save bar | Route setup |
| M2 | Sleep section | M1 |
| M3 | Body section (gym, breakfast, steps, water bottles) | M1 |
| M4 | Save logic (localStorage draft + Supabase upsert) | M1 |
| M5 | Mind section (mood, energy, learning) | M1 |
| M6 | Task section (add + list + complete) | M1 |
| M7 | Money Quick Log section | M1 |
| M8 | Quick Notes section | M1 |
| M9 | Win section + Reset section | M1 |
| M10 | PWA manifest + auto-redirect | M9 |
| M11 | Offline queue | M4 |

---

## 13. Success Metrics

- Daily log completion rate > 80% (vs current desktop rate)
- Average time to complete daily log < 120 seconds
- Task creation → calendar sync works bidirectionally
- Zero data loss from offline → online sync
- Money entry: under 10 seconds per transaction
- Quick notes: under 5 seconds per note
- Lighthouse mobile score > 90

---

## 14. Out of Scope (v1)

- Push notifications (requires service worker + VAPID keys)
- Biometric auth (native app territory)
- Camera/photo journal (native app territory)
- Voice input (browser support inconsistent)
- Haptic feedback (limited browser support)
- Widget / lock screen (native only)

---

## 15. Schema Changes Required

### Already applied:
```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sleep_need_hours NUMERIC(4,2) DEFAULT 8.0;
```

### NEW — water bottles column (replaces protein_grams in UI):
```sql
ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS water_bottles SMALLINT DEFAULT 0;
```
`protein_grams` column is kept in the DB (not dropped) to preserve historical data.
Frontend stops reading/writing it and uses `water_bottles` instead.

### calendar_events event_type — extend CHECK if needed:
The existing `event_type` column is `TEXT DEFAULT 'personal'` with no CHECK constraint, so 'task', 'reminder', 'todo' values already work. No migration needed.

---

*End of PRD*
