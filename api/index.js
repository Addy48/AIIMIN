import { Hono } from 'hono';
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
    exposeHeaders: ['set-auth-token', 'Set-Auth-Token'],
    credentials: true,
}));

import { pool } from '../server/lib/db.js';

// ── INSTANT health check ──
app.get('/health', (c) => c.json({ status: 'ok', ts: Date.now() }));

// ── Supabase Keepalive (CRON) ──
import { getSupabaseAdmin } from '../server/lib/supabaseAdmin.js';
app.get('/keepalive', async (c) => {
    try {
        await pool.query('SELECT 1');
        // Also ping via Supabase client to ensure REST API registers activity
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.from('users').select('id').limit(1);
        if (error) console.error('Supabase REST ping error:', error);
        return c.json({ status: 'alive', message: 'Supabase pinged successfully', ts: Date.now() });
    } catch (err) {
        return c.json({ status: 'error', message: err.message }, 500);
    }
});

// ── Auth routes — custom AIIMIN endpoints + Better Auth catch-all ──
import authRoutes from '../server/routes/auth.js';
import { auth as betterAuth } from '../server/lib/auth.js';
import { authCredentialLimiter } from '../server/middleware/rateLimiter.js';

app.route('/auth', authRoutes);

app.on(['GET', 'POST'], '/auth/*', authCredentialLimiter, async (c) => betterAuth.handler(c.req.raw));

// ── Lazy route cache ──
const cache = {};
const routeMap = {
    'daily-logs':    () => import('../server/routes/dailyLogs.js'),
    'dashboard':     () => import('../server/routes/dashboard.js'),
    'tasks':         () => import('../server/routes/tasks.js'),
    'google':        () => import('../server/routes/googleAuth.js'),
    'calendar':      () => import('../server/routes/calendar.js'),
    'notifications': () => import('../server/routes/notifications.js'),
    'account':       () => import('../server/routes/account.js'),
    'habits':        () => import('../server/routes/habits.js'),
    'goals':         () => import('../server/routes/goals.js'),
    'family':        () => import('../server/routes/family.js'),
    'lab':           () => import('../server/routes/lab.js'),
    'placements':    () => import('../server/routes/placements.js'),
    'wealth':        () => import('../server/routes/wealth.js'),
    'sports':        () => import('../server/routes/sports.js'),
    'intelligence':  () => import('../server/routes/intelligence.js'),
    'ats':           () => import('../server/routes/ats.js'),
    'blob':          () => import('../server/services/blobService.js'),
    'feedback':      () => import('../server/routes/feedback.js'),
    'waitlist':      () => import('../server/routes/waitlist.js'),
    'admin':         () => import('../server/routes/admin.js'),
    'cron':          () => import('../server/routes/cron.js'),
    'billing':       () => import('../server/routes/billing.js'),
    'discipline':    () => import('../server/routes/discipline.js'),
    'focus':         () => import('../server/routes/focus.js'),
};

async function loadRouter(name) {
    if (!cache[name]) {
        const loader = routeMap[name];
        if (!loader) return null;
        const mod = await loader();
        cache[name] = mod.default;
    }
    return cache[name];
}

// Catch-all for lazy routes
app.all('*', async (c) => {
    const path = c.req.path; // e.g. /api/wealth/transactions
    const match = path.match(/^\/api\/([a-z-]+)(\/.*)?$/);
    if (!match) return c.json({ error: 'Route not found' }, 404);

    const prefix = match[1];
    const subPath = match[2] || '/';

    const subRouter = await loadRouter(prefix);
    if (!subRouter) return c.json({ error: 'Route not found' }, 404);

    // Forward request to sub-router with adjusted path
    const url = new URL(c.req.url);
    url.pathname = subPath;
    const newReq = new Request(url.toString(), {
        method:  c.req.method,
        headers: c.req.raw.headers,
        body:    ['GET', 'HEAD'].includes(c.req.method) ? undefined : c.req.raw.body,
        duplex:  'half',
    });

    return subRouter.fetch(newReq);
});

app.onError((err, c) => {
    console.error('[SERVER ERROR]:', err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

// ── Node.js-compatible handler for @vercel/node ──
// Converts Web API Request/Response <-> Node.js IncomingMessage/ServerResponse
export default async function handler(req, res) {
    try {
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
        const url = `${protocol}://${host}${req.url}`;

        // Read body from Node.js stream
        const body = await new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks)));
            req.on('error', reject);
        });

        // Build Web API Request
        const webReq = new Request(url, {
            method:  req.method,
            headers: req.headers,
            body:    body.length > 0 ? body : undefined,
        });

        // Run through Hono
        const webRes = await app.fetch(webReq);

        // Write status + headers back to Node.js response
        res.statusCode = webRes.status;
        const setCookies = typeof webRes.headers.getSetCookie === 'function'
            ? webRes.headers.getSetCookie()
            : [];
        webRes.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') return;
            res.setHeader(key, value);
        });
        if (setCookies.length > 0) {
            res.setHeader('Set-Cookie', setCookies);
        }

        // Write body
        const arrayBuffer = await webRes.arrayBuffer();
        res.end(Buffer.from(arrayBuffer));
    } catch (err) {
        console.error('[HANDLER ERROR]:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
    }
}
