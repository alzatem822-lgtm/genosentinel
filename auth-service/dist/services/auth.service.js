"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_config_1 = require("../config/database.config");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const email_service_1 = require("./email.service");
const user_model_1 = require("../models/user.model");
class AuthService {
    static async register(userData) {
        const { email, password } = userData;
        try {
            const [existingUsers] = await database_config_1.dbPool.execute('SELECT id FROM users WHERE email = ?', [email]);
            if (existingUsers.length > 0) {
                return {
                    success: false,
                    message: 'El usuario ya existe'
                };
            }
            if (!bcrypt_utils_1.BcryptUtils.validatePasswordStrength(password)) {
                return {
                    success: false,
                    message: 'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas y números'
                };
            }
            const passwordHash = await bcrypt_utils_1.BcryptUtils.hashPassword(password);
            const verificationCode = email_service_1.EmailService.generateVerificationCode();
            const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
            const userId = require('crypto').randomUUID();
            await database_config_1.dbPool.execute('INSERT INTO users (id, email, password_hash, verification_code, verification_expires) VALUES (?, ?, ?, ?, ?)', [userId, email, passwordHash, verificationCode, verificationExpires]);
            const emailSent = await email_service_1.EmailService.sendVerificationCode(email, verificationCode);
            const [users] = await database_config_1.dbPool.execute('SELECT * FROM users WHERE id = ?', [userId]);
            const user = users[0];
            return {
                success: true,
                message: emailSent
                    ? 'Usuario registrado. Revisa tu email para el código de verificación.'
                    : 'Usuario registrado, pero error enviando email. Contacta soporte.',
                user: (0, user_model_1.toUserResponse)(user)
            };
        }
        catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                message: 'Error interno del servidor'
            };
        }
    }
    static async verifyCode(verifyData) {
        const { email, code } = verifyData;
        try {
            const [users] = await database_config_1.dbPool.execute('SELECT * FROM users WHERE email = ? AND verification_code = ? AND verification_expires > NOW()', [email, code]);
            const user = users[0];
            if (!user) {
                return {
                    success: false,
                    message: 'Código inválido o expirado'
                };
            }
            await database_config_1.dbPool.execute('UPDATE users SET verified = true, verification_code = NULL, verification_expires = NULL WHERE id = ?', [user.id]);
            await email_service_1.EmailService.sendWelcomeEmail(user.email, user.email.split('@')[0]);
            return {
                success: true,
                message: 'Cuenta verificada exitosamente',
                user: (0, user_model_1.toUserResponse)({ ...user, verified: true })
            };
        }
        catch (error) {
            console.error('Error en verificación:', error);
            return {
                success: false,
                message: 'Error interno del servidor'
            };
        }
    }
    static async resendVerificationCode(email) {
        try {
            const [users] = await database_config_1.dbPool.execute('SELECT * FROM users WHERE email = ? AND verified = false', [email]);
            const user = users[0];
            if (!user) {
                return {
                    success: false,
                    message: 'Usuario no encontrado o ya verificado'
                };
            }
            const verificationCode = email_service_1.EmailService.generateVerificationCode();
            const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
            await database_config_1.dbPool.execute('UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?', [verificationCode, verificationExpires, user.id]);
            const emailSent = await email_service_1.EmailService.sendVerificationCode(email, verificationCode);
            return {
                success: true,
                message: emailSent
                    ? 'Código de verificación reenviado'
                    : 'Error enviando email. Contacta soporte.'
            };
        }
        catch (error) {
            console.error('Error reenviando código:', error);
            return {
                success: false,
                message: 'Error interno del servidor'
            };
        }
    }
    static async login(loginData) {
        const { email, password } = loginData;
        const [users] = await database_config_1.dbPool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) {
            return {
                success: false,
                message: 'Credenciales inválidas'
            };
        }
        if (!user.verified) {
            return {
                success: false,
                message: 'Cuenta no verificada. Revisa tu email para el código de verificación.'
            };
        }
        const isPasswordValid = await bcrypt_utils_1.BcryptUtils.comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Credenciales inválidas'
            };
        }
        const token = jwt_utils_1.JwtUtils.generateToken({
            userId: user.id,
            email: user.email
        });
        return {
            success: true,
            message: 'Login exitoso',
            token,
            user: (0, user_model_1.toUserResponse)(user)
        };
    }
    static async validateToken(token) {
        try {
            const payload = jwt_utils_1.JwtUtils.verifyToken(token);
            const [users] = await database_config_1.dbPool.execute('SELECT * FROM users WHERE id = ?', [payload.userId]);
            const user = users[0];
            if (!user) {
                return { valid: false };
            }
            return {
                valid: true,
                user: (0, user_model_1.toUserResponse)(user)
            };
        }
        catch (error) {
            return { valid: false };
        }
    }
    static async getUserById(userId) {
        const [users] = await database_config_1.dbPool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        const user = users[0];
        return user ? (0, user_model_1.toUserResponse)(user) : null;
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
