import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

export const config = {
    runtime: 'nodejs'
};

const app = new Hono().basePath('/api');

app.use('*', async (c, next) => {
    console.log(`[HONO] ${c.req.method} ${c.req.path}`);
    await next();
});

app.use('*', secureHeaders());

app.use('*', cors({
    origin: (origin) => origin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
}));

// ── INSTANT health check — loaded eagerly (tiny, no DB deps) ──
app.get('/health', (c) => c.json({ status: 'ok', ts: Date.now() }));

// ── Auth routes — loaded eagerly (small, critical for every user action) ──
import authRoutes from '../server/routes/auth.js';
app.route('/auth', authRoutes);

// ── Lazy sub-router: all other routes loaded on first hit ──
// Caches loaded routers so imports only happen once per warm instance
const cache = {};

async function loadRouter(name) {
    if (!cache[name]) {
        const routeMap = {
            'daily-logs':    () => import('../server/routes/dailyLogs.js'),
            'dashboard':     () => import('../server/routes/dashboard.js'),
            'tasks':         () => import('../server/routes/tasks.js'),
            'google':        () => import('../server/routes/googleAuth.js'),
            'calendar':      () => import('../server/routes/calendar.js'),
            'notifications': () => import('../server/routes/notifications.js'),
            'account':       () => import('../server/routes/account.js'),
            'habits':        () => import('../server/routes/habits.js'),
            'lab':           () => import('../server/routes/lab.js'),
            'placements':    () => import('../server/routes/placements.js'),
            'wealth':        () => import('../server/routes/wealth.js'),
            'sports':        () => import('../server/routes/sports.js'),
            'intelligence':  () => import('../server/routes/intelligence.js'),
            'blob':          () => import('../server/services/blobService.js'),
        };
        const loader = routeMap[name];
        if (!loader) return null;
        const mod = await loader();
        cache[name] = mod.default;
    }
    return cache[name];
}

// Single catch-all middleware that lazily loads the right sub-router
app.all('/:prefix{[a-z-]+}/*', async (c, next) => {
    const prefix = c.req.param('prefix');
    const subRouter = await loadRouter(prefix);
    if (!subRouter) return next();

    // Strip the basePath (/api) + prefix to get the sub-path for the subrouter
    const fullPath = c.req.path; // e.g. /api/wealth/transactions
    const subPath = fullPath.replace(new RegExp(`^/api/${prefix}`), '') || '/';
    
    // Build a new Request targeting the sub-router's path
    const url = new URL(c.req.url);
    url.pathname = subPath;
    const newReq = new Request(url.toString(), {
        method: c.req.method,
        headers: c.req.raw.headers,
        body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : c.req.raw.body,
    });

    return subRouter.fetch(newReq);
});

// Also handle /:prefix with no trailing path
app.all('/:prefix{[a-z-]+}', async (c, next) => {
    const prefix = c.req.param('prefix');
    // Skip already-registered routes
    if (prefix === 'health' || prefix === 'auth') return next();
    
    const subRouter = await loadRouter(prefix);
    if (!subRouter) return next();

    const url = new URL(c.req.url);
    url.pathname = '/';
    const newReq = new Request(url.toString(), {
        method: c.req.method,
        headers: c.req.raw.headers,
        body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : c.req.raw.body,
    });
    return subRouter.fetch(newReq);
});

app.notFound((c) => c.json({ error: 'Route not found', path: c.req.path }, 404));

app.onError((err, c) => {
    console.error('[SERVER ERROR]:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export const honoApp = app;
export default handle(app);
