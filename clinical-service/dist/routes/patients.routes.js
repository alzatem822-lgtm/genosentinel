"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// clinical-service/src/routes/patients.routes.ts
const express_1 = require("express");
const patients_controller_1 = require("../controllers/patients.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const patient_dto_1 = require("../dto/patient.dto");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - birthDate
 *         - gender
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del paciente
 *         firstName:
 *           type: string
 *           description: Nombre del paciente
 *         lastName:
 *           type: string
 *           description: Apellido del paciente
 *         birthDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de nacimiento
 *         gender:
 *           type: string
 *           description: Género del paciente
 *         status:
 *           type: string
 *           enum: [Activo, Seguimiento, Inactivo]
 *           description: Estado del paciente
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreatePatientRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - birthDate
 *         - gender
 *       properties:
 *         firstName:
 *           type: string
 *           example: "María"
 *         lastName:
 *           type: string
 *           example: "González"
 *         birthDate:
 *           type: string
 *           format: date-time
 *           example: "1985-06-15T00:00:00.000Z"
 *         gender:
 *           type: string
 *           example: "Femenino"
 *         status:
 *           type: string
 *           enum: [Activo, Seguimiento, Inactivo]
 *           example: "Activo"
 */
/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Crear un nuevo paciente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientRequest'
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', (0, validation_middleware_1.validateRequest)(patient_dto_1.CreatePatientDto), patients_controller_1.PatientsController.createPatient);
/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Obtener todos los pacientes
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Patient'
 *                 count:
 *                   type: integer
 */
router.get('/', patients_controller_1.PatientsController.getAllPatients);
/**
 * @swagger
 * /patients/search:
 *   get:
 *     summary: Buscar pacientes por nombre
 *     tags: [Pacientes]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre o apellido)
 *     responses:
 *       200:
 *         description: Búsqueda completada exitosamente
 *       400:
 *         description: Parámetro de búsqueda requerido
 */
router.get('/search', patients_controller_1.PatientsController.searchPatients);
/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Obtener paciente por ID
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *       404:
 *         description: Paciente no encontrado
 */
router.get('/:id', patients_controller_1.PatientsController.getPatientById);
/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Actualizar paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientRequest'
 *     responses:
 *       200:
 *         description: Paciente actualizado exitosamente
 *       404:
 *         description: Paciente no encontrado
 */
router.put('/:id', (0, validation_middleware_1.validateRequest)(patient_dto_1.UpdatePatientDto), patients_controller_1.PatientsController.updatePatient);
/**
 * @swagger
 * /patients/{id}/deactivate:
 *   patch:
 *     summary: Desactivar paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Paciente desactivado exitosamente
 *       404:
 *         description: Paciente no encontrado
 */
router.patch('/:id/deactivate', patients_controller_1.PatientsController.deactivatePatient);
exports.default = router;
