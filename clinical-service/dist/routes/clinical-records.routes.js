"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// clinical-service/src/routes/clinical-records.routes.ts
const express_1 = require("express");
const clinical_records_controller_1 = require("../controllers/clinical-records.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const clinical_record_dto_1 = require("../dto/clinical-record.dto");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicalRecord:
 *       type: object
 *       required:
 *         - id
 *         - patientId
 *         - tumorTypeId
 *         - diagnosisDate
 *         - stage
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         patientId:
 *           type: string
 *           format: uuid
 *         tumorTypeId:
 *           type: integer
 *         diagnosisDate:
 *           type: string
 *           format: date-time
 *         stage:
 *           type: string
 *           example: "IIA"
 *         treatmentProtocol:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ClinicalRecordWithRelations:
 *       allOf:
 *         - $ref: '#/components/schemas/ClinicalRecord'
 *         - type: object
 *           properties:
 *             patient:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *             tumorType:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 systemAffected:
 *                   type: string
 *
 *     CreateClinicalRecordRequest:
 *       type: object
 *       required:
 *         - patientId
 *         - tumorTypeId
 *         - diagnosisDate
 *         - stage
 *       properties:
 *         patientId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         tumorTypeId:
 *           type: integer
 *           example: 1
 *         diagnosisDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T00:00:00.000Z"
 *         stage:
 *           type: string
 *           example: "IIIB"
 *         treatmentProtocol:
 *           type: string
 *           example: "Quimioterapia adjuvante"
 */
/**
 * @swagger
 * /clinical-records:
 *   post:
 *     summary: Crear nuevo registro clínico
 *     tags: [Registros Clínicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClinicalRecordRequest'
 *     responses:
 *       201:
 *         description: Registro clínico creado exitosamente
 *       404:
 *         description: Paciente o tipo de tumor no encontrado
 */
router.post('/', (0, validation_middleware_1.validateRequest)(clinical_record_dto_1.CreateClinicalRecordDto), clinical_records_controller_1.ClinicalRecordsController.createClinicalRecord);
/**
 * @swagger
 * /clinical-records:
 *   get:
 *     summary: Obtener todos los registros clínicos
 *     tags: [Registros Clínicos]
 *     responses:
 *       200:
 *         description: Lista de registros obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClinicalRecordWithRelations'
 *                 count:
 *                   type: integer
 */
router.get('/', clinical_records_controller_1.ClinicalRecordsController.getAllClinicalRecords);
/**
 * @swagger
 * /clinical-records/patient/{patientId}:
 *   get:
 *     summary: Obtener registros clínicos por paciente
 *     tags: [Registros Clínicos]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Registros del paciente obtenidos exitosamente
 */
router.get('/patient/:patientId', clinical_records_controller_1.ClinicalRecordsController.getClinicalRecordsByPatient);
/**
 * @swagger
 * /clinical-records/search/stage:
 *   get:
 *     summary: Buscar registros clínicos por etapa
 *     tags: [Registros Clínicos]
 *     parameters:
 *       - in: query
 *         name: stage
 *         required: true
 *         schema:
 *           type: string
 *         description: Etapa del cáncer (ej. I, IIA, IIIB, IV)
 *     responses:
 *       200:
 *         description: Búsqueda completada exitosamente
 *       400:
 *         description: Parámetro de etapa requerido
 */
router.get('/search/stage', clinical_records_controller_1.ClinicalRecordsController.searchClinicalRecordsByStage);
/**
 * @swagger
 * /clinical-records/{id}:
 *   get:
 *     summary: Obtener registro clínico por ID
 *     tags: [Registros Clínicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del registro clínico
 *     responses:
 *       200:
 *         description: Registro clínico encontrado
 *       404:
 *         description: Registro clínico no encontrado
 */
router.get('/:id', clinical_records_controller_1.ClinicalRecordsController.getClinicalRecordById);
exports.default = router;
