import axios from 'axios';
import { Request, Response } from 'express';
import { envConfig } from '../config/env.config';

export class GatewayService {
  // Redirigir peticiones al Clinical Service
  static async routeToClinicalService(req: Request, res: Response): Promise<void> {
    try {
      const { method, originalUrl, body, headers } = req;
      
      // Remover el prefijo /api del path
      const clinicalPath = originalUrl.replace('/api/clinical', '');
      const targetUrl = `${envConfig.clinicalServiceUrl}${clinicalPath}`;

      console.log(`🔄 Gateway → Clinical Service: ${method} ${targetUrl}`);

      // Configurar headers (remover headers de gateway)
      const { authorization, 'content-type': contentType, ...otherHeaders } = headers;
      const forwardHeaders = {
        'Content-Type': contentType || 'application/json',
        ...(authorization && { 'Authorization': authorization }),
        ...otherHeaders
      };

      // Realizar la petición
      const response = await axios({
        method: method as any,
        url: targetUrl,
        data: body,
        headers: forwardHeaders,
        validateStatus: () => true // Aceptar todos los status codes
      });

      // Devolver la respuesta del Clinical Service
      res.status(response.status).json(response.data);

    } catch (error: any) {
      console.error('❌ Error routing to Clinical Service:', error.message);
      res.status(502).json({
        success: false,
        message: 'Clinical Service no disponible',
        error: error.message
      });
    }
  }

  // Redirigir peticiones al Genomics Service
  static async routeToGenomicsService(req: Request, res: Response): Promise<void> {
    try {
      const { method, originalUrl, body, headers } = req;
      
      // Remover el prefijo /api del path
      const genomicsPath = originalUrl.replace('/api/genomics', '');
      const targetUrl = `${envConfig.genomicsServiceUrl}${genomicsPath}`;

      console.log(`🔄 Gateway → Genomics Service: ${method} ${targetUrl}`);

      // Configurar headers
      const { authorization, 'content-type': contentType, ...otherHeaders } = headers;
      const forwardHeaders = {
        'Content-Type': contentType || 'application/json',
        ...(authorization && { 'Authorization': authorization }),
        ...otherHeaders
      };

      // Realizar la petición
      const response = await axios({
        method: method as any,
        url: targetUrl,
        data: body,
        headers: forwardHeaders,
        validateStatus: () => true
      });

      // Devolver la respuesta del Genomics Service
      res.status(response.status).json(response.data);

    } catch (error: any) {
      console.error('❌ Error routing to Genomics Service:', error.message);
      res.status(502).json({
        success: false,
        message: 'Genomics Service no disponible',
        error: error.message
      });
    }
  }

  // Verificar estado de los servicios
  static async checkServicesStatus(): Promise<{
    clinical: boolean;
    genomics: boolean;
  }> {
    try {
      const [clinicalStatus, genomicsStatus] = await Promise.allSettled([
        axios.get(`${envConfig.clinicalServiceUrl}/health`),
        axios.get(`${envConfig.genomicsServiceUrl}/health`)
      ]);

      return {
        clinical: clinicalStatus.status === 'fulfilled',
        genomics: genomicsStatus.status === 'fulfilled'
      };
    } catch (error) {
      return {
        clinical: false,
        genomics: false
      };
    }
  }
}

export default GatewayService;