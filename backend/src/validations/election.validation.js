"use strict";

import Joi from "joi";

//Validación para crear una nueva elección
export const createElectionValidation = Joi.object({
  fecha: Joi.date()
    .required()
    .greater("now")
    .messages({
      "any.required": "La fecha es obligatoria.",
      "date.base": "La fecha debe ser de tipo Date.",
      "date.greater": "La fecha debe ser futura."
    }),
  periodo: Joi.number()
    .valid(3, 4)
    .required()
    .messages({
      "any.required": "El periodo es obligatorio.",
      "number.base": "El periodo debe ser un número.",
      "any.only": "El periodo debe ser 3 o 4 años."
    }),
});


//Validación para registrar una candidatura
export const registerCandidatureValidation = Joi.object({
  vecinoId: Joi.number()
    .required()
    .messages({
      "any.required": "El ID del vecino es obligatorio.",
      "number.base": "El ID del vecino debe ser un número."
    }),
  eleccionId: Joi.number()
    .required()
    .messages({
      "any.required": "El ID de la elección es obligatorio.",
      "number.base": "El ID de la elección debe ser un número."
    }),
});

// Validación para registrar un voto.
export const registerVoteValidation = Joi.object({
  vecinoId: Joi.number()
    .required()
    .messages({
      "any.required": "El ID del vecino es obligatorio.",
      "number.base": "El ID del vecino debe ser un número."
    }),
  eleccionId: Joi.number()
    .required()
    .messages({
      "any.required": "El ID de la elección es obligatorio.",
      "number.base": "El ID de la elección debe ser un número."
    }),
});

