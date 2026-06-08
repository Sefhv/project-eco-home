@echo off
REM ============================================================
REM Script de pruebas cURL para EcoHome Store API (Windows CMD)
REM Flujo completo: signup - login - usar token - CRUD
REM ============================================================

SET BASE_URL=http://localhost:3000

echo ==========================================
echo   EcoHome Store API - Pruebas cURL
echo ==========================================

echo.
echo --- 1. Health Check ---
curl -s -X GET %BASE_URL%
echo.
echo.

echo --- 2. Registro de Admin ---
curl -s -X POST %BASE_URL%/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"Admin EcoHome\",\"email\":\"admin@ecohome.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
echo.
echo.

echo --- 3. Registro de Cliente ---
curl -s -X POST %BASE_URL%/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"Cliente Test\",\"email\":\"cliente@ecohome.com\",\"password\":\"cliente123\",\"role\":\"cliente\"}"
echo.
echo.

echo --- 4. Login como Admin (copiar token manualmente) ---
curl -s -X POST %BASE_URL%/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@ecohome.com\",\"password\":\"admin123\"}"
echo.
echo.

echo --- 5. Login como Cliente (copiar token manualmente) ---
curl -s -X POST %BASE_URL%/auth/login -H "Content-Type: application/json" -d "{\"email\":\"cliente@ecohome.com\",\"password\":\"cliente123\"}"
echo.
echo.

echo NOTA: Copie el token del admin del paso 4 y reemplace TU_TOKEN_ADMIN en los siguientes comandos
echo NOTA: Copie el token del cliente del paso 5 y reemplace TU_TOKEN_CLIENTE en los siguientes comandos
echo.

echo --- 6. GET /products (Publico - sin token) ---
curl -s -X GET %BASE_URL%/products
echo.
echo.

echo --- 7. POST /products SIN TOKEN (debe dar 401) ---
curl -s -X POST %BASE_URL%/products -H "Content-Type: application/json" -d "{\"name\":\"Producto sin auth\",\"price\":10.00}"
echo.
echo.

echo Pruebas basicas completadas. Para pruebas con token, use Postman o ejecute:
echo curl -X POST %BASE_URL%/products -H "Content-Type: application/json" -H "Authorization: Bearer TU_TOKEN_ADMIN" -d "{\"name\":\"Nuevo Producto\",\"price\":15.99}"
echo.

pause
