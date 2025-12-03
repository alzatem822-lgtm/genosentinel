Write-Host "==========================================" -ForegroundColor Green
Write-Host "DESPLEGANDO GENOSENTINEL EN KUBERNETES" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# 1. Crear namespace
Write-Host "`n1. Creando namespace..." -ForegroundColor Cyan
kubectl apply -f namespace/genosentinel-namespace.yaml

# 2. Crear ConfigMaps
Write-Host "`n2. Creando ConfigMaps..." -ForegroundColor Cyan
kubectl apply -f configmaps/

# 3. Crear Secrets
Write-Host "`n3. Creando Secrets..." -ForegroundColor Cyan
kubectl apply -f secrets/

# 4. Crear PVCs
Write-Host "`n4. Creando Persistent Volume Claims..." -ForegroundColor Cyan
kubectl apply -f pvcs/

# 5. Crear Deployments de bases de datos
Write-Host "`n5. Desplegando bases de datos MySQL..." -ForegroundColor Cyan
kubectl apply -f deployments/mysql-auth-deployment.yaml
kubectl apply -f deployments/mysql-clinical-deployment.yaml
kubectl apply -f deployments/mysql-genomics-deployment.yaml

# Esperar que las bases de datos estén listas
Write-Host "`nEsperando que las bases de datos estén listas..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 6. Crear Services de bases de datos
Write-Host "`n6. Creando Services para bases de datos..." -ForegroundColor Cyan
kubectl apply -f services/mysql-auth-service.yaml
kubectl apply -f services/mysql-clinical-service.yaml
kubectl apply -f services/mysql-genomics-service.yaml

# 7. Crear Deployments de microservicios
Write-Host "`n7. Desplegando microservicios..." -ForegroundColor Cyan
kubectl apply -f deployments/auth-service-deployment.yaml
kubectl apply -f deployments/clinical-service-deployment.yaml
kubectl apply -f deployments/genomics-service-deployment.yaml

# 8. Crear Services de microservicios
Write-Host "`n8. Creando Services para microservicios..." -ForegroundColor Cyan
kubectl apply -f services/auth-service.yaml
kubectl apply -f services/clinical-service.yaml
kubectl apply -f services/genomics-service.yaml

# 9. Verificar estado
Write-Host "`n9. Verificando estado del despliegue..." -ForegroundColor Cyan
kubectl get all -n genosentinel

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "¡DESPLIEGUE COMPLETADO!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "`nPara acceder al Gateway:" -ForegroundColor Yellow
Write-Host "1. Obtén la IP externa: kubectl get svc auth-service -n genosentinel" -ForegroundColor Yellow
Write-Host "2. Accede en: http://<EXTERNAL-IP>" -ForegroundColor Yellow
Write-Host "`nPara ver los logs:" -ForegroundColor Yellow
Write-Host "kubectl logs -f deployment/auth-service-deployment -n genosentinel" -ForegroundColor Yellow