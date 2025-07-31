"use strict";

import { Router } from "express";
import { registerVote } from "../controllers/vote.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

//Verifica que el usuario esté autenticado
router.use(authenticateJwt);

// Permite registrar un voto en una elección.
router.post("/", registerVote);

export default router;

