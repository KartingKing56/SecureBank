import https from 'https';
import fs from 'fs';
import { buildApp } from './app';
import { ENV } from './config/env';
import { logger } from './config/logger';
import { connectDB, disconnectDB } from './config/db';

async function main() {
  await connectDB();

  const app = buildApp();

  const key = fs.readFileSync(new URL('../certs/privatekey.pem', import.meta.url));
  const cert = fs.readFileSync(new URL('../certs/certificate.pem', import.meta.url));
  const server = https.createServer({ key, cert }, app);

  server.listen(ENV.PORT, () => {
    logger.info(`HTTPS server listening on https://localhost:${ENV.PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down');
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
