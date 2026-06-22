# EcoHome Store - Backend API

Backend centralizado para la plataforma EcoHome Store. API REST + Chat en tiempo real con Socket.IO.

## Stack

- **Runtime:** Node.js 18 + Express 5
- **Base de datos:** PostgreSQL 16 (Docker local / Supabase en producción)
- **Autenticación:** JWT (stateless)
- **Tiempo real:** Socket.IO
- **Contenedores:** Docker

## Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/auth/signup` | Registro de usuario | No |
| POST | `/api/v1/auth/login` | Login (devuelve JWT) | No |
| GET | `/api/v1/auth/me/stats` | Perfil + contador de productos | Sí |

### Productos
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/products` | Listar productos (con creador) | No |
| GET | `/api/v1/products/:id` | Obtener producto por ID | No |
| POST | `/api/v1/products` | Crear producto (trazabilidad) | Admin |
| PUT | `/api/v1/products/:id` | Actualizar producto | Admin |
| DELETE | `/api/v1/products/:id` | Eliminar producto | Admin |

### Chat (Socket.IO - puerto 3001)
| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `messages` | Server → Client | Historial (últimos 10) |
| `new-message` | Bidireccional | Enviar/recibir mensaje |
| `user-connected` | Server → Client | Notificación de conexión |
| `user-disconnected` | Server → Client | Notificación de desconexión |

## Instalación

```bash
# Clonar
git clone https://github.com/Sefhv/project-eco-home.git
cd project-eco-home

# Instalar dependencias
npm install

# Levantar PostgreSQL con Docker
docker compose up -d

# Configurar .env (ya incluido con valores por defecto)
# Editar si es necesario: DB_PASS, JWT_SECRET

# Inicializar base de datos
npm run setup-db
npm run setup-chat

# (Opcional) Cargar mensajes de ejemplo
node src/database/run-seed-messages.js
```

## Ejecución

```bash
# API REST (puerto 3000)
npm run dev

# Chat Server (puerto 3001) - en otra terminal
npm run chat

# O ambos juntos (producción)
node src/index.js
```

## Credenciales de prueba

| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| Administrador | admin@ecohome.com | admin123 | admin |
| Juan Cliente | juan@ecohome.com | cliente123 | cliente |

## Docker (producción)

```bash
docker build -t ecohome-backend .
docker run -p 3000:3000 -p 3001:3001 --env-file .env.production ecohome-backend
```

## Arquitectura

```
project-eco-home/
├── src/
│   ├── index.js              # Entry point unificado
│   ├── app.js                # API REST (puerto 3000)
│   ├── server-chat.js        # Chat Server (puerto 3001)
│   ├── config/database.js    # Pool PostgreSQL
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middlewares/
│   │   ├── authJWT.js
│   │   └── authorizeRole.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   └── messageModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   └── socket/chatHandler.js
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Puertos

| Servicio | Puerto |
|----------|--------|
| API REST | 3000 |
| Chat (Socket.IO) | 3001 |
| PostgreSQL | 5432 |
