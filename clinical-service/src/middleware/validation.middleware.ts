// clinical-service/src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { Logger } from '../utils/logger.utils';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error: any) {
      Logger.warn('Validación fallida', { 
        path: req.path, 
        errors: error.errors 
      });
      
      res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.params);
      req.params = result;
      next();
    } catch (error: any) {
      Logger.warn('Validación de parámetros fallida', { 
        path: req.path, 
        errors: error.errors 
      });
      
      res.status(400).json({
        error: 'Parámetros inválidos',
        details: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
  };
};