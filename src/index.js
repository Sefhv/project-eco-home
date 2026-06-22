// ============================================================
// EcoHome Store - Entry Point Unificado para producción
// Ejecuta API REST + Chat Server en un solo proceso
// ============================================================

require('dotenv').config();

// Iniciar API REST
require('./app');

// Iniciar Chat Server
require('./server-chat');

console.log('EcoHome Store - Todos los servicios iniciados.');
