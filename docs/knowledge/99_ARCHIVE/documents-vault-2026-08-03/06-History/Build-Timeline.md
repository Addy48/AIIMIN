---
authority: none
status: superseded
superseded_by: docs/knowledge (canonical vault)
owner: founder
lifecycle: archive
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-COLD
graph_role: cold
note_type: NT-COLD
archived_from: ~/Documents/AIIMIN VAULT
archived_on: 2026-08-03
---

> [!danger] SUPERSEDED — DO NOT USE AS TRUTH
> Snapshot of the pre-Brain-OS `~/Documents/AIIMIN VAULT` (authored 2026-07-04).
> Its architecture claims are **factually wrong** for the current codebase: it names
> **Clerk** as auth (real: **Better Auth**, OS-ID+PIN — Clerk has 0 matches in the repo),
> a `backend/` directory and single `supabase_init.sql` (real: `server/` + `api/` with
> 48 numbered migrations), and git HEAD `4e28b7a2`. Kept for provenance only.
> Canonical: [[00_HOME]] · routing: [[00_ROUTING]].

# Build Timeline (from AGENTS.md)

#history

## Phase 1 — Foundation
- React + Tailwind + Supabase
- Daily log, monthly grid, weekly charts
- Dark/light mode

## Phase 2 — Core features
- Money Manager, Pomodoro, Google Calendar
- Habits, notifications, YouTube, sleep analytics

## Phase 3 — Mobile data collection
- `MobileApp.jsx` + 9 sections
- Mobile header, save bar, streaks

## Phase 4 — Gamification Tier 1 (2026-03-09)
- `xpEngine.js`, `soundEngine.js`
- LevelUpModal, DailyQuests, brain fog + headache

## Phase 5 — Gamification Tier 2 (2026-03-09)
- Pomodoro XP, achievements gallery
- Clean streak, mobile streaks, goals, yearly heatmap

## Phase 6 — SQL consolidation (2026-03-10)
- Gamification tables → `supabase_init.sql` Section 15
- Sleep quality tags, MobileDSASection

## Phase 7 — UI fixes (2026-03-10)
- YES/NO gym/breakfast buttons
- Mobile data-collection-only enforcement

## Post-AGENTS.md (see [[06-History/Git-Timeline]])
- Clerk auth, Universal Logger, theme overhaul, sports ESPN, waitlist, 34-session plan (~92% code)

## Related

- [[02-Features/16-Locked-Features]]
- [[AIIMIN_PROGRESS_SUMMARY]] (repo file)
