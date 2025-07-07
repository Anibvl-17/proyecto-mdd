"use strict";
import Joi from "joi";

// Esquema de validación para las actividades
export const createValidation = Joi.object({
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

// La diferencia entre create y update, es que en update los campos "title" y "date" no
// son obligatorios, ya que si no se especifican se reemplaza con el valor que ya existe
// en la base de datos.
export const updateValidation = Joi.object({
  title: Joi.string().min(5).max(50).messages({
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
  date: Joi.date().greater("now").messages({
    "date.base": "La fecha debe ser de tipo date.",
    "date.greater": "La fecha debe ser futura.",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
