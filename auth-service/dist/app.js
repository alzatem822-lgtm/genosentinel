"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const env_config_1 = require("./config/env.config");
const database_config_1 = require("./config/database.config");
const email_service_1 = require("./services/email.service");
const swaggerUi = require('swagger-ui-express');
const swagger_config_1 = require("./config/swagger.config");

class App {
        
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
        this.initializeDatabase();
        this.initializeServices();
    }
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.FRONTEND_URL || 'http://localhost:4200',
            credentials: true
        }));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        console.log('🛡️  Middlewares de seguridad y CORS configurados');
    }
    initializeRoutes() {
        this.app.get('/', (req, res) => {
            res.status(200).json({
                success: true,
                message: '🚀 GenoSentinel - Auth Service',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                environment: env_config_1.envConfig.nodeEnv
            });
        });
        this.app.use('/auth', auth_routes_1.default);
        console.log('🛣️  Rutas inicializadas correctamente');
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger_config_1.swaggerSpec));
        console.log('📚 Documentación Swagger disponible en /api-docs');
    }
    initializeErrorHandling() {
        this.app.use(auth_middleware_1.errorHandler);
        console.log('🚨 Manejo de errores configurado');
    }
    async initializeDatabase() {
        try {
            const isConnected = await (0, database_config_1.testConnection)();
            if (isConnected) {
                console.log('🗄️  Base de datos conectada exitosamente');
            }
            else {
                console.log('⚠️  Base de datos no disponible');
            }
        }
        catch (error) {
            console.error('❌ Error inicializando base de datos:', error);
        }
    }
    initializeServices() {
        email_service_1.EmailService.configure(process.env.SENDGRID_API_KEY || '');
        console.log('📧 Servicio de email configurado');
    }
    getServer() {
        return this.app;
    }
}
exports.default = App;
