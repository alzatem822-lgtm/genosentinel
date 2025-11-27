// clinical-service/src/dto/clinical-record.dto.ts
import { z } from 'zod';

export const CreateClinicalRecordDto = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  tumorTypeId: z.number().int('ID de tipo de tumor inválido').positive(),
  diagnosisDate: z.string().datetime('Fecha de diagnóstico inválida'),
  stage: z.string().min(1, 'La etapa es requerida').max(10),
  treatmentProtocol: z.string().optional()
});

export type CreateClinicalRecordDto = z.infer<typeof CreateClinicalRecordDto>;