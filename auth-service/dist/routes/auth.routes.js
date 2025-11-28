"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const gateway_service_1 = require("../services/gateway.service");

const router = (0, express_1.Router)();
router.use(auth_middleware_1.requestLogger);
router.post('/register', auth_controller_1.AuthController.register);
router.post('/verify', auth_controller_1.AuthController.verifyCode);
router.post('/resend-verification', auth_controller_1.AuthController.resendVerification);
router.post('/login', auth_controller_1.AuthController.login);
router.post('/validate', auth_controller_1.AuthController.validateToken);
router.get('/health', auth_controller_1.AuthController.healthCheck);
router.get('/gateway/status', async (req, res) => {
    try {
        const servicesStatus = await gateway_service_1.GatewayService.checkServicesStatus();
        res.status(200).json({
            success: true,
            message: 'Gateway Status',
            timestamp: new Date().toISOString(),
            services: {
                auth: true,
                clinical: servicesStatus.clinical,
                genomics: servicesStatus.genomics
            },
            gateway: {
                version: '1.0.0',
                status: 'operational'
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking services status'
        });
    }
});
router.get('/profile', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Perfil de usuario',
        user: req.user
    });
});
router.get('/api/protected', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Ruta protegida accesible a través del gateway',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});
router.all('/api/clinical/*', auth_middleware_1.authMiddleware, gateway_service_1.GatewayService.routeToClinicalService);
router.all('/api/genomics/*', auth_middleware_1.authMiddleware, gateway_service_1.GatewayService.routeToGenomicsService);
router.get('/gateway-test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Gateway funcionando correctamente',
        service: 'auth-service',
        timestamp: new Date().toISOString(),
        features: [
            'Autenticación JWT',
            'Registro de usuarios',
            'Verificación por email',
            'Validación de tokens',
            'Health checks',
            'API Gateway con enrutamiento',
            'Protección de rutas con middleware'
        ]
    });
});
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});
exports.default = router;
/**
 * @swagger
 * /auth/health:
 *   get:
 *     summary: Health check del servicio
 *     description: Verifica que el servicio de autenticación esté funcionando
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servicio funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 service:
 *                   type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión de usuario
 *     description: Autentica un usuario y devuelve un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@genosentinel.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */