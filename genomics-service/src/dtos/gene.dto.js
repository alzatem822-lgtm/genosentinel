    const Joi = require('joi');

    // DTO para crear un gen
    const createGeneSchema = Joi.object({
    symbol: Joi.string().max(50).required()
    .messages({
        'string.empty': 'El símbolo del gen es requerido',
        'any.required': 'El símbolo del gen es requerido'
    }),
    fullName: Joi.string().max(255).required()
    .messages({
        'string.empty': 'El nombre completo del gen es requerido',
        'any.required': 'El nombre completo del gen es requerido'
    }),
    functionSummary: Joi.string().allow('', null).optional()
    });

    // DTO para actualizar un gen
    const updateGeneSchema = Joi.object({
    symbol: Joi.string().max(50).optional(),
    fullName: Joi.string().max(255).optional(),
    functionSummary: Joi.string().allow('', null).optional()
    }).min(1);

    module.exports = {
    createGeneSchema,
    updateGeneSchema
    };