-- ============================================================
-- Script de Creacion de Base de Datos - EcoHome Store
-- Migracion de almacenamiento en memoria a PostgreSQL
-- ============================================================

-- ============================================================
-- Tabla: users
-- Descripcion: Almacena los usuarios del sistema con sus roles
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
-- Descripcion: Catalogo de productos ecologicos con trazabilidad
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    available BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Tabla: messages
-- Descripcion: Mensajes del chat interno corporativo
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    username VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Indices para optimizar consultas
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

-- ============================================================
-- Funcion y Trigger para actualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- Datos iniciales de ejemplo (seeds)
-- ============================================================

-- Usuario administrador por defecto (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Administrador', 'admin@ecohome.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Productos de ejemplo (asociados al admin, created_by = 1)
INSERT INTO products (name, description, price, stock, available, created_by) VALUES
('Vaso de Vidrio Reciclado 350ml', 'Vaso artesanal fabricado con vidrio 100% reciclado, capacidad 350ml', 12.50, 50, TRUE, 1),
('Plato Biodegradable Grande', 'Plato de 25cm fabricado con fibra de cana de azucar, 100% compostable', 8.99, 120, TRUE, 1),
('Set Utensilios Bambu (5 piezas)', 'Incluye cuchara, tenedor, cuchillo, palillos y pajita de bambu organico', 15.00, 75, TRUE, 1),
('Bowl Fibra de Coco', 'Bowl decorativo y funcional hecho de cascara de coco natural', 18.50, 30, TRUE, 1),
('Jarra Vidrio Reciclado 1L', 'Jarra de vidrio reciclado con capacidad de 1 litro, ideal para agua o jugos', 22.00, 40, TRUE, 1)
ON CONFLICT DO NOTHING;
