"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import {
  createCertificate,
  getCertificates,
} from "../controllers/certificate.controller.js"; 

const router = Router();
//Solo los vecinos registrados pueden crear certificados
router.use(authenticateJwt);

router.get("/", getCertificates);
router.post("/", createCertificate);

export default router;


 