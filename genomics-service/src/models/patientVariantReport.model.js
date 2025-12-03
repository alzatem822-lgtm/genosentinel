const { pool } = require('../config/database');

class PatientVariantReportModel {
// Crear un nuevo reporte de variante de paciente
static async create(reportData) {
    const { patientId, variantId, detectionDate, alleleFrequency } = reportData;
    const uuid = require('crypto').randomUUID();
    
    const [result] = await pool.execute(
    'INSERT INTO PatientVariantReport (uuid, patientId, variantId, detectionDate, alleleFrequency) VALUES (?, ?, ?, ?, ?)',
    [uuid, patientId, variantId, detectionDate, alleleFrequency || null]
    );
    return { id: result.insertId, uuid };
}

// Obtener todos los reportes
static async findAll() {
    const [rows] = await pool.execute(`
    SELECT pvr.*, 
            gv.chromosome, gv.position, gv.referenceBase, gv.alternateBase, gv.impact,
            g.symbol as geneSymbol, g.fullName as geneName
    FROM PatientVariantReport pvr
    LEFT JOIN GeneticVariant gv ON pvr.variantId = gv.id
    LEFT JOIN Gene g ON gv.geneId = g.id
    ORDER BY pvr.detectionDate DESC
    `);
    return rows;
}

// Obtener un reporte por ID
static async findById(id) {
    const [rows] = await pool.execute(`
    SELECT pvr.*, 
            gv.chromosome, gv.position, gv.referenceBase, gv.alternateBase, gv.impact,
            g.symbol as geneSymbol, g.fullName as geneName
    FROM PatientVariantReport pvr
    LEFT JOIN GeneticVariant gv ON pvr.variantId = gv.id
    LEFT JOIN Gene g ON gv.geneId = g.id
    WHERE pvr.id = ?
    `, [id]);
    return rows[0];
}

// Obtener un reporte por UUID
static async findByUuid(uuid) {
    const [rows] = await pool.execute(`
    SELECT pvr.*, 
            gv.chromosome, gv.position, gv.referenceBase, gv.alternateBase, gv.impact,
            g.symbol as geneSymbol, g.fullName as geneName
    FROM PatientVariantReport pvr
    LEFT JOIN GeneticVariant gv ON pvr.variantId = gv.id
    LEFT JOIN Gene g ON gv.geneId = g.id
    WHERE pvr.uuid = ?
    `, [uuid]);
    return rows[0];
}

// Obtener reportes por paciente
static async findByPatientId(patientId) {
    const [rows] = await pool.execute(`
    SELECT pvr.*, 
            gv.chromosome, gv.position, gv.referenceBase, gv.alternateBase, gv.impact,
            g.symbol as geneSymbol, g.fullName as geneName
    FROM PatientVariantReport pvr
    LEFT JOIN GeneticVariant gv ON pvr.variantId = gv.id
    LEFT JOIN Gene g ON gv.geneId = g.id
    WHERE pvr.patientId = ?
    ORDER BY pvr.detectionDate DESC
    `, [patientId]);
    return rows;
}

// Obtener reportes por variante
static async findByVariantId(variantId) {
    const [rows] = await pool.execute(`
    SELECT pvr.*, 
            gv.chromosome, gv.position, gv.referenceBase, gv.alternateBase, gv.impact,
            g.symbol as geneSymbol, g.fullName as geneName
    FROM PatientVariantReport pvr
    LEFT JOIN GeneticVariant gv ON pvr.variantId = gv.id
    LEFT JOIN Gene g ON gv.geneId = g.id
    WHERE pvr.variantId = ?
    ORDER BY pvr.detectionDate DESC
    `, [variantId]);
    return rows;
}

// Actualizar un reporte
static async update(id, reportData) {
    const fields = [];
    const values = [];

    if (reportData.patientId !== undefined) {
    fields.push('patientId = ?');
    values.push(reportData.patientId);
    }
    if (reportData.variantId !== undefined) {
    fields.push('variantId = ?');
    values.push(reportData.variantId);
    }
    if (reportData.detectionDate !== undefined) {
    fields.push('detectionDate = ?');
    values.push(reportData.detectionDate);
    }
    if (reportData.alleleFrequency !== undefined) {
    fields.push('alleleFrequency = ?');
    values.push(reportData.alleleFrequency);
    }

    if (fields.length === 0) {
    return false;
    }

    values.push(id);
    const [result] = await pool.execute(
    `UPDATE PatientVariantReport SET ${fields.join(', ')} WHERE id = ?`,
    values
    );
    return result.affectedRows > 0;
}

// Eliminar un reporte
static async delete(id) {
    const [result] = await pool.execute(
    'DELETE FROM PatientVariantReport WHERE id = ?',
    [id]
    );
    return result.affectedRows > 0;
}
}

module.exports = PatientVariantReportModel;