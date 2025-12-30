import express from "express";
import cors from "cors";

import Redis from "ioredis";
import sequelize from "./database/database.js";

import { cuentasRouter } from "./routes/cuentas.js";
import { contactosRouter } from "./routes/contactos.js";
import { oportunidadesRouter } from "./routes/oportunidades.js";
import { usuariosRouter } from "./routes/usuarios.js";
import { registrosFabricantesRouter } from "./routes/registrosFabricantes.js";
import { cotizacionesRouter } from "./routes/cotizaciones.js";
import { configuracionRouter } from "./routes/configuracion.js";
import { fabricantesRouter } from "./routes/fabricantes.js";
import { postventaRouter } from "./routes/postventa.js";
import { iaRouter } from "./routes/ia.js";

import { validacionTokenApiKey } from "./middlewares/autenticacionMiddleware.js";

//=========== Constantes ================
import * as constantes from "./config/constants.js";

//=========== Inicializa Express ================
const app = express();

//=========== Redis ================
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("✅ Redis connected in API Service");
});

//=========== CORS ================
app.use(
  cors({
    origin: constantes.CORS,
    //origin: CLIENT_URL_CORS,
    methods: constantes.METHODS_COR,
    credentials: true,
  })
);

app.use(express.json());

//=========== Validaciòn de la conexión a la base de datos ================
async function conectarDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
conectarDB();

//=========== Sincroniza la base de datos ================
sequelize.sync();

//=========== Visibilidad de las requests para debug ============
app.use((req, res, next) => {
  console.log("=== REQUEST DEBUG EN BACKEND API ===");
  console.log(
    `🌐 CORS Request: ${req.method} ${req.url} from origin: ${req.headers.origin}`
  );

  console.log("=== END DEBUG ===");
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
app.use("/api/cuentas", validacionTokenApiKey, cuentasRouter);
app.use("/api/contactos", validacionTokenApiKey, contactosRouter);
app.use("/api/oportunidades", validacionTokenApiKey, oportunidadesRouter);
app.use("/api/usuarios", validacionTokenApiKey, usuariosRouter);
app.use(
  "/api/registrosFabricantes",
  validacionTokenApiKey,
  registrosFabricantesRouter
);
app.use("/api/cotizaciones", validacionTokenApiKey, cotizacionesRouter);
app.use("/api/configuracion", validacionTokenApiKey, configuracionRouter);
app.use("/api/fabricantes", validacionTokenApiKey, fabricantesRouter);
app.use("/api/postventa", validacionTokenApiKey, postventaRouter);
app.use("/api/ia", validacionTokenApiKey, iaRouter);

//=========== Inicializa el servidor ================
app.listen(constantes.PUERTO_BACKENDAPI, () => {
  console.log(
    `Servidor Backend API activo en puerto ${constantes.PUERTO_BACKENDAPI}`
  );
});
