"use strict";

import { Router } from "express";
import { 
  getMyProfile, 
  updateMyProfile 
} from "../controllers/perfilRoutes.controller.js";

import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

// Middleware global para asegurar que el usuario esté autenticado
router.use(authenticateJwt);

/**
 * Rutas de perfil de usuario
 * - Solo el usuario autenticado puede ver y editar su propio perfil
 */

// Obtener perfil del usuario autenticado
router.get("/", getMyProfile);

// Actualizar perfil del usuario autenticado
router.put("/", updateMyProfile);

export default router;
