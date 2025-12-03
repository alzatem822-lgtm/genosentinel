"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.dbPool = exports.dbConfig = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
// MYSQL REAL - CONEXIÓN A BASE DE DATOS REAL
exports.dbConfig = {
    host: process.env.DB_HOST || 'auth-mysql',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'auth_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// Pool de conexiones REAL
exports.dbPool = promise_1.default.createPool(exports.dbConfig);
const testConnection = async () => {
    try {
        const connection = await exports.dbPool.getConnection();
        console.log('✅ MySQL REAL conectado exitosamente a auth_db');
        connection.release();
        return true;
    }
    catch (error) {
        console.error('❌ Error conectando a MySQL REAL:', error.message);
        return false;
    }
};
exports.testConnection = testConnection;