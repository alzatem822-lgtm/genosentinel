import dotenv from 'dotenv';

dotenv.config();

// Validación básica de variables requeridas
const requiredEnvVars = [
  'JWT_SECRET',
  'DB_HOST', 
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Variable de entorno requerida faltante: ${envVar}`);
  }
}

export const envConfig = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  
  // Database
  dbHost: process.env.DB_HOST!,
  dbPort: parseInt(process.env.DB_PORT || '3306'),
  dbUser: process.env.DB_USER!,
  dbPassword: process.env.DB_PASSWORD!,
  dbName: process.env.DB_NAME!,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Services
  clinicalServiceUrl: process.env.CLINICAL_SERVICE_URL || 'http://localhost:3001',
  genomicsServiceUrl: process.env.GENOMICS_SERVICE_URL || 'http://localhost:3002'
};

console.log('✅ Configuración de entorno cargada correctamente');