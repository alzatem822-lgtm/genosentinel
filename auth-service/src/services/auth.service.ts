import { dbPool } from '../config/database.config';
import { BcryptUtils } from '../utils/bcrypt.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { User, UserCreateInput, UserResponse, LoginInput, LoginResponse, toUserResponse } from '../models/user.model';

export class AuthService {
  // Registrar nuevo usuario
  static async register(userData: UserCreateInput): Promise<UserResponse> {
    const { email, password } = userData;

    // Verificar si el usuario ya existe
    const [existingUsers] = await dbPool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingUsers as any[]).length > 0) {
      throw new Error('El usuario ya existe');
    }

    // Hash de la contraseña
    const passwordHash = await BcryptUtils.hashPassword(password);

    // Crear usuario
    const userId = require('crypto').randomUUID();
    const [result] = await dbPool.execute(
      'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
      [userId, email, passwordHash]
    );

    // Obtener usuario creado
    const [users] = await dbPool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as User[])[0];
    return toUserResponse(user);
  }

  // Login de usuario
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