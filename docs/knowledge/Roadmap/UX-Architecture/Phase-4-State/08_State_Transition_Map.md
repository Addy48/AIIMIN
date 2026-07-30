---
authority: operations
derived_from: 03–07 state defs · Phase 2 · DH-66
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 4-state
---

# 08 — State Transition Map

## Primary flows (architecture)

```text
[Auth] → [Session] → (Permissions?) → surface

surface entry → Loading ─┬→ Empty
                         ├→ Partial → Success
                         ├→ Success
                         ├→ Failure → Retry ⇄ Loading
                         ├→ Offline → Connectivity → Syncing
                         └→ AI processing → (confirm) → Success → Undo?

Syncing ─┬→ Success / Fresh
         ├→ Conflict → Recovery choose → Syncing
         └→ Failure → Retry

Failure → Permissions | Auth | Offline | Recovery | Retry

Expired → Auth | Session | Recovery

Background work → Success | Failure | Syncing | Offline
```

## Illegal transitions

| Illegal | Why |
|---------|-----|
| Loading → treated as Hold | DH-66 |
| Empty ← Failure (mislabel) | SA teach vs error |
| Success with silent AI write | Phase 2 AI · D22 |
| Offline ignored on desktop | D08 REQUIRED |
| Syncing → silent clobber | Conflict REQUIRED |
| Any → `/m` score analytics state | D05 |

## Hold / Knock (cite only)

Interruptive Knock states obey Phase 2 Attention — not redefined here.
