// clinical-service/src/app.ts (VERSIÓN ACTUALIZADA)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.config';
import routes from './routes';

const app = express();

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
        url: `http://localhost:${config.PORT}`,
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

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://genosentinel.com'] 
    : ['http://localhost:3000', 'http://localhost:4200'],
  credentials: true
}));

// Middlewares para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de health check básica
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Clinical Service',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: '1.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'GenoSentinel Clinical Service API',
    version: '1.0.0',
    environment: config.NODE_ENV,
    documentation: '/api-docs'
  });
});

// Rutas de la API
app.use('/api', routes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    documentation: '/api-docs'
  });
});

// Manejo global de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no manejado:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

export default app;