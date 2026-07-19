# Skills registry — AIIMIN repo

> **Agents:** read this when choosing a skill. **Humans:** install global skills via `~/AGENTS.md`.

**Last updated:** 2026-07-19

---

## How skills are organized

| Layer | Path | Scope | Commit? |
|-------|------|-------|---------|
| **Global Cursor** | `~/.cursor/skills/<name>/` | All projects | No — machine local |
| **Global Claude** | `~/.claude/skills/<name>/` | Claude Code | No |
| **Global agents** | `~/.agents/skills/<name>/` | skills CLI canonical | No |
| **Project AIIMIN** | `.agents/skills/<name>/` | This repo only | Yes — product-specific |
| **Third-party local** | `.agents/skills/compose/`, etc. | Dev aid | **No** — gitignored |
| **Cursor built-in** | `~/.cursor/skills-cursor/` | Cursor internal | Never touch |

### Before running any skill script

1. Read `SKILL.md` fully
2. Scripts in third-party skills: **review** before execute (no blind `python` / `curl`)
3. No skill may change auth schema, palette, or push to `main` without founder ask
4. Proof-or-stop: build/test evidence same turn

---

## Skills that fix / improve this repo (full map)

### P0 — Ship & integrity

| Skill | Location | Repo use |
|-------|----------|----------|
| **verification-before-completion** | Claude plugin | No “done” without build/test evidence |
| **systematic-debugging** | Claude plugin | API 404, sync failures, auth loops |
| **caveman-review** | `.agents/skills/caveman-review/` | PR / diff review before merge |
| **review-security** | Cursor plugin | Secrets, auth surface, RLS |
| **audit** | `~/.claude/skills/audit/` | Security + dependency posture pass |
| **harden** | `~/.claude/skills/harden/` | Headers, rate limits, input validation |
| **senior-fullstack** | `~/.cursor/skills/senior-fullstack/` | `code_quality_analyzer.py`, architecture refs |
| **better-auth-best-practices** | `.agents/skills/` | Auth flows — read-only unless founder asks |
| **supabase-postgres-best-practices** | `.agents/skills/` | RLS, indexes, mobile tables |
| **database-schema-designer** | `.agents/skills/` | Migration design (founder approval) |

### P1 — Web Life OS (`frontend/`)

| Skill | Location | Repo use |
|-------|----------|----------|
| **frontend-design** | `~/.claude/skills/frontend-design/` | New pages, composition |
| **design-taste-frontend** | `.agents/skills/` | Palette-locked UI polish |
| **emil-design-eng** | `.agents/skills/` | Motion, layout craft |
| **impeccable** | `.agents/skills/` | UI consistency pass |
| **polish** / **normalize** | `~/.claude/skills/` | Refactor UI copy/spacing |
| **optimize** | `~/.claude/skills/optimize/` | Bundle, React Query, lazy routes |
| **deployments-cicd** | Vercel plugin | Vercel + preview deploys |
| **deployment-expert** | Cursor plugin | EC2 API deploy verification |

### P1 — API (`server/`, `api/`)

| Skill | Location | Repo use |
|-------|----------|----------|
| **senior-fullstack** | references/architecture_patterns.md | REST route boundaries |
| **caveman-commit** | `.agents/skills/` | Split commits (web vs mobile) |
| **supabase** | `.agents/skills/` | Client patterns, logs |

### P1 — Native Android (`native-android/`)

| Skill | Location | Repo use |
|-------|----------|----------|
| **compose** | `.agents/skills/` (local) | Compose UI patterns |
| **android-dev** / **modularization** | `.agents/skills/` | Module boundaries |
| **kotlin-coroutines** / **kotlin-flows** | `.agents/skills/` | Sync, WorkManager |
| **datastore** | `.agents/skills/` | Theme, prefs |
| **gradle-build-performance** | `.agents/skills/` | CI build speed |
| **mobile-app-ui-design** | `.agents/skills/` | 48dp targets, thumb zone |
| **claude-android-ninja** | `~/.claude/skills/` | Play checklist, edge-to-edge |

### P2 — Docs & repo hygiene

| Skill | Location | Repo use |
|-------|----------|----------|
| **github** | `~/.cursor/skills/github/` | README, topics, profile SEO |
| **graphify** | `~/.claude/skills/graphify/` | Vault knowledge graph |
| **obsidian-bases** | `.agents/skills/` | Vault manifests |
| **caveman-compress** | `.agents/skills/` | Memory packs in `15_MEMORY/` |
| **distill** / **extract** | `~/.claude/skills/` | Trim vault bloat |

### P2 — Process (any change)

| Skill | Location | Repo use |
|-------|----------|----------|
| **brainstorming** | Claude plugin | Scope before big features |
| **writing-plans** | Claude plugin | `plans/*.md` |
| **finishing-a-development-branch** | Claude plugin | Merge / branch cleanup |
| **create-rule** | Cursor plugin | `.cursor/rules/` updates |
| **create-hook** | Cursor plugin | proof-or-stop hooks |

### Not for this repo (skip)

| Skill | Why |
|-------|-----|
| **marketing-skills** (full pack) | Only `github` sub-skill mapped; rest is growth spam |
| **senior-fullstack project_scaffolder** | Greenfield only — we have a monorepo |
| **industrial-brutalist-ui** | Conflicts with locked AIIMIN palette |

---

## Install commands (global)

```bash
# Fullstack quality
npx @borghei/claude-skills add senior-fullstack --to cursor --force
npx @borghei/claude-skills add senior-fullstack --to claude --force

# GitHub README / repo marketing
npx -y skills add kostja94/marketing-skills --skill github --agent cursor -g

# Android suite (local to project, gitignored)
npx skills add rcosteira79/android-skills --skill compose --agent cursor
```

---

## Verification

Run after skill-driven changes:

```bash
bash scripts/verify-repo.sh
```

See `plans/repo-fix-master-plan.md` for prioritized fix backlog.
