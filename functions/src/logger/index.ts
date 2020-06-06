import { createLogger, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

export const logger = createLogger({
  level: 'debug',
  transports: [isDev ? new transports.Console() : new LoggingWinston()],
});
