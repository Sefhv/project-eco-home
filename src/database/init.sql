-- ============================================================
-- EcoHome Store - Script de creación de tablas
-- Base de datos: PostgreSQL
-- ============================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
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

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insertar usuario admin por defecto (password: admin123)
-- El hash corresponde a bcrypt de 'admin123'
INSERT INTO users (name, email, password_hash, role)
VALUES ('Administrador', 'admin@ecohome.com', '$2a$10$placeholder', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO products (name, price, description, stock, available) VALUES
('Vaso de vidrio reciclado 350ml', 12.99, 'Vaso artesanal hecho con vidrio 100% reciclado', 50, TRUE),
('Plato biodegradable grande', 8.50, 'Plato de 25cm fabricado con fibra de caña de azúcar', 120, TRUE),
('Set de cubiertos de bambú', 15.00, 'Incluye tenedor, cuchillo, cuchara y popote de bambú', 80, TRUE),
('Bowl de coco natural', 18.75, 'Bowl tallado a mano de cáscara de coco', 35, TRUE),
('Termo de acero inoxidable 500ml', 25.00, 'Termo reutilizable, mantiene temperatura 12hrs', 60, TRUE)
ON CONFLICT DO NOTHING;
