const GeneModel = require('../models/gene.model');
const { createGeneSchema, updateGeneSchema } = require('../dtos/gene.dto');

class GeneController {
// Crear un nuevo gen
static async create(req, res) {
    try {
    // Validar datos
    const { error, value } = createGeneSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.details.map(d => d.message)
        });
    }

    // Verificar si el símbolo ya existe
    const existingGene = await GeneModel.findBySymbol(value.symbol);
    if (existingGene) {
        return res.status(409).json({
        success: false,
        message: 'Ya existe un gen con ese símbolo'
        });
    }

    // Crear el gen
    const geneId = await GeneModel.create(value);
    const gene = await GeneModel.findById(geneId);

    res.status(201).json({
        success: true,
        message: 'Gen creado exitosamente',
        data: gene
    });
    } catch (error) {
    console.error('Error al crear gen:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Obtener todos los genes
static async getAll(req, res) {
    try {
    const genes = await GeneModel.findAll();
    res.status(200).json({
        success: true,
        data: genes,
        count: genes.length
    });
    } catch (error) {
    console.error('Error al obtener genes:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Obtener un gen por ID
static async getById(req, res) {
    try {
    const { id } = req.params;
    const gene = await GeneModel.findById(id);

    if (!gene) {
        return res.status(404).json({
        success: false,
        message: 'Gen no encontrado'
        });
    }

    res.status(200).json({
        success: true,
        data: gene
    });
    } catch (error) {
    console.error('Error al obtener gen:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Actualizar un gen
static async update(req, res) {
    try {
    const { id } = req.params;

    // Validar datos
    const { error, value } = updateGeneSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.details.map(d => d.message)
        });
    }

    // Verificar que el gen existe
    const gene = await GeneModel.findById(id);
    if (!gene) {
        return res.status(404).json({
        success: false,
        message: 'Gen no encontrado'
        });
    }

    // Si se actualiza el símbolo, verificar que no exista otro gen con ese símbolo
    if (value.symbol && value.symbol !== gene.symbol) {
        const existingGene = await GeneModel.findBySymbol(value.symbol);
        if (existingGene) {
        return res.status(409).json({
            success: false,
            message: 'Ya existe un gen con ese símbolo'
        });
        }
    }

    // Actualizar el gen
    await GeneModel.update(id, value);
    const updatedGene = await GeneModel.findById(id);

    res.status(200).json({
        success: true,
        message: 'Gen actualizado exitosamente',
        data: updatedGene
    });
    } catch (error) {
    console.error('Error al actualizar gen:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Eliminar un gen
static async delete(req, res) {
    try {
    const { id } = req.params;

    // Verificar que el gen existe
    const gene = await GeneModel.findById(id);
    if (!gene) {
        return res.status(404).json({
        success: false,
        message: 'Gen no encontrado'
        });
    }

    // Eliminar el gen
    await GeneModel.delete(id);

    res.status(200).json({
        success: true,
        message: 'Gen eliminado exitosamente'
    });
    } catch (error) {
    console.error('Error al eliminar gen:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}
}

module.exports = GeneController;