"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_config_1 = require("../config/env.config");
class GatewayService {
    static async routeToClinicalService(req, res) {
        try {
            const { method, originalUrl, body, headers } = req;
            const clinicalPath = originalUrl.replace('/api/clinical', '');
            const targetUrl = `${env_config_1.envConfig.clinicalServiceUrl}${clinicalPath}`;
            console.log(`🔄 Gateway → Clinical Service: ${method} ${targetUrl}`);
            const { authorization, 'content-type': contentType, ...otherHeaders } = headers;
            const forwardHeaders = {
                'Content-Type': contentType || 'application/json',
                ...(authorization && { 'Authorization': authorization }),
                ...otherHeaders
            };
            const response = await (0, axios_1.default)({
                method: method,
                url: targetUrl,
                data: body,
                headers: forwardHeaders,
                validateStatus: () => true
            });
            res.status(response.status).json(response.data);
        }
        catch (error) {
            console.error('❌ Error routing to Clinical Service:', error.message);
            res.status(502).json({
                success: false,
                message: 'Clinical Service no disponible',
                error: error.message
            });
        }
    }
    static async routeToGenomicsService(req, res) {
        try {
            const { method, originalUrl, body, headers } = req;
            const genomicsPath = originalUrl.replace('/api/genomics', '');
            const targetUrl = `${env_config_1.envConfig.genomicsServiceUrl}${genomicsPath}`;
            console.log(`🔄 Gateway → Genomics Service: ${method} ${targetUrl}`);
            const { authorization, 'content-type': contentType, ...otherHeaders } = headers;
            const forwardHeaders = {
                'Content-Type': contentType || 'application/json',
                ...(authorization && { 'Authorization': authorization }),
                ...otherHeaders
            };
            const response = await (0, axios_1.default)({
                method: method,
                url: targetUrl,
                data: body,
                headers: forwardHeaders,
                validateStatus: () => true
            });
            res.status(response.status).json(response.data);
        }
        catch (error) {
            console.error('❌ Error routing to Genomics Service:', error.message);
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
                axios_1.default.get(`${env_config_1.envConfig.clinicalServiceUrl}/health`),
                axios_1.default.get(`${env_config_1.envConfig.genomicsServiceUrl}/health`)
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
