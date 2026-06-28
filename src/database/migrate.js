// Migracion: agregar columna created_by a tabla products existente
const pool = require('../config/database');

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Ejecutando migracion...');
        await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id)');
        console.log('Columna created_by agregada a products.');
        await client.query('CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by)');
        console.log('Indice idx_products_created_by creado.');
        console.log('Migracion completada.');
    } catch (error) {
        console.error('Error en migracion:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
