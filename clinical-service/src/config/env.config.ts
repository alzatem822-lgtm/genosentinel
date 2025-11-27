// clinical-service/src/config/env.config.ts
import { z } from 'zod';

const envSchema = z.object({
  // Server Configuration
  PORT: z.string().default('3020'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Database Configuration (variables separadas, no DATABASE_URL)
  DB_HOST: z.string().default('clinical-db'),
  DB_PORT: z.string().default('3306'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('clinical_db')
});

// Solo validar las variables que necesitamos
const envVars = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
};

export const config = envSchema.parse(envVars);