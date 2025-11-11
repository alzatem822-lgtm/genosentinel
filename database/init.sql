-- Base de datos GenoSentinel
CREATE DATABASE IF NOT EXISTS genosentinel;
USE genosentinel;

-- Tabla de usuarios para autenticación
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario de prueba (password: admin123)
INSERT IGNORE INTO users (id, email, password_hash) VALUES 
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin@genosentinel.com', '$2a$12$LQv3c1yqBWVHxkd0g8f7Qu/35RCFYBRSyALM7drQy5Nln8.8lAjNe');

-- Verificar inserción
SELECT '✅ Base de datos y tablas creadas correctamente' as status;