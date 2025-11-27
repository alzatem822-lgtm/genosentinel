"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TumorTypeService = void 0;
// clinical-service/src/services/tumor-type.service.ts
const database_config_1 = require("../config/database.config");
const logger_utils_1 = require("../utils/logger.utils");
class TumorTypeService {
    /**
     * Obtener todos los tipos de tumor
     */
    static async getAllTumorTypes() {
        try {
            logger_utils_1.Logger.debug('Obteniendo catálogo de tipos de tumor');
            const [tumorTypes] = await database_config_1.connectionPool.execute('SELECT * FROM tumor_types ORDER BY name ASC');
            logger_utils_1.Logger.debug(`Se encontraron ${tumorTypes.length} tipos de tumor`);
            return tumorTypes;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al obtener tipos de tumor', error);
            throw new Error('No se pudieron obtener los tipos de tumor');
        }
    }
    /**
     * Obtener tipo de tumor por ID
     */
    static async getTumorTypeById(id) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.debug('Buscando tipo de tumor por ID', { tumorTypeId: id });
            const [tumorTypes] = await connection.execute('SELECT * FROM tumor_types WHERE id = ?', [id]);
            const tumorTypeArray = tumorTypes;
            if (tumorTypeArray.length === 0) {
                logger_utils_1.Logger.warn('Tipo de tumor no encontrado', { tumorTypeId: id });
                return null;
            }
            return tumorTypeArray[0];
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al buscar tipo de tumor', { tumorTypeId: id, error });
            throw new Error('No se pudo obtener el tipo de tumor');
        }
        finally {
            connection.release();
        }
    }
    /**
     * Crear nuevo tipo de tumor
     */
    static async createTumorType(data) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.info('Creando nuevo tipo de tumor', { name: data.name });
            // Verificar si ya existe
            const [existing] = await connection.execute('SELECT id FROM tumor_types WHERE name = ?', [data.name]);
            if (existing.length > 0) {
                throw new Error('Ya existe un tipo de tumor con ese nombre');
            }
            const [result] = await connection.execute('INSERT INTO tumor_types (name, systemAffected) VALUES (?, ?)', [data.name, data.systemAffected]);
            const [tumorTypes] = await connection.execute('SELECT * FROM tumor_types WHERE id = ?', [result.insertId]);
            const tumorType = tumorTypes[0];
            logger_utils_1.Logger.info('Tipo de tumor creado exitosamente', { tumorTypeId: tumorType.id });
            return tumorType;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error al crear tipo de tumor', error);
            if (error instanceof Error && error.message === 'Ya existe un tipo de tumor con ese nombre') {
                throw error;
            }
            throw new Error('No se pudo crear el tipo de tumor');
        }
        finally {
            connection.release();
        }
    }
    /**
     * Buscar tipos de tumor
     */
    static async searchTumorTypes(query) {
        const connection = await database_config_1.connectionPool.getConnection();
        try {
            logger_utils_1.Logger.debug('Buscando tipos de tumor', { query });
            const [tumorTypes] = await connection.execute(`SELECT * FROM tumor_types 
         WHERE name LIKE ? OR systemAffected LIKE ? 
         ORDER BY name ASC`, [`%${query}%`, `%${query}%`]);
            logger_utils_1.Logger.debug(`Búsqueda completada: ${tumorTypes.length} resultados`, { query });
            return tumorTypes;
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en búsqueda de tipos de tumor', { query, error });
            throw new Error('No se pudo realizar la búsqueda');
        }
        finally {
            connection.release();
        }
    }
}
exports.TumorTypeService = TumorTypeService;
