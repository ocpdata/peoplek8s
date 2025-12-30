import session from "express-session";
import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { loginRouter } from "./routes/rutasAuth.js";

//=========== Constantes ================
import * as constantes from "./config/constants.js";

//=========== Inicializa Express ================
const app = express();

//=========== Middlewares ================

// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para parsear JSON en req.body
app.use(express.json());

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));

//Establecimiento de la sesion que usa Passport
app.use(session(constantes.PASSPORT_SESSION));

import "./middlewares/mw-auth.js";

// Inicialización de la sesión que usa passport
app.use(passport.initialize());

// Middleware para validar la sesión con el navegador usando la estrategia integrada de passport "session"
app.use(passport.session());

//=========== CORS (Cross-Origin Resource Sharing) ================
// Configura CORS para permitir peticiones desde el frontend
app.use(
  cors({
    origin: constantes.URL_CORS, // URL permitida para hacer peticiones (frontend)
    methods: constantes.METHODS_COR, // Métodos HTTP permitidos (GET, POST, PUT, DELETE, OPTIONS)
    credentials: true, // Permite envío de cookies y credenciales
    allowedHeaders: [
      // Headers que el cliente puede enviar en las peticiones
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Requested-With",
      "Origin",
      "Access-Control-Allow-Credentials",
      "Cache-Control",
      "Pragma",
    ],
    exposedHeaders: ["Set-Cookie"], // Headers que el cliente puede leer de la respuesta
    optionsSuccessStatus: 200, // Código de respuesta para peticiones OPTIONS exitosas (preflight)
  })
);

//=========== INTERCEPTOR DE TODAS LAS PETICIONES ================
app.use("*", (req, res, next) => {
  console.log("🚨🚨🚨 PETICIÓN INTERCEPTADA EN AUTH GATEWAY, ANTES DE RUTAS 🚨🚨🚨");
  console.log(`Método: ${req.method}, URL: ${req.originalUrl}, IP: ${req.ip}, body: ${JSON.stringify(req.body)}`);

  next();
});

//=========== Rutas ================
// Solo rutas de autenticación en este microservicio
app.use("/auth", loginRouter);

//=========== Inicializa el servidor HTTP (comunicación interna en Kubernetes) ================
app.listen(constantes.PUERTO_AUT_SERVICE, () => {
  console.log(`🔐 Auth Service (HTTP) running on port ${constantes.PUERTO_AUT_SERVICE}`);
});
