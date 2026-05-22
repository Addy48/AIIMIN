/**
 * routes/habits.js
 *
 * Habits CRUD — Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

// GET /api/habits — list all active habits for user
app.get('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { status = 'active', category } = c.req.query();

        let query = supabase
            .from('habits')
            .select('id, name, emoji, category, frequency, status, created_at')
            .eq('user_id', userId);

        if (status) query = query.eq('status', status);
        if (category) query = query.eq('category', category);

        const { data, error } = await query.order('created_at', { ascending: true });

        if (error) throw error;
        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// POST /api/habits — create a new habit
app.post('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { name, emoji = '🎯', category, frequency = 'daily' } = await c.req.json();
        if (!name?.trim()) return c.json({ error: 'name is required' }, 400);

        const { data, error } = await supabase
            .from('habits')
            .insert({
                user_id: userId,
                name: name.trim(),
                emoji,
                category: category || null,
                frequency
            })
            .select()
            .single();

        if (error) throw error;
        return c.json(data, 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// PUT /api/habits/:id
app.put('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const body = await c.req.json();
        const { name, emoji, category, frequency, status } = body;

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (emoji !== undefined) updates.emoji = emoji;
        if (category !== undefined) updates.category = category;
        if (frequency !== undefined) updates.frequency = frequency;
        if (status !== undefined) updates.status = status;

        if (Object.keys(updates).length === 0) return c.json({ error: 'No fields to update' }, 400);

        const { data, error } = await supabase
            .from('habits')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) return c.json({ error: 'Habit not found' }, 404);
        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

// DELETE /api/habits/:id
app.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');

        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
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
        const { date, limit = 30 } = c.req.query();

        let query = supabase
            .from('habit_logs')
            .select('id, completed_at, status, session, notes')
            .eq('habit_id', id)
            .eq('user_id', userId);

        if (date) {
            // Simplistic equality for date part
            query = query.gte('completed_at', `${date}T00:00:00.000Z`).lte('completed_at', `${date}T23:59:59.999Z`);
        }

        const { data, error } = await query
            .order('completed_at', { ascending: false })
            .limit(parseInt(limit, 10));

        if (error) throw error;
        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
