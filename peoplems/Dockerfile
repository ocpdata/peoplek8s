# Stage 1: Build con Node
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación Vite
RUN npm run build

# Stage 2: Servir con Node y HTTPS
FROM node:20-alpine

WORKDIR /app

# Instalar Express para servir con HTTPS
RUN npm init -y && npm install express

# Copiar los archivos construidos
COPY --from=builder /app/dist ./dist

# Copiar certificados SSL
COPY certificados/fullchain.pem ./ssl/fullchain.pem
COPY certificados/privkey.pem ./ssl/privkey.pem

# Copiar servidor HTTPS
COPY server.js ./server.js

# Exponer puerto HTTPS
EXPOSE 4000

# Iniciar servidor
CMD ["node", "server.js"]