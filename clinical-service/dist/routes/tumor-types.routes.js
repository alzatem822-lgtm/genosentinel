"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// clinical-service/src/routes/tumor-types.routes.ts
const express_1 = require("express");
const tumor_types_controller_1 = require("../controllers/tumor-types.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const tumor_type_dto_1 = require("../dto/tumor-type.dto");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     TumorType:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - systemAffected
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del tipo de tumor
 *         name:
 *           type: string
 *           description: Nombre del tipo de tumor
 *           example: "Cáncer de Mama"
 *         systemAffected:
 *           type: string
 *           description: Sistema afectado por el tumor
 *           example: "Glándulas Mamarias"
 *
 *     CreateTumorTypeRequest:
 *       type: object
 *       required:
 *         - name
 *         - systemAffected
 *       properties:
 *         name:
 *           type: string
 *           example: "Cáncer de Pulmón"
 *         systemAffected:
 *           type: string
 *           example: "Sistema Respiratorio"
 */
/**
 * @swagger
 * /tumor-types:
 *   get:
 *     summary: Obtener catálogo de tipos de tumor
 *     tags: [Tipos de Tumor]
 *     responses:
 *       200:
 *         description: Catálogo obtenido exitosamente
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
 *                     $ref: '#/components/schemas/TumorType'
 *                 count:
 *                   type: integer
 */
router.get('/', tumor_types_controller_1.TumorTypesController.getAllTumorTypes);
/**
 * @swagger
 * /tumor-types/search:
 *   get:
 *     summary: Buscar tipos de tumor
 *     tags: [Tipos de Tumor]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre o sistema afectado)
 *     responses:
 *       200:
 *         description: Búsqueda completada exitosamente
 */
router.get('/search', tumor_types_controller_1.TumorTypesController.searchTumorTypes);
/**
 * @swagger
 * /tumor-types:
 *   post:
 *     summary: Crear nuevo tipo de tumor
 *     tags: [Tipos de Tumor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTumorTypeRequest'
 *     responses:
 *       201:
 *         description: Tipo de tumor creado exitosamente
 *       409:
 *         description: Ya existe un tipo de tumor con ese nombre
 */
router.post('/', (0, validation_middleware_1.validateRequest)(tumor_type_dto_1.CreateTumorTypeDto), tumor_types_controller_1.TumorTypesController.createTumorType);
/**
 * @swagger
 * /tumor-types/{id}:
 *   get:
 *     summary: Obtener tipo de tumor por ID
 *     tags: [Tipos de Tumor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de tumor
 *     responses:
 *       200:
 *         description: Tipo de tumor encontrado
 *       404:
 *         description: Tipo de tumor no encontrado
 */
router.get('/:id', tumor_types_controller_1.TumorTypesController.getTumorTypeById);
exports.default = router;
