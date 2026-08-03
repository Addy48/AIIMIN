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

# Launch Checklist LC-01 → LC-14

#deploy #open

**Source:** `AIIMIN_PROGRESS_SUMMARY.md`

## Categories

- [ ] LC smoke tests (all routes, guest + auth)
- [ ] Lighthouse prod pass
- [ ] Backup restore test
- [ ] Sentry wired + test error
- [ ] GA4 events firing
- [ ] Status page / health endpoint public
- [ ] Clerk production domains
- [ ] Stripe live mode (or stub documented)
- [ ] SES production + DKIM
- [ ] Waitlist flip tested
- [ ] Mobile `/m` save flow
- [ ] Family vault upload
- [ ] Cron jobs scheduled (Vercel cron / EC2)
- [ ] Rollback procedure documented

## Progress

~75% launch-ready per progress summary — mostly manual ops remain.

## Related

- [[02-Features/Waitlist]]
- [[04-Deploy/Production-Stack]]
- [[07-Backlog/Master-Backlog]] G8
