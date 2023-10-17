import { Router } from "express";
import { createSession, statusSession, statusSessionGet } from "../controllers/wts_sessions.controller.js";

export const sessionsRoutes = Router();

sessionsRoutes.post('/wts_sessions', createSession);
sessionsRoutes.post('/wts_status', statusSession);


export const sessionsRoutesGet = Router();

sessionsRoutesGet.get('/status', statusSessionGet);