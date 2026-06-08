// ============================================================
// Middleware de Autenticación JWT
// Valida el token en el header Authorization: Bearer <token>
// ============================================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware que verifica la autenticidad del token JWT.
 * Extrae el token del header Authorization y lo valida.
 */
const authJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Verificar que el header existe
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. No se proporcionó token de autenticación.'
        });
    }

    // Extraer el token del formato "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Formato de token inválido. Use: Bearer <token>'
        });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjuntar datos del usuario al request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Inicie sesión nuevamente.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};

module.exports = authJWT;
