import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import logger from './lib/logger.js';

import { correlationIdMiddleware } from './middleware/correlationId.js';
import { requestLoggerMiddleware } from './middleware/requestLogger.js';
import { globalErrorHandler } from './middleware/errorHandler.js';

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

dotenv.config();

// ─── STARTUP CHECKS ───────────────────────────────────────────
const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATABASE_URL',
    'TOKEN_ENCRYPTION_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
];

const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
    console.error(`[BOOT ERROR] Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('[BOOT ERROR] Server refusing to start.');
    process.exit(1);
}

const app = express();

// ─── Trust Railway's reverse proxy (fixes express-rate-limit ERR_ERL_UNEXPECTED_X_FORWARDED_FOR)
app.set('trust proxy', true);
console.log('[CONFIG] Proxy trust enabled:', app.get('trust proxy'));

// ─── Fast Health Check (Top Level) ────────────────────────────
app.use('/', healthRoutes);

// ─── Correlation ID ──────────────────────────────────────────
app.use(correlationIdMiddleware);

// ─── Security Headers (helmet) ────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],  // inline styles needed for React
            imgSrc: ["'self'", 'data:', 'https://lh3.googleusercontent.com'],
            frameSrc: ["'none'"],
            connectSrc: ["'self'", 'https://accounts.google.com', process.env.SUPABASE_URL, 'http://localhost:5000', 'http://127.0.0.1:5000', 'https://api.aiimin.in'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'none'"],
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: process.env.NODE_ENV === 'production'
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    crossOriginEmbedderPolicy: false,
}));

// ─── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:3000',
].filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) cb(null, true);
        else cb(null, allowedOrigins[0]);
    },
    credentials: true,
}));

// ─── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));

// ─── Request logging (Winston via JSON in prod) ───────────────
app.use(requestLoggerMiddleware);

// ─── Rate limiting (trust proxy must be set before these) ───────────────────
// General API — 200 req/min per IP
const apiLimiter = rateLimit({
    windowMs: 60_000, max: 200,
    standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
    validate: { trustProxy: false },
});
// Auth routes — 50 req/15min (login, token refresh)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 50,
    standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many auth requests. Please wait.' },
    validate: { trustProxy: false },
});
// Signup — tightest limit
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 10,
    standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many attempts. Protection active.' },
    validate: { trustProxy: false },
});
// OAuth — generous limit so Google redirect loops don't block users
const oauthLimiter = rateLimit({
    windowMs: 60_000, max: 60,
    standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many OAuth attempts. Please wait.' },
    validate: { trustProxy: false },
});

app.use('/auth/signup', signupLimiter);   // most restrictive first
app.use('/auth', authLimiter);            // covers /auth/google etc.
app.use('/google', oauthLimiter);         // OAuth callback
app.use('/', apiLimiter);                 // catch-all



// ─── Routes ───────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/daily-logs', dailyLogsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/tasks', tasksRoutes);
app.use('/', googleAuthRoutes);
app.use('/calendar', calendarRoutes);
app.use('/notifications', notificationRoutes);
app.use('/account', accountRoutes);
app.use('/habits', habitsRoutes);

// ─── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`[BOOT SUCCESS] AIIMIN Backend v2.1.0 cleanly bound to port ${PORT}`);
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
