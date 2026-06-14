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

Para crear la tabla de mensajes del chat:

```bash
npm run setup-chat
```

Credenciales del admin por defecto:
- Email: admin@ecohome.com
- Password: admin123

## Ejecutar el servidor

```bash
# API principal (puerto 3000)
npm start

# Desarrollo con auto-reload
npm run dev

# Servidor de chat (puerto 3001) - ejecutar en otra terminal
npm run chat
```

La API principal inicia en `http://localhost:3000`
El chat inicia en `http://localhost:3001`

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

### Chat (WebSocket)

| Evento | Direccion | Descripcion |
|--------|-----------|-------------|
| connection | Cliente -> Servidor | Conectar con token JWT |
| messages | Servidor -> Cliente | Ultimos 10 mensajes (al conectar) |
| new-message | Bidireccional | Enviar/recibir mensaje en tiempo real |
| user-connected | Servidor -> Cliente | Notificacion de conexion |
| user-disconnected | Servidor -> Cliente | Notificacion de desconexion |

**Frontend del chat:** http://localhost:3000/chat

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
├── public/
│   └── chat.html                  # Frontend React del chat
└── src/
    ├── app.js                     # API REST (puerto 3000)
    ├── server-chat.js             # Servidor de chat independiente (puerto 3001)
    ├── config/
    │   └── database.js
    ├── controllers/
    │   ├── authController.js
    │   └── productController.js
    ├── database/
    │   ├── init.sql               # DDL tablas users y products
    │   ├── chat.sql               # DDL tabla messages
    │   ├── setup.js               # Inicializa BD principal
    │   └── setup-chat.js          # Inicializa tabla messages
    ├── middlewares/
    │   ├── authJWT.js
    │   └── authorizeRole.js
    ├── models/
    │   ├── messageModel.js
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
- **Socket.IO** - Comunicacion WebSocket en tiempo real
- **jsonwebtoken** - Generacion y verificacion de JWT
- **bcryptjs** - Hashing de contrasenas
- **dotenv** - Variables de entorno
- **cors** - Soporte Cross-Origin
- **React 18** - Frontend del chat (via CDN)
