/**
 * routes/habits.js — uses pool.query() against Supabase PostgreSQL.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

// GET /api/habits
app.get('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { status = 'active', category } = c.req.query();

        let q = 'SELECT id, name, emoji, category, frequency, status, meta, created_at FROM habits WHERE user_id = $1';
        const params = [userId];
        if (status) { params.push(status); q += ` AND status = $${params.length}`; }
        if (category) { params.push(category); q += ` AND category = $${params.length}`; }
        q += ' ORDER BY created_at ASC';

        const { rows } = await pool.query(q, params);
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// POST /api/habits
app.post('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { name, emoji = '🎯', category, frequency = 'daily', meta = {} } = await c.req.json();
        if (!name?.trim()) return c.json({ error: 'name is required' }, 400);

        const { rows } = await pool.query(
            `INSERT INTO habits (user_id, name, emoji, category, frequency, meta)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userId, name.trim(), emoji, category || null, frequency, meta]
        );
        return c.json(rows[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// PUT /api/habits/:id
app.put('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { name, emoji, category, frequency, status, meta } = await c.req.json();

        const sets = [];
        const params = [];
        if (name !== undefined) { params.push(name); sets.push(`name = $${params.length}`); }
        if (emoji !== undefined) { params.push(emoji); sets.push(`emoji = $${params.length}`); }
        if (category !== undefined) { params.push(category); sets.push(`category = $${params.length}`); }
        if (frequency !== undefined) { params.push(frequency); sets.push(`frequency = $${params.length}`); }
        if (status !== undefined) { params.push(status); sets.push(`status = $${params.length}`); }
        if (meta !== undefined) { params.push(meta); sets.push(`meta = $${params.length}`); }
        if (sets.length === 0) return c.json({ error: 'No fields to update' }, 400);

        params.push(id, userId);
        const { rows } = await pool.query(
            `UPDATE habits SET ${sets.join(', ')} WHERE id = $${params.length - 1} AND user_id = $${params.length} RETURNING *`,
            params
        );
        if (rows.length === 0) return c.json({ error: 'Habit not found' }, 404);
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// DELETE /api/habits/:id
app.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        await pool.query('DELETE FROM habits WHERE id = $1 AND user_id = $2', [id, userId]);
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// GET /api/habits/:id/logs
app.get('/:id/logs', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { date, limit = '30' } = c.req.query();

        let q = `SELECT id, completed_at, status, notes FROM habit_logs
                 WHERE habit_id = $1 AND user_id = $2`;
        const params = [id, userId];
        if (date) {
            params.push(`${date}T00:00:00.000Z`, `${date}T23:59:59.999Z`);
            q += ` AND completed_at >= $${params.length - 1} AND completed_at <= $${params.length}`;
        }
        q += ` ORDER BY completed_at DESC LIMIT ${parseInt(limit, 10)}`;

        const { rows } = await pool.query(q, params);
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
