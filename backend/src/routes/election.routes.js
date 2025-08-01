"use strict";

import { Router } from "express";
import {
  createElection,
  getActiveElections,
  getAllElections,
  deleteElectionById,
  deactivateElectionById,
  updateElectionById,
} from "../controllers/election.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", isAdmin, createElection);
router.get("/", isAdmin, getAllElections);
router.delete("/:id", isAdmin, deleteElectionById);
router.put("/deactivate/:id", isAdmin, deactivateElectionById);
router.put("/:id", isAdmin, updateElectionById);

router.get("/active", getActiveElections);

export default router;
