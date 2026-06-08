// ============================================================
// Rutas de Productos
// GET es público, POST/PUT/DELETE requiere admin
// ============================================================

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const authJWT = require('../middlewares/authJWT');
const authorizeRole = require('../middlewares/authorizeRole');

// Rutas públicas (cualquier usuario puede consultar)
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Rutas protegidas (solo admin autenticado)
router.post('/', authJWT, authorizeRole('admin'), ProductController.create);
router.put('/:id', authJWT, authorizeRole('admin'), ProductController.update);
router.patch('/:id', authJWT, authorizeRole('admin'), ProductController.update);
router.delete('/:id', authJWT, authorizeRole('admin'), ProductController.delete);

module.exports = router;
