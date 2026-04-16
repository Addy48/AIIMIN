/**
 * routes/calendar.js
 *
 * Unified Life OS Calendar — Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const SYSTEM_TYPES = ['physical', 'cognitive', 'behavior', 'finance', 'reflection', 'general'];

/* ── GET /api/calendar/events ─────────────────────────────── */
app.get('/events', requireAuth, async (c) => {
    try {
        const { start, end } = c.req.query();
        if (!start || !end) return c.json({ error: 'start and end query params required' }, 400);
        const userId = c.get('userId');

        const { data, error } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('user_id', userId)
            .gte('start_time', start)
            .lte('start_time', end)
            .is('deleted_at', null)
            .order('start_time', { ascending: true });

        if (error) throw error;
        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ── GET /api/calendar/day/:date ─────────────────────────────── */
app.get('/day/:date', requireAuth, async (c) => {
    try {
        const { date } = c.req.param();
        const userId = c.get('userId');
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;

        const { data, error } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('user_id', userId)
            .gte('start_time', startOfDay)
            .lte('start_time', endOfDay)
            .is('deleted_at', null)
            .order('start_time', { ascending: true });

        if (error) throw error;
        return c.json(data || []);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ── POST /api/calendar/events ──────────────────────────────── */
app.post('/events', requireAuth, async (c) => {
    try {
        const body = await c.req.json();
        const userId = c.get('userId');
        const { title, description, start_time, end_time, all_day, system_type, tags, color, location, reminder_minutes, recurrence_rule, event_type } = body;

        if (!title || !start_time) return c.json({ error: 'title and start_time required' }, 400);

        const { data, error } = await supabase
            .from('calendar_events')
            .insert({
                user_id: userId,
                title,
                description: description || null,
                start_time,
                end_time: end_time || start_time,
                all_day: all_day || false,
                system_type: system_type || 'general',
                tags: tags || [],
                color: color || null,
                location: location || null,
                reminder_minutes: reminder_minutes || null,
                recurrence_rule: recurrence_rule ? JSON.stringify(recurrence_rule) : null,
                event_type: event_type || 'event',
                source_type: 'user'
            })
            .select()
            .single();

        if (error) throw error;
        return c.json(data, 201);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ── PATCH /api/calendar/events/:id ─────────────────────────── */
app.patch('/events/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const body = await c.req.json();
        const allowedFields = ['title', 'description', 'start_time', 'end_time', 'all_day', 'system_type', 'tags', 'color', 'location', 'reminder_minutes', 'recurrence_rule', 'event_type', 'completed'];

        const updates = {};
        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                updates[key] = key === 'recurrence_rule' && body[key] ? JSON.stringify(body[key]) : body[key];
            }
        }
        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('calendar_events')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .is('deleted_at', null)
            .select()
            .maybeSingle();

        if (error) throw error;
        if (!data) return c.json({ error: 'Event not found' }, 404);
        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ── DELETE /api/calendar/events/:id ────────────────────────── */
app.delete('/events/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { error } = await supabase
            .from('calendar_events')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId)
            .is('deleted_at', null);

        if (error) throw error;
        return c.json({ deleted: true, id });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ── GET /api/calendar/heatmap ──────────────────────────────── */
app.get('/heatmap', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const year = parseInt(c.req.query('year') || new Date().getFullYear(), 10);
        const month = parseInt(c.req.query('month') || new Date().getMonth() + 1, 10);

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

        // Fetch logs, sessions, and commitments in parallel
        const [logsRes, sessionsRes, commitsRes] = await Promise.all([
            supabase.from('daily_logs').select('date, mood_before, mood_after').eq('user_id', userId).gte('date', startDate).lte('date', endDate),
            supabase.from('pomodoro_sessions').select('date, cycles_completed, total_focus_minutes').eq('user_id', userId).gte('date', startDate).lte('date', endDate),
            supabase.from('daily_commitments').select('date, fulfillment_pct').eq('user_id', userId).gte('date', startDate).lte('date', endDate)
        ]);

        // Merge in JS
        const dataMap = {};
        (logsRes.data || []).forEach(l => {
            const moodCount = (l.mood_before !== null ? 1 : 0) + (l.mood_after !== null ? 1 : 0);
            const moodAvg = moodCount > 0 ? ((l.mood_before || 0) + (l.mood_after || 0)) / moodCount : 0;
            dataMap[l.date] = { date: l.date, session_count: 0, focus_minutes: 0, commitment_pct: 0, mood_avg: parseFloat(moodAvg.toFixed(1)) };
        });
        (sessionsRes.data || []).forEach(s => {
            if (!dataMap[s.date]) dataMap[s.date] = { date: s.date, session_count: 0, focus_minutes: 0, commitment_pct: 0, mood_avg: 0 };
            dataMap[s.date].session_count += (s.cycles_completed || 0);
            dataMap[s.date].focus_minutes += (s.total_focus_minutes || 0);
        });
        (commitsRes.data || []).forEach(dc => {
            if (!dataMap[dc.date]) dataMap[dc.date] = { date: dc.date, session_count: 0, focus_minutes: 0, commitment_pct: 0, mood_avg: 0 };
            dataMap[dc.date].commitment_pct = parseFloat(dc.fulfillment_pct || 0);
        });

        return c.json(Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date)));
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
