// ============================================================
// Configuración de conexión a PostgreSQL
// Usa un pool de conexiones para escalabilidad
// ============================================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'admin',
    max: 10, // máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Verificar conexión al iniciar
pool.connect()
    .then(client => {
        console.log('Conexion exitosa a PostgreSQL');
        client.release();
    })
    .catch(err => {
        console.error('Error al conectar a PostgreSQL:', err.message);
    });

module.exports = pool;
