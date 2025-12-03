const express = require('express');
const router = express.Router();
const PatientVariantReportController = require('../controllers/patientVariantReport.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientVariantReport:
 *       type: object
 *       required:
 *         - patientId
 *         - variantId
 *         - detectionDate
 *       properties:
 *         uuid:
 *           type: string
 *           description: UUID del reporte
 *         patientId:
 *           type: integer
 *           description: ID del paciente (del microservicio clínica)
 *         variantId:
 *           type: integer
 *           description: ID de la variante genética
 *         detectionDate:
 *           type: string
 *           format: date
 *           description: Fecha de detección de la variante
 *         alleleFrequency:
 *           type: number
 *           format: float
 *           description: Frecuencia alélica (VAF) en formato decimal
 */

/**
 * @swagger
 * /api/patient-variant-reports:
 *   post:
 *     summary: Crear un nuevo reporte de variante de paciente
 *     tags: [Reportes de Variantes de Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientVariantReport'
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Variante no encontrada
 */
router.post('/', PatientVariantReportController.create);

/**
 * @swagger
 * /api/patient-variant-reports:
 *   get:
 *     summary: Obtener todos los reportes
 *     tags: [Reportes de Variantes de Pacientes]
 *     responses:
 *       200:
 *         description: Lista de reportes
 */
router.get('/', PatientVariantReportController.getAll);

/**
 * @swagger
 * /api/patient-variant-reports/{id}:
 *   get:
 *     summary: Obtener un reporte por ID
 *     tags: [Reportes de Variantes de Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *       404:
 *         description: Reporte no encontrado
 */
router.get('/:id', PatientVariantReportController.getById);

/**
 * @swagger
 * /api/patient-variant-reports/uuid/{uuid}:
 *   get:
 *     summary: Obtener un reporte por UUID
 *     tags: [Reportes de Variantes de Pacientes]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *       404:
 *         description: Reporte no encontrado
 */
router.get('/uuid/:uuid', PatientVariantReportController.getByUuid);

/**
 * @swagger
 * /api/patient-variant-reports/patient/{patientId}:
 *   get:
 *     summary: Obtener reportes por paciente
 *     tags: [Reportes de Variantes de Pacientes]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de reportes del paciente
 */
router.get('/patient/:patientId', PatientVariantReportController.getByPatientId);

/**
 * @swagger
 * /api/patient-variant-reports/variant/{variantId}:
 *   get:
 *     summary: Obtener reportes por variante
 *     tags: [Reportes de Variantes de Pacientes]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de reportes de la variante
 *       404:
 *         description: Variante no encontrada
 */
router.get('/variant/:variantId', PatientVariantReportController.getByVariantId);

/**
 * @swagger
 * /api/patient-variant-reports/{id}:
 *   put:
 *     summary: Actualizar un reporte
 *     tags: [Reportes de Variantes de Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientVariantReport'
 *     responses:
 *       200:
 *         description: Reporte actualizado exitosamente
 *       404:
 *         description: Reporte no encontrado
 */
router.put('/:id', PatientVariantReportController.update);

/**
 * @swagger
 * /api/patient-variant-reports/{id}:
 *   delete:
 *     summary: Eliminar un reporte
 *     tags: [Reportes de Variantes de Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte eliminado exitosamente
 *       404:
 *         description: Reporte no encontrado
 */
router.delete('/:id', PatientVariantReportController.delete);

module.exports = router;


