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

// POST /api/focus/sessions — log completed work block
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
        } = await c.req.json();

        const today = new Date().toISOString().split('T')[0];
        const mins = Math.max(0, Number(duration_minutes) || 0);

        if (mins === 0 && (session_reflection || energy_after)) {
            const { rows } = await pool.query(
                `UPDATE pomodoro_sessions SET
                    session_reflection = COALESCE($3, session_reflection),
                    energy_after = COALESCE($4, energy_after),
                    session_intent = COALESCE($5, session_intent)
                 WHERE user_id = $1 AND date = $2::date
                 RETURNING *`,
                [userId, today, session_reflection || null, energy_after || null, session_intent || null]
            );
            if (rows.length) return c.json(rows[0]);
        }

        const addMins = mins > 0 ? mins : 25;
        const { rows } = await pool.query(
            `INSERT INTO pomodoro_sessions (
                user_id, date, cycles_completed, total_focus_minutes,
                session_intent, session_reflection, energy_after
             ) VALUES ($1, $2, 1, $3, $4, $5, $6)
             ON CONFLICT (user_id, date) DO UPDATE SET
                cycles_completed = COALESCE(pomodoro_sessions.cycles_completed, 0) + 1,
                total_focus_minutes = COALESCE(pomodoro_sessions.total_focus_minutes, 0) + EXCLUDED.total_focus_minutes,
                session_intent = COALESCE(EXCLUDED.session_intent, pomodoro_sessions.session_intent),
                session_reflection = COALESCE(EXCLUDED.session_reflection, pomodoro_sessions.session_reflection),
                energy_after = COALESCE(EXCLUDED.energy_after, pomodoro_sessions.energy_after)
             RETURNING *`,
            [
                userId,
                today,
                addMins,
                session_intent || null,
                session_reflection || (intent_why ? `Why: ${intent_why}` : null),
                energy_after || null,
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
