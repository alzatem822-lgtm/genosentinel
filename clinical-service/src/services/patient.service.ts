// clinical-service/src/services/patient.service.ts
import { connectionPool } from '../config/database.config';
import { Logger } from '../utils/logger.utils';
import { Patient, CreatePatientData, UpdatePatientData } from '../models/patient.model';

export class PatientService {
  /**
   * Crear un nuevo paciente
   */
  static async createPatient(data: CreatePatientData): Promise<Patient> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.info('Creando nuevo paciente', { firstName: data.firstName, lastName: data.lastName });

      // SOLUCIÓN SIMPLE: Convertir a formato YYYY-MM-DD
      const birthDate = new Date(data.birthDate).toISOString().split('T')[0];

      const [result] = await connection.execute(
        `INSERT INTO patients (id, firstName, lastName, birthDate, gender, status) 
         VALUES (UUID(), ?, ?, ?, ?, ?)`,
        [data.firstName, data.lastName, birthDate, data.gender, data.status || 'Activo']
      );

      const [patients] = await connection.execute(
        'SELECT * FROM patients WHERE id = ?',
        [(result as any).insertId]
      );

      const patient = (patients as any)[0];
      Logger.info('Paciente creado exitosamente', { patientId: patient.id });
      return patient;

    } catch (error) {
      Logger.error('Error al crear paciente', error);
      throw new Error('No se pudo crear el paciente');
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener todos los pacientes
   */
  static async getAllPatients(): Promise<Patient[]> {
    try {
      Logger.info('Obteniendo lista de pacientes');

      const [patients] = await connectionPool.execute(
        'SELECT * FROM patients ORDER BY createdAt DESC'
      );

      Logger.info(`Se encontraron ${(patients as any).length} pacientes`);
      return patients as Patient[];

    } catch (error) {
      Logger.error('Error al obtener pacientes', error);
      throw new Error('No se pudieron obtener los pacientes');
    }
  }

  /**
   * Obtener paciente por ID
   */
  static async getPatientById(id: string): Promise<Patient | null> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.debug('Buscando paciente por ID', { patientId: id });

      const [patients] = await connection.execute(
        'SELECT * FROM patients WHERE id = ?',
        [id]
      );

      const patientArray = patients as any[];
      if (patientArray.length === 0) {
        Logger.warn('Paciente no encontrado', { patientId: id });
        return null;
      }

      Logger.debug('Paciente encontrado', { patientId: id });
      return patientArray[0];

    } catch (error) {
      Logger.error('Error al buscar paciente', { patientId: id, error });
      throw new Error('No se pudo obtener el paciente');
    } finally {
      connection.release();
    }
  }

  /**
   * Actualizar paciente
   */
  static async updatePatient(id: string, data: UpdatePatientData): Promise<Patient> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.info('Actualizando paciente', { patientId: id });

      // Verificar que el paciente existe
      const existingPatient = await this.getPatientById(id);
      if (!existingPatient) {
        throw new Error('Paciente no encontrado');
      }

      // Construir query dinámica
      const updates: string[] = [];
      const values: any[] = [];

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
        values.push(new Date(data.birthDate).toISOString().split('T')[0]); // ← SOLUCIÓN SIMPLE
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

      await connection.execute(
        `UPDATE patients SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const updatedPatient = await this.getPatientById(id);
      if (!updatedPatient) {
        throw new Error('Error al obtener paciente actualizado');
      }

      Logger.info('Paciente actualizado exitosamente', { patientId: id });
      return updatedPatient;

    } catch (error) {
      Logger.error('Error al actualizar paciente', { patientId: id, error });
      if (error instanceof Error && error.message === 'Paciente no encontrado') {
        throw error;
      }
      throw new Error('No se pudo actualizar el paciente');
    } finally {
      connection.release();
    }
  }

  /**
   * Desactivar paciente
   */
  static async deactivatePatient(id: string): Promise<Patient> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.info('Desactivando paciente', { patientId: id });

      await connection.execute(
        'UPDATE patients SET status = ? WHERE id = ?',
        ['Inactivo', id]
      );

      const patient = await this.getPatientById(id);
      if (!patient) {
        throw new Error('Paciente no encontrado después de desactivar');
      }

      Logger.info('Paciente desactivado exitosamente', { patientId: id });
      return patient;

    } catch (error) {
      Logger.error('Error al desactivar paciente', { patientId: id, error });
      throw new Error('No se pudo desactivar el paciente');
    } finally {
      connection.release();
    }
  }

  /**
   * Buscar pacientes por nombre
   */
  static async searchPatients(query: string): Promise<Patient[]> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.info('Buscando pacientes', { query });

      const [patients] = await connection.execute(
        `SELECT * FROM patients 
         WHERE firstName LIKE ? OR lastName LIKE ? 
         ORDER BY createdAt DESC`,
        [`%${query}%`, `%${query}%`]
      );

      Logger.info(`Búsqueda completada: ${(patients as any).length} resultados`, { query });
      return patients as Patient[];

    } catch (error) {
      Logger.error('Error en búsqueda de pacientes', { query, error });
      throw new Error('No se pudo realizar la búsqueda');
    } finally {
      connection.release();
    }
  }
}