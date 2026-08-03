---
authority: engineering
derived_from: repository audit · 02_ARCHITECTURE/Monorepo · 2026-07-30 repository-layout ADR
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
tags:
  - type/documentation
  - domain/engineering
  - status/active
---

# Repository reorganization

## Outcome

The repository keeps its production roots because they already match real build and release boundaries. Cleanup removes misleading root material and generated Git noise without creating path churn in Vercel, Gradle, CI, deploy scripts, agent rules, or historical documentation.

Decision: [[10_DECISIONS/2026-07-30-repository-layout]].

## 1. Audit report

| Area | Canonical path | State |
|------|----------------|-------|
| Web Life OS | `frontend/` | Production React client |
| Capacitor `/m` | `frontend/android/` + mobile React components | Production wrapper; coupled to frontend build |
| Native Android V2 | `native-android/` | Independent Kotlin Compose client |
| API | `server/` + `api/` | Production Node implementation + serverless entry |
| Database | `supabase/` | Migrations and DB support |
| Deployment | `deploy/`, `.github/workflows/`, `vercel.json` | Production automation |
| Vault | `docs/knowledge/` | Human + agent source of truth |
| Tooling | `scripts/` | Maintained automation |
| Plans / prototypes | `plans/`, `prototypes/`, `logo-designs/` | Explicit non-production material |
| Local secrets | `.env*`, `Secrets, Keys /`, `*.pem`, `local.properties` | Ignored, preserved locally |

## 2. Dependency analysis

A production-root move would affect:

- root and frontend npm scripts;
- CRA/CRACO output and aliases;
- Capacitor `webDir` and Android Gradle paths;
- native Gradle workflow paths;
- Vercel build/output configuration and rewrites;
- GitHub Actions path filters and working directories;
- EC2 deployment scripts and PM2 configuration;
- repository rules, README files, Vault notes, and immutable Genesis historical references.

No runtime package currently crosses the React/Compose boundary. A generic `shared/` folder would describe intent, not a real import boundary.

## 3. Target structure

```text
Dashboard Project/
├── frontend/              web + coupled Capacitor wrapper
├── native-android/        native mobile client
├── server/ + api/         backend + serverless entry
├── supabase/              database migrations
├── deploy/                deployment automation
├── scripts/
│   └── diagnostics/       manual one-file probes
├── docs/
│   └── knowledge/         Obsidian source of truth
├── plans/                 active delivery plans
├── prototypes/            non-production experiments
└── logo-designs/          brand exploration
```

## 4. Move plan and executed moves

1. Protected the pre-cleanup state and completed V1 Blueprint in checkpoint commits.
2. Moved stale root Markdown into `docs/knowledge/Archive/Superseded/Repository-Root/` with original filenames and Git rename history.
3. Moved the raw pre-Blueprint handoff into `Archive/Superseded/Planning/`.
4. Moved root diagnostic scripts into `scripts/diagnostics/` and updated only movement-required imports.
5. Removed generated npm cache content from the Git index while leaving both local cache directories intact.
6. Kept production roots stable under the accepted layout ADR.

Every move is reversible with Git. No source file was deleted from local storage.

## 5. Archive report

| Archived material | Destination | Living replacement |
|-------------------|-------------|--------------------|
| June master plan | `Archive/Superseded/Repository-Root/MASTER_PLAN.md` | [[Roadmap/AIIMIN-V1-Blueprint]] |
| June progress dump | `Archive/Superseded/Repository-Root/AIIMIN_PROGRESS_SUMMARY.md` | [[15_MEMORY/Current-Context]] + feature notes |
| Legacy agent prompt | `Archive/Superseded/Repository-Root/aiimin_agent_prompt.md` | [[00_HOME]] + agent rules |
| Historical UX audit | `Archive/Superseded/Repository-Root/audit.md` | Genesis P3/P4 + living notes |
| Raw V1 brainstorm handoff | `Archive/Superseded/Planning/Current-Context-pre-blueprint-2026-07-30.md` | Blueprint + compact Current Context |

## 6. Validation report

| Check | Result |
|-------|--------|
| Frontend production build | Passed: isolated CRA/CRACO build in `/tmp` |
| Backend service tests | Passed: 9 tests, 0 failures |
| Native Android debug build | Passed: Gradle `assembleDebug` with JDK 17 |
| Capacitor Android debug build | Passed: Gradle `assembleDebug` with JDK 21 |
| Moved diagnostic syntax | Passed: `node --check` for all five scripts |
| Obsidian JSON | Passed: JSON parse + duplicate-key rejection |
| Obsidian Bases | Passed: YAML parse for all three `.base` files |
| Changed Vault wikilinks | Passed: all changed-note targets resolved |
| Genesis immutability | Passed: no changed Genesis paths |
| Local secrets | Preserved: root env, secrets folder, PEM key |
| npm caches | Preserved locally; ignored; zero tracked cache files |

Dependency restore reported npm audit debt: root install 66 findings (including one critical) and frontend install 6 findings (four high). No forced audit fix was applied because dependency upgrades are outside this behavior-preserving organization pass.

## 7. Maintenance rules

- Add product scope to the Blueprint or an accepted ADR, never Current Context.
- Keep Current Context below 120 lines.
- Archive stale documents with provenance; do not silently delete them.
- Keep generated outputs and caches out of Git.
- Move a production root only when a concrete build/ownership benefit exceeds path migration cost and before/after validation passes.

## 8. Post-audit Vault follow-up

A second read-only audit found operating-layer defects that the first pass did not expose. The follow-up corrected them without touching application source:

- made all dashboard IDs unique;
- enabled the Obsidian core plugins used by the configured workspace;
- opened Current Context by default and reduced the Core bookmark group to ten entrypoints;
- added the Blueprint to agent boot, roadmap, product, engineering, feature, and native authority paths;
- classified the old native roadmap and AWS Option A migration as superseded;
- moved active telemetry, auth, deployment, frontend, and local-development documents into the Vault;
- archived session snapshots, the old mobile PRD, an incomplete OAuth review, and superseded Vault planning under [[99_ARCHIVE/repository-docs-2026-07/README]];
- left short compatibility pointers at every moved repository path;
- indexed co-located deployment procedures in [[07_DEPLOYMENT/Runbooks-Index]].

Follow-up validation parsed all changed JSON and Base YAML, confirmed 11 unique dashboard IDs, parsed frontmatter on all changed living notes, resolved every newly added link, and found no changes under Genesis or local secret paths.
