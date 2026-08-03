---
authority: engineering
derived_from: 99_ARCHIVE/documents-vault-2026-08-03 (salvaged)
status: open
owner: eng
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-BUG
tags:
  - type/bug
  - domain/api
  - status/open
---

# Bug — waitlist count masks errors as zero

**Severity:** low (cosmetic on the surface, misleading in ops)
**Status:** open · verified present 2026-08-03

## What

`GET /api/waitlist/count` swallows failures and returns `{ count: 0 }`. A database or
query error is therefore indistinguishable from a genuinely empty waitlist — the landing
page shows "0" and nothing is logged as broken.

Location: `server/routes/waitlist.js:177`

```js
return c.json({ count: 0 });
```

## Why it matters

The waitlist is the launch gate. If the count silently reads zero during a real outage,
there is no signal — the founder sees a plausible number and assumes the page is healthy.

## Fix

Return a distinguishable failure (5xx, or `{ count: null, error: true }`) and log server
side. The client should render a neutral state, not `0`, when the count is unknown.

## Provenance

Salvaged from the retired second vault (`02-Features/Waitlist`, backlog ID **G3**) during
the 2026-08-03 consolidation — the only still-live finding in those 46 notes. Its sibling
claims (G2 "broken on production", G4 "OWNER/TESTER env vars unconfirmed") reference the
**Clerk** era and no longer apply; auth is Better Auth.

## Related

- [[09_FEATURES/Waitlist/Waitlist]] · [[04_API/waitlist]]
- [[16_DOCUMENTATION/VAULT-CONSOLIDATION-2026-08-03]]
