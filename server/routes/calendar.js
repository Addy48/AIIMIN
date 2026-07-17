import { Hono } from 'hono';
import { google } from 'googleapis';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { getCalendarClient, getOAuthClient, getIntegrationStatus } from '../lib/googleClient.js';

const app = new Hono();

const SYSTEM_TYPES = ['physical', 'cognitive', 'behavior', 'finance', 'reflection', 'general'];

const DEFAULT_PULL_START = () => new Date(Date.now() - 90 * 86400000).toISOString();
const DEFAULT_PULL_END = () => new Date(Date.now() + 365 * 86400000).toISOString();

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

const mapGoogleTask = (userId, listId, task) => {
    const due = task.due || '';
    const isDateOnly = due.length === 10;
    return {
        user_id: userId,
        google_event_id: `gtask:${listId}:${task.id}`,
        title: task.title || 'Untitled task',
        description: task.notes || null,
        start_time: isDateOnly ? `${due}T00:00:00.000Z` : due,
        end_time: isDateOnly ? `${due}T23:59:59.000Z` : due,
        all_day: isDateOnly,
        event_type: 'task',
        source_type: 'imported_calendar',
        location: null,
        updated_at: new Date().toISOString(),
    };
};

const upsertCalendarRows = async (rows) => {
    if (!rows.length) return;

    const columns = ['user_id', 'google_event_id', 'title', 'description', 'start_time', 'end_time', 'all_day', 'event_type', 'source_type', 'location', 'updated_at'];
    const valuePlaceholders = [];
    const values = [];

    rows.forEach((row) => {
        const placeholders = [];
        columns.forEach((col) => {
            values.push(row[col]);
            placeholders.push(`$${values.length}`);
        });
        valuePlaceholders.push(`(${placeholders.join(', ')})`);
    });

    const query = `
        INSERT INTO public.calendar_events (${columns.join(', ')})
        VALUES ${valuePlaceholders.join(', ')}
        ON CONFLICT (user_id, google_event_id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            start_time = EXCLUDED.start_time,
            end_time = EXCLUDED.end_time,
            all_day = EXCLUDED.all_day,
            event_type = EXCLUDED.event_type,
            source_type = EXCLUDED.source_type,
            location = EXCLUDED.location,
            updated_at = EXCLUDED.updated_at,
            deleted_at = NULL
    `;
    await pool.query(query, values);
};

const pullGoogleCalendarEvents = async (userId, timeMin, timeMax) => {
    const calendar = await getCalendarClient(userId);
    const { data: calList } = await calendar.calendarList.list({ minAccessRole: 'reader' });
    const calendarIds = (calList.items || []).map((c) => c.id).filter(Boolean);
    if (!calendarIds.length) calendarIds.push('primary');

    const seen = new Set();
    const rows = [];

    for (const calendarId of calendarIds) {
        try {
            const { data } = await calendar.events.list({
                calendarId,
                timeMin,
                timeMax,
                singleEvents: true,
                orderBy: 'startTime',
                maxResults: 250,
            });
            for (const ev of data.items || []) {
                if (ev.status === 'cancelled' || seen.has(ev.id)) continue;
                seen.add(ev.id);
                rows.push(mapGoogleEvent(userId, ev));
            }
        } catch (err) {
            console.warn(`[calendar/pull] skip calendar ${calendarId}:`, err.message);
        }
    }

    return rows;
};

const pullGoogleTasks = async (userId, timeMin, timeMax) => {
    const auth = await getOAuthClient(userId);
    const tasksApi = google.tasks({ version: 'v1', auth });
    const rows = [];

    try {
        const { data: listsData } = await tasksApi.tasklists.list({ maxResults: 20 });
        for (const list of listsData.items || []) {
            const { data: tasksData } = await tasksApi.tasks.list({
                tasklist: list.id,
                showCompleted: false,
                showHidden: false,
                dueMin: timeMin,
                dueMax: timeMax,
                maxResults: 100,
            });
            for (const task of tasksData.items || []) {
                if (!task.due) continue;
                rows.push(mapGoogleTask(userId, list.id, task));
            }
        }
    } catch (err) {
        // Older connections may lack tasks.readonly — calendar events still import
        if (err.code !== 403) {
            console.warn('[calendar/pull] tasks import skipped:', err.message);
        }
    }

    return rows;
};

/* ── GET /api/calendar/events ─────────────────────────────── */
app.get('/events', requireAuth, async (c) => {
    try {
        const { start, end } = c.req.query();
        if (!start || !end) return c.json({ error: 'start and end query params required' }, 400);
        const userId = c.get('userId');

        const eventsRes = await pool.query(
            `SELECT * FROM public.calendar_events 
             WHERE user_id = $1 AND start_time >= $2 AND start_time <= $3 AND deleted_at IS NULL
             ORDER BY start_time ASC`,
            [userId, start, end]
        );

        return c.json(eventsRes.rows || []);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

app.get('/sync/status', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const tokenRes = await pool.query(
            `SELECT linked_email, scope, refresh_error, updated_at, last_refresh_at, expiry_date
             FROM public.user_oauth_tokens
             WHERE user_id = $1 AND provider = $2`,
            [userId, 'google']
        );
        const data = tokenRes.rows[0];
        const integration = await getIntegrationStatus(userId, 'google');
        return c.json({
            connected: integration.connected,
            linkedEmail: data?.linked_email || null,
            scopes: data?.scope?.split(' ').filter(Boolean) || integration.scopes || [],
            lastSync: data?.last_refresh_at || data?.updated_at || integration.lastRefresh || null,
            error: integration.error || data?.refresh_error || null,
            hasTasksScope: (data?.scope || '').includes('tasks'),
        });
    } catch (err) {
        return c.json({ connected: false, error: err.message }, 200);
    }
});

app.post('/sync/pull', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json().catch(() => ({}));
        const timeMin = body.start || DEFAULT_PULL_START();
        const timeMax = body.end || DEFAULT_PULL_END();

        const eventRows = await pullGoogleCalendarEvents(userId, timeMin, timeMax);
        const taskRows = await pullGoogleTasks(userId, timeMin, timeMax);
        const rows = [...eventRows, ...taskRows];

        await upsertCalendarRows(rows);

        await pool.query(
            `UPDATE public.user_oauth_tokens
             SET last_refresh_at = NOW(), updated_at = NOW()
             WHERE user_id = $1 AND provider = 'google'`,
            [userId],
        );

        return c.json({
            imported: rows.length,
            events: eventRows.length,
            tasks: taskRows.length,
        });
    } catch (err) {
        return c.json({ error: err.message, code: err.code }, err.code === 'NOT_CONNECTED' ? 409 : 500);
    }
});

app.post('/sync/push', requireAuth, async (c) => {
    // Strictly one-way calendar sync: disable pushing to Google Calendar
    return c.json({ pushed: 0, message: "Push disabled: Calendar sync is strictly one-way (Google -> Dashboard)" });
});

/* ── GET /api/calendar/day/:date ─────────────────────────────── */
app.get('/day/:date', requireAuth, async (c) => {
    try {
        const { date } = c.req.param();
        const userId = c.get('userId');
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;

        const eventsRes = await pool.query(
            `SELECT * FROM public.calendar_events 
             WHERE user_id = $1 AND start_time >= $2 AND start_time <= $3 AND deleted_at IS NULL
             ORDER BY start_time ASC`,
            [userId, startOfDay, endOfDay]
        );

        return c.json(eventsRes.rows || []);
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

        const insertRes = await pool.query(`
            INSERT INTO public.calendar_events (
                user_id, title, description, start_time, end_time, all_day, 
                system_type, tags, color, location, reminder_minutes, 
                recurrence_rule, event_type, source_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'user')
            RETURNING *
        `, [
            userId,
            title,
            description || null,
            start_time,
            end_time || start_time,
            all_day || false,
            system_type || 'general',
            tags || [],
            color || null,
            location || null,
            reminder_minutes || null,
            recurrence_rule ? JSON.stringify(recurrence_rule) : null,
            event_type || 'event'
        ]);

        return c.json(insertRes.rows[0], 201);
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

        const updates = [];
        const values = [id, userId];

        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                values.push(key === 'recurrence_rule' && body[key] ? JSON.stringify(body[key]) : body[key]);
                updates.push(`${key} = $${values.length}`);
            }
        }

        if (updates.length === 0) {
            return c.json({ error: 'No fields to update' }, 400);
        }

        updates.push(`updated_at = NOW()`);

        const updateQuery = `
            UPDATE public.calendar_events 
            SET ${updates.join(', ')} 
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
            RETURNING *
        `;
        const updateRes = await pool.query(updateQuery, values);
        if (updateRes.rows.length === 0) return c.json({ error: 'Event not found' }, 404);
        return c.json(updateRes.rows[0]);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/* ── DELETE /api/calendar/events/:id ────────────────────────── */
app.delete('/events/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');

        await pool.query(
            'UPDATE public.calendar_events SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
            [id, userId]
        );

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
            pool.query(
                'SELECT date::text, mood_before, mood_after FROM public.daily_logs WHERE user_id = $1 AND date >= $2 AND date <= $3',
                [userId, startDate, endDate]
            ),
            pool.query(
                'SELECT date::text, cycles_completed, total_focus_minutes FROM public.pomodoro_sessions WHERE user_id = $1 AND date >= $2 AND date <= $3',
                [userId, startDate, endDate]
            ),
            pool.query(
                'SELECT date::text, fulfillment_pct FROM public.daily_commitments WHERE user_id = $1 AND date >= $2 AND date <= $3',
                [userId, startDate, endDate]
            )
        ]);

        // Merge in JS
        const dataMap = {};
        (logsRes.rows || []).forEach(l => {
            const moodCount = (l.mood_before !== null ? 1 : 0) + (l.mood_after !== null ? 1 : 0);
            const moodAvg = moodCount > 0 ? ((l.mood_before || 0) + (l.mood_after || 0)) / moodCount : 0;
            dataMap[l.date] = { date: l.date, session_count: 0, focus_minutes: 0, commitment_pct: 0, mood_avg: parseFloat(moodAvg.toFixed(1)) };
        });
        (sessionsRes.rows || []).forEach(s => {
            if (!dataMap[s.date]) dataMap[s.date] = { date: s.date, session_count: 0, focus_minutes: 0, commitment_pct: 0, mood_avg: 0 };
            dataMap[s.date].session_count += (s.cycles_completed || 0);
            dataMap[s.date].focus_minutes += (s.total_focus_minutes || 0);
        });
        (commitsRes.rows || []).forEach(dc => {
            if (!dataMap[dc.date]) dataMap[dc.date] = { date: dc.date, session_count: 0, focus_minutes: 0, commitment_pct: 0, mood_avg: 0 };
            dataMap[dc.date].commitment_pct = parseFloat(dc.fulfillment_pct || 0);
        });

        return c.json(Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date)));
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
