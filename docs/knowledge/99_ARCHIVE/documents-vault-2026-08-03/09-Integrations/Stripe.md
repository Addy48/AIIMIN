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

# Stripe

#integration #billing

## Purpose

Stripe powers paid tier upgrades (Core / Pro) and subscription webhooks.

## Current behavior

- Works in stub mode without production keys.
- Real checkout requires production environment variables in Vercel.

## Required env vars

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_CORE`
- `STRIPE_PRICE_PRO`
- `STRIPE_WEBHOOK_SECRET`

## Canonical references

- `~/Desktop/DASHBOARD PROJECT/AIIMIN_PROGRESS_SUMMARY.md`
- `~/Desktop/DASHBOARD PROJECT/server/routes/billing.js`
- `~/Desktop/DASHBOARD PROJECT/server/services/billingService.js`
