// ============================================================
// Modelo de Producto - Interacción con tabla 'products'
// ============================================================

const pool = require('../config/database');

const ProductModel = {
    /**
     * Obtener todos los productos
     */
    async findAll() {
        const query = `SELECT * FROM products ORDER BY id ASC;`;
        const result = await pool.query(query);
        return result.rows;
    },

    /**
     * Obtener un producto por ID
     */
    async findById(id) {
        const query = `SELECT * FROM products WHERE id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Crear un nuevo producto
     */
    async create(name, price, description, stock, available) {
        const query = `
            INSERT INTO products (name, price, description, stock, available)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(query, [name, price, description || null, stock || 0, available !== undefined ? available : true]);
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
    }
};

module.exports = ProductModel;
