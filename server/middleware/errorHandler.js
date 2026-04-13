import { pool } from '../lib/googleClient.js';
import logger from '../lib/logger.js';

export const globalErrorHandler = async (err, req, res, next) => {
    const errorDetails = {
        correlationId: req.correlationId,
        method: req.method,
        path: req.path,
        error: err.message,
        stack: err.stack,
    };

    // Log the error via winston
    logger.error('Unhandled API Error', errorDetails);

    // Persist to Supabase sequentially (non-blocking if possible, but we don't await res)
    try {
        // Fire and forget so we don't slow down the error response
        pool.query(
            `INSERT INTO api_errors (correlation_id, route, method, message, stack) 
             VALUES ($1, $2, $3, $4, $5)`,
            [req.correlationId, req.path, req.method, err.message, err.stack]
        ).catch(dbErr => console.error('[GlobalErrorHandler] Failed to save to api_errors:', dbErr.message));
    } catch (e) {
        console.error('[GlobalErrorHandler] Failed to trigger query:', e.message);
    }

    // Do not expose internal stack traces to the client
    res.status(500).json({
        error: 'Internal server error',
        correlationId: req.correlationId
    });
};
