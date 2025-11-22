const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');
const setupSwagger = require('./config/swagger');

// Importar rutas
const geneRoutes = require('./routes/gene.routes');
const variantRoutes = require('./routes/variant.routes');
const patientVariantReportRoutes = require('./routes/patientVariantReport.routes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(helmet()); // Seguridad
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Ruta de salud (health check)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Microservicio Genómica funcionando correctamente',
    service: 'genomica',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Microservicio Genómica - GenoSentinel',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      documentation: '/api-docs',
      genes: '/api/genes',
      variants: '/api/variants',
      patientVariantReports: '/api/patient-variant-reports'
    }
  });
});

// Configurar Swagger
setupSwagger(app);

// Rutas de la API
app.use('/api/genes', geneRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/patient-variant-reports', patientVariantReportRoutes);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('⚠️  No se pudo conectar a la base de datos. Verifica la configuración.');
      console.log('El servidor continuará ejecutándose, pero las operaciones de BD fallarán.');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('🚀 Microservicio Genómica - GenoSentinel');
      console.log('='.repeat(60));
      console.log(`📡 Servidor escuchando en: http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();

module.exports = app;