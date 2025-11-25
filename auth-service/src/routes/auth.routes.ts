import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, requestLogger } from '../middleware/auth.middleware';
import { GatewayService } from '../services/gateway.service';

const router = Router();

// Aplicar logging a todas las rutas
router.use(requestLogger);

// ==================== RUTAS PÚBLICAS ====================
router.post('/register', AuthController.register);
router.post('/verify', AuthController.verifyCode); // 👈 NUEVA
router.post('/resend-verification', AuthController.resendVerification); // 👈 NUEVA
router.post('/login', AuthController.login);
router.post('/validate', AuthController.validateToken);
router.get('/health', AuthController.healthCheck);

// Health check extendido con estado de servicios
router.get('/gateway/status', async (req, res) => {
  try {
    const servicesStatus = await GatewayService.checkServicesStatus();
    
    res.status(200).json({
      success: true,
      message: 'Gateway Status',
      timestamp: new Date().toISOString(),
      services: {
        auth: true, // Este servicio siempre está activo
        clinical: servicesStatus.clinical,
        genomics: servicesStatus.genomics
      },
      gateway: {
        version: '1.0.0',
        status: 'operational'
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error checking services status'
    });
  }
});

// ==================== RUTAS PROTEGIDAS ====================

// Ruta protegida de ejemplo (requiere autenticación)
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Perfil de usuario',
    user: req.user
  });
});

// Ruta protegida de ejemplo del gateway
router.get('/api/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ruta protegida accesible a través del gateway',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// ==================== RUTAS DEL GATEWAY ====================

// Todas las rutas de Clinical Service (requieren autenticación)
router.all('/api/clinical/*', authMiddleware, GatewayService.routeToClinicalService);

// Todas las rutas de Genomics Service (requieren autenticación)  
router.all('/api/genomics/*', authMiddleware, GatewayService.routeToGenomicsService);

// ==================== RUTAS DE PRUEBA ====================

// Ruta para verificar que el gateway funciona
router.get('/gateway-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Gateway funcionando correctamente',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    features: [
      'Autenticación JWT',
      'Registro de usuarios',
      'Verificación por email', // 👈 ACTUALIZADA
      'Validación de tokens',
      'Health checks',
      'API Gateway con enrutamiento',
      'Protección de rutas con middleware'
    ]
  });
});

// Manejo de rutas no encontradas
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

export default router;