---
Purpose: Document unused, legacy, duplicate, dead, conflicting, and incomplete work as facts only — no fix recommendations.
Confidence: 0.88
Generated From: Route/import inventories; migration conflicts; Current-Context vs SQL; App.js vs Sidebar; unmounted files
Dependencies: [01_REPOSITORY_MAP.md](01_REPOSITORY_MAP.md)–[10_THEME_SYSTEM.md](10_THEME_SYSTEM.md)
Consumers: Planning; Codex risk awareness
Last Updated: 2026-07-22
Pass: 1/6
---

# 11 — Technical Debt (facts only)

No remediation advice in this document.

---

## Unused folders / empty packages

| Item | Evidence |
|------|----------|
| `frontend/src/components/career/` | Empty directory |
| `frontend/src/components/notes/` | Empty directory |
| `frontend/src/components/layout/Sidebar.jsx` | Not imported; links nonexistent `/systems/*` routes |
| `server/routes/health.js` | Not in `api/index.js` routeMap |

---

## Dead / unmounted UI components

Import search this pass found **no consumers** for:

- `components/account/AccountModal.jsx`
- `components/onboarding/PostPurchaseModal.jsx`
- `components/discipline/TriggerModal.jsx`
- `components/discipline/UrgeOutcomeSheet.jsx`
- `components/reports/ReportPreviewModal.jsx`
- `components/focus/PostSessionReflection.jsx`
- `components/gamification/LevelUpModal.jsx` (paired with `XPProvider` not mounted in `index.js` per route agent)

---

## Duplicate / overlapping implementations

| Topic | Variants |
|-------|----------|
| Settings | `/settings` (Settings.jsx) vs `/account` hub (canonical in nav/product) |
| Money UI | `components/finance/*` + `components/money/*` + root `MoneyManager.jsx` |
| Auth entry docs | Some docs mention `server/index.js` — **file absent**; real entry `api/index.js` |
| Health endpoints | `/api/health`, `/api/cron/health`, `/api/mobile/health` |
| Profile tables | `profiles` (legacy RLS) vs `user_profiles` (app) |
| Goals naming | archive/MCP `personal_goals` vs runtime `goals` |
| Habit logs naming | `habit_completions` vs `habit_logs` |
| Google tokens naming | `google_tokens` vs `user_oauth_tokens` |
| Pomodoro | migrations ALTER table vs view `pomodoro_sessions` over `sessions` |
| Theme hex | Palette `#1a1a1a` vs tokens.css `aiimin-dark` `#14171A` |
| Light accent | `#ff6b35` lock vs CSS `#E85A24` |
| Mobile RLS narrative | Current-Context “deny-all” vs SQL user-scoped policies |
| Insights | Routed page that only redirects to Reports |
| Brand lockup copy | Some prototype text says mark→`/identity`; production BrandLockup mark→`/brand` |
| Account page path | `pages/AccountPage.jsx` re-export shim → `account/AccountPage.jsx` |
| Intelligence sharpen | `/arc/sharpen` and `/north-star/sharpen` same handler |
| Sports refresh | `_manifest.json` lists `/sports/refresh/system`; route inventory listed `/sports/refresh` only |

---

## Legacy systems still present

| Item | Notes |
|------|-------|
| Capacitor `frontend/android/` | WebView → `/m` stopgap; not native V2 |
| Legacy theme IDs in tokens.css | vercel/nordic/studio/midnight |
| Waitlist forced nordic/vercel | Separate from canonical themes |
| Root `MASTER_PLAN.md`, `AIIMIN_PROGRESS_SUMMARY.md`, `aiimin_agent_prompt.md` | Historical |
| `deploy/` Cognito/RDS Option A scripts | Deploy.md: Option A not completed |
| AWS migration docs | Planning; prod uses Supabase + Better Auth |
| KokonutUI kit | Vendor decorative library coexisting with ShippedUI |

---

## Incomplete / in-progress (from vault status labels + code)

| Item | Status signal |
|------|---------------|
| Journal craft B1 | craft-b1-in-progress |
| Discipline urge redesign | urge-redesign-planned; dead modal files |
| Launch LC-01..LC-14 | Blockers listed in Product/Home |
| GA4 / Sentry prod | Blockers |
| Native vs design pack | Proposed tables not migrated; companion feature depth partial |
| `recurringTransactions.js` job | No cron HTTP mount found |
| `NO_USER_SCOPE` in `db.js` | Referenced, undefined |
| XP/Level-up wiring | Modal/provider mount gap |
| Vault DB Index | Documents ~7 tables; code uses 70+ |
| External HTML prototype polish | Current-Context: functional, not production-fire |

---

## Conflicting documentation sets

| Set A | Set B |
|-------|-------|
| `docs/knowledge/` Brain OS | Older root MASTER_PLAN / progress dumps |
| `17_NATIVE_APP_V2/10_DATABASE.md` proposed schema | Shipped `mobile_devices` / `mobile_idempotency` |
| Product intelligence / Product Bible / Interaction audit under `docs/` | This Design Context pack (2026-07-22 snapshot) |
| Archive AGENTS dump | Slim root `AGENTS.md` |

---

## Security-relevant facts (documented, not remediated)

| Fact | Location |
|------|----------|
| `/api/blob/upload` and `/delete` without auth middleware | blobService mount |
| EC2 SSH `0.0.0.0/0` + disk 97% (Deploy.md 2026-07-17 check) | Deploy.md |
| Secrets folders and pem present locally | root listing |

---

## Experimental surfaces coexisting with production

- Account Design Lab panels
- `prototypes/reports/`
- `frontend/public/prototypes/today/`
- `logo-designs/`
- `/seed-data` route
- `/identity` routed but absent from NAV_REGISTRY

---

## Cross-references

- Map labels → [01_REPOSITORY_MAP.md](01_REPOSITORY_MAP.md)
- API flags → [08_API_MAP.md](08_API_MAP.md)
- Schema conflicts → [07_DATA_MODELS.md](07_DATA_MODELS.md)
