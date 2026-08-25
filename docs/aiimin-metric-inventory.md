# AIIMIN Metric Inventory and Report Destination Audit

**Verified:** 2026-08-22
**Primary score version:** `lhs-v3.0.0-calibrated`
**Reference dataset version:** `lhs-reference-2026-08-22`
**Scope:** Web report contract, normalized analytics dataset, Life Score inputs, mobile capture destinations, native published-score mapping, and existing report/PDF compatibility behavior.

## Executive finding

The authoritative report dataset currently contains daily records assembled from `daily_logs`, `pomodoro_sessions`, `money_transactions`, `daily_commitments`, `routine_runs`, and `habit_logs`. The report surface now exposes the scored metrics plus raw financial values through a canonical metric index. The inventory deliberately separates **scored signals** from **raw context signals**: money in and money out are visible and traceable, but are not themselves treated as a quality judgment. `breakfast_done`, target/denominator fields, and habit/routine numerators remain explicitly listed as orphaned normalized fields until their display destination is completed or the product owner confirms they are intentionally internal.

## Metric registry

The machine-readable source is [`aiimin-metric-inventory.json`](./aiimin-metric-inventory.json). The table below summarizes the fields that are currently normalized into the report dataset.

| Metric ID | User-facing label | Domain | Source | Unit/type | Score role | Report destination | Missing-data rule |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sleep_hours` | Sleep duration | Physical | `daily_logs.sleep_hours` | Hours/number | Scored | Explore → Core → Pro → Elite | Excluded; never zero-filled |
| `steps` | Steps | Physical | `daily_logs.steps` | Count/number | Scored | Explore → Core → Pro → Elite | Excluded |
| `gym_done` | Training logged | Physical | `daily_logs.gym_done` | Boolean | Scored | Explore → Core → Pro → Elite | `false` is observed; `null` is missing |
| `water_bottles` | Water bottles | Physical | `daily_logs.water_bottles` | Count/number | Scored | Explore → Core → Pro → Elite | Excluded |
| `focus_minutes` | Focused minutes | Cognitive | `pomodoro_sessions.total_focus_minutes` | Minutes/number | Scored | Explore → Core → Pro → Elite | No session row is missing; source aggregate zero is observed zero |
| `focus_cycles` | Focus cycles | Cognitive | `pomodoro_sessions.cycles_completed` | Count/number | Scored | Explore → Core → Pro → Elite | No session row is missing; source aggregate zero is observed zero |
| `learning_done` | Learning logged | Cognitive | `daily_logs.learning_done` | Boolean | Scored | Explore → Core → Pro → Elite | `false` is observed; `null` is missing |
| `habit_completion_pct` | Habit completion | Discipline | `daily_commitments.fulfillment_pct`, fallback `habit_logs.done / total` | Percentage | Scored | Explore → Core → Pro → Elite | Missing when neither denominator exists |
| `routine_adherence_pct` | Routine adherence | Discipline | `routine_runs.completed / started` | Percentage | Scored | Explore → Core → Pro → Elite | Missing when no routine was started |
| `commitment_pct` | Commitment completion | Discipline | `daily_commitments.fulfillment_pct` | Percentage | Scored | Explore → Core → Pro → Elite | Missing without a daily commitment row/value |
| `daily_spend` | Money out | Financial | `money_transactions` expense/transfer-out/lend sum | INR/number | Raw context only | Explore → Core → Pro → Elite | Missing without a transaction aggregate row; true zero remains zero |
| `daily_income` | Money in | Financial | `money_transactions` income/transfer-in/repayment sum | INR/number | Raw context only | Explore → Core → Pro → Elite | Missing without a transaction aggregate row |
| `budget_adherence` | Budget adherence | Financial | Derived from daily spend against fixed 1500 INR target | Percentage | Scored | Explore → Core → Pro → Elite | Missing when spend is missing |
| `savings_rate` | Savings rate | Financial | Derived from income and spend | Ratio | Scored | Explore → Core → Pro → Elite | Missing when required inputs are missing; zero income + positive spend is `-1` |
| `mood` | Mood check-in | Emotional | `daily_logs.mood` | 0–10/number | Scored | Explore → Core → Pro → Elite | Excluded |
| `journal_entry` | Journal entry | Emotional | `daily_logs.journal_entry` and journal presence upstream | Text/presence | Scored as presence | Explore → Core → Pro → Elite | `null` missing; empty text is observed no-entry when the row exists |

## Transformations and destinations

| Metric or family | Input → transformation | Explore | Core | Pro | Elite |
| --- | --- | --- | --- | --- | --- |
| Daily physical/cognitive/emotional values | Source field → normalized daily value | Daily Signal | Weekly comparison | Metric Index, domain balance, findings | Systems, graph, question builder |
| Completion values | `done / total` or configured fulfillment percentage → clamped percentage | Raw daily value | Explicit denominator and comparison | Ranked pattern input | Investigation input |
| Money values | Transaction rows → daily sum by transaction type | Raw daily value | Weekly money context | Metric Index and domain context | Scenario/question input |
| Life Score domains | Scored metric values → mean per domain with missing excluded | Not used as today’s fallback when today is missing | Weekly domain review | System Balance | Situation/Systems |
| Findings | Observed daily series → correlation/comparison with sample and limits | One descriptive observation only | Descriptive comparison only | Ranked finding with method/effect/sample/limits | Selectable investigation context |

## Orphaned production metrics

These fields exist in the normalized analytics layer but are not yet first-class rows in the canonical metric registry or report UI. They are documented rather than silently dropped.

| Metric ID | Source | Current state | Safe destination |
| --- | --- | --- | --- |
| `breakfast_done` | `daily_logs.breakfast_done` | Normalized but not scored, indexed, or displayed | Explore/Core Metric Index after product approval; do not add to composite without a weighting decision |
| `target_cycles` | Derived as `4` when a Pomodoro session row exists | Normalized denominator context but not indexed | Pro metric details as a target/denominator disclosure |
| `burn_target` | Derived fixed `1500` INR when spend exists | Normalized finance denominator but not indexed | Core/Pro finance methodology disclosure |
| `habits_done` | `habit_logs.done` | Normalized numerator behind habit completion | Core exact numerator/denominator disclosure |
| `habits_total` | `habit_logs.total` | Normalized denominator behind habit completion | Core exact numerator/denominator disclosure |
| `routines_started` | `routine_runs.started` | Normalized denominator behind routine adherence | Core exact numerator/denominator disclosure |
| `routines_completed` | `routine_runs.completed` | Normalized numerator behind routine adherence | Core exact numerator/denominator disclosure |

## Phantom or unsupported metrics

The following labels are mentioned in the briefs, product vocabulary, or code search vocabulary but have no normalized source path in the current report dataset. They must not appear as production values until a source and calculation are added.

| Metric/claim | Status |
| --- | --- |
| `deep_sleep` | No normalized source field or calculation found |
| `REM_sleep` | No normalized source field or calculation found |
| `HRV` | No normalized source field or calculation found |
| `screen_time` | No normalized source field or calculation found |
| Social/relationship health | No normalized source field or calculation found |
| Calendar load | No normalized source field or calculation found |
| Goal progress as a report metric | Goals UI/copy exists, but no path into `analyticsData.dailyRecords` or canonical report metrics |

## Data-quality and model rules now enforced

Missing values are represented by `null` in normalized daily records and excluded from score denominators. An observed false boolean, an observed zero aggregate, and an absent record are separate states. Date-derived routine and habit records use the `Asia/Kolkata` boundary. Every normalized day receives `sourceRecordIds`, and every scored day receives score metadata including the calculation version, observed/scored metric IDs, coverage, confidence, uncertainty band, effective sample size, trend, and supporting source records.

The calibrated v3 engine uses a 21-day recency half-life, robust median/MAD personal profiles after seven unique observation days, declared within-domain metric weights, and coverage/stability-adjusted domain weights. Personal-fit scoring contributes only where the metric and profile support it; it is not applied to boolean/presence signals as false precision. The public reference registry constrains conservative defaults and explicitly does not rank a user against a population.

## Remaining inventory closure items

To achieve complete metric completeness, the orphaned fields should either be added to the canonical index with a destination or explicitly marked internal in the data contract. The product owner also needs to decide whether the fixed 1500 INR budget target should be user-configurable before budget adherence becomes a prominent headline. Goal, calendar, screen-time, recovery, and relationship metrics need a source/integration decision before they can be included in Reports.
