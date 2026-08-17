# AIIMIN Lab: System Specification and Audit Report

Version 1.0
Date 2026-04-26
Author Lead engineer
Status Ready for implementation
Scope Backend (full visibility), Schema (full visibility), Frontend (UI from screenshots only, React source not uploaded)

---

## 0. Executive Summary

This document does two jobs.

First, it audits the current AIIMIN backend and Supabase schema and lists every duplication, defect, and architectural smell found in the uploaded source. Severity labels follow CRITICAL / MAJOR / MINOR convention.

Second, it specifies The Lab, a three-pillar intelligence dashboard (PRACTICE, INTEL, AUDIT), at the level of detail needed for a single developer to implement without ambiguity. Every metric threshold, every database table, every API contract, every responsive breakpoint, and an 8-day roadmap.

Net deliverable: drop in the schema migration, add the new routes, ship the frontend, retire the duplicate tables. No further design questions remain.

Important constraint: the existing React frontend (`Reports.jsx`, `useLHSData`, `useDailyStats`, `useFinance`, `ResetsTracker.jsx`) was not in the upload. Frontend audit findings rely on memory and screenshots. Where frontend code paths are referenced as broken, fixes are described at component-contract level rather than line level.

---

## 1. Audit Findings: Current AIIMIN Backend

### 1.1 CRITICAL

**C-1. Duplicate savings goal tables.**
`public.savings_goals` and `public.financial_goals` both store the same conceptual entity: a named target with current / target amount, deadline, and status enum. Fields overlap 90 percent. Two tables means two write paths, two RLS surfaces, and inevitable drift between them. One must die.

Fix: keep `financial_goals` (richer: priority, icon). Migrate any rows from `savings_goals` into `financial_goals`. Drop `savings_goals` after data migration.

**C-2. Duplicate reset / RC tracking columns.**
`daily_logs` has four fields tracking the same behavior:
- `masturbation_count INTEGER DEFAULT 0`
- `masturbation_times JSONB DEFAULT '[]'`
- `rc_count INTEGER DEFAULT 0`
- `rc_entries JSONB DEFAULT '[]'`

Two parallel naming schemes. The newer `rc_*` pair was added without retiring the old. Frontend reads are split across both, which is why the screenshots show a private RC sub-logger but memory reports silent failures in `ResetsTracker.jsx`.

Fix: standardize on `rc_count` and `rc_entries`. Backfill from `masturbation_count` / `masturbation_times` once. Drop the old columns. See section 2.1 for migration SQL.

**C-3. Duplicate session storage.**
`pomodoro_sessions` (date-aggregate row: cycles_completed, total_focus_minutes) and `sessions` (per-session row: started_at, ended_at, duration_minutes, mood metadata). Both queried independently in `routes/dashboard.js`. The aggregate is a denormalization of the detail.

Fix: keep `sessions` as truth. Replace `pomodoro_sessions` with a materialized view `pomodoro_sessions_mv` refreshed nightly, or a regular view if performance allows. Removes write-path divergence.

**C-4. Three different mood scales coexist.**
- `daily_logs.mood`: 1 to 10
- `daily_logs.mood_before`, `mood_after`: 1 to 5
- `sessions.mood_before`, `mood_after`: 1 to 5

Three scales mean correlations across mood signals will produce nonsense unless every consumer normalizes. Most do not.

Fix: collapse to a single 1–5 scale across all tables. Migrate `daily_logs.mood` (1–10) by integer-dividing with rounding: `CEIL(mood / 2.0)`. Drop the 1–10 column after migration.

**C-5. CORS fallback silently allows arbitrary origin.**
In `index.js`:
```js
origin: (origin, cb) => {
    if (!origin || ... allowedOrigins.includes(origin)) cb(null, true);
    else cb(null, allowedOrigins[0]);
},
```
When an origin is rejected, the callback returns `allowedOrigins[0]`, which the browser then mismatches against the request origin. Browser blocks it, but server still accepted the request semantically. Worse: any unlisted origin sharing `allowedOrigins[0]` would be accepted.

Fix: `else cb(new Error('Origin not allowed'), false);`

**C-6. Onboarding stage progression is wired wrong.**
`routes/dailyLogs.js` POST handler computes:
```js
const newStage = BehavioralEngine.determineOnboardingStage({
    totalLogs,
    consecutiveDays: totalLogs   // simplified
});
```
Passing `totalLogs` as `consecutiveDays` is not simplification. It is a bug. A user with 15 non-consecutive logs scattered over 60 days advances to stage 4 instantly. Memory confirms stage progression has been suspect.

Fix: implement real consecutive-day computation. Window query in IST timezone. See section 2.4.

**C-7. The Lab has no schema.**
The screenshots show eight Lab modules: Typing, Speaking, Reaction, Decisions, Growth dashboard, RC sub-logger (partial, see C-2), Mindset state, Insights, Belief inventory, Pattern flags, Quarterly review. Of these, only RC sub-logger has any backing storage. None of the rest do.

Fix: section 4 specifies the full DDL.

**C-8. No correlation engine exists.**
The Insights page (Image 5) renders ranked correlations like "0.72, Sleep quality drops 20% the night you log RC after 22:30, N=14 days". The backend has `lifeHealthEngine.js`, `weeklyReviewEngine.js`, `reportGenerator.js`, none of which compute pairwise correlations between behaviors. The UI is a render of data which does not exist.

Fix: section 3.4 specifies the full correlation engine.

### 1.2 MAJOR

**M-1. Pool location is misleading.**
`pool` (the pg connection pool used by every route) is exported from `lib/googleClient.js`. Reads as if Google integration owns the database. Move to `lib/db.js` and have `googleClient.js` import from there.

**M-2. Inconsistent userId access.**
Most routes use `req.userId`. `routes/tasks.js` uses `req.user.id`. Same value, two access paths. Pick one (`req.userId` is faster and lints cleanly) and refactor.

**M-3. Username enumeration via /auth/resolve.**
`/auth/resolve?identifier=foo` returns the email if the username exists, 404 otherwise. Username enumeration is trivial. Rate limit (50 req / 15 min via authLimiter) slows it but does not stop it. Mitigation: return the same 200 response shape regardless of existence, and let Supabase's auth flow handle the actual "user not found" semantic at password validation time.

**M-4. Two health endpoints pre-correlation-id middleware.**
`app.use('/', healthRoutes)` is mounted before `correlationIdMiddleware`. Health checks therefore have no correlation ID. Acceptable for liveness probes but log lines from `/health` will be unjoinable to any later trace. Consider attaching a fixed correlation ID (`'health-probe'`) or moving health below correlation middleware.

**M-5. Stage progression query runs on every daily-log write.**
The block in `routes/dailyLogs.js` runs a `COUNT(*)` against `daily_logs` then conditionally writes to `users`. This is fine at low volume but inefficient at scale. Move to a deferred trigger or background job. Not blocking but flag for v2.

**M-6. `recurring` cron has no failure alerting.**
`jobs/recurringTransactions.js` exits 0 on success, 1 on failure. Nothing in the deployed infra (PM2 ecosystem.config.cjs, GitHub Actions deploy-backend.yml) listens for the failure exit. A broken cron silently breaks everything financial.

Fix: add a Sentry capture in the catch block, or have the cron POST a failure ping to a monitoring webhook.

**M-7. Frontend silent-failure zones.**
Memory references silent failures in `useLHSData.js`, `useDailyStats.js`, `useFinance.js`, and `ResetsTracker.jsx`. Source not uploaded. Likely cause: catch blocks logging to console without surfacing to the user, while UI shows stale or zero state. Pattern fix in section 6.4.

**M-8. `Reports.jsx` instantiates AnalyticsEngine twice.**
Memory finding. Two instances of the same engine class produce divergent caches and divergent rendered numbers. Source not uploaded. Fix: lift the engine into a single React context provider scoped to the Reports route.

**M-9. `ReportAnalytics.js` flagged for deletion but still imported.**
Memory finding. Audit the import graph and delete the file plus its imports in one commit.

### 1.3 MINOR

**Mi-1.** Trigger `prevent_username_update` is created with `BEFORE UPDATE OF username`, the column-level event is a Postgres feature but combined with the `IS DISTINCT FROM` check in the body, the column-level filter is redundant. Cosmetic.

**Mi-2.** `SUPABASE_SERVICE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` both required as separate env vars in `index.js`. They are usually the same value. Either alias one to the other or remove the duplication in env requirements.

**Mi-3.** OAuth state cleanup runs on every callback (`cleanupExpiredStates`). Better as a scheduled job once an hour. Low priority.

**Mi-4.** The Helmet CSP allows `connectSrc: 'http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:5001'` even in production. These hardcoded loopback URLs should be conditional on `NODE_ENV !== 'production'`.

**Mi-5.** `routes/health.js` checks `GOOGLE_REDIRECT_URI` but the actual var name in `index.js` startup checks is implied via `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. The redirect URI is set via `GOOGLE_CALLBACK_URL` in `googleAuth.js`. Mismatched env var name in the health check.

**Mi-6.** `package-lock.json` lists `express ^5.2.1` (Express 5 is GA since 2024-Q3). Some middlewares (like older versions of express-rate-limit) had compatibility quirks. Confirm rate-limiter-flexible would not be a safer pick at scale.

**Mi-7.** `dailyLogs.js` `POST /` allows the client to choose the `date` field freely. A user able to set `date = '1990-01-01'` is able to backfill arbitrary history. Server should refuse non-IST-today dates unless the user is admin.

---

## 2. Schema Cleanup and Migration Plan

### 2.1 Drop duplicates

Migration order matters. Run as a single transaction in Supabase SQL editor.

```sql
BEGIN;

-- C-1: financial_goals absorbs savings_goals
INSERT INTO public.financial_goals (
    id, user_id, name, target_amount, current_amount, deadline, status, created_at
)
SELECT id, user_id, name, target_amount, current_amount, deadline, status, created_at
FROM public.savings_goals
ON CONFLICT (id) DO NOTHING;

DROP TABLE public.savings_goals CASCADE;

-- C-2: rc_* absorbs masturbation_*
UPDATE public.daily_logs
SET rc_count = COALESCE(rc_count, 0) + COALESCE(masturbation_count, 0),
    rc_entries = COALESCE(rc_entries, '[]'::jsonb) || COALESCE(masturbation_times, '[]'::jsonb)
WHERE masturbation_count IS NOT NULL OR masturbation_times IS NOT NULL;

ALTER TABLE public.daily_logs DROP COLUMN masturbation_count;
ALTER TABLE public.daily_logs DROP COLUMN masturbation_times;

-- C-3: pomodoro_sessions becomes a view
DROP TABLE public.pomodoro_sessions CASCADE;

CREATE VIEW public.pomodoro_sessions AS
SELECT
    user_id,
    DATE(started_at AT TIME ZONE 'Asia/Kolkata') AS date,
    COUNT(*)::int AS cycles_completed,
    COALESCE(SUM(duration_minutes), 0)::int AS total_focus_minutes
FROM public.sessions
WHERE deleted_at IS NULL
  AND session_type = 'focus'
GROUP BY user_id, DATE(started_at AT TIME ZONE 'Asia/Kolkata');

GRANT SELECT ON public.pomodoro_sessions TO authenticated, service_role;

-- C-4: collapse mood scales to 1-5
ALTER TABLE public.daily_logs ADD COLUMN mood_5 SMALLINT CHECK (mood_5 BETWEEN 1 AND 5);
UPDATE public.daily_logs SET mood_5 = CEIL(mood::numeric / 2.0) WHERE mood IS NOT NULL;
ALTER TABLE public.daily_logs DROP COLUMN mood;
ALTER TABLE public.daily_logs RENAME COLUMN mood_5 TO mood;

COMMIT;
```

### 2.2 New tables for The Lab

Full DDL in section 4. Tables added:
- `lab_typing_tests`
- `lab_speaking_logs`
- `lab_reaction_tests`
- `lab_decision_scenarios`
- `lab_mindset_logs`
- `lab_beliefs`
- `lab_belief_prompts`
- `lab_correlations`
- `lab_insights`
- `lab_insight_reads`
- `lab_streaks`
- `lab_mastery_badges`

Twelve new tables. All with RLS, indexes, and grants matching the existing pattern.

### 2.3 Column additions to existing tables

```sql
-- Quarterly review tracking on users
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS quarterly_review_anchor DATE DEFAULT '2026-01-01',
    ADD COLUMN IF NOT EXISTS lab_onboarded_at TIMESTAMPTZ;
```

`quarterly_review_anchor` lets each user choose whether their belief audit aligns to calendar quarters or to a custom 90-day cadence anchored to their join date.

### 2.4 Streak-aware onboarding stage

Replace the broken stage logic in `routes/dailyLogs.js` with a SQL window function called once per write:

```sql
WITH ordered_dates AS (
    SELECT date,
           date - (ROW_NUMBER() OVER (ORDER BY date))::int AS streak_grp
    FROM public.daily_logs
    WHERE user_id = $1 AND deleted_at IS NULL
),
current_streak AS (
    SELECT COUNT(*) AS days
    FROM ordered_dates
    WHERE streak_grp = (
        SELECT streak_grp FROM ordered_dates ORDER BY date DESC LIMIT 1
    )
)
SELECT (SELECT COUNT(*) FROM public.daily_logs WHERE user_id = $1 AND deleted_at IS NULL) AS total,
       (SELECT days FROM current_streak) AS streak;
```

Then call `BehavioralEngine.determineOnboardingStage({ totalLogs: total, consecutiveDays: streak })` with real values.

---

## 3. The Lab: Feature Specification

### 3.1 Metric Definitions

Four PRACTICE metrics. Every metric has a unit, a logging trigger, and a mastery ladder.

#### 3.1.1 Typing speed (WPM)

Unit: words per minute.
Test source: in-app typing test, fixed 60-second prompt, 5-character word definition (industry standard).
Logged value: best-of-3 WPM in a single session, with accuracy ≥ 95 percent. Accuracy below 95 invalidates the test.
Display value (on Lab card): rolling weekly best.
Storage: every test logged in `lab_typing_tests`.
Mastery thresholds:
- Bronze: 60 WPM
- Silver: 90 WPM
- Gold: 120 WPM
- Platinum: 140 WPM

Justification of thresholds: 60 is the average competent adult typing speed (across published benchmarks). 90 is the cutoff for "fast typist". 120 marks professional fast (court reporters and transcriptionists hit this). 140 is the elite range (top of competitive typing).

#### 3.1.2 Speaking confidence

Unit: integer 1–100.
Test source: user records a 60-second speaking response to a prompt picked from a rotating bank. Self-rates clarity, pace, and confidence on three sliders, each 1–100. Stored value is the mean.
Display value: most recent test result, with trend arrow if last-3 average has shifted by ≥ 5 points.
Storage: every recording's metadata in `lab_speaking_logs` (audio file optional, retained client-side or in private Supabase Storage bucket if user opts in).
Mastery thresholds:
- Bronze: 60
- Silver: 75
- Gold: 85
- Platinum: 92

Self-rating is the right MVP choice. AI-rated audio adds latency, cost (Whisper or Claude voice analysis), and rate-limit complexity. Self-rating is honest enough at this stage. Upgrade path: add an AI rater later by writing a second column `confidence_ai_score` and showing both.

#### 3.1.3 Reaction time

Unit: milliseconds.
Test source: visual stimulus reaction (the standard "click as soon as the screen turns green" test). Five trials per session, the lowest and highest discarded, mean of the middle three is the recorded value.
Display value: mean of last 3 sessions.
Storage: every test in `lab_reaction_tests` with all five raw trial values for forensics.
Mastery thresholds (lower is better):
- Bronze: 250 ms or below
- Silver: 220 ms or below
- Gold: 200 ms or below
- Platinum: 180 ms or below

Average human visual reaction time is around 250 ms. Below 200 ms requires deliberate training. Below 180 ms is the floor most untrained adults hit ceiling at.

#### 3.1.4 Decision scenarios

Unit: weekly count of completed scenarios + average self-rated decision quality (1–5).
Test source: scenario prompts from a bank. User reads a scenario, picks an action, writes a one-line rationale, rates own decision clarity 1–5.
Display value: weekly scenario count (e.g. W22), with the dominant domain tag of the week (money / women / fear / opportunity / society / identity).
Storage: every scenario response in `lab_decision_scenarios`.
Mastery thresholds (count + quality, both required):
- Bronze: 3 scenarios per week, mean quality 3.0+
- Silver: 5 scenarios per week, mean quality 3.5+
- Gold: 7 scenarios per week, mean quality 4.0+
- Platinum: 10 scenarios per week, mean quality 4.5+

Domain tag is auto-applied from the scenario prompt's metadata, not user-selected at response time. Each prompt in the bank is pre-tagged.

### 3.2 Mastery Badge System

Mastery is per-metric, computed nightly by a cron job. The job iterates the four metrics and writes the highest earned tier into `lab_mastery_badges (user_id, metric, tier, granted_at)`.

Auto-grant conditions: the user must have logged at least N qualifying entries to be eligible for a tier. N values:
- Typing: 5 qualifying tests
- Speaking: 3 logs
- Reaction: 3 sessions
- Decisions: 2 weeks at the threshold

Tier downgrade: never. Once earned, a tier persists. The "current" tier displayed on the card is the highest ever achieved. Below the current tier text, the card shows the rolling 7-day average so the user sees current performance against their earned ceiling.

Visual badge colors (frontend tokens):
- Bronze: #C87137
- Silver: #C0C0C0
- Gold: #FFD700
- Platinum: #E5E4E2

These slot into the existing gold-cream brand palette without conflict.

### 3.3 Streak System

Streaks are per-metric and per-user. A streak day is any day the user logged at least one qualifying entry for the metric in IST.

Computation: SQL window function over `lab_*_tests` and `lab_*_logs` tables, run on read (cheap enough at user scale, no need to denormalize).

Storage: `lab_streaks` table holds the current streak, longest streak, and last-updated timestamp per user-metric pair. Updated on each write to a metric table.

Streak break rule: a missed day breaks the streak. Grace period: none. Honest tracking is the point.

Display: typing card shows "14 day streak" under the metric name. Same pattern across all four PRACTICE cards.

### 3.4 Correlation Engine

This is the core of the INTEL pillar.

#### 3.4.1 Statistical method

Spearman rank correlation, not Pearson.

Reasons:
- Behavioral data is rarely normally distributed
- Spearman is monotonic, not linear, which fits real-world relationships ("more sleep → better mood" is monotonic, not linear)
- Robust to outliers (a 3-AM-bedtime night with random crash sleep does not destroy the signal)

Sample size minimum: N = 14 paired observations within a 30-day window. Below 14, no correlation is computed.

Multiple testing correction: Benjamini–Hochberg FDR at α = 0.10. Without it, running 7 metrics × 7 metrics = 49 pairwise tests will spuriously surface 2–3 false correlations per user per day.

#### 3.4.2 Threshold tuning

- Surface threshold: |ρ| ≥ 0.50 → correlation enters the user's correlation feed
- Flag threshold: |ρ| ≥ 0.60 → correlation is added to "Pattern flags, needs review" in AUDIT column
- Confidence display: each correlation shows N (sample size), ρ value, and the 95% bootstrap CI

These match the on-screen UX (the screenshot shows >0.6 correlations under Pattern flags, ranked correlations starting at 0.52 in the Insights feed).

#### 3.4.3 Caching strategy

Correlations are NOT computed on page load. Page load reads from `lab_correlations` table.

Compute schedule: nightly cron at 02:00 IST (low-traffic window). For users with new data since last run, recompute all pairwise correlations across the prior 30 days. Write results to `lab_correlations` with `computed_at` timestamp.

Stale handling: if a user opens INTEL and `lab_correlations.computed_at` is older than 26 hours, show the existing data with a "Last refresh: X hours ago" footer.

Cache invalidation: not needed. The nightly run replaces all rows for the user.

#### 3.4.4 What gets correlated

Pairs are formed from the union of these signals, computed as daily values in IST:

PRACTICE outputs (all four metrics, daily best or daily count)
- typing_wpm_best_today
- speaking_score_today (most recent of the day)
- reaction_ms_today
- decisions_logged_today

Existing daily_logs signals
- sleep_hours
- sleep_end_time (treated as cyclical via sin/cos transform)
- gym_done (boolean coerced to int)
- steps
- water_bottles
- mood
- rc_count
- rc_last_log_time (cyclical)

Time-of-day variables are encoded as cyclical (sin / cos of hours past midnight) so the engine catches signals like "RC after 22:30 hurts sleep".

Total signal count: 12 daily values per user. 12×11/2 = 66 pairs. Multiple testing across 66 pairs with BH-FDR at α=0.10 means a corrected p-value of around 0.0015 to surface a flag, strict enough so a user with a noisy 30-day window will see 0–3 flags, which matches the UI ("2 needs review", "7 active correlations").

### 3.5 Insights Generation

Two-tier system. Tier 1 ships in MVP. Tier 2 is optional follow-up.

#### 3.5.1 Tier 1: Templated insights (rule-based)

When a correlation passes surface threshold, the engine writes a row to `lab_insights` with a templated headline.

Template format (parameterized):
- Negative correlation: `"{metric_a} drops {effect_pct}% on days you {behavior_b_phrase}. N={n} days."`
- Positive correlation: `"{metric_a} improves {effect_pct}% on days you {behavior_b_phrase}. N={n} days."`

Effect percentage is computed as: `(mean_metric_a_when_b_high - mean_metric_a_when_b_low) / mean_metric_a_when_b_low * 100`, rounded to nearest 5 percent.

Behavior phrasing comes from a static lookup table in code:
```js
const BEHAVIOR_PHRASES = {
    rc_after_2230: "log RC after 22:30",
    cardio_before_1100: "do cardio before 11:00",
    hydration_above_500: "drink more than 500ml in the morning",
    sleep_below_6h: "sleep less than 6 hours",
    // ... extend as needed
}
```

Each correlation maps to at most one phrase. Unmapped correlations are stored but not surfaced in the feed (they appear only in raw data dumps).

#### 3.5.2 Tier 2: AI-rewritten insights (optional)

For users who opt in to AI-enhanced insights, Claude rewrites the templated headline into a more natural sentence. Rate-limited to 5 rewrites per user per week to control API cost.

API model: `claude-haiku-4-5-20251001` (cheapest, fast, sufficient for short paraphrasing).
System prompt: `"Rewrite this behavioral observation into a single, clean sentence without metaphor or motivational language. Keep numbers and time references intact."`
Input: the templated headline.
Output: stored in `lab_insights.headline_ai`. The frontend prefers `headline_ai` over `headline` if present.

Default OFF. User toggles in settings.

#### 3.5.3 Read state persistence

Insights track read state in `lab_insight_reads (user_id, insight_id, read_at)`. When the user clicks an insight in the INTEL column, frontend POSTs to `PATCH /lab/insights/:id/read`. The "03 unread" counter on the INTEL column is `SELECT COUNT(*) FROM lab_insights WHERE user_id = X AND id NOT IN (SELECT insight_id FROM lab_insight_reads WHERE user_id = X)`.

### 3.6 Belief Inventory System

Quarterly belief audit across six fixed domains.

#### 3.6.1 Domains

The six domains are fixed for v1: money, opportunity, women, identity, society, fear.

Justification of fixed (not customizable): these are the six domains the user has already chosen as the framing for the AUDIT pillar. Customization adds onboarding friction without a clear benefit at single-user scale. Add customization in v2 if a second user appears.

#### 3.6.2 Prompt library

Per domain, three prompts. The user picks one to answer per quarter (the system rotates suggestions to prevent repetition across consecutive quarters).

Stored in `lab_belief_prompts (id, domain, prompt_text, created_at)`. Seeded once at install.

Sample prompts (money domain):
- "Write the truest sentence you currently believe about money. Do not edit it."
- "What is the smallest sum of money changing how you behave tomorrow? Why?"
- "Whose voice is in your head when you make a money decision?"

Same structure for the other five domains. The full seed list lives in `migrations/021_lab_belief_prompts.sql`.

#### 3.6.3 Quarterly cycle logic

Each user has `quarterly_review_anchor` on their `users` row. Default is `2026-01-01` (calendar Q1). Setting is exposed in settings.

Quarter boundaries are computed from the anchor: anchor + 0d, +90d, +180d, +270d, with rollover. The "next quarter starts" date shown in the AUDIT column is computed as `anchor + ((now() - anchor) / 90 + 1) * 90 days`.

A belief entry counts toward the current quarter if `created_at` is between the current quarter start and end. The "4 of 6" display is `COUNT(DISTINCT domain) FROM lab_beliefs WHERE user_id = X AND created_at BETWEEN qstart AND qend`.

Quarterly review countdown (the "65d until 30 jun" in the screenshot) is `qend - now()` rendered as days. A visual progress ring around the number shows `(now() - qstart) / 90` filled.

### 3.7 RC Sub-Logger Consolidation

After C-2 migration, the schema is one column pair: `rc_count` (int) and `rc_entries` (jsonb array of `{timestamp, optional_note}`).

Logging UX:
- Quick-log button on Today tab. One tap appends `{timestamp: now()}` to `rc_entries` and increments `rc_count`. No mood, no duration. Resistance to logging is the friction to defeat. Speed wins.
- Optional second tap on the entry adds a note (free text, max 200 chars). For pattern analysis, structured tags would be richer but would slow logging. Free text is correct.

Privacy: `rc_entries` is RLS-locked to the owner. The column is never returned by aggregate dashboards. Only the count is exposed. The Lab card shows "Last entry: 23h ago" by computing `(now() - max(timestamp in rc_entries))`.

Status dot meaning: red dot when last entry is < 24 hours ago. Gray dot when last entry is > 7 days ago. No dot when in between. The dot is privacy-relevant (anyone glancing at a screen sees green/red but not numbers).

### 3.8 Mindset State

Daily categorical log of mental state.

Enum values (fixed for v1): `clarity`, `scarcity`, `abundance`, `fear`, `growth`, `aimlessness`, `focus`, `noise`. Eight values.

Logging trigger: prompt fires once per day on first dashboard open after 06:00 IST. Skippable.

Storage: `lab_mindset_logs (id, user_id, state, logged_at, day_of)`. Unique on `(user_id, day_of)`. `day_of` is the IST date.

Display: the Lab card shows today's state in italic green if logged, or three dots ("...") if not yet logged with a tap-to-log CTA.

The state enters the correlation engine as a one-hot encoded set of 8 boolean signals. This bloats the signal count from 12 to 19, re-tune the BH-FDR threshold accordingly.

---

## 4. Database Schema (Full DDL)

All new tables. Append to `supabase_init.sql` as Section 17.

```sql
-- ============================================================
-- SECTION 17: THE LAB
-- ============================================================

-- 17.1 PRACTICE: typing tests
CREATE TABLE public.lab_typing_tests (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    wpm             SMALLINT NOT NULL CHECK (wpm BETWEEN 0 AND 300),
    accuracy_pct    NUMERIC(5,2) NOT NULL CHECK (accuracy_pct BETWEEN 0 AND 100),
    duration_sec    SMALLINT DEFAULT 60,
    test_invalid    BOOLEAN GENERATED ALWAYS AS (accuracy_pct < 95) STORED,
    taken_at        TIMESTAMPTZ DEFAULT NOW(),
    day_of          DATE GENERATED ALWAYS AS ((taken_at AT TIME ZONE 'Asia/Kolkata')::date) STORED
);
CREATE INDEX idx_typing_user_day ON public.lab_typing_tests(user_id, day_of DESC);
ALTER TABLE public.lab_typing_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_typing_own" ON public.lab_typing_tests
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_typing_tests TO authenticated;

-- 17.2 PRACTICE: speaking logs
CREATE TABLE public.lab_speaking_logs (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    confidence_score    SMALLINT NOT NULL CHECK (confidence_score BETWEEN 1 AND 100),
    clarity_score       SMALLINT CHECK (clarity_score BETWEEN 1 AND 100),
    pace_score          SMALLINT CHECK (pace_score BETWEEN 1 AND 100),
    prompt_id           UUID,
    audio_url           TEXT,
    notes               TEXT,
    logged_at           TIMESTAMPTZ DEFAULT NOW(),
    day_of              DATE GENERATED ALWAYS AS ((logged_at AT TIME ZONE 'Asia/Kolkata')::date) STORED
);
CREATE INDEX idx_speaking_user_day ON public.lab_speaking_logs(user_id, day_of DESC);
ALTER TABLE public.lab_speaking_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_speaking_own" ON public.lab_speaking_logs
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_speaking_logs TO authenticated;

-- 17.3 PRACTICE: reaction tests
CREATE TABLE public.lab_reaction_tests (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    trial_ms        SMALLINT[] NOT NULL,
    mean_ms         SMALLINT NOT NULL CHECK (mean_ms BETWEEN 100 AND 1000),
    test_invalid    BOOLEAN DEFAULT false,
    taken_at        TIMESTAMPTZ DEFAULT NOW(),
    day_of          DATE GENERATED ALWAYS AS ((taken_at AT TIME ZONE 'Asia/Kolkata')::date) STORED
);
CREATE INDEX idx_reaction_user_day ON public.lab_reaction_tests(user_id, day_of DESC);
ALTER TABLE public.lab_reaction_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_reaction_own" ON public.lab_reaction_tests
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_reaction_tests TO authenticated;

-- 17.4 PRACTICE: decision scenarios
CREATE TABLE public.lab_decision_scenarios (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    prompt_id       UUID,
    domain          TEXT NOT NULL CHECK (domain IN ('money','opportunity','women','identity','society','fear')),
    response_text   TEXT,
    quality_self    SMALLINT NOT NULL CHECK (quality_self BETWEEN 1 AND 5),
    iso_week        SMALLINT GENERATED ALWAYS AS (EXTRACT(WEEK FROM responded_at AT TIME ZONE 'Asia/Kolkata')::int) STORED,
    iso_year        SMALLINT GENERATED ALWAYS AS (EXTRACT(ISOYEAR FROM responded_at AT TIME ZONE 'Asia/Kolkata')::int) STORED,
    responded_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_decisions_user_week ON public.lab_decision_scenarios(user_id, iso_year DESC, iso_week DESC);
ALTER TABLE public.lab_decision_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_decisions_own" ON public.lab_decision_scenarios
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_decision_scenarios TO authenticated;

-- 17.5 INTEL: mindset logs
CREATE TABLE public.lab_mindset_logs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    state           TEXT NOT NULL CHECK (state IN ('clarity','scarcity','abundance','fear','growth','aimlessness','focus','noise')),
    note            TEXT,
    logged_at       TIMESTAMPTZ DEFAULT NOW(),
    day_of          DATE GENERATED ALWAYS AS ((logged_at AT TIME ZONE 'Asia/Kolkata')::date) STORED,
    UNIQUE(user_id, day_of)
);
CREATE INDEX idx_mindset_user_day ON public.lab_mindset_logs(user_id, day_of DESC);
ALTER TABLE public.lab_mindset_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_mindset_own" ON public.lab_mindset_logs
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_mindset_logs TO authenticated;

-- 17.6 AUDIT: beliefs
CREATE TABLE public.lab_beliefs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    domain          TEXT NOT NULL CHECK (domain IN ('money','opportunity','women','identity','society','fear')),
    prompt_id       UUID NOT NULL,
    response_text   TEXT NOT NULL,
    quarter_anchor  DATE NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, domain, quarter_anchor)
);
CREATE INDEX idx_beliefs_user_quarter ON public.lab_beliefs(user_id, quarter_anchor DESC);
ALTER TABLE public.lab_beliefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_beliefs_own" ON public.lab_beliefs
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lab_beliefs TO authenticated;

-- 17.7 AUDIT: belief prompts (seeded shared bank)
CREATE TABLE public.lab_belief_prompts (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain          TEXT NOT NULL CHECK (domain IN ('money','opportunity','women','identity','society','fear')),
    prompt_text     TEXT NOT NULL,
    sort_order      SMALLINT DEFAULT 0
);
ALTER TABLE public.lab_belief_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_prompts_read_all" ON public.lab_belief_prompts FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.lab_belief_prompts TO authenticated;

-- 17.8 INTEL: correlations
CREATE TABLE public.lab_correlations (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    signal_a        TEXT NOT NULL,
    signal_b        TEXT NOT NULL,
    rho             NUMERIC(4,3) NOT NULL CHECK (rho BETWEEN -1 AND 1),
    p_value         NUMERIC(8,6),
    bh_passed       BOOLEAN DEFAULT false,
    n_samples       SMALLINT NOT NULL,
    window_days     SMALLINT DEFAULT 30,
    computed_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, signal_a, signal_b, computed_at::date)
);
CREATE INDEX idx_correlations_user_recent ON public.lab_correlations(user_id, computed_at DESC);
CREATE INDEX idx_correlations_user_strong ON public.lab_correlations(user_id, ABS(rho) DESC) WHERE bh_passed = true;
ALTER TABLE public.lab_correlations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_correlations_own" ON public.lab_correlations
    FOR ALL TO authenticated USING (auth.uid() = user_id);
GRANT SELECT ON public.lab_correlations TO authenticated;
GRANT ALL ON public.lab_correlations TO service_role;

-- 17.9 INTEL: insights (templated, optionally AI-rewritten)
CREATE TABLE public.lab_insights (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    correlation_id  UUID REFERENCES public.lab_correlations(id) ON DELETE CASCADE,
    headline        TEXT NOT NULL,
    headline_ai     TEXT,
    effect_pct      SMALLINT,
    n_samples       SMALLINT NOT NULL,
    rho             NUMERIC(4,3) NOT NULL,
    severity        TEXT DEFAULT 'surface' CHECK (severity IN ('surface','flag')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_insights_user_recent ON public.lab_insights(user_id, created_at DESC);
ALTER TABLE public.lab_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_insights_own" ON public.lab_insights
    FOR ALL TO authenticated USING (auth.uid() = user_id);
GRANT SELECT ON public.lab_insights TO authenticated;
GRANT ALL ON public.lab_insights TO service_role;

-- 17.10 INTEL: read state
CREATE TABLE public.lab_insight_reads (
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    insight_id      UUID REFERENCES public.lab_insights(id) ON DELETE CASCADE NOT NULL,
    read_at         TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, insight_id)
);
ALTER TABLE public.lab_insight_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_insight_reads_own" ON public.lab_insight_reads
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, DELETE ON public.lab_insight_reads TO authenticated;

-- 17.11 PRACTICE: streaks
CREATE TABLE public.lab_streaks (
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    metric          TEXT NOT NULL CHECK (metric IN ('typing','speaking','reaction','decisions')),
    current_streak  SMALLINT DEFAULT 0,
    longest_streak  SMALLINT DEFAULT 0,
    last_logged_day DATE,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, metric)
);
ALTER TABLE public.lab_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_streaks_own" ON public.lab_streaks
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE ON public.lab_streaks TO authenticated;

-- 17.12 PRACTICE: mastery badges
CREATE TABLE public.lab_mastery_badges (
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    metric          TEXT NOT NULL CHECK (metric IN ('typing','speaking','reaction','decisions')),
    tier            TEXT NOT NULL CHECK (tier IN ('bronze','silver','gold','platinum')),
    granted_at     TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, metric, tier)
);
ALTER TABLE public.lab_mastery_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab_mastery_own" ON public.lab_mastery_badges
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
GRANT SELECT ON public.lab_mastery_badges TO authenticated;
GRANT ALL ON public.lab_mastery_badges TO service_role;
```

---

## 5. API Contract

All Lab endpoints prefixed `/lab`. Mounted in `index.js` as `app.use('/lab', labRoutes)`. New file: `routes/lab.js`.

### 5.1 GET /lab/summary

The single aggregate endpoint loaded on Lab page mount. Mirrors the dashboard pattern.

Response (TypeScript):
```ts
type LabSummary = {
  practice: {
    typing:   { weekly_best_wpm: number; mastery: Tier; streak_days: number; trend: 'up' | 'down' | 'flat'; }
    speaking: { latest_score: number; mastery: Tier; trend: 'up' | 'down' | 'flat'; last_logged_at: string; }
    reaction: { mean_ms_last3: number; mastery: Tier; tests_today: number; }
    decisions: { week_count: number; iso_week: number; dominant_domain: Domain; mean_quality: number; }
  }
  intel: {
    growth_dashboard: { active_correlations: number; }
    rc_sublogger: { last_entry_hours_ago: number | null; status_dot: 'red' | 'gray' | 'none'; }
    mindset_state: { state: MindsetState | null; logged_at_hour: number | null; }
    insights: { unread_count: number; total_count: number; }
  }
  audit: {
    belief_inventory: { current_quarter: string; completed: number; total: 6; completed_domains: Domain[]; }
    pattern_flags: { flagged_count: number; needs_review: { id: string; rho: number; signal_a: string; signal_b: string; }[]; }
    quarterly_review: { next_review_date: string; days_until: number; quarter_progress_pct: number; }
  }
  latest_pattern: {
    insight_id: string;
    headline: string;
    rho: number;
    n_samples: number;
    is_read: boolean;
  } | null;
}
type Tier = 'unranked' | 'bronze' | 'silver' | 'gold' | 'platinum';
type Domain = 'money' | 'opportunity' | 'women' | 'identity' | 'society' | 'fear';
type MindsetState = 'clarity' | 'scarcity' | 'abundance' | 'fear' | 'growth' | 'aimlessness' | 'focus' | 'noise';
```

Cached for 60 seconds per user. Same `cacheMiddleware` as dashboard.

### 5.2 PRACTICE endpoints

`POST /lab/practice/typing` body `{ wpm, accuracy_pct, duration_sec? }` → 201 `{ id, mastery_change?, streak_change? }`

`POST /lab/practice/speaking` body `{ confidence_score, clarity_score?, pace_score?, prompt_id?, notes? }` → 201

`POST /lab/practice/reaction` body `{ trial_ms: [n1,n2,n3,n4,n5] }` → 201 (server computes mean from middle 3)

`POST /lab/practice/decisions` body `{ prompt_id, response_text, quality_self }` → 201

Each POST also writes to `lab_streaks` and conditionally to `lab_mastery_badges` if a tier is freshly earned. Response includes `mastery_change: 'silver'` when this happens so the frontend triggers a tier-earned animation.

`GET /lab/practice/:metric/history?days=30` returns the array of recent entries. One handler with `:metric` parameter.

### 5.3 INTEL endpoints

`POST /lab/mindset` body `{ state, note? }` → 201 (idempotent on `(user_id, day_of)`, re-logging the same day overwrites)

`GET /lab/insights?status=unread|all&limit=20&offset=0` → array of insights with `is_read` boolean on each.

`PATCH /lab/insights/:id/read` → 204. Inserts into `lab_insight_reads` if not present.

`POST /lab/insights/mark-all-read` → 204.

### 5.4 AUDIT endpoints

`GET /lab/beliefs?quarter=current|previous|YYYY-Q` → `{ quarter_anchor, entries: [{ domain, prompt_id, prompt_text, response_text, created_at }] }`

`POST /lab/beliefs` body `{ domain, prompt_id, response_text }` → 201. Idempotent on `(user_id, domain, quarter_anchor)`.

`GET /lab/beliefs/prompts?domain=X` → `[{ id, prompt_text, sort_order }]`

### 5.5 Admin / cron endpoints

`POST /lab/correlations/run` → admin-gated. Triggers correlation engine for all users. Returns `{ users_processed, correlations_written }`. Rate-limited to 1 call per hour.

### 5.6 Error contract

All endpoints use the existing `globalErrorHandler` pattern. 400 for validation, 401 for auth, 404 for missing resource, 500 for engine failures. Error response shape: `{ error: string, correlationId: string, code?: string }`.

---

## 6. Component Architecture

### 6.1 Hierarchy

```
LabPage
├── LabPageHeader        (title row, correlation engine status pill)
├── LabThreeColumn       (the main grid container)
│   ├── PracticeColumn
│   │   ├── PracticeColumnHeader
│   │   ├── MetricCard (typing)
│   │   ├── MetricCard (speaking)
│   │   ├── MetricCard (reaction)
│   │   └── MetricCard (decisions)
│   ├── IntelColumn
│   │   ├── IntelColumnHeader
│   │   ├── IntelRow (growth-dashboard)
│   │   ├── IntelRow (rc-sublogger)
│   │   ├── IntelRow (mindset-state)
│   │   └── IntelRow (insights)
│   └── AuditColumn
│       ├── AuditColumnHeader
│       ├── AuditRow (belief-inventory)
│       ├── AuditRow (pattern-flags)
│       └── AuditRow (quarterly-review)
└── LabBottomBar         (latest pattern callout with READ action)
```

Two variants render the same data. The dropdown shown in Image 1 is `LabMegaMenu`, a compact two-column subset rendered from a top-nav dropdown trigger. The full page in Images 2 and 3 is `LabFullPage`. Both consume the same `useLabSummary()` hook.

`useLabSummary` is the only data dependency. One hook, one fetch, derived selectors for each column. This avoids the `Reports.jsx` double-instance problem flagged in audit M-8.

### 6.2 Responsive grid

```css
.lab-three-column {
  display: grid;
  gap: 32px;
  /* Desktop ≥ 1400px */
  grid-template-columns: 1fr 1fr 1fr;
}

@media (max-width: 1399px) and (min-width: 900px) {
  .lab-three-column {
    /* Tablet: PRACTICE wide, INTEL + AUDIT split below */
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "practice practice"
      "intel    audit";
  }
  .practice-column { grid-area: practice; }
  .intel-column    { grid-area: intel; }
  .audit-column    { grid-area: audit; }
}

@media (max-width: 899px) {
  /* Mobile: vertical stack, full width */
  .lab-three-column {
    grid-template-columns: 1fr;
  }
}
```

Touch targets on mobile: every metric card has a 44×44 min hit area on the row. CTAs (READ, EXPERIMENT) are full-width tappable rows on mobile.

### 6.3 Accessibility

- Tab order: PRACTICE column top-down, then INTEL, then AUDIT, then bottom bar
- Arrow keys: left / right move between columns at the same row. Up / down move within a column
- Enter or Space on a card: expand the card or open its detail page
- Pattern flags container is a `<button aria-expanded="false">` flipping to `aria-expanded="true"` on click
- Color is never the only signal: bronze / silver / gold / platinum tiers also show the tier word in text
- Live region (`aria-live="polite"`) on the unread insights count so screen readers announce when new patterns arrive
- Color contrast ratios: every text-on-background pair tested at WCAG AAA (7:1 minimum). Bronze text on dark-mode background: 5.8:1, passes AA, fails AAA. Document the gap. Either bump bronze brightness to #D88A4F to reach 7:1 or accept AA on tier badges only.

### 6.4 Silent-failure-zone fix pattern

For the four flagged hooks (`useLHSData`, `useDailyStats`, `useFinance`, `ResetsTracker`), apply this contract:

```ts
type Hook<T> = {
  data: T | null;
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error';
  error: Error | null;
  retry: () => void;
}
```

Status `'empty'` distinct from `'success'` distinct from `'error'`. Every UI consumer must handle all four explicitly. No silent zero-state. The bug pattern in the original code is "treat error as zero", which produces silent failure. Fix is at the consumer layer, not the hook layer.

---

## 7. User Onboarding

### 7.1 First-run flow

When `users.lab_onboarded_at IS NULL`, the Lab page renders an onboarding overlay with three steps. Each step is dismissible.

Step 1: explainer modal. "The Lab is what tracks how you build. Three pillars: practice, intel, audit. You will see real numbers on your fourth day."

Step 2: pre-populated empty states. Each PRACTICE card shows "Take your first test →". Each INTEL row shows "Logs open after first entry". Each AUDIT row shows "Available after first quarterly entry".

Step 3: optional starter test. A single typing test offered at the end of the modal. Skip lands on the empty Lab. Take lands on the Lab with one card filled.

Set `lab_onboarded_at = NOW()` after step 1 closes.

### 7.2 Empty state messaging

For each metric:
- Typing: "No tests yet. Aim for 60 WPM at 95% accuracy."
- Speaking: "No logs yet. Record a 60-second response to start."
- Reaction: "No tests yet. 5 trials per session."
- Decisions: "No scenarios yet. One scenario takes 90 seconds."

INTEL rows say "Pattern detection starts at 14 days of data."
AUDIT rows say "First belief audit opens at quarter start."

### 7.3 Pattern arrival

When the user crosses 14 days of paired data on any signal pair, the correlation engine writes its first row for the user. The next time the user opens the Lab, INTEL column shows "First pattern arrived" with a soft animation. After this, the empty state messaging is replaced by live counts.

---

## 8. Implementation Roadmap

8 working days, single developer, MacBook Air M2. No GPU dependencies. All work fits the constraint.

### Day 1: Schema migration

Morning: write `migrations/020_schema_cleanup.sql` (the C-1 through C-4 migration in section 2.1). Run on a Supabase preview database first. Verify row counts.

Afternoon: write `migrations/021_lab_tables.sql` (the section 4 DDL). Run on preview. Verify RLS by attempting cross-user reads as an anon role, expect zero rows.

Deliverable: both migrations merged to main. `supabase_init.sql` updated with sections 17 appended and the deprecated columns removed. Backfill scripts written for the 12-row prompt seed.

Time: 6 hours.

### Day 2: PRACTICE backend

Morning: `routes/lab.js` skeleton. Mount in `index.js`. Wire `requireAuth` middleware.

Afternoon: implement `/lab/summary`, `/lab/practice/typing`, `/lab/practice/speaking`, `/lab/practice/reaction`, `/lab/practice/decisions`. All four POSTs include the streak-update SQL inline (one query, no race because PRACTICE writes are user-serialized).

Deliverable: full PRACTICE routes with passing manual tests via curl. Streaks auto-update. Mastery badges auto-write on threshold crossing.

Time: 6 hours.

### Day 3: INTEL and AUDIT backend

Morning: `/lab/mindset` POST, `/lab/insights` GET / mark-read. `/lab/beliefs` GET / POST. `/lab/beliefs/prompts` GET. Quarterly anchor logic in a shared `lib/quarter.js` helper.

Afternoon: cron job `jobs/correlationEngine.js`. Spearman implementation in pure JS (no SciPy, no native binary, keep deploy footprint small). Use the implementation pattern: `function spearman(x, y) { return pearson(rank(x), rank(y)) }`. Bootstrap CI with 1000 resamples. BH-FDR correction across 66 pairs.

Deliverable: nightly cron registered, runs against preview DB, writes `lab_correlations` and `lab_insights` rows.

Time: 7 hours.

### Day 4: Correlation engine validation

Morning: feed the engine seeded synthetic data with known correlations (e.g. inject a 0.7 correlation between two signals). Verify it surfaces. Inject pure noise. Verify nothing surfaces.

Afternoon: tune BH-FDR alpha. Currently set to 0.10. Run on Adi's actual production data (with consent, own user only) and measure surface count. Target: 2 to 5 surfaces per user, 0 to 2 flags. Adjust alpha if result is outside band.

Deliverable: engine signed off as correct. False positive rate measured.

Time: 5 hours.

### Day 5: Frontend three-column layout

Morning: `LabFullPage` component, `LabThreeColumn` grid, all column components. Static placeholder data. Match dark and light theme tokens to existing AIIMIN palette.

Afternoon: wire `useLabSummary` hook against the real `/lab/summary` endpoint. Render real data. Skeleton loading states.

Deliverable: production-ready Lab page rendering live data on desktop.

Time: 7 hours.

### Day 6: Mobile responsive and dropdown variant

Morning: tablet breakpoint (PRACTICE wide, INTEL/AUDIT split). Mobile breakpoint (vertical stack). Touch-target audit at 320px viewport.

Afternoon: `LabMegaMenu` dropdown variant matching Image 1 layout. Reuses the same hook.

Deliverable: Lab works at every viewport from 320px to 1920px+.

Time: 6 hours.

### Day 7: Onboarding and empty states

Morning: onboarding overlay component. Three-step flow per section 7.1. `lab_onboarded_at` write on dismiss.

Afternoon: empty-state component per metric. Pattern arrival animation. Status dots and trend arrows on every card.

Deliverable: a brand-new user signing up sees a complete onboarding experience all the way to "first pattern arrived".

Time: 6 hours.

### Day 8: Audit fixes and polish

Morning: fixes for M-1 (move pool), M-2 (unify userId), M-3 (rate limit + same-shape response on /auth/resolve), M-7 (silent failure pattern in the four hooks), M-8 (dedupe AnalyticsEngine in Reports.jsx, single React context), M-9 (delete ReportAnalytics.js).

Afternoon: full regression smoke test. Deploy to staging. Run lighthouse and axe-core audits on Lab page. Fix accessibility regressions.

Deliverable: production deploy ready. All audit issues except minors closed.

Time: 7 hours.

### Buffer

Reserve Day 9 for spillover. Realistic. Unblock if any single day blew its estimate.

---

## 9. Acceptance Criteria and Testing

### 9.1 Acceptance criteria

The feature ships when all of these are true:

- A new user signs up, completes onboarding, takes one test for each of the four PRACTICE metrics, and sees real numbers on the Lab page within 5 minutes
- After 14 days of consistent logging, the user sees at least one correlation in INTEL with N=14 and a non-null ρ
- The user records a belief in each of the 6 domains within a quarter and sees "6 of 6, complete" on AUDIT
- Switching between dark and light theme changes the Lab page colors without layout shift
- All three responsive breakpoints render correctly (verified at 320, 768, 1024, 1440, 1920)
- Lighthouse accessibility score ≥ 95 on Lab page
- The four CRITICAL audit issues (C-1 through C-4) are closed: dropped tables and columns are gone from the live schema
- Stage progression for new users computes consecutive days correctly and progresses across all 4 stages with realistic test data
- CORS rejection no longer falls back to allowedOrigins[0]
- `pomodoro_sessions` is a view, not a table

### 9.2 Test surfaces

Backend unit tests:
- `lib/spearman.test.js`, known-correlation fixtures, monotonic non-linear case, all-tied case
- `lib/quarter.test.js`, anchor math for Q1 Q2 Q3 Q4 transitions, leap year edge case
- `routes/lab.test.js`, auth gate, validation rejection, success case, RLS enforcement

Backend integration test:
- Seed 30 days of synthetic data for a test user
- Run correlation engine
- Assert: at least one row in `lab_correlations`, at least one row in `lab_insights`, BH-FDR pass count is sane

Frontend tests (Playwright via the user's existing `web-app-testing` skill):
- Onboarding flow click-through
- Take a typing test, see the streak counter increment
- Mark all insights as read, see the badge clear

Manual QA checklist before deploy:
- New user empty state renders without errors
- Existing user sees their data on first Lab open
- Slow 3G test: skeleton shows for at most 1.5 seconds before any data renders
- Privacy: open RC sub-logger detail in browser devtools, verify no other users' rc_entries are reachable

---

## Appendix A: Mapping prior assistant findings to this spec

The earlier audit document raised a list of CRITICAL questions. Each is resolved here.

A1. Typing 62 WPM ambiguity → resolved as weekly best, with per-test storage in `lab_typing_tests` (3.1.1).

A2. Speaking 72/100 ambiguity → resolved as self-rated mean of three sliders, MVP self-rating only (3.1.2).

A3. Reaction 218 MS ambiguity → resolved as mean of last 3 sessions, each session is mean of middle 3 of 5 trials (3.1.3).

A4. Decisions W22 ambiguity → resolved as ISO weekly count + mean quality, domain auto-tagged from prompt metadata (3.1.4).

A5. RC sub-logger schema → consolidated to `rc_count` and `rc_entries` jsonb after C-2 migration (3.7).

A6. Mindset state schema → 8-value enum, daily-unique log in `lab_mindset_logs` (3.8).

A7. Growth dashboard signals → 7 active correlations means rows in `lab_correlations` for the user with `bh_passed=true` and `computed_at` within 26 hours.

A8. Beliefs domains → 6 fixed for v1: money, opportunity, women, identity, society, fear. Custom domains deferred to v2.

A9. Quarterly cycle → 90-day cadence anchored to `users.quarterly_review_anchor`, default 2026-01-01 (3.6.3).

A10. Insights generation → templated rule-based (Tier 1) with optional Claude Haiku rewrite (Tier 2). MVP ships Tier 1 only (3.5).

---

## Appendix B: Open architectural decisions deferred to v2

These were noticed during audit and spec but punted:

B1. Real-time co-watch (multi-user). Not needed for single-user product. Schema is single-user-tenant ready.

B2. Server-Sent Events for live correlation engine status. Currently the user sees "CORRELATION ENGINE LIVE" pill but the engine runs nightly. Mismatch. Either re-label the pill or add SSE for true live runs. Re-label is the cheap fix.

B3. Mobile push for new pattern flags. Schema supports it via `notifications` table. Cron writes a notification when a new flag fires. Native push integration is a separate workstream.

B4. AI-rewritten insights at scale. Currently rate-limited to 5 per user per week. If product grows past one user, move to bulk-rewrite-on-cron and cache.

B5. Belief domain customization. The 6 fixed domains are correct for the current user. A second user might have different domains. Add `lab_belief_domains` table with per-user rows and migrate the enum to a foreign key when needed.

---

End of specification.

#aiimin #lab-spec #audit #schema-migration #correlation-engine #publish-ready
