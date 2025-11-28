"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
const health_controllers_1 = require("../controllers/health.controllers");
const router = (0, express_1.Router)();
exports.healthRouter = router;
router.get('/health', health_controllers_1.HealthController.healthCheck);
router.get('/status', health_controllers_1.HealthController.statusCheck);
