import express from 'express';
import pool from '../db.js';

const router = express.Router();

/**
 * GET /health
 * Comprehensive health check for application dependencies.
 */
router.get('/health', async (req, res) => {
    let dbStatus = 'connected';
    let oauthStatus = 'configured';
    let overallStatus = 'ok';

    // Check DB
    try {
        await pool.query('SELECT 1');
    } catch (e) {
        dbStatus = 'error';
        overallStatus = 'degraded';
    }

    // Check OAuth Config
    const hasOauth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI;
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

    res.status(overallStatus === 'ok' ? 200 : 503).json(payload);
});

/**
 * GET /ready
 * Lightweight liveness probe for Railway container orchestrator.
 */
router.get('/ready', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ ready: true });
    } catch (e) {
        res.status(503).json({ ready: false });
    }
});

export default router;
