// clinical-service/src/dto/tumor-type.dto.ts
import { z } from 'zod';

export const CreateTumorTypeDto = z.object({
  name: z.string().min(1, 'El nombre del tumor es requerido').max(200),
  systemAffected: z.string().min(1, 'El sistema afectado es requerido').max(200)
});

export type CreateTumorTypeDto = z.infer<typeof CreateTumorTypeDto>;