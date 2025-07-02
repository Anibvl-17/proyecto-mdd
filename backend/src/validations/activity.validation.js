"use strict";
import Joi from "joi";

// Esquema de validación para las actividades
export const activityValidation = Joi.object({
  title: Joi.string().min(5).max(50).required().messages({
    "any.required": "El título es obligatorio.",
    "string.base": "El título debe ser de tipo string.",
    "string.empty": "El título no puede estar vacío.",
    "string.min": "El título debe tener al menos 5 caracteres",
    "string.max": "El título no puede exceder los 50 caracteres",
  }),
  description: Joi.string().allow("").max(250).messages({
    "string.base": "La descripción debe ser de tipo string.",
    "string.max": "La descripción no puede exceder los 250 caracteres.",
  }),
  // NOTA: definir formato de la fecha, para validar correctamente
  date: Joi.date().required().greater("now").messages({
    "any.required": "La fecha es obligatoria.",
    "date.base": "La fecha debe ser de tipo date.",
    "date.greater": "La fecha debe ser futura.",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
