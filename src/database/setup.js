// ============================================================
// Script de inicialización de la base de datos
// Ejecutar una vez: node src/database/setup.js
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

        // Crear tabla products
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
                description TEXT,
                stock INTEGER DEFAULT 0,
                available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabla "products" creada correctamente.');

        // Crear índices
        await client.query(`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
        console.log('Índices creados correctamente.');

        // Insertar usuario admin por defecto
        const adminPassword = await bcrypt.hash('admin123', 10);
        await client.query(`
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING;
        `, ['Administrador', 'admin@ecohome.com', adminPassword, 'admin']);
        console.log('Usuario admin creado (admin@ecohome.com / admin123).');

        // Insertar productos de ejemplo
        const productos = [
            ['Vaso de vidrio reciclado 350ml', 12.99, 'Vaso artesanal hecho con vidrio 100% reciclado', 50],
            ['Plato biodegradable grande', 8.50, 'Plato de 25cm fabricado con fibra de caña de azúcar', 120],
            ['Set de cubiertos de bambú', 15.00, 'Incluye tenedor, cuchillo, cuchara y popote de bambú', 80],
            ['Bowl de coco natural', 18.75, 'Bowl tallado a mano de cáscara de coco', 35],
            ['Termo de acero inoxidable 500ml', 25.00, 'Termo reutilizable, mantiene temperatura 12hrs', 60],
        ];

        for (const [name, price, description, stock] of productos) {
            await client.query(`
                INSERT INTO products (name, price, description, stock, available)
                VALUES ($1, $2, $3, $4, TRUE)
                ON CONFLICT DO NOTHING;
            `, [name, price, description, stock]);
        }
        console.log('Productos de ejemplo insertados.');

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
