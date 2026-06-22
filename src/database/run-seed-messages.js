// ============================================================
// Script para ejecutar el seed de mensajes
// Ejecutar: node src/database/run-seed-messages.js
// ============================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ecohome_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
});

async function seedMessages() {
    const client = await pool.connect();
    try {
        console.log('Iniciando seed de mensajes...\n');

        // 1. Actualizar nombre del admin
        await client.query(`UPDATE users SET name = 'Administrador' WHERE id = 1`);
        console.log('Admin actualizado a "Administrador".');

        // 2. Crear usuario Juan Cliente con password real
        const hash = await bcrypt.hash('cliente123', 10);
        await client.query(`
            INSERT INTO users (id, name, email, password_hash, role)
            VALUES (2, 'Juan Cliente', 'juan@ecohome.com', $1, 'cliente')
            ON CONFLICT (email) DO UPDATE SET
                name = 'Juan Cliente',
                password_hash = $1
        `, [hash]);
        console.log('Usuario "Juan Cliente" creado (juan@ecohome.com / cliente123).');

        // 3. Actualizar secuencia de users
        await client.query(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`);

        // 4. Limpiar mensajes e insertar historial
        await client.query(`TRUNCATE TABLE messages RESTART IDENTITY`);

        const messages = [
            [1, 1, 'Administrador', 'Hola', '2026-06-14 12:45:00.029'],
            [2, 2, 'Juan Cliente', 'Hola', '2026-06-14 12:45:10.495'],
            [3, 2, 'Juan Cliente', 'quiero saber que productos ofrecen?', '2026-06-14 12:48:31.806'],
            [4, 1, 'Administrador', 'claro que si', '2026-06-14 12:48:39.058'],
            [5, 1, 'Administrador', 'En eco home ofrecemos productos de ecologicos amigables con el medio ambiente', '2026-06-14 12:49:46.888'],
            [6, 2, 'Juan Cliente', 'que interesante que clase de productos tienen?', '2026-06-14 12:49:55.843'],
            [7, 1, 'Administrador', 'De momento tenemos Vasos de vidrio reciclado, platos biodegrabales, cubiertos de bambu, entre otros? le gustaria saber mas acerca de algun producto?', '2026-06-14 12:50:47.464'],
            [8, 2, 'Juan Cliente', 'me interesan los vasos de vidrio reciclados', '2026-06-14 12:51:35.767'],
            [9, 1, 'Administrador', 'claro que si esta es la descripcion del producto:', '2026-06-14 12:59:04.629'],
            [10, 1, 'Administrador', 'Vaso artesanal hecho con vidrio 100% reciclado', '2026-06-14 12:59:06.338'],
            [11, 1, 'Administrador', 'actualmente tenemos disponible 50 unidades', '2026-06-14 12:59:18.252'],
            [12, 1, 'Administrador', 'a un precio de 12.99 dolares', '2026-06-14 12:59:37.336'],
            [13, 2, 'Juan Cliente', 'entiendo, como puedo hacer la compra?', '2026-06-14 12:59:59.034'],
            [14, 1, 'Administrador', 'puede entrar en nuestra pagina, generar la comprar y pagar', '2026-06-14 13:00:26.356'],
            [15, 2, 'Juan Cliente', 'muchas gracias', '2026-06-14 13:00:30.610'],
        ];

        for (const [id, userId, username, text, createdAt] of messages) {
            await client.query(
                `INSERT INTO messages (id, user_id, username, text, created_at) VALUES ($1, $2, $3, $4, $5)`,
                [id, userId, username, text, createdAt]
            );
        }
        console.log('15 mensajes insertados correctamente.');

        // 5. Actualizar secuencia de messages
        await client.query(`SELECT setval('messages_id_seq', 15)`);

        console.log('\nSeed completado exitosamente.');
        console.log('  Admin: admin@ecohome.com / admin123');
        console.log('  Cliente: juan@ecohome.com / cliente123');

    } catch (error) {
        console.error('Error durante el seed:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seedMessages();
