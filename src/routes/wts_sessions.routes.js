import { Router } from "express";
import { createSession, statusSession } from "../controllers/wts_sessions.controller.js";

const router = Router();

router.post('/wts_sessions', createSession);
router.post('/wts_status', statusSession);

export default router;
