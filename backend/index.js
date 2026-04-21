import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
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

const app = new Hono().basePath('/api');

// ─── STARTUP CHECKS ─────
const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATABASE_URL',
    'TOKEN_ENCRYPTION_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
];

// ─── Middleware ─────────────────────────────────────────────
app.use('*', logger());
app.use('*', secureHeaders());

// ─── CORS ─────────────────────────────────────────────────────
app.use('*', cors({
    origin: (origin) => origin,
    credentials: true,
}));

// ─── Fast Health Check ────────────────────────────
app.route('/health', healthRoutes);

// ─── Routes ───────────────────────────────────────────────────
app.route('/auth', authRoutes);
app.route('/daily-logs', dailyLogsRoutes);
app.route('/dashboard', dashboardRoutes);
app.route('/tasks', tasksRoutes);
app.route('/google', googleAuthRoutes);
app.route('/calendar', calendarRoutes);
app.route('/notifications', notificationRoutes);
app.route('/account', accountRoutes);
app.route('/habits', habitsRoutes);
app.route('/lab', labRoutes);
app.route('/placements', placementsRoutes);
app.route('/wealth', wealthRoutes);

// ─── 404 ──────────────────────────────────────────────────────
app.notFound((c) => {
    return c.json({ error: 'Route not found' }, 404);
});

// ─── Global error handler ─────────────────────────────────────
app.onError((err, c) => {
    console.error('[SERVER ERROR]:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

// ─── Cloudflare Worker Handler ────────────────────────────────────────────
export default {
    async fetch(request, env, ctx) {
        globalThis.process = globalThis.process || {};
        globalThis.process.env = { ...globalThis.process.env, ...env };
        return app.fetch(request, env, ctx);
    },
    async scheduled(event, env, ctx) {
        console.log('[CRON] Starting nightly jobs...');
        try {
            globalThis.process = globalThis.process || {};
            globalThis.process.env = { ...globalThis.process.env, ...env };

            const { runCorrelationEngine } = await import('./jobs/correlationEngine.js');
            const { runRecurringTransactions } = await import('./jobs/recurringTransactions.js');
            const { supabase } = await import('./lib/db.js');

            await Promise.allSettled([
                runCorrelationEngine(supabase),
                runRecurringTransactions(supabase)
            ]);
            
            console.log('[CRON] Finished nightly jobs.');
        } catch (err) {
            console.error('[CRON] Jobs failed:', err);
        }
    }
};
