"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.requestLogger = exports.authMiddleware = void 0;
const auth_service_1 = require("../services/auth.service");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token de autenticación requerido'
            });
            return;
        }
        const validationResult = await auth_service_1.AuthService.validateToken(token);
        if (!validationResult.valid || !validationResult.user) {
            res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
            return;
        }
        req.user = {
            userId: validationResult.user.id,
            email: validationResult.user.email
        };
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en la autenticación'
        });
    }
};
exports.authMiddleware = authMiddleware;
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
};
exports.requestLogger = requestLogger;
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error.message);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
};
exports.errorHandler = errorHandler;
