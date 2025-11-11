import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class JwtUtils {
  // Generar token JWT - SOLUCIÓN SEGURA
  static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    // Convertir el payload a string si es necesario para compatibilidad
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email
    };

    // Usar cualquier tipo para evitar conflictos de versión
    const options: any = {
      expiresIn: envConfig.jwtExpiresIn
    };

    return jwt.sign(tokenPayload, envConfig.jwtSecret, options);
  }

  // Verificar token JWT
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, envConfig.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expirado');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Token inválido');
      }
      throw new Error('Error al verificar token');
    }
  }

  // Decodificar token sin verificar
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}

export default JwtUtils;