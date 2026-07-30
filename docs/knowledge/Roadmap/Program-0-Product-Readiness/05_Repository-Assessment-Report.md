---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-PROG
graph_role: leaf
note_type: NT-PROGRAM-LIVING
program: Program-0-Product-Readiness
migration_batch: W4
fm_source: script
---

# 05 — Repository Assessment Report

**Mode:** Recommendations only — no large-scale moves executed.

## Top-level ownership map

| Path | Role | Recommendation |
|------|------|----------------|
| `frontend/` | Web Life OS + `/m` | Production |
| `native-android/` | Native V2 | Production |
| `server/` + `api/` | Backend | Production |
| `docs/knowledge/` | Vault SoT + Genesis | Production knowledge |
| `deploy/` | Ops runbooks | Production ops |
| `supabase/` | Migrations | Production |
| `scripts/` | Ops scripts | Production tools |
| `AIIMIN GENESIS/MOVED.md` + `AIIMIN_* /MOVED.md` | Redirect stubs | Keep stubs; do not recreate content |
| `docs/AIIMIN_PRODUCT_BIBLE/README.md` etc. | Redirect stubs | Keep |
| `prototypes/`, `logo-designs/`, `plans/` | Experiments / plans | Archive or label clearly |
| `AIIMIN Prototype Studio/` | Stub after P6 move | Stub only |
| `Archive/Superseded/Repository-Root/` | **Archived** | June plans preserved; use V1 Blueprint + Current Context |
| `Secrets, Keys/`, `aiimin.pem` | Secrets | Ensure gitignored; never vault |
| `node_modules/` | Generated | Ignore |
| `laptop-disk-audit-*.html` | One-off | Archive or delete later |

## Clutter / risk

1. Historical planning is archived; immutable Genesis reports still describe its original root location.
2. Many stub `MOVED` folders — intentional but noisy in Explorer.  
3. Uncommitted Genesis+vault migration (~200+ paths) — SoT not on remote.  
4. Duplicate historical copies only in `docs/knowledge/Archive/Duplicates/` (OK).  
5. Capacitor `frontend/android/` legacy vs `native-android/` — document boundary (already in CONTRIBUTING/Monorepo).

## Naming consistency

- Routes `/overview` vs P8 “Today” — product naming debt for UX Arch.  
- `Lab` / `Placements` / `Identity` / `Insights` — dense naming; map to P8 IA in UX Arch.  
- Numbered vault folders Stage A frozen — Stage B rename deferred.

## Improvement plan (phased, no auto-exec)

| Phase | Actions |
|-------|---------|
| **S0 Safe** | Commit vault migration when Founder asks; add README banners on stale root plans |
| **S1** | Quarantine `prototypes/`, one-off audits into `docs/knowledge/Archive/Repo-Clutter/` or `99_ARCHIVE` |
| **S2** | Confirm `.gitignore` covers pem/Secrets; remove accidental tracked secrets if any |
| **S3** | Stage B semantic vault rename — only after Founder ask |

## Do not

- Move Genesis  
- Re-open Stage A structure  
- Auto-delete stubs without Founder ask
