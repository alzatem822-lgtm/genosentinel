"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateRequest = void 0;
const logger_utils_1 = require("../utils/logger.utils");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.parse(req.body);
            req.body = result;
            next();
        }
        catch (error) {
            logger_utils_1.Logger.warn('Validación fallida', {
                path: req.path,
                errors: error.errors
            });
            res.status(400).json({
                error: 'Datos de entrada inválidos',
                details: error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
    };
};
exports.validateRequest = validateRequest;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.parse(req.params);
            req.params = result;
            next();
        }
        catch (error) {
            logger_utils_1.Logger.warn('Validación de parámetros fallida', {
                path: req.path,
                errors: error.errors
            });
            res.status(400).json({
                error: 'Parámetros inválidos',
                details: error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
    };
};
exports.validateParams = validateParams;
