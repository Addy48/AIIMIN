/**
 * routes/user.js — user-scoped endpoints (pulse check, preferences extras)
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

/**
 * POST /api/user/pulse-check
 * WHO-5 weekly pulse — persists score + answers when user_feedback table is available.
 */
app.post('/pulse-check', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { score, answers } = await c.req.json();
        const payload = JSON.stringify({
            score: Number(score) || 0,
            answers: Array.isArray(answers) ? answers : [],
            recorded_at: new Date().toISOString(),
        });

        try {
            await pool.query(
                `INSERT INTO user_feedback (user_id, type, message) VALUES ($1, $2, $3)`,
                [userId, 'pulse_check', payload]
            );
        } catch (dbErr) {
            console.warn('[pulse-check] persist skipped:', dbErr.message);
        }

        return c.json({ ok: true, score: Number(score) || 0 });
    } catch (err) {
        console.error('[pulse-check]', err);
        return c.json({ error: err.message }, 500);
    }
});

export default app;
