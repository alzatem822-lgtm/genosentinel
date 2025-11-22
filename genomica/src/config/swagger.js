const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Microservicio Genómica - GenoSentinel',
      version: '1.0.0',
      description: 'API RESTful para la gestión de información genómica y variantes genéticas de pacientes oncológicos',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'dev@genosentinel.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Genes',
        description: 'Gestión de genes de interés oncológico'
      },
      {
        name: 'Variantes Genéticas',
        description: 'Gestión de variantes genéticas (mutaciones)'
      },
      {
        name: 'Reportes de Variantes de Pacientes',
        description: 'Gestión de reportes de variantes asociadas a pacientes'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Genómica - GenoSentinel'
  }));
  
  // Endpoint para obtener el JSON de Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;