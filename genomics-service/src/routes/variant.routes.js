const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/variant.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     GeneticVariant:
 *       type: object
 *       required:
 *         - geneId
 *         - chromosome
 *         - position
 *         - referenceBase
 *         - alternateBase
 *       properties:
 *         uuid:
 *           type: string
 *           description: UUID de la variante
 *         geneId:
 *           type: integer
 *           description: ID del gen asociado
 *         chromosome:
 *           type: string
 *           description: Cromosoma (ej. chr17)
 *         position:
 *           type: string
 *           description: Posición en el cromosoma
 *         referenceBase:
 *           type: string
 *           description: Base de referencia (ej. A)
 *         alternateBase:
 *           type: string
 *           description: Base alternativa (ej. G)
 *         impact:
 *           type: string
 *           description: Impacto de la variante (ej. Missense, Frameshift)
 */

/**
 * @swagger
 * /api/variants:
 *   post:
 *     summary: Crear una nueva variante genética
 *     tags: [Variantes Genéticas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneticVariant'
 *     responses:
 *       201:
 *         description: Variante creada exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Gen no encontrado
 */
router.post('/', VariantController.create);

/**
 * @swagger
 * /api/variants:
 *   get:
 *     summary: Obtener todas las variantes genéticas
 *     tags: [Variantes Genéticas]
 *     responses:
 *       200:
 *         description: Lista de variantes
 */
router.get('/', VariantController.getAll);

/**
 * @swagger
 * /api/variants/{id}:
 *   get:
 *     summary: Obtener una variante por ID
 *     tags: [Variantes Genéticas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Variante encontrada
 *       404:
 *         description: Variante no encontrada
 */
router.get('/:id', VariantController.getById);

/**
 * @swagger
 * /api/variants/uuid/{uuid}:
 *   get:
 *     summary: Obtener una variante por UUID
 *     tags: [Variantes Genéticas]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variante encontrada
 *       404:
 *         description: Variante no encontrada
 */
router.get('/uuid/:uuid', VariantController.getByUuid);

/**
 * @swagger
 * /api/variants/gene/{geneId}:
 *   get:
 *     summary: Obtener variantes por gen
 *     tags: [Variantes Genéticas]
 *     parameters:
 *       - in: path
 *         name: geneId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de variantes del gen
 *       404:
 *         description: Gen no encontrado
 */
router.get('/gene/:geneId', VariantController.getByGeneId);

/**
 * @swagger
 * /api/variants/{id}:
 *   put:
 *     summary: Actualizar una variante
 *     tags: [Variantes Genéticas]
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
 *             $ref: '#/components/schemas/GeneticVariant'
 *     responses:
 *       200:
 *         description: Variante actualizada exitosamente
 *       404:
 *         description: Variante no encontrada
 */
router.put('/:id', VariantController.update);

/**
 * @swagger
 * /api/variants/{id}:
 *   delete:
 *     summary: Eliminar una variante
 *     tags: [Variantes Genéticas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Variante eliminada exitosamente
 *       404:
 *         description: Variante no encontrada
 */
router.delete('/:id', VariantController.delete);

module.exports = router;