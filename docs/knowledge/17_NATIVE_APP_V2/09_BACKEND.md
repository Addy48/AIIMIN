# 09 — Backend Architecture (Native + shared)

> **Depends:** [[01_PRD]] [[08_FEATURES]]  
> **Status:** Complete draft · 2026-07-19  
> **Stance:** Evolve current Node API + Supabase; don’t romanticize rewrite unless forced.

---

## 1. Goals

- One API for web + Android + iOS  
- Entitlements authoritative server-side  
- Sync-friendly mutations (idempotency keys)  
- Observability for mobile clients  
- AI orchestration with cost caps  

---

## 2. Recommended evolution (not greenfield fantasy)

| Layer | Now | Target |
|-------|-----|--------|
| Runtime | Node on EC2 | Keep Node 22 LTS; consider Bun later N/A |
| HTTP | Express/Hono | Hono edge-ready modules + clear versioning `/api/v1` |
| DB | Supabase Postgres | Same; RLS audit; read replicas later |
| Auth | Better Auth | Keep; add passkeys/Apple; device sessions table |
| Cache | Upstash Redis | Rate limit, session, score cache |
| Queue | Cron + ad hoc | Explicit queue (BullMQ/Redis or SQS) for export, AI, sync fanout |
| Objects | Supabase storage | Notes images, exports |
| Realtime | Optional | Supabase Realtime or SSE for score/habit multi-device |
| Observability | Partial | OpenTelemetry + Sentry + structured logs |
| Secrets | Host env | Same; never in APK |

**Avoid:** Firebase-as-database; duplicating business logic only on mobile.

---

## 3. Logical services

```
API Gateway (TLS)
├── Auth Service (Better Auth)
├── Core Domain (habits, goals, journal, notes, logs, finance, …)
├── Score Service
├── Entitlements / Billing (Stripe + Store server verify)
├── Sync Service (cursors, idempotency)
├── AI Orchestrator
├── Notify Service (push provider)
├── Export / Jobs Worker
└── Admin / Waitlist
```

---

## 4. AuthZ

Session cookie/bearer · resource ownership checks · tier gates middleware · device trust signals for sensitive ops.

---

## 5. Realtime

Priority: multi-device habit ticks & score.  
Transport: Supabase Realtime channels per `user_id` or poll with ETag if simpler for v1.

---

## 6. Queues / events

Events: `habit.completed`, `journal.created`, `entitlement.changed`, `export.requested`, `ai.job`.  
Workers: AI, email (Resend), export zip, push fanout.

---

## 7. Caching

Redis: rate limits, life-score short TTL, session secondary.  
Client: Room.  
CDN: static only.

---

## 8. Rate limiting

Per user + per IP · stricter on AI and auth · mobile app id header.

---

## 9. AI orchestration

See [[15_AI_SYSTEM]] — gateway picks model, budgets tokens, logs prompts redacted.

---

## 10. Analytics ingest

Privacy-safe events endpoint or client→PostHog/Sentry with consent.  
Server authoritative for revenue.

---

## 11. Observability

- Structured JSON logs (request id, user id hash, device)  
- Traces across API→DB→AI  
- Metrics: latency p95, queue depth, sync lag  
- Alerts: 5xx, auth spikes, AI cost  

---

## 12. Security / secrets

TLS only · secret rotation · least privilege DB roles · WAF at edge optional.

---

## 13. DR / backups

Supabase PITR · encrypted offsite export weekly test restore (LC-03) · multi-region: warm standby later (India primary).

---

## 14. Mobile-specific API needs

| Need | Design |
|------|--------|
| Idempotent POST | `Idempotency-Key` header |
| Delta sync | `since` cursor + tombstones |
| Batch | `POST /sync/batch` |
| App version gate | `X-App-Version` → min supported |
| Device registry | `POST /devices` |

---

## 15. Anti-patterns

BFF that reimplements all domain only for mobile without sharing · chatty N+1 endpoints without batch · unbounded AI.

---

*Next: [[10_DATABASE]]*
