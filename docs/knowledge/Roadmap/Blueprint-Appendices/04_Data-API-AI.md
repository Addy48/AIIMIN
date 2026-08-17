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

# Blueprint appendix — Data, API, AI (§9–11)

> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

## 9. Data model — the Life Graph

### 9.1 Principle

P5 IA-1 is already law: **graph over folders**. V1 makes it explicit and queryable. This is not a graph database — it is Postgres with a **typed edge table** plus provenance, which is enough for every product surface described here and keeps operational cost near zero.

### 9.2 Entity classes

| Class | Table(s) | Key |
|-------|----------|-----|
| Person (owner) | `users` | `id` |
| **People** | `people` (new) | `id` |
| Day | `daily_logs`, derived | `(user_id, date)` |
| Habit / HabitLog | `habits`, `habit_logs` | |
| Goal | `goals` | |
| Journal entry | `journal_entries` | |
| Note | `notes` | |
| Event | `calendar_events` | |
| Transaction | `money_transactions` | |
| Lend/Borrow | `money_lent` | |
| Account/Budget/Asset | `accounts`, `budgets`, `wealth_assets` | |
| Document | `family_documents` (+ `documents` view) | |
| Family record | `family_*` | |
| Focus session | `pomodoro_sessions` | |
| Discipline | `discipline_streaks`, `discipline_logs`, `urge_events` | |
| English session | `english_sessions` (new) | |
| English index | `english_index` (new) | |
| Word bank | `english_words` (new) | |
| Health day | `health_days` (new) | `(user_id, date)` |
| Application/Resume | `job_applications`, `resumes` | |
| Report | `reports` | |
| Notification | `notifications` | |
| Consent | `user_consents` (new) | |
| Audit | `data_access_log` (new) | |
| Import batch | `import_batches` (new) | |
| **Edge** | `graph_edges` (new) | |

### 9.3 New tables (V1)

```sql
-- People: contacts as real humans
create table people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  display_name text not null,
  roles text[] not null default '{}',          -- family|friend|colleague|lender|borrower|emergency|professional
  is_self boolean not null default false,
  household boolean not null default false,
  phone_e164 text,                             -- optional display value
  phone_hash text,                             -- sha256(e164 + per-user salt) for matching
  email text,
  photo_object_key text,
  relationship text,                           -- "mother", "roommate" (free text)
  birthday date,
  notes text,
  source text not null default 'manual',       -- manual|device_contacts|google_people|vcard|derived
  external_ref text,                           -- google resourceName (nullable)
  last_interaction_at timestamptz,
  merged_into uuid references people(id),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on people (user_id) where deleted_at is null;
create index on people (user_id, phone_hash);

-- Typed edges = the Life Graph
create table graph_edges (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  src_type text not null,      -- 'transaction'
  src_id text not null,
  dst_type text not null,      -- 'person'
  dst_id text not null,
  edge_type text not null,     -- paid_to|received_from|owes|about|attached_to|practiced_for|
                               -- blocks|derived_from|scheduled_for|mentions|settles|serves_goal
  weight real,
  origin text not null default 'user',   -- user|ai|system
  confidence real,                        -- for ai origin
  created_at timestamptz not null default now(),
  unique (user_id, src_type, src_id, dst_type, dst_id, edge_type)
);
create index on graph_edges (user_id, dst_type, dst_id);
create index on graph_edges (user_id, src_type, src_id);

-- Health daily aggregates (no per-app / no GPS)
create table health_days (
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  steps int,
  distance_m int,
  distance_estimated boolean not null default false,
  active_minutes int,
  sleep_minutes int,
  sleep_start time,
  sleep_end time,
  screen_minutes int,
  screen_top_categories jsonb,   -- only if consented; category level, never per-app by default
  source text,                   -- health_connect|manual|healthkit
  synced_at timestamptz,
  primary key (user_id, date)
);

-- English system
create table english_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  language text not null default 'en',
  mode text not null,             -- spark|deep|debate|shadow|word|accent|meeting|read_aloud|placement
  topic text,
  prompt text,
  duration_seconds int,
  transcript text,                -- nullable when user disables transcript storage
  audio_object_key text,          -- only when cloud replay consented
  wpm real, pause_count int, pause_avg_ms int, filler_count int,
  unique_lemmas int, cefr_band_mix jsonb,
  grammar_errors int, grammar_notes jsonb,
  coherence_score real, register_score real, pronunciation_score real,
  phoneme_flags text[],
  branch_scores jsonb not null,   -- {fluency, vocabulary, grammar, pronunciation, coherence, register}
  ai_feedback jsonb,              -- upgrade words, best-sentence rewrite
  scoring_state text not null default 'complete', -- complete|metrics_only|pending_ai|failed
  linked_application_id uuid,
  created_at timestamptz not null default now()
);

create table english_index (
  user_id uuid primary key references users(id) on delete cascade,
  aei int,                        -- null until 3 sessions
  cefr_band text,
  branch_levels jsonb not null default '{}',   -- 0..10 per branch
  branch_confidence jsonb not null default '{}',
  sessions_count int not null default 0,
  minutes_total int not null default 0,
  goal_mode text not null default 'daily_fluency',
  accent_target text not null default 'neutral',
  last_session_at timestamptz,
  updated_at timestamptz not null default now()
);

create table english_words (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  word text not null,
  lemma text,
  cefr_band text,
  status text not null default 'learning',  -- learning|known|struggling
  times_used int not null default 0,
  first_seen_session uuid,
  next_review_at date,
  unique (user_id, word)
);

-- Consent registry (single source for permissions across surfaces)
create table user_consents (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  scope text not null,        -- contacts|calendar|health|screen_time|sms_money|mic|voice_cloud|
                              -- ai_processing|notifications|camera|analytics|journal_search
  granted boolean not null,
  surface text not null,      -- web|native|system
  purpose_version int not null default 1,
  granted_at timestamptz,
  revoked_at timestamptz,
  device_id text,
  created_at timestamptz not null default now()
);
create index on user_consents (user_id, scope);

-- Data access / automation audit (content-free)
create table data_access_log (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  actor text not null,         -- user|system|ai|integration:google|integration:health
  action text not null,        -- read|write|export|delete|sync|infer
  scope text not null,         -- calendar|contacts|journal|money|health|documents...
  entity_type text, entity_id text,
  surface text,
  detail jsonb,                -- counts and ids only — NEVER content
  created_at timestamptz not null default now()
);
create index on data_access_log (user_id, created_at desc);

-- Import batches (undoable ingest)
create table import_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  kind text not null,        -- statement_csv|statement_pdf|vcard|contacts|drive
  source_name text,
  row_count int, accepted_count int, rejected_count int,
  status text not null,      -- parsing|review|committed|undone|failed
  created_at timestamptz not null default now()
);

-- Daily minimum config + depth history (auditable, cheap)
create table day_minimum (
  user_id uuid primary key references users(id) on delete cascade,
  slots jsonb not null       -- [{type:'habit',ref:null},{type:'log'},{type:'movement',target:3000}]
);
create table depth_days (
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  minimum_met int not null default 0,
  state text not null,
  primary key (user_id, date)
);
```

### 9.4 Migration of existing family members into People

1. Create `people` rows from `family_members` (`roles = {family}`, `household = true`), keeping the original id in `external_ref = 'family_member:<id>'`.
2. Re-point `family_documents.owner_member_id`, `family_health.member_id`, `money_lent.person_*` to `people.id` via a mapping table.
3. Keep `family_members` as a **view** for one release so nothing breaks, then drop.
4. Backfill `graph_edges` for existing links (documents↔person, lends↔person).

Auth/schema changes require explicit Founder instruction (product lock) — this migration is **PLANNED, ADR-gated**.

### 9.5 Provenance and confidence on every AI-touched row

Every table that AI can populate carries: `source` (manual | logger | ai | upi_sms | statement | ocr | integration), `source_utterance` (nullable text), `ai_confidence` (nullable real), `confirmed_by_user` (boolean). This makes P8-R-263 ("person can know automation acted") mechanically true and powers the "why is this here?" affordance.

### 9.6 Row-level security

Every user table: `enable row level security` + policy `user_id = auth.uid()` (or the API's session-derived id when using the service role through the API layer). No table is exposed to clients without RLS. The generic `/api/db/:table` proxy keeps its existing write blocklist and gains a **read allowlist** in V1 (defense in depth).

### 9.7 Soft delete, retention, and purge

| Data | Soft delete window | Hard purge |
|------|--------------------|------------|
| Journal, notes | 30 days recycle bin | immediate on user request |
| Documents + objects | 30 days | purge object + thumbnails + OCR text |
| Transactions | 30 days (or import-batch undo) | on request |
| People | 30 days (merge reversible) | on request |
| English audio | none (deleted after scoring unless saved) | immediate |
| Health aggregates | none | on disconnect if requested |
| Consent/audit rows | retained while account lives (legal defensibility) | on account delete |
| Account delete | tokens revoked immediately, data purge ≤30 days incl. backups | — |

---


## 10. API specification

### 10.1 Conventions

- Base `https://api.aiimin.in/api`
- Auth: session cookie (web) or `Authorization: Bearer` (native), both resolving to one `user_id`
- JSON only; `snake_case` fields; ISO-8601 UTC timestamps; money as integer **paise** in new endpoints (existing decimal endpoints keep their contract until a versioned migration)
- Errors: `{ error: { code, message, retryable, details? } }` with codes `unauthorized`, `forbidden_tier`, `not_found`, `validation`, `conflict`, `rate_limited`, `quota_exhausted`, `upstream_unavailable`, `internal`
- Idempotency: `Idempotency-Key` accepted on all POST mutations (required from mobile)
- Pagination: `?limit=&cursor=`; responses `{ items, next_cursor }`
- Every list endpoint supports `?updated_since=` for delta sync
- Rate limits per existing `rateLimiter.js` families (auth, general, ai, mobile sync, waitlist)

### 10.2 Existing endpoint families (EXISTS — keep contracts)

`/auth/*` · `/google/*` · `/account/*` · `/billing/*` · `/daily-logs/*` · `/journal/*` · `/dashboard/*` · `/habits/*` · `/goals/*` · `/discipline/*` · `/focus/*` · `/calendar/*` · `/notes/*` · `/family/*` · `/wealth/*` · `/lab/*` · `/intelligence/*` · `/sports/*` · `/placements/*` · `/ats/*` · `/waitlist/*` · `/notifications/*` · `/admin/*` · `/cron/*` · `/db/:table` · `/mobile/*` · `/feedback` · `/user/pulse-check` · `/tasks/*`

(Full method/path inventory lives in the repo report and `04_API/`; V1 does not break these.)

### 10.3 New / extended endpoints (V1)

#### People
| Method | Path | Notes |
|--------|------|-------|
| GET | `/people` | `?role=&q=&updated_since=` |
| POST | `/people` | manual create |
| GET | `/people/:id` | includes rollups: `owed_to_you`, `you_owe`, counts per linked domain |
| PATCH/DELETE | `/people/:id` | delete = soft, Veil-gated client-side |
| POST | `/people/import` | body: `{ source, items[] }` — items are **user-selected** contacts only |
| POST | `/people/merge` | `{ keep_id, merge_id }`, reversible 30d |
| POST | `/people/:id/interaction` | manual "logged a call/message" |
| GET | `/people/:id/timeline` | merged linked records, cursor paged |

#### Graph
| Method | Path | Notes |
|--------|------|-------|
| GET | `/graph/edges` | `?src=type:id` or `?dst=type:id` |
| POST | `/graph/edges` | user-created link |
| DELETE | `/graph/edges/:id` | |
| GET | `/graph/context/:type/:id` | one call returning everything linked to an entity (powers person/loan/doc context panes) |

#### Money extensions
| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/wealth/lending` | list/create lend or borrow |
| PATCH | `/wealth/lending/:id` | status, due date |
| POST | `/wealth/lending/:id/repayment` | partial repayment |
| GET | `/wealth/lending/summary` | per-person net positions |
| POST | `/wealth/transactions/batch` | native UPI review commit (idempotent) |
| POST | `/wealth/imports` | create batch, upload reference |
| GET | `/wealth/imports/:id` | parse status + rows for review |
| POST | `/wealth/imports/:id/commit` | commit accepted rows |
| POST | `/wealth/imports/:id/undo` | delete all rows from batch |
| GET | `/wealth/subscriptions` | detected + confirmed |
| GET | `/wealth/bills` | upcoming dues |

#### Health
| Method | Path | Notes |
|--------|------|-------|
| POST | `/health/days` | upsert daily aggregates (native), idempotent by `(date, source)` |
| GET | `/health/days` | `?from=&to=` |
| DELETE | `/health/days` | scoped delete on disconnect |

#### English
| Method | Path | Notes |
|--------|------|-------|
| GET | `/english/index` | AEI, branches, confidence, goal mode |
| PATCH | `/english/index` | goal mode, accent target |
| GET | `/english/prescription` | today's 3 items, generated server-side |
| POST | `/english/sessions` | create session with deterministic metrics (client-computed or server-computed) |
| POST | `/english/sessions/:id/score` | request LLM feedback (consumes AI quota) |
| GET | `/english/sessions` | history, cursor |
| DELETE | `/english/sessions/:id` | |
| GET/POST | `/english/words` | word bank |
| POST | `/english/placement` | submit placement parts → baseline |
| GET | `/english/certificate` | pro: signed PDF |
| DELETE | `/english/all` | delete all English data |

#### Consent, privacy, audit
| Method | Path | Notes |
|--------|------|-------|
| GET | `/privacy/consents` | current state per scope |
| POST | `/privacy/consents` | `{ scope, granted, surface, purpose_version }` |
| GET | `/privacy/dashboard` | per-tier holdings: counts, bytes, last sync, sources |
| GET | `/privacy/activity` | audit log, cursor paged, content-free |
| POST | `/privacy/export` | async full export job → email/download link (supersedes sync export for large accounts) |
| GET | `/privacy/export/:jobId` | status + signed URL |
| POST | `/privacy/scoped-delete` | `{ domain: 'money'|'english'|'health'|'contacts'|'journal'|'documents' }` |
| POST | `/account/wipe-life-data` | EXISTS (`confirm: "WIPE ALL DATA"`) |
| DELETE | `/account` | EXISTS (`confirm: "DELETE"`) |

#### Documents
| Method | Path | Notes |
|--------|------|-------|
| POST | `/documents/upload-url` | short-lived signed PUT; server records intent |
| POST | `/documents` | finalize metadata after upload |
| GET | `/documents/:id/view-url` | ≤5 min single-use signed GET |
| POST | `/documents/:id/ocr` | queue text extraction (for search + receipt→tx) |
| GET | `/documents/expiring` | `?within_days=30` |

#### Sync (native, extended)
| Method | Path | Notes |
|--------|------|-------|
| GET | `/mobile/bootstrap` | EXISTS — extended with `depth`, `open_loops`, `health_today`, `english_prescription`, `sync_cursor` |
| POST | `/mobile/sync/batch` | EXISTS — mutation types extended (§13.3) |
| GET | `/mobile/sync/pull?cursor=` | **new**: incremental server→client deltas |
| POST | `/mobile/devices` | EXISTS — device registration + push token |
| DELETE | `/mobile/devices/:id` | revoke device |

#### Today
| Method | Path | Notes |
|--------|------|-------|
| GET | `/today` | single aggregated payload: depth, minimum, loops, habits, timeline, health, score, insight ref — one round trip for the most-loaded screen |

### 10.4 Versioning and deprecation

New endpoints are unversioned but additive-only. Any breaking change ships as `/api/v2/...` with a 90-day overlap and a vault ADR. Clients send `X-App-Version` (EXISTS on native) so the server can serve compatible payload shapes and force-upgrade below a floor version.

---


## 11. AI system

### 11.1 Roles (P8 Ch07 — exactly five)

| Role | Jobs in V1 |
|------|-----------|
| **Router** | Universal Logger classification; SMS template → domain; voice command intent |
| **Inferencer** | Fill fields (amount, person, category, date, habit) with confidence |
| **Analyzer** | Post-capture enrichment: transaction categorization, journal tags, note link suggestions, English transcript analysis, correlations |
| **Coach** | Weekly insight, micro-task, at-risk goal narrative, money narrative, English feedback and prescription rationale |
| **Composer** | Goal milestones, Life Arc sharpening, report prose, reminder draft text, best-sentence rewrite |

A sixth role requires a Founder ADR.

### 11.2 Orchestration (mandatory order)

```text
1 raw persist (life entity created)            ← ALWAYS FIRST
2 parse intent (Router)
3 identify target entities (+ graph candidates)
4 kill-list / policy check
5 persist inferred structure (with confidence + provenance)
6 emit telemetry (counts only; never content)
7 surface coaching ONLY IF interruptibility window is open
```

### 11.3 Confidence bands (P8 Ch07)

| Band | Behavior | UI |
|------|----------|-----|
| ≥70% | auto-fill and persist | Settled with correction chips available |
| 40–70% | pre-fill, require confirm | Offer stack with "Confirm" |
| <40% | ask one minimal question | Single question, not a form |
| Safety/legal class | **never infer** | Always ask (meds, allergies, PIN-class, legal/tax categorization) |

### 11.4 Provider routing (extends existing `aiService.js` map)

| Task | Chain | Notes |
|------|-------|-------|
| `universal_log` (Router) | Gemini flash-lite → OpenRouter → Groq | latency-critical; ≤1.5s budget |
| `tx_categorize` (Analyzer) | Groq → OpenRouter | batchable; runs on import |
| `journal_analyze` | Groq → OpenRouter | **opt-in per entry** |
| `vocal_scorecard` | Groq → OpenRouter (EXISTS in map) | wire to the real pipeline in V1 (currently manual sliders — PARTIAL) |
| `debate_turn` | Gemini flash → Groq | conversational latency |
| `weekly_insight` (Coach) | Groq 70B → OpenRouter | scheduled, not interactive |
| `report_prose` (Composer) | Groq 70B → OpenRouter | separate monthly pool |
| `arc_sharpen` | Gemini → Groq | short |
| ASR (transcription) | on-device (Android SpeechRecognizer / Web Speech) → server ASR fallback | consent-gated |

Every call is logged to `api_usage_log` with tier-aware quota checks (`apiUsageService.js` EXISTS) and per-provider global ceilings.

### 11.5 Streaming, latency, and fallback

- Interactive tasks stream tokens; the UI shows partial text with a "thinking" **signal** (never labeled Hold, never blocking Catch).
- Hard budgets: Router 1.5s, debate turn 3s, scorecard 8s, insight 30s (background job).
- On timeout: fall to the next provider once, then degrade honestly ("feedback pending — will finish in the background") and enqueue.
- Deterministic fallbacks exist for the important paths: logger without AI still saves raw text; English session still scores on deterministic metrics; transactions still import uncategorized.

### 11.6 Prompt minimization and privacy in prompts

| Task | Sent to provider | Never sent |
|------|------------------|------------|
| `universal_log` | the single utterance + a compact domain schema | history, other entities, names not in the utterance |
| `tx_categorize` | merchant string, amount, date | account numbers, full statement, person identifiers |
| `journal_analyze` | **only the entry the user asked about** | other entries, mood history, identifiers |
| `weekly_insight` | numeric aggregates + habit/goal names | journal text, document contents, contact details, amounts if masking on |
| `vocal_scorecard` | transcript of that session | audio (unless cloud replay consented), other sessions |
| `report_prose` | aggregates and labels | raw journal, raw transactions |

Rules: no user identifiers (email, OS-ID, phone) in prompts — a per-request opaque id only · no PIN/document numbers ever · **journal-class content never enters analytics or insight prompts** (P8-R-219) · zero-retention/no-training terms required from providers (contract obligation; recorded in `07_DEPLOYMENT`).

### 11.7 Memory

Durable "memory" is the **life graph itself** — not a chat transcript silo (P8 Ch07 prohibition). Coach reads facts from entities; there is no hidden profile the user cannot inspect. Anything the AI "remembers" must be visible as a record the user can edit or delete.

### 11.8 Trust UX for AI

Every AI-produced element shows: what it is, **where it came from** ("from your text", "from 12 transactions"), confidence when <70%, and Accept / Adjust / Dismiss. Insights link to source records (`R-06` provenance drawer). AI never changes auth, billing, tier, permissions, or deletes anything (P8-R-230/256/261). Automation failure is stated, never hidden (P8-R-265).

### 11.9 AI off mode

A single Personalization toggle disables all outbound AI calls. In that mode: logger saves raw text with a manual domain picker; transactions import uncategorized; English scores on deterministic metrics; insights are rule-based summaries clearly labeled "computed, not written by AI". No feature becomes invisible — each states what it would add.

### 11.10 Abuse and safety

Prompt-injection defense: user content is never treated as instructions (system prompts pinned; content wrapped and escaped; tool use restricted to a fixed allowlist). No tool can write outside the requesting user's rows. Output filters block clinical/diagnostic framing, self-harm advice (replaced with a resource message and a human handoff line), and financial/legal directives (reframed as "consider" + "verify with a professional"). Rate/abuse: per-user caps, per-IP caps, and a global provider circuit breaker.

---

