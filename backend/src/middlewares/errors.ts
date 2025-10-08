import type { Request, Response, NextFunction } from 'express';
import { logger }from '../config/logger'

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ error: 'NotFound' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    const status = err.status ?? 500;
    const message = status === 500 ? 'InternalServerError' : err.message ?? 'Error';
    if (status === 500) logger.error({ err }, 'Unhandled error');
    res.status(status).json({ error: message });
}