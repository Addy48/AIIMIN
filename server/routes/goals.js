import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

/** DB: metric, target, frequency, start_date, meta — API also exposes title/category/status/progress */
function rowToApi(row) {
    const meta = row.meta && typeof row.meta === 'object' ? row.meta : {};
    return {
        id: row.id,
        user_id: row.user_id,
        metric: row.metric,
        target: row.target,
        frequency: row.frequency,
        start_date: row.start_date,
        created_at: row.created_at,
        meta,
        title: meta.title || row.metric,
        category: meta.category || 'life',
        status: meta.status || 'in_progress',
        progress: meta.progress ?? Number(row.target) ?? 0,
        pillar: meta.pillar,
        priority: meta.priority,
        targetDate: meta.targetDate,
        why: meta.why,
        milestones: meta.milestones,
        timeSpent: meta.timeSpent,
    };
}

function bodyToDbFields(body) {
    const title = (body.title || body.metric || '').trim();
    const meta = {
        ...(body.meta && typeof body.meta === 'object' ? body.meta : {}),
    };
    if (title) meta.title = title;
    if (body.category !== undefined) meta.category = body.category;
    if (body.status !== undefined) meta.status = body.status;
    if (body.progress !== undefined) meta.progress = body.progress;
    if (body.pillar !== undefined) meta.pillar = body.pillar;
    if (body.priority !== undefined) meta.priority = body.priority;
    if (body.targetDate !== undefined) meta.targetDate = body.targetDate;
    if (body.why !== undefined) meta.why = body.why;
    if (body.milestones !== undefined) meta.milestones = body.milestones;
    if (body.timeSpent !== undefined) meta.timeSpent = body.timeSpent;

    return {
        metric: title,
        target: body.target ?? body.progress ?? 100,
        frequency: body.frequency || 'monthly',
        meta,
    };
}

// GET /api/goals
app.get('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { status, category } = c.req.query();

        let q = `
            SELECT id, user_id, metric, target, frequency, start_date, created_at, meta
            FROM goals
            WHERE user_id = $1 AND deleted_at IS NULL`;
        const params = [userId];

        if (status) {
            params.push(status);
            q += ` AND COALESCE(meta->>'status', 'in_progress') = $${params.length}`;
        }
        if (category) {
            params.push(category);
            q += ` AND COALESCE(meta->>'category', 'life') = $${params.length}`;
        }
        q += ' ORDER BY created_at ASC';

        const { rows } = await pool.query(q, params);
        return c.json(rows.map(rowToApi));
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// POST /api/goals
app.post('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        const { metric, target, frequency, meta } = bodyToDbFields(body);

        if (!metric) return c.json({ error: 'title is required' }, 400);

        const { rows } = await pool.query(
            `INSERT INTO goals (user_id, metric, target, frequency, start_date, meta)
             VALUES ($1, $2, $3, $4, CURRENT_DATE, $5)
             RETURNING id, user_id, metric, target, frequency, start_date, created_at, meta`,
            [userId, metric, target, frequency, meta],
        );
        return c.json(rowToApi(rows[0]), 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// PUT /api/goals/:id
app.put('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const body = await c.req.json();

        const { rows: existingRows } = await pool.query(
            `SELECT id, metric, target, frequency, meta FROM goals WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
            [id, userId],
        );
        if (existingRows.length === 0) return c.json({ error: 'Goal not found' }, 404);

        const existing = existingRows[0];
        const merged = bodyToDbFields({
            title: body.title ?? body.metric ?? existing.metric,
            target: body.target ?? existing.target,
            frequency: body.frequency ?? existing.frequency,
            category: body.category,
            status: body.status,
            progress: body.progress,
            pillar: body.pillar,
            priority: body.priority,
            targetDate: body.targetDate,
            why: body.why,
            milestones: body.milestones,
            timeSpent: body.timeSpent,
            meta: { ...(existing.meta || {}), ...(body.meta || {}) },
        });

        const { rows } = await pool.query(
            `UPDATE goals
             SET metric = $1, target = $2, frequency = $3, meta = $4
             WHERE id = $5 AND user_id = $6 AND deleted_at IS NULL
             RETURNING id, user_id, metric, target, frequency, start_date, created_at, meta`,
            [merged.metric, merged.target, merged.frequency, merged.meta, id, userId],
        );
        if (rows.length === 0) return c.json({ error: 'Goal not found' }, 404);
        return c.json(rowToApi(rows[0]));
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// DELETE /api/goals/:id
app.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { rowCount } = await pool.query(
            `UPDATE goals SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
            [id, userId],
        );
        if (rowCount === 0) return c.json({ error: 'Goal not found' }, 404);
        return c.json({ deleted: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
