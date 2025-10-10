import https from 'https';
import fs from 'fs';
import path from 'path';
import { buildApp } from './app';
import { ENV } from './config/env';
import { logger } from './config/logger';
import { connectDB, disconnectDB } from './config/db';

//--------------------------------------
// Backend server creation and startup with openssl certs
//--------------------------------------
async function main() {
  await connectDB();

  const app = buildApp();

  const keyPath = path.join(__dirname, '../certs/privatekey.pem');
  const certPath = path.join(__dirname, '../certs/certificate.pem');
  const server = https.createServer(
    { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
    app
  );

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
