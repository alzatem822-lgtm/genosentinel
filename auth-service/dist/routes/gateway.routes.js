"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const gateway_service_1 = require("../services/gateway.service");
const router = (0, express_1.Router)();
exports.gatewayRouter = router;

router.use(auth_middleware_1.authMiddleware);

// 👇 CORREGIDO: usar los nombres correctos de los métodos
router.all('/genomica/*', gateway_service_1.GatewayService.routeToGenomicsService);
router.all('/clinica/*', gateway_service_1.GatewayService.routeToClinicalService);

router.get('/protected', (req, res) => {
    res.status(200).json({
        message: 'Ruta protegida accesible a través del Gateway',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});