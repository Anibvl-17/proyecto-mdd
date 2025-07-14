"use strict";

import Joi from "joi";

//Validación para crear una nueva elección
export const createElectionValidation = Joi.object({
  fecha: Joi.date().greater("now").required(), 
  periodo: Joi.number().valid(3, 4).required(), 
});

//Validación para registrar una candidatura
export const registerCandidatureValidation = Joi.object({
  vecinoId: Joi.number().required(),   
  eleccionId: Joi.number().required(), 
});

// Validación para registrar un voto.
export const registerVoteValidation = Joi.object({
  vecinoId: Joi.number().required(),   
  eleccionId: Joi.number().required(), 
});

