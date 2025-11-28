"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
class JwtUtils {
    static generateToken(payload) {
        const tokenPayload = {
            userId: payload.userId,
            email: payload.email
        };
        const options = {
            expiresIn: env_config_1.envConfig.jwtExpiresIn
        };
        return jsonwebtoken_1.default.sign(tokenPayload, env_config_1.envConfig.jwtSecret, options);
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_config_1.envConfig.jwtSecret);
            return decoded;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expirado');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Token inválido');
            }
            throw new Error('Error al verificar token');
        }
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch {
            return null;
        }
    }
}
exports.JwtUtils = JwtUtils;
exports.default = JwtUtils;
