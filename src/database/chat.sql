-- ============================================================
-- EcoHome Store - Script de creacion de tabla messages (chat)
-- Base de datos: PostgreSQL
-- Requiere: tabla users ya existente
-- ============================================================

-- Tabla de mensajes (chat interno corporativo)
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    username VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indice para optimizar consulta de ultimos mensajes
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
