import bcrypt from 'bcryptjs';

export class BcryptUtils {
  private static readonly SALT_ROUNDS = 12;

  // Hash de contraseña
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Error al hashear la contraseña');
    }
  }

  // Verificar contraseña
  static async comparePassword(
    plainPassword: string, 
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Error al verificar la contraseña');
    }
  }

  // Validar fortaleza de contraseña (opcional)
  static validatePasswordStrength(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
  }
}

export default BcryptUtils;