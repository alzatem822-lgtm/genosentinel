"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
// clinical-service/src/services/patient.service.ts
const database_config_1 = require("../config/database.config");
const logger_utils_1 = require("../utils/logger.utils");
class PatientService {
    /**
     * Crear un nuevo paciente
     */
    static async createPatient(data) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.info('Creando nuevo paciente', { firstName: data.firstName, lastName: data.lastName });
            const [result] = await connection.execute(`INSERT INTO patients (firstName, lastName, birthDate, gender, status) 
         VALUES (?, ?, ?, ?, ?)`, [data.firstName, data.lastName, data.birthDate, data.gender, data.status || 'Activo']);
            const [patients] = await connection.execute('SELECT * FROM patients WHERE id = ?', [result.insertId]);
            const patient = patients[0];
            logger_utils_1.Logger.info('Paciente creado exitosamente', { patientId: patient.id });
            return patient;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al crear paciente', error);
            throw new Error('No se pudo crear el paciente');
        }
        finally {
            connection.release();
        }
    }
    /**
     * Obtener todos los pacientes
     */
    static async getAllPatients() {
        try {
            logger_utils_1.Logger.info('Obteniendo lista de pacientes');
            const [patients] = await database_config_1.connectionPool.execute('SELECT * FROM patients ORDER BY createdAt DESC');
            logger_utils_1.Logger.info(`Se encontraron ${patients.length} pacientes`);
            return patients;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al obtener pacientes', error);
            throw new Error('No se pudieron obtener los pacientes');
        }
    }
    /**
     * Obtener paciente por ID
     */
    static async getPatientById(id) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.debug('Buscando paciente por ID', { patientId: id });
            const [patients] = await connection.execute('SELECT * FROM patients WHERE id = ?', [id]);
            const patientArray = patients;
            if (patientArray.length === 0) {
                logger_utils_1.Logger.warn('Paciente no encontrado', { patientId: id });
                return null;
            }
            logger_utils_1.Logger.debug('Paciente encontrado', { patientId: id });
            return patientArray[0];
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al buscar paciente', { patientId: id, error });
            throw new Error('No se pudo obtener el paciente');
        }
        finally {
            connection.release();
        }
    }
    /**
     * Actualizar paciente
     */
    static async updatePatient(id, data) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.info('Actualizando paciente', { patientId: id });
            // Verificar que el paciente existe
            const existingPatient = await this.getPatientById(id);
            if (!existingPatient) {
                throw new Error('Paciente no encontrado');
            }
            // Construir query dinámica
            const updates = [];
            const values = [];
            if (data.firstName) {
                updates.push('firstName = ?');
                values.push(data.firstName);
            }
            if (data.lastName) {
                updates.push('lastName = ?');
                values.push(data.lastName);
            }
            if (data.birthDate) {
                updates.push('birthDate = ?');
                values.push(data.birthDate);
            }
            if (data.gender) {
                updates.push('gender = ?');
                values.push(data.gender);
            }
            if (data.status) {
                updates.push('status = ?');
                values.push(data.status);
            }
            if (updates.length === 0) {
                throw new Error('No hay datos para actualizar');
            }
            values.push(id);
            await connection.execute(`UPDATE patients SET ${updates.join(', ')} WHERE id = ?`, values);
            const updatedPatient = await this.getPatientById(id);
            if (!updatedPatient) {
                throw new Error('Error al obtener paciente actualizado');
            }
            logger_utils_1.Logger.info('Paciente actualizado exitosamente', { patientId: id });
            return updatedPatient;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al actualizar paciente', { patientId: id, error });
            if (error instanceof Error && error.message === 'Paciente no encontrado') {
                throw error;
            }
            throw new Error('No se pudo actualizar el paciente');
        }
        finally {
            connection.release();
        }
    }
    /**
     * Desactivar paciente
     */
    static async deactivatePatient(id) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.info('Desactivando paciente', { patientId: id });
            await connection.execute('UPDATE patients SET status = ? WHERE id = ?', ['Inactivo', id]);
            const patient = await this.getPatientById(id);
            if (!patient) {
                throw new Error('Paciente no encontrado después de desactivar');
            }
            logger_utils_1.Logger.info('Paciente desactivado exitosamente', { patientId: id });
            return patient;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al desactivar paciente', { patientId: id, error });
            throw new Error('No se pudo desactivar el paciente');
        }
        finally {
            connection.release();
        }
    }
    /**
     * Buscar pacientes por nombre
     */
    static async searchPatients(query) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.info('Buscando pacientes', { query });
            const [patients] = await connection.execute(`SELECT * FROM patients 
         WHERE firstName LIKE ? OR lastName LIKE ? 
         ORDER BY createdAt DESC`, [`%${query}%`, `%${query}%`]);
            logger_utils_1.Logger.info(`Búsqueda completada: ${patients.length} resultados`, { query });
            return patients;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en búsqueda de pacientes', { query, error });
            throw new Error('No se pudo realizar la búsqueda');
        }
        finally {
            connection.release();
        }
    }
}
exports.PatientService = PatientService;
