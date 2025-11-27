// clinical-service/src/services/tumor-type.service.ts
import { connectionPool } from '../config/database.config';
import { Logger } from '../utils/logger.utils';
import { TumorType, CreateTumorTypeData } from '../models/tumor-type.model';

export class TumorTypeService {
  /**
   * Obtener todos los tipos de tumor
   */
  static async getAllTumorTypes(): Promise<TumorType[]> {
    try {
      Logger.debug('Obteniendo catálogo de tipos de tumor');

      const [tumorTypes] = await connectionPool.execute(
        'SELECT * FROM tumor_types ORDER BY name ASC'
      );

      Logger.debug(`Se encontraron ${(tumorTypes as any).length} tipos de tumor`);
      return tumorTypes as TumorType[];

    } catch (error) {
      Logger.error('Error al obtener tipos de tumor', error);
      throw new Error('No se pudieron obtener los tipos de tumor');
    }
  }

  /**
   * Obtener tipo de tumor por ID
   */
  static async getTumorTypeById(id: number): Promise<TumorType | null> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.debug('Buscando tipo de tumor por ID', { tumorTypeId: id });

      const [tumorTypes] = await connection.execute(
        'SELECT * FROM tumor_types WHERE id = ?',
        [id]
      );

      const tumorTypeArray = tumorTypes as any[];
      if (tumorTypeArray.length === 0) {
        Logger.warn('Tipo de tumor no encontrado', { tumorTypeId: id });
        return null;
      }

      return tumorTypeArray[0];

    } catch (error) {
      Logger.error('Error al buscar tipo de tumor', { tumorTypeId: id, error });
      throw new Error('No se pudo obtener el tipo de tumor');
    } finally {
      connection.release();
    }
  }

  /**
   * Crear nuevo tipo de tumor
   */
  static async createTumorType(data: CreateTumorTypeData): Promise<TumorType> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.info('Creando nuevo tipo de tumor', { name: data.name });

      // Verificar si ya existe
      const [existing] = await connection.execute(
        'SELECT id FROM tumor_types WHERE name = ?',
        [data.name]
      );

      if ((existing as any).length > 0) {
        throw new Error('Ya existe un tipo de tumor con ese nombre');
      }

      const [result] = await connection.execute(
        'INSERT INTO tumor_types (name, systemAffected) VALUES (?, ?)',
        [data.name, data.systemAffected]
      );

      const [tumorTypes] = await connection.execute(
        'SELECT * FROM tumor_types WHERE id = ?',
        [(result as any).insertId]
      );

      const tumorType = (tumorTypes as any)[0];
      Logger.info('Tipo de tumor creado exitosamente', { tumorTypeId: tumorType.id });
      return tumorType;

    } catch (error) {
      Logger.error('Error al crear tipo de tumor', error);
      if (error instanceof Error && error.message === 'Ya existe un tipo de tumor con ese nombre') {
        throw error;
      }
      throw new Error('No se pudo crear el tipo de tumor');
    } finally {
      connection.release();
    }
  }

  /**
   * Buscar tipos de tumor
   */
  static async searchTumorTypes(query: string): Promise<TumorType[]> {
    const connection = await connectionPool.getConnection();
    try {
      Logger.debug('Buscando tipos de tumor', { query });

      const [tumorTypes] = await connection.execute(
        `SELECT * FROM tumor_types 
         WHERE name LIKE ? OR systemAffected LIKE ? 
         ORDER BY name ASC`,
        [`%${query}%`, `%${query}%`]
      );

      Logger.debug(`Búsqueda completada: ${(tumorTypes as any).length} resultados`, { query });
      return tumorTypes as TumorType[];

    } catch (error) {
      Logger.error('Error en búsqueda de tipos de tumor', { query, error });
      throw new Error('No se pudo realizar la búsqueda');
    } finally {
      connection.release();
    }
  }
}