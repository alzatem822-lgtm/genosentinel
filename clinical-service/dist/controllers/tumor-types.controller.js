"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TumorTypesController = void 0;
const tumor_type_service_1 = require("../services/tumor-type.service");
const logger_utils_1 = require("../utils/logger.utils");
class TumorTypesController {
    /**
     * Obtener todos los tipos de tumor
     */
    static async getAllTumorTypes(req, res) {
        try {
            logger_utils_1.Logger.info('Solicitud de catálogo de tipos de tumor recibida');
            const tumorTypes = await tumor_type_service_1.TumorTypeService.getAllTumorTypes();
            res.status(200).json({
                success: true,
                data: tumorTypes,
                count: tumorTypes.length
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador getAllTumorTypes', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Obtener tipo de tumor por ID
     */
    static async getTumorTypeById(req, res) {
        try {
            const { id } = req.params;
            logger_utils_1.Logger.info('Solicitud de tipo de tumor por ID', { tumorTypeId: id });
            const tumorType = await tumor_type_service_1.TumorTypeService.getTumorTypeById(parseInt(id));
            if (!tumorType) {
                return res.status(404).json({
                    success: false,
                    error: 'Tipo de tumor no encontrado'
                });
            }
            res.status(200).json({
                success: true,
                data: tumorType
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador getTumorTypeById', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Crear nuevo tipo de tumor
     */
    static async createTumorType(req, res) {
        try {
            logger_utils_1.Logger.info('Solicitud de creación de tipo de tumor recibida');
            const tumorType = await tumor_type_service_1.TumorTypeService.createTumorType(req.body);
            res.status(201).json({
                success: true,
                message: 'Tipo de tumor creado exitosamente',
                data: tumorType
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador createTumorType', error);
            const status = error.message === 'Ya existe un tipo de tumor con ese nombre' ? 409 : 500;
            res.status(status).json({
                success: false,
                error: error.message
            });
        }
    }
    /**
     * Buscar tipos de tumor
     */
    static async searchTumorTypes(req, res) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'Parámetro de búsqueda requerido'
                });
            }
            logger_utils_1.Logger.info('Solicitud de búsqueda de tipos de tumor', { query });
            const tumorTypes = await tumor_type_service_1.TumorTypeService.searchTumorTypes(query);
            res.status(200).json({
                success: true,
                data: tumorTypes,
                count: tumorTypes.length,
                query
            });
        }
        catch (error) {
            logger_utils_1.Logger.error('Error en controlador searchTumorTypes', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.TumorTypesController = TumorTypesController;
