/**
 * routes/mobile.js — Native app bootstrap + sync for same-user OS with web.
 * Mounted at /api/mobile/*
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { mobileHealthLimiter, mobileSyncLimiter } from '../middleware/rateLimiter.js';
import { deriveJournalMode } from '../lib/journalMode.js';
import { loadIdempotency, rememberIdempotency } from '../lib/mobileIdempotency.js';
import { randomUUID } from 'crypto';
import { getAnalyticsDataset } from '../services/analyticsData.js';
import { summarizeLifeHealth } from '../services/lifeHealthEngine.js';

const app = new Hono();

app.use('*', async (c, next) => {
  const path = c.req.path;
  if (path === '/health' || path.endsWith('/health')) {
    return mobileHealthLimiter(c, next);
  }
  return mobileSyncLimiter(c, next);
});

function mapJournalRow(row) {
  return {
    id: row.id,
    date: row.date,
    content: row.encrypted_content ?? row.content ?? '',
    mood: row.mood,
    created_at: row.created_at,
  };
}

function mapNoteRow(row) {
  return {
    id: row.id,
    title: row.title ?? '',
    content: row.body_text ?? row.content ?? '',
    color: row.color ?? row.meta?.color ?? '#2D2D2D',
    pinned: row.pinned === true || row.meta?.pinned === true,
    labels: row.labels ?? null,
    checklist: row.checklist ?? null,
    meta: row.meta ?? null,
    updated_at: row.updated_at,
    created_at: row.created_at,
  };
}

/** GET /api/mobile/bootstrap — one shot for Home + strips */
app.get('/bootstrap', requireAuth, async (c) => {
  const userId = c.get('userId');
  const user = c.get('user');
  try {
    const [habits, journal, notes, agenda, score, goals] = await Promise.all([
      pool.query(
        `SELECT id, name, emoji, category, frequency, status, meta, created_at
         FROM habits WHERE user_id = $1 AND COALESCE(status, 'active') = 'active'
         ORDER BY created_at ASC LIMIT 50`,
        [userId],
      ),
      pool.query(
        `SELECT id, date, encrypted_content, mood, created_at
         FROM journal_entries WHERE user_id = $1
         ORDER BY date DESC NULLS LAST, created_at DESC LIMIT 20`,
        [userId],
      ),
      pool.query(
        `SELECT id, title, body_text, content, meta, updated_at, created_at
         FROM notes WHERE user_id = $1
         ORDER BY updated_at DESC NULLS LAST, created_at DESC LIMIT 40`,
        [userId],
      ).catch(() => ({ rows: [] })),
      pool.query(
        `SELECT id, title, start_time AS start_at, end_time AS end_at, all_day, event_type
         FROM calendar_events
         WHERE user_id = $1
           AND deleted_at IS NULL
           AND start_time >= NOW() - INTERVAL '1 day'
         ORDER BY start_time ASC LIMIT 10`,
        [userId],
      ).catch(() => ({ rows: [] })),
      // Published Life Score — same engine as /intelligence/lhs (14d window, bootstrap-thin).
      getAnalyticsDataset(userId, 14)
        .then((ds) => ({ rows: [{ payload: summarizeLifeHealth(ds.dailyRecords) }] }))
        .catch(() => ({ rows: [] })),
      pool.query(
        `SELECT id, metric, target, frequency, meta, start_date, created_at
         FROM goals WHERE user_id = $1 AND deleted_at IS NULL
         ORDER BY created_at DESC LIMIT 30`,
        [userId],
      ).catch(() => ({ rows: [] })),
    ]);

    const habitIds = habits.rows.map((h) => h.id);
    let todayDone = [];
    if (habitIds.length) {
      const { rows: logs } = await pool.query(
        `SELECT habit_id
         FROM habit_logs
         WHERE user_id = $1 AND habit_id = ANY($2::uuid[])
           AND (completed_at AT TIME ZONE 'Asia/Kolkata')::date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date
           AND COALESCE(status, 'done') IN ('done', 'completed')`,
        [userId, habitIds],
      );
      todayDone = logs.map((l) => l.habit_id);
    }

    const familyDocs = await pool.query(
      `SELECT d.id, d.doc_type, d.doc_number, d.notes, d.expiry_date, d.created_at,
              m.name AS member_name, m.relation AS member_relation
       FROM family_documents d
       LEFT JOIN family_members m ON m.id = d.member_id AND m.user_id = d.user_id
       WHERE d.user_id = $1
       ORDER BY d.created_at DESC LIMIT 30`,
      [userId],
    ).catch(async () => {
      const r = await pool.query(
        `SELECT id, doc_type, doc_number, notes, expiry_date, created_at
         FROM family_documents WHERE user_id = $1
         ORDER BY created_at DESC LIMIT 30`,
        [userId],
      ).catch(() => ({ rows: [] }));
      return r;
    });

    const resumes = await pool.query(
      `SELECT id, title, target_role, link_url, created_at
       FROM resumes WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 20`,
      [userId],
    ).catch(() => ({ rows: [] }));

    let driveStatus = null;
    try {
      const { rows: watches } = await pool.query(
        `SELECT id, folder_id, folder_name, enabled, updated_at
         FROM note_drive_watches WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
        [userId],
      );
      driveStatus = { watches, connected: watches.length > 0 };
    } catch {
      driveStatus = { watches: [], connected: false };
    }

    return c.json({
      user: {
        id: userId,
        email: user?.email,
        name: user?.name || user?.full_name || null,
        username: user?.username || null,
      },
      habits: habits.rows,
      habitCompletedToday: todayDone,
      journal: journal.rows.map(mapJournalRow),
      notes: notes.rows.map(mapNoteRow),
      goals: goals.rows,
      agenda: agenda.rows,
      lifeScore: score.rows[0]?.payload || null,
      familyDocuments: familyDocs.rows,
      resumes: resumes.rows,
      drive: driveStatus,
      serverTime: new Date().toISOString(),
      syncCursor: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[mobile/bootstrap]', err);
    return c.json({ error: err.message }, 500);
  }
});

/** POST /api/mobile/devices — register install */
app.post('/devices', requireAuth, async (c) => {
  const userId = c.get('userId');
  try {
    const body = await c.req.json();
    const platform = body.platform || 'android';
    const appVersion = body.app_version || '0';
    const pushToken = body.push_token || null;
    const deviceId = body.device_id || randomUUID();

    await pool.query(
      `INSERT INTO mobile_devices (id, user_id, platform, app_version, push_token, last_seen_at, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET
         app_version = EXCLUDED.app_version,
         push_token = COALESCE(EXCLUDED.push_token, mobile_devices.push_token),
         last_seen_at = NOW()`,
      [deviceId, userId, platform, appVersion, pushToken],
    ).catch(async (err) => {
      if (String(err.message).includes('mobile_devices')) {
        return;
      }
      throw err;
    });

    return c.json({ ok: true, device_id: deviceId });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/**
 * POST /api/mobile/sync/batch
 * Body: { mutations: [{ id, type, payload, client_mutated_at }] }
 * Header: Idempotency-Key optional per request; also per mutation id
 */
app.post('/sync/batch', requireAuth, async (c) => {
  const userId = c.get('userId');
  const idemKey = c.req.header('Idempotency-Key');
  try {
    const cached = await loadIdempotency(userId, idemKey);
    if (cached) return c.json(cached);

    const { mutations = [] } = await c.req.json();
    const results = [];

    for (const m of mutations.slice(0, 50)) {
      const type = m.type;
      const payload = m.payload || {};
      try {
        if (type === 'habit.tick') {
          const habitId = payload.habit_id;
          if (!habitId) throw new Error('habit_id required');
          const { rows: owned } = await pool.query(
            'SELECT id FROM habits WHERE id = $1 AND user_id = $2',
            [habitId, userId],
          );
          if (!owned.length) throw new Error('Habit not found');
          await pool.query(
            // 'completed' violates habit_logs_status_check ('done' | 'skipped').
            `INSERT INTO habit_logs (user_id, habit_id, completed_at, status, notes)
             VALUES ($1, $2, COALESCE($3::timestamptz, NOW()), 'done', NULL)`,
            [userId, habitId, payload.completed_at || null],
          );
          results.push({ id: m.id, ok: true });
        } else if (type === 'habit.untick') {
          const habitId = payload.habit_id;
          if (!habitId) throw new Error('habit_id required');
          const { rows: owned } = await pool.query(
            'SELECT id FROM habits WHERE id = $1 AND user_id = $2',
            [habitId, userId],
          );
          if (!owned.length) throw new Error('Habit not found');
          // Undo today's done tick — no schema change; delete matching logs.
          await pool.query(
            `DELETE FROM habit_logs
              WHERE user_id = $1
                AND habit_id = $2
                AND status = 'done'
                AND (completed_at AT TIME ZONE 'UTC')::date =
                    COALESCE(($3::timestamptz AT TIME ZONE 'UTC')::date, (NOW() AT TIME ZONE 'UTC')::date)`,
            [userId, habitId, payload.completed_at || null],
          );
          results.push({ id: m.id, ok: true });
        } else if (type === 'journal.upsert') {
          // A metadata-only mutation must not invent content. Defaulting
          // `content` to '' and `date` to today used to blank the entry,
          // reclassify a v2 envelope as 'legacy', and move an older entry to
          // today. Distinguish "omitted" from "sent".
          const hasContent = payload.content !== undefined && payload.content !== null;

          if (!hasContent) {
            if (!payload.id) throw new Error('journal.upsert needs content or an id');
            const upd = await pool.query(
              `UPDATE journal_entries
                  SET mood = COALESCE($3, mood),
                      date = COALESCE($4::date, date)
                WHERE id = $1 AND user_id = $2
                RETURNING id`,
              [payload.id, userId, payload.mood ?? null, payload.date || null],
            );
            // Zero rows means the id is unknown or belongs to someone else —
            // reporting ok:true there would silently drop the client's edit.
            if (!upd.rows.length) throw new Error('Journal entry not found');
            results.push({ id: m.id, ok: true, entity_id: upd.rows[0].id });
          } else {
            const content = String(payload.content);
            const date = payload.date || new Date().toISOString().slice(0, 10);
            // Conflict on the real identity of an entry — (user_id, date, mode)
            // per migration 049. `payload.id` is optional, so a client that
            // re-sends the same entry without one would generate a fresh UUID
            // and collide on that index instead of updating.
            const up = await pool.query(
              `INSERT INTO journal_entries (id, user_id, date, encrypted_content, mood, mode, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, NOW())
               ON CONFLICT (user_id, date, mode) DO UPDATE SET
                 encrypted_content = EXCLUDED.encrypted_content,
                 mood = COALESCE(EXCLUDED.mood, journal_entries.mood)
               RETURNING id`,
              [payload.id || randomUUID(), userId, date, content,
               payload.mood ?? null, deriveJournalMode(content)],
            );
            results.push({ id: m.id, ok: true, entity_id: up.rows[0].id });
          }
        } else if (type === 'note.upsert') {
          const id = payload.id || randomUUID();
          const title = payload.title || '';
          const content = String(payload.content || '').slice(0, 50000);
          const color = payload.color || '#2D2D2D';
          await pool.query(
            `INSERT INTO notes (id, user_id, source_type, title, body_text, content, status, meta, created_at, updated_at)
             VALUES ($1, $2, 'mobile', $3, $4, $4, 'ready',
                     jsonb_build_object('color', $5::text, 'pinned', false), NOW(), NOW())
             ON CONFLICT (id) DO UPDATE SET
               title = EXCLUDED.title,
               body_text = EXCLUDED.body_text,
               content = EXCLUDED.content,
               meta = COALESCE(notes.meta, '{}'::jsonb) || jsonb_build_object('color', $5::text),
               updated_at = NOW()
             WHERE notes.user_id = $2`,
            [id, userId, title, content, color],
          ).catch(async () => {
            await pool.query(
              `INSERT INTO notes (user_id, title, content, body_text, source_type, status, meta)
               VALUES ($1, $2, $3, $3, 'mobile', 'ready', jsonb_build_object('color', $4::text))`,
              [userId, title, content, color],
            );
          });
          results.push({ id: m.id, ok: true, entity_id: id });
        } else if (type === 'note.delete') {
          const id = payload.id;
          if (!id) throw new Error('note.delete needs id');
          await pool.query(
            `DELETE FROM notes WHERE id = $1 AND user_id = $2`,
            [id, userId],
          );
          results.push({ id: m.id, ok: true, entity_id: id });
        } else {
          results.push({ id: m.id, ok: false, error: `unknown type ${type}` });
        }
      } catch (err) {
        results.push({ id: m.id, ok: false, error: err.message });
      }
    }

    const body = { results, serverTime: new Date().toISOString() };
    await rememberIdempotency(userId, idemKey, body);
    return c.json(body);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/** GET /api/mobile/health */
app.get('/health', (c) => c.json({ ok: true, surface: 'native-mobile' }));

export default app;
