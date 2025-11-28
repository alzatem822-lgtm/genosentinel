"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptUtils = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class BcryptUtils {
    static async hashPassword(password) {
        try {
            const salt = await bcryptjs_1.default.genSalt(this.SALT_ROUNDS);
            return await bcryptjs_1.default.hash(password, salt);
        }
        catch (error) {
            throw new Error('Error al hashear la contraseña');
        }
    }
    static async comparePassword(plainPassword, hashedPassword) {
        try {
            return await bcryptjs_1.default.compare(plainPassword, hashedPassword);
        }
        catch (error) {
            throw new Error('Error al verificar la contraseña');
        }
    }
    static validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    }
}
exports.BcryptUtils = BcryptUtils;
BcryptUtils.SALT_ROUNDS = 12;
exports.default = BcryptUtils;
