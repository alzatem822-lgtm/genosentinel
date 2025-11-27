"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTumorTypeDto = void 0;
// clinical-service/src/dto/tumor-type.dto.ts
const zod_1 = require("zod");
exports.CreateTumorTypeDto = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre del tumor es requerido').max(200),
    systemAffected: zod_1.z.string().min(1, 'El sistema afectado es requerido').max(200)
});
