const { pool } = require('../config/database');

class GeneModel {
// Crear un nuevo gen
static async create(geneData) {
    const { symbol, fullName, functionSummary } = geneData;
    const [result] = await pool.execute(
    'INSERT INTO Gene (symbol, fullName, functionSummary) VALUES (?, ?, ?)',
    [symbol, fullName, functionSummary || null]
    );
    return result.insertId;
}

// Obtener todos los genes
static async findAll() {
    const [rows] = await pool.execute(
    'SELECT * FROM Gene ORDER BY symbol ASC'
    );
    return rows;
}

// Obtener un gen por ID
static async findById(id) {
    const [rows] = await pool.execute(
    'SELECT * FROM Gene WHERE id = ?',
    [id]
    );
    return rows[0];
}

// Obtener un gen por símbolo
static async findBySymbol(symbol) {
    const [rows] = await pool.execute(
    'SELECT * FROM Gene WHERE symbol = ?',
    [symbol]
    );
    return rows[0];
}

// Actualizar un gen
static async update(id, geneData) {
    const fields = [];
    const values = [];

    if (geneData.symbol !== undefined) {
    fields.push('symbol = ?');
    values.push(geneData.symbol);
    }
    if (geneData.fullName !== undefined) {
    fields.push('fullName = ?');
    values.push(geneData.fullName);
    }
    if (geneData.functionSummary !== undefined) {
    fields.push('functionSummary = ?');
    values.push(geneData.functionSummary);
    }

    if (fields.length === 0) {
    return false;
    }

    values.push(id);
    const [result] = await pool.execute(
    `UPDATE Gene SET ${fields.join(', ')} WHERE id = ?`,
    values
    );
    return result.affectedRows > 0;
}

// Eliminar un gen
static async delete(id) {
    const [result] = await pool.execute(
    'DELETE FROM Gene WHERE id = ?',
    [id]
    );
    return result.affectedRows > 0;
}
}

module.exports = GeneModel;