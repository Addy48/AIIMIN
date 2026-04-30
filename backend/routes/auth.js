import { Hono } from 'hono';
import { supabase } from '../lib/db.js';

const app = new Hono();

/**
 * GET /auth/resolve?identifier=...
 * Resolves a username or email to the actual email address for Supabase login.
 */
app.get('/resolve', async (c) => {
    const identifier = c.req.query('identifier');

    if (!identifier) {
        return c.json({ error: 'Identifier is required' }, 400);
    }

    // If it's already an email, just return it
    if (identifier.includes('@')) {
        return c.json({ email: identifier.toLowerCase() });
    }

    try {
        // Equivalent to SELECT email FROM users WHERE LOWER(username) = LOWER($1)
        const { data, error } = await supabase
            .from('users')
            .select('email')
            .ilike('username', identifier)
            .maybeSingle();

        if (error) throw error;
        if (!data) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ email: data.email });
    } catch (err) {
        console.error('[auth/resolve] error:', err.message);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default app;
