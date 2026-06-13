import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

// GET /api/goals
app.get('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { status = 'in_progress', category } = c.req.query();

        let q = 'SELECT id, title, category, status, progress, created_at FROM goals WHERE user_id = $1';
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

// POST /api/goals
app.post('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { title, category = 'life', status = 'in_progress', progress = 0 } = await c.req.json();
        if (!title?.trim()) return c.json({ error: 'title is required' }, 400);

        const { rows } = await pool.query(
            `INSERT INTO goals (user_id, title, category, status, progress)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, title.trim(), category, status, progress]
        );
        return c.json(rows[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// PUT /api/goals/:id
app.put('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { title, category, status, progress } = await c.req.json();

        const sets = [];
        const params = [];
        if (title !== undefined) { params.push(title); sets.push(`title = $${params.length}`); }
        if (category !== undefined) { params.push(category); sets.push(`category = $${params.length}`); }
        if (status !== undefined) { params.push(status); sets.push(`status = $${params.length}`); }
        if (progress !== undefined) { params.push(progress); sets.push(`progress = $${params.length}`); }
        
        if (sets.length === 0) return c.json({ error: 'No fields to update' }, 400);

        params.push(id, userId);
        const { rows } = await pool.query(
            `UPDATE goals SET ${sets.join(', ')} WHERE id = $${params.length - 1} AND user_id = $${params.length} RETURNING *`,
            params
        );
        if (rows.length === 0) return c.json({ error: 'Goal not found' }, 404);
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// DELETE /api/goals/:id
app.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        await pool.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [id, userId]);
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
