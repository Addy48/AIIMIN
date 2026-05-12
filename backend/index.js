import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

import authRoutes from './routes/auth.js';
import dailyLogsRoutes from './routes/dailyLogs.js';
import dashboardRoutes from './routes/dashboard.js';
import tasksRoutes from './routes/tasks.js';
import googleAuthRoutes from './routes/googleAuth.js';
import calendarRoutes from './routes/calendar.js';
import notificationRoutes from './routes/notifications.js';
import accountRoutes from './routes/account.js';
import healthRoutes from './routes/health.js';
import habitsRoutes from './routes/habits.js';
import labRoutes from './routes/lab.js';
import placementsRoutes from './routes/placements.js';
import wealthRoutes from './routes/wealth.js';
import sportsRoutes from './routes/sports.js';
import intelligenceRoutes from './routes/intelligence.js';

const api = new Hono();

// ─── Middleware ─────────────────────────────────────────────
// Only use verbose logger in non-production environments to avoid log noise and costs
if (process.env.NODE_ENV !== 'production') {
    const { logger } = await import('hono/logger');
    api.use('*', logger());
}
api.use('*', secureHeaders());

// ─── CORS ─────────────────────────────────────────────────────
api.use('*', cors({
    origin: (origin) => origin,
    credentials: true,
}));

// ─── Fast Health Check ────────────────────────────
api.route('/health', healthRoutes);

// ─── Routes ───────────────────────────────────────────────────
api.route('/auth', authRoutes);
api.route('/daily-logs', dailyLogsRoutes);
api.route('/dashboard', dashboardRoutes);
api.route('/tasks', tasksRoutes);
api.route('/google', googleAuthRoutes);
api.route('/calendar', calendarRoutes);
api.route('/notifications', notificationRoutes);
api.route('/account', accountRoutes);
api.route('/habits', habitsRoutes);
api.route('/lab', labRoutes);
api.route('/placements', placementsRoutes);
api.route('/wealth', wealthRoutes);
api.route('/sports', sportsRoutes);
api.route('/intelligence', intelligenceRoutes);

// ─── 404 ──────────────────────────────────────────────────────
api.notFound((c) => {
    return c.json({ error: 'Route not found' }, 404);
});

// ─── Global error handler ─────────────────────────────────────
api.onError((err, c) => {
    console.error('[SERVER ERROR]:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

// ─── Root App mounting api ───────────────────────────────────
const app = new Hono();
app.route('/api', api);

// Redirect root-level /google/auth/callback to /api/google/auth/callback
app.get('/google/auth/callback', async (c) => {
    const query = c.req.url.split('?')[1] || '';
    return c.redirect(`/api/google/auth/callback${query ? '?' + query : ''}`);
});

// ─── AWS Lambda Handler ────────────────────────────────────────────
export const handler = handle(app);

// ─── Cloudflare Worker compatibility wrapper ───────────────────────
export default {
    async fetch(request, env, ctx) {
        globalThis.process = globalThis.process || {};
        globalThis.process.env = { ...globalThis.process.env, ...env };
        return app.fetch(request, env, ctx);
    }
};

// ─── Local Server Execution (npm run dev) ─────────────────────────
if (process.env.NODE_ENV !== 'production' && typeof process !== 'undefined' && process.release) {
    const { serve } = await import('@hono/node-server');
    const port = process.env.PORT || 5002;
    console.log(`[LOCAL DEV] Starting Node API server on port ${port}...`);
    serve({ fetch: app.fetch, port });
}


