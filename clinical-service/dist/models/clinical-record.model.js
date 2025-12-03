"use strict";

const { connectionPool } = require('../config/database.config');

class ClinicalRecordModel {
    
    // Crear un nuevo registro clínico
    static async create(recordData) {
        try {
            const [result] = await connectionPool.execute(
                `INSERT INTO clinical_records 
                 (patientId, tumorTypeId, diagnosisDate, stage, treatmentProtocol) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    recordData.patientId,
                    recordData.tumorTypeId,
                    recordData.diagnosisDate,
                    recordData.stage,
                    recordData.treatmentProtocol || null
                ]
            );
            
            // Obtener el ID insertado (MySQL con UUID usa insertId de manera diferente)
            const [newRecord] = await connectionPool.execute(
                'SELECT * FROM clinical_records WHERE id = ?',
                [recordData.patientId] // Usaremos patientId para buscar temporalmente
            );
            
            return newRecord[0] || null;
        } catch (error) {
            throw new Error(`Error creating clinical record: ${error.message}`);
        }
    }

    // Buscar por ID
    static async findById(id) {
        try {
            const [rows] = await connectionPool.execute(
                `SELECT cr.*, 
                        p.firstName as patientFirstName, 
                        p.lastName as patientLastName,
                        tt.name as tumorTypeName,
                        tt.systemAffected as tumorSystemAffected
                 FROM clinical_records cr
                 LEFT JOIN patients p ON cr.patientId = p.id
                 LEFT JOIN tumor_types tt ON cr.tumorTypeId = tt.id
                 WHERE cr.id = ?`,
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error finding clinical record: ${error.message}`);
        }
    }

    // Buscar todos los registros
    static async findAll() {
        try {
            const [rows] = await connectionPool.execute(
                `SELECT cr.*, 
                        p.firstName as patientFirstName, 
                        p.lastName as patientLastName,
                        tt.name as tumorTypeName,
                        tt.systemAffected as tumorSystemAffected
                 FROM clinical_records cr
                 LEFT JOIN patients p ON cr.patientId = p.id
                 LEFT JOIN tumor_types tt ON cr.tumorTypeId = tt.id
                 ORDER BY cr.createdAt DESC`
            );
            return rows;
        } catch (error) {
            throw new Error(`Error finding clinical records: ${error.message}`);
        }
    }

    // Buscar por paciente
    static async findByPatientId(patientId) {
        try {
            const [rows] = await connectionPool.execute(
                `SELECT cr.*, 
                        p.firstName as patientFirstName, 
                        p.lastName as patientLastName,
                        tt.name as tumorTypeName,
                        tt.systemAffected as tumorSystemAffected
                 FROM clinical_records cr
                 LEFT JOIN patients p ON cr.patientId = p.id
                 LEFT JOIN tumor_types tt ON cr.tumorTypeId = tt.id
                 WHERE cr.patientId = ?
                 ORDER BY cr.diagnosisDate DESC`,
                [patientId]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error finding patient clinical records: ${error.message}`);
        }
    }

    // Actualizar registro
    static async update(id, recordData) {
        try {
            const [result] = await connectionPool.execute(
                `UPDATE clinical_records 
                 SET patientId = ?, tumorTypeId = ?, diagnosisDate = ?, 
                     stage = ?, treatmentProtocol = ?
                 WHERE id = ?`,
                [
                    recordData.patientId,
                    recordData.tumorTypeId,
                    recordData.diagnosisDate,
                    recordData.stage,
                    recordData.treatmentProtocol || null,
                    id
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating clinical record: ${error.message}`);
        }
    }

    // Eliminar registro
    static async delete(id) {
        try {
            const [result] = await connectionPool.execute(
                'DELETE FROM clinical_records WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting clinical record: ${error.message}`);
        }
    }
}

module.exports = ClinicalRecordModel;