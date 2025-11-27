"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePatientDto = exports.CreatePatientDto = void 0;
// clinical-service/src/dto/patient.dto.ts
const zod_1 = require("zod");
exports.CreatePatientDto = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'El nombre es requerido').max(100),
    lastName: zod_1.z.string().min(1, 'El apellido es requerido').max(100),
    birthDate: zod_1.z.string().datetime('Fecha de nacimiento inválida'),
    gender: zod_1.z.string().min(1, 'El género es requerido'),
    status: zod_1.z.enum(['Activo', 'Seguimiento', 'Inactivo']).optional().default('Activo')
});
exports.UpdatePatientDto = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100).optional(),
    lastName: zod_1.z.string().min(1).max(100).optional(),
    birthDate: zod_1.z.string().datetime().optional(),
    gender: zod_1.z.string().min(1).optional(),
    status: zod_1.z.enum(['Activo', 'Seguimiento', 'Inactivo']).optional()
});
