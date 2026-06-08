-- ============================================================
-- Script de Creación de Base de Datos - EcoHome Store
-- Migración de almacenamiento en memoria a PostgreSQL
-- ============================================================

-- Crear la base de datos (ejecutar por separado si es necesario)
-- CREATE DATABASE ecohome_db;

-- ============================================================
-- Tabla: users
-- Descripción: Almacena los usuarios del sistema con sus roles
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabla: products
-- Descripción: Catálogo de productos ecológicos de EcoHome Store
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Función y Trigger para actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Datos iniciales de ejemplo (seeds)
-- ============================================================

-- Usuario administrador por defecto (password: admin123)
-- El hash se genera con bcryptjs
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin EcoHome', 'admin@ecohome.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Productos de ejemplo
INSERT INTO products (name, description, price, stock, available) VALUES
('Vaso de Vidrio Reciclado 350ml', 'Vaso artesanal fabricado con vidrio 100% reciclado, capacidad 350ml', 12.50, 50, TRUE),
('Plato Biodegradable Grande', 'Plato de 25cm fabricado con fibra de caña de azúcar, 100% compostable', 8.99, 120, TRUE),
('Set Utensilios Bambú (5 piezas)', 'Incluye cuchara, tenedor, cuchillo, palillos y pajita de bambú orgánico', 15.00, 75, TRUE),
('Bowl Fibra de Coco', 'Bowl decorativo y funcional hecho de cáscara de coco natural', 18.50, 30, TRUE),
('Jarra Vidrio Reciclado 1L', 'Jarra de vidrio reciclado con capacidad de 1 litro, ideal para agua o jugos', 22.00, 40, TRUE)
ON CONFLICT DO NOTHING;
