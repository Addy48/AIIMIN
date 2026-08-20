---
authority: operations
derived_from: Intelligence Auth/Account/Settings · Phase 1 CONFIG MERGE · pending access
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 5-flows
---

# 06 — Access and Account Flows

## FL-AUTH — Authentication

| Field | Definition |
|-------|------------|
| **Purpose** | Establish trusted session (Google, PIN, native auth/biometric) |
| **Entry** | Login CTA · session dead · native AuthScreen · deep link requires auth |
| **Exit** | Session · Onboarding · Pending access · Failure |
| **Transitions** | Auth → Session → (Onboarding \| Pending \| Today) · → ST-FAIL/RETRY · → Expired |
| **Dependencies** | DOM-ACCESS · ST-AUTH/SESS · Better Auth locks |
| **Cross-surface** | CS-AUTH web↔native biometric |
| **Exceptional** | OAuth env fail · opaque callback · PIN recover unclear · pending anxiety |
| **Recovery** | Retry · clear error · logout · re-auth |
| **Validation** | Honest gates; pending ≠ failure; no auth/schema invent |

## FL-ACCT — Account

| Field | Definition |
|-------|------------|
| **Purpose** | Profile, personas/pins, subscription, logout — **Config hub** |
| **Entry** | Account utility · `/m` account lite (essentials only) · Native settings overlap |
| **Exit** | Prefs saved · logout → public/login · stay |
| **Transitions** | Sections save · ST-OK/FAIL · Permissions billing · Logout confirm |
| **Dependencies** | DOM-CONFIG · persona pins · ST-PERM subscription stub |
| **Cross-surface** | CS-CONFIG · `/m` lite ≠ full desktop account |
| **Exceptional** | Dual Account/Settings until MERGE · billing stub · design-lab section = DEV out |
| **Recovery** | Retry save · re-auth for sensitive |
| **Validation** | BR-05 MERGE target; logout confirm |

## FL-SET — Settings

| Field | Definition |
|-------|------------|
| **Purpose** | App preferences — architecturally **same Config hub as Account** (MERGE), not permanent dual flow |
| **Entry** | Settings route/utility · Native Settings · (legacy dual entry) |
| **Exit** | Saved · navigate · merge into Account IA |
| **Transitions** | Same as FL-ACCT config saves · ST-OK/FAIL |
| **Dependencies** | FL-ACCT · BR-05 |
| **Cross-surface** | Native Settings ↔ web Config |
| **Exceptional** | Duplicate destinations D03 until merge complete |
| **Recovery** | Retry · Account path if settings orphaned |
| **Validation** | FA-08; do not invent third settings surface |
