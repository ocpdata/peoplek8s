# Arquitectura de la Aplicación - PeopleK8s

## Descripción General

Aplicación de CRM basada en microservicios desplegada en Kubernetes, con frontend React y múltiples servicios backend especializados.

## Patrón Arquitectónico

**Microservicios en Kubernetes** con API Gateway como punto de entrada único.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cliente / Navegador                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Ingress NGINX (peoplek8s.digitalvs.com)            │
│  - SSL/TLS Termination                                          │
│  - Enrutamiento por path                                        │
│  - CORS, Timeouts, Body Size                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────────┐   ┌─────────────────┐
│   Frontend   │    │   API Gateway    │   │  Static Assets  │
│   (/)        │    │  (:4100)         │   │                 │
└──────────────┘    └────────┬─────────┘   └─────────────────┘
│ Peoplems     │             │ /auth                            │
│ React + Vite │             │ /apis                            │
│ MUI + Toolpad│             │ /doc                             │
│ Port: 4000   │             │ /filemanager                     │
└──────────────┘             │                                  │
                             │ Proxy + JWT Validation
        ┌────────────────────┼────────────────────────┐
        │                    │                        │
        ▼                    ▼                        ▼
┌──────────────┐    ┌──────────────┐      ┌─────────────────┐
│ Auth Service │    │ API Service  │      │ FileManager     │
│   (:4010)    │    │   (:4020)    │      │ Service (:4030) │
└──────┬───────┘    └──────────────┘      └─────────────────┘
       │                                                       
       │ GitHub OAuth                                         
       └──────────────────┐                                   
                          │
                          ▼
                  ┌──────────────┐
                  │    Redis     │
                  │   (:6379)    │
                  │  Sessions    │
                  └──────────────┘
```

## Componentes Principales

### 1. Frontend - Peoplems (Port 4000)

**Tecnología**: React 19 + Vite + Material UI + Toolpad Core

**Descripción**: Aplicación SPA (Single Page Application) que proporciona la interfaz de usuario para el sistema CRM.

**Funcionalidades**:
- Gestión de Contactos
- Gestión de Cuentas
- Gestión de Oportunidades
- Gestión de Cotizaciones
- Dashboard con autenticación OAuth
- File Manager integrado (Syncfusion)

**Dependencias Clave**:
- `@mui/material`, `@mui/x-data-grid`: UI Components
- `@toolpad/core`: Dashboard framework
- `react-router`: Navegación
- `axios`: HTTP client
- `@syncfusion/ej2-react-filemanager`: Gestión de archivos

**Archivos**: `/peoplems`

---

### 2. API Gateway (Port 4100)

**Tecnología**: Express.js + Node.js

**Descripción**: Punto de entrada único (Single Entry Point) para todos los servicios backend. Implementa el patrón Gateway API.

**Responsabilidades**:
- **Proxy Reverso**: Enruta peticiones a los microservicios correspondientes con `maxRedirects: 0` para OAuth
- **Autenticación**: Validación de JWT mediante middleware `requireJwtFromSession`
- **Seguridad**: Gestión de CORS, cookies, y headers de seguridad
- **SSL/TLS**: Configuración HTTPS con certificados
- **OAuth Redirects**: Propaga redirects 302 al navegador para flujos OAuth

**Configuración Crítica**:
```javascript
maxRedirects: 0  // NO seguir redirects - enviarlos al navegador para OAuth
```

**Rutas de Proxy**:
- `/auth/*` → Auth Service (4010)
- `/apis/*` → API Service (4020)
- `/doc/*` → API Service (4020)
- `/filemanager/*` → FileManager Service (4030)

**Middlewares**:
- `requireJwtFromSession`: Validación JWT para rutas protegidas
- `cors`: Configuración CORS
- `cookieParser`: Parseo de cookies
- `express.json`: Parseo de JSON

**Archivos**: `/api-gateway`
 + Passport.js

**Descripción**: Servicio dedicado a la autenticación y autorización de usuarios mediante múltiples estrategias OAuth y local.

**Funcionalidades**:
- **Google OAuth**: Implementación completa de OAuth 2.0 con Google
- **GitHub OAuth**: Implementación de flujo OAuth 2.0 con GitHub
- **Autenticación Local**: Login con email y contraseña
- **Gestión de Sesiones**: Almacenamiento de sesiones y datos de usuario en Redis
- **Generación de Tokens**: JWT para autenticación stateless
- **Validación de Usuarios**: Verificación contra base de datos local

**Estrategias de Autenticación**:
1. **Local**: Valida email/contraseña contra API Service
2. **Google**: OAuth 2.0 con scope `openid`, `profile`, `email`
3. **GitHub**: OAuth 2.0 con scope `profile`

**Rutas**:
- `POST /auth/login`: Login local con credenciales
- `GET /auth/google`: Inicio de flujo OAuth Google
- `GET /auth/google/callback`: Callback de Google OAuth
- `GET /auth/github`: Inicio de flujo OAuth GitHub
- `GET /auth/github/callback`: Callback de GitHub OAuth
- `GET /auth/logout`: Cierre de sesión (retorna JSON con redirectUrl)
- `GET /auth/login/success`: Verificar sesión activa
- `GET /auth/login/failed`: Manejo de fallos en OAuth

**Variables de Entorno Requeridas**:
- `GOOGLE_CLIENT_ID`: Client ID de Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: Client Secret de Google
- `JWT_SECRET`: Secreto para firmar tokens JWT
- `SESSION_SECRET`: Secreto para sesiones de Passport
- `REDIS_HOST`: Host de Redis (default: redis-service)
- `REDIS_PORT`: Puerto de Redis (default: 6379)
- `REDIS_PASSWORD`: Contraseña de Redis

**Archivos**: `/auth-service`

---

### 4. API Service (Port 4020)

**Tecnología**: Express.js + Node.js

**Descripción**: Servicio que contiene la lógica de negocio principal del CRM.

**Funcionalidades**:
- APIs REST para operaciones CRUD
- Lógica de negocio del CRM
- Validaciones y reglas de negocio
- Documentación de APIs

**Endpoints Principales**:
- `/apis/contactos`: Gestión de contactos
- `/apis/cuentas`: Gestión de cuentas
- `/apis/oportunidades`: Gestión de oportunidades
- `/apis/cotizaciones`: Gestión de cotizaciones
- `/doc`: Documentación de APIs

**Archivos**: `/api-service`

---

### 5. FileManager Service (Port 4030)

**Tecnología**: Express.js + Node.js

**Descripción**: Servicio especializado en la gestión de archivos y documentos.

**Funcionalidades**:
- Upload de archivos
- Download de archivos
- Gestión de directorios
- Listado de archivos
- Integración con frontend Syncfusion FileManager

**Rutas**:
- `/filemanager/upload`: Subir archivos
- `/filemanager/download`: Descargar archivos
- `/filemanager/list`: Listar archivos
- `/filemanager/delete`: Eliminar archivos

**Archivos**: `/filemanager-service`

---

### 6. Redis (Port 6379)

**Tecnología**: Redis (In-memory Data Store)

**Descripción**: Base de datos en memoria para cacheo y almacenamiento de sesiones.

**Uso**:
- **Almacenamiento de Sesiones**: Sesiones de usuario con TTL
- **Caché**: Datos temporales y frecuentemente accedidos
- **Tokens**: Almacenamiento temporal de tokens de autenticación

**Configuración**:
- Host: `redis-service` (dentro del cluster K8s)
- Port: 6379
- Password: Configurado vía secrets de Kubernetes

---

## Infraestructura y Despliegue

### Kubernetes

**Recursos**:
- **Deployments**: Uno por cada servicio
- **Services**: ClusterIP para comunicación interna
- **Ingress**: NGINX Ingress Controller para tráfico externo
- **Secrets**: Variables sensibles (JWT_SECRET, REDIS_PASSWORD, etc.)
- **ConfigMaps**: Configuración no sensible

### Skaffold

**Propósito**: Herramienta de desarrollo para Kubernetes que automatiza el ciclo de build-push-deploy.

**Características**:
- **Build**: Construcción automática de imágenes Docker
- **Tag Policy**: Usa git commit para versionar imágenes
- **Hot Reload**: Sincronización de archivos en modo dev
- **Multi-service**: Gestiona todos los microservicios simultáneamente

**Perfiles**:
- **Default**: Build y deploy estándar
- **Dev**: Modo desarrollo con file sync y hot reload

### Docker Registry

- **Registry**: Docker Hub
- **Usuario**: `oacarrillop`
- **Imágenes**:
  - `oacarrillop/peoplems-app`
  - `oacarrillop/api-gateway`
  - `oacarrillop/auth-service`
  - `oacarrillop/api-service`
  - `oacarrillop/filemanager-service`
OAuth (Google/GitHub)

```
Usuario (navegador) → /auth/google
                      ↓
                   API Gateway (proxy con maxRedirects: 0)
                      ↓
                   Auth Service → 302 Redirect a Google OAuth
                      ↓
                   API Gateway devuelve 302 al navegador
                      ↓
Navegador sigue redirect → Google OAuth (usuario autoriza)
                      ↓
Google → 302 Redirect → /auth/google/callback?code=...
                      ↓
                   API Gateway (proxy)
                      ↓
                   Auth Service:
                      - Valida código con Google
                      - Consulta usuario en API Service
                      - Genera JWT
                      - Almacena sesión en Redis
                      ↓
                   Cookie con JWT → Frontend
```

**⚠️ Importante**: El API Gateway usa `maxRedirects: 0` para que los redirects OAuth lleguen al navegador, no se sigan desde el servidor.

### 2. Inicio de Sesión Local

```
Frontend → POST /auth/login {email, password}
           ↓
        API Gateway (proxy)
           ↓
        Auth Service:
           - Valida credenciales en API Service
           - Genera JWT
           - Almacena sesión en Redis
           ↓
        Retorna JWT en cookie + JSON con datos de usuario
```

### 3. Peticiones Autenticadas

```
Frontend → API Gateway
           ↓
        Middleware requireJwtFromSession
           ↓ (valida JWT)
        Si válido → Busca usuario en Redis → Proxy a microservicio
        Si inválido → 401 Unauthorized
```

### 4. Logout

```
Frontend → GET /auth/logout (fetch)
           ↓
        Auth Service:
           - Elimina datos de Redis
           - Limpia cookie JWT
           - Retorna JSON: {success: true, redirectUrl: "/"}
           ↓
        Frontend recibe JSON y hace redirect manualmente
```

**⚠️ Nota**: El logout retorna JSON en lugar de hacer redirect directo para evitar mostrar el JSON en pantalla.                Auth Service (genera JWT)
                      ↓
                   Almacena sesión en Redis
                      ↓
                   Cookie con JWT → Frontend
```

### 2. Peticiones Autenticadas

```
Frontend → API Gateway
           ↓
        Middleware requireJwtFromSession
           ↓ (valida JWT)
        Si válido → Proxy a microservicio
        Si inválido → 401 Unauthorized
```

### 3. Verificación de Sesión

```
API Gateway → Redis (busca sesión por JWT)
              ↓
           Si existe → Continúa
           Si no existe → 401 Unauthorized
```

---
 almacenados en cookies HTTP-only
3. **CORS**: Configurado para permitir solo el dominio de la aplicación
4. **Secrets**: Variables sensibles en Kubernetes Secrets
5. **OAuth 2.0**: Autenticación delegada a Google y GitHub
6. **Middleware**: Validación en cada petición al API Gateway
7. **Redis**: Almacenamiento seguro de sesiones y datos de usuario

### Best Practices Implementadas

- Secrets no versionados en git
- HTTPS forzado en todas las rutas
- Validación de JWT en cada petición
- Sesiones con TTL en Redis (24 horas)
- CORS restrictivo
- Body size limitado (50MB)
- Cookies HTTP-only con dominio `.digitalvs.com`
- OAuth redirects manejados correctamente (maxRedirects: 0 en API Gateway)
- Tokens JWT con expiración de 1 horato de Redis (default: 6379)
- `REDIS_PASSWORD`: Contraseña de Redis (generada automáticamente)

### Certificados TLS

- **Secret**: `peoplek8s-tls`
- **Archivos**:
  - `fullchain.pem`: Certificado completo
  - `privkey.pem`: Clave privada

---

## Comunicación entre Servicios

### Interna (dentro del cluster)

Los servicios se comunican mediante DNS de Kubernetes:

```
api-gateway-service:4100
auth-service:4200
api-service:4300
filemanager-service:4400
redis-service:6379
peoplems-service:4000
```

### Externa (desde fuera del cluster)

Todo el tráfico externo pasa por:
```
Internet → Ingress NGINX → Services
```

---

## Seguridad

### Capas de Seguridad

1. **TLS/SSL**: Todo el tráfico externo es HTTPS
2. **JWT**: Tokens para autenticación stateless
3. **CORS**: Configurado para permitir solo el dominio de la aplicación
4. **Secrets**: Variables sensibles en Kubernetes Secrets
5. **OAuth**: Autenticación delegada a GitHub
6. **Middleware**: Validación en cada petición al API Gateway

### Best Practices Implementadas

- Secrets no versionados en git
- HTTPS forzado en todas las rutas
- Validación de JWT en cada petición
- Sesiones con TTL en Redis
- CORS restrictivo
- Body size limitado

---

## Comandos Útiles

### Desarrollo Local

```bash
# Iniciar desarrollo con Skaffold
skaffold dev

# Build y deploy
skaffold run

# Limpiar recursos
skaffold delete
```

### Despliegue en Kubernetes

```bash
# Deploy manual
cd k8s-ingress
./deploy.sh

# Undeploy
./undeploy.sh
```

### Verificación

```bash
# Ver pods
kubectl get pods

# Ver services
kubectl get services

# Ver ingress
kubectl get ingress

# Logs de un pod
kubectl logs <pod-name>

# Describir un pod
kubectl describe pod <pod-name>
```

---

## Estructura de Directorios

```
k8s/
├── skaffold.yaml                 # Configuración de Skaffold
├── api-gateway/                  # API Gateway service
│   ├── index.js                  # Entry point
│   ├── config/constants.js       # Constantes
│   └── middlewares/              # Middlewares de autenticación
├── auth-service/                 # Authentication service
│   ├── index.js                  # Entry point
│   ├── routes/github.js          # Rutas de OAuth GitHub
│   └── middlewares/github.js     # Middleware de GitHub
├── api-service/                  # API service (lógica de negocio)
│   ├── index.js                  # Entry point
│   └oblemas Comunes y Soluciones

### Google OAuth Error 400

**Problema**: Error "400. That's an error. Your client has issued a malformed or illegal request."

**Soluciones**:
1. Verificar que la callback URL en Google Cloud Console sea **exactamente**: `https://peoplek8s.digitalvs.com/auth/google/callback`
2. Asegurar que el API Gateway tenga `maxRedirects: 0` para enviar redirects al navegador
3. Verificar que las APIs estén habilitadas en Google Cloud Console (People API)
4. Si la app está en "Testing", agregar el email a "Test users" o cambiar a "In production"
5. Esperar 5-10 minutos después de cambios en Google Console para propagación

### Logout Muestra JSON en Navegador

**Problema**: Al hacer logout, aparece `{"success":true,"message":"Logout successful"...}` en pantalla

**Solución**: El frontend debe usar `fetch()` en lugar de `window.open()` para manejar la respuesta JSON y hacer redirect manual.

### Redis Connection Error en Auth Service

**Problema**: `Error: connect ECONNREFUSED` o `NOAUTH Authentication required`

**Solución**: Verificar que el deployment de auth-service tenga las variables de entorno de Redis:
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

## Próximos Pasos / Mejoras Potenciales

- [ ] Implementar logging centralizado (ELK Stack)
- [ ] Agregar monitoring (Prometheus + Grafana)
- [ ] Implementar circuit breakers
- [ ] Agregar API rate limiting
- [ ] Implementar health checks avanzados
- [ ] Agregar tests (unitarios, integración, e2e)
- [ ] Implementar CI/CD pipeline completo
- [ ] Agregar database service (PostgreSQL/MongoDB)
- [ ] Implementar message queue (RabbitMQ/Kafka)
- [ ] Agregar backup automático
- [ ] Configurar Facebook OAuth
- [ ] Implementar refresh tokens para JWT   # Ingress
│   ├── deploy.sh                 # Script de deploy
│   └── undeploy.sh               # Script de undeploy
└── documentacion/                # Documentación
    └── README.md                 # Este archivo
```

---

## Tecnologías Utilizadas

### Frontend
- React 19
- Vite
- Material UI (MUI)
- Toolpad Core
- React Router
- Axios
- Syncfusion FileManager

### Backend
- Node.js
- Express.js
- Redis
- JWT (JSON Web Tokens)
- OAuth 2.0 (GitHub)

### Infraestructura
- Kubernetes
- Docker
- Skaffold
- NGINX Ingress Controller
- Docker Hub

### Desarrollo
- Git
- npm/yarn
- ESLint
- Vite HMR

---

## Próximos Pasos / Mejoras Potenciales

- [ ] Implementar logging centralizado (ELK Stack)
- [ ] Agregar monitoring (Prometheus + Grafana)
- [ ] Implementar circuit breakers
- [ ] Agregar API rate limiting
- [ ] Implementar health checks avanzados
- [ ] Agregar tests (unitarios, integración, e2e)
- [ ] Implementar CI/CD pipeline completo
- [ ] Agregar database service (PostgreSQL/MongoDB)
- [ ] Implementar message queue (RabbitMQ/Kafka)
- [ ] Agregar backup automático

---

## Contacto y Mantenimiento

**Dominio**: peoplek8s.digitalvs.com  
**Registry**: Docker Hub (oacarrillop)  
**Última actualización**: 26 de diciembre de 2025
