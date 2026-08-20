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

# AWS Cognito Migration Exploration

#migration #aws

## Target stack

**Vercel** (frontend) + **GoDaddy** (DNS) + **AWS** (everything else)

## Auth: Clerk → Cognito

- User Pools + Hosted UI
- Google as federated IdP
- Map `clerk_id` → `cognito_sub`
- See [[08-Migration/Clerk-to-Cognito]]

## Database decision

| Option | Pros | Cons |
|--------|------|------|
| **RDS Postgres** | Closest to Supabase; minimal app rewrite | Cost, ops |
| **DynamoDB** | Serverless, AWS-native | **XL rewrite** of relational schema |
| **Keep Supabase** | Zero migration | Not pure AWS |

**Recommendation:** RDS Postgres + Cognito unless you want a full data model redesign.

## AWS services inventory

| Service | Use |
|---------|-----|
| Cognito | Auth |
| RDS / Aurora Serverless | PostgreSQL |
| S3 + CloudFront | Family vault, exports |
| SES | Email |
| ElastiCache | Redis replacement |
| Secrets Manager | Env secrets |
| EventBridge | Cron jobs |
| CloudWatch | Logs |
| API Gateway (optional) | If moving off EC2 |

## Free tier / credits

Document actual usage vs limits in a future note after E5 analysis.

## Related

- [[04-Deploy/AWS-Setup]]
- [[09-Integrations/Supabase]]
- [[07-Backlog/Master-Backlog]] section E
