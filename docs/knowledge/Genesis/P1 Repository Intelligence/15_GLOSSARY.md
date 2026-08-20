---
Purpose: Glossary of AIIMIN-specific and critical technical terms for Codex.
Confidence: 0.90
Generated From: Product.md; Home; Monorepo; Palette; App guards; native README; feature MOCs
Dependencies: [00_PROJECT_SUMMARY.md](00_PROJECT_SUMMARY.md)
Consumers: All Design Context docs; new agents
Last Updated: 2026-07-22
Pass: 1/6
---

# 15 — Glossary

| Term | Meaning |
|------|---------|
| **AIIMIN** | Personal Life OS product; brand/wordmark |
| **Life OS** | Full desktop/tablet web product: analytics, tools, pages |
| **Brain OS / Vault** | `docs/knowledge/` Obsidian knowledge base; agent source of truth |
| **Current Context** | `docs/knowledge/15_MEMORY/Current-Context.md` — live handoff |
| **Monorepo three clients** | Web (`frontend/`), Capacitor (`frontend/android/` + `/m`), Native (`native-android/`) — never mix in one commit |
| **`/m`** | Phone web capture-only shell; product lock forbids analytics/tools |
| **DeviceGate / device tier** | Phone → `/m`; tablet TabRail; desktop masthead |
| **Capacitor** | Legacy installable WebView wrapping remote `/m` |
| **Native V2** | Kotlin Compose app `in.aiimin.app`; offline-first companion |
| **Better Auth** | Auth library replacing older Cognito path; `/api/auth/*` |
| **OS-ID** | Username-style identifier (8-char) used with PIN on native/web |
| **Waitlist mode** | `REACT_APP_WAITLIST_MODE=true` gates public access; landing on `/` |
| **Access gate** | `useAccessGate` / `accessService` — allowlist, owner, waitlist pending |
| **Life Arc / ArcGuard** | Onboarding north-star/arc; missing → `/onboarding` |
| **Brand lockup (LOCKED)** | Logo mark → `/brand`; AIIMIN text → `/overview` |
| **Palette (LOCKED)** | Dark `#1a1a1a`/`#2d2d2d`/`#ff6b35`/`#10b981`/`#6b7280` (+ light ivory system) |
| **`aiimin-dark` / `aiimin-light`** | Canonical CSS theme IDs |
| **Ivory Snapshot** | Core report presentation component/style |
| **LHS** | Life Health System scores (`/api/intelligence/lhs`) |
| **Universal Logger / QuickCapture** | Today quick-log component (`UniversalLogger`) |
| **J0 / J0a** | Journal/Today craft program labels in vault changelogs |
| **Tier / Explore / Core / Pro / Elite** | Subscription tiers; `tierGating.js` + Stripe |
| **FeatureGate / TierRouteGuard** | UI/route paywalls |
| **NAV_REGISTRY** | Canonical masthead nav items (`constants/navItems.js`) |
| **TabRail** | Tablet left navigation |
| **Command Palette** | Cmd+K style navigator |
| **Design Lab** | Account → Design section prototypes (not prod UX) |
| **Family Vault** | `/family` multi-entity personal/family records |
| **Placements** | Career applications + resumes + ATS |
| **Lab** | Cognitive/skill practice modules under `/lab` |
| **Discipline / Urge event** | Addiction/urge tracking domain |
| **Anchor edges** | Graph links between notes/habits/etc. |
| **mobile_idempotency** | Dedup store for native sync batch |
| **routeMap** | Lazy prefix mount table in `api/index.js` |
| **`/api/db`** | Generic authenticated table gateway with allowlists/write blocks |
| **Service role** | Supabase/Postgres elevated server access bypassing RLS |
| **Proof-or-stop** | Agent rule: no done/fixed without same-turn evidence |
| **Caveman** | Terse chat style for Cursor agents in this repo |
| **LC-01..LC-14** | Launch checklist items in Product.md |
| **Human Momentum** | Brand manifesto content on `/brand` |
| **Selfloop QA** | External QA runs recorded under `docs/knowledge/11_BUGS/` |
| **Craft program** | UI craft sprint docs under `12_SPRINTS/` |
| **Product Bible** | `docs/AIIMIN_PRODUCT_BIBLE/` prior product intelligence |
| **CodeGate / prototype-chat** | External HTML prototype workflow referenced in Current-Context (outside repo) |

## Cross-references

- Product summary → [00_PROJECT_SUMMARY.md](00_PROJECT_SUMMARY.md)
- Nav terms → [06_NAVIGATION_GRAPH.md](06_NAVIGATION_GRAPH.md)
