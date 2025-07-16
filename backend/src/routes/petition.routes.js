"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { isVecino } from "../middleware/authorization.middleware.js";
import { 
    getAllPetitions, 
    getUserPetitions, 
    createPetition, 
    updatePetition, 
    deletePetition, 
    setRevised 
} from "../controllers/petition.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", isAdmin, getAllPetitions);
router.put("/setRevised/:id", isAdmin, setRevised);

router.get("/getUser", isVecino, getUserPetitions);
router.post("/", isVecino, createPetition);
router.put("/:id", isVecino, updatePetition); 
router.delete("/:id", isVecino, deletePetition);

export default router;