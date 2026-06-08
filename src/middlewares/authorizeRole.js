// ============================================================
// Middleware de Autorización por Rol
// Verifica que el usuario tenga el rol requerido
// ============================================================

/**
 * Middleware factory que verifica el rol del usuario.
 * @param  {...string} roles - Roles permitidos (ej: 'admin', 'cliente')
 * @returns {Function} Middleware de Express
 */
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        // req.user se establece en authJWT
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}. Tu rol: ${req.user.role}`
            });
        }

        next();
    };
};

module.exports = authorizeRole;
