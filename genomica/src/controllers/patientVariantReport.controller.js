    const PatientVariantReportModel = require('../models/patientVariantReport.model');
    const VariantModel = require('../models/variant.model');
    const { createPatientVariantReportSchema, updatePatientVariantReportSchema } = require('../dtos/patientVariantReport.dto');

    class PatientVariantReportController {
    // Crear un nuevo reporte de variante de paciente
    static async create(req, res) {
        try {
        // Validar datos
        const { error, value } = createPatientVariantReportSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: error.details.map(d => d.message)
            });
        }

        // Verificar que la variante existe
        const variant = await VariantModel.findById(value.variantId);
        if (!variant) {
            return res.status(404).json({
            success: false,
            message: 'La variante especificada no existe'
            });
        }

        // Crear el reporte
        const { id, uuid } = await PatientVariantReportModel.create(value);
        const report = await PatientVariantReportModel.findById(id);

        res.status(201).json({
            success: true,
            message: 'Reporte de variante creado exitosamente',
            data: report
        });
        } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }

    // Obtener todos los reportes
    static async getAll(req, res) {
        try {
        const reports = await PatientVariantReportModel.findAll();
        res.status(200).json({
            success: true,
            data: reports,
            count: reports.length
        });
        } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }

    // Obtener un reporte por ID
    static async getById(req, res) {
        try {
        const { id } = req.params;
        const report = await PatientVariantReportModel.findById(id);

        if (!report) {
            return res.status(404).json({
            success: false,
            message: 'Reporte no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
        } catch (error) {
        console.error('Error al obtener reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }

    // Obtener un reporte por UUID
    static async getByUuid(req, res) {
        try {
        const { uuid } = req.params;
        const report = await PatientVariantReportModel.findByUuid(uuid);

        if (!report) {
            return res.status(404).json({
            success: false,
            message: 'Reporte no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
        } catch (error) {
        console.error('Error al obtener reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }

    // Obtener reportes por paciente
    static async getByPatientId(req, res) {
        try {
        const { patientId } = req.params;
        const reports = await PatientVariantReportModel.findByPatientId(patientId);

        res.status(200).json({
            success: true,
            data: reports,
            count: reports.length
        });
        } catch (error) {
        console.error('Error al obtener reportes por paciente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }

    // Obtener reportes por variante
    static async getByVariantId(req, res) {
        try {
        const { variantId } = req.params;
        
        // Verificar que la variante existe
        const variant = await VariantModel.findById(variantId);
        if (!variant) {
            return res.status(404).json({
            success: false,
            message: 'La variante especificada no existe'
            });
        }

        const reports = await PatientVariantReportModel.findByVariantId(variantId);
        res.status(200).json({
            success: true,
            data: reports,
            count: reports.length
        });
        } catch (error) {
        console.error('Error al obtener reportes por variante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }

    // Actualizar un reporte
    static async update(req, res) {
        try {
        const { id } = req.params;

        // Validar datos
        const { error, value } = updatePatientVariantReportSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: error.details.map(d => d.message)
            });
        }

        // Verificar que el reporte existe
        const report = await PatientVariantReportModel.findById(id);
        if (!report) {
            return res.status(404).json({
            success: false,
            message: 'Reporte no encontrado'
            });
        }

        // Si se actualiza el variantId, verificar que la variante existe
        if (value.variantId) {
            const variant = await VariantModel.findById(value.variantId);
            if (!variant) {
            return res.status(404).json({
                success: false,
                message: 'La variante especificada no existe'
            });
            }
        }

        // Actualizar el reporte
        await PatientVariantReportModel.update(id, value);
        const updatedReport = await PatientVariantReportModel.findById(id);

        res.status(200).json({
            success: true,
            message: 'Reporte actualizado exitosamente',
            data: updatedReport
        });
        } catch (error) {
        console.error('Error al actualizar reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }

    // Eliminar un reporte
    static async delete(req, res) {
        try {
        const { id } = req.params;

        // Verificar que el reporte existe
        const report = await PatientVariantReportModel.findById(id);
        if (!report) {
            return res.status(404).json({
            success: false,
            message: 'Reporte no encontrado'
            });
        }

        // Eliminar el reporte
        await PatientVariantReportModel.delete(id);

        res.status(200).json({
            success: true,
            message: 'Reporte eliminado exitosamente'
        });
        } catch (error) {
        console.error('Error al eliminar reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
        }
    }
    }

    module.exports = PatientVariantReportController;