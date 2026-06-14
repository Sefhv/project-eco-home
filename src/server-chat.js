// ============================================================
// EcoHome Store - Servidor de Chat Interno
// Servidor independiente con Socket.IO (puerto 3001)
// No modifica app.js (puerto 3000)
// Ejecutar: node src/server-chat.js
// ============================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Importar handler de chat (logica separada)
const setupChatHandler = require('./socket/chatHandler');

// Inicializar Express
const app = express();
const server = http.createServer(app);

// Inicializar Socket.IO con CORS
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'EcoHome Chat Server activo',
        port: CHAT_PORT
    });
});

// Configurar logica de chat (auth + eventos + persistencia)
setupChatHandler(io);

// Iniciar servidor
const CHAT_PORT = process.env.CHAT_PORT || 3001;
server.listen(CHAT_PORT, () => {
    console.log(`EcoHome Chat Server corriendo en http://localhost:${CHAT_PORT}`);
    console.log(`API principal sigue en http://localhost:${process.env.PORT || 3000}`);
});

module.exports = { app, server, io };
