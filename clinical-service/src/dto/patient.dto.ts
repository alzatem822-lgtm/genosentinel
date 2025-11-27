// clinical-service/src/dto/patient.dto.ts
import { z } from 'zod';

export const CreatePatientDto = z.object({
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName: z.string().min(1, 'El apellido es requerido').max(100),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD')
    .refine((date) => {
      // Validar que sea una fecha válida
      const d = new Date(date);
      return !isNaN(d.getTime());
    }, 'Fecha de nacimiento inválida'),
  gender: z.enum(['M', 'F', 'Other'], { 
    errorMap: () => ({ message: 'Género debe ser M, F u Other' })
  }),
  status: z.enum(['Activo', 'Seguimiento', 'Inactivo']).optional().default('Activo')
});

export const UpdatePatientDto = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD')
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }, 'Fecha de nacimiento inválida')
    .optional(),
  gender: z.enum(['M', 'F', 'Other']).optional(),
  status: z.enum(['Activo', 'Seguimiento', 'Inactivo']).optional()
});

export type CreatePatientDto = z.infer<typeof CreatePatientDto>;
export type UpdatePatientDto = z.infer<typeof UpdatePatientDto>;