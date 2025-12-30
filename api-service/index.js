import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/rutasApis.js";
import Redis from "ioredis";

//=========== Constantes ================
import * as constantes from "./config/constants.js";

//=========== Redis ================
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected in API Service');
});

// Exportar redis para usar en rutas
export { redis };

//=========== Inicializa Express ================
const app = express();

//=========== Middlewares ================

// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para parsear JSON en req.body
app.use(express.json());

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));

// Middleware para obtener datos de usuario desde Redis
app.use(async (req, res, next) => {
  console.log("🔐 Middleware: obteniendo datos de usuario desde Redis");
  try {
    // Intentar obtener el token JWT de las cookies o headers
    console.log('🔍 Buscando jwtToken en cookies y headers');
    const jwtToken = 
      req.cookies?.jwt ||
      req.headers.authorization?.replace('Bearer ', '') ||
      req.query.token;
    console.log('🔍 jwtToken encontrado:', jwtToken);
    
    if (jwtToken) {
      // Obtener datos del usuario desde Redis usando el token como clave
      const userData = await redis.get(`user:${jwtToken}`);
      console.log('🔍 Datos de usuario desde Redis:', userData);
      
      if (userData) {
        req.user = JSON.parse(userData);
        console.log('✅ Usuario obtenido desde Redis:', req.user);
      } else {
        console.log('⚠️ No se encontraron datos de usuario en Redis');
      }
    }
  } catch (error) {
    console.error('❌ Error obteniendo usuario desde Redis:', error);
  }
  
  next();
});

//=========== CORS ================
app.use(
  cors({
    origin: constantes.URL_CORS,
    methods: constantes.METHODS_COR,
    credentials: true,
  })
);

//=========== Rutas ================
// Solo rutas de apis en este microservicio
app.use("/apis", apiRouter);

//=========== Inicializa el servidor HTTP (comunicación interna en Kubernetes) ================
app.listen(constantes.PUERTO_API_SERVICE, () => {
  console.log(
    `📊 API Service (HTTP) running on port ${constantes.PUERTO_API_SERVICE}`
  );
});
