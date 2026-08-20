---
Purpose: Complete repository map — every important folder/file with Production / Experimental / Legacy / Unused / Archive / Generated / Temporary labels.
Confidence: 0.90
Generated From: Root ls/find depth-2; CONTRIBUTING.md; AGENTS.md; README.md; Monorepo.md; agent folder inventories
Dependencies: [00_PROJECT_SUMMARY.md](00_PROJECT_SUMMARY.md)
Consumers: [02_ARCHITECTURE.md](02_ARCHITECTURE.md), [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md), [14_REPOSITORY_STATISTICS.md](14_REPOSITORY_STATISTICS.md)
Last Updated: 2026-07-22
Pass: 1/6
---

# 01 — Repository Map

## Legend

| Tag | Meaning |
|-----|---------|
| **Production** | Ships or required for ship |
| **Experimental** | Prototypes / Design Lab / trials |
| **Legacy** | Still present; superseded pattern |
| **Unused** | On disk; no mount/import found this pass |
| **Archive** | Historical reference |
| **Generated** | Build output / caches |
| **Temporary** | Local scratch / secrets adjacent |
| **Tooling** | Agent/CI/dev tooling |

For each folder: Purpose · Dependencies · Consumers · Importance (P0–P3).

---

## Root tree (depth 1–2, excluding `node_modules`, `.git` objects)

```text
DASHBOARD PROJECT/
├── AGENTS.md                    Production · slim agent pointer
├── README.md                    Production
├── CONTRIBUTING.md              Production · 3-client commit rules
├── CHANGELOG.md                 Production
├── DESIGN.md                    Production · design facts
├── PRODUCT.md                   Production · short product pointer
├── MASTER_PLAN.md               Archive/planning · dated Jun 2025 plan
├── AIIMIN_PROGRESS_SUMMARY.md   Archive · progress dump
├── audit.md                     Archive · audit notes
├── aiimin_agent_prompt.md       Legacy · old agent prompt
├── package.json                 Production · monorepo scripts + API deps
├── package-lock.json            Production
├── vercel.json                  Production · Vercel SPA + /api rewrite
├── dev_server.js                Production · local API :3001
├── query_user.js                Tooling
├── test_*.js                    Tooling · ad-hoc root tests
├── laptop-disk-audit-*.html     Temporary · machine audit artifact
├── aiimin.pem                   Temporary/secrets · SSH key (DO NOT COMMIT VALUES USE)
├── .env*                        Temporary · local secrets (names only elsewhere)
├── .github/workflows/           Production CI
├── .cursor/rules/               Tooling · always-on agent rules
├── .agents/skills/              Tooling · project skills
├── api/                         Production · Hono entry
├── server/                      Production · routes/services
├── frontend/                    Production · web + Capacitor
├── native-android/              Production · native V2
├── supabase/                    Production · SQL migrations
├── docs/                        Production docs + Archive intelligence
├── deploy/                      Production · EC2/nginx/cron
├── scripts/                     Production tooling
├── plans/                       Planning
├── prototypes/                  Experimental
├── logo-designs/                Experimental
├── Secrets, Keys /              Temporary · local secrets folder
└── AIIMIN_DESIGN_CONTEXT/       Generated this pass · Codex pack
```

---

## Core production folders

### `frontend/` — P0

| Field | Value |
|-------|-------|
| Purpose | React Life OS; Capacitor Android WebView shell under `frontend/android/` |
| Dependencies | `server`/`api` at runtime; CRA/CRACO; Tailwind; Better Auth client |
| Consumers | Vercel; Capacitor builds; humans on desktop/tablet/phone web |
| Tag | Production (+ Capacitor subtree Legacy-stopgap) |

Important children:

| Path | Tag | Notes |
|------|-----|-------|
| `frontend/src/App.js` | Production | Route source of truth |
| `frontend/src/pages/` | Production | Screen pages (~63 files) |
| `frontend/src/components/` | Production | ~342 JSX components |
| `frontend/src/components/mobile/` | Production (capture) | `/m` only — not native V2 |
| `frontend/src/components/kokonutui/` | Experimental/vendor | 45 decorative effect files |
| `frontend/src/components/layout/Sidebar.jsx` | Unused | Orphan; TabRail replaced it |
| `frontend/android/` | Legacy stopgap | Capacitor → remote `/m` |
| `frontend/build/` | Generated | CRA output |
| `frontend/public/prototypes/today/` | Experimental | 12 Today HTML prototypes |
| `frontend/src/pages/account/sections/design/` | Experimental | In-app Design Lab |

### `server/` — P0

| Field | Value |
|-------|-------|
| Purpose | Feature routers, services, middleware, jobs, SQL migrations |
| Dependencies | `pg`, Better Auth (`server/lib/auth.js`), Supabase admin, AI SDKs |
| Consumers | `api/index.js` lazy `routeMap` |
| Tag | Production |

Children: `routes/` (30 files), `services/` (26), `middleware/`, `jobs/`, `lib/`, `migrations/` (023–048), `scripts/`, `utils/`.

**Conflict:** No `server/index.js`. Entry is `api/index.js`. Docs that say `server/index.js` are stale → see [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md).

### `api/` — P0

| Field | Value |
|-------|-------|
| Purpose | Sole Hono app: CORS, health, auth mount, lazy route forwarding |
| File | `api/index.js` only (8KB tree) |
| Tag | Production |

### `native-android/` — P0

| Field | Value |
|-------|-------|
| Purpose | Kotlin Compose companion `in.aiimin.app` |
| Dependencies | JDK 17, Android SDK 35, API `api.aiimin.in` |
| Consumers | Play / sideload APK |
| Tag | Production |

Children: `app/src/main/java/in/aiimin/app/{ui,data,sync,session,security}`, `dist/` (Generated APKs), `build/` / `.gradle/` (Generated).

### `supabase/` — P0

| Field | Value |
|-------|-------|
| Purpose | Selected SQL migrations including mobile sync |
| Consumers | Supabase project apply / ops |
| Tag | Production |
| Note | Complements `server/migrations/`; not a full schema dump |

### `docs/` — P0 (knowledge) / Archive (intelligence dumps)

| Path | Tag | Purpose |
|------|-----|---------|
| `docs/knowledge/` | Production | Brain OS — agents read first |
| `docs/AIIMIN_PRODUCT_BIBLE/` | Archive/reference | Product Bible |
| `docs/product-intelligence/` | Archive/reference | Field matrix / Product Intelligence |
| `docs/interaction-audit/` | Archive/reference | Interaction audit |
| `docs/superpowers/` | Tooling/archive | Specs (e.g. vault Brain OS) |
| `docs/AWS_*.md` (if present) | Planning | AWS migration notes |

### `deploy/` — P0

EC2 nginx, PM2 `ecosystem.config.cjs`, `github-ec2-deploy.sh`, cron, email setup docs, Cognito setup docs (Option A unused per Deploy.md).

### `scripts/` — P1

Auth migration, waitlist seed/clear, AI key tests, vault helpers, `verify-repo.sh`.

### `.github/workflows/` — P0

| Workflow | Trigger / purpose |
|----------|-------------------|
| `deploy-api.yml` | Push `server/**` `api/**` `deploy/**` → EC2 |
| `verify-frontend.yml` | Frontend verify |
| `native-android.yml` | Native CI |

---

## Experimental / prototype

| Path | Purpose | Importance |
|------|---------|------------|
| `prototypes/reports/` | Standalone HTML report gallery | P2 |
| `frontend/public/prototypes/today/` | Today page HTML gallery | P2 |
| `logo-designs/` | Logo concept gallery | P3 |
| Account Design Lab panels | In-React prototypes | P2 |
| External: `~/prototype-chat/aiimin-prototype/index-opus.html` | Canonical HTML OS prototype (outside repo) | P2 (referenced) |

---

## Tooling / agent

| Path | Tag |
|------|-----|
| `.cursor/rules/` | Tooling · alwaysApply product locks |
| `.agents/skills/` | Tooling · caveman, auth, design, android skills |
| `.codex/`, `.qwen/`, `.superpowers/` | Tooling |
| `.vercel/` | Generated local Vercel cache |

---

## Temporary / secrets-adjacent (do not document values)

| Path | Note |
|------|------|
| `.env`, `.env.local`, `.env.vercel*` | Secrets |
| `Secrets, Keys /` | Local key store |
| `aiimin.pem` | EC2 SSH |
| `native-android/aiimin-release.keystore` | Signing (sensitive) |
| `native-android/local.properties` | Machine SDK paths |

---

## Root one-off scripts

| File | Tag |
|------|-----|
| `dev_server.js` | Production local API |
| `test_auth.js`, `test_auth_middleware.js`, `test_sports.js`, `test_tables.js` | Tooling / ad-hoc |
| `query_user.js` | Tooling |

---

## Importance matrix (quick)

| P0 | P1 | P2 | P3 |
|----|----|----|-----|
| frontend/src, server, api, supabase migrations, native-android app, docs/knowledge, deploy, vercel.json, workflows | scripts, plans, CONTRIBUTING | prototypes, Design Lab, product-intelligence dumps | logo-designs, MASTER_PLAN, old prompts |

## Cross-references

- Architecture behavior → [02_ARCHITECTURE.md](02_ARCHITECTURE.md)
- Unused/orphan detail → [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md)
