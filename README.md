# EcoHome Store - Backend

Backend unificado para la plataforma EcoHome Store. Sirve tanto al frontend web (React) como a la app movil (Flutter).

## Arquitectura

| Servicio | Puerto | Descripcion |
|----------|--------|-------------|
| API REST | 3000 | Auth + CRUD Productos + Stats |
| Chat Server | 3001 | Socket.IO + JWT + Persistencia |
| Frontend React | 5173 | Login + Catalogo + Chat |
| App Flutter | -- | Login + Catalogo + Chat |
| PostgreSQL | 5432 | Base de datos |

## Requisitos

- Node.js v18+
- PostgreSQL corriendo en localhost:5432

## Instalacion

```bash
git clone https://github.com/Sefhv/project-eco-home.git
cd project-eco-home
npm install
```

## Variables de entorno

Crear archivo `.env` en la raiz:

```env
PORT=3000
NODE_ENV=development
CHAT_PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASS=admin

JWT_SECRET=ecohome_secret_key_2024_segura
JWT_EXPIRES_IN=24h
```

## Inicializar base de datos

```bash
npm run setup-db
```

Crea las tablas `users`, `products` (con `created_by`) y `messages`, mas datos de ejemplo.

## Ejecutar

```bash
# Terminal 1: API REST (puerto 3000)
npm start

# Terminal 2: Chat Server (puerto 3001)
npm run chat
```

## Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@ecohome.com | admin123 |
| Cliente | juan@test.com | password123 |

(El cliente se crea via POST /api/v1/auth/signup o ejecutando test-api.js)

## Endpoints API

### Auth

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /api/v1/auth/signup | Registro |
| POST | /api/v1/auth/login | Login (retorna JWT) |
| GET | /api/v1/auth/me/stats | Perfil + contador productos (JWT) |

### Productos

| Metodo | Ruta | Descripcion | Acceso |
|--------|------|-------------|--------|
| GET | /api/v1/products | Listar (incluye creator_name) | Publico |
| GET | /api/v1/products/:id | Obtener por ID | Publico |
| POST | /api/v1/products | Crear (guarda created_by) | Admin |
| PUT | /api/v1/products/:id | Actualizar | Admin |
| PATCH | /api/v1/products/:id | Actualizar parcial | Admin |
| DELETE | /api/v1/products/:id | Eliminar | Admin |

### Chat (Socket.IO - puerto 3001)

| Evento | Direccion | Descripcion |
|--------|-----------|-------------|
| connection | Cliente -> Servidor | Conectar con JWT en auth.token |
| messages | Servidor -> Cliente | Ultimos 10 mensajes (al conectar) |
| new-message | Bidireccional | Enviar/recibir mensaje |
| user-connected | Servidor -> Cliente | Notificacion conexion |
| user-disconnected | Servidor -> Cliente | Notificacion desconexion |

## Pruebas

```bash
# Con el servidor corriendo:
node test-api.js

# Postman: importar EcoHome_Store.postman_collection.json
```

## Estructura

```
project-eco-home/
├── .env
├── package.json
├── test-api.js
├── EcoHome_Store.postman_collection.json
└── src/
    ├── app.js                     # API REST (puerto 3000)
    ├── server-chat.js             # Chat Server (puerto 3001)
    ├── config/
    │   └── database.js            # Pool PostgreSQL
    ├── controllers/
    │   ├── authController.js      # Login + Signup + Stats
    │   └── productController.js   # CRUD + Trazabilidad
    ├── database/
    │   ├── init.sql               # DDL completo
    │   ├── setup.js               # Inicializador
    │   ├── chat.sql               # DDL messages (standalone)
    │   └── setup-chat.js          # Inicializador messages
    ├── middlewares/
    │   ├── authJWT.js
    │   └── authorizeRole.js
    ├── models/
    │   ├── userModel.js
    │   ├── productModel.js        # Incluye countByUser + JOIN creator
    │   └── messageModel.js
    ├── routes/
    │   ├── authRoutes.js          # Incluye /me/stats
    │   └── productRoutes.js
    └── socket/
        └── chatHandler.js         # Logica Socket.IO separada
```
