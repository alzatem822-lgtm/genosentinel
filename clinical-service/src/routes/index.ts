// clinical-service/src/routes/index.ts
import { Router } from 'express';
import patientsRoutes from './patients.routes';
import tumorTypesRoutes from './tumor-types.routes';
import clinicalRecordsRoutes from './clinical-records.routes';

const router = Router();

// Configurar rutas
router.use('/patients', patientsRoutes);
router.use('/tumor-types', tumorTypesRoutes);
router.use('/clinical-records', clinicalRecordsRoutes);

export default router;