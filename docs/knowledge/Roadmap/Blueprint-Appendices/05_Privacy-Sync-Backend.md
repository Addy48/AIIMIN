---
authority: product
derived_from: Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-APPENDIX
tags:
  - type/appendix
  - domain/product
  - status/living
---

# Blueprint appendix — Privacy, sync, backend (§12–14)

> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

## 12. Privacy and trust architecture (highest priority chapter)

### 12.1 Tiered Privacy Architecture (TPA)

Every field in the product is classified at design time. A feature cannot ship without its tier recorded.

| Tier | Contents | Default handling | Encryption | In prompts? | In analytics? |
|------|----------|------------------|------------|-------------|---------------|
| **T0 Public** | Waitlist email, marketing metrics | Consent for non-essential analytics | TLS + at rest | no | aggregate only |
| **T1 Account** | Auth, OS-ID, tier, sessions, devices | Required for service | TLS + at rest; PIN hashed | no | counts only |
| **T2 Life OS** | Habits, goals, tasks, calendar meta, transactions, budgets, reports | Cloud sync; export; wipe | TLS + at rest (RLS) | aggregates only | aggregates only |
| **T3 Sensitive** | Contacts, UPI-derived, voice, health, screen time | **On-device first**, opt-in cloud, revocable | TLS + at rest; raw never stored | minimal, purpose-bound | never raw |
| **T4 Ultra** | Journal body, vault documents, family IDs/health, PIN | Strictest: no analytics, no telemetry, column/object encryption; **E2E roadmap** | at rest + column/object level | only on explicit user request, per item | **never** |

### 12.2 Per-domain option matrix and V1 choice

| Domain | Options | **V1 default** | Rationale |
|--------|---------|----------------|-----------|
| UPI money | (a) on-device parse, upload structured (b) server parse, discard raw (c) manual/statement only | **(a)**, with (c) always available | Raw SMS never leaves the device; trust and Play compliance |
| Contacts | (a) device picker, store name+hash (b) Google People minimal (c) manual | **(a)** + (c); (b) optional on web | No bulk upload; no growth mining |
| Voice/English | (a) audio local, sync scores+transcript (b) encrypted cloud replay (c) cloud ASR delete-after | **(a)**; (b) opt-in Pro; (c) only if no on-device ASR and consented | Audio is the most intimate signal |
| Health | (a) daily aggregates (b) full records | **(a)** | Aggregates satisfy every product surface described |
| Screen time | (a) daily total server, detail local (b) full upload | **(a)** | Per-app usage is highly revealing |
| Journal | (a) at-rest encryption + excluded from analytics (b) E2E with device keys | **(a)** in V1; **(b)** roadmap with key recovery | E2E without recovery UX loses user data |
| Documents | (a) server-side encrypted objects, signed URLs (b) client-side encryption | **(a)** in V1; (b) with vault E2E | Viewer/OCR requires server access in V1 |
| AI | (a) no training + prompt minimization (b) AI off | **(a)** with (b) toggle | — |
| Analytics | (a) consent-gated GA4/Sentry with scrubbing (b) none | **(a)** — consent first, off until granted | Launch blocker in Home is satisfied honestly |

### 12.3 Consent architecture

- **Registry:** `user_consents` (§9.3) is the single source; both web and native read/write it. A scope with no granted row is treated as denied, everywhere.
- **Purpose versioning:** if the purpose text changes materially, `purpose_version` increments and the user is re-asked in context (not with a blocking modal).
- **Revocation:** immediate effect; the client stops collecting, the server stops accepting that scope's writes, and the user is offered scoped deletion of what was collected.
- **OS vs product consent:** an OS permission is necessary but not sufficient — the product-level consent row must also exist. Revoking in product does not require revoking in the OS (and vice versa the UI explains both).
- **No dark patterns:** equal visual weight for allow/deny; deny is never a dead end; no repeated prompting (max once per 30 days, in context).

### 12.4 Privacy dashboard (`G-04`) — user-facing

```text
What AIIMIN holds                                    Export ⤓   Delete ⌫
──────────────────────────────────────────────────────────────────────
Account            email, OS-ID, plan                         required
Life OS            1,284 records · 2.4 MB       [Export] [Wipe life data]
People             12 people · from your picks   [Delete imported]
Money              847 transactions · 3 lends   [Delete money data]
  UPI reading      ON · 0 raw messages stored   [Turn off]
Health             daily totals since 12 Jun    [Disconnect] [Delete]
Screen time        daily totals only            [Turn off]
English            41 sessions · audio: on device [Delete English data]
Documents          9 files · 14 MB · encrypted  [Open vault]
Journal            excluded from analytics       [Exclude from search]
AI                 ON · 6 of 25 calls today     [Turn AI off]
Connections        Google Calendar, Drive        [Manage]
Devices            Pixel 8 (2h ago), Mac (now)   [Revoke]
Activity log       last 30 days, content-free    [View]
```

Every row answers: what, how much, where it lives, and how to stop it. Numbers come from `/privacy/dashboard` and must be real (no estimates presented as facts).

### 12.5 Activity log

`data_access_log` records actor/action/scope/entity-id/counts — **never content**. Surfaced as: "Calendar synced · 14 events · 09:02 · Pixel 8", "Weekly insight generated · used 12 aggregates · 06:00", "Export downloaded · Mac · 21:14". Retained while the account exists; included in export; purged on delete.

### 12.6 Encryption plan

| Layer | V1 | Roadmap |
|-------|-----|---------|
| Transit | TLS 1.2+ everywhere; HSTS; certificate pinning on native for `api.aiimin.in` | — |
| At rest (DB) | Managed encryption + column encryption for OAuth tokens (EXISTS), document numbers, health notes | — |
| At rest (objects) | Server-side encryption, per-object keys, private buckets, signed short-lived URLs | client-side encryption for vault |
| Journal | at-rest + analytics exclusion; `encrypted_content` column already used on the native path | **E2E** with device keypair + recovery kit (24-word phrase or platform keystore + printable recovery code); explicit warning that lost keys = lost data; search becomes local-only for E2E content |
| Secrets | host env / secret manager only; never in vault or git | rotation schedule |

**Claim discipline:** until E2E ships, the product says "encrypted in transit and at rest" — never "end-to-end", never "we can't read it" (which would be false).

### 12.7 Website ↔ app trust unity

| Requirement | Implementation |
|-------------|----------------|
| One policy | `/privacy` defines Services = website + web app + `/m` + native + API; one document, per-surface sections for permissions |
| One account, one control panel | Account → Privacy is the master; native mirrors the toggles it can affect and deep-links the rest |
| Store disclosure parity | Play **Data safety** form generated from the same source table as `/privacy` (a checklist in `07_DEPLOYMENT`), reviewed on every release that changes scopes |
| Scope separation | Google **login** OAuth ≠ Calendar OAuth ≠ People OAuth — three separate consent moments (login already separate — EXISTS) |
| Marketing vs product | Waitlist analytics are consent-gated and never joined to product identity; no cross-site tracking; no third-party pixels on product routes (Privacy.jsx already claims none — keep it true) |
| Identical delete/export | Same API, same result, regardless of surface (SYS-06) |
| Session honesty | Devices list shows every active session with revoke |

### 12.8 Compliance targets

| Framework | V1 obligations |
|-----------|----------------|
| **India DPDP** | Notice + purpose limitation, verifiable consent, data-principal rights (access, correction, erasure, grievance), **grievance officer contact published**, breach notification process, retention limits |
| **Google API Services User Data Policy (Limited Use)** | Already asserted in Privacy.jsx — re-audit for Calendar write + People scopes; no ads, no human reading, no model training on Google user data |
| **Play Store** | Data safety form; SMS/Call-Log policy justification (money reading is a **core feature** declaration with in-app disclosure before the permission); Health Connect declared use; sensitive permission review |
| **GDPR-ready** | Lawful basis table, DPA with subprocessors, export/erasure, records of processing |
| **Children** | Age gate (13/16/18 decision open — see §22); product is not directed at children |

### 12.9 Threat model (abbreviated)

| Threat | Mitigation |
|--------|------------|
| Stolen device | PIN + biometric, vault auto-relock, remote session revoke |
| Session theft | Short-lived cookie cache, secure/httpOnly/SameSite, device binding on native, revoke-all |
| IDOR | RLS + server-side `user_id` derivation only (never client-supplied), automated tests per endpoint |
| SQL injection | Parameterized queries only; the generic `/db/:table` proxy validated against allowlists |
| Prompt injection | §11.10 |
| Malicious upload | Type/size validation, no execution, image/PDF sanitization, virus scan hook, never serve from a user-controlled path |
| Signed-URL leakage | ≤5 min, single-use, no directory listing |
| Rate abuse / cost attack | Per-user and per-IP limits, AI quotas, provider circuit breaker, cost alarms |
| Insider access | Least privilege, no production data in dev, access logged; support access requires user-initiated request |
| Backup exposure | Encrypted backups, restore drill documented, purge propagation ≤30 days |
| Open SSH (current) | **Fix in V1:** restrict port 22 to a known IP/SSM Session Manager (see §14.7) |

### 12.10 Do-not list (privacy)

Never sell/share lifelog · never train models on user data · never upload raw SMS or full contact books · never claim E2E without recovery · never differ delete behavior by surface · never enable analytics before consent · never put journal content or document numbers in notifications, logs, or prompts for analytics · never request Location or Call Log in V1 · never use contacts for invites/growth.

---


## 13. Synchronization and offline architecture

### 13.1 Model choice

**Per-entity last-write-wins with field-level merge for a named set, plus explicit conflict UI for calendar and documents.** CRDTs are rejected for V1: the entity set is mostly append-only or single-owner, and CRDT complexity would not pay for itself. This is a deliberate, documented trade-off (native doc 12 lists the options).

| Entity | Strategy |
|--------|----------|
| Habit tick | Idempotent set operation on `(habit_id, date)` — conflict impossible |
| Daily log | Field-level merge (last writer per field) |
| Journal / Note | Body is single-owner; if both sides changed since base → **keep both** (creates a `(conflict copy)` with a banner) — never destroy text |
| Transaction / Lend | Last-write-wins on scalar fields; repayments are append-only |
| Calendar event | Compare-and-set on `etag`; on divergence → `ConflictResolver` |
| Document metadata | LWW; the **file object is immutable** (new version = new object) |
| English session | Append-only |
| Health day | Idempotent upsert by `(date, source)` |
| Settings/consents | LWW with server timestamp authority |

### 13.2 Client architecture

| Client | Local store | Queue | Trigger |
|--------|-------------|-------|---------|
| Web (desktop/tablet) | In-memory + IndexedDB cache for reads; **optimistic UI** | outbox in IndexedDB | on action, on reconnect, on focus |
| `/m` phone web | IndexedDB log queue (EXISTS) | same | reconnect |
| Native | Room (EXISTS) | mutation outbox + WorkManager (EXISTS) | on action, periodic 15m, on connectivity, on app open |

### 13.3 Mutation types (extend `/mobile/sync/batch`)

EXISTS: `habit.tick`, `journal.upsert`, `note.upsert`.
V1 adds: `dailylog.upsert`, `transaction.create`, `transaction.update`, `lend.create`, `lend.repayment`, `focus.session`, `discipline.log`, `urge.event`, `english.session`, `health.day`, `document.meta`, `person.create`, `person.interaction`, `loop.resolve`, `consent.set`, `event.upsert`, `event.delete`.

Envelope:
```json
{ "mutations": [ { "id": "uuid-v4 client", "type": "lend.create",
                   "payload": { }, "client_mutated_at": "2026-07-30T15:04:05Z",
                   "base_version": 3 } ] }
```
Response per item: `{ id, ok, server_id?, version?, error?, conflict? }`. Batch max **50**; client chunks larger queues. `Idempotency-Key` guarantees replay safety (`mobile_idempotency`, 48h TTL — EXISTS).

### 13.4 Pull path

`GET /mobile/sync/pull?cursor=` returns `{ changes: [{type, id, op, data, version}], next_cursor, server_time }`. Cursor is an opaque monotonic marker (updated_at + id). Full re-bootstrap if the cursor is older than the retention window (30 days) or after a schema epoch bump.

### 13.5 Honest offline semantics (P9 law)

| Situation | UI |
|-----------|-----|
| Write while offline | **Settled locally + Hold badge**; Sync pill shows "3 held" |
| Read while offline | Cached values with "as of HH:MM" |
| AI while offline | Disabled with reason ("needs connection"), never a spinner that never ends |
| Sync succeeds | Hold → Settled, count decrements, single light haptic |
| Sync partially fails | Per-item error listed in the Sync tray with retry; the rest settle |
| Conflict | Explicit resolver; nothing silently overwritten |
| Repeated failure | After 3 attempts, a persistent (non-modal) banner + Open Loop |

Never: claim remote Settle while offline (forbidden state pair) · silent data loss · a spinner as the only offline indication.

### 13.6 Cross-device continuity guarantees

| Guarantee | Mechanism |
|-----------|-----------|
| Log on phone appears on desktop within one cycle | push-triggered pull or 15-min periodic + on-focus |
| Tier change on web reflects on phone at next bootstrap | entitlement in bootstrap payload |
| Depth/score identical on both | server-computed only (SYS-05) |
| Unsettled Pulse survives a crash | Drift restore card on next open |
| Two devices editing the same note | keep-both with banner |
| Clock skew | server time authoritative for ordering and day boundary |

---


## 14. Backend and cloud architecture (efficient, not cheapest)

### 14.1 Current state

Node (Hono) on a **single EC2** instance behind `api.aiimin.in`, Supabase Postgres, Vercel frontend, Upstash Redis, Vercel Blob + two empty S3 buckets, GitHub Actions deploys, PM2 process management. Known risks: root disk 97% full, SSH open to `0.0.0.0/0`, no CloudWatch alarms/SNS, single point of failure, no autoscaling.

### 14.2 Target V1 topology (optimized for reliability, latency, and future AI load)

```text
                         Route 53 (aiimin.in, api.aiimin.in)
                                     │
        ┌────────────────────────────┴───────────────────────────┐
        ▼                                                        ▼
   Vercel (web app, edge CDN)                        CloudFront (API + assets)
   - static + SSR-less SPA                                  │  WAF (rate, geo, bot)
   - preview per PR                                         ▼
                                              ALB (ap-south-1, 2 AZ, TLS 1.2+)
                                                            │
                                          ┌─────────────────┴─────────────────┐
                                          ▼                                   ▼
                             ECS Fargate service "api"            ECS Fargate service "worker"
                             (2 tasks min, autoscale 2→8)         (queue consumers, 1→4)
                                          │                                   │
                                          ├── Secrets Manager / SSM Params    │
                                          ├── ElastiCache or Upstash Redis ───┤ (cache, rate, locks)
                                          ├── SQS: ai-jobs, sync-fanout, ─────┤
                                          │        imports, notifications      │
                                          ├── S3: aiimin-vault (docs, KMS SSE) │
                                          │   S3: aiimin-exports (lifecycle 7d)│
                                          │   S3: aiimin-uploads (staging 1d)  │
                                          └── Supabase Postgres (primary)      │
                                                    │ read replica (reports)   │
                          EventBridge Scheduler → SQS → worker (cron jobs)     │
                          CloudWatch logs/metrics/alarms → SNS → email/Slack ──┘
```

### 14.3 Why each service (explicit justification)

| Service | Chosen because | Alternative rejected because |
|---------|----------------|------------------------------|
| **ECS Fargate** (not EC2, not Lambda) | No host patching, per-task isolation, rolling deploys, autoscale on CPU/requests; keeps the existing long-lived Node/Hono app unchanged; predictable latency (no cold starts) for the Router path | **EC2**: current single-instance risk, manual patching, disk-full incidents. **Lambda**: cold starts hurt the 1.5s Router budget; long AI streaming and PDF generation fit poorly; per-request pricing is worse at steady traffic |
| **ALB + 2 AZ** | Health checks, zero-downtime deploys, TLS termination, WebSocket-capable if needed later | Single instance = single point of failure |
| **CloudFront + WAF** | Global TLS termination close to user, DDoS/bot/rate protection ahead of compute, cheap caching for public GETs (sports feed, waitlist count) | Direct-to-ALB exposes origin, no edge caching |
| **SQS + worker service** | Moves AI scoring, imports, OCR, PDF generation, notification fan-out, and weekly insight generation off the request path; retries with DLQ; smooths provider rate limits | In-process background work dies with the container and cannot retry safely |
| **EventBridge Scheduler** | Replaces cron-on-a-box (`deploy/cron.sh`); no missed jobs when an instance recycles; per-job IAM | Crontab on EC2 is invisible and unmonitored |
| **S3 + KMS** | Durable object storage for vault documents, resumes, exports; lifecycle rules; signed short-lived URLs; separate buckets per sensitivity | Vercel Blob is fine for small resumes but weaker for KMS/lifecycle/vault-grade control (keep Blob only for legacy resume paths during migration) |
| **Supabase Postgres + read replica** | Keeps existing schema, RLS, and migrations; replica isolates heavy report/correlation queries from interactive traffic | Self-managed RDS adds ops burden with no product gain today |
| **Redis** (Upstash now, ElastiCache when in-VPC latency matters) | Rate limiting (already in use), hot caches (bootstrap, sports, tier), distributed locks for cron and single-active-focus-session | DB-only rate limiting adds write load to Postgres |
| **Secrets Manager / SSM** | Rotation, audit, no secrets in env files on a box | `.env` on EC2 is unauditable |
| **CloudWatch + SNS** | Alarms on API 5xx, p95 latency, queue age, DLQ depth, AI spend, DB connections, disk/task health — closes the current gap | No alarms = silent outages (present state) |
| **ap-south-1 (Mumbai)** | India-first users: lowest latency; aligns with the DPDP data-locality narrative; keep Supabase in the same region | Cross-region hops add 100–200ms per call |

### 14.4 Cost-efficiency (efficient use, not cheap-out)

- Fargate **ARM (Graviton)** tasks: ~20% better price/performance for Node.
- Right-size tasks (0.5 vCPU / 1 GB) and scale on request count, not CPU alone.
- Cache aggressively where the data is not personal: sports feed, waitlist count, provider metadata (CloudFront + Redis).
- The `/today` aggregate endpoint removes 6–8 round trips on the most-loaded screen (bandwidth + latency + cost win).
- Deterministic-first AI: fluency/vocab metrics, categorization heuristics, and correlations run **without** LLM calls; the LLM is used where it adds judgment. This is the single biggest AI cost lever.
- Provider ladder (lite → heavy) plus per-tier daily caps and global provider ceilings (EXISTS) prevent runaway spend.
- Batch AI work in the worker (categorize 200 rows in one call, not 200 calls).
- S3 lifecycle: exports expire in 7 days; upload staging in 1 day; vault objects Standard-IA after 90 days.
- Log retention 30 days hot, then compressed to S3 (Athena for rare queries).
- No idle GPU, no vector DB in V1 (search is Postgres full-text + trigram; add pgvector only when a real semantic-search feature is specified).

### 14.5 Migration path (no big-bang)

| Phase | Action | Risk control |
|-------|--------|--------------|
| 0 | Fix the current fire: expand/clean EC2 disk, lock SSH to SSM/known IP, add CloudWatch alarms + SNS | Immediate, no architecture change |
| 1 | Containerize the API (Dockerfile), push to ECR via existing GitHub Actions | Same code, verified locally |
| 2 | Stand up ALB + Fargate in parallel; run both; shift `api.aiimin.in` DNS with a low TTL; keep EC2 warm for rollback | Instant rollback by DNS |
| 3 | Introduce SQS + worker; move weekly insight, report PDFs, imports, OCR, notification fan-out off the request path | Feature-flagged per job |
| 4 | EventBridge replaces `cron.sh`; delete crontab | Verify each job's last-run metric |
| 5 | CloudFront + WAF in front | Monitor cache-hit and 4xx |
| 6 | Move vault objects to S3 + KMS; dual-read during migration | Checksums verified before cutover |
| 7 | Add read replica; point reports/correlations at it | Compare query plans |
| 8 | Decommission EC2 | After 2 weeks clean |

### 14.6 Environments

| Env | Purpose | Data |
|-----|---------|------|
| `local` | Dev | seeded synthetic only |
| `preview` (Vercel per PR + Fargate dev service) | Review | synthetic |
| `staging` | Release candidate, E2E, load smoke | synthetic + a small anonymized set |
| `production` | Live | real |

**Never** copy production data into non-production. Seed scripts generate realistic synthetic accounts (the existing `/seed-data` becomes a dev-only tool).

### 14.7 Security hardening checklist (V1 exit criteria)

SSH via SSM only (port 22 closed) · WAF managed rules + rate limits · least-privilege task roles (no wildcard S3) · KMS CMK for vault bucket · Secrets Manager with rotation for DB/AI keys · TLS 1.2+ and HSTS · certificate pinning on native · dependency scanning (Dependabot) + `npm audit` gate in CI · container image scanning in ECR · quarterly restore drill from backup · signed release APK with Play App Signing · IDOR test suite green on every endpoint.

### 14.8 Reliability targets

| Metric | Target |
|--------|--------|
| API availability | 99.5% monthly (single-region, 2 AZ) |
| p95 latency (`/today`, bootstrap) | < 400 ms in-region |
| p95 latency (Router AI) | < 1.5 s |
| Sync batch success | > 99.5% (excluding client offline) |
| RPO / RTO | 24 h / 4 h (documented, drill-verified) |
| Error budget policy | If 5xx > 0.5% for 1 h, feature work pauses until fixed |

---

