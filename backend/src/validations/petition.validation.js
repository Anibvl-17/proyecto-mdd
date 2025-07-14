"use strict";

import Joi from "joi";

export const createValidation = Joi.object({
    title: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .allow("")
        .messages({
            "string.patter.base": "El título solo puede contener letras y números.",
            "string.min": "El título debe tener al menos 3 caracteres.",
            "string.max": "El título no puede exceder los 50 caracteres.",
        }),
    description: Joi.string()
        .min(50)
        .max(400)
        .required()
        .messages({
            "string.min": "La descripción debe tener al menos 50 caracteres.",
            "string.max": "La descripción no puede exceder los 400 caracteres.",
            "string.empty": "La descripción es obligatoria.",
        }),
})
    .unknown(false)
    .messages({
        "object.unkown": "No se permiten campos adicionales.",
    });

export const updateValidation = Joi.object({
    title: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .allow("")
        .messages({
            "string.patter.base": "El título solo puede contener letras y números.",
            "string.min": "El título debe tener al menos 3 caracteres.",
            "string.max": "El título no puede exceder los 50 caracteres.",
        }),
    description: Joi.string()
        .min(50)
        .max(400)
        .messages({
            "string.min": "La descripción debe tener al menos 50 caracteres.",
            "string.max": "La descripción no puede exceder los 400 caracteres.",
        }),
})
    .unknown(false)
    .messages({
        "object.unkown": "No se permiten campos adicionales.",
    });

export const updateRevised = Joi.object({
    revised: Joi.boolean()
        .required()
        .messages({
            "string.empty": "El estado de revisión es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        "object.unkown": "No se permiten campos adicionales.",
    });