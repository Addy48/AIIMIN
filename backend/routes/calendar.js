/**
 * routes/calendar.js
 *
 * Unified Life OS Calendar — Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { google } from 'googleapis';
import { supabase } from '../lib/db.js';
import { decrypt } from '../lib/crypto.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const SYSTEM_TYPES = ['physical', 'cognitive', 'behavior', 'finance', 'reflection', 'general'];

const createGoogleCalendar = async (userId) => {
    const { data: tokenRow, error } = await supabase
        .from('user_oauth_tokens')
        .select('access_token_enc, refresh_token_enc, access_token, refresh_token, expiry_date, scope, refresh_error, updated_at')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .maybeSingle();

    if (error) throw error;
    if (!tokenRow) throw Object.assign(new Error('Google account not connected'), { code: 'NOT_CONNECTED' });

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL || 'https://api.aiimin.in/api/google/auth/callback'
    );

    client.setCredentials({
        access_token: tokenRow.access_token_enc ? decrypt(tokenRow.access_token_enc) : tokenRow.access_token,
        refresh_token: tokenRow.refresh_token_enc ? decrypt(tokenRow.refresh_token_enc) : tokenRow.refresh_token,
        expiry_date: tokenRow.expiry_date ? Number(tokenRow.expiry_date) : undefined,
    });

    return { calendar: google.calendar({ version: 'v3', auth: client }), tokenRow };
};

const toGoogleDate = (iso, allDay = false) => (
    allDay ? { date: String(iso).slice(0, 10) } : { dateTime: iso }
);

const mapGoogleEvent = (userId, ev) => ({
    user_id: userId,
    google_event_id: ev.id,
    title: ev.summary || 'Untitled Google event',
    description: ev.description || null,
    start_time: ev.start?.dateTime || `${ev.start?.date}T00:00:00.000Z`,
    end_time: ev.end?.dateTime || ev.start?.dateTime || `${ev.end?.date || ev.start?.date}T23:59:59.000Z`,
    all_day: !!ev.start?.date,
    event_type: 'google',
    source_type: 'imported_calendar',
    location: ev.location || null,
    updated_at: new Date().toISOString(),
});

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

app.get('/sync/status', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { data, error } = await supabase
            .from('user_oauth_tokens')
            .select('scope, refresh_error, updated_at, last_refresh_at')
            .eq('user_id', userId)
            .eq('provider', 'google')
            .maybeSingle();
        if (error) throw error;
        return c.json({
            connected: !!data && !data.refresh_error,
            scopes: data?.scope?.split(' ') || [],
            lastSync: data?.last_refresh_at || data?.updated_at || null,
            error: data?.refresh_error || null,
        });
    } catch (err) {
        return c.json({ connected: false, error: err.message }, 200);
    }
});

app.post('/sync/pull', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json().catch(() => ({}));
        const timeMin = body.start || new Date().toISOString();
        const timeMax = body.end || new Date(Date.now() + 30 * 86400000).toISOString();
        const { calendar } = await createGoogleCalendar(userId);

        const { data } = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 250,
        });

        const rows = (data.items || [])
            .filter(ev => ev.status !== 'cancelled')
            .map(ev => mapGoogleEvent(userId, ev));

        if (rows.length) {
            const { error } = await supabase
                .from('calendar_events')
                .upsert(rows, { onConflict: 'user_id,google_event_id' });
            if (error) throw error;
        }

        return c.json({ imported: rows.length });
    } catch (err) {
        return c.json({ error: err.message, code: err.code }, err.code === 'NOT_CONNECTED' ? 409 : 500);
    }
});

app.post('/sync/push', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json().catch(() => ({}));
        const start = body.start || new Date().toISOString();
        const end = body.end || new Date(Date.now() + 30 * 86400000).toISOString();
        const { calendar } = await createGoogleCalendar(userId);

        const { data: events, error } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('user_id', userId)
            .gte('start_time', start)
            .lte('start_time', end)
            .is('deleted_at', null)
            .in('event_type', ['task', 'todo', 'reminder', 'event']);
        if (error) throw error;

        let pushed = 0;
        for (const ev of events || []) {
            if (ev.google_event_id) continue;
            const created = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                    summary: ev.title,
                    description: ev.description || undefined,
                    location: ev.location || undefined,
                    start: toGoogleDate(ev.start_time, ev.all_day),
                    end: toGoogleDate(ev.end_time || ev.start_time, ev.all_day),
                    extendedProperties: { private: { aiimin_id: ev.id, aiimin_type: ev.event_type || 'event' } },
                },
            });
            await supabase
                .from('calendar_events')
                .update({ google_event_id: created.data.id, source_type: 'user', updated_at: new Date().toISOString() })
                .eq('id', ev.id)
                .eq('user_id', userId);
            pushed += 1;
        }

        return c.json({ pushed });
    } catch (err) {
        return c.json({ error: err.message, code: err.code }, err.code === 'NOT_CONNECTED' ? 409 : 500);
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
