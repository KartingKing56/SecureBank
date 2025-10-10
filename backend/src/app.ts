import express from 'express';
import pinoHttp from 'pino-http';
import { securityMiddleware } from './config/security';
import { routes } from './routes';
import { apiLimiter } from './middlewares/rateLimit';
import { notFound, errorHandler } from './middlewares/errors';
import { logger } from './config/logger';
import { beneficiaries } from './routes/beneficiaries';
import { transactions } from './routes/transactions';

export function buildApp() {
  const app = express();
  app.disable('x-powered-by');

  app.use(pinoHttp({ logger }));

  app.use(securityMiddleware());

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api', apiLimiter);

  // Routes
  app.use('/api', routes);
  app.use('/api', beneficiaries);
  app.use('/api', transactions);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
