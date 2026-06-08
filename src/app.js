// ============================================================
// EcoHome Store - Aplicación Principal
// Backend API REST con Express.js + PostgreSQL + JWT
// ============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Inicializar Express
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raiz - Health Check
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'EcoHome Store API - Backend activo',
        version: '2.0.0',
        endpoints: {
            auth: '/api/v1/auth/signup, /api/v1/auth/login',
            products: '/api/v1/products (CRUD)'
        }
    });
});

// Registrar rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.method} ${req.originalUrl} no encontrada.`
    });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor.'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`EcoHome Store API corriendo en http://localhost:${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
