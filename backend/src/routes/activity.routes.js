"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  updateActivity,
} from "../controllers/activity.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", getActivities);
router.get("/:id", getActivityById);

// Solo los administradores (directiva) pueden crear, editar y eliminar actividades
router.use(isAdmin);

router.post("/", createActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
