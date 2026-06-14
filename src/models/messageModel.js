// ============================================================
// Modelo de Mensaje - Interaccion con tabla 'messages'
// ============================================================

const pool = require('../config/database');

const MessageModel = {
    /**
     * Guardar un mensaje en la base de datos
     */
    async create(userId, username, text) {
        const query = `
            INSERT INTO messages (user_id, username, text)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(query, [userId, username, text]);
        return result.rows[0];
    },

    /**
     * Obtener los ultimos N mensajes (por defecto 10)
     */
    async getLastMessages(limit = 10) {
        const query = `
            SELECT id, user_id, username, text, created_at
            FROM messages
            ORDER BY created_at DESC
            LIMIT $1;
        `;
        const result = await pool.query(query, [limit]);
        // Retornar en orden cronologico (mas antiguo primero)
        return result.rows.reverse();
    }
};

module.exports = MessageModel;
