import { Router } from "express";
import { ping, getRoot } from "../controllers/index.controller.js";

const router = Router();

router.get('/', getRoot);

router.get('/ping', ping);

export default router;
