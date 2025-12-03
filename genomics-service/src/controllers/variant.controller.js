const VariantModel = require('../models/variant.model');
const GeneModel = require('../models/gene.model');
const { createVariantSchema, updateVariantSchema } = require('../dtos/variant.dto');

class VariantController {
// Crear una nueva variante genética
static async create(req, res) {
    try {
    // Validar datos
    const { error, value } = createVariantSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.details.map(d => d.message)
        });
    }

    // Verificar que el gen existe
    const gene = await GeneModel.findById(value.geneId);
    if (!gene) {
        return res.status(404).json({
        success: false,
        message: 'El gen especificado no existe'
        });
    }

    // Crear la variante
    const { id, uuid } = await VariantModel.create(value);
    const variant = await VariantModel.findById(id);

    res.status(201).json({
        success: true,
        message: 'Variante genética creada exitosamente',
        data: variant
    });
    } catch (error) {
    console.error('Error al crear variante:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Obtener todas las variantes
static async getAll(req, res) {
    try {
    const variants = await VariantModel.findAll();
    res.status(200).json({
        success: true,
        data: variants,
        count: variants.length
    });
    } catch (error) {
    console.error('Error al obtener variantes:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Obtener una variante por ID
static async getById(req, res) {
    try {
    const { id } = req.params;
    const variant = await VariantModel.findById(id);

    if (!variant) {
        return res.status(404).json({
        success: false,
        message: 'Variante no encontrada'
        });
    }

    res.status(200).json({
        success: true,
        data: variant
    });
    } catch (error) {
    console.error('Error al obtener variante:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Obtener una variante por UUID
static async getByUuid(req, res) {
    try {
    const { uuid } = req.params;
    const variant = await VariantModel.findByUuid(uuid);

    if (!variant) {
        return res.status(404).json({
        success: false,
        message: 'Variante no encontrada'
        });
    }

    res.status(200).json({
        success: true,
        data: variant
    });
    } catch (error) {
    console.error('Error al obtener variante:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Obtener variantes por gen
static async getByGeneId(req, res) {
    try {
    const { geneId } = req.params;
    
    // Verificar que el gen existe
    const gene = await GeneModel.findById(geneId);
    if (!gene) {
        return res.status(404).json({
        success: false,
        message: 'El gen especificado no existe'
        });
    }

    const variants = await VariantModel.findByGeneId(geneId);
    res.status(200).json({
        success: true,
        data: variants,
        count: variants.length
    });
    } catch (error) {
    console.error('Error al obtener variantes por gen:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Actualizar una variante
static async update(req, res) {
    try {
    const { id } = req.params;

    // Validar datos
    const { error, value } = updateVariantSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.details.map(d => d.message)
        });
    }

    // Verificar que la variante existe
    const variant = await VariantModel.findById(id);
    if (!variant) {
        return res.status(404).json({
        success: false,
        message: 'Variante no encontrada'
        });
    }

    // Si se actualiza el geneId, verificar que el gen existe
    if (value.geneId) {
        const gene = await GeneModel.findById(value.geneId);
        if (!gene) {
        return res.status(404).json({
            success: false,
            message: 'El gen especificado no existe'
        });
        }
    }

    // Actualizar la variante
    await VariantModel.update(id, value);
    const updatedVariant = await VariantModel.findById(id);

    res.status(200).json({
        success: true,
        message: 'Variante actualizada exitosamente',
        data: updatedVariant
    });
    } catch (error) {
    console.error('Error al actualizar variante:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}

// Eliminar una variante
static async delete(req, res) {
    try {
    const { id } = req.params;

    // Verificar que la variante existe
    const variant = await VariantModel.findById(id);
    if (!variant) {
        return res.status(404).json({
        success: false,
        message: 'Variante no encontrada'
        });
    }

    // Eliminar la variante
    await VariantModel.delete(id);

    res.status(200).json({
        success: true,
        message: 'Variante eliminada exitosamente'
    });
    } catch (error) {
    console.error('Error al eliminar variante:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
    });
    }
}
}

module.exports = VariantController;