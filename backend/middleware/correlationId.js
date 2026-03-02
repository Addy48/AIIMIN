import { randomUUID } from 'crypto';

export const correlationIdMiddleware = (req, res, next) => {
    req.correlationId = req.headers['x-correlation-id'] || randomUUID();
    res.setHeader('x-correlation-id', req.correlationId);
    next();
};
