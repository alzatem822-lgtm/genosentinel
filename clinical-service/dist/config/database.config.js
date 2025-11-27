"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionPool = void 0;
exports.initializeDatabase = initializeDatabase;
// clinical-service/src/config/database.config.ts
const promise_1 = __importDefault(require("mysql2/promise")); // ✅ Esto está bien
async function initializeDatabase() {
    try {
        console.log('🔌 Inicializando base de datos clínica...');
        // 1. Conectar sin especificar BD (para crearla)
        const rootConnection = await promise_1.default.createConnection({
            host: process.env.DB_HOST || 'clinical-db',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password'
        });
        console.log('✅ Conectado a MySQL');
        // 2. Crear base de datos si no existe
        await rootConnection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'clinical_db'}`);
        // 3. Usar la base de datos
        await rootConnection.execute(`USE ${process.env.DB_NAME || 'clinical_db'}`);
        // 4. Crear tablas
        await createTables(rootConnection);
        console.log('✅ Base de datos y tablas creadas exitosamente');
        await rootConnection.end();
    }
    catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        throw error;
    }
}
async function createTables(connection) {
    // Tabla de pacientes
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS patients (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      birthDate DATETIME NOT NULL,
      gender VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'Activo',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
    // Tabla de tipos de tumor
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS tumor_types (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL UNIQUE,
      systemAffected VARCHAR(200) NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Tabla de registros clínicos
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS clinical_records (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      patientId VARCHAR(36) NOT NULL,
      tumorTypeId INT NOT NULL,
      diagnosisDate DATETIME NOT NULL,
      stage VARCHAR(10) NOT NULL,
      treatmentProtocol TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (tumorTypeId) REFERENCES tumor_types(id)
    )
  `);
    // Insertar datos iniciales de tipos de tumor
    await connection.execute(`
    INSERT IGNORE INTO tumor_types (name, systemAffected) VALUES
    ('Cáncer de Mama', 'Glándulas Mamarias'),
    ('Cáncer de Pulmón', 'Sistema Respiratorio'),
    ('Cáncer de Próstata', 'Sistema Reproductor Masculino'),
    ('Cáncer Colorrectal', 'Sistema Digestivo'),
    ('Melanoma', 'Piel')
  `);
    console.log('✅ Tablas creadas y datos iniciales insertados');
}
// Pool de conexiones para la aplicación - VERSIÓN CORREGIDA
exports.connectionPool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'clinical-db',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'clinical_db',
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectionLimit: 10
    // acquireTimeout removido - no es una opción válida en MySQL2
});
