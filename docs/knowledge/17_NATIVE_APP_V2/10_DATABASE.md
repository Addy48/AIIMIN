# 10 — Database Design (Native sync extensions)

> **Depends:** [[09_BACKEND]] · existing Supabase schema (evolve, don’t fantasize greenfield)  
> **Status:** Complete draft · 2026-07-19  
> **Constraint:** No production migration until founder explicitly asks. This is the design.

---

## 1. Principles

- User-scoped rows · soft delete + tombstones for sync · updated_at timestamptz · UUID PKs  
- Indexes on `(user_id, updated_at)` for delta pulls  
- Enums in Postgres or check constraints  
- Audit for auth/billing/security events  

---

## 2. Existing domains (keep)

Users/sessions (Better Auth) · daily_logs · habits · habit_completions · goals · journal_entries · notes · finance_* · calendar_events · discipline_* · focus_sessions · gamification · waitlist · sports caches · life score inputs  

Exact table names follow current vault `03_DATABASE/*` — extend, don’t rename casually.

---

## 3. New / extended tables (proposed)

### `devices`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| platform | enum(android,ios,web) | |
| push_token | text null | encrypted at rest if possible |
| app_version | text | |
| last_seen_at | timestamptz | |
| trust_level | enum | |
| created_at | timestamptz | |

### `sync_cursors`

user_id · device_id · stream · cursor · updated_at  

### `mutation_idempotency`

user_id · key · response_hash · created_at · unique(user_id, key)

### `entitlements`

user_id · tier · source(stripe|play|appstore|comp) · valid_until · raw_receipt_meta jsonb · updated_at  

### `note_type` extension

notes.type enum: `note|cheatsheet|flashdeck` (+ metadata jsonb)

### `practice_packs` / `practice_questions` / `practice_attempts` (optional module)

Only if Lab bank isn’t reusable — else FK to existing lab content.

### `security_events`

user_id · type · ip_hash · device_id · meta · created_at  

### `audit_log`

actor · action · entity · entity_id · before/after jsonb · created_at  

---

## 4. Relationships (high level)

```
users 1—* habits 1—* completions
users 1—* goals
users 1—* journal_entries
users 1—* notes
users 1—* devices
users 1—1 entitlements
users 1—* security_events
```

---

## 5. Indexes

- `habit_completions(user_id, date)`  
- `notes(user_id, updated_at desc)`  
- `journal_entries(user_id, updated_at desc)`  
- `devices(user_id)`  
- GIN on notes FTS if search server-side  

---

## 6. Soft delete

`deleted_at` null = live · sync returns tombstones until cursor advances past retention (e.g. 30d hard purge job).

---

## 7. RLS / policies

Supabase RLS: user_id = auth.uid() for all user data.  
Service role for workers only.  
Never expose service key to mobile.

---

## 8. Embeddings (AI)

`embeddings` table: owner_id · object_type · object_id · vector · model · updated_at  
Used for note/journal retrieval — see [[15_AI_SYSTEM]].

---

## 9. Versioning

Schema migrations numbered · Room schemaVersion aligned · expand/contract pattern.

---

## 10. Search

Postgres FTS for notes v1 · typesense/meilisearch later if scale.

---

*Next: [[11_AUTHENTICATION]]*
