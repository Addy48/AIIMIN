---
authority: engineering
derived_from: server/lib/auth.js · server/routes/db.js · server/services/lifeHealthEngine.js
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-GUIDE
tags:
  - type/guide
  - status/living
---

# How it works

> Every claim here was checked against the code on 2026-08-03, with the file and line noted.
> If a statement here and the code disagree, **the code is right and this note is a bug**.

## 1 · Signing in

**Better Auth**, not Clerk. Clerk was removed — `grep -ril clerk frontend/src server api`
returns **0 matches**. Any note that says otherwise is archived and wrong.

Two ways in, both in `server/lib/auth.js`:

- **OS-ID + PIN** — your 8-character identifier and a PIN only you type. (`emailAndPassword`
  provider, line 70 — the OS-ID is carried through that mechanism.)
- **Google** — OAuth, callback at `/api/auth/callback/google` (line 101–104).

Sessions are an httpOnly cookie. Every later API call carries it. Detail:
[[02_ARCHITECTURE/Authentication]] · [[09_FEATURES/Auth/Auth]]

## 2 · Why other people can't see your data

Two independent layers. Either alone would mostly work; together they're the reason this is
safe to run publicly.

### Layer 1 — the API scopes every query itself

`server/routes/db.js` keeps a set called `USER_SCOPED_TABLES` with **62 tables**. For any
query against one of them it appends the filter *server-side*, from your session:

```js
if (USER_SCOPED_TABLES.has(table)) {
    params.push(userId);
    where.push(`user_id = $${params.length}`);
}
```

The `userId` comes from the resolved session — **never from the request body**. A second set,
`SELF_ID_TABLES`, does the same with `id = $n` for rows that *are* the user. On top of that
there are explicit ownership checks — `verifyRoutineOwnership` (line 52) and
`verifyHabitOwnership` (line 60) — for the cases where a child row's parent must be proven
yours.

### Layer 2 — the database enforces it again

Row Level Security, in `server/migrations/`: `026_enable_rls_foundation`,
`027_rls_typing_email_logs`, **`032_rls_better_auth_lockdown`**, `035_rls_api_waitlist_feedback`,
`045_p0_auth_db_security_hardening` — **11 `CREATE POLICY` statements** in total.

> [!warning] Honest gap
> 11 policies do not cover 62 scoped tables. Layer 1 is doing most of the work today, and
> Layer 2 is partial. That is not a live vulnerability — nothing reaches Postgres except
> through the scoped API — but it does mean the "two independent layers" promise is currently
> one-and-a-half. **Any new table needs both**: an entry in `USER_SCOPED_TABLES` *and* an RLS
> policy, in the same migration.

### The rule that follows

Better Auth sessions do **not** populate Supabase RLS context. So every client — web, `/m`,
and the native app — reads and writes through `/api/*` with the session cookie. Never direct
PostgREST. `frontend/src/utils/supabase.js` looks like a Supabase client but is a **shim** that
proxies to `/api/db`.

## 3 · How the Life Score is calculated

Five dimensions. This is decided and locked — [[10_DECISIONS/2026-08-03-life-score-taxonomy]].

| Key | You see | Built from | Weight |
|-----|---------|-----------|--------|
| `physical` | **BODY** | sleep 0.4 · activity 0.4 · nutrition-water 0.2 | **0.25** |
| `cognitive` | **MIND** | focus 0.7 · learning 0.3 | **0.20** |
| `discipline` | **DISCIPLINE** | habits 0.5 · routine 0.3 · focus 0.2 | **0.25** |
| `financial` | **MONEY** | budget adherence 0.7 · savings rate 0.3 | **0.15** |
| `emotional` | **MOOD** | mood stability 0.5 · journal consistency 0.5 | **0.15** |

Weights sum to 1.00. Everything clamps 0–100. Source: `server/services/lifeHealthEngine.js`.

Sub-metrics are plain arithmetic — e.g. sleep scores best at 7.5 h and loses 20 points per
hour away from it; activity is 70% "did you gym" plus 30% steps toward 10 000.

**Computed on the server, always.** Clients read `GET /intelligence/lhs` and render it. No
client recomputes. That rule exists because when they did, the same day showed 47, 49 and 54
on different surfaces.

Feeds: `/intelligence/report`, `services/reportGenerator.js`, `services/weeklyReviewEngine.js`,
and `frontend/src/hooks/useLHSData.js`.

## 4 · How AI is used, and what it costs

`server/lib/aiChat.js` is already a multi-provider router — `liteChat()`, `heavyChat()`,
`nvidiaOrGroqChat()`, with model pools and keys for **Groq · Gemini · OpenRouter · NVIDIA NIM ·
Kimi**. Don't replace it; route through it.

The important discipline: **a lot of "AI" here is not AI.** Correlations are Spearman with
Benjamini–Hochberg correction. Life Score, streaks, XP, budgets, runway, savings rate are
arithmetic. English-practice metrics (words per minute, filler count, vocabulary diversity)
are plain JavaScript. Only genuinely generative work should reach a model.

Detail: [[02_ARCHITECTURE/AI-Pipeline]] · [[06_AI/Overview]] ·
[[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §6

## See also

[[Guides/Start-Here]] · [[Guides/Decisions-And-Why]] · [[Guides/Whats-Broken-Right-Now]]
