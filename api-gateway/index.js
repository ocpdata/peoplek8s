import express from "express";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";
import Redis from "ioredis";

//===========. Certificado =============
import { credenciales } from "./certificados.js";
import https from "https";

//============ Validacion
import { validarJWT } from "./middlewares/localAuthMiddleware.js";

//=========== Constantes ================
import * as constantes from "./config/constants.js";

// Crea una instancia de la aplicación Express
const app = express();

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

//============ Middlewares ===============
// Parsea el cuerpo de las peticiones con formato JSON automáticamente
app.use(express.json());

// Configura CORS (Cross-Origin Resource Sharing) para permitir peticiones desde el frontend
app.use(
  cors({
    origin: constantes.URL_APP, // Solo permite peticiones desde la URL de la aplicación
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Métodos HTTP permitidos
    credentials: true, // Permite enviar cookies y credenciales en las peticiones
    allowedHeaders: [
      // Headers que el cliente puede enviar
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Requested-With",
      "Origin",
      "Access-Control-Allow-Credentials",
      "Cache-Control",
      "Pragma",
    ],
    exposedHeaders: ["Set-Cookie"], // Permite que el cliente acceda al header Set-Cookie
    optionsSuccessStatus: 200, // Código de respuesta para peticiones OPTIONS exitosas
  })
);

// Parsea las cookies de las peticiones entrantes y las hace accesibles en req.cookies
app.use(cookieParser());

//=========== INTERCEPTOR DE TODAS LAS PETICIONES ================
app.use("*", (req, res, next) => {
  console.log("🚨🚨🚨 PETICIÓN INTERCEPTADA EN API GATEWAY, ANTES DE RUTAS 🚨🚨🚨");
  console.log(`Método: ${req.method}, URL: ${req.originalUrl}, IP: ${req.ip}, body: ${JSON.stringify(req.body)}`);

  if (req.method === "OPTIONS") {
    console.log("💥💥💥 ¡ESTO ES UNA PETICIÓN OPTIONS! 💥💥💥");
    console.log("💥 Si ves esto, las OPTIONS sí llegan a Node.js");
  }

  next();
});

//=========== Función Proxy ================
/**
 * Función proxy que redirige peticiones HTTP a los microservicios internos
 * Actúa como intermediario transparente manteniendo headers, cookies y códigos de estado
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {string} targetUrl - URL base del servicio destino (ej: http://auth-service:4010)
 */
async function proxyRequest(req, res, targetUrl) {
  console.log("proxyRequest", req.originalUrl, req.body, req.user, req.userFromRedis);
  try {
    // Configuración de la petición a reenviar al microservicio
    const config = {
      method: req.method, // Mantiene el método HTTP original (GET, POST, PUT, DELETE, etc.)
      url: targetUrl + req.originalUrl, // URL completa: servicio + ruta original
      data: req.body, // Cuerpo de la petición (para POST, PUT, etc.)
      headers: {
        ...req.headers, // Copia todos los headers de la petición original
        host: undefined, // Elimina el header host original para evitar conflictos
      },
      maxRedirects: 0, // NO seguir redirects automáticamente - los envía al cliente
      validateStatus: function (status) {
        return status < 500; // Acepta cualquier código < 500 como respuesta válida
      },
    };

    // Realiza la petición HTTP al microservicio usando axios
    const response = await axios(config);

    // Copia todos los headers de la respuesta del microservicio al cliente
    Object.keys(response.headers).forEach((key) => {
      res.set(key, response.headers[key]);
    });

    // Envía la respuesta al cliente con el mismo código de estado y datos
    res.status(response.status).send(response.data);
  } catch (error) {
    // Manejo de errores cuando el microservicio no está disponible o falla
    console.error(`Error proxying to ${targetUrl}${req.originalUrl}:`, error.message);
    res.status(500).json({
      error: "Service unavailable",
      service: targetUrl,
      message: error.message,
    });
  }
}

//=========== DEFINICIÓN DE RUTAS DEL GATEWAY ================

// Ruta: /auth/* - Servicio de Autenticación
// Maneja login, logout, registro y validación de tokens
// No requiere autenticación previa (acceso público)
app.use("/auth/*", validarJWT, (req, res) => {
  proxyRequest(req, res, constantes.services.auth);
});

// Ruta: /apis/* - Servicio de APIs
// Requiere autenticación JWT válida mediante el middleware validarJWT
// Maneja todas las operaciones de negocio protegidas
app.use("/apis/*", validarJWT, (req, res) => {
  proxyRequest(req, res, constantes.services.api);
});

// Ruta: /filemanager/* - Servicio de Gestión de Archivos
// Maneja subida, descarga y gestión de archivos
app.use("/filemanager/*", (req, res) => {
  proxyRequest(req, res, constantes.services.filemanager);
});

// Manejo de rutas no encontradas (404)
// Debe ir al final para capturar todas las rutas no definidas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

//=========== CONFIGURACIÓN E INICIO DEL SERVIDOR HTTPS ================

// Crea el servidor HTTPS con los certificados SSL/TLS
// credenciales contiene: { key: privkey.pem, cert: fullchain.pem }
const httpsServer = https.createServer(credenciales, app);

// Inicia el servidor HTTPS en el puerto especificado
// El servidor escucha peticiones HTTPS en constantes.PUERTO_SERVICIO (default: 4100)
httpsServer.listen(constantes.PUERTO_SERVICIO, () => {
  console.log(
    `📊 API Gateway (HTTPS) ejecutándose en el puerto ${constantes.PUERTO_SERVICIO}`
  );
});
