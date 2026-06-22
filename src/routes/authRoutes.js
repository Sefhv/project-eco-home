// ============================================================
// Rutas de Autenticación
// Signup, Login y Stats del usuario
// ============================================================

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authJWT = require('../middlewares/authJWT');

// POST /auth/signup - Registro de usuario
router.post('/signup', AuthController.signup);

// POST /auth/login - Inicio de sesión
router.post('/login', AuthController.login);

// GET /auth/me/stats - Perfil y estadísticas (requiere autenticación)
router.get('/me/stats', authJWT, AuthController.getMyStats);

module.exports = router;
