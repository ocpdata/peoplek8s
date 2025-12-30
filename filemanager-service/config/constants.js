//import dotenv from "dotenv";

//dotenv.config();

export let URL_APP;
export let URL_INTERNO;
export let PUERTO_FRONT_END;
export let PUERTO_ENRUTADOR;
export let PUERTO_AUT_SERVICE;
export let PUERTO_API_SERVICE;
export let PUERTO_FILEMANAGER_SERVICE;
export let PUERTO_AUT_BD_GW;
export let PUERTO_API_BD_GW;
export let PUERTO_FM_BD_GW;
//console.log("env", process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case "desarrollo":
    URL_APP = `https://peoplek8s.digitalvs.com`;
    URL_INTERNO = `https://peoplenode.digitalvs.com`;
    PUERTO_FRONT_END = 4000;
    PUERTO_ENRUTADOR = 4100;
    PUERTO_AUT_SERVICE = 4010;
    PUERTO_API_SERVICE = 4020;
    PUERTO_FILEMANAGER_SERVICE = 4030;
    PUERTO_AUT_BD_GW = 5020;
    PUERTO_API_BD_GW = 5020;
    //PUERTO_AUT_BD_GW = 3050;
    //PUERTO_API_BD_GW = 3060;
    PUERTO_FM_BD_GW = 8090;
    break;
  case "produccionAccessQ":
    URL_APP = `https://test01.accessq.com.mx`;
    PUERTO_FRONT_END = 5000;
    PUERTO_CLIENT_APP = 5010;
    PUERTO_API_GATEWAY = 5020;
    PUERTO_API_FILEMANAGER = 8090;
    break;
  case "produccionDigitalVS":
    URL_APP = `https://test01.digitalvs.com`;
    PUERTO_FRONT_END = 5000;
    PUERTO_CLIENT_APP = 5010;
    PUERTO_API_GATEWAY = 5020;
    PUERTO_API_FILEMANAGER = 8090;
    break;
}

//========== CORS para dar acceso a la apliacion desde el Backend ===========
export const URL_FRONT_END = `${URL_APP}:${PUERTO_FRONT_END}`;
export const URL_ENRUTADOR = `${URL_INTERNO}:${PUERTO_ENRUTADOR}`;
export const URL_CORS = `${URL_INTERNO}:${PUERTO_ENRUTADOR}`;
export const METHODS_COR = "GET,POST,PUT,DELETE,OPTIONS";

//========== URL de  Backend Services ==========
export const URL_AUT_SERVICE = `${URL_INTERNO}:${PUERTO_AUT_SERVICE}`;
export const URL_API_SERVICE = `${URL_INTERNO}:${PUERTO_API_SERVICE}`;
export const URL_FILEMANAGER_SERVICE = `${URL_INTERNO}:${PUERTO_FILEMANAGER_SERVICE}`;

//================= URL de Backend BD GW ================================
export const URL_AUT_BD_GW = `${URL_INTERNO}:${PUERTO_AUT_BD_GW}/auth`;
export const URL_API_BD_GW = `${URL_INTERNO}:${PUERTO_API_BD_GW}/api`;
//export const URL_LOGIN_SUCCESS = `${PREFIJO_URL_API}/auth/login/success`;
export const URL_FM_BD_GW = `${URL_INTERNO}:${PUERTO_FM_BD_GW}`;

//================= Passport ==================
export const PASSPORT_SESSION = {
  // ========== CONFIGURACIÓN BÁSICA ==========
  secret: process.env.SESSION_SECRET || "peopleSecret01234?DEBUG",
  resave: false,
  saveUninitialized: false,

  /*// ========== CONFIGURACIÓN DE COOKIES ==========
  cookie: {
    // Seguridad
    secure: true,           // Solo HTTPS (cambiar a false para desarrollo HTTP)
    httpOnly: true,         // No accesible desde JavaScript del cliente
    sameSite: 'strict',     // Protección CSRF ('strict', 'lax', 'none')
    
    // Tiempo de vida
    maxAge: 24 * 60 * 60 * 1000,  // 24 horas en milisegundos
    // expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Alternativa a maxAge
    
    // Dominio y path
    domain: '.digitalvs.com',  // Para subdominios
    path: '/',                 // Path donde es válida la cookie
  },*/
  cookie: {
    secure: false, // TEMPORAL: Cambiar a false para debugging
    httpOnly: false,
    sameSite: "lax", // TEMPORAL: Cambiar a lax para debugging
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    domain: undefined, // Permitir que funcione en cualquier dominio
    path: "/",
  },
  //httpOnly hace que la cookie no se envie desde codigo javascript en el user agent

  // ========== CONFIGURACIÓN AVANZADA ==========
  name: "sessionId", // Nombre de la cookie (default: 'connect.sid')
  rolling: true, // Resetear expiración en cada request. En true permite que se reinicie el maxAge desde cada acceso
  proxy: true, // Confiar en proxy (para HTTPS detrás de load balancer)

  // ========== ALMACÉN DE SESIONES ==========
  // store: new MongoStore({ mongoUrl: 'mongodb://localhost/sessions' })
};

export const PASSPORT_GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${URL_APP}:${PUERTO_ENRUTADOR}/auth/google/callback`,
  //callbackURL: `https://peoplenode.digitalvs.com:5010/auth/google/callback`,
  //passReqToCallback: true,  //Se usa cuando se necesita que a la funcion verify del callback se le pase ademas de los otros parametros, el de req para que pueda verse el user, id, etc.
};

export const PASSPORT_GITHUB_CONFIG = {
  clientID: "Ov23li0tYpBOJnBPCz0J",
  clientSecret: "d733625b493aa0efe224fdaf8a47f81165665d73",
  callbackURL: "http://peoplenode.digitalvs.com:5010/auth/github/callback",
  //scope: ["user:email"],
};

export const ESTRATEGIA_LOCAL = "local";
export const ESTRATEGIA_GITHUB = "github";
export const ESTRATEGIA_GOOGLE = "google";
export const ESTRATEGIA_FACEBOOK = "facebook";

//================== JWT =================
export const expiracionJWT = `1h`;
