@echo off
title GenoSentinel Kubernetes Deploy
color 0A

echo ==========================================
echo    GENOSENTINEL - KUBERNETES DEPLOY
echo ==========================================
echo.

REM 1. CREAR NAMESPACE
echo [1/8] Creando namespace 'genosentinel'...
kubectl apply -f namespace\
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo crear namespace
    pause
    exit /b 1
)

REM 2. CONFIGMAPS
echo [2/8] Aplicando ConfigMaps...
kubectl apply -f configmaps\
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] Error en ConfigMaps, continuando...
)

REM 3. SECRETS
echo [3/8] Aplicando Secrets...
kubectl apply -f secrets\
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] Error en Secrets, continuando...
)

REM 4. PVCs (Persistent Volume Claims)
echo [4/8] Creando almacenamiento persistente...
kubectl apply -f pvcs\
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] Error en PVCs, continuando...
)

REM 5. BASES DE DATOS MYSQL
echo [5/8] Desplegando bases de datos MySQL...
echo   - MySQL Auth...
kubectl apply -f deployments\mysql-auth-deployment.yaml
echo   - MySQL Clinical...
kubectl apply -f deployments\mysql-clinical-deployment.yaml
echo   - MySQL Genomics...
kubectl apply -f deployments\mysql-genomics-deployment.yaml

echo.
echo [INFO] Esperando 30 segundos para que las bases de datos inicien...
echo        (Presiona Ctrl+C para saltar espera)
timeout /t 30 /nobreak >nul

REM 6. SERVICIOS DE BD
echo [6/8] Creando servicios para bases de datos...
kubectl apply -f services\mysql-auth-service.yaml
kubectl apply -f services\mysql-clinical-service.yaml
kubectl apply -f services\mysql-genomics-service.yaml

REM 7. MICROSERVICIOS
echo [7/8] Desplegando microservicios...
echo   - Auth Service (Gateway)...
kubectl apply -f deployments\auth-service-deployment.yaml
echo   - Clinical Service...
kubectl apply -f deployments\clinical-service-deployment.yaml
echo   - Genomics Service...
kubectl apply -f deployments\genomics-service-deployment.yaml

REM 8. SERVICIOS DE MICROSERVICIOS
echo [8/8] Exponiendo servicios...
kubectl apply -f services\auth-service.yaml
kubectl apply -f services\clinical-service.yaml
kubectl apply -f services\genomics-service.yaml

echo.
echo ==========================================
echo    DESPLIEGUE COMPLETADO
echo ==========================================
echo.

REM VERIFICAR ESTADO
echo Verificando estado del despliegue...
echo.
kubectl get all -n genosentinel

echo.
echo ==========================================
echo    INSTRUCCIONES DE ACCESO
echo ==========================================
echo.
echo Para acceder al Gateway (Auth Service):
echo   1. Obtener IP y puerto:
echo      kubectl get svc auth-service -n genosentinel
echo.
echo   2. Si usa NodePort, acceder en:
echo      http://localhost:[NODE_PORT]
echo.
echo Para ver logs:
echo   kubectl logs -f deployment/auth-service-deployment -n genosentinel
echo.
echo Para eliminar todo:
echo   kubectl delete namespace genosentinel
echo.
echo ==========================================
pause