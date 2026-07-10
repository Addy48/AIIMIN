# Vault Brain OS Implementation Plan

> **For agentic workers:** Implement task-by-task. Checkboxes track progress.

**Goal:** Cut over `docs/knowledge/` to Project Brain OS and enforce token-light agent load order.

**Architecture:** Dual-layer vault (human prose + caveman AI packs). Slim AGENTS.md. New always-apply Cursor rules.

**Tech Stack:** Markdown Obsidian vault, Cursor `.mdc` rules, JSON manifest.

---

### Task 1: Scaffold folders + archive old vault

- [x] Create numbered folders under `docs/knowledge/`
- [x] Copy old notes into `99_ARCHIVE/pre-brain-os-2026-07-10/`
- [x] Remove old top-level Command-Center / 01-Architecture / 02-Features / 06-History from active tree after migrate

### Task 2: Core brain files

- [x] Write `00_HOME.md` (caveman-tight)
- [x] Write `15_MEMORY/*` (Current Context, Terminology, Business Rules, Personas)
- [x] Write product + architecture split docs
- [x] Write design palette, deployment, AI overview

### Task 3: Migrate + seed features / DB / API

- [x] Move Waitlist, Sports, Calendar, Account, Typography, DevTools, Intelligence into `09_FEATURES/`
- [x] Seed key DB + API group notes
- [x] Add templates + one ADR + one sprint

### Task 4: Rules + AGENTS + manifest

- [x] Add `vault-brain-os.mdc`
- [x] Rewrite `obsidian-vault-documentation.mdc`
- [x] Slim `AGENTS.md` (backup fat copy to archive)
- [x] Update `_manifest.json`

### Task 5: Verify

- [x] Tree matches design
- [x] No secrets in vault
- [x] List user rules compliance in final reply
