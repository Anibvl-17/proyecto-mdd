"use strict";
import Joi from "joi";

// Esquema de validación para los certificados
export const createValidation = Joi.object({
   direction: Joi.string().max(100).required().messages({
    "any.required": "La dirección es obligatoria.",
    "string.base": "La dirección debe ser de tipo string.",
    "string.empty": "La dirección no puede estar vacía.",
    "string.max": "La dirección no puede exceder los 100 caracteres.",
    }),
    type: Joi.string().valid("residencia").required().messages({
    "any.required": "El tipo es obligatorio.",
    "string.base": "El tipo de certificado debe ser de tipo string.",
    "string.empty": "El tipo de certificado no puede estar vacío.",
    "any.only": "El tipo de certificado debe ser 'residencia'.",
    }),
    reason: Joi.string().required().messages({
    "any.required": "El motivo es obligatorio.",
    "string.base": "El motivo debe ser de tipo string.",
    "string.empty": "El motivo no puede estar vacío.",
    }),
})
   .unknown(false)
   .messages({
    "object.unknown": "No se permiten campos adicionales",
   });