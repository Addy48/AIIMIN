import { Hono } from 'hono';
import { supabase } from '../lib/db.js';

const app = new Hono();

/**
 * GET /health
 * Comprehensive health check for application dependencies.
 */
app.get('/', async (c) => {
    let dbStatus = 'connected';
    let oauthStatus = 'configured';
    let overallStatus = 'ok';

    // Check DB (simple query to verify link)
    try {
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
    } catch (e) {
        dbStatus = 'error';
        overallStatus = 'degraded';
    }

    // Check OAuth Config
    const hasOauth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
    if (!hasOauth) {
        oauthStatus = 'missing';
        overallStatus = 'degraded';
    }

    const payload = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        services: {
            server: 'running',
            database: dbStatus,
            oauth: oauthStatus
        }
    };

    return c.json(payload, overallStatus === 'ok' ? 200 : 503);
});

/**
 * GET /health/ready
 * Lightweight liveness probe.
 */
app.get('/ready', async (c) => {
    try {
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
        return c.json({ ready: true });
    } catch (e) {
        return c.json({ ready: false }, 503);
    }
});

export default app;
