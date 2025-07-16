"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import activityRoutes from "./activity.routes.js";
import petitionRoutes from "./petition.routes.js";
import electionRoutes from "./election.routes.js";
import candidatureRoutes from "./candidature.routes.js";
import voteRoutes from "./vote.routes.js";
import certificateRoutes from "./certificate.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/activities", activityRoutes);
router.use("/petitions", petitionRoutes);
router.use("/elections", electionRoutes);
router.use("/candidatures", candidatureRoutes);
router.use("/votes", voteRoutes);
router.use("/certificates", certificateRoutes);

export default router;