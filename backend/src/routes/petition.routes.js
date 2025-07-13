"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { isVecino } from "../middleware/authorization.middleware.js";
import { getPetition, getPetitionId, createPetition, updatePetition, deletePetition, setRevised } from "../controllers/petition.controller.js";

const router = Router();

router.use(authenticateJwt);
router.get("/", getPetition);
router.get("/:id", getPetitionId);
router.post("/", isVecino, createPetition);
router.put("/:id", isVecino, updatePetition); 
router.put("/setRevised/:id", isAdmin, setRevised);

router.delete("/:id", isVecino, deletePetition);

export default router;