// ============================================================
// Script de inicializacion de la base de datos
// Ejecutar una vez: node src/database/setup.js
// Crea tablas users, products (con created_by) y messages
// ============================================================

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
    const client = await pool.connect();

    try {
        console.log('Iniciando configuracion de la base de datos...\n');

        // Crear tabla users
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabla "users" creada correctamente.');

        // Crear tabla products (con trazabilidad)
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
                description TEXT,
                stock INTEGER DEFAULT 0,
                available BOOLEAN DEFAULT TRUE,
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabla "products" creada correctamente.');

        // Crear tabla messages (chat)
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

        // Crear indices
        await client.query(`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);`);
        console.log('Indices creados correctamente.');

        // Insertar usuario admin por defecto
        const adminPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING;
        `, ['Administrador', 'admin@ecohome.com', adminPassword, 'admin']);
        console.log('Usuario admin creado (admin@ecohome.com / admin123).');

        // Insertar productos de ejemplo (asociados al admin, id=1)
        const productos = [
            ['Vaso de vidrio reciclado 350ml', 12.99, 'Vaso artesanal hecho con vidrio 100% reciclado', 50],
            ['Plato biodegradable grande', 8.50, 'Plato de 25cm fabricado con fibra de cana de azucar', 120],
            ['Set de cubiertos de bambu', 15.00, 'Incluye tenedor, cuchillo, cuchara y popote de bambu', 80],
            ['Bowl de coco natural', 18.75, 'Bowl tallado a mano de cascara de coco', 35],
            ['Termo de acero inoxidable 500ml', 25.00, 'Termo reutilizable, mantiene temperatura 12hrs', 60],
        ];

        for (const [name, price, description, stock] of productos) {
            await client.query(`
                INSERT INTO products (name, price, description, stock, available, created_by)
                VALUES ($1, $2, $3, $4, TRUE, 1)
                ON CONFLICT DO NOTHING;
            `, [name, price, description, stock]);
        }
        console.log('Productos de ejemplo insertados (asociados al admin).');

        console.log('\nBase de datos configurada exitosamente.');
        console.log('   Usuario admin: admin@ecohome.com / admin123');

    } catch (error) {
        console.error('Error durante la configuracion:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

setupDatabase();
