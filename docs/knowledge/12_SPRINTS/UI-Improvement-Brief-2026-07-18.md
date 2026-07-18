# UI Improvement Brief — 2026-07-18

> Source: full 38-screenshot audit. Cursor execution plan for Aug 2026 launch polish.
> Auth note: product uses **Better Auth** (not Clerk). Stack: React + Vite + Hono/Express + Supabase.

## Sprint order

| Sprint | Scope | Target |
|--------|-------|--------|
| 1 | P0 rendering + data bugs | 1 day |
| 2 | P1 Focus / Family / Sports / Career UX | 2 days |
| 3 | P2 design system consistency | 0.5 day |
| 4 | P3 copy batch | 2 hours |
| 5 | P4 feature additions | 3 days |

## P0 — Rendering and data (do first)

1. Account settings sidebar — duplicate nav items (AccountPage / SECTIONS)
2. Lab sidebar — Personality AI / section item loops (LabFullPage)
3. Discipline Community Wall — duplicate testimonials
4. Lab Overview — "RECENT TYPING TESTS" double header
5. Career Trajectory — DSA score showing Unix timestamp (useReadinessScore + guard)
6. Career Vault — broken Drive embeds → fallback card + Update link
7. Career Board — null/skeleton cards under real apps
8. Notes — ADMIN_SIMULATED badge / filter in production
9. Today Streak Monitor — habit list alternate loop (dedupe by id)
10. Today Trajectory — Time Invested triple render (dedupe rows)
11. Global ISO date strings → `formatDate` utility (en-IN style)
12. Family Insurance — `$` → `₹` + en-IN grouping
13. Family / Discipline — enum raw labels → label map
14. Reports / Snapshot — email as display label → name or OS-ID

## P1 — High-impact UX

Focus redesign (orange CTA, fill dead space, session history); Family tab clusters; Sports empty states; Career Vault fallback UX; Journal mode chips; Goals "Set deadline"; Finance waterfall reorder; Lab sidebar collapse; Subscription 2-tier lead; Data delete friction.

## P2 — Design system

Toggle active `#ff6b35`; Privacy checkboxes → toggles; Finance donut colors; Focus button; Career kanban/timeline colors; Lab metric borders; Discipline milestone icons; Account sidebar type; Career badge style.

## P3 — Copy (one PR)

phone_scroll label, Sports empties, Vault fallback, Push Tasks → Sync tasks to calendar, Focus CTA subcopy, Reports spend label, Weekend Review header, Notes empty, Discipline help link, Stagnant → Holding steady, Interview → In Interview.

## P4 — Features

Focus RecentSessionsList + WeeklyFocusTarget; Sports smart empty; Lab collapse; Career board scroll; Urge Surfing timed flow; Reports deep-link Snapshot; Notes admin filter; Personalization Reports pin; Profile Location completion.

## Files (primary)

- `frontend/src/pages/account/AccountPage.jsx`
- `frontend/src/pages/LabFullPage.jsx`
- `frontend/src/pages/Discipline.jsx`
- `frontend/src/pages/FocusRoom.jsx`
- `frontend/src/pages/Placements.jsx`
- `frontend/src/pages/Family.jsx`
- `frontend/src/pages/Notes.jsx`
- `frontend/src/pages/Overview.jsx`
- `frontend/src/hooks/useReadinessScore.js`
- `frontend/src/components/overview/CommandCenter.jsx`
- `frontend/src/components/reports/IvorySnapshot.jsx`
- `frontend/src/utils/formatDate.js` (new)
- `frontend/src/utils/enumLabels.js` (new)
- `scripts/seed-realistic-life.mjs` (Drive URLs / aptitude sanity)

---

## Honest status (3× lie-check ×3 depth passes, 2026-07-18)

> Code-proof only. Local, **uncommitted**. Every DONE row re-checked; pass 2 + pass 3 lies fixed. Brief-hot smell scan = 0.

### DONE (verified in source)

| # | Item | Proof |
|---|------|-------|
| P0-1 | Account sidebar unique | `UNIQUE_SECTIONS` — SECTIONS already unique; dedupe defensive |
| P0-2 | Lab sidebar unique keys | `uniqueMods` Map by `m.key` + collapse |
| P0-3 | Testimonials unique | 3 unique rows; `key={author-days}`; rendered once |
| P0-4 | Single typing header | one `Recent Typing Tests` in `TypingHistory` |
| P0-5 | Score sanitize | `sanitizeScore` in `useReadinessScore` + Trajectory |
| P0-6 | Vault Drive fallback | `ResumePreview` broken/demo → card + Update link |
| P0-7 | Null board cards | `columnApps.filter(app => app?.company_name)` |
| P0-8 | Notes admin filter | hide `admin_simulated` outside dev |
| P0-9 | Habit dedupe | CommandCenter Map by id |
| P0-11 | formatDate util | en-IN + `formatDateLong`; Family, Career, Overview, Journal (sidebar/header/editor/canvas/read), DocumentsTab, Lab typing rows, Focus week rows, Sports smart-empty |
| P0-12 | Family ₹ | premium `formatINR`; finance balance `formatINR` (was ungrouped) |
| P0-13 | Enum labels | `DOC_TYPE_LABELS` / `DISCIPLINE_TARGET_LABELS` |
| P0-14 | Snapshot name | name → OS-ID, never email |
| P1 | Focus orange + sessions + weekly bar | PHASES orange; week list; target bar; **no fake /dashboard link** |
| P1 | Family tab clusters | People / Records |
| P1 | Journal mode chips | Free Write / CBT / Morning / Weekly |
| P1 | Goals Set deadline | clickable date overlay on label + change when set |
| P1 | Finance waterfall first | Analytics `order: 1` |
| P1 | Lab collapse | localStorage `lab-sidebar-collapse` |
| P1 | Subscription 2-tier lead | Explore → **Core+Pro only**; See all; Cancel anytime |
| P1 | Delete friction | DataSection two-step + type DELETE |
| P2 | Orange toggles | Notifications + Privacy |
| P2 | Finance donut brand | `ASSET_COLOR_BY_TYPE` |
| P2 | Lab metric borders | green/amber/orange tops |
| P2 | Lab module chips | palette orange / green / amber / red (no blue/purple chips) |
| P2 | Milestone SVG | lucide Icons in Discipline |
| P2/P3 | Career badges + copy | accent badges; Holding steady; In Interview |
| P3 | Calendar copy | Sync tasks to calendar |
| P3 | Reports Money out | abs INR |
| P3 | Weekend header | Your week, in numbers. |
| P3 | Crisis link | orange underline |
| P4 | Urge 3-step | `DisciplineUrgeModal` breath → observe → outcome |
| P4 | Sports smart empty | `collectNextMoment` |
| P4 | Reports `?tab=snapshot` | maps to report / IvorySnapshot |
| P4 | Career board scroll | arrows + thin scrollbar |
| P4 | Weekly focus setting | Personalization + FocusRoom via **localStorage** `aiimin_weekly_focus_target_h` (UI says device-only) |
| P4 | Reports in nav pins | registry + `ensureNotesNav` keeps reports active |
| P4 | Location completion | trim check on Profile |

### NOT A CODE BUG (screenshot / misread)

| # | Claim | Truth |
|---|-------|-------|
| P0-10 | Time Invested ×3 | One “Time Invested” block + Day/Week/Month/Year rows. No triple widget. |

### PARTIAL / HONEST LIMITS

| Item | Limit |
|------|-------|
| Account/Lab “7× loops” | Source arrays unique + dedupe guards. Visual loop unproven if still seen. |
| Global ISO sweep | Brief-hot pages cleaned. Settings / Habits / other non-brief pages may still use locale helpers. |
| Weekly focus target | **localStorage only** — not in `PATCHABLE_PROFILE_FIELDS`. Cross-device needs schema ask. |
| Focus session archive | No dedicated route yet — week list only on Focus page. |

### STILL OPEN (real)

1. Smoke AADI0837 after pass 3 (Calendar title, Trajectory colors, Goals pillars, Intake “In Interview”, Discipline toolkit).
2. **User visual re-check (2026-07-18 evening):** Calendar chips + Goals cards/picker + Weekend Review prompt leak — code fixed again in pass 4; needs hard-refresh smoke.
3. Optional: `weekly_focus_target_hours` column + PATCH — **only if you ask**.
4. Optional: Focus session archive page.
5. Commit / push — **only on ask**.

### Lie-check log

**Pass 4 (user screenshots ~18:48):** Prior “DeadlinePicker / insight filter done” overclaimed — UI still showed native-looking picker symptoms, invisible goal cards, month chips without boxes, and weekend review boxes filled with LLM instruction text (`under 110 words`, etc.). Root: light-theme translucent surfaces, weak chip CSS, polluted localStorage insight cache, model echoing prompt. Fixes: solid chips/cards, DeadlinePicker chrome, insight cache `v3` + local `buildLocalInsight` fallback + stricter leak filter + cleaned AI prompt.

**Pass 1:** profile weekly-focus silent-drop; Explore 3-tier lead; kanban half-open; stale “still open” list.

**Pass 2:** dead `/dashboard` links; Journal en-US/GB leftovers; Family balance; Lab chips; Goals 0×0 date; Sports blue badge.

**Pass 3 (iterate again) — new lies caught + fixed:**

| Lie | Truth | Fix |
|-----|-------|-----|
| Calendar toolbar “done” | Title still **en-US** | `formatMonthYear` / `formatWeekOf` / `formatDateLong` |
| Intake “In Interview” | Modal still `Interview` + bare `toLocaleDateString()` | → In Interview + `formatDate` |
| Funnel label | Stats row still `Interview` | → In Interview + amber |
| Trajectory bars | Week blue, month pink | → orange / amber / muted |
| Discipline toolkit | Blue + purple strategy icons | → orange / amber / green |
| Discipline hero stripe | Gradient into blue | → amber |
| Goals pillars “left intentional” | Still blue/purple — wrong vs palette lock | → amber / green / orange / muted |
| Overview Recent Wins | Journal chip purple | → orange |
| Reports pie Journal | blue | → amber |
| Career Market Sentiment | Fintech blue | → amber |
| Journal Editor / MoodHeatmap | Mood + chrome blue/purple | → palette |

**Scan after pass 3:** brief-hot smell check = **0** remaining (dead route / en-US / en-GB / bare locale / purple / blue / pink / Interview label).
