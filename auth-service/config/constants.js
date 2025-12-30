//================= Constantes de Configuración =============================
export let URL_APP;
export let URL_INTERNO;
export let PUERTO_AUT_SERVICE;
export let PUERTO_AUT_BD_GW;
export let PUERTO_API_BD_GW;
console.log("env", process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case "desarrollo":
    URL_APP = `https://peoplek8s.digitalvs.com`;
    URL_INTERNO = `http://backendapis-service`;
    PUERTO_AUT_SERVICE = 4010;

    PUERTO_AUT_BD_GW = 5020;
    PUERTO_API_BD_GW = 5020;
    break;
}

//========== CORS para dar acceso a la apliacion desde el Backend ===========
export const URL_FRONT_END = `${URL_APP}`;
export const URL_CORS = [URL_FRONT_END];
export const METHODS_COR = "GET,POST,PUT,DELETE,OPTIONS";

//================= URL de Backend BD GW ================================
export const URL_AUT_BD_GW = `${URL_INTERNO}:${PUERTO_AUT_BD_GW}/auth`;
export const URL_API_BD_GW = `${URL_INTERNO}:${PUERTO_API_BD_GW}/api`;

//================= Passport ==================
export const PASSPORT_SESSION = {
  // ========== CONFIGURACIÓN BÁSICA ==========
  secret: process.env.SESSION_SECRET || "peopleSecret01234?DEBUG",
  resave: false,
  saveUninitialized: false,

  // ========== CONFIGURACIÓN DE COOKIES ==========
  cookie: {
    secure: true,          // ✅ Solo HTTPS (tu app usa HTTPS)
    httpOnly: true,        // ✅ No accesible desde JavaScript (protección XSS)
    sameSite: "lax",       // ✅ Protección CSRF pero permite navegación normal
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    domain: ".digitalvs.com",    // ✅ Compartir entre subdominios
    path: "/",
  },

  // ========== CONFIGURACIÓN AVANZADA ==========
  name: "sessionId", // Nombre de la cookie (default: 'connect.sid')
  rolling: true, // Resetear expiración en cada request. En true permite que se reinicie el maxAge desde cada acceso
  proxy: true, // Confiar en proxy (para HTTPS detrás de load balancer)

};

export const PASSPORT_GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${URL_APP}/auth/google/callback`,
  //callbackURL: `${URL_APP}:${PUERTO_ENRUTADOR}/auth/google/callback`,
  //callbackURL: `https://peoplenode.digitalvs.com:5010/auth/google/callback`,
  //passReqToCallback: true,  //Se usa cuando se necesita que a la funcion verify del callback se le pase ademas de los otros parametros, el de req para que pueda verse el user, id, etc.
};

export const PASSPORT_GITHUB_CONFIG = {
  clientID: "Ov23li0tYpBOJnBPCz0J",
  clientSecret: "d733625b493aa0efe224fdaf8a47f81165665d73",
  callbackURL: "https://peoplek8s.digitalvs.com/auth/github/callback",
  //scope: ["user:email"],
};

export const ESTRATEGIA_LOCAL = "local";
export const ESTRATEGIA_GITHUB = "github";
export const ESTRATEGIA_GOOGLE = "google";
export const ESTRATEGIA_FACEBOOK = "facebook";

//================== JWT =================
export const expiracionJWT = `1h`;
