"use strict";

import { Router } from "express";
import { createElection, getActiveElections } from "../controllers/election.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Verifica que el usuario esté autenticado y que el usuario tenga rol de administrador
router.use(authenticateJwt, isAdmin);

//Permite crear una nueva elección.
router.post("/", createElection);

// Permite consultar todas las elecciones activas.
router.get("/", authenticateJwt, getActiveElections);

export default router;

