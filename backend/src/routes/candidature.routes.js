"use strict";

import { Router } from "express";
import { registerCandidature } from "../controllers/candidature.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Verifica que el usuario esté autenticado y que el usuario tenga rol de administrador
router.use(authenticateJwt, isAdmin);

// Permite registrar una candidatura en una elección.
router.post("/", registerCandidature);

export default router;

