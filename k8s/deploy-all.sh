#!/bin/bash

echo "=========================================="
echo "DESPLEGANDO GENOSENTINEL EN KUBERNETES"
echo "=========================================="

# 1. Crear namespace
echo -e "\n1. Creando namespace..."
kubectl apply -f namespace/genosentinel-namespace.yaml

# 2. Crear ConfigMaps
echo -e "\n2. Creando ConfigMaps..."
kubectl apply -f configmaps/

# 3. Crear Secrets
echo -e "\n3. Creando Secrets..."
kubectl apply -f secrets/

# 4. Crear PVCs
echo -e "\n4. Creando Persistent Volume Claims..."
kubectl apply -f pvcs/

# 5. Crear Deployments de bases de datos
echo -e "\n5. Desplegando bases de datos MySQL..."
kubectl apply -f deployments/mysql-auth-deployment.yaml
kubectl apply -f deployments/mysql-clinical-deployment.yaml
kubectl apply -f deployments/mysql-genomics-deployment.yaml

# Esperar que las bases de datos estén listas
echo -e "\nEsperando que las bases de datos estén listas..."
sleep 30

# 6. Crear Services de bases de datos
echo -e "\n6. Creando Services para bases de datos..."
kubectl apply -f services/mysql-auth-service.yaml
kubectl apply -f services/mysql-clinical-service.yaml
kubectl apply -f services/mysql-genomics-service.yaml

# 7. Crear Deployments de microservicios
echo -e "\n7. Desplegando microservicios..."
kubectl apply -f deployments/auth-service-deployment.yaml
kubectl apply -f deployments/clinical-service-deployment.yaml
kubectl apply -f deployments/genomics-service-deployment.yaml

# 8. Crear Services de microservicios
echo -e "\n8. Creando Services para microservicios..."
kubectl apply -f services/auth-service.yaml
kubectl apply -f services/clinical-service.yaml
kubectl apply -f services/genomics-service.yaml

# 9. Verificar estado
echo -e "\n9. Verificando estado del despliegue..."
kubectl get all -n genosentinel

echo -e "\n=========================================="
echo "¡DESPLIEGUE COMPLETADO!"
echo "=========================================="
echo -e "\nPara acceder al Gateway:"
echo "1. Obtén la IP externa: kubectl get svc auth-service -n genosentinel"
echo "2. Accede en: http://<EXTERNAL-IP>"
echo -e "\nPara ver los logs:"
echo "kubectl logs -f deployment/auth-service-deployment -n genosentinel"