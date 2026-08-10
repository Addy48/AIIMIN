/**
 * routes/journal.js — journal_entries CRUD (dedicated write path).
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

/** GET /api/journal — list entries */
app.get('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const limit = Math.min(200, Math.max(1, parseInt(c.req.query('limit') || '100', 10) || 100));
        const orderCol = /^[a-z_][a-z0-9_]*$/i.test(c.req.query('orderCol') || '')
            ? c.req.query('orderCol')
            : 'date';
        const ascending = c.req.query('ascending') === 'true';

        const { rows } = await pool.query(
            `SELECT * FROM journal_entries
             WHERE user_id = $1
             ORDER BY ${orderCol} ${ascending ? 'ASC' : 'DESC'}
             LIMIT $2`,
            [userId, limit]
        );
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/** GET /api/journal/:id */
app.get('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { rows } = await pool.query(
            'SELECT * FROM journal_entries WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (!rows[0]) return c.json({ error: 'Not found' }, 404);
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/** POST /api/journal — create entry */
app.post('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        const {
            date = new Date().toISOString().split('T')[0],
            encrypted_content = '',
            mood = null,
            energy_level = null,
            sleep_hours = null,
            title = null,
        } = body;

        const { rows } = await pool.query(
            `INSERT INTO journal_entries (user_id, date, encrypted_content, mood, energy_level, sleep_hours, title)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, date, encrypted_content, mood, energy_level, sleep_hours, title]
        );
        return c.json(rows[0], 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/** PATCH /api/journal/:id */
app.patch('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const body = await c.req.json();

        const allowed = ['date', 'encrypted_content', 'mood', 'energy_level', 'sleep_hours', 'title'];
        const sets = [];
        const params = [];
        allowed.forEach((col) => {
            if (body[col] !== undefined) {
                params.push(body[col]);
                sets.push(`${col} = $${params.length}`);
            }
        });
        if (!sets.length) return c.json({ error: 'No fields to update' }, 400);

        params.push(id, userId);
        const { rows } = await pool.query(
            `UPDATE journal_entries SET ${sets.join(', ')}
             WHERE id = $${params.length - 1} AND user_id = $${params.length}
             RETURNING *`,
            params
        );
        if (!rows[0]) return c.json({ error: 'Not found' }, 404);
        return c.json(rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/** DELETE /api/journal/:id */
app.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { rowCount } = await pool.query(
            'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (!rowCount) return c.json({ error: 'Not found' }, 404);
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
