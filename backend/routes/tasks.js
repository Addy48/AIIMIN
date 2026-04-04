import express from 'express';
import { supabase } from '../supabase.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/*
 * Tasks API — CRUD for daily tasks.
 * All routes require auth.
 * Dates in ISO 8601: YYYY-MM-DD (IST)
 */

/* GET /tasks?date=YYYY-MM-DD */
router.get('/', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

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

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/* POST /tasks — Create a task */
router.post('/', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, due_date, due_time, source = 'manual' } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required.' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: title.trim(),
        due_date: due_date || new Date().toLocaleDateString('en-CA'),
        due_time: due_time || null,
        source,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/* PATCH /tasks/:id — Update (toggle complete, edit title) */
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { completed, title } = req.body;

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
    if (!data) return res.status(404).json({ success: false, error: 'Task not found.' });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/* DELETE /tasks/:id */
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
