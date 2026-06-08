# EcoHome Store - Backend API REST

Backend para la plataforma de e-commerce de EcoHome Store (vasos de vidrio reciclado, platos biodegradables y utensilios ecologicos).

Construido con Express.js, PostgreSQL y JWT.

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL instalado y corriendo en localhost:5432

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/Sefhv/project-eco-home.git
cd project-eco-home

# Instalar dependencias
npm install
```

## Configuracion

Crear un archivo `.env` en la raiz del proyecto:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASS=admin

JWT_SECRET=ecohome_secret_key_2024_segura
JWT_EXPIRES_IN=24h
```

## Inicializar base de datos

Este comando crea las tablas `users` y `products`, inserta un usuario admin y productos de ejemplo:

```bash
npm run setup-db
```

Credenciales del admin por defecto:
- Email: admin@ecohome.com
- Password: admin123

## Ejecutar el servidor

```bash
# Produccion
npm start

# Desarrollo (auto-reload)
npm run dev
```

El servidor inicia en `http://localhost:3000`

## Endpoints

### Autenticacion

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /api/v1/auth/signup | Registrar usuario |
| POST | /api/v1/auth/login | Iniciar sesion (retorna JWT) |

### Productos

| Metodo | Ruta | Descripcion | Acceso |
|--------|------|-------------|--------|
| GET | /api/v1/products | Listar todos los productos | Publico |
| GET | /api/v1/products/:id | Obtener producto por ID | Publico |
| POST | /api/v1/products | Crear producto | Admin |
| PUT | /api/v1/products/:id | Actualizar producto | Admin |
| PATCH | /api/v1/products/:id | Actualizar parcialmente | Admin |
| DELETE | /api/v1/products/:id | Eliminar producto | Admin |

### Codigos de respuesta

- 200 - OK
- 201 - Recurso creado
- 400 - Error de validacion
- 401 - No autenticado (sin token o token invalido)
- 403 - Sin permisos (rol insuficiente)
- 404 - Recurso no encontrado

## Autenticacion

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene en la respuesta de `/api/v1/auth/login`.

### Roles

- **admin**: Puede crear, editar y eliminar productos.
- **cliente**: Solo puede consultar productos.

## Pruebas

### Script automatizado

Con el servidor corriendo:

```bash
node test-api.js
```

### Postman

Importar el archivo `EcoHome_Store.postman_collection.json` en Postman. La coleccion guarda los tokens automaticamente al hacer login.

## Estructura del proyecto

```
project-eco-home/
├── .env
├── .gitignore
├── package.json
├── test-api.js
├── EcoHome_Store.postman_collection.json
└── src/
    ├── app.js
    ├── config/
    │   └── database.js
    ├── controllers/
    │   ├── authController.js
    │   └── productController.js
    ├── database/
    │   ├── init.sql
    │   └── setup.js
    ├── middlewares/
    │   ├── authJWT.js
    │   └── authorizeRole.js
    ├── models/
    │   ├── productModel.js
    │   └── userModel.js
    └── routes/
        ├── authRoutes.js
        └── productRoutes.js
```

## Tecnologias

- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **pg** - Driver de PostgreSQL para Node.js (connection pool)
- **jsonwebtoken** - Generacion y verificacion de JWT
- **bcryptjs** - Hashing de contrasenas
- **dotenv** - Variables de entorno
- **cors** - Soporte Cross-Origin
