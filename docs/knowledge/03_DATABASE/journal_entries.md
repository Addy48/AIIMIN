# journal_entries

## Purpose

One journal entry per user, per date, **per mode**.

## Key columns (product-facing)

`date`, `encrypted_content`, `mood` (1–5), `energy_level` (1–5), `sleep_hours`, `mode`

There is **no `title` column**. A route inserted one between 2026-07-19 and
2026-08-03 and every journal write returned
`42703 column "title" of relation "journal_entries" does not exist` for that
whole window — the newest surviving row before the fix is dated 2026-07-16.
Do not re-add `title` to a write without a migration that creates it.

## Uniqueness contract (changed 2026-08-03)

```
UNIQUE (user_id, date, mode)     -- migration 049
```

It was previously `UNIQUE (user_id, date)`, which allowed only one entry per
day while the app models one entry per day *per mode*
(`write · free_write · cbt · www · morning · weekly`). Saving a Free Write and
then a CBT Record on the same day raised a duplicate-key 500.

## `mode` — the rule every writer must follow

`mode` is derived from the v2 JSON envelope inside `encrypted_content`:

```json
{ "v": 2, "mode": "free_write", "body": "…" }
```

Rows written before the v2 envelope are plain text and are backfilled to
`'legacy'`. The column is `NOT NULL DEFAULT 'legacy'`.

**Every write path must derive and supply `mode`.** Relying on the default
classifies the row as `legacy` regardless of its real envelope, and two entries
for the same date then collide on the unique index. Use the one shared helper:

```js
import { deriveJournalMode } from '../lib/journalMode.js';
```

Current writers: `server/routes/journal.js` (POST/PATCH) and
`server/routes/mobile.js` (`journal.upsert` in the sync batch).

## Relationships

- Belongs to authenticated user, FK → `public.users(id)` ON DELETE CASCADE
- Feeds the journal streak, Life Score `emotional`, and the weekly review

## Migration history

- Table predates the numbered migrations; created out-of-band
- **049** — adds `mode`, backfills 167 rows from the envelope, swaps
  `UNIQUE (user_id, date)` → `UNIQUE (user_id, date, mode)`

## Related

- [[09_FEATURES/Journal/Journal]]
- [[03_DATABASE/Index]]
- [[02_ARCHITECTURE/Database]]
