"use strict";

import { Router } from "express";

const router = new Router();

const { getPerfil, updatePerfil } = require('../controllers/perfilController');
const authMiddleware = require('../middlewares/auth');
const { validarActualizacionPerfil } = require('../validations/user.validation');

router.

router.get('/', authMiddleware, getPerfil);
router.put('/', authMiddleware, validarActualizacionPerfil, updatePerfil);

module.exports = router;
