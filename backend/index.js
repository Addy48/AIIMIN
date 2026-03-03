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
import adminRoutes from './routes/admin.js';

dotenv.config();

// ─── STARTUP CHECKS ───────────────────────────────────────────
const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATABASE_URL',
    'TOKEN_ENCRYPTION_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI'
];

const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
    console.error(`[BOOT ERROR] Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('[BOOT ERROR] Server refusing to start.');
    process.exit(1);
}

const app = express();

// ─── Fast Health Check (Top Level) ────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        version: '2.1.0',
        uptime: process.uptime()
    });
});

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
            connectSrc: ["'self'", 'https://accounts.google.com', process.env.SUPABASE_URL, 'http://localhost:5000', 'https://api.aiimin.in'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'none'"],
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
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10,
    message: { error: 'Too many attempts. Protection active.' },
});
const oauthLimiter = rateLimit({
    windowMs: 60_000,
    max: 20,
    message: { error: 'Too many OAuth attempts. Please wait.' },
});
app.use('/auth/signup', signupLimiter);
app.use('/google', oauthLimiter);
app.use('/', apiLimiter);



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
app.use('/admin', adminRoutes);

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
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BOOT SUCCESS] AIIMIN Backend v2.1.0 cleanly bound to port ${PORT} on 0.0.0.0`);
    logger.info(`AIIMIN Backend v2.1.0 running on port ${PORT}`, {
        env: process.env.NODE_ENV || 'development',
        port: PORT,
    });
});

server.on('error', (error) => {
    console.error(`[BOOT ERROR] Server failed to start: ${error.message}`);
    if (error.syscall !== 'listen') throw error;
    switch (error.code) {
        case 'EACCES':
            console.error(`[BOOT ERROR] Port ${PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`[BOOT ERROR] Port ${PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
