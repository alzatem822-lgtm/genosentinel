import { Router } from 'express';
import { GatewayService } from '../services/gateway.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

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

// ==================== RUTAS PROTEGIDAS CON GATEWAY ====================

// Todas las rutas de Clinical Service (requieren autenticación)
router.all('/api/clinical/*', authMiddleware, GatewayService.routeToClinicalService);

// Todas las rutas de Genomics Service (requieren autenticación)  
router.all('/api/genomics/*', authMiddleware, GatewayService.routeToGenomicsService);

// Ruta de ejemplo protegida
router.get('/api/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ruta protegida accesible a través del gateway',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

export default router;