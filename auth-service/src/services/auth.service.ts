import { dbPool } from '../config/database.config';
import { BcryptUtils } from '../utils/bcrypt.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { EmailService } from './email.service';
import { User, UserCreateInput, UserResponse, LoginInput, LoginResponse, toUserResponse, VerifyInput } from '../models/user.model';

export class AuthService {
  // Registrar nuevo usuario con verificación
  static async register(userData: UserCreateInput): Promise<{success: boolean; message: string; user?: UserResponse}> {
    const { email, password } = userData;

    try {
      // Verificar si el usuario ya existe
      const [existingUsers] = await dbPool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        return {
          success: false,
          message: 'El usuario ya existe'
        };
      }

      // Validar contraseña
      if (!BcryptUtils.validatePasswordStrength(password)) {
        return {
          success: false,
          message: 'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas y números'
        };
      }

      // Hash de la contraseña
      const passwordHash = await BcryptUtils.hashPassword(password);
      
      // Generar código de verificación
      const verificationCode = EmailService.generateVerificationCode();
      const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      // Crear usuario (no verificado)
      const userId = require('crypto').randomUUID();
      await dbPool.execute(
        'INSERT INTO users (id, email, password_hash, verification_code, verification_expires) VALUES (?, ?, ?, ?, ?)',
        [userId, email, passwordHash, verificationCode, verificationExpires]
      );

      // Enviar código de verificación
      const emailSent = await EmailService.sendVerificationCode(email, verificationCode);

      // Obtener usuario creado
      const [users] = await dbPool.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      const user = (users as User[])[0];

      return {
        success: true,
        message: emailSent 
          ? 'Usuario registrado. Revisa tu email para el código de verificación.'
          : 'Usuario registrado, pero error enviando email. Contacta soporte.',
        user: toUserResponse(user)
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Verificar código de email
  static async verifyCode(verifyData: VerifyInput): Promise<{success: boolean; message: string; user?: UserResponse}> {
    const { email, code } = verifyData;

    try {
      // Buscar usuario con código válido
      const [users] = await dbPool.execute(
        'SELECT * FROM users WHERE email = ? AND verification_code = ? AND verification_expires > NOW()',
        [email, code]
      );

      const user = (users as User[])[0];
      if (!user) {
        return {
          success: false,
          message: 'Código inválido o expirado'
        };
      }

      // Marcar usuario como verificado y limpiar código
      await dbPool.execute(
        'UPDATE users SET verified = true, verification_code = NULL, verification_expires = NULL WHERE id = ?',
        [user.id]
      );

      // Enviar email de bienvenida
      await EmailService.sendWelcomeEmail(user.email, user.email.split('@')[0]);

      return {
        success: true,
        message: 'Cuenta verificada exitosamente',
        user: toUserResponse({ ...user, verified: true })
      };
    } catch (error: any) {
      console.error('Error en verificación:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Reenviar código de verificación
  static async resendVerificationCode(email: string): Promise<{success: boolean; message: string}> {
    try {
      // Buscar usuario no verificado
      const [users] = await dbPool.execute(
        'SELECT * FROM users WHERE email = ? AND verified = false',
        [email]
      );

      const user = (users as User[])[0];
      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado o ya verificado'
        };
      }

      // Generar nuevo código
      const verificationCode = EmailService.generateVerificationCode();
      const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

      // Actualizar código en BD
      await dbPool.execute(
        'UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?',
        [verificationCode, verificationExpires, user.id]
      );

      // Enviar nuevo código
      const emailSent = await EmailService.sendVerificationCode(email, verificationCode);

      return {
        success: true,
        message: emailSent 
          ? 'Código de verificación reenviado'
          : 'Error enviando email. Contacta soporte.'
      };
    } catch (error: any) {
      console.error('Error reenviando código:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Login de usuario (solo usuarios verificados)
  static async login(loginData: LoginInput): Promise<LoginResponse> {
    const { email, password } = loginData;

    // Buscar usuario
    const [users] = await dbPool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = (users as User[])[0];
    if (!user) {
      return {
        success: false,
        message: 'Credenciales inválidas'
      };
    }

    // Verificar si la cuenta está verificada
    if (!user.verified) {
      return {
        success: false,
        message: 'Cuenta no verificada. Revisa tu email para el código de verificación.'
      };
    }

    // Verificar contraseña
    const isPasswordValid = await BcryptUtils.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Credenciales inválidas'
      };
    }

    // Generar token JWT
    const token = JwtUtils.generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      success: true,
      message: 'Login exitoso',
      token,
      user: toUserResponse(user)
    };
  }

  // Validar token JWT
  static async validateToken(token: string): Promise<{ valid: boolean; user?: UserResponse }> {
    try {
      const payload = JwtUtils.verifyToken(token);
      
      // Verificar que el usuario aún existe en la BD
      const [users] = await dbPool.execute(
        'SELECT * FROM users WHERE id = ?',
        [payload.userId]
      );

      const user = (users as User[])[0];
      if (!user) {
        return { valid: false };
      }

      return {
        valid: true,
        user: toUserResponse(user)
      };
    } catch (error) {
      return { valid: false };
    }
  }

  // Obtener usuario por ID
  static async getUserById(userId: string): Promise<UserResponse | null> {
    const [users] = await dbPool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as User[])[0];
    return user ? toUserResponse(user) : null;
  }
}

export default AuthService;