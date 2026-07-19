# AIIMIN — Agent Pointer

> Deep memory lives in the vault. Do **not** expand this file.

**Owner:** Aaditya Upadhyay  
**Product:** Personal Life OS — metrics, money, calendar, focus, discipline, sports, gamification

## Start here (mandatory)

1. `docs/knowledge/00_HOME.md`
2. `docs/knowledge/15_MEMORY/Current-Context.md`
3. Only relevant notes under `docs/knowledge/` for the task
4. Only source files involved in the change

Never whole-repo scan unless user explicitly asks.

## Monorepo — three clients (never mix commits)

| Client | Path | Branch typical |
|--------|------|----------------|
| **Web Life OS** | `frontend/` (excl. `components/mobile/` for web-only work) | `main` |
| **Capacitor `/m`** | `frontend/android/`, `frontend/src/components/mobile/` | `feat/mobile-capture-capacitor` |
| **Native Android V2** | `native-android/`, `server/routes/mobile.js` | native feature branch |

Architecture: `docs/knowledge/02_ARCHITECTURE/Monorepo.md`  
Contributing: `CONTRIBUTING.md`

## Stack (one line)

React 19 + Tailwind (`frontend/`) · Kotlin Compose (`native-android/`) · Node `server/` · Supabase Postgres · Better Auth · Vercel + `api.aiimin.in`

## Palette LOCKED

Dark bg `#1a1a1a` · cards `#2d2d2d` · accent `#ff6b35` · done `#10b981` · muted `#6b7280`  
Light bg `#f9f9f9` · cards `#ffffff` · same accents  
Full: `docs/knowledge/08_DESIGN/Palette.md`

## Hard product rules

- Navbar: logo mark → `/brand`; AIIMIN text → `/overview` (LOCKED — split, not unified)
- Phone web `/m` = data collection only (native app ≠ this ceiling)
- No secrets in vault/git
- No auth/schema changes without explicit user instruction
- Update vault before task complete
- No tool-vendor attribution in docs or commits
- Proof-or-stop: no done/fixed/shipped without same-turn evidence

## Fat history

Pre-Brain-OS dump archived at `docs/knowledge/99_ARCHIVE/pre-brain-os-2026-07-10/AGENTS.md.original.md`
