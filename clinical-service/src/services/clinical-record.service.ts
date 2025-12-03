// clinical-service/src/services/clinical-record.service.ts
import { connectionPool } from '../config/database.config';
import { Logger } from '../utils/logger.utils';
import { 
  ClinicalRecord, 
  CreateClinicalRecordData,
  ClinicalRecordWithRelations 
} from '../models/clinical-record.model';

export class ClinicalRecordService {
  /**
   * Crear nuevo registro clínico
   */
  static async createClinicalRecord(data: CreateClinicalRecordData): Promise<ClinicalRecord> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.info('Creando nuevo registro clínico', { 
        patientId: data.patientId, 
        tumorTypeId: data.tumorTypeId 
      });

      // Verificar que el paciente existe
      const [patients] = await connection.execute(
        'SELECT id FROM patients WHERE id = ?',
        [data.patientId]
      );

      if ((patients as any).length === 0) {
        throw new Error('Paciente no encontrado');
      }

      // Verificar que el tipo de tumor existe
      const [tumorTypes] = await connection.execute(
        'SELECT id FROM tumor_types WHERE id = ?',
        [data.tumorTypeId]
      );

      if ((tumorTypes as any).length === 0) {
        throw new Error('Tipo de tumor no encontrado');
      }

      // 👇 CONVERSIÓN DE FECHA - SOLUCIÓN DEFINITIVA
      const dateObj = new Date(data.diagnosisDate);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Formato de fecha inválido');
      }
      const mysqlDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
      
      Logger.debug('Fecha convertida a formato MySQL', { 
        original: data.diagnosisDate, 
        converted: mysqlDate 
      });

      const [result] = await connection.execute(
        `INSERT INTO clinical_records (patientId, tumorTypeId, diagnosisDate, stage, treatmentProtocol) 
         VALUES (?, ?, ?, ?, ?)`,
        [data.patientId, data.tumorTypeId, mysqlDate, data.stage, data.treatmentProtocol] // 👈 Usar mysqlDate
      );

      const [records] = await connection.execute(
        'SELECT * FROM clinical_records WHERE id = ?',
        [(result as any).insertId]
      );

      const record = (records as any)[0];
      Logger.info('Registro clínico creado exitosamente', { recordId: record.id });
      return record;

    } catch (error) {
      Logger.error('Error al crear registro clínico', error);
      if (error instanceof Error && 
          (error.message === 'Paciente no encontrado' || 
           error.message === 'Tipo de tumor no encontrado' ||
           error.message.includes('Formato de fecha inválido'))) {
        throw error;
      }
      throw new Error('No se pudo crear el registro clínico');
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener todos los registros clínicos con relaciones
   */
  static async getAllClinicalRecords(): Promise<ClinicalRecordWithRelations[]> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.debug('Obteniendo lista de registros clínicos');

      const [records] = await connection.execute(`
        SELECT 
          cr.*,
          p.firstName as patientFirstName,
          p.lastName as patientLastName,
          tt.name as tumorTypeName,
          tt.systemAffected as tumorTypeSystem
        FROM clinical_records cr
        LEFT JOIN patients p ON cr.patientId = p.id
        LEFT JOIN tumor_types tt ON cr.tumorTypeId = tt.id
        ORDER BY cr.diagnosisDate DESC
      `);

      const formattedRecords = (records as any[]).map(record => ({
        id: record.id,
        patientId: record.patientId,
        tumorTypeId: record.tumorTypeId,
        diagnosisDate: record.diagnosisDate,
        stage: record.stage,
        treatmentProtocol: record.treatmentProtocol,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        patient: {
          firstName: record.patientFirstName,
          lastName: record.patientLastName
        },
        tumorType: {
          name: record.tumorTypeName,
          systemAffected: record.tumorTypeSystem
        }
      }));

      Logger.debug(`Se encontraron ${formattedRecords.length} registros clínicos`);
      return formattedRecords;

    } catch (error) {
      Logger.error('Error al obtener registros clínicos', error);
      throw new Error('No se pudieron obtener los registros clínicos');
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener registros clínicos por paciente
   */
  static async getClinicalRecordsByPatient(patientId: string): Promise<ClinicalRecordWithRelations[]> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.debug('Obteniendo registros clínicos por paciente', { patientId });

      const [records] = await connection.execute(`
        SELECT 
          cr.*,
          p.firstName as patientFirstName,
          p.lastName as patientLastName,
          tt.name as tumorTypeName,
          tt.systemAffected as tumorTypeSystem
        FROM clinical_records cr
        LEFT JOIN patients p ON cr.patientId = p.id
        LEFT JOIN tumor_types tt ON cr.tumorTypeId = tt.id
        WHERE cr.patientId = ?
        ORDER BY cr.diagnosisDate DESC
      `, [patientId]);

      const formattedRecords = (records as any[]).map(record => ({
        id: record.id,
        patientId: record.patientId,
        tumorTypeId: record.tumorTypeId,
        diagnosisDate: record.diagnosisDate,
        stage: record.stage,
        treatmentProtocol: record.treatmentProtocol,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        patient: {
          firstName: record.patientFirstName,
          lastName: record.patientLastName
        },
        tumorType: {
          name: record.tumorTypeName,
          systemAffected: record.tumorTypeSystem
        }
      }));

      Logger.debug(`Se encontraron ${formattedRecords.length} registros para el paciente`, { patientId });
      return formattedRecords;

    } catch (error) {
      Logger.error('Error al obtener registros del paciente', { patientId, error });
      throw new Error('No se pudieron obtener los registros clínicos del paciente');
    } finally {
      connection.release();
    }
  }

  /**
   * Obtener registro clínico por ID
   */
  static async getClinicalRecordById(id: string): Promise<ClinicalRecordWithRelations | null> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.debug('Buscando registro clínico por ID', { recordId: id });

      const [records] = await connection.execute(`
        SELECT 
          cr.*,
          p.firstName as patientFirstName,
          p.lastName as patientLastName,
          tt.name as tumorTypeName,
          tt.systemAffected as tumorTypeSystem
        FROM clinical_records cr
        LEFT JOIN patients p ON cr.patientId = p.id
        LEFT JOIN tumor_types tt ON cr.tumorTypeId = tt.id
        WHERE cr.id = ?
      `, [id]);

      const recordArray = records as any[];
      if (recordArray.length === 0) {
        Logger.warn('Registro clínico no encontrado', { recordId: id });
        return null;
      }

      const record = recordArray[0];
      return {
        id: record.id,
        patientId: record.patientId,
        tumorTypeId: record.tumorTypeId,
        diagnosisDate: record.diagnosisDate,
        stage: record.stage,
        treatmentProtocol: record.treatmentProtocol,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        patient: {
          firstName: record.patientFirstName,
          lastName: record.patientLastName
        },
        tumorType: {
          name: record.tumorTypeName,
          systemAffected: record.tumorTypeSystem
        }
      };

    } catch (error) {
      Logger.error('Error al buscar registro clínico', { recordId: id, error });
      throw new Error('No se pudo obtener el registro clínico');
    } finally {
      connection.release();
    }
  }

  /**
   * Buscar registros clínicos por etapa
   */
  static async searchClinicalRecordsByStage(stage: string): Promise<ClinicalRecordWithRelations[]> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.debug('Buscando registros clínicos por etapa', { stage });

      const [records] = await connection.execute(`
        SELECT 
          cr.*,
          p.firstName as patientFirstName,
          p.lastName as patientLastName,
          tt.name as tumorTypeName,
          tt.systemAffected as tumorTypeSystem
        FROM clinical_records cr
        LEFT JOIN patients p ON cr.patientId = p.id
        LEFT JOIN tumor_types tt ON cr.tumorTypeId = tt.id
        WHERE cr.stage LIKE ?
        ORDER BY cr.diagnosisDate DESC
      `, [`%${stage}%`]);

      const formattedRecords = (records as any[]).map(record => ({
        id: record.id,
        patientId: record.patientId,
        tumorTypeId: record.tumorTypeId,
        diagnosisDate: record.diagnosisDate,
        stage: record.stage,
        treatmentProtocol: record.treatmentProtocol,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        patient: {
          firstName: record.patientFirstName,
          lastName: record.patientLastName
        },
        tumorType: {
          name: record.tumorTypeName,
          systemAffected: record.tumorTypeSystem
        }
      }));

      Logger.debug(`Búsqueda por etapa completada: ${formattedRecords.length} resultados`, { stage });
      return formattedRecords;

    } catch (error) {
      Logger.error('Error en búsqueda por etapa', { stage, error });
      throw new Error('No se pudo realizar la búsqueda');
    } finally {
      connection.release();
    }
  }
}