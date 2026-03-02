/**
 * middleware/correlationId.js
 *
 * Attaches a UUID correlation ID to every request.
 * Used by Winston logger for tracing across async log lines.
 */
import { randomUUID } from 'crypto';

export const correlationId = (req, res, next) => {
    req.correlationId = req.headers['x-correlation-id'] || randomUUID();
    res.setHeader('X-Correlation-ID', req.correlationId);
    next();
};
