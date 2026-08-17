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

# Production Gap Report

#security #deploy

**Source:** `docs/PRODUCTION_GAP_REPORT.md` (2026-07-01)

## Summary

- 87 public tables in Supabase
- `dashboard-uploads` bucket exists (public)
- API on Vercel serverless

## Missing tables

`tester_allowlist`, `addiction_tracking`, `cbt_records`, `www_entries`, `cognitive_benchmarks`, `financial_health_scores`, `lab_aptitude_scores`, `lab_system_design_logs`, `lab_reading_log`

## Schema gaps

- **`users.clerk_id`** missing — MD5 hash mapping only
- **RLS:** `daily_logs` policies dropped; 11 tables RLS enabled but no policies

## AWS

- No idle EIPs; no budgets configured (addressed in deploy scripts?)

## Backlog IDs

- J11, H1, G8

## Related

- [[05-Security/RLS-Audit]]
- [[09-Integrations/Supabase]]
- [[07-Backlog/Master-Backlog]]
