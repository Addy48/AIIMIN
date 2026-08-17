---
authority: operations
derived_from: 90_Final_Audit · Founder finalization order
status: active
owner: founder
lifecycle: frozen
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
---

# 93 — Freeze Certificate

```text
═══════════════════════════════════════════════
 AIIMIN UX ARCHITECTURE v1.0
 FREEZE CERTIFICATE
═══════════════════════════════════════════════
```

**Certificate ID:** UXA-v1.0-FREEZE-2026-07-25  
**Status:** **FROZEN**  
**Authorized by:** Founder finalization order (all phases complete + constitutional audit PASS)

## Frozen set

| Pack | Paths |
|------|-------|
| Phase 1 | `00_INDEX` (hub living pointers OK) · `02`–`08` · Phase 1 audit `90_Architecture_Audit`–`93_Freeze_Recommendation` |
| Phase 2 | `Phase-2-Interaction/**` |
| Phase 3 | `Phase-3-Components/**` |
| Phase 4 | `Phase-4-State/**` |
| Phase 5 | `Phase-5-Flows/**` |
| Final pack | `90_Final_Audit` · `91_Architecture_Metrics` · `92_Publication_Verification` · this certificate · `94` · `95` |

`01_Current_Status` may record post-freeze pointers; must not alter frozen claim sets without Founder ADR.

## Attestations

| Attestation | |
|-------------|--|
| Genesis edits | **0** |
| Intelligence edits | **0** |
| Implementation in corpus | **0** |
| Visual design in corpus | **0** |
| Final audit | **PASS** |
| D05 | **CLOSED** |

## Amendment rule

Frozen corpus immutable without **Founder ADR**. Downstream may implement expression; may not silently rewrite Architecture.

```text
UX ARCHITECTURE v1.0 — FROZEN
```
