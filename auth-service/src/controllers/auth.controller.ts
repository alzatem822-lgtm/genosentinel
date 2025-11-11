import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginInput, UserCreateInput } from '../models/user.model';

export class AuthController {
  // Registrar nuevo usuario
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserCreateInput = req.body;

      // Validaciones básicas
      if (!userData.email || !userData.password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
        return;
      }

      if (userData.password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
        return;
      }

      const user = await AuthService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: user
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar usuario'
      });
    }
  }

  // Login de usuario
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginInput = req.body;

      // Validaciones básicas
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
        return;
      }

      const result = await AuthService.login(loginData);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Validar token
  static async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          valid: false,
          message: 'Token no proporcionado'
        });
        return;
      }

      const validationResult = await AuthService.validateToken(token);

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
    } catch (error: any) {
      res.status(500).json({
        valid: false,
        message: 'Error al validar token'
      });
    }
  }

  // Health check
  static async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Auth Service is running',
      timestamp: new Date().toISOString(),
      service: 'auth-service'
    });
  }
}

export default AuthController;