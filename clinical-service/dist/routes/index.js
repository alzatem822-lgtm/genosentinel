"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// clinical-service/src/routes/index.ts
const express_1 = require("express");
const patients_routes_1 = __importDefault(require("./patients.routes"));
const tumor_types_routes_1 = __importDefault(require("./tumor-types.routes"));
const clinical_records_routes_1 = __importDefault(require("./clinical-records.routes"));
const router = (0, express_1.Router)();
// Configurar rutas
router.use('/patients', patients_routes_1.default);
router.use('/tumor-types', tumor_types_routes_1.default);
router.use('/clinical-records', clinical_records_routes_1.default);
exports.default = router;
