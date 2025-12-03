"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClinicalRecordDto = void 0;
// clinical-service/src/dto/clinical-record.dto.ts
const zod_1 = require("zod");

exports.CreateClinicalRecordDto = zod_1.z.object({
    patientId: zod_1.z.string().uuid('ID de paciente inválido'),
    tumorTypeId: zod_1.z.number().int('ID de tipo de tumor inválido').positive(),
    diagnosisDate: zod_1.z.string()
        .min(1, 'La fecha de diagnóstico es requerida')
        .refine((date) => {
            // Convertir a objeto Date y verificar si es válida
            const dateObj = new Date(date);
            return !isNaN(dateObj.getTime());
        }, 'Formato de fecha inválido. Use: YYYY-MM-DD o YYYY-MM-DDTHH:MM:SSZ'),
    stage: zod_1.z.string().min(1, 'La etapa es requerida').max(10),
    treatmentProtocol: zod_1.z.string().optional()
});