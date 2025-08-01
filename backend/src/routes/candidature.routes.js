"use strict";

import { Router } from "express";
import {
  registerCandidature,
  getCandidaturesByElection,
} from "../controllers/candidature.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.post("/", registerCandidature);
router.get("/eleccion/:id", isAdmin, getCandidaturesByElection);

export default router;