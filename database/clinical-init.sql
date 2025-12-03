CREATE DATABASE IF NOT EXISTS clinical_db;
USE clinical_db;

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    birthDate DATE NOT NULL,
    gender ENUM('M', 'F', 'Other') NOT NULL,
    status ENUM('Activo', 'Seguimiento', 'Inactivo') DEFAULT 'Activo',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS tumor_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    systemAffected VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_records (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patientId VARCHAR(36) NOT NULL,
    tumorTypeId INT NOT NULL,
    diagnosisDate DATE NOT NULL,
    stage VARCHAR(10),
    treatmentProtocol TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (tumorTypeId) REFERENCES tumor_types(id),
    INDEX idx_diagnosis_date (diagnosisDate)
);

-- Datos iniciales de tipos de tumor
INSERT IGNORE INTO tumor_types (id, name, systemAffected) VALUES
(1, 'Cáncer de Mama', 'Sistema mamario'),
(2, 'Cáncer de Pulmón', 'Sistema respiratorio'),
(3, 'Cáncer Colorrectal', 'Sistema digestivo'),
(4, 'Cáncer de Próstata', 'Sistema reproductor'),
(5, 'Leucemia', 'Sistema hematopoyético');

SELECT '✅ Clinical database y tablas creadas' AS status;