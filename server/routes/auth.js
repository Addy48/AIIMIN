import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

const app = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'aiimin_super_secret_dev_key';
const COOKIE_NAME = 'aiimin_session';

/**
 * GET /auth/resolve?identifier=...
 * Resolves a username or email to the actual email address for login.
 */
app.get('/resolve', async (c) => {
    const identifier = c.req.query('identifier');

    if (!identifier) {
        return c.json({ error: 'Identifier is required' }, 400);
    }

    if (identifier.includes('@')) {
        return c.json({ email: identifier.toLowerCase() });
    }

    try {
        const { rows } = await pool.query(
            'SELECT email FROM users WHERE LOWER(username) = LOWER($1)',
            [identifier]
        );

        if (rows.length === 0) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ email: rows[0].email });
    } catch (err) {
        console.error('[auth/resolve] error:', err.message);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

/**
 * POST /auth/signup
 */
app.post('/signup', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password, fullName, username } = body;

        if (!email || !password) {
            return c.json({ error: 'Email and password are required' }, 400);
        }

        // Check if user exists
        const check = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            return c.json({ error: 'User already exists' }, 400);
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        const timezone = 'Asia/Kolkata';

        // Insert new user
        const { rows } = await pool.query(
            `INSERT INTO users (email, full_name, username, timezone, password_hash)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, username`,
            [email, fullName, username, timezone, password_hash]
        );

        const user = rows[0];

        // Create JWT
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

        setCookie(c, COOKIE_NAME, token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60,
        });

        return c.json({ user, token });
    } catch (err) {
        console.error('[auth/signup] error:', err);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

/**
 * POST /auth/login
 */
app.post('/login', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;

        if (!email || !password) {
            return c.json({ error: 'Email and password are required' }, 400);
        }

        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        const user = rows[0];

        // Check password
        if (!user.password_hash) {
            return c.json({ error: 'Please reset your password or login via Google' }, 401);
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        // Create JWT
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

        setCookie(c, COOKIE_NAME, token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60,
        });

        // Omit password hash from response
        const { password_hash, ...safeUser } = user;
        return c.json({ user: safeUser, token });
    } catch (err) {
        console.error('[auth/login] error:', err);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

import { requireAuth } from '../middleware/auth.js';

/**
 * GET /auth/me
 */
app.get('/me', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        
        if (rows.length === 0) {
            return c.json({ user: null }, 401);
        }

        const { password_hash, ...safeUser } = rows[0];
        return c.json({ user: safeUser });
    } catch (err) {
        return c.json({ user: null }, 401);
    }
});

/**
 * POST /auth/logout
 */
app.post('/logout', async (c) => {
    deleteCookie(c, COOKIE_NAME, { path: '/' });
    return c.json({ success: true });
});

export default app;
