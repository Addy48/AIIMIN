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

# Production Stack

#deploy

## Current intended architecture

```
User → GoDaddy DNS → aiimin.in
                    ├─ Vercel (React frontend)
                    └─ api.aiimin.in → EC2 Express (deploy/)
                         ├─ Supabase PostgreSQL
                         ├─ Clerk JWT verify
                         ├─ Stripe webhooks
                         ├─ SES (email)
                         ├─ Upstash Redis (cache)
                         └─ Gemini API
```

## Deploy assets (repo)

- `deploy/bootstrap.sh`
- `deploy/setup-ec2.sh`
- `deploy/nginx.conf`
- `deploy/ecosystem.config.cjs` (PM2)
- `deploy/rsync-to-ec2.sh`

## Docs

- `docs/PRODUCTION_VERIFICATION.md`
- `docs/AWS_SETUP.md`

## Open

- EC2 not verified live (G7)
- DNS not confirmed (G5)
- Large uncommitted local changes (G1)

## Related

- [[04-Deploy/Launch-Checklist]]
- [[04-Deploy/Git-Push-Status]]
