"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
];
for (const envVar of requiredEnvVars) {
    //if (!process.env[envVar]) {
      ///  throw new Error(`❌ Variable de entorno requerida faltante: ${envVar}`);
    //}
}
exports.envConfig = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000'),
    dbHost: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT || '3306'),
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    clinicalServiceUrl: process.env.CLINICAL_SERVICE_URL || 'http://localhost:3020',
    genomicsServiceUrl: process.env.GENOMICS_SERVICE_URL || 'http://localhost:3002'
};
console.log('✅ Configuración de entorno cargada correctamente');
