import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// Extender la interfaz Request de Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
      return;
    }

    const validationResult = await AuthService.validateToken(token);

    if (!validationResult.valid || !validationResult.user) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
      return;
    }

    // Agregar información del usuario al request
    req.user = {
      userId: validationResult.user.id,
      email: validationResult.user.email
    };

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error en la autenticación'
    });
  }
};

// Middleware para logging de requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

// Middleware para manejo de errores
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error.message);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
};