const express = require('express');
const router = express.Router();

const { getPerfil, updatePerfil } = require('../controllers/perfilController');
const authMiddleware = require('../middlewares/auth');
const { validarActualizacionPerfil } = require('../validations/user.validation');

router.get('/', authMiddleware, getPerfil);
router.put('/', authMiddleware, validarActualizacionPerfil, updatePerfil);

module.exports = router;
