/**
 * routes/discipline.js
 *
 * Discipline section API — full Supabase sync.
 * Replaces localStorage-only discipline streak tracking.
 *
 * Endpoints:
 *   GET  /api/discipline/streak       — current streak data
 *   POST /api/discipline/streak       — create/update streak
 *   POST /api/discipline/log          — log reset/urge/reflection
 *   GET  /api/discipline/logs         — historical logs
 *   GET  /api/discipline/insights     — aggregated trigger stats
 *   GET/POST/PUT/DELETE /api/discipline/replacement-habits
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validateDisciplineLogBody } from '../middleware/validate.js';

const app = new Hono();

/* ═══════════════════════════════════════════════════════
   STREAKS
═══════════════════════════════════════════════════════ */

/**
 * GET /api/discipline/streak
 * Returns the current discipline streak for the user.
 * Creates one if it doesn't exist.
 */
app.get('/streak', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { rows } = await pool.query(
            `SELECT * FROM public.discipline_streaks
             WHERE user_id = $1
             ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );

        if (rows.length > 0) {
            return c.json(rows[0]);
        }

        // Auto-create empty streak
        const { rows: created } = await pool.query(
            `INSERT INTO public.discipline_streaks
                (user_id, addiction_type, streak_days, longest_streak, total_resets, started_at)
             VALUES ($1, '', 0, 0, 0, NOW())
             RETURNING *`,
            [userId]
        );

        return c.json(created[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * POST /api/discipline/streak
 * Create or update a discipline streak.
 * Body: { addiction_type, replacement_habit }
 */
app.post('/streak', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { addiction_type, replacement_habit } = await c.req.json();

        if (!addiction_type || !String(addiction_type).trim()) {
            return c.json({ error: 'addiction_type is required' }, 400);
        }

        const cleanType = String(addiction_type).trim().slice(0, 200);
        const cleanRepl = replacement_habit ? String(replacement_habit).trim().slice(0, 200) : null;

        // Check if streak exists
        const { rows: existing } = await pool.query(
            `SELECT id, streak_days, longest_streak, started_at, total_resets
             FROM public.discipline_streaks
             WHERE user_id = $1
             ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );

        if (existing.length > 0) {
            const { rows: updated } = await pool.query(
                `UPDATE public.discipline_streaks
                 SET addiction_type = $1, replacement_habit = $2, updated_at = NOW()
                 WHERE id = $3 AND user_id = $4
                 RETURNING *`,
                [cleanType, cleanRepl, existing[0].id, userId]
            );
            return c.json(updated[0]);
        }

        // Create new streak
        const { rows: created } = await pool.query(
            `INSERT INTO public.discipline_streaks
                (user_id, addiction_type, replacement_habit, streak_days, longest_streak, total_resets, started_at)
             VALUES ($1, $2, $3, 0, 0, 0, NOW())
             RETURNING *`,
            [userId, cleanType, cleanRepl]
        );

        return c.json(created[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PATCH /api/discipline/streak/increment
 * Increment streak by 1 day (called daily).
 */
app.patch('/streak/increment', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { rows: updated } = await pool.query(
            `UPDATE public.discipline_streaks
             SET streak_days = streak_days + 1,
                 longest_streak = GREATEST(longest_streak, streak_days + 1),
                 updated_at = NOW()
             WHERE user_id = $1 AND streak_days >= 0
             RETURNING *`,
            [userId]
        );

        if (updated.length === 0) {
            return c.json({ error: 'No active streak found' }, 404);
        }

        return c.json(updated[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PATCH /api/discipline/streak/reset
 * Reset streak (after a relapse).
 * Body: { trigger_type, hal_check, notes }
 */
app.patch('/streak/reset', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { trigger_type, hal_check, notes } = await c.req.json();

        // Get current streak
        const { rows: current } = await pool.query(
            `SELECT id, streak_days, longest_streak, total_resets, started_at
             FROM public.discipline_streaks
             WHERE user_id = $1
             ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );

        if (current.length === 0) {
            return c.json({ error: 'No streak found' }, 404);
        }

        const currentStreak = current[0].streak_days;
        const newTotalResets = current[0].total_resets + 1;

        // Update streak
        const { rows: updated } = await pool.query(
            `UPDATE public.discipline_streaks
             SET streak_days = 0,
                 total_resets = $2,
                 last_reset_at = NOW(),
                 updated_at = NOW()
             WHERE id = $1 AND user_id = $3
             RETURNING *`,
            [current[0].id, newTotalResets, userId]
        );

        // Log the reset event
        await pool.query(
            `INSERT INTO public.discipline_logs
                (user_id, streak_id, event_type, trigger_type, hal_check, notes)
             VALUES ($1, $2, 'reset', $3, $4, $5)`,
            [userId, current[0].id, trigger_type || null,
             hal_check ? JSON.stringify(hal_check) : '{}', notes || null]
        );

        return c.json(updated[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ═══════════════════════════════════════════════════════
   LOGS — reset, urge, milestone, reflection
═══════════════════════════════════════════════════════ */

/**
 * POST /api/discipline/log
 * Log a discipline event (urge, milestone, reflection).
 * Body: { event_type, trigger_type, hal_check, craving_intensity, time_of_day, notes }
 */
app.post('/log', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const body = await c.req.json();
        const v = validateDisciplineLogBody(body);
        if (!v.ok) return c.json({ error: v.error }, 400);
        const { event_type, trigger_type, hal_check, craving_intensity, time_of_day, notes } = v.value;

        // Get current streak ID
        const { rows: streak } = await pool.query(
            `SELECT id FROM public.discipline_streaks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );

        const streakId = streak.length > 0 ? streak[0].id : null;

        const { rows: created } = await pool.query(
            `INSERT INTO public.discipline_logs
                (user_id, streak_id, event_type, trigger_type, hal_check, craving_intensity, time_of_day, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [userId, streakId, event_type, trigger_type || null,
             hal_check ? JSON.stringify(hal_check) : '{}',
             craving_intensity ? Math.min(5, Math.max(1, parseInt(craving_intensity))) : null,
             time_of_day || null, notes || null]
        );

        return c.json(created[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/discipline/logs
 * Get historical logs with optional filters.
 * Query: ?type=urge&limit=30&days=30
 */
app.get('/logs', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const queryType = c.req.query('type');
        const limit = Math.min(parseInt(c.req.query('limit') || '50'), 200);
        const days = parseInt(c.req.query('days') || '30');

        let q = `SELECT dl.*, ds.addiction_type, ds.streak_days
                 FROM public.discipline_logs dl
                 LEFT JOIN public.discipline_streaks ds ON dl.streak_id = ds.id
                 WHERE dl.user_id = $1`;
        const params = [userId];
        let paramIdx = 2;

        if (queryType) {
            q += ` AND dl.event_type = $${paramIdx}`;
            params.push(queryType);
            paramIdx++;
        }

        q += ` AND dl.created_at >= NOW() - INTERVAL '${days} days'
         ORDER BY dl.created_at DESC
         LIMIT $${paramIdx}`;
        params.push(limit);

        const { rows } = await pool.query(q, params);
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/discipline/insights
 * Aggregated trigger analysis.
 * Returns: { mostCommonTrigger, mostVulnerableTime, urgesThisStreak, totalResets, avgCraving }
 */
app.get('/insights', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { rows: streak } = await pool.query(
            `SELECT streak_days, total_resets, longest_streak FROM public.discipline_streaks
             WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [userId]
        );

        if (streak.length === 0) {
            return c.json({ streak_days: 0, total_resets: 0, longest_streak: 0, mostCommonTrigger: null, mostVulnerableTime: null, avgCraving: null });
        }

        // Most common trigger
        const { rows: triggerData } = await pool.query(
            `SELECT trigger_type, COUNT(*) as count
             FROM public.discipline_logs
             WHERE user_id = $1 AND trigger_type IS NOT NULL
             GROUP BY trigger_type
             ORDER BY count DESC
             LIMIT 1`,
            [userId]
        );

        // Most vulnerable time
        const { rows: timeData } = await pool.query(
            `SELECT time_of_day, COUNT(*) as count
             FROM public.discipline_logs
             WHERE user_id = $1 AND time_of_day IS NOT NULL
             GROUP BY time_of_day
             ORDER BY count DESC
             LIMIT 1`,
            [userId]
        );

        // Average craving intensity this streak
        const { rows: cravingData } = await pool.query(
            `SELECT AVG(craving_intensity) as avg_craving, COUNT(*) as total_urges
             FROM public.discipline_logs
             WHERE user_id = $1 AND event_type = 'urge'`,
            [userId]
        );

        return c.json({
            ...streak[0],
            mostCommonTrigger: triggerData[0]?.trigger_type || null,
            mostCommonTriggerCount: triggerData[0]?.count || 0,
            mostVulnerableTime: timeData[0]?.time_of_day || null,
            mostVulnerableTimeCount: timeData[0]?.count || 0,
            totalUrgesThisStreak: cravingData[0]?.total_urges || 0,
            avgCraving: cravingData[0]?.avg_craving ? parseFloat(cravingData[0].avg_craving.toFixed(1)) : null,
        });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ═══════════════════════════════════════════════════════
   REPLACEMENT HABITS
═══════════════════════════════════════════════════════ */

/**
 * GET /api/discipline/replacement-habits
 */
app.get('/replacement-habits', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { rows } = await pool.query(
            `SELECT * FROM public.replacement_habits
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * POST /api/discipline/replacement-habits
 */
app.post('/replacement-habits', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { habit_name, linked_to_addiction } = await c.req.json();

        if (!habit_name || !String(habit_name).trim()) {
            return c.json({ error: 'habit_name is required' }, 400);
        }

        const { rows: created } = await pool.query(
            `INSERT INTO public.replacement_habits
                (user_id, habit_name, linked_to_addiction)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, String(habit_name).trim().slice(0, 200),
             linked_to_addiction ? String(linked_to_addiction).trim().slice(0, 200) : null]
        );

        return c.json(created[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PUT /api/discipline/replacement-habits/:id
 */
app.put('/replacement-habits/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        const { habit_name, linked_to_addiction } = await c.req.json();

        const sets = [];
        const params = [];
        if (habit_name !== undefined) {
            params.push(String(habit_name).trim().slice(0, 200));
            sets.push(`habit_name = $${params.length}`);
        }
        if (linked_to_addiction !== undefined) {
            params.push(linked_to_addiction ? String(linked_to_addiction).trim().slice(0, 200) : null);
            sets.push(`linked_to_addiction = $${params.length}`);
        }

        if (sets.length === 0) {
            return c.json({ error: 'No fields to update' }, 400);
        }

        params.push(id, userId);
        const { rows } = await pool.query(
            `UPDATE public.replacement_habits SET ${sets.join(', ')}, updated_at = NOW()
             WHERE id = $${params.length - 1} AND user_id = $${params.length}
             RETURNING *`,
            params
        );

        if (rows.length === 0) {
            return c.json({ error: 'Replacement habit not found' }, 404);
        }

        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * DELETE /api/discipline/replacement-habits/:id
 */
app.delete('/replacement-habits/:id', requireAuth, async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    try {
        await pool.query(
            `DELETE FROM public.replacement_habits WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;