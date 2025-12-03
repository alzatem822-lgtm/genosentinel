const Joi = require('joi');

// DTO para crear una variante genética
const createVariantSchema = Joi.object({
geneId: Joi.number().integer().positive().required()
    .messages({
    'number.base': 'El ID del gen debe ser un número',
    'any.required': 'El ID del gen es requerido'
    }),
chromosome: Joi.string().max(10).required()
    .messages({
    'string.empty': 'El cromosoma es requerido',
    'any.required': 'El cromosoma es requerido'
    }),
position: Joi.string().max(50).required()
    .messages({
    'string.empty': 'La posición es requerida',
    'any.required': 'La posición es requerida'
    }),
referenceBase: Joi.string().max(255).required()
    .messages({
    'string.empty': 'La base de referencia es requerida',
    'any.required': 'La base de referencia es requerida'
    }),
alternateBase: Joi.string().max(255).required()
    .messages({
    'string.empty': 'La base alternativa es requerida',
    'any.required': 'La base alternativa es requerida'
    }),
impact: Joi.string().max(50).allow('', null).optional()
});

// DTO para actualizar una variante genética
const updateVariantSchema = Joi.object({
geneId: Joi.number().integer().positive().optional(),
chromosome: Joi.string().max(10).optional(),
position: Joi.string().max(50).optional(),
referenceBase: Joi.string().max(255).optional(),
alternateBase: Joi.string().max(255).optional(),
impact: Joi.string().max(50).allow('', null).optional()
}).min(1);

module.exports = {
createVariantSchema,
updateVariantSchema
};