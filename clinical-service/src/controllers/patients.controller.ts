// clinical-service/src/controllers/patients.controller.ts
import { Request, Response } from 'express';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto, UpdatePatientDto } from '../dto/patient.dto';
import { Logger } from '../utils/logger.utils';
import { z } from 'zod';

export class PatientsController {
  /**
   * Crear un nuevo paciente
   */
  static async createPatient(req: Request, res: Response) {
    try {
      Logger.info('Solicitud de creación de paciente recibida');

      const patient = await PatientService.createPatient(req.body);

      res.status(201).json({
        success: true,
        message: 'Paciente creado exitosamente',
        data: patient
      });

    } catch (error: any) {
      Logger.error('Error en controlador createPatient', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Obtener todos los pacientes
   */
  static async getAllPatients(req: Request, res: Response) {
    try {
      Logger.info('Solicitud de listado de pacientes recibida');

      const patients = await PatientService.getAllPatients();

      res.status(200).json({
        success: true,
        data: patients,
        count: patients.length
      });

    } catch (error: any) {
      Logger.error('Error en controlador getAllPatients', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Obtener paciente por ID
   */
  static async getPatientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      Logger.info('Solicitud de paciente por ID', { patientId: id });

      const patient = await PatientService.getPatientById(id);

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

    } catch (error: any) {
      Logger.error('Error en controlador getPatientById', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Actualizar paciente
   */
  static async updatePatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      Logger.info('Solicitud de actualización de paciente', { patientId: id });

      const patient = await PatientService.updatePatient(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Paciente actualizado exitosamente',
        data: patient
      });

    } catch (error: any) {
      Logger.error('Error en controlador updatePatient', error);
      
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
  static async deactivatePatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      Logger.info('Solicitud de desactivación de paciente', { patientId: id });

      const patient = await PatientService.deactivatePatient(id);

      res.status(200).json({
        success: true,
        message: 'Paciente desactivado exitosamente',
        data: patient
      });

    } catch (error: any) {
      Logger.error('Error en controlador deactivatePatient', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Buscar pacientes
   */
  static async searchPatients(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Parámetro de búsqueda requerido'
        });
      }

      Logger.info('Solicitud de búsqueda de pacientes', { query });

      const patients = await PatientService.searchPatients(query);

      res.status(200).json({
        success: true,
        data: patients,
        count: patients.length,
        query
      });

    } catch (error: any) {
      Logger.error('Error en controlador searchPatients', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}