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

# Vibecoding Security Audit

#security #open

User-requested security review after vulnerability article + broken flow screenshots.

## Fixed ✅

| Item | Fix |
|------|-----|
| POST body consumed by sanitize | `clone().json()` |
| Negative expense validation | Server validation |
| AI import fallback | Regex parser when Gemini fails |
| Family FK / missing users row | Auth middleware ensures row |

## Not systematically addressed 🔴

- RLS full audit → [[05-Security/RLS-Audit]]
- Exposed secrets scan
- IDOR production tests
- Dependency CVEs → [[05-Security/Dependency-CVEs]]
- Auth bypass review (guest, waitlist, admin)
- XSS audit (journal, user content)

## Related

- [[05-Security/Production-Gap-Report]]
- [[07-Backlog/Master-Backlog]] section J
