"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerOptions = void 0;
const swaggerJsdoc = require("swagger-jsdoc");

exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GenoSentinel - Auth Service API',
            version: '1.0.0',
            description: 'Microservicio de autenticación y gateway para GenoSentinel',
            contact: {
                name: 'Equipo GenoSentinel',
                email: 'soporte@genosentinel.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3011',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./dist/routes/*.js']
};

exports.swaggerSpec = swaggerJsdoc(exports.swaggerOptions);