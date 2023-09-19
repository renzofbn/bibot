import app from './app.js';
import { PORT } from './config.js';
import { WhatsappSessionManager } from './msg_controllers/client_controller.js';
import winston from 'winston';

export const wtsSessionManager = new WhatsappSessionManager();
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    // Transporte para imprimir registros en la consola
    new winston.transports.Console()
  ],
});

app.listen(PORT)

logger.info('✅ Server running at ' + new Date().toLocaleString());
logger.info(`Server running on port ${PORT}`);
