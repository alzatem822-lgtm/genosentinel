"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// clinical-service/src/app.ts (VERSIÓN ACTUALIZADA)
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_config_1 = require("./config/env.config");
const routes_1 = __importDefault(require("./routes"));
const clinical_records_routes_1 = __importDefault(require("./routes/clinical-records.routes")); // 👈 NUEVO IMPORT

const app = (0, express_1.default)();

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GenoSentinel Clinical Service API',
            version: '1.0.0',
            description: 'Microservicio para gestión de datos clínicos de pacientes oncológicos',
            contact: {
                name: 'Equipo GenoSentinel',
                email: 'soporte@genosentinel.com'
            },
        },
        servers: [
            {
                url: `http://localhost:${env_config_1.config.PORT}`,
                description: 'Servidor de desarrollo'
            },
        ],
        tags: [
            {
                name: 'Pacientes',
                description: 'Gestión de pacientes oncológicos'
            },
            {
                name: 'Tipos de Tumor',
                description: 'Catálogo de tipos de tumor'
            },
            {
                name: 'Registros Clínicos',
                description: 'Historias clínicas y diagnósticos'
            }
        ]
    },
    apis: ['./src/routes/*.ts'], // Ruta a los archivos de rutas con anotaciones Swagger
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);

// Middlewares de seguridad
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://genosentinel.com']
        : ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true
}));

// Middlewares para parsing JSON
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));

// Logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta de documentación Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));

// Ruta de health check básica
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'Clinical Service',
        timestamp: new Date().toISOString(),
        environment: env_config_1.config.NODE_ENV,
        version: '1.0.0'
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'GenoSentinel Clinical Service API',
        version: '1.0.0',
        environment: env_config_1.config.NODE_ENV,
        documentation: '/api-docs'
    });
});

// Rutas de la API
app.use('/api', routes_1.default);
app.use('/api/clinical-records', clinical_records_routes_1.default); // 👈 NUEVA LÍNEA

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        documentation: '/api-docs'
    });
});

// Manejo global de errores
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : error.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
});

exports.default = app;