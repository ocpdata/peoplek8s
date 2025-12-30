import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileManagerRouter } from "./routes/filemanager.js";
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

// Middleware para obtener datos de usuario desde Redis
app.use(async (req, res, next) => {
  try {
    // Intentar obtener el token JWT de las cookies o headers
    const token = 
      req.cookies?.jwt ||
      req.headers.authorization?.replace('Bearer ', '') ||
      req.query.token;
    
    if (token) {
      // Obtener datos del usuario desde Redis usando el token como clave
      const userData = await redis.get(`user:${token}`);
      
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

app.use(
  cors({
    origin: constantes.URL_CORS,
    methods: constantes.METHODS_COR,
    credentials: true,
  })
);

//=========== Rutas ================
app.use("/filemanager", fileManagerRouter);

//=========== Inicializa el servidor HTTP (comunicación interna en Kubernetes) ================
app.listen(constantes.PUERTO_FILEMANAGER_SERVICE, () => {
  console.log(
    `📁 FileManager Service (HTTP) running on port ${constantes.PUERTO_FILEMANAGER_SERVICE}`
  );
});
