import { Hono } from 'hono';
import { handle } from 'hono/vercel';
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
import blobService from './services/blobService.js';

export const config = {
    runtime: 'nodejs'
};

const app = new Hono().basePath('/api');

app.use('*', async (c, next) => {
    console.log(`[HONO REQUEST] ${c.req.method} ${c.req.url} - Path: ${c.req.path}`);
    await next();
});

app.use('*', secureHeaders());

app.use('*', cors({
    origin: (origin) => origin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
}));

app.route('/health', healthRoutes);
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
app.route('/sports', sportsRoutes);
app.route('/intelligence', intelligenceRoutes);
app.route('/blob', blobService);

app.notFound((c) => {
    return c.json({ error: 'Route not found' }, 404);
});

app.onError((err, c) => {
    console.error('[SERVER ERROR]:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export const honoApp = app;
export default handle(app);
