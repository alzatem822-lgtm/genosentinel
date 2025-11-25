import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginInput, UserCreateInput, VerifyInput } from '../models/user.model';

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

      const result = await AuthService.register(userData);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Verificar código de email
  static async verifyCode(req: Request, res: Response): Promise<void> {
    try {
      const verifyData: VerifyInput = req.body;

      // Validaciones básicas
      if (!verifyData.email || !verifyData.code) {
        res.status(400).json({
          success: false,
          message: 'Email y código son requeridos'
        });
        return;
      }

      const result = await AuthService.verifyCode(verifyData);

      if (!result.success) {
        res.status(400).json(result);
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

  // Reenviar código de verificación
  static async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email es requerido'
        });
        return;
      }

      const result = await AuthService.resendVerificationCode(email);

      if (!result.success) {
        res.status(400).json(result);
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