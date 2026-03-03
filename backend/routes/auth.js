import express from 'express';
import { pool } from '../lib/googleClient.js';

const router = express.Router();

/**
 * GET /auth/resolve?identifier=...
 * Resolves a username or email to the actual email address for Supabase login.
 */
router.get('/resolve', async (req, res) => {
    const { identifier } = req.query;

    if (!identifier) {
        return res.status(400).json({ error: 'Identifier is required' });
    }

    // If it's already an email, just return it
    if (identifier.includes('@')) {
        return res.json({ email: identifier.toLowerCase() });
    }

    try {
        const result = await pool.query(
            'SELECT email FROM users WHERE username = $1 LIMIT 1',
            [identifier]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ email: result.rows[0].email });
    } catch (err) {
        console.error('[auth/resolve] error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
