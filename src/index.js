import app from './app.js';
import { PORT } from './config.js';
import { WhatsappSessionManager } from './msg_controllers/client_controller.js';
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

app.listen(PORT)
logger.info('✅ Server running at ' + new Date().toLocaleString());
logger.info(`Server running on port ${PORT}`);
