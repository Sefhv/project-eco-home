// ============================================================
// Script de inicializacion de la tabla messages (chat)
// Ejecutar una vez: node src/database/setup-chat.js
// Requiere que la tabla users ya exista (ejecutar setup.js primero)
// ============================================================

const pool = require('../config/database');

async function setupChat() {
    const client = await pool.connect();

    try {
        console.log('Iniciando configuracion de la tabla messages...\n');

        // Crear tabla messages
        await client.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                username VARCHAR(100) NOT NULL,
                text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabla "messages" creada correctamente.');

        // Crear indice para optimizar consulta de ultimos mensajes
        await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);`);
        console.log('Indice idx_messages_created creado correctamente.');

        console.log('\nTabla de chat configurada exitosamente.');

    } catch (error) {
        console.error('Error durante la configuracion:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

setupChat();
