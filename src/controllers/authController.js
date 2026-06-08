// ============================================================
// Controlador de Autenticación
// Maneja signup y login con JWT
// ============================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
require('dotenv').config();

const AuthController = {
    /**
     * POST /auth/signup
     * Registra un nuevo usuario en la base de datos
     */
    async signup(req, res) {
        try {
            const { name, email, password, role } = req.body;

            // Validaciones
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos name, email y password son obligatorios.'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres.'
                });
            }

            // Verificar si el email ya está registrado
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado.'
                });
            }

            // Hashear la contraseña (nunca guardar en texto plano)
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Crear usuario (solo admin puede asignar rol admin)
            const userRole = role === 'admin' ? 'admin' : 'cliente';
            const newUser = await UserModel.create(name, email, passwordHash, userRole);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente.',
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            });

        } catch (error) {
            console.error('Error en signup:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    /**
     * POST /auth/login
     * Autentica un usuario y devuelve un JWT
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validaciones
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y password son obligatorios.'
                });
            }

            // Buscar usuario por email
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Generar JWT (stateless, ideal para app móvil)
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            });

            res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                data: {
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            });

        } catch (error) {
            console.error('Error en login:', error.message);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
};

module.exports = AuthController;
