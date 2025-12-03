"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayService = void 0;
const axios_1 = __importDefault(require("axios"));

class GatewayService {
    static async routeToClinicalService(req, res) {
        try {
            // 👇 AÑADIR LOGS DE DEBUG DETALLADOS
            console.log('🔍 [DEBUG] Gateway recibió request:', {
                method: req.method,
                originalUrl: req.originalUrl,
                headers: req.headers,
                body: req.body
            });

            const { method, originalUrl, body, headers } = req;
            
            // 👇 CORREGIR: Cambiar '/api/clinica' por '/api'
            const clinicalPath = originalUrl.replace('/api/clinica', '/api');
            const targetUrl = `http://host.docker.internal:3020${clinicalPath}`;
            
            console.log(`🎯 [DEBUG] Target URL: ${targetUrl}`);
            console.log(`📤 [DEBUG] Enviando a Clinical Service:`, { 
                method: method, 
                path: clinicalPath,
                bodySize: body ? JSON.stringify(body).length : 0 
            });

            // 👇 SIMPLIFICAR HEADERS - solo los esenciales
            const forwardHeaders = {
                'Content-Type': 'application/json',
                'Authorization': headers.authorization
                // ❌ NO enviar otros headers que puedan causar problemas
            };

            console.log(`📨 [DEBUG] Headers enviados:`, forwardHeaders);

            const response = await (0, axios_1.default)({
                method: method,
                url: targetUrl,
                data: body,
                headers: forwardHeaders,
                validateStatus: () => true,
                timeout: 30000 // 👈 AUMENTAR TIMEOUT a 30 segundos
            });

            console.log(`✅ [DEBUG] Clinical Service respondió:`, {
                status: response.status,
                data: response.data
            });

            res.status(response.status).json(response.data);
        }
        catch (error) {
            console.error('❌ [DEBUG] Error routing to Clinical Service:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            res.status(502).json({
                success: false,
                message: 'Clinical Service no disponible',
                error: error.message
            });
        }
    }

    static async routeToGenomicsService(req, res) {
        try {
            console.log('🔍 [DEBUG] Gateway recibió request Genomics:', {
                method: req.method,
                originalUrl: req.originalUrl
            });

            const { method, originalUrl, body, headers } = req;
            
            // 👇 CORREGIR: Cambiar '/api/genomica' por '/api'
            const genomicsPath = originalUrl.replace('/api/genomica', '/api');
            const targetUrl = `http://host.docker.internal:3002${genomicsPath}`;
            
            console.log(`🎯 [DEBUG] Target URL Genomics: ${targetUrl}`);

            // 👇 SIMPLIFICAR HEADERS
            const forwardHeaders = {
                'Content-Type': 'application/json',
                'Authorization': headers.authorization
            };

            const response = await (0, axios_1.default)({
                method: method,
                url: targetUrl,
                data: body,
                headers: forwardHeaders,
                validateStatus: () => true,
                timeout: 30000
            });

            console.log(`✅ [DEBUG] Genomics Service respondió:`, response.status);

            res.status(response.status).json(response.data);
        }
        catch (error) {
            console.error('❌ [DEBUG] Error routing to Genomics Service:', error.message);
            res.status(502).json({
                success: false,
                message: 'Genomics Service no disponible',
                error: error.message
            });
        }
    }

    static async checkServicesStatus() {
        try {
            const [clinicalStatus, genomicsStatus] = await Promise.allSettled([
                axios_1.default.get('http://host.docker.internal:3020/api/health', { timeout: 5000 }),
                axios_1.default.get('http://host.docker.internal:3002/api/health', { timeout: 5000 })
            ]);

            return {
                clinical: clinicalStatus.status === 'fulfilled',
                genomics: genomicsStatus.status === 'fulfilled'
            };
        }
        catch (error) {
            return {
                clinical: false,
                genomics: false
            };
        }
    }
}
exports.GatewayService = GatewayService;
exports.default = GatewayService;