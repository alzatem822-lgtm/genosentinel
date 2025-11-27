"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalRecordsController = void 0;
const clinical_record_service_1 = require("../services/clinical-record.service");
const logger_utils_1 = require("../utils/logger.utils");
class ClinicalRecordsController {
    /**
     * Crear nuevo registro clínico
     */
    static async createClinicalRecord(req, res) {
        try {
            logger_utils_1.Logger.info('Solicitud de creación de registro clínico recibida');
            const clinicalRecord = await clinical_record_service_1.ClinicalRecordService.createClinicalRecord(req.body);
            res.status(201).json({
                success: true,
                message: 'Registro clínico creado exitosamente',
                data: clinicalRecord
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador createClinicalRecord', error);
            const status = error.message === 'Paciente no encontrado' ||
                error.message === 'Tipo de tumor no encontrado' ? 404 : 500;
            res.status(status).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Obtener todos los registros clínicos
     */
    static async getAllClinicalRecords(req, res) {
        try {
            logger_utils_1.Logger.info('Solicitud de listado de registros clínicos recibida');
            const records = await clinical_record_service_1.ClinicalRecordService.getAllClinicalRecords();
            res.status(200).json({
                success: true,
                data: records,
                count: records.length
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador getAllClinicalRecords', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Obtener registros clínicos por paciente
     */
    static async getClinicalRecordsByPatient(req, res) {
        try {
            const { patientId } = req.params;
            logger_utils_1.Logger.info('Solicitud de registros clínicos por paciente', { patientId });
            const records = await clinical_record_service_1.ClinicalRecordService.getClinicalRecordsByPatient(patientId);
            res.status(200).json({
                success: true,
                data: records,
                count: records.length,
                patientId
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador getClinicalRecordsByPatient', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Obtener registro clínico por ID
     */
    static async getClinicalRecordById(req, res) {
        try {
            const { id } = req.params;
            logger_utils_1.Logger.info('Solicitud de registro clínico por ID', { recordId: id });
            const record = await clinical_record_service_1.ClinicalRecordService.getClinicalRecordById(id);
            if (!record) {
                return res.status(404).json({
                    success: false,
                    error: 'Registro clínico no encontrado'
                });
            }
            res.status(200).json({
                success: true,
                data: record
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador getClinicalRecordById', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Buscar registros clínicos por etapa
     */
    static async searchClinicalRecordsByStage(req, res) {
        try {
            const { stage } = req.query;
            if (!stage || typeof stage !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'Parámetro de etapa requerido'
                });
            }
            logger_utils_1.Logger.info('Solicitud de búsqueda por etapa', { stage });
            const records = await clinical_record_service_1.ClinicalRecordService.searchClinicalRecordsByStage(stage);
            res.status(200).json({
                success: true,
                data: records,
                count: records.length,
                stage
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador searchClinicalRecordsByStage', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.ClinicalRecordsController = ClinicalRecordsController;
