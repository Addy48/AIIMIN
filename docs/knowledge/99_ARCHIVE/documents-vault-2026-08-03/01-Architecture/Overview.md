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

# AIIMIN — Overview

#architecture #feature

**AIIMIN** is a personal life tracker web dashboard built by [[Aaditya Upadhyay]].

## What it does

- Tracks daily metrics (sleep, gym, mood, steps, water, learning, journal)
- Manages money (Excel import, categories, accounts)
- Google Calendar OAuth sync
- Pomodoro / Focus Room with deep work analytics
- Gamification: XP, ranks, achievements, quests, streaks
- Habits, goals, discipline, journal (5 modes), sports feed, family vault, lab tools

## Two surfaces

See [[01-Architecture/Two-Views]]:

| Route | Purpose |
|-------|---------|
| Desktop `/overview` etc. | Full analytics + tools |
| Mobile `/m` | **Data collection only** — no analytics |

## Stack summary

See [[01-Architecture/Tech-Stack]].

## Related

- [[02-Features/16-Locked-Features]]
- [[06-History/Build-Timeline]]
- [[07-Backlog/Master-Backlog]]
