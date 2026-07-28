@echo off
setlocal

echo ==========================================
echo User Directory App - Local Startup
echo ==========================================
echo.

set "ROOT_DIR=%~dp0"
set "API_DIR=%ROOT_DIR%UserDirectoryApi"
set "APP_DIR=%ROOT_DIR%UserDirectoryApp"

if not exist "%API_DIR%\UserDirectoryApi.csproj" (
  echo [ERROR] API project not found: %API_DIR%
  exit /b 1
)

if not exist "%APP_DIR%\package.json" (
  echo [ERROR] Frontend project not found: %APP_DIR%
  exit /b 1
)

if not exist "%APP_DIR%\.env.local" (
  echo [WARN] %APP_DIR%\.env.local not found.
  echo [WARN] Frontend Auth0 login may fail until you create it.
  echo [INFO] Expected keys: VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE
  echo.
)

echo [1/2] Starting API on http://localhost:5096 ...
start "User Directory API" cmd /k "cd /d "%API_DIR%" && dotnet restore && dotnet run --launch-profile http"

echo [2/2] Starting Frontend on http://localhost:5173 ...
start "User Directory Frontend" cmd /k "cd /d "%APP_DIR%" && npm install && npm run dev"

echo.
echo Startup commands launched in two new windows.
echo - API Swagger: http://localhost:5096/swagger
echo - Frontend:   http://localhost:5173
echo.
echo Close each terminal window or press Ctrl+C in each to stop.
exit /b 0
