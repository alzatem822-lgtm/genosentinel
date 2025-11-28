"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const GENOMICA_URL = process.env.GENOMICA_SERVICE_URL;
const CLINICA_URL = process.env.CLINICA_SERVICE_URL;
exports.HealthController = {
    healthCheck: (req, res) => {
        res.status(200).json({
            status: 'UP',
            service: 'Auth/Gateway Service',
            timestamp: new Date().toISOString()
        });
    },
    statusCheck: async (req, res) => {
        const checkService = async (url, name) => {
            if (!url)
                return { name, status: 'DOWN', error: 'URL no configurada' };
            try {
                const response = await axios_1.default.get(`${url}/health`, { timeout: 3000 });
                return { name, status: response.status === 200 ? 'UP' : 'DOWN', responseStatus: response.status };
            }
            catch (error) {
                return { name, status: 'DOWN', error: error.code || error.message };
            }
        };
        const [genomicaStatus, clinicaStatus] = await Promise.all([
            checkService(GENOMICA_URL, 'Genomica Service'),
            checkService(CLINICA_URL, 'Clinica Service')
        ]);
        const overallStatus = (genomicaStatus.status === 'UP' && clinicaStatus.status === 'UP') ? 'UP' : 'DEGRADED';
        res.status(200).json({
            status: overallStatus,
            service: 'Auth/Gateway Service',
            timestamp: new Date().toISOString(),
            dependencies: [
                genomicaStatus,
                clinicaStatus
            ]
        });
    }
};
