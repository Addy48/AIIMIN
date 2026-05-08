import logger from '../lib/logger.js';

export const requestLoggerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const latency = Date.now() - start;

        const logData = {
            correlationId: req.correlationId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            latency,
            origin: req.headers.origin || '-',
            'user-agent': req.headers['user-agent'] || '-'
        };

        if (res.statusCode >= 500) {
            logger.error(`[REQUEST API ERROR] ${req.method} ${req.path}`, logData);
        } else if (res.statusCode >= 400) {
            logger.warn(`[REQUEST API WARN] ${req.method} ${req.path}`, logData);
        } else {
            logger.info(`[REQUEST API INFO] ${req.method} ${req.path}`, logData);
        }
    });
    next();
};
