// ============================================================
// Chat Handler - Logica de Socket.IO separada
// Maneja autenticacion, eventos y persistencia de mensajes
// ============================================================

const jwt = require('jsonwebtoken');
const MessageModel = require('../models/messageModel');
require('dotenv').config();

/**
 * Configura la autenticacion y eventos del chat en Socket.IO
 * @param {Object} io - Instancia de Socket.IO
 */
function setupChatHandler(io) {

    // Middleware de autenticacion JWT en el handshake
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Autenticacion requerida. No se proporciono token.'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            return next(new Error('Token invalido o expirado.'));
        }
    });

    // Manejo de conexiones
    io.on('connection', async (socket) => {
        const user = socket.user;
        console.log(`[Chat] Usuario conectado: ${user.name} (ID: ${user.id}, Rol: ${user.role})`);

        // Enviar historial (ultimos 10 mensajes)
        try {
            const lastMessages = await MessageModel.getLastMessages(10);
            socket.emit('messages', lastMessages);
        } catch (error) {
            console.error('[Chat] Error al obtener historial:', error.message);
            socket.emit('messages', []);
        }

        // Notificar conexion
        io.emit('user-connected', {
            userId: user.id,
            username: user.name,
            message: `${user.name} se ha conectado al chat.`
        });

        // Escuchar nuevos mensajes
        socket.on('new-message', async (data) => {
            const text = data.text;

            if (!text || text.trim() === '') {
                return;
            }

            try {
                // Persistir en BD antes de broadcast
                const savedMessage = await MessageModel.create(user.id, user.name, text.trim());

                // Broadcast a todos
                io.emit('new-message', {
                    id: savedMessage.id,
                    user_id: savedMessage.user_id,
                    username: savedMessage.username,
                    text: savedMessage.text,
                    created_at: savedMessage.created_at
                });

                console.log(`[Chat] Mensaje de ${user.name}: ${text.trim().substring(0, 50)}`);
            } catch (error) {
                console.error('[Chat] Error al guardar mensaje:', error.message);
                socket.emit('error-message', { message: 'Error al enviar mensaje.' });
            }
        });

        // Desconexion
        socket.on('disconnect', () => {
            console.log(`[Chat] Usuario desconectado: ${user.name} (ID: ${user.id})`);
            io.emit('user-disconnected', {
                userId: user.id,
                username: user.name,
                message: `${user.name} se ha desconectado.`
            });
        });
    });
}

module.exports = setupChatHandler;
