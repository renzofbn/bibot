import app from './app.js';
import { WhatsappSessionManager } from './bot_controllers/bot_status.js';
import winston from 'winston';

export const wtsSessionManager = new WhatsappSessionManager();

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.cli(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/server.log' }),
    new winston.transports.Console()
  ],
});

if(process.env.NODE_ENV === 'development') {
  logger.warn('Development mode');
}

app.listen(process.env.PORT)
logger.info('Server running at ' + new Date().toLocaleString());
logger.info(`Server running on port ${process.env.PORT}`);
