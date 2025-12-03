@echo off
title GenoSentinel Cleanup
color 0C

echo ==========================================
echo    LIMPIANDO DESPLIEGUE GENOSENTINEL
echo ==========================================
echo.

echo ¿Estas seguro que quieres eliminar TODO el namespace 'genosentinel'?
echo Esto borrara: Pods, Services, ConfigMaps, Secrets, PVCs, TODO.
echo.
set /p confirm="Escribe 'SI' para confirmar: "

if /i "%confirm%"=="SI" (
    echo.
    echo Eliminando namespace genosentinel...
    kubectl delete namespace genosentinel
    
    echo.
    echo Verificando que se elimino...
    kubectl get namespaces | findstr genosentinel
    if %errorlevel% equ 0 (
        echo [ERROR] No se pudo eliminar completamente
    ) else (
        echo [OK] Namespace eliminado correctamente
    )
) else (
    echo.
    echo Operacion cancelada.
)

echo.
pause