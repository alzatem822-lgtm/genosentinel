CREATE DATABASE IF NOT EXISTS genomica_db;
USE genomica_db;

-- Tabla: Gene (Gen de Interés)
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

-- Tabla: PatientVariantReport (Reporte de Variantes del Paciente)
CREATE TABLE IF NOT EXISTS PatientVariantReport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE COMMENT 'Identificador único UUID',
    patientId INT NOT NULL COMMENT 'ID del paciente (consultable en Microservicio Clínica)',
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

-- Datos de ejemplo para Gene
INSERT IGNORE INTO Gene (symbol, fullName, functionSummary) VALUES
('BRCA1', 'Breast Cancer Type 1 Susceptibility Protein', 'Gen supresor de tumores involucrado en la reparación del ADN. Mutaciones aumentan el riesgo de cáncer de mama y ovario.'),
('BRCA2', 'Breast Cancer Type 2 Susceptibility Protein', 'Gen supresor de tumores que participa en la reparación de roturas de doble cadena del ADN.'),
('TP53', 'Tumor Protein P53', 'Gen supresor de tumores conocido como "guardián del genoma". Regula el ciclo celular y la apoptosis.'),
('EGFR', 'Epidermal Growth Factor Receptor', 'Receptor de factor de crecimiento que regula la proliferación celular. Mutaciones comunes en cáncer de pulmón.'),
('KRAS', 'Kirsten Rat Sarcoma Viral Oncogene Homolog', 'Oncogén involucrado en la señalización celular. Mutaciones frecuentes en cáncer colorrectal y pancreático.');

SELECT '✅ Genomics database y tablas creadas' AS status;