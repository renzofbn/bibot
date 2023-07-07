import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 3000;
export const ADMIN_PASS= process.env.ADMIN_PASS || 'admin';