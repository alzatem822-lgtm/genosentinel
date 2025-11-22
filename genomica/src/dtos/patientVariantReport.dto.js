const Joi = require('joi');

// DTO para crear un reporte de variante de paciente
const createPatientVariantReportSchema = Joi.object({
patientId: Joi.number().integer().positive().required()
    .messages({
    'number.base': 'El ID del paciente debe ser un número',
    'any.required': 'El ID del paciente es requerido'
    }),
variantId: Joi.number().integer().positive().required()
    .messages({
    'number.base': 'El ID de la variante debe ser un número',
    'any.required': 'El ID de la variante es requerido'
    }),
detectionDate: Joi.date().iso().required()
    .messages({
    'date.base': 'La fecha de detección debe ser una fecha válida',
    'any.required': 'La fecha de detección es requerida'
    }),
alleleFrequency: Joi.number().min(0).max(1).precision(4).allow(null).optional()
    .messages({
    'number.base': 'La frecuencia alélica debe ser un número',
    'number.min': 'La frecuencia alélica debe ser mayor o igual a 0',
    'number.max': 'La frecuencia alélica debe ser menor o igual a 1'
    })
});

// DTO para actualizar un reporte de variante de paciente
const updatePatientVariantReportSchema = Joi.object({
patientId: Joi.number().integer().positive().optional(),
variantId: Joi.number().integer().positive().optional(),
detectionDate: Joi.date().iso().optional(),
alleleFrequency: Joi.number().min(0).max(1).precision(4).allow(null).optional()
}).min(1);

module.exports = {
createPatientVariantReportSchema,
updatePatientVariantReportSchema
};