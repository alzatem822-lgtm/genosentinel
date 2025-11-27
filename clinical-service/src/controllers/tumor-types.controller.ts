// clinical-service/src/controllers/tumor-types.controller.ts
import { Request, Response } from 'express';
import { TumorTypeService } from '../services/tumor-type.service';
import { CreateTumorTypeDto } from '../dto/tumor-type.dto';
import { Logger } from '../utils/logger.utils';

export class TumorTypesController {
  /**
   * Obtener todos los tipos de tumor
   */
  static async getAllTumorTypes(req: Request, res: Response) {
    try {
      Logger.info('Solicitud de catálogo de tipos de tumor recibida');

      const tumorTypes = await TumorTypeService.getAllTumorTypes();

      res.status(200).json({
        success: true,
        data: tumorTypes,
        count: tumorTypes.length
      });

    } catch (error: any) {
      Logger.error('Error en controlador getAllTumorTypes', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Obtener tipo de tumor por ID
   */
  static async getTumorTypeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      Logger.info('Solicitud de tipo de tumor por ID', { tumorTypeId: id });

      const tumorType = await TumorTypeService.getTumorTypeById(parseInt(id));

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

    } catch (error: any) {
      Logger.error('Error en controlador getTumorTypeById', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Crear nuevo tipo de tumor
   */
  static async createTumorType(req: Request, res: Response) {
    try {
      Logger.info('Solicitud de creación de tipo de tumor recibida');

      const tumorType = await TumorTypeService.createTumorType(req.body);

      res.status(201).json({
        success: true,
        message: 'Tipo de tumor creado exitosamente',
        data: tumorType
      });

    } catch (error: any) {
      Logger.error('Error en controlador createTumorType', error);
      
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
  static async searchTumorTypes(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Parámetro de búsqueda requerido'
        });
      }

      Logger.info('Solicitud de búsqueda de tipos de tumor', { query });

      const tumorTypes = await TumorTypeService.searchTumorTypes(query);

      res.status(200).json({
        success: true,
        data: tumorTypes,
        count: tumorTypes.length,
        query
      });

    } catch (error: any) {
      Logger.error('Error en controlador searchTumorTypes', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}