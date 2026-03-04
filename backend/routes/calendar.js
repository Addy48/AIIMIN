/**
 * routes/calendar.js
 *
 * Google Calendar integration routes.
 * Uses shared googleClient for token management — no local token logic.
 */
import express from 'express';
import { getCalendarClient, pool } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /calendar/events
 * Today's events for the authenticated user.
 */
router.get('/events', requireAuth, async (req, res) => {
    try {
        const calendar = await getCalendarClient(req.userId);

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startOfDay,
            timeMax: endOfDay,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const formatTime = (isoString) => {
            if (!isoString || isoString.length === 10) return 'All Day';
            return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        };

        const events = (response.data.items || []).map(item => {
            const startTime = item.start.dateTime || item.start.date;
            const endTime = item.end.dateTime || item.end.date;
            const title = (item.summary || '').toLowerCase();
            let type = 'personal';
            if (title.match(/work|focus|study|deep/)) type = 'focus';
            if (title.match(/meet|call|sync|interview|standup/)) type = 'meeting';
            return {
                id: item.id,
                title: item.summary || 'Busy',
                time: `${formatTime(startTime)} – ${formatTime(endTime)}`,
                type,
                allDay: !item.start.dateTime,
            };
        });

        res.json(events);
    } catch (err) {
        const code = err.code || 'UNKNOWN';
        const status = code === 'NOT_CONNECTED' ? 400 : 500;
        res.status(status).json({ error: err.message, code });
    }
});

/**
 * GET /calendar/heatmap?year=YYYY&month=M
 * Per-day behavioral data for the CalendarHeatmap component.
 * Returns all days in the requested month with:
 *   { date, session_count, focus_minutes, commitment_pct, mood_avg }
 */
router.get('/heatmap', requireAuth, async (req, res) => {
    try {
        const year = parseInt(req.query.year || new Date().getFullYear(), 10);
        const month = parseInt(req.query.month || new Date().getMonth() + 1, 10);

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: 'Invalid year or month' });
        }

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().slice(0, 10); // last day

        const result = await pool.query(
            `SELECT
                dl.date::text                                          AS date,
                COALESCE(ps.cycles_completed, 0)                      AS session_count,
                COALESCE(ps.total_focus_minutes, 0)                   AS focus_minutes,
                COALESCE(dc.fulfillment_pct, 0)                       AS commitment_pct,
                ROUND((COALESCE(dl.mood_before,0) + COALESCE(dl.mood_after,0))::numeric
                      / NULLIF((CASE WHEN dl.mood_before IS NOT NULL THEN 1 ELSE 0 END
                              + CASE WHEN dl.mood_after  IS NOT NULL THEN 1 ELSE 0 END), 0), 1)
                                                                       AS mood_avg
             FROM daily_logs dl
             LEFT JOIN pomodoro_sessions ps
               ON ps.user_id = dl.user_id AND ps.date = dl.date
             LEFT JOIN daily_commitments dc
               ON dc.user_id = dl.user_id AND dc.date = dl.date
             WHERE dl.user_id = $1
               AND dl.date BETWEEN $2 AND $3
             ORDER BY dl.date`,
            [req.userId, startDate, endDate]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('[calendar/heatmap]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /calendar/sync
 * Fetches 30 days of events from Google and upserts into calendar_events table.
 */
router.post('/sync', requireAuth, async (req, res) => {
    try {
        const calendar = await getCalendarClient(req.userId);

        const timeMin = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days back
        const timeMax = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(); // 23 days ahead

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            singleEvents: true,
            maxResults: 500,
            orderBy: 'startTime',
        });

        const items = response.data.items || [];
        let synced = 0;

        for (const item of items) {
            if (!item.start) continue;
            await pool.query(
                `INSERT INTO calendar_events (user_id, google_event_id, title, start_time, end_time)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (user_id, google_event_id)
                   DO UPDATE SET title = EXCLUDED.title, start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time`,
                [
                    req.userId,
                    item.id,
                    item.summary || 'Busy',
                    item.start.dateTime || item.start.date,
                    item.end?.dateTime || item.end?.date,
                ]
            ).catch(() => { }); // Skip individual failures
            synced++;
        }

        // Add UNIQUE constraint if not already present (idempotent)
        await pool.query(`
            ALTER TABLE calendar_events
            ADD CONSTRAINT IF NOT EXISTS uq_calendar_event_user_google
            UNIQUE (user_id, google_event_id)
        `).catch(() => { }); // Already exists

        res.json({ synced, total: items.length });
    } catch (err) {
        const code = err.code || 'UNKNOWN';
        const status = code === 'NOT_CONNECTED' ? 400 : 500;
        res.status(status).json({ error: err.message, code });
    }
});

export default router;
