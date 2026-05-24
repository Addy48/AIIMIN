import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth as auth } from '../middleware/auth.js';

const app = new Hono();

/* GET /api/tasks?date=YYYY-MM-DD */
app.get('/', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const date = c.req.query('date');

    let query = 'SELECT id, title, due_date, due_time, completed, source, created_at FROM tasks WHERE user_id = $1';
    const params = [userId];
    if (date) {
      params.push(date);
      query += ` AND due_date = $${params.length}`;
    }
    query += ' ORDER BY completed ASC, due_time ASC NULLS LAST';

    const { rows } = await pool.query(query, params);
    return c.json({ success: true, data: rows });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

/* POST /api/tasks */
app.post('/', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const { title, due_date, due_time, source = 'manual' } = await c.req.json();
    if (!title?.trim()) return c.json({ success: false, error: 'Title is required.' }, 400);

    const { rows } = await pool.query(
      `INSERT INTO tasks (user_id, title, due_date, due_time, source, completed)
       VALUES ($1, $2, $3, $4, $5, false) RETURNING *`,
      [userId, title.trim(), due_date || new Date().toISOString().split('T')[0], due_time || null, source]
    );
    return c.json({ success: true, data: rows[0] }, 201);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

/* PATCH /api/tasks/:id */
app.patch('/:id', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const { completed, title } = await c.req.json();

    const sets = [];
    const params = [];
    if (completed !== undefined) { params.push(completed); sets.push(`completed = $${params.length}`); }
    if (title !== undefined) { params.push(title.trim()); sets.push(`title = $${params.length}`); }
    if (sets.length === 0) return c.json({ success: false, error: 'Nothing to update' }, 400);

    params.push(id, userId);
    const { rows } = await pool.query(
      `UPDATE tasks SET ${sets.join(', ')} WHERE id = $${params.length - 1} AND user_id = $${params.length} RETURNING *`,
      params
    );
    if (rows.length === 0) return c.json({ success: false, error: 'Task not found.' }, 404);
    return c.json({ success: true, data: rows[0] });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

/* DELETE /api/tasks/:id */
app.delete('/:id', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');
    await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
