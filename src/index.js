import app from './app.js';
import { PORT } from './config.js';
import { WhatsappSessionManager } from './msg_controllers/client_controller.js';

export const wtsSessionManager = new WhatsappSessionManager();

app.listen(PORT)

console.log('Server running at ' + new Date().toLocaleString());
console.log(`Server running on port ${PORT}`);
