# Seed Demo History

Standalone scripts fill **one** live OS account with ~180 days of correlated demo data (money, habits, focus, calendar, goals, journal, family, career, lab, discipline, XP).

> Throwaway demo account only — default OS-ID **AADI0837**. Seed is fully removable anytime. Do not seed production users.

## Preferred script

`scripts/seed-realistic-life.mjs`

```bash
# Plan only (no writes)
node scripts/seed-realistic-life.mjs

# Wipe previous seed for that user, then insert fresh demo life
node scripts/seed-realistic-life.mjs --confirm

# Remove ALL demo life-data for that one user (keep login / OS-ID)
node scripts/seed-realistic-life.mjs --wipe-only --confirm
```

Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Optional `SEED_DAYS=180`, `SEED_END=YYYY-MM-DD`, `SEED_USERNAME=AADI0837`.

### Scope (important)

| Action | Affects | Does not touch |
|--------|---------|----------------|
| `--confirm` seed | Only allowlisted OS-ID (`SEED_USERNAME`, default **AADI0837**) | Other accounts, auth tables |
| `--wipe-only --confirm` | That user's life-data domains only (every `DELETE` is `.eq('user_id', …)`) | User row, sessions/auth, **all other users** |

**Hard allowlist:** script refuses any username not in `SEED_ALLOWLIST` (default `AADI0837`). You cannot accidentally wipe another account by setting `SEED_USERNAME` alone.

`--wipe-only` uses **full** wipe (all rows for that user in seeded domains). Re-seed before wipe uses marker/date filters then inserts again.

### Markers (for forensic / partial wipe)

- `source_type='admin_simulated'`
- money `source='seed'`
- habits / goals `meta.seed`
- journal encrypted payload `"seed":true`

## Legacy script

`scripts/seed-demo-history.mjs` — older; many rows used `Seed …` labels. Prefer realistic script.

## Why habits heatmap looked empty (fixed 2026-07-17)

Habits **Yearly Habit Heatmap** used to read **localStorage only**. Seed wrote `habit_logs` in Postgres — finance worked, heatmap did not.

**Fix:**
- `GET /api/habits` merges `habit_logs` → `meta.completedDates` (Asia/Kolkata)
- `YearlyHabitMatrix.jsx` loads from API
- Focus week-stats = `pomodoro_sessions` view over `sessions` (`session_type=focus`)

## FK retarget (2026-07-17)

Legacy `REFERENCES auth.users` retargeted to `public.users` so journal / family / career / study / wealth seed for Better Auth users.

## Lab insert gotchas

- Do **not** insert generated cols: `day_of`, typing `test_invalid`, decision `iso_week` / `iso_year`
- `lab_streaks.metric` ∈ `typing|speaking|reaction|decisions`
- Belief/decision `domain` ∈ `money|opportunity|women|identity|society|fear`
- Decision `quality_self` 1–5

## Lab / Focus / Discipline empty UI (fixed 2026-07-18)

Seed wrote Postgres rows; pages stayed empty:

| Page | Bug | Fix |
|------|-----|-----|
| Lab | Direct Supabase + RLS `auth.uid()` (Better Auth → null) | `GET /api/lab/summary`, `/typing`, `/reading` |
| Focus | localStorage only (`aiimin_focus_*`) | `GET /api/focus/week-stats`; POST writes `sessions` |
| Discipline | localStorage streak/log | `GET /api/discipline/streak` + urges/logs; seed `discipline_streaks` |

Restart local API after route changes: `node dev_server.js`.

## Related

- [[03_DATABASE/daily_logs]]
- [[03_DATABASE/users]]
- [[15_MEMORY/Current-Context]]
- [[09_FEATURES/Discipline/Discipline]]
