// ============================================================
// Rutas de Autenticación
// Signup y Login (públicas)
// ============================================================

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// POST /auth/signup - Registro de usuario
router.post('/signup', AuthController.signup);

// POST /auth/login - Inicio de sesión
router.post('/login', AuthController.login);

module.exports = router;
