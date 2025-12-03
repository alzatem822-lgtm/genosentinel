const express = require('express');
const router = express.Router();
const GeneController = require('../controllers/gene.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Gene:
 *       type: object
 *       required:
 *         - symbol
 *         - fullName
 *       properties:
 *         symbol:
 *           type: string
 *           description: Símbolo del gen (ej. BRCA1)
 *         fullName:
 *           type: string
 *           description: Nombre completo del gen
 *         functionSummary:
 *           type: string
 *           description: Resumen de la función del gen
 */

/**
 * @swagger
 * /api/genes:
 *   post:
 *     summary: Crear un nuevo gen
 *     tags: [Genes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gene'
 *     responses:
 *       201:
 *         description: Gen creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El gen ya existe
 */
router.post('/', GeneController.create);

/**
 * @swagger
 * /api/genes:
 *   get:
 *     summary: Obtener todos los genes
 *     tags: [Genes]
 *     responses:
 *       200:
 *         description: Lista de genes
 */
router.get('/', GeneController.getAll);

/**
 * @swagger
 * /api/genes/{id}:
 *   get:
 *     summary: Obtener un gen por ID
 *     tags: [Genes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gen encontrado
 *       404:
 *         description: Gen no encontrado
 */
router.get('/:id', GeneController.getById);

/**
 * @swagger
 * /api/genes/{id}:
 *   put:
 *     summary: Actualizar un gen
 *     tags: [Genes]
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
 *             $ref: '#/components/schemas/Gene'
 *     responses:
 *       200:
 *         description: Gen actualizado exitosamente
 *       404:
 *         description: Gen no encontrado
 */
router.put('/:id', GeneController.update);

/**
 * @swagger
 * /api/genes/{id}:
 *   delete:
 *     summary: Eliminar un gen
 *     tags: [Genes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gen eliminado exitosamente
 *       404:
 *         description: Gen no encontrado
 */
router.delete('/:id', GeneController.delete);

module.exports = router;


