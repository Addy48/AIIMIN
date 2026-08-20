---
authority: operations
derived_from: Intelligence D20 recovery offline · Phase 2–4 · D05 · deep links routes
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 5-flows
---

# 07 — Continuity, Recovery, Offline, Deep Link Flows

## FL-XDEV — Cross-device continuity

| Field | Definition |
|-------|------------|
| **Purpose** | Shared intents across desktop · `/m` · native without false parity |
| **Entry** | Capture on `/m` · continue on desktop · native Home/day · Focus/Discipline pair |
| **Exit** | Intent completed on capable surface · user stays single-device |
| **Transitions** | Capture → sync → structure · CS-EXEC/PLAN/FAMILY · score only Day/Home |
| **Dependencies** | Phase 1 CS-* · Phase 2 IX-CS-* · ST-SYNC/OFF/CONF |
| **Cross-surface** | All CS-* · Native ≠ `/m` |
| **Exceptional** | Sync weak Program 0 · D20 gap · no `/m/score` continuity |
| **Recovery** | Conflict choose · Retry sync · Partial |
| **Validation** | No invented parity features; D05 held |

## FL-RECOV — Recovery

| Field | Definition |
|-------|------------|
| **Purpose** | Return to safe usable state after fail/offline/conflict/crash/draft loss |
| **Entry** | ST-FAIL · ST-OFF · ST-CONF · ErrorBoundary · draft |
| **Exit** | Stable Success/Empty · Auth · abandon |
| **Transitions** | → Retry · Undo · Auth · Conflict resolve · Empty teach |
| **Dependencies** | Phase 4 ST-RECOV/RETRY/UNDO/CONF · Journey recovery weak |
| **Cross-surface** | Shell + domain · stronger `/m`/native offline banners |
| **Exceptional** | Opaque OAuth · missing conflict UI · missing undo |
| **Recovery** | Self (this flow) — stepwise CTAs |
| **Validation** | REQUIRED strengthen; no shame |

## FL-OFF — Offline

| Field | Definition |
|-------|------------|
| **Purpose** | Operate/notify under no or poor connectivity |
| **Entry** | ST-OFF / ST-CONN |
| **Exit** | Online → Syncing → Fresh · limited local capture |
| **Transitions** | Offline → queue capture (if allowed) · → Failure if hard-online · → Syncing |
| **Dependencies** | ST-OFF/CONN/SYNC · desktop Offline REQUIRED gap D08 |
| **Cross-surface** | `/m`/native stronger; desktop must catch up architecturally |
| **Exceptional** | Uneven queue UX · false “saved” |
| **Recovery** | Retry when online · honest limits |
| **Validation** | Visible offline; Capture spine where safe |

## FL-DEEP — Deep links

| Field | Definition |
|-------|------------|
| **Purpose** | Resume intended surface from URL/callback/brand entry without losing auth truth |
| **Entry** | `/auth/callback` · verify-email · branded links · pinned URLs · notifications open target |
| **Exit** | Target surface · Auth first · Pending · 404→safe Today/Login |
| **Transitions** | Deep link → Auth? → Session → target · Failure → Recovery |
| **Dependencies** | FL-AUTH · router evidence · ST-SESS |
| **Cross-surface** | Web URLs; native via OS links where exist — no invent |
| **Exceptional** | Opaque callback · expired links ST-EXP · `/m/score` deep link **must not** restore analytics (D05) — route to Today score |
| **Recovery** | Re-auth · safe fallback Today or Login |
| **Validation** | Auth before private; D05 nullify score-on-`/m` links |
