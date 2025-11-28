"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res) {
        try {
            const userData = req.body;
            if (!userData.email || !userData.password) {
                res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
                return;
            }
            const result = await auth_service_1.AuthService.register(userData);
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async verifyCode(req, res) {
        try {
            const verifyData = req.body;
            if (!verifyData.email || !verifyData.code) {
                res.status(400).json({
                    success: false,
                    message: 'Email y código son requeridos'
                });
                return;
            }
            const result = await auth_service_1.AuthService.verifyCode(verifyData);
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async resendVerification(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'Email es requerido'
                });
                return;
            }
            const result = await auth_service_1.AuthService.resendVerificationCode(email);
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async login(req, res) {
        try {
            const loginData = req.body;
            if (!loginData.email || !loginData.password) {
                res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
                return;
            }
            const result = await auth_service_1.AuthService.login(loginData);
            if (!result.success) {
                res.status(401).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    static async validateToken(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({
                    valid: false,
                    message: 'Token no proporcionado'
                });
                return;
            }
            const validationResult = await auth_service_1.AuthService.validateToken(token);
            if (!validationResult.valid) {
                res.status(401).json({
                    valid: false,
                    message: 'Token inválido o expirado'
                });
                return;
            }
            res.status(200).json({
                valid: true,
                message: 'Token válido',
                user: validationResult.user
            });
        }
        catch (error) {
            res.status(500).json({
                valid: false,
                message: 'Error al validar token'
            });
        }
    }
    static async healthCheck(req, res) {
        res.status(200).json({
            success: true,
            message: 'Auth Service is running',
            timestamp: new Date().toISOString(),
            service: 'auth-service'
        });
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
