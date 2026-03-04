/**
 * lib/logger.js
 *
 * Winston structured logger with:
 *  - JSON format in production
 *  - Pretty-print in development
 *  - Correlation ID support (set req.correlationId in middleware)
 *  - Sentry integration for error-level logs
 */
import winston from 'winston';

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

const devFormat = printf(({ level, message, timestamp, correlationId, ...meta }) => {
    const cid = correlationId ? ` [${correlationId}]` : '';
    const meta_ = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
    return `${timestamp} ${level}${cid}: ${message}${meta_}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        process.env.NODE_ENV === 'production' ? json() : combine(colorize(), devFormat)
    ),
    transports: [
        new winston.transports.Console(),
        ...(process.env.NODE_ENV === 'production' ? [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5_000_000, maxFiles: 3 }),
            new winston.transports.File({ filename: 'logs/combined.log', maxsize: 10_000_000, maxFiles: 3 }),
        ] : []),
    ],
});

/**
 * Forward error-level logs to Sentry if configured.
 * Install: npm install @sentry/node
 */
if (process.env.SENTRY_DSN) {
    import('@sentry/node').then(Sentry => {
        Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
        logger.on('data', (log) => {
            if (log.level === 'error') {
                Sentry.captureException(new Error(log.message), { extra: log });
            }
        });
    }).catch(() => { });
}

export default logger;
