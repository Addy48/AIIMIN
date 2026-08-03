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

# Tech Stack

#architecture

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React 19 + Tailwind | `frontend/` |
| Backend | Node.js + Express | `backend/` or `server/` |
| Database | Supabase PostgreSQL | Project: `yubxgftugxbwtywyhcsv` |
| Auth (current) | Clerk + Google OAuth | See [[09-Integrations/Clerk]] |
| Hosting | Vercel (FE) + EC2 (API path) | See [[04-Deploy/Production-Stack]] |
| Charts | Recharts | |
| Excel | xlsx library | Audit issue [[05-Security/Dependency-CVEs]] |
| PDF | jsPDF client-side | Puppeteer deferred [[02-Features/16-Locked-Features]] |
| AI | Gemini API | [[09-Integrations/Gemini-AI]] |
| Cache | Upstash Redis (optional) | Stub without env |
| Email | SES via nodemailer | [[09-Integrations/SES]] |
| Payments | Stripe | [[09-Integrations/Stripe]] |

## Planned migration

[[08-Migration/AWS-Cognito-Exploration]] — target: **Vercel + GoDaddy + AWS** (Cognito, RDS or DynamoDB, S3, SES).

## Schema

Single SQL file: `backend/supabase_init.sql` — see [[01-Architecture/Database-Schema]].
