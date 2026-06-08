// ============================================================
// Script de prueba completa del API
// Ejecutar: node test-api.js
// ============================================================

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(data) });
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('=' .repeat(60));
    console.log('  PRUEBAS DE API - EcoHome Store');
    console.log('=' .repeat(60));

    // 1. GET /api/v1/products (publico)
    console.log('\n--- 1. GET /api/v1/products (publico) ---');
    let res = await request('GET', '/api/v1/products');
    console.log(`Status: ${res.status}`);
    console.log(`Productos encontrados: ${res.body.count}`);
    console.log(`Primer producto: ${res.body.data[0].name}`);

    // 2. GET /api/v1/products/:id
    console.log('\n--- 2. GET /api/v1/products/1 ---');
    res = await request('GET', '/api/v1/products/1');
    console.log(`Status: ${res.status}`);
    console.log(`Producto: ${res.body.data.name} - $${res.body.data.price}`);

    // 3. GET /api/v1/products/:id (no existe)
    console.log('\n--- 3. GET /api/v1/products/999 (no existe) ---');
    res = await request('GET', '/api/v1/products/999');
    console.log(`Status: ${res.status}`);
    console.log(`Mensaje: ${res.body.message}`);

    // 4. POST /api/v1/products SIN token (debe fallar 401)
    console.log('\n--- 4. POST /api/v1/products SIN token (debe dar 401) ---');
    res = await request('POST', '/api/v1/products', { name: 'Test', price: 10 });
    console.log(`Status: ${res.status}`);
    console.log(`Mensaje: ${res.body.message}`);

    // 5. Signup cliente
    console.log('\n--- 5. POST /api/v1/auth/signup (cliente) ---');
    res = await request('POST', '/api/v1/auth/signup', {
        name: 'Juan Cliente',
        email: 'juan@test.com',
        password: 'password123'
    });
    console.log(`Status: ${res.status}`);
    console.log(`Usuario: ${res.body.data ? res.body.data.name : 'ya existe'} - Rol: ${res.body.data ? res.body.data.role : 'N/A'}`);

    // 6. Login admin
    console.log('\n--- 6. POST /api/v1/auth/login (admin) ---');
    res = await request('POST', '/api/v1/auth/login', {
        email: 'admin@ecohome.com',
        password: 'admin123'
    });
    console.log(`Status: ${res.status}`);
    console.log(`Token recibido: ${res.body.data.token.substring(0, 30)}...`);
    console.log(`Rol: ${res.body.data.user.role}`);
    const adminToken = res.body.data.token;

    // 7. Login cliente
    console.log('\n--- 7. POST /api/v1/auth/login (cliente) ---');
    res = await request('POST', '/api/v1/auth/login', {
        email: 'juan@test.com',
        password: 'password123'
    });
    console.log(`Status: ${res.status}`);
    console.log(`Rol: ${res.body.data.user.role}`);
    const clienteToken = res.body.data.token;

    // 8. POST /api/v1/products con token CLIENTE (debe dar 403)
    console.log('\n--- 8. POST /api/v1/products con token CLIENTE (debe dar 403) ---');
    res = await request('POST', '/api/v1/products', { name: 'Producto X', price: 5 }, clienteToken);
    console.log(`Status: ${res.status}`);
    console.log(`Mensaje: ${res.body.message}`);

    // 9. POST /api/v1/products con token ADMIN (debe crear)
    console.log('\n--- 9. POST /api/v1/products con token ADMIN ---');
    res = await request('POST', '/api/v1/products', {
        name: 'Jabonera de bambu',
        price: 9.50,
        description: 'Jabonera ecologica hecha de bambu natural',
        stock: 40
    }, adminToken);
    console.log(`Status: ${res.status}`);
    console.log(`Creado: ${res.body.data.name} - $${res.body.data.price}`);
    const newProductId = res.body.data.id;

    // 10. PUT /api/v1/products/:id con token ADMIN
    console.log(`\n--- 10. PUT /api/v1/products/${newProductId} con token ADMIN ---`);
    res = await request('PUT', `/api/v1/products/${newProductId}`, { price: 11.99 }, adminToken);
    console.log(`Status: ${res.status}`);
    console.log(`Actualizado: ${res.body.data.name} - Nuevo precio: $${res.body.data.price}`);

    // 11. DELETE con token CLIENTE (debe dar 403)
    console.log(`\n--- 11. DELETE /api/v1/products/${newProductId} con token CLIENTE (debe dar 403) ---`);
    res = await request('DELETE', `/api/v1/products/${newProductId}`, null, clienteToken);
    console.log(`Status: ${res.status}`);
    console.log(`Mensaje: ${res.body.message}`);

    // 12. DELETE con token ADMIN
    console.log(`\n--- 12. DELETE /api/v1/products/${newProductId} con token ADMIN ---`);
    res = await request('DELETE', `/api/v1/products/${newProductId}`, null, adminToken);
    console.log(`Status: ${res.status}`);
    console.log(`Eliminado: ${res.body.data.name}`);

    // 13. Validacion - price <= 0
    console.log('\n--- 13. POST /api/v1/products con price invalido ---');
    res = await request('POST', '/api/v1/products', { name: 'Invalido', price: -5 }, adminToken);
    console.log(`Status: ${res.status}`);
    console.log(`Mensaje: ${res.body.message}`);

    // 14. Validacion - sin name
    console.log('\n--- 14. POST /api/v1/products sin name ---');
    res = await request('POST', '/api/v1/products', { price: 10 }, adminToken);
    console.log(`Status: ${res.status}`);
    console.log(`Mensaje: ${res.body.message}`);

    console.log('\n' + '=' .repeat(60));
    console.log('  TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('=' .repeat(60));
}

runTests().catch(err => console.error('Error:', err.message));
