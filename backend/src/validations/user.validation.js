const { body, validationResult } = require('express-validator');

const validarActualizacionPerfil = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

  body('correo')
    .isEmail().withMessage('El correo debe ser válido'),

  body('telefono')
    .optional()
    .isNumeric().withMessage('El teléfono debe contener solo números'),

  body('direccion')
    .optional()
    .isLength({ max: 255 }).withMessage('Máximo 255 caracteres'),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];

module.exports = {
  validarActualizacionPerfil
};
