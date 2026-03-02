import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { randomUUID } from 'crypto';
import logger from './lib/logger.js';

import authRoutes from './routes/auth.js';
import dailyLogsRoutes from './routes/dailyLogs.js';
import goalsRoutes from './routes/goals.js';
import pomodoroRoutes from './routes/pomodoro.js';
import moneyRoutes from './routes/money.js';
import winsRoutes from './routes/wins.js';
import dashboardRoutes from './routes/dashboard.js';
import youtubeRoutes from './routes/youtube.js';
import googleAuthRoutes from './routes/googleAuth.js';
import calendarRoutes from './routes/calendar.js';
import notificationRoutes from './routes/notifications.js';
import commitmentRoutes from './routes/commitment.js';
import driftRoutes from './routes/drift.js';
import accountRoutes from './routes/account.js';

dotenv.config();

const app = express();

// ─── Correlation ID ──────────────────────────────────────────
app.use((req, res, next) => {
    req.correlationId = req.headers['x-correlation-id'] || randomUUID();
    res.setHeader('X-Correlation-ID', req.correlationId);
    next();
});

// ─── Security Headers (helmet) ────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],  // inline styles needed for React
            imgSrc: ["'self'", 'data:', 'https://lh3.googleusercontent.com', 'https://i.ytimg.com'],
            frameSrc: ['https://www.youtube.com'],    // YouTube embeds
            connectSrc: ["'self'", 'https://accounts.google.com', process.env.SUPABASE_URL],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: process.env.NODE_ENV === 'production'
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    crossOriginEmbedderPolicy: false, // Required for YouTube iframes
}));

// ─── CORS ─────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// ─── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));

// ─── Request logging (Winston via JSON in prod) ───────────────
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'http';
        logger[level] || logger.info;
        logger.info(`${req.method} ${req.path} ${res.statusCode} ${ms}ms`, {
            correlationId: req.correlationId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            ms,
        });
    });
    next();
});

// ─── Rate limiting ────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 60_000, max: 100,
    standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});
const oauthLimiter = rateLimit({
    windowMs: 60_000, max: 30,
    message: { error: 'Too many OAuth requests.' },
});
app.use('/google', oauthLimiter);
app.use('/', apiLimiter);

// ─── Health ───────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', version: '2.1.0' }));

// ─── Routes ───────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/daily-logs', dailyLogsRoutes);
app.use('/goals', goalsRoutes);
app.use('/pomodoro-sessions', pomodoroRoutes);
app.use('/money', moneyRoutes);
app.use('/wins', winsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/youtube', youtubeRoutes);
app.use('/google', googleAuthRoutes);
app.use('/calendar', calendarRoutes);
app.use('/notifications', notificationRoutes);
app.use('/commitment', commitmentRoutes);
app.use('/drift', driftRoutes);
app.use('/account', accountRoutes);

// ─── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
    logger.error('Unhandled error', {
        correlationId: req.correlationId,
        error: err.message,
        stack: err.stack,
    });
    res.status(500).json({ error: 'Internal server error', correlationId: req.correlationId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`AIIMIN Backend v2.1.0 running on port ${PORT}`, {
        env: process.env.NODE_ENV || 'development',
        port: PORT,
    });
});
