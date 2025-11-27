// clinical-service/src/config/database.config.ts
import mysql from 'mysql2/promise';
import { config } from './env.config';

// Función para esperar con retry
async function waitForMySQL(maxRetries = 30, delay = 2000): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔌 Intentando conectar a MySQL (intento ${attempt}/${maxRetries})...`);
      
      const testConnection = await mysql.createConnection({
        host: process.env.DB_HOST || 'clinical-db',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'clinical_user',
        password: process.env.DB_PASSWORD || 'clinical_password'
      });
      
      await testConnection.execute('SELECT 1');
      await testConnection.end();
      
      console.log('✅ MySQL está listo!');
      return;
      
    } catch (error) {
      console.log(`❌ Intento ${attempt} fallado: ${error.message}`);
      if (attempt === maxRetries) {
        throw new Error(`No se pudo conectar a MySQL después de ${maxRetries} intentos`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function initializeDatabase() {
  try {
    console.log('🔌 Inicializando base de datos clínica...');

    // 1. Esperar a que MySQL esté listo
    await waitForMySQL();

    // 2. Conectar sin especificar BD (para crearla)
    const rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'clinical-db',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'clinical_user',
      password: process.env.DB_PASSWORD || 'clinical_password'
    });

    console.log('✅ Conectado a MySQL');

    // 3. Crear base de datos si no existe
    await rootConnection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'clinical_db'}`
    );

    console.log('✅ Base de datos creada/verificada');

    // 4. Cerrar conexión y reconectar especificando la BD
    await rootConnection.end();

    // 5. Conectar a la base de datos específica
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'clinical-db',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'clinical_user',
      password: process.env.DB_PASSWORD || 'clinical_password',
      database: process.env.DB_NAME || 'clinical_db'
    });

    // 6. Crear tablas
    await createTables(dbConnection);

    console.log('✅ Base de datos y tablas creadas exitosamente');
    await dbConnection.end();

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

async function createTables(connection: mysql.Connection) {
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

// Pool de conexiones para la aplicación
export const connectionPool = mysql.createPool({
  host: process.env.DB_HOST || 'clinical-db',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'clinical_user',
  password: process.env.DB_PASSWORD || 'clinical_password',
  database: process.env.DB_NAME || 'clinical_db',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectionLimit: 10
});