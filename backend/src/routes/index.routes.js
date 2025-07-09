"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import activityRoutes from "./activity.routes.js";
import petitionRoutes from "./petition.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/activities", activityRoutes);
router.use("/petitions", petitionRoutes);

export default router;