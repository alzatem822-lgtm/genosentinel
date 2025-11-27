"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsController = void 0;
const patient_service_1 = require("../services/patient.service");
const logger_utils_1 = require("../utils/logger.utils");
class PatientsController {
    /**
     * Crear un nuevo paciente
     */
    static async createPatient(req, res) {
        try {
            logger_utils_1.Logger.info('Solicitud de creación de paciente recibida');
            const patient = await patient_service_1.PatientService.createPatient(req.body);
            res.status(201).json({
                success: true,
                message: 'Paciente creado exitosamente',
                data: patient
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador createPatient', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Obtener todos los pacientes
     */
    static async getAllPatients(req, res) {
        try {
            logger_utils_1.Logger.info('Solicitud de listado de pacientes recibida');
            const patients = await patient_service_1.PatientService.getAllPatients();
            res.status(200).json({
                success: true,
                data: patients,
                count: patients.length
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador getAllPatients', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Obtener paciente por ID
     */
    static async getPatientById(req, res) {
        try {
            const { id } = req.params;
            logger_utils_1.Logger.info('Solicitud de paciente por ID', { patientId: id });
            const patient = await patient_service_1.PatientService.getPatientById(id);
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    error: 'Paciente no encontrado'
                });
            }
            res.status(200).json({
                success: true,
                data: patient
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador getPatientById', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Actualizar paciente
     */
    static async updatePatient(req, res) {
        try {
            const { id } = req.params;
            logger_utils_1.Logger.info('Solicitud de actualización de paciente', { patientId: id });
            const patient = await patient_service_1.PatientService.updatePatient(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Paciente actualizado exitosamente',
                data: patient
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador updatePatient', error);
            const status = error.message === 'Paciente no encontrado' ? 404 : 500;
            res.status(status).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Desactivar paciente
     */
    static async deactivatePatient(req, res) {
        try {
            const { id } = req.params;
            logger_utils_1.Logger.info('Solicitud de desactivación de paciente', { patientId: id });
            const patient = await patient_service_1.PatientService.deactivatePatient(id);
            res.status(200).json({
                success: true,
                message: 'Paciente desactivado exitosamente',
                data: patient
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador deactivatePatient', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Buscar pacientes
     */
    static async searchPatients(req, res) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'Parámetro de búsqueda requerido'
                });
            }
            logger_utils_1.Logger.info('Solicitud de búsqueda de pacientes', { query });
            const patients = await patient_service_1.PatientService.searchPatients(query);
            res.status(200).json({
                success: true,
                data: patients,
                count: patients.length,
                query
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador searchPatients', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.PatientsController = PatientsController;
