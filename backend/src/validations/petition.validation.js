"use strict";

import Joi from "joi";

export const createValidation = Joi.object({
    title: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .allow("")
        .messages({
            "string.patter.base": "El titulo solo puede contener letras y numeros.",
            "string.min": "El titulo deve tener almenos 3 caracteres",
            "string.max": "El titulo no puede exceder los 50 caracteres.",
        }),
    description: Joi.string()
        .min(50)
        .max(400)
        .required()
        .messages({
            "string.min": "La descripcion deve tener almenos 50 caracteres",
            "string.max": "La descripcion no puede exceder los 400 caracteres.",
            "string.empty": "La descripcion es obligatorio",
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
            "string.patter.base": "El titulo solo puede contener letras y numeros.",
            "string.min": "El titulo deve tener almenos 3 caracteres",
            "string.max": "El titulo no puede exceder los 50 caracteres.",
        }),
    description: Joi.string()
        .min(50)
        .max(400)
        .messages({
            "string.min": "La descripcion deve tener almenos 50 caracteres",
            "string.max": "La descripcion no puede exceder los 400 caracteres.",
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
            "string.empty": "La estado de revision es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        "object.unkown": "No se permiten campos adicionales.",
    });