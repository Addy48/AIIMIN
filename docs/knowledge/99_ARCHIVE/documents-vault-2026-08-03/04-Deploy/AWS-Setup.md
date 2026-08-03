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

# AWS Setup

#deploy #aws

**Repo doc:** `~/Desktop/DASHBOARD PROJECT/docs/AWS_SETUP.md`

## Deploy folder

- `deploy/setup-aws-resources.sh`
- `deploy/cloudwatch-alarms.sh`
- `deploy/bootstrap.sh`

## Status

Partial per progress summary — SES SMTP code ready; S3/CloudFront not done.

## Related

- [[08-Migration/AWS-Cognito-Exploration]]
- [[04-Deploy/Production-Stack]]
