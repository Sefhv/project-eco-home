// ============================================================
// Modelo de Producto - Interacción con tabla 'products'
// Incluye trazabilidad (created_by) y métricas por usuario
// ============================================================

const pool = require('../config/database');

const ProductModel = {
    /**
     * Obtener todos los productos con datos del creador
     */
    async findAll() {
        const query = `
            SELECT p.*, u.name AS creator_name, u.email AS creator_email
            FROM products p
            LEFT JOIN users u ON p.created_by = u.id
            ORDER BY p.id ASC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    /**
     * Obtener un producto por ID con datos del creador
     */
    async findById(id) {
        const query = `
            SELECT p.*, u.name AS creator_name, u.email AS creator_email
            FROM products p
            LEFT JOIN users u ON p.created_by = u.id
            WHERE p.id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Crear un nuevo producto con trazabilidad (created_by)
     */
    async create(name, price, description, stock, available, createdBy) {
        const query = `
            INSERT INTO products (name, price, description, stock, available, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const result = await pool.query(query, [
            name,
            price,
            description || null,
            stock || 0,
            available !== undefined ? available : true,
            createdBy || null
        ]);
        return result.rows[0];
    },

    /**
     * Actualizar un producto existente
     */
    async update(id, fields) {
        const { name, price, description, stock, available } = fields;
        const query = `
            UPDATE products
            SET name = COALESCE($1, name),
                price = COALESCE($2, price),
                description = COALESCE($3, description),
                stock = COALESCE($4, stock),
                available = COALESCE($5, available),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *;
        `;
        const result = await pool.query(query, [name, price, description, stock, available, id]);
        return result.rows[0] || null;
    },

    /**
     * Eliminar un producto por ID
     */
    async delete(id) {
        const query = `DELETE FROM products WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Obtener el conteo de productos creados por un usuario
     */
    async countByUser(userId) {
        const query = `SELECT COUNT(*) AS count FROM products WHERE created_by = $1;`;
        const result = await pool.query(query, [userId]);
        return parseInt(result.rows[0].count);
    }
};

module.exports = ProductModel;
