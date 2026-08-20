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

# SES

#integration #email #deploy

## Purpose

AWS SES handles operational and re-engagement email delivery.

## Current behavior

- App supports stub/no-send mode when SES variables are missing.
- Production requires DNS + SES verification for deliverability.

## Required env vars

- `AWS_SES_SMTP_USER`
- `AWS_SES_SMTP_PASS`
- `SES_FROM_EMAIL`

## DNS requirements

- DKIM CNAME records
- SPF
- DMARC

## Canonical references

- `~/Desktop/DASHBOARD PROJECT/AIIMIN_PROGRESS_SUMMARY.md`
- `~/Desktop/DASHBOARD PROJECT/server/services/reEngagementService.js`
- `~/Desktop/DASHBOARD PROJECT/server/lib/emailTemplates.js`
