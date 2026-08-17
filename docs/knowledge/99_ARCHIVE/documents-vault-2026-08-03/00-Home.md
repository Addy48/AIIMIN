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

# AIIMIN Vault — Home

> Personal knowledge graph for the **AIIMIN** Life Tracker project.  
> Owner: [[Aaditya Upadhyay]] · Repo: `~/Desktop/DASHBOARD PROJECT`

---

## Start here

| Note                                                              | Purpose                                |
| ----------------------------------------------------------------- | -------------------------------------- |
| `~/Desktop/DASHBOARD PROJECT/docs/knowledge/00-Command-Center.md` | **Central launch + agent context doc** |
| [[07-Backlog/Master-Backlog]]                                     | **Full scoped TODO** — every open item |
| [[01-Architecture/Overview]]                                      | What AIIMIN is                         |
| [[01-Architecture/Tech-Stack]]                                    | React, Express, Supabase, Vercel       |
| [[06-History/Git-Timeline]]                                       | Git commit history (curated)           |
| [[06-History/Build-Timeline]]                                     | Phase-by-phase build from AGENTS.md    |

---

## Maps of content (MOCs)

### Architecture
- [[01-Architecture/Overview]]
- [[01-Architecture/Two-Views]]
- [[01-Architecture/Frontend-Structure]]
- [[01-Architecture/Backend-Structure]]
- [[01-Architecture/Database-Schema]]
- [[01-Architecture/Auth-Flow]]

### Features (16 locked + extensions)
- [[02-Features/16-Locked-Features]]
- [[02-Features/Gamification]]
- [[02-Features/Journal]]
- [[02-Features/Finance]]
- [[02-Features/Sports]]
- [[02-Features/Family-Vault]]
- [[02-Features/Lab]]
- [[02-Features/Waitlist]]
- [[02-Features/Command-Palette]]

### Design
- [[03-Design/Color-Palette]]
- [[03-Design/Themes]]
- [[03-Design/Navbar]]
- [[03-Design/Typography]]

### Deploy & ops
- [[04-Deploy/Production-Stack]]
- [[04-Deploy/Launch-Checklist]]
- [[04-Deploy/AWS-Setup]]
- [[04-Deploy/GoDaddy-DNS]]

### Security
- [[05-Security/Production-Gap-Report]]
- [[05-Security/Vibecoding-Audit]]
- [[05-Security/RLS-Audit]]

### Migration (future)
- [[08-Migration/AWS-Cognito-Exploration]]
- [[08-Migration/Clerk-to-Cognito]]

### Integrations
- [[09-Integrations/Supabase]]
- [[09-Integrations/Clerk]]
- [[09-Integrations/Stripe]]
- [[09-Integrations/SES]]
- [[09-Integrations/Gemini-AI]]

### Recent sessions
- [[10-Sessions/2026-07-Design-System]]
- [[10-Sessions/2026-07-Nav-Logger-Fixes]]

---

## External docs (in repo)

- `~/Desktop/DASHBOARD PROJECT/docs/knowledge/00-Command-Center.md`
- `~/Desktop/DASHBOARD PROJECT/docs/knowledge/_manifest.json`
- `~/Desktop/DASHBOARD PROJECT/AGENTS.md`
- `~/Desktop/DASHBOARD PROJECT/AIIMIN_PROGRESS_SUMMARY.md`
- `~/Desktop/AIIMIN_MASTER_BACKLOG.md`

---

## Graph tips

- Use **Obsidian Graph view** with tags: `#feature` `#debt` `#security` `#deploy`
- Pin this note as **Home tab**
