#!/bin/bash
# ============================================================
# Script de pruebas cURL para EcoHome Store API
# Flujo completo: signup → login → usar token → CRUD
# ============================================================

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "  EcoHome Store API - Pruebas cURL"
echo "=========================================="

# ---- 1. HEALTH CHECK ----
echo ""
echo "--- 1. Health Check ---"
curl -s -X GET $BASE_URL | python -m json.tool
echo ""

# ---- 2. SIGNUP (Registro de Admin) ----
echo "--- 2. Registro de usuario Admin ---"
curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin EcoHome",
    "email": "admin@ecohome.com",
    "password": "admin123",
    "role": "admin"
  }' | python -m json.tool
echo ""

# ---- 3. SIGNUP (Registro de Cliente) ----
echo "--- 3. Registro de usuario Cliente ---"
curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Test",
    "email": "cliente@ecohome.com",
    "password": "cliente123",
    "role": "cliente"
  }' | python -m json.tool
echo ""

# ---- 4. LOGIN como Admin ----
echo "--- 4. Login como Admin ---"
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecohome.com",
    "password": "admin123"
  }')
echo $ADMIN_RESPONSE | python -m json.tool

# Extraer token del admin
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")
echo "Token Admin: $ADMIN_TOKEN"
echo ""

# ---- 5. LOGIN como Cliente ----
echo "--- 5. Login como Cliente ---"
CLIENT_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@ecohome.com",
    "password": "cliente123"
  }')
echo $CLIENT_RESPONSE | python -m json.tool

CLIENT_TOKEN=$(echo $CLIENT_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")
echo "Token Cliente: $CLIENT_TOKEN"
echo ""

# ---- 6. GET /products (Público - sin token) ----
echo "--- 6. GET /products (Todos los productos - público) ---"
curl -s -X GET $BASE_URL/products | python -m json.tool
echo ""

# ---- 7. POST /products SIN TOKEN (debe fallar 401) ----
echo "--- 7. POST /products SIN TOKEN (debe dar 401) ---"
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto sin auth",
    "price": 10.00
  }' | python -m json.tool
echo ""

# ---- 8. POST /products con TOKEN CLIENTE (debe fallar 403) ----
echo "--- 8. POST /products con TOKEN CLIENTE (debe dar 403) ---"
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d '{
    "name": "Producto como cliente",
    "price": 10.00
  }' | python -m json.tool
echo ""

# ---- 9. POST /products con TOKEN ADMIN (debe funcionar 201) ----
echo "--- 9. POST /products con TOKEN ADMIN (crea producto) ---"
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Servilletas de Bambú (Pack 50)",
    "description": "Servilletas biodegradables hechas de fibra de bambú",
    "price": 6.50,
    "stock": 200,
    "available": true
  }' | python -m json.tool
echo ""

# ---- 10. GET /products/:id ----
echo "--- 10. GET /products/1 (Obtener un producto) ---"
curl -s -X GET $BASE_URL/products/1 | python -m json.tool
echo ""

# ---- 11. PUT /products/:id con TOKEN ADMIN ----
echo "--- 11. PUT /products/1 con ADMIN (actualizar precio) ---"
curl -s -X PUT $BASE_URL/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "price": 14.99,
    "stock": 45
  }' | python -m json.tool
echo ""

# ---- 12. DELETE /products/:id con TOKEN CLIENTE (debe fallar 403) ----
echo "--- 12. DELETE /products/1 con CLIENTE (debe dar 403) ---"
curl -s -X DELETE $BASE_URL/products/1 \
  -H "Authorization: Bearer $CLIENT_TOKEN" | python -m json.tool
echo ""

# ---- 13. DELETE /products/:id con TOKEN ADMIN ----
echo "--- 13. DELETE /products/5 con ADMIN (elimina producto) ---"
curl -s -X DELETE $BASE_URL/products/5 \
  -H "Authorization: Bearer $ADMIN_TOKEN" | python -m json.tool
echo ""

# ---- 14. GET /products/:id (producto no existe - 404) ----
echo "--- 14. GET /products/999 (debe dar 404) ---"
curl -s -X GET $BASE_URL/products/999 | python -m json.tool
echo ""

# ---- 15. POST /products con precio inválido (debe fallar 400) ----
echo "--- 15. POST /products con precio inválido (debe dar 400) ---"
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Producto inválido",
    "price": -5
  }' | python -m json.tool
echo ""

echo "=========================================="
echo "  Pruebas completadas"
echo "=========================================="
