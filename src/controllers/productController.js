// ============================================================
// Controlador de Productos
// CRUD completo con validaciones
// ============================================================

const ProductModel = require('../models/productModel');

const ProductController = {
    /**
     * GET /products
     * Obtener todos los productos (público)
     */
    async getAll(req, res) {
        try {
            const products = await ProductModel.findAll();
            res.status(200).json({
                success: true,
                message: 'Productos obtenidos correctamente.',
                count: products.length,
                data: products
            });
        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    /**
     * GET /products/:id
     * Obtener un producto por ID (público)
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductModel.findById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Producto con id ${id} no encontrado.`
                });
            }

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Error al obtener producto:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    /**
     * POST /products
     * Crear un nuevo producto (solo admin)
     */
    async create(req, res) {
        try {
            const { name, price, description, stock, available } = req.body;

            // Validaciones
            if (!name || name.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El campo "name" es obligatorio.'
                });
            }

            if (price === undefined || price === null || isNaN(price) || Number(price) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo "price" debe ser un número mayor a 0.'
                });
            }

            const newProduct = await ProductModel.create(
                name.trim(),
                Number(price),
                description,
                stock,
                available
            );

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente.',
                data: newProduct
            });
        } catch (error) {
            console.error('Error al crear producto:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    /**
     * PUT /products/:id
     * Actualizar un producto existente (solo admin)
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price, description, stock, available } = req.body;

            // Verificar que el producto existe
            const existing = await ProductModel.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: `Producto con id ${id} no encontrado.`
                });
            }

            // Validar precio si se proporciona
            if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo "price" debe ser un número mayor a 0.'
                });
            }

            // Validar name si se proporciona
            if (name !== undefined && name.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El campo "name" no puede estar vacío.'
                });
            }

            const updatedProduct = await ProductModel.update(id, {
                name: name ? name.trim() : undefined,
                price: price ? Number(price) : undefined,
                description,
                stock,
                available
            });

            res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente.',
                data: updatedProduct
            });
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    /**
     * DELETE /products/:id
     * Eliminar un producto (solo admin)
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            const deleted = await ProductModel.delete(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: `Producto con id ${id} no encontrado.`
                });
            }

            res.status(200).json({
                success: true,
                message: 'Producto eliminado exitosamente.',
                data: deleted
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
};

module.exports = ProductController;
