import app from './app.js';
import { PORT } from './config.js';
import { WhatsappSessionManager } from './msg_controllers/client_controller.js';

export const wtsSessionManager = new WhatsappSessionManager();

console.log(wtsSessionManager);
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
console.log(`http://localhost:${PORT}`)
console.log('✅ -- Server running --')
