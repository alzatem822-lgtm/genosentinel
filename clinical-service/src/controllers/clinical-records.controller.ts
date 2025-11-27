// clinical-service/src/controllers/clinical-records.controller.ts
import { Request, Response } from 'express';
import { ClinicalRecordService } from '../services/clinical-record.service';
import { CreateClinicalRecordDto } from '../dto/clinical-record.dto';
import { Logger } from '../utils/logger.utils';

export class ClinicalRecordsController {
  /**
   * Crear nuevo registro clínico
   */
  static async createClinicalRecord(req: Request, res: Response) {
    try {
      Logger.info('Solicitud de creación de registro clínico recibida');

      const clinicalRecord = await ClinicalRecordService.createClinicalRecord(req.body);

      res.status(201).json({
        success: true,
        message: 'Registro clínico creado exitosamente',
        data: clinicalRecord
      });

    } catch (error: any) {
      Logger.error('Error en controlador createClinicalRecord', error);
      
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
  static async getAllClinicalRecords(req: Request, res: Response) {
    try {
      Logger.info('Solicitud de listado de registros clínicos recibida');

      const records = await ClinicalRecordService.getAllClinicalRecords();

      res.status(200).json({
        success: true,
        data: records,
        count: records.length
      });

    } catch (error: any) {
      Logger.error('Error en controlador getAllClinicalRecords', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Obtener registros clínicos por paciente
   */
  static async getClinicalRecordsByPatient(req: Request, res: Response) {
    try {
      const { patientId } = req.params;
      Logger.info('Solicitud de registros clínicos por paciente', { patientId });

      const records = await ClinicalRecordService.getClinicalRecordsByPatient(patientId);

      res.status(200).json({
        success: true,
        data: records,
        count: records.length,
        patientId
      });

    } catch (error: any) {
      Logger.error('Error en controlador getClinicalRecordsByPatient', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Obtener registro clínico por ID
   */
  static async getClinicalRecordById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      Logger.info('Solicitud de registro clínico por ID', { recordId: id });

      const record = await ClinicalRecordService.getClinicalRecordById(id);

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

    } catch (error: any) {
      Logger.error('Error en controlador getClinicalRecordById', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Buscar registros clínicos por etapa
   */
  static async searchClinicalRecordsByStage(req: Request, res: Response) {
    try {
      const { stage } = req.query;
      
      if (!stage || typeof stage !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Parámetro de etapa requerido'
        });
      }

      Logger.info('Solicitud de búsqueda por etapa', { stage });

      const records = await ClinicalRecordService.searchClinicalRecordsByStage(stage);

      res.status(200).json({
        success: true,
        data: records,
        count: records.length,
        stage
      });

    } catch (error: any) {
      Logger.error('Error en controlador searchClinicalRecordsByStage', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}