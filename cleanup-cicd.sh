#!/bin/bash

# Elimina todos los recursos aplicados desde el directorio k8s-ingress/
kubectl delete -f k8s-ingress/ --ignore-not-found

# Opcional: Elimina imágenes locales de Docker (solo si tienes acceso y lo necesitas)
# docker rmi docker.io/oacarrillop/api-gateway:latest
# docker rmi docker.io/oacarrillop/api-service:latest
# docker rmi docker.io/oacarrillop/auth-service:latest
# docker rmi docker.io/oacarrillop/filemanager-service:latest
# docker rmi docker.io/oacarrillop/peoplems:latest

echo "Recursos de Kubernetes eliminados. Si necesitas limpiar imágenes Docker, descomenta las líneas correspondientes."