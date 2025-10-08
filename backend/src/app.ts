import express from 'express';
import pinoHttp from 'pino-http';
import { securityMiddleware } from './config/security';
import { routes } from './routes';
import { apiLimiter } from './middlewares/rateLimit';
import { notFound, errorHandler } from './middlewares/errors';
import { logger } from './config/logger';

export function buildApp() {
  const app = express();
  app.disable('x-powered-by');

  app.use(pinoHttp({ logger }));

  app.use(securityMiddleware());

  app.use('/api', apiLimiter);

  // Routes
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
