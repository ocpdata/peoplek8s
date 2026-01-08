#!/bin/bash

# Elimina todos los recursos EXCEPTO el PVC (para preservar datos de MySQL)
echo "Eliminando recursos (preservando PVC)..."

# Elimina cada archivo excepto pvc-mysql.yaml
for file in k8s-ingress/*.yaml; do
  if [[ "$file" != "k8s-ingress/pvc-mysql.yaml" ]]; then
    kubectl delete -f "$file" --ignore-not-found
  fi
done

echo "Recursos eliminados (PVC preservado con datos de MySQL)"

# Para eliminar también el PVC y TODOS los datos, descomenta la siguiente línea:
# kubectl delete -f k8s-ingress/pvc-mysql.yaml

# Opcional: Elimina imágenes locales de Docker (solo si tienes acceso y lo necesitas)
# docker rmi docker.io/oacarrillop/api-gateway:latest
# docker rmi docker.io/oacarrillop/api-service:latest
# docker rmi docker.io/oacarrillop/auth-service:latest
# docker rmi docker.io/oacarrillop/filemanager-service:latest
# docker rmi docker.io/oacarrillop/peoplems:latest

echo "Recursos de Kubernetes eliminados. Si se necesita limpiar imágenes Docker, descomenta las líneas correspondientes."