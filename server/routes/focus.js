/**
 * Focus session routes — pomodoro / deep work logging.
 * Gollwitzer (1999): intent framing. Kolb (1984): post-session reflection.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

// GET /api/focus/week-stats?days=7
app.get('/week-stats', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const days = Math.min(30, Math.max(1, parseInt(c.req.query('days') || '7', 10)));
        const since = new Date();
        since.setDate(since.getDate() - (days - 1));
        const sinceKey = since.toISOString().split('T')[0];

        const { rows } = await pool.query(
            `SELECT date::text AS date,
                    COALESCE(total_focus_minutes, duration, 0)::int AS minutes,
                    COALESCE(cycles_completed, 0)::int AS cycles
             FROM pomodoro_sessions
             WHERE user_id = $1 AND date >= $2::date
             ORDER BY date ASC`,
            [userId, sinceKey]
        );

        return c.json(rows);
    } catch (err) {
        console.error('[focus] week-stats error:', err.message);
        return c.json([]);
    }
});

// POST /api/focus/sessions — log completed work block into sessions (pomodoro_sessions is a view)
app.post('/sessions', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const {
            duration_minutes = 25,
            session_intent,
            intent_why,
            session_reflection,
            energy_after,
            goal_id,
            mood_before,
            mood_after,
        } = await c.req.json();

        const mins = Math.max(1, Number(duration_minutes) || 25);
        const ended = new Date();
        const started = new Date(ended.getTime() - mins * 60_000);
        const noteParts = [
            session_intent ? `Intent: ${session_intent}` : null,
            session_reflection || (intent_why ? `Why: ${intent_why}` : null),
        ].filter(Boolean);

        const { rows } = await pool.query(
            `INSERT INTO sessions (
                user_id, started_at, ended_at, duration_minutes, session_type,
                mood_before, mood_after, energy_level, notes, source_type, created_at
             ) VALUES ($1,$2,$3,$4,'focus',$5,$6,$7,$8,'user',$2)
             RETURNING id, started_at, ended_at, duration_minutes, notes`,
            [
                userId,
                started.toISOString(),
                ended.toISOString(),
                mins,
                mood_before || null,
                mood_after || null,
                energy_after || null,
                noteParts.length ? noteParts.join('\n') : null,
            ]
        );

        if (goal_id) {
            try {
                await pool.query(
                    `UPDATE goals SET meta = COALESCE(meta, '{}'::jsonb) || jsonb_build_object('lastFocusAt', $3::text)
                     WHERE id = $1 AND user_id = $2`,
                    [goal_id, userId, new Date().toISOString()]
                );
            } catch {
                // non-fatal
            }
        }

        return c.json(rows[0] || { ok: true });
    } catch (err) {
        console.error('[focus] sessions error:', err.message);
        return c.json({ error: err.message }, 500);
    }
});

export default app;
