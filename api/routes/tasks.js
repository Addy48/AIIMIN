import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth as auth } from '../middleware/auth.js';

const app = new Hono();

/* GET /api/tasks?date=YYYY-MM-DD */
app.get('/', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const date = c.req.query('date');

    let query = supabase
      .from('tasks')
      .select('id, title, due_date, due_time, completed, source, created_at')
      .eq('user_id', userId)
      .order('completed', { ascending: true })
      .order('due_time', { ascending: true, nullsFirst: false });

    if (date) {
      query = query.eq('due_date', date);
    }

    const { data, error } = await query;
    if (error) throw error;

    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

/* POST /api/tasks — Create a task */
app.post('/', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const { title, due_date, due_time, source = 'manual' } = await c.req.json();

    if (!title?.trim()) {
      return c.json({ success: false, error: 'Title is required.' }, 400);
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: title.trim(),
        due_date: due_date || new Date().toISOString().split('T')[0],
        due_time: due_time || null,
        source,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({ success: true, data }, 201);
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

/* PATCH /api/tasks/:id — Update (toggle complete, edit title) */
app.patch('/:id', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const { completed, title } = await c.req.json();

    const updates = {};
    if (completed !== undefined) updates.completed = completed;
    if (title !== undefined) updates.title = title.trim();

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return c.json({ success: false, error: 'Task not found.' }, 404);

    return c.json({ success: true, data });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

/* DELETE /api/tasks/:id */
app.delete('/:id', auth, async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
