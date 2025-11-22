const { pool } = require('../config/database');
const { v4: uuidv4 } = require('crypto');

class VariantModel {
  // Crear una nueva variante genética
  static async create(variantData) {
    const { geneId, chromosome, position, referenceBase, alternateBase, impact } = variantData;
    const uuid = require('crypto').randomUUID();
    
    const [result] = await pool.execute(
      'INSERT INTO GeneticVariant (uuid, geneId, chromosome, position, referenceBase, alternateBase, impact) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuid, geneId, chromosome, position, referenceBase, alternateBase, impact || null]
    );
    return { id: result.insertId, uuid };
  }

  // Obtener todas las variantes
  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT gv.*, g.symbol as geneSymbol, g.fullName as geneName
      FROM GeneticVariant gv
      LEFT JOIN Gene g ON gv.geneId = g.id
      ORDER BY gv.id DESC
    `);
    return rows;
  }

  // Obtener una variante por ID
  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT gv.*, g.symbol as geneSymbol, g.fullName as geneName
      FROM GeneticVariant gv
      LEFT JOIN Gene g ON gv.geneId = g.id
      WHERE gv.id = ?
    `, [id]);
    return rows[0];
  }

  // Obtener una variante por UUID
  static async findByUuid(uuid) {
    const [rows] = await pool.execute(`
      SELECT gv.*, g.symbol as geneSymbol, g.fullName as geneName
      FROM GeneticVariant gv
      LEFT JOIN Gene g ON gv.geneId = g.id
      WHERE gv.uuid = ?
    `, [uuid]);
    return rows[0];
  }

  // Obtener variantes por gen
  static async findByGeneId(geneId) {
    const [rows] = await pool.execute(`
      SELECT gv.*, g.symbol as geneSymbol, g.fullName as geneName
      FROM GeneticVariant gv
      LEFT JOIN Gene g ON gv.geneId = g.id
      WHERE gv.geneId = ?
      ORDER BY gv.id DESC
    `, [geneId]);
    return rows;
  }

  // Actualizar una variante
  static async update(id, variantData) {
    const fields = [];
    const values = [];

    if (variantData.geneId !== undefined) {
      fields.push('geneId = ?');
      values.push(variantData.geneId);
    }
    if (variantData.chromosome !== undefined) {
      fields.push('chromosome = ?');
      values.push(variantData.chromosome);
    }
    if (variantData.position !== undefined) {
      fields.push('position = ?');
      values.push(variantData.position);
    }
    if (variantData.referenceBase !== undefined) {
      fields.push('referenceBase = ?');
      values.push(variantData.referenceBase);
    }
    if (variantData.alternateBase !== undefined) {
      fields.push('alternateBase = ?');
      values.push(variantData.alternateBase);
    }
    if (variantData.impact !== undefined) {
      fields.push('impact = ?');
      values.push(variantData.impact);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE GeneticVariant SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  // Eliminar una variante
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM GeneticVariant WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = VariantModel;