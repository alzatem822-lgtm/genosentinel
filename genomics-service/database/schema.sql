-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS genomica_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE genomica_db;

-- Tabla: Gene (Gen de Interés)
-- Catálogo de genes relevantes en oncología
CREATE TABLE IF NOT EXISTS Gene (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL UNIQUE COMMENT 'Símbolo del gen (ej: BRCA1)',
    fullName VARCHAR(255) NOT NULL COMMENT 'Nombre completo del gen',
    functionSummary TEXT COMMENT 'Resumen de la función del gen',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: GeneticVariant (Variante Genética)
-- Registro de mutaciones específicas
CREATE TABLE IF NOT EXISTS GeneticVariant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE COMMENT 'Identificador único UUID',
    geneId INT NOT NULL COMMENT 'Relación con Gen de Interés',
    chromosome VARCHAR(10) NOT NULL COMMENT 'Cromosoma (ej: chr17)',
    position VARCHAR(50) NOT NULL COMMENT 'Posición en el cromosoma',
    referenceBase VARCHAR(255) NOT NULL COMMENT 'Base de referencia (ej: A)',
    alternateBase VARCHAR(255) NOT NULL COMMENT 'Base alternativa (ej: G)',
    impact VARCHAR(50) COMMENT 'Impacto de la variante (ej: Missense, Frameshift)',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (geneId) REFERENCES Gene(id) ON DELETE CASCADE,
    INDEX idx_uuid (uuid),
    INDEX idx_gene (geneId),
    INDEX idx_chromosome (chromosome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: PatientVariantReport (Reporte de Variantes del Paciente) - ✅ CORREGIDA
-- Librería de mutaciones encontradas en un paciente
CREATE TABLE IF NOT EXISTS PatientVariantReport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE COMMENT 'Identificador único UUID',
    patientId VARCHAR(36) NOT NULL COMMENT 'ID del paciente (UUID del Microservicio Clínica)', -- ✅ CAMBIADO A VARCHAR(36)
    variantId INT NOT NULL COMMENT 'Relación con Variante Genética',
    detectionDate DATE NOT NULL COMMENT 'Fecha de detección de la variante',
    alleleFrequency DECIMAL(5,4) COMMENT 'Frecuencia alélica (VAF) en formato decimal',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (variantId) REFERENCES GeneticVariant(id) ON DELETE CASCADE,
    INDEX idx_uuid (uuid),
    INDEX idx_patient (patientId),
    INDEX idx_variant (variantId),
    INDEX idx_detection_date (detectionDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*
-- Datos de ejemplo para Gene
INSERT INTO Gene (symbol, fullName, functionSummary) VALUES
('BRCA1', 'Breast Cancer Type 1 Susceptibility Protein', 'Gen supresor de tumores involucrado en la reparación del ADN. Mutaciones aumentan el riesgo de cáncer de mama y ovario.'),
('BRCA2', 'Breast Cancer Type 2 Susceptibility Protein', 'Gen supresor de tumores que participa en la reparación de roturas de doble cadena del ADN.'),
('TP53', 'Tumor Protein P53', 'Gen supresor de tumores conocido como "guardián del genoma". Regula el ciclo celular y la apoptosis.'),
('EGFR', 'Epidermal Growth Factor Receptor', 'Receptor de factor de crecimiento que regula la proliferación celular. Mutaciones comunes en cáncer de pulmón.'),
('KRAS', 'Kirsten Rat Sarcoma Viral Oncogene Homolog', 'Oncogén involucrado en la señalización celular. Mutaciones frecuentes en cáncer colorrectal y pancreático.');

-- Datos de ejemplo para GeneticVariant
INSERT INTO GeneticVariant (uuid, geneId, chromosome, position, referenceBase, alternateBase, impact) VALUES
(UUID(), 1, 'chr17', '43094464', 'A', 'G', 'Missense'),
(UUID(), 1, 'chr17', '43091434', 'C', 'T', 'Frameshift'),
(UUID(), 2, 'chr13', '32339832', 'G', 'A', 'Nonsense'),
(UUID(), 3, 'chr17', '7675088', 'C', 'T', 'Missense'),
(UUID(), 4, 'chr7', '55249071', 'T', 'G', 'In-frame deletion'),
(UUID(), 5, 'chr12', '25245350', 'G', 'A', 'Missense');

-- Datos de ejemplo para PatientVariantReport - ✅ AHORA CON UUIDs VÁLIDOS
INSERT INTO PatientVariantReport (uuid, patientId, variantId, detectionDate, alleleFrequency) VALUES
(UUID(), 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, '2024-01-15', 0.4523),  -- ✅ UUID en lugar de 1
(UUID(), 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, '2024-01-15', 0.3812),  -- ✅ UUID en lugar de 1
(UUID(), 'b2c3d4e5-f6g7-8901-bcde-f23456789012', 2, '2024-02-20', 0.5234),  -- ✅ UUID en lugar de 2
(UUID(), 'c3d4e5f6-g7h8-9012-cdef-345678901234', 3, '2024-03-10', 0.6123),  -- ✅ UUID en lugar de 3
(UUID(), 'c3d4e5f6-g7h8-9012-cdef-345678901234', 6, '2024-03-10', 0.4567);  -- ✅ UUID en lugar de 3
*/