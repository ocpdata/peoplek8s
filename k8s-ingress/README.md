# Arquitectura con Nginx Ingress Controller

Esta configuración despliega `peoplems`, `api-gateway` y los tres microservicios (`auth-service`, `api-service`, `filemanager-service`) usando Nginx Ingress Controller para enrutamiento basado en paths.

## Esquema de la Arquitectura

```
┌──────────────────────────────────────────────────────────────┐
│                        INTERNET                               │
│                 (peoplek8s.digitalvs.com)                     │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS (443)
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              NGINX INGRESS CONTROLLER                         │
│                   (LoadBalancer)                              │
│                   IP: XXX.XXX.XXX.XXX                         │
│                                                               │
│  Enrutamiento por Path:                                      │
│  ├─ /                → peoplems-service:4000                 │
│  ├─ /auth            → api-gateway-service:4100              │
│  ├─ /apis            → api-gateway-service:4100              │
│  ├─ /doc             → api-gateway-service:4100              │
│  └─ /filemanager     → api-gateway-service:4100              │
└────────────┬────────────────────────┬────────────────────────┘
             │ HTTPS                  │ HTTPS
             ▼                        ▼
┌─────────────────────┐    ┌──────────────────────────────────┐
│ peoplems-service    │    │ api-gateway-service              │
│ (ClusterIP)         │    │ (ClusterIP)                      │
│ Port: 4000          │    │ Port: 4100                       │
└──────────┬──────────┘    └──────────┬───────────────────────┘
           │ HTTPS                    │ HTTPS
           ▼                          ▼
┌─────────────────────┐    ┌──────────────────────────────────┐
│ peoplems-deployment │    │ api-gateway-deployment           │
│ (2 réplicas)        │    │ (2 réplicas)                     │
│                     │    │                                  │
│ ┌─────────────────┐ │    │ ┌─────────────────┐             │
│ │ Pod 1 - 4000    │ │    │ │ Pod 1 - 4100    │             │
│ │ Node + Express  │ │    │ │ Node + Express  │             │
│ │ HTTPS/SSL       │ │    │ │ HTTPS/SSL       │             │
│ └─────────────────┘ │    │ └─────────────────┘             │
│                     │    │                                  │
│ ┌─────────────────┐ │    │ ┌─────────────────┐             │
│ │ Pod 2 - 4000    │ │    │ │ Pod 2 - 4100    │             │
│ │ Node + Express  │ │    │ │ Node + Express  │             │
│ │ HTTPS/SSL       │ │    │ │ HTTPS/SSL       │             │
│ └─────────────────┘ │    │ └─────────────────┘             │
└─────────────────────┘    └──────────┬───────────────────────┘
                                      │ HTTPS (proxy interno)
                                      ▼
                          ┌───────────────────────────────────┐
                          │      MICROSERVICIOS               │
                          │   (ClusterIP Services)            │
                          │                                   │
                          │  ┌─────────────────────────────┐  │
                          │  │ auth-service:4010           │  │
                          │  │ (2 réplicas HTTPS)          │  │
                          │  └─────────────────────────────┘  │
                          │                                   │
                          │  ┌─────────────────────────────┐  │
                          │  │ api-service:4020            │  │
                          │  │ (2 réplicas HTTPS)          │  │
                          │  └─────────────────────────────┘  │
                          │                                   │
                          │  ┌─────────────────────────────┐  │
                          │  │ filemanager-service:4030    │  │
                          │  │ (2 réplicas HTTPS)          │  │
                          │  └─────────────────────────────┘  │
                          └───────────────────────────────────┘
```

## Componentes

### Frontend
- **peoplems**: Aplicación React servida con Node.js + Express (HTTPS:4000)
  - Deployment: 2 réplicas
  - Service: ClusterIP puerto 4000
  - Health checks: /index.html (HTTPS)

### API Gateway
- **api-gateway**: Proxy reverso que enruta a microservicios (HTTPS:4100)
  - Deployment: 2 réplicas
  - Service: ClusterIP puerto 4100
  - Health checks: /health (HTTPS)
  - Rutas internas:
    - `/auth/*` → auth-service:4010
    - `/apis/*` → api-service:4020
    - `/doc/*` → api-service:4020
    - `/filemanager/*` → filemanager-service:4030

### Microservicios
- **auth-service**: Servicio de autenticación (HTTPS:4010)
  - Deployment: 2 réplicas
  - Service: ClusterIP puerto 4010
  - Health checks: /health (HTTPS)

- **api-service**: Servicio de APIs (HTTPS:4020)
  - Deployment: 2 réplicas
  - Service: ClusterIP puerto 4020
  - Health checks: /health (HTTPS)

- **filemanager-service**: Gestión de archivos (HTTPS:4030)
  - Deployment: 2 réplicas
  - Service: ClusterIP puerto 4030
  - Health checks: /health (HTTPS)

### Ingress
- **Nginx Ingress Controller**: Enrutamiento basado en paths
  - TLS Secret: peoplek8s-tls (fullchain.pem, privkey.pem)
  - Backend Protocol: HTTPS
  - CORS: Habilitado
  - Rutas:
    - `/` → peoplems-service:4000
    - `/auth` → api-gateway-service:4100
    - `/apis` → api-gateway-service:4100
    - `/doc` → api-gateway-service:4100
    - `/filemanager` → api-gateway-service:4100

## Flujo de Tráfico

1. Usuario → `https://peoplek8s.digitalvs.com/auth`
2. DNS resuelve a IP del Ingress LoadBalancer
3. Ingress Controller analiza el path `/auth`
4. Enruta a `api-gateway-service:4100`
5. Service balancea entre los 2 pods de api-gateway
6. API Gateway proxy la petición a `auth-service:4010`
7. Service de auth balancea entre los 2 pods de auth-service
8. Respuesta vía HTTPS

## Despliegue

```bash
cd /Users/ocarrillo/Documents/peoplek8s/k8s-ingress
./deploy.sh
```

El script automáticamente:

- Construye y sube las imágenes Docker de todos los servicios
- Instala Nginx Ingress Controller (si no existe)
- Crea el secret TLS
- Despliega todos los componentes (peoplems, api-gateway, auth-service, api-service, filemanager-service)

## Acceso

URLs disponibles:

- `https://peoplek8s.digitalvs.com/` → Peoplems (frontend)
- `https://peoplek8s.digitalvs.com/auth` → API Gateway → Auth Service
- `https://peoplek8s.digitalvs.com/apis` → API Gateway → API Service
- `https://peoplek8s.digitalvs.com/doc` → API Gateway → API Service
- `https://peoplek8s.digitalvs.com/filemanager` → API Gateway → FileManager Service

## Configurar DNS

Después del despliegue, obtén la IP:

```bash
kubectl get ingress peoplek8s-ingress
```

Configura un registro A en tu DNS:

```
peoplek8s.digitalvs.com → <IP del Ingress>
```

## Eliminar despliegue

```bash
./undeploy.sh
```

## Ventajas vs LoadBalancer directo

✅ **Un solo punto de entrada** (1 IP pública)
✅ **Enrutamiento por path** (no por puerto)
✅ **Más económico** (~$12/mes, 1 LoadBalancer del Ingress)
✅ **Gestión centralizada de SSL/TLS**
✅ **No requiere Nginx Proxy adicional**
✅ **URLs más limpias** (sin puertos en la URL)
✅ **Escalable** (fácil añadir más microservicios)

## Costos

- Ingress Controller LoadBalancer: ~$12/mes
- **Total: ~$12/mes**

## Logs y Monitoreo

Ver logs de las aplicaciones:

```bash
kubectl logs -l app=peoplems -f
kubectl logs -l app=api-gateway -f
kubectl logs -l app=auth-service -f
kubectl logs -l app=api-service -f
kubectl logs -l app=filemanager-service -f
```

Ver logs del Ingress Controller:

```bash
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller -f
```

## Troubleshooting

Ver estado del Ingress:

```bash
kubectl describe ingress peoplek8s-ingress
```

Ver estado de los deployments:

```bash
kubectl get deployments
kubectl get pods
```

Ver eventos:

```bash
kubectl get events --sort-by=.metadata.creationTimestamp
```

Verificar servicios internos:

```bash
kubectl get services
```
