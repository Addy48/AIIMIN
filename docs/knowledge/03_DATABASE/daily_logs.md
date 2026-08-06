# daily_logs

## Purpose

Primary daily metrics row per user per date.

## Key columns (product-facing)

sleep_start, sleep_end, sleep_hours, gym_done, gym_duration, breakfast_done, steps, water_bottles, mood, energy_level, learning_done, learning_topic, journal_entry, brain_fog, headache, rc_count, rc_entries

Note: `protein_grams` may exist historically; UI uses `water_bottles`. Do not re-add protein to mobile.

## Relationships

- Belongs to authenticated user
- Feeds streaks, XP, heatmaps, goals

## Migration history

- Evolved across early schema + gamification alters; see server migrations and archived AGENTS notes

## Demo seed

Bulk history can be inserted via [[16_DOCUMENTATION/Seed-Demo-History]] (`source_type = 'seed'`). Unique on `(user_id, date)`.

## Related

- [[09_FEATURES/DailyLog/DailyLog]]
- [[02_ARCHITECTURE/Database]]
- [[16_DOCUMENTATION/Seed-Demo-History]]
