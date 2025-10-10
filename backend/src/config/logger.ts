import pino from 'pino';
import { ENV } from './env';

//--------------------------------------
// Logger file.
//--------------------------------------
export const logger = pino({
  level: ENV.IS_PROD ? 'info' : 'debug',
  ...(ENV.IS_PROD
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true }
        }
      })
});
