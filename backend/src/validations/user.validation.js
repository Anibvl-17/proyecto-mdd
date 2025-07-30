"use strict";

import Joi from "joi";

const domainEmailValidator = (value, helpers) => {
  if (!value.endsWith("@gmail.com") && !value.endsWith("@gmail.cl")) {
    return helpers.message(
      "El correo electrónico debe finalizar en @gmail.com o @gmail.cl."
    );
  }
  return value;
};

// -------------------------
// Validación para actualización de perfil de usuario
// -------------------------
export const updateProfileValidation = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre no puede exceder los 50 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "El correo electrónico es obligatorio.",
      "string.email": "Debe ingresar un correo electrónico válido.",
    })
    .custom(domainEmailValidator, "Validación de dominio de correo"),

  phone: Joi.string()
    .pattern(/^\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base": "El teléfono debe tener 9 dígitos numéricos.",
    }),

  address: Joi.string()
    .max(100)
    .optional()
    .messages({
      "string.max": "La dirección no puede exceder los 100 caracteres.",
    }),
})
.unknown(false)
.messages({
  "object.unknown": "No se permiten campos adicionales.",
});
