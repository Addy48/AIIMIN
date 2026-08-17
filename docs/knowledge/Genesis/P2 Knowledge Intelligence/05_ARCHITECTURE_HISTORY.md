# 05 — Architecture History

```yaml
purpose: Chronology of system architecture shifts and current architecture thesis.
confidence: ★★★★☆
generated_from:
  - docs/knowledge/02_ARCHITECTURE/*
  - docs/knowledge/10_DECISIONS/2026-07-10-vault-brain-os.md
  - docs/knowledge/07_DEPLOYMENT/*
  - docs/knowledge/17_NATIVE_APP_V2/09_BACKEND.md
  - docs/knowledge/17_NATIVE_APP_V2/12_SYNC.md
  - MASTER_PLAN.md
  - docs/knowledge/09_FEATURES/Auth/Auth.md
  - docs/knowledge/09_FEATURES/Mobile/*
related_notes: [01_PRODUCT_HISTORY.md, 03_PRODUCT_DECISIONS.md, 14_CONTRADICTIONS.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Backend/native/web agents
importance: ★★★★★
```

---

## CURRENT ARCHITECTURE (CANONICAL)

```
┌──────────────┐   ┌─────────────────┐   ┌──────────────────┐
│ Web Life OS  │   │ Capacitor /m    │   │ Native Android   │
│ frontend/    │   │ (legacy shell)  │   │ native-android/  │
│ Vercel       │   │ WebView→/m      │   │ Kotlin Compose   │
└──────┬───────┘   └────────┬────────┘   └────────┬─────────┘
       │                    │                     │
       └────────────┬───────┴──────────┬──────────┘
                    ▼                  ▼
              Better Auth         api.aiimin.in (EC2)
                    │                  │
                    └────────┬─────────┘
                             ▼
                      Supabase Postgres
```

| Layer | Tech |
|-------|------|
| Web | React 19 + Tailwind |
| Native | Kotlin Compose + WorkManager outbox |
| API | Node Express/Hono routes `server/` + `api/` |
| DB | Supabase PostgreSQL + RLS |
| Auth | Better Auth + Google OAuth |
| Hosts | Vercel (FE) · EC2 (`api.aiimin.in`) |
| AI | Multi-provider (Groq / OpenRouter / Gemini / others — see AI-Pipeline) |

---

## ARCHITECTURE TIMELINE

| Date | Shift | From | To | Source |
|------|-------|------|----|--------|
| ≤2026-06 | Auth | Supabase client patterns / Clerk | — | Progress summary, Waitlist |
| 2026-06-20 | Auth feature | — | Clerk integration complete (then) | Git timeline |
| 2026-06-25 | Discipline data | localStorage-centric | DB backend Phase 0 done; FE pending | MASTER_PLAN |
| 2026-07-05 | Auth | Clerk | Better Auth | Waitlist Changelog |
| 2026-07-05 | Email | SES | Resend | Waitlist Changelog |
| 2026-07-08 | Product surface | Waitlist-only risk | Recovery: dashboard + waitlist auth | Archive Command Center |
| 2026-07-10 | Agent memory | Fat AGENTS + repo scan | Vault Brain OS | ADR |
| 2026-07-11 | Product intelligence layer | Ad-hoc | Formal graphs + kill list + Bible | product-intelligence/ |
| 2026-07-18 | Data access | Direct client patterns | `/api/db` proxy + write blocks | Auth audit |
| 2026-07-18 | Life Score | localStorage | API-first `/intelligence/lhs` | Architecture Overview |
| 2026-07-19 | Client model | Implicit dual | **Documented three-client monorepo law** | Monorepo.md |
| 2026-07-19 | Mobile product | `/m` as ceiling confusion | Phone web capture ≠ native companion | Device-Tiers |
| 2026-07-19 | Native data | — | `mobile_sync` + RLS deny-all; server service role | Current-Context |
| 2026-07-19 | Native sync | — | Outbox + WorkManager batch sync | Native pack |

---

## DEVICE TIER MODEL (CRITICAL)

| Tier | Surface | Role |
|------|---------|------|
| Phone web | `/m`, `/m/score`, `/m/account` | Capture only |
| Tablet | Full OS responsive | Analytics OK |
| Desktop | Full OS | Command surface |
| Native Android | Compose app | Rich companion (not WebView) |
| Capacitor | Legacy | Stopgap WebView to `/m` |

**Rule nuance:** Product lock "mobile = capture only" applies to **phone web `/m`**, not native V2.

---

## DATA / AI ARCHITECTURE SHIFTS

| Topic | Evolution |
|-------|-----------|
| Life Score | Local → API-backed with local fallback |
| Discipline | localStorage → API hydrate (FE migration partial) |
| Notes | CRUD → OCR + Drive watch + FK fix 044 |
| Sports | Research/ESPN → provider registry + dual cricket failover + cron |
| Calendar | Legacy Supabase path → Google sync + Tasks auto-pull |
| AI providers | Multi-provider map with tier caps + dual budgets |
| Linking | Ad-hoc → planned unified `anchor_edges` |
| Intelligence | Insights separate → Reports consolidation |

---

## DEPLOYMENT HISTORY THEMES

| Concern | Pattern |
|---------|---------|
| Frontend | Vercel auto from `main` |
| API | EC2 + deploy script / GitHub Action `deploy-api.yml` |
| Health | `https://api.aiimin.in/api/health` |
| Waitlist gate | `REACT_APP_WAITLIST_MODE` |
| Launch ops | LC-01..LC-14 checklist still open |

---

## SURVIVING ARCH PRINCIPLES

1. Three clients, one backend identity/data plane
2. Dedicated domain routes > generic DB proxy writes
3. Vault as agent OS
4. API-backed truth over demo localStorage
5. Confidence-gated AI; never schema-by-intelligence alone
6. Privacy: journal encryption / RLS / no secrets in vault

---

## ABANDONED ARCH PATHS

| Path | Status |
|------|--------|
| Clerk as identity | Abandoned |
| Fat AGENTS.md as memory | Abandoned |
| Capacitor as primary Android product | Abandoned (legacy only) |
| Capture-only native as final architecture | Rejected |
| Second linking graph beside AnchorEdge | Rejected |
| Client-direct Supabase writes for core entities | Restricted |

---

## OPEN ARCH QUESTIONS

See `13_OPEN_QUESTIONS.md`: Capacitor sunset timing · iOS · UrgeEvent/`anchor_edges` migration · on-device LLM · Clerk fully purged from all docs/code.
